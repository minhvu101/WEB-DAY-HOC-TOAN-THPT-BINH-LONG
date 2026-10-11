import JSZip from 'jszip';

/**
 * PPTX Morph Transition & Shape Pairing Enhancer
 * 
 * Microsoft PowerPoint Morph Transition operates on consecutive slides.
 * By injecting the Office Open XML p159:morph element and tagging matching 
 * shapes across slides with PowerPoint's "!!" naming convention, PowerPoint 
 * automatically animates, resizes, interpolates and morphs small details 
 * (headers, badges, formula boxes, step cards, quiz options, footers) smoothly at 60fps!
 */

export interface MorphEnhancerOptions {
  /** Transition duration in milliseconds (default: 1250ms) */
  durationMs?: number;
  /** Morph mode: 'byObject' | 'byWord' | 'byChar' (default: 'byObject') */
  morphMode?: 'byObject' | 'byWord' | 'byChar';
}

/**
 * Injects PowerPoint Morph transition and standardizes object names with "!!" tags
 * into a generated .pptx presentation.
 */
export async function enhancePptxWithMorph(
  pptxData: ArrayBuffer | Uint8Array,
  options: MorphEnhancerOptions = {}
): Promise<Blob> {
  const durationMs = options.durationMs || 1250;
  const morphMode = options.morphMode || 'byObject';

  const zip = await JSZip.loadAsync(pptxData);

  // Find all slide files: ppt/slides/slide{n}.xml
  const slideFileNames = Object.keys(zip.files)
    .filter((name) => /^ppt\/slides\/slide\d+\.xml$/.test(name))
    .sort((a, b) => {
      const numA = parseInt(a.replace(/\D/g, ''), 10) || 0;
      const numB = parseInt(b.replace(/\D/g, ''), 10) || 0;
      return numA - numB;
    });

  const morphXmlBlock = `
<mc:AlternateContent xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006">
  <mc:Choice xmlns:p159="http://schemas.microsoft.com/office/powerpoint/2015/09/main" Requires="p159">
    <p:transition spd="med" xmlns:p14="http://schemas.microsoft.com/office/powerpoint/2010/main" p14:dur="${durationMs}">
      <p159:morph option="${morphMode}"/>
    </p:transition>
  </mc:Choice>
  <mc:Fallback>
    <p:transition spd="med">
      <p:fade/>
    </p:transition>
  </mc:Fallback>
</mc:AlternateContent>`.trim();

  for (let i = 0; i < slideFileNames.length; i++) {
    const fileName = slideFileNames[i];
    const slideFile = zip.file(fileName);
    if (!slideFile) continue;

    let slideXml = await slideFile.async('string');

    // 1. Ensure required namespaces are declared on <p:sld>
    slideXml = ensureSlideNamespaces(slideXml);

    // 2. Inject Morph transition XML (for slide 2 onwards, or all slides for full continuity)
    slideXml = injectMorphTransition(slideXml, morphXmlBlock);

    // 3. Tag shapes inside slide with consistent "!!" Morph identifiers
    slideXml = tagShapesForMorph(slideXml, i + 1);

    zip.file(fileName, slideXml);
  }

  // Generate finalized PPTX blob with DEFLATE compression
  return await zip.generateAsync({
    type: 'blob',
    mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });
}

/**
 * Ensures namespaces for PowerPoint 2015/2016 Morph transition exist on <p:sld>
 */
function ensureSlideNamespaces(xml: string): string {
  return xml.replace(/<p:sld([^>]*)>/, (match, attrs) => {
    let newAttrs = attrs;

    if (!newAttrs.includes('xmlns:mc=')) {
      newAttrs += ' xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"';
    }
    if (!newAttrs.includes('xmlns:p14=')) {
      newAttrs += ' xmlns:p14="http://schemas.microsoft.com/office/powerpoint/2010/main"';
    }
    if (!newAttrs.includes('xmlns:p159=')) {
      newAttrs += ' xmlns:p159="http://schemas.microsoft.com/office/powerpoint/2015/09/main"';
    }
    if (!newAttrs.includes('mc:Ignorable=')) {
      newAttrs += ' mc:Ignorable="p14 p159"';
    } else if (!newAttrs.includes('p159')) {
      newAttrs = newAttrs.replace(/mc:Ignorable="([^"]*)"/, 'mc:Ignorable="$1 p159"');
    }

    return `<p:sld${newAttrs}>`;
  });
}

/**
 * Injects or replaces the transition element with the Morph transition block
 */
function injectMorphTransition(xml: string, morphXml: string): string {
  // If slide already has a transition element or AlternateContent transition, replace it
  if (xml.includes('<mc:AlternateContent') && xml.includes('p159:morph')) {
    return xml; // Already enhanced
  }

  if (xml.includes('<p:transition')) {
    xml = xml.replace(/<p:transition[\s\S]*?<\/p:transition>/, morphXml);
    return xml;
  }

  // Schema order: <p:cSld>, <p:clrMapOvr>, <p:transition>, <p:timing>, <p:extLst>
  if (xml.includes('</p:clrMapOvr>')) {
    return xml.replace('</p:clrMapOvr>', `</p:clrMapOvr>${morphXml}`);
  }

  // Fallback: insert before </p:sld>
  return xml.replace('</p:sld>', `${morphXml}</p:sld>`);
}

/**
 * Assigns standardized "!!" Morph identifiers to shapes and text containers
 * so Microsoft PowerPoint matches them across slides and animates their transformation.
 */
function tagShapesForMorph(xml: string, slideNumber: number): string {
  // Split shapes by <p:sp>...</p:sp>
  const spRegex = /<p:sp>([\s\S]*?)<\/p:sp>/g;

  let cardIndex = 1;
  let decorIndex = 1;

  return xml.replace(spRegex, (match, spContent) => {
    // Extract text content
    const textMatches = Array.from(spContent.matchAll(/<a:t>([\s\S]*?)<\/a:t>/g)) as RegExpMatchArray[];
    const fullText = textMatches.map((m) => m[1] || '').join(' ').trim();
    const upperText = fullText.toUpperCase();

    // Extract geometry coordinates: x, y, cx, cy (in EMUs, 914400 EMUs = 1 inch)
    const offMatch = spContent.match(/<a:off\s+x="(\d+)"\s+y="(\d+)"/);
    const extMatch = spContent.match(/<a:ext\s+cx="(\d+)"\s+cy="(\d+)"/);

    const x = offMatch ? parseInt(offMatch[1], 10) : 0;
    const y = offMatch ? parseInt(offMatch[2], 10) : 0;
    const cx = extMatch ? parseInt(extMatch[1], 10) : 0;
    const cy = extMatch ? parseInt(extMatch[2], 10) : 0;

    // Classify shape for Morph
    let morphName = '';

    // 1. Top Accent Line (height is tiny, y <= 50,000)
    if (y <= 50000 && cy <= 250000 && cx >= 8000000) {
      morphName = '!!MorphAccentLine';
    }
    // 2. Header System Badge / Category Pill (y <= 850,000, left aligned)
    else if (
      y <= 850000 &&
      x <= 4000000 &&
      (upperText.includes('HỆ SINH THÁI') ||
        upperText.includes('MỤC TIÊU') ||
        upperText.includes('KHÁM PHÁ') ||
        upperText.includes('VÍ DỤ') ||
        upperText.includes('TRẮC NGHIỆM') ||
        upperText.includes('TỔNG KẾT') ||
        upperText.includes('CÔNG THỨC') ||
        upperText.includes('MATHHUB') ||
        (cy <= 500000 && cx <= 7000000))
    ) {
      morphName = fullText ? '!!MorphHeaderBadgeText' : '!!MorphHeaderBadgePill';
    }
    // 3. Grade / Year Pill (y <= 850,000, right aligned or mentioning TOÁN LỚP)
    else if (
      (y <= 850000 && x >= 5500000) ||
      upperText.includes('TOÁN LỚP') ||
      upperText.includes('GDPT 2018') ||
      upperText.includes('NĂM HỌC')
    ) {
      morphName = fullText ? '!!MorphGradeText' : '!!MorphGradePill';
    }
    // 4. Slide Title (y between 500,000 and 2,000,000 with title-like text)
    else if (
      y >= 500000 &&
      y <= 2000000 &&
      fullText.length > 0 &&
      !upperText.includes('CĂN CỨ') &&
      !upperText.includes('GIÁO VIÊN')
    ) {
      if (slideNumber === 1 && y <= 2200000) {
        morphName = '!!MorphMainTitle';
      } else if (y <= 1200000) {
        morphName = '!!MorphSlideTitle';
      } else {
        morphName = '!!MorphSlideSubtitle';
      }
    }
    // 5. Formula Container or Formula Expression
    else if (
      upperText.includes('CÔNG THỨC') ||
      upperText.includes('ĐỊNH LÝ') ||
      upperText.includes('TỔNG QUÁT') ||
      fullText.includes('=') ||
      fullText.includes('\\Delta') ||
      fullText.includes('\\frac') ||
      fullText.includes('\\sqrt') ||
      fullText.includes('f(x)') ||
      fullText.includes('lim') ||
      fullText.includes('ax²') ||
      fullText.includes('y =') ||
      fullText.includes('x =') ||
      fullText.includes('d(')
    ) {
      if (fullText.length > 5 && (fullText.includes('=') || fullText.includes('f('))) {
        morphName = '!!MorphFormulaMath';
      } else {
        morphName = '!!MorphFormulaBox';
      }
    }
    // 6. Step-by-Step Badges & Content Cards
    else if (upperText.includes('BƯỚC 1') || upperText.includes('PHÂN TÍCH')) {
      morphName = '!!MorphStepCard1';
    } else if (upperText.includes('BƯỚC 2') || upperText.includes('TÍNH TOÁN')) {
      morphName = '!!MorphStepCard2';
    } else if (upperText.includes('BƯỚC 3') || upperText.includes('KẾT LUẬN')) {
      morphName = '!!MorphStepCard3';
    }
    // 7. Quiz Questions & 4 Options
    else if (upperText.includes('CÂU HỎI TRẮC NGHIỆM') || upperText.includes('CÂU HỎI:')) {
      morphName = '!!MorphQuizQuestion';
    } else if (fullText.startsWith('A.') || fullText.startsWith('A:')) {
      morphName = '!!MorphQuizOptA';
    } else if (fullText.startsWith('B.') || fullText.startsWith('B:')) {
      morphName = '!!MorphQuizOptB';
    } else if (fullText.startsWith('C.') || fullText.startsWith('C:')) {
      morphName = '!!MorphQuizOptC';
    } else if (fullText.startsWith('D.') || fullText.startsWith('D:')) {
      morphName = '!!MorphQuizOptD';
    }
    // 8. Slide Footer (y >= 6,000,000)
    else if (y >= 6000000) {
      if (cy <= 150000) {
        morphName = '!!MorphFooterLine';
      } else if (fullText.includes('Slide') || fullText.includes('/')) {
        morphName = '!!MorphSlideNumber';
      } else {
        morphName = '!!MorphFooterText';
      }
    }
    // 9. Floating Decorative elements or Cards
    else if (cx <= 1000000 && cy <= 1000000 && !fullText) {
      morphName = `!!MorphDecor${decorIndex++}`;
    }
    // 10. General Content Containers
    else {
      morphName = `!!MorphCard${cardIndex++}`;
    }

    // Apply the morphName to <p:cNvPr>
    const updatedContent = spContent.replace(
      /(<p:cNvPr[^>]*?)name="[^"]*"/,
      `$1name="${morphName}"`
    );

    return `<p:sp>${updatedContent}</p:sp>`;
  });
}
