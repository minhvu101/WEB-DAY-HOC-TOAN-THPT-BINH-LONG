import React, { useState } from 'react';
import { MOCK_STUDENTS } from '../data/mockData';
import {
  HeartHandshake,
  CheckCircle2,
  Calendar,
  MessageSquare,
  Award,
  BookOpen,
  Send,
  Clock,
  Sparkles,
} from 'lucide-react';

export const ParentPortal: React.FC = () => {
  const child = MOCK_STUDENTS[0]; // Tran Tuan Kiet
  const [parentMessage, setParentMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'Thầy Vũ (GVCN)',
      text: 'Chào bác Long! Em Kiệt học tập rất chăm chỉ, đặc biệt là phần Đạo hàm tiếp tuyến em giải quyết rất sáng tạo. Thầy chỉ lưu ý gia đình nhắc em ôn thêm phần xác suất để chuẩn bị cho kỳ thi giữa kỳ nhé.',
      time: '05/10/2026 18:30',
    },
  ]);
  const [sentToast, setSentToast] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentMessage.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        sender: 'Bác Long (Phụ huynh)',
        text: parentMessage,
        time: 'Vừa xong',
      },
    ]);
    setParentMessage('');
    setSentToast(true);
    setTimeout(() => setSentToast(false), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white p-6 md:p-8 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl">
              👨‍👦
            </div>
            <div>
              <span className="text-xs uppercase font-semibold text-emerald-200 tracking-wider">
                Sổ Liên Lạc Điện Tử Phụ Huynh · MathHub
              </span>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight">
                Kính chào Bác Trần Văn Long!
              </h1>
              <p className="text-xs text-emerald-100 mt-0.5">
                Theo dõi quá trình học tập của con: <strong>Trần Tuấn Kiệt</strong> (Lớp 11A6 · THPT Bình Long)
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-emerald-200 block">GVCN phụ trách</span>
            <span className="font-bold text-sm text-white">Thầy Nguyễn Minh Vũ</span>
            <span className="text-xs text-emerald-200 block font-mono">0912 345 678</span>
          </div>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs text-center">
          <span className="text-xs text-slate-500 block">Điểm trung bình</span>
          <span className="text-2xl font-extrabold text-blue-700 font-mono">{child.avgScore}</span>
          <span className="text-[11px] text-emerald-600 font-semibold">● Học lực Xuất sắc</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs text-center">
          <span className="text-xs text-slate-500 block">Tỉ lệ chuyên cần</span>
          <span className="text-2xl font-extrabold text-emerald-700 font-mono">{child.attendanceRate}%</span>
          <span className="text-[11px] text-slate-500">Đúng giờ, đủ tiết</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs text-center">
          <span className="text-xs text-slate-500 block">Bài tập hoàn thành</span>
          <span className="text-2xl font-extrabold text-slate-900 font-mono">{child.homeworkCompleted}/48</span>
          <span className="text-[11px] text-slate-500">Đạt 95.8%</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs text-center">
          <span className="text-xs text-slate-500 block">Chuỗi ngày học liên tục</span>
          <span className="text-2xl font-extrabold text-orange-600 font-mono">{child.streakDays} ngày</span>
          <span className="text-[11px] text-orange-600 font-semibold">Tự giác học hằng ngày</span>
        </div>
      </div>

      {/* Main Grid: Learning History & Direct Teacher Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Child Learning Details (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4 text-xs">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span>Kết Quả Học Tập Mới Nhất Của Con</span>
          </h3>

          <div className="space-y-2.5">
            {child.recentScores.map((score, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-slate-900 text-xs block">{score.title}</span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    Ngày làm: {score.date} · Trắc nghiệm: {score.scoreTN} · Tự luận: {score.scoreTL}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-base font-extrabold text-blue-700 font-mono">
                    {score.total} đ
                  </span>
                  <span className="text-[10px] text-emerald-600 block font-semibold">Đã hoàn thành</span>
                </div>
              </div>
            ))}
          </div>

          {/* Teacher remark */}
          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-1.5">
            <span className="font-bold text-blue-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Lời nhận xét của Thầy Nguyễn Minh Vũ:</span>
            </span>
            <p className="text-slate-700 italic">"{child.notes}"</p>
          </div>
        </div>

        {/* Direct Chat with Teacher (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between space-y-4 text-xs">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>Trao Đổi Trực Tiếp Với GVCN</span>
              </h3>
              <span className="text-[11px] text-emerald-600 font-medium">Trực tuyến</span>
            </div>

            {/* Chat Box */}
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-xl border ${
                    msg.sender.includes('Bác Long')
                      ? 'bg-emerald-50 border-emerald-200 ml-4'
                      : 'bg-slate-50 border-slate-200 mr-4'
                  }`}
                >
                  <div className="flex justify-between items-center text-[10px] text-slate-400 mb-1">
                    <span className="font-bold text-slate-700">{msg.sender}</span>
                    <span>{msg.time}</span>
                  </div>
                  <p className="text-slate-700 text-xs leading-relaxed">{msg.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Message Input Form */}
          <form onSubmit={handleSendMessage} className="space-y-2 pt-2 border-t border-slate-100">
            <textarea
              rows={2}
              placeholder="Gửi lời nhắn cho Thầy Vũ..."
              value={parentMessage}
              onChange={(e) => setParentMessage(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 focus:ring-1 focus:ring-emerald-500"
            />
            {sentToast && (
              <span className="text-[11px] text-emerald-700 font-semibold block">
                ✓ Tin nhắn đã được gửi tới Thầy Vũ!
              </span>
            )}
            <button
              type="submit"
              disabled={!parentMessage.trim()}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Gửi tin nhắn</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ParentPortal;
