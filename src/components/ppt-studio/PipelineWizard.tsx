import React, { useState } from 'react';
import { Lecture, SlideItem } from '../../types';
import MathFormula from '../MathFormula';
import { DIGITAL_TEXTBOOK_SOURCES, TextbookSourceItem } from '../../data/textbookSources';
import { PPTXTheme } from '../../utils/pptxExporter';
import {
  Upload,
  FileText,
  Sparkles,
  Layers,
  Sliders,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  RefreshCw,
  Tv,
  FileCheck,
  Check,
  Zap,
  GraduationCap,
  Eye,
  Trophy,
  Dices,
  Lightbulb,
} from 'lucide-react';

interface PipelineWizardProps {
  onComplete: (newLecture: Lecture) => void;
  onCancel: () => void;
}

export type PedagogicalMode =
  | 'fast'
  | 'pedagogy'
  | 'visual_wow'
  | 'interactive'
  | 'competition'
  | 'stem'
  | 'exam_review'
  | 'accessible'
  | 'custom';

export const PipelineWizard: React.FC<PipelineWizardProps> = ({
  onComplete,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1); // 1 to 5

  // STEP 1: Source Document
  const [sourceType, setSourceType] = useState<'textbook' | 'upload' | 'khbd' | 'sample'>('textbook');
  const [selectedTextbook, setSelectedTextbook] = useState<TextbookSourceItem>(DIGITAL_TEXTBOOK_SOURCES[0]);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [uploadedFileSize, setUploadedFileSize] = useState<string>('');
  const [sourceText, setSourceText] = useState<string>(
    `1. Khởi động: Chiếc xe đua chạy với phương trình s(t) = 5t^2. Vận tốc tức thời tại t = 2s là v(2) = s'(2) = 20 m/s.\n2. Định nghĩa đạo hàm: f'(x0) = lim [f(x0+Δx) - f(x0)]/Δx khi Δx -> 0.\n3. Ý nghĩa hình học: f'(x0) là hệ số góc của tiếp tuyến k = tan(alpha).\n4. Phương trình tiếp tuyến tại M0(x0; y0): y - y0 = f'(x0)(x - x0).\n5. Ví dụ: Viết phương trình tiếp tuyến của đồ thị y = x^2 tại điểm có hoành độ x0 = 1.`
  );
  const [lessonTitle, setLessonTitle] = useState<string>('Đạo hàm và phương trình tiếp tuyến của đồ thị hàm số');
  const [lessonGrade, setLessonGrade] = useState<number>(11);
  const [lessonCurriculum, setLessonCurriculum] = useState<'KNTT' | 'CTST' | 'Cánh Diều'>('KNTT');

  // STEP 2: Pedagogical Mode
  const [selectedMode, setSelectedMode] = useState<PedagogicalMode>('visual_wow');
  const [slideCount, setSlideCount] = useState<number>(8);
  const [targetTheme, setTargetTheme] = useState<PPTXTheme>('blue');

  // STEP 3: Extracted Pedagogical Core
  const [learningObjectives, setLearningObjectives] = useState<string[]>([
    'Hiểu bản chất vận tốc tức thời và định nghĩa đạo hàm tại một điểm.',
    'Nắm vững ý nghĩa hình học của đạo hàm: hệ số góc tiếp tuyến k = f\'(x₀).',
    'Thành thạo lập phương trình tiếp tuyến y - y₀ = f\'(x₀)(x - x₀).',
  ]);
  const [commonMisconceptions, setCommonMisconceptions] = useState<string[]>([
    'Nhầm lẫn giữa tiếp tuyến tại một điểm và tiếp tuyến đi qua một điểm.',
    'Quên tính tung độ tiếp điểm y₀ khi đề bài chỉ cho hoành độ x₀.',
  ]);

  // Generating state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [progressStepText, setProgressStepText] = useState<string>('');

  const modesConfig: Record<
    PedagogicalMode,
    { title: string; desc: string; icon: any; color: string; tag: string }
  > = {
    visual_wow: {
      title: 'Visual Wow Mode (Khuyên dùng)',
      desc: 'Tối đa hóa đồ thị, hình học 3D, hiệu ứng Morph chuyển động chi tiết 60fps.',
      icon: Eye,
      color: 'border-cyan-500 bg-cyan-500/10 text-cyan-300',
      tag: 'Morph 3D',
    },
    pedagogy: {
      title: 'Pedagogy Mode (CV 5512)',
      desc: 'Tiến trình chuẩn mực: Khởi động → Khám phá → Luyện tập → Vận dụng thực tế.',
      icon: GraduationCap,
      color: 'border-blue-500 bg-blue-500/10 text-blue-300',
      tag: 'Chuẩn Bộ',
    },
    competition: {
      title: 'Competition Mode (Hội thi GVDG)',
      desc: 'Thiết kế tinh xảo cho giờ thao giảng, dự giờ, hội thi giáo viên dạy giỏi.',
      icon: Trophy,
      color: 'border-amber-500 bg-amber-500/10 text-amber-300',
      tag: 'Thao Giảng',
    },
    interactive: {
      title: 'Interactive Mode (Trò chơi hóa)',
      desc: 'Tích hợp minigame, trắc nghiệm tương tác, vòng quay may mắn trong giờ học.',
      icon: Dices,
      color: 'border-purple-500 bg-purple-500/10 text-purple-300',
      tag: 'Gamification',
    },
    stem: {
      title: 'STEM Mode (Thực tiễn & Kỹ thuật)',
      desc: 'Mô hình hóa toán học vào bài toán kiến trúc, kinh tế, vật lý, tài chính.',
      icon: Lightbulb,
      color: 'border-emerald-500 bg-emerald-500/10 text-emerald-300',
      tag: 'Ứng Dụng',
    },
    fast: {
      title: 'Fast Mode (Tạo nhanh 6 slide)',
      desc: 'Cô đọng kiến thức cốt lõi nhanh chóng trong 30 giây.',
      icon: Zap,
      color: 'border-slate-500 bg-slate-500/10 text-slate-300',
      tag: 'Nhanh 30s',
    },
    exam_review: {
      title: 'Exam Review Mode (Ôn thi THPT)',
      desc: 'Tổng hợp dạng bài trọng tâm, bẫy trắc nghiệm và phương pháp giải nhanh.',
      icon: FileCheck,
      color: 'border-rose-500 bg-rose-500/10 text-rose-300',
      tag: 'Luyện Thi',
    },
    accessible: {
      title: 'Accessible Mode (Từng bước chi tiết)',
      desc: 'Chia nhỏ thao tác, dẫn dắt chậm rãi cho học sinh cần hỗ trợ.',
      icon: Sliders,
      color: 'border-teal-500 bg-teal-500/10 text-teal-300',
      tag: 'Phân Hóa',
    },
    custom: {
      title: 'Custom Mode (Tùy biến giáo viên)',
      desc: 'Giáo viên tự cấu hình số lượng slide và phân bổ nội dung theo ý muốn.',
      icon: Layers,
      color: 'border-indigo-500 bg-indigo-500/10 text-indigo-300',
      tag: 'Tự Do',
    },
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFileName(file.name);
    setUploadedFileSize(`${(file.size / 1024 / 1024).toFixed(1)} MB`);
    setLessonTitle(file.name.replace(/\.[^/.]+$/, ''));
  };

  const handleRunGenerator = () => {
    setIsGenerating(true);
    setProgressStepText('Đang phân tích cấu trúc tài liệu & yêu cầu cần đạt...');

    setTimeout(() => {
      setProgressStepText('Đang thiết kế kịch bản sư phạm theo chế độ ' + modesConfig[selectedMode].title + '...');
    }, 600);

    setTimeout(() => {
      setProgressStepText('Đang tạo các thẻ Morph Pairing p159:morph và công thức LaTeX...');
    }, 1200);

    setTimeout(() => {
      // Build final generated lecture object
      const generatedSlides: SlideItem[] = [
        {
          id: 1,
          slideType: 'title',
          title: lessonTitle,
          subtitle: `Môn Toán Lớp ${lessonGrade} · Bộ Sách ${lessonCurriculum} · Hệ Thống GDPT 2018`,
          bulletPoints: [
            'Chương trình Giáo dục Phổ thông 2018',
            'Trực quan hóa bản chất Toán học với đồ họa số',
            'Giáo viên: Thầy Nguyễn Minh Vũ - THPT Bình Long',
          ],
          teacherNotes: 'Slide mở đầu: Giới thiệu chuyên đề và tạo tâm lý sẵn sàng cho học sinh.',
        },
        {
          id: 2,
          slideType: 'real_world',
          title: 'Khởi Động: Tình Huống Thực Tế & Mô Hình Hóa',
          subtitle: 'Vận tốc tức thời của chuyển động biến đổi đều',
          bulletPoints: [
            'Một chiếc xe đua F1 tăng tốc với phương trình quãng đường $s(t) = 5t^2$ (m).',
            'Vận tốc trung bình trong khoảng thời gian $[2; 2 + \\Delta t]$ là: $v_{tb} = \\frac{s(2+\\Delta t) - s(2)}{\\Delta t}$.',
            'Khi $\\Delta t \\to 0$, vận tốc tức thời tại thời điểm $t = 2$ chính là đạo hàm $s\'(2) = 20$ (m/s).',
          ],
          formula: 'v(t_0) = s\'(t_0) = \\lim_{\\Delta t \\to 0} \\frac{s(t_0 + \\Delta t) - s(t_0)}{\\Delta t}',
          formulaNote: 'Đạo hàm là tốc độ thay đổi tức thời của đại lượng vật lý',
          teacherNotes: 'Treo câu hỏi gợi mở: Làm thế nào đo được vận tốc tại đúng tích tắc t=2s?',
        },
        {
          id: 3,
          slideType: 'concept',
          title: 'Hình Thành Kiến Thức: Định Nghĩa Đạo Hàm Tại Một Điểm',
          subtitle: 'Quy chuẩn toán học theo sách giáo khoa mới',
          bulletPoints: [
            'Cho hàm số $y = f(x)$ xác định trên khoảng $(a; b)$ và điểm $x_0 \\in (a; b)$.',
            'Giới hạn hữu hạn (nếu có) của tỉ số $\\frac{f(x) - f(x_0)}{x - x_0}$ khi $x \\to x_0$ được gọi là đạo hàm của hàm số tại $x_0$.',
            'Ký hiệu: $f\'(x_0)$ hoặc $y\'(x_0)$.',
          ],
          formula: 'f\'(x_0) = \\lim_{x \\to x_0} \\frac{f(x) - f(x_0)}{x - x_0} = \\lim_{\\Delta x \\to 0} \\frac{\\Delta y}{\\Delta x}',
          teacherNotes: 'Nhấn mạnh điều kiện giới hạn phải tồn tại và là số hữu hạn.',
        },
        {
          id: 4,
          slideType: 'visual_diagram',
          title: 'Ý Nghĩa Hình Học: Hệ Số Góc Của Tiếp Tuyến',
          subtitle: 'Bản chất Morph trực quan của cát tuyến chuyển dần thành tiếp tuyến',
          bulletPoints: [
            'Xét điểm cố định $M_0(x_0; f(x_0))$ và điểm di động $M(x; f(x))$ trên đồ thị $(C)$.',
            'Đường thẳng $M_0M$ là cát tuyến có hệ số góc $k_c = \\frac{f(x) - f(x_0)}{x - x_0}$.',
            'Khi $M \\to M_0$ dọc theo đường cong, cát tuyến $M_0M$ dần trở thành tiếp tuyến $\\Delta$ tại $M_0$.',
            'Hệ số góc của tiếp tuyến: $k = \\tan(\\alpha) = f\'(x_0)$.',
          ],
          formula: 'k = \\tan(\\alpha) = f\'(x_0)',
          formulaNote: 'Hệ số góc tiếp tuyến chính là giá trị đạo hàm tại tiếp điểm',
          teacherNotes: 'Chiếu đồ họa Morph để học sinh thấy cát tuyến xoay dần ôm khít đồ thị.',
        },
        {
          id: 5,
          slideType: 'concept',
          title: 'Công Thức Cốt Lõi: Phương Trình Tiếp Tuyến Của Đồ Thị',
          subtitle: 'Dạng tổng quát cần ghi nhớ',
          bulletPoints: [
            'Cho hàm số $y = f(x)$ có đồ thị $(C)$ và tiếp điểm $M_0(x_0; y_0)$ với $y_0 = f(x_0)$.',
            'Tiếp tuyến của $(C)$ tại điểm $M_0$ có phương trình chính thức:',
            'Trong đó $f\'(x_0)$ là hệ số góc của tiếp tuyến tại tiếp điểm.',
          ],
          formula: 'y - y_0 = f\'(x_0)(x - x_0)',
          formulaNote: 'Ba đại lượng then chốt cần tìm: x₀ (hoành độ), y₀ (tung độ), f\'(x₀) (hệ số góc)',
          teacherNotes: 'Yêu cầu học sinh đóng khung công thức này vào vở.',
        },
        {
          id: 6,
          slideType: 'step_by_step',
          title: 'Ví Dụ Mẫu: Lập Phương Trình Tiếp Tuyến Từng Bước',
          subtitle: 'Quy trình 3 bước chuẩn mực',
          bulletPoints: [
            'Bước 1: Tính đạo hàm $y\' = f\'(x)$ của hàm số đã cho.',
            'Bước 2: Tìm tung độ tiếp điểm $y_0 = f(x_0)$ và hệ số góc $k = f\'(x_0)$.',
            'Bước 3: Thay vào công thức $y - y_0 = f\'(x_0)(x - x_0)$ và rút gọn về dạng $y = ax + b$.',
          ],
          formula: 'y - 1 = 2(x - 1) \\iff y = 2x - 1',
          formulaNote: 'Ví dụ: Tiếp tuyến của y = x² tại điểm M(1; 1) có phương trình y = 2x - 1',
          teacherNotes: 'Rèn luyện thói quen kiểm tra tiếp điểm có thuộc tiếp tuyến vừa tìm không.',
        },
        {
          id: 7,
          slideType: 'quiz_interactive',
          title: 'Thử Thách Nhanh: Kiểm Tra Mức Độ Hiểu Bài (60 Giây)',
          subtitle: 'Củng cố kiến thức trước khi luyện tập chuyên sâu',
          bulletPoints: [
            'Cho hàm số $y = x^3 - 3x + 2$. Hệ số góc của tiếp tuyến tại điểm có hoành độ $x_0 = 2$ bằng bao nhiêu?',
          ],
          formula: 'y\' = 3x^2 - 3 \\implies k = y\'(2) = 3(2)^2 - 3 = 9',
          quizQuestion: 'Hệ số góc của tiếp tuyến của đồ thị y = x³ - 3x + 2 tại x₀ = 2 là:',
          quizOptions: ['k = 3', 'k = 9', 'k = 6', 'k = 12'],
          quizCorrectAnswer: 'k = 9',
          quizExplanation: 'Ta có đạo hàm y\' = 3x² - 3. Thay x₀ = 2 vào ta được k = y\'(2) = 3(4) - 3 = 9.',
          teacherNotes: 'Cho học sinh giơ bảng hoặc bấm trắc nghiệm kiểm tra nhanh.',
        },
        {
          id: 8,
          slideType: 'summary',
          title: 'Tổng Kết & Nhiệm Vụ Học Tập Về Nhà',
          subtitle: 'Sơ đồ hóa kiến thức và liên kết mở rộng',
          bulletPoints: [
            'Ghi nhớ bản chất: Đạo hàm là tốc độ biến thiên, là hệ số góc tiếp tuyến.',
            'Công thức phương trình tiếp tuyến tại tiếp điểm: $y - y_0 = f\'(x_0)(x - x_0)$.',
            'Nhiệm vụ về nhà: Bài tập 7.1 đến 7.5 SGK trang 45 và tìm hiểu trước bài toán tiếp tuyến đi qua một điểm.',
          ],
          teacherNotes: 'Đánh giá tinh thần học tập của lớp và dặn dò chuẩn bị bài sau.',
        },
      ];

      const newLectureObj: Lecture = {
        id: `LEC-AI-${Date.now().toString().slice(-4)}`,
        title: lessonTitle,
        grade: lessonGrade,
        chapter: `Chương Trình Toán ${lessonGrade} - ${lessonCurriculum}`,
        slidesCount: generatedSlides.length,
        slides: generatedSlides,
        theme: targetTheme,
      };

      setIsGenerating(false);
      onComplete(newLectureObj);
    }, 1800);
  };

  return (
    <div className="bg-slate-900 text-slate-100 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-2xl max-w-5xl mx-auto space-y-6">
      {/* Wizard Step Breadcrumbs */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
            AI PPTX Math Studio · Creation Pipeline
          </span>
          <h2 className="text-xl font-bold text-white mt-0.5">
            Quy Trình Kiến Tạo Bài Giảng Toán Học Thông Minh
          </h2>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((stepNum) => (
            <div
              key={stepNum}
              className={`w-7 h-7 rounded-full flex items-center justify-center font-bold font-mono text-xs transition-colors ${
                currentStep === stepNum
                  ? 'bg-cyan-500 text-slate-950 ring-2 ring-cyan-400/30'
                  : currentStep > stepNum
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {currentStep > stepNum ? '✓' : stepNum}
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1: SOURCE DOCUMENT INGESTION */}
      {currentStep === 1 && (
        <div className="space-y-5 text-xs">
          <div>
            <h3 className="text-sm font-bold text-white">Bước 1: Tiếp nhận tài liệu bài giảng gốc</h3>
            <p className="text-slate-400 mt-0.5">
              Chọn từ kho sách giáo khoa chuẩn hóa, tải lên kế hoạch bài dạy (.docx, .pdf) hoặc dán nội dung giáo án
            </p>
          </div>

          {/* Subtabs for ingestion */}
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => setSourceType('textbook')}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                sourceType === 'textbook'
                  ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300 font-bold'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <BookOpen className="w-4 h-4 mb-1 text-cyan-400" />
              <div className="font-bold">1. Sách Giáo Khoa Số</div>
              <div className="text-[10px] text-slate-400 font-normal">KNTT, CTST, Cánh Diều</div>
            </button>

            <button
              onClick={() => setSourceType('upload')}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                sourceType === 'upload'
                  ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300 font-bold'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <Upload className="w-4 h-4 mb-1 text-cyan-400" />
              <div className="font-bold">2. Tải Tệp Lên</div>
              <div className="text-[10px] text-slate-400 font-normal">KHBD, PPTX cũ, PDF</div>
            </button>

            <button
              onClick={() => setSourceType('khbd')}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                sourceType === 'khbd'
                  ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300 font-bold'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <FileText className="w-4 h-4 mb-1 text-cyan-400" />
              <div className="font-bold">3. Dán Nội Dung KHBD</div>
              <div className="text-[10px] text-slate-400 font-normal">Công văn 5512 trực tiếp</div>
            </button>

            <button
              onClick={() => setSourceType('sample')}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                sourceType === 'sample'
                  ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300 font-bold'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <Sparkles className="w-4 h-4 mb-1 text-cyan-400" />
              <div className="font-bold">4. Mẫu Bài Dạy Chuẩn</div>
              <div className="text-[10px] text-slate-400 font-normal">Đạo hàm, Oxyz, Parabol</div>
            </button>
          </div>

          {/* Source Type 1: Digital Textbook */}
          {sourceType === 'textbook' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {DIGITAL_TEXTBOOK_SOURCES.slice(0, 6).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedTextbook(item);
                      setLessonTitle(item.lessonTitle);
                      setLessonGrade(item.grade);
                      setLessonCurriculum(item.curriculum as any);
                    }}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all space-y-1.5 ${
                      selectedTextbook.id === item.id
                        ? 'bg-cyan-500/15 border-cyan-400 text-cyan-200 ring-1 ring-cyan-400/30'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between text-[10px] uppercase font-mono text-cyan-400 font-bold">
                      <span>Lớp {item.grade} · {item.curriculum}</span>
                      <span className="text-slate-400">{item.chapter}</span>
                    </div>
                    <div className="font-bold text-white text-xs">{item.lessonTitle}</div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {item.contentSnippet}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Source Type 2: Upload File */}
          {sourceType === 'upload' && (
            <div className="p-8 border-2 border-dashed border-slate-700 hover:border-cyan-500 rounded-2xl bg-slate-950 text-center space-y-3 transition-colors">
              <Upload className="w-8 h-8 text-cyan-400 mx-auto" />
              <div>
                <div className="font-bold text-white text-sm">Tải lên tệp giáo án, sách giáo khoa hoặc slide PPTX cũ</div>
                <div className="text-slate-400 text-xs mt-0.5">Hỗ trợ các định dạng .docx, .doc, .pdf, .pptx, .txt</div>
              </div>
              <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl cursor-pointer shadow-lg text-xs">
                <span>Chọn tệp từ máy tính</span>
                <input type="file" onChange={handleFileUpload} className="hidden" accept=".docx,.pdf,.pptx,.txt" />
              </label>
              {uploadedFileName && (
                <div className="text-emerald-400 font-mono text-xs pt-2">
                  ✓ Đã tiếp nhận: {uploadedFileName} ({uploadedFileSize})
                </div>
              )}
            </div>
          )}

          {/* Source Type 3: Paste text */}
          {(sourceType === 'khbd' || sourceType === 'sample') && (
            <div className="space-y-3">
              <div>
                <label className="font-bold text-slate-200 block mb-1">Tên bài học:</label>
                <input
                  type="text"
                  value={lessonTitle}
                  onChange={(e) => setLessonTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium"
                />
              </div>
              <div>
                <label className="font-bold text-slate-200 block mb-1">Nội dung kế hoạch bài dạy / chuyên đề:</label>
                <textarea
                  rows={6}
                  value={sourceText}
                  onChange={(e) => setSourceText(e.target.value)}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 font-mono text-[11px] leading-relaxed"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* STEP 2: PEDAGOGICAL MODE & SLIDE STRUCTURE */}
      {currentStep === 2 && (
        <div className="space-y-5 text-xs">
          <div>
            <h3 className="text-sm font-bold text-white">Bước 2: Chọn Chế độ Sư phạm & Cấu trúc Thiết kế</h3>
            <p className="text-slate-400 mt-0.5">
              9 chế độ thiết kế chuyên biệt cho môn Toán giúp tạo ra bài giảng có mục tiêu sư phạm rõ ràng
            </p>
          </div>

          {/* 9 Modes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(Object.keys(modesConfig) as PedagogicalMode[]).map((modeKey) => {
              const cfg = modesConfig[modeKey];
              const isSelected = selectedMode === modeKey;
              const IconComp = cfg.icon;

              return (
                <div
                  key={modeKey}
                  onClick={() => setSelectedMode(modeKey)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                    isSelected
                      ? `${cfg.color} ring-2 ring-cyan-400/40`
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <IconComp className="w-5 h-5" />
                    <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                      {cfg.tag}
                    </span>
                  </div>
                  <div className="font-bold text-white text-xs">{cfg.title}</div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{cfg.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Slide Count & Theme Selection */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-800">
            <div>
              <label className="font-bold text-slate-200 block mb-1">Số lượng slide dự kiến:</label>
              <select
                value={slideCount}
                onChange={(e) => setSlideCount(Number(e.target.value))}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono font-bold"
              >
                <option value={6}>6 slide (Cô đọng, tiết 45 phút)</option>
                <option value={8}>8 slide (Chuẩn mực có Quiz & Ví dụ)</option>
                <option value={10}>10 slide (Đầy đủ, có liên hệ thực tế & Gamification)</option>
                <option value={12}>12 slide (Chuyên đề chuyên sâu)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-200 block mb-1">Phong cách màu sắc (Theme):</label>
              <select
                value={targetTheme}
                onChange={(e) => setTargetTheme(e.target.value as PPTXTheme)}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold"
              >
                <option value="blue">Ocean Blue (Xanh biển - Hiện đại, chuẩn mực)</option>
                <option value="emerald">Emerald Tech (Xanh ngọc lục bảo - STEM)</option>
                <option value="purple">Royal Purple (Tím điện tử - Sáng tạo)</option>
                <option value="slate">Minimal Slate (Xám than tối giản - Tập trung)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: PEDAGOGICAL CONFIRMATION */}
      {currentStep === 3 && (
        <div className="space-y-5 text-xs">
          <div>
            <h3 className="text-sm font-bold text-white">Bước 3: Xác nhận Phân tích Sư phạm & Lập Kịch bản</h3>
            <p className="text-slate-400 mt-0.5">
              AI đã bóc tách mục tiêu năng lực, công thức cốt lõi và các điểm bẫy học sinh thường mắc phải
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
            <span className="font-bold text-cyan-300 block">Mục tiêu phát triển phẩm chất & năng lực (CV 5512):</span>
            <div className="space-y-1.5 pl-2">
              {learningObjectives.map((obj, i) => (
                <div key={i} className="flex items-start gap-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{obj}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
            <span className="font-bold text-amber-300 block">Cảnh báo sai lầm học sinh dễ mắc (Bẫy tư duy):</span>
            <div className="space-y-1 pl-2 text-slate-300">
              {commonMisconceptions.map((err, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  <span>{err}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Generating Loading Banner */}
          {isGenerating && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950 to-blue-950 border border-cyan-800 text-center space-y-3 animate-pulse">
              <RefreshCw className="w-6 h-6 text-cyan-400 mx-auto animate-spin" />
              <div className="font-bold text-white text-sm">{progressStepText}</div>
              <div className="text-[11px] text-cyan-300">
                Đang biên dịch tệp OpenXML với định danh !!Morph cho từng chi tiết nhỏ...
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <button
          onClick={currentStep === 1 ? onCancel : () => setCurrentStep((prev) => prev - 1)}
          disabled={isGenerating}
          className="px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-semibold text-xs cursor-pointer flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{currentStep === 1 ? 'Hủy bỏ' : 'Quay lại bước trước'}</span>
        </button>

        {currentStep < 3 ? (
          <button
            onClick={() => setCurrentStep((prev) => prev + 1)}
            className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg transition-all cursor-pointer flex items-center gap-2"
          >
            <span>Tiếp tục sang Bước {currentStep + 1}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleRunGenerator}
            disabled={isGenerating}
            className="px-6 py-2.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 text-slate-950 font-extrabold rounded-xl text-xs shadow-xl transition-all cursor-pointer flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isGenerating ? 'Đang tạo slide...' : 'Tạo Bài Giảng & Slide PPTX Ngay'}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default PipelineWizard;
