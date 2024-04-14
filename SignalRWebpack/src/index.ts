import * as signalR from "@microsoft/signalr";
import "./css/main.css";

const divMessages: HTMLDivElement = document.querySelector("#divMessages");
const tbMessage: HTMLInputElement = document.querySelector("#tbMessage");
const btnSend: HTMLButtonElement = document.querySelector("#btnSend");
const username = new Date().getTime();

const connection = new signalR.HubConnectionBuilder()
    .withUrl("/hub")
    .build();

connection.on("messageReceived", (username: string, message: string) => {
    const m = document.createElement("div");

    m.innerHTML = `<div class="message-author">${username}</div><div>${message}</div>`;

    divMessages.appendChild(m);
    divMessages.scrollTop = divMessages.scrollHeight;
});

connection.on("userTyping", username => {
    //display a message saying "so-and-so is typing..."

    //remove the message after a timer expires

})

connection.start().catch((err) => document.write(err));

tbMessage.addEventListener("keyup", (e: KeyboardEvent) => {
    if (e.key === "Enter") {
        send();
    } else {
        notify();
    }
});

btnSend.addEventListener("click", send);

function notify() {
    connection.send("userTyping", username)
        .then(() => {
            //notify the timer here?
        })        ;
}

function send() {
    connection.send("newMessage", username, tbMessage.value)
        .then(() => (tbMessage.value = "")); //this method doesn't wait on a response, the Promise resolves immediately once the message is sent by the client
}