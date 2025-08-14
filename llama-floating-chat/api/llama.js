import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Message is required" });

  try {
    const hfResponse = await fetch(
      "https://api-inference.huggingface.co/models/meta-llama/Llama-3.1-8B-Instruct",
      {
        method: "POST",
        headers: {
          "Authorization": "Bearer YOUR_HUGGINGFACE_TOKEN",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: message, options: { wait_for_model: true } }),
      }
    );

    const data = await hfResponse.json();
    let text = "No response";
    if (Array.isArray(data) && data[0]?.generated_text) text = data[0].generated_text;
    else if (data.error) text = data.error;

    res.status(200).json({ text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}