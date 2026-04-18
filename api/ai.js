export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Only POST allowed" });
  }

  try {
    const { prompt } = req.body;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gemma2-9b-it",   // ✅ NEW WORKING MODEL (IMPORTANT)
        messages: [
          { role: "user", content: `Check this message and reply only Spam or Safe: ${prompt}` }
        ]
      })
    });

    const data = await response.json();

    console.log("API DATA:", data);

    if (data.error) {
      return res.status(200).json({
        reply: "❌ " + data.error.message
      });
    }

    return res.status(200).json({
      reply: data.choices?.[0]?.message?.content || "❌ No AI reply"
    });

  } catch (err) {
    return res.status(500).json({
      reply: "❌ Server error"
    });
  }
}
