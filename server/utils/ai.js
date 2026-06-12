const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function analyzeCode(code, language) {
    const prompt = `
    You are a senior software engineer conducting a professional code review.
    
    Analyze the following ${language} code.
    
    Score the code from 0-100 based on:
    - Correctness
    - Readability
    - Maintainability
    - Best practices
    - Error handling
    
    Do not heavily penalize simple programs for being short.
    
    Return ONLY valid JSON in this exact format:
    
    {
      "summary": "string",
      "score": number,
      "issues": ["issue1"],
      "suggestions": ["suggestion1"]
    }
    
    Code:
    
    ${code}
    `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  const text = response.text;

const cleanedText = text
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

console.log("Gemini Response:");
console.log(cleanedText);

return JSON.parse(cleanedText);
}

module.exports = analyzeCode;