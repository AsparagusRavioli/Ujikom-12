// const mysql = require("mysql2/promise");

// const db = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   password: "farel2juli08",   // ganti jika ada password
//   database: "ujikom_12",
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// });

// module.exports = db;


// const mysql = require("mysql2/promise");

// const db = mysql.createPool({
//   host: "localhost",
//   user: "root",       // sesuaikan dengan MySQL Laragonmu
//   password: "farel2juli08",       // default kosong
//   database: "ujikom_12",
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// });



// module.exports = db;


// const mysql = require("mysql2");

// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "farel2juli08",
//   database: "ujikom_12",
// });

// db.connect((err) => {
//   if (err) throw err;
//   console.log("Database connected");
// });

// module.exports = db;

const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "farel2juli08",
  database: "ujikom_12",
});

module.exports = db;
