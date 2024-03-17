const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-btn");
const chatContainer = document.querySelector(".chat-container");
const themeButton = document.querySelector("#theme-btn");
const deleteButton = document.querySelector("#delete-btn");

const API_KEY = "";

let userText = null;

const creatElement = (html, className) => {
  const chatDiv = document.createElement("div");
  chatDiv.classList.add("chat", className);
  chatDiv.innerHTML = html;
  return chatDiv;
};

const loadDataFromLocalStorage = () => {
  const defaultText = `
       <div class="default-text">
          <img src="/images/chatbot.jpg" alt="">
          <h1>How can I help you today?</h1>
          <p></p>
      </div>
    `;

  chatContainer.innerHTML = localStorage.getItem("all-chats") || defaultText;
};

loadDataFromLocalStorage();

const getChatResponse = async (incomingChatDiv) => {
  const API_URL = "https://api.openai.com/v1/chat/completions";
  const pElement = document.createElement("p");

  const requestData = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant.",
      },
      {
        role: "user",
        content: `${userText}`,
      },
    ],
  };
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(requestData),
  };
  try {
    const response = await (await fetch(API_URL, requestOptions)).json();
    pElement.textContent = response.choices[0].message.content;
    console.log(pElement);
  } catch (error) {
    console.log(error);
    pElement.classList.add("error");
    pElement.textContent = "Oooooooppppps";
  }
  incomingChatDiv.querySelector(".typing-animation").remove();
  incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
  localStorage.setItem("all-chats", chatContainer.innerHTML);
};

const showTypingAnimation = () => {
  const html = `
    <div class="chat-content">
    <div class="chat-details">
      <img src="/images/chatbot.jpg" alt="" />
      <div class="typing-animation">
        <div class="typing-dot" style="--delay: 0.2s"></div>
        <div class="typing-dot" style="--delay: 0.3s"></div>
        <div class="typing-dot" style="--delay: 0.4s"></div>
      </div>
    </div>
  </div>
    `;
  const incomingChatDiv = creatElement(html, "incoming");
  chatContainer.appendChild(incomingChatDiv);
  getChatResponse(incomingChatDiv);
};

const handleOutGoingChat = () => {
  userText = chatInput.value.trim();
  console.log(userText);
  if (!userText) return;
  const html = `
    <div class="chat-content">
        <div class="chat-details">
           <img src="/images/user.jpg" alt="" />
           <p></p>
        </div>
    </div>
    `;
  const outgoingChatDiv = creatElement(html, "outgoing");
  outgoingChatDiv.querySelector("p").textContent = userText;
  document.querySelector(".default-text")?.remove();
  chatContainer.appendChild(outgoingChatDiv);
  setTimeout(showTypingAnimation, 500);
};

sendButton.addEventListener("click", handleOutGoingChat);

themeButton.addEventListener("click", () => {
  window.document.body.classList.toggle("light-mode");
  themeButton.innerText = document.body.classList.contains("light-mode")
    ? "dark_mode"
    : "light_mode";
});

deleteButton.addEventListener("click", () => {
  if (confirm("Tüm sohbetleri silmek istiyor musunuz?")) {
    localStorage.removeItem("all-chats");
    loadDataFromLocalStorage();
  }
});

console.log();
