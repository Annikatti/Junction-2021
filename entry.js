function setUsername(){
    localStorage.setItem("username",document.getElementById("userInput").value);
    window.location.href = "chat.html";
}