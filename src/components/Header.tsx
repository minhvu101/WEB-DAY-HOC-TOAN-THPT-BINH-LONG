import React, { useState } from 'react';
import { UserRole } from '../types';
import { Bell, Sparkles, Compass, Shield, Users, GraduationCap, ChevronDown, Check, BookOpen, Layers } from 'lucide-react';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenAITutor: () => void;
  onOpenAIQuestionGen: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  activeTab,
  onTabChange,
  onOpenAITutor,
  onOpenAIQuestionGen,
}) => {
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const roleNames: Record<UserRole, { title: string; subtitle: string; icon: any; color: string }> = {
    teacher: {
      title: 'Thầy Nguyễn Minh Vũ',
      subtitle: 'Giáo viên Toán · THPT Bình Long',
      icon: GraduationCap,
      color: 'text-blue-600 bg-blue-50',
    },
    student: {
      title: 'Trần Tuấn Kiệt',
      subtitle: 'Học sinh 11A6 · Level 18',
      icon: Compass,
      color: 'text-indigo-600 bg-indigo-50',
    },
    parent: {
      title: 'Bác Trần Văn Long',
      subtitle: 'Phụ huynh em Tuấn Kiệt',
      icon: Users,
      color: 'text-emerald-600 bg-emerald-50',
    },
    admin: {
      title: 'Ban Giám Hiệu',
      subtitle: 'Quản trị trường THPT Bình Long',
      icon: Shield,
      color: 'text-purple-600 bg-purple-50',
    },
  };

  const currentRoleInfo = roleNames[currentRole];
  const CurrentIcon = currentRoleInfo.icon;

  const notifications = [
    { id: 1, title: '32/37 học sinh đã nộp bài Hàm số bậc hai', time: '10 phút trước', read: false },
    { id: 2, title: 'Học sinh Lê Minh Cường có dấu hiệu tụt điểm', time: '1 giờ trước', read: false },
    { id: 3, title: 'Nhắc việc: Họp tổ chuyên môn Toán lúc 15:30', time: 'Hôm nay', read: true },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-8 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Brand wordmark & emblem */}
        <div className="flex items-center gap-3">
          <div 
            onClick={() => onTabChange('dashboard')} 
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <span className="font-bold text-lg tracking-tighter">M</span>
              <span className="text-cyan-200 text-xs font-mono font-bold">H</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                  MathHub
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                  2.0 Pro
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Kết nối tri thức · Kiến tạo tương lai
              </p>
            </div>
          </div>
        </div>

        {/* Zone 2: Navigation Links based on role */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {currentRole === 'teacher' && (
            <>
              <button
                onClick={() => onTabChange('dashboard')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  activeTab === 'dashboard'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Trang chủ
              </button>
              <button
                onClick={() => onTabChange('classes')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  activeTab === 'classes'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Lớp học
              </button>
              <button
                onClick={() => onTabChange('assignments')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  activeTab === 'assignments'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Bài tập & Đề
              </button>
              <button
                onClick={() => onTabChange('grading')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  activeTab === 'grading'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Chấm điểm
              </button>
              <button
                onClick={() => onTabChange('homeroom')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  activeTab === 'homeroom'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Lớp chủ nhiệm
              </button>
              <button
                onClick={() => onTabChange('khbd')}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  activeTab === 'khbd'
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                KHBD 5512 (.docx)
              </button>
              <button
                onClick={() => onTabChange('lectures')}
                className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeTab === 'lectures'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>AI PPTX Studio</span>
                <span className="text-[9px] px-1 py-0.5 rounded bg-cyan-400 text-slate-950 font-bold font-mono">PRO</span>
              </button>
            </>
          )}

          {currentRole === 'student' && (
            <>
              <button
                onClick={() => onTabChange('universe')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  activeTab === 'universe'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                🌌 Vũ Trụ Toán Học
              </button>
              <button
                onClick={() => onTabChange('mathlab')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  activeTab === 'mathlab'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                🧮 Phòng Thí Nghiệm Math Lab
              </button>
              <button
                onClick={() => onTabChange('boss')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  activeTab === 'boss'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-amber-700 hover:bg-amber-50'
                }`}
              >
                👑 Đấu Boss Toán
              </button>
            </>
          )}

          {currentRole === 'parent' && (
            <span className="text-xs font-medium text-emerald-800 bg-emerald-50 px-3 py-1 rounded-md">
              Cổng Thông Tin Phụ Huynh · Theo dõi tiến độ học tập
            </span>
          )}

          {currentRole === 'admin' && (
            <span className="text-xs font-medium text-purple-800 bg-purple-50 px-3 py-1 rounded-md">
              Trung Tâm Quản Trị Hệ Thống THPT Bình Long
            </span>
          )}
        </nav>

        {/* Zone 3: Quick Tools & Role Switcher */}
        <div className="flex items-center gap-2">
          {/* Quick AI Buttons */}
          <button
            onClick={onOpenAITutor}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/60 rounded-lg transition-colors shadow-2xs"
            title="Mở trợ lý AI Mathy"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">AI Mathy</span>
          </button>

          {currentRole === 'teacher' && (
            <button
              onClick={onOpenAIQuestionGen}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200/60 rounded-lg transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              <span>AI Tạo Đề</span>
            </button>
          )}

          {/* Notifications button */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg relative transition-colors"
              aria-label="Thông báo"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl p-3 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                  <span className="text-xs font-semibold text-slate-800">Thông báo mới</span>
                  <button 
                    onClick={() => setNotificationsOpen(false)}
                    className="text-[11px] text-blue-600 hover:underline"
                  >
                    Đóng
                  </button>
                </div>
                <div className="space-y-2">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-2 rounded-lg text-xs transition-colors ${
                        n.read ? 'bg-slate-50 text-slate-600' : 'bg-blue-50/70 text-slate-800 font-medium'
                      }`}
                    >
                      <p>{n.title}</p>
                      <span className="text-[10px] text-slate-400 mt-0.5 block">{n.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Interactive Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition-all text-left"
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${currentRoleInfo.color}`}>
                <CurrentIcon className="w-4 h-4" />
              </div>
              <div className="hidden sm:block leading-tight">
                <div className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                  {currentRoleInfo.title}
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </div>
                <div className="text-[10px] text-slate-500 truncate max-w-[120px]">
                  {currentRoleInfo.subtitle}
                </div>
              </div>
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Chuyển vai trò thử nghiệm
                </div>
                <div className="space-y-1 mt-1">
                  {(['teacher', 'student', 'parent', 'admin'] as UserRole[]).map((role) => {
                    const info = roleNames[role];
                    const Icon = info.icon;
                    const isSelected = currentRole === role;
                    return (
                      <button
                        key={role}
                        onClick={() => {
                          onRoleChange(role);
                          setRoleDropdownOpen(false);
                          if (role === 'student') onTabChange('universe');
                          else if (role === 'parent') onTabChange('parent');
                          else if (role === 'admin') onTabChange('admin');
                          else onTabChange('dashboard');
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                          isSelected ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded flex items-center justify-center ${info.color}`}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold">{info.title}</p>
                            <p className="text-[10px] text-slate-500">{info.subtitle}</p>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
