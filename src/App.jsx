import React, { useEffect, useState } from "react";
import { Header } from "./components/Header";
import { initialProducts } from "./data/products";
import { initialReservations } from "./data/reservations";
import { initialReviews } from "./data/reviews";
import { notifications as initialNotifications } from "./data/activity";
import { BusinessSignupPage } from "./pages/BusinessSignupPage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { MarketPage } from "./pages/MarketPage";
import { ProductCreatePage } from "./pages/ProductCreatePage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { ReservationsPage } from "./pages/ReservationsPage";
import { SignupPage } from "./pages/SignupPage";
import { MyPage } from "./pages/MyPage";
import { TransactionHistoryPage } from "./pages/TransactionHistoryPage";
import { MyCommentsPage } from "./pages/MyCommentsPage";
import { NotificationsPage } from "./pages/NotificationsPage";
import { MyReviewsPage } from "./pages/MyReviewsPage";
import { ReceivedReviewsPage } from "./pages/ReceivedReviewsPage";
import { ReviewNewPage } from "./pages/ReviewNewPage";
import { SellerProfilePage } from "./pages/SellerProfilePage";

const authPaths = ["/login", "/signup", "/signup/business"];

function isProtectedPath(path) {
  return (
    path === "/products/new" ||
    /^\/products\/[^/]+\/edit$/.test(path) ||
    path.startsWith("/mypage") ||
    path.startsWith("/reviews/new")
  );
}

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
  const [notifications, setNotifications] = useState(initialNotifications);
  const [salesFilter, setSalesFilter] = useState("all");
  const [selectedRegionLabel, setSelectedRegionLabel] = useState("서울 성동구 성수동");
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

  useEffect(() => {
    if (!currentUser && isProtectedPath(path)) {
      window.history.replaceState({}, "", "/login");
      setPath("/login");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentUser, path]);

  const navigateToSales = (tab) => {
    setSalesFilter(tab);
    navigate("/mypage/sales");
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

  const updateProduct = (productId, updates) => {
    setProducts((prev) =>
      prev.map((product) => (product.id === productId ? { ...product, ...updates } : product)),
    );
  };

  const deleteProduct = (productId) => {
    setProducts((prev) => prev.filter((product) => product.id !== productId));
    setReservations((prev) => prev.filter((reservation) => reservation.productId !== productId));
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
      prev.map((review) => (review.id === reviewId ? { ...review, ...updates } : review)),
    );
  };

  const deleteReview = (reviewId) => {
    setReviews((prev) => prev.filter((review) => review.id !== reviewId));
  };

  const markNotificationAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId ? { ...notification, unread: false } : notification,
      ),
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, unread: false })),
    );
  };

  const detailMatch = path.match(/^\/products\/([^/]+)$/);
  const editProductMatch = path.match(/^\/products\/([^/]+)\/edit$/);
  const reviewNewMatch = path.match(/^\/reviews\/new\/([^/]+)$/);
  const sellerProfileMatch = path.match(/^\/sellers\/([^/]+)$/);
  const detailProduct = detailMatch
    ? products.find((product) => String(product.id) === detailMatch[1])
    : null;
  const editProduct = editProductMatch
    ? products.find((product) => String(product.id) === editProductMatch[1])
    : null;
  const canEditProduct = editProduct && currentUser?.nickname === editProduct.seller;
  const sellerProfileName = sellerProfileMatch
    ? decodeURIComponent(sellerProfileMatch[1])
    : "";
  const unreadNotificationCount = currentUser
    ? notifications.filter((notification) => notification.unread).length
    : 0;

  return (
    <main className="app">
      <Header
        path={path}
        currentUser={currentUser}
        selectedRegionLabel={selectedRegionLabel}
        unreadNotificationCount={unreadNotificationCount}
        onNavigate={navigate}
        onLogout={logout}
        onRegionChange={setSelectedRegionLabel}
      />
      {path === "/login" && <LoginPage onNavigate={navigate} onLogin={login} />}
      {path === "/signup" && <SignupPage onNavigate={navigate} onLogin={login} />}
      {path === "/signup/business" && (
        <BusinessSignupPage onNavigate={navigate} onLogin={login} />
      )}
      {path === "/market" && (
        <MarketPage
          products={products}
          selectedRegionLabel={selectedRegionLabel}
          onNavigate={navigate}
        />
      )}
      {path === "/mypage" && (
        <MyPage
          currentUser={currentUser}
          products={products}
          onNavigate={navigate}
          onNavigateToSales={navigateToSales}
        />
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
          initialFilter={salesFilter}
          currentUser={currentUser}
          products={products}
          reservations={reservations}
          onNavigate={navigate}
          onUpdateReservation={updateReservation}
        />
      )}
      {path === "/mypage/comments" && (
        <MyCommentsPage currentUser={currentUser} onNavigate={navigate} />
      )}
      {path === "/mypage/notifications" && (
        <NotificationsPage
          currentUser={currentUser}
          notifications={notifications}
          onNavigate={navigate}
          onReadNotification={markNotificationAsRead}
          onReadAllNotifications={markAllNotificationsAsRead}
        />
      )}
      {path === "/mypage/reviews" && (
        <MyReviewsPage
          currentUser={currentUser}
          reviews={reviews}
          onNavigate={navigate}
          onUpdateReview={updateReview}
          onDeleteReview={deleteReview}
        />
      )}
      {path === "/mypage/received-reviews" && (
        <ReceivedReviewsPage
          currentUser={currentUser}
          reviews={reviews}
          onNavigate={navigate}
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
      {sellerProfileMatch && (
        <SellerProfilePage
          sellerName={sellerProfileName}
          products={products}
          reviews={reviews}
          onNavigate={navigate}
        />
      )}
      {path === "/products/new" && (
        <ProductCreatePage
          currentUser={currentUser}
          onAddProduct={addProduct}
          onNavigate={navigate}
        />
      )}
      {editProductMatch && canEditProduct && (
        <ProductCreatePage
          currentUser={currentUser}
          productToEdit={editProduct}
          onAddProduct={addProduct}
          onUpdateProduct={updateProduct}
          onNavigate={navigate}
        />
      )}
      {editProductMatch && currentUser && !canEditProduct && (
        <section className="detail-empty">
          <h1>{editProduct ? "상품 수정 권한이 없습니다." : "상품을 찾을 수 없습니다."}</h1>
          <button className="auth-submit" type="button" onClick={() => navigate("/market")}>
            장터로 돌아가기
          </button>
        </section>
      )}
      {detailMatch && (
        <ProductDetailPage
          product={detailProduct}
          currentUser={currentUser}
          onNavigate={navigate}
          onReserve={reserveProduct}
          onDeleteProduct={deleteProduct}
        />
      )}
      {!authPaths.includes(path) &&
        !["/market", "/products/new"].includes(path) &&
        path !== "/mypage" &&
        path !== "/mypage/reservations" &&
        path !== "/mypage/purchases" &&
        path !== "/mypage/sales" &&
        path !== "/mypage/comments" &&
        path !== "/mypage/notifications" &&
        path !== "/mypage/reviews" &&
        path !== "/mypage/received-reviews" &&
        !detailMatch &&
        !editProductMatch &&
        !reviewNewMatch &&
        !sellerProfileMatch && (
        <HomePage products={products} onNavigate={navigate} />
      )}
    </main>
  );
}
