import {
  ShoppingCart,
  Search,
  Menu,
  X,
  User,
  ChevronDown,
  Shield,
  LayoutDashboard,
  ClipboardList,
  Receipt,
  LogOut,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Logo } from "./Logo";
import { getUserFromToken, logout } from "../utils/auth";

export function Navbar({
  currentSection,
  onNavigate,
  onOpenUserSection,
  cartCount,
  onCartClick,
  searchQuery,
  onSearchChange,
}) {
  const user = getUserFromToken();
  const sections = ["home", "explore", "about", "sales", "contact"];
  const formatSectionLabel = (section) =>
    section.charAt(0).toUpperCase() + section.slice(1).toLowerCase();
  const userMenuItemClass =
    "inline-flex w-full items-center gap-3 rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-2.5 text-sm font-semibold text-amber-700 transition-all hover:-translate-y-0.5 hover:border-amber-300 hover:from-amber-100 hover:to-orange-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 dark:border-blue-300 dark:bg-gradient-to-r dark:from-blue-200 dark:to-blue-100 dark:!text-blue-900 dark:hover:border-blue-200 dark:hover:from-blue-100 dark:hover:to-blue-50";
  const userMenuDangerItemClass =
    "inline-flex w-full items-center gap-3 rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-2.5 text-sm font-semibold text-amber-700 transition-all hover:-translate-y-0.5 hover:border-amber-300 hover:from-amber-100 hover:to-orange-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 dark:border-blue-700 dark:bg-gradient-to-r dark:from-blue-900 dark:to-blue-800 dark:text-red-300 dark:hover:border-blue-600 dark:hover:from-blue-800 dark:hover:to-blue-700";

  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchPanelRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    if (!isSearchOpen) return;

    const handleOutsideClick = (event) => {
      if (
        searchPanelRef.current &&
        !searchPanelRef.current.contains(event.target)
      ) {
        setIsSearchOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isSearchOpen]);

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (!openUserMenu) return;

    const handleOutsideClick = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setOpenUserMenu(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setOpenUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [openUserMenu]);

  return (
    <nav className="relative sticky top-0 z-50 border-b border-amber-300 bg-gradient-to-r from-amber-200 via-orange-100 to-yellow-100 shadow-sm transition-colors dark:border-blue-800 dark:bg-gradient-to-r dark:from-blue-950 dark:via-blue-900 dark:to-blue-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* LEFT */}
          <div className="flex items-center gap-2">
            <button
              className="md:hidden rounded-lg border border-amber-300 bg-gradient-to-r from-amber-200 via-orange-100 to-yellow-100 p-2 text-amber-700 shadow-sm dark:border-blue-700 dark:bg-gradient-to-r dark:from-blue-900 dark:via-blue-800 dark:to-blue-900 dark:!text-amber-700"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open mobile menu"
            >
              <Menu />
            </button>
            <Logo onClick={() => onNavigate("home")} />
          </div>

          {/* CENTER */}
          <div className="hidden md:flex gap-8">
            {sections.map((s) => (
              <button
                key={s}
                onClick={() => onNavigate(s)}
                className={
                  currentSection === s
                    ? "text-amber-700 border-b-2 border-amber-700 text-sm font-semibold tracking-wide dark:!text-blue-300 dark:!border-blue-300"
                    : "text-gray-700 hover:text-amber-700 text-sm font-semibold tracking-wide dark:!text-white dark:hover:!text-white"
                }
              >
                {formatSectionLabel(s)}
              </button>
            ))}
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSearchOpen((v) => !v)}
              className="p-2 text-amber-700 transition-colors hover:text-amber-700 dark:!text-amber-700 dark:hover:!text-amber-700"
              aria-label={isSearchOpen ? "Close search" : "Open search"}
            >
              {isSearchOpen ? (
                <X className="w-5 h-5 dark:!text-amber-700" />
              ) : (
                <Search className="w-5 h-5 dark:!text-amber-700" />
              )}
            </button>
            <button
              onClick={onCartClick}
              className="relative p-2 text-amber-700 transition-colors hover:text-amber-700 dark:!text-amber-700 dark:hover:!text-amber-700"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="w-6 h-6 dark:!text-amber-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1 right-0 min-w-[1.2rem] h-5 px-1 rounded-full bg-amber-600 text-white text-[11px] font-bold leading-5 text-center shadow-sm ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </button>

            {/* USER */}
            <div ref={userMenuRef} className="relative">
              <button
                onClick={() => setOpenUserMenu(!openUserMenu)}
                className="flex items-center gap-1 text-amber-700 dark:!text-amber-700"
              >
                <User className="dark:!text-amber-700" />
                <span className="text-amber-700 dark:!text-amber-700">{user ? user.firstName : "User"}</span>
                <ChevronDown className="dark:!text-amber-700" />
                {user?.role === "admin" && <Shield className="text-red-600" />}
              </button>

              {openUserMenu && (
                <div
                  className={
                    user
                      ? "absolute right-0 mt-2 w-56 rounded-xl border border-amber-100 bg-white p-2 shadow-lg space-y-2 dark:border-blue-700 dark:bg-blue-950"
                      : "absolute right-0 mt-2 w-56"
                  }
                >
                  {user ? (
                    <>
                      <button
                        className={userMenuItemClass}
                        onClick={() => {
                          setOpenUserMenu(false);
                          if (typeof onOpenUserSection === "function") {
                            onOpenUserSection("dashboard");
                            return;
                          }
                          onNavigate("dashboard");
                        }}
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </button>
                      <button
                        className={userMenuItemClass}
                        onClick={() => {
                          setOpenUserMenu(false);
                          if (typeof onOpenUserSection === "function") {
                            onOpenUserSection("orders");
                            return;
                          }
                          onNavigate("dashboard");
                        }}
                      >
                        <ClipboardList className="h-4 w-4" />
                        My Orders
                      </button>
                      <button
                        className={userMenuItemClass}
                        onClick={() => {
                          setOpenUserMenu(false);
                          if (typeof onOpenUserSection === "function") {
                            onOpenUserSection("bills");
                            return;
                          }
                          onNavigate("dashboard");
                        }}
                      >
                        <Receipt className="h-4 w-4" />
                        Download Bills
                      </button>
                      {user.role === "admin" && (
                        <button
                          className={userMenuItemClass}
                          onClick={() => {
                            setOpenUserMenu(false);
                            onNavigate("admin");
                          }}
                        >
                          <Shield className="h-4 w-4 text-amber-700" />
                          Admin Panel
                        </button>
                      )}
                      <button
                        className={userMenuDangerItemClass}
                        onClick={() => {
                          setOpenUserMenu(false);
                          logout();
                        }}
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <button
                      className="inline-flex w-full items-center justify-center rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-2.5 text-sm font-semibold text-amber-700 transition-all hover:-translate-y-0.5 hover:border-amber-300 hover:from-amber-100 hover:to-orange-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 dark:border-blue-700 dark:bg-gradient-to-r dark:from-blue-900 dark:to-blue-800 dark:!text-white dark:hover:border-blue-600 dark:hover:from-blue-800 dark:hover:to-blue-700"
                      onClick={() => {
                        setOpenUserMenu(false);
                        onNavigate("auth");
                      }}
                    >
                      Login / Signup
                    </button>
                    
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isSearchOpen && (
        <div
          ref={searchPanelRef}
          className="absolute top-full right-4 left-4 mt-2 rounded-xl border border-gray-200 bg-white p-3 shadow-lg sm:left-auto sm:w-[26rem] dark:border-blue-800 dark:bg-blue-950"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-700 dark:!text-amber-700" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search furniture..."
              autoFocus
              className="w-full rounded-lg border border-gray-300 py-2 pr-12 pl-10 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-600 dark:border-blue-700 dark:bg-blue-900 dark:text-slate-100 dark:placeholder:text-slate-400"
            />
            <button
              onClick={() => setIsSearchOpen(false)}
              className="absolute top-1/2 right-2 -translate-y-1/2 p-1 text-amber-700 hover:text-amber-700 dark:!text-amber-700 dark:hover:!text-amber-700"
              aria-label="Close search"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {isMobileMenuOpen && (
        <>
          <button
            className="fixed inset-0 bg-black/40 md:hidden z-40"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close mobile menu overlay"
          />
          <div className="fixed top-0 left-0 z-50 h-full w-72 max-w-[85vw] border-r border-amber-200 bg-gradient-to-b from-amber-100 via-orange-50 to-yellow-50 shadow-xl md:hidden dark:border-blue-800 dark:bg-gradient-to-b dark:from-blue-950 dark:via-blue-900 dark:to-blue-900">
            <div className="flex h-16 items-center justify-between border-b border-amber-200 px-4 dark:border-blue-800">
              <Logo onClick={() => {
                onNavigate("home");
                setIsMobileMenuOpen(false);
              }} />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-amber-700 dark:!text-amber-700"
                aria-label="Close mobile menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-3 py-3 space-y-1">
              {sections.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    onNavigate(s);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md ${
                    currentSection === s
                      ? "bg-amber-100 text-amber-800 text-sm font-semibold dark:bg-blue-700 dark:!text-white dark:ring-1 dark:ring-blue-500"
                      : "text-gray-700 hover:bg-gray-100 text-sm font-semibold dark:!text-white dark:hover:bg-blue-800/70"
                  }`}
                >
                  {formatSectionLabel(s)}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
