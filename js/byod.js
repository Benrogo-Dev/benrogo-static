async function registerBYOD(event) {
    const domain = document.getElementById("domain-input").value;
    if (domain) {
        registrationStatusResponse = await fetch("https://dev.benrogo.net/edge-api/registerBYOD", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                domain: domain
            })
        });
        registrationStatusJSON = await registrationStatusResponse.json();
        if (registrationStatusResponse.ok) {
            displayNotification(`The domain "${domain}" has been registered successfully!`);
        } else {
            displayNotification(`Error: ${registrationStatusJSON.error}`);
        }
        console.log(registrationStatusJSON);
    }
}

document.getElementById("submit-button").addEventListener("click", registerBYOD);