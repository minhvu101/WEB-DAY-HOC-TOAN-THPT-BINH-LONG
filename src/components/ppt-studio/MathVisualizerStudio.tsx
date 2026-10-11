import React, { useState } from 'react';
import MathFormula from '../MathFormula';
import {
  Sliders,
  Play,
  RotateCcw,
  Sparkles,
  Download,
  Plus,
  Layers,
  Compass,
  Activity,
  Box,
  TrendingUp,
  Dices,
} from 'lucide-react';

interface MathVisualizerStudioProps {
  onInsertToLecture?: (visualTitle: string, formula: string, note: string) => void;
}

export const MathVisualizerStudio: React.FC<MathVisualizerStudioProps> = ({
  onInsertToLecture,
}) => {
  const [activeTab, setActiveTab] = useState<'algebra' | 'calculus' | 'geometry' | 'probability'>('calculus');

  // 1. Calculus State: Tangent line to y = x^2 - 2x at x0
  const [x0, setX0] = useState<number>(2); // touch point
  const f = (x: number) => 0.5 * x * x - x - 1;
  const fPrime = (x: number) => x - 1;
  const y0 = f(x0);
  const k = fPrime(x0); // slope

  // 2. Algebra State: Parabola y = ax^2 + bx + c
  const [paramA, setParamA] = useState<number>(1);
  const [paramB, setParamB] = useState<number>(-2);
  const [paramC, setParamC] = useState<number>(-1);
  const vertexX = -paramB / (2 * paramA || 1);
  const vertexY = paramA * vertexX * vertexX + paramB * vertexX + paramC;
  const delta = paramB * paramB - 4 * paramA * paramC;

  // 3. Probability State: Dice Simulation
  const [diceHistory, setDiceHistory] = useState<number[]>([3, 5, 2, 6, 1, 4, 6, 5, 2, 4]);
  const [isRolling, setIsRolling] = useState(false);

  const rollDice = (times = 10) => {
    setIsRolling(true);
    setTimeout(() => {
      const newRolls: number[] = [];
      for (let i = 0; i < times; i++) {
        newRolls.push(Math.floor(Math.random() * 6) + 1);
      }
      setDiceHistory((prev) => [...newRolls, ...prev].slice(0, 50));
      setIsRolling(false);
    }, 300);
  };

  // SVG coordinate transformation
  // Canvas width 400, height 260; Origin (200, 150), scale 28 px per unit
  const toSvgX = (x: number) => 200 + x * 28;
  const toSvgY = (y: number) => 140 - y * 28;

  // Generate curve path for calculus f(x)
  const generateCalculusCurve = () => {
    let d = '';
    for (let x = -4; x <= 5; x += 0.2) {
      const sx = toSvgX(x);
      const sy = toSvgY(f(x));
      d += d === '' ? `M ${sx} ${sy}` : ` L ${sx} ${sy}`;
    }
    return d;
  };

  // Tangent line endpoints
  const tanX1 = x0 - 2.5;
  const tanY1 = y0 + k * (tanX1 - x0);
  const tanX2 = x0 + 2.5;
  const tanY2 = y0 + k * (tanX2 - x0);

  // Generate Parabola curve
  const generateParabolaCurve = () => {
    let d = '';
    for (let x = -5; x <= 5; x += 0.2) {
      const y = paramA * x * x + paramB * x + paramC;
      const sx = toSvgX(x);
      const sy = toSvgY(y);
      if (sy >= -50 && sy <= 350) {
        d += d === '' ? `M ${sx} ${sy}` : ` L ${sx} ${sy}`;
      }
    }
    return d;
  };

  return (
    <div className="bg-slate-900 text-slate-100 rounded-3xl border border-slate-800 p-6 shadow-xl space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
              Interactive Math Visualizer Studio
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            Thư Viện Trực Quan Hóa Toán Học Động
          </h2>
          <p className="text-xs text-slate-400">
            Mô phỏng bản chất toán học trực quan · Điều chỉnh tham số thời gian thực · Sẵn sàng chèn vào bài giảng
          </p>
        </div>

        {/* Tab pills */}
        <div className="flex bg-slate-800/80 p-1 rounded-2xl border border-slate-700/60 text-xs">
          <button
            onClick={() => setActiveTab('calculus')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'calculus'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Đạo hàm & Tiếp tuyến</span>
          </button>

          <button
            onClick={() => setActiveTab('algebra')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'algebra'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Hàm số Parabol</span>
          </button>

          <button
            onClick={() => setActiveTab('geometry')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'geometry'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>Hình không gian 3D</span>
          </button>

          <button
            onClick={() => setActiveTab('probability')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'probability'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Dices className="w-3.5 h-3.5" />
            <span>Xác suất Monte Carlo</span>
          </button>
        </div>
      </div>

      {/* 1. CALCULUS: TANGENT LINE SIMULATOR */}
      {activeTab === 'calculus' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Interactive Graph (7 cols) */}
          <div className="lg:col-span-7 bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-3 left-4 text-[11px] font-mono text-slate-400">
              Đồ thị hàm số: <span className="text-cyan-400 font-bold">y = 0.5x² - x - 1</span>
            </div>
            <div className="absolute top-3 right-4 text-[11px] font-mono text-amber-400">
              Tiếp tuyến tại x₀ = {x0.toFixed(1)}: k = f'(x₀) = {k.toFixed(2)}
            </div>

            <svg viewBox="0 0 400 260" className="w-full h-64 select-none">
              {/* Grid lines */}
              <defs>
                <pattern id="calcGrid" width="28" height="28" patternUnits="userSpaceOnUse">
                  <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#1e293b" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="400" height="260" fill="url(#calcGrid)" />

              {/* Axes */}
              <line x1="20" y1="140" x2="380" y2="140" stroke="#475569" strokeWidth="1.5" />
              <line x1="200" y1="20" x2="200" y2="240" stroke="#475569" strokeWidth="1.5" />
              <text x="385" y="145" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">x</text>
              <text x="205" y="20" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">y</text>
              <text x="190" y="152" fill="#64748b" fontSize="10" fontFamily="sans-serif">O</text>

              {/* Curve y = 0.5x^2 - x - 1 */}
              <path d={generateCalculusCurve()} fill="none" stroke="#38bdf8" strokeWidth="2.5" />

              {/* Tangent line */}
              <line
                x1={toSvgX(tanX1)}
                y1={toSvgY(tanY1)}
                x2={toSvgX(tanX2)}
                y2={toSvgY(tanY2)}
                stroke="#fbbf24"
                strokeWidth="2"
                strokeDasharray="4 2"
              />

              {/* Touch Point M0(x0, y0) */}
              <circle cx={toSvgX(x0)} cy={toSvgY(y0)} r="5" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />

              {/* Droplines */}
              <line
                x1={toSvgX(x0)}
                y1={toSvgY(y0)}
                x2={toSvgX(x0)}
                y2="140"
                stroke="#f59e0b"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              <text x={toSvgX(x0) - 8} y="155" fill="#fbbf24" fontSize="10" fontFamily="monospace">
                x₀={x0}
              </text>
            </svg>

            <div className="w-full text-center text-xs text-slate-400 mt-2">
              Kéo thanh trượt bên phải để quan sát tiếp tuyến di chuyển và đổi hệ số góc k = tan(α)
            </div>
          </div>

          {/* Controls & Math Insights (5 cols) */}
          <div className="lg:col-span-5 space-y-4 text-xs">
            {/* Slider */}
            <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/80 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-200">Hoành độ tiếp điểm (x₀):</span>
                <span className="font-mono text-cyan-400 font-bold text-sm">{x0.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="-2"
                max="4"
                step="0.1"
                value={x0}
                onChange={(e) => setX0(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>x₀ = -2.0</span>
                <span>x₀ = 1.0 (Đỉnh)</span>
                <span>x₀ = 4.0</span>
              </div>
            </div>

            {/* Step-by-step Math Analysis */}
            <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/60 space-y-2">
              <span className="font-bold text-amber-400 flex items-center gap-1.5 text-[11px]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ý nghĩa hình học & Phương trình tiếp tuyến:</span>
              </span>
              <div className="space-y-1 text-slate-300">
                <div>• Tọa độ tiếp điểm: <span className="font-mono text-cyan-300">M₀({x0.toFixed(1)}; {y0.toFixed(2)})</span></div>
                <div>• Hệ số góc: <span className="font-mono text-amber-300">k = f'({x0.toFixed(1)}) = {k.toFixed(2)}</span></div>
                <div className="p-2 bg-slate-900 rounded-lg border border-slate-800 font-mono text-emerald-400 font-bold mt-1">
                  (d): y - ({y0.toFixed(2)}) = {k.toFixed(2)}(x - {x0.toFixed(1)})
                </div>
              </div>
            </div>

            {/* Insert Button */}
            {onInsertToLecture && (
              <button
                onClick={() =>
                  onInsertToLecture(
                    `Tiếp tuyến của hàm số tại điểm x₀ = ${x0}`,
                    `y - ${y0.toFixed(1)} = ${k.toFixed(1)}(x - ${x0.toFixed(1)})`,
                    `Tiếp điểm M₀(${x0}; ${y0.toFixed(1)}), hệ số góc k = ${k.toFixed(1)}`
                  )
                }
                className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Chèn mô phỏng tiếp tuyến vào Slide hiện tại</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 2. ALGEBRA: PARABOLA WITH PARAMETERS */}
      {activeTab === 'algebra' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col items-center justify-center relative">
            <svg viewBox="0 0 400 260" className="w-full h-64">
              <defs>
                <pattern id="algGrid" width="28" height="28" patternUnits="userSpaceOnUse">
                  <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#1e293b" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="400" height="260" fill="url(#algGrid)" />

              {/* Axes */}
              <line x1="20" y1="140" x2="380" y2="140" stroke="#475569" strokeWidth="1.5" />
              <line x1="200" y1="20" x2="200" y2="240" stroke="#475569" strokeWidth="1.5" />
              <text x="385" y="145" fill="#94a3b8" fontSize="11">x</text>
              <text x="205" y="20" fill="#94a3b8" fontSize="11">y</text>

              {/* Parabola curve */}
              <path d={generateParabolaCurve()} fill="none" stroke="#22d3ee" strokeWidth="2.5" />

              {/* Vertex Point */}
              <circle cx={toSvgX(vertexX)} cy={toSvgY(vertexY)} r="5" fill="#f43f5e" stroke="#ffffff" strokeWidth="2" />
              <text x={toSvgX(vertexX) + 8} y={toSvgY(vertexY) - 5} fill="#fb7185" fontSize="10" fontFamily="monospace">
                I({vertexX.toFixed(1)}; {vertexY.toFixed(1)})
              </text>
            </svg>
          </div>

          <div className="lg:col-span-5 space-y-3 text-xs">
            <div className="p-3 bg-slate-800/60 rounded-xl space-y-2">
              <div className="flex justify-between">
                <span>Hệ số a (Bề lõm):</span>
                <span className="font-mono text-cyan-400 font-bold">{paramA}</span>
              </div>
              <input
                type="range"
                min="-3"
                max="3"
                step="0.5"
                value={paramA}
                onChange={(e) => setParamA(parseFloat(e.target.value) || 0.1)}
                className="w-full accent-cyan-400"
              />
            </div>

            <div className="p-3 bg-slate-800/60 rounded-xl space-y-2">
              <div className="flex justify-between">
                <span>Hệ số b:</span>
                <span className="font-mono text-cyan-400 font-bold">{paramB}</span>
              </div>
              <input
                type="range"
                min="-6"
                max="6"
                step="0.5"
                value={paramB}
                onChange={(e) => setParamB(parseFloat(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>

            <div className="p-3 bg-slate-800/60 rounded-xl space-y-2">
              <div className="flex justify-between">
                <span>Hệ số c (Giao Oy):</span>
                <span className="font-mono text-cyan-400 font-bold">{paramC}</span>
              </div>
              <input
                type="range"
                min="-5"
                max="5"
                step="0.5"
                value={paramC}
                onChange={(e) => setParamC(parseFloat(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>

            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 font-mono text-[11px] space-y-1">
              <div>Phương trình: <span className="text-cyan-300">y = {paramA}x² + ({paramB})x + ({paramC})</span></div>
              <div>Đỉnh Parabol: <span className="text-rose-400">I({vertexX.toFixed(2)}; {vertexY.toFixed(2)})</span></div>
              <div>Biệt thức Δ: <span className="text-amber-400">{delta.toFixed(2)}</span> ({delta > 0 ? '2 nghiệm phân biệt' : delta === 0 ? 'Nghiệm kép' : 'Vô nghiệm'})</div>
            </div>
          </div>
        </div>
      )}

      {/* 3. GEOMETRY 3D */}
      {activeTab === 'geometry' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 bg-slate-950 p-6 rounded-2xl border border-slate-800 flex justify-center">
            {/* SVG 3D Isometric Prism / Pyramid */}
            <svg viewBox="0 0 360 240" className="w-full h-60">
              {/* Oxyz Coordinate frame */}
              <line x1="180" y1="120" x2="280" y2="120" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#arrow)" />
              <line x1="180" y1="120" x2="180" y2="30" stroke="#34d399" strokeWidth="2" />
              <line x1="180" y1="120" x2="100" y2="190" stroke="#f43f5e" strokeWidth="2" />
              <text x="285" y="125" fill="#38bdf8" fontSize="11" fontFamily="monospace">x (Oxyz)</text>
              <text x="185" y="30" fill="#34d399" fontSize="11" fontFamily="monospace">z</text>
              <text x="90" y="200" fill="#f43f5e" fontSize="11" fontFamily="monospace">y</text>

              {/* 3D Box vertices */}
              {/* Bottom base */}
              <polygon points="120,160 220,160 250,130 150,130" fill="rgba(56, 189, 248, 0.15)" stroke="#38bdf8" strokeWidth="1.5" />
              {/* Top base */}
              <polygon points="120,90 220,90 250,60 150,60" fill="rgba(56, 189, 248, 0.3)" stroke="#38bdf8" strokeWidth="1.5" />
              {/* Lateral edges */}
              <line x1="120" y1="160" x2="120" y2="90" stroke="#38bdf8" strokeWidth="1.5" />
              <line x1="220" y1="160" x2="220" y2="90" stroke="#38bdf8" strokeWidth="1.5" />
              <line x1="250" y1="130" x2="250" y2="60" stroke="#38bdf8" strokeWidth="1.5" />
              <line x1="150" y1="130" x2="150" y2="60" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 3" />

              {/* Diagonal space segment */}
              <line x1="120" y1="160" x2="250" y2="60" stroke="#fbbf24" strokeWidth="2.5" />
              <text x="175" y="105" fill="#fbbf24" fontSize="10" fontFamily="monospace" fontWeight="bold">d = √(a²+b²+c²)</text>
            </svg>
          </div>

          <div className="lg:col-span-5 space-y-3 text-xs">
            <h4 className="font-bold text-white text-sm">Hình Hộp Chữ Nhật & Khoảng Cách Oxyz</h4>
            <p className="text-slate-400">
              Mô hình trực quan giúp học sinh lớp 12 hình dung độ dài đường chéo không gian và thiết lập tọa độ các đỉnh:
            </p>
            <div className="p-3 bg-slate-800/60 rounded-xl space-y-1 font-mono text-[11px]">
              <div>• Gốc tọa độ: <span className="text-emerald-400">O(0; 0; 0)</span></div>
              <div>• Vectơ chỉ phương: <span className="text-cyan-400">u = (a; b; c)</span></div>
              <div>• Độ dài đường chéo: <span className="text-amber-400">d = √(a² + b² + c²)</span></div>
            </div>
          </div>
        </div>
      )}

      {/* 4. PROBABILITY MONTE CARLO */}
      {activeTab === 'probability' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 text-xs">
                Lịch sử gieo xúc xắc ngẫu nhiên ({diceHistory.length} lần gần nhất):
              </span>
              <button
                onClick={() => rollDice(10)}
                disabled={isRolling}
                className="px-3 py-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-xs cursor-pointer flex items-center gap-1"
              >
                <Dices className="w-3.5 h-3.5" />
                <span>Gieo 10 lần ngẫu nhiên</span>
              </button>
            </div>

            {/* Dice bubbles */}
            <div className="flex flex-wrap gap-2">
              {diceHistory.map((val, idx) => (
                <div
                  key={idx}
                  className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-cyan-400 font-mono text-sm"
                >
                  {val}
                </div>
              ))}
            </div>

            {/* Frequency bar chart */}
            <div className="pt-3 border-t border-slate-800 space-y-1.5 text-[11px]">
              <span className="font-semibold text-slate-400">Tần số xuất hiện từng mặt (Lý thuyết: ~16.7%):</span>
              {[1, 2, 3, 4, 5, 6].map((face) => {
                const count = diceHistory.filter((x) => x === face).length;
                const pct = diceHistory.length > 0 ? (count / diceHistory.length) * 100 : 0;
                return (
                  <div key={face} className="flex items-center gap-2">
                    <span className="w-8 font-mono text-slate-300">Mặt {face}:</span>
                    <div className="flex-1 bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-cyan-400 h-full rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-12 text-right font-mono text-cyan-300">{pct.toFixed(1)}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-3 text-xs">
            <h4 className="font-bold text-white text-sm">Quy luật số lớn (Law of Large Numbers)</h4>
            <p className="text-slate-400">
              Khi số phép thử $N \to +\infty$, tần số thực nghiệm của biến cố sẽ xấp xỉ xác suất lý thuyết $P(A) = 1/6 \approx 0.167$.
            </p>
            <div className="p-3 bg-slate-800/60 rounded-xl space-y-1 font-mono text-[11px]">
              <div>• Không gian mẫu: <span className="text-cyan-300">Ω = {"{1, 2, 3, 4, 5, 6}"}</span></div>
              <div>• Số phần tử: <span className="text-emerald-400">n(Ω) = 6</span></div>
              <div>• Xác suất mặt chẵn: <span className="text-amber-400">P(Chẵn) = 3/6 = 0.5</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MathVisualizerStudio;
