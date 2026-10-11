import React, { useState } from 'react';
import { Printer, Download, Check, Info, FileSpreadsheet, Sparkles } from 'lucide-react';

interface OMRAnswerSheetProps {
  examCode?: string;
  examTitle?: string;
  schoolName?: string;
  part1Count?: number;
  part2Count?: number;
  part3Count?: number;
}

export const OMRAnswerSheet: React.FC<OMRAnswerSheetProps> = ({
  examCode = '101',
  examTitle = 'ĐỀ KIỂM TRA ĐÁNH GIÁ NĂNG LỰC TOÁN HỌC',
  schoolName = 'TRƯỜNG THPT CHUYÊN LƯƠNG THẾ VINH',
  part1Count = 12,
  part2Count = 4,
  part3Count = 6,
}) => {
  const [candidateName, setCandidateName] = useState('NGUYỄN VĂN AN');
  const [candidateDob, setCandidateDob] = useState('15/08/2007');
  const [candidateClass, setCandidateClass] = useState('11A6');
  const [candidateRoom, setCandidateRoom] = useState('P.204');
  const [candidateId, setCandidateId] = useState('024519'); // 6 digits
  const [sheetExamCode, setSheetExamCode] = useState(examCode || '101'); // 3 digits
  const [showSampleFill, setShowSampleFill] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const candidateIdDigits = (candidateId.padEnd(6, '0')).slice(0, 6).split('');
  const examCodeDigits = (sheetExamCode.padEnd(3, '0')).slice(0, 3).split('');

  return (
    <div className="space-y-4">
      {/* Action Bar (hidden when printing) */}
      <div className="no-print bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              Phiếu Trả Lời Trắc Nghiệm Chuẩn Bộ GD&ĐT (Định Dạng Mới 2025)
            </h3>
            <p className="text-[11px] text-slate-500">
              Thiết kế chuẩn kích thước OMR A4 · Hỗ trợ máy quét và app quét điểm tự động bằng điện thoại
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSampleFill(!showSampleFill)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer flex items-center gap-1.5 ${
              showSampleFill
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{showSampleFill ? 'Ẩn tô mẫu' : 'Hiển thị tô mẫu chuẩn'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>In Phiếu Trắc Nghiệm (Khổ A4)</span>
          </button>
        </div>
      </div>

      {/* Printable Sheet Wrapper */}
      <div className="bg-slate-100 p-2 sm:p-6 rounded-2xl border border-slate-200 overflow-x-auto flex justify-center">
        <div
          id="omr-printable-area"
          className="bg-white w-[210mm] min-h-[297mm] p-6 text-slate-900 shadow-lg border border-slate-300 relative text-xs font-sans leading-tight print:shadow-none print:border-none print:p-4 print:w-full"
          style={{ boxSizing: 'border-box' }}
        >
          {/* OMR Corner Alignment Marks */}
          <div className="absolute top-2 left-2 w-4 h-4 bg-black"></div>
          <div className="absolute top-2 right-2 w-4 h-4 bg-black"></div>
          <div className="absolute bottom-2 left-2 w-4 h-4 bg-black"></div>
          <div className="absolute bottom-2 right-2 w-4 h-4 bg-black"></div>

          {/* Sheet Header */}
          <div className="grid grid-cols-12 gap-2 pb-2 border-b-2 border-black">
            <div className="col-span-4 text-center border-r border-slate-300 pr-2">
              <div className="font-bold text-[10px] uppercase">BỘ GIÁO DỤC VÀ ĐÀO TẠO</div>
              <div className="font-extrabold text-[11px] uppercase mt-0.5">{schoolName}</div>
              <div className="text-[9px] text-slate-600 mt-0.5">HỘI ĐỒNG KHẢO THÍ QUỐC GIA</div>
            </div>

            <div className="col-span-8 text-center pl-2">
              <div className="font-extrabold text-sm uppercase tracking-wide text-rose-700 print:text-black">
                PHIẾU TRẢ LỜI TRẮC NGHIỆM ĐỊNH DẠNG MỚI (BGD 2025)
              </div>
              <div className="text-[10px] font-bold text-slate-800 uppercase mt-0.5">
                MÔN THI: TOÁN HỌC · {examTitle}
              </div>
              <div className="text-[9px] text-slate-500 italic mt-0.5">
                (Thí sinh lưu ý: Dùng bút chì 2B tô kín và đậm các ô tròn tương ứng)
              </div>
            </div>
          </div>

          {/* Section: Candidate Info & OMR SBD / Code Grid */}
          <div className="grid grid-cols-12 gap-3 my-2 pb-2 border-b border-slate-400">
            {/* Left 6 cols: Hand-written Candidate Info */}
            <div className="col-span-6 space-y-1.5 text-[11px] pr-2">
              <div className="font-bold text-[11px] uppercase bg-slate-100 p-1 border border-slate-300 text-center">
                THÔNG TIN THÍ SINH
              </div>
              <div className="flex items-center gap-1">
                <span className="font-semibold w-24">1. Họ và tên:</span>
                <span className="flex-1 border-b border-dotted border-black font-bold uppercase pl-1">
                  {candidateName}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-semibold w-24">2. Ngày sinh:</span>
                <span className="flex-1 border-b border-dotted border-black pl-1">{candidateDob}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-semibold w-24">3. Lớp / Phòng:</span>
                <span className="flex-1 border-b border-dotted border-black font-semibold pl-1">
                  {candidateClass} · Phòng {candidateRoom}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-semibold w-24">4. Chữ ký CBCT:</span>
                <span className="flex-1 border-b border-dotted border-black text-[9px] text-slate-400 pl-1">
                  (CBCT 1 ký & ghi rõ họ tên)
                </span>
              </div>

              {/* Instructions banner */}
              <div className="mt-2 p-1.5 border border-dashed border-slate-400 rounded bg-amber-50/70 print:bg-white text-[9px] space-y-0.5">
                <div className="font-bold text-slate-800 uppercase flex items-center gap-1">
                  <Info className="w-3 h-3 text-amber-600 no-print" />
                  <span>Quy định tô phiếu:</span>
                </div>
                <div>• ĐÚNG: Tô kín ô tròn ● (Không gạch chéo ✕, không đánh dấu ✓).</div>
                <div>• Thay đổi đáp án: Tẩy thật sạch ô cũ rồi mới tô ô mới.</div>
              </div>
            </div>

            {/* Middle 3 cols: SỐ BÁO DANH (6 digits) */}
            <div className="col-span-3 border border-black p-1 text-center bg-slate-50/40 print:bg-white">
              <div className="font-bold text-[10px] uppercase border-b border-black pb-0.5">
                SỐ BÁO DANH
              </div>
              {/* Digit boxes */}
              <div className="grid grid-cols-6 gap-0.5 my-1">
                {candidateIdDigits.map((d, i) => (
                  <div key={i} className="h-5 border border-black font-mono font-bold flex items-center justify-center text-xs bg-white">
                    {d}
                  </div>
                ))}
              </div>
              {/* Bubble Grid (0-9) */}
              <div className="grid grid-cols-6 gap-0.5 text-[9px]">
                {Array.from({ length: 10 }).map((_, rowNum) => (
                  <React.Fragment key={rowNum}>
                    {candidateIdDigits.map((d, colIdx) => {
                      const isFilled = showSampleFill && parseInt(d, 10) === rowNum;
                      return (
                        <div
                          key={`${colIdx}-${rowNum}`}
                          className={`w-3.5 h-3.5 mx-auto rounded-full border border-black flex items-center justify-center font-mono text-[8px] transition-colors ${
                            isFilled ? 'bg-black text-white font-bold' : 'hover:bg-slate-200'
                          }`}
                        >
                          {rowNum}
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Right 3 cols: MÃ ĐỀ THI (3 digits) */}
            <div className="col-span-3 border border-black p-1 text-center bg-slate-50/40 print:bg-white">
              <div className="font-bold text-[10px] uppercase border-b border-black pb-0.5 text-blue-800 print:text-black">
                MÃ ĐỀ THI
              </div>
              {/* Digit boxes */}
              <div className="grid grid-cols-3 gap-1 my-1">
                {examCodeDigits.map((d, i) => (
                  <div key={i} className="h-5 border border-black font-mono font-bold flex items-center justify-center text-xs bg-white text-blue-700 print:text-black">
                    {d}
                  </div>
                ))}
              </div>
              {/* Bubble Grid (0-9) */}
              <div className="grid grid-cols-3 gap-1 text-[9px]">
                {Array.from({ length: 10 }).map((_, rowNum) => (
                  <React.Fragment key={rowNum}>
                    {examCodeDigits.map((d, colIdx) => {
                      const isFilled = showSampleFill && parseInt(d, 10) === rowNum;
                      return (
                        <div
                          key={`${colIdx}-${rowNum}`}
                          className={`w-4 h-4 mx-auto rounded-full border border-black flex items-center justify-center font-mono text-[9px] ${
                            isFilled ? 'bg-black text-white font-bold' : 'hover:bg-slate-200'
                          }`}
                        >
                          {rowNum}
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* MAIN THREE PARTS ANSWER AREA */}
          <div className="grid grid-cols-12 gap-3">
            {/* PART I: 12 MCQ BUBBLE QUESTIONS (5 cols) */}
            <div className="col-span-5 border border-black p-2">
              <div className="font-bold text-[10px] uppercase bg-blue-50 print:bg-slate-100 p-1 border-b border-black text-center text-blue-900 print:text-black">
                PHẦN I: TRẮC NGHIỆM 4 ĐÁP ÁN ({part1Count} CÂU)
              </div>
              <div className="text-[8px] text-slate-500 text-center italic my-1">
                (Mỗi câu chọn đúng 1 phương án A, B, C hoặc D)
              </div>

              <div className="space-y-1 mt-1.5">
                {Array.from({ length: part1Count }).map((_, idx) => {
                  const qNum = idx + 1;
                  const sampleChosen = ['A', 'C', 'B', 'D', 'A', 'B', 'D', 'C', 'A', 'B', 'C', 'D'][idx % 12];

                  return (
                    <div key={qNum} className="flex items-center justify-between py-0.5 px-1 hover:bg-slate-50 border-b border-dotted border-slate-200">
                      <span className="font-mono font-bold text-[10px] w-6">{qNum}</span>
                      <div className="flex items-center gap-1.5">
                        {['A', 'B', 'C', 'D'].map((letter) => {
                          const isFilled = showSampleFill && sampleChosen === letter;
                          return (
                            <div
                              key={letter}
                              className={`w-4 h-4 rounded-full border border-black flex items-center justify-center font-mono text-[9px] font-semibold cursor-pointer ${
                                isFilled ? 'bg-black text-white' : 'hover:bg-slate-200'
                              }`}
                            >
                              {letter}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* PART II: 4 TRUE / FALSE QUESTIONS (4 cols) */}
            <div className="col-span-4 border border-black p-2">
              <div className="font-bold text-[10px] uppercase bg-emerald-50 print:bg-slate-100 p-1 border-b border-black text-center text-emerald-900 print:text-black">
                PHẦN II: ĐÚNG / SAI ({part2Count} CÂU)
              </div>
              <div className="text-[8px] text-slate-500 text-center italic my-1">
                (Thí sinh tô [Đ] hoặc [S] cho từng lệnh hỏi)
              </div>

              <div className="space-y-2 mt-1.5">
                {Array.from({ length: part2Count }).map((_, cIdx) => {
                  const qNum = cIdx + 1;
                  return (
                    <div key={qNum} className="border border-slate-300 rounded p-1 bg-slate-50/50 print:bg-white">
                      <div className="font-bold text-[9px] text-slate-700 border-b border-slate-200 pb-0.5 mb-1 flex justify-between">
                        <span>Câu {qNum}:</span>
                        <span className="text-[8px] text-slate-400">Đ/S</span>
                      </div>
                      <div className="grid grid-cols-4 gap-1">
                        {['a', 'b', 'c', 'd'].map((itemLet, iIdx) => {
                          const sampleVal = (cIdx + iIdx) % 2 === 0 ? 'Đ' : 'S';
                          return (
                            <div key={itemLet} className="text-center">
                              <span className="text-[9px] font-bold text-slate-600 block">{itemLet})</span>
                              <div className="flex flex-col gap-0.5 items-center mt-0.5">
                                <div
                                  className={`w-3.5 h-3.5 rounded-full border border-black flex items-center justify-center text-[7px] font-bold cursor-pointer ${
                                    showSampleFill && sampleVal === 'Đ' ? 'bg-black text-white' : 'hover:bg-slate-200'
                                  }`}
                                >
                                  Đ
                                </div>
                                <div
                                  className={`w-3.5 h-3.5 rounded-full border border-black flex items-center justify-center text-[7px] font-bold cursor-pointer ${
                                    showSampleFill && sampleVal === 'S' ? 'bg-black text-white' : 'hover:bg-slate-200'
                                  }`}
                                >
                                  S
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* PART III: 6 SHORT ANSWER BUBBLE GRIDS (3 cols) */}
            <div className="col-span-3 border border-black p-2">
              <div className="font-bold text-[10px] uppercase bg-indigo-50 print:bg-slate-100 p-1 border-b border-black text-center text-indigo-900 print:text-black">
                PHẦN III: TRẢ LỜI NGẮN ({part3Count} CÂU)
              </div>
              <div className="text-[8px] text-slate-500 text-center italic my-1">
                (Tô dấu âm/dương & các chữ số)
              </div>

              <div className="space-y-1.5 mt-1">
                {Array.from({ length: part3Count }).map((_, sIdx) => {
                  const qNum = sIdx + 1;
                  return (
                    <div key={qNum} className="border border-slate-300 rounded p-1 bg-white">
                      <div className="flex items-center justify-between text-[9px] font-bold border-b border-slate-200 pb-0.5">
                        <span>Câu {qNum}:</span>
                        <span className="font-mono text-indigo-700 print:text-black">
                          {showSampleFill ? (sIdx === 0 ? '-3.5' : sIdx === 1 ? '12' : '4') : '______'}
                        </span>
                      </div>
                      {/* Mini digit grid */}
                      <div className="grid grid-cols-4 gap-0.5 pt-1 text-[8px] text-center">
                        {/* Sign Column */}
                        <div>
                          <span className="text-[7px] text-slate-400">Dấu</span>
                          <div className="flex flex-col gap-0.5 mt-0.5 items-center">
                            <div className="w-3 h-3 rounded-full border border-black flex items-center justify-center text-[7px]">-</div>
                            <div className="w-3 h-3 rounded-full border border-black flex items-center justify-center text-[7px]">+</div>
                          </div>
                        </div>

                        {/* Digits 1, 2, 3 */}
                        {[1, 2, 3].map((col) => (
                          <div key={col}>
                            <span className="text-[7px] text-slate-400">C{col}</span>
                            <div className="flex flex-col gap-0.5 mt-0.5 items-center">
                              {[0, 1, 2, 5, 8].map((num) => (
                                <div key={num} className="w-3 h-3 rounded-full border border-black flex items-center justify-center text-[6px]">
                                  {num}
                                </div>
                              ))}
                              <div className="w-3 h-3 rounded-full border border-black flex items-center justify-center text-[6px]">,</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer Bar */}
          <div className="mt-4 pt-2 border-t border-black flex justify-between items-center text-[9px] text-slate-600">
            <div>Thí sinh không được viết, tẩy xóa hoặc vẽ bậy lên phần mã vạch OMR</div>
            <div className="font-mono font-bold">MÃ PHIẾU: BGD-2025-MAT-V1</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OMRAnswerSheet;
