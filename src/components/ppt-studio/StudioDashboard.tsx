import React from 'react';
import { Lecture } from '../../types';
import {
  Sparkles,
  Plus,
  Play,
  Download,
  BookOpen,
  Layers,
  Activity,
  ShieldCheck,
  CheckCircle2,
  Tv,
  ArrowRight,
  TrendingUp,
  FileCheck,
  Zap,
  Sliders,
  Dices,
} from 'lucide-react';

interface StudioDashboardProps {
  lectures: Lecture[];
  onSelectLecture: (lecture: Lecture) => void;
  onOpenCreateWizard: () => void;
  onOpenVisualizer: () => void;
  onOpenGamification: () => void;
  onOpenQACenter: () => void;
  onExportPptx: (lecture: Lecture) => void;
}

export const StudioDashboard: React.FC<StudioDashboardProps> = ({
  lectures,
  onSelectLecture,
  onOpenCreateWizard,
  onOpenVisualizer,
  onOpenGamification,
  onOpenQACenter,
  onExportPptx,
}) => {
  const totalSlides = lectures.reduce((acc, l) => acc + l.slides.length, 0);

  return (
    <div className="space-y-6">
      {/* Hero Studio Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border border-slate-800 p-6 sm:p-8 shadow-2xl text-white">
        {/* Ambient background glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                AI PPTX MATH STUDIO · PHIÊN BẢN 2026 PRO
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Hệ Thống Kiến Tạo Bài Giảng Toán THPT Đẳng Cấp Quốc Tế
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Biến kế hoạch bài dạy (KHBD), tài liệu sách giáo khoa hoặc slide cũ thành tệp PowerPoint (.pptx) chuẩn 16:9 
              hoàn chỉnh · Tích hợp công thức LaTeX chuẩn xác, đồ thị động và hiệu ứng Morph 3D 60fps mượt mà.
            </p>

            {/* Quick metrics badges */}
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
              <div className="px-3 py-1 rounded-xl bg-slate-800/80 border border-slate-700/80 text-cyan-300 font-mono">
                ✓ Hiệu ứng Morph 3D chi tiết
              </div>
              <div className="px-3 py-1 rounded-xl bg-slate-800/80 border border-slate-700/80 text-emerald-300 font-mono">
                ✓ Chuẩn GDPT 2018 (CV 5512)
              </div>
              <div className="px-3 py-1 rounded-xl bg-slate-800/80 border border-slate-700/80 text-purple-300 font-mono">
                ✓ Xuất file .pptx thực sự tải về
              </div>
            </div>
          </div>

          {/* Quick CTA Actions */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <button
              onClick={onOpenCreateWizard}
              className="px-6 py-3.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 text-slate-950 font-extrabold rounded-2xl shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 text-xs"
            >
              <Sparkles className="w-4 h-4" />
              <span>Tạo Bài Giảng Mới (Quy trình 6 bước)</span>
            </button>

            <button
              onClick={onOpenVisualizer}
              className="px-5 py-3 bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700/80 rounded-2xl font-bold transition-all cursor-pointer flex items-center justify-center gap-2 text-xs"
            >
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Mở Thư Viện Đồ Thị Động</span>
            </button>
          </div>
        </div>
      </div>

      {/* 6-Step Visual Workflow Overview */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              Quy Trình Tạo Bài Giảng Thông Minh (6 Bước Chuẩn Sư Phạm)
            </h3>
            <p className="text-xs text-slate-500">
              Quy trình khép kín từ nạp tài liệu đến xuất file PowerPoint hoàn thiện
            </p>
          </div>
          <button
            onClick={onOpenCreateWizard}
            className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Bắt đầu ngay</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-200/60 space-y-1.5">
            <div className="w-6 h-6 rounded-lg bg-blue-600 text-white font-mono font-bold flex items-center justify-center text-xs">
              1
            </div>
            <div className="font-bold text-blue-950 text-xs">Tiếp nhận tài liệu</div>
            <p className="text-[11px] text-slate-600">Nạp KHBD 5512, SGK số KNTT hoặc slide PPTX cũ.</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-200/60 space-y-1.5">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-mono font-bold flex items-center justify-center text-xs">
              2
            </div>
            <div className="font-bold text-indigo-950 text-xs">Phân tích sư phạm</div>
            <p className="text-[11px] text-slate-600">Bóc tách mục tiêu năng lực, công thức và bẫy sai lầm.</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-200/60 space-y-1.5">
            <div className="w-6 h-6 rounded-lg bg-purple-600 text-white font-mono font-bold flex items-center justify-center text-xs">
              3
            </div>
            <div className="font-bold text-purple-950 text-xs">Chọn chế độ dạy</div>
            <p className="text-[11px] text-slate-600">9 chế độ: Visual Wow, Hội thi GVDG, STEM, Luyện thi...</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-cyan-50/60 border border-cyan-200/60 space-y-1.5">
            <div className="w-6 h-6 rounded-lg bg-cyan-600 text-white font-mono font-bold flex items-center justify-center text-xs">
              4
            </div>
            <div className="font-bold text-cyan-950 text-xs">Thiết kế slide</div>
            <p className="text-[11px] text-slate-600">Gợi ý đồ họa, lời dẫn giáo viên, gán thẻ !!Morph.</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/60 space-y-1.5">
            <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-mono font-bold flex items-center justify-center text-xs">
              5
            </div>
            <div className="font-bold text-emerald-950 text-xs">Biên tập & Kiểm định</div>
            <p className="text-[11px] text-slate-600">Live preview KaTeX, kiểm tra tràn chữ, rà soát điều kiện.</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/60 space-y-1.5">
            <div className="w-6 h-6 rounded-lg bg-amber-600 text-white font-mono font-bold flex items-center justify-center text-xs">
              6
            </div>
            <div className="font-bold text-amber-950 text-xs">Xuất PPTX 16:9</div>
            <p className="text-[11px] text-slate-600">Tải file .pptx thực sự với hiệu ứng Morph 3D 60fps.</p>
          </div>
        </div>
      </div>

      {/* Feature Hub Cards (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div
          onClick={onOpenVisualizer}
          className="p-5 rounded-3xl bg-slate-900 border border-slate-800 text-white hover:border-cyan-500/80 transition-all cursor-pointer space-y-2.5 group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Activity className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-[10px] font-mono text-cyan-400">Interactive SVG</span>
          </div>
          <div className="font-bold text-sm text-white">Thư Viện Đồ Thị & Trực Quan Hóa</div>
          <p className="text-slate-400 leading-relaxed">
            Đồ thị Parabol thay đổi hệ số a,b,c, tiếp tuyến di động, hình không gian 3D và xác suất Monte Carlo.
          </p>
        </div>

        <div
          onClick={onOpenGamification}
          className="p-5 rounded-3xl bg-slate-900 border border-slate-800 text-white hover:border-purple-500/80 transition-all cursor-pointer space-y-2.5 group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Dices className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-[10px] font-mono text-purple-400">Classroom Games</span>
          </div>
          <div className="font-bold text-sm text-white">Trò Chơi Hóa & Hoạt Động Tương Tác</div>
          <p className="text-slate-400 leading-relaxed">
            Vòng quay may mắn, hộp quà bí ẩn, thử thách tính nhanh 30s giúp học sinh hăng say phát biểu.
          </p>
        </div>

        <div
          onClick={onOpenQACenter}
          className="p-5 rounded-3xl bg-slate-900 border border-slate-800 text-white hover:border-emerald-500/80 transition-all cursor-pointer space-y-2.5 group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-[10px] font-mono text-emerald-400">Math QA 100%</span>
          </div>
          <div className="font-bold text-sm text-white">Trung Tâm Kiểm Định Sư Phạm & Toán</div>
          <p className="text-slate-400 leading-relaxed">
            Tự động quét cú pháp LaTeX, điều kiện xác định, phát hiện tràn chữ và xác thực liên kết Morph.
          </p>
        </div>
      </div>

      {/* Recent Lectures Library List */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              Thư Viện Bài Giảng & Dự Án Đang Soạn ({lectures.length} bài giảng · {totalSlides} slide)
            </h3>
            <p className="text-xs text-slate-500">
              Bấm vào bài giảng để mở Trình biên tập chi tiết hoặc xuất file PowerPoint (.pptx)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lectures.map((lec) => (
            <div
              key={lec.id}
              className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-blue-400 hover:shadow-md transition-all space-y-3 flex flex-col justify-between text-xs"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                    Toán Lớp {lec.grade}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500">
                    {lec.slides.length} slide 16:9
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm line-clamp-2">{lec.title}</h4>
                <p className="text-[11px] text-slate-500">{lec.chapter}</p>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60">
                <button
                  onClick={() => onSelectLecture(lec)}
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Mở Biên Tập</span>
                </button>

                <button
                  onClick={() => onExportPptx(lec)}
                  className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl transition-colors cursor-pointer"
                  title="Xuất file PowerPoint .pptx"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudioDashboard;
