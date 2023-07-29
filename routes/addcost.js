const express = require("express");
const router = express.Router();
const costController = require("../controllers/costController");

router.post("/", costController.addCostItem);

module.exports = router;
