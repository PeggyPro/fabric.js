import { config } from '../../config';
import { FabricText } from './Text';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Rect } from '../Rect';

describe('TextSvgExport', () => {
  it('exports text background color correctly', () => {
    const myText = new FabricText('text', {
      backgroundColor: 'rgba(100, 0, 100)',
    });
    const svgString = myText.toSVG();
    expect(svgString.includes('fill="rgb(100,0,100)"')).toBe(true);
    expect(svgString.includes('fill-opacity="1"')).toBe(false);
  });

  it('exports text background color opacity correctly', () => {
    const myText = new FabricText('text', {
      backgroundColor: 'rgba(100, 0, 100, 0.5)',
    });
    const svgString = myText.toSVG();
    expect(svgString.includes('fill-opacity="0.5"')).toBe(true);
  });

  it('exports text svg styles correctly', () => {
    const myText = new FabricText('text', { fill: 'rgba(100, 0, 100, 0.5)' });
    const svgStyles = myText.getSvgStyles();
    expect(svgStyles.includes('fill: rgb(100,0,100); fill-opacity: 0.5;')).toBe(
      true,
    );
    expect(svgStyles.includes('stroke="none"')).toBe(false);
  });

  describe('toSVG', () => {
    beforeEach(() => {
      config.configure({ NUM_FRACTION_DIGITS: 2 });
    });

    afterEach(() => {
      config.restoreDefaults();
    });

    it('toSVG', () => {
      const TEXT_SVG =
        '<g transform="" style=""  >\n\t\t<text xml:space="preserve" font-family="Times New Roman" font-size="40" font-style="normal" font-weight="normal" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1; white-space: pre;" ><tspan x="-10" y="12.57" >x</tspan></text>\n</g>\n';
      const text = new FabricText('x');
      expect(removeTranslate(text.toSVG())).toEqualSVG(
        removeTranslate(TEXT_SVG),
      );
      text.set('fontFamily', 'Arial');
      expect(removeTranslate(text.toSVG())).toEqualSVG(
        removeTranslate(
          TEXT_SVG.replace(
            'font-family="Times New Roman"',
            'font-family="Arial"',
          ),
        ),
      );
    });

    it('toSVG justified', () => {
      const TEXT_SVG_JUSTIFIED =
        '<g transform="" style=""  >\n\t\t<text xml:space="preserve" font-family="Times New Roman" font-size="40" font-style="normal" font-weight="normal" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1; white-space: pre;" ><tspan x="-60" y="-13.65" >xxxxxx</tspan><tspan x="-60" y="38.78" style="white-space: pre; ">x </tspan><tspan x="40" y="38.78" >y</tspan></text>\n</g>\n';
      const text = new FabricText('xxxxxx\nx y', {
        textAlign: 'justify',
      });

      expect(removeTranslate(text.toSVG())).toEqualSVG(
        removeTranslate(TEXT_SVG_JUSTIFIED),
      );
    });

    it('toSVG with multiple spaces', () => {
      const TEXT_SVG_MULTIPLESPACES =
        '<g transform="" style=""  >\n\t\t<text xml:space="preserve" font-family="Times New Roman" font-size="40" font-style="normal" font-weight="normal" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1; white-space: pre;" ><tspan x="-105" y="12.57" style="white-space: pre; ">x                 y</tspan></text>\n</g>\n';
      const text = new FabricText('x                 y');
      expect(removeTranslate(text.toSVG())).toEqualSVG(
        removeTranslate(TEXT_SVG_MULTIPLESPACES),
      );
    });

    it('toSVG with deltaY', () => {
      config.configure({ NUM_FRACTION_DIGITS: 0 });
      const TEXT_SVG =
        '<g transform="" style=""  >\n\t\t<text xml:space="preserve" font-family="Times New Roman" font-size="40" font-style="normal" font-weight="normal" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1; white-space: pre;" ><tspan x="-16" y="13" >x</tspan><tspan x="4" y="13"  dy="-14" style="font-size: 24px; baseline-shift: 14; ">x</tspan></text>\n</g>\n';
      const text = new FabricText('xx', {
        styles: {
          0: {
            1: {
              deltaY: -14,
              fontSize: 24,
            },
          },
        },
      });
      expect(removeTranslate(text.toSVG())).toEqualSVG(
        removeTranslate(TEXT_SVG),
      );
      config.configure({ NUM_FRACTION_DIGITS: 2 });
    });

    it('toSVG with font', () => {
      const TEXT_SVG_WITH_FONT =
        '<g transform="" style=""  >\n\t\t<text xml:space="preserve" font-family="Times New Roman" font-size="40" font-style="normal" font-weight="normal" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1; white-space: pre;" ><tspan x="-60" y="-13.65" style="font-family: \'Times New Roman\'; ">xxxxxx</tspan><tspan x="-60" y="38.78" style="white-space: pre; ">x </tspan><tspan x="40" y="38.78" >y</tspan></text>\n</g>\n';
      const text = new FabricText('xxxxxx\nx y', {
        textAlign: 'justify',
        styles: {
          0: {
            0: { fontFamily: 'Times New Roman' },
            1: { fontFamily: 'Times New Roman' },
            2: { fontFamily: 'Times New Roman' },
            3: { fontFamily: 'Times New Roman' },
            4: { fontFamily: 'Times New Roman' },
            5: { fontFamily: 'Times New Roman' },
          },
        },
      });
      expect(removeTranslate(text.toSVG())).toEqualSVG(
        removeTranslate(TEXT_SVG_WITH_FONT),
      );
    });

    it('toSVG with text as a clipPath', () => {
      config.configure({ NUM_FRACTION_DIGITS: 0 });
      const EXPECTED =
        '<g transform="" clip-path="url(#CLIPPATH_0)"  >\n<clipPath id="CLIPPATH_0" >\n\t\t\t<text xml:space="preserve" font-family="Times New Roman" font-size="40" font-style="normal" font-weight="normal" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1; white-space: pre;" ><tspan x="-122" y="13" >text as clipPath</tspan></text>\n</clipPath>\n<rect style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;"  x="-100" y="-50" rx="0" ry="0" width="200" height="100" />\n</g>\n';
      const clipPath = new FabricText('text as clipPath');
      const rect = new Rect({ width: 200, height: 100 });
      rect.clipPath = clipPath;
      expect(removeTranslate(rect.toSVG())).toEqualSVG(
        removeTranslate(EXPECTED),
      );
    });
  });
});

/**
 * Remove translate matrix transformations from SVG string for comparison
 */
function removeTranslate(str: string) {
  return str.replace(/matrix\(.*?\)/, '');
}
