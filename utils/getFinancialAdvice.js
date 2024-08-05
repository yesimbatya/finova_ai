"use server";

import OpenAI from "openai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  throw new Error(
    "The OPENAI_API_KEY environment variable is missing or empty."
  );
}

const openai = new OpenAI({ apiKey });

const extractTextFromPDF = async (fileData) => {
  if (!fileData) {
    return "No file data provided.";
  }
  const data = await pdfParse(Buffer.from(fileData));
  return data.text;
};

const getFinancialAdvice = async (formData) => {
  console.log("Received file data:", formData ? "Yes" : "No"); // Debug log

  try {
    // const pdfText = await extractTextFromPDF(fileData);
    const file = formData.get("file");

    const loader = new PDFLoader(file, { splitPages: false });
    const docs = await loader.load();

    const userPrompt = `
      Analyze the following financial data extracted from a PDF:
      ${docs[0].pageContent}
      
      Based on this data:
      1. Summarize the total income and total expenses if available.
      2. Create an optimal monthly budget using the 50/30/20 rule (50% for needs, 30% for wants, 20% for savings/debt repayment).
      3. Compare the current spending patterns with the optimal budget.
      4. Provide detailed financial advice to help the user manage their finances more effectively and adhere to the optimal budget.
      5. Include specific recommendations based on their current spending versus the optimal budget.
    `;

    console.log("Sending prompt to OpenAI");

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: userPrompt }],
      max_tokens: 800,
    });

    const advice = chatCompletion.choices[0].message.content;
    console.log("Received advice from OpenAI");
    return advice;
  } catch (error) {
    console.error("Error processing financial data or fetching advice:", error);
    return "Sorry, I couldn't process your financial data or fetch advice at this moment. Please try again later.";
  }
};

export default getFinancialAdvice;
