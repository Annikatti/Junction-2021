const activeFilters = [];
const username = null;
let latestMessages = null;

function addWord() {
    const filterBy = document.getElementById("filter-by");
    activeFilters.push(filterBy.value.trim());
    filterBy.value = "";

    document.getElementById("active-filters").innerHTML = activeFilters;
}

function setFilter(filterOn) {
    document.getElementById("filtered-words").style.color = filterOn ? 'black' : 'grey';
}

function changeTab(newTab) {
    ["play", "store", "settings"].forEach(tab => {
        if (newTab === tab) {
            document.getElementById(tab).classList.add("display");
            document.getElementById(`${tab}-button`).classList.add("active");
        } else {
            document.getElementById(tab).classList.remove("display");
            document.getElementById(`${tab}-button`).classList.remove("active");
        }
    })
}

function getLatestMessages() {
    const xmlHttp = new XMLHttpRequest();

    try {
        xmlHttp.open("GET", 'https://us-central1-junction-2021-fee21.cloudfunctions.net/webApi/api/v1/messages', false);
        xmlHttp.send(null);
        latestMessages = JSON.parse(xmlHttp.responseText).sort((a, b) => a.data.createdAt > b.data.createdAt);

        const chatWindow = document.getElementById("chat");
        chatWindow.innerHTML = "";
        latestMessages.forEach(message => {
            const messageContainer = document.createElement("div");
            messageContainer.setAttribute("class", "message-container");
            messageContainer.setAttribute("id", message.id);

            const messageContent = document.createElement("p");
            messageContent.innerHTML = `${message.data.username}: ${message.data.message}`;
            messageContent.setAttribute("class", "message-content");

            const messageCreatedAt = document.createElement("p");
            messageCreatedAt.innerHTML = message.data.createdAt;
            messageCreatedAt.setAttribute("class", "message-created-at");

            messageContainer.appendChild(messageContent);
            messageContainer.appendChild(messageCreatedAt);
            chatWindow.appendChild(messageContainer);
        })
    } catch (error) {
        console.log(error);
    }
}

function changeUsername() {
    username = document.getElementById("username").value;
}

function emphatizeMessage(messageContent) {
    const xmlHttp = new XMLHttpRequest();

    try {
        xmlHttp.open("POST", '', true);
        xmlHttp.setRequestHeader('Content-Type', 'application/json');
        xmlHttp.send(JSON.stringify({ "message": messageContent }));
        xmlHttp.onload = () => postMessage(xmlHttp.responseText);
    } catch (error) {
        console.log(error);
    }
}

function postMessage(messageContent) {
    const xmlHttp = new XMLHttpRequest();
    try {
        xmlHttp.open("POST", 'https://us-central1-junction-2021-fee21.cloudfunctions.net/webApi/api/v1/message', true);
        xmlHttp.setRequestHeader('Content-Type', 'application/json');
        xmlHttp.send(JSON.stringify({ "username": username, "message": messageContent }));
        xmlHttp.onload = () => getLatestMessages();
    } catch (error) {
        console.log(error);
    }
}

async function sendMessage() {
    if (!username) {
        alert("You need to give a username!");
        return;
    }

    const messageElement = document.getElementById("message");
    // emphatizeMessage(messageElement.value);
    postMessage(messageElement.value);
    messageElement.value = "";
}