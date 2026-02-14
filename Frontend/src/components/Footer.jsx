import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
  Sun,
  Moon,
} from "lucide-react";
import { Logo } from "./Logo";

export function Footer({ theme = "light", onToggleTheme, onNavigate }) {
  const isDarkTheme = theme === "dark";
  const quickLinks = [
    { label: "Home", section: "home" },
    { label: "About Us", section: "about" },
    { label: "Explore", section: "explore" },
    { label: "Sales", section: "sales" },
    { label: "Contact Us", section: "contact" },
  ];

  return (
    <footer className="border-t border-amber-300/70 bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100 text-slate-800 transition-colors duration-300 dark:border-blue-800 dark:bg-gradient-to-br dark:from-blue-950 dark:via-blue-900 dark:to-blue-900 dark:text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo className="mb-4 h-8 w-auto text-amber-600 dark:text-amber-400" />
            <p className="mb-4 text-sm text-slate-600 dark:text-white">
              Premium furniture that transforms your house into a home. Quality
              craftsmanship since 2004.
            </p>
            <div className="flex space-x-3">
              <a
                href="#"
                className="rounded-full border border-amber-200 bg-white/70 p-2 text-[#1877F2] transition-all hover:scale-105 dark:border-blue-800 dark:bg-blue-900/70"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="rounded-full border border-amber-200 bg-white/70 p-2 text-[#E4405F] transition-all hover:scale-105 dark:border-blue-800 dark:bg-blue-900/70"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="rounded-full border border-amber-200 bg-white/70 p-2 text-[#1DA1F2] transition-all hover:scale-105 dark:border-blue-800 dark:bg-blue-900/70"
              >
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.section}>
                  <button
                    type="button"
                    onClick={() => onNavigate?.(link.section)}
                    className="text-sm text-slate-600 transition-colors hover:text-amber-700 dark:text-white dark:hover:text-amber-300"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
              Customer Service
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-sm text-slate-600 transition-colors hover:text-amber-700 dark:text-white dark:hover:text-amber-300"
                >
                  Shipping Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-slate-600 transition-colors hover:text-amber-700 dark:text-white dark:hover:text-amber-300"
                >
                  Return & Exchange
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-slate-600 transition-colors hover:text-amber-700 dark:text-white dark:hover:text-amber-300"
                >
                  FAQs
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-slate-600 transition-colors hover:text-amber-700 dark:text-white dark:hover:text-amber-300"
                >
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-slate-600 transition-colors hover:text-amber-700 dark:text-white dark:hover:text-amber-300"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2 text-sm">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                <span className="text-slate-600 dark:text-white">
                  WHS Timber Market
                  <br />
                  Kirti Nagar , New Delhi -110015
                </span>
              </li>
              <li className="flex items-center space-x-2 text-sm">
                <Phone className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                <span className="text-slate-600 dark:text-white">
                  <a
                    href="tel:9717650915"
                    className="transition-colors hover:text-amber-700 dark:hover:text-amber-300"
                  >
                    9717650915
                  </a>
                </span>
              </li>
              <li className="flex items-center space-x-2 text-sm">
                <Mail className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                <span className="text-slate-600 dark:text-white">
                  <a
                    href="mailto:amarnathverma836@gmail.com"
                    className="transition-colors hover:text-amber-700 dark:hover:text-amber-300"
                  >
                    amarnathverma836@gmail.com
                  </a>
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-amber-300/70 pt-6 text-center dark:border-blue-800">
          <p className="text-sm text-slate-600 dark:text-white">
            (c) {new Date().getFullYear()} Furnito. All rights reserved.
          </p>
        </div>

        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-pressed={isDarkTheme}
            aria-label={`Switch to ${isDarkTheme ? "light" : "dark"} theme`}
            className={`group inline-flex items-center gap-3 rounded-full border px-4 py-2.5 shadow-md transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 ${
              isDarkTheme
                ? "border-blue-700 bg-gradient-to-r from-blue-900 to-blue-800 text-slate-100 focus-visible:ring-blue-300"
                : "border-amber-300 bg-gradient-to-r from-amber-100 via-orange-50 to-yellow-100 text-amber-900 focus-visible:ring-amber-500"
            }`}
          >
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full shadow-inner ${
                isDarkTheme
                  ? "bg-blue-950 text-yellow-300"
                  : "bg-white text-amber-600"
              }`}
            >
              {isDarkTheme ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </span>

            <span className="text-sm font-semibold tracking-wide">
              {isDarkTheme ? "Dark Theme" : "Light Theme"}
            </span>

            <span
              className={`relative h-6 w-12 rounded-full border transition-colors ${
                isDarkTheme
                  ? "border-blue-500 bg-blue-700"
                  : "border-amber-300 bg-amber-200/70"
              }`}
            >
              <span
                className={`absolute right-0.5 top-0.5 h-5 w-5 rounded-full shadow-md transition-transform duration-300 ${
                  isDarkTheme
                    ? "-translate-x-6 bg-slate-100"
                    : "translate-x-0 bg-white"
                }`}
              />
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}
