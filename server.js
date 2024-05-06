const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// OpenAI Route
app.post("/openai", async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 100,
        temperature: 0.7,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );
    console.log("Received prompt:", req.body.prompt); // Check if prompt is correct
    console.log("OpenAI response:", response.data); // Log the entire OpenAI response

    console.log("OpenAI Response Received");
    res.json({ result: response.data.choices[0].message.content });
  } catch (error) {
    console.error("Error with OpenAI", error);
    res.status(500).json({ error: "Error communicating with OpenAI" });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
