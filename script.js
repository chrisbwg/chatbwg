const input = document.getElementById("user-input");
const button = document.getElementById("send-btn");
const chatBox = document.getElementById("chat-box");

let conversationHistory = [];

function addMessage(text, className) {

  const message = document.createElement("div");

  message.classList.add("message");
  message.classList.add(className);

  message.innerHTML = text;

  chatBox.appendChild(message);

  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {

  const userText = input.value.trim();

  if(userText === "") return;

  addMessage(userText, "user-message");
  conversationHistory.push({
  role: "user",
  content: userText
});
  input.value = "";

  try {
if(userText.startsWith("/image")) {

  const prompt = userText.replace("/image", "");

  const imageResponse = await fetch(
    "https://chatbwg.onrender.com/image",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        prompt: prompt
      })
    }
  );

  const imageData = await imageResponse.json();

  addMessage(
    `<img src="${imageData.image}" style="max-width:100%; border-radius:12px;">`,
    "bot-message"
  );

  return;
}
    const response = await fetch(
      "https://chatbwg.onrender.com/chat",
      {
        method: "POST",

        headers: {
          "Content-Type":
          "application/json"
        },
       body: JSON.stringify({
      message: userText,
      messages: conversationHistory
    })

      }
    );

    const data = await response.json();

    addMessage(
      data.reply,
      "bot-message"
    );
   conversationHistory.push({
     role: "assistant",
     content: data.reply
   });

  } catch(error) {

    addMessage(
      "Erreur connexion serveur",
      "bot-message"
    );
    // faire parler IA
const speech =
new SpeechSynthesisUtterance(
  data.reply
);

speech.lang = "fr-FR";

speechSynthesis.speak(speech);

  }

}

button.addEventListener(
  "click",
  sendMessage
);

input.addEventListener(
  "keypress",
  function(e){

    if(e.key === "Enter"){
      sendMessage();
    }

  }
);
const micBtn =
document.getElementById("mic-btn");

const userInput =
document.getElementById("user-input");

const SpeechRecognition =
window.SpeechRecognition ||
window.webkitSpeechRecognition;

const recognition =
new SpeechRecognition();

recognition.lang = "fr-FR";

recognition.onresult =
(event) => {

  const text =
  event.results[0][0].transcript;

  userInput.value = text;

};

micBtn.addEventListener(
  "click",
  () => {

    recognition.start();

  }
);
