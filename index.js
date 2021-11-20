const activeFilters = [];
const socket = io();
let username = null;

requestAnimationFrame(() => {
    const chatWindow = document.getElementById("chat");
    chatWindow.value = "";
})

socket.on('chat message', (message) => appendMessage(message));

function sendMessage() {
    const messageElement = document.getElementById("message").value;
    const user = document.getElementById("username");
    username = user.value;

    socket.emit('chat message', {
        username: username,
        message: messageElement.value
    });

    messageElement.value = "";
}

function appendMessage(message) {
    const currentUser = message.data.username === username;

    const messageContainer = document.createElement("div");
    messageContainer.setAttribute("class", "message-container");
    messageContainer.setAttribute("id", message.id);

    if (currentUser) {
        messageContainer.style.backgroundColor = "#6b0772";
        messageContainer.style.textAlign = "right";
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