import React, { useEffect, useState } from "react";
import { Header } from "./components/Header";
import { initialProducts } from "./data/products";
import { BusinessSignupPage } from "./pages/BusinessSignupPage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { MarketPage } from "./pages/MarketPage";
import { ProductCreatePage } from "./pages/ProductCreatePage";
import { SignupPage } from "./pages/SignupPage";

const authPaths = ["/login", "/signup", "/signup/business"];

function loadSavedUser() {
  try {
    const savedUser = localStorage.getItem("matnaniUser");
    return savedUser ? JSON.parse(savedUser) : null;
  } catch {
    localStorage.removeItem("matnaniUser");
    localStorage.removeItem("matnaniToken");
    return null;
  }
}

export default function App() {
  const [path, setPath] = useState(window.location.pathname);
  const [products, setProducts] = useState(initialProducts);
  const [currentUser, setCurrentUser] = useState(loadSavedUser);

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigate = (nextPath) => {
    window.history.pushState({}, "", nextPath);
    setPath(nextPath);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const login = (user) => {
    localStorage.setItem("matnaniToken", "mock-access-token");
    localStorage.setItem("matnaniUser", JSON.stringify(user));
    setCurrentUser(user);
    navigate("/");
  };

  const logout = () => {
    localStorage.removeItem("matnaniToken");
    localStorage.removeItem("matnaniUser");
    setCurrentUser(null);
    navigate("/");
  };

  const addProduct = (product) => {
    setProducts((prev) => [product, ...prev]);
  };

  return (
    <main className="app">
      <Header
        path={path}
        currentUser={currentUser}
        onNavigate={navigate}
        onLogout={logout}
      />
      {path === "/login" && <LoginPage onNavigate={navigate} onLogin={login} />}
      {path === "/signup" && <SignupPage onNavigate={navigate} onLogin={login} />}
      {path === "/signup/business" && (
        <BusinessSignupPage onNavigate={navigate} onLogin={login} />
      )}
      {path === "/market" && <MarketPage products={products} />}
      {path === "/products/new" && <ProductCreatePage onAddProduct={addProduct} />}
      {!authPaths.includes(path) && !["/market", "/products/new"].includes(path) && (
        <HomePage products={products} onNavigate={navigate} />
      )}
    </main>
  );
}
