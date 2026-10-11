import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MOCK_LECTURES } from '../data/mockData';
import { Lecture, SlideItem } from '../types';
import MathFormula from './MathFormula';
import { exportLectureToPptx, PPTXTheme } from '../utils/pptxExporter';
import { DIGITAL_TEXTBOOK_SOURCES, TextbookSourceItem } from '../data/textbookSources';
import { StudioDashboard } from './ppt-studio/StudioDashboard';
import { PipelineWizard } from './ppt-studio/PipelineWizard';
import { MathVisualizerStudio } from './ppt-studio/MathVisualizerStudio';
import { GamificationStudio } from './ppt-studio/GamificationStudio';
import { MathQACenter } from './ppt-studio/MathQACenter';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Download,
  Sparkles,
  Play,
  FileText,
  Plus,
  Palette,
  CheckCircle2,
  Check,
  X,
  Tv,
  Upload,
  FileUp,
  Layers,
  Lightbulb,
  HelpCircle,
  Edit3,
  Trash2,
  Eye,
  RefreshCw,
  Compass,
  ArrowRight,
  Sliders,
  Share2,
  Home,
  ShieldCheck,
  Activity,
  Dices,
} from 'lucide-react';

export const LectureLibraryView: React.FC = () => {
  type StudioTab = 'dashboard' | 'editor' | 'pipeline' | 'visualizer' | 'gamification' | 'qa';
  const [studioTab, setStudioTab] = useState<StudioTab>('dashboard');

  const [lectures, setLectures] = useState<Lecture[]>(MOCK_LECTURES);
  const [selectedLecture, setSelectedLecture] = useState<Lecture>(lectures[1] || lectures[0]); // Đạo hàm
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportToast, setExportToast] = useState<string | null>(null);

  // Theme configuration
  const [activeTheme, setActiveTheme] = useState<PPTXTheme>('blue');

  // Presentation Fullscreen Mode
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showLaserPointer, setShowLaserPointer] = useState<boolean>(false);
  const [laserPos, setLaserPos] = useState({ x: 0, y: 0 });
  const [showPresenterNotes, setShowPresenterNotes] = useState<boolean>(false);

  // Interactive Quiz state on web
  const [selectedQuizOption, setSelectedQuizOption] = useState<string | null>(null);
  const [showQuizExplanation, setShowQuizExplanation] = useState<boolean>(false);

  // Edit Slide Modal
  const [showEditSlideModal, setShowEditSlideModal] = useState<boolean>(false);
  const [editTitle, setEditTitle] = useState<string>('');
  const [editSubtitle, setEditSubtitle] = useState<string>('');
  const [editBullets, setEditBullets] = useState<string>('');
  const [editFormula, setEditFormula] = useState<string>('');
  const [editTeacherNotes, setEditTeacherNotes] = useState<string>('');

  // AI Slide Generator & Data Ingestion Modal
  const [showAIModal, setShowAIModal] = useState<boolean>(false);
  const [inputTab, setInputTab] = useState<'textbook' | 'upload' | 'paste' | 'topic'>('textbook');

  // Tab 1: Textbook Selection
  const [selectedTextbookGrade, setSelectedTextbookGrade] = useState<number>(11);
  const [selectedTextbookCurriculum, setSelectedTextbookCurriculum] = useState<'ALL' | 'KNTT' | 'CTST' | 'Cánh Diều'>('ALL');
  const [selectedTextbookId, setSelectedTextbookId] = useState<string>(DIGITAL_TEXTBOOK_SOURCES[0].id);

  // Tab 2: Upload File
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [uploadedFileSize, setUploadedFileSize] = useState<string>('');
  const [uploadedContent, setUploadedContent] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Tab 3: Paste Content
  const [pastedTitle, setPastedTitle] = useState<string>('');
  const [pastedChapter, setPastedChapter] = useState<string>('');
  const [pastedGrade, setPastedGrade] = useState<number>(11);
  const [pastedText, setPastedText] = useState<string>('');

  // Tab 4: Topic Prompt
  const [topicPromptTitle, setTopicPromptTitle] = useState<string>('Phương trình tiếp tuyến của đồ thị hàm số');
  const [topicPromptGrade, setTopicPromptGrade] = useState<number>(11);
  const [topicPromptChapter, setTopicPromptChapter] = useState<string>('Chương 7: Đạo hàm');

  // Generation Settings
  const [slideCountOption, setSlideCountOption] = useState<6 | 8 | 10>(8);
  const [pedagogicalOrientation, setPedagogicalOrientation] = useState<
    'visual' | 'standard' | 'exam' | 'stem'
  >('visual');
  const [includeQuiz, setIncludeQuiz] = useState<boolean>(true);
  const [includeStepByStep, setIncludeStepByStep] = useState<boolean>(true);
  const [includeSpeakerNotes, setIncludeSpeakerNotes] = useState<boolean>(true);

  // Generation Animation state
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);
  const [aiStepMessage, setAiStepMessage] = useState<string>('');

  const currentSlide: SlideItem =
    selectedLecture.slides[currentSlideIndex] ||
    selectedLecture.slides[0] || {
      id: 1,
      title: 'Slide bài giảng',
      bulletPoints: ['Chưa có nội dung'],
    };

  // Reset quiz state when switching slides
  useEffect(() => {
    setSelectedQuizOption(null);
    setShowQuizExplanation(false);
  }, [currentSlideIndex, selectedLecture]);

  const handlePrevSlide = () => {
    setCurrentSlideIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlideIndex((prev) => Math.min(selectedLecture.slides.length - 1, prev + 1));
  };

  // Keyboard navigation for presentation mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showAIModal || showEditSlideModal) return;
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        handleNextSlide();
      } else if (e.key === 'ArrowLeft') {
        handlePrevSlide();
      } else if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlideIndex, isFullscreen, selectedLecture, showAIModal, showEditSlideModal]);

  // Handle Export PPTX
  const handleExportPptx = async () => {
    setIsExporting(true);
    try {
      await exportLectureToPptx(
        selectedLecture,
        activeTheme,
        'Thầy Nguyễn Minh Vũ',
        'THPT Bình Long - Đồng Nai'
      );
      setExportToast(
        `Đã xuất thành công file PowerPoint: ${selectedLecture.title}.pptx chuẩn Microsoft PowerPoint & Google Slides (Tích hợp hiệu ứng Morph chuyển động chi tiết 60fps mượt mà)!`
      );
      setTimeout(() => setExportToast(null), 5000);
    } catch (err) {
      console.error('Lỗi khi xuất file PPTX:', err);
      setExportToast('Có lỗi xảy ra khi tạo file PPTX. Vui lòng thử lại.');
      setTimeout(() => setExportToast(null), 3500);
    } finally {
      setIsExporting(false);
    }
  };

  // Handle File Upload Simulator
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setTimeout(() => {
      setUploadedFileName(file.name);
      setUploadedFileSize(`${(file.size / 1024 / 1024).toFixed(1)} MB`);
      setUploadedContent(
        `NỘI DUNG TÀI LIỆU TỪ TỆP [${file.name}]:\nBài giảng chuyên đề Toán học tích hợp công nghệ số. Giáo viên: Thầy Nguyễn Minh Vũ. Khái niệm cốt lõi, công thức toán học và các ví dụ rèn luyện tư duy thực tế.`
      );
      setIsUploading(false);
    }, 600);
  };

  // Quick Sample Document Ingestion
  const handleLoadSamplePasted = (type: 'daoham' | 'capso' | 'parabol' | 'khoangcach') => {
    if (type === 'daoham') {
      setPastedTitle('Đạo hàm và phương trình tiếp tuyến');
      setPastedGrade(11);
      setPastedChapter('Chương 7: Đạo hàm');
      setPastedText(
        `1. Khởi động: Chiếc xe đua chạy với phương trình s(t) = 5t^2. Vận tốc tức thời tại t=2s là v(2) = s'(2) = 20 m/s.\n2. Định nghĩa đạo hàm: f'(x0) = lim [f(x0+Δx) - f(x0)]/Δx khi Δx -> 0.\n3. Ý nghĩa hình học: f'(x0) là hệ số góc tiếp tuyến k = tan(alpha).\n4. Phương trình tiếp tuyến tại M0(x0; y0): y - y0 = f'(x0)(x - x0).\n5. Ví dụ mẫu: Tiếp tuyến của parabol y = x^2 tại x0 = 1 là y = 2x - 1.`
      );
    } else if (type === 'capso') {
      setPastedTitle('Cấp số cộng và cấp số nhân trong bài toán tài chính');
      setPastedGrade(11);
      setPastedChapter('Chương 2: Dãy số');
      setPastedText(
        `1. Khởi động: Bác An gửi tiết kiệm 100 triệu đồng lãi suất 6%/năm. Số tiền sau n năm tuân theo cấp số nhân.\n2. Cấp số cộng: u_n = u_1 + (n-1)d. Tổng S_n = n(u_1 + u_n)/2.\n3. Cấp số nhân: u_n = u_1 * q^(n-1). Tổng S_n = u_1*(1 - q^n)/(1 - q).\n4. Ứng dụng: Bài toán mua điện thoại trả góp và xếp chỗ ngồi nhà hát 25 hàng ghế.`
      );
    } else if (type === 'parabol') {
      setPastedTitle('Hàm số bậc hai và ứng dụng kiến trúc cổng vòm');
      setPastedGrade(10);
      setPastedChapter('Chương 3: Hàm số bậc hai');
      setPastedText(
        `1. Khởi động: Cổng vòm trường học và cầu treo Golden Gate có dạng parabol đối xứng.\n2. Định nghĩa: y = ax^2 + bx + c (a ≠ 0). Đỉnh I(-b/2a; -Δ/4a), trục đối xứng x = -b/2a.\n3. Bề lõm: a > 0 quay lên (cực tiểu), a < 0 quay xuống (cực đại).\n4. Ví dụ: Cổng cao 6m, rộng 8m. Tìm phương trình y = -3/8 x^2 + 6 và kiểm tra xe tải 4.5m đi qua an toàn.`
      );
    } else {
      setPastedTitle('Khoảng cách từ điểm đến mặt phẳng trong không gian Oxyz');
      setPastedGrade(12);
      setPastedChapter('Chương 2: Phương pháp tọa độ trong không gian');
      setPastedText(
        `1. Khởi động: Khoảng cách từ máy bay đến mặt đất hoặc vị trí giàn khoan ngoài khơi.\n2. Mặt phẳng (P): Ax + By + Cz + D = 0 với n = (A; B; C) khác vectơ 0.\n3. Công thức khoảng cách từ M0(x0; y0; z0): d(M0, (P)) = |Ax0 + By0 + Cz0 + D| / sqrt(A^2 + B^2 + C^2).\n4. Ví dụ: Tính khoảng cách từ gốc tọa độ O đến (P): 2x - 2y + z - 6 = 0 là d = |-6|/3 = 2.`
      );
    }
  };

  // Open Edit Slide Modal
  const handleOpenEditSlide = () => {
    setEditTitle(currentSlide.title);
    setEditSubtitle(currentSlide.subtitle || '');
    setEditBullets(currentSlide.bulletPoints.join('\n'));
    setEditFormula(currentSlide.formula || '');
    setEditTeacherNotes(currentSlide.teacherNotes || '');
    setShowEditSlideModal(true);
  };

  // Save Edit Slide
  const handleSaveEditSlide = () => {
    const updatedBullets = editBullets
      .split('\n')
      .map((b) => b.trim())
      .filter(Boolean);

    const updatedSlides = selectedLecture.slides.map((s, idx) => {
      if (idx === currentSlideIndex) {
        return {
          ...s,
          title: editTitle,
          subtitle: editSubtitle || undefined,
          bulletPoints: updatedBullets.length > 0 ? updatedBullets : s.bulletPoints,
          formula: editFormula.trim() || undefined,
          teacherNotes: editTeacherNotes.trim() || undefined,
        };
      }
      return s;
    });

    const updatedLecture = { ...selectedLecture, slides: updatedSlides };
    setSelectedLecture(updatedLecture);
    setLectures((prev) => prev.map((l) => (l.id === updatedLecture.id ? updatedLecture : l)));
    setShowEditSlideModal(false);
  };

  // Delete Current Slide
  const handleDeleteSlide = () => {
    if (selectedLecture.slides.length <= 2) {
      alert('Bài giảng cần có ít nhất 2 slide để đảm bảo cấu trúc trình chiếu.');
      return;
    }
    const updatedSlides = selectedLecture.slides.filter((_, idx) => idx !== currentSlideIndex);
    const updatedLecture = {
      ...selectedLecture,
      slides: updatedSlides,
      slideCount: updatedSlides.length,
    };
    setSelectedLecture(updatedLecture);
    setLectures((prev) => prev.map((l) => (l.id === updatedLecture.id ? updatedLecture : l)));
    setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1));
  };

  // Add New Blank Slide
  const handleAddNewSlide = () => {
    const newSlide: SlideItem = {
      id: Date.now(),
      slideType: 'concept',
      title: `Slide mới: Nội dung bài giảng`,
      subtitle: `Bổ sung trực quan môn Toán Lớp ${selectedLecture.grade}`,
      bulletPoints: [
        'Nội dung trọng tâm bổ sung do giáo viên thiết kế',
        'Giải thích chi tiết và phân tích mở rộng',
        'Rèn luyện tư duy phản biện cho học sinh',
      ],
      formula: 'f(x) = ...',
      teacherNotes: 'Gợi ý sư phạm: Đặt câu hỏi mở để học sinh thảo luận cặp đôi.',
    };

    const updatedSlides = [...selectedLecture.slides, newSlide];
    const updatedLecture = {
      ...selectedLecture,
      slides: updatedSlides,
      slideCount: updatedSlides.length,
    };
    setSelectedLecture(updatedLecture);
    setLectures((prev) => prev.map((l) => (l.id === updatedLecture.id ? updatedLecture : l)));
    setCurrentSlideIndex(updatedSlides.length - 1);
  };

  // Handler for inserting visualizer into current slide
  const handleInsertVisualizerToCurrentSlide = (title: string, formula: string, note: string) => {
    const updatedSlides = selectedLecture.slides.map((s, idx) => {
      if (idx === currentSlideIndex) {
        return {
          ...s,
          title: title || s.title,
          formula: formula || s.formula,
          formulaNote: note || s.formulaNote,
        };
      }
      return s;
    });
    const updatedLecture = { ...selectedLecture, slides: updatedSlides };
    setSelectedLecture(updatedLecture);
    setLectures((prev) => prev.map((l) => (l.id === updatedLecture.id ? updatedLecture : l)));
    setStudioTab('editor');
    setExportToast(`Đã chèn mô phỏng đồ thị trực quan vào Slide ${currentSlideIndex + 1}!`);
    setTimeout(() => setExportToast(null), 3500);
  };

  // Handler for inserting gamification quiz slide
  const handleInsertGameSlide = (gameTitle: string, question: string, options: string[], answer: string) => {
    const newGameSlide: SlideItem = {
      id: Date.now(),
      slideType: 'quiz_interactive',
      title: gameTitle,
      subtitle: 'Hoạt động tương tác trò chơi toán học sôi nổi',
      bulletPoints: [question],
      quizQuestion: question,
      quizOptions: options,
      quizCorrectAnswer: answer,
      quizExplanation: `Đáp án chính xác: ${answer}.`,
      teacherNotes: 'Cho cả lớp tham gia trả lời hoặc quay vòng chọn bạn may mắn.',
    };
    const updatedSlides = [...selectedLecture.slides, newGameSlide];
    const updatedLecture = { ...selectedLecture, slides: updatedSlides, slidesCount: updatedSlides.length };
    setSelectedLecture(updatedLecture);
    setLectures((prev) => prev.map((l) => (l.id === updatedLecture.id ? updatedLecture : l)));
    setCurrentSlideIndex(updatedSlides.length - 1);
    setStudioTab('editor');
    setExportToast(`Đã chèn Slide trò chơi tương tác mới vào bài giảng!`);
    setTimeout(() => setExportToast(null), 3500);
  };

  // Handler for completing pipeline wizard
  const handleCompleteWizard = (newLecture: Lecture) => {
    setLectures((prev) => [newLecture, ...prev]);
    setSelectedLecture(newLecture);
    setCurrentSlideIndex(0);
    setActiveTheme(newLecture.theme || 'blue');
    setStudioTab('editor');
    setExportToast(`Đã kiến tạo thành công bài giảng mới: "${newLecture.title}" với đầy đủ kịch bản sư phạm và hiệu ứng Morph 3D!`);
    setTimeout(() => setExportToast(null), 5000);
  };

  // MAIN AI GENERATOR FUNCTION
  const handleGenerateAISlides = () => {
    setIsGeneratingAI(true);
    setAiStepMessage('📖 Đang nạp và phân tích dữ liệu nguồn bài học...');

    setTimeout(() => {
      setAiStepMessage('🔍 Đang trích xuất định lý, khái niệm cốt lõi và công thức toán học...');
    }, 700);

    setTimeout(() => {
      setAiStepMessage('📐 Đang thiết kế sơ đồ trực quan hóa, mô hình đồ thị và tình huống thực tiễn...');
    }, 1400);

    setTimeout(() => {
      setAiStepMessage('🎯 Đang dựng chuỗi hoạt động sư phạm, ví dụ 3 bước và slide trắc nghiệm tương tác...');
    }, 2100);

    setTimeout(() => {
      // Determine lesson info based on active tab
      let title = '';
      let grade = 11;
      let chapter = '';
      let curriculum: 'KNTT' | 'CTST' | 'Cánh Diều' = 'KNTT';
      let sourceName = '';
      let sourceSnippet = '';
      let keyFormula = '';
      let hookDesc = '';
      let step1 = '';
      let step2 = '';
      let step3 = '';
      let quizQuestion = '';
      let quizOptions = ['A', 'B', 'C', 'D'];
      let quizCorrect = 'A';
      let quizExplanation = '';
      let stemTopic = '';
      let stemDesc = '';

      if (inputTab === 'textbook') {
        const tbItem =
          DIGITAL_TEXTBOOK_SOURCES.find((s) => s.id === selectedTextbookId) ||
          DIGITAL_TEXTBOOK_SOURCES[0];
        title = tbItem.lessonTitle;
        grade = tbItem.grade;
        chapter = tbItem.chapter;
        curriculum = tbItem.curriculum;
        sourceName = tbItem.sourceType;
        sourceSnippet = tbItem.contentSnippet.slice(0, 300) + '...';
        keyFormula = tbItem.keyFormulas[0] || 'f(x) = y';
        hookDesc = tbItem.sampleActivities[0]?.description || 'Khởi động bài học từ tình huống thực tiễn.';
        stemTopic = tbItem.realLifeApplication;
        stemDesc = `Ứng dụng trực tiếp vào: ${tbItem.realLifeApplication}`;

        if (tbItem.id.includes('CSN')) {
          step1 = 'Bước 1: Xác định số hạng đầu u_1 = 100 và công bội q = 1 + 6% = 1.06.';
          step2 = 'Bước 2: Lập công thức số hạng tổng quát u_n = 100 * (1.06)^(n-1).';
          step3 = 'Bước 3: Tính số tiền sau 3 năm: u_4 = 100 * (1.06)^3 = 119.1 triệu đồng.';
          quizQuestion = 'Cho cấp số cộng có u1 = 3 và công sai d = 4. Số hạng thứ 5 là:';
          quizOptions = ['u5 = 19', 'u5 = 23', 'u5 = 15', 'u5 = 20'];
          quizCorrect = 'A';
          quizExplanation = 'Ta có u5 = u1 + (5 - 1)d = 3 + 4*4 = 19.';
        } else if (tbItem.id.includes('DAOHAM')) {
          step1 = 'Bước 1: Tính đạo hàm của hàm số y = x^2 => y\' = 2x.';
          step2 = 'Bước 2: Tại điểm có hoành độ x0 = 1, tính hệ số góc k = y\'(1) = 2.';
          step3 = 'Bước 3: Lập phương trình tiếp tuyến: y - 1 = 2(x - 1) => y = 2x - 1.';
          quizQuestion = 'Hệ số góc của tiếp tuyến của đồ thị y = x^3 tại điểm x0 = 2 là:';
          quizOptions = ['k = 12', 'k = 6', 'k = 8', 'k = 4'];
          quizCorrect = 'A';
          quizExplanation = 'Ta có y\' = 3x^2. Tại x0 = 2: k = y\'(2) = 3*(2^2) = 12.';
        } else if (tbItem.id.includes('PARABOL')) {
          step1 = 'Bước 1: Xác định hệ số a = 1, b = -4, c = 3. Hoành độ đỉnh x_I = -b/(2a) = 2.';
          step2 = 'Bước 2: Tính tung độ đỉnh y_I = 2^2 - 4(2) + 3 = -1. Đỉnh I(2; -1).';
          step3 = 'Bước 3: Trục đối xứng x = 2. Vì a = 1 > 0 nên bề lõm quay lên trên.';
          quizQuestion = 'Tọa độ đỉnh của parabol y = x^2 - 2x + 5 là:';
          quizOptions = ['I(1; 4)', 'I(-1; 8)', 'I(1; 5)', 'I(2; 5)'];
          quizCorrect = 'A';
          quizExplanation = 'x_I = -(-2)/2 = 1. Tung độ y_I = 1 - 2 + 5 = 4. Vậy I(1; 4).';
        } else {
          step1 = 'Bước 1: Phân tích giả thiết và xác định vectơ chỉ phương hoặc pháp tuyến.';
          step2 = 'Bước 2: Thiết lập phương trình theo mẫu chuẩn của sách giáo khoa.';
          step3 = 'Bước 3: Kiểm tra tọa độ điểm đi qua và kết luận dạng phương trình.';
          quizQuestion = 'Vectơ pháp tuyến của đường thẳng 2x - 3y + 5 = 0 là:';
          quizOptions = ['n = (2; -3)', 'n = (3; 2)', 'n = (-3; 5)', 'n = (2; 5)'];
          quizCorrect = 'A';
          quizExplanation = 'Tọa độ vectơ pháp tuyến là các hệ số của x và y: n = (2; -3).';
        }
      } else if (inputTab === 'upload') {
        title = uploadedFileName.replace(/\.[^/.]+$/, '').replace(/_/g, ' ') || 'Chuyên đề toán học thực tế';
        grade = 11;
        chapter = 'Tài liệu số hóa từ tệp tải lên';
        curriculum = 'KNTT';
        sourceName = `Tệp tài liệu: ${uploadedFileName || 'tailieu_toan.docx'} (${uploadedFileSize || '2.4 MB'})`;
        sourceSnippet = uploadedContent || 'Tài liệu được tải lên từ máy tính của giáo viên.';
        keyFormula = 'f(x) = ax^2 + bx + c';
        hookDesc = 'Tình huống mở đầu trích xuất từ văn bản tài liệu đã nạp.';
        step1 = 'Bước 1: Đọc kỹ đề bài và lập danh sách các đại lượng đã cho trong tài liệu.';
        step2 = 'Bước 2: Áp dụng định lý cốt lõi và thực hiện các phép biến đổi toán học.';
        step3 = 'Bước 3: Kết luận nghiệm và so sánh với điều kiện thực tế của bài toán.';
        quizQuestion = 'Khẳng định nào sau đây là đúng theo quy chuẩn tài liệu đã nạp?';
        quizOptions = [
          'Phương án A: Công thức hoàn toàn chính xác',
          'Phương án B: Điều kiện xác định bị thiếu',
          'Phương án C: Nghiệm không thỏa mãn',
          'Phương án D: Cả A và B đều sai',
        ];
        quizCorrect = 'A';
        quizExplanation = 'Phương án A chuẩn xác theo lý thuyết đã được số hóa.';
        stemTopic = 'Mô hình hóa dữ liệu';
        stemDesc = 'Vận dụng kiến thức từ tài liệu vào bài toán thực tiễn.';
      } else if (inputTab === 'paste') {
        title = pastedTitle.trim() || 'Bài giảng chuyên sâu môn Toán';
        grade = pastedGrade;
        chapter = pastedChapter.trim() || `Toán Lớp ${pastedGrade}`;
        curriculum = 'KNTT';
        sourceName = 'Giáo án & Văn bản do Giáo viên nạp trực tiếp';
        sourceSnippet = pastedText.slice(0, 300) || 'Nội dung bài học được trích xuất từ giáo án của giáo viên.';
        keyFormula = 'y = f(x)';
        hookDesc = 'Tình huống thực tế được thiết kế để dẫn dắt học sinh vào bài học.';
        step1 = 'Bước 1: Xác định tập xác định và giả thiết của bài toán.';
        step2 = 'Bước 2: Áp dụng công thức giải tích / đại số tương ứng.';
        step3 = 'Bước 3: Đối chiếu điều kiện và rút ra kết luận sư phạm.';
        quizQuestion = `Câu hỏi kiểm tra nhanh kiến thức về "${title}":`;
        quizOptions = [
          'A. Đáp án đúng theo định nghĩa',
          'B. Sai điều kiện biên',
          'C. Sai thứ tự phép tính',
          'D. Không đủ dữ kiện',
        ];
        quizCorrect = 'A';
        quizExplanation = 'Lựa chọn A chính xác theo định nghĩa vừa học.';
        stemTopic = 'Ứng dụng đời sống';
        stemDesc = 'Kết nối kiến thức trong văn bản với bài toán công nghệ số.';
      } else {
        // topic prompt
        title = topicPromptTitle.trim() || 'Phương trình tiếp tuyến của đồ thị hàm số';
        grade = topicPromptGrade;
        chapter = topicPromptChapter.trim() || `Chương trình Toán Lớp ${topicPromptGrade}`;
        curriculum = 'KNTT';
        sourceName = 'Học liệu số chuẩn hóa MathHub AI Studio';
        sourceSnippet = `Chủ đề bài giảng: ${title}. Biên soạn bám sát khung năng lực GDPT 2018.`;
        keyFormula = "y - y_0 = f'(x_0)(x - x_0)";
        hookDesc = 'Vận dụng hiện tượng tự nhiên và chuyển động thực tế để tạo sự chú ý.';
        step1 = 'Bước 1: Tính đạo hàm của hàm số tại hoành độ tiếp điểm x0.';
        step2 = 'Bước 2: Xác định tung độ tiếp điểm y0 = f(x0) và hệ số góc k = f\'(x0).';
        step3 = 'Bước 3: Viết phương trình tiếp tuyến y - y0 = k(x - x0) và rút gọn.';
        quizQuestion = 'Hệ số góc của tiếp tuyến tại tiếp điểm M(x0; y0) là:';
        quizOptions = ["k = f'(x0)", 'k = f(x0)', "k = 1/f'(x0)", "k = -f'(x0)"];
        quizCorrect = 'A';
        quizExplanation = "Theo ý nghĩa hình học của đạo hàm, hệ số góc k = f'(x0).";
        stemTopic = 'Vật lý & Kỹ thuật';
        stemDesc = 'Tính toán quỹ đạo tên lửa và vận tốc tức thời của xe hơi.';
      }

      // Generate structured slides based on slideCountOption
      const generatedSlides: SlideItem[] = [];

      // SLIDE 1: Title
      generatedSlides.push({
        id: 1,
        slideType: 'title',
        title: title,
        subtitle: `${chapter} · Toán Lớp ${grade} (CTGDPT 2018)`,
        bulletPoints: [
          'Chương trình Giáo dục Phổ thông 2018 - Môn Toán THPT',
          'Giáo viên giảng dạy: Thầy Nguyễn Minh Vũ - THPT Bình Long, Đồng Nai',
          'Hệ sinh thái dạy học số MathHub Classroom thế hệ mới',
        ],
        teacherNotes: `Bắt đầu tiết học: Ổn định trật tự lớp, giới thiệu chủ đề "${title}". Yêu cầu học sinh chuẩn bị máy tính Casio và mở ứng dụng MathHub.`,
      });

      // SLIDE 2: Objectives
      generatedSlides.push({
        id: 2,
        slideType: 'objectives',
        title: 'Mục tiêu & Chuẩn đầu ra bài học',
        subtitle: 'Yêu cầu cần đạt theo Thông tư 32/2018/TT-BGDĐT',
        bulletPoints: [
          `Nắm vững khái niệm, định nghĩa và công thức cốt lõi của ${title.toLowerCase()}`,
          'Vận dụng thành thạo vào giải các bài toán đại số, hình học và giải tích liên quan',
          'Năng lực mô hình hóa toán học qua các tình huống thực tế và ứng dụng STEM',
          'Năng lực tự chủ, tự học và hợp tác nhóm trên nền tảng MathHub',
        ],
        teacherNotes: 'Nêu rõ 3 chuẩn đầu ra: Nắm vững định nghĩa, thành thạo công thức và biết cách mô hình hóa thực tế.',
      });

      // SLIDE 3: Warm-up / Hook
      generatedSlides.push({
        id: 3,
        slideType: 'concept',
        title: `Khởi động: Tình huống thực tiễn mở đầu`,
        subtitle: 'Từ hiện tượng đời sống đến mô hình toán học',
        bulletPoints: [
          hookDesc,
          'Sự khác biệt giữa quan sát trực quan và tính toán chính xác bằng công thức toán học.',
          'Đặt vấn đề: Làm thế nào để tìm ra công thức tổng quát giải quyết bài toán?',
        ],
        visualCallout: {
          type: 'graph',
          title: 'TRỰC QUAN HÓA BÀI HỌC',
          description: `Mô phỏng động trên MathHub Math Lab: Học sinh quan sát trực quan hiện tượng để khám phá quy luật toán học cốt lõi.`,
          badge: 'Mô hình khám phá trực quan',
        },
        teacherNotes: 'Chiếu tình huống khởi động, cho học sinh thảo luận cặp đôi 2 phút trước khi giáo viên dẫn dắt vào bài mới.',
      });

      // SLIDE 4: Core Concepts & Formula
      generatedSlides.push({
        id: 4,
        slideType: 'concept',
        title: `Khái niệm & Định nghĩa trọng tâm`,
        subtitle: `Kiến thức nền tảng trong CTGDPT 2018`,
        bulletPoints: [
          `Định nghĩa chuẩn mực: Thiết lập khái niệm toán học chính xác của ${title.toLowerCase()}.`,
          'Các điều kiện xác định và phạm vi áp dụng trong chương trình THPT.',
          'Ý nghĩa hình học và mối liên hệ với các kiến thức đã học ở bài trước.',
        ],
        formula: keyFormula,
        visualCallout: {
          type: 'formula_box',
          title: 'ĐIỀU KIỆN & LƯU Ý',
          description: 'Học sinh đặc biệt chú ý điều kiện xác định để tránh rơi vào các bẫy thường gặp trong các đề thi THPT Quốc gia.',
          badge: 'Quy tắc vàng',
        },
        teacherNotes: 'Nhấn mạnh công thức trọng tâm. Yêu cầu học sinh ghi chép đóng khung vào vở và đọc đồng thanh công thức.',
      });

      // SLIDE 5: Step-by-Step Exemplar (if enabled)
      if (includeStepByStep || slideCountOption >= 8) {
        generatedSlides.push({
          id: 5,
          slideType: 'step_by_step',
          title: `Ví dụ mẫu: Phương pháp giải chi tiết 3 bước`,
          subtitle: 'Quy trình tư duy chuẩn mực giúp học sinh không bị trừ điểm',
          bulletPoints: [`Giải chi tiết bài toán điển hình về ${title.toLowerCase()}`],
          steps: [
            {
              step: 1,
              title: 'Bước 1: Phân tích & Tìm dữ kiện',
              content: step1,
              formula: 'Giả thiết bài toán',
            },
            {
              step: 2,
              title: 'Bước 2: Thiết lập & Biến đổi',
              content: step2,
              formula: keyFormula,
            },
            {
              step: 3,
              title: 'Bước 3: Kết luận & Nhận xét',
              content: step3,
              formula: 'Nghiệm hoàn chỉnh',
            },
          ],
          teacherNotes: 'Hướng dẫn học sinh làm theo từng bước: Bước 1 tìm dữ kiện, Bước 2 tính toán và Bước 3 kiểm tra điều kiện.',
        });
      }

      // SLIDE 6: Interactive Quiz (if enabled)
      if (includeQuiz || slideCountOption >= 8) {
        generatedSlides.push({
          id: 6,
          slideType: 'quiz_interactive',
          title: 'Thử thách trắc nghiệm nhanh tại lớp',
          subtitle: 'Đánh giá mức độ thấu hiểu bài học của học sinh',
          bulletPoints: [
            'Học sinh chọn đáp án trực tiếp trên màn hình hoặc quét mã QR trên điện thoại.',
          ],
          quiz: {
            question: quizQuestion,
            options: quizOptions,
            correctAnswer: quizCorrect,
            explanation: quizExplanation,
          },
          teacherNotes: 'Bật đồng hồ đếm ngược 60 giây. Gọi 1 học sinh trả lời và giải thích lý do loại trừ các phương án gây nhiễu.',
        });
      }

      // SLIDE 7: Real-world / STEM Application (if 8 or 10 slides)
      if (slideCountOption >= 8) {
        generatedSlides.push({
          id: 7,
          slideType: 'concept',
          title: 'Ứng dụng thực tiễn & Mô hình hóa STEM',
          subtitle: 'Toán học kết nối thực tế cuộc sống',
          bulletPoints: [
            `Lĩnh vực ứng dụng: ${stemTopic}`,
            stemDesc,
            'Các ngành nghề hiện đại ứng dụng: Kỹ thuật phần mềm, Trí tuệ nhân tạo (AI), Tài chính số và Kiến trúc xây dựng.',
          ],
          visualCallout: {
            type: 'geometry',
            title: 'MÔ HÌNH TOÁN HỌC THỰC TẾ',
            description: 'Toán học không chỉ là lý thuyết trên giấy, mà là công cụ mạnh mẽ để giải quyết bài toán tối ưu và mô phỏng thế giới thực.',
            badge: 'Tích hợp STEM',
          },
          teacherNotes: 'Khơi gợi niềm đam mê toán học cho học sinh, mở rộng hướng nghiệp các ngành STEM.',
        });
      }

      // SLIDE 8: Advanced Extension (if 10 slides)
      if (slideCountOption === 10) {
        generatedSlides.push({
          id: 8,
          slideType: 'step_by_step',
          title: 'Mở rộng & Nâng cao: Phương pháp giải nhanh Casio',
          subtitle: 'Kỹ thuật tối ưu thời gian làm bài thi trắc nghiệm',
          bulletPoints: [
            'Bí quyết sử dụng chức năng TABLE / SOLVE trên máy tính cầm tay',
            'Các trường hợp bài toán có chứa tham số m',
          ],
          steps: [
            {
              step: 1,
              title: 'Thao tác 1: Nhập hàm số',
              content: 'Sử dụng chức năng Mode 8 (Table) để quét giá trị trong khoảng khảo sát.',
            },
            {
              step: 2,
              title: 'Thao tác 2: Chọn bước nhảy Step',
              content: 'Thiết lập Step = (End - Start) / 29 hoặc 44 để tìm cực trị hoặc điểm nghi vấn.',
            },
            {
              step: 3,
              title: 'Thao tác 3: Đối chiếu & Chọn đáp án',
              content: 'Quan sát cột f(x) tìm giá trị lớn nhất, nhỏ nhất hoặc dấu hiệu đổi dấu.',
            },
          ],
          teacherNotes: 'Nhắc học sinh không lạm dụng Casio mà phải nắm vững bản chất toán học trước tiên.',
        });

        generatedSlides.push({
          id: 9,
          slideType: 'quiz_interactive',
          title: 'Thử thách nâng cao (Mức độ Vận dụng cao)',
          subtitle: 'Chinh phục điểm 9 - 10 trong kỳ thi tốt nghiệp THPT',
          bulletPoints: ['Dành cho học sinh khá giỏi thử sức'],
          quiz: {
            question: `Cho bài toán nâng cao liên quan đến ${title.toLowerCase()} có chứa tham số m:`,
            options: ['A. m > 2', 'B. m < -1', 'C. -1 < m < 2', 'D. m = 0'],
            correctAnswer: 'A',
            explanation: 'Sử dụng phương pháp cô lập tham số m và khảo sát hàm số, ta tìm được điều kiện m > 2.',
          },
          teacherNotes: 'Dành 3 phút cho các bạn học sinh giỏi lên bảng trình bày cách cô lập tham số.',
        });
      }

      // FINAL SLIDE: Summary & Homework
      generatedSlides.push({
        id: generatedSlides.length + 1,
        slideType: 'summary',
        title: 'Tổng kết bài học & Nhiệm vụ về nhà',
        subtitle: 'Sơ đồ củng cố kiến thức và hệ thống bài tập số',
        bulletPoints: [
          `Ghi nhớ 3 quy tắc then chốt của ${title.toLowerCase()}`,
          'Hoàn thành bài tập trắc nghiệm số trên ứng dụng MathHub Classroom trước 22h00',
          'Tự thực hành mô phỏng trên Math Lab để củng cố trực quan đồ thị',
          'Chuẩn bị bài học tiếp theo theo kế hoạch bài dạy',
        ],
        formula: keyFormula,
        teacherNotes: 'Dặn dò cả lớp nộp bài tập đúng hạn để nhận điểm thưởng XP và duy trì streak chuỗi ngày học tập!',
      });

      const newLecture: Lecture = {
        id: `LEC-${Date.now()}`,
        title: title,
        grade: grade,
        chapter: chapter,
        curriculum: curriculum,
        type: 'PPTX',
        slideCount: generatedSlides.length,
        tags: ['AI Thiết kế', 'Trực quan', curriculum, `Toán ${grade}`],
        description: `Bài giảng tương tác chuyên sâu về ${title.toLowerCase()} thiết kế chuẩn sư phạm theo CTGDPT 2018.`,
        gradient: {
          blue: 'from-blue-600 to-indigo-600',
          purple: 'from-purple-600 to-fuchsia-600',
          emerald: 'from-emerald-600 to-teal-600',
          chalkboard: 'from-teal-700 to-emerald-900',
          slate: 'from-slate-700 to-slate-900',
        }[activeTheme],
        sourceDocument: {
          name: sourceName,
          type: inputTab === 'textbook' ? 'textbook' : inputTab === 'upload' ? 'upload' : 'pasted',
          snippet: sourceSnippet,
          uploadedAt: 'Hôm nay',
          curriculum: curriculum,
        },
        slides: generatedSlides,
      };

      setLectures((prev) => [newLecture, ...prev]);
      setSelectedLecture(newLecture);
      setCurrentSlideIndex(0);
      setIsGeneratingAI(false);
      setShowAIModal(false);
      setExportToast(
        `Đã tạo thành công bộ slide: "${newLecture.title}" (${newLecture.slideCount} slides). Thầy có thể xem hoặc bấm xuất .pptx ngay!`
      );
      setTimeout(() => setExportToast(null), 4000);
    }, 2800);
  };

  return (
    <div className="space-y-6">
      {/* AI PPTX MATH STUDIO TOP BAR */}
      <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-3 px-4 shadow-lg flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-slate-950 font-mono text-xs shadow-md">
            PPT
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-white tracking-tight">AI PPTX MATH STUDIO</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-400 text-slate-950 font-mono font-bold">2026</span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">
              Kiến tạo bài giảng Toán THPT đẳng cấp quốc tế · Chuẩn GDPT 2018 & Hiệu ứng Morph 3D 60fps
            </p>
          </div>
        </div>

        {/* Tab Pills */}
        <div className="flex flex-wrap items-center gap-1 text-xs">
          <button
            onClick={() => setStudioTab('dashboard')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              studioTab === 'dashboard'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Tổng quan</span>
          </button>

          <button
            onClick={() => setStudioTab('editor')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              studioTab === 'editor'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            <span>Biên tập Slide</span>
          </button>

          <button
            onClick={() => setStudioTab('pipeline')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              studioTab === 'pipeline'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tạo mới (6 bước)</span>
          </button>

          <button
            onClick={() => setStudioTab('visualizer')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              studioTab === 'visualizer'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Đồ thị động</span>
          </button>

          <button
            onClick={() => setStudioTab('gamification')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              studioTab === 'gamification'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Dices className="w-3.5 h-3.5" />
            <span>Trò chơi hóa</span>
          </button>

          <button
            onClick={() => setStudioTab('qa')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              studioTab === 'qa'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Kiểm định</span>
          </button>
        </div>
      </div>

      {/* SUB-VIEW 1: STUDIO DASHBOARD */}
      {studioTab === 'dashboard' && (
        <StudioDashboard
          lectures={lectures}
          onSelectLecture={(lec) => {
            setSelectedLecture(lec);
            setCurrentSlideIndex(0);
            setStudioTab('editor');
          }}
          onOpenCreateWizard={() => setStudioTab('pipeline')}
          onOpenVisualizer={() => setStudioTab('visualizer')}
          onOpenGamification={() => setStudioTab('gamification')}
          onOpenQACenter={() => setStudioTab('qa')}
          onExportPptx={(lec) => {
            setSelectedLecture(lec);
            handleExportPptx();
          }}
        />
      )}

      {/* SUB-VIEW 2: PIPELINE WIZARD */}
      {studioTab === 'pipeline' && (
        <PipelineWizard
          onComplete={handleCompleteWizard}
          onCancel={() => setStudioTab('dashboard')}
        />
      )}

      {/* SUB-VIEW 3: INTERACTIVE MATH VISUALIZER */}
      {studioTab === 'visualizer' && (
        <MathVisualizerStudio
          onInsertToLecture={handleInsertVisualizerToCurrentSlide}
        />
      )}

      {/* SUB-VIEW 4: GAMIFICATION STUDIO */}
      {studioTab === 'gamification' && (
        <GamificationStudio
          onInsertGameSlide={handleInsertGameSlide}
        />
      )}

      {/* SUB-VIEW 5: QA CENTER */}
      {studioTab === 'qa' && (
        <MathQACenter
          lecture={selectedLecture}
        />
      )}

      {/* SUB-VIEW 6: SLIDE EDITOR WORKSPACE */}
      {studioTab === 'editor' && (
        <>
          {/* Top Header */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                  Trình Chiếu & Kho Học Liệu Số Môn Toán
                </span>
              </div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 mt-1">
            Studio Thiết Kế Slide Bài Giảng PPTX Tương Tác
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Nạp tài liệu gốc (SGK, file Word, giáo án) để AI tự động thiết kế bộ slide trình chiếu trực quan sinh động và xuất file .pptx chuẩn Microsoft PowerPoint & Google Slides.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowAIModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-indigo-200" />
            <span>Nạp Dữ Liệu & AI Tạo Slide</span>
          </button>
          <button
            onClick={handleExportPptx}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            title="Xuất file .pptx chuẩn Microsoft PowerPoint tích hợp hiệu ứng Morph chuyển tiếp mượt mà cho tất cả chi tiết nhỏ"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Đang tạo .pptx (Morph)...' : 'Tải File PowerPoint (.pptx Morph)'}</span>
          </button>
        </div>
      </div>

      {/* Export Toast Notification */}
      {exportToast && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
            <span className="font-semibold">{exportToast}</span>
          </div>
          <span className="text-[11px] text-emerald-700 font-medium shrink-0 ml-2">
            ✨ Tích hợp hiệu ứng Morph 60fps cho mọi chi tiết
          </span>
        </div>
      )}

      {/* Main Grid: Interactive Slide Presenter & Lesson Bank */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Slide Viewer (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          {/* Header Bar of Slide Viewer */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                  Toán {selectedLecture.grade}
                </span>
                {selectedLecture.curriculum && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                    Bộ sách {selectedLecture.curriculum}
                  </span>
                )}
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs font-semibold text-slate-500">
                  Slide {currentSlideIndex + 1}/{selectedLecture.slides.length}
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-900 mt-1">{selectedLecture.title}</h2>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Theme Switcher Quick Menu */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                {[
                  { id: 'blue', label: 'Xanh', color: 'bg-blue-600' },
                  { id: 'purple', label: 'Tím', color: 'bg-purple-600' },
                  { id: 'emerald', label: 'Ngọc', color: 'bg-emerald-600' },
                  { id: 'chalkboard', label: 'Bảng', color: 'bg-teal-800' },
                  { id: 'slate', label: 'Ghi', color: 'bg-slate-700' },
                ].map((th) => (
                  <button
                    key={th.id}
                    onClick={() => setActiveTheme(th.id as PPTXTheme)}
                    title={`Đổi giao diện: ${th.label}`}
                    className={`w-5 h-5 rounded-full ${th.color} cursor-pointer transition-transform ${
                      activeTheme === th.id ? 'ring-2 ring-indigo-500 scale-110' : 'opacity-70 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={() => setIsFullscreen(true)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                title="Trình chiếu toàn màn hình trên lớp"
              >
                <Tv className="w-3.5 h-3.5 text-blue-600" />
                <span>Chiếu lớp</span>
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={handlePrevSlide}
                  disabled={currentSlideIndex === 0}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                  title="Slide trước"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextSlide}
                  disabled={currentSlideIndex === selectedLecture.slides.length - 1}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                  title="Slide tiếp"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Source Document Citation Badge if present */}
          {selectedLecture.sourceDocument && (
            <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between text-slate-700">
              <div className="flex items-center gap-2 truncate">
                <BookOpen className="w-4 h-4 text-indigo-600 shrink-0" />
                <span className="font-semibold text-slate-800 truncate">
                  Căn cứ tài liệu gốc: {selectedLecture.sourceDocument.name}
                </span>
              </div>
              <span className="text-[11px] font-mono text-indigo-700 shrink-0 bg-indigo-50 px-2 py-0.5 rounded">
                Đã số hóa CTGDPT 2018
              </span>
            </div>
          )}

          {/* INTERACTIVE PRESENTATION CANVAS (16:9 FRAME) */}
          <div
            className={`aspect-video w-full rounded-2xl text-white p-5 sm:p-7 flex flex-col justify-between shadow-lg relative overflow-hidden border border-slate-800 transition-all ${
              activeTheme === 'blue'
                ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950'
                : activeTheme === 'purple'
                ? 'bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950'
                : activeTheme === 'emerald'
                ? 'bg-gradient-to-br from-slate-950 via-teal-950 to-emerald-950'
                : activeTheme === 'chalkboard'
                ? 'bg-gradient-to-br from-slate-950 via-teal-950 to-slate-900'
                : 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800'
            }`}
          >
            {/* Top Slide Header */}
            <div className="flex justify-between items-center text-xs text-cyan-300">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                <span className="font-bold tracking-wider uppercase text-[11px]">
                  MATHHUB CLASSROOM · TOÁN LỚP {selectedLecture.grade}
                </span>
                {currentSlide.slideType && (
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-cyan-200">
                    {currentSlide.slideType === 'objectives'
                      ? '🎯 MỤC TIÊU'
                      : currentSlide.slideType === 'step_by_step'
                      ? '📌 VÍ DỤ 3 BƯỚC'
                      : currentSlide.slideType === 'quiz_interactive'
                      ? '⚡ TRẮC NGHIỆM'
                      : currentSlide.slideType === 'summary'
                      ? '📝 TỔNG KẾT'
                      : '📐 TRỰC QUAN'}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-cyan-200 border border-cyan-400/30 shadow-xs">
                  <Sparkles className="w-3 h-3 text-cyan-300 animate-pulse" />
                  <span>Hiệu ứng Morph: BẬT</span>
                </span>
                <span className="font-mono bg-white/10 px-2.5 py-0.5 rounded font-bold text-xs text-white">
                  Slide {currentSlideIndex + 1} / {selectedLecture.slides.length}
                </span>
              </div>
            </div>

            {/* Slide Body Container with Smooth Morph Layout */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlideIndex}
                initial={{ opacity: 0, y: 10, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.99 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className="my-auto py-2 space-y-3"
              >
              {/* Slide Title */}
              <div>
                <h3 className="text-lg sm:text-2xl font-bold tracking-tight text-white border-b border-white/15 pb-2">
                  <MathFormula math={currentSlide.title} />
                </h3>
                {currentSlide.subtitle && (
                  <p className="text-xs text-cyan-300/90 mt-1 italic font-medium">
                    {currentSlide.subtitle}
                  </p>
                )}
              </div>

              {/* RENDER ACCORDING TO SLIDE TYPE */}
              {currentSlide.slideType === 'objectives' ? (
                // Objectives 3 Cards
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-white/10 border border-white/15 space-y-2">
                    <span className="text-[11px] font-bold text-cyan-300 uppercase block tracking-wider">
                      🎯 Kiến thức trọng tâm
                    </span>
                    <ul className="text-xs text-slate-200 space-y-1 list-disc pl-4 leading-relaxed">
                      {currentSlide.bulletPoints.slice(0, 2).map((bp, i) => (
                        <li key={i}>
                          <MathFormula math={bp} />
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 rounded-xl bg-white/10 border border-white/15 space-y-2">
                    <span className="text-[11px] font-bold text-amber-300 uppercase block tracking-wider">
                      💡 Năng lực toán học
                    </span>
                    <ul className="text-xs text-slate-200 space-y-1 list-disc pl-4 leading-relaxed">
                      {(currentSlide.bulletPoints.length > 2
                        ? currentSlide.bulletPoints.slice(2, 4)
                        : ['Năng lực tư duy logic', 'Năng lực mô hình hóa thực tế']
                      ).map((bp, i) => (
                        <li key={i}>
                          <MathFormula math={bp} />
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 rounded-xl bg-white/10 border border-white/15 space-y-2">
                    <span className="text-[11px] font-bold text-emerald-300 uppercase block tracking-wider">
                      🌟 Phẩm chất & Thực tiễn
                    </span>
                    <ul className="text-xs text-slate-200 space-y-1 list-disc pl-4 leading-relaxed">
                      <li>Chăm chỉ, kiên trì tìm lời giải tối ưu</li>
                      <li>Hợp tác nhóm và thuyết trình tự tin</li>
                    </ul>
                  </div>
                </div>
              ) : currentSlide.slideType === 'step_by_step' || (currentSlide.steps && currentSlide.steps.length > 0) ? (
                // Step-by-Step 3 Cards Layout
                <div className="space-y-3 pt-1">
                  <div className="p-2.5 rounded-xl bg-white/10 border border-white/15 text-xs text-slate-200">
                    <span className="font-bold text-amber-300">📌 BÀI TOÁN MẪU: </span>
                    <MathFormula math={currentSlide.bulletPoints[0] || 'Áp dụng công thức giải bài toán cụ thể'} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {(currentSlide.steps || [
                      {
                        step: 1,
                        title: 'Bước 1: Phân tích',
                        content: currentSlide.bulletPoints[0] || 'Xác định giả thiết',
                      },
                      {
                        step: 2,
                        title: 'Bước 2: Tính toán',
                        content: currentSlide.bulletPoints[1] || 'Áp dụng công thức',
                      },
                      {
                        step: 3,
                        title: 'Bước 3: Kết luận',
                        content: currentSlide.bulletPoints[2] || 'Kiểm tra điều kiện',
                      },
                    ]).map((st) => (
                      <div
                        key={st.step}
                        className="p-3 rounded-xl bg-white/10 border border-cyan-500/30 space-y-1.5 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 font-bold text-xs flex items-center justify-center">
                              {st.step}
                            </span>
                            <span className="font-bold text-xs text-cyan-200 truncate">{st.title}</span>
                          </div>
                          <p className="text-[11px] text-slate-200 leading-relaxed">
                            <MathFormula math={st.content} />
                          </p>
                        </div>
                        {st.formula && (
                          <div className="p-1 rounded bg-black/40 text-center font-mono text-[11px] text-amber-300 border border-white/10 mt-1">
                            <MathFormula math={st.formula} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : currentSlide.slideType === 'quiz_interactive' || currentSlide.quiz ? (
                // Interactive Quiz Question with Clickable A, B, C, D
                <div className="space-y-3 pt-1">
                  <div className="p-3 rounded-xl bg-indigo-950/70 border border-indigo-400/40 space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300">
                      ⚡ THỬ THÁCH NHANH TẠI LỚP:
                    </span>
                    <p className="text-sm font-semibold text-white">
                      <MathFormula
                        math={currentSlide.quiz?.question || currentSlide.bulletPoints[0] || 'Chọn đáp án đúng:'}
                      />
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    {(currentSlide.quiz?.options || ['Phương án A', 'Phương án B', 'Phương án C', 'Phương án D']).map(
                      (opt, oIdx) => {
                        const optLabels = ['A', 'B', 'C', 'D'];
                        const label = optLabels[oIdx];
                        const isSelected = selectedQuizOption === label;
                        const isCorrect = label === currentSlide.quiz?.correctAnswer;

                        return (
                          <button
                            key={label}
                            onClick={() => {
                              setSelectedQuizOption(label);
                              setShowQuizExplanation(true);
                            }}
                            className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center gap-2 cursor-pointer ${
                              isSelected
                                ? isCorrect
                                  ? 'bg-emerald-900/60 border-emerald-400 text-white font-bold'
                                  : 'bg-rose-900/60 border-rose-400 text-white font-bold'
                                : 'bg-white/10 border-white/20 hover:bg-white/20 text-slate-200'
                            }`}
                          >
                            <span
                              className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 ${
                                isSelected
                                  ? isCorrect
                                    ? 'bg-emerald-400 text-emerald-950'
                                    : 'bg-rose-400 text-rose-950'
                                  : 'bg-white/20 text-white'
                              }`}
                            >
                              {label}
                            </span>
                            <span className="truncate">
                              <MathFormula math={opt} />
                            </span>
                          </button>
                        );
                      }
                    )}
                  </div>

                  {showQuizExplanation && currentSlide.quiz && (
                    <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-400/40 text-xs text-emerald-200 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-amber-300">ĐÁP ÁN: [{currentSlide.quiz.correctAnswer}] · </span>
                        <span>{currentSlide.quiz.explanation}</span>
                      </div>
                      <span className="text-[10px] text-emerald-300 underline cursor-pointer shrink-0 ml-2" onClick={() => setSelectedQuizOption(null)}>
                        Làm lại
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                // Standard Two-column Concept & Visual Diagram Callout
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-7 space-y-2">
                    <ul className="space-y-2 text-xs sm:text-sm text-slate-200 list-disc pl-5 leading-relaxed">
                      {currentSlide.bulletPoints.map((bp, i) => (
                        <li key={i}>
                          <MathFormula math={bp} />
                        </li>
                      ))}
                    </ul>

                    {currentSlide.formula && (
                      <div className="bg-blue-900/50 backdrop-blur-md rounded-xl p-3 text-center border border-cyan-400/40 mt-2 shadow-md">
                        <span className="text-[10px] uppercase font-bold text-cyan-300 block mb-0.5 tracking-wider">
                          Công thức cốt lõi:
                        </span>
                        <MathFormula
                          math={currentSlide.formula}
                          block
                          className="text-cyan-200 text-base sm:text-lg font-bold"
                        />
                      </div>
                    )}
                  </div>

                  {/* Right Column: Visual Diagram / Geometric Callout */}
                  <div className="md:col-span-5">
                    <div className="p-3.5 rounded-xl bg-white/10 border border-cyan-400/30 backdrop-blur-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-cyan-300 tracking-wider">
                          {currentSlide.visualCallout?.title || 'TRỰC QUAN HÓA TOÁN HỌC'}
                        </span>
                        <span className="text-[9px] bg-cyan-400/20 text-cyan-200 px-2 py-0.5 rounded font-bold">
                          {currentSlide.visualCallout?.badge || 'MathHub Visual'}
                        </span>
                      </div>

                      {/* Geometric SVG simulation */}
                      <div className="h-20 w-full bg-slate-950/60 rounded-lg border border-white/10 flex items-center justify-center p-2 relative overflow-hidden">
                        <div className="absolute inset-0 bg-radial from-cyan-500/10 to-transparent"></div>
                        <div className="text-center z-10">
                          <span className="text-xl">📐</span>
                          <span className="block text-[10px] text-cyan-200 font-mono mt-0.5">
                            {currentSlide.formula || 'y = f(x)'}
                          </span>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        {currentSlide.visualCallout?.description ||
                          'Minh họa hình học và mô hình toán học tương tác giúp học sinh tiếp thu trực quan sâu sắc.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              </motion.div>
            </AnimatePresence>

            {/* Slide Footer */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-white/10">
              <span className="truncate">GV: Thầy Nguyễn Minh Vũ · THPT Bình Long – Đồng Nai</span>
              <span className="shrink-0 font-medium text-cyan-300/80">CTGDPT 2018 · MathHub 2.0</span>
            </div>
          </div>

          {/* PRESENTER NOTES DRAWER FOR TEACHER */}
          {showPresenterNotes && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1.5 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="font-bold flex items-center gap-1.5 text-amber-950">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  <span>Ghi chú gợi ý sư phạm cho Giáo viên (Presenter Notes):</span>
                </span>
                <span className="text-[10px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded font-semibold">
                  Sẽ xuất kèm vào file .pptx
                </span>
              </div>
              <p className="text-amber-900 leading-relaxed text-[11px]">
                {currentSlide.teacherNotes ||
                  `Gợi ý giảng dạy: Đặt câu hỏi mở đầu về "${currentSlide.title}", gọi học sinh trả lời miệng 1 phút, sau đó hướng dẫn thảo luận nhóm đôi.`}
              </p>
            </div>
          )}

          {/* Slide Actions Tool Strip */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-100 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPresenterNotes(!showPresenterNotes)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                  showPresenterNotes
                    ? 'bg-amber-100 border-amber-300 text-amber-900'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>{showPresenterNotes ? 'Ẩn ghi chú GV' : 'Ghi chú sư phạm'}</span>
              </button>

              <button
                onClick={handleOpenEditSlide}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                <span>Sửa slide này</span>
              </button>

              <button
                onClick={handleAddNewSlide}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-600" />
                <span>Thêm slide</span>
              </button>

              {selectedLecture.slides.length > 2 && (
                <button
                  onClick={handleDeleteSlide}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 text-rose-600 cursor-pointer"
                  title="Xóa slide này"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="text-xs text-slate-500">
              Tổng số: <strong className="text-slate-800">{selectedLecture.slides.length} slides</strong>
            </div>
          </div>

          {/* Slide Timeline Thumbnail Strip */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1">
            {selectedLecture.slides.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`p-2 rounded-xl border text-xs text-left shrink-0 w-36 transition-all cursor-pointer ${
                  idx === currentSlideIndex
                    ? 'border-blue-600 bg-blue-50/80 font-bold text-blue-900 shadow-2xs ring-1 ring-blue-500/20'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-0.5">
                  <span>Slide {idx + 1}</span>
                  {s.slideType && (
                    <span className="text-[9px] uppercase px-1 rounded bg-slate-200 text-slate-600">
                      {s.slideType.slice(0, 4)}
                    </span>
                  )}
                </div>
                <span className="truncate block mt-0.5 text-slate-800">{s.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Lectures Bank (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Kho Slide Bài Giảng Số ({lectures.length})
              </h3>
              <p className="text-[11px] text-slate-500">Bấm để xem và xuất file PowerPoint</p>
            </div>
            <button
              onClick={() => setShowAIModal(true)}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-2.5 py-1.5 rounded-lg border border-blue-200 cursor-pointer"
            >
              + Tạo mới
            </button>
          </div>

          <div className="space-y-2.5 max-h-[560px] overflow-y-auto pr-1">
            {lectures.map((lec) => {
              const isSelected = lec.id === selectedLecture.id;
              return (
                <div
                  key={lec.id}
                  onClick={() => {
                    setSelectedLecture(lec);
                    setCurrentSlideIndex(0);
                  }}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/60 shadow-xs ring-1 ring-blue-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">
                        Toán {lec.grade}
                      </span>
                      {lec.curriculum && (
                        <span className="font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                          {lec.curriculum}
                        </span>
                      )}
                    </div>
                    <span className="font-mono font-semibold text-slate-500">{lec.slides.length} slides</span>
                  </div>

                  <h4 className="font-bold text-xs text-slate-900 leading-snug">{lec.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{lec.chapter}</p>

                  {lec.sourceDocument && (
                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[10px] text-slate-500">
                      <BookOpen className="w-3 h-3 text-indigo-500 shrink-0" />
                      <span className="truncate">{lec.sourceDocument.name}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  )}

  {/* FULLSCREEN CLASSROOM PRESENTATION OVERLAY */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col justify-between p-6 sm:p-10 select-none animate-in fade-in duration-200"
          onMouseMove={(e) => {
            if (showLaserPointer) {
              setLaserPos({ x: e.clientX, y: e.clientY });
            }
          }}
        >
          {/* Laser Pointer Dot */}
          {showLaserPointer && (
            <div
              className="fixed w-4 h-4 rounded-full bg-rose-500 shadow-[0_0_14px_#f43f5e] pointer-events-none transform -translate-x-1/2 -translate-y-1/2 z-50 animate-pulse"
              style={{ left: laserPos.x, top: laserPos.y }}
            />
          )}

          {/* Top Presentation Bar */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase font-bold tracking-wider text-cyan-300 bg-cyan-950 px-2.5 py-1 rounded">
                MATHHUB CLASSROOM · TOÁN {selectedLecture.grade}
              </span>
              <span className="font-bold text-sm text-white">{selectedLecture.title}</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowLaserPointer(!showLaserPointer)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  showLaserPointer ? 'bg-rose-600 text-white shadow-xs' : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
              >
                <span>🔴 Bút Laser Chỉ Điểm</span>
              </button>
              <button
                onClick={() => setIsFullscreen(false)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 cursor-pointer"
                title="Thoát toàn màn hình (Esc)"
              >
                <Minimize2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Center Presentation Stage with Morph Animation */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlideIndex}
              initial={{ opacity: 0, y: 16, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.985 }}
              transition={{ duration: 0.32, ease: 'easeOut' }}
              className="max-w-5xl mx-auto w-full my-auto space-y-6"
            >
              <div>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white border-b border-white/20 pb-4">
                  <MathFormula math={currentSlide.title} />
                </h2>
                {currentSlide.subtitle && (
                  <p className="text-sm text-cyan-300 mt-2 italic">{currentSlide.subtitle}</p>
                )}
              </div>

              <ul className="space-y-4 text-lg sm:text-xl text-slate-200 list-disc pl-8 leading-relaxed">
                {currentSlide.bulletPoints.map((bp, i) => (
                  <li key={i}>
                    <MathFormula math={bp} />
                  </li>
                ))}
              </ul>

              {currentSlide.formula && (
                <div className="bg-blue-900/40 rounded-2xl p-5 text-center border border-cyan-400/50 mt-6 shadow-xl">
                  <span className="text-xs uppercase font-bold text-cyan-300 block mb-2 tracking-wider">
                    CÔNG THỨC TRỌNG TÂM:
                  </span>
                  <MathFormula
                    math={currentSlide.formula}
                    block
                    className="text-cyan-200 text-2xl sm:text-3xl font-extrabold"
                  />
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Bottom Presentation Controller */}
          <div className="flex items-center justify-between border-t border-white/10 pt-4 text-xs text-slate-400">
            <div>
              Dùng phím <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">←</kbd> và{' '}
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">→</kbd> hoặc phím Cách để chuyển slide
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handlePrevSlide}
                disabled={currentSlideIndex === 0}
                className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-40 cursor-pointer"
              >
                ← Slide trước
              </button>
              <span className="font-mono text-sm font-bold text-white">
                {currentSlideIndex + 1} / {selectedLecture.slides.length}
              </span>
              <button
                onClick={handleNextSlide}
                disabled={currentSlideIndex === selectedLecture.slides.length - 1}
                className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-40 cursor-pointer"
              >
                Slide tiếp →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT SLIDE MODAL */}
      {showEditSlideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Chỉnh Sửa Nội Dung Slide {currentSlideIndex + 1}
                </h3>
              </div>
              <button onClick={() => setShowEditSlideModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tiêu đề slide:</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg bg-slate-50 font-semibold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phụ đề (nếu có):</label>
                <input
                  type="text"
                  value={editSubtitle}
                  onChange={(e) => setEditSubtitle(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg bg-slate-50"
                  placeholder="Ví dụ: Định lý và ý nghĩa hình học"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nội dung gạch đầu dòng (mỗi dòng 1 ý):</label>
                <textarea
                  rows={4}
                  value={editBullets}
                  onChange={(e) => setEditBullets(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg bg-slate-50 font-sans"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Công thức toán trọng tâm (dạng LaTeX):</label>
                <input
                  type="text"
                  value={editFormula}
                  onChange={(e) => setEditFormula(e.target.value)}
                  placeholder="Ví dụ: y - y_0 = f'(x_0)(x - x_0)"
                  className="w-full p-2.5 border border-slate-300 rounded-lg bg-slate-50 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Gợi ý sư phạm cho Giáo viên (Presenter Notes):</label>
                <textarea
                  rows={2}
                  value={editTeacherNotes}
                  onChange={(e) => setEditTeacherNotes(e.target.value)}
                  placeholder="Lời giảng gợi ý cho giáo viên khi chiếu slide này..."
                  className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditSlideModal(false)}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleSaveEditSlide}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-xs cursor-pointer"
                >
                  Lưu thay đổi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* COMPREHENSIVE AI SLIDE GENERATOR & DATA INGESTION MODAL */}
      {showAIModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 overflow-hidden">
            {/* Modal Top Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-xs">
                  ✨
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    AI Slide Studio · Nạp Dữ Liệu & Xuất File .pptx
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Chỉ cần nạp tài liệu gốc hoặc chủ đề, AI tự động thiết kế bộ slide trình chiếu trực quan sinh động
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAIModal(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs">
              {/* SECTION 1: DATA INGESTION METHOD SELECTION */}
              <div>
                <label className="block font-bold text-slate-900 mb-2 uppercase text-[11px] tracking-wider">
                  1. Chọn phương thức nạp dữ liệu gốc vào cho AI:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'textbook', icon: '📚', label: 'Thư viện SGK Số' },
                    { id: 'upload', icon: '📤', label: 'Tải tệp tài liệu' },
                    { id: 'paste', icon: '📝', label: 'Dán giáo án / văn bản' },
                    { id: 'topic', icon: '⚡', label: 'Gợi ý theo chủ đề' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setInputTab(tab.id as any)}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                        inputTab === tab.id
                          ? 'border-indigo-600 bg-indigo-50/80 font-bold text-indigo-950 shadow-2xs ring-1 ring-indigo-500/20'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-white'
                      }`}
                    >
                      <span className="text-lg block mb-1">{tab.icon}</span>
                      <span className="text-xs font-semibold block">{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* TAB 1: TEXTBOOK PICKER */}
              {inputTab === 'textbook' && (
                <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-indigo-950">
                      Chọn bài học từ Thư viện SGK Toán THPT (GDPT 2018):
                    </span>
                    <span className="text-[10px] text-indigo-700 font-semibold bg-indigo-100 px-2 py-0.5 rounded">
                      Đã số hóa sẵn lý thuyết & công thức
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Khối lớp:</label>
                      <select
                        value={selectedTextbookGrade}
                        onChange={(e) => setSelectedTextbookGrade(Number(e.target.value))}
                        className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                      >
                        <option value={10}>Lớp 10</option>
                        <option value={11}>Lớp 11</option>
                        <option value={12}>Lớp 12</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Bộ sách:</label>
                      <select
                        value={selectedTextbookCurriculum}
                        onChange={(e) => setSelectedTextbookCurriculum(e.target.value as any)}
                        className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                      >
                        <option value="ALL">Tất cả các bộ sách</option>
                        <option value="KNTT">Kết nối tri thức (KNTT)</option>
                        <option value="CTST">Chân trời sáng tạo (CTST)</option>
                        <option value="Cánh Diều">Cánh Diều</option>
                      </select>
                    </div>
                  </div>

                  {/* List of textbook lessons */}
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {DIGITAL_TEXTBOOK_SOURCES.filter(
                      (item) =>
                        item.grade === selectedTextbookGrade &&
                        (selectedTextbookCurriculum === 'ALL' || item.curriculum === selectedTextbookCurriculum)
                    ).map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedTextbookId(item.id)}
                        className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                          selectedTextbookId === item.id
                            ? 'border-indigo-600 bg-white font-bold text-indigo-950 shadow-2xs ring-1 ring-indigo-500/20'
                            : 'border-slate-200 bg-white/70 hover:bg-white text-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] text-slate-500 mb-0.5">
                          <span className="font-bold text-indigo-700">{item.curriculum}</span>
                          <span className="font-medium text-slate-400">{item.chapter}</span>
                        </div>
                        <span className="text-xs font-semibold">{item.lessonTitle}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: UPLOAD FILE */}
              {inputTab === 'upload' && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <span className="font-bold text-slate-900 block">
                    Tải lên tệp tài liệu gốc (.docx, .pdf, .txt, hình ảnh):
                  </span>

                  <label className="border-2 border-dashed border-indigo-300 hover:border-indigo-500 rounded-2xl p-6 text-center cursor-pointer block bg-white transition-colors">
                    <input
                      type="file"
                      accept=".txt,.docx,.pdf,image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Upload className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                    <span className="font-bold text-indigo-950 block text-xs">
                      Bấm để chọn file hoặc kéo thả tệp vào đây
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-1">
                      Hỗ trợ giáo án Word (.docx), PDF sách giáo khoa, tệp đề bài (.txt)
                    </span>
                  </label>

                  {isUploading && (
                    <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-700 text-xs text-center font-semibold animate-pulse">
                      Đang đọc và phân tích cấu trúc tài liệu...
                    </div>
                  )}

                  {uploadedFileName && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <div>
                          <span className="font-bold block">{uploadedFileName}</span>
                          <span className="text-[10px] text-emerald-700">{uploadedFileSize} · Sẵn sàng nạp vào AI</span>
                        </div>
                      </div>
                      <span className="text-[10px] bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded font-bold">
                        Đã sẵn sàng
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: PASTE TEXT */}
              {inputTab === 'paste' && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">Dán trực tiếp nội dung giáo án / bài dạy:</span>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-slate-500">Mẫu nhanh:</span>
                      <button
                        type="button"
                        onClick={() => handleLoadSamplePasted('daoham')}
                        className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-100 text-indigo-800 font-semibold hover:bg-indigo-200 cursor-pointer"
                      >
                        Đạo hàm
                      </button>
                      <button
                        type="button"
                        onClick={() => handleLoadSamplePasted('parabol')}
                        className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-100 text-indigo-800 font-semibold hover:bg-indigo-200 cursor-pointer"
                      >
                        Parabol
                      </button>
                      <button
                        type="button"
                        onClick={() => handleLoadSamplePasted('capso')}
                        className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-100 text-indigo-800 font-semibold hover:bg-indigo-200 cursor-pointer"
                      >
                        CSC & CSN
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2">
                      <input
                        type="text"
                        value={pastedTitle}
                        onChange={(e) => setPastedTitle(e.target.value)}
                        placeholder="Tên bài học (ví dụ: Khảo sát hàm số)"
                        className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <select
                        value={pastedGrade}
                        onChange={(e) => setPastedGrade(Number(e.target.value))}
                        className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                      >
                        <option value={10}>Lớp 10</option>
                        <option value={11}>Lớp 11</option>
                        <option value={12}>Lớp 12</option>
                      </select>
                    </div>
                  </div>

                  <textarea
                    rows={4}
                    value={pastedText}
                    onChange={(e) => setPastedText(e.target.value)}
                    placeholder="Dán nội dung lý thuyết, công thức, bài tập hoặc dàn ý bài giảng của thầy tại đây..."
                    className="w-full p-2.5 border border-slate-300 rounded-lg bg-white font-sans text-xs"
                  />
                </div>
              )}

              {/* TAB 4: TOPIC PROMPT */}
              {inputTab === 'topic' && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <span className="font-bold text-slate-900 block">Nhập nhanh chủ đề bài giảng:</span>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Tên bài học / Chủ đề:</label>
                    <input
                      type="text"
                      value={topicPromptTitle}
                      onChange={(e) => setTopicPromptTitle(e.target.value)}
                      placeholder="Ví dụ: Phương trình tiếp tuyến của đồ thị hàm số"
                      className="w-full p-2.5 border border-slate-300 rounded-lg bg-white font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Khối lớp:</label>
                      <select
                        value={topicPromptGrade}
                        onChange={(e) => setTopicPromptGrade(Number(e.target.value))}
                        className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                      >
                        <option value={10}>Lớp 10</option>
                        <option value={11}>Lớp 11</option>
                        <option value={12}>Lớp 12</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Chương học:</label>
                      <input
                        type="text"
                        value={topicPromptChapter}
                        onChange={(e) => setTopicPromptChapter(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 2: SLIDE STRUCTURE & PPTX THEME */}
              <div className="space-y-3">
                <label className="block font-bold text-slate-900 uppercase text-[11px] tracking-wider">
                  2. Cấu hình định dạng & Phong cách trình chiếu:
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Slide count */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Số lượng slide:</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { count: 6, label: '6 slide (Cơ bản)' },
                        { count: 8, label: '8 slide (Chuẩn)' },
                        { count: 10, label: '10 slide (Toàn diện)' },
                      ].map((sc) => (
                        <button
                          key={sc.count}
                          type="button"
                          onClick={() => setSlideCountOption(sc.count as any)}
                          className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                            slideCountOption === sc.count
                              ? 'border-indigo-600 bg-indigo-50 font-bold text-indigo-950'
                              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span className="text-xs font-semibold block">{sc.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Orientation */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Định hướng sư phạm:</label>
                    <select
                      value={pedagogicalOrientation}
                      onChange={(e) => setPedagogicalOrientation(e.target.value as any)}
                      className="w-full p-2.5 border border-slate-300 rounded-xl bg-white text-xs font-medium"
                    >
                      <option value="visual">🎨 Trực quan & Hình học sinh động (Đồ thị, sơ đồ tư duy)</option>
                      <option value="standard">📚 Chuẩn mực sư phạm GDPT 2018 (Mục tiêu 3 thành phần)</option>
                      <option value="stem">🚀 Ứng dụng thực tế & STEM đời sống</option>
                      <option value="exam">⚡ Luyện thi & Giải toán trắc nghiệm nhanh</option>
                    </select>
                  </div>
                </div>

                {/* Theme choice */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Giao diện màu sắc PowerPoint (.pptx):
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {[
                      { id: 'blue', label: '🌌 Vũ Trụ Xanh', color: 'bg-blue-600' },
                      { id: 'purple', label: '🔮 Tinh Vân Tím', color: 'bg-purple-600' },
                      { id: 'emerald', label: '📐 Hình Học Lục Bảo', color: 'bg-emerald-600' },
                      { id: 'chalkboard', label: '🏫 Bảng Đen Sư Phạm', color: 'bg-teal-800' },
                      { id: 'slate', label: '⚡ Tối Giản Hiện Đại', color: 'bg-slate-700' },
                    ].map((thm) => (
                      <button
                        key={thm.id}
                        type="button"
                        onClick={() => setActiveTheme(thm.id as PPTXTheme)}
                        className={`p-2 rounded-xl border text-left flex items-center gap-2 cursor-pointer transition-all ${
                          activeTheme === thm.id
                            ? 'border-indigo-600 bg-indigo-50/70 font-bold text-indigo-950 shadow-2xs'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span className={`w-3.5 h-3.5 rounded-full ${thm.color} shrink-0`}></span>
                        <span className="text-[11px] truncate">{thm.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Extra switches */}
                <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex flex-wrap gap-4 text-xs text-indigo-950 font-medium">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeSpeakerNotes}
                      onChange={(e) => setIncludeSpeakerNotes(e.target.checked)}
                      className="rounded text-indigo-600"
                    />
                    <span>Kèm Ghi chú sư phạm (Presenter Notes) cho giáo viên</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeStepByStep}
                      onChange={(e) => setIncludeStepByStep(e.target.checked)}
                      className="rounded text-indigo-600"
                    />
                    <span>Ví dụ mẫu giải chi tiết 3 bước</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeQuiz}
                      onChange={(e) => setIncludeQuiz(e.target.checked)}
                      className="rounded text-indigo-600"
                    />
                    <span>Thử thách trắc nghiệm tương tác</span>
                  </label>
                </div>
              </div>

              {/* AI Generating Animation State */}
              {isGeneratingAI && (
                <div className="p-4 rounded-2xl bg-indigo-950 text-white space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between text-xs text-cyan-300 font-bold">
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
                      <span>AI Đang Thiết Kế Bộ Slide...</span>
                    </span>
                    <span className="font-mono">16:9 Widescreen</span>
                  </div>
                  <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-cyan-400 to-indigo-400 h-full w-full animate-pulse"></div>
                  </div>
                  <p className="text-xs text-slate-300 italic pt-1">{aiStepMessage}</p>
                </div>
              )}
            </div>

            {/* Modal Bottom Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                🚀 Xuất file <strong>.pptx</strong> mở mượt mà trên PowerPoint & Google Slides
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowAIModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-xl cursor-pointer font-semibold text-xs"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={handleGenerateAISlides}
                  disabled={isGeneratingAI}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs flex items-center gap-2 disabled:opacity-50 cursor-pointer text-xs"
                >
                  <Sparkles className="w-4 h-4 text-indigo-200" />
                  <span>{isGeneratingAI ? 'Đang tạo bộ slide...' : 'Nạp Dữ Liệu & Tạo Slide Ngay'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LectureLibraryView;
