// api/llama.js
import fetch from "node-fetch"; // Needed if you call external APIs

export default async function handler(req, res) {
    if (req.method === "POST") {
        try {
            const { message } = req.body;
            if (!message) {
                return res.status(400).json({ text: "No message provided" });
            }

            // Example: Replace this with your actual LLaMA API call
            // For now, it just echoes back the message for testing
            const responseText = `Echo: ${message}`;

            // Send back JSON response
            return res.status(200).json({ text: responseText });

        } catch (error) {
            console.error("Error in LLaMA handler:", error);
            return res.status(500).json({ text: "Internal server error" });
        }
    } else {
        res.status(405).json({ text: "Method Not Allowed" });
    }
}
