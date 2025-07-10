function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

// Add a message to the chat
function addMessage(content, isUser = false, useTypewriter = false) {
  const messageDiv = document.createElement("div");
  messageDiv.className = `message2 ${isUser ? "user-message2" : "ai-message2"}`;

  // Avatar/Icon
  if (!isUser) {
    const avatar = document.createElement("div");
    avatar.className = "ai-avatar";
    avatar.innerHTML = `<svg width="28" height="28" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#667eea"/><text x="16" y="21" text-anchor="middle" fill="#fff" font-size="16" font-family="Arial" dy=".3em">🤖</text></svg>`;
    messageDiv.appendChild(avatar);
  }

  // Message bubble
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  if (isUser) bubble.classList.add("user-bubble");

  // Timestamp
  const time = document.createElement("span");
  time.className = "timestamp";
  time.textContent = formatTime(new Date());

  // Typewriter effect for AI
  if (useTypewriter && !isUser) {
    let i = 0;
    bubble.textContent = "";
    function type() {
      if (i < content.length) {
        bubble.textContent += content.charAt(i);
        i++;
        setTimeout(type, 18 + Math.random() * 30);
        chatBox.scrollTop = chatBox.scrollHeight;
      } else {
        bubble.appendChild(time);
      }
    }
    type();
  } else {
    bubble.textContent = content;
    bubble.appendChild(time);
  }

  messageDiv.appendChild(bubble);
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Send message logic
async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;
  addMessage(message, true);
  userInput.value = "";
  chatBox.scrollTop = chatBox.scrollHeight;

  // Show typing indicator (optional)
  // addMessage("...", false);

  // Call your backend API
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });
    const data = await res.json();
    addMessage(data.response || "Sorry, I couldn't get a response.", false, true);
  } catch (err) {
    addMessage("Error contacting AI server.", false, true);
  }
}

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") sendMessage();
});

// Welcome message
window.addEventListener("load", function () {
  setTimeout(() => {
    addMessage("Hello! I'm your AI assistant. How can I help you today?", false, true);
  }, 400);
  userInput.focus();
});