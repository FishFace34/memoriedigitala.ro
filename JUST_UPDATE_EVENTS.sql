-- ============================================================
-- SADECE EVENTS TABLE'INI GÜNCELLE (Users zaten var)
-- ============================================================

-- Önce eski events table'ı sil
DROP TABLE IF EXISTS events CASCADE;

-- Yeni güncellenmiş events table'ı oluştur
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

-- Events indexes
CREATE INDEX idx_events_access_key ON events(access_key);
CREATE INDEX idx_events_event_id ON events(event_id);

-- Orders table (yoksa oluştur)
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    stripe_session_id VARCHAR(255) UNIQUE,
    event_id VARCHAR(255) NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
    host_email VARCHAR(255) NOT NULL,
    host_name VARCHAR(255) NOT NULL,
    base_price DECIMAL(10, 2) NOT NULL,
    qr_print_price DECIMAL(10, 2) DEFAULT 0,
    voice_message_price DECIMAL(10, 2) DEFAULT 0,
    total_price DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'RON',
    payment_status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Media uploads table (yoksa oluştur)
CREATE TABLE IF NOT EXISTS media_uploads (
    id SERIAL PRIMARY KEY,
    event_id VARCHAR(255) NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
    upload_type VARCHAR(50) NOT NULL,
    file_url TEXT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size BIGINT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_approved BOOLEAN DEFAULT true,
    guest_ip VARCHAR(45)
);

-- QR templates table (yoksa oluştur)
CREATE TABLE IF NOT EXISTS qr_templates (
    id SERIAL PRIMARY KEY,
    template_name VARCHAR(255) NOT NULL,
    template_url TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_media_event_id ON media_uploads(event_id);
CREATE INDEX IF NOT EXISTS idx_media_uploaded_at ON media_uploads(uploaded_at);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_session ON orders(stripe_session_id);








