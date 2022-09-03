import { color as toColor } from 'chart.js/helpers';
import type { ColorModel } from 'chart.js/helpers';

type Fn = (v: ColorModel) => ColorModel;

class Builder {
  fn: Fn[];

  constructor() {
    this.fn = [];
  }

  build() {
    return (color: string) => this.fn.reduce((prev, fn) => fn(prev), toColor(color)).hexString();
  }

  mix(color: string, weight: number) {
    this.fn.push((x) => x.mix(toColor(color), weight));
    return this;
  }

  alpha(v: number) {
    this.fn.push((x) => x.alpha(v));
    return this;
  }

  clearer(ration: number) {
    this.fn.push((x) => x.clearer(ration));
    return this;
  }

  greyscale() {
    this.fn.push((x) => x.greyscale());
    return this;
  }

  opaquer(ratio: number) {
    this.fn.push((x) => x.opaquer(ratio));
    return this;
  }

  negate() {
    this.fn.push((x) => x.negate());
    return this;
  }

  lighten(ratio: number) {
    this.fn.push((x) => x.lighten(ratio));
    return this;
  }

  darken(ratio: number) {
    this.fn.push((x) => x.darken(ratio));
    return this;
  }

  saturate(ratio: number) {
    this.fn.push((x) => x.saturate(ratio));
    return this;
  }

  desaturate(ratio: number) {
    this.fn.push((x) => x.desaturate(ratio));
    return this;
  }

  rotate(deg: number) {
    this.fn.push((x) => x.rotate(deg));
    return this;
  }
}

export function createBuilder(): Builder {
  return new Builder();
}
