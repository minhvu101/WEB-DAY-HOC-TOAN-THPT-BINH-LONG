import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
} from 'docx';
import { Question } from '../types';

export interface ExamExportConfig {
  title: string;
  grade: number;
  subject?: string;
  duration: string;
  schoolName?: string;
  examCode?: string;
  includeAnswers?: boolean;
  matrixSummary?: {
    totalQuestions: number;
    part1Count: number;
    part2Count: number;
    part3Count: number;
    part4Count: number;
    sourceDocument?: string;
  };
}

export async function exportExamToDocx(
  questions: Question[],
  config: ExamExportConfig
) {
  const school = config.schoolName || 'SỞ GD&ĐT TỈNH BÌNH PHƯỚC - TRƯỜNG THPT BÌNH LONG';
  const examCode = config.examCode || '101';
  const duration = config.duration || '45 phút';

  // Group questions by part
  const part1 = questions.filter(
    (q) => !q.section || q.section === 'part1_mcq' || q.type === 'multiple_choice'
  );
  const part2 = questions.filter(
    (q) => q.section === 'part2_true_false' || q.type === 'true_false'
  );
  const part3 = questions.filter(
    (q) => q.section === 'part3_short_answer' || q.type === 'short_answer'
  );
  const part4 = questions.filter(
    (q) => q.section === 'part4_essay' || q.type === 'essay'
  );

  const docChildren: (Paragraph | Table)[] = [];

  // 1. Header Box Table (School & Test Title)
  const headerTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE, size: 0, color: 'auto' },
      bottom: { style: BorderStyle.NONE, size: 0, color: 'auto' },
      left: { style: BorderStyle.NONE, size: 0, color: 'auto' },
      right: { style: BorderStyle.NONE, size: 0, color: 'auto' },
      insideHorizontal: { style: BorderStyle.NONE, size: 0, color: 'auto' },
      insideVertical: { style: BorderStyle.NONE, size: 0, color: 'auto' },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: school.toUpperCase(), bold: true, size: 20 }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: 'TỔ TOÁN - TIN', bold: true, size: 20 }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: `MÃ ĐỀ THI: ${examCode}`, bold: true, size: 22, color: '1D4ED8' }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: config.title.toUpperCase(), bold: true, size: 22 }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: `MÔN: TOÁN - KHỐI ${config.grade}`, bold: true, size: 20 }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: `Thời gian làm bài: ${duration} (không kể phát đề)`, italics: true, size: 18 }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  docChildren.push(headerTable);

  // Student Info Line
  docChildren.push(
    new Paragraph({
      spacing: { before: 200, after: 150 },
      children: [
        new TextRun({
          text: 'Họ và tên thí sinh: .......................................................................................  Lớp: ........................  SBD: ........................',
          size: 20,
        }),
      ],
    })
  );

  // Divider
  docChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: '────────────────────────────────────────────────────────────',
          size: 16,
          color: '94A3B8',
        }),
      ],
    })
  );

  let questionCounter = 1;

  // PHẦN 1: TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN
  if (part1.length > 0) {
    docChildren.push(
      new Paragraph({
        spacing: { before: 250, after: 120 },
        children: [
          new TextRun({
            text: 'PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (4 ĐÁP ÁN A, B, C, D)',
            bold: true,
            size: 22,
            color: '0F172A',
          }),
        ],
      })
    );
    docChildren.push(
      new Paragraph({
        spacing: { after: 180 },
        children: [
          new TextRun({
            text: `Thí sinh trả lời từ câu ${questionCounter} đến câu ${questionCounter + part1.length - 1}. Mỗi câu hỏi thí sinh chỉ chọn một phương án. (Mỗi câu đúng được 0,25 điểm)`,
            italics: true,
            size: 19,
            color: '475569',
          }),
        ],
      })
    );

    part1.forEach((q) => {
      docChildren.push(
        new Paragraph({
          spacing: { before: 140, after: 80 },
          children: [
            new TextRun({ text: `Câu ${questionCounter}. `, bold: true, size: 21 }),
            new TextRun({ text: cleanFormula(q.content), size: 21 }),
          ],
        })
      );

      if (q.options && q.options.length > 0) {
        // Render 4 options nicely
        const optLetters = ['A', 'B', 'C', 'D'];
        q.options.forEach((opt, oIdx) => {
          docChildren.push(
            new Paragraph({
              indent: { left: 400 },
              spacing: { after: 40 },
              children: [
                new TextRun({ text: `${optLetters[oIdx] || '•'}. `, bold: true, size: 20 }),
                new TextRun({ text: cleanFormula(opt), size: 20 }),
              ],
            })
          );
        });
      }
      questionCounter++;
    });
  }

  // PHẦN 2: TRẮC NGHIỆM ĐÚNG SAI
  if (part2.length > 0) {
    const part2Start = questionCounter;
    docChildren.push(
      new Paragraph({
        spacing: { before: 300, after: 120 },
        children: [
          new TextRun({
            text: 'PHẦN II. CÂU TRẮC NGHIỆM ĐÚNG SAI (MỖI CÂU GỒM 4 Ý a, b, c, d)',
            bold: true,
            size: 22,
            color: '0F172A',
          }),
        ],
      })
    );
    docChildren.push(
      new Paragraph({
        spacing: { after: 180 },
        children: [
          new TextRun({
            text: `Thí sinh trả lời từ câu ${part2Start} đến câu ${part2Start + part2.length - 1}. Trong mỗi ý a), b), c), d) ở mỗi câu, thí sinh chọn đúng hoặc sai.`,
            italics: true,
            size: 19,
            color: '475569',
          }),
        ],
      })
    );

    part2.forEach((q) => {
      docChildren.push(
        new Paragraph({
          spacing: { before: 140, after: 80 },
          children: [
            new TextRun({ text: `Câu ${questionCounter}. `, bold: true, size: 21 }),
            new TextRun({ text: cleanFormula(q.content), size: 21 }),
          ],
        })
      );

      if (q.tfItems && q.tfItems.length > 0) {
        const tfLetters = ['a', 'b', 'c', 'd'];
        q.tfItems.forEach((sub, sIdx) => {
          docChildren.push(
            new Paragraph({
              indent: { left: 400 },
              spacing: { after: 50 },
              children: [
                new TextRun({ text: `${tfLetters[sIdx] || '•'}) `, bold: true, size: 20 }),
                new TextRun({ text: cleanFormula(sub.statement), size: 20 }),
              ],
            })
          );
        });
      }
      questionCounter++;
    });
  }

  // PHẦN 3: TRẮC NGHIỆM TRẢ LỜI NGẮN
  if (part3.length > 0) {
    const part3Start = questionCounter;
    docChildren.push(
      new Paragraph({
        spacing: { before: 300, after: 120 },
        children: [
          new TextRun({
            text: 'PHẦN III. CÂU TRẮC NGHIỆM TRẢ LỜI NGẮN (ĐIỀN ĐÁP SỐ)',
            bold: true,
            size: 22,
            color: '0F172A',
          }),
        ],
      })
    );
    docChildren.push(
      new Paragraph({
        spacing: { after: 180 },
        children: [
          new TextRun({
            text: `Thí sinh trả lời từ câu ${part3Start} đến câu ${part3Start + part3.length - 1}. Điền số nguyên hoặc phân số, số thập phân theo yêu cầu.`,
            italics: true,
            size: 19,
            color: '475569',
          }),
        ],
      })
    );

    part3.forEach((q) => {
      docChildren.push(
        new Paragraph({
          spacing: { before: 140, after: 60 },
          children: [
            new TextRun({ text: `Câu ${questionCounter}. `, bold: true, size: 21 }),
            new TextRun({ text: cleanFormula(q.content), size: 21 }),
          ],
        })
      );
      docChildren.push(
        new Paragraph({
          indent: { left: 400 },
          spacing: { after: 120 },
          children: [
            new TextRun({ text: 'Đáp số: ..............................................................', italics: true, size: 19, color: '64748B' }),
          ],
        })
      );
      questionCounter++;
    });
  }

  // PHẦN 4: TỰ LUẬN
  if (part4.length > 0) {
    const part4Start = questionCounter;
    docChildren.push(
      new Paragraph({
        spacing: { before: 300, after: 120 },
        children: [
          new TextRun({
            text: 'PHẦN IV. TỰ LUẬN (TRÌNH BÀY BÀI GIẢI CHI TIẾT)',
            bold: true,
            size: 22,
            color: '0F172A',
          }),
        ],
      })
    );
    docChildren.push(
      new Paragraph({
        spacing: { after: 180 },
        children: [
          new TextRun({
            text: `Thí sinh trình bày chi tiết lời giải từ câu ${part4Start} đến câu ${part4Start + part4.length - 1} vào giấy làm bài.`,
            italics: true,
            size: 19,
            color: '475569',
          }),
        ],
      })
    );

    part4.forEach((q) => {
      docChildren.push(
        new Paragraph({
          spacing: { before: 140, after: 160 },
          children: [
            new TextRun({ text: `Câu ${questionCounter} (${q.points || 1.5} điểm). `, bold: true, size: 21 }),
            new TextRun({ text: cleanFormula(q.content), size: 21 }),
          ],
        })
      );
      questionCounter++;
    });
  }

  // Footer / Divider
  docChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 300, after: 100 },
      children: [
        new TextRun({
          text: '----------------------- HẾT -----------------------',
          bold: true,
          size: 20,
        }),
      ],
    })
  );
  docChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: '(Cán bộ coi thi không giải thích gì thêm)',
          italics: true,
          size: 18,
          color: '64748B',
        }),
      ],
    })
  );

  // OPTIONAL: ANSWER KEY & DETAILED EXPLANATION (ĐÁP ÁN & HƯỚNG DẪN CHẤM)
  if (config.includeAnswers) {
    docChildren.push(
      new Paragraph({
        pageBreakBefore: true,
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 150 },
        children: [
          new TextRun({
            text: 'ĐÁP ÁN VÀ HƯỚNG DẪN GIẢI CHI TIẾT',
            bold: true,
            size: 26,
            color: '1E3A8A',
          }),
        ],
      })
    );
    docChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 250 },
        children: [
          new TextRun({
            text: `Đề thi: ${config.title} · Khối ${config.grade} · Mã đề: ${examCode}`,
            italics: true,
            size: 20,
            color: '475569',
          }),
        ],
      })
    );

    let ansCounter = 1;
    questions.forEach((q) => {
      const typeLabel =
        q.type === 'multiple_choice'
          ? 'Trắc nghiệm 4 đáp án'
          : q.type === 'true_false'
          ? 'Đúng / Sai'
          : q.type === 'short_answer'
          ? 'Trả lời ngắn'
          : 'Tự luận';

      docChildren.push(
        new Paragraph({
          spacing: { before: 180, after: 60 },
          children: [
            new TextRun({ text: `Câu ${ansCounter} (${typeLabel}): `, bold: true, size: 21, color: '1D4ED8' }),
            new TextRun({ text: `Đáp án: `, bold: true, size: 21 }),
            new TextRun({
              text: `${q.correctAnswer}`,
              bold: true,
              size: 21,
              color: '15803D',
            }),
            new TextRun({
              text: ` · Mức độ: ${q.bloomLevel} · Điểm: ${q.points || 0.25}đ`,
              italics: true,
              size: 18,
              color: '64748B',
            }),
          ],
        })
      );

      if (q.tfItems && q.tfItems.length > 0) {
        const tfLetters = ['a', 'b', 'c', 'd'];
        q.tfItems.forEach((sub, sIdx) => {
          docChildren.push(
            new Paragraph({
              indent: { left: 400 },
              spacing: { after: 40 },
              children: [
                new TextRun({ text: `Ý ${tfLetters[sIdx]}): `, bold: true, size: 19 }),
                new TextRun({
                  text: sub.isCorrect ? 'ĐÚNG' : 'SAI',
                  bold: true,
                  size: 19,
                  color: sub.isCorrect ? '15803D' : 'DC2626',
                }),
                new TextRun({ text: ` - ${cleanFormula(sub.explanation || sub.statement)}`, size: 19, color: '475569' }),
              ],
            })
          );
        });
      }

      if (q.explanation) {
        docChildren.push(
          new Paragraph({
            indent: { left: 300 },
            spacing: { after: 120 },
            children: [
              new TextRun({ text: 'Lời giải chi tiết: ', bold: true, size: 19, color: '0F172A' }),
              new TextRun({ text: cleanFormula(q.explanation), size: 19, color: '334155' }),
            ],
          })
        );
      }

      ansCounter++;
    });
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1134, // ~2cm
              bottom: 1134,
              left: 1417, // ~2.5cm
              right: 1134,
            },
          },
        },
        children: docChildren,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const safeTitle = config.title
    .replace(/[^a-zA-Z0-9À-ỹ\s]/g, '')
    .trim()
    .replace(/\s+/g, '_');
  link.download = `DeKiemTra_Lop${config.grade}_${safeTitle}_MaDe${examCode}.docx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function exportAnswerMatrixToDocx(
  answerMatrix: Array<{
    originalNumber: number;
    questionId: string;
    part: string;
    answersByCode: Record<string, string>;
  }>,
  codeList: string[],
  config: ExamExportConfig
) {
  const school = config.schoolName || 'TRƯỜNG THPT CHUYÊN LƯƠNG THẾ VINH';
  const tableRows: TableRow[] = [];

  // Header row
  tableRows.push(
    new TableRow({
      children: [
        new TableCell({
          width: { size: 10, type: WidthType.PERCENTAGE },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: 'CÂU', bold: true, size: 20 })],
            }),
          ],
        }),
        new TableCell({
          width: { size: 18, type: WidthType.PERCENTAGE },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: 'PHÂN ĐOẠN', bold: true, size: 20 })],
            }),
          ],
        }),
        ...codeList.map(
          (code) =>
            new TableCell({
              width: { size: Math.floor(72 / codeList.length), type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: `MÃ ${code}`, bold: true, size: 20, color: '1D4ED8' })],
                }),
              ],
            })
        ),
      ],
    })
  );

  // Data rows
  answerMatrix.forEach((row) => {
    tableRows.push(
      new TableRow({
        children: [
          new TableCell({
            width: { size: 10, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: `Câu ${row.originalNumber}`, bold: true, size: 19 })],
              }),
            ],
          }),
          new TableCell({
            width: { size: 18, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: row.part, size: 18, color: '4B5563' })],
              }),
            ],
          }),
          ...codeList.map(
            (code) =>
              new TableCell({
                width: { size: Math.floor(72 / codeList.length), type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({
                        text: row.answersByCode[code] || '-',
                        bold: true,
                        size: 19,
                        color: '15803D',
                      }),
                    ],
                  }),
                ],
              })
          ),
        ],
      })
    );
  });

  const matrixDoc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 },
          },
        },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: school.toUpperCase(), bold: true, size: 22 }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'BẢNG MA TRẬN ĐỐI CHIẾU ĐÁP ÁN CÁC MÃ ĐỀ THI HOÁN VỊ',
                bold: true,
                size: 26,
                color: '1D4ED8',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: `${config.title} · Khối ${config.grade} · Thời gian: ${config.duration}`,
                italics: true,
                size: 20,
              }),
            ],
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: tableRows,
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(matrixDoc);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `BangDapAn_CacMaDe_${config.grade}.docx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function exportExamMatrixTableToDocx(config: ExamExportConfig) {
  const school = config.schoolName || 'TRƯỜNG THPT CHUYÊN LƯƠNG THẾ VINH';
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 },
          },
        },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: school.toUpperCase(), bold: true, size: 22 })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'KHUNG MA TRẬN & BẢN ĐẶC TẢ ĐỀ KIỂM TRA ĐÁNH GIÁ ĐỊNH KỲ',
                bold: true,
                size: 24,
                color: '1D4ED8',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: `Môn: Toán học ${config.grade} · Chương trình GDPT 2018 · Thời gian: ${config.duration}`,
                italics: true,
                size: 20,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: '1. Khung Ma Trận Đề Kiểm Tra (Tỷ lệ 30% Nhận biết - 40% Thông hiểu - 20% Vận dụng - 10% Vận dụng cao):',
                bold: true,
                size: 21,
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: '• Phần I: Trắc nghiệm 4 lựa chọn (12 câu - 3,0 điểm, mỗi câu 0,25 điểm).\n• Phần II: Trắc nghiệm Đúng/Sai (4 câu - 4,0 điểm, mỗi câu 4 ý a,b,c,d).\n• Phần III: Trắc nghiệm trả lời ngắn (6 câu - 3,0 điểm, mỗi câu 0,5 điểm).\n• Tổng cộng: 22 câu hỏi - 10,0 điểm.',
                size: 20,
              }),
            ],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `KhungMaTran_DacTa_Toan${config.grade}.docx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function cleanFormula(str: string): string {
  if (!str) return '';
  return str
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '$1/$2')
    .replace(/\\cdot/g, '·')
    .replace(/\\times/g, '×')
    .replace(/\\pm/g, '±')
    .replace(/\\le/g, '≤')
    .replace(/\\ge/g, '≥')
    .replace(/\\ne/g, '≠')
    .replace(/\\approx/g, '≈')
    .replace(/\\parallel/g, '//')
    .replace(/\\perp/g, '⊥')
    .replace(/\\in/g, '∈')
    .replace(/\\notin/g, '∉')
    .replace(/\\mathbb\{R\}/g, 'ℝ')
    .replace(/\\mathbb\{N\}\^?\*?/g, 'ℕ*')
    .replace(/\\setminus/g, '\\')
    .replace(/\\Delta/g, 'Δ')
    .replace(/\\Omega/g, 'Ω')
    .replace(/\\widehat\{([^}]+)\}/g, 'góc $1')
    .replace(/\\sqrt\{([^}]+)\}/g, '√($1)')
    .replace(/\\text\{([^}]+)\}/g, '$1')
    .replace(/\$/g, '');
}
