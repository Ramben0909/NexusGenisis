import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const PERPLEX_API_KEY = process.env.PERPLEX_KEY;

// 🧩 Prompt builder for future predictions and business scope
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

// 🎯 Controller — future insights
export const getFutureInsights = async (req, res) => {
  try {
    const { domain, company, topN, bottomN } = req.body;

    if (!domain) {
      return res.status(400).json({
        success: false,
        message: "The 'domain' field is required.",
      });
    }

    if (!PERPLEX_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "Perplexity API key is not configured on the server.",
      });
    }

    const prompt = buildFuturePrompt(domain, company, topN, bottomN);

    console.log("🔮 Generated Future Insight Prompt:\n", prompt);

    const response = await axios.post(
      "https://api.perplexity.ai/chat/completions",
      {
        model: "sonar-pro", // high-reasoning model for forecasts
        messages: [
          {
            role: "system",
            content:
              "You are a market futurist specializing in predicting business growth, market dynamics, and emerging investment opportunities.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${PERPLEX_API_KEY}`,
        },
        timeout: 60000,
      }
    );

    const answer =
      response.data?.choices?.[0]?.message?.content ||
      "No detailed forecast received from Perplexity.";

    const citations = response.data?.citations || [];

    res.status(200).json({
      success: true,
      source: "Perplexity",
      query: { domain, company, topN, bottomN },
      result: answer,
      citations,
    });
  } catch (error) {
    console.error("❌ Perplexity Future Insights API Error:", error.message);
    if (error.response) {
      console.error("Response Data:", error.response.data);
    }

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch future insights from Perplexity. Check your API key or request format.",
      error: error.response?.data || error.message,
    });
  }
};
