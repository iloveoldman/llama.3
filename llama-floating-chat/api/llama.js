// api/llama.js
import fetch from "node-fetch";

export default async function handler(req, res) {
    if (req.method === "POST") {
        try {
            const { message } = req.body;
            if (!message) {
                return res.status(400).json({ text: "No message provided" });
            }

            // Replace this with your Hugging Face LLaMA model URL
            const HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/meta-llama/Llama-3.1-8B-Instruct";
            const HUGGINGFACE_API_TOKEN = process.env.HF_API_TOKEN; // Store securely in Vercel env vars

            const hfResponse = await fetch(HUGGINGFACE_API_URL, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${HUGGINGFACE_API_TOKEN}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ inputs: message, options: { wait_for_model: true } })
            });

            if (!hfResponse.ok) {
                const errorText = await hfResponse.text();
                console.error("Hugging Face error:", errorText);
                return res.status(hfResponse.status).json({ text: `Model error: ${errorText}` });
            }

            const data = await hfResponse.json();
            const responseText = Array.isArray(data) && data[0].generated_text ? data[0].generated_text : "No response";

            return res.status(200).json({ text: responseText });

        } catch (error) {
            console.error("Error in LLaMA handler:", error);
            return res.status(500).json({ text: "Internal server error" });
        }
    } else {
        res.status(405).json({ text: "Method Not Allowed" });
    }
}
