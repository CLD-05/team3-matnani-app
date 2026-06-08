import React, { useMemo, useState } from "react";
import { Bell, CheckCircle2, ChevronLeft, Circle, Settings } from "lucide-react";

const notificationFilters = ["전체", "예약", "댓글", "거래"];

export function NotificationsPage({
  currentUser,
  notifications,
  notificationEnabled,
  onNavigate,
  onReadNotification,
  onReadAllNotifications,
  onToggleNotificationEnabled,
  onDeleteNotifications,
  onDeleteAllNotifications,
}) {
  const [filter, setFilter] = useState("전체");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const unreadCount = notifications.filter((notification) => notification.unread).length;

  const visibleNotifications = useMemo(
    () =>
      notifications.filter((notification) =>
        filter === "전체" ? true : notification.type === filter,
      ),
    [filter, notifications],
  );

  const handleNotificationOpen = (notification) => {
    if (deleteMode) {
      toggleSelectedNotification(notification.id);
      return;
    }

    onReadNotification(notification.id);
    onNavigate(notification.targetPath);
  };

  const toggleSelectedNotification = (notificationId) => {
    setSelectedIds((prev) =>
      prev.includes(notificationId)
        ? prev.filter((id) => id !== notificationId)
        : [...prev, notificationId],
    );
  };

  const startDeleteMode = () => {
    setDeleteMode(true);
    setSettingsOpen(false);
    setSelectedIds([]);
  };

  const cancelDeleteMode = () => {
    setDeleteMode(false);
    setSelectedIds([]);
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    onDeleteNotifications(selectedIds);
    cancelDeleteMode();
  };

  const handleDeleteAll = () => {
    onDeleteAllNotifications();
    cancelDeleteMode();
  };

  if (!currentUser) {
    return (
      <section className="detail-empty">
        <h1>로그인이 필요한 화면입니다.</h1>
        <button className="auth-submit" type="button" onClick={() => onNavigate("/login")}>
          로그인하러 가기
        </button>
      </section>
    );
  }

  return (
    <section className="notifications-page">
      <button className="back-button" type="button" onClick={() => onNavigate("/mypage")}>
        <ChevronLeft size={20} />
        마이페이지로 돌아가기
      </button>

      <div className="notifications-shell">
        <div className="notifications-top">
          <h1>알림센터</h1>
          <div className="notifications-actions">
            <button
              className="notification-read-all"
              type="button"
              disabled={unreadCount === 0}
              onClick={onReadAllNotifications}
            >
              전체 읽음
            </button>
            <div className="notification-settings-wrap">
              <button
                className={settingsOpen ? "notification-settings-button active" : "notification-settings-button"}
                type="button"
                aria-label="알림 설정"
                aria-expanded={settingsOpen}
                onClick={() => setSettingsOpen((prev) => !prev)}
              >
              <Settings size={22} />
              </button>
              {settingsOpen && (
                <div className="notification-settings-popover">
                  <button
                    className="notification-toggle-row"
                    type="button"
                    onClick={() => onToggleNotificationEnabled(!notificationEnabled)}
                  >
                    <span>알림</span>
                    <span className={notificationEnabled ? "notification-switch on" : "notification-switch"}>
                      <strong>{notificationEnabled ? "ON" : "OFF"}</strong>
                      <i />
                    </span>
                  </button>
                  <button className="notification-delete-menu" type="button" onClick={startDeleteMode}>
                    알림 삭제
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="notification-filter-row">
          {notificationFilters.map((item) => (
            <button
              key={item}
              className={filter === item ? "active" : ""}
              type="button"
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="notification-list">
          {visibleNotifications.map((notification) => (
            <article
              className={notification.unread ? "notification-card unread" : "notification-card"}
              key={notification.id}
              role="link"
              tabIndex={0}
              aria-label={`${notification.actorName} ${notification.receivedAt} ${notification.content}`}
              onClick={() => handleNotificationOpen(notification)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  handleNotificationOpen(notification);
                }
              }}
            >
              <ProfileAvatar name={notification.actorName} avatar={notification.actorAvatar} />
              <div className="notification-body">
                <div className="notification-title-row">
                  <strong>{notification.actorName}</strong>
                  <span>{notification.receivedAt}</span>
                </div>
                <p>{notification.content}</p>
              </div>
              {deleteMode && (
                <button
                  className={
                    selectedIds.includes(notification.id)
                      ? "notification-select-button selected"
                      : "notification-select-button"
                  }
                  type="button"
                  aria-label={
                    selectedIds.includes(notification.id)
                      ? "선택 해제"
                      : "삭제할 알림 선택"
                  }
                  onClick={(event) => {
                    event.stopPropagation();
                    toggleSelectedNotification(notification.id);
                  }}
                >
                  {selectedIds.includes(notification.id) ? (
                    <CheckCircle2 size={24} fill="currentColor" />
                  ) : (
                    <Circle size={24} />
                  )}
                </button>
              )}
            </article>
          ))}
          {visibleNotifications.length === 0 && (
            <div className="notification-empty">
              <Bell size={34} />
              <strong>표시할 알림이 없습니다.</strong>
            </div>
          )}
        </div>

        {deleteMode && (
          <div className="notification-delete-bar">
            <button
              className="notification-delete-selected"
              type="button"
              disabled={selectedIds.length === 0}
              onClick={handleDeleteSelected}
            >
              선택 알림 삭제
            </button>
            <button
              className="notification-delete-all"
              type="button"
              disabled={notifications.length === 0}
              onClick={handleDeleteAll}
            >
              전체 알림 삭제
            </button>
            <button className="notification-delete-cancel" type="button" onClick={cancelDeleteMode}>
              취소
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function ProfileAvatar({ name, avatar }) {
  if (avatar) {
    return <img className="notification-avatar" src={avatar} alt={`${name} 프로필`} />;
  }

  return (
    <span className="notification-avatar fallback" aria-label={`${name} 기본 프로필`}>
      {name.slice(0, 1)}
    </span>
  );
}
