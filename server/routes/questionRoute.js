const express = require("express");
const router = express.Router();
const {protect} = require("../middlewares/authMiddleware");
const { createQuestion, deleteQuestion, updateQuestion, deleteOption } = require("../controllers/questionController");

router.post("/create", protect, createQuestion);
router.put("/update/:id", protect, updateQuestion);
router.delete("/delete/:id", protect, deleteQuestion);
router.delete("/delete/option/:id", protect, deleteOption);



module.exports = router;