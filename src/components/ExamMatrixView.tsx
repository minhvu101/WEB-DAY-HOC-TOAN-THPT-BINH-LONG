import React, { useState } from 'react';
import { Download, Table, Layers, CheckCircle2, FileText, Info } from 'lucide-react';

interface ExamMatrixViewProps {
  grade?: number;
  examTitle?: string;
  onExportDocx?: () => void;
}

export const ExamMatrixView: React.FC<ExamMatrixViewProps> = ({
  grade = 11,
  examTitle = 'ĐỀ KIỂM TRA ĐÁNH GIÁ ĐỊNH KỲ MÔN TOÁN',
  onExportDocx,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'matrix_table' | 'spec_table'>('matrix_table');

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-5 text-xs">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">
              Khung Chuẩn Chương Trình GDPT 2018 · Bộ GD&ĐT 2025
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
            Khung Ma Trận & Bản Đặc Tả Đề Kiểm Tra 2 Chiều
          </h2>
          <p className="text-xs text-slate-500">
            Phân định rõ mạch kiến thức, năng lực toán học cần đánh giá và các mức độ nhận thức
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onExportDocx && (
            <button
              onClick={onExportDocx}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs text-xs"
            >
              <Download className="w-4 h-4" />
              <span>Xuất Ma Trận Ra Word (.docx)</span>
            </button>
          )}
        </div>
      </div>

      {/* Subtab Toggle */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSubTab('matrix_table')}
          className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeSubTab === 'matrix_table'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Table className="w-3.5 h-3.5" />
          <span>1. Bảng Ma Trận 2 Chiều Chuẩn Tỷ Lệ (30 - 40 - 20 - 10)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('spec_table')}
          className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeSubTab === 'spec_table'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>2. Bản Đặc Tả Yêu Cầu Cần Đạt (YCCĐ) Chi Tiết</span>
        </button>
      </div>

      {/* VIEW 1: 2D MATRIX TABLE */}
      {activeSubTab === 'matrix_table' && (
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-slate-300 text-[11px] text-center">
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-bold">
                  <th rowSpan={2} className="border border-slate-300 p-2 w-8">TT</th>
                  <th rowSpan={2} className="border border-slate-300 p-2 text-left min-w-[140px]">Chủ đề / Đơn vị kiến thức</th>
                  <th colSpan={3} className="border border-slate-300 p-1.5 bg-blue-50/70 text-blue-900">1. Nhận biết (30%)</th>
                  <th colSpan={3} className="border border-slate-300 p-1.5 bg-emerald-50/70 text-emerald-900">2. Thông hiểu (40%)</th>
                  <th colSpan={3} className="border border-slate-300 p-1.5 bg-amber-50/70 text-amber-900">3. Vận dụng (20%)</th>
                  <th colSpan={3} className="border border-slate-300 p-1.5 bg-rose-50/70 text-rose-900">4. Vận dụng cao (10%)</th>
                  <th rowSpan={2} className="border border-slate-300 p-2 bg-slate-200 font-extrabold">Tổng câu</th>
                  <th rowSpan={2} className="border border-slate-300 p-2 bg-slate-200 font-extrabold">Điểm</th>
                </tr>
                <tr className="bg-slate-50 text-[10px] text-slate-600 font-semibold">
                  {/* Nhận biết */}
                  <th className="border border-slate-300 p-1">P.I</th>
                  <th className="border border-slate-300 p-1">P.II</th>
                  <th className="border border-slate-300 p-1">P.III</th>
                  {/* Thông hiểu */}
                  <th className="border border-slate-300 p-1">P.I</th>
                  <th className="border border-slate-300 p-1">P.II</th>
                  <th className="border border-slate-300 p-1">P.III</th>
                  {/* Vận dụng */}
                  <th className="border border-slate-300 p-1">P.I</th>
                  <th className="border border-slate-300 p-1">P.II</th>
                  <th className="border border-slate-300 p-1">P.III</th>
                  {/* Vận dụng cao */}
                  <th className="border border-slate-300 p-1">P.I</th>
                  <th className="border border-slate-300 p-1">P.II</th>
                  <th className="border border-slate-300 p-1">P.III</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-300 p-2 font-mono">1</td>
                  <td className="border border-slate-300 p-2 text-left font-medium">Hàm số & Khảo sát sự biến thiên</td>
                  <td className="border border-slate-300 p-1.5 bg-blue-50/30 font-bold">3</td>
                  <td className="border border-slate-300 p-1.5 bg-blue-50/30">1</td>
                  <td className="border border-slate-300 p-1.5 bg-blue-50/30">0</td>
                  <td className="border border-slate-300 p-1.5 bg-emerald-50/30 font-bold">3</td>
                  <td className="border border-slate-300 p-1.5 bg-emerald-50/30 font-bold">1</td>
                  <td className="border border-slate-300 p-1.5 bg-emerald-50/30 font-bold">1</td>
                  <td className="border border-slate-300 p-1.5 bg-amber-50/30 font-bold">0</td>
                  <td className="border border-slate-300 p-1.5 bg-amber-50/30 font-bold">1</td>
                  <td className="border border-slate-300 p-1.5 bg-amber-50/30 font-bold">1</td>
                  <td className="border border-slate-300 p-1.5 bg-rose-50/30">0</td>
                  <td className="border border-slate-300 p-1.5 bg-rose-50/30">0</td>
                  <td className="border border-slate-300 p-1.5 bg-rose-50/30 font-bold">1</td>
                  <td className="border border-slate-300 p-1.5 font-bold bg-slate-100">12 câu</td>
                  <td className="border border-slate-300 p-1.5 font-bold font-mono text-blue-700">4.5 đ</td>
                </tr>

                <tr>
                  <td className="border border-slate-300 p-2 font-mono">2</td>
                  <td className="border border-slate-300 p-2 text-left font-medium">Đạo hàm và Ý nghĩa vật lý, tiếp tuyến</td>
                  <td className="border border-slate-300 p-1.5 bg-blue-50/30 font-bold">2</td>
                  <td className="border border-slate-300 p-1.5 bg-blue-50/30">0</td>
                  <td className="border border-slate-300 p-1.5 bg-blue-50/30 font-bold">1</td>
                  <td className="border border-slate-300 p-1.5 bg-emerald-50/30 font-bold">2</td>
                  <td className="border border-slate-300 p-1.5 bg-emerald-50/30 font-bold">1</td>
                  <td className="border border-slate-300 p-1.5 bg-emerald-50/30">0</td>
                  <td className="border border-slate-300 p-1.5 bg-amber-50/30 font-bold">1</td>
                  <td className="border border-slate-300 p-1.5 bg-amber-50/30">0</td>
                  <td className="border border-slate-300 p-1.5 bg-amber-50/30 font-bold">1</td>
                  <td className="border border-slate-300 p-1.5 bg-rose-50/30">0</td>
                  <td className="border border-slate-300 p-1.5 bg-rose-50/30">0</td>
                  <td className="border border-slate-300 p-1.5 bg-rose-50/30 font-bold">1</td>
                  <td className="border border-slate-300 p-1.5 font-bold bg-slate-100">9 câu</td>
                  <td className="border border-slate-300 p-1.5 font-bold font-mono text-blue-700">3.5 đ</td>
                </tr>

                <tr>
                  <td className="border border-slate-300 p-2 font-mono">3</td>
                  <td className="border border-slate-300 p-2 text-left font-medium">Hình học không gian & Khoảng cách</td>
                  <td className="border border-slate-300 p-1.5 bg-blue-50/30 font-bold">1</td>
                  <td className="border border-slate-300 p-1.5 bg-blue-50/30">0</td>
                  <td className="border border-slate-300 p-1.5 bg-blue-50/30">0</td>
                  <td className="border border-slate-300 p-1.5 bg-emerald-50/30 font-bold">1</td>
                  <td className="border border-slate-300 p-1.5 bg-emerald-50/30 font-bold">1</td>
                  <td className="border border-slate-300 p-1.5 bg-emerald-50/30">0</td>
                  <td className="border border-slate-300 p-1.5 bg-amber-50/30 font-bold">0</td>
                  <td className="border border-slate-300 p-1.5 bg-amber-50/30">0</td>
                  <td className="border border-slate-300 p-1.5 bg-amber-50/30 font-bold">1</td>
                  <td className="border border-slate-300 p-1.5 bg-rose-50/30">0</td>
                  <td className="border border-slate-300 p-1.5 bg-rose-50/30">0</td>
                  <td className="border border-slate-300 p-1.5 bg-rose-50/30">0</td>
                  <td className="border border-slate-300 p-1.5 font-bold bg-slate-100">4 câu</td>
                  <td className="border border-slate-300 p-1.5 font-bold font-mono text-blue-700">2.0 đ</td>
                </tr>

                {/* Total Row */}
                <tr className="bg-slate-200 font-extrabold text-slate-900">
                  <td colSpan={2} className="border border-slate-300 p-2 text-right">
                    TỔNG CỘNG THEO MỨC ĐỘ:
                  </td>
                  <td colSpan={3} className="border border-slate-300 p-2 text-blue-800">
                    6 câu · 3.0 điểm (30%)
                  </td>
                  <td colSpan={3} className="border border-slate-300 p-2 text-emerald-800">
                    9 câu · 4.0 điểm (40%)
                  </td>
                  <td colSpan={3} className="border border-slate-300 p-2 text-amber-800">
                    4 câu · 2.0 điểm (20%)
                  </td>
                  <td colSpan={3} className="border border-slate-300 p-2 text-rose-800">
                    2 câu · 1.0 điểm (10%)
                  </td>
                  <td className="border border-slate-300 p-2">22 câu</td>
                  <td className="border border-slate-300 p-2 font-mono text-indigo-700">10.0 đ</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200 flex items-start gap-2 text-[11px] text-blue-900">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <b>Ghi chú quy cách:</b> P.I (Phần I - Trắc nghiệm 4 đáp án: 0,25đ/câu); P.II (Phần II - Đúng/Sai 4 ý: 1,0đ/câu); P.III (Phần III - Trả lời ngắn: 0,5đ/câu).
              Tỉ lệ phân bổ điểm đạt chuẩn quy chuẩn đề tốt nghiệp THPT và kiểm tra định kỳ 2025.
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: SPECIFICATION GUIDE (BẢN ĐẶC TẢ) */}
      {activeSubTab === 'spec_table' && (
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-slate-300 text-[11px]">
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-bold text-center">
                  <th className="border border-slate-300 p-2 w-8">TT</th>
                  <th className="border border-slate-300 p-2 text-left w-48">Mạch nội dung</th>
                  <th className="border border-slate-300 p-2 text-left">Yêu cầu cần đạt (YCCĐ) theo CT GDPT 2018</th>
                  <th className="border border-slate-300 p-2 w-16">Mức độ</th>
                  <th className="border border-slate-300 p-2 w-20">Câu hỏi</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-300 p-2 text-center font-mono">1</td>
                  <td className="border border-slate-300 p-2 font-bold text-slate-900">Khảo sát hàm số</td>
                  <td className="border border-slate-300 p-2 leading-relaxed">
                    - Nhận biết tính đồng biến, nghịch biến của hàm số thông qua bảng biến thiên hoặc đồ thị hàm số $f'(x)$.<br/>
                    - Xác định toạ độ các điểm cực đại, cực tiểu của hàm số đa thức bậc ba.
                  </td>
                  <td className="border border-slate-300 p-2 text-center font-semibold text-blue-700 bg-blue-50">
                    Nhận biết
                  </td>
                  <td className="border border-slate-300 p-2 text-center font-mono font-bold">Câu 1, 2 (P.I)</td>
                </tr>

                <tr>
                  <td className="border border-slate-300 p-2 text-center font-mono">2</td>
                  <td className="border border-slate-300 p-2 font-bold text-slate-900">Tiệm cận & Đồ thị</td>
                  <td className="border border-slate-300 p-2 leading-relaxed">
                    - Tìm đường tiệm cận đứng, tiệm cận ngang và tiệm cận xiên của đồ thị hàm phân thức hữu tỉ.<br/>
                    - Phân tích tương giao giữa đồ thị và đường thẳng để tìm số nghiệm của phương trình.
                  </td>
                  <td className="border border-slate-300 p-2 text-center font-semibold text-emerald-700 bg-emerald-50">
                    Thông hiểu
                  </td>
                  <td className="border border-slate-300 p-2 text-center font-mono font-bold">Câu 3, 4 (P.I)<br/>Câu 1 (P.II)</td>
                </tr>

                <tr>
                  <td className="border border-slate-300 p-2 text-center font-mono">3</td>
                  <td className="border border-slate-300 p-2 font-bold text-slate-900">Ứng dụng thực tế & Tối ưu</td>
                  <td className="border border-slate-300 p-2 leading-relaxed">
                    - Vận dụng kiến thức đạo hàm để giải bài toán tối ưu hóa trong kinh tế, vật lý (tìm chi phí nhỏ nhất, thể tích chứa lớn nhất).<br/>
                    - Thiết lập mô hình toán học từ tình huống thực tế và điền kết quả vào ô số.
                  </td>
                  <td className="border border-slate-300 p-2 text-center font-semibold text-rose-700 bg-rose-50">
                    Vận dụng cao
                  </td>
                  <td className="border border-slate-300 p-2 text-center font-mono font-bold">Câu 5, 6 (P.III)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamMatrixView;
