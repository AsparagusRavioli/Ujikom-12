const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Register
router.post("/register", userController.register);

// Login
router.post("/login", userController.login);

// CREATE LAPORAN
router.post("/laporan", userController.createLaporan);

// READ SEMUA LAPORAN USER
router.get("/laporan/user/:userId", userController.getMyLaporan);

// READ LAPORAN BY ID
router.get("/laporan/:laporanId", userController.getLaporanById);

// UPDATE LAPORAN
router.put("/laporan/:laporanId", userController.updateLaporan);

// DELETE LAPORAN
router.delete("/laporan/:laporanId", userController.deleteLaporan);

module.exports = router;


// const router = require("express").Router();
// const user = require("../controllers/userController");

// router.post("/register", user.register);
// router.post("/laporan", user.createLaporan);
// router.get("/laporan/:userId", user.getMyLaporan);
// router.put("/laporan/edit/:laporanId", user.updateLaporan);
// router.delete("/laporan/delete/:laporanId", user.deleteLaporan);

// module.exports = router;
