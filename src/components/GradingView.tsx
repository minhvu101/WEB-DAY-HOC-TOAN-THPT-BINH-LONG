import React, { useState } from 'react';
import { MOCK_STUDENTS } from '../data/mockData';
import { Student } from '../types';
import MathFormula from './MathFormula';
import { CheckCircle2, Clock, Sparkles, Save, User, Award, Check } from 'lucide-react';

interface GradingViewProps {
  onSelectStudent: (student: Student) => void;
}

export const GradingView: React.FC<GradingViewProps> = ({ onSelectStudent }) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>('HS-001');
  const [essayScore, setEssayScore] = useState<number>(9.0);
  const [rubricPresentation, setRubricPresentation] = useState<number>(3); // max 3
  const [rubricMethod, setRubricMethod] = useState<number>(4); // max 4
  const [rubricResult, setRubricResult] = useState<number>(2); // max 3
  const [teacherFeedback, setTeacherFeedback] = useState<string>(
    'Em trình bày lời giải rõ ràng, tính đạo hàm bằng định nghĩa chính xác. Khuyến khích áp dụng công thức tính nhanh cho các bài toán trắc nghiệm tiếp theo!'
  );
  const [saveToast, setSaveToast] = useState(false);

  const activeStudent = MOCK_STUDENTS.find((s) => s.id === selectedStudentId) || MOCK_STUDENTS[0];

  const handleApplyAISuggestion = () => {
    setTeacherFeedback(
      `Bài làm của em ${activeStudent.name} đạt yêu cầu cao về mặt tư duy logic. Kỹ năng biến đổi đại số chính xác. Chú ý trình bày đơn vị của vận tốc tức thời (m/s). Điểm đánh giá: ${(rubricPresentation + rubricMethod + rubricResult).toFixed(1)}/10.`
    );
  };

  const handleSaveGrading = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Trung Tâm Chấm Điểm Điện Tử & Đánh Giá Rubric
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 mt-1">
            Chấm Bài Kiểm Tra & Phê Duyệt Kết Quả
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Tự động chấm trắc nghiệm · Hỗ trợ thang đo Rubric cho bài tự luận · AI gợi ý nhận xét sư phạm.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveGrading}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Lưu & Công bố điểm</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Student Roster & Grading Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Student Selector (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-800">
              Danh sách bài nộp Lớp 11A6 ({MOCK_STUDENTS.length})
            </span>
            <span className="text-[11px] text-emerald-600 font-semibold">Đã nộp 100%</span>
          </div>

          <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
            {MOCK_STUDENTS.map((s) => {
              const isSelected = s.id === selectedStudentId;
              return (
                <div
                  key={s.id}
                  onClick={() => setSelectedStudentId(s.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-slate-50 hover:bg-white border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{s.avatar}</span>
                    <div>
                      <div className="font-bold text-xs">{s.name}</div>
                      <div className={`text-[10px] ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                        Nộp lúc: 05/10/2026 · {s.studentCode}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-bold font-mono ${isSelected ? 'text-white' : 'text-blue-700'}`}>
                      {s.recentScores[0]?.total || 8.5} đ
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Grading Workspace (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5 text-xs">
          {/* Header of Active Student */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-slate-900">{activeStudent.name}</span>
                <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {activeStudent.studentCode}
                </span>
              </div>
              <span className="text-[11px] text-slate-500">
                Bài kiểm tra: Hàm số bậc hai & Đạo hàm · Lớp 11A6
              </span>
            </div>

            <button
              onClick={() => onSelectStudent(activeStudent)}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              Xem toàn bộ hồ sơ HS →
            </button>
          </div>

          {/* Section 1: Auto-graded Multiple Choice */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Phần 1: Trắc nghiệm (Hệ thống tự động chấm)</span>
              </span>
              <span className="font-mono font-bold text-emerald-700 text-sm">
                9.5 / 10.0 điểm (19/20 câu đúng)
              </span>
            </div>
            <p className="text-slate-600 text-[11px]">
              Câu sai duy nhất: Câu 14 (Vận dụng cao về cực trị có chứa tham số m). Hệ thống đã ghi nhận vào bản đồ năng lực của học sinh.
            </p>
          </div>

          {/* Section 2: Rubric for Essay */}
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-900 text-sm">
                Phần 2: Tự luận · Đánh giá theo Thang đo Rubric
              </span>
              <span className="font-mono font-bold text-blue-700 text-sm">
                Tổng tự luận: {(rubricPresentation + rubricMethod + rubricResult).toFixed(1)} / 10.0 điểm
              </span>
            </div>

            {/* Simulated Student Essay Answer */}
            <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200/80 space-y-1.5">
              <span className="font-bold text-amber-900 block">Bài làm tự luận của học sinh:</span>
              <div className="text-slate-700 italic bg-white p-3 rounded-lg border border-amber-100">
                <p>
                  "Phương trình chuyển động $s(t) = -t^3 + 9t^2 + 10t$. Ta có vận tốc tức thời là đạo hàm $v(t) = s'(t) = -3t^2 + 18t + 10$.
                </p>
                <p className="mt-1">
                  Biến đổi $v(t) = -3(t^2 - 6t) + 10 = -3(t - 3)^2 + 37$. Vì $-3(t - 3)^2 \le 0$ với mọi $t \ge 0$, do đó $v(t) \le 37$. Dấu bằng xảy ra khi $t = 3$ (giây). Vậy vận tốc tức thời lớn nhất là 37 m/s."
                </p>
              </div>
            </div>

            {/* Rubric Criteria Sliders */}
            <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex justify-between items-center">
                <span>1. Tiêu chí Phương pháp & Đạo hàm đúng (Tối đa 4đ):</span>
                <span className="font-bold font-mono text-blue-700">{rubricMethod}đ</span>
              </div>
              <input
                type="range"
                min="0"
                max="4"
                step="0.5"
                value={rubricMethod}
                onChange={(e) => setRubricMethod(parseFloat(e.target.value))}
                className="w-full accent-blue-600"
              />

              <div className="flex justify-between items-center pt-2">
                <span>2. Tiêu chí Biến đổi & Tìm Max chính xác (Tối đa 3đ):</span>
                <span className="font-bold font-mono text-blue-700">{rubricResult}đ</span>
              </div>
              <input
                type="range"
                min="0"
                max="3"
                step="0.5"
                value={rubricResult}
                onChange={(e) => setRubricResult(parseFloat(e.target.value))}
                className="w-full accent-blue-600"
              />

              <div className="flex justify-between items-center pt-2">
                <span>3. Tiêu chí Trình bày & Đơn vị (Tối đa 3đ):</span>
                <span className="font-bold font-mono text-blue-700">{rubricPresentation}đ</span>
              </div>
              <input
                type="range"
                min="0"
                max="3"
                step="0.5"
                value={rubricPresentation}
                onChange={(e) => setRubricPresentation(parseFloat(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>
          </div>

          {/* Section 3: Teacher Remark & AI Suggestion */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between items-center">
              <label className="font-bold text-slate-800">Lời phê & Nhận xét của giáo viên:</label>
              <button
                type="button"
                onClick={handleApplyAISuggestion}
                className="flex items-center gap-1 text-[11px] font-semibold text-indigo-700 hover:text-indigo-900 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI gợi ý lời nhận xét chuẩn sư phạm</span>
              </button>
            </div>
            <textarea
              rows={3}
              value={teacherFeedback}
              onChange={(e) => setTeacherFeedback(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-xl bg-slate-50 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {saveToast && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Đã lưu điểm thành công! Điểm số đã đồng bộ vào sổ điểm của học sinh {activeStudent.name}.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GradingView;
