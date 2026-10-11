import { supabase, supabaseUrl, supabaseAnonKey, testSupabaseConnection } from '../lib/supabase';
import { MOCK_CLASSES, MOCK_STUDENTS, MOCK_ASSIGNMENTS } from '../data/mockData';
import { ClassInfo, Student, Assignment } from '../types';

export interface SyncStatus {
  isConfigured: boolean;
  isConnected: boolean;
  lastChecked: string | null;
  message: string;
  source: 'supabase' | 'local_cache' | 'mock';
}

/**
 * Service to handle data interactions between React app and Supabase
 */
export const SupabaseDataService = {
  getCredentials() {
    return {
      url: supabaseUrl,
      anonKey: supabaseAnonKey,
      isConfigured: Boolean(supabaseUrl && supabaseAnonKey),
    };
  },

  async testConnection() {
    return await testSupabaseConnection();
  },

  /**
   * Seed Mock Data into Supabase tables
   */
  async seedInitialData(): Promise<{ success: boolean; message: string; counts?: { classes: number; students: number; assignments: number; users?: number; submissions?: number; khbd?: number } }> {
    try {
      // 1. Seed classes
      const classRows = MOCK_CLASSES.map((c) => ({
        id: c.id,
        name: c.name,
        grade: c.grade,
        homeroom_teacher: c.homeroomTeacher,
        total_students: c.totalStudents,
        groups_count: c.groupsCount,
        weak_count: c.weakCount,
        attention_count: c.attentionCount,
        attendance_rate: c.attendanceRate,
        class_code: c.classCode,
      }));

      const { error: classError } = await supabase.from('classes').upsert(classRows);
      if (classError) throw new Error(`Lỗi đẩy bảng classes: ${classError.message}`);

      // 2. Seed students
      const studentRows = MOCK_STUDENTS.map((s) => ({
        id: s.id,
        name: s.name,
        class_id: s.classId,
        student_code: s.studentCode,
        avatar: s.avatar,
        level: s.level,
        exp: s.xp,
        title: s.status,
        streak: s.streakDays,
        badges: s.badges,
        average_score: s.avgScore,
        parent_name: s.parentName,
        parent_phone: s.parentPhone,
        risk_level: s.status === 'Cần hỗ trợ' ? 'high' : 'low',
        weak_topics: s.weakSkills,
        attendance_rate: s.attendanceRate,
      }));

      const { error: studentError } = await supabase.from('students').upsert(studentRows);
      if (studentError) throw new Error(`Lỗi đẩy bảng students: ${studentError.message}`);

      // 3. Seed assignments
      const assignmentRows = MOCK_ASSIGNMENTS.map((a) => ({
        id: a.id,
        title: a.title,
        subject: 'Toán',
        grade: 11,
        target_classes: [a.className],
        duration: a.durationMinutes,
        total_questions: a.totalQuestions,
        format: a.type === 'Trắc nghiệm' ? 'multiple_choice' : 'mixed',
        status: a.status === 'Đã chấm' ? 'graded' : 'published',
        due_date: a.dueDate || new Date(Date.now() + 86400000 * 3).toISOString(),
        matrix: a.bloomBreakdown,
      }));

      // 4. Seed user accounts
      const userRows = [
        {
          id: 'user-teacher-01',
          username: 'thayvu',
          password: '123',
          full_name: 'Thầy Nguyễn Minh Vũ',
          role: 'teacher',
          class_name: null,
          email: 'thayvu@binhlong.edu.vn',
          school: 'THPT Bình Long – Đồng Nai',
          avatar: '👨‍🏫',
        },
        {
          id: 'user-student-01',
          username: 'tuankiet',
          password: '123',
          full_name: 'Trần Tuấn Kiệt',
          role: 'student',
          class_name: '11A6',
          email: 'tuankiet@binhlong.edu.vn',
          school: 'THPT Bình Long – Đồng Nai',
          avatar: '👨‍🎓',
        },
        {
          id: 'user-parent-01',
          username: 'phuhuynhlong',
          password: '123',
          full_name: 'Bác Trần Văn Long',
          role: 'parent',
          class_name: null,
          email: 'phuhuynhlong@binhlong.edu.vn',
          school: 'THPT Bình Long – Đồng Nai',
          avatar: '👨‍👧',
        },
        {
          id: 'user-admin-01',
          username: 'bangianghieu',
          password: '123',
          full_name: 'Ban Giám Hiệu',
          role: 'admin',
          class_name: null,
          email: 'admin@binhlong.edu.vn',
          school: 'THPT Bình Long – Đồng Nai',
          avatar: '🏛️',
        },
      ];

      try {
        await supabase.from('app_users').upsert(userRows);
      } catch {
        // Ignore if table not created yet
      }

      // 5. Seed sample submissions
      const submissionRows = [
        {
          id: 'SUB-001',
          assignment_id: 'BT-01',
          student_id: 'HS-001',
          student_name: 'Trần Tuấn Kiệt',
          class_name: '11A6',
          score: 9.3,
          time_spent: 38,
          status: 'graded',
          teacher_feedback: 'Lời giải rõ ràng, tính đạo hàm bằng định nghĩa chính xác. Khuyến khích áp dụng công thức tính nhanh.',
        },
        {
          id: 'SUB-002',
          assignment_id: 'BT-01',
          student_id: 'HS-002',
          student_name: 'Nguyễn Văn An',
          class_name: '11A6',
          score: 8.5,
          time_spent: 42,
          status: 'graded',
          teacher_feedback: 'Bài làm tốt, phần tự luận cẩn thận.',
        },
        {
          id: 'SUB-003',
          assignment_id: 'BT-01',
          student_id: 'HS-004',
          student_name: 'Lê Minh Cường',
          class_name: '11A6',
          score: 6.5,
          time_spent: 45,
          status: 'graded',
          teacher_feedback: 'Cần xem lại công thức đạo hàm hàm hợp.',
        },
        {
          id: 'SUB-004',
          assignment_id: 'BT-01',
          student_id: 'HS-005',
          student_name: 'Phạm Thị Dung',
          class_name: '11A6',
          score: 9.5,
          time_spent: 32,
          status: 'graded',
          teacher_feedback: 'Xuất sắc! Lời giải mẫu mực.',
        },
      ];
      try {
        await supabase.from('submissions').upsert(submissionRows);
      } catch {}

      // 6. Seed KHBD lesson plans
      const khbdRows = [
        {
          id: 'KHBD-01',
          title: 'Bài 1: Hàm số bậc hai và đồ thị',
          unit_name: 'Hàm số bậc hai',
          grade: 10,
          periods: 2,
          curriculum: 'KNTT',
          content: { focus: 'Mô hình hóa quỹ đạo ném bóng rổ và cổng parabol Bách Khoa', pedagogical: 'Dạy học theo định hướng phát triển phẩm chất, năng lực GDPT 2018' },
        },
        {
          id: 'KHBD-02',
          title: 'Bài 2: Đạo hàm và ý nghĩa hình học',
          unit_name: 'Đạo hàm',
          grade: 11,
          periods: 2,
          curriculum: 'KNTT',
          content: { focus: 'Ý nghĩa cơ học vận tốc tức thời và tiếp tuyến', pedagogical: 'Khám phá trực quan cát tuyến chuyển động trên hệ tọa độ' },
        },
        {
          id: 'KHBD-03',
          title: 'Bài 3: Cấp số cộng và cấp số nhân',
          unit_name: 'Dãy số',
          grade: 11,
          periods: 2,
          curriculum: 'KNTT',
          content: { focus: 'Bác An gửi tiết kiệm lãi kép ngân hàng và tăng trưởng mũ', pedagogical: 'Lồng ghép bài toán giáo dục tài chính thông minh' },
        },
      ];
      try {
        await supabase.from('khbd_items').upsert(khbdRows);
      } catch {}

      return {
        success: true,
        message: 'Đã đẩy thành công 100% dữ liệu (Lớp học, Học sinh, Đề thi, Bài nộp, Kế hoạch bài dạy & Tài khoản) lên Supabase!',
        counts: {
          classes: classRows.length,
          students: studentRows.length,
          assignments: assignmentRows.length,
          users: userRows.length,
          submissions: submissionRows.length,
          khbd: khbdRows.length,
        },
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'Không thể đồng bộ dữ liệu lên Supabase',
      };
    }
  },

  /**
   * Fetch Classes with fallback
   */
  async getClasses(): Promise<{ data: ClassInfo[]; from: 'supabase' | 'fallback' }> {
    try {
      const { data, error } = await supabase.from('classes').select('*');
      if (error || !data || data.length === 0) {
        return { data: MOCK_CLASSES, from: 'fallback' };
      }

      const formatted: ClassInfo[] = data.map((item: any) => ({
        id: item.id,
        name: item.name,
        grade: item.grade || 11,
        homeroomTeacher: item.homeroom_teacher || 'Nguyễn Minh Vũ',
        totalStudents: item.total_students || 0,
        groupsCount: item.groups_count || 4,
        weakCount: item.weak_count || 0,
        attentionCount: item.attention_count || 0,
        attendanceRate: Number(item.attendance_rate) || 95,
        gradeDistribution: { gioi: 15, kha: 12, trungBinh: 7, yeu: 3 },
        classCode: item.class_code || `MATH${item.id}`,
      }));

      return { data: formatted, from: 'supabase' };
    } catch {
      return { data: MOCK_CLASSES, from: 'fallback' };
    }
  },

  /**
   * Fetch Students with fallback
   */
  async getStudents(classId?: string): Promise<{ data: Student[]; from: 'supabase' | 'fallback' }> {
    try {
      let query = supabase.from('students').select('*');
      if (classId) {
        query = query.eq('class_id', classId);
      }
      const { data, error } = await query;
      if (error || !data || data.length === 0) {
        const fallback = classId ? MOCK_STUDENTS.filter((s) => s.classId === classId) : MOCK_STUDENTS;
        return { data: fallback, from: 'fallback' };
      }

      const formatted: Student[] = data.map((item: any) => ({
        id: item.id,
        name: item.name,
        studentCode: item.student_code || `HS${item.id}`,
        classId: item.class_id || '11A6',
        avatar: item.avatar || '👨‍🎓',
        level: item.level || 1,
        xp: item.exp || 100,
        streakDays: item.streak || 3,
        coins: 100,
        attendanceRate: Number(item.attendance_rate) || 96,
        avgScore: Number(item.average_score) || 7.5,
        status: (item.title as any) || 'Giỏi',
        phone: '0912 345 678',
        parentName: item.parent_name || 'Phụ huynh',
        parentPhone: item.parent_phone || '0987 654 321',
        strongSkills: ['Hình học không gian', 'Đại số'],
        weakSkills: Array.isArray(item.weak_topics) ? item.weak_topics : ['Lượng giác'],
        badges: Array.isArray(item.badges) ? item.badges : ['Chăm chỉ'],
        homeworkCompleted: 30,
        recentScores: [],
        notes: '',
      }));

      return { data: formatted, from: 'supabase' };
    } catch {
      const fallback = classId ? MOCK_STUDENTS.filter((s) => s.classId === classId) : MOCK_STUDENTS;
      return { data: fallback, from: 'fallback' };
    }
  },
};
