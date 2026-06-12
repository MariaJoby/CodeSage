const Review = require("../models/Review");
const analyzeCode = require("../utils/ai");

exports.createReview = async (req, res) => {
  try {
    const { language, code } = req.body;

    const result = await analyzeCode(code, language);

    const review = await Review.create({
      user: req.user._id,
      language,
      code,
      summary: result.summary,
      score: result.score,
      issues: result.issues,
      suggestions: result.suggestions,
    });

    res.json(review);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Review failed",
    });
  }
};

exports.getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Unable to fetch reviews",
    });
  }
};

exports.getAnalytics = async (req, res) => {
    try {
      const reviews = await Review.find({
        user: req.user._id,
      });
  
      const totalReviews = reviews.length;
  
      const averageScore =
        totalReviews > 0
          ? Math.round(
              reviews.reduce(
                (sum, review) => sum + review.score,
                0
              ) / totalReviews
            )
          : 0;
  
      const bestScore =
        totalReviews > 0
          ? Math.max(
              ...reviews.map((r) => r.score)
            )
          : 0;
  
      const languageCount = {};
      const languageScores = {};
  
      reviews.forEach((review) => {
        const lang = review.language;
  
        languageCount[lang] =
          (languageCount[lang] || 0) + 1;
  
        languageScores[lang] =
          (languageScores[lang] || 0) +
          review.score;
      });
  
      const mostUsedLanguage =
        Object.keys(languageCount).length > 0
          ? Object.keys(languageCount).reduce(
              (a, b) =>
                languageCount[a] >
                languageCount[b]
                  ? a
                  : b
            )
          : "N/A";
  
      const languageStats = Object.keys(
        languageCount
      ).map((lang) => ({
        language: lang,
        reviews: languageCount[lang],
        averageScore: Math.round(
          languageScores[lang] /
            languageCount[lang]
        ),
      }));
  
      res.json({
        totalReviews,
        averageScore,
        bestScore,
        mostUsedLanguage,
        languageStats,
      });
  
    } catch (error) {
      console.log(error);
  
      res.status(500).json({
        message: "Analytics failed",
      });
    }
  };