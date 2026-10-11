import { createClient } from '@supabase/supabase-js';

// Retrieve Supabase credentials from Vite environment variables
export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mwrfxpcwrvcagpdjjahy.supabase.co';
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_hDzKn9dbqY0qMDSVeJPdjQ_GjM_dqNH';

// Initialize Supabase Client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export interface ConnectionTestResult {
  connected: boolean;
  message: string;
  url: string;
  tablesFound?: string[];
  latencyMs?: number;
}

/**
 * Test connectivity with Supabase project endpoint
 */
export async function testSupabaseConnection(): Promise<ConnectionTestResult> {
  const startTime = Date.now();
  try {
    // Attempt a light ping/query
    const { data, error } = await supabase.from('classes').select('id').limit(1);
    const latency = Date.now() - startTime;

    if (error) {
      // If table doesn't exist yet (PGRST204 / relation does not exist), the endpoint itself is reachable!
      if (error.code === '42P01' || error.message?.includes('relation') || error.message?.includes('does not exist') || error.code === 'PGRST204') {
        return {
          connected: true,
          message: 'Kết nối máy chủ Supabase thành công! (Chưa tạo bảng trong database, hãy chạy script SQL)',
          url: supabaseUrl,
          latencyMs: latency,
        };
      }
      return {
        connected: false,
        message: `Lỗi kết nối Supabase: ${error.message} (Mã lỗi: ${error.code})`,
        url: supabaseUrl,
        latencyMs: latency,
      };
    }

    return {
      connected: true,
      message: 'Kết nối Supabase hoàn tất và bảng dữ liệu hoạt động bình thường!',
      url: supabaseUrl,
      latencyMs: latency,
    };
  } catch (err: any) {
    const latency = Date.now() - startTime;
    return {
      connected: false,
      message: `Không thể kết nối đến máy chủ Supabase: ${err.message || err}`,
      url: supabaseUrl,
      latencyMs: latency,
    };
  }
}

/**
 * SQL Schema migration ready to execute in Supabase SQL Editor
 */
export const SUPABASE_SCHEMA_SQL = `-- SCRIPT KHỞI TẠO CƠ SỞ DỮ LIỆU TOÁN THPT BÌNH LONG TRÊN SUPABASE
-- Hãy sao chép toàn bộ đoạn này và dán vào Supabase Dashboard -> SQL Editor -> Nhấn RUN

-- 1. Bảng Lớp học (classes)
CREATE TABLE IF NOT EXISTS public.classes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  grade INT NOT NULL DEFAULT 11,
  homeroom_teacher TEXT,
  total_students INT DEFAULT 0,
  groups_count INT DEFAULT 4,
  weak_count INT DEFAULT 0,
  attention_count INT DEFAULT 0,
  attendance_rate NUMERIC DEFAULT 95,
  class_code TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Bảng Học sinh (students)
CREATE TABLE IF NOT EXISTS public.students (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  class_id TEXT REFERENCES public.classes(id) ON DELETE SET NULL,
  student_code TEXT,
  avatar TEXT,
  level INT DEFAULT 1,
  exp INT DEFAULT 0,
  title TEXT,
  streak INT DEFAULT 0,
  badges JSONB DEFAULT '[]'::jsonb,
  average_score NUMERIC DEFAULT 0,
  parent_name TEXT,
  parent_phone TEXT,
  risk_level TEXT DEFAULT 'low',
  weak_topics JSONB DEFAULT '[]'::jsonb,
  attendance_rate NUMERIC DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Bảng Bài tập & Đề kiểm tra (assignments)
CREATE TABLE IF NOT EXISTS public.assignments (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subject TEXT DEFAULT 'Toán',
  grade INT DEFAULT 11,
  target_classes JSONB DEFAULT '[]'::jsonb,
  duration INT DEFAULT 45,
  total_questions INT DEFAULT 20,
  format TEXT DEFAULT 'multiple_choice',
  status TEXT DEFAULT 'published',
  due_date TIMESTAMPTZ,
  matrix JSONB,
  questions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Bảng Kết quả thi / Bài nộp (submissions)
CREATE TABLE IF NOT EXISTS public.submissions (
  id TEXT PRIMARY KEY,
  assignment_id TEXT REFERENCES public.assignments(id) ON DELETE CASCADE,
  student_id TEXT REFERENCES public.students(id) ON DELETE CASCADE,
  student_name TEXT,
  class_name TEXT,
  score NUMERIC DEFAULT 0,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  time_spent INT DEFAULT 0,
  answers JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'graded',
  teacher_feedback TEXT
);

-- 5. Bảng Kế hoạch bài dạy (khbd_items)
CREATE TABLE IF NOT EXISTS public.khbd_items (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  unit_name TEXT,
  grade INT DEFAULT 11,
  periods INT DEFAULT 2,
  curriculum TEXT DEFAULT 'KNTT',
  content JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Bảng Tài khoản & Tên đăng nhập (app_users)
CREATE TABLE IF NOT EXISTS public.app_users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student',
  class_name TEXT,
  email TEXT,
  school TEXT DEFAULT 'THPT Bình Long – Đồng Nai',
  avatar TEXT DEFAULT '👤',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Thêm ngay các tài khoản mẫu vào bảng app_users
INSERT INTO public.app_users (id, username, password, full_name, role, class_name, email, school, avatar)
VALUES
  ('user-teacher-01', 'thayvu', '123', 'Thầy Nguyễn Minh Vũ', 'teacher', NULL, 'thayvu@binhlong.edu.vn', 'THPT Bình Long – Đồng Nai', '👨‍🏫'),
  ('user-student-01', 'tuankiet', '123', 'Trần Tuấn Kiệt', 'student', '11A6', 'tuankiet@binhlong.edu.vn', 'THPT Bình Long – Đồng Nai', '👨‍🎓'),
  ('user-parent-01', 'phuhuynhlong', '123', 'Bác Trần Văn Long', 'parent', NULL, 'phuhuynhlong@binhlong.edu.vn', 'THPT Bình Long – Đồng Nai', '👨‍👧'),
  ('user-admin-01', 'bangianghieu', '123', 'Ban Giám Hiệu', 'admin', NULL, 'admin@binhlong.edu.vn', 'THPT Bình Long – Đồng Nai', '🏛️')
ON CONFLICT (username) DO NOTHING;

-- Bật Row Level Security (RLS)
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.khbd_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_users ENABLE ROW LEVEL SECURITY;

-- Tự động xóa chính sách cũ nếu có trước khi tạo mới (tránh lỗi 42710)
DROP POLICY IF EXISTS "Cho phep doc public classes" ON public.classes;
DROP POLICY IF EXISTS "Cho phep ghi classes" ON public.classes;
CREATE POLICY "Cho phep doc public classes" ON public.classes FOR SELECT USING (true);
CREATE POLICY "Cho phep ghi classes" ON public.classes FOR ALL USING (true);

DROP POLICY IF EXISTS "Cho phep doc public students" ON public.students;
DROP POLICY IF EXISTS "Cho phep ghi students" ON public.students;
CREATE POLICY "Cho phep doc public students" ON public.students FOR SELECT USING (true);
CREATE POLICY "Cho phep ghi students" ON public.students FOR ALL USING (true);

DROP POLICY IF EXISTS "Cho phep doc public assignments" ON public.assignments;
DROP POLICY IF EXISTS "Cho phep ghi assignments" ON public.assignments;
CREATE POLICY "Cho phep doc public assignments" ON public.assignments FOR SELECT USING (true);
CREATE POLICY "Cho phep ghi assignments" ON public.assignments FOR ALL USING (true);

DROP POLICY IF EXISTS "Cho phep doc public submissions" ON public.submissions;
DROP POLICY IF EXISTS "Cho phep ghi submissions" ON public.submissions;
CREATE POLICY "Cho phep doc public submissions" ON public.submissions FOR SELECT USING (true);
CREATE POLICY "Cho phep ghi submissions" ON public.submissions FOR ALL USING (true);

DROP POLICY IF EXISTS "Cho phep doc public khbd" ON public.khbd_items;
DROP POLICY IF EXISTS "Cho phep ghi khbd" ON public.khbd_items;
CREATE POLICY "Cho phep doc public khbd" ON public.khbd_items FOR SELECT USING (true);
CREATE POLICY "Cho phep ghi khbd" ON public.khbd_items FOR ALL USING (true);

DROP POLICY IF EXISTS "Cho phep doc public app_users" ON public.app_users;
DROP POLICY IF EXISTS "Cho phep ghi app_users" ON public.app_users;
CREATE POLICY "Cho phep doc public app_users" ON public.app_users FOR SELECT USING (true);
CREATE POLICY "Cho phep ghi app_users" ON public.app_users FOR ALL USING (true);

-- ========================================================
-- NẠP TOÀN BỘ DỮ LIỆU ĐẦY ĐỦ VÀO SUPABASE (DATA SEED)
-- ========================================================

-- 1. Nạp Tài khoản người dùng (app_users)
INSERT INTO public.app_users (id, username, password, full_name, role, class_name, email, school, avatar)
VALUES
  ('user-teacher-01', 'thayvu', '123', 'Thầy Nguyễn Minh Vũ', 'teacher', NULL, 'thayvu@binhlong.edu.vn', 'THPT Bình Long – Đồng Nai', '👨‍🏫'),
  ('user-student-01', 'tuankiet', '123', 'Trần Tuấn Kiệt', 'student', '11A6', 'tuankiet@binhlong.edu.vn', 'THPT Bình Long – Đồng Nai', '👨‍🎓'),
  ('user-parent-01', 'phuhuynhlong', '123', 'Bác Trần Văn Long', 'parent', NULL, 'phuhuynhlong@binhlong.edu.vn', 'THPT Bình Long – Đồng Nai', '👨‍👧'),
  ('user-admin-01', 'bangianghieu', '123', 'Ban Giám Hiệu', 'admin', NULL, 'admin@binhlong.edu.vn', 'THPT Bình Long – Đồng Nai', '🏛️')
ON CONFLICT (username) DO NOTHING;

-- 2. Nạp Lớp học (classes)
INSERT INTO public.classes (id, name, grade, homeroom_teacher, total_students, groups_count, weak_count, attention_count, attendance_rate, class_code)
VALUES
  ('11A6', '11A6', 11, 'Nguyễn Minh Vũ', 37, 4, 8, 2, 96, 'MATH11A6'),
  ('11A1', '11A1', 11, 'Trần Thị Mai', 38, 4, 4, 1, 98, 'MATH11A1'),
  ('11A2', '11A2', 11, 'Lê Văn Hoàng', 38, 4, 6, 2, 95, 'MATH11A2'),
  ('11A7', '11A7', 11, 'Phạm Hồng Nhung', 35, 4, 7, 3, 94, 'MATH11A7'),
  ('11A12', '11A12', 11, 'Đỗ Hữu Thắng', 37, 4, 9, 4, 93, 'MATH11A12'),
  ('10A1', '10A1', 10, 'Vũ Thu Trang', 40, 4, 5, 2, 97, 'MATH10A1'),
  ('12A1', '12A1', 12, 'Nguyễn Minh Vũ', 36, 4, 2, 1, 99, 'MATH12A1')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  homeroom_teacher = EXCLUDED.homeroom_teacher,
  total_students = EXCLUDED.total_students,
  attendance_rate = EXCLUDED.attendance_rate;

-- 3. Nạp Danh sách Học sinh (students)
INSERT INTO public.students (id, name, class_id, student_code, avatar, level, exp, title, streak, badges, average_score, parent_name, parent_phone, risk_level, weak_topics, attendance_rate)
VALUES
  ('HS-001', 'Trần Tuấn Kiệt', '11A6', 'HS2024-1106', '👨‍🎓', 18, 2850, 'Xuất sắc', 12, '["Chiến Thần Đạo Hàm", "Bậc Thầy Parabol", "Streak 10 ngày"]'::jsonb, 9.1, 'Trần Văn Long', '0903 888 999', 'low', '["Xác suất có điều kiện"]'::jsonb, 98),
  ('HS-002', 'Nguyễn Văn An', '11A6', 'HS2024-1101', '👦', 15, 2150, 'Giỏi', 8, '["Chăm chỉ vàng", "Streak 7 ngày"]'::jsonb, 8.5, 'Nguyễn Văn Bình', '0903 111 333', 'low', '["Đạo hàm hàm hợp"]'::jsonb, 96),
  ('HS-003', 'Trần Thị Bích', '11A6', 'HS2024-1102', '👧', 14, 1980, 'Khá', 6, '["Tỉ mỉ toán học"]'::jsonb, 8.0, 'Lê Thị Nga', '0903 222 444', 'low', '["Hình học không gian"]'::jsonb, 97),
  ('HS-004', 'Lê Minh Cường', '11A6', 'HS2024-1103', '👦', 11, 1420, 'Cần hỗ trợ', 3, '["Tân binh vượt khó"]'::jsonb, 6.5, 'Lê Văn Hùng', '0903 333 555', 'high', '["Đạo hàm", "Khảo sát hàm số"]'::jsonb, 91),
  ('HS-005', 'Phạm Thị Dung', '11A6', 'HS2024-1104', '👧', 19, 3100, 'Xuất sắc', 15, '["Học bá toàn năng", "Streak 14 ngày"]'::jsonb, 9.3, 'Phạm Văn Nam', '0903 444 666', 'low', '[]'::jsonb, 100),
  ('HS-006', 'Hoàng Văn Em', '11A6', 'HS2024-1105', '👦', 9, 1100, 'Cần hỗ trợ', 2, '["Bền bỉ"]'::jsonb, 5.8, 'Hoàng Thị Mơ', '0903 555 777', 'high', '["Giải phương trình", "Đạo hàm"]'::jsonb, 89),
  ('HS-007', 'Đỗ Quang Huy', '11A6', 'HS2024-1107', '👦', 16, 2400, 'Giỏi', 10, '["Chiến binh hình học"]'::jsonb, 8.7, 'Đỗ Văn Thành', '0903 666 888', 'low', '["Thống kê"]'::jsonb, 98)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  average_score = EXCLUDED.average_score,
  level = EXCLUDED.level,
  exp = EXCLUDED.exp;

-- 4. Nạp Bài tập & Đề kiểm tra (assignments)
INSERT INTO public.assignments (id, title, subject, grade, target_classes, duration, total_questions, format, status, due_date, matrix)
VALUES
  ('BT-01', 'Hàm số bậc hai & Ứng dụng thực tế', 'Toán', 11, '["11A6"]'::jsonb, 45, 15, 'mixed', 'published', NOW() + INTERVAL '3 days', '{"nhanBiet": 6, "thongHieu": 5, "vanDung": 3, "vanDungCao": 1}'::jsonb),
  ('BT-02', 'Kiểm tra 15 phút - Chương 1 Đạo hàm', 'Toán', 11, '["11A6"]'::jsonb, 15, 10, 'multiple_choice', 'graded', NOW() - INTERVAL '2 days', '{"nhanBiet": 4, "thongHieu": 4, "vanDung": 2, "vanDungCao": 0}'::jsonb),
  ('BT-03', 'Bài tập về nhà - Cấp số cộng & Cấp số nhân', 'Toán', 11, '["11A1"]'::jsonb, 60, 12, 'mixed', 'graded', NOW() - INTERVAL '5 days', '{"nhanBiet": 4, "thongHieu": 4, "vanDung": 3, "vanDungCao": 1}'::jsonb),
  ('BT-04', 'Kiểm tra giữa kỳ Toán 11 - Đề số 1', 'Toán', 11, '["11A2"]'::jsonb, 90, 35, 'mixed', 'graded', NOW() - INTERVAL '10 days', '{"nhanBiet": 14, "thongHieu": 11, "vanDung": 7, "vanDungCao": 3}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  status = EXCLUDED.status;

-- 5. Nạp Kết quả bài nộp của học sinh (submissions)
INSERT INTO public.submissions (id, assignment_id, student_id, student_name, class_name, score, time_spent, status, teacher_feedback)
VALUES
  ('SUB-001', 'BT-01', 'HS-001', 'Trần Tuấn Kiệt', '11A6', 9.3, 38, 'graded', 'Lời giải rõ ràng, tính đạo hàm bằng định nghĩa chính xác. Khuyến khích áp dụng công thức tính nhanh.'),
  ('SUB-002', 'BT-01', 'HS-002', 'Nguyễn Văn An', '11A6', 8.5, 42, 'graded', 'Bài làm tốt, phần tự luận cẩn thận.'),
  ('SUB-003', 'BT-01', 'HS-004', 'Lê Minh Cường', '11A6', 6.5, 45, 'graded', 'Cần xem lại công thức đạo hàm hàm hợp.'),
  ('SUB-004', 'BT-01', 'HS-005', 'Phạm Thị Dung', '11A6', 9.5, 32, 'graded', 'Xuất sắc! Lời giải mẫu mực.')
ON CONFLICT (id) DO UPDATE SET
  score = EXCLUDED.score,
  teacher_feedback = EXCLUDED.teacher_feedback;

-- 6. Nạp Kế hoạch bài dạy KHBD 5512 (khbd_items)
INSERT INTO public.khbd_items (id, title, unit_name, grade, periods, curriculum, content)
VALUES
  ('KHBD-01', 'Bài 1: Hàm số bậc hai và đồ thị', 'Hàm số bậc hai', 10, 2, 'KNTT', '{"focus": "Mô hình hóa quỹ đạo ném bóng rổ và cổng parabol Bách Khoa", "pedagogical": "Dạy học theo định hướng phát triển phẩm chất, năng lực GDPT 2018"}'::jsonb),
  ('KHBD-02', 'Bài 2: Đạo hàm và ý nghĩa hình học', 'Đạo hàm', 11, 2, 'KNTT', '{"focus": "Ý nghĩa cơ học vận tốc tức thời và tiếp tuyến", "pedagogical": "Khám phá trực quan cát tuyến chuyển động trên hệ tọa độ"}'::jsonb),
  ('KHBD-03', 'Bài 3: Cấp số cộng và cấp số nhân', 'Dãy số', 11, 2, 'KNTT', '{"focus": "Bác An gửi tiết kiệm lãi kép ngân hàng và tăng trưởng mũ", "pedagogical": "Lồng ghép bài toán giáo dục tài chính thông minh"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  unit_name = EXCLUDED.unit_name;
`;
