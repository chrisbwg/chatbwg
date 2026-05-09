const express = require("express");
const cors = require("cors");
const axios = require("axios");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

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

  {
    role: "user",
    content: userMessage
  }

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

app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});
