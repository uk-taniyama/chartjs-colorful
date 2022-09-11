/* eslint-disable @typescript-eslint/ban-ts-comment */
import { CanvasGradient } from 'canvas';
import { ColorfulPlugin } from './colorfulPlugin';
import type { NamedLinear } from './types';
import { addLinear, addLinears } from './createColorSchemes';
import { createLinear } from './helpers';

describe('ColorfulPlugin', () => {
  it('id', () => {
    expect(ColorfulPlugin.id).toBe('colorful');
  });
  const ctx = {
    raw: {
      r: 0,
      v: 1,
    },
  };
  const linears: NamedLinear = {
    test: createLinear('#000'),
  };

  beforeEach(() => {
    addLinears(linears);
  });

  afterEach(() => {
    Object.keys(linears).forEach((k) => addLinear(k, undefined as any));
  });

  function createChart(): any {
    const canvas = document.createElement('canvas');
    return {
      type: 'line',
      ctx: canvas.getContext('2d'),
      chartArea: {
        top: 0, bottom: 100, left: 0, right: 100, height: 100, width: 100,
      },
      data: {
        datasets: [{}, {}],
      },
      config: {
        options: {
          scales: {
          },
        },
      },
    };
  }
  it('empty', () => {
    const chart = createChart();
    // @ts-ignore
    ColorfulPlugin.beforeInit(chart, undefined, {
      data: [],
    });
    expect(true).toBeTrue();
  });

  it('update dataset only. set valid function.', () => {
    const chart = createChart();
    // @ts-ignore
    ColorfulPlugin.beforeInit(chart, undefined, {
      data: [{
        min: 0,
        max: 1,
        name: 'test',
        datasetIndex: 0,
      }],
    });
    const color = chart.data.datasets[0].backgroundColor;
    expect(color).toBeFunction();
    expect(color()).toBeInstanceOf(CanvasGradient);
  });

  it('update dataset only', () => {
    const chart = createChart();
    // @ts-ignore
    ColorfulPlugin.beforeInit(chart, undefined, {
      data: [{
        min: 0,
        max: 1,
        datasetIndex: 0,
        value: 'v',
        name: 'name',
      }],
    });
    const color = chart.data.datasets[0].backgroundColor;
    expect(color).toBeFunction();
    expect(color(ctx)).toBe('#000');
  });

  it('many', () => {
    const chart = createChart();
    // @ts-ignore
    ColorfulPlugin.beforeInit(chart, undefined, {
      data: [{
        min: 0,
        max: 1,
        value: 'v',
        name: 'name',
      }, {
        min: 0,
        max: 10,
        value: 'r',
        name: 'test',
        datasetIndex: 1,
        axis: 'r',
        min2: 1,
        max2: 0,
      }],
    });
    const color0 = chart.data.datasets[0].backgroundColor;
    expect(color0).toBeUndefined();
    const color1 = chart.data.datasets[1].backgroundColor;
    expect(color1).toBeFunction();
    const scale = chart.config.options.scales.r;
    expect(scale).toEqual({
      linear: expect.toBeFunction(),
      min: 0,
      max: 10,
      type: 'colorful',
    });
    const { linear } = scale;
    expect(linear()(0)).toBe('#000');
  });
});
