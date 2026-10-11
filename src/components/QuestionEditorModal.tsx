import React, { useState } from 'react';
import { Question, BloomLevel, QuestionType } from '../types';
import MathFormula from './MathFormula';
import { X, Check, Eye, PenTool, Sparkles, Plus, Trash2 } from 'lucide-react';

interface QuestionEditorModalProps {
  initialQuestion?: Question | null;
  onSave: (question: Question) => void;
  onClose: () => void;
  currentGrade?: number;
}

export const QuestionEditorModal: React.FC<QuestionEditorModalProps> = ({
  initialQuestion,
  onSave,
  onClose,
  currentGrade = 11,
}) => {
  const isEditing = !!initialQuestion;

  const [type, setType] = useState<QuestionType>(
    initialQuestion?.type || 'multiple_choice'
  );
  const [content, setContent] = useState<string>(
    initialQuestion?.content || 'Cho hàm số $y = f(x)$ có đạo hàm $f\'(x) = 3x^2 - 6x$. Mệnh đề nào sau đây đúng?'
  );
  const [topic, setTopic] = useState<string>(
    initialQuestion?.topic || 'Đạo hàm & Khảo sát hàm số'
  );
  const [bloomLevel, setBloomLevel] = useState<BloomLevel>(
    initialQuestion?.bloomLevel || 'ThongHieu'
  );
  const [grade, setGrade] = useState<number>(
    initialQuestion?.grade || currentGrade
  );
  const [points, setPoints] = useState<number>(
    initialQuestion?.points || (type === 'multiple_choice' ? 0.25 : type === 'true_false' ? 1.0 : type === 'short_answer' ? 0.5 : 1.5)
  );

  // MCQ state
  const [options, setOptions] = useState<string[]>(
    initialQuestion?.options || [
      'Hàm số đồng biến trên khoảng $(0; 2)$.',
      'Hàm số nghịch biến trên khoảng $(0; 2)$.',
      'Hàm số đạt cực tiểu tại $x = 0$.',
      'Hàm số đạt cực đại tại $x = 2$.',
    ]
  );
  const [correctOptionIdx, setCorrectOptionIdx] = useState<number>(() => {
    if (initialQuestion?.options && initialQuestion?.correctAnswer) {
      const idx = initialQuestion.options.indexOf(String(initialQuestion.correctAnswer));
      return idx >= 0 ? idx : 1;
    }
    return 1;
  });

  // True/False state
  const [tfItems, setTfItems] = useState<Array<{ id: string; statement: string; isCorrect: boolean }>>(
    initialQuestion?.tfItems || [
      { id: 'sub-a', statement: 'Tập xác định của hàm số là $D = \\mathbb{R}$.', isCorrect: true },
      { id: 'sub-b', statement: 'Phương trình $f\'(x) = 0$ có hai nghiệm phân biệt $x_1 = 0, x_2 = 2$.', isCorrect: true },
      { id: 'sub-c', statement: 'Hàm số đồng biến trên toàn bộ $\\mathbb{R}$.', isCorrect: false },
      { id: 'sub-d', statement: 'Điểm cực đại của đồ thị hàm số có hoành độ bằng $2$.', isCorrect: false },
    ]
  );

  // Short Answer state
  const [shortAnswer, setShortAnswer] = useState<string>(
    initialQuestion?.type === 'short_answer' ? String(initialQuestion.correctAnswer) : '-4'
  );

  // Explanation
  const [explanation, setExplanation] = useState<string>(
    initialQuestion?.explanation || 'Ta có $f\'(x) = 3x(x - 2)$. Dấu của $f\'(x) < 0 \\iff x \\in (0; 2)$ nên hàm số nghịch biến trên $(0; 2)$.'
  );

  const handleTypeChange = (newType: QuestionType) => {
    setType(newType);
    if (newType === 'multiple_choice') setPoints(0.25);
    else if (newType === 'true_false') setPoints(1.0);
    else if (newType === 'short_answer') setPoints(0.5);
    else if (newType === 'essay') setPoints(1.5);
  };

  const handleSave = () => {
    let section: 'part1_mcq' | 'part2_true_false' | 'part3_short_answer' | 'part4_essay' = 'part1_mcq';
    let finalCorrectAnswer = '';

    if (type === 'multiple_choice') {
      section = 'part1_mcq';
      finalCorrectAnswer = options[correctOptionIdx] || options[0];
    } else if (type === 'true_false') {
      section = 'part2_true_false';
      finalCorrectAnswer = 'Đ/S';
    } else if (type === 'short_answer') {
      section = 'part3_short_answer';
      finalCorrectAnswer = shortAnswer;
    } else {
      section = 'part4_essay';
      finalCorrectAnswer = 'Trình bày lời giải chi tiết';
    }

    const savedQuestion: Question = {
      id: initialQuestion?.id || `Q-CUSTOM-${Date.now().toString().slice(-4)}`,
      content,
      type,
      section,
      topic,
      grade,
      bloomLevel,
      points,
      options: type === 'multiple_choice' ? options : undefined,
      correctAnswer: finalCorrectAnswer,
      tfItems: type === 'true_false' ? tfItems : undefined,
      explanation,
    };

    onSave(savedQuestion);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4 my-auto max-h-[90vh] flex flex-col animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
          <div>
            <span className="text-[10px] font-bold uppercase text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
              {isEditing ? 'Hiệu chỉnh câu hỏi' : 'Soạn thảo câu hỏi mới'}
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
              Trình Soạn Thảo Câu Hỏi Toán Học Chuẩn Hóa
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="overflow-y-auto space-y-4 pr-1 text-xs">
          {/* Format & Classification Row */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Định dạng câu:</label>
              <select
                value={type}
                onChange={(e) => handleTypeChange(e.target.value as QuestionType)}
                className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50 font-semibold text-blue-700"
              >
                <option value="multiple_choice">1. TN 4 đáp án (0,25đ)</option>
                <option value="true_false">2. Đúng / Sai (1,0đ)</option>
                <option value="short_answer">3. Trả lời ngắn (0,5đ)</option>
                <option value="essay">4. Tự luận (1,5đ)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Mức độ Bloom:</label>
              <select
                value={bloomLevel}
                onChange={(e) => setBloomLevel(e.target.value as BloomLevel)}
                className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50"
              >
                <option value="NhanBiet">Nhận biết</option>
                <option value="ThongHieu">Thông hiểu</option>
                <option value="VanDung">Vận dụng</option>
                <option value="VanDungCao">Vận dụng cao</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Chủ đề:</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Điểm số:</label>
              <input
                type="number"
                step="0.05"
                value={points}
                onChange={(e) => setPoints(Number(e.target.value))}
                className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50 font-mono font-bold"
              />
            </div>
          </div>

          {/* Question Content Input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-slate-800">
                Nội dung câu hỏi (Hỗ trợ công thức LaTeX $...$):
              </label>
              <span className="text-[10px] text-slate-400">
                {"Ví dụ: $f'(x) = 3x^2$, $\\frac{a}{b}$, $\\sqrt{x}$"}
              </span>
            </div>
            <textarea
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 font-sans leading-relaxed focus:bg-white"
            />
          </div>

          {/* Type Specific Fields */}
          {/* 1. Multiple Choice Options */}
          {type === 'multiple_choice' && (
            <div className="space-y-2 p-3 bg-blue-50/40 rounded-xl border border-blue-200/60">
              <span className="font-bold text-blue-900 block text-[11px]">
                4 Phương án lựa chọn (Chọn nút tròn để chỉ định đáp án đúng):
              </span>
              <div className="space-y-2">
                {options.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCorrectOptionIdx(i)}
                      className={`w-6 h-6 rounded-full border flex items-center justify-center font-bold text-xs shrink-0 cursor-pointer ${
                        correctOptionIdx === i
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {String.fromCharCode(65 + i)}
                    </button>
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const newOpts = [...options];
                        newOpts[i] = e.target.value;
                        setOptions(newOpts);
                      }}
                      className="flex-1 p-2 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. True / False Sub-items */}
          {type === 'true_false' && (
            <div className="space-y-2 p-3 bg-emerald-50/40 rounded-xl border border-emerald-200/60">
              <span className="font-bold text-emerald-900 block text-[11px]">
                4 Lệnh hỏi (a, b, c, d) và giá trị Đúng / Sai:
              </span>
              <div className="space-y-2">
                {tfItems.map((item, idx) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <span className="w-5 font-bold text-slate-700 text-center">
                      {['a', 'b', 'c', 'd'][idx]})
                    </span>
                    <input
                      type="text"
                      value={item.statement}
                      onChange={(e) => {
                        const newItems = [...tfItems];
                        newItems[idx].statement = e.target.value;
                        setTfItems(newItems);
                      }}
                      className="flex-1 p-2 border border-slate-300 rounded-lg bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newItems = [...tfItems];
                        newItems[idx].isCorrect = !newItems[idx].isCorrect;
                        setTfItems(newItems);
                      }}
                      className={`px-3 py-1.5 rounded-lg font-bold text-[11px] cursor-pointer transition-colors ${
                        item.isCorrect
                          ? 'bg-emerald-600 text-white'
                          : 'bg-rose-600 text-white'
                      }`}
                    >
                      {item.isCorrect ? 'ĐÚNG' : 'SAI'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Short Answer Value */}
          {type === 'short_answer' && (
            <div className="p-3 bg-indigo-50/40 rounded-xl border border-indigo-200/60 space-y-1">
              <label className="font-bold text-indigo-950 block">Đáp số chuẩn xác:</label>
              <input
                type="text"
                value={shortAnswer}
                onChange={(e) => setShortAnswer(e.target.value)}
                placeholder="Ví dụ: -4.5 hoặc 1/2"
                className="w-48 p-2 border border-slate-300 rounded-lg bg-white font-mono font-bold text-blue-700"
              />
            </div>
          )}

          {/* Explanation */}
          <div>
            <label className="font-bold text-slate-800 block mb-1">
              Lời giải chi tiết & Hướng dẫn chấm:
            </label>
            <textarea
              rows={2}
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 font-sans"
            />
          </div>

          {/* Live LaTeX Math Preview Card */}
          <div className="p-3.5 bg-slate-100 rounded-xl border border-slate-200 space-y-1.5">
            <span className="font-bold text-slate-700 flex items-center gap-1.5 text-[11px]">
              <Eye className="w-3.5 h-3.5 text-blue-600" />
              <span>Xem trước hiển thị công thức (Live Preview):</span>
            </span>
            <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-slate-900 leading-relaxed font-medium">
              <MathFormula math={content} />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-xl hover:bg-slate-50 font-semibold text-slate-700 text-xs cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>{isEditing ? 'Lưu thay đổi' : 'Thêm vào đề thi'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionEditorModal;
