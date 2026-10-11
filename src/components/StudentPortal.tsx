import React, { useState } from 'react';
import { MOCK_STUDENTS } from '../data/mockData';
import MathFormula from './MathFormula';
import { Flame, Award, Zap, Trophy, Compass, Sparkles, ChevronRight, Play, CheckCircle2, Lock, Star, Target } from 'lucide-react';

interface StudentPortalProps {
  onOpenMathLab: () => void;
  onOpenFinalBoss: () => void;
  onOpenAITutor: () => void;
}

interface Planet {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
  color: string;
  bgGlow: string;
  progress: number;
  unlocked: boolean;
  levels: {
    id: number;
    title: string;
    description: string;
    status: 'completed' | 'current' | 'locked';
    xpReward: number;
    type: 'concept' | 'lab' | 'quiz' | 'boss';
  }[];
}

export const StudentPortal: React.FC<StudentPortalProps> = ({
  onOpenMathLab,
  onOpenFinalBoss,
  onOpenAITutor,
}) => {
  const currentStudent = MOCK_STUDENTS[0]; // Tran Tuan Kiet
  const [selectedPlanetId, setSelectedPlanetId] = useState<string>('derivative');

  const planets: Planet[] = [
    {
      id: 'functions',
      name: '🪐 Hành Tinh Hàm Số',
      subtitle: 'Parabol, Đỉnh & Biến thiên',
      icon: '📈',
      color: 'from-amber-500 to-orange-600',
      bgGlow: 'bg-amber-500/10',
      progress: 100,
      unlocked: true,
      levels: [
        { id: 1, title: 'Cột mốc 1: Khởi động Parabol', description: 'Quỹ đạo chuyển động vật lý', status: 'completed', xpReward: 50, type: 'concept' },
        { id: 2, title: 'Cột mốc 2: Tọa độ đỉnh & Trục', description: 'Công thức đỉnh parabol', status: 'completed', xpReward: 80, type: 'quiz' },
        { id: 3, title: 'Cột mốc 3: Math Lab Parabol', description: 'Trượt tham số a, b, c', status: 'completed', xpReward: 100, type: 'lab' },
      ],
    },
    {
      id: 'derivative',
      name: '🪐 Hành Tinh Đạo Hàm',
      subtitle: 'Tốc độ tức thời & Tiếp tuyến',
      icon: '⚡',
      color: 'from-blue-600 to-indigo-600',
      bgGlow: 'bg-blue-600/15',
      progress: 75,
      unlocked: true,
      levels: [
        { id: 1, title: 'Level 1: Vận tốc tức thời', description: 'Bài toán xe đua tăng tốc', status: 'completed', xpReward: 60, type: 'concept' },
        { id: 2, title: 'Level 2: Số gia & Định nghĩa', description: 'Khái niệm đạo hàm', status: 'completed', xpReward: 80, type: 'quiz' },
        { id: 3, title: 'Level 3: Math Lab Tiếp tuyến', description: 'Kéo điểm M → A, h → 0', status: 'current', xpReward: 120, type: 'lab' },
        { id: 4, title: 'Level 4: Viết phương trình tiếp tuyến', description: 'Luyện tập giải toán nhanh', status: 'locked', xpReward: 100, type: 'quiz' },
        { id: 5, title: 'Level 5: 👑 Đại Chiến Titan Đạo Hàm', description: 'Đấu boss hạ gục quái thú', status: 'locked', xpReward: 350, type: 'boss' },
      ],
    },
    {
      id: 'probability',
      name: '🪐 Hành Tinh Xác Suất',
      subtitle: 'Không gian mẫu & Biến cố',
      icon: '🎲',
      color: 'from-emerald-500 to-teal-600',
      bgGlow: 'bg-emerald-500/10',
      progress: 40,
      unlocked: true,
      levels: [
        { id: 1, title: 'Level 1: Không gian mẫu xúc xắc', description: 'Biến cố ngẫu nhiên', status: 'completed', xpReward: 50, type: 'concept' },
        { id: 2, title: 'Level 2: Mô phỏng Monte Carlo', description: 'Định luật số lớn trong Math Lab', status: 'current', xpReward: 100, type: 'lab' },
        { id: 3, title: 'Level 3: Xác suất có điều kiện', description: 'Quy tắc nhân xác suất', status: 'locked', xpReward: 120, type: 'quiz' },
      ],
    },
    {
      id: 'geometry',
      name: '🪐 Hành Tinh Hình Học Oxyz',
      subtitle: 'Quan hệ vuông góc & Khoảng cách',
      icon: '📐',
      color: 'from-purple-600 to-pink-600',
      bgGlow: 'bg-purple-600/10',
      progress: 20,
      unlocked: true,
      levels: [
        { id: 1, title: 'Level 1: Tọa độ vectơ không gian', description: 'Quy tắc 3 điểm và hệ trục', status: 'completed', xpReward: 70, type: 'concept' },
        { id: 2, title: 'Level 2: Tích vô hướng & Góc', description: 'Góc giữa hai đường thẳng', status: 'locked', xpReward: 100, type: 'quiz' },
      ],
    },
  ];

  const activePlanet = planets.find((p) => p.id === selectedPlanetId) || planets[1];

  return (
    <div className="space-y-6 pb-12">
      {/* 1. STUDENT GAMIFIED STATUS BAR */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/60 p-5 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-2xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-3xl shadow-inner">
              👨‍🎓
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg md:text-xl font-bold tracking-tight">
                  Chào em, {currentStudent.name}!
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/30 border border-indigo-400/40 text-indigo-200">
                  Lớp 11A6
                </span>
              </div>
              <p className="text-xs text-indigo-200">
                Hôm nay bạn đã sẵn sàng chinh phục thêm một đỉnh cao Toán học mới chưa?
              </p>
            </div>
          </div>

          {/* Gamification Pills */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
            {/* Streak */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/20 border border-orange-500/30 text-orange-300 text-xs font-bold">
              <Flame className="w-4 h-4 fill-orange-400 text-orange-400 animate-pulse" />
              <span>{currentStudent.streakDays} ngày liên tiếp</span>
            </div>

            {/* Level & XP */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-200 text-xs">
              <span className="font-bold text-amber-300">Level {currentStudent.level}</span>
              <span className="text-slate-400">·</span>
              <span className="font-mono font-semibold">{currentStudent.xp}/3000 XP</span>
            </div>

            {/* Coins */}
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold">
              <span>🪙</span>
              <span>{currentStudent.coins} Coins</span>
            </div>
          </div>
        </div>

        {/* Level XP Progress Bar */}
        <div className="mt-4 pt-3 border-t border-indigo-900/40 space-y-1">
          <div className="flex justify-between text-[11px] text-indigo-300">
            <span>Tiến độ thăng hạng Level 19: Còn 150 XP</span>
            <span className="font-mono font-bold">95%</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-400 h-full rounded-full transition-all duration-500"
              style={{ width: '95%' }}
            />
          </div>
        </div>
      </div>

      {/* 2. PLANET EXPLORATION MAP (VŨ TRỤ TOÁN HỌC) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Compass className="w-5 h-5 text-indigo-600" />
              <span>Vũ Trụ Toán Học · Khám Phá Các Hành Tinh Kiến Thức</span>
            </h2>
            <p className="text-xs text-slate-500">
              Chọn hành tinh để bắt đầu cuộc hành trình phiêu lưu và mở khóa Boss cuối!
            </p>
          </div>
          <button
            onClick={onOpenAITutor}
            className="flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-3 py-1.5 rounded-xl transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Hỏi AI Mathy</span>
          </button>
        </div>

        {/* Planet Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {planets.map((planet) => {
            const isSelected = planet.id === selectedPlanetId;
            return (
              <div
                key={planet.id}
                onClick={() => setSelectedPlanetId(planet.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-indigo-600 bg-white ring-2 ring-indigo-500/30 shadow-md -translate-y-1'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{planet.icon}</span>
                    <span className="text-[11px] font-mono font-bold text-indigo-700">
                      {planet.progress}% Hoàn thành
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{planet.name}</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">{planet.subtitle}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${planet.color}`}
                      style={{ width: `${planet.progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>{planet.levels.length} Cột mốc</span>
                    <span className="font-semibold text-indigo-600 flex items-center">
                      Khám phá <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. ACTIVE PLANET DETAIL & JOURNEY ROADMAP */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{activePlanet.icon}</span>
              <h3 className="text-lg font-bold text-slate-900">{activePlanet.name}</h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Hành trình học tập được cá nhân hóa: Đi từ Bản chất trực quan đến Vận dụng cao.
            </p>
          </div>

          {activePlanet.id === 'derivative' && (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenMathLab}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Mở Math Lab Tiếp Tuyến</span>
              </button>
              <button
                onClick={onOpenFinalBoss}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                <span>👑 Đấu Boss Titan</span>
              </button>
            </div>
          )}
        </div>

        {/* Learning Journey Step Path */}
        <div className="space-y-3">
          {activePlanet.levels.map((lvl, index) => {
            const isCompleted = lvl.status === 'completed';
            const isCurrent = lvl.status === 'current';
            const isLocked = lvl.status === 'locked';

            return (
              <div
                key={lvl.id}
                className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isCurrent
                    ? 'border-indigo-500 bg-indigo-50/50 shadow-xs ring-1 ring-indigo-500/20'
                    : isCompleted
                    ? 'border-slate-200 bg-slate-50/70'
                    : 'border-slate-200 bg-slate-50/30 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                      isCompleted
                        ? 'bg-emerald-100 text-emerald-700'
                        : isCurrent
                        ? 'bg-indigo-600 text-white animate-pulse'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : isLocked ? (
                      <Lock className="w-4 h-4 text-slate-400" />
                    ) : (
                      lvl.id
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{lvl.title}</span>
                      {isCurrent && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-600 text-white">
                          Đang học
                        </span>
                      )}
                      {lvl.type === 'boss' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-slate-950">
                          Boss Trùm
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{lvl.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 justify-end">
                  <span className="text-xs font-mono font-bold text-amber-600 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    +{lvl.xpReward} XP
                  </span>

                  {isCurrent && (
                    <button
                      onClick={() => {
                        if (lvl.type === 'lab') onOpenMathLab();
                        else if (lvl.type === 'boss') onOpenFinalBoss();
                      }}
                      className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                    >
                      Bắt đầu ngay
                    </button>
                  )}

                  {isCompleted && (
                    <button
                      onClick={onOpenMathLab}
                      className="px-3 py-1 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs rounded-lg transition-colors"
                    >
                      Ôn lại
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. TODAY'S QUESTS & WEEKLY LEADERBOARD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Today's Quests (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-rose-500" />
              <h3 className="font-bold text-slate-900 text-sm">Nhiệm Vụ Hằng Ngày</h3>
            </div>
            <span className="text-xs text-slate-400">Reset sau 5 giờ</span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/40 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <div>
                  <span className="font-semibold text-slate-900 block">Hoàn thành bài tập Hàm số</span>
                  <span className="text-slate-500 text-[11px]">Đã nộp bài và đạt 9.5 điểm</span>
                </div>
              </div>
              <span className="font-mono font-bold text-emerald-700">+50 XP</span>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-[10px]">
                  2
                </div>
                <div>
                  <span className="font-semibold text-slate-900 block">Thực hành 5 phút trong Math Lab</span>
                  <span className="text-slate-500 text-[11px]">Mô phỏng cát tuyến sang tiếp tuyến</span>
                </div>
              </div>
              <button
                onClick={onOpenMathLab}
                className="px-2.5 py-1 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Làm ngay
              </button>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-[10px]">
                  3
                </div>
                <div>
                  <span className="font-semibold text-slate-900 block">Hạ gục Boss Titan Đạo Hàm</span>
                  <span className="text-slate-500 text-[11px]">Thắng trận đấu với HP {'>'} 50%</span>
                </div>
              </div>
              <button
                onClick={onOpenFinalBoss}
                className="px-2.5 py-1 bg-amber-500 text-slate-950 rounded-lg font-bold hover:bg-amber-600 transition-colors"
              >
                Thách đấu
              </button>
            </div>
          </div>
        </div>

        {/* Weekly Leaderboard (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-slate-900 text-sm">Bảng Xếp Hạng Lớp 11A6 (Tuần 6)</h3>
            </div>
            <span className="text-xs text-amber-600 font-semibold">Cạnh tranh lành mạnh</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-lg font-extrabold text-amber-600 font-mono">🥇 1</span>
                <div>
                  <span className="font-bold text-slate-900 block">Phạm Thị Dung</span>
                  <span className="text-slate-500 text-[11px]">Level 19 · Chuỗi 15 ngày</span>
                </div>
              </div>
              <span className="font-mono font-bold text-amber-700">3,100 XP</span>
            </div>

            <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-300 ring-1 ring-blue-400/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-lg font-extrabold text-blue-600 font-mono">🥈 2</span>
                <div>
                  <span className="font-bold text-blue-900 flex items-center gap-1.5">
                    Trần Tuấn Kiệt <span className="text-[10px] text-blue-600 font-normal">(Bạn)</span>
                  </span>
                  <span className="text-slate-500 text-[11px]">Level 18 · Chuỗi 12 ngày</span>
                </div>
              </div>
              <span className="font-mono font-bold text-blue-700">2,850 XP</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-lg font-extrabold text-slate-600 font-mono">🥉 3</span>
                <div>
                  <span className="font-bold text-slate-900 block">Đỗ Quang Huy</span>
                  <span className="text-slate-500 text-[11px]">Level 16 · Chuỗi 10 ngày</span>
                </div>
              </div>
              <span className="font-mono font-bold text-slate-700">2,400 XP</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPortal;
