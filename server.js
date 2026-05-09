const express = require("express");
const cors = require("cors");
const axios = require("axios");
const path = require("path");
const fs = require("fs");

require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.get("/", (req, res) => {
res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/chat", async (req, res) => {
try {

const userMessage = req.body.message;

const response = await axios.post(
  "https://openrouter.ai/api/v1/chat/completions",
  {
    model: "deepseek/deepseek-chat:free",

    messages: [
      {
        role: "system",
        content: `

Tu es ChatBWG, un assistant IA intelligent créé par Christian Bwanga.

Christian Bwanga est ton créateur, développeur et propriétaire.

Ton nom est ChatBWG.

Tu peux parler toutes les langues naturellement :
français, anglais, swahili, espagnol, arabe, etc.

Tu aides les utilisateurs avec respect et précision.
`
},

      {
        role: "user",
        content: userMessage
      }
    ]
  },

  {
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json"
    }
  }
);

const botReply =
  response.data.choices[0].message.content;

const chatData = {
  user: userMessage,
  bot: botReply,
  time: new Date()
};

let chats = [];

if (fs.existsSync("chats.json")) {
  chats = JSON.parse(
    fs.readFileSync("chats.json")
  );
}

chats.push(chatData);

fs.writeFileSync(
  "chats.json",
  JSON.stringify(chats, null, 2)
);
await supabase.from("messages").insert([
  {
    user_message: userMessage,
    bot_reply: botReply
  }
]);
res.json({
  reply: botReply
});

} catch (error) {

console.log(error.response?.data || error.message);

res.status(500).json({
  reply: "Erreur serveur"
});

}
});

app.post("/image", async (req, res) => {

try {

const response = await axios.post(
  "https://openrouter.ai/api/v1/images/generations",

  {
    model: "openai/dall-e-3",
    prompt: req.body.prompt
  },

  {
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json"
    }
  }
);

res.json({
  image: response.data.data[0].url
});

} catch (error) {

console.log(error.response?.data || error.message);

res.status(500).json({
  error: "Erreur génération image"
});

}
});

app.get("/chats", (req, res) => {

if (!fs.existsSync("chats.json")) {
return res.send("Aucune conversation.");
}

const chats = JSON.parse(
fs.readFileSync("chats.json")
);

let html = `

  <html>
  <head>
    <title>ChatBWG Conversations</title><style>
  body{
    font-family: Arial;
    background:#111;
    color:white;
    padding:20px;
  }

  .chat{
    background:#222;
    padding:15px;
    margin-bottom:15px;
    border-radius:10px;
  }

  .user{
    color:#00ff99;
  }

  .bot{
    color:#00bfff;
  }
</style>

  </head>  <body><h1>Conversations ChatBWG</h1>

`;

chats.reverse().forEach(chat => {

html += `
  <div class="chat">

    <p class="user">
      <b>Utilisateur:</b>
      ${chat.user}
    </p>

    <p class="bot">
      <b>IA:</b>
      ${chat.bot}
    </p>

    <small>
      ${chat.time}
    </small>

  </div>
`;

});

html += "</body> </html>";

res.send(html);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
console.log(`Serveur lancé sur le port ${PORT}`);
});
