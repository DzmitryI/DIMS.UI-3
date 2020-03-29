const displayNotification = (message) => {
  const spawnNotification = (title) => {
    const notification = new Notification(title);
    setTimeout(notification.close.bind(notification), 4000);
  };

  if (message) {
    spawnNotification(message.title);
  }
};

export default displayNotification;
