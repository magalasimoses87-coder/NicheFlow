// NicheFlow V9 API Foundation

const express = require("express");
const router = express.Router();

const progress = [];

router.post("/lessons/:id/complete", (req, res) => {
  const { userId } = req.body;

  const record = {
    userId,
    lessonId: req.params.id,
    xp: 50,
    completedAt: new Date()
  };

  progress.push(record);

  res.json({
    success: true,
    reward: "+50 XP",
    progress: record
  });
});

router.get("/users/:id/progress", (req, res) => {
  res.json(
    progress.filter(p => p.userId == req.params.id)
  );
});

module.exports = router;