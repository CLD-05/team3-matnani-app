import React, { useEffect, useState } from "react";
import { Header } from "./components/Header";
import { initialProducts } from "./data/products";
import { initialReservations } from "./data/reservations";
import { initialReviews } from "./data/reviews";
import { BusinessSignupPage } from "./pages/BusinessSignupPage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { MarketPage } from "./pages/MarketPage";
import { MyReviewsPage } from "./pages/MyReviewsPage";
import { ProductCreatePage } from "./pages/ProductCreatePage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { ReservationsPage } from "./pages/ReservationsPage";
import { ReviewNewPage } from "./pages/ReviewNewPage";
import { SignupPage } from "./pages/SignupPage";
import { MyPage } from "./pages/MyPage";
import { TransactionHistoryPage } from "./pages/TransactionHistoryPage";

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
  const [reservations, setReservations] = useState(initialReservations);
  const [reviews, setReviews] = useState(initialReviews);
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

  const reserveProduct = (productId, buyer = currentUser) => {
    const product = products.find((item) => item.id === productId);

    if (!product || !buyer) return;

    setProducts((prev) =>
      prev.map((product) =>
        product.id === productId
          ? { ...product, status: "예약중", statusTone: "reserved" }
          : product,
      ),
    );
    setReservations((prev) => {
      const alreadyRequested = prev.some(
        (reservation) =>
          reservation.productId === productId &&
          reservation.buyerName === buyer.nickname &&
          ["REQUESTED", "ACCEPTED"].includes(reservation.status),
      );

      if (alreadyRequested) return prev;

      return [
        {
          id: Date.now(),
          productId,
          buyerName: buyer.nickname,
          sellerName: product.seller,
          requestedAt: "방금 전",
          pickupTime: product.pickup.replace(" 픽업", ""),
          status: "REQUESTED",
        },
        ...prev,
      ];
    });
  };

  const updateReservation = (reservationId, nextStatus) => {
    const reservation = reservations.find((item) => item.id === reservationId);

    setReservations((prev) =>
      prev.map((item) => (item.id === reservationId ? { ...item, status: nextStatus } : item)),
    );

    if (!reservation) return;

    const productStatusByReservation = {
      ACCEPTED: { status: "예약중", statusTone: "reserved" },
      CANCELED: { status: "판매중", statusTone: "sale" },
      COMPLETED: { status: "판매완료", statusTone: "soldout" },
    };
    const nextProductStatus = productStatusByReservation[nextStatus];

    if (!nextProductStatus) return;

    setProducts((prev) =>
      prev.map((product) =>
        product.id === reservation.productId
          ? { ...product, ...nextProductStatus }
          : product,
      ),
    );
  };

  const addReview = (review) => {
    setReviews((prev) => [review, ...prev]);
  };

  const updateReview = (reviewId, updates) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, ...updates } : r)),
    );
  };

  const deleteReview = (reviewId) => {
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
  };

  const detailMatch = path.match(/^\/products\/([^/]+)$/);
  const reviewNewMatch = path.match(/^\/reviews\/new\/([^/]+)$/);
  const detailProduct = detailMatch
    ? products.find((product) => String(product.id) === detailMatch[1])
    : null;

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
      {path === "/market" && <MarketPage products={products} onNavigate={navigate} />}
      {path === "/mypage" && (
        <MyPage currentUser={currentUser} products={products} onNavigate={navigate} />
      )}
      {path === "/mypage/reservations" && (
        <ReservationsPage
          currentUser={currentUser}
          products={products}
          reservations={reservations}
          onNavigate={navigate}
          onUpdateReservation={updateReservation}
        />
      )}
      {path === "/mypage/purchases" && (
        <TransactionHistoryPage
          type="purchases"
          currentUser={currentUser}
          products={products}
          reservations={reservations}
          reviews={reviews}
          onNavigate={navigate}
        />
      )}
      {path === "/mypage/sales" && (
        <TransactionHistoryPage
          type="sales"
          currentUser={currentUser}
          products={products}
          reservations={reservations}
          onNavigate={navigate}
          onUpdateReservation={updateReservation}
        />
      )}
      {path === "/products/new" && <ProductCreatePage onAddProduct={addProduct} />}
      {path === "/mypage/reviews" && (
        <MyReviewsPage
          currentUser={currentUser}
          reviews={reviews}
          onNavigate={navigate}
          onUpdateReview={updateReview}
          onDeleteReview={deleteReview}
        />
      )}
      {reviewNewMatch && (
        <ReviewNewPage
          reservationId={Number(reviewNewMatch[1])}
          currentUser={currentUser}
          products={products}
          reservations={reservations}
          reviews={reviews}
          onNavigate={navigate}
          onAddReview={addReview}
        />
      )}
      {detailMatch && (
        <ProductDetailPage
          product={detailProduct}
          currentUser={currentUser}
          onNavigate={navigate}
          onReserve={reserveProduct}
        />
      )}
      {!authPaths.includes(path) &&
        !["/market", "/products/new", "/mypage/reviews"].includes(path) &&
        path !== "/mypage" &&
        path !== "/mypage/reservations" &&
        path !== "/mypage/purchases" &&
        path !== "/mypage/sales" &&
        !detailMatch &&
        !reviewNewMatch && (
        <HomePage products={products} onNavigate={navigate} />
      )}
    </main>
  );
}
