import { useState } from "react";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({});

  const submit = async () => {
    const url = isLogin ? "/login" : "/signup";
    const res = await axios.post(`http://localhost:5000/auth${url}`, form);
    localStorage.setItem("token", res.data.token);
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-96 space-y-4">
        <h2 className="text-xl font-semibold text-center">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        {!isLogin && (
          <input
            placeholder="First Name"
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            className="input"
          />
        )}

        <input
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="input"
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="input"
        />

        <button onClick={submit} className="btn-primary w-full">
          {isLogin ? "Login" : "Sign Up"}
        </button>

        <GoogleLogin
          onSuccess={(cred) =>
            axios
              .post("http://localhost:5000/auth/google", {
                token: cred.credential,
              })
              .then((res) => {
                localStorage.setItem("token", res.data.token);
                window.location.href = "/";
              })
          }
        />

        <p
          className="text-sm text-center cursor-pointer text-amber-600"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Create account" : "Already have an account?"}
        </p>
      </div>
    </div>
  );
}
