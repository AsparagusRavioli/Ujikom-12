const express = require("express");
const router = express.Router();
const petugasController = require("../controllers/petugasController");

// Melihat semua laporan yang sudah di-approve
router.get("/approved", petugasController.getApproved);

// Melihat laporan yang sudah dapat task (tindak lanjut)
router.get("/tasks", petugasController.getWithTask);

// Petugas mengambil tugas
router.put("/tasks/take/:id", petugasController.takeTask);

module.exports = router;


// const router = require("express").Router();
// const petugas = require("../controllers/petugasController");

// router.get("/approved", petugas.getApproved);
// router.get("/with-task", petugas.getWithTask);
// router.put("/take/:id", petugas.takeTask);

// module.exports = router;
