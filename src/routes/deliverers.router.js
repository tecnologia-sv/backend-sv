const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();

const deliverersController = require("../controllers/deliverers.controller");

// route for creating grocer from web app
router.post("/deliverer/create", upload.any(), deliverersController.deliverersCreate);
router.get("/deliverer/:id", deliverersController.delivererGetById);

module.exports = router;
