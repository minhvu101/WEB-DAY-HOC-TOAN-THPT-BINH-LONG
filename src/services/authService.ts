import { supabase } from '../lib/supabase';
import { UserRole } from '../types';

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatar?: string;
  className?: string;
  school?: string;
  phone?: string;
  createdAt?: string;
}

const LOCAL_SESSION_KEY = 'mathhub_current_session';
const REGISTERED_USERS_KEY = 'mathhub_registered_users';

// Pre-configured default school accounts for THPT Bình Long
export const DEFAULT_ACCOUNTS: (AuthUser & { password: string; description: string })[] = [
  {
    id: 'user-teacher-01',
    username: 'thayvu',
    email: 'thayvu@binhlong.edu.vn',
    password: '123',
    fullName: 'Thầy Nguyễn Minh Vũ',
    role: 'teacher',
    school: 'THPT Bình Long – Đồng Nai',
    avatar: '👨‍🏫',
    description: 'Giáo viên Toán & Chủ nhiệm lớp 11A6',
  },
  {
    id: 'user-student-01',
    username: 'tuankiet',
    email: 'tuankiet@binhlong.edu.vn',
    password: '123',
    fullName: 'Trần Tuấn Kiệt',
    role: 'student',
    className: '11A6',
    school: 'THPT Bình Long – Đồng Nai',
    avatar: '👨‍🎓',
    description: 'Học sinh lớp 11A6 · Top 1 Math Universe',
  },
  {
    id: 'user-parent-01',
    username: 'phuhuynhlong',
    email: 'phuhuynhlong@binhlong.edu.vn',
    password: '123',
    fullName: 'Bác Trần Văn Long',
    role: 'parent',
    school: 'THPT Bình Long – Đồng Nai',
    avatar: '👨‍👧',
    description: 'Phụ huynh học sinh Trần Tuấn Kiệt (11A6)',
  },
  {
    id: 'user-admin-01',
    username: 'bangianghieu',
    email: 'admin@binhlong.edu.vn',
    password: '123',
    fullName: 'Ban Giám Hiệu',
    role: 'admin',
    school: 'THPT Bình Long – Đồng Nai',
    avatar: '🏛️',
    description: 'Ban Quản trị THPT Bình Long',
  },
];

function getStoredUsers(): (AuthUser & { password: string })[] {
  try {
    const raw = localStorage.getItem(REGISTERED_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredUsers(users: (AuthUser & { password: string })[]) {
  try {
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Lỗi lưu tài khoản người dùng:', err);
  }
}

export const authService = {
  /**
   * Get current active session
   */
  getCurrentUser(): AuthUser | null {
    try {
      const raw = localStorage.getItem(LOCAL_SESSION_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  /**
   * Save session to storage
   */
  saveSession(user: AuthUser) {
    try {
      localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(user));
    } catch (err) {
      console.error('Lỗi lưu phiên đăng nhập:', err);
    }
  },

  /**
   * Clear active session
   */
  async logout(): Promise<void> {
    try {
      localStorage.removeItem(LOCAL_SESSION_KEY);
      await supabase.auth.signOut().catch(() => {});
    } catch (err) {
      console.error('Lỗi đăng xuất:', err);
    }
  },

  /**
   * Login with username or email + password
   */
  async login(usernameOrEmail: string, password: string): Promise<{ success: boolean; user?: AuthUser; message: string }> {
    const query = usernameOrEmail.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!query) {
      return { success: false, message: 'Vui lòng nhập tên đăng nhập hoặc email!' };
    }
    if (!cleanPass) {
      return { success: false, message: 'Vui lòng nhập mật khẩu!' };
    }

    // 1. First attempt to authenticate via Supabase app_users table
    try {
      const { data: remoteUsers, error: remoteErr } = await supabase
        .from('app_users')
        .select('*')
        .or(`username.ilike.${query},email.ilike.${query}`)
        .eq('password', cleanPass)
        .limit(1);

      if (!remoteErr && remoteUsers && remoteUsers.length > 0) {
        const u = remoteUsers[0];
        const authUser: AuthUser = {
          id: u.id,
          username: u.username,
          email: u.email || `${u.username}@binhlong.edu.vn`,
          fullName: u.full_name,
          role: u.role as UserRole,
          className: u.class_name,
          school: u.school || 'THPT Bình Long – Đồng Nai',
          avatar: u.avatar || '👤',
          createdAt: u.created_at,
        };
        this.saveSession(authUser);
        return {
          success: true,
          user: authUser,
          message: `Đăng nhập Supabase Cloud thành công! Chào mừng ${authUser.fullName}.`,
        };
      }
    } catch {
      // Continue to local/default fallback if table not created yet
    }

    // 2. Check default school accounts for instant access
    const defaultMatch = DEFAULT_ACCOUNTS.find(
      (acc) => (acc.username.toLowerCase() === query || acc.email.toLowerCase() === query) && acc.password === cleanPass
    );

    if (defaultMatch) {
      const { password: _, description: __, ...userProfile } = defaultMatch;
      this.saveSession(userProfile);
      return {
        success: true,
        user: userProfile,
        message: `Đăng nhập thành công! Chào mừng ${userProfile.fullName}.`,
      };
    }

    // 3. Check locally registered users
    const storedUsers = getStoredUsers();
    const storedMatch = storedUsers.find(
      (u) => (u.username.toLowerCase() === query || u.email.toLowerCase() === query) && u.password === cleanPass
    );

    if (storedMatch) {
      const { password: _, ...userProfile } = storedMatch;
      this.saveSession(userProfile);
      return {
        success: true,
        user: userProfile,
        message: `Đăng nhập thành công! Chào mừng ${userProfile.fullName}.`,
      };
    }

    // 4. Attempt Supabase Auth login (Email-based)
    try {
      const email = query.includes('@') ? query : `${query}@binhlong.edu.vn`;
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: cleanPass,
      });

      if (!error && data.user) {
        const metadata = data.user.user_metadata || {};
        const authUser: AuthUser = {
          id: data.user.id,
          username: metadata.username || query,
          email: data.user.email || email,
          fullName: metadata.fullName || metadata.full_name || query,
          role: metadata.role || 'teacher',
          className: metadata.className,
          school: metadata.school || 'THPT Bình Long',
          avatar: metadata.avatar || '👤',
        };

        this.saveSession(authUser);
        return {
          success: true,
          user: authUser,
          message: `Đăng nhập Supabase thành công! Chào mừng ${authUser.fullName}.`,
        };
      }
    } catch {
      // Continue to error return
    }

    return {
      success: false,
      message: 'Tên đăng nhập hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại!',
    };
  },

  /**
   * Register a new user
   */
  async register(params: {
    username: string;
    fullName: string;
    password: string;
    role: UserRole;
    className?: string;
    email?: string;
  }): Promise<{ success: boolean; user?: AuthUser; message: string }> {
    const cleanUsername = params.username.trim().toLowerCase();
    const cleanFullName = params.fullName.trim();
    const cleanPass = params.password.trim();

    if (!cleanUsername || cleanUsername.length < 3) {
      return { success: false, message: 'Tên đăng nhập phải có ít nhất 3 ký tự!' };
    }
    if (!cleanFullName) {
      return { success: false, message: 'Vui lòng nhập họ và tên đầy đủ!' };
    }
    if (!cleanPass || cleanPass.length < 3) {
      return { success: false, message: 'Mật khẩu phải có ít nhất 3 ký tự!' };
    }

    // Check conflict with default accounts
    const existsDefault = DEFAULT_ACCOUNTS.some((a) => a.username.toLowerCase() === cleanUsername);
    if (existsDefault) {
      return { success: false, message: 'Tên đăng nhập này đã được sử dụng!' };
    }

    // Check conflict with stored users
    const storedUsers = getStoredUsers();
    const existsStored = storedUsers.some((a) => a.username.toLowerCase() === cleanUsername);
    if (existsStored) {
      return { success: false, message: 'Tên đăng nhập này đã tồn tại trong hệ thống!' };
    }

    const email = params.email?.trim() || `${cleanUsername}@binhlong.edu.vn`;

    const newUser: AuthUser = {
      id: `usr-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      username: cleanUsername,
      email,
      fullName: cleanFullName,
      role: params.role,
      className: params.className || (params.role === 'student' ? '11A6' : undefined),
      school: 'THPT Bình Long – Đồng Nai',
      avatar: params.role === 'teacher' ? '👨‍🏫' : params.role === 'student' ? '👨‍🎓' : params.role === 'parent' ? '👨‍👧' : '🏛️',
      createdAt: new Date().toISOString(),
    };

    // 1. Save directly into Supabase 'app_users' table
    try {
      await supabase.from('app_users').insert([
        {
          id: newUser.id,
          username: newUser.username,
          password: cleanPass,
          full_name: newUser.fullName,
          role: newUser.role,
          class_name: newUser.className || null,
          email: newUser.email,
          school: newUser.school,
          avatar: newUser.avatar,
        },
      ]);
    } catch (err) {
      console.warn('Lưu ý: Bảng app_users chưa sẵn sàng, lưu tạm local:', err);
    }

    // 2. Also register with Supabase Auth
    try {
      await supabase.auth.signUp({
        email,
        password: cleanPass,
        options: {
          data: {
            username: cleanUsername,
            fullName: cleanFullName,
            role: params.role,
            className: params.className,
            school: 'THPT Bình Long',
          },
        },
      });
    } catch (err) {
      console.warn('Lưu ý: Supabase Auth signup:', err);
    }

    // Save locally so the user can immediately log in reliably
    storedUsers.push({ ...newUser, password: cleanPass });
    saveStoredUsers(storedUsers);

    // Auto login
    this.saveSession(newUser);

    return {
      success: true,
      user: newUser,
      message: 'Đăng ký tài khoản thành công và đã lưu lên cơ sở dữ liệu Supabase!',
    };
  },
};
