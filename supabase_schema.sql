-- =============================================
-- LeoShin Blog App - Complete Supabase Database Schema
-- =============================================
-- 
-- สคริปต์นี้รวมทุกอย่างไว้ในไฟล์เดียวสำหรับใช้ใน Supabase SQL Editor
-- รันสคริปต์นี้ทั้งหมดในครั้งเดียวเพื่อสร้าง database schema ที่สมบูรณ์
-- ไม่มี RLS Policies เพราะใช้ Express API แทน
--
-- =============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. USERS TABLE (extends Supabase auth.users)
-- =============================================
-- หมายเหตุ: ถ้าตาราง users มีอยู่แล้ว ให้ข้ามส่วนนี้
-- หรือใช้ ALTER TABLE เพื่อเพิ่มคอลัมน์ที่ขาดหายไป

-- สร้างตาราง users ถ้ายังไม่มี
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    username TEXT UNIQUE,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    profile_pic TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- เพิ่มคอลัมน์ที่อาจจะขาดหายไป (ถ้าตารางมีอยู่แล้ว)
DO $$ 
BEGIN
    -- เพิ่มคอลัมน์ email ถ้าไม่มี
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'email') THEN
        ALTER TABLE public.users ADD COLUMN email TEXT UNIQUE NOT NULL;
    END IF;
    
    -- เพิ่มคอลัมน์ name ถ้าไม่มี
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'name') THEN
        ALTER TABLE public.users ADD COLUMN name TEXT;
    END IF;
    
    -- เพิ่มคอลัมน์ username ถ้าไม่มี
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'username') THEN
        ALTER TABLE public.users ADD COLUMN username TEXT UNIQUE;
    END IF;
    
    -- เพิ่มคอลัมน์ role ถ้าไม่มี
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'role') THEN
        ALTER TABLE public.users ADD COLUMN role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'));
    END IF;
    
    -- เพิ่มคอลัมน์ profile_pic ถ้าไม่มี
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'profile_pic') THEN
        ALTER TABLE public.users ADD COLUMN profile_pic TEXT;
    END IF;
    
    -- เพิ่มคอลัมน์ created_at ถ้าไม่มี
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'created_at') THEN
        ALTER TABLE public.users ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    -- เพิ่มคอลัมน์ updated_at ถ้าไม่มี
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'updated_at') THEN
        ALTER TABLE public.users ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- =============================================
-- 2. CATEGORIES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.categories (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 3. POST STATUS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.post_status (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 4. BLOG POSTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    content TEXT NOT NULL,
    image TEXT,
    category_id INTEGER REFERENCES public.categories(id) ON DELETE SET NULL,
    author_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    status_id INTEGER REFERENCES public.post_status(id) ON DELETE SET NULL DEFAULT 1,
    likes INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 5. COMMENTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.comments (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES public.blog_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    parent_id INTEGER REFERENCES public.comments(id) ON DELETE CASCADE, -- for nested comments
    name TEXT NOT NULL, -- fallback if user not logged in
    email TEXT, -- fallback if user not logged in
    comment TEXT NOT NULL,
    image TEXT, -- user avatar fallback
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 6. POST LIKES TABLE (for user-specific likes)
-- =============================================
CREATE TABLE IF NOT EXISTS public.post_likes (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES public.blog_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(post_id, user_id)
);

-- =============================================
-- 7. NOTIFICATIONS TABLE (for admin)
-- =============================================
CREATE TABLE IF NOT EXISTS public.notifications (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Blog posts indexes
CREATE INDEX IF NOT EXISTS idx_blog_posts_category_id ON public.blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON public.blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status_id ON public.blog_posts(status_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON public.blog_posts(published_at);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON public.blog_posts(created_at);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);

-- Comments indexes
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON public.comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON public.comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON public.comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON public.comments(created_at);

-- Post likes indexes
CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON public.post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_user_id ON public.post_likes(user_id);

-- Notifications indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);

-- =============================================
-- TRIGGERS FOR UPDATED_AT
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers (drop first if exists to avoid errors)
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_categories_updated_at ON public.categories;
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON public.blog_posts;
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_comments_updated_at ON public.comments;
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON public.comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- INITIAL DATA
-- =============================================

-- Insert default categories (ถ้ายังไม่มีข้อมูล)
INSERT INTO public.categories (name, slug) 
SELECT 'General', 'general'
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = 'General');

INSERT INTO public.categories (name, slug) 
SELECT 'Cat', 'cat'
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = 'Cat');

INSERT INTO public.categories (name, slug) 
SELECT 'Inspiration', 'inspiration'
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = 'Inspiration');

-- Insert post statuses (ถ้ายังไม่มีข้อมูล)
INSERT INTO public.post_status (name, description) 
SELECT 'Published', 'Post is published and visible to public'
WHERE NOT EXISTS (SELECT 1 FROM public.post_status WHERE name = 'Published');

INSERT INTO public.post_status (name, description) 
SELECT 'Draft', 'Post is saved as draft'
WHERE NOT EXISTS (SELECT 1 FROM public.post_status WHERE name = 'Draft');

INSERT INTO public.post_status (name, description) 
SELECT 'Archived', 'Post is archived'
WHERE NOT EXISTS (SELECT 1 FROM public.post_status WHERE name = 'Archived');

-- =============================================
-- SAMPLE DATA (สำหรับทดสอบ)
-- =============================================

-- เพิ่มข้อมูลตัวอย่าง blog posts (ถ้าต้องการทดสอบ)
-- หมายเหตุ: ต้องมี user ในระบบก่อนถึงจะเพิ่มได้
-- INSERT INTO public.blog_posts (title, slug, description, content, image, category_id, author_id, status_id, published_at) VALUES
--     ('The Art of Mindfulness', 'the-art-of-mindfulness', 'Discover the transformative power of mindfulness', '## 1. Understanding Mindfulness\n\nMindfulness is the practice...', 'https://example.com/image1.jpg', 1, 'your-user-id-here', 1, NOW()),
--     ('Cat Communication Secrets', 'cat-communication-secrets', 'Unravel the mysteries of cat communication', '## 1. Vocal Communications\n\nExplore the various meows...', 'https://example.com/image2.jpg', 2, 'your-user-id-here', 1, NOW());

-- =============================================
-- HELPFUL QUERIES FOR TESTING
-- =============================================

-- ดูข้อมูลทั้งหมดในตาราง
-- SELECT * FROM public.users;
-- SELECT * FROM public.categories;
-- SELECT * FROM public.post_status;
-- SELECT * FROM public.blog_posts;
-- SELECT * FROM public.comments;
-- SELECT * FROM public.post_likes;
-- SELECT * FROM public.notifications;

-- ทดสอบฟังก์ชัน
-- SELECT * FROM get_posts_paginated(1, 6, NULL, NULL);
-- SELECT * FROM get_post_with_details(1);
-- SELECT increment_post_views(1);
-- SELECT toggle_post_like(1, 'your-user-id-here');

-- =============================================
-- CLEANUP QUERIES (ถ้าต้องการลบข้อมูล)
-- =============================================

-- ลบข้อมูลตัวอย่าง (ถ้าต้องการ)
-- DELETE FROM public.blog_posts WHERE title LIKE 'The Art of Mindfulness';
-- DELETE FROM public.blog_posts WHERE title LIKE 'Cat Communication Secrets';

-- =============================================
-- COMPLETION MESSAGE
-- =============================================

-- สคริปต์นี้เสร็จสมบูรณ์แล้ว!
-- ตอนนี้คุณมี database schema ที่สมบูรณ์แล้ว
-- 
-- ฟีเจอร์ที่ได้:
-- ✅ ตารางทั้งหมดพร้อม indexes และ triggers
-- ✅ ข้อมูลเริ่มต้น (categories และ post status)
-- ✅ ฟังก์ชันสำหรับการทำงานทั่วไป
-- ✅ ไม่มี RLS Policies (ใช้ Express API แทน)
-- ✅ ปลอดภัยสำหรับข้อมูลเดิม (ใช้ IF NOT EXISTS)
-- 
-- ขั้นตอนต่อไป:
-- 1. รันสคริปต์นี้ใน Supabase SQL Editor
-- 2. ตั้งค่า environment variables
-- 3. อัปเดตแอปพลิเคชันให้ใช้ Supabase services
-- 4. ทดสอบการทำงานของระบบ

-- =============================================
-- FUNCTIONS FOR COMMON OPERATIONS
-- =============================================

-- Function to get post with author and category info
CREATE OR REPLACE FUNCTION get_post_with_details(post_id INTEGER)
RETURNS TABLE (
    id INTEGER,
    title TEXT,
    slug TEXT,
    description TEXT,
    content TEXT,
    image TEXT,
    category_name TEXT,
    author_name TEXT,
    author_username TEXT,
    author_profile_pic TEXT,
    likes INTEGER,
    views INTEGER,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        bp.id,
        bp.title,
        bp.slug,
        bp.description,
        bp.content,
        bp.image,
        c.name as category_name,
        u.name as author_name,
        u.username as author_username,
        u.profile_pic as author_profile_pic,
        bp.likes,
        bp.views,
        bp.published_at,
        bp.created_at,
        bp.updated_at
    FROM public.blog_posts bp
    LEFT JOIN public.categories c ON bp.category_id = c.id
    LEFT JOIN public.users u ON bp.author_id = u.id
    WHERE bp.id = post_id AND bp.status_id = 1; -- only published posts
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get posts with pagination
CREATE OR REPLACE FUNCTION get_posts_paginated(
    page_num INTEGER DEFAULT 1,
    page_size INTEGER DEFAULT 6,
    category_filter TEXT DEFAULT NULL,
    search_keyword TEXT DEFAULT NULL
)
RETURNS TABLE (
    posts JSON,
    total_count BIGINT,
    total_pages INTEGER,
    current_page INTEGER
) AS $$
DECLARE
    offset_val INTEGER;
    total_posts BIGINT;
    total_pages_val INTEGER;
BEGIN
    offset_val := (page_num - 1) * page_size;
    
    -- Get total count
    SELECT COUNT(*) INTO total_posts
    FROM public.blog_posts bp
    LEFT JOIN public.categories c ON bp.category_id = c.id
    WHERE bp.status_id = 1
    AND (category_filter IS NULL OR c.name = category_filter)
    AND (search_keyword IS NULL OR bp.title ILIKE '%' || search_keyword || '%' OR bp.description ILIKE '%' || search_keyword || '%');
    
    total_pages_val := CEIL(total_posts::DECIMAL / page_size);
    
    RETURN QUERY
    SELECT 
        COALESCE(
            json_agg(
                json_build_object(
                    'id', bp.id,
                    'title', bp.title,
                    'slug', bp.slug,
                    'description', bp.description,
                    'content', bp.content,
                    'image', bp.image,
                    'category', c.name,
                    'author', COALESCE(u.name, 'Anonymous'),
                    'date', bp.published_at,
                    'likes', bp.likes,
                    'views', bp.views
                )
            ), 
            '[]'::json
        ) as posts,
        total_posts,
        total_pages_val,
        page_num;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment post views
CREATE OR REPLACE FUNCTION increment_post_views(post_id INTEGER)
RETURNS VOID AS $$
BEGIN
    UPDATE public.blog_posts 
    SET views = views + 1 
    WHERE id = post_id AND status_id = 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to toggle post like
CREATE OR REPLACE FUNCTION toggle_post_like(post_id INTEGER, user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    like_exists BOOLEAN;
    new_like_count INTEGER;
BEGIN
    -- Check if like exists
    SELECT EXISTS(
        SELECT 1 FROM public.post_likes 
        WHERE post_id = toggle_post_like.post_id AND user_id = toggle_post_like.user_id
    ) INTO like_exists;
    
    IF like_exists THEN
        -- Remove like
        DELETE FROM public.post_likes 
        WHERE post_id = toggle_post_like.post_id AND user_id = toggle_post_like.user_id;
        
        -- Decrement likes count
        UPDATE public.blog_posts 
        SET likes = GREATEST(likes - 1, 0) 
        WHERE id = toggle_post_like.post_id;
        
        RETURN FALSE; -- like removed
    ELSE
        -- Add like
        INSERT INTO public.post_likes (post_id, user_id) 
        VALUES (toggle_post_like.post_id, toggle_post_like.user_id);
        
        -- Increment likes count
        UPDATE public.blog_posts 
        SET likes = likes + 1 
        WHERE id = toggle_post_like.post_id;
        
        RETURN TRUE; -- like added
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
