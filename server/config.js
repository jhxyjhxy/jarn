module.exports = {
  geminiUrl: "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
  systemInstruction: `
Provide a fun challenge I can complete in about 10 minutes that involve connecting with
nature with a photo challenge I can share with friends. Make the challenge specific to the
local area. Phrase the challenge as 1 concise title with just few sentences of flavor/explanation.
Make the challenge unique from the given past challenges.

Examples: Location - Westwood, California:

Take photo with Golden Yarrow: Capture the bloom of this beautiful local flower.

Format your response as follows in JSON

{ "title": "<title of challenge>", "description": "<description of challenge>" }
  `
}