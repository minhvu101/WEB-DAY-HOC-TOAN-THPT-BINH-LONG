import React, { useState, useId } from 'react';
import MathFormula from './MathFormula';
import { Play, RotateCcw, Sparkles, TrendingUp, Compass, Dices, ChevronRight, CheckCircle2 } from 'lucide-react';

export const MathLabView: React.FC = () => {
  const [activeLab, setActiveLab] = useState<'derivative' | 'parabola' | 'probability'>('derivative');

  // Derivative Lab State: f(x) = x^2, point A(1, 1), point M(x_0 + h, (x_0 + h)^2)
  const [x0, setX0] = useState<number>(1);
  const [h, setH] = useState<number>(1.2);
  const [isAnimatingTangent, setIsAnimatingTangent] = useState(false);

  // Parabola Lab State: y = ax^2 + bx + c
  const [coeffA, setCoeffA] = useState<number>(1);
  const [coeffB, setCoeffB] = useState<number>(-4);
  const [coeffC, setCoeffC] = useState<number>(3);

  // Probability Simulation State: Dice rolls
  const [diceHistory, setDiceHistory] = useState<number[]>([]);
  const [isRolling, setIsRolling] = useState(false);

  // Animate secant -> tangent (h -> 0.001)
  const animateToTangent = () => {
    setIsAnimatingTangent(true);
    let currentH = h;
    const interval = setInterval(() => {
      currentH *= 0.75;
      if (currentH < 0.05) {
        setH(0.01);
        clearInterval(interval);
        setIsAnimatingTangent(false);
      } else {
        setH(Number(currentH.toFixed(3)));
      }
    }, 50);
  };

  // Roll dice batch
  const rollDiceBatch = (count: number) => {
    setIsRolling(true);
    setTimeout(() => {
      const newRolls: number[] = [];
      for (let i = 0; i < count; i++) {
        newRolls.push(Math.floor(Math.random() * 6) + 1);
      }
      setDiceHistory((prev) => [...prev, ...newRolls]);
      setIsRolling(false);
    }, 250);
  };

  // Derivative calculations
  const y0 = x0 * x0;
  const xM = x0 + h;
  const yM = xM * xM;
  const secantSlope = (yM - y0) / (xM - x0);
  const exactTangentSlope = 2 * x0;

  // Parabola calculations
  const vertexX = -coeffB / (2 * coeffA);
  const vertexY = coeffA * vertexX * vertexX + coeffB * vertexX + coeffC;
  const delta = coeffB * coeffB - 4 * coeffA * coeffC;

  // SVG coordinate transformation helper for [-4, 6] x [-2, 10]
  const toSvgX = (x: number) => 300 + x * 50;
  const toSvgY = (y: number) => 260 - y * 30;

  // Dice counts
  const diceCounts = [1, 2, 3, 4, 5, 6].map((face) => ({
    face,
    count: diceHistory.filter((d) => d === face).length,
    percentage: diceHistory.length > 0 
      ? ((diceHistory.filter((d) => d === face).length / diceHistory.length) * 100).toFixed(1)
      : '0.0',
  }));

  return (
    <div className="space-y-6">
      {/* Top Banner & Mode Switcher */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                Phòng Thí Nghiệm Toán Học Trực Quan
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 mt-1">
              Math Lab Tương Tác 2.0
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              “Nhìn thấy” vẻ đẹp của toán học qua mô phỏng động, đồ thị thời gian thực và thực nghiệm số.
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setActiveLab('derivative')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeLab === 'derivative'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
              <span>Đạo hàm & Tiếp tuyến</span>
            </button>
            <button
              onClick={() => setActiveLab('parabola')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeLab === 'parabola'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-blue-600" />
              <span>Parabol $y=ax^2+bx+c$</span>
            </button>
            <button
              onClick={() => setActiveLab('probability')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeLab === 'probability'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Dices className="w-3.5 h-3.5 text-blue-600" />
              <span>Xác suất Monte Carlo</span>
            </button>
          </div>
        </div>
      </div>

      {/* LAB 1: DERIVATIVE & TANGENT SIMULATION */}
      {activeLab === 'derivative' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Interactive Stage (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="text-xs font-semibold text-slate-800 flex items-center gap-2">
                <span>Hàm số: </span>
                <MathFormula math="f(x) = x^2" className="text-blue-700 font-bold" />
                <span className="text-slate-400">·</span>
                <span>Điểm cố định </span>
                <MathFormula math={`A(${x0}; ${y0})`} className="text-emerald-700" />
              </div>
              <div className="text-xs text-slate-500 font-mono">
                h = {h.toFixed(3)}
              </div>
            </div>

            {/* Canvas */}
            <div className="relative w-full h-[360px] bg-slate-900 rounded-xl overflow-hidden my-3 border border-slate-800">
              <svg className="w-full h-full" viewBox="0 0 600 360">
                {/* Coordinate Grid */}
                <defs>
                  <pattern id="grid" width="25" height="25" patternUnits="userSpaceOnUse">
                    <path d="M 25 0 L 0 0 0 25" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* Axes */}
                <line x1="0" y1={toSvgY(0)} x2="600" y2={toSvgY(0)} stroke="#475569" strokeWidth="1.5" />
                <line x1={toSvgX(0)} y1="0" x2={toSvgX(0)} y2="360" stroke="#475569" strokeWidth="1.5" />
                <text x={toSvgX(0) + 8} y="20" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">y</text>
                <text x="580" y={toSvgY(0) - 8} fill="#94a3b8" fontSize="11" fontFamily="sans-serif">x</text>

                {/* Parabola Curve y = x^2 */}
                <path
                  d={Array.from({ length: 60 }, (_, i) => {
                    const x = -3 + (i * 6) / 59;
                    const y = x * x;
                    return `${i === 0 ? 'M' : 'L'} ${toSvgX(x)} ${toSvgY(y)}`;
                  }).join(' ')}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="3"
                />

                {/* Secant line passing through A and M */}
                {h > 0.02 && (
                  <line
                    x1={toSvgX(x0 - 2)}
                    y1={toSvgY(y0 - 2 * secantSlope)}
                    x2={toSvgX(xM + 2)}
                    y2={toSvgY(yM + 2 * secantSlope)}
                    stroke="#f59e0b"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                  />
                )}

                {/* Tangent Line when h -> 0 */}
                <line
                  x1={toSvgX(x0 - 2)}
                  y1={toSvgY(y0 - 2 * exactTangentSlope)}
                  x2={toSvgX(x0 + 2)}
                  y2={toSvgY(y0 + 2 * exactTangentSlope)}
                  stroke="#10b981"
                  strokeWidth={h < 0.05 ? 3 : 1.5}
                  opacity={h < 0.05 ? 1 : 0.4}
                />

                {/* Point A */}
                <circle cx={toSvgX(x0)} cy={toSvgY(y0)} r="6" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                <text x={toSvgX(x0) - 25} y={toSvgY(y0) - 10} fill="#10b981" fontSize="12" fontWeight="bold">
                  A({x0};{y0})
                </text>

                {/* Point M */}
                <circle cx={toSvgX(xM)} cy={toSvgY(yM)} r="6" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
                <text x={toSvgX(xM) + 10} y={toSvgY(yM)} fill="#f59e0b" fontSize="12" fontWeight="bold">
                  M({xM.toFixed(2)};{yM.toFixed(2)})
                </text>

                {/* Triangle showing delta x and delta y */}
                {h > 0.1 && (
                  <>
                    <line x1={toSvgX(x0)} y1={toSvgY(y0)} x2={toSvgX(xM)} y2={toSvgY(y0)} stroke="#64748b" strokeDasharray="2 2" />
                    <line x1={toSvgX(xM)} y1={toSvgY(y0)} x2={toSvgX(xM)} y2={toSvgY(yM)} stroke="#64748b" strokeDasharray="2 2" />
                    <text x={toSvgX((x0 + xM) / 2)} y={toSvgY(y0) + 15} fill="#cbd5e1" fontSize="10" textAnchor="middle">
                      Δx = h
                    </text>
                    <text x={toSvgX(xM) + 18} y={toSvgY((y0 + yM) / 2)} fill="#cbd5e1" fontSize="10">
                      Δy
                    </text>
                  </>
                )}
              </svg>

              {/* Legend Overlay */}
              <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-sm border border-slate-700/80 rounded-lg p-2.5 text-[11px] space-y-1 text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-1 bg-amber-500 rounded"></span>
                  <span>Cát tuyến MA: Hệ số góc = {secantSlope.toFixed(3)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-1 bg-emerald-500 rounded"></span>
                  <span>Tiếp tuyến tại A: f'({x0}) = {exactTangentSlope.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500">
                Khi h tiến dần về 0, cát tuyến MA biến thành tiếp tuyến tại A!
              </span>
              <button
                onClick={animateToTangent}
                disabled={isAnimatingTangent}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all shadow-xs disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Mô phỏng h → 0</span>
              </button>
            </div>
          </div>

          {/* Control & Concept Deck (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Bảng điều khiển tham số
              </h3>
              <p className="text-xs text-slate-500">Kéo thanh trượt để di chuyển điểm M lại gần điểm A</p>
            </div>

            {/* Slider for h */}
            <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="flex justify-between text-xs font-medium text-slate-700">
                <span>Khoảng cách số gia: <MathFormula math="h = \Delta x" /></span>
                <span className="font-mono text-blue-700 font-bold">{h.toFixed(3)}</span>
              </div>
              <input
                type="range"
                min="0.01"
                max="2.5"
                step="0.01"
                value={h}
                onChange={(e) => setH(parseFloat(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0.01 (Cực gần A)</span>
                <span>2.50 (Xa A)</span>
              </div>
            </div>

            {/* Slider for x0 */}
            <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="flex justify-between text-xs font-medium text-slate-700">
                <span>Hoành độ tiếp điểm: <MathFormula math="x_0" /></span>
                <span className="font-mono text-emerald-700 font-bold">{x0}</span>
              </div>
              <input
                type="range"
                min="-2"
                max="2.5"
                step="0.5"
                value={x0}
                onChange={(e) => setX0(parseFloat(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* Mathematical Derivation Box */}
            <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200/70 space-y-2 text-xs">
              <div className="font-bold text-blue-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Ý nghĩa Toán học & Giới hạn</span>
              </div>
              <div className="space-y-1 text-slate-700 leading-relaxed">
                <div>
                  • Hệ số góc cát tuyến:{' '}
                  <MathFormula math="k_{sec} = \frac{\Delta y}{\Delta x} = \frac{(x_0+h)^2 - x_0^2}{h} = 2x_0 + h" />
                </div>
                <div>
                  • Khi <MathFormula math="h \to 0" />:{' '}
                  <MathFormula math="\lim_{h \to 0} (2x_0 + h) = 2x_0" />
                </div>
                <div className="pt-1 border-t border-blue-200/80 font-semibold text-blue-950">
                  <CheckCircle2 className="w-3.5 h-3.5 inline mr-1 text-blue-700" />
                  Đạo hàm tại <MathFormula math={`x_0=${x0}`} />:{' '}
                  <span className="text-emerald-700 font-bold text-sm">f'({x0}) = {exactTangentSlope}</span>
                </div>
              </div>
            </div>

            {/* Tangent Equation */}
            <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs">
              <span className="font-bold text-emerald-900 block mb-1">Phương trình tiếp tuyến:</span>
              <MathFormula
                math={`y - ${y0} = ${exactTangentSlope}(x - ${x0}) \\iff y = ${exactTangentSlope}x - ${exactTangentSlope * x0 - y0}`}
                block
                className="text-emerald-800 font-bold"
              />
            </div>
          </div>
        </div>
      )}

      {/* LAB 2: PARABOLA a, b, c SLIDERS */}
      {activeLab === 'parabola' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="text-xs font-semibold text-slate-800 flex items-center gap-2">
                <span>Hàm số: </span>
                <MathFormula
                  math={`y = ${coeffA}x^2 ${coeffB >= 0 ? `+ ${coeffB}x` : `${coeffB}x`} ${coeffC >= 0 ? `+ ${coeffC}` : `${coeffC}`}`}
                  className="text-blue-700 font-bold"
                />
              </div>
              <div className="text-xs text-slate-500 font-mono">
                Δ = {delta}
              </div>
            </div>

            {/* Canvas */}
            <div className="relative w-full h-[360px] bg-slate-900 rounded-xl overflow-hidden my-3 border border-slate-800">
              <svg className="w-full h-full" viewBox="0 0 600 360">
                <rect width="100%" height="100%" fill="url(#grid)" />
                <line x1="0" y1={toSvgY(0)} x2="600" y2={toSvgY(0)} stroke="#475569" strokeWidth="1.5" />
                <line x1={toSvgX(0)} y1="0" x2={toSvgX(0)} y2="360" stroke="#475569" strokeWidth="1.5" />

                {/* Parabola */}
                <path
                  d={Array.from({ length: 80 }, (_, i) => {
                    const x = -5 + (i * 10) / 79;
                    const y = coeffA * x * x + coeffB * x + coeffC;
                    return `${i === 0 ? 'M' : 'L'} ${toSvgX(x)} ${toSvgY(y)}`;
                  }).join(' ')}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="3"
                />

                {/* Axis of Symmetry */}
                <line
                  x1={toSvgX(vertexX)}
                  y1="0"
                  x2={toSvgX(vertexX)}
                  y2="360"
                  stroke="#f43f5e"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />

                {/* Vertex */}
                <circle cx={toSvgX(vertexX)} cy={toSvgY(vertexY)} r="6" fill="#f43f5e" stroke="#ffffff" strokeWidth="2" />
                <text x={toSvgX(vertexX) + 8} y={toSvgY(vertexY) - 8} fill="#fda4af" fontSize="11" fontWeight="bold">
                  I({vertexX.toFixed(1)}; {vertexY.toFixed(1)})
                </text>
              </svg>

              <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-sm border border-slate-700/80 rounded-lg p-2.5 text-[11px] space-y-1 text-slate-300">
                <div>Đỉnh parabol: I({vertexX.toFixed(2)}; {vertexY.toFixed(2)})</div>
                <div>Trục đối xứng: x = {vertexX.toFixed(2)}</div>
                <div>
                  Bề lõm: {coeffA > 0 ? 'Quay lên trên (a > 0)' : 'Quay xuống dưới (a < 0)'}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 text-xs text-slate-500">
              <span>Biệt thức Δ: {delta > 0 ? '2 nghiệm phân biệt' : delta === 0 ? 'Nghiệm kép' : 'Vô nghiệm'}</span>
              <button
                onClick={() => {
                  setCoeffA(1);
                  setCoeffB(-4);
                  setCoeffC(3);
                }}
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Đặt lại mặc định</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Tham số Parabol $y = ax^2 + bx + c$
              </h3>
              <p className="text-xs text-slate-500">Điều chỉnh các hệ số để quan sát sự biến dạng đồ thị</p>
            </div>

            {/* Slider a */}
            <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="flex justify-between text-xs font-medium text-slate-700">
                <span>Hệ số a: Độ co giãn & Bề lõm</span>
                <span className="font-mono text-blue-700 font-bold">{coeffA}</span>
              </div>
              <input
                type="range"
                min="-3"
                max="3"
                step="0.5"
                value={coeffA}
                onChange={(e) => setCoeffA(parseFloat(e.target.value) || 0.5)}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            {/* Slider b */}
            <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="flex justify-between text-xs font-medium text-slate-700">
                <span>Hệ số b: Tọa độ đỉnh</span>
                <span className="font-mono text-emerald-700 font-bold">{coeffB}</span>
              </div>
              <input
                type="range"
                min="-6"
                max="6"
                step="1"
                value={coeffB}
                onChange={(e) => setCoeffB(parseFloat(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* Slider c */}
            <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="flex justify-between text-xs font-medium text-slate-700">
                <span>Hệ số c: Giao điểm trục tung (Oy)</span>
                <span className="font-mono text-amber-700 font-bold">{coeffC}</span>
              </div>
              <input
                type="range"
                min="-5"
                max="5"
                step="1"
                value={coeffC}
                onChange={(e) => setCoeffC(parseFloat(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
            </div>

            {/* Summary card */}
            <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200 space-y-1.5 text-xs">
              <div className="font-bold text-blue-900">Tính chất hàm số:</div>
              <div className="text-slate-700">
                • Tọa độ đỉnh: <MathFormula math={`I\\left(-\\frac{b}{2a}; -\\frac{\\Delta}{4a}\\right) = I(${vertexX.toFixed(2)}; ${vertexY.toFixed(2)})`} />
              </div>
              <div className="text-slate-700">
                • Trục đối xứng: <MathFormula math={`x = ${vertexX.toFixed(2)}`} />
              </div>
              <div className="text-slate-700">
                • Giao với Oy tại: <MathFormula math={`(0; ${coeffC})`} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LAB 3: PROBABILITY & MONTE CARLO SIMULATION */}
      {activeLab === 'probability' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Thực nghiệm gieo xúc xắc</h3>
                <p className="text-xs text-slate-500">
                  Tổng số lần gieo: <strong className="text-blue-700 font-mono text-sm">{diceHistory.length}</strong> lần
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => rollDiceBatch(10)}
                  disabled={isRolling}
                  className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                >
                  +10 lần
                </button>
                <button
                  onClick={() => rollDiceBatch(100)}
                  disabled={isRolling}
                  className="px-3 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-xs"
                >
                  +100 lần
                </button>
                <button
                  onClick={() => setDiceHistory([])}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                  title="Xóa kết quả"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Distribution Bar Chart */}
            <div className="space-y-3 pt-2">
              {diceCounts.map((item) => (
                <div key={item.face} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-800">
                        {item.face}
                      </span>
                      <span>Mặt {item.face} chấm</span>
                    </span>
                    <span className="text-slate-500 text-[11px] font-mono">
                      {item.count} lần ({item.percentage}%) · Lý thuyết: 16.7%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden flex relative">
                    {/* Theoretical reference line at 16.67% */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-rose-500 z-10"
                      style={{ left: '16.67%' }}
                      title="Xác suất lý thuyết P = 1/6 ≈ 16.67%"
                    />
                    <div
                      className="h-full bg-blue-600 transition-all duration-300 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs text-slate-500 pt-2 border-t border-slate-100">
              * Đường đỏ thể hiện xác suất lý thuyết <MathFormula math="P = \frac{1}{6} \approx 16.67\%" />. 
              Theo Định luật số lớn (Law of Large Numbers), khi số lần thử nghiệm đủ lớn, tần suất thực nghiệm sẽ tiệm cận xác suất lý thuyết!
            </p>
          </div>

          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Bài toán & Lý thuyết Xác suất
            </h3>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="font-semibold text-slate-800">Biến cố A: "Xuất hiện mặt chia hết cho 3"</div>
              <div className="text-slate-600">
                Các kết quả thuận lợi: <MathFormula math="A = \{3, 6\} \Rightarrow n(A) = 2" />
              </div>
              <div className="text-slate-600">
                Không gian mẫu: <MathFormula math="\Omega = \{1, 2, 3, 4, 5, 6\} \Rightarrow n(\Omega) = 6" />
              </div>
              <div className="pt-2 border-t border-slate-200 text-blue-700 font-bold">
                Xác suất lý thuyết: <MathFormula math="P(A) = \frac{n(A)}{n(\Omega)} = \frac{2}{6} = \frac{1}{3} \approx 33.33\%" />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
              <span className="font-bold block">Tần suất thực nghiệm của biến cố A:</span>
              <div className="font-mono text-base font-bold text-emerald-700">
                {diceHistory.length > 0
                  ? `${(
                      ((diceCounts[2].count + diceCounts[5].count) / diceHistory.length) *
                      100
                    ).toFixed(1)}%`
                  : 'Chưa có thực nghiệm'}
              </div>
              <p className="text-[11px] text-emerald-700">
                Số lần xuất hiện mặt 3 hoặc 6: {diceCounts[2].count + diceCounts[5].count}/{diceHistory.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MathLabView;
