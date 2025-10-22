-- เพิ่ม column status ในตาราง users
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'ban'));

-- อัปเดต users ที่มีอยู่แล้วให้มี status เป็น active
UPDATE users SET status = 'active' WHERE status IS NULL;

-- เพิ่ม index สำหรับ status เพื่อการค้นหาที่เร็วขึ้น
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
