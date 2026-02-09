const { users, laporan } = require("../data/dataStore");

// Masyarakat: Register + Login + CRUD Laporan
module.exports = {

  // REGISTER USER
  register(req, res) {
    const { id, nama, email } = req.body;

    if (!id || !nama || !email) {
      return res.status(400).json({ message: "id, nama, email wajib diisi" });
    }

    const exists = users.find(u => u.id == id);
    if (exists) {
      return res.status(400).json({ message: "User sudah ada" });
    }

    const data = { id, nama, email };
    users.push(data);

    res.status(201).json({ message: "Akun dibuat", data });
  },

  // LOGIN USER
  login(req, res) {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email wajib diisi" });
    }

    const user = users.find(u => u.email == email);

    if (!user) {
      return res.status(404).json({ message: "Akun tidak ditemukan" });
    }

    res.json({
      message: "Login berhasil",
      user
    });
  },

  // CREATE LAPORAN
  createLaporan(req, res) {
    const { id, userId, judul, isi, lokasi } = req.body;

    if (!id || !userId || !judul || !isi || !lokasi) {
      return res.status(400).json({ message: "Semua field wajib diisi" });
    }

    const user = users.find(u => u.id == userId);
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    const data = {
      id,
      userId,
      judul,
      isi,
      lokasi,
      status: "pending",
      tindak_lanjut: null
    };

    laporan.push(data);
    res.status(201).json({ message: "Laporan dibuat", data });
  },

  // READ SEMUA LAPORAN USER
  getMyLaporan(req, res) {
    const userId = req.params.userId;
    const data = laporan.filter(l => l.userId == userId);
    res.json(data);
  },

  // READ LAPORAN BY ID
  getLaporanById(req, res) {
    const reportId = req.params.laporanId;
    const data = laporan.find(l => l.id == reportId);

    if (!data) {
      return res.status(404).json({ message: "Laporan tidak ditemukan" });
    }

    res.json(data);
  },

  // UPDATE LAPORAN
  updateLaporan(req, res) {
    const reportId = req.params.laporanId;
    const index = laporan.findIndex(l => l.id == reportId);

    if (index === -1) {
      return res.status(404).json({ message: "Laporan tidak ditemukan" });
    }

    // Laporan yang sudah approved tidak boleh diubah
    if (laporan[index].status !== "pending") {
      return res.status(403).json({
        message: "Laporan sudah diproses admin dan tidak bisa diubah"
      });
    }

    laporan[index] = { ...laporan[index], ...req.body };
    res.json({ message: "Laporan diperbarui", data: laporan[index] });
  },

  // DELETE LAPORAN
  deleteLaporan(req, res) {
    const reportId = req.params.laporanId;
    const index = laporan.findIndex(l => l.id == reportId);

    if (index === -1) {
      return res.status(404).json({ message: "Laporan tidak ditemukan" });
    }

    // Laporan yang sudah diproses admin tidak boleh dihapus
    if (laporan[index].status !== "pending") {
      return res.status(403).json({
        message: "Laporan sudah diproses admin dan tidak bisa dihapus"
      });
    }

    const removed = laporan.splice(index, 1)[0];
    res.json({ message: "Laporan dihapus", removed });
  }
};

const db = require("../config/database");

module.exports = {
  async register(req, res) {
    try {
      const { nama, email } = req.body;
      if (!nama || !email)
        return res.status(400).json({ message: "nama dan email wajib diisi" });

      const [exists] = await db.query("SELECT * FROM users WHERE email = ?", [
        email,
      ]);
      if (exists.length > 0)
        return res.status(400).json({ message: "User sudah ada" });

      const [result] = await db.query(
        "INSERT INTO users (nama, email, role) VALUES (?, ?, 'user')",
        [nama, email],
      );

      const [user] = await db.query("SELECT * FROM users WHERE id = ?", [
        result.insertId,
      ]);
      res.status(201).json({ message: "Akun dibuat", data: user[0] });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async login(req, res) {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ message: "Email wajib diisi" });

      const [user] = await db.query("SELECT * FROM users WHERE email = ?", [
        email,
      ]);
      if (user.length === 0)
        return res.status(404).json({ message: "Akun tidak ditemukan" });

      res.json({ message: "Login berhasil", user: user[0] });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async createLaporan(req, res) {
    try {
      const { userId, judul, isi, lokasi } = req.body;
      if (!userId || !judul || !isi || !lokasi)
        return res.status(400).json({ message: "Semua field wajib diisi" });

      const [user] = await db.query("SELECT * FROM users WHERE id = ?", [
        userId,
      ]);
      if (user.length === 0)
        return res.status(404).json({ message: "User tidak ditemukan" });

      const [result] = await db.query(
        "INSERT INTO laporan (user_id, judul, isi, lokasi) VALUES (?, ?, ?, ?)",
        [userId, judul, isi, lokasi],
      );

      const [laporan] = await db.query("SELECT * FROM laporan WHERE id = ?", [
        result.insertId,
      ]);
      res.status(201).json({ message: "Laporan dibuat", data: laporan[0] });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async getMyLaporan(req, res) {
    try {
      const userId = req.params.userId;
      const [laporan] = await db.query(
        "SELECT * FROM laporan WHERE user_id = ?",
        [userId],
      );
      res.json(laporan);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async getLaporanById(req, res) {
    try {
      const laporanId = req.params.laporanId;
      const [laporan] = await db.query("SELECT * FROM laporan WHERE id = ?", [
        laporanId,
      ]);

      if (laporan.length === 0)
        return res.status(404).json({ message: "Laporan tidak ditemukan" });
      res.json(laporan[0]);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async updateLaporan(req, res) {
    try {
      const laporanId = req.params.laporanId;
      const [rows] = await db.query("SELECT * FROM laporan WHERE id = ?", [
        laporanId,
      ]);
      if (rows.length === 0)
        return res.status(404).json({ message: "Laporan tidak ditemukan" });

      if (rows[0].status !== "pending")
        return res
          .status(403)
          .json({
            message: "Laporan sudah diproses admin dan tidak bisa diubah",
          });

      const { judul, isi, lokasi } = req.body;
      await db.query(
        "UPDATE laporan SET judul = COALESCE(?, judul), isi = COALESCE(?, isi), lokasi = COALESCE(?, lokasi) WHERE id = ?",
        [judul, isi, lokasi, laporanId],
      );

      const [updated] = await db.query("SELECT * FROM laporan WHERE id = ?", [
        laporanId,
      ]);
      res.json({ message: "Laporan diperbarui", data: updated[0] });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async deleteLaporan(req, res) {
    try {
      const laporanId = req.params.laporanId;
      const [rows] = await db.query("SELECT * FROM laporan WHERE id = ?", [
        laporanId,
      ]);
      if (rows.length === 0)
        return res.status(404).json({ message: "Laporan tidak ditemukan" });

      if (rows[0].status !== "pending")
        return res
          .status(403)
          .json({
            message: "Laporan sudah diproses admin dan tidak bisa dihapus",
          });

      await db.query("DELETE FROM laporan WHERE id = ?", [laporanId]);
      res.json({ message: "Laporan dihapus" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
    
  },
};

// const db = require("../config/database");

// module.exports = {
//   async register(req, res) {
//     try {
//       const { nama, email } = req.body;
//       if (!nama || !email)
//         return res.status(400).json({ message: "nama dan email wajib diisi" });

//       const [exists] = await db.query("SELECT * FROM users WHERE email = ?", [
//         email,
//       ]);

//       if (exists.length > 0)
//         return res.status(400).json({ message: "Email sudah digunakan" });

//       await db.query("INSERT INTO users (nama, email, role) VALUES (?, ?, 'user')", [
//         nama,
//         email,
//       ]);

//       res.json({ message: "Registrasi berhasil" });
//     } catch (err) {
//       res.status(500).json({ message: err.message });
//     }
//   },

//   async createLaporan(req, res) {
//     try {
//       const { userId, judul, isi, lokasi } = req.body;

//       if (!userId || !judul || !isi || !lokasi)
//         return res.status(400).json({ message: "Semua field wajib diisi" });

//       await db.query(
//         "INSERT INTO laporan (userId, judul, isi, lokasi, status) VALUES (?, ?, ?, ?, 'pending')",
//         [userId, judul, isi, lokasi]
//       );

//       res.json({ message: "Laporan dibuat" });
//     } catch (err) {
//       res.status(500).json({ message: err.message });
//     }
//   },

//   async getMyLaporan(req, res) {
//     try {
//       const userId = req.params.userId;

//       const [rows] = await db.query("SELECT * FROM laporan WHERE userId = ?", [
//         userId,
//       ]);

//       res.json(rows);
//     } catch (err) {
//       res.status(500).json({ message: err.message });
//     }
//   },

//   async updateLaporan(req, res) {
//     try {
//       const id = req.params.laporanId;
//       const { judul, isi, lokasi } = req.body;

//       // cek status
//       const [rows] = await db.query("SELECT * FROM laporan WHERE id = ?", [
//         id,
//       ]);

//       if (rows.length === 0)
//         return res.status(404).json({ message: "Laporan tidak ditemukan" });

//       if (rows[0].status !== "pending")
//         return res.status(403).json({ message: "Tidak dapat mengubah laporan yang sudah diproses" });

//       await db.query(
//         "UPDATE laporan SET judul = ?, isi = ?, lokasi = ? WHERE id = ?",
//         [judul, isi, lokasi, id]
//       );

//       res.json({ message: "Laporan diperbarui" });
//     } catch (err) {
//       res.status(500).json({ message: err.message });
//     }
//   },

//   async deleteLaporan(req, res) {
//     try {
//       const id = req.params.laporanId;

//       const [rows] = await db.query("SELECT * FROM laporan WHERE id = ?", [
//         id,
//       ]);

//       if (rows.length === 0)
//         return res.status(404).json({ message: "Laporan tidak ditemukan" });

//       if (rows[0].status !== "pending")
//         return res.status(403).json({ message: "Laporan sudah diproses admin, tidak bisa dihapus" });

//       await db.query("DELETE FROM laporan WHERE id = ?", [id]);

//       res.json({ message: "Laporan dihapus" });
//     } catch (err) {
//       res.status(500).json({ message: err.message });
//     }
//   },
// };
