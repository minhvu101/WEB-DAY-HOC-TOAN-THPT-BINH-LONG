import React, { useState } from 'react';
import MathFormula from './MathFormula';
import confetti from 'canvas-confetti';
import { Shield, Zap, Swords, Trophy, RotateCcw, Award, CheckCircle2, AlertCircle } from 'lucide-react';

interface BossQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  damage: number;
  explanation: string;
}

const BOSS_QUESTIONS: BossQuestion[] = [
  {
    id: 1,
    question: 'Tọa độ đỉnh $I$ của parabol $y = x^2 - 4x + 3$ là gì?',
    options: ['$I(2; -1)$', '$I(-2; 15)$', '$I(2; 1)$', '$I(-2; -1)$'],
    correctIndex: 0,
    damage: 35,
    explanation: 'Hoành độ đỉnh $x_I = -\\frac{b}{2a} = 2$. Tung độ đỉnh $y_I = 2^2 - 4(2) + 3 = -1$. Do đó tọa độ đỉnh là $I(2; -1)$.',
  },
  {
    id: 2,
    question: 'Đạo hàm của hàm số $f(x) = x^3 - 3x^2 + 2x$ tại điểm $x_0 = 2$ bằng bao nhiêu?',
    options: ['$0$', '$2$', '$4$', '$-2$'],
    correctIndex: 1,
    damage: 35,
    explanation: "Ta có $f'(x) = 3x^2 - 6x + 2$. Thay $x=2$: $f'(2) = 3(2^2) - 6(2) + 2 = 12 - 12 + 2 = 2$.",
  },
  {
    id: 3,
    question: 'Phương trình tiếp tuyến của đồ thị $y = x^2$ tại điểm $M(1; 1)$ là:',
    options: ['$y = 2x - 1$', '$y = 2x + 1$', '$y = x + 1$', '$y = 4x - 3$'],
    correctIndex: 0,
    damage: 35,
    explanation: "Hệ số góc tiếp tuyến $k = y'(1) = 2$. Phương trình tiếp tuyến là: $y - 1 = 2(x - 1) \\Leftrightarrow y = 2x - 1$.",
  },
  {
    id: 4,
    question: 'Gieo một con xúc xắc cân đối và đồng chất. Xác suất để xuất hiện mặt số chẵn là:',
    options: ['$\\frac{1}{2}$', '$\\frac{1}{3}$', '$\\frac{1}{6}$', '$\\frac{2}{3}$'],
    correctIndex: 0,
    damage: 35,
    explanation: 'Có 3 kết quả thuận lợi $\\{2, 4, 6\\}$ trên tổng số 6 mặt của không gian mẫu. Xác suất $P = \\frac{3}{6} = \\frac{1}{2}$.',
  },
];

export const FinalBossView: React.FC = () => {
  const [bossHp, setBossHp] = useState<number>(100);
  const [playerHp, setPlayerHp] = useState<number>(100);
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [combatLog, setCombatLog] = useState<string[]>(['⚔️ Trận chiến bắt đầu! Boss Titan Đạo Hàm xuất hiện.']);
  const [streakCombo, setStreakCombo] = useState<number>(0);
  const [isAttacking, setIsAttacking] = useState<boolean>(false);
  const [feedbackState, setFeedbackState] = useState<'correct' | 'wrong' | null>(null);

  const currentQuestion = BOSS_QUESTIONS[currentQIndex % BOSS_QUESTIONS.length];
  const isDefeated = bossHp <= 0;
  const isPlayerDefeated = playerHp <= 0;

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // safe fallback
    }
  };

  const handleSelectOption = (index: number) => {
    if (selectedAnswer !== null || isDefeated || isPlayerDefeated) return;
    setSelectedAnswer(index);
    setIsAttacking(true);

    const isCorrect = index === currentQuestion.correctIndex;

    setTimeout(() => {
      if (isCorrect) {
        const bonusDmg = streakCombo * 5;
        const totalDmg = currentQuestion.damage + bonusDmg;
        const newBossHp = Math.max(0, bossHp - totalDmg);
        setBossHp(newBossHp);
        setStreakCombo((prev) => prev + 1);
        setFeedbackState('correct');
        setCombatLog((prev) => [
          `⚡ CHÍ MẠNG! Bạn ra đòn chính xác gây ${totalDmg} sát thương (${bonusDmg > 0 ? `+${bonusDmg} Combo` : ''})!`,
          ...prev.slice(0, 4),
        ]);

        if (newBossHp <= 0) {
          triggerConfetti();
        }
      } else {
        const bossDmg = 25;
        const newPlayerHp = Math.max(0, playerHp - bossDmg);
        setPlayerHp(newPlayerHp);
        setStreakCombo(0);
        setFeedbackState('wrong');
        setCombatLog((prev) => [
          `💥 BOSS PHẢN CÔNG! Titan Đạo Hàm tung chiêu "Giới hạn vô cực" gây ${bossDmg} sát thương!`,
          ...prev.slice(0, 4),
        ]);
      }
      setIsAttacking(false);
    }, 400);
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setFeedbackState(null);
    setCurrentQIndex((prev) => prev + 1);
  };

  const resetBattle = () => {
    setBossHp(100);
    setPlayerHp(100);
    setCurrentQIndex(0);
    setSelectedAnswer(null);
    setFeedbackState(null);
    setStreakCombo(0);
    setCombatLog(['⚔️ Trận chiến bắt đầu! Boss Titan Đạo Hàm xuất hiện.']);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Boss Arena Card */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 p-6 text-white shadow-xl">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Battle Status */}
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-800">
          {/* Player HP */}
          <div className="w-full md:w-5/12 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300 flex items-center gap-1.5">
                <span className="text-base">👨‍🎓</span>
                <span>Trần Tuấn Kiệt (Lớp 11A6)</span>
              </span>
              <span className="font-mono text-emerald-400 font-bold">{playerHp}/100 HP</span>
            </div>
            <div className="w-full bg-slate-800 h-3.5 rounded-full overflow-hidden p-0.5 border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-300"
                style={{ width: `${playerHp}%` }}
              />
            </div>
            {streakCombo > 1 && (
              <div className="text-[11px] text-amber-400 font-semibold flex items-center gap-1 animate-bounce">
                <Zap className="w-3.5 h-3.5" />
                <span>COMBO x{streakCombo} (+{streakCombo * 5} DMG)</span>
              </div>
            )}
          </div>

          {/* VS Badge */}
          <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 font-bold text-sm tracking-wider">
            VS
          </div>

          {/* Boss HP */}
          <div className="w-full md:w-5/12 space-y-2 text-right">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-rose-400 font-bold">{bossHp}/100 HP</span>
              <span className="font-bold text-rose-300 flex items-center gap-1.5">
                <span>👑 TITAN ĐẠO HÀM (Cấp 20)</span>
                <span className="text-base">👾</span>
              </span>
            </div>
            <div className="w-full bg-slate-800 h-3.5 rounded-full overflow-hidden p-0.5 border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-rose-600 to-amber-500 rounded-full transition-all duration-300 ml-auto"
                style={{ width: `${bossHp}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-400">
              Độ khó: Vận dụng cao · Khắc chế: Đạo hàm & Tiếp tuyến
            </div>
          </div>
        </div>

        {/* Victory Screen */}
        {isDefeated ? (
          <div className="py-10 text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-4xl shadow-lg shadow-amber-500/20">
              🏆
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-amber-400 tracking-tight">
              CHIẾN THẮNG HUY HOÀNG!
            </h2>
            <p className="text-slate-300 max-w-md mx-auto text-sm">
              Bạn đã đánh bại Boss Titan Đạo Hàm! Nắm vững kỹ năng tính đạo hàm và viết phương trình tiếp tuyến.
            </p>

            <div className="flex items-center justify-center gap-4 py-3">
              <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
                <span className="text-xs text-slate-400 block">Kinh nghiệm</span>
                <span className="text-lg font-bold text-amber-400 font-mono">+350 XP</span>
              </div>
              <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
                <span className="text-xs text-slate-400 block">Huy hiệu mới</span>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 mt-1">
                  <Award className="w-3.5 h-3.5" />
                  Kẻ Diệt Titan Đạo Hàm
                </span>
              </div>
            </div>

            <button
              onClick={resetBattle}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-sm shadow-md hover:scale-105 transition-all"
            >
              Chơi lại trận đấu
            </button>
          </div>
        ) : isPlayerDefeated ? (
          /* Defeat Screen */
          <div className="py-10 text-center space-y-4">
            <div className="text-4xl">💥</div>
            <h2 className="text-2xl font-bold text-rose-400">BẠN ĐÃ BỊ ĐÁNH BẠI!</h2>
            <p className="text-slate-300 text-sm max-w-md mx-auto">
              Đừng nản lòng! Hãy ghé qua Math Lab để ôn lại ý nghĩa hình học của đạo hàm và thử lại nhé.
            </p>
            <button
              onClick={resetBattle}
              className="px-6 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs border border-slate-700"
            >
              Thử sức lại
            </button>
          </div>
        ) : (
          /* Question Active Arena */
          <div className="py-6 space-y-6">
            {/* Question Header */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Câu hỏi số {currentQIndex + 1}</span>
                <span className="text-blue-400 font-medium">Sát thương cơ bản: 35 DMG</span>
              </div>
              <div className="text-base md:text-lg font-semibold text-slate-100 bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
                <MathFormula math={currentQuestion.question} className="text-white" />
              </div>
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedAnswer === idx;
                const isCorrect = idx === currentQuestion.correctIndex;
                let btnStyle = 'bg-slate-900 hover:bg-slate-800/90 border-slate-800 text-slate-200';

                if (selectedAnswer !== null) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold';
                  } else if (isSelected) {
                    btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200';
                  } else {
                    btnStyle = 'opacity-40 bg-slate-900 border-slate-800';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={selectedAnswer !== null}
                    onClick={() => handleSelectOption(idx)}
                    className={`p-3.5 rounded-xl border text-left text-sm transition-all flex items-center justify-between ${btnStyle}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-mono font-bold text-slate-300">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>
                        <MathFormula math={option} className="text-slate-100" />
                      </span>
                    </div>
                    {selectedAnswer !== null && isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Answer Feedback & Explanation */}
            {selectedAnswer !== null && (
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold flex items-center gap-1.5">
                    {feedbackState === 'correct' ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Chính xác! Đòn tấn công thành công.
                      </span>
                    ) : (
                      <span className="text-rose-400 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" /> Sai rồi! Boss đã phản công.
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handleNextQuestion}
                    className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs"
                  >
                    Câu tiếp theo →
                  </button>
                </div>
                <div className="text-xs text-slate-300 pt-1 border-t border-slate-800">
                  <span className="text-slate-400">Giải thích: </span>
                  <MathFormula math={currentQuestion.explanation} className="text-slate-200" />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Combat Log Ticker */}
        <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
          <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            Nhật ký chiến đấu
          </div>
          {combatLog.map((log, i) => (
            <div key={i} className="font-mono text-slate-300">
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FinalBossView;
