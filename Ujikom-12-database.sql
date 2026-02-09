USE ujikom_12;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255),   -- optional, bisa kosong dulu
    role ENUM('admin','user','petugas') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE laporan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    judul VARCHAR(255) NOT NULL,
    isi TEXT NOT NULL,
    lokasi VARCHAR(255) NOT NULL,
    status ENUM('pending','approved','diproses_petugas','selesai') DEFAULT 'pending',
    tindak_lanjut DATE DEFAULT NULL,
    petugas_id INT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (petugas_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_user_id ON laporan(user_id);
CREATE INDEX idx_petugas_id ON laporan(petugas_id);
CREATE INDEX idx_status ON laporan(status);

-- Admin
INSERT INTO users (nama, email, role) VALUES 
('Admin Utama', 'admin@gmail.com', 'admin');


-- Petugas
INSERT INTO users (nama, email, role) VALUES 
('Petugas 1', 'petugas1@gmail.com', 'petugas'),
('Petugas 2', 'petugas2@gmail.com', 'petugas');

-- User
INSERT INTO users (nama, email, role) VALUES 
('User 1', 'user1@gmail.com', 'user'),
('User 2', 'user2@gmail.com', 'user');
