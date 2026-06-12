const express = require("express");
const router = express.Router();
const analyzeCode = require("../utils/ai");
const { protect } = require("../middleware/authMiddleware");

const {
  createReview,
  getMyReviews,
  getAnalytics,
} = require("../controllers/reviewController");

router.post("/", protect, createReview);

router.get("/history", protect, getMyReviews);

router.get("/analytics", protect, getAnalytics);

router.post("/explain", protect, async (req, res) => {
  try {
    const { issue } = req.body;

    const { GoogleGenAI } = require("@google/genai");

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
Explain this programming issue in very simple terms.

Issue:
${issue}

Give:
1. What it means
2. Why it is bad
3. A small example
4. How to fix it

Keep the explanation beginner-friendly.
`,
    });

    res.json({
      explanation: response.text,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message:
        error.status === 503
          ? "Gemini is busy. Try again in a moment."
          : "Explanation failed",
    });
  }
});

module.exports = router;