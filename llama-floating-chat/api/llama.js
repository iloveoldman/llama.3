import fetch from "node-fetch";

export default async function handler(req, res) {
    if (req.method === "POST") {
        try {
            const { message } = req.body;

            // Call your Hugging Face LLaMA model
            const hfResponse = await fetch("https://api-inference.huggingface.co/models/meta-llama/Llama-3.1-8B-Instruct", {
                method: "POST",
                headers: {
                    "Authorization": "Bearer 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", // replace with your token
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    inputs: message,
                    options: { wait_for_model: true }
                })
            });

            const data = await hfResponse.json();

            const text = Array.isArray(data) && data[0]?.generated_text
                ? data[0].generated_text
                : "Error: No response from model";

            res.status(200).json({ text });

        } catch (err) {
            console.error(err);
            res.status(500).json({ text: "Server error" });
        }
    } else {
        res.status(405).json({ text: "Method Not Allowed" });
    }
}
