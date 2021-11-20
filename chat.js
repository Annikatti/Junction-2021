const activeFilters = [];
const socket = io();
const uniqueMessages = new Set();
let username = null;

requestAnimationFrame(() => document.getElementById("uname").innerHTML = localStorage.getItem("username"));

socket.on('chat message', (message) => {
    appendMessage(message);
    const sendMessage = document.getElementById('message');
    sendMessage.scrollIntoView();
});

function sendMessage() {
    const messageElement = document.getElementById("message");
    const user = document.getElementById("username");
    username = user.value;

    socket.emit('chat message', {
        username: username,
        message: messageElement.value
    });

    messageElement.value = "";
}

function appendMessage(message) {
    // Don't add duplicate messages
    if (uniqueMessages.has(message.data.id)) {
        return;
    }

    uniqueMessages.push(message.data.id);
    const chatWindow = document.getElementById("chat");
    const currentUser = message.data.username === username;

    const messageContainer = document.createElement("div");
    messageContainer.setAttribute("class", "message-container");
    messageContainer.setAttribute("id", message.id);

    if (currentUser) {
        messageContainer.classList.add('current-user');
    }

    const messageContent = document.createElement("p");
    messageContent.innerHTML = `${message.data.username}: ${message.data.message}`;
    messageContent.setAttribute("class", "message-content");

    const messageCreatedAt = document.createElement("p");
    messageCreatedAt.innerHTML = message.data.createdAt;
    messageCreatedAt.setAttribute("class", "message-created-at");

    messageContainer.appendChild(messageContent);
    messageContainer.appendChild(messageCreatedAt);
    chatWindow.appendChild(messageContainer);
}

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

function usersInteractions(messageJson) {
    var recent = []
    for (i = 0; i < messageJson.length; i++) {
        if (messageJson[i].data.username === localStorage.getItem("username")) {
            recent.push(messageJson[i].data.message);
        }

        i++;
    }

    for (i = 1; i <= 3; i++) {
        if (i <= recent - 1) {
            document.getElementById("message" + i).innerHTML = localStorage.getItem("username") + ": " + recent[recent.length - i];
        }
    }

}
