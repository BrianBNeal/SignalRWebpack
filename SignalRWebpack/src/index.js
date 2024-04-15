"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var signalR = require("@microsoft/signalr");
require("./css/main.css");
var divMessages = document.querySelector("#divMessages");
var tbMessage = document.querySelector("#tbMessage");
var btnSend = document.querySelector("#btnSend");
var typing = document.querySelector("#divTyping");
var username = new Date().getTime();
var connection = new signalR.HubConnectionBuilder()
    .withUrl("/hub")
    .build();
connection.on("messageReceived", function (username, message) {
    var m = document.createElement("div");
    m.innerHTML = "<div class=\"message-author\">".concat(username, "</div><div>").concat(message, "</div>");
    divMessages.appendChild(m);
    divMessages.scrollTop = divMessages.scrollHeight;
});
connection.on("userTyping", function (username) {
    //display a message saying "so-and-so is typing..."
    var paragraph = "<p>".concat(username, " is typing...</p>");
    typing.innerHTML = paragraph;
    //remove the message after a timer expires
    notifyTimer();
});
connection.start().catch(function (err) { return document.write(err); });
tbMessage.addEventListener("keyup", function (e) {
    console.log("keyup");
    if (e.key === "Enter") {
        sendNewMessage();
    }
    else {
        notifyUserTyping();
    }
});
//event listeners will be in the the React Component, import the repo methods
btnSend.addEventListener("click", sendNewMessage);
//these functions would go in a front-end conntectionRepo or something similar
function notifyUserTyping() {
    connection.send("userTyping", username);
}
function sendNewMessage() {
    //this method doesn't wait on a response, the Promise resolves immediately once the message is sent by the client
    connection.send("newMessage", username, tbMessage.value)
        .then(function () {
        tbMessage.value = "";
    });
}
function notifyTimer() {
}
