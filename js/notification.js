function displayNotification(message) {
    const notificationElement = document.createElement("div");
    notificationElement.classList.add("notification-box");
    document.body.appendChild(notificationElement);

    const notificationText = document.createElement("p");
    notificationText.innerText = message;
    notificationElement.appendChild(notificationText);

    const closeButton = document.createElement("button");
    closeButton.classList.add("close-btn");
    closeButton.innerHTML = "×";
    closeButton.onclick = () => closeNotification(notificationElement);
    notificationElement.appendChild(closeButton);

    const notificationStatusBar = document.createElement("div");
    notificationStatusBar.classList.add("progressbar");
    notificationElement.appendChild(notificationStatusBar);

    setTimeout(() => {
        notificationStatusBar.style.width = "0%";
    }, 1);

    // Set timeout to close notification after 6 seconds
    const timeout = setTimeout(() => {
        closeNotification(notificationElement);
    }, 6001);

    // Store timeout ID to clear if closed manually
    notificationElement.dataset.timeoutId = timeout;
}

function closeNotification(element) {
    // Clear the timeout to prevent duplicate close attempts
    clearTimeout(Number(element.dataset.timeoutId));
    
    // Add closing animation class
    element.classList.add("closing");
    
    // Remove element after animation completes
    element.addEventListener("animationend", () => {
        element.remove();
    });
}