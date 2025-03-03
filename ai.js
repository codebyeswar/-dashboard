document.addEventListener("DOMContentLoaded", function () {
  const inputField = document.getElementById("chatInput");

  inputField.addEventListener("input", function () {
      this.style.height = "40px"; // Reset height
      this.style.height = Math.min(this.scrollHeight, 150) + "px"; // Expand but limit max height
  });

  inputField.addEventListener("keydown", function (event) {
      if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault(); // Prevents default Enter behavior (new line)
          // You can add a function here to send the message if needed
      }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const inputField = document.getElementById("chatInput");
  const sendButton = document.getElementById("sendBtn");

  function updateButtonState() {
      const inputText = inputField.value.trim();

      if (inputText.length > 0) {
          sendButton.innerHTML = "➤"; // Arrow icon
          sendButton.classList.add("active");
          sendButton.classList.remove("empty", "processing");
      } else {
          sendButton.innerHTML = "~"; // Wave icon
          sendButton.classList.add("empty");
          sendButton.classList.remove("active", "processing");
      }
  }

  // Listen for input changes
  inputField.addEventListener("input", updateButtonState);

  // Simulating AI response state
  function simulateAIResponse() {
      sendButton.innerHTML = "⏸️"; // Pause icon
      sendButton.classList.add("processing");
      sendButton.classList.remove("active", "empty");

      setTimeout(() => {
          sendButton.innerHTML = "~"; // Reset to wave icon
          sendButton.classList.add("empty");
          sendButton.classList.remove("processing", "active");
      }, 3000); // Simulate AI processing time
  }

  // On send button click (demo purposes)
  sendButton.addEventListener("click", function () {
      if (sendButton.classList.contains("active")) {
          simulateAIResponse();
          inputField.value = ""; // Clear input
          updateButtonState(); // Reset button state
      }
  });

  // Initialize state on load
  updateButtonState();
});

document.addEventListener("DOMContentLoaded", function () {
  const chatDisplay = document.getElementById("chatDisplay");
  const inputField = document.getElementById("chatInput");
  const sendButton = document.getElementById("sendBtn");

  // Initial greeting message
  const greetingDiv = document.createElement("div");
  greetingDiv.classList.add("greeting-container");
  greetingDiv.innerHTML = `
      <h2>Hi, I am</h2>
      <h1>BABLU</h1>
      <p>I am your personal diet chatbot</p>
  `;
  chatDisplay.appendChild(greetingDiv);

  // Function to remove greeting when chat starts
  function removeGreeting() {
      if (document.contains(greetingDiv)) {
          greetingDiv.remove();
      }
  }

  // Function to add messages
  function addMessage(text, isUser) {
      if (!text.trim()) return; // Prevent empty messages

      removeGreeting(); // Remove greeting when first message is sent

      const messageDiv = document.createElement("div");
      messageDiv.classList.add(isUser ? "user-message" : "bot-message");
      messageDiv.textContent = text;

      chatDisplay.appendChild(messageDiv); // Messages appear at the bottom

      // Gradually scroll up when a new message arrives
      setTimeout(() => {
          chatDisplay.scrollTo({
              top: chatDisplay.scrollHeight,
              behavior: "smooth" // Makes scrolling smooth like ChatGPT
          });
      }, 100);
  }

  // Simulate bot reply
  function botReply() {
      setTimeout(() => {
          addMessage("Nice to meet you i am bablu from perinthalmanna hehehehehe !", false); // Replace with real AI response
          sendButton.innerHTML = "~"; // Reset button to wave icon
          sendButton.classList.add("empty");
          sendButton.classList.remove("processing", "active");
      }, 1500);
  }

  // Send message function
  function sendMessage() {
      if (sendButton.classList.contains("active")) {
          const userMessage = inputField.value.trim();
          if (userMessage) {
              addMessage(userMessage, true); // Add user message
              inputField.value = ""; // Clear input field
              sendButton.innerHTML = "⏸️"; // Show pause icon
              sendButton.classList.add("processing");
              sendButton.classList.remove("active", "empty");

              botReply(); // Simulate bot response
          }
      }
  }

  // Handle button click
  sendButton.addEventListener("click", sendMessage);

  // Handle Enter key press
  inputField.addEventListener("keydown", function (event) {
      if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault(); // Prevents new line
          sendMessage(); // Trigger message send
      }
  });

  // Update send button state dynamically
  function updateButtonState() {
      const inputText = inputField.value.trim();
      if (inputText.length > 0) {
          sendButton.innerHTML = "➤"; // Arrow icon
          sendButton.classList.add("active");
          sendButton.classList.remove("empty", "processing");
      } else {
          sendButton.innerHTML = "~"; // Wave icon
          sendButton.classList.add("empty");
          sendButton.classList.remove("active", "processing");
      }
  }

  // Listen for input changes
  inputField.addEventListener("input", updateButtonState);

  // Initialize button state
  updateButtonState();
});

