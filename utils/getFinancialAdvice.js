"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Financial Advice Utility - Powered by Google Gemini
 * Dieter Rams: "Good design is innovative"
 */

const apiKey = process.env.GOOGLE_API_KEY;

// Initialize Gemini
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

const getFinancialAdvice = async (formData, context = null) => {
  if (!genAI) {
    console.error("Google API key not configured");
    return "AI service is not configured. Please contact support.";
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    let userPrompt = "";

    // If file data is provided (PDF analysis)
    if (formData && formData.get) {
      const file = formData.get("file");

      if (file) {
        try {
          // Read file as array buffer and convert to base64
          const arrayBuffer = await file.arrayBuffer();
          const base64Data = Buffer.from(arrayBuffer).toString("base64");

          // Use Gemini's multimodal capability to analyze PDF
          const result = await model.generateContent([
            {
              inlineData: {
                mimeType: "application/pdf",
                data: base64Data,
              },
            },
            {
              text: `You are a professional financial advisor. Analyze this financial document and:

1. Summarize the total income and total expenses if available.
2. Create an optimal monthly budget using the 50/30/20 rule (50% for needs, 30% for wants, 20% for savings/debt repayment).
3. Compare the current spending patterns with the optimal budget.
4. Provide detailed financial advice to help the user manage their finances more effectively.
5. Include specific, actionable recommendations.

Keep your response concise but helpful. Use bullet points for clarity.`,
            },
          ]);

          const response = await result.response;
          return response.text();
        } catch (pdfError) {
          console.error("Error processing PDF:", pdfError);
          return "I couldn't read the PDF file. Please make sure it's a valid PDF document.";
        }
      }
    }
    // If context is provided (text-based query)
    else if (context) {
      const { totalBudget, totalIncome, totalSpend, query } = context;

      userPrompt = `
        You are a professional financial advisor for Finova, an AI-powered finance app.

        User's Current Financial Snapshot:
        - Total Budget Allocated: $${totalBudget || 0}
        - Total Income: $${totalIncome || 0}
        - Total Expenses: $${totalSpend || 0}
        - Remaining: $${(totalBudget || 0) - (totalSpend || 0)}

        User's Question: "${query || "Give me general financial advice"}"

        Provide helpful, personalized financial advice based on their situation.
        Be concise, practical, and encouraging. Use bullet points when listing tips.
        If they're over budget, gently point it out and suggest ways to cut back.
        If they're doing well, acknowledge it and suggest optimizations.
      `;
    }
    // Default fallback
    else {
      userPrompt = `
        You are a professional financial advisor. Provide general financial advice
        covering budgeting basics, the 50/30/20 rule, and tips for saving money.
        Keep it concise and actionable.
      `;
    }

    console.log("Sending prompt to Gemini");

    const result = await model.generateContent(userPrompt);
    const response = await result.response;
    const advice = response.text();

    console.log("Received advice from Gemini");
    return advice;
  } catch (error) {
    console.error("Error processing financial data or fetching advice:", error);

    // Provide more specific error messages
    if (error.message?.includes("API key")) {
      return "AI service configuration error. Please check your API key.";
    }
    if (error.message?.includes("quota")) {
      return "AI service is temporarily unavailable due to high demand. Please try again later.";
    }

    return "Sorry, I couldn't process your request at this moment. Please try again later.";
  }
};

export default getFinancialAdvice;
