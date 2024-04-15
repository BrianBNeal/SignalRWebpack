import * as signalR from "@microsoft/signalr";
import "./css/main.css";

const divMessages: HTMLDivElement = document.querySelector("#divMessages");
const tbMessage: HTMLInputElement = document.querySelector("#tbMessage");
const btnSend: HTMLButtonElement = document.querySelector("#btnSend");
const typing: HTMLDivElement = document.querySelector("#divTyping");
const username = new Date().getTime();

const connection = new signalR.HubConnectionBuilder()
    .withUrl("/hub")
//    .withUrl("/hubs/chat", { accessTokenFactory: () => this.loginToken })
    .build();

connection.on("newMessageNotification", (username: string, message: string) => {
    const m = document.createElement("div");

    m.innerHTML = `<div class="message-author">${username}</div><div>${message}</div>`;

    divMessages.appendChild(m);
    divMessages.scrollTop = divMessages.scrollHeight;
});

connection.on("userTypingNotification", username => {
    //display a message saying "so-and-so is typing..."
    const paragraph = `<p>${username} is typing...</p>`
    typing.innerHTML = paragraph;

    //remove the message after a timer expires
    tryRefreshTimer();

})

connection.start().catch((err) => document.write(err));

tbMessage.addEventListener("keyup", (e: KeyboardEvent) => {
    console.log("keyup");
    if (e.key === "Enter") {
        sendNewMessage();
    } else {
        sendUserTyping();
    }
});

//event listeners will be in the the React Component, import the repo methods
btnSend.addEventListener("click", sendNewMessage);

//these functions would go in a front-end conntectionRepo or something similar
function sendUserTyping() {
    connection.send("userTypingEndpoint", username);
}

function sendNewMessage() {
    //this method doesn't wait on a response, the Promise resolves immediately once the message is sent by the client
    connection.send("newMessageEndpoint", username, tbMessage.value)
        .then(() => {
            tbMessage.value = "";
        }); 
}

function tryRefreshTimer() {

}