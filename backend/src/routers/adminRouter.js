// // const express = require("express");
// // const router = express.Router();
// // const adminController = require("../controllers/adminController");

// // // Users
// // router.get("/users", adminController.getUsers);
// // router.put("/users/:id", adminController.updateUser);
// // router.delete("/users/:id", adminController.deleteUser);

// // // Laporan
// // router.get("/laporan", adminController.getAllLaporan);
// // router.put("/laporan/:id", adminController.updateLaporan);
// // router.delete("/laporan/:id", adminController.deleteLaporan);

// // // Approve & Tanggal tindak lanjut
// // router.put("/laporan/approve/:id", adminController.approve);
// // router.put("/laporan/tanggal/:id", adminController.setTanggal);

// // module.exports = router;

// const express = require("express");
// const router = express.Router();
// const adminController = require("../controllers/adminController");


// // Users
// router.get("/users", adminController.getUsers);
// router.put("/users/:id", adminController.updateUser);
// router.delete("/users/:id", adminController.deleteUser);

// // Laporan
// router.get("/laporan", adminController.getAllLaporan);
// router.put("/laporan/:id", adminController.updateLaporan);
// router.delete("/laporan/:id", adminController.deleteLaporan);

// // Approve & Tanggal tindak lanjut
// router.put("/laporan/approve/:id", adminController.approve);
// router.put("/laporan/tanggal/:id", adminController.setTanggal);

// module.exports = router;


const router = require("express").Router();
const admin = require("../controllers/adminController");

router.get("/users", admin.getUsers);
router.put("/users/:id", admin.updateUser);
router.delete("/users/:id", admin.deleteUser);

router.get("/laporan", admin.getAllLaporan);
router.put("/laporan/:id", admin.updateLaporan);
router.delete("/laporan/:id", admin.deleteLaporan);
router.put("/laporan/:id/approve", admin.approve);
router.put("/laporan/:id/tanggal", admin.setTanggal);

module.exports = router;
