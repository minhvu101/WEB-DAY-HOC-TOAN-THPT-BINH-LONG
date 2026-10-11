import React, { useState } from 'react';
import { MOCK_CLASSES, MOCK_ASSIGNMENTS, MOCK_STUDENTS, MOCK_LECTURES, MOCK_KHBD } from '../data/mockData';
import { ClassInfo, Student } from '../types';
import MathFormula from './MathFormula';
import {
  Users,
  BookOpen,
  FileCheck2,
  TrendingUp,
  AlertCircle,
  Plus,
  Search,
  Download,
  Calendar,
  Sparkles,
  Play,
  Share2,
  ChevronRight,
  ExternalLink,
  CheckCircle,
  Clock,
  Eye,
} from 'lucide-react';

interface TeacherDashboardProps {
  onSelectStudent: (student: Student) => void;
  onOpenAIQuestionGen: () => void;
  onNavigateTab: (tab: string) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  onSelectStudent,
  onOpenAIQuestionGen,
  onNavigateTab,
}) => {
  const [selectedClassId, setSelectedClassId] = useState<string>('11A6');
  const [selectedTopic, setSelectedTopic] = useState<string>('Hàm số bậc hai');
  const [assignmentType, setAssignmentType] = useState<'Trắc nghiệm' | 'Tự luận' | 'Kết hợp'>('Kết hợp');
  const [assignmentDuration, setAssignmentDuration] = useState<string>('45 phút');
  const [assignmentDueDate, setAssignmentDueDate] = useState<string>('2026-10-15');
  const [assignmentContent, setAssignmentContent] = useState<string>('Bài tập về hàm số bậc hai (theo chương trình KNTT)');
  const [assignmentSuccessToast, setAssignmentSuccessToast] = useState(false);

  const selectedClass = MOCK_CLASSES.find((c) => c.id === selectedClassId) || MOCK_CLASSES[0];
  const classStudents = MOCK_STUDENTS.filter((s) => s.classId === selectedClassId);

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    setAssignmentSuccessToast(true);
    setTimeout(() => setAssignmentSuccessToast(false), 3000);
  };

  const handleExportExcel = () => {
    // Generate simulated CSV export
    const headers = 'STT,Họ và tên,Lớp,Điểm TN,Điểm TL,Tổng điểm,Trạng thái\n';
    const rows = classStudents
      .map(
        (s, i) =>
          `${i + 1},"${s.name}",${s.classId},${s.recentScores[0]?.scoreTN || 8.0},${s.recentScores[0]?.scoreTL || 7.5},${s.avgScore},Đã chấm`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BangDiem_${selectedClassId}_Toan11.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. HERO TEACHER BANNER WITH BRANDING & MOTTO */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white shadow-md border border-blue-700/50">
        {/* Subtle geometric math backdrop vectors */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative z-10 p-6 md:p-8 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-xs font-semibold text-blue-200">
              <span>🏫 Trường THPT Bình Long · TP. Đồng Nai</span>
              <span>·</span>
              <span>Năm học 2026 - 2027</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              “Dạy học bằng đam mê – Kiến tạo tương lai!”
            </h1>

            <p className="text-xs md:text-sm text-blue-100 italic leading-relaxed font-serif">
              “Toán học không chỉ là những con số, mà là chìa khóa mở ra thế giới tư duy và sáng tạo.”
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1">
              <span className="text-[11px] font-semibold text-white/90 bg-white/10 px-2.5 py-1 rounded-lg backdrop-blur-xs">
                👨‍🏫 Thầy Nguyễn Minh Vũ · GV Toán
              </span>
              <span className="text-[11px] font-semibold text-cyan-300 bg-cyan-950/60 px-2.5 py-1 rounded-lg border border-cyan-800/80">
                Chương trình: CTGDPT 2018 (KNTT / CTST / Cánh Diều)
              </span>
            </div>
          </div>

          {/* Glowing Math Book Graphic */}
          <div className="relative flex items-center justify-center">
            <div className="w-44 h-40 md:w-52 md:h-44 rounded-2xl bg-gradient-to-br from-blue-600/30 to-cyan-500/30 border border-cyan-400/30 p-4 flex flex-col justify-between backdrop-blur-sm shadow-xl">
              <div className="flex items-center justify-between text-xs font-mono text-cyan-200">
                <span>f'(x) = dy/dx</span>
                <span>a²+b²=c²</span>
              </div>
              <div className="text-center py-2">
                <div className="text-3xl md:text-4xl animate-bounce">📖</div>
                <span className="text-xs font-bold text-white tracking-wide block mt-1">
                  MathHub Command Center
                </span>
                <span className="text-[10px] text-cyan-200">Kho học liệu số THPT</span>
              </div>
              <div className="text-center text-[10px] text-blue-200 font-mono">
                P(A) = n(A)/n(Ω)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. FIVE KPI SUMMARY METRIC CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xl">
            🏛️
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Tổng số lớp</span>
            <span className="text-2xl font-extrabold text-slate-900 font-mono">12</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl">
            👥
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Tổng số học sinh</span>
            <span className="text-2xl font-extrabold text-slate-900 font-mono">420</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl">
            📝
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Bài tập đã giao</span>
            <span className="text-2xl font-extrabold text-slate-900 font-mono">48</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xl">
            📋
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Bài kiểm tra</span>
            <span className="text-2xl font-extrabold text-slate-900 font-mono">15</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex items-center gap-3.5 col-span-2 sm:col-span-1">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-xl">
            ✅
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Tỉ lệ hoàn thành</span>
            <span className="text-2xl font-extrabold text-teal-700 font-mono">92%</span>
          </div>
        </div>
      </div>

      {/* 3. AI MORNING ALERTS: 3 ĐIỀU GIÁO VIÊN CẦN CHÚ Ý HÔM NAY */}
      <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border border-blue-200/80 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-blue-900 uppercase tracking-wide">
              AI Insight · 3 điều Thầy Vũ cần lưu ý hôm nay
            </span>
          </div>
          <span className="text-[11px] text-blue-700 font-mono">Cập nhật lúc 07:00 sáng</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-white p-3 rounded-xl border border-amber-200 flex items-start gap-2.5 shadow-2xs">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-900 block">5 học sinh lớp 11A6 chưa nộp bài</span>
              <p className="text-slate-600 text-[11px] mt-0.5">
                Bài tập "Hàm số bậc hai" hết hạn hôm nay lúc 23:59. Đã gửi thông báo nhắc nhở tự động.
              </p>
            </div>
          </div>
          <div className="bg-white p-3 rounded-xl border border-rose-200 flex items-start gap-2.5 shadow-2xs">
            <TrendingUp className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-900 block">3 học sinh có xu hướng giảm điểm</span>
              <p className="text-slate-600 text-[11px] mt-0.5">
                Em Lê Minh Cường, Hoàng Văn Em tụt 1.5 điểm ở phần Đạo hàm tiếp tuyến. Nên kèm cặp thêm.
              </p>
            </div>
          </div>
          <div className="bg-white p-3 rounded-xl border border-emerald-200 flex items-start gap-2.5 shadow-2xs">
            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-900 block">7 học sinh cần củng cố chủ đề Hàm số</span>
              <p className="text-slate-600 text-[11px] mt-0.5">
                AI đề xuất giao gói 5 câu trắc nghiệm mức độ Nhận biết – Thông hiểu trong Math Lab.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. CLASS MANAGEMENT MODULE (Exact match with reference image) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">Quản lý lớp học</h2>
          </div>
          <button
            onClick={() => onNavigateTab('classes')}
            className="flex items-center gap-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tạo lớp mới</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Class List Column (4 cols) */}
          <div className="lg:col-span-4 space-y-2">
            <div className="relative mb-2">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Tìm kiếm lớp học..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1.5 max-h-[340px] overflow-y-auto pr-1">
              {MOCK_CLASSES.slice(0, 6).map((cls) => {
                const isSelected = cls.id === selectedClassId;
                return (
                  <div
                    key={cls.id}
                    onClick={() => setSelectedClassId(cls.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-700'
                        }`}
                      >
                        👥
                      </div>
                      <div>
                        <div className="font-bold text-sm">{cls.name}</div>
                        <div className={`text-[11px] ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                          {cls.totalStudents} học sinh · {cls.homeroomTeacher === 'Nguyễn Minh Vũ' ? 'GVCN' : 'Bộ môn'}
                        </div>
                      </div>
                    </div>
                    {isSelected && <ChevronRight className="w-4 h-4 text-white" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Class Detail Overview (8 cols) */}
          <div className="lg:col-span-8 bg-slate-50/70 rounded-xl p-4 border border-slate-200/80 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-slate-900">Lớp {selectedClass.name}</span>
                <span className="text-[11px] font-mono bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-semibold">
                  Mã: {selectedClass.classCode}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <button
                  onClick={() => onNavigateTab('classes')}
                  className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50"
                >
                  Danh sách HS
                </button>
                <button
                  onClick={() => onNavigateTab('homeroom')}
                  className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50"
                >
                  Điểm danh
                </button>
              </div>
            </div>

            {/* Quick 4 Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-white p-3 rounded-xl border border-slate-200 text-center">
                <span className="text-xl font-bold text-slate-900 font-mono block">
                  {selectedClass.totalStudents}
                </span>
                <span className="text-[11px] text-slate-500">Học sinh</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200 text-center">
                <span className="text-xl font-bold text-emerald-700 font-mono block">
                  {selectedClass.groupsCount}
                </span>
                <span className="text-[11px] text-slate-500">Tổ học tập</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200 text-center">
                <span className="text-xl font-bold text-amber-600 font-mono block">
                  {selectedClass.weakCount}
                </span>
                <span className="text-[11px] text-slate-500">Học sinh yếu</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200 text-center">
                <span className="text-xl font-bold text-rose-600 font-mono block">
                  {selectedClass.attentionCount}
                </span>
                <span className="text-[11px] text-slate-500">Cần quan tâm</span>
              </div>
            </div>

            {/* Grade Distribution Bar & Attendance Circle */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              {/* Distribution */}
              <div className="md:col-span-2 bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between text-xs font-semibold text-slate-800">
                  <span>Biểu đồ kết quả học tập</span>
                  <span className="text-slate-400 text-[10px]">Đánh giá theo chuẩn CTGDPT</span>
                </div>
                <div className="flex items-end justify-around h-28 pt-4 border-b border-slate-100">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] font-mono font-bold text-emerald-600">
                      {selectedClass.gradeDistribution.gioi}
                    </span>
                    <div
                      className="w-10 bg-emerald-500 rounded-t-md transition-all duration-300"
                      style={{ height: `${selectedClass.gradeDistribution.gioi * 4}px` }}
                    />
                    <span className="text-[10px] text-slate-600 font-medium">Giỏi</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] font-mono font-bold text-blue-600">
                      {selectedClass.gradeDistribution.kha}
                    </span>
                    <div
                      className="w-10 bg-blue-500 rounded-t-md transition-all duration-300"
                      style={{ height: `${selectedClass.gradeDistribution.kha * 4}px` }}
                    />
                    <span className="text-[10px] text-slate-600 font-medium">Khá</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] font-mono font-bold text-amber-600">
                      {selectedClass.gradeDistribution.trungBinh}
                    </span>
                    <div
                      className="w-10 bg-amber-500 rounded-t-md transition-all duration-300"
                      style={{ height: `${selectedClass.gradeDistribution.trungBinh * 4}px` }}
                    />
                    <span className="text-[10px] text-slate-600 font-medium">TB</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] font-mono font-bold text-rose-600">
                      {selectedClass.gradeDistribution.yeu}
                    </span>
                    <div
                      className="w-10 bg-rose-500 rounded-t-md transition-all duration-300"
                      style={{ height: `${selectedClass.gradeDistribution.yeu * 4}px` }}
                    />
                    <span className="text-[10px] text-slate-600 font-medium">Yếu</span>
                  </div>
                </div>
              </div>

              {/* Attendance Donut */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-col items-center justify-center text-center">
                <span className="text-xs font-semibold text-slate-800 mb-2">Tỉ lệ chuyên cần</span>
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-100"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-emerald-500"
                      strokeDasharray={`${selectedClass.attendanceRate}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute text-base font-extrabold text-slate-900 font-mono">
                    {selectedClass.attendanceRate}%
                  </span>
                </div>
                <span className="text-[10px] text-emerald-600 font-medium mt-1">
                  ● Đạt chuẩn xuất sắc
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. GIAO BÀI TẬP & KIỂM TRA (Reference module) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              📝
            </span>
            <h2 className="text-base font-bold text-slate-900">Giao bài tập & Kiểm tra</h2>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={onOpenAIQuestionGen}
              className="flex items-center gap-1 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Tạo Đề</span>
            </button>
            <button
              onClick={() => onNavigateTab('assignments')}
              className="text-xs font-medium text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded-lg hover:bg-slate-100"
            >
              Ngân hàng đề →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form Create Assignment (7 cols) */}
          <form onSubmit={handleCreateAssignment} className="lg:col-span-7 space-y-3.5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Chọn lớp:</label>
                <select
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-1 focus:ring-blue-500"
                >
                  {MOCK_CLASSES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.totalStudents} học sinh)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Chọn chủ đề:</label>
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Hàm số bậc hai">Hàm số bậc hai & Parabol</option>
                  <option value="Đạo hàm">Đạo hàm & Ý nghĩa hình học</option>
                  <option value="Xác suất">Xác suất - Thống kê</option>
                  <option value="Cấp số cộng">Cấp số cộng & Cấp số nhân</option>
                  <option value="Hình học không gian">Hình học không gian</option>
                </select>
              </div>
            </div>

            {/* Formats */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Hình thức kiểm tra:</label>
              <div className="flex items-center gap-3">
                {(['Trắc nghiệm', 'Tự luận', 'Kết hợp'] as const).map((t) => (
                  <label key={t} className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="assignmentType"
                      checked={assignmentType === t}
                      onChange={() => setAssignmentType(t)}
                      className="accent-blue-600"
                    />
                    <span>{t}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Thời gian làm bài:</label>
                <input
                  type="text"
                  value={assignmentDuration}
                  onChange={(e) => setAssignmentDuration(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Hạn nộp bài:</label>
                <input
                  type="date"
                  value={assignmentDueDate}
                  onChange={(e) => setAssignmentDueDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nội dung / Yêu cầu bài tập:</label>
              <input
                type="text"
                value={assignmentContent}
                onChange={(e) => setAssignmentContent(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
              />
            </div>

            {assignmentSuccessToast && (
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Đã giao bài thành công cho lớp {selectedClassId}! Học sinh đã nhận được thông báo.</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-xs"
            >
              🚀 Giao bài ngay
            </button>
          </form>

          {/* Assigned Homework Progress List (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <span className="font-bold text-slate-800 text-xs block">
              Danh sách bài tập đã giao gần đây
            </span>

            <div className="space-y-2.5">
              {MOCK_ASSIGNMENTS.map((a) => (
                <div
                  key={a.id}
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white transition-all space-y-1.5 text-xs shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{a.title}</span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        a.status === 'Đang làm'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {a.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500 text-[11px]">
                    <span>
                      {a.className} · Hạn: {a.dueDate}
                    </span>
                    <span className="font-mono font-bold text-blue-700">
                      {a.submittedCount}/{a.totalStudents} nộp
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${(a.submittedCount / a.totalStudents) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 6. CHẤM ĐIỂM & THEO DÕI KẾT QUẢ (Reference table) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              🎯
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Chấm điểm & Theo dõi kết quả
              </h2>
              <p className="text-xs text-slate-500">
                Click vào học sinh để mở "Hồ sơ năng lực số" và AI Learning Insight
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportExcel}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Xuất file Excel</span>
            </button>
          </div>
        </div>

        {/* Student Score Table */}
        <div className="border border-slate-200 rounded-xl overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">STT</th>
                <th className="py-3 px-4">Họ và tên</th>
                <th className="py-3 px-4">Điểm TN</th>
                <th className="py-3 px-4">Điểm TL</th>
                <th className="py-3 px-4">Tổng điểm</th>
                <th className="py-3 px-4">Chuyên cần</th>
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classStudents.map((s, idx) => (
                <tr
                  key={s.id}
                  onClick={() => onSelectStudent(s)}
                  className="hover:bg-blue-50/50 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4 font-mono text-slate-400">{idx + 1}</td>
                  <td className="py-3 px-4 font-semibold text-slate-900 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-sm">
                      {s.avatar}
                    </span>
                    <span>{s.name}</span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-700">
                    {s.recentScores[0]?.scoreTN || 8.5}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-700">
                    {s.recentScores[0]?.scoreTL || 8.0}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-blue-700 text-sm">
                    {s.avgScore}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600">
                    {s.attendanceRate}%
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        s.status === 'Xuất sắc'
                          ? 'bg-emerald-100 text-emerald-800'
                          : s.status === 'Giỏi'
                          ? 'bg-blue-100 text-blue-800'
                          : s.status === 'Khá'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectStudent(s);
                      }}
                      className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
                    >
                      Xem hồ sơ →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 7. BÀI GIẢNG & TÀI LIỆU PPTX BANK (Exact match with reference cards) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              📚
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900">Bài giảng PPTX & Thư viện số</h2>
              <p className="text-xs text-slate-500">Kho bài giảng tương tác chuẩn CTGDPT 2018 · Trình chiếu lớp học & Xuất .pptx</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateTab('lectures')}
              className="text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              + Nạp tài liệu & Tạo Slide .pptx AI →
            </button>
          </div>
        </div>

        {/* 6 Lesson Cards from Reference */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_LECTURES.map((lec) => (
            <div
              key={lec.id}
              className="rounded-xl border border-slate-200 overflow-hidden bg-white hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between"
            >
              <div className={`p-4 bg-gradient-to-r ${lec.gradient} text-white space-y-1 relative`}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                    {lec.type} · Lớp {lec.grade}
                  </span>
                  {lec.sourceDocument && (
                    <span className="text-[9px] bg-white/20 text-white px-2 py-0.5 rounded font-medium truncate max-w-[120px]">
                      Nguồn: SGK Số
                    </span>
                  )}
                </div>
                <h3 className="text-base font-bold tracking-tight text-white">{lec.title}</h3>
                <p className="text-[11px] text-white/80 line-clamp-2">{lec.description}</p>
              </div>

              <div className="p-3.5 space-y-2.5 text-xs bg-slate-50/50 flex-1 flex flex-col justify-between">
                <div className="flex flex-wrap gap-1">
                  {(lec.tags || []).map((tag, i) => (
                    <span key={i} className="text-[10px] text-slate-600 bg-white border border-slate-200 px-1.5 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-mono">{lec.slideCount} slides · 16:9</span>
                  <button
                    onClick={() => onNavigateTab('lectures')}
                    className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Xem & Xuất .pptx</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 8. KẾ HOẠCH BÀI DẠY (KHBD) & LỚP CHỦ NHIỆM */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* KHBD Box (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs">
                📋
              </span>
              <h3 className="text-sm font-bold text-slate-900">Kế hoạch bài dạy (KHBD) 5512</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigateTab('khbd')}
                className="text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 px-2.5 py-1 rounded-md transition-colors"
              >
                + Soạn & Xuất .docx
              </button>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-teal-50/50 border border-teal-200 space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="font-bold text-teal-900 text-sm">{MOCK_KHBD[0].title}</span>
              <span className="text-[10px] font-semibold bg-teal-200 text-teal-800 px-2 py-0.5 rounded">
                Toán 10 · 2 tiết
              </span>
            </div>
            {MOCK_KHBD[0].sourceDocument && (
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 bg-emerald-100/60 px-2 py-1 rounded">
                <span>📖 Nguồn tài liệu gốc:</span>
                <span className="font-semibold truncate">{MOCK_KHBD[0].sourceDocument.name}</span>
              </div>
            )}
            <div className="space-y-1 text-slate-700">
              <div className="font-semibold text-teal-950">Mục tiêu phát triển năng lực:</div>
              <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                {MOCK_KHBD[0].objectives.knowledge.map((k, i) => (
                  <li key={i}>{k}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Homeroom Box (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                👨‍🏫
              </span>
              <h3 className="text-sm font-bold text-slate-900">Lớp chủ nhiệm (11A6)</h3>
            </div>
            <button
              onClick={() => onNavigateTab('homeroom')}
              className="text-xs text-blue-600 hover:underline"
            >
              Mở sổ chủ nhiệm
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-purple-50/50 border border-purple-200 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-purple-950">Sĩ số: 37 học sinh (4 tổ)</span>
              <span className="text-[10px] text-purple-700 font-semibold bg-purple-100 px-2 py-0.5 rounded">
                Nề nếp: Xuất sắc (98%)
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700 pt-1">
              <div>• Lớp trưởng: Nguyễn Văn An</div>
              <div>• Bí thư: Trần Tuấn Kiệt</div>
              <div>• Đi trễ tuần này: 1 lượt</div>
              <div>• Vắng không phép: 0</div>
            </div>
            <div className="pt-2 border-t border-purple-200/80 text-[11px] text-purple-900 font-medium">
              🔔 Nhắc việc: Họp phụ huynh học sinh vào ngày 15/10/2026.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
