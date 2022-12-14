import type {
  Chart, ChartType, Plugin, ScriptableContext,
} from 'chart.js';
import type { DeepPartial } from 'chart.js/types/utils';
import {
  clampColor,
  createLinear, createScriptableColor, createScriptableValue,
  getColor, getColors,
  isFunction, isNumber,
  transparent,
} from './helpers';
import type {
  Color, ColorConverter, ColorLinear, Colors, ScriptableValue,
} from './types';
import type { ColorfulScaleOptions } from './colorfulScale';
import { createColorfulScaleOptions } from './colorfulScale';
import { linears, schemes } from './registries';

/**
 * color: color by datasetIndex.
 * color2: converted color by datasetIndex.
 * gradient: gradient color by datasetIndex.
 * colors: color by dataIndex.(ex.type='pie')
 * colors2: converted color by dataIndex.(ex.type='pie')
 * gradients: gradient color by dataIndex.(ex.type='pie')
 */
export type ColorFnNames = 'color' | 'color2' | 'gradient' | 'colors' | 'colors2' | 'gradients';

export interface ColorfulPluginDatasetOptions {
  /**
    * target dataset type's array.
    */
  types?: string[];
  backgroundColor?: ColorFnNames;
  borderColor?: ColorFnNames;
  pointBackgroundColor?: ColorFnNames;
  pointBorderColor?: ColorFnNames;
  hoverBackgroundColor?: ColorFnNames;
  hoverBorderColor?: ColorFnNames;
}

export interface ColorfulPluginDataOptions {
  /**
   * minimum number for the scale.
   */
  min: number;
  /**
   * maximum number for the scale.
   */
  max: number;
  /**
   * name for the color linear.
   * @see {@link registries.linears}
   */
  linear?: string;
  /**
   * colorful-scale axis.
   */
  axis?: string;
  /**
   * options for color-scale
   */
  scale?: DeepPartial<ColorfulScaleOptions>;
  /**
   * target dataset index.
   * @default 0
   */
  datasetIndex?: number;
  /**
   * value key name or value from ctx function.
   */
  value?: string | ScriptableValue;
  /**
   * minimum number for the color linear.
   * @default 0.0
   */
  min2?: number;
  /**
   * maximum number for the color linear.
   * @default 1.0
   */
  max2?: number;
}

export interface ColorfulPluginOptions {
  /**
   * name for the scheme or colors.
   *
   * @see {@link registries.schemes}
   */
  colors: string | Colors;
  /**
   * ColorConverter for color2.
   */
  converter: ColorConverter;
  dataset: ColorfulPluginDatasetOptions[];
  data: ColorfulPluginDataOptions[];
}

export interface IColorfulPlugin extends Plugin<ChartType, ColorfulPluginOptions> {
  defaults: ColorfulPluginOptions;
  /** @private */
  colors: Colors;
  /** @private */
  colors2: Colors;

  /** @private */
  beforeUpdated: boolean;
  /** @private */
  isUpdate: boolean;
  /** @private */
  isDatasetsUpdate: boolean;
  /** @private */
  updated: [any, string][];
}

function getGradientParamByRScale(
  chart: Chart,
) {
  const rScale = chart?.scales?.r;
  if (rScale == null) {
    return null;
  }
  const { xCenter, yCenter, drawingArea } = rScale as any;
  if (xCenter == null || yCenter == null || drawingArea == null) {
    return null;
  }
  return {
    x: xCenter,
    y: yCenter,
    r1: 0,
    r2: drawingArea,
  };
}

function getGradientParamByArcElement(
  chart: Chart,
  datasetIndex: number,
  dataIndex: number,
) {
  const el = chart.getDatasetMeta(datasetIndex)?.data[dataIndex];
  if (el == null) {
    return null;
  }
  const {
    x, y, innerRadius, outerRadius,
  } = el.getProps(['x', 'y', 'innerRadius', 'outerRadius'], true);
  if (!isNumber(x) || !isNumber(y) || !isNumber(innerRadius) || !isNumber(outerRadius)) {
    return null;
  }
  return {
    x, y, r1: innerRadius, r2: outerRadius,
  };
}

function setGradientColorStop(gradient: CanvasGradient, color: ColorLinear | Color) {
  if (isFunction(color)) {
    for (let i = 0; i <= 10; i += 1) {
      const v = (i / 10);
      gradient.addColorStop(v, color(v));
    }
  } else {
    gradient.addColorStop(0, transparent(color));
    gradient.addColorStop(1, color);
  }
}

function createDataGradient(
  chart: Chart,
  color: Color,
  datasetIndex: number,
  dataIndex: number,
) {
  const param = getGradientParamByRScale(chart)
   || getGradientParamByArcElement(chart, datasetIndex, dataIndex);
  if (param == null) {
    return color;
  }
  const { ctx } = chart;
  const gradient = ctx.createRadialGradient(
    param.x,
    param.y,
    param.r1,
    param.x,
    param.y,
    param.r2,
  );
  setGradientColorStop(gradient, color);
  return gradient;
}

function createRadialGradient(
  chart: Chart,
): CanvasGradient | null {
  const param = getGradientParamByRScale(chart);
  if (param == null) {
    return null;
  }

  const { ctx } = chart;
  return ctx.createRadialGradient(
    param.x,
    param.y,
    param.r1,
    param.x,
    param.y,
    param.r2,
  );
}

export function createGradient(
  chart: Chart,
  linear: ColorLinear | string,
): CanvasGradient | null {
  const { ctx, chartArea } = chart;
  if (chartArea == null) {
    return null;
  }

  let gradient = createRadialGradient(chart);
  if (gradient == null) {
    const {
      top, left, bottom, right,
    } = chartArea;
    const indexAxis = chart.options?.indexAxis;
    if (indexAxis === 'x') {
      gradient = ctx.createLinearGradient(0, bottom, 0, top);
    } else {
      gradient = ctx.createLinearGradient(left, 0, right, 0);
    }
  }
  setGradientColorStop(gradient, linear);
  return gradient;
}

/** @internal */
export function createScriptableValueColor(
  plugin: IColorfulPlugin,
  color: Color,
  value: string | ScriptableValue,
  linear: ColorLinear,
) {
  const toColor = createScriptableColor(createScriptableValue(value), linear);
  return (ctx: ScriptableContext<any>) => {
    // for legends.
    if (plugin.isUpdate && !plugin.isDatasetsUpdate) {
      return color;
    }
    // for data.
    return toColor(ctx);
  };
}

/** @internal */
export function createScriptableGradient(
  plugin: IColorfulPlugin,
  color: Color,
  linear: ColorLinear | null = null,
) {
  return ({ chart }: ScriptableContext<any>) => {
    // for legends.
    if (plugin.isUpdate && !plugin.isDatasetsUpdate) {
      return color;
    }
    // for data.
    return createGradient(chart, linear || color);
  };
}

/** @internal */
export function createScriptableDataGradient(plugin: IColorfulPlugin, colors: Colors) {
  return ({ chart, datasetIndex, dataIndex }: ScriptableContext<any>) => {
    const color = getColor(colors, dataIndex);
    // for legends.
    if (plugin.isUpdate && !plugin.isDatasetsUpdate) {
      return color;
    }
    // for data.
    return createDataGradient(
      chart,
      color,
      datasetIndex,
      dataIndex,
    );
  };
}

/** @internal */
export function resolveColors(colorsOrName: Colors | string): Colors {
  if (Array.isArray(colorsOrName)) {
    return colorsOrName;
  }
  return schemes.get(colorsOrName);
}

/** @internal */
export function applyColorfulPluginDataOptions(
  plugin: IColorfulPlugin,
  chart: Chart,
  data: ColorfulPluginDataOptions,
) {
  const {
    linear: name,
    min,
    max,
    axis,
    scale,
    datasetIndex,
    value,
    min2 = 0,
    max2 = 1,
  } = data;

  const linear = name
    ? linears.get(name)
    : createLinear(getColor(plugin.colors, datasetIndex || 0));
  const valueToColor = clampColor(linear, min, max, min2, max2);
  if (axis) {
    const opt = createColorfulScaleOptions(valueToColor, min, max);
    // eslint-disable-next-line no-param-reassign
    (chart.options as any).scales![axis] = Object.assign(opt, scale);
  }

  if (datasetIndex == null) {
    return;
  }
  const dataset = chart.data.datasets[datasetIndex];
  if (dataset == null) {
    return;
  }

  const colorMax = linear(max2);
  if (value) {
    // background by value.
    const color = createScriptableValueColor(plugin, colorMax, value, valueToColor);
    dataset.borderColor = colorMax;
    dataset.backgroundColor = color as any;
    // NOTE DONT set pointBackgoundColor.
  } else {
    // gradation background.
    const color = createScriptableGradient(plugin, colorMax, linear);
    dataset.backgroundColor = color as any;
    dataset.borderColor = colorMax;
    (dataset as any).pointBackgroundColor = colorMax;
  }
}

export function createColor(
  plugin: IColorfulPlugin,
  colorFn: string,
  datasetIndex: number,
  dataLength: number,
) {
  const { colors, colors2 } = plugin;
  if (colorFn === 'color') {
    return getColor(colors, datasetIndex);
  }
  if (colorFn === 'color2') {
    return getColor(colors2, datasetIndex);
  }
  if (colorFn === 'gradient') {
    return createScriptableGradient(
      plugin,
      getColor(colors, datasetIndex),
    );
  }
  if (colorFn === 'colors') {
    return getColors(colors, dataLength);
  }
  if (colorFn === 'colors2') {
    return getColors(colors2, dataLength);
  }
  if (colorFn === 'gradients') {
    return createScriptableDataGradient(plugin, colors);
  }
  return null;
}

/** @internal */
export function applyColorfulPluginDatasetOptions(
  plugin: IColorfulPlugin,
  chart: Chart,
  opts: ColorfulPluginDatasetOptions[],
) {
  if (!opts || opts.length === 0) {
    return;
  }
  const chartType = (chart.config as any).type;
  chart.data.datasets.forEach((dataset, index) => {
    const type = dataset.type || chartType;
    const opt = opts.find((o) => o.types === undefined || o.types.indexOf(type) >= 0);
    if (opt == null) {
      return;
    }
    Object.entries(opt)
      .forEach(([name, colorFn]) => {
        if (!name.endsWith('Color')) {
          return;
        }
        const target = dataset as any;
        if (target[name] !== undefined) {
          return;
        }
        const color = createColor(plugin, colorFn, index, dataset.data.length);
        if (color != null) {
          plugin.updated.push([target, name]);
          target[name] = color;
        }
      });
  });
}

/** @internal */
export function applyColorfulPluginOptions(
  plugin: IColorfulPlugin,
  chart: any,
  opts: ColorfulPluginOptions,
) {
  const {
    colors, converter, dataset, data,
  } = opts;
  /* eslint-disable no-param-reassign */
  plugin.colors = Array.isArray(colors) ? colors : schemes.get(colors);
  plugin.colors2 = converter == null ? plugin.colors : plugin.colors.map((c) => converter(c));
  /* eslint-disable no-param-reassign */
  applyColorfulPluginDatasetOptions(plugin, chart, dataset);
  data?.forEach((d) => applyColorfulPluginDataOptions(plugin, chart, d));
}

declare module 'chart.js' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface PluginOptionsByType<TType extends ChartType> {
    colorful: ColorfulPluginOptions;
  }
}

export const colorfulPluginDatasetDefaults: ColorfulPluginDatasetOptions[] = [
  {
    types: ['pie', 'doughnut', 'polarArea'],
    borderColor: 'colors',
    backgroundColor: 'gradients',
    hoverBackgroundColor: 'colors',
  }, {
    types: ['bar', 'line'],
    borderColor: 'color',
    backgroundColor: 'gradient',
    pointBackgroundColor: 'color',
    hoverBackgroundColor: 'color',
  }, {
    types: ['radar'],
    borderColor: 'color',
    backgroundColor: 'gradient',
    pointBackgroundColor: 'color',
  }, {
    borderColor: 'color',
    backgroundColor: 'color2',
    hoverBackgroundColor: 'color',
  },
];

/**
 * support colorful-scale and colorful-chart plugin.
 * @see {@link ColorfulPluginOptions}
 */
const ColorfulPluginImpl: IColorfulPlugin = {
  /** @private */
  id: 'colorful',
  /** @private */
  defaults: {
    colors: '',
    converter: null as any,
    dataset: colorfulPluginDatasetDefaults,
    data: [],
  },

  colors: [],
  colors2: [],

  /**
   * @private
   * scale options cannot change beforeUpdate.
   * so, scale options are set and chart.update() ONLY ONCE in beforeUpdate.
   */
  beforeUpdated: false,

  isDatasetsUpdate: false,

  isUpdate: false,

  updated: [],

  /** @private */
  beforeInit(chart: Chart, _args: any, opts: ColorfulPluginOptions) {
    applyColorfulPluginOptions(this, chart, opts);
    this.beforeUpdated = true;
  },

  /** @private */
  beforeUpdate(chart: Chart, _args: any, opts: ColorfulPluginOptions) {
    this.isUpdate = true;
    if (this.beforeUpdated === false) {
      applyColorfulPluginOptions(this, chart, opts);
      this.beforeUpdated = true;
      chart.update();
      return false;
    }
    return undefined;
  },

  /** @private */
  afterUpdate() {
    this.isUpdate = false;
    this.beforeUpdated = false;
    this.updated.forEach(([target, name]) => delete target[name]);
    this.updated = [];
  },

  /** @private */
  beforeDatasetsUpdate() {
    this.isDatasetsUpdate = true;
  },

  /** @private */
  afterDatasetsUpdate() {
    this.isDatasetsUpdate = false;
  },
};

export const ColorfulPlugin = ColorfulPluginImpl as Plugin<ChartType, ColorfulPluginOptions>;
