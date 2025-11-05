import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const PERPLEX_API_KEY = process.env.PERPLEX_KEY;

// 🧠 Build a dynamic and reasoning-based financial analysis prompt
const buildPrompt = (domain, company, topN, bottomN) => {
  let prompt = `You are a global financial analyst and market researcher.
Your task is to generate an in-depth market performance report on the domain "${domain}".`;

  // If a company is provided → focus analysis on that
  if (company) {
    prompt += ` Include a detailed performance analysis of the company "${company}" — covering market capitalization, valuation trends, profitability, revenue growth rate, P/E ratio, EPS, ROE, ROI, and stock price movement in the past year.`;
  }

  // If top companies are requested
  if (topN) {
    prompt += ` Identify and list the top ${topN} companies in the "${domain}" sector based on stock growth, revenue, profitability, and innovation index. Compare their financial performance and strategic advantages.`;
  }

  // If bottom companies are requested
  if (bottomN) {
    prompt += ` Also identify the bottom ${bottomN} companies within this sector, explaining their financial or operational challenges leading to underperformance.`;
  }

  // Always add conclusion
  prompt += ` Present your findings with structured sections:
1️⃣ Domain Overview  
2️⃣ Financial and Market Performance Summary  
3️⃣ Company Analysis (if applicable)  
4️⃣ Top Performers  
5️⃣ Lagging Performers  
6️⃣ Market Outlook (Risks, Opportunities, Future Trends)

Be factual, concise, and provide approximate figures or market comparisons based on the most recent global data available.`;

  return prompt;
};

// 🎯 Main controller function
export const getDomainInsight = async (req, res) => {
  try {
    const { domain, company, topN, bottomN } = req.body;

    if (!domain) {
      return res.status(400).json({
        success: false,
        message: "The 'domain' field is required.",
      });
    }

    // Safety check
    if (!PERPLEX_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "Perplexity API key is not configured on the server.",
      });
    }

    const prompt = buildPrompt(domain, company, topN, bottomN);

    console.log("📊 Generated Market Research Prompt:\n", prompt);

    // 🛰️ Perplexity Chat API Call (for reasoning + factual data)
    const response = await axios.post(
      "https://api.perplexity.ai/chat/completions",
      {
        model: "sonar-pro", // factual reasoning model
        messages: [
          {
            role: "system",
            content:
              "You are a senior financial analyst who provides structured, data-driven market research and company performance reports.",
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

    // 🧾 Extract response safely
    const answer =
      response.data?.choices?.[0]?.message?.content ||
      "No detailed response received from Perplexity.";

    // Citations (if provided)
    const citations = response.data?.citations || [];

    res.status(200).json({
      success: true,
      source: "Perplexity",
      query: { domain, company, topN, bottomN },
      result: answer,
      citations,
    });
  } catch (error) {
    console.error("❌ Perplexity API Error:", error.message);
    if (error.response) {
      console.error("Response Data:", error.response.data);
    }

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch insights from Perplexity. Check your API key, model, or request format.",
      error: error.response?.data || error.message,
    });
  }
};
