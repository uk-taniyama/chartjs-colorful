import './style.css';
import type { Colors, NamedColors } from 'chartjs-colorful';
import {
  createColors, createRotateLinear, halfTransparent, transparent,
} from 'chartjs-colorful/helpers';
import { schemes } from 'chartjs-colorful/registries';
import {
  getBrewerSchemes, getD3Schemes, getOfficeSchemes, getTableauSchemes,
} from 'chartjs-colorful/schemes';

const { namedColors: d3Schemes } = getD3Schemes();
const schemesSet: Record<string, NamedColors> = {
  d3: d3Schemes,
  office: getOfficeSchemes(),
  brewer: getBrewerSchemes(),
  tableau: getTableauSchemes(),
};

// add custom scheme
schemes.add('custom', ['#F00', '#FF0', '#0F0', '#0FF', '#00F', '#F0F']);

// add hue-rotate color.
const rotateLinear = createRotateLinear('#ff7f7f');
schemes.add('rotate', createColors(rotateLinear, 12, false));

function selectExtra(extra: string) {
  Array.from(document.getElementsByClassName('extra')).forEach((el) => {
    el.classList.toggle('btn-chartjs', el.id === extra);
  });

  const schemesEl = document.getElementById('schemes')!;
  const selected = schemesSet[extra];
  schemes.addAll(selected);
  schemesEl.innerHTML = Object.keys(selected)
    .map((name) => `<button class="btn scheme" id="${name}">${name}</button>`).join(' ');
}

function renderColors(id: string, colors: Colors) {
  const el = document.getElementById(id)!;
  el.innerHTML = colors.map((c) => `
    <div class="color" style="background-color: ${c};"></div>
  `).join('');
}

function renderLinears(id: string, colors: Colors) {
  const el = document.getElementById(id)!;
  el.innerHTML = colors.map((c) => `
    <div class="linear" style="background: linear-gradient(${c}, ${transparent(c)});"></div>
  `).join('');
}

const schemeNameEl = document.getElementById('schemeName')!;

function selectScheme(name: string) {
  Array.from(document.getElementsByClassName('scheme')).forEach((el) => {
    el.classList.toggle('btn-chartjs', el.id === name);
  });

  schemeNameEl.innerText = name;

  const scheme = schemes.get(name);
  renderColors('colors', scheme);
  renderColors('colors2', scheme.map((c) => halfTransparent(c)));
  renderLinears('linears', scheme);
}

const buttonsEl = document.getElementById('buttons')!;
buttonsEl.addEventListener('click', (ev: any) => {
  if (ev.target.tagName !== 'BUTTON') {
    return;
  }
  const { id, className } = ev.target;
  if (className.indexOf('extra') >= 0) {
    selectExtra(id);
  } else {
    selectScheme(id);
  }
});

selectScheme('default');
