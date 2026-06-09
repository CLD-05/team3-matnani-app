export async function updateNotificationSetting(enabled) {
  return enabled;
}

export async function markNotificationAsRead(notificationId) {
  return { notificationId };
}

export async function markAllNotificationsAsRead() {
  return true;
}

export async function deleteNotifications(notificationIds) {
  return [...notificationIds];
}

export async function deleteAllNotifications() {
  return true;
}
