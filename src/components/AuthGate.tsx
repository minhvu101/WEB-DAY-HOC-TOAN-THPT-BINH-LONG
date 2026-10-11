import React, { useState } from 'react';
import { 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  Sparkles, 
  GraduationCap, 
  BookOpen, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Database,
  Users,
  Compass,
  Shield,
  Layers,
  School
} from 'lucide-react';
import { authService, AuthUser, DEFAULT_ACCOUNTS } from '../services/authService';
import { UserRole } from '../types';
import { supabaseUrl } from '../lib/supabase';

interface AuthGateProps {
  onLoginSuccess: (user: AuthUser) => void;
}

export const AuthGate: React.FC<AuthGateProps> = ({ onLoginSuccess }) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  
  // Login form state
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register form state
  const [regUsername, setRegUsername] = useState('');
  const [regFullName, setRegFullName] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('teacher');
  const [regClass, setRegClass] = useState('11A6');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Status & feedback
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Handle Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      const res = await authService.login(loginUsername, loginPassword);
      if (res.success && res.user) {
        setSuccessMsg(res.message);
        setTimeout(() => {
          onLoginSuccess(res.user!);
        }, 350);
      } else {
        setErrorMsg(res.message);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Đăng nhập thất bại. Vui lòng thử lại!');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Register
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (regPassword !== regConfirmPassword) {
      setErrorMsg('Mật khẩu xác nhận không khớp! Vui lòng nhập lại.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await authService.register({
        username: regUsername,
        fullName: regFullName,
        password: regPassword,
        role: regRole,
        className: regRole === 'student' ? regClass : undefined,
      });

      if (res.success && res.user) {
        setSuccessMsg(res.message);
        setTimeout(() => {
          onLoginSuccess(res.user!);
        }, 500);
      } else {
        setErrorMsg(res.message);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Đăng ký thất bại. Vui lòng thử lại!');
    } finally {
      setIsLoading(false);
    }
  };

  // Quick fill demo account
  const handleQuickFill = (acc: typeof DEFAULT_ACCOUNTS[0]) => {
    setTab('login');
    setLoginUsername(acc.username);
    setLoginPassword(acc.password);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 lg:p-8 relative overflow-hidden font-sans">
      {/* Background Math & Glow Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] right-[20%] w-[350px] h-[350px] bg-indigo-600/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Decorative Formula Watermarks */}
      <div className="absolute inset-0 select-none pointer-events-none opacity-5 text-white font-mono text-2xl lg:text-3xl space-y-12 p-8 overflow-hidden">
        <div>f(x) = ax² + bx + c &nbsp;&nbsp;&nbsp;&nbsp; lim[x→0] (sin x)/x = 1</div>
        <div className="pl-24">∫[a, b] f(x)dx = F(b) - F(a) &nbsp;&nbsp;&nbsp;&nbsp; |u⃗ · v⃗| = |u⃗||v⃗|cosθ</div>
        <div className="pl-12">Δ = b² - 4ac &nbsp;&nbsp;&nbsp;&nbsp; sin²x + cos²x = 1 &nbsp;&nbsp;&nbsp;&nbsp; V = ⅓Bh</div>
      </div>

      <div className="relative z-10 w-full max-w-5xl bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl backdrop-blur-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Col: School & Platform Showcase (5 cols) */}
        <div className="lg:col-span-5 p-8 lg:p-10 bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800 text-white relative">
          <div>
            {/* School Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-xs font-semibold mb-6">
              <School className="w-3.5 h-3.5 text-blue-400" />
              <span>TRƯỜNG THPT BÌNH LONG · ĐỒNG NAI</span>
            </div>

            {/* App Branding */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-blue-500/30">
                ∑
              </div>
              <div>
                <h1 className="text-xl lg:text-2xl font-black tracking-tight text-white">
                  MathHub Bình Long
                </h1>
                <p className="text-xs text-blue-300 font-medium">
                  Hệ Sinh Thái Dạy Học & Kiểm Tra Đánh Giá Toán THPT
                </p>
              </div>
            </div>

            <p className="text-slate-300 text-xs leading-relaxed mt-4">
              Nền tảng chuyển đổi số toàn diện theo Chương trình GDPT 2018: Quản lý học tập, Ma trận đề thi chuẩn 2025, Chấm thi OMR thông minh, Phòng thí nghiệm Math Lab và Cổng kết nối Phụ huynh.
            </p>

            {/* Feature Highlights */}
            <div className="mt-6 space-y-2.5">
              <div className="flex items-center gap-2.5 text-xs text-slate-200 bg-white/5 p-2 rounded-xl border border-white/5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Giáo án KHBD 5512 & Bài giảng PPTX Morph</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-200 bg-white/5 p-2 rounded-xl border border-white/5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Ma trận & Đề thi 3 phần chuẩn BGD 2025</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-200 bg-white/5 p-2 rounded-xl border border-white/5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Vũ trụ Math Universe & Đấu Boss Toán Học</span>
              </div>
            </div>
          </div>

          {/* Database & Cloud Footnote */}
          <div className="mt-8 pt-6 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                <span>Cơ sở dữ liệu Supabase:</span>
              </div>
              <span className="font-mono text-emerald-400 font-medium">Sẵn sàng kết nối</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1 truncate">
              {supabaseUrl}
            </p>
          </div>
        </div>

        {/* Right Col: Login / Register Form (7 cols) */}
        <div className="lg:col-span-7 p-8 lg:p-10 bg-slate-900/60 flex flex-col justify-between">
          <div>
            {/* Tab Switcher */}
            <div className="flex p-1 bg-slate-800/80 rounded-xl mb-6 border border-slate-700/60 max-w-sm">
              <button
                type="button"
                onClick={() => {
                  setTab('login');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  tab === 'login'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Đăng Nhập
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab('register');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  tab === 'register'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Đăng Ký Tài Khoản
              </button>
            </div>

            {/* Error or Success notification */}
            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* FORM 1: LOGIN */}
            {tab === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Tên đăng nhập hoặc Email
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: thayvu hoặc tuankiet"
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      required
                      placeholder="Nhập mật khẩu của bạn"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <span>Đang kiểm tra đăng nhập...</span>
                  ) : (
                    <>
                      <span>Đăng Nhập Vào Hệ Thống</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* FORM 2: REGISTER */}
            {tab === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Thầy/Cô hoặc Em..."
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Tên đăng nhập
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="vd: giaovien_toan"
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                {/* Role selection */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Vai trò trong trường
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { role: 'teacher' as UserRole, label: 'Giáo viên', icon: '👨‍🏫' },
                      { role: 'student' as UserRole, label: 'Học sinh', icon: '👨‍🎓' },
                      { role: 'parent' as UserRole, label: 'Phụ huynh', icon: '👨‍👩‍👧' },
                      { role: 'admin' as UserRole, label: 'Quản trị', icon: '🏛️' },
                    ].map((item) => (
                      <button
                        key={item.role}
                        type="button"
                        onClick={() => setRegRole(item.role)}
                        className={`p-2 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition-all ${
                          regRole === item.role
                            ? 'bg-blue-600/30 border-blue-500 text-blue-200 font-bold'
                            : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
                        }`}
                      >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {regRole === 'student' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Lớp học tại THPT Bình Long
                    </label>
                    <select
                      value={regClass}
                      onChange={(e) => setRegClass(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
                    >
                      <option value="11A6">Lớp 11A6 (Thầy Vũ chủ nhiệm)</option>
                      <option value="11A1">Lớp 11A1</option>
                      <option value="11A2">Lớp 11A2</option>
                      <option value="11A7">Lớp 11A7</option>
                      <option value="11A12">Lớp 11A12</option>
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Mật khẩu
                    </label>
                    <div className="relative">
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        required
                        placeholder="Tối thiểu 3 ký tự"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Xác nhận mật khẩu
                    </label>
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      placeholder="Nhập lại mật khẩu"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                >
                  {isLoading ? <span>Đang tạo tài khoản...</span> : <span>Tạo Tài Khoản & Vào Hệ Thống</span>}
                </button>
              </form>
            )}
          </div>

          {/* Quick-Access Demo Accounts */}
          <div className="mt-8 pt-5 border-t border-slate-800/90">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                ⚡ Đăng Nhập Nhanh Tài Khoản Mẫu (Mật khẩu: 123)
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {DEFAULT_ACCOUNTS.map((acc) => (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => handleQuickFill(acc)}
                  className="p-2 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 hover:border-blue-500/50 transition-all text-left group"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">{acc.avatar}</span>
                    <span className="text-[11px] font-bold text-slate-200 group-hover:text-blue-300 truncate">
                      {acc.fullName}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                    user: <span className="text-blue-400">{acc.username}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AuthGate;
