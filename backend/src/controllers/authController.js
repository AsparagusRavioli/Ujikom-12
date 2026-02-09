// // const db = require("../config/database");

// // exports.login = (req, res) => {
// //   const { email } = req.body;

// //   db.query(
// //     "SELECT * FROM users WHERE email = ?",
// //     [email],
// //     (err, result) => {
// //       if (err) return res.status(500).json({ error: "DB error" });
// //       if (result.length === 0)
// //         return res.status(404).json({ error: "User not found" });

// //       res.json({ user: result[0] });
// //     }
// //   );
// // };

// const db = require("../config/database");

// exports.login = async (req, res) => {
//   try {
//     const { email } = req.body;

//     const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
//       email,
//     ]);

//     if (rows.length === 0)
//       return res.status(404).json({ error: "User tidak ditemukan" });

//     res.json({ user: rows[0] });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

const db = require("../config/database");

// REGISTER
exports.register = async (req, res) => {
  try {
    const { nama, email, password } = req.body;

    if (!nama || !email || !password) {
      return res.status(400).json({ message: "nama, email, role wajib diisi" });
    }

    const [exists] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (exists.length > 0)
      return res.status(400).json({ message: "Email sudah terdaftar" });

    
    await db.query(
      "INSERT INTO users (nama, email, role) VALUES (?, ?, ?)",
      [nama, email, password]
    );

    res.json({ message: "Registrasi berhasil" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email } = req.body;

    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (rows.length === 0)
      return res.status(404).json({ message: "User tidak ditemukan" });

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
