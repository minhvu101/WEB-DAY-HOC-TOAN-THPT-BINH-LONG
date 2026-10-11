import React, { useMemo } from 'react';
import katex from 'katex';

interface MathFormulaProps {
  math: string | number | undefined | null;
  block?: boolean;
  className?: string;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderPureMath(expr: string, isBlock: boolean): string {
  try {
    return katex.renderToString(expr.trim(), {
      displayMode: isBlock,
      throwOnError: false,
      output: 'html',
    });
  } catch {
    return escapeHtml(expr);
  }
}

export const MathFormula: React.FC<MathFormulaProps> = ({ math, block = false, className = '' }) => {
  const content = String(math ?? '').trim();

  const renderedHtml = useMemo(() => {
    if (!content) return '';

    // Case 1: Text contains explicit $...$ or $$...$$ delimiters
    if (content.includes('$')) {
      const regex = /(\$\$[\s\S]*?\$\$|\$[^$]+?\$)/g;
      const tokens = content.split(regex);
      return tokens
        .map((token) => {
          if (!token) return '';
          if (token.startsWith('$$') && token.endsWith('$$') && token.length >= 4) {
            const mathExpr = token.slice(2, -2);
            return renderPureMath(mathExpr, true);
          }
          if (token.startsWith('$') && token.endsWith('$') && token.length >= 2) {
            const mathExpr = token.slice(1, -1);
            return renderPureMath(mathExpr, false);
          }
          // Plain text token with Vietnamese or punctuation: keep it as escaped HTML
          return escapeHtml(token);
        })
        .join('');
    }

    // Case 2: No dollar signs.
    // Check if it contains accented Vietnamese characters.
    const hasVietnamese = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(content);

    // If block=true or contains typical LaTeX symbols and no Vietnamese prose, render with KaTeX
    const isMathFormula =
      !hasVietnamese &&
      (block ||
        /[\^_{}=]|\\frac|\\lim|\\ne|\\le|\\ge|\\iff|\\Rightarrow|\\cdot|\\Delta|\\vec|\\sqrt|\\pm/.test(
          content
        ) ||
        content.startsWith('y =') ||
        content.startsWith('f(') ||
        content.startsWith('I(') ||
        content.startsWith('s(t)'));

    if (isMathFormula) {
      return renderPureMath(content, block);
    }

    // Fallback: render plain text safely
    return escapeHtml(content);
  }, [content, block]);

  if (block) {
    return (
      <div
        className={`my-2 overflow-x-auto text-center py-1 text-slate-800 ${className}`}
        dangerouslySetInnerHTML={{ __html: renderedHtml }}
      />
    );
  }

  return (
    <span
      className={`inline ${className}`}
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  );
};

export default MathFormula;
