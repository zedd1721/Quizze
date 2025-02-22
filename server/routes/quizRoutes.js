const express = require("express");
const router = express.Router();
const { protect} = require("../middlewares/authMiddleware");
const { createQuiz, deleteQuiz, getQuiz } = require("../controllers/quizController");

router.post("/create",protect, createQuiz);
router.get("/getQuiz", protect, getQuiz);
router.delete("/delete/:id", protect, deleteQuiz);


module.exports = router;