import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY_Query,
});

// 🧠 Same prompt builder (unchanged)
const buildPrompt = (domain, company, topN, bottomN) => {
  let prompt = `You are a global financial analyst and market researcher.
Your task is to generate an in-depth market performance report on the domain "${domain}".`;

  if (company) {
    prompt += ` Include a detailed performance analysis of the company "${company}" — covering market capitalization, valuation trends, profitability, revenue growth rate, P/E ratio, EPS, ROE, ROI, and stock price movement in the past year.`;
  }

  if (topN) {
    prompt += ` Identify and list the top ${topN} companies in the "${domain}" sector based on stock growth, revenue, profitability, and innovation index. Compare their financial performance and strategic advantages.`;
  }

  if (bottomN) {
    prompt += ` Also identify the bottom ${bottomN} companies within this sector, explaining their financial or operational challenges leading to underperformance.`;
  }

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

// 🎯 Controller using Groq SDK
export const getDomainInsight = async (req, res) => {
  try {
    const { domain, company, topN, bottomN } = req.body;

    if (!domain) {
      return res.status(400).json({
        success: false,
        message: "The 'domain' field is required.",
      });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "Groq API key is not configured.",
      });
    }

    const prompt = buildPrompt(domain, company, topN, bottomN);

    console.log("📊 Prompt:\n", prompt);

    // 🚀 Groq SDK call
    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
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
      temperature: 0.3,
      max_tokens: 2000,
    });

    const answer =
      completion.choices?.[0]?.message?.content ||
      "No response from Groq.";

    res.status(200).json({
      success: true,
      source: "Groq SDK",
      query: { domain, company, topN, bottomN },
      result: answer,
    });
  } catch (error) {
    console.error("❌ Groq SDK Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch insights from Groq.",
      error: error.message,
    });
  }
};