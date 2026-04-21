import express from "express";
import cors from "cors";

const app = express();

app.use(cors()); // 🔥 ESTO ES CLAVE
app.use(express.json());


app.post("/claude", async (req, res) => {
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "TU_API_KEY",
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("Servidor en http://localhost:3000"));