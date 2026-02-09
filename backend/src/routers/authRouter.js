// // const express = require("express");
// // const router = express.Router();
// // const authController = require("../controllers/authController");

// // router.post("/login", authController.login);

// // module.exports = router;

// const express = require("express");
// const router = express.Router();
// const db = require("../config/database");
// const bcrypt = require("bcryptjs");
// const authController = require("../controllers/authController");

// // Daftar email khusus admin/petugas
// const adminEmails = ["admin@ujikom.com"];
// const petugasEmails = ["petugas1@ujikom.com", "petugas2@ujikom.com"];

// router.post("/login", (req, res) => {
//   const { email, password } = req.body;

// router.post("/login", authController.login);

//   db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
//     if (err) return res.status(500).json({ error: "DB error" });
//     if (result.length === 0)
//       return res.status(404).json({ error: "User tidak ditemukan" });

//     const user = result[0];

//     // Admin & Petugas: login tanpa password
//     if (adminEmails.includes(email)) {
//       return res.json({ success: true, role: "admin", user });
//     }

//     if (petugasEmails.includes(email)) {
//       return res.json({ success: true, role: "petugas", user });
//     }

//     // USER: wajib verifikasi password
//     bcrypt.compare(password, user.password, (err, isMatch) => {
//       if (err) return res.status(500).json({ error: "Error compare" });
//       if (!isMatch)
//         return res.status(401).json({ error: "Password salah" });

//       res.json({ success: true, role: "user", user });
//     });
//   });
// });

// module.exports = router;

// const router = require("express").Router();
// const auth = require("../controllers/authController");

// router.post("/login", auth.login);

// module.exports = router;

const express = require("express");
const router = express.Router();
const auth = require("../controllers/authController");

router.post("/register", auth.register);
router.post("/login", auth.login);

module.exports = router;
