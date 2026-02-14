import { useEffect, useState } from "react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { ProductGrid } from "./components/ProductGrid";
import { About } from "./components/About";
import { Sales } from "./components/Sales";
import { ContactUs } from "./components/ContactUs";
import { Cart } from "./components/Cart";
import { ProductDetail } from "./components/ProductDetail";
import { OrderConfirmation } from "./components/OrderConfirmation";
import { Explore } from "./components/Explore";
import { Footer } from "./components/Footer";
import AuthPage from "./components/AuthPage";
import { UserDashboard } from "./components/UserDashboard";
import { FloatingChatbot } from "./components/FloatingChatbot";

const CART_STORAGE_KEY = "furnito_cart_items";
const THEME_STORAGE_KEY = "furnito_theme";

const getStoredCartItems = () => {
  if (typeof window === "undefined") return [];

  try {
    const stored = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const getInitialTheme = () => {
  if (typeof window === "undefined") return "light";

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (storedTheme === "dark" || storedTheme === "light") {
    return storedTheme;
  }

  // Default first load to light theme.
  return "light";
};

export default function App() {
  const [currentSection, setCurrentSection] = useState("home");
  const [dashboardView, setDashboardView] = useState("dashboard");
  const [theme, setTheme] = useState(getInitialTheme);
  const [cartItems, setCartItems] = useState(getStoredCartItems);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isProductDetailOpen, setIsProductDetailOpen] = useState(false);
  const [isOrderConfirmationOpen, setIsOrderConfirmationOpen] = useState(false);

  /* 🛒 CART LOGIC */
  const addToCart = (product) => {
    setCartItems((prev) => {
      const found = prev.find((i) => i.id === product.id);
      if (found) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) =>
    setCartItems((prev) => prev.filter((i) => i.id !== id));

  const updateQuantity = (id, quantity) => {
    if (quantity === 0) return removeFromCart(id);
    setCartItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity } : i))
    );
  };

  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);
  const cartTotal =
    cartItems.reduce((s, i) => s + i.price * i.quantity, 0) +
    (cartItems.length ? 50 : 0);

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    const isDarkTheme = theme === "dark";
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    document.documentElement.classList.toggle("dark", isDarkTheme);
    document.documentElement.style.colorScheme = isDarkTheme ? "dark" : "light";
  }, [theme]);

  return (
    <div className="min-h-screen bg-white text-gray-900 transition-colors duration-300 dark:bg-blue-950 dark:text-slate-100">
      {/* 🔝 NAVBAR */}
      <Navbar
        currentSection={currentSection}
        onNavigate={setCurrentSection}
        onOpenUserSection={(view) => {
          setDashboardView(view);
          setCurrentSection("dashboard");
        }}
        cartCount={cartCount}
        onCartClick={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* 📄 MAIN CONTENT */}
      <main>
        {currentSection === "home" && (
          <>
            <Hero onShopNow={() => setCurrentSection("explore")} />
            <ProductGrid
              onAddToCart={addToCart}
              searchQuery={searchQuery}
              onProductClick={(p) => {
                setSelectedProduct(p);
                setIsProductDetailOpen(true);
              }}
            />
          </>
        )}

        {currentSection === "explore" && (
          <Explore
            onAddToCart={addToCart}
            onProductClick={(p) => {
              setSelectedProduct(p);
              setIsProductDetailOpen(true);
            }}
            searchQuery={searchQuery}
          />
        )}

        {currentSection === "about" && <About />}
        {currentSection === "sales" && (
          <Sales
            onAddToCart={addToCart}
            onProductClick={(p) => {
              setSelectedProduct(p);
              setIsProductDetailOpen(true);
            }}
          />
        )}
        {currentSection === "contact" && <ContactUs />}

        {/* 🔐 AUTH PAGE */}
        {currentSection === "auth" && (
          <AuthPage onAuthSuccess={() => setCurrentSection("home")} />
        )}
        {currentSection === "dashboard" && (
          <UserDashboard
            onNavigate={setCurrentSection}
            activeView={dashboardView}
          />
        )}
      </main>

      <Footer
        theme={theme}
        onToggleTheme={() => {
          setTheme((currentTheme) =>
            currentTheme === "dark" ? "light" : "dark"
          );
        }}
        onNavigate={setCurrentSection}
      />

      {/* 🛍 CART */}
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsOrderConfirmationOpen(true);
        }}
      />

      {/* 📦 PRODUCT DETAIL */}
      <ProductDetail
        product={selectedProduct}
        isOpen={isProductDetailOpen}
        onClose={() => setIsProductDetailOpen(false)}
        onAddToCart={addToCart}
      />

      {/* ✅ ORDER CONFIRMATION */}
      <OrderConfirmation
        isOpen={isOrderConfirmationOpen}
        onClose={() => setIsOrderConfirmationOpen(false)}
        items={cartItems}
        total={cartTotal}
        onRequireAuth={() => {
          setIsOrderConfirmationOpen(false);
          setCurrentSection("auth");
        }}
        onOrderSuccess={() => {
          setCartItems([]);
          setIsOrderConfirmationOpen(false);
          setDashboardView("orders");
          setCurrentSection("dashboard");
        }}
      />

      <FloatingChatbot />
    </div>
  );
}
