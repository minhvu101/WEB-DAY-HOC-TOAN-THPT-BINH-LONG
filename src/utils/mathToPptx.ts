/**
 * Math Formatter for PowerPoint (.pptx) Presentations
 * Converts LaTeX expressions, equations, and math notation into 
 * beautiful, mathematically accurate Unicode and standard typographical notation
 * compatible with Microsoft PowerPoint, Google Slides, and Apple Keynote.
 */

// Mapping for superscript characters
const SUPERSCRIPT_MAP: Record<string, string> = {
  '0': '⁰',
  '1': '¹',
  '2': '²',
  '3': '³',
  '4': '⁴',
  '5': '⁵',
  '6': '⁶',
  '7': '⁷',
  '8': '⁸',
  '9': '⁹',
  '+': '⁺',
  '-': '⁻',
  '=': '⁼',
  '(': '⁽',
  ')': '⁾',
  'n': 'ⁿ',
  'x': 'ˣ',
  'y': 'ʸ',
  'k': 'ᵏ',
  'm': 'ᵐ',
  't': 'ᵗ',
  'a': 'ᵃ',
  'b': 'ᵇ',
  'c': 'ᶜ',
};

// Mapping for subscript characters
const SUBSCRIPT_MAP: Record<string, string> = {
  '0': '₀',
  '1': '₁',
  '2': '₂',
  '3': '₃',
  '4': '₄',
  '5': '₅',
  '6': '₆',
  '7': '₇',
  '8': '₈',
  '9': '₉',
  '+': '₊',
  '-': '₋',
  '=': '₌',
  '(': '₍',
  ')': '₎',
  'a': 'ₐ',
  'e': 'ₑ',
  'h': 'ₕ',
  'i': 'ᵢ',
  'j': 'ⱼ',
  'k': 'ₖ',
  'l': 'ₗ',
  'm': 'ₘ',
  'n': 'ₙ',
  'o': 'ₒ',
  'p': 'ₚ',
  'r': 'ᵣ',
  's': 'ₛ',
  't': 'ₜ',
  'u': 'ᵤ',
  'v': 'ᵥ',
  'x': 'ₓ',
};

function toSuperscript(str: string): string {
  let res = '';
  for (const ch of str) {
    if (SUPERSCRIPT_MAP[ch]) {
      res += SUPERSCRIPT_MAP[ch];
    } else {
      return `^(${str})`;
    }
  }
  return res;
}

function toSubscript(str: string): string {
  let res = '';
  for (const ch of str) {
    if (SUBSCRIPT_MAP[ch]) {
      res += SUBSCRIPT_MAP[ch];
    } else {
      return `_${str}`;
    }
  }
  return res;
}

/**
 * Extracts balanced braced group starting at {
 */
function extractBracedGroup(str: string, startIndex: number): { content: string; endIndex: number } | null {
  if (startIndex >= str.length || str[startIndex] !== '{') return null;
  let depth = 0;
  const start = startIndex + 1;
  for (let i = startIndex; i < str.length; i++) {
    if (str[i] === '{') depth++;
    else if (str[i] === '}') {
      depth--;
      if (depth === 0) {
        return { content: str.substring(start, i), endIndex: i };
      }
    }
  }
  return null;
}

/**
 * Recursively converts LaTeX fractions \frac{num}{den} or \dfrac{num}{den}
 */
function parseFractions(input: string): string {
  let str = input;
  let changed = true;
  let loopCount = 0;

  while (changed && loopCount < 10) {
    loopCount++;
    changed = false;
    const matchIdx = str.search(/\\(?:d?frac)\{/);
    if (matchIdx !== -1) {
      const fracWordLen = str.substring(matchIdx).startsWith('\\dfrac{') ? 6 : 5;
      const firstBrace = matchIdx + fracWordLen;
      const numGroup = extractBracedGroup(str, firstBrace);

      if (numGroup) {
        const afterNum = numGroup.endIndex + 1;
        const denStart = str.indexOf('{', afterNum);
        if (denStart !== -1 && denStart <= afterNum + 2) {
          const denGroup = extractBracedGroup(str, denStart);
          if (denGroup) {
            changed = true;
            const parsedNum = cleanMathForPptx(numGroup.content.trim());
            const parsedDen = cleanMathForPptx(denGroup.content.trim());

            // Smart formatting for fraction
            let formattedFrac = '';
            const isNumSimple = /^[a-zA-Z0-9\-+Δ·\s]+$/.test(parsedNum) && !parsedNum.includes('/');
            const isDenSimple = /^[a-zA-Z0-9\-+Δ·\s]+$/.test(parsedDen) && !parsedDen.includes('/');

            if (isNumSimple && isDenSimple) {
              if (parsedDen.length <= 4 && !parsedNum.includes(' ') && !parsedDen.includes(' ')) {
                formattedFrac = `${parsedNum}/${parsedDen}`;
              } else {
                formattedFrac = `${parsedNum}/(${parsedDen})`;
              }
            } else if (isNumSimple) {
              formattedFrac = `${parsedNum}/(${parsedDen})`;
            } else {
              formattedFrac = `(${parsedNum})/(${parsedDen})`;
            }

            str = str.substring(0, matchIdx) + formattedFrac + str.substring(denGroup.endIndex + 1);
          }
        }
      }
    }
  }

  return str;
}

/**
 * Recursively parses square roots \sqrt{...} and \sqrt[n]{...}
 */
function parseRoots(input: string): string {
  let str = input;
  let changed = true;
  let loopCount = 0;

  while (changed && loopCount < 10) {
    loopCount++;
    changed = false;
    // Check for \sqrt[n]{...}
    const nthMatch = str.match(/\\sqrt\[([^\]]+)\]\{/);
    if (nthMatch && nthMatch.index !== undefined) {
      const braceIdx = nthMatch.index + nthMatch[0].length - 1;
      const group = extractBracedGroup(str, braceIdx);
      if (group) {
        changed = true;
        const nDegree = toSuperscript(nthMatch[1]);
        const inner = cleanMathForPptx(group.content.trim());
        const replacement = `${nDegree}√(${inner})`;
        str = str.substring(0, nthMatch.index) + replacement + str.substring(group.endIndex + 1);
        continue;
      }
    }

    // Check for standard \sqrt{...}
    const stdIdx = str.indexOf('\\sqrt{');
    if (stdIdx !== -1) {
      const braceIdx = stdIdx + 5;
      const group = extractBracedGroup(str, braceIdx);
      if (group) {
        changed = true;
        const inner = cleanMathForPptx(group.content.trim());
        const replacement = inner.length <= 4 && /^[a-zA-Z0-9Δ]+$/.test(inner) ? `√${inner}` : `√(${inner})`;
        str = str.substring(0, stdIdx) + replacement + str.substring(group.endIndex + 1);
      }
    }
  }

  return str;
}

/**
 * Converts LaTeX text to clean, professional PowerPoint math typography
 */
export function cleanMathForPptx(text: string | null | undefined): string {
  if (!text) return '';
  let s = String(text);

  // 1. Pre-process LaTeX text tags: \text{...}, \mathrm{...}, \mathbf{...}
  s = s.replace(/\\(?:text|mathrm|mathbf)\{([^}]+)\}/g, '$1');

  // 2. Parse nested fractions and roots
  s = parseFractions(s);
  s = parseRoots(s);

  // 3. Greek letters (Uppercase & Lowercase)
  // Ensure \Delta t becomes Δt (no space gap)
  s = s.replace(/\\Delta\s*([a-zA-Z0-9])/g, 'Δ$1');
  s = s.replace(/\\delta\s*([a-zA-Z0-9])/g, 'δ$1');
  s = s.replace(/\\Delta\b/g, 'Δ');
  s = s.replace(/\\delta\b/g, 'δ');
  s = s.replace(/\\alpha\b/g, 'α');
  s = s.replace(/\\beta\b/g, 'β');
  s = s.replace(/\\gamma\b/g, 'γ');
  s = s.replace(/\\Gamma\b/g, 'Γ');
  s = s.replace(/\\theta\b/g, 'θ');
  s = s.replace(/\\Theta\b/g, 'Θ');
  s = s.replace(/\\lambda\b/g, 'λ');
  s = s.replace(/\\Lambda\b/g, 'Λ');
  s = s.replace(/\\mu\b/g, 'μ');
  s = s.replace(/\\pi\b/g, 'π');
  s = s.replace(/\\Pi\b/g, 'Π');
  s = s.replace(/\\sigma\b/g, 'σ');
  s = s.replace(/\\Sigma\b/g, 'Σ');
  s = s.replace(/\\omega\b/g, 'ω');
  s = s.replace(/\\Omega\b/g, 'Ω');
  s = s.replace(/\\phi\b/g, 'φ');
  s = s.replace(/\\Phi\b/g, 'Φ');
  s = s.replace(/\\epsilon\b/g, 'ε');

  // 4. Sets and Number systems
  s = s.replace(/\\mathbb\{R\}/g, 'ℝ');
  s = s.replace(/\\mathbb\{N\}\^?\*?/g, 'ℕ*');
  s = s.replace(/\\mathbb\{N\}/g, 'ℕ');
  s = s.replace(/\\mathbb\{Z\}/g, 'ℤ');
  s = s.replace(/\\mathbb\{Q\}/g, 'ℚ');
  s = s.replace(/\\mathbb\{C\}/g, 'ℂ');
  s = s.replace(/\\emptyset\b/g, '∅');

  // 5. Mathematical Operators and Relations
  s = s.replace(/\\pm\b/g, '±');
  s = s.replace(/\\mp\b/g, '∓');
  s = s.replace(/\\times\b/g, '×');
  s = s.replace(/\\cdot\b/g, '·');
  s = s.replace(/\\ne\b|\\neq\b/g, '≠');
  s = s.replace(/\\le\b|\\leq\b/g, '≤');
  s = s.replace(/\\ge\b|\\geq\b/g, '≥');
  s = s.replace(/\\approx\b/g, '≈');
  s = s.replace(/\\equiv\b/g, '≡');
  s = s.replace(/\\perp\b/g, '⊥');
  s = s.replace(/\\parallel\b/g, '∥');
  s = s.replace(/\\in\b/g, '∈');
  s = s.replace(/\\notin\b/g, '∉');
  s = s.replace(/\\subset\b/g, '⊂');
  s = s.replace(/\\subseteq\b/g, '⊆');
  s = s.replace(/\\cup\b/g, '∪');
  s = s.replace(/\\cap\b/g, '∩');
  s = s.replace(/\\forall\b/g, '∀');
  s = s.replace(/\\exists\b/g, '∃');

  // 6. Logic and Arrow symbols
  s = s.replace(/\\iff\b|\\Leftrightarrow\b/g, ' ⇔ ');
  s = s.replace(/\\implies\b|\\Rightarrow\b/g, ' ⇒ ');
  s = s.replace(/\\Leftarrow\b/g, ' ⇐ ');
  s = s.replace(/\\to\b|\\rightarrow\b/g, ' → ');
  s = s.replace(/\\leftarrow\b/g, ' ← ');
  s = s.replace(/\\downarrow\b/g, ' ↓');
  s = s.replace(/\\uparrow\b/g, ' ↑');
  s = s.replace(/\\infty\b/g, '∞');

  // 7. Calculus, Limits and Sums
  s = s.replace(/\\lim_\{([^}]+)\}/g, (_, limSub) => {
    const cleanSub = cleanMathForPptx(limSub).replace(/\s+/g, ' ');
    return `lim(${cleanSub})`;
  });
  s = s.replace(/\\lim\b/g, 'lim');
  s = s.replace(/\\int_\{([^}]+)\}\^\{([^}]+)\}/g, '∫[$1 → $2]');
  s = s.replace(/\\int\b/g, '∫');
  s = s.replace(/\\sum_\{([^}]+)\}\^\{([^}]+)\}/g, '∑[$1 → $2]');
  s = s.replace(/\\sum\b/g, '∑');

  // 8. Geometry and Vectors
  s = s.replace(/\\widehat\{([^}]+)\}/g, '∠$1');
  s = s.replace(/\\angle\b/g, '∠');
  s = s.replace(/\\triangle\b/g, '△');
  s = s.replace(/\\vec\{([^}]+)\}/g, 'vectơ $1');
  s = s.replace(/\\overrightarrow\{([^}]+)\}/g, 'vectơ $1');

  // 9. Degrees and Angles
  s = s.replace(/\^\\circ\b|\^\{\\circ\}/g, '°');
  s = s.replace(/\\circ\b/g, '°');

  // 10. Superscripts: ^{expr} or ^x
  s = s.replace(/\^\{([^{}]+)\}/g, (_, group) => {
    return toSuperscript(group);
  });
  s = s.replace(/\^([0-9nxyktabc+\-])/g, (_, ch) => {
    return SUPERSCRIPT_MAP[ch] || `^${ch}`;
  });

  // 11. Subscripts: _{expr} or _x
  s = s.replace(/_\{([^{}]+)\}/g, (_, group) => {
    if (/^[0-9aehijklmnoprstuvx+\-]+$/.test(group)) {
      return toSubscript(group);
    }
    return `_${group}`;
  });
  s = s.replace(/_([0-9aehijklmnoprstuvx+\-])/g, (_, ch) => {
    return SUBSCRIPT_MAP[ch] || `_${ch}`;
  });

  // 12. Brackets, enclosures, and spaces
  s = s.replace(/\\left\(/g, '(');
  s = s.replace(/\\right\)/g, ')');
  s = s.replace(/\\left\[/g, '[');
  s = s.replace(/\\right\]/g, ']');
  s = s.replace(/\\left\\\{/g, '{');
  s = s.replace(/\\right\\\}/g, '}');
  s = s.replace(/\\left\|/g, '|');
  s = s.replace(/\\right\|/g, '|');
  s = s.replace(/\\quad\b/g, '   ');
  s = s.replace(/\\qquad\b/g, '     ');
  s = s.replace(/\\(?=[ \t])/g, ' '); // Backslash followed by space
  s = s.replace(/\\[,;:!]/g, ' ');
  s = s.replace(/\\displaystyle\b/g, '');

  // 13. Strip LaTeX inline/block delimiters ($ and $$)
  s = s.replace(/\$\$([\s\S]*?)\$\$/g, '$1');
  s = s.replace(/\$([^$]+?)\$/g, '$1');
  s = s.replace(/\$/g, '');

  // 14. Clean residual backslashes before known math words or punctuation
  s = s.replace(/\\([a-zA-Z]+)/g, '$1');
  s = s.replace(/\\\\/g, '\n');

  // 15. Normalize spaces
  s = s.replace(/[ \t]{2,}/g, ' ').trim();

  return s;
}

/**
 * Specifically formats the prominent formula callout box in PowerPoint slides
 * Ensures high clarity, balanced spacing, and pedagogical presentation
 */
export function formatCoreFormulaForPptx(formula: string | null | undefined): string {
  if (!formula) return '';
  const cleaned = cleanMathForPptx(formula);

  // Normalize equation separators for big formula banner
  let formatted = cleaned
    .replace(/\s*,\s*x\s*=/g, '   |   Trục đối xứng: x =')
    .replace(/\s*;\s*/g, ' ; ')
    .replace(/\s*\|\s*/g, '   |   ')
    .replace(/\s*⇔\s*/g, '   ⇔   ')
    .replace(/\s*⇒\s*/g, '   ⇒   ');

  return formatted;
}
