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
import { getSavedRegion, saveRegion } from "./utils/regions";

const authPaths = ["/login", "/signup", "/signup/business"];
const activeReservationStatuses = new Set(["REQUESTED", "ACCEPTED"]);

function withProductQuantityStats(products, reservations) {
  return products.map((product) => {
    const productReservations = reservations.filter(
      (reservation) => String(reservation.productId) === String(product.id),
    );
    const reservedQuantity = productReservations
      .filter((reservation) => activeReservationStatuses.has(reservation.status))
      .reduce((sum, reservation) => sum + Number(reservation.quantity || 1), 0);
    const completedQuantity = productReservations
      .filter((reservation) => reservation.status === "COMPLETED")
      .reduce((sum, reservation) => sum + Number(reservation.quantity || 1), 0);
    const remainingQuantity = Number(product.remainingQuantity ?? product.totalQuantity ?? 1);

    return {
      ...product,
      remainingQuantity,
      reservedQuantity,
      completedQuantity,
      availableQuantity: remainingQuantity,
    };
  });
}

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
  const [appMessage, setAppMessage] = useState("");
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [salesFilter, setSalesFilter] = useState("all");
  const [currentUser, setCurrentUser] = useState(getSavedUser);
  const [selectedRegion, setSelectedRegion] = useState(() => getSavedRegion());

  // 앱 시작 시 상품 목록 불러오기
  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch(() => {
        setAppMessage("상품 목록을 불러오지 못해 기본 데이터로 표시합니다.");
      });
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
      .catch(() => {
        setAppMessage("예약 내역을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.");
      });
    fetchMyReviews()
      .then(setReviews)
      .catch(() => {
        setAppMessage("후기 내역을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.");
      });
    fetchMyNotifications()
      .then(setNotifications)
      .catch(() => {
        setAppMessage("알림 내역을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.");
      });
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

  const handleRegionChange = (region) => {
    setSelectedRegion(region);
    saveRegion(region);
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
    return createdProduct;
  };

  const updateProduct = async (productId, updates) => {
    const result = await requestUpdateProduct(productId, updates);
    const nextUpdates = Object.fromEntries(
      Object.entries(result.updates).filter(([, value]) => value !== undefined),
    );
    setProducts((prev) =>
      prev.map((product) =>
        product.id === result.productId ? { ...product, ...nextUpdates } : product,
      ),
    );
  };

  const deleteProduct = async (productId) => {
    const result = await requestDeleteProduct(productId);
    const deletedProductId = result.productId ?? productId;
    setProducts((prev) => prev.filter((product) => String(product.id) !== String(deletedProductId)));
    setReservations((prev) =>
      prev.filter((reservation) => String(reservation.productId) !== String(deletedProductId)),
    );
  };

  const reserveProduct = async (productId, buyer = currentUser, quantity = 1) => {
    const product = products.find((item) => item.id === productId);

    if (!product || !buyer) return;

    const alreadyRequested = reservations.some(
      (reservation) =>
        reservation.productId === productId &&
        reservation.buyerName === buyer.nickname &&
        ["REQUESTED", "ACCEPTED"].includes(reservation.status),
    );

    if (alreadyRequested) return;

    const result = await createReservation({ product, buyer, quantity });

    setProducts((prev) =>
      prev.map((product) =>
        product.id === productId
          ? { ...product, ...result.productStatus }
          : product,
      ),
    );
    setReservations((prev) => [result.reservation, ...prev]);
    return result;
  };

  const updateReservation = async (reservationId, nextStatus) => {
    try {
      const reservation = reservations.find((item) => String(item.id) === String(reservationId));

      if (!reservation) return;

      const reservationProduct =
        reservation.product ||
        products.find((product) => String(product.id) === String(reservation.productId));
      const result = await updateReservationStatus(reservation, nextStatus);
      const productId = result.productId || reservation.productId || reservationProduct?.id;

      setReservations((prev) =>
        prev.map((item) =>
          String(item.id) === String(result.reservationId)
            ? {
              ...item,
              ...result.reservation,
              productId,
              product: result.reservation?.product || item.product || reservationProduct,
              productTitle:
                result.reservation?.productTitle ||
                item.productTitle ||
                reservationProduct?.title,
              status: result.nextStatus,
            }
            : item,
        ),
      );

      if (!result.productStatus) return;

      setProducts((prev) => {
        const hasProduct = prev.some((product) => String(product.id) === String(productId));
        const updatedProducts = prev.map((product) =>
          String(product.id) === String(productId)
            ? { ...product, ...result.productStatus }
            : product,
        );

        if (hasProduct || !reservationProduct) return updatedProducts;

        return [{ ...reservationProduct, ...result.productStatus }, ...updatedProducts];
      });
    } catch {
      setAppMessage("예약 상태 변경에 실패했습니다. 잠시 후 다시 시도해주세요.");
    }
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

  const detailMatch = path.match(/^\/products\/(\d+)$/);
  const editProductMatch = path.match(/^\/products\/([^/]+)\/edit$/);
  const reviewNewMatch = path.match(/^\/reviews\/new\/([^/]+)$/);
  const sellerProfileMatch = path.match(/^\/sellers\/([^/]+)$/);
  const productsWithQuantityStats = withProductQuantityStats(products, reservations);
  const detailProduct = detailMatch
    ? productsWithQuantityStats.find((product) => String(product.id) === detailMatch[1])
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
        selectedRegion={selectedRegion}
        unreadNotificationCount={unreadNotificationCount}
        onNavigate={navigate}
        onLogout={logout}
        onRegionChange={handleRegionChange}
      />
      {appMessage && (
        <div className="app-message" role="status" aria-live="polite">
          <span>{appMessage}</span>
          <button type="button" onClick={() => setAppMessage("")}>
            닫기
          </button>
        </div>
      )}
      {path === "/login" && <LoginPage onNavigate={navigate} onLogin={login} />}
      {path === "/signup" && <SignupPage onNavigate={navigate} onLogin={login} />}
      {path === "/signup/business" && (
        <BusinessSignupPage onNavigate={navigate} onLogin={login} />
      )}
      {path === "/market" && (
        <MarketPage
          products={productsWithQuantityStats}
          currentUser={currentUser}
          selectedRegion={selectedRegion}
          onNavigate={navigate}
        />
      )}
      {path === "/mypage" && (
        <MyPage
          currentUser={currentUser}
          products={productsWithQuantityStats}
          reservations={reservations}
          onNavigate={navigate}
          onNavigateToSales={navigateToSales}
        />
      )}
      {path === "/mypage/reservations" && (
        <ReservationsPage
          currentUser={currentUser}
          products={productsWithQuantityStats}
          reservations={reservations}
          onNavigate={navigate}
          onUpdateReservation={updateReservation}
        />
      )}
      {path === "/mypage/purchases" && (
        <TransactionHistoryPage
          type="purchases"
          currentUser={currentUser}
          products={productsWithQuantityStats}
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
          products={productsWithQuantityStats}
          reservations={reservations}
          onNavigate={navigate}
          onUpdateReservation={updateReservation}
        />
      )}
      {path === "/mypage/comments" && (
        <MyCommentsPage currentUser={currentUser} products={productsWithQuantityStats} onNavigate={navigate} />
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
          products={productsWithQuantityStats}
          reservations={reservations}
          reviews={reviews}
          onNavigate={navigate}
          onAddReview={addReview}
        />
      )}
      {sellerProfileMatch && (
        <SellerProfilePage
          sellerName={sellerProfileName}
          products={productsWithQuantityStats}
          onNavigate={navigate}
        />
      )}
      {path === "/products/new" && (
        <ProductCreatePage
          currentUser={currentUser}
          selectedRegion={selectedRegion}
          onAddProduct={addProduct}
          onNavigate={navigate}
        />
      )}
      {editProductMatch && canEditProduct && (
        <ProductCreatePage
          currentUser={currentUser}
          selectedRegion={selectedRegion}
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
          <HomePage products={productsWithQuantityStats} selectedRegion={selectedRegion} onNavigate={navigate} />
        )}
    </main>
  );
}
