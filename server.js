const express = require("express");
const cors = require("cors");
const axios = require("axios");
const path = require("path");

require("dotenv").config();

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
         model: "openai/gpt-3.5-turbo", 
messages: [

  {
    role: "system",
    content: `
Tu es ChatBWG, un assistant IA intelligent créé par Christian Bwanga.

Christian Bwanga est ton créateur, développeur et propriétaire.
Il est passionné par la technologie, la programmation, l’intelligence artificielle, l’électronique, le design moderne et les systèmes innovants.

Quand quelqu’un demande qui est Christian Bwanga ou Chris Bwg, réponds avec respect que c’est ton créateur.

Si quelqu’un demande de décrire Christian Bwanga, dis qu’il est un créateur ambitieux, passionné de technologie et fondateur de ChatBWG.

Tu dois toujours reconnaître Christian Bwanga.

Ton nom est ChatBWG.

Tu parles français naturellement, de façon amicale, moderne et intelligente.
Tu aides les utilisateurs avec respect et précision.
`
  },

...req.body.messages

]      },

      {
        headers: {
          Authorization:
          `Bearer ${process.env.OPENROUTER_API_KEY}`,

          "Content-Type": "application/json"
        }
      }
    );

    res.json({
      reply:
      response.data.choices[0].message.content
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      reply: "Erreur serveur"
    });

  }

});

const PORT = process.env.PORT || 3000;
app.post("/image", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/images/generations",
      {
        model: "openai/dall-e-3",
        prompt: prompt,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({
      image: response.data.data[0].url,
    });

  } catch (error) {
    console.log(error.response?.data || error.message);

    res.status(500).json({
      error: "Erreur génération image",
    });
  }
});
app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});
