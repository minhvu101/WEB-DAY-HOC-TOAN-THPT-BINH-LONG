import React, { useState } from 'react';
import { MOCK_HOMEROOM_LOGS, MOCK_STUDENTS } from '../data/mockData';
import { HomeroomLog } from '../types';
import {
  Users,
  CheckCircle,
  Clock,
  AlertTriangle,
  HeartHandshake,
  PhoneCall,
  Calendar,
  Sparkles,
  Plus,
  Save,
  Check,
} from 'lucide-react';

export const HomeroomView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'daily' | 'attendance' | 'discipline' | 'parents'>('daily');
  const [logs, setLogs] = useState<HomeroomLog[]>(MOCK_HOMEROOM_LOGS);
  const [showAddLogModal, setShowAddLogModal] = useState(false);
  const [newDutyGroup, setNewDutyGroup] = useState('Tổ 3');
  const [newPresentCount, setNewPresentCount] = useState(37);
  const [newLateCount, setNewLateCount] = useState(0);
  const [newNotes, setNewNotes] = useState('Lớp học nghiêm túc, vệ sinh đạt chuẩn 10/10.');

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: HomeroomLog = {
      id: `LOG-${Date.now()}`,
      date: '07/10/2026',
      week: 6,
      attendancePresent: newPresentCount,
      attendanceLate: newLateCount,
      attendanceAbsent: 37 - newPresentCount,
      cleanlinessScore: 10,
      disciplineNotes: newNotes,
      specialEvents: 'Tiết sinh hoạt lớp định kỳ thứ 7.',
      dutyGroup: newDutyGroup,
    };
    setLogs((prev) => [newEntry, ...prev]);
    setShowAddLogModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
              Công Tác Giáo Viên Chủ Nhiệm
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 mt-1">
            Sổ Chủ Nhiệm Điện Tử Lớp 11A6
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            GVCN: Thầy Nguyễn Minh Vũ · Sĩ số: 37 học sinh · 4 tổ tự quản học tập.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddLogModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Ghi nhật ký nề nếp hôm nay</span>
          </button>
        </div>
      </div>

      {/* Quick Homeroom KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center shadow-xs">
          <span className="text-xs text-slate-500 block">Sĩ số hiện tại</span>
          <span className="text-2xl font-extrabold text-slate-900 font-mono">37/37</span>
          <span className="text-[11px] text-emerald-600 font-medium">Đủ 100%</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center shadow-xs">
          <span className="text-xs text-slate-500 block">Chuyên cần trung bình</span>
          <span className="text-2xl font-extrabold text-blue-700 font-mono">98.2%</span>
          <span className="text-[11px] text-blue-600 font-medium">Hạng 1 toàn khối 11</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center shadow-xs">
          <span className="text-xs text-slate-500 block">Điểm vệ sinh tuần</span>
          <span className="text-2xl font-extrabold text-emerald-700 font-mono">10/10</span>
          <span className="text-[11px] text-emerald-600 font-medium">Tổ 2 trực nhật</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center shadow-xs">
          <span className="text-xs text-slate-500 block">Học sinh cần quan tâm</span>
          <span className="text-2xl font-extrabold text-amber-600 font-mono">2 em</span>
          <span className="text-[11px] text-amber-600 font-medium">Đã liên hệ phụ huynh</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('daily')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'daily'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Nhật ký nề nếp theo ngày ({logs.length})
        </button>
        <button
          onClick={() => setActiveTab('parents')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'parents'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Sổ liên lạc & Phụ huynh học sinh
        </button>
      </div>

      {/* TAB 1: DAILY LOGS */}
      {activeTab === 'daily' && (
        <div className="space-y-3">
          {logs.map((log) => (
            <div
              key={log.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3 text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">
                    Ngày {log.date} (Tuần {log.week})
                  </span>
                  <span className="bg-purple-100 text-purple-800 font-semibold px-2 py-0.5 rounded text-[10px]">
                    Trực nhật: {log.dutyGroup}
                  </span>
                </div>
                <div className="flex items-center gap-3 font-mono text-slate-600">
                  <span>Có mặt: {log.attendancePresent}</span>
                  <span>Đi trễ: {log.attendanceLate}</span>
                  <span>Vệ sinh: {log.cleanlinessScore}/10 đ</span>
                </div>
              </div>

              <div className="space-y-1 text-slate-700">
                <div>
                  <span className="font-semibold text-slate-900">Nhận xét nề nếp: </span>
                  {log.disciplineNotes}
                </div>
                <div>
                  <span className="font-semibold text-slate-900">Sự kiện / Nhắc việc: </span>
                  {log.specialEvents}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: PARENTS LOG */}
      {activeTab === 'parents' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">Danh bạ & Lịch sử trao đổi với Phụ huynh</h3>
            <span className="text-slate-500 text-[11px]">Họp phụ huynh sắp tới: 15/10/2026</span>
          </div>

          <div className="space-y-3">
            {MOCK_STUDENTS.slice(0, 5).map((s) => (
              <div
                key={s.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{s.parentName}</span>
                    <span className="text-slate-500 font-mono text-[11px]">({s.parentPhone})</span>
                    <span className="text-purple-700 font-semibold text-[11px]">
                      Phụ huynh em {s.name}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Tình hình gần nhất: Điểm TB {s.avgScore} · Chuyên cần {s.attendanceRate}%
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${s.parentPhone}`}
                    className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors shadow-2xs"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Gọi điện</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Add Log */}
      {showAddLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Ghi nhật ký nề nếp 11A6 hôm nay</h3>
            <form onSubmit={handleAddLog} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Tổ trực nhật:</label>
                <select
                  value={newDutyGroup}
                  onChange={(e) => setNewDutyGroup(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="Tổ 1">Tổ 1</option>
                  <option value="Tổ 2">Tổ 2</option>
                  <option value="Tổ 3">Tổ 3</option>
                  <option value="Tổ 4">Tổ 4</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Số HS có mặt:</label>
                  <input
                    type="number"
                    value={newPresentCount}
                    onChange={(e) => setNewPresentCount(Number(e.target.value))}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Số HS đi trễ:</label>
                  <input
                    type="number"
                    value={newLateCount}
                    onChange={(e) => setNewLateCount(Number(e.target.value))}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Ghi chú nề nếp:</label>
                <textarea
                  rows={3}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddLogModal(false)}
                  className="px-3 py-1.5 text-slate-600"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-purple-600 text-white font-semibold rounded-lg"
                >
                  Lưu nhật ký
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeroomView;
