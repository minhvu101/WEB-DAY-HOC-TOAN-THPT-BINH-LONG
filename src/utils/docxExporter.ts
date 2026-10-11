import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
} from 'docx';
import { KHBDItem } from '../types';

export async function exportKHBDToDocx(plan: KHBDItem, teacherName = 'Thầy Nguyễn Minh Vũ', schoolName = 'Trường THPT Bình Long') {
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
        children: [
          // Header School info
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: `${schoolName.toUpperCase()}`.trim(),
                bold: true,
                size: 24, // 12pt
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'TỔ CHUYÊN MÔN: TOÁN - TIN HỌC',
                bold: true,
                size: 22,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: '------------------------',
                size: 20,
              }),
            ],
          }),
          new Paragraph({ text: '' }),

          // Title
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'KẾ HOẠCH BÀI DẠY (GIÁO ÁN)',
                bold: true,
                size: 32, // 16pt
                color: '1E3A8A',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: `${plan.title.toUpperCase()}`,
                bold: true,
                size: 28,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: `Môn: Toán · Lớp ${plan.grade} · Bộ sách: ${plan.curriculum} · Thời lượng: ${plan.periodsCount} tiết`,
                italics: true,
                size: 24,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: `Giáo viên thực hiện: ${teacherName}`,
                bold: true,
                size: 22,
              }),
            ],
          }),
          new Paragraph({ text: '' }),

          // Source Document Info
          ...(plan.sourceDocument
            ? [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: 'CĂN CỨ VÀ NGUỒN TÀI LIỆU GỐC BIÊN SOẠN:',
                      bold: true,
                      size: 24,
                      color: '047857',
                    }),
                  ],
                }),
                new Paragraph({
                  bullet: { level: 0 },
                  children: [
                    new TextRun({
                      text: `Tài liệu nguồn đã nạp: ${plan.sourceDocument.name}`,
                      bold: true,
                      size: 22,
                    }),
                    new TextRun({
                      text: ` · ${plan.sourceDocument.sourceRef || 'Kho học liệu số MathHub'}`,
                      size: 22,
                      italics: true,
                    }),
                  ],
                }),
                ...(plan.sourceDocument.pedagogicalFocus
                  ? [
                      new Paragraph({
                        bullet: { level: 0 },
                        children: [
                          new TextRun({
                            text: `Định hướng sư phạm AI: ${plan.sourceDocument.pedagogicalFocus}`,
                            size: 22,
                          }),
                        ],
                      }),
                    ]
                  : []),
                new Paragraph({ text: '' }),
              ]
            : []),

          // Part I: Objectives
          new Paragraph({
            children: [
              new TextRun({
                text: 'I. MỤC TIÊU BÀI DẠY (THEO CÔNG VĂN 5512/BGDĐT)',
                bold: true,
                size: 26,
                color: '0369A1',
              }),
            ],
          }),

          // 1. Knowledge
          new Paragraph({
            children: [
              new TextRun({
                text: '1. Về kiến thức:',
                bold: true,
                size: 24,
              }),
            ],
          }),
          ...plan.objectives.knowledge.map(
            (k) =>
              new Paragraph({
                bullet: { level: 0 },
                children: [new TextRun({ text: k, size: 24 })],
              })
          ),

          // 2. Competencies
          new Paragraph({
            children: [
              new TextRun({
                text: '2. Về năng lực:',
                bold: true,
                size: 24,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'a) Năng lực chung:',
                italics: true,
                bold: true,
                size: 24,
              }),
            ],
          }),
          ...plan.objectives.generalCompetencies.map(
            (c) =>
              new Paragraph({
                bullet: { level: 0 },
                children: [new TextRun({ text: c, size: 24 })],
              })
          ),
          new Paragraph({
            children: [
              new TextRun({
                text: 'b) Năng lực toán học đặc thù:',
                italics: true,
                bold: true,
                size: 24,
              }),
            ],
          }),
          ...plan.objectives.specificCompetencies.map(
            (c) =>
              new Paragraph({
                bullet: { level: 0 },
                children: [new TextRun({ text: c, size: 24 })],
              })
          ),

          // 3. Qualities
          new Paragraph({
            children: [
              new TextRun({
                text: '3. Về phẩm chất:',
                bold: true,
                size: 24,
              }),
            ],
          }),
          ...plan.objectives.qualities.map(
            (q) =>
              new Paragraph({
                bullet: { level: 0 },
                children: [new TextRun({ text: q, size: 24 })],
              })
          ),
          new Paragraph({ text: '' }),

          // Part II: Teaching equipment
          new Paragraph({
            children: [
              new TextRun({
                text: 'II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU SỐ',
                bold: true,
                size: 26,
                color: '0369A1',
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: '1. Giáo viên: Kế hoạch bài dạy, bài giảng trình chiếu PPTX, hệ sinh thái MathHub, máy chiếu, bảng phụ, phiếu học tập.',
                size: 24,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: '2. Học sinh: Sách giáo khoa, đồ dùng học tập, thiết bị truy cập MathHub Math Lab (nếu có).',
                size: 24,
              }),
            ],
          }),
          new Paragraph({ text: '' }),

          // Part III: Pedagogical Process (4 Steps)
          new Paragraph({
            children: [
              new TextRun({
                text: 'III. TIẾN TRÌNH DẠY HỌC (4 HOẠT ĐỘNG SƯ PHẠM)',
                bold: true,
                size: 26,
                color: '0369A1',
              }),
            ],
          }),

          ...plan.activities.flatMap((act, index) => [
            new Paragraph({
              children: [
                new TextRun({
                  text: `${act.step}: ${act.title.toUpperCase()} (${act.duration})`,
                  bold: true,
                  size: 24,
                  color: '0F766E',
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: 'a) Mục tiêu: ',
                  bold: true,
                  size: 24,
                }),
                new TextRun({
                  text: 'Giúp học sinh tiếp cận kiến thức trọng tâm, kích hoạt tư duy và giải quyết tình huống thực tế.',
                  size: 24,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: 'b) Nội dung & Mô tả hoạt động: ',
                  bold: true,
                  size: 24,
                }),
                new TextRun({
                  text: act.description,
                  size: 24,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: 'c) Sản phẩm: ',
                  bold: true,
                  size: 24,
                }),
                new TextRun({
                  text: 'Câu trả lời của học sinh trên phiếu học tập, kết quả thao tác trực quan trên MathHub.',
                  size: 24,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: 'd) Tổ chức thực hiện: ',
                  bold: true,
                  size: 24,
                }),
                new TextRun({
                  text: 'GV giao nhiệm vụ -> HS thảo luận theo 4 tổ -> Đại diện báo cáo -> GV chuẩn hóa kết luận.',
                  size: 24,
                }),
              ],
            }),
            new Paragraph({ text: '' }),
          ]),

          // Signatures
          new Paragraph({ text: '' }),
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [
              new TextRun({
                text: 'Đồng Nai, ngày ..... tháng ..... năm 2026',
                italics: true,
                size: 22,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [
              new TextRun({
                text: 'GIÁO VIÊN BỘ MÔN          ',
                bold: true,
                size: 24,
              }),
            ],
          }),
          new Paragraph({ text: '' }),
          new Paragraph({ text: '' }),
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [
              new TextRun({
                text: `${teacherName}          `,
                bold: true,
                size: 24,
              }),
            ],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const safeTitle = plan.title.replace(/[^a-zA-Z0-9_\u00C0-\u024F\u1E00-\u1EFF]/g, '_');
  const filename = `KHBD_${plan.curriculum}_Lop${plan.grade}_${safeTitle}.docx`;

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
