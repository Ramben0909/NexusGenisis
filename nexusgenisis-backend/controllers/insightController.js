import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * 🧩 Prompt builder (same as before)
 */
const buildFuturePrompt = (domain, company, topN, bottomN) => {
  let prompt = `You are a senior market strategist and business forecaster.
Your task is to generate a forward-looking market and business growth forecast for the domain "${domain}".
Provide insights for the next 5–10 years, focusing on global trends, technology evolution, and investment potential.`;

  if (company) {
    prompt += ` Include a predictive analysis for "${company}" — covering projected valuation, innovation potential, market share expansion, R&D initiatives, and long-term competitiveness within the ${domain} industry.`;
  }

  if (topN) {
    prompt += ` Identify and discuss the top ${topN} emerging or established companies likely to dominate this domain in the coming years, with reasoning based on innovation pipelines, strategic positioning, and funding growth.`;
  }

  if (bottomN) {
    prompt += ` Also mention the bottom ${bottomN} companies or sectors likely to decline, explaining key risks, lack of innovation, or changing consumer behavior trends.`;
  }

  prompt += `
Present the final report in this format:
1️⃣ Domain Future Outlook (2025–2035)
2️⃣ Emerging Market Trends
3️⃣ Technological or Policy Drivers
4️⃣ Company/Investment Forecast
5️⃣ Risks & Challenges
6️⃣ Business Scope & Opportunities
7️⃣ Expert Summary (Actionable Insights)

Be specific, analytical, and use available factual or trend-based forecasting data where possible.
`;

  return prompt;
};

/**
 * 🎯 Controller — Groq version
 */
export const getFutureInsights = async (req, res) => {
  try {
    const { domain, company, topN, bottomN } = req.body;

    if (!domain) {
      return res.status(400).json({
        success: false,
        message: "The 'domain' field is required.",
      });
    }

    const prompt = buildFuturePrompt(domain, company, topN, bottomN);

    console.log("🔮 Requesting Groq for domain:", domain);

    // 🔥 Groq API call
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile", // best for reasoning
      messages: [
        {
          role: "system",
          content:
            "You are a market futurist specializing in predicting business growth and investment opportunities.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.5,
    });

    const answer = response.choices[0]?.message?.content || "";

    res.status(200).json({
      success: true,
      source: "Groq (LLaMA 3.3)",
      query: { domain, company, topN, bottomN },
      result: answer,
      citations: [], // ❌ Groq doesn't support built-in Google grounding like Gemini
    });
  } catch (error) {
    console.error("❌ Groq API Backend Error:", error.message);

    res.status(500).json({
      success: false,
      message: "AI generation failed. Check your GROQ_API_KEY.",
      error: error.message,
    });
  }
};
