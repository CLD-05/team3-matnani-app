import React, { useEffect, useState } from "react";
import { getSavedUser, loginUser, logoutUser } from "./api/auth";
import {
  deleteAllNotifications as requestDeleteAllNotifications,
  deleteNotifications as requestDeleteNotifications,
  fetchMyNotifications,
  markAllNotificationsAsRead as requestMarkAllNotificationsAsRead,
  markNotificationAsRead as requestMarkNotificationAsRead,
  updateNotificationSetting,
} from "./api/notifications";
import {
  createProduct,
  deleteProduct as requestDeleteProduct,
  fetchProducts,
  updateProduct as requestUpdateProduct,
} from "./api/products";
import {
  createReservation,
  fetchMyReservations,
  fetchMySellerReservations,
  updateReservationStatus,
} from "./api/reservations";
import {
  createReview,
  deleteReview as requestDeleteReview,
  fetchMyReviews,
  updateReview as requestUpdateReview,
} from "./api/reviews";
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
import { ReviewNewPage } from "./pages/ReviewNewPage";
import { SignupPage } from "./pages/SignupPage";
import { MyPage } from "./pages/MyPage";
import { TransactionHistoryPage } from "./pages/TransactionHistoryPage";
import { MyCommentsPage } from "./pages/MyCommentsPage";
import { NotificationsPage } from "./pages/NotificationsPage";
import { MyReviewsPage } from "./pages/MyReviewsPage";
import { ReceivedReviewsPage } from "./pages/ReceivedReviewsPage";
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

export default function App() {
  const [path, setPath] = useState(window.location.pathname);
  const [products, setProducts] = useState(initialProducts);
  const [reservations, setReservations] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [salesFilter, setSalesFilter] = useState("all");
  const [selectedRegionLabel, setSelectedRegionLabel] = useState("서울 성동구 성수동");
  const [currentUser, setCurrentUser] = useState(getSavedUser);

  // 앱 시작 시 상품 목록 불러오기
  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch(() => {});
  }, []);

  // 로그인 상태일 때 예약 내역 + 후기 불러오기
  useEffect(() => {
    if (!currentUser) return;
    Promise.all([fetchMyReservations(), fetchMySellerReservations()])
      .then(([buyerReservations, sellerReservations]) => {
        const seen = new Set();
        const merged = [...buyerReservations, ...sellerReservations].filter((r) => {
          if (seen.has(r.id)) return false;
          seen.add(r.id);
          return true;
        });
        setReservations(merged);
      })
      .catch(() => {});
    fetchMyReviews()
      .then(setReviews)
      .catch(() => {});
    fetchMyNotifications()
      .then(setNotifications)
      .catch(() => {});
  }, [currentUser]);

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

  const login = async (user) => {
    const loggedInUser = await loginUser(user);
    setCurrentUser(loggedInUser);
    navigate("/");
  };

  const logout = async () => {
    await logoutUser();
    setCurrentUser(null);
    setReservations([]);
    setReviews([]);
    setNotifications([]);
    navigate("/");
  };

  const addProduct = async (product) => {
    const createdProduct = await createProduct(product);
    setProducts((prev) => [createdProduct, ...prev]);
  };

  const updateProduct = async (productId, updates) => {
    const result = await requestUpdateProduct(productId, updates);
    setProducts((prev) =>
      prev.map((product) =>
        product.id === result.productId ? { ...product, ...result.updates } : product,
      ),
    );
  };

  const deleteProduct = async (productId) => {
    const result = await requestDeleteProduct(productId);
    setProducts((prev) => prev.filter((product) => product.id !== result.productId));
    setReservations((prev) =>
      prev.filter((reservation) => reservation.productId !== result.productId),
    );
  };

  const reserveProduct = async (productId, buyer = currentUser) => {
    const product = products.find((item) => item.id === productId);

    if (!product || !buyer) return;

    const alreadyRequested = reservations.some(
      (reservation) =>
        reservation.productId === productId &&
        reservation.buyerName === buyer.nickname &&
        ["REQUESTED", "ACCEPTED"].includes(reservation.status),
    );

    if (alreadyRequested) return;

    const result = await createReservation({ product, buyer });

    setProducts((prev) =>
      prev.map((product) =>
        product.id === productId
          ? { ...product, ...result.productStatus }
          : product,
      ),
    );
    setReservations((prev) => [result.reservation, ...prev]);
  };

  const updateReservation = async (reservationId, nextStatus) => {
    const reservation = reservations.find((item) => item.id === reservationId);

    if (!reservation) return;

    const result = await updateReservationStatus(reservation, nextStatus);

    setReservations((prev) =>
      prev.map((item) =>
        item.id === result.reservationId ? { ...item, status: result.nextStatus } : item,
      ),
    );

    if (!result.productStatus) return;

    setProducts((prev) =>
      prev.map((product) =>
        product.id === result.productId
          ? { ...product, ...result.productStatus }
          : product,
      ),
    );
  };

  const addReview = async (review) => {
    const createdReview = await createReview(review);
    setReviews((prev) => [createdReview, ...prev]);
  };

  const updateReview = async (reviewId, updates) => {
    const result = await requestUpdateReview(reviewId, updates);
    setReviews((prev) =>
      prev.map((review) =>
        review.id === result.reviewId ? { ...review, ...result.updates } : review,
      ),
    );
  };

  const deleteReview = async (reviewId) => {
    const result = await requestDeleteReview(reviewId);
    setReviews((prev) => prev.filter((review) => review.id !== result.reviewId));
  };

  const markNotificationAsRead = async (notificationId) => {
    const result = await requestMarkNotificationAsRead(notificationId);
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === result.notificationId
          ? { ...notification, unread: false }
          : notification,
      ),
    );
  };

  const markAllNotificationsAsRead = async () => {
    await requestMarkAllNotificationsAsRead();
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, unread: false })),
    );
  };

  const toggleNotificationEnabled = async (enabled) => {
    const nextEnabled = await updateNotificationSetting(enabled);
    setNotificationEnabled(nextEnabled);
  };

  const deleteNotifications = async (notificationIds) => {
    const deletedIds = await requestDeleteNotifications(notificationIds);
    setNotifications((prev) =>
      prev.filter((notification) => !deletedIds.includes(notification.id)),
    );
  };

  const deleteAllNotifications = async () => {
    await requestDeleteAllNotifications();
    setNotifications([]);
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
    ? notifications.filter((notification) => notificationEnabled && notification.unread).length
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
          initialFilter={salesFilter}
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
          notificationEnabled={notificationEnabled}
          onNavigate={navigate}
          onNavigateToSales={navigateToSales}
          onReadNotification={markNotificationAsRead}
          onReadAllNotifications={markAllNotificationsAsRead}
          onToggleNotificationEnabled={toggleNotificationEnabled}
          onDeleteNotifications={deleteNotifications}
          onDeleteAllNotifications={deleteAllNotifications}
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
          productId={Number(detailMatch[1])}
          product={detailProduct}
          currentUser={currentUser}
          onNavigate={navigate}
          onReserve={reserveProduct}
          onDeleteProduct={deleteProduct}
        />
      )}
      {!authPaths.includes(path) &&
        !["/market", "/products/new", "/mypage/reviews"].includes(path) &&
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
