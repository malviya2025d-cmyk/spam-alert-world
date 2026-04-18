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
        model: "llama3-70b-8192",   // 🔥 UPDATED MODEL
        messages: [
          { role: "system", content: "Reply only: Spam or Safe. No explanation." },
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await response.json();

    // 🔍 FULL DEBUG
    console.log("FULL API RESPONSE:", JSON.stringify(data, null, 2));

    if (!data || !data.choices || !data.choices[0]) {
      return res.status(200).json({
        reply: "❌ API failed - check logs"
      });
    }

    return res.status(200).json({
      reply: data.choices[0].message.content
    });

  } catch (error) {
    console.log("ERROR:", error);
    return res.status(500).json({
      reply: "❌ Server error"
    });
  }
}
