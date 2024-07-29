const socket = io();

let name;
let textarea = document.querySelector('#textarea');
let messageArea = document.querySelector('.message__area');
let userId = generateUserId();

do {
  name = prompt('Please enter your name: ');
} while (!name);

textarea.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    sendMessage(e.target.value);
  }
});

function generateUserId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

function sendMessage(message) {
  let msg = {
    user: name,
    userId: userId,
    message: message.trim()
  };
  // Append message to the DOM
  appendMessage(msg, 'outgoing');
  textarea.value = '';
  scrollToBottom();

  // Send to server
  socket.emit('message', msg);
}

function appendMessage(msg, type) {
  let mainDiv = document.createElement('div');
  let className = type;
  mainDiv.classList.add(className, 'message');

  let markup = `
    <h4>${msg.user}</h4>
    <p>${msg.message}</p>
  `;
  mainDiv.innerHTML = markup;
  messageArea.appendChild(mainDiv);
}

// Ensure this event listener is added only once
socket.on('message', (msg) => {
  if (msg.userId !== userId) {
    appendMessage(msg, 'incoming');
  }
  scrollToBottom();
});

function scrollToBottom() {
  messageArea.scrollTop = messageArea.scrollHeight;
}
