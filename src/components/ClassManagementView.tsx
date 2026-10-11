import React, { useState } from 'react';
import { MOCK_CLASSES, MOCK_STUDENTS } from '../data/mockData';
import { ClassInfo, Student } from '../types';
import {
  Users,
  Search,
  Plus,
  QrCode,
  Download,
  Upload,
  ChevronRight,
  UserCheck,
  Award,
  Flame,
  X,
  Check,
  Trash2,
  ArrowRightLeft,
  UserMinus,
  FileSpreadsheet,
  FileText,
  AlertTriangle,
  RefreshCw,
  History,
  UserPlus,
  Filter,
} from 'lucide-react';

interface TransferRecord {
  id: string;
  studentName: string;
  studentCode: string;
  fromClass: string;
  toClassOrSchool: string;
  type: 'transfer_class' | 'transfer_school';
  date: string;
  reason: string;
}

interface ClassManagementViewProps {
  onSelectStudent: (student: Student) => void;
}

export const ClassManagementView: React.FC<ClassManagementViewProps> = ({ onSelectStudent }) => {
  // State for classes and students
  const [classesList, setClassesList] = useState<ClassInfo[]>(MOCK_CLASSES);
  const [selectedClassId, setSelectedClassId] = useState<string>('11A6');
  const [studentsList, setStudentsList] = useState<Student[]>(MOCK_STUDENTS);
  const [transferHistory, setTransferHistory] = useState<TransferRecord[]>([
    {
      id: 'TR-01',
      studentName: 'Trịnh Bảo Lâm',
      studentCode: 'HS2024-1190',
      fromClass: '11A6',
      toClassOrSchool: 'THPT Chuyên Lương Thế Vinh - Đồng Nai',
      type: 'transfer_school',
      date: '02/10/2026',
      reason: 'Trúng tuyển lớp chuyên Toán',
    },
    {
      id: 'TR-02',
      studentName: 'Phạm Minh Tú',
      studentCode: 'HS2024-1191',
      fromClass: '11A6',
      toClassOrSchool: 'Lớp 11A1',
      type: 'transfer_class',
      date: '28/09/2026',
      reason: 'Chuyển theo định hướng phân ban Tự nhiên',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewTab, setViewTab] = useState<'roster' | 'history'>('roster');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [showAddClassModal, setShowAddClassModal] = useState<boolean>(false);
  const [showDeleteClassModal, setShowDeleteClassModal] = useState<boolean>(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState<boolean>(false);
  const [showBulkImportModal, setShowBulkImportModal] = useState<boolean>(false);
  const [showTransferClassModal, setShowTransferClassModal] = useState<boolean>(false);
  const [showRemoveStudentModal, setShowRemoveStudentModal] = useState<boolean>(false);
  const [showQrModal, setShowQrModal] = useState<boolean>(false);

  // Selected student for single actions
  const [targetStudent, setTargetStudent] = useState<Student | null>(null);

  // New Class Form State
  const [newClassName, setNewClassName] = useState<string>('');
  const [newClassGrade, setNewClassGrade] = useState<number>(11);
  const [newClassTeacher, setNewClassTeacher] = useState<string>('Thầy Nguyễn Minh Vũ');
  const [newClassCode, setNewClassCode] = useState<string>('');

  // Single New Student Form State
  const [newStudentName, setNewStudentName] = useState<string>('');
  const [newStudentCode, setNewStudentCode] = useState<string>('');
  const [newParentName, setNewParentName] = useState<string>('');
  const [newParentPhone, setNewParentPhone] = useState<string>('');

  // Bulk Import State
  const [importTab, setImportTab] = useState<'upload' | 'paste'>('upload');
  const [pastedRosterText, setPastedRosterText] = useState<string>('');
  const [importedStudentsPreview, setImportedStudentsPreview] = useState<
    Array<{ name: string; code: string; parentName: string; parentPhone: string }>
  >([]);
  const [importFileName, setImportFileName] = useState<string>('');

  // Transfer Student State
  const [targetNewClassId, setTargetNewClassId] = useState<string>('');
  const [transferReason, setTransferReason] = useState<string>('Theo nguyện vọng phụ huynh');

  // Remove/Drop Student State
  const [removeReasonType, setRemoveReasonType] = useState<
    'transfer_school' | 'relocation' | 'drop_out' | 'duplicate'
  >('transfer_school');
  const [removeNewSchool, setRemoveNewSchool] = useState<string>('');
  const [removeNotes, setRemoveNotes] = useState<string>('');
  const [sortBy, setSortBy] = useState<'stt' | 'name' | 'score'>('stt');

  const selectedClass =
    classesList.find((c) => c.id === selectedClassId) || classesList[0] || MOCK_CLASSES[0];

  const filteredStudents = [...studentsList]
    .filter(
      (s) =>
        s.classId === selectedClassId &&
        (s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.studentCode.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === 'name') {
        const nameA = a.name.trim().split(' ').slice(-1)[0] || a.name;
        const nameB = b.name.trim().split(' ').slice(-1)[0] || b.name;
        return nameA.localeCompare(nameB, 'vi');
      }
      if (sortBy === 'score') {
        return b.avgScore - a.avgScore;
      }
      return 0; // Default order
    });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleExportClassRoster = () => {
    if (filteredStudents.length === 0) {
      alert('Không có học sinh nào trong lớp để xuất!');
      return;
    }
    const headers = 'STT,Mã học sinh,Họ và tên,Lớp,Điểm TB,Xếp loại,Cấp độ,Điểm XP,Phụ huynh,Số điện thoại phụ huynh\n';
    const rows = filteredStudents
      .map(
        (s, idx) =>
          `${idx + 1},${s.studentCode},"${s.name}",${selectedClass.name},${s.avgScore},${s.status},Lv.${s.level},${s.xp},"${s.parentName}",${s.parentPhone}`
      )
      .join('\n');
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + encodeURIComponent(headers + rows);
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', `DanhSach_Lop_${selectedClass.name}_Kem_STT.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Đã xuất danh sách lớp ${selectedClass.name} (kèm STT học sinh) thành công!`);
  };

  // 1. ADD NEW CLASS
  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;

    const classId = newClassName.trim().toUpperCase();
    if (classesList.some((c) => c.id === classId)) {
      alert(`Lớp ${classId} đã tồn tại trong danh sách!`);
      return;
    }

    const newClass: ClassInfo = {
      id: classId,
      name: classId,
      grade: newClassGrade,
      homeroomTeacher: newClassTeacher || 'Thầy Nguyễn Minh Vũ',
      totalStudents: 0,
      groupsCount: 4,
      weakCount: 0,
      attentionCount: 0,
      attendanceRate: 100,
      gradeDistribution: { gioi: 0, kha: 0, trungBinh: 0, yeu: 0 },
      classCode: newClassCode.trim() || `MATH${classId}`,
    };

    setClassesList((prev) => [...prev, newClass]);
    setSelectedClassId(classId);
    setShowAddClassModal(false);
    setNewClassName('');
    setNewClassCode('');
    showToast(`Đã thêm thành công lớp mới: Lớp ${classId}!`);
  };

  // 2. DELETE CLASS
  const handleDeleteClass = () => {
    if (classesList.length <= 1) {
      alert('Không thể xóa lớp duy nhất còn lại trong hệ thống.');
      return;
    }

    const classStudentsCount = studentsList.filter((s) => s.classId === selectedClassId).length;
    // Remove students of this class
    setStudentsList((prev) => prev.filter((s) => s.classId !== selectedClassId));
    // Remove class from list
    const remainingClasses = classesList.filter((c) => c.id !== selectedClassId);
    setClassesList(remainingClasses);
    setSelectedClassId(remainingClasses[0].id);
    setShowDeleteClassModal(false);

    showToast(
      `Đã xóa lớp ${selectedClass.name} ${
        classStudentsCount > 0 ? `và ${classStudentsCount} học sinh thuộc lớp` : ''
      } thành công!`
    );
  };

  // 3. ADD SINGLE STUDENT
  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;

    const newStudent: Student = {
      id: `HS-${Date.now()}`,
      name: newStudentName.trim(),
      studentCode: newStudentCode.trim() || `HS2024-${Math.floor(1000 + Math.random() * 9000)}`,
      classId: selectedClassId,
      avatar: '👨‍🎓',
      level: 10,
      xp: 1000,
      streakDays: 1,
      coins: 50,
      attendanceRate: 100,
      avgScore: 8.0,
      status: 'Khá',
      phone: '0912 999 888',
      parentName: newParentName.trim() || 'Phụ huynh',
      parentPhone: newParentPhone.trim() || '0903 000 111',
      strongSkills: ['Hình học cơ bản'],
      weakSkills: [],
      badges: ['Tân binh'],
      homeworkCompleted: 1,
      recentScores: [
        { title: 'Khảo sát đầu năm', scoreTN: 8.0, scoreTL: 8.0, total: 8.0, date: '10/09/2026' },
      ],
      notes: 'Học sinh mới thêm vào lớp.',
    };

    setStudentsList((prev) => [newStudent, ...prev]);
    // update class student count
    setClassesList((prev) =>
      prev.map((c) => (c.id === selectedClassId ? { ...c, totalStudents: c.totalStudents + 1 } : c))
    );

    setShowAddStudentModal(false);
    setNewStudentName('');
    setNewStudentCode('');
    setNewParentName('');
    setNewParentPhone('');
    showToast(`Đã thêm học sinh ${newStudent.name} vào lớp ${selectedClass.name}!`);
  };

  // 4. BULK IMPORT FILE / SPREADSHEET
  const handleParsePastedRoster = (text: string) => {
    const lines = text
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);
    const parsed: Array<{ name: string; code: string; parentName: string; parentPhone: string }> = [];

    lines.forEach((line, idx) => {
      // Support comma or tab separated or plain names
      const parts = line.split(/[,\t]+/).map((p) => p.trim());
      if (parts.length >= 1 && parts[0]) {
        // Skip header if detected
        if (parts[0].toLowerCase().includes('họ và tên') || parts[0].toLowerCase().includes('stt')) {
          return;
        }
        const name = parts.length >= 2 && !isNaN(Number(parts[0])) ? parts[1] : parts[0];
        const code =
          parts.length >= 3 && parts[2].includes('HS')
            ? parts[2]
            : `HS2024-${Math.floor(2000 + idx * 10 + Math.random() * 9)}`;
        const parentName = parts[3] || 'Phụ huynh HS';
        const parentPhone = parts[4] || `091${Math.floor(1000000 + Math.random() * 8999999)}`;
        parsed.push({ name, code, parentName, parentPhone });
      }
    });

    setImportedStudentsPreview(parsed);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportFileName(file.name);
    // Simulate reading csv / excel text
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        handleParsePastedRoster(content);
      }
    };
    reader.readAsText(file);
  };

  const handleLoadSampleImport = (type: 'team' | 'class') => {
    let sample = '';
    if (type === 'team') {
      sample = `STT\tHọ và tên\tMã học sinh\tPhụ huynh\tSố điện thoại
1\tĐỗ Hoàng Nam\tHS2024-1151\tĐỗ Văn Hưng\t0912 345 001
2\tPhan Bảo Trâm\tHS2024-1152\tPhan Quốc Tuấn\t0912 345 002
3\tNguyễn Hải Đăng\tHS2024-1153\tNguyễn Thị Lan\t0912 345 003
4\tVũ Phương Linh\tHS2024-1154\tVũ Văn Thành\t0912 345 004
5\tTrương Minh Khôi\tHS2024-1155\tTrương Đình Trọng\t0912 345 005
6\tBùi Diệu Hương\tHS2024-1156\tBùi Văn Toàn\t0912 345 006`;
    } else {
      sample = `STT\tHọ và tên\tMã học sinh\tPhụ huynh\tSố điện thoại
1\tLê Quang Huy\tHS2024-1160\tLê Văn Hùng\t0913 111 001
2\tTrần Thùy Dương\tHS2024-1161\tTrần Văn Cường\t0913 111 002
3\tNgô Đức Mạnh\tHS2024-1162\tNgô Thị Hoa\t0913 111 003
4\tPhạm Thúy Hằng\tHS2024-1163\tPhạm Văn Tuấn\t0913 111 004
5\tHoàng Gia Bảo\tHS2024-1164\tHoàng Văn Minh\t0913 111 005
6\tĐặng Tường Vy\tHS2024-1165\tĐặng Thị Mai\t0913 111 006
7\tNguyễn Thành Long\tHS2024-1166\tNguyễn Văn Đức\t0913 111 007
8\tVõ Ngọc Hân\tHS2024-1167\tVõ Văn Kiên\t0913 111 008
9\tLâm Quốc Trung\tHS2024-1168\tLâm Văn Phong\t0913 111 009
10\tĐoàn Kim Oanh\tHS2024-1169\tĐoàn Thị Nga\t0913 111 010`;
    }
    setImportFileName(type === 'team' ? 'DanhSach_To1_MathHub.xlsx' : 'DanhSach_LopMoi_GDPT2018.csv');
    setPastedRosterText(sample);
    handleParsePastedRoster(sample);
  };

  const handleDownloadTemplate = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      encodeURIComponent(
        'STT,Họ và tên,Mã học sinh,Phụ huynh,Số điện thoại\n1,Nguyễn Văn An,HS2024-1101,Nguyễn Văn Bình,0903111222\n2,Trần Thị Bích,HS2024-1102,Lê Thị Nga,0903222333\n3,Lê Minh Cường,HS2024-1103,Lê Văn Dũng,0903333444'
      );
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', 'Mau_DanhSach_HocSinh_MathHub.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleConfirmBulkImport = () => {
    if (importedStudentsPreview.length === 0) {
      alert('Vui lòng chọn file hoặc dán danh sách học sinh hợp lệ trước khi nạp!');
      return;
    }

    const newStudents: Student[] = importedStudentsPreview.map((item, idx) => ({
      id: `HS-${Date.now()}-${idx}`,
      name: item.name,
      studentCode: item.code,
      classId: selectedClassId,
      avatar: '👨‍🎓',
      level: 10,
      xp: 1000,
      streakDays: 1,
      coins: 50,
      attendanceRate: 100,
      avgScore: 8.0,
      status: 'Khá',
      phone: item.parentPhone,
      parentName: item.parentName,
      parentPhone: item.parentPhone,
      strongSkills: ['Toán đại số'],
      weakSkills: [],
      badges: ['Tân binh'],
      homeworkCompleted: 1,
      recentScores: [
        { title: 'Khảo sát xếp lớp', scoreTN: 8.0, scoreTL: 8.0, total: 8.0, date: '10/09/2026' },
      ],
      notes: 'Học sinh được nạp từ file danh sách.',
    }));

    setStudentsList((prev) => [...newStudents, ...prev]);
    // update class student count
    setClassesList((prev) =>
      prev.map((c) =>
        c.id === selectedClassId ? { ...c, totalStudents: c.totalStudents + newStudents.length } : c
      )
    );

    setShowBulkImportModal(false);
    setImportedStudentsPreview([]);
    setPastedRosterText('');
    setImportFileName('');
    showToast(`Đã nạp thành công ${newStudents.length} học sinh vào lớp ${selectedClass.name}!`);
  };

  // 5. TRANSFER STUDENT TO ANOTHER CLASS
  const handleOpenTransferClass = (student: Student) => {
    setTargetStudent(student);
    const otherClasses = classesList.filter((c) => c.id !== student.classId);
    setTargetNewClassId(otherClasses[0]?.id || '');
    setTransferReason('Theo nguyện vọng phân ban gia đình');
    setShowTransferClassModal(true);
  };

  const handleConfirmTransferClass = () => {
    if (!targetStudent || !targetNewClassId) return;

    const oldClassId = targetStudent.classId;
    const newClassId = targetNewClassId;

    // Update student classId
    setStudentsList((prev) =>
      prev.map((s) => (s.id === targetStudent.id ? { ...s, classId: newClassId } : s))
    );

    // Update class counts
    setClassesList((prev) =>
      prev.map((c) => {
        if (c.id === oldClassId) {
          return { ...c, totalStudents: Math.max(0, c.totalStudents - 1) };
        }
        if (c.id === newClassId) {
          return { ...c, totalStudents: c.totalStudents + 1 };
        }
        return c;
      })
    );

    // Add to transfer history
    const record: TransferRecord = {
      id: `TR-${Date.now()}`,
      studentName: targetStudent.name,
      studentCode: targetStudent.studentCode,
      fromClass: oldClassId,
      toClassOrSchool: `Lớp ${newClassId}`,
      type: 'transfer_class',
      date: new Date().toLocaleDateString('vi-VN'),
      reason: transferReason,
    };
    setTransferHistory((prev) => [record, ...prev]);

    setShowTransferClassModal(false);
    showToast(
      `Đã chuyển học sinh ${targetStudent.name} từ lớp ${oldClassId} sang lớp ${newClassId} thành công!`
    );
  };

  // 6. REMOVE STUDENT (TRANSFER SCHOOL / DROP)
  const handleOpenRemoveStudent = (student: Student) => {
    setTargetStudent(student);
    setRemoveReasonType('transfer_school');
    setRemoveNewSchool('THPT Chuyên / Trường mới');
    setRemoveNotes('Chuyển theo công văn của Sở GD&ĐT');
    setShowRemoveStudentModal(true);
  };

  const handleConfirmRemoveStudent = () => {
    if (!targetStudent) return;

    const currentClassId = targetStudent.classId;

    // Remove from active students
    setStudentsList((prev) => prev.filter((s) => s.id !== targetStudent.id));

    // Reduce class count
    setClassesList((prev) =>
      prev.map((c) =>
        c.id === currentClassId ? { ...c, totalStudents: Math.max(0, c.totalStudents - 1) } : c
      )
    );

    // Add to history
    const reasonText =
      removeReasonType === 'transfer_school'
        ? `Chuyển trường đến: ${removeNewSchool || 'Trường mới'}`
        : removeReasonType === 'relocation'
        ? 'Chuyển nơi cư trú'
        : removeReasonType === 'drop_out'
        ? 'Thôi học / Bảo lưu'
        : 'Xóa do nhập trùng dữ liệu';

    const record: TransferRecord = {
      id: `TR-${Date.now()}`,
      studentName: targetStudent.name,
      studentCode: targetStudent.studentCode,
      fromClass: currentClassId,
      toClassOrSchool: removeReasonType === 'transfer_school' ? removeNewSchool || 'Trường khác' : 'Rút hồ sơ',
      type: 'transfer_school',
      date: new Date().toLocaleDateString('vi-VN'),
      reason: reasonText + (removeNotes ? ` (${removeNotes})` : ''),
    };
    setTransferHistory((prev) => [record, ...prev]);

    setShowRemoveStudentModal(false);
    showToast(`Đã xóa học sinh ${targetStudent.name} khỏi danh sách lớp ${currentClassId}!`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
              Quản Trị Nhân Sự Học Đường & Lớp Học
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 mt-1">
            Quản Lý Lớp Học, Hồ Sơ Học Sinh & Chuyển Lớp / Chuyển Trường
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Thêm/xóa lớp, nạp nguyên file danh sách học sinh từ Excel/CSV, chuyển lớp và rút hồ sơ chuyển trường nhanh chóng.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowAddClassModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-slate-600" />
            <span>Thêm lớp mới</span>
          </button>
          <button
            onClick={() => setShowBulkImportModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Nạp file danh sách HS</span>
          </button>
          <button
            onClick={() => setShowAddStudentModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ 1 Học sinh</span>
          </button>
        </div>
      </div>

      {/* Toast message notification */}
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <Check className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
            <span className="font-semibold">{toastMessage}</span>
          </div>
          <span className="text-[11px] text-emerald-700 font-mono">Dữ liệu đã cập nhật</span>
        </div>
      )}

      {/* Main Grid: Class Selector & Student Roster */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Class Selector List (3 cols) */}
        <div className="lg:col-span-3 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide block">
              Danh sách lớp ({classesList.length} lớp)
            </span>
            <button
              onClick={() => setShowAddClassModal(true)}
              className="text-[11px] font-semibold text-blue-600 hover:underline cursor-pointer"
            >
              + Thêm
            </button>
          </div>

          <div className="space-y-1.5 max-h-[580px] overflow-y-auto pr-1">
            {classesList.map((cls) => {
              const isSelected = cls.id === selectedClassId;
              const count = studentsList.filter((s) => s.classId === cls.id).length;

              return (
                <div
                  key={cls.id}
                  onClick={() => {
                    setSelectedClassId(cls.id);
                    setViewTab('roster');
                  }}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs ring-1 ring-blue-500/20'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="truncate">
                    <div className="font-bold text-sm">Lớp {cls.name}</div>
                    <div className={`text-[11px] ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                      {count} HS · Khối {cls.grade}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {isSelected && <ChevronRight className="w-4 h-4 text-white" />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Action: Delete Current Class */}
          <div className="pt-2 border-t border-slate-200">
            <button
              onClick={() => setShowDeleteClassModal(true)}
              className="w-full py-2 px-3 text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa lớp {selectedClass.name}</span>
            </button>
          </div>
        </div>

        {/* Student Roster (9 cols) */}
        <div className="lg:col-span-9 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          {/* Header Bar of Selected Class */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  Lớp {selectedClass.name} (Khối {selectedClass.grade})
                </h2>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800 font-mono">
                  Sĩ số: {filteredStudents.length} HS
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                GVCN: Thầy {selectedClass.homeroomTeacher} · Mã lớp tham gia:{' '}
                <strong className="font-mono text-blue-700">{selectedClass.classCode}</strong>
              </p>
            </div>

            {/* Right Tools & View Switcher */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => setViewTab('roster')}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    viewTab === 'roster' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Danh sách HS ({filteredStudents.length})
                </button>
                <button
                  onClick={() => setViewTab('history')}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                    viewTab === 'history' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <History className="w-3 h-3 text-indigo-600" />
                  <span>Sổ chuyển lớp/trường ({transferHistory.length})</span>
                </button>
              </div>

              <button
                onClick={() => setShowQrModal(true)}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 cursor-pointer"
                title="Mã QR tham gia lớp"
              >
                <QrCode className="w-4 h-4 text-blue-600" />
              </button>
            </div>
          </div>

          {/* Search Bar & Table Controls */}
          {viewTab === 'roster' && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/80 p-2.5 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2 flex-1">
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Tìm tên hoặc mã định danh..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Sort selector */}
                <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200 text-[11px]">
                  <span className="px-2 text-slate-400 font-medium hidden md:inline">Xếp:</span>
                  <button
                    onClick={() => setSortBy('stt')}
                    className={`px-2 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                      sortBy === 'stt' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                    title="Theo thứ tự mặc định"
                  >
                    STT
                  </button>
                  <button
                    onClick={() => setSortBy('name')}
                    className={`px-2 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                      sortBy === 'name' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                    title="Theo thứ tự chữ cái A-Z"
                  >
                    Tên A-Z
                  </button>
                  <button
                    onClick={() => setSortBy('score')}
                    className={`px-2 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                      sortBy === 'score' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                    title="Điểm trung bình cao đến thấp"
                  >
                    Điểm TB
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleExportClassRoster}
                  className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 bg-white hover:bg-emerald-50 flex items-center gap-1.5 px-2.5 py-1.5 border border-emerald-300 rounded-lg shadow-2xs transition-colors cursor-pointer"
                  title="Xuất tệp CSV/Excel danh sách học sinh có đầy đủ STT"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Xuất Excel có STT</span>
                </button>
                <button
                  onClick={handleDownloadTemplate}
                  className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-white flex items-center gap-1 px-2.5 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                  title="Tải mẫu file CSV để nhập liệu"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>Mẫu nạp HS</span>
                </button>
              </div>
            </div>
          )}

          {/* VIEW TAB 1: STUDENT ROSTER TABLE */}
          {viewTab === 'roster' && (
            <div className="border border-slate-200 rounded-xl overflow-x-auto shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3 text-center w-14 font-bold text-slate-800 bg-slate-100/70 border-r border-slate-200">
                      STT
                    </th>
                    <th className="py-2.5 px-3">Mã HS</th>
                    <th className="py-2.5 px-3">Họ và tên</th>
                    <th className="py-2.5 px-3">Level & XP</th>
                    <th className="py-2.5 px-3">Điểm TB</th>
                    <th className="py-2.5 px-3">Phụ huynh</th>
                    <th className="py-2.5 px-3 text-center">Thao tác điều chuyển</th>
                    <th className="py-2.5 px-3 text-right">Chi tiết</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400">
                        Chưa có học sinh nào trong lớp này hoặc không tìm thấy kết quả phù hợp.
                        <div className="mt-2">
                          <button
                            onClick={() => setShowBulkImportModal(true)}
                            className="text-xs font-bold text-blue-600 hover:underline"
                          >
                            + Nạp ngay file danh sách học sinh
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((s, index) => (
                      <tr key={s.id} className="hover:bg-blue-50/40 transition-colors">
                        <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-700 bg-slate-50/60 border-r border-slate-100">
                          <span className="w-6 h-6 inline-flex items-center justify-center rounded-md bg-white border border-slate-200 text-xs shadow-2xs font-bold text-slate-800">
                            {index + 1}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-500 font-medium">{s.studentCode}</td>
                        <td
                          className="py-2.5 px-3 font-semibold text-slate-900 flex items-center gap-2 cursor-pointer hover:text-blue-600"
                          onClick={() => onSelectStudent(s)}
                        >
                          <span className="text-base">{s.avatar}</span>
                          <span>{s.name}</span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="font-bold text-indigo-700">Lv.{s.level}</span>{' '}
                          <span className="text-slate-400 font-mono text-[11px]">({s.xp} XP)</span>
                        </td>
                        <td className="py-2.5 px-3 font-bold text-blue-700 font-mono text-sm">
                          {s.avgScore}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">
                          <div>{s.parentName}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{s.parentPhone}</div>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleOpenTransferClass(s)}
                              className="px-2 py-1 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                              title="Chuyển sang lớp khác"
                            >
                              <ArrowRightLeft className="w-3 h-3 text-indigo-600" />
                              <span>Chuyển lớp</span>
                            </button>
                            <button
                              onClick={() => handleOpenRemoveStudent(s)}
                              className="px-2 py-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                              title="Rút hồ sơ hoặc chuyển trường"
                            >
                              <UserMinus className="w-3 h-3 text-rose-600" />
                              <span>Rút / Chuyển trường</span>
                            </button>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => onSelectStudent(s)}
                            className="text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                          >
                            Hồ sơ →
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* VIEW TAB 2: TRANSFER & DROP HISTORY TABLE */}
          {viewTab === 'history' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                <span>
                  Lưu trữ toàn bộ biến động nhân sự: học sinh chuyển lớp nội bộ hoặc chuyển sang trường khác.
                </span>
                <span className="font-bold text-indigo-700">{transferHistory.length} bản ghi</span>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-x-auto shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3 text-center w-14 font-bold text-slate-800 bg-slate-100/70 border-r border-slate-200">
                        STT
                      </th>
                      <th className="py-2.5 px-3">Ngày</th>
                      <th className="py-2.5 px-3">Họ và tên học sinh</th>
                      <th className="py-2.5 px-3">Mã HS</th>
                      <th className="py-2.5 px-3">Từ lớp</th>
                      <th className="py-2.5 px-3">Nơi chuyển đến</th>
                      <th className="py-2.5 px-3">Phân loại</th>
                      <th className="py-2.5 px-3">Lý do</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {transferHistory.map((tr, trIdx) => (
                      <tr key={tr.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-700 bg-slate-50/60 border-r border-slate-100">
                          <span className="w-6 h-6 inline-flex items-center justify-center rounded-md bg-white border border-slate-200 text-xs shadow-2xs font-bold text-slate-800">
                            {trIdx + 1}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-500">{tr.date}</td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">{tr.studentName}</td>
                        <td className="py-2.5 px-3 font-mono text-slate-600">{tr.studentCode}</td>
                        <td className="py-2.5 px-3 font-semibold text-slate-700">Lớp {tr.fromClass}</td>
                        <td className="py-2.5 px-3 font-semibold text-indigo-700">{tr.toClassOrSchool}</td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              tr.type === 'transfer_class'
                                ? 'bg-indigo-100 text-indigo-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {tr.type === 'transfer_class' ? 'Chuyển lớp' : 'Chuyển trường'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 italic">{tr.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL 1: ADD NEW CLASS */}
      {/* ======================================================== */}
      {showAddClassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">Thêm Lớp Học Mới</h3>
              </div>
              <button onClick={() => setShowAddClassModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddClass} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tên lớp học:</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: 11A3, 10A1, 12A5"
                  value={newClassName}
                  onChange={(e) => {
                    setNewClassName(e.target.value);
                    if (!newClassCode) {
                      setNewClassCode(`MATH${e.target.value.toUpperCase().replace(/\s/g, '')}`);
                    }
                  }}
                  className="w-full p-2.5 border border-slate-300 rounded-lg bg-slate-50 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Khối lớp:</label>
                  <select
                    value={newClassGrade}
                    onChange={(e) => setNewClassGrade(Number(e.target.value))}
                    className="w-full p-2.5 border border-slate-300 rounded-lg bg-slate-50"
                  >
                    <option value={10}>Khối 10</option>
                    <option value={11}>Khối 11</option>
                    <option value={12}>Khối 12</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mã lớp học:</label>
                  <input
                    type="text"
                    value={newClassCode}
                    onChange={(e) => setNewClassCode(e.target.value)}
                    placeholder="MATH11A3"
                    className="w-full p-2.5 border border-slate-300 rounded-lg bg-slate-50 font-mono font-bold text-blue-700"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Giáo viên chủ nhiệm:</label>
                <input
                  type="text"
                  value={newClassTeacher}
                  onChange={(e) => setNewClassTeacher(e.target.value)}
                  placeholder="Thầy Nguyễn Minh Vũ"
                  className="w-full p-2.5 border border-slate-300 rounded-lg bg-slate-50"
                />
              </div>

              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-[11px]">
                💡 Sau khi tạo lớp, thầy có thể bấm <strong>"Nạp file danh sách HS"</strong> để nạp cả lớp từ Excel vào ngay lập tức!
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddClassModal(false)}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-xs cursor-pointer"
                >
                  Tạo lớp ngay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: DELETE CLASS CONFIRMATION */}
      {/* ======================================================== */}
      {showDeleteClassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-rose-600">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h3 className="font-bold text-slate-900 text-sm">Xác Nhận Xóa Lớp {selectedClass.name}</h3>
            </div>

            <div className="text-xs text-slate-600 space-y-2">
              <p>
                Thầy có chắc chắn muốn xóa <strong>Lớp {selectedClass.name}</strong> không?
              </p>
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900">
                ⚠️ Hiện có <strong>{filteredStudents.length} học sinh</strong> đang thuộc lớp này. Khi xóa lớp, toàn bộ học sinh này sẽ được giải tán khỏi hệ thống lớp hiện tại.
              </div>
              <p className="text-[11px] text-slate-500">
                Nếu chỉ muốn chuyển học sinh sang lớp khác, thầy nên dùng tính năng <strong>Chuyển lớp</strong> trên bảng danh sách trước khi xóa.
              </p>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowDeleteClassModal(false)}
                className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer text-xs"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleDeleteClass}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-xs shadow-xs cursor-pointer"
              >
                Xác nhận xóa lớp này
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: BULK IMPORT STUDENTS (FROM EXCEL / CSV / PASTE) */}
      {/* ======================================================== */}
      {showBulkImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Nạp File Danh Sách Học Sinh Cho Lớp {selectedClass.name}
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    Hỗ trợ file Excel (.xlsx), CSV (.csv) hoặc copy/paste trực tiếp danh sách
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowBulkImportModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* Method Switcher */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setImportTab('upload')}
                  className={`flex-1 py-2 px-3 rounded-xl border text-center font-semibold cursor-pointer transition-all ${
                    importTab === 'upload'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 shadow-2xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  📤 Tải file từ máy tính (.xlsx, .csv, .txt)
                </button>
                <button
                  type="button"
                  onClick={() => setImportTab('paste')}
                  className={`flex-1 py-2 px-3 rounded-xl border text-center font-semibold cursor-pointer transition-all ${
                    importTab === 'paste'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 shadow-2xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  📝 Dán danh sách từ Excel/Word
                </button>
              </div>

              {/* TAB 1: UPLOAD FILE */}
              {importTab === 'upload' && (
                <div className="space-y-3">
                  <label className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 rounded-2xl p-6 text-center cursor-pointer block bg-emerald-50/20 transition-colors">
                    <input
                      type="file"
                      accept=".csv,.txt,.xlsx,.xls"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Upload className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                    <span className="font-bold text-emerald-950 block text-xs">
                      Bấm để chọn file Excel / CSV hoặc kéo thả vào đây
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-1">
                      Các cột: STT, Họ và tên, Mã học sinh, Tên phụ huynh, Số điện thoại
                    </span>
                  </label>

                  <div className="flex items-center justify-between text-[11px]">
                    <button
                      type="button"
                      onClick={handleDownloadTemplate}
                      className="text-emerald-700 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Tải file Excel mẫu (.csv)</span>
                    </button>
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400">Thử nhanh mẫu:</span>
                      <button
                        type="button"
                        onClick={() => handleLoadSampleImport('team')}
                        className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold cursor-pointer"
                      >
                        Tổ 6 em
                      </button>
                      <button
                        type="button"
                        onClick={() => handleLoadSampleImport('class')}
                        className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold cursor-pointer"
                      >
                        Lớp 10 em
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PASTE TEXT */}
              {importTab === 'paste' && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-700">
                      Bôi đen cột danh sách từ Excel và dán vào đây:
                    </span>
                    <button
                      type="button"
                      onClick={() => handleLoadSampleImport('team')}
                      className="text-[11px] text-emerald-700 font-semibold hover:underline cursor-pointer"
                    >
                      Dán mẫu 6 học sinh
                    </button>
                  </div>
                  <textarea
                    rows={5}
                    value={pastedRosterText}
                    onChange={(e) => {
                      setPastedRosterText(e.target.value);
                      handleParsePastedRoster(e.target.value);
                    }}
                    placeholder={`1\tLê Bảo Hoàng\tHS2024-1181\tBác Lê Văn Nam\t0912 345 678\n2\tTrần Minh Tuấn\tHS2024-1182\tBác Trần Văn An\t0903 888 999`}
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 font-mono text-xs"
                  />
                </div>
              )}

              {/* PREVIEW TABLE */}
              {importedStudentsPreview.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">
                      Danh sách đã nhận diện ({importedStudentsPreview.length} học sinh):
                    </span>
                    {importFileName && (
                      <span className="text-[11px] text-emerald-700 font-mono font-medium">
                        Tệp: {importFileName}
                      </span>
                    )}
                  </div>

                  <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-xl">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-600 font-semibold sticky top-0">
                        <tr>
                          <th className="py-2 px-3">STT</th>
                          <th className="py-2 px-3">Họ và tên</th>
                          <th className="py-2 px-3">Mã học sinh</th>
                          <th className="py-2 px-3">Phụ huynh</th>
                          <th className="py-2 px-3">Số điện thoại</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {importedStudentsPreview.map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="py-1.5 px-3 font-mono text-slate-400">{idx + 1}</td>
                            <td className="py-1.5 px-3 font-semibold text-slate-900">{item.name}</td>
                            <td className="py-1.5 px-3 font-mono text-slate-600">{item.code}</td>
                            <td className="py-1.5 px-3 text-slate-600">{item.parentName}</td>
                            <td className="py-1.5 px-3 font-mono text-slate-500">{item.parentPhone}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Sĩ số sau khi nạp:{' '}
                <strong>{filteredStudents.length + importedStudentsPreview.length} học sinh</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowBulkImportModal(false)}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-200 rounded-xl cursor-pointer text-xs"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleConfirmBulkImport}
                  disabled={importedStudentsPreview.length === 0}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs cursor-pointer text-xs disabled:opacity-40"
                >
                  Xác nhận nạp {importedStudentsPreview.length} học sinh
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 4: TRANSFER STUDENT TO ANOTHER CLASS */}
      {/* ======================================================== */}
      {showTransferClassModal && targetStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-sm">Chuyển Lớp Cho Học Sinh</h3>
              </div>
              <button
                onClick={() => setShowTransferClassModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[11px]">Học sinh điều chuyển:</span>
                <span className="font-bold text-sm text-slate-900 block mt-0.5">
                  {targetStudent.avatar} {targetStudent.name} ({targetStudent.studentCode})
                </span>
                <span className="text-[11px] text-indigo-700 block mt-0.5">
                  Lớp hiện tại: <strong>Lớp {targetStudent.classId}</strong>
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Chuyển sang lớp:</label>
                <select
                  value={targetNewClassId}
                  onChange={(e) => setTargetNewClassId(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg bg-white font-bold text-sm text-indigo-900"
                >
                  {classesList
                    .filter((c) => c.id !== targetStudent.classId)
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        Lớp {c.name} (Khối {c.grade} · GVCN: Thầy {c.homeroomTeacher})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Lý do chuyển lớp:</label>
                <input
                  type="text"
                  value={transferReason}
                  onChange={(e) => setTransferReason(e.target.value)}
                  placeholder="Ví dụ: Theo nguyện vọng gia đình, đổi ban môn học"
                  className="w-full p-2.5 border border-slate-300 rounded-lg bg-slate-50"
                />
              </div>

              <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-[11px]">
                ℹ️ Toàn bộ điểm số, XP, streak và lịch sử học tập của em sẽ được bảo lưu nguyên vẹn khi chuyển sang lớp mới.
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowTransferClassModal(false)}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleConfirmTransferClass}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-xs cursor-pointer"
                >
                  Xác nhận chuyển lớp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 5: REMOVE / DROP / TRANSFER SCHOOL */}
      {/* ======================================================== */}
      {showRemoveStudentModal && targetStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-rose-600">
              <UserMinus className="w-5 h-5 shrink-0" />
              <h3 className="font-bold text-slate-900 text-sm">Rút Hồ Sơ / Chuyển Trường Cho Học Sinh</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-200">
                <span className="text-slate-500 block text-[11px]">Học sinh chuyển trường / rút hồ sơ:</span>
                <span className="font-bold text-sm text-slate-900 block mt-0.5">
                  {targetStudent.name} ({targetStudent.studentCode})
                </span>
                <span className="text-[11px] text-slate-600 block mt-0.5">
                  Lớp: <strong>{targetStudent.classId}</strong> · Phụ huynh: {targetStudent.parentName} ({targetStudent.parentPhone})
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Lý do rút khỏi lớp:</label>
                <select
                  value={removeReasonType}
                  onChange={(e) => setRemoveReasonType(e.target.value as any)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="transfer_school">🏫 Chuyển trường (sang trường THPT khác)</option>
                  <option value="relocation">🏡 Chuyển nơi cư trú / Theo gia đình chuyển tỉnh</option>
                  <option value="drop_out">⏸️ Bảo lưu / Thôi học</option>
                  <option value="duplicate">❌ Xóa do nhập trùng dữ liệu học sinh</option>
                </select>
              </div>

              {removeReasonType === 'transfer_school' && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Trường mới chuyển đến:</label>
                  <input
                    type="text"
                    value={removeNewSchool}
                    onChange={(e) => setRemoveNewSchool(e.target.value)}
                    placeholder="Ví dụ: THPT Chuyên Lương Thế Vinh, Đồng Nai"
                    className="w-full p-2.5 border border-slate-300 rounded-lg bg-slate-50"
                  />
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Ghi chú bổ sung (số công văn, ngày rút):</label>
                <input
                  type="text"
                  value={removeNotes}
                  onChange={(e) => setRemoveNotes(e.target.value)}
                  placeholder="Ví dụ: Công văn chuyển trường số 42/QĐ-SGDĐT"
                  className="w-full p-2.5 border border-slate-300 rounded-lg bg-slate-50"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowRemoveStudentModal(false)}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={handleConfirmRemoveStudent}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg shadow-xs cursor-pointer"
                >
                  Xác nhận rút hồ sơ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 6: ADD SINGLE STUDENT */}
      {/* ======================================================== */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Thêm học sinh vào lớp {selectedClass.name}</h3>
              <button
                onClick={() => setShowAddStudentModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddStudent} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Họ và tên học sinh:</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Lê Bảo Hoàng"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg bg-slate-50 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mã định danh học sinh (tùy chọn):</label>
                <input
                  type="text"
                  placeholder="Ví dụ: HS2024-1188"
                  value={newStudentCode}
                  onChange={(e) => setNewStudentCode(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg bg-slate-50 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tên phụ huynh:</label>
                  <input
                    type="text"
                    placeholder="Bác Lê Văn A"
                    value={newParentName}
                    onChange={(e) => setNewParentName(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Số điện thoại PH:</label>
                  <input
                    type="text"
                    placeholder="0912..."
                    value={newParentPhone}
                    onChange={(e) => setNewParentPhone(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg bg-slate-50 font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-xs cursor-pointer"
                >
                  Xác nhận thêm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 7: QR CODE PARTICIPATION */}
      {/* ======================================================== */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-sm p-6 text-center space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <span className="font-bold text-slate-900 text-sm">Mã Tham Gia Lớp {selectedClass.name}</span>
              <button
                onClick={() => setShowQrModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Simulated QR vector */}
            <div className="w-44 h-44 mx-auto bg-slate-900 rounded-xl p-3 flex flex-col items-center justify-center text-white relative">
              <div className="w-36 h-36 border-4 border-dashed border-cyan-400/80 rounded-lg flex flex-col items-center justify-center p-2 bg-slate-800">
                <QrCode className="w-16 h-16 text-cyan-400" />
                <span className="text-[10px] font-mono text-cyan-200 mt-1">QUÉT BẰNG CAMERA</span>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
              <span className="text-slate-500 block">Hoặc học sinh nhập mã lớp trên điện thoại:</span>
              <span className="text-lg font-extrabold text-blue-700 font-mono tracking-widest block mt-0.5">
                {selectedClass.classCode}
              </span>
            </div>

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-xl text-xs cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassManagementView;
