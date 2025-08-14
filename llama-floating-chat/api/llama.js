import fetch from "node-fetch"; // Vercel supports fetch natively, but node-fetch is safer for older versions

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ text: "No message provided" });
    }

    try {
      // Call your Hugging Face model
      const response = await fetch(
        "https://api-inference.huggingface.co/models/meta-llama/Llama-3.1-8B-Instruct",
        {
          method: "POST",
          headers: {
            "Authorization": "Bearer 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",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: message,
            options: { wait_for_model: true },
          }),
        }
      );

      const data = await response.json();
      const text = Array.isArray(data) && data[0]?.generated_text ? data[0].generated_text : "No response";
      res.status(200).json({ text });
    } catch (err) {
      console.error(err);
      res.status(500).json({ text: "Error calling LLaMA model" });
    }

  } else {
    res.status(405).json({ text: "Method Not Allowed" });
  }
}
