import { ArrowLeft, Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { useMemo, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { Logo } from "./Logo";
import { API_BASE_URL, CURRENT_ORIGIN } from "../utils/api";

export default function AuthPage({ onNavigate, onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isSettingPassword, setIsSettingPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [requiresGooglePasswordSetup, setRequiresGooglePasswordSetup] =
    useState(false);
  const [passwordSetupToken, setPasswordSetupToken] = useState("");
  const [passwordSetup, setPasswordSetup] = useState({
    password: "",
    confirmPassword: "",
  });
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    loginPassword: false,
    signupPassword: false,
    signupConfirmPassword: false,
    setupPassword: false,
    setupConfirmPassword: false,
  });
  const hasGoogleClientId = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);
  const isBusy = isLoading || isGoogleLoading || isSettingPassword;

  const submitLabel = useMemo(
    () => (isBusy ? "Please wait..." : isLogin ? "Log In" : "Create Account"),
    [isBusy, isLogin]
  );

  const goHome = () => {
    if (typeof onAuthSuccess === "function") {
      onAuthSuccess();
      return;
    }
    if (typeof onNavigate === "function") {
      onNavigate("home");
    }
  };

  const handleModeSwitch = (nextIsLogin) => {
    setIsLogin(nextIsLogin);
    setError("");
    setSuccess("");
    setRequiresGooglePasswordSetup(false);
    setPasswordSetupToken("");
    setPasswordSetup({ password: "", confirmPassword: "" });
    setShowPasswords({
      loginPassword: false,
      signupPassword: false,
      signupConfirmPassword: false,
      setupPassword: false,
      setupConfirmPassword: false,
    });
    setForm((prev) => ({
      ...prev,
      password: "",
      confirmPassword: "",
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSetPassword = async () => {
    setError("");
    setSuccess("");

    if (!passwordSetup.password || !passwordSetup.confirmPassword) {
      setError("Please enter and confirm your new password.");
      return;
    }

    if (passwordSetup.password !== passwordSetup.confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    if (passwordSetup.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    const token = passwordSetupToken || localStorage.getItem("token");
    if (!token) {
      setError("Please verify with Google first.");
      return;
    }

    try {
      setIsSettingPassword(true);
      const response = await fetch(`${API_BASE_URL}/auth/set-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password: passwordSetup.password }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.message || data?.msg || "Failed to set password.");
      }

      setRequiresGooglePasswordSetup(false);
      setPasswordSetupToken("");
      setPasswordSetup({ password: "", confirmPassword: "" });
      setSuccess(
        "Password set successfully. You can now use email and password login for this account."
      );
    } catch (err) {
      if (err?.message === "Failed to fetch") {
        setError(
          `Unable to reach server. Check backend is running and reachable at ${API_BASE_URL}.`
        );
      } else {
        setError(err?.message || "Failed to set password.");
      }
    } finally {
      setIsSettingPassword(false);
    }
  };

  const handleGoogleAuth = async (credentialResponse) => {
    const credential = credentialResponse?.credential;
    if (!credential) {
      setError("Google authentication failed. Please try again.");
      return;
    }

    setError("");
    setSuccess("");

    try {
      setIsGoogleLoading(true);
      const response = await fetch(`${API_BASE_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credential }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data?.message || data?.msg || "Google authentication failed."
        );
      }

      if (!data?.token) {
        throw new Error("No token received from Google authentication.");
      }

      localStorage.setItem("token", data.token);

      if (requiresGooglePasswordSetup) {
        setPasswordSetupToken(data.token);
        setSuccess(
          "Google verified. Set your new password below to enable email login."
        );
        return;
      }

      setSuccess(isLogin ? "Login successful." : "Signup successful.");
      goHome();
    } catch (err) {
      if (err?.message === "Failed to fetch") {
        setError(
          `Unable to reach server. Check backend is running and reachable at ${API_BASE_URL}.`
        );
      } else {
        setError(err?.message || "Google authentication failed. Please try again.");
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.email || !form.password) {
      setError("Email and password are required.");
      return;
    }

    if (!isLogin && !form.firstName.trim()) {
      setError("First name is required for signup.");
      return;
    }

    if (!isLogin && !form.lastName.trim()) {
      setError("Last name is required for signup.");
      return;
    }

    if (!isLogin && form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const endpoint = isLogin ? "/auth/login" : "/auth/signup";
    const payload = isLogin
      ? { email: form.email.trim(), password: form.password }
      : {
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim(),
          password: form.password,
        };

    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (isLogin && data?.code === "GOOGLE_ONLY_ACCOUNT") {
          setRequiresGooglePasswordSetup(true);
        }
        throw new Error(data?.message || data?.msg || "Authentication failed.");
      }

      if (data?.token) {
        localStorage.setItem("token", data.token);
        setSuccess(isLogin ? "Login successful." : "Signup successful.");
        goHome();
        return;
      }

      if (!isLogin) {
        setSuccess("Account created. Please log in.");
        handleModeSwitch(true);
        return;
      }

      setError("No token received from server.");
    } catch (err) {
      if (err?.message === "Failed to fetch") {
        setError(
          `Unable to reach server. Check backend is running and reachable at ${API_BASE_URL}.`
        );
      } else {
        setError(err?.message || "Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-amber-50 via-orange-50 to-white px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <button
          onClick={goHome}
          className="inline-flex items-center gap-2 rounded-lg border border-amber-200 bg-white px-4 py-2 text-sm font-medium text-amber-700 hover:bg-amber-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </button>

        <div className="mt-4 overflow-hidden rounded-3xl border border-amber-100 bg-white shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="hidden bg-gradient-to-br from-amber-700 to-orange-600 p-10 text-white lg:block">
              <Logo className="mb-8" />
              <h2 className="text-3xl font-bold leading-tight">
                Welcome Back to
                <br />
                Furnito
              </h2>
              <p className="mt-4 max-w-md text-amber-50/95">
                Sign in to track your orders, save your favorite furniture, and
                get personalized recommendations for your home.
              </p>
              <div className="mt-8 space-y-3 text-sm text-amber-50/90">
                <p>Premium collections. Trusted quality. Faster checkout.</p>
                <p>Designed to match the Furnito experience on every screen.</p>
              </div>
            </div>

            <div className="p-6 sm:p-8 lg:p-10">
              <div className="mx-auto w-full max-w-md">
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                    {isLogin ? "Log In" : "Create Account"}
                  </h1>
                  <p className="mt-2 text-sm text-gray-600">
                    {isLogin
                      ? "Access your Furnito account."
                      : "Join Furnito and start your design journey."}
                  </p>
                </div>

                <div className="mb-6 grid grid-cols-2 rounded-xl bg-amber-50 p-1">
                  <button
                    type="button"
                    onClick={() => handleModeSwitch(true)}
                    disabled={isBusy}
                    className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                      isLogin
                        ? "bg-white text-amber-700 shadow-sm"
                        : "text-amber-700/80 hover:text-amber-700"
                    } disabled:cursor-not-allowed disabled:opacity-70`}
                  >
                    Log In
                  </button>
                  <button
                    type="button"
                    onClick={() => handleModeSwitch(false)}
                    disabled={isBusy}
                    className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                      !isLogin
                        ? "bg-white text-amber-700 shadow-sm"
                        : "text-amber-700/80 hover:text-amber-700"
                    } disabled:cursor-not-allowed disabled:opacity-70`}
                  >
                    Sign Up
                  </button>
                </div>

                {hasGoogleClientId && (
                  <div className="mb-6 space-y-3">
                    <div className="flex justify-center rounded-xl border border-amber-100 bg-amber-50/60 p-3">
                      <GoogleLogin
                        onSuccess={handleGoogleAuth}
                        onError={() =>
                          setError(
                            CURRENT_ORIGIN
                              ? `Google authentication failed. Add ${CURRENT_ORIGIN} to Authorized JavaScript origins in Google Cloud Console.`
                              : "Google authentication was cancelled or failed. Please try again."
                          )
                        }
                        text={isLogin ? "signin_with" : "signup_with"}
                        theme="outline"
                        shape="pill"
                        size="large"
                      />
                    </div>
                    {isGoogleLoading && (
                      <p className="text-center text-xs text-amber-700">
                        Signing you in with Google...
                      </p>
                    )}
                    <div className="relative text-center">
                      <span className="bg-white px-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400">
                        or continue with email
                      </span>
                      <div className="absolute inset-x-0 top-1/2 -z-10 h-px -translate-y-1/2 bg-gray-200" />
                    </div>
                  </div>
                )}

                {requiresGooglePasswordSetup && (
                  <div className="mb-6 space-y-4 rounded-xl border border-amber-200 bg-amber-50/80 p-4">
                    <p className="text-sm font-semibold text-amber-800">
                      This account was created using Google.
                    </p>
                    <p className="text-xs text-amber-700">
                      First verify with Google above, then set a password below
                      so you can log in with email/password next time.
                    </p>

                    <label className="block">
                      <span className="mb-1 block text-sm font-medium text-gray-700">
                        New Password
                      </span>
                      <div className="relative">
                        <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                          type={showPasswords.setupPassword ? "text" : "password"}
                          value={passwordSetup.password}
                          onChange={(e) =>
                            setPasswordSetup((prev) => ({
                              ...prev,
                              password: e.target.value,
                            }))
                          }
                          className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-11 text-sm text-gray-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                          placeholder="Create a password"
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility("setupPassword")}
                          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-amber-700 transition hover:bg-amber-100"
                          aria-label={
                            showPasswords.setupPassword
                              ? "Hide new password"
                              : "Show new password"
                          }
                        >
                          {showPasswords.setupPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </label>

                    <label className="block">
                      <span className="mb-1 block text-sm font-medium text-gray-700">
                        Confirm New Password
                      </span>
                      <div className="relative">
                        <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                          type={
                            showPasswords.setupConfirmPassword
                              ? "text"
                              : "password"
                          }
                          value={passwordSetup.confirmPassword}
                          onChange={(e) =>
                            setPasswordSetup((prev) => ({
                              ...prev,
                              confirmPassword: e.target.value,
                            }))
                          }
                          className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-11 text-sm text-gray-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                          placeholder="Re-enter new password"
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            togglePasswordVisibility("setupConfirmPassword")
                          }
                          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-amber-700 transition hover:bg-amber-100"
                          aria-label={
                            showPasswords.setupConfirmPassword
                              ? "Hide confirm new password"
                              : "Show confirm new password"
                          }
                        >
                          {showPasswords.setupConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </label>

                    <button
                      type="button"
                      onClick={handleSetPassword}
                      disabled={isBusy}
                      className="w-full rounded-lg bg-amber-700 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-800 disabled:cursor-not-allowed disabled:bg-amber-400"
                    >
                      {isSettingPassword
                        ? "Setting password..."
                        : "Set Password for Email Login"}
                    </button>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isLogin && (
                    <>
                      <label className="block">
                        <span className="mb-1 block text-sm font-medium text-gray-700">
                          First Name
                        </span>
                        <div className="relative">
                          <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            value={form.firstName}
                            onChange={(e) =>
                              setForm((prev) => ({
                                ...prev,
                                firstName: e.target.value,
                              }))
                            }
                            className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm text-gray-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                            placeholder="Your first name"
                          />
                        </div>
                      </label>

                      <label className="block">
                        <span className="mb-1 block text-sm font-medium text-gray-700">
                          Last Name
                        </span>
                        <div className="relative">
                          <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            value={form.lastName}
                            onChange={(e) =>
                              setForm((prev) => ({
                                ...prev,
                                lastName: e.target.value,
                              }))
                            }
                            className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm text-gray-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                            placeholder="Your last name"
                          />
                        </div>
                      </label>
                    </>
                  )}

                  <label className="block">
                    <span className="mb-1 block text-sm font-medium text-gray-700">
                      Email Address
                    </span>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, email: e.target.value }))
                        }
                        className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm text-gray-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                        placeholder="name@email.com"
                        autoComplete="email"
                        required
                      />
                    </div>
                  </label>

                  <label className="block">
                    <span className="mb-1 block text-sm font-medium text-gray-700">
                      Password
                    </span>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <input
                        type={
                          isLogin
                            ? showPasswords.loginPassword
                              ? "text"
                              : "password"
                            : showPasswords.signupPassword
                            ? "text"
                            : "password"
                        }
                        value={form.password}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            password: e.target.value,
                          }))
                        }
                        className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-11 text-sm text-gray-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                        placeholder="Your password"
                        autoComplete={isLogin ? "current-password" : "new-password"}
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          togglePasswordVisibility(
                            isLogin ? "loginPassword" : "signupPassword"
                          )
                        }
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-amber-700 transition hover:bg-amber-100"
                        aria-label={
                          (isLogin
                            ? showPasswords.loginPassword
                            : showPasswords.signupPassword)
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {isLogin ? (
                          showPasswords.loginPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )
                        ) : showPasswords.signupPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </label>

                  {!isLogin && (
                    <label className="block">
                      <span className="mb-1 block text-sm font-medium text-gray-700">
                        Confirm Password
                      </span>
                      <div className="relative">
                        <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                          type={
                            showPasswords.signupConfirmPassword
                              ? "text"
                              : "password"
                          }
                          value={form.confirmPassword}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              confirmPassword: e.target.value,
                            }))
                          }
                          className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-11 text-sm text-gray-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                          placeholder="Re-enter your password"
                          autoComplete="new-password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() =>
                            togglePasswordVisibility("signupConfirmPassword")
                          }
                          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-amber-700 transition hover:bg-amber-100"
                          aria-label={
                            showPasswords.signupConfirmPassword
                              ? "Hide confirm password"
                              : "Show confirm password"
                          }
                        >
                          {showPasswords.signupConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </label>
                  )}

                  {error && (
                    <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                      {error}
                    </p>
                  )}

                  {success && (
                    <p className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
                      {success}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isBusy}
                    className="w-full rounded-lg bg-amber-600 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:bg-amber-400"
                  >
                    {submitLabel}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
