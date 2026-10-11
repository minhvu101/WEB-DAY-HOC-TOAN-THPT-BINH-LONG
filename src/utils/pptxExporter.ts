import pptxgen from 'pptxgenjs';
import { Lecture, SlideItem } from '../types';
import { cleanMathForPptx, formatCoreFormulaForPptx } from './mathToPptx';
import { enhancePptxWithMorph } from './pptxMorphEnhancer';

export type PPTXTheme = 'blue' | 'purple' | 'emerald' | 'chalkboard' | 'slate';

interface ThemeColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  darkBg: string;
  cardBg: string;
  cardBorder: string;
  subCardBg: string;
  textLight: string;
  textMuted: string;
  badgeBg: string;
  highlight: string;
}

const THEME_PALETTES: Record<PPTXTheme, ThemeColorPalette> = {
  blue: {
    primary: '1D4ED8',
    secondary: '0284C7',
    accent: '38BDF8',
    darkBg: '0B1528',
    cardBg: '14243F',
    cardBorder: '2563EB',
    subCardBg: '1B3257',
    textLight: 'FFFFFF',
    textMuted: '94A3B8',
    badgeBg: '1E3A8A',
    highlight: '67E8F9',
  },
  purple: {
    primary: '7C3AED',
    secondary: '9333EA',
    accent: 'C084FC',
    darkBg: '0D091F',
    cardBg: '1A1339',
    cardBorder: '8B5CF6',
    subCardBg: '271E4F',
    textLight: 'FFFFFF',
    textMuted: 'C4B5FD',
    badgeBg: '3B1A7A',
    highlight: 'F472B6',
  },
  emerald: {
    primary: '059669',
    secondary: '0D9488',
    accent: '34D399',
    darkBg: '041B13',
    cardBg: '092F22',
    cardBorder: '10B981',
    subCardBg: '114332',
    textLight: 'FFFFFF',
    textMuted: 'A7F3D0',
    badgeBg: '064E3B',
    highlight: '6EE7B7',
  },
  chalkboard: {
    primary: '0F766E',
    secondary: 'D97706',
    accent: 'FBBF24',
    darkBg: '0C1E1B',
    cardBg: '142F2B',
    cardBorder: '14B8A6',
    subCardBg: '1C403B',
    textLight: 'FFFFFF',
    textMuted: '99F6E4',
    badgeBg: '134E4A',
    highlight: 'FDE68A',
  },
  slate: {
    primary: '3B82F6',
    secondary: '64748B',
    accent: '94A3B8',
    darkBg: '0F172A',
    cardBg: '1E293B',
    cardBorder: '475569',
    subCardBg: '334155',
    textLight: 'FFFFFF',
    textMuted: 'CBD5E1',
    badgeBg: '1E293B',
    highlight: '38BDF8',
  },
};

export async function exportLectureToPptx(
  lecture: Lecture,
  theme: PPTXTheme = 'blue',
  teacherName = 'Thầy Nguyễn Minh Vũ',
  schoolName = 'THPT Bình Long - Đồng Nai'
) {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_16x9'; // 13.33 x 7.5 inches

  const colors = THEME_PALETTES[theme] || THEME_PALETTES.blue;
  const totalSlidesCount = lecture.slides.length + 1; // including title slide

  // ==========================================
  // SLIDE 1: BÌA BÀI GIẢNG (TITLE COVER SLIDE)
  // ==========================================
  const s1 = pres.addSlide();
  s1.background = { color: colors.darkBg };

  // Top Accent Decorative Line
  s1.addShape(pres.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 13.33,
    h: 0.15,
    fill: { color: colors.accent },
  });

  // Top Header System Badge
  s1.addShape(pres.ShapeType.roundRect, {
    x: 0.8,
    y: 0.7,
    w: 6.8,
    h: 0.42,
    fill: { color: colors.badgeBg },
    line: { color: colors.secondary, width: 1 },
  });
  s1.addText('HỆ SINH THÁI DẠY HỌC TOÁN THPT · CTGDPT 2018', {
    x: 0.9,
    y: 0.73,
    w: 6.6,
    h: 0.36,
    fontSize: 11,
    color: colors.accent,
    bold: true,
  });

  // Grade & Curriculum Pill
  s1.addShape(pres.ShapeType.roundRect, {
    x: 7.8,
    y: 0.7,
    w: 4.7,
    h: 0.42,
    fill: { color: colors.cardBg },
    line: { color: colors.accent, width: 1 },
  });
  s1.addText(`TOÁN LỚP ${lecture.grade} · NĂM HỌC 2026 - 2027`, {
    x: 7.9,
    y: 0.73,
    w: 4.5,
    h: 0.36,
    fontSize: 11,
    color: colors.highlight,
    bold: true,
    align: 'center',
  });

  // Main Lesson Title (Large & Bold)
  s1.addText(cleanMathForPptx(lecture.title).toUpperCase(), {
    x: 0.8,
    y: 1.5,
    w: 11.7,
    h: 1.6,
    fontSize: 34,
    color: colors.textLight,
    bold: true,
    fontFace: 'Arial',
  });

  // Chapter Subtitle
  s1.addText(
    `${cleanMathForPptx(lecture.chapter)} · ${lecture.curriculum ? `Bộ sách ${lecture.curriculum}` : 'Chương trình GDPT 2018 chuẩn quốc gia'}`,
    {
      x: 0.8,
      y: 3.2,
      w: 11.7,
      h: 0.6,
      fontSize: 18,
      color: colors.textMuted,
      fontFace: 'Arial',
    }
  );

  // Middle decorative line
  s1.addShape(pres.ShapeType.line, {
    x: 0.8,
    y: 3.9,
    w: 11.7,
    h: 0,
    line: { color: colors.primary, width: 2 },
  });

  // Source document citation card if available
  const sourceName = lecture.sourceDocument?.name || 'Tài liệu số hóa MathHub GDPT 2018';
  s1.addShape(pres.ShapeType.roundRect, {
    x: 0.8,
    y: 4.2,
    w: 11.7,
    h: 0.65,
    fill: { color: colors.subCardBg },
    line: { color: colors.cardBorder, width: 1 },
  });
  s1.addText(`CĂN CỨ VÀ NGUỒN TÀI LIỆU BIÊN SOẠN: ${sourceName}`, {
    x: 1.0,
    y: 4.3,
    w: 11.3,
    h: 0.45,
    fontSize: 11,
    color: colors.highlight,
    bold: true,
  });

  // Teacher & School Bottom Info Card
  s1.addShape(pres.ShapeType.roundRect, {
    x: 0.8,
    y: 5.1,
    w: 11.7,
    h: 1.6,
    fill: { color: colors.cardBg },
    line: { color: colors.primary, width: 1.5 },
  });

  s1.addText(
    [
      { text: `Giáo viên thực hiện: `, options: { color: colors.textMuted, fontSize: 13 } },
      { text: `${teacherName}\n`, options: { color: colors.textLight, fontSize: 14, bold: true } },
      { text: `Đơn vị công tác: `, options: { color: colors.textMuted, fontSize: 13 } },
      { text: `${schoolName}\n`, options: { color: colors.textLight, fontSize: 13, bold: true } },
      {
        text: `Nền tảng: MathHub Classroom · Phòng học số tích hợp mô phỏng toán & KaTeX tương tác`,
        options: { color: colors.accent, fontSize: 11, italic: true },
      },
    ],
    {
      x: 1.2,
      y: 5.25,
      w: 11.0,
      h: 1.3,
      fontFace: 'Arial',
      lineSpacing: 22,
    }
  );

  // Floating ambient decorative math pill 1 (Morph source)
  s1.addShape(pres.ShapeType.roundRect, {
    x: 11.2,
    y: 1.6,
    w: 1.3,
    h: 0.42,
    fill: { color: colors.subCardBg },
    line: { color: colors.accent, width: 1 },
  });
  s1.addText('∑ ∫ dx', {
    x: 11.2,
    y: 1.63,
    w: 1.3,
    h: 0.36,
    fontSize: 11,
    color: colors.accent,
    bold: true,
    align: 'center',
  });

  // Floating ambient decorative math pill 2 (Morph source)
  s1.addShape(pres.ShapeType.roundRect, {
    x: 10.6,
    y: 4.4,
    w: 1.6,
    h: 0.42,
    fill: { color: colors.subCardBg },
    line: { color: colors.highlight, width: 1 },
  });
  s1.addText('f(x) · Δ > 0', {
    x: 10.6,
    y: 4.43,
    w: 1.6,
    h: 0.36,
    fontSize: 11,
    color: colors.highlight,
    bold: true,
    align: 'center',
  });

  s1.addNotes(
    `LỜI DẪN BẮT ĐẦU TIẾT HỌC:\n- Ổn định lớp, kiểm tra sĩ số và kết nối máy chiếu/bảng tương tác.\n- Giới thiệu bài học: "${lecture.title}" thuộc ${lecture.chapter}.\n- Nhắc nhở học sinh chuẩn bị vở ghi chép, máy tính Casio và mở tài khoản MathHub trên điện thoại/máy tính bảng.`
  );

  // ==========================================
  // SLIDES 2..N
  // ==========================================
  lecture.slides.forEach((sl: SlideItem, idx: number) => {
    const s = pres.addSlide();
    s.background = { color: colors.darkBg };

    // Slide Header Bar
    s.addShape(pres.ShapeType.rect, {
      x: 0,
      y: 0,
      w: 13.33,
      h: 0.08,
      fill: { color: colors.accent },
    });

    // Top Category Badge & Slide Counter
    s.addText(`MATHHUB CLASSROOM · TOÁN ${lecture.grade}`, {
      x: 0.8,
      y: 0.35,
      w: 5.5,
      h: 0.35,
      fontSize: 11,
      color: colors.accent,
      bold: true,
      fontFace: 'Arial',
    });

    s.addText(`SLIDE ${idx + 2} / ${totalSlidesCount}`, {
      x: 9.5,
      y: 0.35,
      w: 3.0,
      h: 0.35,
      fontSize: 11,
      color: colors.textMuted,
      align: 'right',
      bold: true,
      fontFace: 'Arial',
    });

    // Slide Main Title
    s.addText(cleanMathForPptx(sl.title), {
      x: 0.8,
      y: 0.75,
      w: 11.7,
      h: 0.75,
      fontSize: 24,
      color: colors.textLight,
      bold: true,
      fontFace: 'Arial',
    });

    // Subtitle if available
    if (sl.subtitle) {
      s.addText(cleanMathForPptx(sl.subtitle), {
        x: 0.8,
        y: 1.45,
        w: 11.7,
        h: 0.35,
        fontSize: 13,
        color: colors.accent,
        italic: true,
        fontFace: 'Arial',
      });
    }

    const contentStartY = sl.subtitle ? 1.85 : 1.6;

    // RENDER SLIDE DEPENDING ON SLIDE TYPE
    // ------------------------------------
    if (sl.slideType === 'objectives') {
      // 3 Cards Layout: Kiến thức - Năng lực - Phẩm chất
      const cardW = 3.65;
      const cardH = 4.6;
      const gap = 0.38;

      const objCards = [
        {
          title: '🎯 KIẾN THỨC TRỌNG TÂM',
          color: colors.primary,
          items: sl.bulletPoints.slice(0, 3),
        },
        {
          title: '💡 NĂNG LỰC TOÁN HỌC',
          color: colors.secondary,
          items:
            sl.bulletPoints.length > 3
              ? sl.bulletPoints.slice(3, 6)
              : [
                  'Năng lực tư duy và lập luận toán học',
                  'Năng lực mô hình hóa bài toán thực tiễn',
                  'Năng lực sử dụng công cụ tính toán',
                ],
        },
        {
          title: '🌟 PHẨM CHẤT & VẬN DỤNG',
          color: colors.subCardBg,
          items: [
            'Chăm chỉ, kiên trì tìm lời giải tối ưu',
            'Tự tin trình bày và phản biện nhóm',
            'Ứng dụng kiến thức vào đời sống',
          ],
        },
      ];

      objCards.forEach((oc, cIdx) => {
        const xPos = 0.8 + cIdx * (cardW + gap);
        // Card Box
        s.addShape(pres.ShapeType.roundRect, {
          x: xPos,
          y: contentStartY,
          w: cardW,
          h: cardH,
          fill: { color: colors.cardBg },
          line: { color: oc.color, width: 1.5 },
        });

        // Header Pill
        s.addShape(pres.ShapeType.roundRect, {
          x: xPos + 0.15,
          y: contentStartY + 0.15,
          w: cardW - 0.3,
          h: 0.45,
          fill: { color: oc.color },
        });
        s.addText(oc.title, {
          x: xPos + 0.2,
          y: contentStartY + 0.2,
          w: cardW - 0.4,
          h: 0.35,
          fontSize: 11,
          color: 'FFFFFF',
          bold: true,
          align: 'center',
        });

        // Items
        const textRuns = oc.items.map((it) => ({
          text: cleanMathForPptx(it),
          options: { fontSize: 13, color: colors.textLight, bullet: true, lineSpacing: 22 },
        }));
        s.addText(textRuns, {
          x: xPos + 0.25,
          y: contentStartY + 0.8,
          w: cardW - 0.5,
          h: cardH - 1.0,
          fontFace: 'Arial',
        });
      });
    } else if (sl.slideType === 'step_by_step' || (sl.steps && sl.steps.length > 0)) {
      // STEP-BY-STEP SOLUTION CARDS
      const stepsList = sl.steps || [
        {
          step: 1,
          title: 'Bước 1: Phân tích & Tìm dữ kiện',
          content: sl.bulletPoints[0] || 'Xác định giả thiết và yêu cầu bài toán.',
        },
        {
          step: 2,
          title: 'Bước 2: Thiết lập công thức & Tính toán',
          content: sl.bulletPoints[1] || 'Áp dụng công thức và biến đổi đại số.',
        },
        {
          step: 3,
          title: 'Bước 3: Kết luận & Nhận xét',
          content: sl.bulletPoints[2] || 'Kiểm tra điều kiện nghiệm và rút ra kết luận.',
        },
      ];

      // Top Question/Problem Banner
      s.addShape(pres.ShapeType.roundRect, {
        x: 0.8,
        y: contentStartY,
        w: 11.7,
        h: 0.85,
        fill: { color: colors.cardBg },
        line: { color: colors.secondary, width: 1 },
      });
      s.addText(
        [
          { text: '📌 BÀI TOÁN MẪU: ', options: { color: colors.highlight, bold: true, fontSize: 12 } },
          {
            text: cleanMathForPptx(sl.bulletPoints[0] || 'Áp dụng công thức giải bài toán cụ thể'),
            options: { color: colors.textLight, fontSize: 13 },
          },
        ],
        {
          x: 1.0,
          y: contentStartY + 0.1,
          w: 11.3,
          h: 0.65,
          fontFace: 'Arial',
        }
      );

      // 3 Steps Horizontal Cards
      const cardW = 3.65;
      const cardH = 3.6;
      const gap = 0.38;

      stepsList.slice(0, 3).forEach((st, sIdx) => {
        const xPos = 0.8 + sIdx * (cardW + gap);
        const yPos = contentStartY + 1.05;

        s.addShape(pres.ShapeType.roundRect, {
          x: xPos,
          y: yPos,
          w: cardW,
          h: cardH,
          fill: { color: colors.cardBg },
          line: { color: sIdx === 1 ? colors.accent : colors.cardBorder, width: 1.5 },
        });

        // Step number badge
        s.addShape(pres.ShapeType.ellipse, {
          x: xPos + 0.25,
          y: yPos + 0.25,
          w: 0.45,
          h: 0.45,
          fill: { color: colors.primary },
        });
        s.addText(String(st.step), {
          x: xPos + 0.25,
          y: yPos + 0.25,
          w: 0.45,
          h: 0.45,
          fontSize: 13,
          color: 'FFFFFF',
          bold: true,
          align: 'center',
        });

        // Step Title
        s.addText(cleanMathForPptx(st.title), {
          x: xPos + 0.8,
          y: yPos + 0.28,
          w: cardW - 0.95,
          h: 0.4,
          fontSize: 13,
          color: colors.highlight,
          bold: true,
          fontFace: 'Arial',
        });

        // Step Content
        s.addText(cleanMathForPptx(st.content), {
          x: xPos + 0.3,
          y: yPos + 0.85,
          w: cardW - 0.6,
          h: 1.7,
          fontSize: 12,
          color: colors.textLight,
          lineSpacing: 18,
          fontFace: 'Arial',
        });

        // Step formula if present
        if (st.formula) {
          s.addShape(pres.ShapeType.roundRect, {
            x: xPos + 0.2,
            y: yPos + 2.7,
            w: cardW - 0.4,
            h: 0.65,
            fill: { color: colors.subCardBg },
            line: { color: colors.accent, width: 1 },
          });
          s.addText(formatCoreFormulaForPptx(st.formula), {
            x: xPos + 0.25,
            y: yPos + 2.75,
            w: cardW - 0.5,
            h: 0.55,
            fontSize: 12,
            color: colors.highlight,
            bold: true,
            align: 'center',
            fontFace: 'Cambria Math',
          });
        }
      });
    } else if (sl.slideType === 'quiz_interactive' || sl.quiz) {
      // QUIZ QUESTION & 4 OPTIONS (2x2 GRID)
      const q = sl.quiz || {
        question: sl.bulletPoints[0] || 'Chọn đáp án đúng nhất:',
        options: ['Phương án A', 'Phương án B', 'Phương án C', 'Phương án D'],
        correctAnswer: 'A',
        explanation: 'Lời giải chi tiết áp dụng công thức vừa học.',
      };

      // Question Banner
      s.addShape(pres.ShapeType.roundRect, {
        x: 0.8,
        y: contentStartY,
        w: 11.7,
        h: 1.4,
        fill: { color: colors.cardBg },
        line: { color: colors.accent, width: 1.5 },
      });

      s.addShape(pres.ShapeType.roundRect, {
        x: 1.0,
        y: contentStartY + 0.15,
        w: 2.8,
        h: 0.32,
        fill: { color: colors.primary },
      });
      s.addText('⚡ THỬ THÁCH TẠI LỚP', {
        x: 1.05,
        y: contentStartY + 0.17,
        w: 2.7,
        h: 0.28,
        fontSize: 10,
        color: 'FFFFFF',
        bold: true,
        align: 'center',
      });

      s.addText(cleanMathForPptx(q.question), {
        x: 1.0,
        y: contentStartY + 0.55,
        w: 11.3,
        h: 0.75,
        fontSize: 16,
        color: colors.textLight,
        bold: true,
        fontFace: 'Arial',
      });

      // 4 Options (2x2 Layout)
      const optW = 5.65;
      const optH = 0.95;
      const optGapX = 0.4;
      const optGapY = 0.25;
      const optLabels = ['A', 'B', 'C', 'D'];

      q.options.slice(0, 4).forEach((op, oIdx) => {
        const col = oIdx % 2;
        const row = Math.floor(oIdx / 2);
        const xPos = 0.8 + col * (optW + optGapX);
        const yPos = contentStartY + 1.65 + row * (optH + optGapY);
        const isCorrect = optLabels[oIdx] === q.correctAnswer;

        s.addShape(pres.ShapeType.roundRect, {
          x: xPos,
          y: yPos,
          w: optW,
          h: optH,
          fill: { color: isCorrect ? colors.subCardBg : colors.cardBg },
          line: { color: isCorrect ? colors.accent : colors.cardBorder, width: isCorrect ? 1.5 : 1 },
        });

        // Circle Badge
        s.addShape(pres.ShapeType.ellipse, {
          x: xPos + 0.2,
          y: yPos + 0.22,
          w: 0.48,
          h: 0.48,
          fill: { color: isCorrect ? colors.accent : colors.primary },
        });
        s.addText(optLabels[oIdx], {
          x: xPos + 0.2,
          y: yPos + 0.24,
          w: 0.48,
          h: 0.44,
          fontSize: 13,
          color: isCorrect ? colors.darkBg : 'FFFFFF',
          bold: true,
          align: 'center',
        });

        s.addText(cleanMathForPptx(op), {
          x: xPos + 0.8,
          y: yPos + 0.2,
          w: optW - 0.95,
          h: 0.55,
          fontSize: 13,
          color: colors.textLight,
          bold: isCorrect,
          fontFace: 'Arial',
        });
      });

      // Explanation callout bottom
      s.addShape(pres.ShapeType.roundRect, {
        x: 0.8,
        y: contentStartY + 4.05,
        w: 11.7,
        h: 0.75,
        fill: { color: colors.subCardBg },
        line: { color: colors.secondary, width: 1 },
      });
      s.addText(`💡 ĐÁP ÁN: [${q.correctAnswer}] · ${cleanMathForPptx(q.explanation)}`, {
        x: 1.0,
        y: contentStartY + 4.15,
        w: 11.3,
        h: 0.55,
        fontSize: 12,
        color: colors.highlight,
        italic: true,
        fontFace: 'Arial',
      });
    } else {
      // STANDARD TWO-COLUMN / CALLOUT SLIDE (Rich bullets + Visual box + Formula callout)
      const hasCallout = Boolean(sl.visualCallout || sl.realWorldContext);
      const leftColWidth = hasCallout ? 7.2 : 11.7;

      // Left Box: Main Content Card
      s.addShape(pres.ShapeType.roundRect, {
        x: 0.8,
        y: contentStartY,
        w: leftColWidth,
        h: sl.formula ? 3.3 : 4.7,
        fill: { color: colors.cardBg },
        line: { color: colors.cardBorder, width: 1 },
      });

      const bulletItems = sl.bulletPoints.map((bp) => ({
        text: cleanMathForPptx(bp),
        options: { fontSize: 14, color: colors.textLight, bullet: true, lineSpacing: 24 },
      }));

      s.addText(bulletItems, {
        x: 1.1,
        y: contentStartY + 0.25,
        w: leftColWidth - 0.6,
        h: sl.formula ? 2.8 : 4.2,
        fontFace: 'Arial',
      });

      // Right Box: Visual Diagram / Real-world / Geometric Callout
      if (hasCallout) {
        const rightX = 8.35;
        const rightW = 4.15;
        const rightH = sl.formula ? 3.3 : 4.7;

        s.addShape(pres.ShapeType.roundRect, {
          x: rightX,
          y: contentStartY,
          w: rightW,
          h: rightH,
          fill: { color: colors.subCardBg },
          line: { color: colors.accent, width: 1.5 },
        });

        const calloutTitle = cleanMathForPptx(
          sl.visualCallout?.title || sl.realWorldContext?.topic || 'TRỰC QUAN HÓA TOÁN HỌC'
        );
        const calloutDesc = cleanMathForPptx(
          sl.visualCallout?.description ||
          sl.realWorldContext?.application ||
          'Mô phỏng hình học không gian & ứng dụng thực tiễn.'
        );

        // Callout Header Badge
        s.addShape(pres.ShapeType.roundRect, {
          x: rightX + 0.2,
          y: contentStartY + 0.2,
          w: rightW - 0.4,
          h: 0.4,
          fill: { color: colors.primary },
        });
        s.addText(calloutTitle, {
          x: rightX + 0.25,
          y: contentStartY + 0.25,
          w: rightW - 0.5,
          h: 0.3,
          fontSize: 10,
          color: 'FFFFFF',
          bold: true,
          align: 'center',
        });

        // Callout Graphic Representation (Geometric Shapes Simulation)
        s.addShape(pres.ShapeType.roundRect, {
          x: rightX + 0.3,
          y: contentStartY + 0.75,
          w: rightW - 0.6,
          h: 1.4,
          fill: { color: colors.darkBg },
          line: { color: colors.secondary, width: 1 },
        });

        s.addText(
          [
            { text: '📐 SƠ ĐỒ ĐỒ THỊ & HÌNH VẼ:\n', options: { fontSize: 10, color: colors.accent, bold: true } },
            {
              text: cleanMathForPptx(sl.visualCallout?.badge || 'MathHub Interactive Model'),
              options: { fontSize: 11, color: colors.highlight, bold: true },
            },
          ],
          {
            x: rightX + 0.4,
            y: contentStartY + 0.9,
            w: rightW - 0.8,
            h: 1.1,
            align: 'center',
            fontFace: 'Arial',
          }
        );

        // Description text
        s.addText(calloutDesc, {
          x: rightX + 0.3,
          y: contentStartY + 2.25,
          w: rightW - 0.6,
          h: rightH - 2.4,
          fontSize: 11,
          color: colors.textLight,
          lineSpacing: 16,
          fontFace: 'Arial',
        });
      }

      // Formula Callout Box (Bottom Highlight)
      if (sl.formula) {
        const formY = contentStartY + 3.5;
        s.addShape(pres.ShapeType.roundRect, {
          x: 0.8,
          y: formY,
          w: 11.7,
          h: 1.35,
          fill: { color: colors.subCardBg },
          line: { color: colors.accent, width: 1.5 },
        });

        s.addText('CÔNG THỨC TRỌNG TÂM / QUY TẮC CỐT LÕI:', {
          x: 1.1,
          y: formY + 0.12,
          w: 11.1,
          h: 0.25,
          fontSize: 10,
          color: colors.accent,
          bold: true,
        });

        const formattedFormula = formatCoreFormulaForPptx(sl.formula);
        s.addText(formattedFormula, {
          x: 1.1,
          y: formY + 0.42,
          w: 11.1,
          h: 0.8,
          fontSize: 22,
          color: 'FFFFFF',
          bold: true,
          align: 'center',
          fontFace: 'Cambria Math',
        });
      }
    }

    // Slide footer line & credits
    s.addText(
      `GV: ${teacherName} · ${schoolName} · Nền tảng học liệu số MathHub Classroom`,
      {
        x: 0.8,
        y: 6.95,
        w: 11.7,
        h: 0.3,
        fontSize: 10,
        color: colors.textMuted,
        fontFace: 'Arial',
      }
    );

    // Floating ambient math pill in top right corner (Morph target across slides)
    s.addShape(pres.ShapeType.roundRect, {
      x: 11.6,
      y: 0.32,
      w: 1.0,
      h: 0.36,
      fill: { color: colors.subCardBg },
      line: { color: colors.secondary, width: 0.8 },
    });
    s.addText(idx % 2 === 0 ? '∑ f(x)' : '∫ Δ dx', {
      x: 11.6,
      y: 0.34,
      w: 1.0,
      h: 0.32,
      fontSize: 10,
      color: colors.accent,
      bold: true,
      align: 'center',
    });

    // PRESENTATION SPEAKER NOTES (PRESENTER VIEW COMPATIBILITY)
    const speakerNotes =
      sl.teacherNotes ||
      `GỢI Ý SƯ PHẠM DÀNH CHO GIÁO VIÊN KHI CHIẾU SLIDE NÀY:\n` +
        `- Đặt câu hỏi gợi mở: "${sl.title}".\n` +
        `- Hướng dẫn học sinh chú ý: ${sl.bulletPoints[0] || 'Nội dung cốt lõi'}.\n` +
        (sl.formula ? `- Nhấn mạnh công thức: ${sl.formula} và giải thích điều kiện áp dụng.\n` : '') +
        `- Dành 2-3 phút cho học sinh trao đổi cặp đôi hoặc thực hành trực tiếp trên bảng.`;

    s.addNotes(cleanMathForPptx(speakerNotes));
  });

  const safeTitle = lecture.title.replace(/[^a-zA-Z0-9_\u00C0-\u024F\u1E00-\u1EFF]/g, '_');
  const filename = `BaiGiang_Toan${lecture.grade}_${safeTitle}.pptx`;

  // Write base PPTX array buffer
  const rawData = (await pres.write({ outputType: 'arraybuffer' })) as ArrayBuffer;

  // Enhance with Microsoft PowerPoint Morph Transition & standard "!!" shape pairing tags
  const morphBlob = await enhancePptxWithMorph(rawData, {
    durationMs: 1250,
    morphMode: 'byObject',
  });

  // Browser download trigger
  if (typeof document !== 'undefined') {
    const url = URL.createObjectURL(morphBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
