const { users, laporan } = require("../data/dataStore");

// Admin: CRUD user + CRUD laporan + Approve laporan + Set tanggal tindak lanjut
module.exports = {

  getUsers(req, res) {
    res.json(users);
  },

  // UPDATE USER
  updateUser(req, res) {
    const id = req.params.id;
    const { nama, email } = req.body;

    const user = users.find(u => u.id == id);
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    if (nama) user.nama = nama;
    if (email) user.email = email;

    res.json({ message: "User berhasil diperbarui", user });
  },

  // DELETE USER
  deleteUser(req, res) {
    const id = req.params.id;
    const index = users.findIndex(u => u.id == id);

    if (index === -1) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    users.splice(index, 1);
    res.json({ message: "User berhasil dihapus" });
  },

  getAllLaporan(req, res) {
    res.json(laporan);
  },

  // 🔥 UPDATE LAPORAN
  updateLaporan(req, res) {
    const id = req.params.id;
    const { judul, isi , lokasi } = req.body;

    const item = laporan.find(l => l.id == id);
    if (!item) {
      return res.status(404).json({ message: "Laporan tidak ditemukan" });
    }

    if (judul) item.judul = judul;
    if (isi) item.isi = isi;
    if (lokasi) item.lokasi = lokasi;

    res.json({ message: "Laporan berhasil diperbarui", item });
  },

  // 🔥 DELETE LAPORAN
  deleteLaporan(req, res) {
    const id = req.params.id;
    const index = laporan.findIndex(l => l.id == id);

    if (index === -1) {
      return res.status(404).json({ message: "Laporan tidak ditemukan" });
    }

    laporan.splice(index, 1);
    res.json({ message: "Laporan berhasil dihapus" });
  },

  approve(req, res) {
    const id = req.params.id;
    const item = laporan.find(l => l.id == id);

    if (!item) return res.status(404).json({ message: "Laporan tidak ditemukan" });

    item.status = "approved";
    res.json({ message: "Laporan disetujui", item });
  },

  setTanggal(req, res) {
    const id = req.params.id;
    const { tanggal } = req.body;

    const item = laporan.find(l => l.id == id);
    if (!item) return res.status(404).json({ message: "Laporan tidak ditemukan" });

    item.tindak_lanjut = tanggal;
    res.json({ message: "Tanggal tindak lanjut diset", item });
  }
};

const db = require("../config/database");

module.exports = {
  async getUsers(req, res) {
    try {
      const [users] = await db.query("SELECT * FROM users");
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async updateUser(req, res) {
    try {
      const id = req.params.id;
      const { nama, email } = req.body;

      const [result] = await db.query(
        "UPDATE users SET nama = COALESCE(?, nama), email = COALESCE(?, email) WHERE id = ?",
        [nama, email, id],
      );

      if (result.affectedRows === 0)
        return res.status(404).json({ message: "User tidak ditemukan" });

      const [user] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
      res.json({ message: "User berhasil diperbarui", user: user[0] });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async deleteUser(req, res) {
    try {
      const id = req.params.id;
      const [result] = await db.query("DELETE FROM users WHERE id = ?", [id]);

      if (result.affectedRows === 0)
        return res.status(404).json({ message: "User tidak ditemukan" });

      res.json({ message: "User berhasil dihapus" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async getAllLaporan(req, res) {
    try {
      const [laporan] = await db.query("SELECT * FROM laporan");
      res.json(laporan);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async updateLaporan(req, res) {
    try {
      const id = req.params.id;
      const { judul, isi, lokasi } = req.body;

      const [result] = await db.query(
        "UPDATE laporan SET judul = COALESCE(?, judul), isi = COALESCE(?, isi), lokasi = COALESCE(?, lokasi) WHERE id = ?",
        [judul, isi, lokasi, id],
      );

      if (result.affectedRows === 0)
        return res.status(404).json({ message: "Laporan tidak ditemukan" });

      const [laporan] = await db.query("SELECT * FROM laporan WHERE id = ?", [
        id,
      ]);
      res.json({ message: "Laporan berhasil diperbarui", item: laporan[0] });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async deleteLaporan(req, res) {
    try {
      const id = req.params.id;
      const [result] = await db.query("DELETE FROM laporan WHERE id = ?", [id]);

      if (result.affectedRows === 0)
        return res.status(404).json({ message: "Laporan tidak ditemukan" });

      res.json({ message: "Laporan berhasil dihapus" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async approve(req, res) {
    try {
      const id = req.params.id;
      const [result] = await db.query(
        "UPDATE laporan SET status = 'approved' WHERE id = ?",
        [id],
      );

      if (result.affectedRows === 0)
        return res.status(404).json({ message: "Laporan tidak ditemukan" });

      const [laporan] = await db.query("SELECT * FROM laporan WHERE id = ?", [
        id,
      ]);
      res.json({ message: "Laporan disetujui", item: laporan[0] });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async setTanggal(req, res) {
    try {
      const id = req.params.id;
      const { tanggal } = req.body;

      const [result] = await db.query(
        "UPDATE laporan SET tindak_lanjut = ? WHERE id = ?",
        [tanggal, id],
      );

      if (result.affectedRows === 0)
        return res.status(404).json({ message: "Laporan tidak ditemukan" });

      const [laporan] = await db.query("SELECT * FROM laporan WHERE id = ?", [
        id,
      ]);
      res.json({ message: "Tanggal tindak lanjut diset", item: laporan[0] });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }

    

  },
};

// Versi ke-2

// const db = require("../config/database");

// module.exports = {
//   async getUsers(req, res) {
//     try {
//       const [users] = await db.query("SELECT * FROM users");
//       res.json(users);
//     } catch (err) {
//       res.status(500).json({ message: err.message });
//     }
//   },

//   async updateUser(req, res) {
//     try {
//       const id = req.params.id;
//       const { nama, email } = req.body;

//       const [result] = await db.query(
//         "UPDATE users SET nama = COALESCE(?, nama), email = COALESCE(?, email) WHERE id = ?",
//         [nama, email, id]
//       );

//       if (result.affectedRows === 0)
//         return res.status(404).json({ message: "User tidak ditemukan" });

//       const [user] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
//       res.json({ message: "User berhasil diperbarui", user: user[0] });
//     } catch (err) {
//       res.status(500).json({ message: err.message });
//     }
//   },

//   async deleteUser(req, res) {
//     try {
//       const id = req.params.id;

//       const [result] = await db.query("DELETE FROM users WHERE id = ?", [id]);
//       if (result.affectedRows === 0)
//         return res.status(404).json({ message: "User tidak ditemukan" });

//       res.json({ message: "User berhasil dihapus" });
//     } catch (err) {
//       res.status(500).json({ message: err.message });
//     }
//   },

//   async getAllLaporan(req, res) {
//     try {
//       const [laporan] = await db.query("SELECT * FROM laporan");
//       res.json(laporan);
//     } catch (err) {
//       res.status(500).json({ message: err.message });
//     }
//   },

//   async updateLaporan(req, res) {
//     try {
//       const id = req.params.id;
//       const { judul, isi, lokasi } = req.body;

//       const [result] = await db.query(
//         "UPDATE laporan SET judul = COALESCE(?, judul), isi = COALESCE(?, isi), lokasi = COALESCE(?, lokasi) WHERE id = ?",
//         [judul, isi, lokasi, id]
//       );

//       if (result.affectedRows === 0)
//         return res.status(404).json({ message: "Laporan tidak ditemukan" });

//       const [laporan] = await db.query("SELECT * FROM laporan WHERE id = ?", [
//         id,
//       ]);

//       res.json({ message: "Laporan berhasil diperbarui", item: laporan[0] });
//     } catch (err) {
//       res.status(500).json({ message: err.message });
//     }
//   },

//   async deleteLaporan(req, res) {
//     try {
//       const id = req.params.id;

//       const [result] = await db.query("DELETE FROM laporan WHERE id = ?", [id]);
//       if (result.affectedRows === 0)
//         return res.status(404).json({ message: "Laporan tidak ditemukan" });

//       res.json({ message: "Laporan berhasil dihapus" });
//     } catch (err) {
//       res.status(500).json({ message: err.message });
//     }
//   },

//   async approve(req, res) {
//     try {
//       const id = req.params.id;

//       const [result] = await db.query(
//         "UPDATE laporan SET status = 'approved' WHERE id = ?",
//         [id]
//       );

//       if (result.affectedRows === 0)
//         return res.status(404).json({ message: "Laporan tidak ditemukan" });

//       const [laporan] = await db.query("SELECT * FROM laporan WHERE id = ?", [
//         id,
//       ]);

//       res.json({ message: "Laporan disetujui", item: laporan[0] });
//     } catch (err) {
//       res.status(500).json({ message: err.message });
//     }
//   },

//   async setTanggal(req, res) {
//     try {
//       const id = req.params.id;
//       const { tanggal } = req.body;

//       await db.query("UPDATE laporan SET tindak_lanjut = ? WHERE id = ?", [
//         tanggal,
//         id,
//       ]);

//       const [laporan] = await db.query("SELECT * FROM laporan WHERE id = ?", [
//         id,
//       ]);

//       res.json({
//         message: "Tanggal tindak lanjut diset",
//         item: laporan[0],
//       });
//     } catch (err) {
//       res.status(500).json({ message: err.message });
//     }
//   },
// };
