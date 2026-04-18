export default async function handler(req, res) {

if (req.method !== "POST") {
  return res.status(405).json({ reply: "Only POST allowed" });
}

try {

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ reply: "No prompt provided" });
  }

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",  // ✅ correct model
      messages: [
        {
          role: "system",
          content: "Reply short, clean, no symbols like ### or ---"
        },
        {
          role: "user",
          content: prompt
        }
      ]
    })
  });

  const data = await response.json();

  console.log("API RESPONSE:", data);

  if (!response.ok) {
    return res.status(500).json({
      reply: "❌ API Error",
      error: data
    });
  }

  const reply = data?.choices?.[0]?.message?.content;

  if (!reply) {
    return res.status(500).json({
      reply: "❌ No reply from AI",
      full: data
    });
  }

  return res.status(200).json({ reply });

} catch (error) {
  return res.status(500).json({
    reply: "❌ Server Error",
    error: error.message
  });
}
}
