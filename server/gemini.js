const { GoogleGenerativeAI } = require("@google/generative-ai");
const config = require("./config");
require('dotenv').config();

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest", systemInstruction: { parts: [{ text: config.systemInstruction }] } });

// Get challenge
const generateChallenge = async (location, pastChallenges) => {
  console.log('gemini generating challenge')
  const trimmedChallenges = pastChallenges.map(({ title, description }) => ({ title, description }));
  const prompt = `Location: ${location}\n\nPast Challenges: ${JSON.stringify(trimmedChallenges)}`
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  return text;
}

module.exports = {
  model,
  generateChallenge
}