const { laporan } = require("../data/dataStore");

module.exports = {

  // Petugas lihat semua laporan yang sudah di-approve admin
  getApproved(req, res) {
    const approved = laporan.filter(l => l.status === "approved");
    res.json(approved);
  },

  // Petugas lihat laporan yang sudah dapat tanggal tindak lanjut
  getWithTask(req, res) {
    const withTask = laporan.filter(l => l.tindak_lanjut && l.status === "approved");
    res.json(withTask);
  },

  // Petugas mengambil tugas
  takeTask(req, res) {
    const { id } = req.params;
    const { petugas_id } = req.body;

    const task = laporan.find(l => l.id === parseInt(id));

    if (!task) {
      return res.status(404).json({ message: "Laporan tidak ditemukan" });
    }

    // Hanya laporan yang sudah diapprove admin dan sudah punya tanggal tindak lanjut
    if (task.status !== "approved") {
      return res.status(400).json({ message: "Laporan belum siap diambil petugas" });
    }

    if (!task.tindak_lanjut) {
      return res.status(400).json({ message: "Admin belum memberikan tanggal tindak lanjut" });
    }

    // Set status dan petugas yang menangani
    task.status = "diproses_petugas";
    task.petugas_id = petugas_id;

    res.json({
      message: "Tugas berhasil diambil",
      laporan: task
    });
  }

};

const db = require("../config/database");

module.exports = {
  async getApproved(req, res) {
    try {
      const [laporan] = await db.query(
        "SELECT * FROM laporan WHERE status = 'approved'",
      );
      res.json(laporan);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async getWithTask(req, res) {
    try {
      const [laporan] = await db.query(
        "SELECT * FROM laporan WHERE status = 'approved' AND tindak_lanjut IS NOT NULL",
      );
      res.json(laporan);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async takeTask(req, res) {
    try {
      const { id } = req.params;
      const { petugas_id } = req.body;

      const [rows] = await db.query("SELECT * FROM laporan WHERE id = ?", [id]);
      if (rows.length === 0)
        return res.status(404).json({ message: "Laporan tidak ditemukan" });

      const task = rows[0];
      if (task.status !== "approved")
        return res
          .status(400)
          .json({ message: "Laporan belum siap diambil petugas" });
      if (!task.tindak_lanjut)
        return res
          .status(400)
          .json({ message: "Admin belum memberikan tanggal tindak lanjut" });

      await db.query(
        "UPDATE laporan SET status = 'diproses_petugas', petugas_id = ? WHERE id = ?",
        [petugas_id, id],
      );
      const [updated] = await db.query("SELECT * FROM laporan WHERE id = ?", [
        id,
      ]);

      res.json({ message: "Tugas berhasil diambil", laporan: updated[0] });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }

    
  },
};

// Versi ke-2

// const db = require("../config/database");

// module.exports = {
//   async getApproved(req, res) {
//     try {
//       const [laporan] = await db.query(
//         "SELECT * FROM laporan WHERE status = 'approved'"
//       );
//       res.json(laporan);
//     } catch (err) {
//       res.status(500).json({ message: err.message });
//     }
//   },

//   async getWithTask(req, res) {
//     try {
//       const [laporan] = await db.query(
//         "SELECT * FROM laporan WHERE status = 'approved' AND tindak_lanjut IS NOT NULL"
//       );
//       res.json(laporan);
//     } catch (err) {
//       res.status(500).json({ message: err.message });
//     }
//   },

//   async takeTask(req, res) {
//     try {
//       const { id } = req.params;
//       const { petugas_id } = req.body;

//       const [rows] = await db.query("SELECT * FROM laporan WHERE id = ?", [id]);
//       if (rows.length === 0)
//         return res.status(404).json({ message: "Laporan tidak ditemukan" });

//       const task = rows[0];

//       if (task.status !== "approved")
//         return res
//           .status(400)
//           .json({ message: "Laporan belum siap diambil petugas" });

//       if (!task.tindak_lanjut)
//         return res
//           .status(400)
//           .json({ message: "Admin belum memberikan tanggal tindak lanjut" });

//       await db.query(
//         "UPDATE laporan SET status = 'diproses_petugas', petugas_id = ? WHERE id = ?",
//         [petugas_id, id]
//       );

//       const [updated] = await db.query("SELECT * FROM laporan WHERE id = ?", [
//         id,
//       ]);

//       res.json({ message: "Tugas berhasil diambil", laporan: updated[0] });
//     } catch (err) {
//       res.status(500).json({ message: err.message });
//     }
//   },
// };
