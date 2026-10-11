import React, { useState, useEffect } from 'react';
import { 
  Database, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Copy, 
  Check, 
  UploadCloud, 
  ExternalLink, 
  ShieldCheck, 
  Server, 
  Terminal,
  Zap,
  Info
} from 'lucide-react';
import { supabaseUrl, supabaseAnonKey, SUPABASE_SCHEMA_SQL } from '../lib/supabase';
import { SupabaseDataService, SyncStatus } from '../services/supabaseService';

interface SupabaseSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseSyncModal: React.FC<SupabaseSyncModalProps> = ({ isOpen, onClose }) => {
  const [testing, setTesting] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [testResult, setTestResult] = useState<{
    connected: boolean;
    message: string;
    latencyMs?: number;
  } | null>(null);
  const [seedResult, setSeedResult] = useState<{
    success: boolean;
    message: string;
    counts?: { classes: number; students: number; assignments: number; users?: number; submissions?: number; khbd?: number };
  } | null>(null);

  useEffect(() => {
    if (isOpen && !testResult) {
      handleTestConnection();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await SupabaseDataService.testConnection();
      setTestResult(res);
    } catch (err: any) {
      setTestResult({
        connected: false,
        message: err.message || 'Lỗi không xác định khi kết nối',
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSeedData = async () => {
    setSeeding(true);
    setSeedResult(null);
    try {
      const res = await SupabaseDataService.seedInitialData();
      setSeedResult(res);
      // Re-test connection after seeding
      await handleTestConnection();
    } catch (err: any) {
      setSeedResult({
        success: false,
        message: err.message || 'Lỗi khi đồng bộ dữ liệu',
      });
    } finally {
      setSeeding(false);
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shadow-inner">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Quản Trị Kết Nối Supabase</h3>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                  PostgreSQL BaaS
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Kết nối cơ sở dữ liệu thời gian thực cho THPT Bình Long
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* Status Box */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-slate-600" />
                <span className="font-semibold text-slate-800 text-xs uppercase tracking-wider">
                  Thông Tin Cấu Hình Hiện Tại
                </span>
              </div>
              <button
                onClick={handleTestConnection}
                disabled={testing}
                className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200 rounded-lg shadow-2xs transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin text-emerald-600' : ''}`} />
                {testing ? 'Đang kiểm tra...' : 'Kiểm tra kết nối'}
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs bg-white p-2.5 rounded-lg border border-slate-200/60 font-mono">
                <span className="text-slate-500">Project URL:</span>
                <span className="text-emerald-700 font-medium truncate max-w-[340px]">
                  {supabaseUrl}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs bg-white p-2.5 rounded-lg border border-slate-200/60 font-mono">
                <span className="text-slate-500">API Key (Anon):</span>
                <span className="text-slate-700 font-medium">
                  {supabaseAnonKey ? `${supabaseAnonKey.slice(0, 16)}...${supabaseAnonKey.slice(-6)}` : 'Chưa thiết lập'}
                </span>
              </div>
            </div>

            {/* Test result display */}
            {testResult && (
              <div
                className={`mt-3 p-3 rounded-lg border flex items-start gap-2.5 text-xs ${
                  testResult.connected
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}
              >
                {testResult.connected ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <div className="font-semibold flex items-center justify-between">
                    <span>{testResult.connected ? 'Kết nối thành công!' : 'Chưa kết nối được'}</span>
                    {testResult.latencyMs && (
                      <span className="text-[11px] font-mono text-emerald-700">
                        {testResult.latencyMs}ms
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] mt-0.5 text-slate-700 leading-relaxed">
                    {testResult.message}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action 1: Create Tables / SQL Script */}
          <div className="border border-slate-200 rounded-xl p-4 hover:border-slate-300 transition-colors">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 text-xs">
                    Khởi tạo bảng trong Supabase (SQL Script)
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Chạy câu lệnh SQL để tạo các bảng `classes`, `students`, `assignments`, `submissions`.
                  </p>
                </div>
              </div>

              <button
                onClick={handleCopySql}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs rounded-lg transition-colors shrink-0"
              >
                {copiedSql ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Đã chép SQL!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Sao chép mã SQL</span>
                  </>
                )}
              </button>
            </div>

            <div className="bg-slate-900 text-slate-200 rounded-lg p-3 font-mono text-[11px] overflow-x-auto max-h-32 border border-slate-800">
              <div className="text-slate-400 mb-1">// Dán vào Supabase Dashboard &gt; SQL Editor &gt; New Query &gt; Run</div>
              <pre className="text-emerald-400 whitespace-pre-wrap">{SUPABASE_SCHEMA_SQL.slice(0, 360)}...</pre>
            </div>
          </div>

          {/* Action 2: Seed Mock Data into Supabase */}
          <div className="border border-slate-200 rounded-xl p-4 hover:border-slate-300 transition-colors">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 text-xs">
                    Đẩy dữ liệu mẫu lên Supabase (Seed Database)
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Sau khi đã chạy mã SQL ở Bước 1, nhấn nút này để đưa toàn bộ lớp học, học sinh THPT Bình Long lên đám mây.
                  </p>
                </div>
              </div>

              <button
                onClick={handleSeedData}
                disabled={seeding}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-sm transition-all disabled:opacity-50 shrink-0"
              >
                <UploadCloud className={`w-3.5 h-3.5 ${seeding ? 'animate-bounce' : ''}`} />
                {seeding ? 'Đang đồng bộ...' : 'Đẩy dữ liệu lên'}
              </button>
            </div>

            {seedResult && (
              <div
                className={`mt-3 p-3 rounded-lg border text-xs ${
                  seedResult.success
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}
              >
                <div className="font-semibold">{seedResult.message}</div>
                {seedResult.counts && (
                  <div className="mt-1 text-[11px] text-slate-600 flex flex-wrap gap-2.5">
                    <span className="bg-white px-2 py-0.5 rounded border border-slate-200">📚 Lớp học: {seedResult.counts.classes}</span>
                    <span className="bg-white px-2 py-0.5 rounded border border-slate-200">👨‍🎓 Học sinh: {seedResult.counts.students}</span>
                    <span className="bg-white px-2 py-0.5 rounded border border-slate-200">📝 Đề bài: {seedResult.counts.assignments}</span>
                    {seedResult.counts.submissions !== undefined && (
                      <span className="bg-white px-2 py-0.5 rounded border border-slate-200">📑 Bài nộp: {seedResult.counts.submissions}</span>
                    )}
                    {seedResult.counts.khbd !== undefined && (
                      <span className="bg-white px-2 py-0.5 rounded border border-slate-200">📖 Giáo án: {seedResult.counts.khbd}</span>
                    )}
                    {seedResult.counts.users !== undefined && (
                      <span className="bg-white px-2 py-0.5 rounded border border-slate-200">👤 Tài khoản: {seedResult.counts.users}</span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Guide */}
          <div className="bg-blue-50/70 border border-blue-200/60 rounded-xl p-3.5 text-xs text-blue-900 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-medium">Cơ chế tự động thích ứng thông minh:</p>
              <p className="text-[11px] text-blue-800 leading-relaxed">
                Khi chưa có bảng trong Supabase hoặc mất mạng, hệ thống tự động duy trì dữ liệu bộ nhớ cục bộ để giáo viên và học sinh không bị gián đoạn bài giảng và làm bài thi.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <a
            href="https://supabase.com/dashboard/project/mwrfxpcwrvcagpdjjahy"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-emerald-700 font-medium transition-colors"
          >
            <span>Mở Supabase Dashboard</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
          >
            Đóng bảng điều khiển
          </button>
        </div>
      </div>
    </div>
  );
};
export default SupabaseSyncModal;
