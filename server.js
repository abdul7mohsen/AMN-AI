import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import OpenAI from "openai";
import "dotenv/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(express.json());
app.use(express.static(join(__dirname, "static")));

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "static", "index.html"));
});

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: userMessage }],
      model: "gpt-4-1106-preview", // Use GPT-4.1 model
    });

    const aiReply = completion.choices[0].message.content;
    res.json({ reply: aiReply });
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    res.status(500).json({ error: "Failed to get response from AI" });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});