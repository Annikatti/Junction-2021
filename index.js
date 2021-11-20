const activeFilters = [];
let username = null;
let latestMessages = null;

function pageload(){
    var message1 = "gg"
    var message2 = "Good job guys!"
    var message3 = "Thank you!"

    console.log(localStorage.getItem("username"));
    document.getElementById("uname").innerHTML = localStorage.getItem("username");
    document.getElementById("message1").innerHTML= localStorage.getItem("username") +": "+ message1
    document.getElementById("message2").innerHTML= localStorage.getItem("username") +": "+ message2
    document.getElementById("message3").innerHTML= localStorage.getItem("username") +": "+ message3
}

requestAnimationFrame(() => {
    getLatestMessages();
    document.getElementById("username").value = username;
});

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
        latestMessages = JSON.parse(xmlHttp.responseText).sort((a, b) => a.data.createdAt > b.data.createdAt ? 1 : -1);
        usersInteractions(latestMessages);
        const chatWindow = document.getElementById("chat");
        chatWindow.innerHTML = "";
        latestMessages.forEach(message => {
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
        })
    } catch (error) {
        console.log(error);
    }
}

function postMessage(messageContent) {
    xmlHttp.open("POST", 'https://us-central1-junction-2021-fee21.cloudfunctions.net/webApi/api/v1/message', true);
    xmlHttp.setRequestHeader('Content-Type', 'application/json');
    xmlHttp.send(JSON.stringify({ "username": username, "message": messageContent }));
    xmlHttp.onload = () => getLatestMessages();
}

async function sendMessage() {
    username = localStorage.getItem("username");

    const messageElement = document.getElementById("message");
    postMessage(messageElement.value);
    messageElement.value = "";
}

function usersInteractions(messageJson){
    var messageAmount = 0;
    var recent =[]
    for (i=0; i<messageJson.length; i++){
        if (messageJson[i].data.username === localStorage.getItem("username")){
            recent.push(messageJson[i].data.message)
            messageAmount ++;
        }
        i++
    }
    console.log(recent)
    document.getElementById("message1").innerHTML= localStorage.getItem("username") +": "+ recent[recent.length-3]
    document.getElementById("message2").innerHTML= localStorage.getItem("username") +": "+ recent[recent.length-2]
    document.getElementById("message3").innerHTML= localStorage.getItem("username") +": "+ recent[recent.length-1]
  
}

