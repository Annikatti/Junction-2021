const activeFilters = [];
const recent = []
const socket = io();
const uniqueMessages = new Set();

requestAnimationFrame(() => document.getElementById("uname").innerHTML = localStorage.getItem("username"));

socket.on('chat message', (message) => {
    appendMessage(message);
    const messageTextarea = document.getElementById('message');
    messageTextarea.scrollIntoView();
});

socket.on('inappropriate message', () => {
    window.location.href = "hangman.html";
});

function sendMessage() {
    const messageElement = document.getElementById("message");

    socket.emit('chat message', {
        username: localStorage.getItem("username"),
        message: messageElement.value
    });

    messageElement.value = "";
    usersInteractions(messageElement.value);
}

function appendMessage(message) {
    // Don't add duplicate messages
    if (uniqueMessages.has(message.id)) {
        return;
    }

    uniqueMessages.add(message.data.id);
    const chatWindow = document.getElementById("chat");
    const currentUser = message.data.username === localStorage.getItem("username");

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

function usersInteractions(message) {
    recent.push(message);
    if (recent.length === 3) {
        recent[2] = recent[1];
        recent[1] = recent[0];
        recent[0] = message;
    }

    for (i = 0; i < recent.length; i++) {
        document.getElementById("message" + i + 1).innerHTML = `${localStorage.getItem("username")}: ${message}`;
    }
}
