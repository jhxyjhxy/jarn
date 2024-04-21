module.exports = {
  geminiUrl: "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
  systemInstruction: `
Provide a fun photo challenge anyone can complete in about 10 minutes that involves going
outside and connecting with nature. Participants should take a fun picture they can share
with friends. Make the challenge specific to the local area provided. Phrase the challenge
as 1 concise title with just few sentences of flavor/explanation. Make the challenge unique
from the given past challenges.

Examples:

1. La Jolla, United States

{
  "title": "Sunbathing with Seals",
  "description": "Head to La Jolla Cove or Children's Pool and capture a photo of the seals basking in the sun.  Try to get a close-up shot without disturbing them!"
}

2. Chicago, United States

{
  "title": "Bean There, Done That",
  "description": "Head to Millennium Park and snap a creative photo with Cloud Gate (aka \"The Bean\"). Reflection shots, funny poses, or capturing the cityscape in the bean's reflection are all fair game!"
}

3. Milwaukee, United States

{
  "title": "Lakeshore Stroll Selfie",
  "description": "Take a walk along the Lake Michigan shoreline and snap a selfie with the beautiful lake in the background. Bonus points for capturing the Milwaukee Art Museum or the iconic Hoan Bridge in your shot!"
}

4. Mexico City, Mexico

{
  "title": "Zocalo Stroll",
  "description": "Head to the Zocalo, the main square of Mexico City, and capture a photo of the bustling atmosphere. Include the Metropolitan Cathedral, Palacio Nacional, or the Templo Mayor in your shot!"
}

5. St. Petersburg, United States

{
  "title": "Feathered Friend",
  "description": "St. Petersburg is home to a variety of bird species. Explore a local park or waterfront area and snap a photo of a feathered friend perched on a branch, soaring through the sky, or wading in the water. Capture the beauty and diversity of our avian neighbors."
}

6. Kyoto, Japan

{
  "title": "Temple Tranquility",
  "description": "Kyoto is renowned for its stunning temples. Find a peaceful corner within a temple garden and capture the serene beauty of the architecture, moss-covered stones, and carefully raked gravel. Let the tranquility of the space shine through your photo."
}

7. Addis Ababa, Ethiopia

{
  "title": "Coffee Ceremony Capture",
  "description": "The Ethiopian coffee ceremony is a cherished tradition. If you have the opportunity to witness or participate in one, capture the essence of this cultural experience. Focus on the jebena (traditional coffee pot), the roasting process, or the pouring of the coffee, highlighting the aromas and social connection."
}

8. Split, Croatia

{
  "title": "Adriatic Azure",
  "description": "Head to the Riva promenade or Marjan Hill for breathtaking views of the Adriatic Sea. Capture the vibrant turquoise water, the boats dotting the horizon, and the coastline stretching into the distance."
}

Format your response as follows in JSON

{ "title": "<title of challenge>", "description": "<description of challenge>" }
  `
}