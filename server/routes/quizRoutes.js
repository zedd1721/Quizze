const express = require("express");
const router = express.Router();
const { protect} = require("../middlewares/authMiddleware");
const { createQuiz, deleteQuiz, getQuiz } = require("../controllers/quizController");

router.post("/create", createQuiz);
router.get("/getQuiz", getQuiz);
router.delete("/delete/:id", deleteQuiz);


module.exports = router;