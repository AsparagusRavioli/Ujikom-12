// // const express = require("express");
// // const app = express();
// // const morgan = require("morgan");

// // // Import routers
// // const adminRoutes = require("./routers/adminRouter");    // admin routes
// // const userRoutes = require("./routers/userRouter");      // user + laporan routes
// // const petugasRoutes = require("./routers/petugasRouter");


// // // Middleware
// // app.use(express.json());     // untuk membaca body JSON
// // app.use(morgan("dev"));      // logging HTTP request

// // // Routing
// // app.use("/admin", adminRoutes);
// // app.use("/users", userRoutes);
// // app.use("/petugas", petugasRoutes);

// // // Root route
// // app.get("/", (req, res) => {
// //   res.send("Server berjalan dengan baik");
// // });

// // // Error handling untuk route yang tidak ditemukan
// // app.use((req, res) => {
// //   res.status(404).json({ message: "Route tidak ditemukan" });
// // });

// // // Jalankan server
// // const PORT = 3000;
// // app.listen(PORT, () => {
// //   console.log(`Server aktif di http://localhost:${PORT}`);
// // });

// const express = require("express");
// const cors = require("cors");
// const app = express();

// app.use(cors());
// app.use(cors({ origin: "http://localhost:5173", credentials: true }));
// app.use(express.json());

// // ROUTERS
// const authRouter = require("./routers/authRouter");
// const adminRouter = require("./routers/adminRouter");
// const userRouter = require("./routers/userRouter");
// const petugasRouter = require("./routers/petugasRouter");

// // REGISTER ROUTES
// app.use("/auth", authRouter);      // <---- tambahkan ini
// app.use("/admin", adminRouter);
// app.use("/user", userRouter);
// app.use("/petugas", petugasRouter);

// // RUN
// app.listen(3000, () => console.log("Server berjalan di http//localhost:3000"));

const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", require("./routers/authRouter"));
app.use("/admin", require("./routers/adminRouter"));
app.use("/petugas", require("./routers/petugasRouter"));
app.use("/user", require("./routers/userRouter"));

app.listen(3000, () => console.log("Server berjalan di port http://localhost:3000/"));
