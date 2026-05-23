const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Gemini API
const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/sanitize-review', async (req, res) => {
  try {
    const { reviewText, targetUserId, reviewerLocation } = req.body;
    
    if (!reviewText) {
      return res.status(400).json({ error: 'Review text is required' });
    }

    const prompt = `
      You are a HIPAA compliance strict gatekeeper. 
      Read the following medical professional review. 
      Identify ANY patient names, specific dates of birth, or Protected Health Information (PHI). 
      Replace those infractions exactly with "[Redacted Patient Info]". 
      Do not change the rest of the text.
      Return the output strictly as a JSON object with a single key "sanitized_text".
      
      Review: "${reviewText}"
    `;

    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const response = await model.generateContent(prompt);
    
    const outputText = response.response.text();
    let parsedResult;
    try {
      parsedResult = JSON.parse(outputText);
    } catch (e) {
      // Fallback if not valid JSON
      parsedResult = { sanitized_text: reviewText };
    }

    // Format final JSON payload for the frontend to inject into Firestore
    const validatedPayload = {
      target_userId: targetUserId,
      review_text: parsedResult.sanitized_text || reviewText,
      reviewer_location: reviewerLocation || null,
      timestamp: new Date().toISOString()
    };

    res.json(validatedPayload);

  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ error: 'Failed to process review' });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`MedBadge Gatekeeper API running on port ${PORT}`);
});
