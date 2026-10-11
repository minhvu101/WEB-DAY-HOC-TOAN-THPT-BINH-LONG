import React, { useState } from 'react';
import MathFormula from '../MathFormula';
import {
  Trophy,
  Dices,
  Gift,
  RotateCw,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Plus,
  Play,
  Clock,
  Award,
} from 'lucide-react';

interface GamificationStudioProps {
  onInsertGameSlide?: (gameTitle: string, question: string, options: string[], answer: string) => void;
}

export const GamificationStudio: React.FC<GamificationStudioProps> = ({
  onInsertGameSlide,
}) => {
  const [activeGame, setActiveGame] = useState<'wheel' | 'boxes' | 'speed'>('wheel');

  // 1. Wheel of Fortune state
  const wheelQuestions = [
    { label: 'Hệ số góc', q: 'Tìm hệ số góc k của tiếp tuyến hàm y = x² tại x = 3', ans: 'k = 6' },
    { label: 'Điểm cực trị', q: 'Hàm số y = x³ - 3x có bao nhiêu điểm cực trị?', ans: '2 điểm' },
    { label: 'Đồng biến', q: 'Hàm số y = 2x + 1 đồng biến trên khoảng nào?', ans: 'Tập số thực R' },
    { label: 'Điểm thưởng +1', q: 'Được cộng 1 điểm rèn luyện và quyền chọn bạn khác!', ans: 'Chúc mừng em!' },
    { label: 'Đạo hàm sin(x)', q: 'Đạo hàm của hàm số y = sin(2x) bằng bao nhiêu?', ans: '2cos(2x)' },
    { label: 'Khoảng cách Oxyz', q: 'Khoảng cách từ O(0,0,0) đến mp x - 2 = 0 bằng bao nhiêu?', ans: 'd = 2' },
  ];
  const [wheelIndex, setWheelIndex] = useState<number>(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<typeof wheelQuestions[0] | null>(wheelQuestions[0]);

  const spinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    const targetIdx = Math.floor(Math.random() * wheelQuestions.length);
    setTimeout(() => {
      setWheelIndex(targetIdx);
      setSelectedQuestion(wheelQuestions[targetIdx]);
      setIsSpinning(false);
    }, 1200);
  };

  // 2. Mystery Boxes state
  const [openedBoxes, setOpenedBoxes] = useState<Record<number, boolean>>({});
  const boxRewards = [
    { id: 1, title: 'Hộp Vàng', icon: '⭐', q: 'Đạo hàm của y = e^(2x) là gì?', ans: '2e^(2x)' },
    { id: 2, title: 'Hộp Lam', icon: '🎁', q: 'Tiệm cận ngang của y = (3x+1)/(x-1) là?', ans: 'y = 3' },
    { id: 3, title: 'Hộp Đỏ', icon: '💎', q: 'Khối chóp có V = (1/3)Sh. Đúng hay Sai?', ans: 'Đúng 100%' },
    { id: 4, title: 'Hộp Lục', icon: '🍀', q: 'Cộng 1 điểm kiểm tra miệng 15 phút!', ans: 'Phần thưởng may mắn!' },
  ];

  const handleOpenBox = (id: number) => {
    setOpenedBoxes((prev) => ({ ...prev, [id]: true }));
  };

  // 3. Speed Buzzer 30s challenge
  const [speedTimer, setSpeedTimer] = useState(30);
  const [isSpeedRunning, setIsSpeedRunning] = useState(false);

  return (
    <div className="bg-slate-900 text-slate-100 rounded-3xl border border-slate-800 p-6 shadow-xl space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400 font-mono">
              Gamification & Interactive Math Activities
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            Hệ Thống Trò Chơi Hóa & Hoạt Động Tương Tác Sư Phạm
          </h2>
          <p className="text-xs text-slate-400">
            Kích thích hứng thú học tập · Phá vỡ sự đơn điệu của tiết dạy · Tích hợp sẵn sàng vào PowerPoint
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex bg-slate-800/80 p-1 rounded-2xl border border-slate-700/60 text-xs">
          <button
            onClick={() => setActiveGame('wheel')}
            className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeGame === 'wheel' ? 'bg-purple-600 text-white font-bold shadow-md' : 'text-slate-300 hover:text-white'
            }`}
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Vòng Quay May Mắn</span>
          </button>

          <button
            onClick={() => setActiveGame('boxes')}
            className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeGame === 'boxes' ? 'bg-purple-600 text-white font-bold shadow-md' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Gift className="w-3.5 h-3.5" />
            <span>Hộp Quà Bí Ẩn</span>
          </button>
        </div>
      </div>

      {/* GAME 1: LUCKY WHEEL */}
      {activeGame === 'wheel' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-6 bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col items-center justify-center space-y-4">
            {/* Spinning Dial Graphic */}
            <div className="relative w-56 h-56 rounded-full border-4 border-purple-500/40 p-2 flex items-center justify-center shadow-xl shadow-purple-500/10">
              <div
                className={`w-full h-full rounded-full border-4 border-dashed border-cyan-400 flex items-center justify-center transition-all duration-1000 ${
                  isSpinning ? 'rotate-[720deg]' : ''
                }`}
              >
                <div className="text-center p-4">
                  <span className="text-2xl">🎡</span>
                  <div className="font-bold text-white text-xs mt-1">
                    {wheelQuestions[wheelIndex].label}
                  </div>
                </div>
              </div>

              {/* Pin indicator */}
              <div className="absolute -top-3 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[16px] border-t-amber-400"></div>
            </div>

            <button
              onClick={spinWheel}
              disabled={isSpinning}
              className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl text-xs shadow-lg transition-all cursor-pointer flex items-center gap-2"
            >
              <RotateCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
              <span>{isSpinning ? 'Đang quay...' : 'Quay ngẫu nhiên câu hỏi'}</span>
            </button>
          </div>

          <div className="lg:col-span-6 space-y-4 text-xs">
            {selectedQuestion && (
              <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-purple-400 bg-purple-500/20 px-2 py-0.5 rounded">
                    Thử thách: {selectedQuestion.label}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">100 điểm thưởng</span>
                </div>

                <div className="text-sm font-bold text-white leading-relaxed">
                  <MathFormula math={selectedQuestion.q} />
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-emerald-400 flex items-center justify-between font-mono font-bold text-xs">
                  <span>Đáp án công bố:</span>
                  <span className="text-amber-300">{selectedQuestion.ans}</span>
                </div>

                {onInsertGameSlide && (
                  <button
                    onClick={() =>
                      onInsertGameSlide(
                        `Thử thách Vòng quay: ${selectedQuestion.label}`,
                        selectedQuestion.q,
                        ['Phương án A', 'Phương án B', 'Phương án C', selectedQuestion.ans],
                        selectedQuestion.ans
                      )
                    }
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold rounded-xl border border-slate-700 text-xs flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Chèn câu hỏi vòng quay vào Slide PPTX</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* GAME 2: MYSTERY BOXES */}
      {activeGame === 'boxes' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {boxRewards.map((box) => {
              const isOpened = openedBoxes[box.id];
              return (
                <div
                  key={box.id}
                  onClick={() => handleOpenBox(box.id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer text-center space-y-3 ${
                    isOpened
                      ? 'bg-slate-950 border-purple-500/60 ring-1 ring-purple-500/20'
                      : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700 hover:border-purple-400'
                  }`}
                >
                  <div className="text-4xl">{isOpened ? box.icon : '🎁'}</div>
                  <div className="font-bold text-white text-xs">{box.title}</div>
                  {isOpened ? (
                    <div className="text-[11px] text-cyan-300 font-medium">
                      <MathFormula math={box.q} />
                    </div>
                  ) : (
                    <span className="text-[10px] text-purple-400 font-semibold">Bấm để mở hộp</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default GamificationStudio;
