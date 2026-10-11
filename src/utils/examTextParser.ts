import { Question, BloomLevel } from '../types';

export function parseRawExamText(
  rawText: string,
  defaultGrade: number = 11,
  defaultTopic: string = 'Đạo hàm & Hàm số'
): Question[] {
  if (!rawText || !rawText.trim()) return [];

  // Split by Question markers: "Câu 1:", "Câu 1.", "Bài 1:", "CÂU 1:"
  const questionBlocks = rawText.split(/(?=(?:Câu|Bài|CÂU|BÀI)\s+\d+[:.])/i);
  const questions: Question[] = [];

  let autoIdCounter = 1;

  for (const block of questionBlocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;

    // Check if starts with Câu X
    const matchHeader = trimmed.match(/^(?:Câu|Bài|CÂU|BÀI)\s+(\d+)[:.]\s*([\s\S]*)/i);
    if (!matchHeader) continue;

    const qNum = matchHeader[1];
    const rest = matchHeader[2].trim();

    // Determine type:
    // 1. Check for True/False: contains a), b), c), d) sub-items
    const hasTfPattern =
      /[a-d]\)\s+[^a-d\)]+/i.test(rest) &&
      (rest.includes('đúng') || rest.includes('sai') || rest.includes('Đúng') || rest.includes('Sai') || rest.toLowerCase().includes('đúng/sai'));

    // 2. Check for Multiple choice: A., B., C., D.
    const hasMcqPattern =
      /[A-D]\.\s+[^A-D\.]+/i.test(rest) &&
      /A\./.test(rest) &&
      /B\./.test(rest);

    // 3. Check for Short Answer: "Đáp số:", "Đáp án:", "Kết quả:" with a short value
    const hasShortAnswerPattern =
      /(?:đáp số|kết quả|điền đáp án)[:]\s*([^\n\r]+)/i.test(rest);

    // Extract bloom level if mentioned
    let bloomLevel: BloomLevel = 'ThongHieu';
    if (/nhận biết|nhan biet/i.test(rest)) bloomLevel = 'NhanBiet';
    else if (/vận dụng cao|van dung cao/i.test(rest)) bloomLevel = 'VanDungCao';
    else if (/vận dụng|van dung/i.test(rest)) bloomLevel = 'VanDung';

    // Extract explanation if present
    let explanation = '';
    const expMatch = rest.match(/(?:Lời giải|Hướng dẫn giải|Giải chi tiết)[:]\s*([\s\S]*)$/i);
    let mainContent = rest;
    if (expMatch) {
      explanation = expMatch[1].trim();
      mainContent = rest.substring(0, expMatch.index).trim();
    }

    if (hasTfPattern) {
      // Parse True/False
      const lines = mainContent.split('\n');
      let promptLines: string[] = [];
      const tfSubItems: Array<{ id: string; statement: string; isCorrect: boolean }> = [];

      for (const line of lines) {
        const itemMatch = line.match(/^([a-d])\)\s+(.*?)(?:\s*[-–]\s*(Đúng|Sai|đúng|sai))?$/i);
        if (itemMatch) {
          const letter = itemMatch[1].toLowerCase();
          const statement = itemMatch[2].trim();
          const mark = itemMatch[3];
          const isCorrect = mark ? /đúng/i.test(mark) : true;
          tfSubItems.push({
            id: `sub-${letter}`,
            statement,
            isCorrect,
          });
        } else if (tfSubItems.length === 0) {
          promptLines.push(line);
        }
      }

      questions.push({
        id: `IMP-TF-${autoIdCounter++}`,
        content: promptLines.join('\n').trim() || `Xét tính đúng sai của các mệnh đề sau:`,
        type: 'true_false',
        section: 'part2_true_false',
        grade: defaultGrade,
        topic: defaultTopic,
        bloomLevel,
        tfItems: tfSubItems.length > 0 ? tfSubItems : [
          { id: 'sub-a', statement: 'Mệnh đề a', isCorrect: true },
          { id: 'sub-b', statement: 'Mệnh đề b', isCorrect: false },
          { id: 'sub-c', statement: 'Mệnh đề c', isCorrect: true },
          { id: 'sub-d', statement: 'Mệnh đề d', isCorrect: false },
        ],
        correctAnswer: 'Đ/S',
        explanation: explanation || 'Xem xét đạo hàm và bảng biến thiên.',
      });
    } else if (hasMcqPattern) {
      // Parse Multiple Choice
      // Split options A., B., C., D.
      const optA = mainContent.match(/A\.\s+([\s\S]*?)(?=B\.|$)/i);
      const optB = mainContent.match(/B\.\s+([\s\S]*?)(?=C\.|$)/i);
      const optC = mainContent.match(/C\.\s+([\s\S]*?)(?=D\.|$)/i);
      const optD = mainContent.match(/D\.\s+([\s\S]*?)(?=(?:Chọn|Đáp án|Lời giải|$))/i);

      let questionStem = mainContent.split(/A\./i)[0].trim();

      const options = [
        optA ? optA[1].trim() : 'Phương án A',
        optB ? optB[1].trim() : 'Phương án B',
        optC ? optC[1].trim() : 'Phương án C',
        optD ? optD[1].trim() : 'Phương án D',
      ];

      // Detect correct answer
      let correctAnswer = options[0];
      const ansMatch = rest.match(/(?:Đáp án|Chọn)[:]\s*([A-D])/i);
      if (ansMatch) {
        const letter = ansMatch[1].toUpperCase();
        const idx = ['A', 'B', 'C', 'D'].indexOf(letter);
        if (idx >= 0) correctAnswer = options[idx];
      }

      questions.push({
        id: `IMP-MCQ-${autoIdCounter++}`,
        content: questionStem,
        type: 'multiple_choice',
        section: 'part1_mcq',
        grade: defaultGrade,
        topic: defaultTopic,
        bloomLevel,
        options,
        correctAnswer,
        explanation: explanation || `Đáp án đúng là ${ansMatch ? ansMatch[1] : 'A'}.`,
      });
    } else if (hasShortAnswerPattern) {
      // Short Answer
      const saMatch = mainContent.match(/(?:đáp số|kết quả|điền đáp án)[:]\s*([^\n\r]+)/i);
      const ansVal = saMatch ? saMatch[1].trim() : '0';
      const questionStem = mainContent.replace(/(?:đáp số|kết quả|điền đáp án)[:]\s*[^\n\r]+/i, '').trim();

      questions.push({
        id: `IMP-SA-${autoIdCounter++}`,
        content: questionStem,
        type: 'short_answer',
        section: 'part3_short_answer',
        grade: defaultGrade,
        topic: defaultTopic,
        bloomLevel,
        correctAnswer: ansVal,
        explanation: explanation || `Kết quả tính toán là ${ansVal}.`,
      });
    } else {
      // Essay or general question
      questions.push({
        id: `IMP-ES-${autoIdCounter++}`,
        content: mainContent,
        type: 'essay',
        section: 'part4_essay',
        grade: defaultGrade,
        topic: defaultTopic,
        bloomLevel,
        points: 1.5,
        correctAnswer: 'Trình bày lời giải chi tiết',
        explanation: explanation || 'Học sinh lập luận và tính toán theo các bước tiêu chuẩn.',
      });
    }
  }

  return questions;
}
