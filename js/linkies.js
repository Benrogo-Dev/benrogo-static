// Element references
const linkTable = document.getElementById("linkies-body");
const backButton = document.getElementById("backbutton");
const forwardButton = document.getElementById("forwardbutton");
const pageNumber = document.getElementById("pagenumber");

// Number formatting
const formatObject = Intl.NumberFormat("en-US");

let sitesJSON;

// Utility Functions
const genRandHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

function shiftText(text, n) {
    n = n % text.length;
    return text.slice(n) + text.slice(0, n);
}

function invisObfuscate(str) {
    const invisibleChars = ["\u200B", "\u200C", "\u200D", "\u2060"];
    return str.split("").map(char => {
        let modifiedChar = char;
        if (Math.random() < 0.3) {
            modifiedChar += invisibleChars[Math.floor(Math.random() * invisibleChars.length)];
        }
        if (Math.random() < 0.2) {
            modifiedChar = `<span>${genRandHex(4)}</span>` + modifiedChar;
        }
        return modifiedChar;
    }).join("");
}

// Event Handlers
function handleRedirect(event) {
    event.preventDefault();
    let hrefChunks = event.target.href.split("/");
    let id = Number(hrefChunks[hrefChunks.length - 1]);
    console.log(sitesJSON[id]);
    window.open(atob(sitesJSON[id]["u"]), "_blank");
}

// Main Function to Fetch and Display Sites
async function getSites() {
    const urlParams = new URLSearchParams(window.location.search);
    const linksPage = Number(urlParams.get("page")) || 1;
    pageNumber.innerText = linksPage;

    // Handle back button
    if (linksPage === 1) {
        backButton.classList.add("page-button-hidden");
    } else {
        backButton.href = `/linkies?page=${linksPage - 1}`;
    }

    // Check if next page exists
    const nextPageStatusResponse = await fetch(`https://benrogo.net/edge-api/getPageStatus?page=${linksPage + 1}`);
    const nextPageStatus = await nextPageStatusResponse.json();
    if (nextPageStatus) {
        forwardButton.href = `/linkies?page=${linksPage + 1}`;
    } else {
        forwardButton.classList.add("page-button-hidden");
    }

    // Fetch and decode site data
    const edgeAPIResponse = await fetch(`https://benrogo.net/edge-api/getSites?page=${linksPage}`);
    const edgeAPIText = await edgeAPIResponse.text();
    const [shiftedText, shiftValue] = edgeAPIText.split(":");
    const unshiftedText = shiftText(shiftedText, Number(shiftValue) * -1);
    sitesJSON = JSON.parse(atob(unshiftedText));

    // Populate table
    sitesJSON.forEach((site, i) => {
        let url = atob(site["u"]);
        let requests = site["r"];
        let status = site["s"];
        let statusText = status === 0 ? "linkey-offline" : status === 2 ? "linkey-unknown" : "linkey-online";

        let tableRow = document.createElement("tr");
        
        let rankColumn = document.createElement("td");
        rankColumn.innerText = i + (80 * (linksPage - 1)) + 1;
        tableRow.appendChild(rankColumn);
        
        let linkColumn = document.createElement("td");
        let link = document.createElement("a");
        link.href = `/${genRandHex(16)}/${i}`;
        link.innerHTML = invisObfuscate(url);
        link.draggable = false;
        link.target = "_blank";
        link.classList.add(statusText);
        link.addEventListener("click", handleRedirect);
        linkColumn.appendChild(link);
        tableRow.appendChild(linkColumn);
        
        let requestsColumn = document.createElement("td");
        requestsColumn.innerText = formatObject.format(requests);
        console.log(requestsColumn.text);
        tableRow.appendChild(requestsColumn);
        
        linkTable.appendChild(tableRow);
    });
}

document.addEventListener("load", getSites());