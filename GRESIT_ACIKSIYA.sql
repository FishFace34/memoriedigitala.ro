-- Güncellenmiş Events Table (Adres ve Telefon Alanları ile)

-- Önce eski table'ı sil
DROP TABLE IF EXISTS events CASCADE;

-- Yeni Events Table oluştur
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    event_id VARCHAR(255) UNIQUE NOT NULL,
    access_key VARCHAR(255) UNIQUE NOT NULL,
    host_email VARCHAR(255) NOT NULL,
    host_name VARCHAR(255) NOT NULL,
    host_phone VARCHAR(50),
    event_name VARCHAR(255),
    event_date DATE,
    delivery_address TEXT,
    delivery_city VARCHAR(255),
    delivery_postal VARCHAR(20),
    delivery_country VARCHAR(100),
    package_type VARCHAR(50) DEFAULT 'standard',
    qr_print_enabled BOOLEAN DEFAULT false,
    qr_print_quantity INTEGER DEFAULT 0,
    voice_message_enabled BOOLEAN DEFAULT false,
    total_price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL
);

-- Indexler
CREATE INDEX idx_events_access_key ON events(access_key);
CREATE INDEX idx_events_event_id ON events(event_id);

-- Orders Table (zaten varsa güncelleme gerekmez)
-- Sadece events table güncellenecek








