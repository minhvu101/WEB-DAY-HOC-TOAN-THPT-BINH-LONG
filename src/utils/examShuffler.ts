import { Question, QuestionType } from '../types';

export interface ShuffledExamCode {
  code: string;
  questions: Question[];
  // Mapping of question index -> correct answer string
  answerKey: Record<number, string>;
  // Mapping of original question id -> new question index (1-based)
  positionMap: Record<string, number>;
}

export interface MultiCodeExamResult {
  codes: ShuffledExamCode[];
  // Comparison matrix: Row = Question # in Code 101, Columns = Answer in each Code
  answerMatrix: Array<{
    originalNumber: number;
    questionId: string;
    part: string;
    answersByCode: Record<string, string>;
  }>;
}

// Pseudo-random seeded shuffle for reproducibility given a seed string
function createSeededRandom(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function shuffleArray<T>(array: T[], randomFn: () => number): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(randomFn() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function generateExamCodes(
  originalQuestions: Question[],
  codeList: string[] = ['101', '102', '103', '104'],
  options: {
    shuffleQuestionsWithinPart: boolean;
    shuffleOptionsInMCQ: boolean;
    shuffleSubItemsInTF: boolean;
  } = {
    shuffleQuestionsWithinPart: true,
    shuffleOptionsInMCQ: true,
    shuffleSubItemsInTF: true,
  }
): MultiCodeExamResult {
  const resultCodes: ShuffledExamCode[] = [];

  // Categorize questions by parts
  const part1 = originalQuestions.filter(
    (q) => !q.section || q.section === 'part1_mcq' || q.type === 'multiple_choice'
  );
  const part2 = originalQuestions.filter(
    (q) => q.section === 'part2_true_false' || q.type === 'true_false'
  );
  const part3 = originalQuestions.filter(
    (q) => q.section === 'part3_short_answer' || q.type === 'short_answer'
  );
  const part4 = originalQuestions.filter(
    (q) => q.section === 'part4_essay' || q.type === 'essay'
  );

  codeList.forEach((codeStr, codeIdx) => {
    // For code 101, keep original order unless specified
    const isMasterCode = codeIdx === 0;
    const seed = parseInt(codeStr, 10) || (101 + codeIdx);
    const rnd = createSeededRandom(seed * 7919);

    let p1 = [...part1];
    let p2 = [...part2];
    let p3 = [...part3];
    let p4 = [...part4];

    if (!isMasterCode && options.shuffleQuestionsWithinPart) {
      p1 = shuffleArray(p1, rnd);
      p2 = shuffleArray(p2, rnd);
      p3 = shuffleArray(p3, rnd);
      // Essay questions usually kept in order or shuffled gently
      p4 = shuffleArray(p4, rnd);
    }

    // Now transform individual questions (shuffle options/sub-items)
    const transformQuestion = (q: Question): Question => {
      if (isMasterCode) return { ...q };

      // Multiple choice option shuffling
      if (q.type === 'multiple_choice' && q.options && options.shuffleOptionsInMCQ) {
        const originalOpts = [...q.options];
        const correctText = String(q.correctAnswer);
        const shuffledOpts = shuffleArray(originalOpts, rnd);

        return {
          ...q,
          options: shuffledOpts,
          correctAnswer: correctText, // keep the answer text
        };
      }

      // True / False sub-item shuffling
      if (q.type === 'true_false' && q.tfItems && options.shuffleSubItemsInTF) {
        const shuffledItems = shuffleArray(q.tfItems, rnd);
        return {
          ...q,
          tfItems: shuffledItems,
        };
      }

      return { ...q };
    };

    const transformedQuestions = [
      ...p1.map(transformQuestion),
      ...p2.map(transformQuestion),
      ...p3.map(transformQuestion),
      ...p4.map(transformQuestion),
    ];

    const answerKey: Record<number, string> = {};
    const positionMap: Record<string, number> = {};

    transformedQuestions.forEach((q, idx) => {
      const qNum = idx + 1;
      positionMap[q.id] = qNum;

      if (q.type === 'multiple_choice') {
        if (q.options) {
          const cIdx = q.options.indexOf(String(q.correctAnswer));
          answerKey[qNum] = cIdx >= 0 ? ['A', 'B', 'C', 'D'][cIdx] : 'A';
        } else {
          answerKey[qNum] = String(q.correctAnswer || 'A');
        }
      } else if (q.type === 'true_false') {
        if (q.tfItems) {
          // Format: a:Đ, b:S, c:Đ, d:S
          answerKey[qNum] = q.tfItems
            .map((item, i) => `${['a', 'b', 'c', 'd'][i]}:${item.isCorrect ? 'Đ' : 'S'}`)
            .join(' | ');
        } else {
          answerKey[qNum] = 'Đ/S';
        }
      } else if (q.type === 'short_answer') {
        answerKey[qNum] = String(q.correctAnswer || '');
      } else {
        answerKey[qNum] = 'Tự luận';
      }
    });

    resultCodes.push({
      code: codeStr,
      questions: transformedQuestions,
      answerKey,
      positionMap,
    });
  });

  // Construct comparison answer matrix based on Code 101 question order
  const masterCode = resultCodes[0];
  const answerMatrix: MultiCodeExamResult['answerMatrix'] = [];

  masterCode.questions.forEach((q, idx) => {
    const qNum = idx + 1;
    let partLabel = 'Phần I';
    if (q.type === 'true_false' || q.section === 'part2_true_false') partLabel = 'Phần II';
    else if (q.type === 'short_answer' || q.section === 'part3_short_answer') partLabel = 'Phần III';
    else if (q.type === 'essay' || q.section === 'part4_essay') partLabel = 'Phần IV';

    const answersByCode: Record<string, string> = {};

    resultCodes.forEach((c) => {
      const targetPos = c.positionMap[q.id];
      if (targetPos) {
        answersByCode[c.code] = `Câu ${targetPos}: ${c.answerKey[targetPos]}`;
      } else {
        answersByCode[c.code] = '-';
      }
    });

    answerMatrix.push({
      originalNumber: qNum,
      questionId: q.id,
      part: partLabel,
      answersByCode,
    });
  });

  return {
    codes: resultCodes,
    answerMatrix,
  };
}
