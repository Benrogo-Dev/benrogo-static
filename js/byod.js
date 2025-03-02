function registerBYOD(event) {
    event.preventDefault();
    const domain = document.getElementById("domain-input").value;
    console.log(domain);
}

document.getElementById("submit-button").addEventListener("submit", registerBYOD);