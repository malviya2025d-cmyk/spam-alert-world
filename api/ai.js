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
        model: "llama3-8b-8192",
        messages: [
          { role: "system", content: "Detect if message is spam or safe. Give short answer." },
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await response.json();

    console.log(data); // DEBUG

    if (!data || !data.choices) {
      return res.status(200).json({
        reply: "⚠️ API issue: No valid response"
      });
    }

    return res.status(200).json({
      reply: data.choices[0].message.content
    });

  } catch (err) {
    return res.status(500).json({
      reply: "❌ Server error"
    });
  }
}
