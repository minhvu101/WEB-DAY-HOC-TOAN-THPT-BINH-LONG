import React from 'react';
import { Student } from '../types';
import MathFormula from './MathFormula';
import { X, Award, Flame, Zap, TrendingUp, CheckCircle, AlertTriangle, Sparkles, BookOpen, Clock } from 'lucide-react';

interface StudentProfileModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  student,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top Profile Header */}
        <div className="p-6 bg-gradient-to-r from-blue-700 via-indigo-700 to-indigo-800 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-3xl shadow-md">
              {student.avatar}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight">{student.name}</h2>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white/20">
                  Lớp {student.classId}
                </span>
                <span className="text-[11px] font-mono text-indigo-200">{student.studentCode}</span>
              </div>
              <p className="text-xs text-indigo-200 mt-1">
                Phụ huynh: {student.parentName} · SĐT: {student.parentPhone}
              </p>
            </div>
          </div>

          {/* Gamification Bar */}
          <div className="grid grid-cols-4 gap-3 mt-4 pt-4 border-t border-white/10">
            <div className="bg-white/10 rounded-xl p-2.5 text-center">
              <span className="text-[10px] text-indigo-200 block">Cấp độ</span>
              <span className="text-base font-bold text-amber-300 font-mono">Level {student.level}</span>
            </div>
            <div className="bg-white/10 rounded-xl p-2.5 text-center">
              <span className="text-[10px] text-indigo-200 block">Kinh nghiệm</span>
              <span className="text-base font-bold text-white font-mono">{student.xp} XP</span>
            </div>
            <div className="bg-white/10 rounded-xl p-2.5 text-center">
              <span className="text-[10px] text-indigo-200 block">Chuỗi ngày học</span>
              <span className="text-base font-bold text-orange-400 flex items-center justify-center gap-1 font-mono">
                <Flame className="w-4 h-4 fill-orange-400" /> {student.streakDays} ngày
              </span>
            </div>
            <div className="bg-white/10 rounded-xl p-2.5 text-center">
              <span className="text-[10px] text-indigo-200 block">Điểm trung bình</span>
              <span className="text-base font-bold text-emerald-300 font-mono">{student.avgScore}</span>
            </div>
          </div>
        </div>

        {/* Modal Scroll Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          {/* AI Learning Insight */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-blue-900 text-sm">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Bản Đồ Năng Lực & AI Learning Insight</span>
            </div>
            <p className="text-slate-700 leading-relaxed">
              Em {student.name} có tư duy hình học và đạo hàm rất nhạy bén. Trong 30 ngày qua, tốc độ giải quyết bài toán tiếp tuyến tăng <strong>+24%</strong> so với mặt bằng chung của lớp 11A6.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-white p-2.5 rounded-lg border border-emerald-200 space-y-1">
                <span className="font-semibold text-emerald-800 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Điểm mạnh nổi bật:
                </span>
                <ul className="text-slate-600 space-y-0.5 list-disc pl-4">
                  {student.strongSkills.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-amber-200 space-y-1">
                <span className="font-semibold text-amber-800 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Kỹ năng cần bổ trợ:
                </span>
                <ul className="text-slate-600 space-y-0.5 list-disc pl-4">
                  {student.weakSkills.length > 0 ? (
                    student.weakSkills.map((s, idx) => <li key={idx}>{s}</li>)
                  ) : (
                    <li className="text-emerald-600">Đã đạt chuẩn tất cả chủ đề!</li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Badges Earned */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Huy hiệu thành tích đã đạt được</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {student.badges.map((b, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 font-semibold flex items-center gap-1.5 shadow-2xs"
                >
                  <Award className="w-3.5 h-3.5 text-amber-600" />
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* Recent Exam & Homework Scores */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>Lịch sử điểm số & bài làm gần đây</span>
            </h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Bài kiểm tra</th>
                    <th className="py-2.5 px-3">Trắc nghiệm</th>
                    <th className="py-2.5 px-3">Tự luận</th>
                    <th className="py-2.5 px-3">Tổng kết</th>
                    <th className="py-2.5 px-3">Ngày làm</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {student.recentScores.map((score, index) => (
                    <tr key={index} className="hover:bg-slate-50/80">
                      <td className="py-2.5 px-3 font-sans font-medium text-slate-800">{score.title}</td>
                      <td className="py-2.5 px-3 text-slate-700">{score.scoreTN}</td>
                      <td className="py-2.5 px-3 text-slate-700">{score.scoreTL}</td>
                      <td className="py-2.5 px-3 font-bold text-blue-600">{score.total}</td>
                      <td className="py-2.5 px-3 text-slate-400 font-sans">{score.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Teacher Remark */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-800 block mb-1">
              Nhận xét của Giáo viên (Thầy Nguyễn Minh Vũ):
            </span>
            <p className="text-slate-600 italic">"{student.notes}"</p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Cập nhật tự động theo thời gian thực từ sổ điểm điện tử
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs rounded-lg transition-colors"
          >
            Đóng hồ sơ
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentProfileModal;
