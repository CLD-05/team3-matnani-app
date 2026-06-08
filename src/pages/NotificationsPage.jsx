import React, { useMemo, useState } from "react";
import { Bell, ChevronLeft, MoreVertical, Settings } from "lucide-react";

const notificationFilters = ["전체", "예약", "댓글", "거래"];

export function NotificationsPage({
  currentUser,
  notifications,
  onNavigate,
  onReadNotification,
  onReadAllNotifications,
}) {
  const [filter, setFilter] = useState("전체");
  const unreadCount = notifications.filter((notification) => notification.unread).length;

  const visibleNotifications = useMemo(
    () =>
      notifications.filter((notification) =>
        filter === "전체" ? true : notification.type === filter,
      ),
    [filter],
  );

  const handleNotificationOpen = (notification) => {
    onReadNotification(notification.id);
    onNavigate(notification.targetPath);
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
            <button type="button" aria-label="알림 설정">
              <Settings size={22} />
            </button>
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
              <button
                className="notification-more"
                type="button"
                aria-label="알림 더보기"
                onClick={(event) => event.stopPropagation()}
              >
                <MoreVertical size={17} />
              </button>
            </article>
          ))}
          {visibleNotifications.length === 0 && (
            <div className="notification-empty">
              <Bell size={34} />
              <strong>표시할 알림이 없습니다.</strong>
            </div>
          )}
        </div>
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
