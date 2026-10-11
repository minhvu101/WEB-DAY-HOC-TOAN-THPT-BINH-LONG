import React, { useState } from 'react';
import { MOCK_ASSIGNMENTS, MOCK_QUESTIONS, MOCK_CLASSES } from '../data/mockData';
import { Assignment, Question, BloomLevel, ExamMatrix } from '../types';
import MathFormula from './MathFormula';
import { DIGITAL_TEXTBOOK_SOURCES, TextbookSourceItem } from '../data/textbookSources';
import {
  exportExamToDocx,
  exportAnswerMatrixToDocx,
  exportExamMatrixTableToDocx,
} from '../utils/examDocxExporter';
import { generateExamCodes, MultiCodeExamResult, ShuffledExamCode } from '../utils/examShuffler';
import { parseRawExamText } from '../utils/examTextParser';
import { OMRAnswerSheet } from './OMRAnswerSheet';
import { OnlineExamSimulator } from './OnlineExamSimulator';
import { QuestionEditorModal } from './QuestionEditorModal';
import { ExamMatrixView } from './ExamMatrixView';
import {
  FileText,
  Plus,
  Sparkles,
  Shuffle,
  CheckCircle,
  Clock,
  Layers,
  Search,
  Filter,
  Check,
  Calendar,
  Upload,
  Download,
  BookOpen,
  FileCheck,
  FileSpreadsheet,
  AlertCircle,
  HelpCircle,
  CheckSquare,
  Hash,
  PenTool,
  RotateCcw,
  Eye,
  Sliders,
  ChevronDown,
  Printer,
  Play,
  Copy,
  Edit,
  Trash2,
  Table,
  ArrowUp,
  ArrowDown,
  Share2,
} from 'lucide-react';

interface AssignmentBuilderViewProps {
  onOpenAIQuestionGen: () => void;
}

export const AssignmentBuilderView: React.FC<AssignmentBuilderViewProps> = ({
  onOpenAIQuestionGen,
}) => {
  type MainTab = 'builder' | 'shuffler' | 'omr' | 'matrix' | 'import' | 'bank' | 'assignments';
  const [activeTab, setActiveTab] = useState<MainTab>('builder');

  // Master questions pool (can be added to via import or question editor)
  const [allQuestions, setAllQuestions] = useState<Question[]>(MOCK_QUESTIONS);

  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([
    'Q-01',
    'Q-03',
    'Q-04',
    'Q-TF-01',
    'Q-SA-01',
    'Q-ES-01',
  ]);

  const [bankFilterTopic, setBankFilterTopic] = useState<string>('all');
  const [bankFilterBloom, setBankFilterBloom] = useState<string>('all');
  const [bankFilterType, setBankFilterType] = useState<string>('all');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Exam Configuration State
  const [examTitle, setExamTitle] = useState('Đề Kiểm Tra Đánh Giá Năng Lực Toán 11 - Chương Đạo Hàm');
  const [targetClass, setTargetClass] = useState('11A6');
  const [examGrade, setExamGrade] = useState<number>(11);
  const [curriculum, setCurriculum] = useState<'KNTT' | 'CTST' | 'Cánh Diều'>('KNTT');
  const [examDuration, setExamDuration] = useState('45 phút');
  const [schoolName, setSchoolName] = useState('TRƯỜNG THPT CHUYÊN LƯƠNG THẾ VINH');
  const [examCode, setExamCode] = useState('101');
  const [isExportingDocx, setIsExportingDocx] = useState(false);

  // Format Preset
  const [examFormatPreset, setExamFormatPreset] = useState<'THPT_2025' | 'DinhKy_THPT' | 'Custom'>('THPT_2025');

  // Question counts per Part
  const [part1Count, setPart1Count] = useState<number>(12); // Trắc nghiệm 4 đáp án (0.25đ/câu)
  const [part2Count, setPart2Count] = useState<number>(4);  // Đúng/Sai 4 ý (1.0đ/câu)
  const [part3Count, setPart3Count] = useState<number>(6);  // Trả lời ngắn (0.5đ/câu)
  const [part4Count, setPart4Count] = useState<number>(0);  // Tự luận

  // Source Document & Matrix Upload State
  const [sourceDocMethod, setSourceDocMethod] = useState<'upload_matrix' | 'upload_sample' | 'textbook' | 'pasted'>('upload_matrix');
  const [uploadedMatrixFileName, setUploadedMatrixFileName] = useState<string | null>(null);
  const [uploadedMatrixFileSize, setUploadedMatrixFileSize] = useState<string | null>(null);
  const [uploadedMatrixSnippet, setUploadedMatrixSnippet] = useState<string>('');
  const [selectedTextbook, setSelectedTextbook] = useState<TextbookSourceItem>(DIGITAL_TEXTBOOK_SOURCES[0]);
  const [pastedMatrixText, setPastedMatrixText] = useState<string>(
    `MA TRẬN ĐỀ KIỂM TRA ĐỊNH HƯỚNG BGD 2025:\n` +
    `- Phần 1 (3.0 điểm): 12 câu trắc nghiệm nhiều phương án (chọn 1 trong 4 đáp án A, B, C, D).\n` +
    `- Phần 2 (4.0 điểm): 4 câu trắc nghiệm đúng/sai (mỗi câu gồm 4 ý a, b, c, d; 1 ý: 0,1đ; 2 ý: 0,25đ; 3 ý: 0,5đ; 4 ý: 1,0đ).\n` +
    `- Phần 3 (3.0 điểm): 6 câu trắc nghiệm trả lời ngắn (điền kết quả số thực; mỗi câu đúng được 0,5 điểm).\n` +
    `- Tổng thời gian: 90 phút - Thang điểm: 10,0 điểm.`
  );

  // Shuffler & Multi-Codes State
  const [codeCount, setCodeCount] = useState<number>(4);
  const [shuffleQuestionsWithinPart, setShuffleQuestionsWithinPart] = useState<boolean>(true);
  const [shuffleOptionsInMCQ, setShuffleOptionsInMCQ] = useState<boolean>(true);
  const [shuffleSubItemsInTF, setShuffleSubItemsInTF] = useState<boolean>(true);
  const [multiCodeResult, setMultiCodeResult] = useState<MultiCodeExamResult | null>(null);
  const [selectedPreviewCode, setSelectedPreviewCode] = useState<string>('101');

  // Smart Word / Text Import State
  const [rawImportText, setRawImportText] = useState<string>(
    `Câu 1: Cho hàm số y = f(x) có đạo hàm f'(x) = 2x - 4. Hàm số đồng biến trên khoảng nào?\nA. (2; +\\infty)\nB. (-\\infty; 2)\nC. (0; 4)\nD. (-\\infty; +\\infty)\nĐáp án: A\nLời giải: f'(x) > 0 <=> 2x - 4 > 0 <=> x > 2. Do đó hàm số đồng biến trên (2; +\\infty).\n\n` +
    `Câu 2: Xét tính đúng/sai của các khẳng định sau về hàm số bậc ba:\na) Đồ thị hàm số bậc ba luôn có tâm đối xứng - Đúng\nb) Hàm số bậc ba luôn có ít nhất một cực trị - Sai\nc) Đạo hàm của hàm bậc ba là một tam thức bậc hai - Đúng\nd) Hàm số bậc ba có thể đồng biến trên R - Đúng\n\n` +
    `Câu 3: Tìm giá trị nhỏ nhất của hàm số y = x^2 - 4x + 7 trên đoạn [0; 5].\nĐáp số: 3\nLời giải: y' = 2x - 4 = 0 <=> x = 2 thuộc [0; 5]. y(0) = 7, y(2) = 3, y(5) = 12. Vậy min y = 3.`
  );
  const [parsedImportQuestions, setParsedImportQuestions] = useState<Question[]>([]);

  // Question Editor Modal State
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isCreatingNewQuestion, setIsCreatingNewQuestion] = useState(false);

  // Online Exam Simulator State
  const [isOnlineExamOpen, setIsOnlineExamOpen] = useState(false);

  // Switch format preset
  const handleSelectFormatPreset = (preset: 'THPT_2025' | 'DinhKy_THPT' | 'Custom') => {
    setExamFormatPreset(preset);
    if (preset === 'THPT_2025') {
      setPart1Count(12);
      setPart2Count(4);
      setPart3Count(6);
      setPart4Count(0);
      setExamDuration('90 phút');
      setExamTitle(`Đề Khảo Sát Tốt Nghiệp THPT 2025 - Môn Toán Khối ${examGrade}`);
    } else if (preset === 'DinhKy_THPT') {
      setPart1Count(28);
      setPart2Count(0);
      setPart3Count(0);
      setPart4Count(2);
      setExamDuration('45 phút');
      setExamTitle(`Đề Kiểm Tra Định Kỳ 1 Tiết Toán ${examGrade} - Tự Luận & Trắc Nghiệm`);
    }
  };

  // Upload handler for Matrix / Sample Exam
  const handleMatrixFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedMatrixFileName(file.name);
    setUploadedMatrixFileSize(`${(file.size / 1024).toFixed(1)} KB`);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = (event.target?.result as string) || '';
      if (text.length > 0) {
        setUploadedMatrixSnippet(text);
      } else {
        setUploadedMatrixSnippet(
          `[ĐÃ TIẾP NHẬN TỆP TÀI LIỆU MA TRẬN / ĐỀ MẪU: ${file.name}]\n` +
          `AI đã quét nội dung tệp Word/PDF và nhận diện cấu trúc ma trận chuẩn.`
        );
      }
    };

    if (file.name.endsWith('.txt') || file.name.endsWith('.csv') || file.name.endsWith('.json')) {
      reader.readAsText(file);
    } else {
      setUploadedMatrixSnippet(
        `[ĐÃ NẠP TỆP MA TRẬN / ĐỀ GỐC ${file.name} - ${(file.size / 1024).toFixed(1)} KB]\n` +
        `• Cấu trúc: 3 Phần chuẩn Bộ GD&ĐT 2025.\n` +
        `• Tự động căn chỉnh độ khó Bloom bám sát đặc tả ma trận.`
      );
    }

    setSuccessToast(`Đã nạp thành công tài liệu ma trận / đề mẫu: ${file.name}`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  // Filter bank questions
  const filteredQuestions = allQuestions.filter((q) => {
    if (bankFilterTopic !== 'all' && q.topic !== bankFilterTopic) return false;
    if (bankFilterBloom !== 'all' && q.bloomLevel !== bankFilterBloom) return false;
    if (bankFilterType !== 'all' && q.type !== bankFilterType) return false;
    return true;
  });

  const handleToggleSelectQuestion = (qId: string) => {
    setSelectedQuestions((prev) =>
      prev.includes(qId) ? prev.filter((id) => id !== qId) : [...prev, qId]
    );
  };

  // Auto fill questions matching matrix counts
  const handleAutoFillByMatrix = () => {
    const selected: string[] = [];
    const mcq = allQuestions.filter((q) => q.type === 'multiple_choice');
    const tf = allQuestions.filter((q) => q.type === 'true_false');
    const sa = allQuestions.filter((q) => q.type === 'short_answer');
    const es = allQuestions.filter((q) => q.type === 'essay');

    mcq.slice(0, Math.min(part1Count, mcq.length)).forEach((q) => selected.push(q.id));
    tf.slice(0, Math.min(part2Count, tf.length)).forEach((q) => selected.push(q.id));
    sa.slice(0, Math.min(part3Count, sa.length)).forEach((q) => selected.push(q.id));
    es.slice(0, Math.min(part4Count, es.length)).forEach((q) => selected.push(q.id));

    setSelectedQuestions(selected);
    setSuccessToast(`Đã tự động điền ${selected.length} câu hỏi chuẩn hóa khớp ma trận đề!`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  // Reorder question in selected list
  const handleMoveQuestion = (qId: string, direction: 'up' | 'down') => {
    const idx = selectedQuestions.indexOf(qId);
    if (idx < 0) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= selectedQuestions.length) return;

    const newArr = [...selectedQuestions];
    [newArr[idx], newArr[targetIdx]] = [newArr[targetIdx], newArr[idx]];
    setSelectedQuestions(newArr);
  };

  // Export to Word docx
  const handleExportDocx = async (includeAnswers: boolean) => {
    setIsExportingDocx(true);
    try {
      const questionsToExport = allQuestions.filter((q) =>
        selectedQuestions.includes(q.id)
      );
      await exportExamToDocx(questionsToExport, {
        title: examTitle,
        grade: examGrade,
        duration: examDuration,
        schoolName: schoolName,
        examCode: examCode,
        includeAnswers: includeAnswers,
        matrixSummary: {
          totalQuestions: selectedQuestions.length,
          part1Count,
          part2Count,
          part3Count,
          part4Count,
          sourceDocument: uploadedMatrixFileName || 'Ma trận Bộ GD&ĐT 2025',
        },
      });
      setSuccessToast(`Đã xuất file Word .docx thành công (${includeAnswers ? 'Kèm đáp án' : 'Đề thi gốc'})!`);
      setTimeout(() => setSuccessToast(null), 3500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsExportingDocx(false);
    }
  };

  // Run Shuffler
  const handleRunShuffler = () => {
    const selectedObjs = allQuestions.filter((q) => selectedQuestions.includes(q.id));
    if (selectedObjs.length === 0) {
      setSuccessToast('Vui lòng chọn ít nhất 1 câu hỏi vào đề trước khi trộn!');
      setTimeout(() => setSuccessToast(null), 3000);
      return;
    }

    const codeList = Array.from({ length: codeCount }, (_, i) => String(101 + i));
    const result = generateExamCodes(selectedObjs, codeList, {
      shuffleQuestionsWithinPart,
      shuffleOptionsInMCQ,
      shuffleSubItemsInTF,
    });

    setMultiCodeResult(result);
    setSelectedPreviewCode(codeList[0]);
    setSuccessToast(`Đã hoán vị thành công ${codeCount} mã đề (${codeList.join(', ')})!`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  // Export Cross-Code Answer Matrix Table
  const handleExportAnswerMatrix = async () => {
    if (!multiCodeResult) return;
    const codeList = multiCodeResult.codes.map((c) => c.code);
    await exportAnswerMatrixToDocx(multiCodeResult.answerMatrix, codeList, {
      title: examTitle,
      grade: examGrade,
      duration: examDuration,
      schoolName,
      examCode,
    });
    setSuccessToast('Đã xuất Bảng ma trận đối chiếu đáp án các mã đề (.docx)!');
    setTimeout(() => setSuccessToast(null), 3000);
  };

  // Export specific shuffled code
  const handleExportSingleShuffledCode = async (shuffledCodeObj: ShuffledExamCode) => {
    await exportExamToDocx(shuffledCodeObj.questions, {
      title: `${examTitle} (Mã đề ${shuffledCodeObj.code})`,
      grade: examGrade,
      duration: examDuration,
      schoolName,
      examCode: shuffledCodeObj.code,
      includeAnswers: false,
    });
    setSuccessToast(`Đã xuất file đề thi Word Mã đề ${shuffledCodeObj.code}!`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  // Smart Parser execution
  const handleParseRawText = () => {
    const parsed = parseRawExamText(rawImportText, examGrade, 'Đạo hàm & Hàm số');
    setParsedImportQuestions(parsed);
    setSuccessToast(`AI Parser đã nhận diện và bóc tách thành công ${parsed.length} câu hỏi!`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  // Add parsed questions to exam
  const handleAddParsedToExam = () => {
    if (parsedImportQuestions.length === 0) return;
    setAllQuestions((prev) => [...prev, ...parsedImportQuestions]);
    setSelectedQuestions((prev) => [...prev, ...parsedImportQuestions.map((q) => q.id)]);
    setSuccessToast(`Đã thêm ${parsedImportQuestions.length} câu hỏi vào đề kiểm tra hiện tại!`);
    setTimeout(() => setSuccessToast(null), 3000);
    setActiveTab('builder');
  };

  // Save question from modal
  const handleSaveQuestionFromModal = (savedQ: Question) => {
    setAllQuestions((prev) => {
      const exists = prev.some((q) => q.id === savedQ.id);
      if (exists) {
        return prev.map((q) => (q.id === savedQ.id ? savedQ : q));
      }
      return [...prev, savedQ];
    });

    if (!selectedQuestions.includes(savedQ.id)) {
      setSelectedQuestions((prev) => [...prev, savedQ.id]);
    }

    setSuccessToast(`Đã lưu thành công câu hỏi [${savedQ.id}]!`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const handlePublishTest = () => {
    setSuccessToast(`Đã phát hành bài kiểm tra thành công tới lớp ${targetClass}!`);
    setTimeout(() => {
      setSuccessToast(null);
      setActiveTab('assignments');
    }, 2000);
  };

  // Categorize selected questions
  const selectedObjList = allQuestions.filter((q) => selectedQuestions.includes(q.id));
  const part1List = selectedObjList.filter((q) => q.type === 'multiple_choice' || q.section === 'part1_mcq');
  const part2List = selectedObjList.filter((q) => q.type === 'true_false' || q.section === 'part2_true_false');
  const part3List = selectedObjList.filter((q) => q.type === 'short_answer' || q.section === 'part3_short_answer');
  const part4List = selectedObjList.filter((q) => q.type === 'essay' || q.section === 'part4_essay');

  // Total points calculation
  const totalExamPoints =
    part1List.length * 0.25 +
    part2List.length * 1.0 +
    part3List.length * 0.5 +
    part4List.reduce((acc, q) => acc + (q.points || 1.5), 0);

  // If online exam simulator is open, render full-screen simulator
  if (isOnlineExamOpen) {
    return (
      <OnlineExamSimulator
        questions={selectedObjList.length > 0 ? selectedObjList : allQuestions.slice(0, 10)}
        examTitle={examTitle}
        schoolName={schoolName}
        examCode={examCode}
        onExit={() => setIsOnlineExamOpen(false)}
      />
    );
  }

  return (
    <div className="space-y-5">
      {/* Question Editor Modal */}
      {(editingQuestion || isCreatingNewQuestion) && (
        <QuestionEditorModal
          initialQuestion={editingQuestion}
          currentGrade={examGrade}
          onSave={handleSaveQuestionFromModal}
          onClose={() => {
            setEditingQuestion(null);
            setIsCreatingNewQuestion(false);
          }}
        />
      )}

      {/* Main Top Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
              Khảo Thí & Đánh Giá Năng Lực · Ma Trận Đề Đa Định Dạng
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 mt-1">
            Trung Tâm Tạo Đề Thi & Khảo Thí Đa Định Dạng
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Tạo đề chuẩn Bộ GD&ĐT 2025 · Trộn hoán vị mã đề · In phiếu tô chì OMR A4 · Bóc tách đề Word · Thi trực tuyến
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleExportDocx(false)}
            disabled={isExportingDocx || selectedQuestions.length === 0}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
            title="Xuất file đề thi chuẩn Word .docx cho học sinh"
          >
            <Download className="w-4 h-4 text-blue-600" />
            <span>Xuất Đề (.docx)</span>
          </button>

          <button
            onClick={() => handleExportDocx(true)}
            disabled={isExportingDocx || selectedQuestions.length === 0}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
            title="Xuất file Word .docx kèm đáp án và lời giải chi tiết"
          >
            <FileCheck className="w-4 h-4 text-emerald-600" />
            <span>Kèm Đáp Án (.docx)</span>
          </button>

          <button
            onClick={() => setIsOnlineExamOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition-colors cursor-pointer"
            title="Mô phỏng giao diện học sinh làm bài thi trực tuyến"
          >
            <Play className="w-4 h-4 text-amber-600" />
            <span>Thi Thử Trực Tuyến</span>
          </button>

          <button
            onClick={() => setIsCreatingNewQuestion(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl transition-colors cursor-pointer"
            title="Thêm câu hỏi mới vào đề hoặc ngân hàng"
          >
            <Plus className="w-4 h-4" />
            <span>Soạn Câu Hỏi</span>
          </button>

          <button
            onClick={onOpenAIQuestionGen}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Tạo Đề Nhanh</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {successToast && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center justify-between shadow-xs animate-in fade-in duration-200 text-xs">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast(null)} className="text-emerald-700 hover:text-emerald-900 font-bold">
            ✕
          </button>
        </div>
      )}

      {/* Navigation Tabs Bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('builder')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeTab === 'builder'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Trình biên soạn & Cấu hình Đề</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('shuffler');
            if (!multiCodeResult) handleRunShuffler();
          }}
          className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeTab === 'shuffler'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Shuffle className="w-3.5 h-3.5" />
          <span>Bộ Trộn Đề & Đa Mã Đề (101-104)</span>
        </button>

        <button
          onClick={() => setActiveTab('omr')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeTab === 'omr'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Phiếu Tô Trắc Nghiệm 2025 (In A4)</span>
        </button>

        <button
          onClick={() => setActiveTab('matrix')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeTab === 'matrix'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Ma Trận & Đặc Tả 2 Chiều</span>
        </button>

        <button
          onClick={() => setActiveTab('import')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeTab === 'import'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Nhập Đề Nhanh (Word/Văn bản)</span>
        </button>

        <button
          onClick={() => setActiveTab('bank')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeTab === 'bank'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Ngân hàng câu hỏi ({allQuestions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('assignments')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeTab === 'assignments'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Đề đã giao ({MOCK_ASSIGNMENTS.length})</span>
        </button>
      </div>

      {/* TAB 1: BUILDER & STRUCTURE CONFIG */}
      {activeTab === 'builder' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Form & Preset Configuration (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4 text-xs">
            {/* Format Preset Selection */}
            <div className="space-y-2">
              <label className="block font-bold text-slate-900 uppercase tracking-wide text-[11px]">
                Mẫu cấu trúc đề kiểm tra:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectFormatPreset('THPT_2025')}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    examFormatPreset === 'THPT_2025'
                      ? 'border-blue-600 bg-blue-50/70 text-blue-900 font-bold ring-2 ring-blue-500/20'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                  }`}
                >
                  <div className="font-bold text-[11px]">BGD 2025</div>
                  <div className="text-[10px] text-slate-500 font-normal mt-0.5">3 phần (TN, Đ/S, Ngắn)</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectFormatPreset('DinhKy_THPT')}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    examFormatPreset === 'DinhKy_THPT'
                      ? 'border-blue-600 bg-blue-50/70 text-blue-900 font-bold ring-2 ring-blue-500/20'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                  }`}
                >
                  <div className="font-bold text-[11px]">Định Kỳ THPT</div>
                  <div className="text-[10px] text-slate-500 font-normal mt-0.5">TN 4 đáp án + Tự luận</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectFormatPreset('Custom')}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    examFormatPreset === 'Custom'
                      ? 'border-blue-600 bg-blue-50/70 text-blue-900 font-bold ring-2 ring-blue-500/20'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                  }`}
                >
                  <div className="font-bold text-[11px]">Tùy Biến</div>
                  <div className="text-[10px] text-slate-500 font-normal mt-0.5">Theo ma trận nạp</div>
                </button>
              </div>
            </div>

            {/* Title & School Info */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tiêu đề bài kiểm tra:</label>
              <input
                type="text"
                value={examTitle}
                onChange={(e) => setExamTitle(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50 font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Khối lớp:</label>
                <select
                  value={examGrade}
                  onChange={(e) => setExamGrade(Number(e.target.value))}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50"
                >
                  <option value={10}>Lớp 10</option>
                  <option value={11}>Lớp 11</option>
                  <option value={12}>Lớp 12</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Bộ sách giáo khoa:</label>
                <select
                  value={curriculum}
                  onChange={(e) => setCurriculum(e.target.value as any)}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50"
                >
                  <option value="KNTT">Kết nối tri thức (KNTT)</option>
                  <option value="CTST">Chân trời sáng tạo (CTST)</option>
                  <option value="Cánh Diều">Cánh Diều</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Lớp giao:</label>
                <select
                  value={targetClass}
                  onChange={(e) => setTargetClass(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50"
                >
                  {MOCK_CLASSES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Thời lượng:</label>
                <input
                  type="text"
                  value={examDuration}
                  onChange={(e) => setExamDuration(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mã đề gốc:</label>
                <input
                  type="text"
                  value={examCode}
                  onChange={(e) => setExamCode(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50 font-mono font-bold text-blue-700"
                />
              </div>
            </div>

            {/* Matrix Section: Question Counts Configuration */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-blue-600" />
                  <span>Số lượng câu hỏi theo từng phần:</span>
                </span>
                <button
                  type="button"
                  onClick={handleAutoFillByMatrix}
                  className="text-blue-600 hover:underline font-semibold text-[11px]"
                >
                  ⚡ Điền tự động
                </button>
              </div>

              {/* Part 1: MCQ 4 options */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-medium text-slate-700">
                    Phần I · Trắc nghiệm 4 đáp án (0,25đ/câu):
                  </span>
                  <span className="font-bold font-mono text-blue-700">{part1Count} câu ({(part1Count * 0.25).toFixed(2)}đ)</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="40"
                    value={part1Count}
                    onChange={(e) => setPart1Count(Number(e.target.value))}
                    className="flex-1 accent-blue-600 cursor-pointer"
                  />
                  <input
                    type="number"
                    min="0"
                    max="40"
                    value={part1Count}
                    onChange={(e) => setPart1Count(Number(e.target.value))}
                    className="w-12 p-1 border rounded text-center bg-white"
                  />
                </div>
              </div>

              {/* Part 2: True/False */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-medium text-slate-700">
                    Phần II · Trắc nghiệm Đúng / Sai 4 ý (1,0đ/câu):
                  </span>
                  <span className="font-bold font-mono text-emerald-700">{part2Count} câu ({(part2Count * 1.0).toFixed(1)}đ)</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={part2Count}
                    onChange={(e) => setPart2Count(Number(e.target.value))}
                    className="flex-1 accent-emerald-600 cursor-pointer"
                  />
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={part2Count}
                    onChange={(e) => setPart2Count(Number(e.target.value))}
                    className="w-12 p-1 border rounded text-center bg-white"
                  />
                </div>
              </div>

              {/* Part 3: Short Answer */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-medium text-slate-700">
                    Phần III · Trắc nghiệm trả lời ngắn (0,5đ/câu):
                  </span>
                  <span className="font-bold font-mono text-indigo-700">{part3Count} câu ({(part3Count * 0.5).toFixed(1)}đ)</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="12"
                    value={part3Count}
                    onChange={(e) => setPart3Count(Number(e.target.value))}
                    className="flex-1 accent-indigo-600 cursor-pointer"
                  />
                  <input
                    type="number"
                    min="0"
                    max="12"
                    value={part3Count}
                    onChange={(e) => setPart3Count(Number(e.target.value))}
                    className="w-12 p-1 border rounded text-center bg-white"
                  />
                </div>
              </div>

              {/* Part 4: Essay */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-medium text-slate-700">
                    Phần IV · Câu hỏi Tự luận:
                  </span>
                  <span className="font-bold font-mono text-amber-700">{part4Count} câu ({(part4Count * 1.5).toFixed(1)}đ)</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="6"
                    value={part4Count}
                    onChange={(e) => setPart4Count(Number(e.target.value))}
                    className="flex-1 accent-amber-600 cursor-pointer"
                  />
                  <input
                    type="number"
                    min="0"
                    max="6"
                    value={part4Count}
                    onChange={(e) => setPart4Count(Number(e.target.value))}
                    className="w-12 p-1 border rounded text-center bg-white"
                  />
                </div>
              </div>

              {/* Total points banner */}
              <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-[11px] font-bold">
                <span className="text-slate-700">Cấu hình mục tiêu:</span>
                <span className="text-blue-700 font-mono">
                  {part1Count + part2Count + part3Count + part4Count} câu · Thang điểm{' '}
                  {(
                    part1Count * 0.25 +
                    part2Count * 1.0 +
                    part3Count * 0.5 +
                    part4Count * 1.5
                  ).toFixed(1)}
                  /10.0
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handlePublishTest}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer text-xs"
              >
                🚀 Xuất bản & Phát đề trực tuyến cho lớp {targetClass} ({selectedQuestions.length} câu)
              </button>
            </div>
          </div>

          {/* Right Column: Selected Questions Breakdown by Part (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <span>Các câu hỏi đã chọn trong đề ({selectedQuestions.length} câu)</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-mono font-bold">
                    Tổng: {totalExamPoints.toFixed(2)}/10.0 đ
                  </span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Phân chia 4 phần rõ ràng · Hỗ trợ chỉnh sửa, di chuyển thứ tự câu hỏi
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsCreatingNewQuestion(true)}
                  className="text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1.5 rounded-lg border border-emerald-200 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Soạn câu</span>
                </button>
                <button
                  onClick={() => setActiveTab('bank')}
                  className="text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 rounded-lg border border-blue-200 transition-colors cursor-pointer"
                >
                  + Ngân hàng câu
                </button>
              </div>
            </div>

            {/* Section 1: MCQ */}
            {part1List.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded-lg bg-blue-50/60 border border-blue-200/60">
                  <span className="font-bold text-blue-900 text-[11px]">
                    PHẦN I: TRẮC NGHIỆM 4 ĐÁP ÁN ({part1List.length} câu · {(part1List.length * 0.25).toFixed(2)} điểm)
                  </span>
                  <span className="text-[10px] text-blue-700 font-medium">0,25đ / câu</span>
                </div>
                <div className="space-y-2 pl-1">
                  {part1List.map((q, idx) => (
                    <div key={q.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1.5">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 font-mono">Câu {idx + 1}:</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-semibold">
                            {q.bloomLevel}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleMoveQuestion(q.id, 'up')}
                            className="p-1 text-slate-400 hover:text-slate-700"
                            title="Di chuyển lên"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleMoveQuestion(q.id, 'down')}
                            className="p-1 text-slate-400 hover:text-slate-700"
                            title="Di chuyển xuống"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingQuestion(q)}
                            className="text-blue-600 hover:underline text-[11px] flex items-center gap-0.5 cursor-pointer"
                          >
                            <Edit className="w-3 h-3" />
                            <span>Sửa</span>
                          </button>
                          <button
                            onClick={() => handleToggleSelectQuestion(q.id)}
                            className="text-rose-600 hover:underline text-[11px] cursor-pointer"
                          >
                            Gỡ
                          </button>
                        </div>
                      </div>
                      <div className="text-slate-800 text-xs font-medium">
                        <MathFormula math={q.content} />
                      </div>
                      {q.options && (
                        <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px]">
                          {q.options.map((opt, i) => (
                            <div
                              key={i}
                              className={`p-1.5 rounded border text-[11px] ${
                                opt === q.correctAnswer
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-medium'
                                  : 'bg-white border-slate-200 text-slate-600'
                              }`}
                            >
                              <span className="font-bold mr-1">{String.fromCharCode(65 + i)}.</span>
                              <MathFormula math={opt} />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section 2: True/False */}
            {part2List.length > 0 && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50/60 border border-emerald-200/60">
                  <span className="font-bold text-emerald-900 text-[11px]">
                    PHẦN II: TRẮC NGHIỆM ĐÚNG / SAI ({part2List.length} câu · {(part2List.length * 1.0).toFixed(1)} điểm)
                  </span>
                  <span className="text-[10px] text-emerald-700 font-medium">1,0đ / câu (4 ý a,b,c,d)</span>
                </div>
                <div className="space-y-2 pl-1">
                  {part2List.map((q, idx) => (
                    <div key={q.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1.5">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 font-mono">
                            Câu {part1List.length + idx + 1}:
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                            {q.bloomLevel} · Đúng/Sai
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingQuestion(q)}
                            className="text-blue-600 hover:underline text-[11px] flex items-center gap-0.5 cursor-pointer"
                          >
                            <Edit className="w-3 h-3" />
                            <span>Sửa</span>
                          </button>
                          <button
                            onClick={() => handleToggleSelectQuestion(q.id)}
                            className="text-rose-600 hover:underline text-[11px] cursor-pointer"
                          >
                            Gỡ
                          </button>
                        </div>
                      </div>
                      <div className="text-slate-800 text-xs font-medium">
                        <MathFormula math={q.content} />
                      </div>
                      {q.tfItems && (
                        <div className="space-y-1 pt-1 text-[11px]">
                          {q.tfItems.map((sub, sIdx) => (
                            <div
                              key={sub.id}
                              className="p-1.5 rounded bg-white border border-slate-200 flex items-center justify-between"
                            >
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-slate-700">
                                  {['a', 'b', 'c', 'd'][sIdx]})
                                </span>
                                <span>
                                  <MathFormula math={sub.statement} />
                                </span>
                              </div>
                              <span
                                className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                  sub.isCorrect
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-rose-100 text-rose-800'
                                }`}
                              >
                                {sub.isCorrect ? 'ĐÚNG' : 'SAI'}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section 3: Short Answer */}
            {part3List.length > 0 && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between p-2 rounded-lg bg-indigo-50/60 border border-indigo-200/60">
                  <span className="font-bold text-indigo-900 text-[11px]">
                    PHẦN III: TRẢ LỜI NGẮN ({part3List.length} câu · {(part3List.length * 0.5).toFixed(1)} điểm)
                  </span>
                  <span className="text-[10px] text-indigo-700 font-medium">0,5đ / câu (Điền số thực)</span>
                </div>
                <div className="space-y-2 pl-1">
                  {part3List.map((q, idx) => (
                    <div key={q.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1.5">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 font-mono">
                            Câu {part1List.length + part2List.length + idx + 1}:
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 font-semibold">
                            {q.bloomLevel} · Điền đáp số
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingQuestion(q)}
                            className="text-blue-600 hover:underline text-[11px] flex items-center gap-0.5 cursor-pointer"
                          >
                            <Edit className="w-3 h-3" />
                            <span>Sửa</span>
                          </button>
                          <button
                            onClick={() => handleToggleSelectQuestion(q.id)}
                            className="text-rose-600 hover:underline text-[11px] cursor-pointer"
                          >
                            Gỡ
                          </button>
                        </div>
                      </div>
                      <div className="text-slate-800 text-xs font-medium">
                        <MathFormula math={q.content} />
                      </div>
                      <div className="p-1.5 bg-white border border-slate-200 rounded text-[11px] text-slate-700 flex items-center justify-between">
                        <span className="font-semibold text-slate-500">Đáp số chuẩn:</span>
                        <span className="font-mono font-bold text-indigo-700">{q.correctAnswer}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section 4: Essay */}
            {part4List.length > 0 && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50/60 border border-amber-200/60">
                  <span className="font-bold text-amber-900 text-[11px]">
                    PHẦN IV: TỰ LUẬN ({part4List.length} câu ·{' '}
                    {part4List.reduce((acc, q) => acc + (q.points || 1.5), 0).toFixed(1)} điểm)
                  </span>
                  <span className="text-[10px] text-amber-700 font-medium">Trình bày bài giải chi tiết</span>
                </div>
                <div className="space-y-2 pl-1">
                  {part4List.map((q, idx) => (
                    <div key={q.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1.5">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 font-mono">
                            Câu {part1List.length + part2List.length + part3List.length + idx + 1}:
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold">
                            {q.bloomLevel} · {q.points || 1.5} điểm
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingQuestion(q)}
                            className="text-blue-600 hover:underline text-[11px] flex items-center gap-0.5 cursor-pointer"
                          >
                            <Edit className="w-3 h-3" />
                            <span>Sửa</span>
                          </button>
                          <button
                            onClick={() => handleToggleSelectQuestion(q.id)}
                            className="text-rose-600 hover:underline text-[11px] cursor-pointer"
                          >
                            Gỡ
                          </button>
                        </div>
                      </div>
                      <div className="text-slate-800 text-xs font-medium whitespace-pre-line">
                        <MathFormula math={q.content} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedQuestions.length === 0 && (
              <div className="p-8 text-center text-slate-500 space-y-2 border-2 border-dashed border-slate-200 rounded-xl">
                <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="font-medium">Chưa có câu hỏi nào được chọn vào đề thi.</p>
                <p className="text-[11px]">
                  Thầy có thể bấm <b>"⚡ Điền tự động"</b> theo ma trận hoặc chọn từ <b>"Ngân hàng câu hỏi"</b>!
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: EXAM SHUFFLER & MULTI-CODE GENERATOR */}
      {activeTab === 'shuffler' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-6 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
                  Hệ Thống Trộn Đề & Hoán Vị Mã Đề Thi Tự Động
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                Sinh Nhiều Mã Đề (101, 102, 103, 104) & Bảng Đối Chiếu Đáp Án
              </h2>
              <p className="text-xs text-slate-500">
                Tự động hoán vị thứ tự câu hỏi và 4 phương án A, B, C, D · Bảo toàn cấu trúc 3 phần chuẩn Bộ GD&ĐT
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleRunShuffler}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-xs cursor-pointer text-xs"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>Trộn lại các mã đề</span>
              </button>

              {multiCodeResult && (
                <button
                  onClick={handleExportAnswerMatrix}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-xs cursor-pointer text-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Xuất Bảng Đáp Án (.docx)</span>
                </button>
              )}
            </div>
          </div>

          {/* Shuffler Settings Bar */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Số lượng mã đề sinh ra:</label>
              <select
                value={codeCount}
                onChange={(e) => setCodeCount(Number(e.target.value))}
                className="w-full p-2 border border-slate-300 rounded-lg bg-white font-bold text-blue-700"
              >
                <option value={2}>2 mã đề (101, 102)</option>
                <option value={4}>4 mã đề (101, 102, 103, 104)</option>
                <option value={6}>6 mã đề (101 đến 106)</option>
                <option value={8}>8 mã đề (101 đến 108)</option>
              </select>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={shuffleQuestionsWithinPart}
                onChange={(e) => setShuffleQuestionsWithinPart(e.target.checked)}
                className="accent-blue-600 rounded"
              />
              <span className="font-medium">Trộn vị trí câu trong từng phần</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={shuffleOptionsInMCQ}
                onChange={(e) => setShuffleOptionsInMCQ(e.target.checked)}
                className="accent-blue-600 rounded"
              />
              <span className="font-medium">Hoán vị 4 đáp án A, B, C, D</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={shuffleSubItemsInTF}
                onChange={(e) => setShuffleSubItemsInTF(e.target.checked)}
                className="accent-blue-600 rounded"
              />
              <span className="font-medium">Trộn các ý a, b, c, d của Đúng/Sai</span>
            </label>
          </div>

          {multiCodeResult && (
            <div className="space-y-6">
              {/* CROSS-CODE ANSWER MATRIX TABLE */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <Table className="w-4 h-4 text-blue-600" />
                    <span>Bảng Ma Trận Đối Chiếu Đáp Án Chéo (Answer Key Lookup Matrix)</span>
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    Đối chiếu vị trí câu và đáp án tương ứng qua các mã đề
                  </span>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-[11px] text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                        <th className="p-2.5 w-16 text-center">Câu Gốc</th>
                        <th className="p-2.5 w-24">Phân Đoạn</th>
                        {multiCodeResult.codes.map((c) => (
                          <th key={c.code} className="p-2.5 text-center font-mono text-blue-700 bg-blue-50/50">
                            Mã {c.code}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {multiCodeResult.answerMatrix.map((row) => (
                        <tr key={row.originalNumber} className="hover:bg-slate-50">
                          <td className="p-2.5 font-mono font-bold text-center text-slate-700">
                            Câu {row.originalNumber}
                          </td>
                          <td className="p-2.5 font-medium text-slate-500">{row.part}</td>
                          {multiCodeResult.codes.map((c) => (
                            <td key={c.code} className="p-2.5 text-center font-mono font-bold text-emerald-700 bg-emerald-50/30">
                              {row.answersByCode[c.code] || '-'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* CODE PREVIEW TABS */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800">Xem trước toàn văn:</span>
                    <div className="flex gap-1">
                      {multiCodeResult.codes.map((c) => (
                        <button
                          key={c.code}
                          onClick={() => setSelectedPreviewCode(c.code)}
                          className={`px-3 py-1 rounded-lg font-mono font-bold text-xs cursor-pointer transition-colors ${
                            selectedPreviewCode === c.code
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          Mã {c.code}
                        </button>
                      ))}
                    </div>
                  </div>

                  {(() => {
                    const activeCodeObj = multiCodeResult.codes.find((c) => c.code === selectedPreviewCode);
                    return activeCodeObj ? (
                      <button
                        onClick={() => handleExportSingleShuffledCode(activeCodeObj)}
                        className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer text-xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Tải Mã {activeCodeObj.code} (.docx)</span>
                      </button>
                    ) : null;
                  })()}
                </div>

                {/* Shuffled Code Questions Stream */}
                {(() => {
                  const activeCodeObj = multiCodeResult.codes.find((c) => c.code === selectedPreviewCode);
                  if (!activeCodeObj) return null;

                  return (
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 max-h-[500px] overflow-y-auto">
                      <div className="text-center font-bold text-slate-800 pb-2 border-b border-slate-200 uppercase">
                        {examTitle} · MÃ ĐỀ: {activeCodeObj.code}
                      </div>
                      {activeCodeObj.questions.map((q, idx) => (
                        <div key={q.id} className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-slate-900 font-mono">
                              Câu {idx + 1}:
                            </span>
                            <span className="font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px]">
                              Đáp án: {activeCodeObj.answerKey[idx + 1]}
                            </span>
                          </div>
                          <div className="text-slate-800">
                            <MathFormula math={q.content} />
                          </div>
                          {q.options && q.type === 'multiple_choice' && (
                            <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px]">
                              {q.options.map((opt, i) => (
                                <div key={i} className="p-1.5 rounded border border-slate-200 bg-slate-50">
                                  <span className="font-bold mr-1">{String.fromCharCode(65 + i)}.</span>
                                  <MathFormula math={opt} />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: OMR OPTICAL ANSWER SHEET (PRINTABLE A4) */}
      {activeTab === 'omr' && (
        <OMRAnswerSheet
          examCode={examCode}
          examTitle={examTitle}
          schoolName={schoolName}
          part1Count={part1List.length || 12}
          part2Count={part2List.length || 4}
          part3Count={part3List.length || 6}
        />
      )}

      {/* TAB 4: 2D MATRIX & SPECIFICATIONS */}
      {activeTab === 'matrix' && (
        <div className="space-y-5">
          <ExamMatrixView
            grade={examGrade}
            examTitle={examTitle}
            onExportDocx={() =>
              exportExamMatrixTableToDocx({
                title: examTitle,
                grade: examGrade,
                duration: examDuration,
                schoolName,
                examCode,
              })
            }
          />

          {/* AI Matrix Document Ingestion Subsections */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Nạp Tệp Ma Trận & Đề Mẫu Gốc Để AI Đọc Hiểu</span>
            </h3>

            <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
              <button
                onClick={() => setSourceDocMethod('upload_matrix')}
                className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 cursor-pointer ${
                  sourceDocMethod === 'upload_matrix' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>1. Tải tệp Ma Trận (.docx, .pdf)</span>
              </button>

              <button
                onClick={() => setSourceDocMethod('textbook')}
                className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 cursor-pointer ${
                  sourceDocMethod === 'textbook' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>2. Chọn từ Khung SGK Số</span>
              </button>

              <button
                onClick={() => setSourceDocMethod('pasted')}
                className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 cursor-pointer ${
                  sourceDocMethod === 'pasted' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>3. Dán nội dung ma trận</span>
              </button>
            </div>

            {sourceDocMethod === 'upload_matrix' && (
              <div className="p-6 border-2 border-dashed border-indigo-200 rounded-2xl bg-indigo-50/40 text-center space-y-3">
                <Upload className="w-6 h-6 text-indigo-600 mx-auto" />
                <h4 className="font-bold text-slate-900">Tải lên tệp Word / PDF Ma Trận Đề</h4>
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold cursor-pointer">
                  <span>Chọn tệp ma trận từ máy tính</span>
                  <input
                    type="file"
                    onChange={handleMatrixFileUpload}
                    className="hidden"
                    accept=".docx,.doc,.pdf,.xlsx,.csv,.txt"
                  />
                </label>
              </div>
            )}

            {sourceDocMethod === 'pasted' && (
              <textarea
                rows={5}
                value={pastedMatrixText}
                onChange={(e) => setPastedMatrixText(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl bg-slate-50 font-mono text-[11px]"
              />
            )}
          </div>
        </div>
      )}

      {/* TAB 5: SMART WORD & TEXT IMPORT PARSER */}
      {activeTab === 'import' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-5 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                  Bộ Bóc Tách Đề Thi Thông Minh (Smart Exam Parser)
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                Nhập Đề Tự Động Từ File Word / Dán Văn Bản Thô
              </h2>
              <p className="text-xs text-slate-500">
                Tự động nhận diện câu trắc nghiệm 4 đáp án (A,B,C,D), Đúng/Sai (a,b,c,d), trả lời ngắn và tự luận
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleParseRawText}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-xs cursor-pointer text-xs"
              >
                <Sparkles className="w-4 h-4" />
                <span>Bóc tách câu hỏi ngay</span>
              </button>

              {parsedImportQuestions.length > 0 && (
                <button
                  onClick={handleAddParsedToExam}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-xs cursor-pointer text-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Đưa {parsedImportQuestions.length} câu vào đề thi →</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Sample Buttons */}
          <div className="flex items-center gap-2 text-[11px]">
            <span className="font-semibold text-slate-600">Dán mẫu thử nghiệm nhanh:</span>
            <button
              onClick={() => {
                setRawImportText(
                  `Câu 1: Cho hàm số y = f(x) có đạo hàm f'(x) = 3x^2 - 6x. Tìm khoảng nghịch biến của hàm số?\nA. (0; 2)\nB. (2; +\\infty)\nC. (-\\infty; 0)\nD. (0; 3)\nĐáp án: A\nLời giải: f'(x) < 0 <=> 0 < x < 2.\n\n` +
                  `Câu 2: Cho hàm số y = (2x - 1)/(x + 1). Xét tính đúng/sai của các khẳng định sau:\na) Tập xác định D = R \\ {-1} - Đúng\nb) Đồ thị có tiệm cận đứng x = -1 - Đúng\nc) Đồ thị có tiệm cận ngang y = 1 - Sai\nd) Hàm số đồng biến trên từng khoảng xác định - Đúng\n\n` +
                  `Câu 3: Một người gửi tiết kiệm 100 triệu đồng với lãi suất 6%/năm. Sau bao nhiêu năm người đó nhận được số tiền gấp đôi?\nĐáp số: 12\nLời giải: Sử dụng công thức lãi kép T = A(1 + r)^n.`
                );
              }}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-medium cursor-pointer"
            >
              Mẫu 1: Đạo hàm & Tiệm cận 2025
            </button>
            <button
              onClick={() => {
                setRawImportText(
                  `Câu 1: Nguyên hàm của hàm số f(x) = 2x + cos(x) là:\nA. x^2 + sin(x) + C\nB. x^2 - sin(x) + C\nC. 2 - sin(x) + C\nD. 2x^2 + sin(x) + C\nĐáp án: A\n\n` +
                  `Câu 2: Trong không gian Oxyz, cho mặt phẳng (P): 2x - y + 2z - 4 = 0. Khoảng cách từ điểm M(1; 2; 3) đến (P) bằng bao nhiêu?\nĐáp số: 2`
                );
              }}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-medium cursor-pointer"
            >
              Mẫu 2: Tích phân & Tọa độ Oxyz
            </button>
          </div>

          {/* Text Area */}
          <textarea
            rows={8}
            value={rawImportText}
            onChange={(e) => setRawImportText(e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-xl bg-slate-50 font-mono text-[11px] leading-relaxed focus:bg-white"
            placeholder="Dán nội dung đề thi dạng: Câu 1: ... A. ... B. ... C. ... D. ... Đáp án: A ..."
          />

          {/* Parsed Output Preview */}
          {parsedImportQuestions.length > 0 && (
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Kết quả bóc tách ({parsedImportQuestions.length} câu hỏi):</span>
              </h3>

              <div className="space-y-2">
                {parsedImportQuestions.map((q, idx) => (
                  <div key={q.id} className="p-3 bg-emerald-50/40 border border-emerald-200 rounded-xl space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 font-mono">Câu {idx + 1}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                          {q.type === 'multiple_choice' ? 'TN 4 đáp án' : q.type === 'true_false' ? 'Đúng / Sai' : 'Trả lời ngắn'}
                        </span>
                      </div>
                      <span className="font-mono text-emerald-700 font-bold text-[11px]">
                        Đáp án: {q.correctAnswer}
                      </span>
                    </div>
                    <div className="text-slate-800 text-xs font-medium">
                      <MathFormula math={q.content} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 6: QUESTION BANK WITH FILTERS */}
      {activeTab === 'bank' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4 text-xs">
          {/* Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={bankFilterTopic}
                onChange={(e) => setBankFilterTopic(e.target.value)}
                className="p-2 border border-slate-300 rounded-lg bg-slate-50"
              >
                <option value="all">Tất cả chủ đề</option>
                <option value="Hàm số bậc hai">Hàm số bậc hai</option>
                <option value="Đạo hàm">Đạo hàm</option>
                <option value="Xác suất">Xác suất</option>
                <option value="Hình học không gian">Hình học không gian</option>
              </select>

              <select
                value={bankFilterType}
                onChange={(e) => setBankFilterType(e.target.value)}
                className="p-2 border border-slate-300 rounded-lg bg-slate-50 font-medium text-blue-700"
              >
                <option value="all">Tất cả các định dạng câu</option>
                <option value="multiple_choice">1. Trắc nghiệm 4 đáp án (A,B,C,D)</option>
                <option value="true_false">2. Trắc nghiệm Đúng / Sai (Ý a,b,c,d)</option>
                <option value="short_answer">3. Trắc nghiệm Trả lời ngắn</option>
                <option value="essay">4. Tự luận (Lời giải chi tiết)</option>
              </select>

              <select
                value={bankFilterBloom}
                onChange={(e) => setBankFilterBloom(e.target.value)}
                className="p-2 border border-slate-300 rounded-lg bg-slate-50"
              >
                <option value="all">Tất cả mức độ</option>
                <option value="NhanBiet">Nhận biết</option>
                <option value="ThongHieu">Thông hiểu</option>
                <option value="VanDung">Vận dụng</option>
                <option value="VanDungCao">Vận dụng cao</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsCreatingNewQuestion(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Soạn câu mới</span>
              </button>
              <button
                onClick={onOpenAIQuestionGen}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold cursor-pointer shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI sinh câu hỏi</span>
              </button>
            </div>
          </div>

          {/* Questions Grid */}
          <div className="space-y-3">
            {filteredQuestions.map((q) => {
              const isSelected = selectedQuestions.includes(q.id);
              const typeBadge =
                q.type === 'multiple_choice'
                  ? { label: 'TN 4 đáp án', color: 'bg-blue-100 text-blue-800' }
                  : q.type === 'true_false'
                  ? { label: 'Đúng / Sai 4 ý', color: 'bg-emerald-100 text-emerald-800' }
                  : q.type === 'short_answer'
                  ? { label: 'Trả lời ngắn', color: 'bg-indigo-100 text-indigo-800' }
                  : { label: 'Tự luận', color: 'bg-amber-100 text-amber-800' };

              return (
                <div
                  key={q.id}
                  className={`p-4 rounded-xl border transition-all space-y-2 ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50/40 ring-1 ring-blue-400/30'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 font-mono">[{q.id}]</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${typeBadge.color}`}>
                        {typeBadge.label}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                        {q.topic} · Lớp {q.grade} · {q.bloomLevel}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingQuestion(q)}
                        className="p-1 text-slate-400 hover:text-blue-600 cursor-pointer"
                        title="Chỉnh sửa câu hỏi"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleSelectQuestion(q.id)}
                        className={`px-3 py-1 rounded-lg font-semibold text-xs transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {isSelected ? '✓ Đã chọn vào đề' : '+ Chọn vào đề'}
                      </button>
                    </div>
                  </div>

                  <div className="text-slate-800 text-sm font-medium whitespace-pre-line">
                    <MathFormula math={q.content} />
                  </div>

                  {/* Multiple Choice Options */}
                  {q.options && q.type === 'multiple_choice' && (
                    <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                      {q.options.map((opt, i) => (
                        <div
                          key={i}
                          className={`p-1.5 rounded border ${
                            opt === q.correctAnswer
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                              : 'bg-slate-50 border-slate-200 text-slate-700'
                          }`}
                        >
                          <span className="font-bold mr-1">{String.fromCharCode(65 + i)}.</span>
                          <MathFormula math={opt} />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* True False Sub-items */}
                  {q.tfItems && q.type === 'true_false' && (
                    <div className="space-y-1.5 pt-1 text-[11px]">
                      {q.tfItems.map((sub, sIdx) => (
                        <div
                          key={sub.id}
                          className="p-2 rounded bg-slate-50 border border-slate-200 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-700">
                              Ý {['a', 'b', 'c', 'd'][sIdx]}):
                            </span>
                            <span>
                              <MathFormula math={sub.statement} />
                            </span>
                          </div>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              sub.isCorrect
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {sub.isCorrect ? 'ĐÚNG' : 'SAI'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Short Answer */}
                  {q.type === 'short_answer' && (
                    <div className="p-2 bg-indigo-50/60 border border-indigo-200 rounded-lg text-[11px] text-indigo-900 flex items-center justify-between">
                      <span className="font-semibold">Đáp số chuẩn xác:</span>
                      <span className="font-mono font-bold">{q.correctAnswer}</span>
                    </div>
                  )}

                  {/* Explanation */}
                  {q.explanation && (
                    <div className="pt-1.5 border-t border-slate-100 text-[11px] text-slate-500">
                      <span className="font-semibold text-slate-700">Hướng dẫn giải: </span>
                      <MathFormula math={q.explanation} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 7: ASSIGNMENTS LIST (PUBLISHED) */}
      {activeTab === 'assignments' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_ASSIGNMENTS.map((asg) => (
            <div
              key={asg.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all text-xs"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                    Lớp {asg.className} · {asg.type}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      asg.status === 'Đang làm'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {asg.status}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-base">{asg.title}</h3>
                <div className="flex items-center gap-3 text-slate-500 text-xs">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {asg.durationMinutes} phút
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Hạn: {asg.dueDate}
                  </span>
                </div>
              </div>

              {/* Progress */}
              <div className="space-y-1.5 pt-3 border-t border-slate-100">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Tiến độ nộp bài:</span>
                  <span className="font-mono font-bold text-blue-700">
                    {asg.submittedCount}/{asg.totalStudents} ({Math.round((asg.submittedCount / asg.totalStudents) * 100)}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full"
                    style={{ width: `${(asg.submittedCount / asg.totalStudents) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssignmentBuilderView;
