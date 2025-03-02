function displayNotification(message) {
    notificationElement = document.createElement("div");
    notificationElement.classList.add("notification-box");
    document.body.appendChild(notificationElement);

    notificationText = document.createElement("p");
    notificationText.innerText = message;
    notificationElement.appendChild(notificationText);

    notificationStatusBar = document.createElement("div");
    notificationStatusBar.classList.add("progressbar");
    notificationElement.appendChild(notificationStatusBar);

    setTimeout(() => {
        notificationStatusBar.style.width = "0%";
    }, 1)

    setTimeout(() => {
        notificationElement.remove();
    }, 6001)
}