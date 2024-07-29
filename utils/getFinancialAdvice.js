"use server";

import OpenAI from "openai";

// Add a log to verify the environment variable
const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
console.log("OpenAI API Key:", apiKey);

if (!apiKey) {
  throw new Error(
    "The OPENAI_API_KEY environment variable is missing or empty; either provide it, or instantiate the OpenAI client with an apiKey option, like new OpenAI({ apiKey: 'My API Key' })."
  );
}

// Initialize the OpenAI client with the API key
const openai = new OpenAI({
  apiKey,
});

const getFinancialAdvice = async (totalBudget, totalIncome, totalSpend) => {
  console.log("Parameters received:", { totalBudget, totalIncome, totalSpend });
  try {
    const userPrompt = `
      Based on the following financial data:
      - Total Budget: ${totalBudget} USD 
      - Expenses: ${totalSpend} USD 
      - Incomes: ${totalIncome} USD
      Provide detailed financial advice in 2 sentences to help the user manage their finances more effectively.
    `;

    console.log("Sending prompt to OpenAI:", userPrompt);

    // Send the prompt to the OpenAI API
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: userPrompt }],
    });

    // Process and return the response
    const advice = chatCompletion.choices[0].message.content;
    console.log("Received advice from OpenAI:", advice);
    return advice;
  } catch (error) {
    console.error("Error fetching financial advice:", error);
    return "Sorry, I couldn't fetch the financial advice at this moment. Please try again later.";
  }
};

export default getFinancialAdvice;
