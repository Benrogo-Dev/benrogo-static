// Special sauce 🤫
const formatObject = Intl.NumberFormat("en-US");
const linkTable = document.getElementById("linkies-body");
const backButton = document.getElementById("backbutton");
const forwardButton = document.getElementById("forwardbutton");
const pageNumber = document.getElementById("pagenumber");

function shiftText(text, n) {
    n = n % text.length;
    return text.slice(n) + text.slice(0, n);
}

async function getSites() {
    const urlParams = new URLSearchParams(window.location.search);
    const linksPage = Number(urlParams.get("page")) || 1;

    pageNumber.innerText = linksPage;
    if (linksPage === 1) {
        backButton.classList.add("page-button-hidden");
    } else {
        backButton.href = `/linkies?page=${linksPage - 1}`;
    }

    const nextPageStatusResponse = await fetch(
        `/edge-api/getPageStatus?page=${linksPage + 1}`
    );

    const nextPageStatus = await nextPageStatusResponse.json();

    if (nextPageStatus === true) {
        forwardButton.href = `/linkies?page=${linksPage + 1}`;
    } else {
        forwardButton.classList.add("page-button-hidden");
    }

    const edgeAPIResponse = await fetch(
        `/edge-api/getSites?page=${linksPage}`
    );

    const edgeAPIText = await edgeAPIResponse.text();

    const shiftValue = Number(edgeAPIText.split(":")[1]);

    const shiftedText = edgeAPIText.split(":")[0];
    const unshiftedText = shiftText(shiftedText, shiftValue * -1);
    const decodedText = atob(unshiftedText);
    const sitesJSON = JSON.parse(decodedText);

    for (let i = 0; i < sitesJSON.length; i++) {
        let url = atob(sitesJSON[i]["u"]);
        let requests = sitesJSON[i]["r"];
        let status = sitesJSON[i]["s"];
        let statusText = "linkey-online";
        if (status === 0) {
            statusText = "linkey-offline";
        } else if (status === 2) {
            statusText = "linkey-unknown"
        }

        let tableRow = document.createElement("tr");
        let rankColumn = document.createElement("td")
        rankColumn.innerText = i + (80 * (linksPage - 1)) + 1;
        tableRow.appendChild(rankColumn);

        let linkColumn = document.createElement("td");
        let link = document.createElement("a");
        link.href = url;
        link.text = url;
        link.draggable = false;
        link.target = "_blank";
        link.classList.add(statusText);
        linkColumn.appendChild(link);
        tableRow.appendChild(linkColumn);

        let requestsColumn = document.createElement("td");
        requestsColumn.innerText = formatObject.format(requests);
        console.log(requestsColumn.text);
        tableRow.appendChild(requestsColumn);

        linkTable.appendChild(tableRow);
    }
}

document.addEventListener("load", getSites());