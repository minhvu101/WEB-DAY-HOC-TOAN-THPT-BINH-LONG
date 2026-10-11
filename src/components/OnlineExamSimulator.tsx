import React, { useState, useEffect } from 'react';
import { Question } from '../types';
import MathFormula from './MathFormula';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Send,
  Flag,
  Award,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Share2,
  QrCode,
  Check,
  X,
  FileCheck,
} from 'lucide-react';

interface OnlineExamSimulatorProps {
  questions: Question[];
  examTitle: string;
  durationMinutes?: number;
  schoolName?: string;
  examCode?: string;
  onExit: () => void;
}

export const OnlineExamSimulator: React.FC<OnlineExamSimulatorProps> = ({
  questions,
  examTitle,
  durationMinutes = 45,
  schoolName = 'THPT Bình Long',
  examCode = '101',
  onExit,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState(durationMinutes * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});

  // Answers State:
  // Part 1: qId -> selected option text
  // Part 2: qId -> Record<itemId, boolean>
  // Part 3: qId -> string value
  // Part 4: qId -> string essay text
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [tabSwitchWarnings, setTabSwitchWarnings] = useState(0);
  const [showWarningModal, setShowWarningModal] = useState(false);

  // Tab change detection (Anti-cheat simulation)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !isSubmitted) {
        setTabSwitchWarnings((prev) => prev + 1);
        setShowWarningModal(true);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isSubmitted]);

  // Timer countdown
  useEffect(() => {
    if (!isTimerRunning || isSubmitted) return;
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isTimerRunning, isSubmitted]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentQ = questions[currentIdx] || questions[0];

  const handleSelectMCQ = (qId: string, optText: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [qId]: optText,
    }));
  };

  const handleToggleTF = (qId: string, itemId: string, isCorrectVal: boolean) => {
    setUserAnswers((prev) => {
      const currentQAnswers = prev[qId] || {};
      return {
        ...prev,
        [qId]: {
          ...currentQAnswers,
          [itemId]: isCorrectVal,
        },
      };
    });
  };

  const handleInputShortAnswer = (qId: string, val: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [qId]: val,
    }));
  };

  const handleInputEssay = (qId: string, val: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [qId]: val,
    }));
  };

  const toggleFlag = (qId: string) => {
    setFlaggedQuestions((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }));
  };

  const isQuestionAnswered = (q: Question) => {
    const ans = userAnswers[q.id];
    if (ans === undefined || ans === null || ans === '') return false;
    if (q.type === 'true_false') {
      const items = q.tfItems || [];
      return items.length > 0 && Object.keys(ans).length === items.length;
    }
    return true;
  };

  const handleSubmitExam = () => {
    setIsSubmitted(true);
    setIsTimerRunning(false);
  };

  // Grading Calculation
  const calculateResult = () => {
    let totalScore = 0;
    let part1Score = 0;
    let part2Score = 0;
    let part3Score = 0;
    let part4Score = 0;
    let correctCount = 0;

    questions.forEach((q) => {
      const userAns = userAnswers[q.id];
      if (q.type === 'multiple_choice') {
        if (userAns === q.correctAnswer) {
          totalScore += 0.25;
          part1Score += 0.25;
          correctCount++;
        }
      } else if (q.type === 'true_false') {
        const items = q.tfItems || [];
        let subCorrect = 0;
        items.forEach((item) => {
          if (userAns && userAns[item.id] === item.isCorrect) {
            subCorrect++;
          }
        });

        // 2025 BGD Official scale: 1 item = 0.1đ; 2 items = 0.25đ; 3 items = 0.5đ; 4 items = 1.0đ
        let earned = 0;
        if (subCorrect === 1) earned = 0.1;
        else if (subCorrect === 2) earned = 0.25;
        else if (subCorrect === 3) earned = 0.5;
        else if (subCorrect === 4) earned = 1.0;

        totalScore += earned;
        part2Score += earned;
        if (subCorrect === 4) correctCount++;
      } else if (q.type === 'short_answer') {
        const cleanUser = String(userAns || '').trim().replace(/,/g, '.');
        const cleanCorrect = String(q.correctAnswer || '').trim().replace(/,/g, '.');
        if (cleanUser === cleanCorrect) {
          totalScore += 0.5;
          part3Score += 0.5;
          correctCount++;
        }
      } else if (q.type === 'essay') {
        // Teacher review score or simulated full for effort
        if (userAns && userAns.trim().length > 20) {
          part4Score += 1.5;
          totalScore += 1.5;
        }
      }
    });

    return {
      totalScore: Number(totalScore.toFixed(2)),
      part1Score: Number(part1Score.toFixed(2)),
      part2Score: Number(part2Score.toFixed(2)),
      part3Score: Number(part3Score.toFixed(2)),
      part4Score: Number(part4Score.toFixed(2)),
      correctCount,
    };
  };

  const results = isSubmitted ? calculateResult() : null;

  return (
    <div className="bg-slate-50 min-h-screen p-3 sm:p-6 rounded-2xl border border-slate-200 space-y-4">
      {/* Top Header */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
              Phòng Thi Trực Tuyến · Mã Đề {examCode}
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">{examTitle}</h2>
          <p className="text-xs text-slate-500">{schoolName} · Giám sát trực tuyến thông minh</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Countdown Timer */}
          <div
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border font-mono font-bold text-sm shadow-xs ${
              secondsRemaining < 300
                ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse'
                : 'bg-blue-50 border-blue-200 text-blue-800'
            }`}
          >
            <Clock className="w-4 h-4 text-blue-600" />
            <span>{formatTime(secondsRemaining)}</span>
          </div>

          {!isSubmitted ? (
            <button
              onClick={() => {
                if (window.confirm('Thầy/Trò có chắc chắn muốn nộp bài thi ngay bây giờ?')) {
                  handleSubmitExam();
                }
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Nộp bài thi</span>
            </button>
          ) : (
            <button
              onClick={onExit}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <span>Quay lại trang soạn đề</span>
            </button>
          )}
        </div>
      </div>

      {/* Tab Switch Warning Modal */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center space-y-4 shadow-xl border border-rose-200 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Cảnh Báo Giám Sát Phòng Thi!
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Hệ thống phát hiện bạn vừa rời khỏi cửa sổ làm bài ({tabSwitchWarnings} lần).
                Mọi hành vi chuyển tab, tìm kiếm đáp án đều được ghi vào nhật ký khảo thí của giáo viên.
              </p>
            </div>
            <button
              onClick={() => setShowWarningModal(false)}
              className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition-colors"
            >
              Tôi đã hiểu & Tiếp tục làm bài
            </button>
          </div>
        </div>
      )}

      {/* Post-Submission Result Card */}
      {isSubmitted && results && (
        <div className="bg-white p-6 rounded-2xl border border-emerald-200 shadow-md space-y-4 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Kết quả khảo sát trực tuyến
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  Điểm số đạt được: <span className="text-emerald-700 font-mono text-xl">{results.totalScore}/10.0</span>
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setUserAnswers({});
                  setSecondsRemaining(durationMinutes * 60);
                  setIsTimerRunning(true);
                }}
                className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Làm lại đề này</span>
              </button>
              <button
                onClick={onExit}
                className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
              >
                Hoàn tất
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl">
              <div className="text-slate-500 text-[11px]">Phần I (TN 4 phương án)</div>
              <div className="text-lg font-bold font-mono text-blue-800 mt-0.5">{results.part1Score} đ</div>
            </div>
            <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl">
              <div className="text-slate-500 text-[11px]">Phần II (Đúng / Sai)</div>
              <div className="text-lg font-bold font-mono text-emerald-800 mt-0.5">{results.part2Score} đ</div>
            </div>
            <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl">
              <div className="text-slate-500 text-[11px]">Phần III (Trả lời ngắn)</div>
              <div className="text-lg font-bold font-mono text-indigo-800 mt-0.5">{results.part3Score} đ</div>
            </div>
            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl">
              <div className="text-slate-500 text-[11px]">Phần IV (Tự luận)</div>
              <div className="text-lg font-bold font-mono text-amber-800 mt-0.5">{results.part4Score} đ</div>
            </div>
          </div>
        </div>
      )}

      {/* Main Testing Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Current Question Content & Options (8 cols) */}
        <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          {/* Question Breadcrumb & Toolbar */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm text-blue-700">
                Câu {currentIdx + 1} / {questions.length}
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {currentQ.bloomLevel}
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                {currentQ.type === 'multiple_choice'
                  ? 'Trắc nghiệm 4 đáp án (0.25đ)'
                  : currentQ.type === 'true_false'
                  ? 'Đúng / Sai (1.0đ)'
                  : currentQ.type === 'short_answer'
                  ? 'Trả lời ngắn (0.5đ)'
                  : 'Tự luận (1.5đ)'}
              </span>
            </div>

            <button
              onClick={() => toggleFlag(currentQ.id)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                flaggedQuestions[currentQ.id]
                  ? 'bg-amber-100 border-amber-300 text-amber-800'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Flag className="w-3.5 h-3.5" />
              <span>{flaggedQuestions[currentQ.id] ? 'Đã gắn cờ xem lại' : 'Gắn cờ xem lại'}</span>
            </button>
          </div>

          {/* Question Content */}
          <div className="text-slate-900 text-sm font-medium leading-relaxed bg-slate-50/60 p-4 rounded-xl border border-slate-100">
            <MathFormula math={currentQ.content} />
          </div>

          {/* Answering Area Based On Question Type */}
          <div className="pt-2">
            {/* 1. Multiple Choice Options */}
            {currentQ.type === 'multiple_choice' && currentQ.options && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 block mb-1">
                  Chọn 1 đáp án đúng nhất:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {currentQ.options.map((opt, i) => {
                    const isSelected = userAnswers[currentQ.id] === opt;
                    const letter = String.fromCharCode(65 + i);

                    // Post-submission review state
                    let reviewColor = '';
                    if (isSubmitted) {
                      if (opt === currentQ.correctAnswer) reviewColor = 'border-emerald-500 bg-emerald-50 text-emerald-900';
                      else if (isSelected && opt !== currentQ.correctAnswer) reviewColor = 'border-rose-400 bg-rose-50 text-rose-900';
                    }

                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => !isSubmitted && handleSelectMCQ(currentQ.id, opt)}
                        className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer text-xs ${
                          reviewColor ||
                          (isSelected
                            ? 'border-blue-600 bg-blue-50/80 text-blue-900 font-bold ring-2 ring-blue-500/20'
                            : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700')
                        }`}
                      >
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                            isSelected
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {letter}
                        </span>
                        <div className="pt-0.5 flex-1">
                          <MathFormula math={opt} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2. True / False Sub-items */}
            {currentQ.type === 'true_false' && currentQ.tfItems && (
              <div className="space-y-2.5">
                <span className="text-xs font-bold text-slate-700 block">
                  Đánh giá tính Đúng / Sai của từng mệnh đề:
                </span>
                <div className="space-y-2">
                  {currentQ.tfItems.map((item, iIdx) => {
                    const itemLetter = ['a', 'b', 'c', 'd'][iIdx];
                    const selectedVal = userAnswers[currentQ.id]?.[item.id];

                    return (
                      <div
                        key={item.id}
                        className="p-3 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-start gap-2 flex-1">
                          <span className="font-bold text-slate-800">{itemLetter})</span>
                          <div>
                            <MathFormula math={item.statement} />
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => !isSubmitted && handleToggleTF(currentQ.id, item.id, true)}
                            className={`px-3 py-1.5 rounded-lg font-bold border transition-colors cursor-pointer text-xs ${
                              selectedVal === true
                                ? 'bg-emerald-600 text-white border-emerald-600'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            ĐÚNG
                          </button>
                          <button
                            type="button"
                            onClick={() => !isSubmitted && handleToggleTF(currentQ.id, item.id, false)}
                            className={`px-3 py-1.5 rounded-lg font-bold border transition-colors cursor-pointer text-xs ${
                              selectedVal === false
                                ? 'bg-rose-600 text-white border-rose-600'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            SAI
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. Short Answer Numeric Field */}
            {currentQ.type === 'short_answer' && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 block">
                  Nhập kết quả hoặc đáp số (số thực, phân số tối giản):
                </span>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    disabled={isSubmitted}
                    value={userAnswers[currentQ.id] || ''}
                    onChange={(e) => handleInputShortAnswer(currentQ.id, e.target.value)}
                    placeholder="Ví dụ: -4.5 hoặc 12"
                    className="p-3 border border-slate-300 rounded-xl bg-slate-50 font-mono font-bold text-base text-blue-700 w-64 focus:bg-white focus:outline-blue-500"
                  />
                  {isSubmitted && (
                    <div className="text-xs text-slate-500">
                      Đáp án chuẩn: <span className="font-mono font-bold text-indigo-700">{currentQ.correctAnswer}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 4. Essay Response Field */}
            {currentQ.type === 'essay' && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 block">
                  Trình bày bài giải tự luận chi tiết:
                </span>
                <textarea
                  rows={6}
                  disabled={isSubmitted}
                  value={userAnswers[currentQ.id] || ''}
                  onChange={(e) => handleInputEssay(currentQ.id, e.target.value)}
                  placeholder="Gõ các bước giải toán, điều kiện xác định, lập luận đạo hàm..."
                  className="w-full p-3 border border-slate-300 rounded-xl bg-slate-50 text-xs font-sans leading-relaxed"
                />
              </div>
            )}

            {/* Solution & Explanation Box when Submitted */}
            {isSubmitted && currentQ.explanation && (
              <div className="mt-4 p-4 rounded-xl border border-indigo-200 bg-indigo-50/60 space-y-1.5 text-xs">
                <div className="font-bold text-indigo-950 flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-indigo-600" />
                  <span>Lời giải & Hướng dẫn chấm chi tiết:</span>
                </div>
                <div className="text-slate-800 leading-relaxed">
                  <MathFormula math={currentQ.explanation} />
                </div>
              </div>
            )}
          </div>

          {/* Bottom Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
              disabled={currentIdx === 0}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Câu trước</span>
            </button>

            <span className="text-xs text-slate-400 font-mono">
              {currentIdx + 1} / {questions.length}
            </span>

            <button
              onClick={() => setCurrentIdx((prev) => Math.min(questions.length - 1, prev + 1))}
              disabled={currentIdx === questions.length - 1}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-40 cursor-pointer"
            >
              <span>Câu tiếp theo</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Floating Question Navigator & Overview (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wide">
              Danh Sách Câu Hỏi
            </h3>

            {/* Legend */}
            <div className="grid grid-cols-3 gap-1.5 text-[10px] text-slate-600 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-emerald-500 shrink-0"></span>
                <span>Đã làm</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-amber-400 shrink-0"></span>
                <span>Gắn cờ</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-slate-100 border border-slate-300 shrink-0"></span>
                <span>Chưa làm</span>
              </div>
            </div>

            {/* Grid Palette */}
            <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
              {questions.map((q, idx) => {
                const isCurrent = idx === currentIdx;
                const answered = isQuestionAnswered(q);
                const isFlagged = flaggedQuestions[q.id];

                let btnBg = 'bg-slate-100 text-slate-700 border-slate-200';
                if (answered) btnBg = 'bg-emerald-500 text-white border-emerald-600';
                if (isFlagged) btnBg = 'bg-amber-400 text-amber-950 border-amber-500 font-bold';

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIdx(idx)}
                    className={`h-8 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer flex items-center justify-center ${btnBg} ${
                      isCurrent ? 'ring-2 ring-blue-600 ring-offset-1' : ''
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Progress summary */}
            <div className="pt-2 border-t border-slate-100 text-xs flex justify-between items-center text-slate-600">
              <span>Đã hoàn thành:</span>
              <span className="font-mono font-bold text-blue-700">
                {questions.filter(isQuestionAnswered).length} / {questions.length} câu
              </span>
            </div>
          </div>

          {/* Share & Room QR Code Box */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Chia sẻ phòng thi cho lớp</span>
              </span>
              <span className="text-[10px] bg-blue-50 text-blue-700 font-mono px-2 py-0.5 rounded">
                PIN: 849-210
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Gửi liên kết hoặc mã PIN để học sinh vào làm bài trực tiếp trên điện thoại/máy tính bảng.
            </p>
            <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 font-mono text-[10px] text-slate-600 truncate">
              https://lms.thptbinhlong.edu.vn/exam/{examCode}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnlineExamSimulator;
