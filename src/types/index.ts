export type UserRole = 'teacher' | 'student' | 'parent' | 'admin';

export type BloomLevel = 'NhanBiet' | 'ThongHieu' | 'VanDung' | 'VanDungCao';

export interface Student {
  id: string;
  name: string;
  studentCode: string;
  classId: string;
  avatar: string;
  level: number;
  xp: number;
  streakDays: number;
  coins: number;
  attendanceRate: number; // e.g. 96
  avgScore: number; // e.g. 8.6
  status: 'Xuất sắc' | 'Giỏi' | 'Khá' | 'Cần hỗ trợ';
  phone: string;
  parentName: string;
  parentPhone: string;
  strongSkills: string[];
  weakSkills: string[];
  badges: string[];
  homeworkCompleted: number; // e.g. 32/35
  recentScores: {
    title: string;
    scoreTN: number;
    scoreTL: number;
    total: number;
    date: string;
  }[];
  notes: string;
}

export interface ClassInfo {
  id: string;
  name: string;
  grade: number; // 10, 11, 12
  homeroomTeacher: string;
  totalStudents: number;
  groupsCount: number;
  weakCount: number;
  attentionCount: number;
  attendanceRate: number;
  gradeDistribution: {
    gioi: number;
    kha: number;
    trungBinh: number;
    yeu: number;
  };
  classCode: string;
}

export interface Assignment {
  id: string;
  title: string;
  classId: string;
  className: string;
  topic: string;
  type: 'Trắc nghiệm' | 'Tự luận' | 'Kết hợp';
  durationMinutes: number;
  assignedDate: string;
  dueDate: string;
  totalQuestions: number;
  status: 'Đang làm' | 'Đã chấm' | 'Chờ chấm';
  submittedCount: number;
  totalStudents: number;
  bloomBreakdown: {
    nhanBiet: number;
    thongHieu: number;
    vanDung: number;
    vanDungCao: number;
  };
}

export interface TrueFalseItem {
  id: string;
  statement: string;
  isCorrect: boolean;
  explanation?: string;
}

export type QuestionType = 'multiple_choice' | 'true_false' | 'short_answer' | 'essay';

export interface Question {
  id: string;
  topic: string;
  grade: number;
  content: string; // LaTeX enabled
  options?: string[]; // for multiple_choice 4 options A, B, C, D
  tfItems?: TrueFalseItem[]; // for true_false format (Ý a, b, c, d)
  correctAnswer: string | number;
  bloomLevel: BloomLevel;
  explanation: string;
  type: QuestionType;
  points?: number;
  section?: 'part1_mcq' | 'part2_true_false' | 'part3_short_answer' | 'part4_essay';
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  className: string;
  submittedAt: string;
  scoreTN: number;
  scoreTL: number;
  totalScore: number;
  status: 'Đã chấm' | 'Chờ chấm' | 'Đang chấm';
  essayFeedback: string;
  answers: Record<string, string | number>;
}

export interface SlideItem {
  id: number;
  slideType?: 'title' | 'objectives' | 'concept' | 'visual_diagram' | 'step_by_step' | 'quiz_interactive' | 'real_world' | 'summary';
  title: string;
  subtitle?: string;
  bulletPoints: string[];
  formula?: string;
  formulaNote?: string;
  visualCallout?: {
    type: 'graph' | 'geometry' | 'diagram' | 'formula_box' | 'quote' | 'flowchart';
    title: string;
    description: string;
    badge?: string;
    details?: string[];
  };
  steps?: {
    step: number;
    title: string;
    content: string;
    formula?: string;
  }[];
  quiz?: {
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
  };
  quizQuestion?: string;
  quizOptions?: string[];
  quizCorrectAnswer?: string;
  quizExplanation?: string;
  realWorldContext?: {
    topic: string;
    application: string;
    funFact?: string;
  };
  teacherNotes?: string;
}

export interface Lecture {
  id: string;
  title: string;
  grade: number;
  chapter: string;
  curriculum?: 'KNTT' | 'CTST' | 'Cánh Diều';
  type?: 'PPTX' | 'Video' | 'Tài liệu' | 'Thư viện số';
  duration?: string;
  slideCount?: number;
  slidesCount?: number;
  theme?: any;
  tags?: string[];
  description?: string;
  gradient?: string;
  sourceDocument?: {
    name: string;
    type: 'upload' | 'pasted' | 'textbook';
    snippet?: string;
    fileSize?: string;
    uploadedAt?: string;
    curriculum?: string;
  };
  slides: SlideItem[];
}

export interface KHBDItem {
  id: string;
  title: string;
  grade: number;
  curriculum: 'KNTT' | 'CTST' | 'Cánh Diều';
  periodsCount: number;
  objectives: {
    knowledge: string[];
    generalCompetencies: string[];
    specificCompetencies: string[];
    qualities: string[];
  };
  activities: {
    step: string;
    title: string;
    duration: string;
    description: string;
  }[];
  sourceDocument?: {
    name: string;
    type: 'upload' | 'pasted' | 'textbook';
    fileType?: string;
    fileSize?: string;
    uploadedAt?: string;
    snippet?: string;
    fullText?: string;
    imagePreview?: string;
    extractedFormulas?: string[];
    pedagogicalFocus?: string;
    sourceRef?: string;
    wordCount?: number;
  };
  studentWorksheet?: {
    title: string;
    questions: string[];
    qrCodeSnippet?: string;
  };
}

export interface HomeroomLog {
  id: string;
  date: string;
  week: number;
  attendancePresent: number;
  attendanceLate: number;
  attendanceAbsent: number;
  cleanlinessScore: number; // 10
  disciplineNotes: string;
  specialEvents: string;
  dutyGroup: string;
}

export interface ExamMatrix {
  id: string;
  title: string;
  grade: number;
  subject: string;
  durationMinutes: number;
  curriculum: 'KNTT' | 'CTST' | 'Cánh Diều';
  formatType: 'THPT_2025' | 'DinhKy_THPT' | 'Custom';
  structure: {
    part1_mcq: { count: number; pointsEach: number; totalPoints: number };
    part2_true_false: { count: number; pointsEach: number; totalPoints: number };
    part3_short_answer: { count: number; pointsEach: number; totalPoints: number };
    part4_essay: { count: number; pointsEach: number; totalPoints: number };
  };
  bloomTaxonomy: {
    nhanBiet: number; // %
    thongHieu: number; // %
    vanDung: number; // %
    vanDungCao: number; // %
  };
  sourceDocument?: {
    type: 'upload_matrix' | 'sample_exam' | 'textbook' | 'pasted';
    fileName?: string;
    fileSize?: string;
    snippet?: string;
    fullText?: string;
    imagePreview?: string;
  };
}
