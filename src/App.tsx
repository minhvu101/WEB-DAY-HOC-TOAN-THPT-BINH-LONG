import React, { useState } from 'react';
import { UserRole, Student } from './types';
import Header from './components/Header';
import TeacherDashboard from './components/TeacherDashboard';
import StudentPortal from './components/StudentPortal';
import ParentPortal from './components/ParentPortal';
import AdminPortal from './components/AdminPortal';
import MathLabView from './components/MathLabView';
import FinalBossView from './components/FinalBossView';
import ClassManagementView from './components/ClassManagementView';
import AssignmentBuilderView from './components/AssignmentBuilderView';
import GradingView from './components/GradingView';
import HomeroomView from './components/HomeroomView';
import LectureLibraryView from './components/LectureLibraryView';
import KHBDView from './components/KHBDView';
import StudentProfileModal from './components/StudentProfileModal';
import AITutorModal from './components/AITutorModal';
import AIQuestionGeneratorModal from './components/AIQuestionGeneratorModal';

export const App: React.FC = () => {
  const [currentRole, setCurrentRole] = useState<UserRole>('teacher');
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Modals state
  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState<Student | null>(null);
  const [isAITutorOpen, setIsAITutorOpen] = useState<boolean>(false);
  const [isAIQuestionGenOpen, setIsAIQuestionGenOpen] = useState<boolean>(false);

  // Switch role helper
  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    if (role === 'student') setActiveTab('universe');
    else if (role === 'parent') setActiveTab('parent');
    else if (role === 'admin') setActiveTab('admin');
    else setActiveTab('dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 flex flex-col">
      {/* Top Navigation Bar with Role Switcher */}
      <Header
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenAITutor={() => setIsAITutorOpen(true)}
        onOpenAIQuestionGen={() => setIsAIQuestionGenOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
        {/* Role: TEACHER */}
        {currentRole === 'teacher' && (
          <>
            {activeTab === 'dashboard' && (
              <TeacherDashboard
                onSelectStudent={(s) => setSelectedStudentForProfile(s)}
                onOpenAIQuestionGen={() => setIsAIQuestionGenOpen(true)}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            )}
            {activeTab === 'classes' && (
              <ClassManagementView
                onSelectStudent={(s) => setSelectedStudentForProfile(s)}
              />
            )}
            {activeTab === 'assignments' && (
              <AssignmentBuilderView
                onOpenAIQuestionGen={() => setIsAIQuestionGenOpen(true)}
              />
            )}
            {activeTab === 'grading' && (
              <GradingView
                onSelectStudent={(s) => setSelectedStudentForProfile(s)}
              />
            )}
            {activeTab === 'homeroom' && <HomeroomView />}
            {activeTab === 'mathlab' && <MathLabView />}
            {activeTab === 'lectures' && <LectureLibraryView />}
            {activeTab === 'khbd' && (
              <KHBDView onNavigateToLectures={() => setActiveTab('lectures')} />
            )}
          </>
        )}

        {/* Role: STUDENT (Math Universe) */}
        {currentRole === 'student' && (
          <>
            {activeTab === 'universe' && (
              <StudentPortal
                onOpenMathLab={() => setActiveTab('mathlab')}
                onOpenFinalBoss={() => setActiveTab('boss')}
                onOpenAITutor={() => setIsAITutorOpen(true)}
              />
            )}
            {activeTab === 'mathlab' && <MathLabView />}
            {activeTab === 'boss' && <FinalBossView />}
          </>
        )}

        {/* Role: PARENT */}
        {currentRole === 'parent' && <ParentPortal />}

        {/* Role: ADMIN */}
        {currentRole === 'admin' && <AdminPortal />}
      </main>

      {/* Modals */}
      <StudentProfileModal
        student={selectedStudentForProfile}
        isOpen={Boolean(selectedStudentForProfile)}
        onClose={() => setSelectedStudentForProfile(null)}
      />

      <AITutorModal
        isOpen={isAITutorOpen}
        onClose={() => setIsAITutorOpen(false)}
      />

      <AIQuestionGeneratorModal
        isOpen={isAIQuestionGenOpen}
        onClose={() => setIsAIQuestionGenOpen(false)}
        onAddQuestionsToExam={(questions) => {
          // Can navigate or notify
          setActiveTab('assignments');
        }}
      />

      {/* Footer matching reference design */}
      <footer className="bg-slate-900 text-slate-400 py-6 px-4 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-2 text-white font-semibold">
            <span className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-xs font-bold">
              M
            </span>
            <span>MathHub</span>
            <span className="text-slate-500 font-normal">|</span>
            <span className="text-slate-300 font-normal">
              Hệ thống quản lý – Dạy học – Kiểm tra – Đánh giá – Lớp chủ nhiệm
            </span>
          </div>

          <div className="text-slate-300 italic font-serif">
            “Công nghệ là công cụ, con người là trung tâm!”
          </div>

          <div className="flex items-center gap-1.5 text-blue-400">
            <span>💙</span>
            <span>Thầy Nguyễn Minh Vũ · THPT Bình Long – Đồng Nai</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
