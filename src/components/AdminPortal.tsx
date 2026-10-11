import React from 'react';
import { MOCK_CLASSES } from '../data/mockData';
import { Shield, Users, BookOpen, Award, CheckCircle, BarChart3, School } from 'lucide-react';

export const AdminPortal: React.FC = () => {
  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-6 md:p-8 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl">
              🏫
            </div>
            <div>
              <span className="text-xs uppercase font-semibold text-purple-200 tracking-wider">
                Trung Tâm Quản Trị Hệ Thống · THPT Bình Long
              </span>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight">
                Báo Cáo Tổng Thể Ban Giám Hiệu
              </h1>
              <p className="text-xs text-purple-100 mt-0.5">
                Giám sát việc đổi mới dạy học và chuyển đổi số theo CTGDPT 2018
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-purple-200 block">Năm học</span>
            <span className="font-bold text-sm text-white">2026 - 2027</span>
          </div>
        </div>
      </div>

      {/* 4 KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs text-center">
          <span className="text-xs text-slate-500 block">Toàn trường</span>
          <span className="text-2xl font-extrabold text-slate-900 font-mono">12 Lớp</span>
          <span className="text-[11px] text-slate-500">Khối 10, 11, 12</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs text-center">
          <span className="text-xs text-slate-500 block">Tổng số học sinh</span>
          <span className="text-2xl font-extrabold text-blue-700 font-mono">420 HS</span>
          <span className="text-[11px] text-emerald-600 font-semibold">100% hồ sơ số hóa</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs text-center">
          <span className="text-xs text-slate-500 block">Chuyên cần trường</span>
          <span className="text-2xl font-extrabold text-emerald-700 font-mono">96.4%</span>
          <span className="text-[11px] text-emerald-600">Đạt chỉ tiêu xuất sắc</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs text-center">
          <span className="text-xs text-slate-500 block">Tỉ lệ hoàn thành CTGDPT</span>
          <span className="text-2xl font-extrabold text-purple-700 font-mono">92.8%</span>
          <span className="text-[11px] text-purple-600">Theo tiến độ tuần 6</span>
        </div>
      </div>

      {/* Classes Capacity & Performance Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">
            Bảng Thống Kê Các Lớp Học Thuộc Tổ Toán Tin
          </h2>
          <span className="text-xs text-slate-500">Dữ liệu cập nhật theo thời gian thực</span>
        </div>

        <div className="border border-slate-200 rounded-xl overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Lớp</th>
                <th className="py-2.5 px-3">Khối</th>
                <th className="py-2.5 px-3">GVCN</th>
                <th className="py-2.5 px-3">Sĩ số</th>
                <th className="py-2.5 px-3">Chuyên cần</th>
                <th className="py-2.5 px-3">Học lực Giỏi</th>
                <th className="py-2.5 px-3">HS Cần Phụ Đạo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {MOCK_CLASSES.map((cls) => (
                <tr key={cls.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-sans font-bold text-slate-900">{cls.name}</td>
                  <td className="py-2.5 px-3 text-slate-600">Khối {cls.grade}</td>
                  <td className="py-2.5 px-3 font-sans text-slate-800">{cls.homeroomTeacher}</td>
                  <td className="py-2.5 px-3 text-slate-700">{cls.totalStudents}</td>
                  <td className="py-2.5 px-3 font-bold text-emerald-600">{cls.attendanceRate}%</td>
                  <td className="py-2.5 px-3 text-blue-600">{cls.gradeDistribution.gioi} HS</td>
                  <td className="py-2.5 px-3 text-rose-600">{cls.weakCount} HS</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPortal;
