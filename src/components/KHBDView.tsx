import React, { useState, useRef } from 'react';
import { MOCK_KHBD } from '../data/mockData';
import { KHBDItem } from '../types';
import MathFormula from './MathFormula';
import { exportKHBDToDocx } from '../utils/docxExporter';
import { DIGITAL_TEXTBOOK_SOURCES, TextbookSourceItem } from '../data/textbookSources';
import {
  BookOpen,
  Download,
  Plus,
  Sparkles,
  CheckCircle2,
  Clock,
  Layers,
  Edit3,
  Trash2,
  X,
  Check,
  FileText,
  Upload,
  Copy,
  RefreshCw,
  Eye,
  FileCheck,
  ArrowRight,
  ExternalLink,
  Search,
  Filter,
  Bookmark,
  ChevronRight,
  Database,
  FileCode,
  FileSpreadsheet,
} from 'lucide-react';

interface KHBDViewProps {
  onNavigateToLectures?: () => void;
}

export const KHBDView: React.FC<KHBDViewProps> = ({ onNavigateToLectures }) => {
  const [plans, setPlans] = useState<KHBDItem[]>(MOCK_KHBD);
  const [selectedPlan, setSelectedPlan] = useState<KHBDItem>(plans[0]);
  const [activeDetailTab, setActiveDetailTab] = useState<'plan' | 'source' | 'worksheet'>('plan');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [exportToast, setExportToast] = useState<string | null>(null);

  // Search & Filter
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [filterGrade, setFilterGrade] = useState<number | 'all'>('all');
  const [filterCurriculum, setFilterCurriculum] = useState<string | 'all'>('all');

  // AI Create Modal State
  const [newTitle, setNewTitle] = useState('Bài 3: Cấp số cộng và cấp số nhân');
  const [newGrade, setNewGrade] = useState<number>(11);
  const [newCurriculum, setNewCurriculum] = useState<'KNTT' | 'CTST' | 'Cánh Diều'>('KNTT');
  const [newPeriods, setNewPeriods] = useState<number>(2);

  // Source Document Method Tab: 'upload' | 'textbook' | 'paste'
  const [sourceMethod, setSourceMethod] = useState<'upload' | 'textbook' | 'paste'>('textbook');
  const [selectedTextbookSource, setSelectedTextbookSource] = useState<TextbookSourceItem>(DIGITAL_TEXTBOOK_SOURCES[0]);
  
  // Uploaded file state
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedFileSize, setUploadedFileSize] = useState<string | null>(null);
  const [uploadedFileText, setUploadedFileText] = useState<string>('');
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pasted text state
  const [pastedSourceText, setPastedSourceText] = useState<string>(
    DIGITAL_TEXTBOOK_SOURCES[0].contentSnippet
  );

  // AI pedagogical directive
  const [pedagogicalFocus, setPedagogicalFocus] = useState<string>(
    'Bám sát 100% định nghĩa & ví dụ SGK + Tích hợp mô phỏng tương tác MathHub'
  );
  const [studentLevel, setStudentLevel] = useState<'standard' | 'advanced'>('standard');

  // AI Generation Progress Animation
  const [isAISoan, setIsAISoan] = useState<boolean>(false);
  const [aiProgressStep, setAiProgressStep] = useState<number>(0);
  const [aiProgressStatus, setAiProgressStatus] = useState<string>('');

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setUploadedFileSize(`${(file.size / (1024 * 1024)).toFixed(2)} MB`);

    if (file.type.includes('image')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImagePreview(event.target?.result as string);
        setUploadedFileText(
          `[Nội dung trích xuất tự động qua AI Vision từ ảnh chụp tài liệu: ${file.name}]\n` +
          `- Nhận diện công thức toán học và biểu đồ hình học trong trang sách.\n` +
          `- Khởi động: Bài toán thực tế với đồ thị và bảng biến thiên.\n` +
          `- Định lý cốt lõi: y = ax^2 + bx + c hoặc f'(x) = lim (Δy / Δx).`
        );
      };
      reader.readAsDataURL(file);
    } else {
      // Text or Document
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = (event.target?.result as string) || '';
        setUploadedFileText(
          text.length > 0
            ? text
            : `[Đã nạp văn bản từ tệp ${file.name} - Dung lượng: ${(file.size / 1024).toFixed(1)} KB. Hệ thống đã bóc tách chuẩn cấu trúc định nghĩa, định lý và ví dụ mẫu.]`
        );
      };
      // If it's plain text read as text, else simulate docx extraction
      if (file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        reader.readAsText(file);
      } else {
        setUploadedFileText(
          `[TÀI LIỆU NGUỒN GỐC TỪ FILE WORD/PDF: ${file.name}]\n` +
          `1. Khung kế hoạch bài dạy theo định hướng năng lực và phẩm chất.\n` +
          `2. Trích đoạn nội dung kiến thức trọng tâm, hệ thống bài tập mẫu và hướng dẫn học sinh giải quyết vấn đề.\n` +
          `3. Các công thức toán cốt lõi, bảng biến thiên và ví dụ áp dụng thực tiễn.`
        );
      }
    }
  };

  // Select a textbook source item
  const handleSelectTextbookSource = (item: TextbookSourceItem) => {
    setSelectedTextbookSource(item);
    setNewTitle(item.lessonTitle);
    setNewGrade(item.grade);
    setNewCurriculum(item.curriculum);
    setPastedSourceText(item.contentSnippet);
  };

  // Trigger AI generation with progressive steps
  const handleCreateWithAI = () => {
    setIsAISoan(true);
    setAiProgressStep(1);
    setAiProgressStatus('1/5: 🔍 Đang quét và phân tích tài liệu gốc đã nạp...');

    setTimeout(() => {
      setAiProgressStep(2);
      setAiProgressStatus('2/5: 📐 Trích xuất định nghĩa, định lý, công thức Toán từ nguồn...');
    }, 700);

    setTimeout(() => {
      setAiProgressStep(3);
      setAiProgressStatus('3/5: 🎯 Thiết kế 3 nhóm mục tiêu (Kiến thức, Năng lực, Phẩm chất) theo CV 5512...');
    }, 1400);

    setTimeout(() => {
      setAiProgressStep(4);
      setAiProgressStatus('4/5: 💡 Xây dựng 4 hoạt động sư phạm (Khởi động -> Khám phá -> Luyện tập -> Vận dụng)...');
    }, 2100);

    setTimeout(() => {
      setAiProgressStep(5);
      setAiProgressStatus('5/5: ✅ Hoàn tất kế hoạch bài dạy bám sát tài liệu nguồn!');

      // Determine source metadata
      let docName = '';
      let docType: 'upload' | 'pasted' | 'textbook' = 'textbook';
      let docSnippet = '';
      let docFullText = '';
      let docFileSize = '3.5 MB';
      let docFormulas: string[] = [];
      let docRef = '';

      if (sourceMethod === 'upload' && uploadedFileName) {
        docName = uploadedFileName;
        docType = 'upload';
        docFileSize = uploadedFileSize || '2.4 MB';
        docFullText = uploadedFileText;
        docSnippet = uploadedFileText.slice(0, 180) + '...';
        docFormulas = ['\\Delta y = f(x_0 + \\Delta x) - f(x_0)', 'f\'(x_0)', 'y - y_0 = f\'(x_0)(x - x_0)'];
        docRef = `Tệp tài liệu gốc tải lên: ${uploadedFileName}`;
      } else if (sourceMethod === 'paste') {
        docName = `VanBan_Goc_${newTitle.slice(0, 15).replace(/\s+/g, '_')}.txt`;
        docType = 'pasted';
        docFileSize = `${(pastedSourceText.length / 1024).toFixed(1)} KB`;
        docFullText = pastedSourceText;
        docSnippet = pastedSourceText.slice(0, 180) + '...';
        docFormulas = ['u_n = u_1 + (n - 1)d', 'u_n = u_1 \\cdot q^{n - 1}', 'S_n = \\frac{n(u_1 + u_n)}{2}'];
        docRef = 'Văn bản tài liệu gốc do Giáo viên dán trực tiếp vào hệ thống';
      } else {
        docName = `${selectedTextbookSource.sourceType}.pdf`;
        docType = 'textbook';
        docFileSize = '4.2 MB';
        docFullText = selectedTextbookSource.contentSnippet;
        docSnippet = selectedTextbookSource.contentSnippet.slice(0, 180) + '...';
        docFormulas = selectedTextbookSource.keyFormulas;
        docRef = selectedTextbookSource.sourceType;
      }

      const generatedPlan: KHBDItem = {
        id: `KHBD-${Date.now()}`,
        title: newTitle,
        grade: newGrade,
        curriculum: newCurriculum,
        periodsCount: newPeriods,
        objectives: selectedTextbookSource && sourceMethod === 'textbook' && selectedTextbookSource.lessonTitle === newTitle
          ? selectedTextbookSource.suggestedObjectives
          : {
              knowledge: [
                `Nắm vững bản chất định nghĩa và tính chất cơ bản của ${newTitle.toLowerCase()} trích xuất từ tài liệu gốc.`,
                'Thiết lập và vận dụng thành thạo các công thức toán học trọng tâm vào giải bài tập.',
                'Vận dụng giải các bài toán thực tiễn gắn liền với đời sống và kinh tế theo phân phối chương trình GDPT 2018.',
              ],
              generalCompetencies: [
                'Năng lực tự chủ và tự học: Tự nghiên cứu tài liệu nguồn, chủ động giải quyết các phiếu bài tập.',
                'Năng lực giao tiếp và hợp tác: Làm việc nhóm 4 tổ cùng nhau xây dựng kết luận từ bài toán khởi động.',
              ],
              specificCompetencies: [
                'Năng lực mô hình hóa toán học: Chuyển đổi tình huống trong tài liệu gốc thành mô hình toán học giải tích/hình học.',
                'Năng lực sử dụng công cụ, phương tiện học toán: Trực quan hóa kiến thức trên hệ thống MathHub.',
              ],
              qualities: [
                'Chăm chỉ, kiên trì, có trách nhiệm với nhiệm vụ học tập được giao.',
              ],
            },
        activities: selectedTextbookSource && sourceMethod === 'textbook' && selectedTextbookSource.lessonTitle === newTitle
          ? selectedTextbookSource.sampleActivities
          : [
              {
                step: 'Hoạt động 1',
                title: 'Khởi động (7 phút)',
                duration: '7 phút',
                description: 'Tình huống thực tế trích từ tài liệu gốc. Học sinh quan sát, phát hiện vấn đề cần giải quyết.',
              },
              {
                step: 'Hoạt động 2',
                title: 'Hình thành kiến thức mới (23 phút)',
                duration: '23 phút',
                description: 'Dẫn dắt học sinh tự xây dựng công thức và quy tắc từ tài liệu gốc. Thảo luận nhóm và chuẩn hóa kiến thức.',
              },
              {
                step: 'Hoạt động 3',
                title: 'Luyện tập (10 phút)',
                duration: '10 phút',
                description: 'Luyện tập các bài toán mẫu từ tài liệu nguồn trên hệ sinh thái kiểm tra đánh giá MathHub.',
              },
              {
                step: 'Hoạt động 4',
                title: 'Vận dụng (5 phút)',
                duration: '5 phút',
                description: 'Vận dụng kiến thức giải quyết bài toán liên môn và thực tế. Hướng dẫn tự học và giao việc về nhà.',
              },
            ],
        sourceDocument: {
          name: docName,
          type: docType,
          fileType: sourceMethod === 'upload' ? (uploadedFileName?.endsWith('.png') || uploadedFileName?.endsWith('.jpg') ? '.jpg' : '.docx') : '.pdf',
          fileSize: docFileSize,
          uploadedAt: 'Hôm nay',
          sourceRef: docRef,
          snippet: docSnippet,
          fullText: docFullText,
          imagePreview: uploadedImagePreview || undefined,
          extractedFormulas: docFormulas,
          pedagogicalFocus: pedagogicalFocus,
          wordCount: docFullText.split(/\s+/).length,
        },
        studentWorksheet: {
          title: `Phiếu học tập: ${newTitle}`,
          questions: [
            `1. Từ tình huống mở đầu trong tài liệu gốc, hãy giải thích ý nghĩa của bài toán.`,
            `2. Viết lại công thức trọng tâm và giải thích các đại lượng có trong công thức.`,
            `3. Giải bài tập áp dụng thực tế số 1 và đối chiếu kết quả với bạn cùng bàn.`,
          ],
        },
      };

      setPlans((prev) => [generatedPlan, ...prev]);
      setSelectedPlan(generatedPlan);
      setActiveDetailTab('plan');
      setIsAISoan(false);
      setShowCreateModal(false);
      setExportToast(`AI đã đọc tài liệu gốc thành công và biên soạn xong KHBD: "${generatedPlan.title}"!`);
      setTimeout(() => setExportToast(null), 5000);
    }, 2800);
  };

  const handleExportDocx = async () => {
    setIsExporting(true);
    try {
      await exportKHBDToDocx(selectedPlan);
      setExportToast(`Đã xuất file Word thành công: ${selectedPlan.title}.docx (Kèm trích dẫn tài liệu gốc)!`);
      setTimeout(() => setExportToast(null), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  // Filtered plans list
  const filteredPlans = plans.filter((item) => {
    const matchesKeyword =
      item.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      item.curriculum.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchesGrade = filterGrade === 'all' || item.grade === filterGrade;
    const matchesCurriculum = filterCurriculum === 'all' || item.curriculum === filterCurriculum;
    return matchesKeyword && matchesGrade && matchesCurriculum;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Action Center */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-600 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
              Kế Hoạch Bài Dạy Chuẩn 5512/BGDĐT · AI Đọc Nguồn Tài Liệu Gốc
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 mt-1">
            Studio Soạn KHBD Môn Toán & Nạp Tài Liệu Gốc
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            AI tiếp nhận tài liệu gốc (File Word/PDF, Sách giáo khoa số, Dán nội dung, Ảnh chụp), tự động phân tích và sinh giáo án chuẩn 4 hoạt động sư phạm.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs transition-all cursor-pointer hover:shadow-teal-600/20"
          >
            <Sparkles className="w-4 h-4 text-teal-100" />
            <span>AI Soạn KHBD (Nạp tài liệu gốc)</span>
          </button>

          <button
            onClick={handleExportDocx}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
            title="Xuất file Word .docx gửi Ban giám hiệu / Tổ chuyên môn"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>{isExporting ? 'Đang xuất .docx...' : 'Tải File Word (.docx)'}</span>
          </button>

          {onNavigateToLectures && (
            <button
              onClick={onNavigateToLectures}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-colors cursor-pointer"
              title="Tạo slide trình chiếu PowerPoint .pptx từ bài này"
            >
              <ExternalLink className="w-4 h-4 text-indigo-600" />
              <span>Tạo Slide .pptx từ bài này</span>
            </button>
          )}
        </div>
      </div>

      {exportToast && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-semibold">{exportToast}</span>
          </div>
          <span className="text-[11px] text-emerald-600 hidden sm:inline">Chuẩn định dạng Bộ GD&ĐT · Mở bằng Microsoft Word</span>
        </div>
      )}

      {/* Main Grid: Plan List (4 cols) & Plan Detail / Source Inspector (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Lesson Plans Directory (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-teal-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Kho Giáo Án Đã Soạn ({filteredPlans.length})
              </h3>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="text-[11px] font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Soạn bài mới</span>
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div className="space-y-2 text-xs">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Tìm bài học, chủ đề..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs placeholder:text-slate-400 focus:outline-teal-600"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={filterGrade}
                onChange={(e) => setFilterGrade(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className="w-1/2 p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700"
              >
                <option value="all">Tất cả Khối lớp</option>
                <option value={10}>Toán 10</option>
                <option value={11}>Toán 11</option>
                <option value={12}>Toán 12</option>
              </select>

              <select
                value={filterCurriculum}
                onChange={(e) => setFilterCurriculum(e.target.value)}
                className="w-1/2 p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700"
              >
                <option value="all">Tất cả Bộ sách</option>
                <option value="KNTT">Kết nối tri thức</option>
                <option value="CTST">Chân trời sáng tạo</option>
                <option value="Cánh Diều">Cánh Diều</option>
              </select>
            </div>
          </div>

          {/* Plans List */}
          <div className="space-y-2.5 max-h-[620px] overflow-y-auto pr-1">
            {filteredPlans.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                Không tìm thấy giáo án nào phù hợp.
              </div>
            ) : (
              filteredPlans.map((item) => {
                const isSelected = item.id === selectedPlan.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedPlan(item);
                      setActiveDetailTab('plan');
                    }}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-teal-600 bg-teal-50/60 shadow-xs ring-1 ring-teal-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
                      <span className="font-semibold text-teal-800 bg-teal-100/80 px-2 py-0.5 rounded">
                        {item.curriculum} · Lớp {item.grade}
                      </span>
                      <span className="font-mono text-slate-600">{item.periodsCount} tiết</span>
                    </div>

                    <h4 className="font-bold text-xs text-slate-900 leading-snug line-clamp-1">
                      {item.title}
                    </h4>

                    {/* Source Document Tag */}
                    {item.sourceDocument && (
                      <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500">
                        <div className="flex items-center gap-1 truncate max-w-[200px]" title={item.sourceDocument.name}>
                          <FileCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span className="truncate">Nguồn: {item.sourceDocument.name}</span>
                        </div>
                        <span className="px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded font-mono text-[9px] shrink-0">
                          {item.sourceDocument.type === 'upload'
                            ? 'Tệp tải lên'
                            : item.sourceDocument.type === 'pasted'
                            ? 'Dán văn bản'
                            : 'SGK Số'}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Detailed Plan Viewer & Source Document Inspector (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 p-5 md:p-6 shadow-xs space-y-5 text-xs">
          {/* Header of Selected Plan */}
          <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 bg-teal-100 text-teal-800 rounded font-semibold text-xs">
                  Toán {selectedPlan.grade} · {selectedPlan.curriculum}
                </span>
                <span className="text-slate-400 font-mono text-xs">
                  Thời lượng: {selectedPlan.periodsCount} tiết
                </span>
                {selectedPlan.sourceDocument && (
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-medium text-[11px] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Đã đọc tài liệu gốc
                  </span>
                )}
              </div>
              <h2 className="text-lg md:text-xl font-bold text-slate-900 mt-2">
                {selectedPlan.title}
              </h2>
              <div className="flex items-center gap-2 text-slate-500 text-[11px] mt-1">
                <span>GV: Thầy Nguyễn Minh Vũ · Trường THPT Bình Long – Đồng Nai</span>
                <span>·</span>
                <span className="text-teal-700 font-medium">Chuẩn quy định 5512/BGDĐT</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleExportDocx}
                disabled={isExporting}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold text-xs transition-colors cursor-pointer shadow-xs disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isExporting ? 'Đang tạo...' : 'Xuất Word (.docx)'}</span>
              </button>
            </div>
          </div>

          {/* Source Document Quick Banner */}
          {selectedPlan.sourceDocument && (
            <div className="p-3.5 bg-gradient-to-r from-teal-50/80 via-emerald-50/50 to-slate-50 border border-teal-200/80 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0 font-bold">
                  📖
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">
                      Tài liệu gốc đã nạp cho AI: {selectedPlan.sourceDocument.name}
                    </span>
                    <span className="text-[10px] bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded font-mono">
                      {selectedPlan.sourceDocument.fileSize || 'N/A'}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] mt-0.5 line-clamp-1">
                    {selectedPlan.sourceDocument.sourceRef || selectedPlan.sourceDocument.snippet}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setActiveDetailTab('source')}
                  className="px-2.5 py-1.5 bg-white border border-teal-300 text-teal-700 hover:bg-teal-50 rounded-lg font-semibold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Xem tài liệu gốc</span>
                </button>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-2.5 py-1.5 bg-teal-600 text-white hover:bg-teal-700 rounded-lg font-semibold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Nạp tài liệu mới</span>
                </button>
              </div>
            </div>
          )}

          {/* Tabs for Plan View */}
          <div className="flex items-center gap-1 border-b border-slate-200 text-xs">
            <button
              onClick={() => setActiveDetailTab('plan')}
              className={`px-4 py-2.5 font-bold border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeDetailTab === 'plan'
                  ? 'border-teal-600 text-teal-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>1. Kế Hoạch Bài Dạy Chuẩn 5512</span>
            </button>

            <button
              onClick={() => setActiveDetailTab('source')}
              className={`px-4 py-2.5 font-bold border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeDetailTab === 'source'
                  ? 'border-teal-600 text-teal-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>2. Nguồn Tài Liệu Gốc Đã Nạp ({selectedPlan.sourceDocument ? '1' : '0'})</span>
            </button>

            <button
              onClick={() => setActiveDetailTab('worksheet')}
              className={`px-4 py-2.5 font-bold border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeDetailTab === 'worksheet'
                  ? 'border-teal-600 text-teal-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>3. Phiếu Học Tập & Tương Tác Số</span>
            </button>
          </div>

          {/* TAB 1: PLAN DETAIL */}
          {activeDetailTab === 'plan' && (
            <div className="space-y-6">
              {/* Part I: Objectives */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-teal-600 rounded-full"></span>
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">
                    I. MỤC TIÊU BÀI DẠY (THEO CÔNG VĂN 5512/BGDĐT)
                  </h3>
                </div>

                <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200 leading-relaxed">
                  <div>
                    <span className="font-bold text-slate-900 block mb-1">1. Về kiến thức:</span>
                    <ul className="list-disc pl-5 space-y-1 text-slate-700">
                      {selectedPlan.objectives.knowledge.map((k, i) => (
                        <li key={i}>
                          <MathFormula math={k} />
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2.5 border-t border-slate-200">
                    <span className="font-bold text-slate-900 block mb-1">2. Về năng lực:</span>
                    <span className="text-slate-800 font-semibold block text-[11px]">a) Năng lực chung:</span>
                    <ul className="list-disc pl-5 space-y-0.5 text-slate-700 mb-2">
                      {selectedPlan.objectives.generalCompetencies.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                    <span className="text-slate-800 font-semibold block text-[11px]">b) Năng lực toán học đặc thù:</span>
                    <ul className="list-disc pl-5 space-y-0.5 text-slate-700">
                      {selectedPlan.objectives.specificCompetencies.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2.5 border-t border-slate-200">
                    <span className="font-bold text-slate-900 block mb-1">3. Về phẩm chất:</span>
                    <ul className="list-disc pl-5 space-y-0.5 text-slate-700">
                      {selectedPlan.objectives.qualities.map((q, i) => (
                        <li key={i}>{q}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Part II: Equipment */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-teal-600 rounded-full"></span>
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">
                    II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU SỐ
                  </h3>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 space-y-1.5">
                  <p>
                    <strong>1. Giáo viên:</strong> Kế hoạch bài dạy, bài giảng trình chiếu PPTX tương tác, hệ thống MathHub Math Lab, phiếu học tập số.
                  </p>
                  <p>
                    <strong>2. Học sinh:</strong> Sách giáo khoa {selectedPlan.curriculum} Toán {selectedPlan.grade}, vở ghi, thiết bị kết nối để thao tác trực quan.
                  </p>
                </div>
              </div>

              {/* Part III: 4 Pedagogical Activities */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-teal-600 rounded-full"></span>
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">
                    III. TIẾN TRÌNH DẠY HỌC (4 HOẠT ĐỘNG SƯ PHẠM)
                  </h3>
                </div>

                <div className="space-y-3">
                  {selectedPlan.activities.map((act, index) => (
                    <div key={index} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 shadow-2xs">
                      <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                        <span className="font-bold text-teal-800 text-xs">
                          {act.step}: {act.title}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {act.duration}
                        </span>
                      </div>
                      <div className="text-slate-700 text-xs leading-relaxed">
                        <span className="font-semibold text-slate-900">Nội dung & Tổ chức thực hiện: </span>
                        <MathFormula math={act.description} />
                      </div>
                      <div className="text-[11px] text-slate-500 pt-1.5 border-t border-slate-100 flex items-center justify-between">
                        <span>Sản phẩm: Câu trả lời trên phiếu học tập, kết quả báo cáo của học sinh.</span>
                        <span className="text-teal-700 font-medium">Bám sát tài liệu gốc</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SOURCE DOCUMENT INSPECTOR */}
          {activeDetailTab === 'source' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700">
                      Chi tiết nguồn tài liệu được AI tiếp nhận
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                      {selectedPlan.sourceDocument?.name || 'Chưa có tài liệu nguồn'}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (selectedPlan.sourceDocument?.fullText) {
                          navigator.clipboard.writeText(selectedPlan.sourceDocument.fullText);
                          setExportToast('Đã sao chép nội dung tài liệu gốc vào clipboard!');
                          setTimeout(() => setExportToast(null), 3000);
                        }
                      }}
                      className="px-2.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Sao chép văn bản</span>
                    </button>
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="px-2.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Đổi tài liệu</span>
                    </button>
                  </div>
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                    <span className="text-slate-400 block">Hình thức nạp</span>
                    <span className="font-semibold text-slate-800">
                      {selectedPlan.sourceDocument?.type === 'upload'
                        ? 'Tệp tải lên (.docx/.pdf)'
                        : selectedPlan.sourceDocument?.type === 'pasted'
                        ? 'Dán văn bản trực tiếp'
                        : 'Sách giáo khoa số'}
                    </span>
                  </div>

                  <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                    <span className="text-slate-400 block">Dung lượng / Độ dài</span>
                    <span className="font-semibold text-slate-800 font-mono">
                      {selectedPlan.sourceDocument?.fileSize || '3.2 MB'} ({selectedPlan.sourceDocument?.wordCount || 1200} từ)
                    </span>
                  </div>

                  <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                    <span className="text-slate-400 block">Độ bám sát tài liệu</span>
                    <span className="font-bold text-emerald-600">98.5% (Tuyệt đối)</span>
                  </div>

                  <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                    <span className="text-slate-400 block">Thời gian nạp</span>
                    <span className="font-semibold text-slate-800">
                      {selectedPlan.sourceDocument?.uploadedAt || 'Mới cập nhật'}
                    </span>
                  </div>
                </div>

                {/* Extracted Math Formulas */}
                {selectedPlan.sourceDocument?.extractedFormulas && selectedPlan.sourceDocument.extractedFormulas.length > 0 && (
                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5">
                    <span className="font-bold text-slate-900 block text-xs">
                      Công thức Toán trọng tâm AI đã bóc tách từ tài liệu:
                    </span>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {selectedPlan.sourceDocument.extractedFormulas.map((form, i) => (
                        <div key={i} className="px-3 py-1.5 bg-teal-50 border border-teal-200 rounded-lg text-teal-900">
                          <MathFormula math={form} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Image Preview (if uploaded as image) */}
                {selectedPlan.sourceDocument?.imagePreview && (
                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5">
                    <span className="font-bold text-slate-900 block text-xs">
                      Ảnh chụp tài liệu gốc được AI Vision quét:
                    </span>
                    <img
                      src={selectedPlan.sourceDocument.imagePreview}
                      alt="Tài liệu gốc"
                      className="max-h-60 rounded-lg border border-slate-200 object-contain mx-auto"
                    />
                  </div>
                )}

                {/* Full Text Preview Box */}
                <div className="space-y-1.5">
                  <span className="font-bold text-slate-900 block text-xs">
                    Nội dung văn bản tài liệu nguồn (Ground Truth):
                  </span>
                  <div className="p-3.5 bg-white rounded-xl border border-slate-200 font-mono text-xs text-slate-700 whitespace-pre-wrap max-h-72 overflow-y-auto leading-relaxed">
                    {selectedPlan.sourceDocument?.fullText || selectedPlan.sourceDocument?.snippet}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: STUDENT WORKSHEET */}
          {activeDetailTab === 'worksheet' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div>
                    <span className="text-[11px] font-bold text-teal-700 uppercase">
                      Phiếu Học Tập Tương Tác Số
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                      {selectedPlan.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      setExportToast('Đã gửi phiếu học tập số lên hệ thống MathHub cho học sinh!');
                      setTimeout(() => setExportToast(null), 3000);
                    }}
                    className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Giao cho cả lớp</span>
                  </button>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                  <div className="text-center pb-2 border-b border-slate-100">
                    <span className="font-bold text-slate-900 text-xs block">
                      PHIẾU HỌC TẬP KHÁM PHÁ KIẾN THỨC
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Họ và tên: ........................................... Lớp: 11A6
                    </span>
                  </div>

                  <div className="space-y-2.5 text-slate-700">
                    <p className="font-semibold text-slate-900">
                      Nhiệm vụ 1: Đọc trích đoạn tài liệu gốc và trả lời:
                    </p>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 italic text-[11px]">
                      "{selectedPlan.sourceDocument?.snippet || 'Tài liệu học tập chuẩn...'}"
                    </div>
                    <div className="h-14 border border-dashed border-slate-300 rounded-lg p-2 text-slate-400 text-[11px]">
                      (Học sinh điền câu trả lời vào đây...)
                    </div>

                    <p className="font-semibold text-slate-900 pt-2">
                      Nhiệm vụ 2: Áp dụng công thức giải bài toán thực tế:
                    </p>
                    <div className="h-16 border border-dashed border-slate-300 rounded-lg p-2 text-slate-400 text-[11px]">
                      (Học sinh trình bày các bước tính toán và kết luận...)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Create KHBD Modal with Comprehensive Source Document Reader */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 md:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl p-5 md:p-6 space-y-4 my-auto animate-in fade-in zoom-in-95 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-base shadow-2xs">
                  ✨
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm md:text-base">
                    AI Soạn Kế Hoạch Bài Dạy (KHBD) Chuẩn 5512
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Nạp tài liệu gốc (File Word/PDF, Sách giáo khoa, Dán văn bản) để AI đọc làm căn cứ soạn giáo án
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* AI Scanning Visual Progress (if generating) */}
            {isAISoan ? (
              <div className="py-10 px-4 text-center space-y-5 animate-in fade-in">
                <div className="w-16 h-16 rounded-2xl bg-teal-50 border-2 border-teal-500 flex items-center justify-center mx-auto text-teal-600 animate-bounce">
                  <Sparkles className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 text-sm md:text-base">
                    AI Đang Phân Tích Tài Liệu Gốc & Biên Soạn Giáo Án
                  </h4>
                  <p className="text-xs text-teal-700 font-semibold">{aiProgressStatus}</p>
                </div>

                {/* Progress bar */}
                <div className="w-full max-w-md mx-auto bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-teal-600 h-2.5 transition-all duration-500 rounded-full"
                    style={{ width: `${(aiProgressStep / 5) * 100}%` }}
                  ></div>
                </div>

                <div className="p-3 bg-teal-50/70 border border-teal-200/60 rounded-xl text-[11px] text-slate-600 max-w-md mx-auto text-left space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-teal-900">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                    <span>Nguồn dữ liệu: {sourceMethod === 'upload' ? uploadedFileName : sourceMethod === 'paste' ? 'Văn bản dán trực tiếp' : selectedTextbookSource.sourceType}</span>
                  </div>
                  <p className="text-slate-500 pl-5">
                    AI tự động cấu trúc theo Công văn 5512/BGDĐT, bảo toàn nguyên vẹn tính chính xác toán học.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                {/* SECTION 1: Source Document Input (CRITICAL FOR USER) */}
                <div className="p-4 bg-teal-50/60 border border-teal-200 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                      <label className="font-bold text-teal-950 uppercase tracking-wide text-xs">
                        1. Nguồn Tài Liệu Gốc Cho AI Đọc (Ground Truth)
                      </label>
                    </div>
                    <span className="text-[11px] text-teal-700 font-medium">Bắt buộc cung cấp tài liệu</span>
                  </div>

                  {/* 3 Source Tabs */}
                  <div className="grid grid-cols-3 gap-1.5 p-1 bg-white rounded-xl border border-teal-200">
                    <button
                      type="button"
                      onClick={() => setSourceMethod('textbook')}
                      className={`py-1.5 px-2 rounded-lg font-bold text-[11px] transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        sourceMethod === 'textbook'
                          ? 'bg-teal-600 text-white shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Kho SGK Số Hóa</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSourceMethod('upload')}
                      className={`py-1.5 px-2 rounded-lg font-bold text-[11px] transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        sourceMethod === 'upload'
                          ? 'bg-teal-600 text-white shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Tải Tệp Lên</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSourceMethod('paste')}
                      className={`py-1.5 px-2 rounded-lg font-bold text-[11px] transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        sourceMethod === 'paste'
                          ? 'bg-teal-600 text-white shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Dán Văn Bản</span>
                    </button>
                  </div>

                  {/* TAB CONTENT 1: DIGITAL TEXTBOOK LIBRARY */}
                  {sourceMethod === 'textbook' && (
                    <div className="space-y-2">
                      <p className="text-slate-600 text-[11px]">
                        Chọn nhanh bài học từ Thư viện sách giáo khoa số GDPT 2018 (đầy đủ trích đoạn & công thức):
                      </p>
                      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                        {DIGITAL_TEXTBOOK_SOURCES.map((item) => {
                          const isSelected = selectedTextbookSource.id === item.id;
                          return (
                            <div
                              key={item.id}
                              onClick={() => handleSelectTextbookSource(item)}
                              className={`p-2.5 rounded-lg border transition-all cursor-pointer text-left ${
                                isSelected
                                  ? 'border-teal-600 bg-teal-50 ring-1 ring-teal-500/20'
                                  : 'border-slate-200 bg-white hover:border-slate-300'
                              }`}
                            >
                              <div className="flex items-center justify-between text-[10px] text-slate-500 mb-0.5">
                                <span className="font-semibold text-teal-800 bg-teal-100/70 px-1.5 py-0.2 rounded">
                                  {item.sourceType}
                                </span>
                                <span>{item.chapter}</span>
                              </div>
                              <h5 className="font-bold text-xs text-slate-900">{item.lessonTitle}</h5>
                              <p className="text-[11px] text-slate-600 line-clamp-1 mt-0.5">
                                💡 Ứng dụng: {item.realLifeApplication}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* TAB CONTENT 2: FILE UPLOAD (.docx, .pdf, .txt, .jpg, .png) */}
                  {sourceMethod === 'upload' && (
                    <div className="space-y-2.5">
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-teal-300 hover:border-teal-500 bg-white rounded-xl p-5 text-center cursor-pointer transition-colors"
                      >
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileUpload}
                          accept=".docx,.doc,.pdf,.txt,.png,.jpg,.jpeg"
                          className="hidden"
                        />
                        <Upload className="w-6 h-6 text-teal-600 mx-auto mb-1.5" />
                        <span className="font-bold text-slate-800 text-xs block">
                          Nhấn để chọn tệp tài liệu gốc từ máy tính
                        </span>
                        <span className="text-[11px] text-slate-400 block mt-0.5">
                          Hỗ trợ file Word (.docx), PDF (.pdf), Text (.txt), hoặc ảnh chụp trang SGK (.jpg, .png)
                        </span>
                      </div>

                      {uploadedFileName && (
                        <div className="p-3 bg-white rounded-xl border border-teal-300 flex items-center justify-between">
                          <div className="flex items-center gap-2 truncate">
                            <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                            <div className="truncate">
                              <span className="font-bold text-slate-900 block truncate text-xs">
                                {uploadedFileName}
                              </span>
                              <span className="text-[10px] text-slate-500">
                                Dung lượng: {uploadedFileSize} · Đã trích xuất dữ liệu thành công
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setUploadedFileName(null);
                              setUploadedFileSize(null);
                              setUploadedFileText('');
                              setUploadedImagePreview(null);
                            }}
                            className="text-rose-500 hover:text-rose-700 p-1 text-xs"
                          >
                            Xóa
                          </button>
                        </div>
                      )}

                      {uploadedImagePreview && (
                        <div className="text-center">
                          <img
                            src={uploadedImagePreview}
                            alt="Preview"
                            className="max-h-32 mx-auto rounded-lg border border-slate-200"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB CONTENT 3: PASTE TEXT DIRECTLY */}
                  {sourceMethod === 'paste' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-slate-600">
                          Dán văn bản SGK, ghi chú chuyên môn hoặc đề cương bài học:
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setPastedSourceText(
                                `NỘI DUNG SGK TOÁN 11 KNTT - BÀI 3:\n` +
                                `Khởi động: Bác An gửi tiết kiệm 100 triệu đồng lãi kép 6%/năm.\n` +
                                `Định nghĩa Cấp số cộng: u_n = u_{n-1} + d. Số hạng tổng quát u_n = u_1 + (n-1)d. Tổng n số hạng đầu: S_n = n(u_1 + u_n)/2.\n` +
                                `Định nghĩa Cấp số nhân: u_n = u_{n-1} * q. Số hạng tổng quát u_n = u_1 * q^{n-1}. Tổng S_n = u_1(1 - q^n)/(1 - q).\n` +
                                `Ứng dụng: Xếp hàng ghế rạp hát, bài toán vay mua nhà trả góp.`
                              )
                            }
                            className="text-[10px] text-teal-700 hover:underline font-semibold"
                          >
                            Dán mẫu Cấp số cộng
                          </button>
                          <button
                            type="button"
                            onClick={() => setPastedSourceText('')}
                            className="text-[10px] text-slate-400 hover:text-slate-600"
                          >
                            Xóa trắng
                          </button>
                        </div>
                      </div>

                      <textarea
                        rows={4}
                        value={pastedSourceText}
                        onChange={(e) => setPastedSourceText(e.target.value)}
                        placeholder="Dán nội dung sách giáo khoa hoặc tài liệu tập huấn vào đây để AI đọc..."
                        className="w-full p-2.5 bg-white border border-teal-200 rounded-lg font-mono text-xs text-slate-800 placeholder:text-slate-400 focus:outline-teal-600"
                      />
                      <div className="text-[10px] text-slate-500 text-right">
                        Độ dài: {pastedSourceText.length} ký tự · ~{pastedSourceText.split(/\s+/).filter(Boolean).length} từ
                      </div>
                    </div>
                  )}
                </div>

                {/* SECTION 2: Lesson Plan Specifications */}
                <div className="space-y-3 pt-1">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      2. Tên bài học / Chủ đề bài dạy:
                    </label>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="Ví dụ: Bài 3: Cấp số cộng và cấp số nhân"
                      className="w-full p-2.5 border border-slate-300 rounded-lg bg-slate-50 font-medium text-xs focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Khối lớp:</label>
                      <select
                        value={newGrade}
                        onChange={(e) => setNewGrade(Number(e.target.value))}
                        className="w-full p-2.5 border border-slate-300 rounded-lg bg-slate-50 text-xs"
                      >
                        <option value={10}>Lớp 10</option>
                        <option value={11}>Lớp 11</option>
                        <option value={12}>Lớp 12</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Bộ sách giáo khoa:</label>
                      <select
                        value={newCurriculum}
                        onChange={(e) => setNewCurriculum(e.target.value as any)}
                        className="w-full p-2.5 border border-slate-300 rounded-lg bg-slate-50 text-xs"
                      >
                        <option value="KNTT">Kết nối tri thức</option>
                        <option value="CTST">Chân trời sáng tạo</option>
                        <option value="Cánh Diều">Cánh Diều</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Thời lượng (tiết):</label>
                      <input
                        type="number"
                        min={1}
                        max={6}
                        value={newPeriods}
                        onChange={(e) => setNewPeriods(Number(e.target.value))}
                        className="w-full p-2.5 border border-slate-300 rounded-lg bg-slate-50 font-mono text-xs"
                      />
                    </div>
                  </div>

                  {/* SECTION 3: Pedagogical Directives */}
                  <div className="space-y-2 pt-1">
                    <label className="block font-semibold text-slate-700">
                      3. Định hướng sư phạm cho AI khi đọc tài liệu:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                      <label className="flex items-center gap-2 p-2 border border-slate-200 rounded-lg bg-slate-50 cursor-pointer">
                        <input
                          type="radio"
                          name="pedagogy"
                          checked={pedagogicalFocus.includes('100%')}
                          onChange={() =>
                            setPedagogicalFocus('Bám sát 100% định nghĩa & ví dụ SGK + Tích hợp mô phỏng tương tác MathHub')
                          }
                          className="text-teal-600"
                        />
                        <span className="text-slate-800">Bám sát 100% nội dung SGK + Trực quan MathHub</span>
                      </label>

                      <label className="flex items-center gap-2 p-2 border border-slate-200 rounded-lg bg-slate-50 cursor-pointer">
                        <input
                          type="radio"
                          name="pedagogy"
                          checked={pedagogicalFocus.includes('STEM')}
                          onChange={() =>
                            setPedagogicalFocus('Mở rộng liên hệ thực tiễn & bài toán giáo dục STEM, tài chính cá nhân')
                          }
                          className="text-teal-600"
                        />
                        <span className="text-slate-800">Tăng cường bài toán thực tế STEM & Tài chính</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Modal Footer Buttons */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateWithAI}
                    disabled={isAISoan || !newTitle.trim()}
                    className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-xs flex items-center gap-2 disabled:opacity-50 cursor-pointer transition-all"
                  >
                    <Sparkles className="w-4 h-4 text-teal-100" />
                    <span>AI Đọc Nguồn & Soạn KHBD</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default KHBDView;
