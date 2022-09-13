import{J as X,H as y,M as Y,g as V,aW as P,d as W}from"./index.js";import{D as _,E as z,C as c,a as F,b,s as x}from"./index2.js";/*!
 * chartjs-chart-matrix v1.1.1
 * https://chartjs-chart-matrix.pages.dev/
 * (c) 2021 Jukka Kurkela
 * Released under the MIT license
 */var J="1.1.1";class h extends _{initialize(){this.enableOptionSharing=!0,super.initialize()}update(e){const t=this,s=t._cachedMeta;t.updateElements(s.data,0,s.data.length,e)}updateElements(e,t,s,a){const i=this,r=a==="reset",{xScale:l,yScale:v}=i._cachedMeta,I=i.resolveDataElementOptions(t,a),L=i.getSharedOptions(a,e[t],I);for(let d=t;d<t+s;d++){const C=!r&&i.getParsed(d),N=r?l.getBasePixel():l.getPixelForValue(C.x),D=r?v.getBasePixel():v.getPixelForValue(C.y),B=i.resolveDataElementOptions(d,a),{width:O,height:M,anchorX:A,anchorY:$}=B,H={x:U(A,N,O),y:q($,D,M),width:O,height:M,options:B};i.updateElement(e[d],d,H,a)}i.updateSharedOptions(L,a)}draw(){const e=this,t=e.getMeta().data||[];let s,a;for(s=0,a=t.length;s<a;++s)t[s].draw(e._ctx)}}function U(n,e,t){return n==="left"||n==="start"?e:n==="right"||n==="end"?e-t:e-t/2}function q(n,e,t){return n==="top"||n==="start"?e:n==="bottom"||n==="end"?e-t:e-t/2}h.id="matrix";h.version=J;h.defaults={dataElementType:"matrix",animations:{numbers:{type:"number",properties:["x","y","width","height"]}},anchorX:"center",anchorY:"center"};h.overrides={interaction:{mode:"nearest",intersect:!0},scales:{x:{type:"linear",offset:!0},y:{type:"linear",reverse:!0}}};function R(n,e){const{x:t,y:s,width:a,height:i}=n.getProps(["x","y","width","height"],e);return{left:t,top:s,right:t+a,bottom:s+i}}function f(n,e,t){return Math.max(Math.min(n,t),e)}function G(n,e,t){const s=n.options.borderWidth;let a,i,r,l;return Y(s)?(a=+s.top||0,i=+s.right||0,r=+s.bottom||0,l=+s.left||0):a=i=r=l=+s||0,{t:f(a,0,t),r:f(i,0,e),b:f(r,0,t),l:f(l,0,e)}}function K(n){const e=R(n),t=e.right-e.left,s=e.bottom-e.top,a=G(n,t/2,s/2);return{outer:{x:e.left,y:e.top,w:t,h:s},inner:{x:e.left+a.l,y:e.top+a.t,w:t-a.l-a.r,h:s-a.t-a.b}}}function w(n,e,t,s){const a=e===null,i=t===null,r=!n||a&&i?!1:R(n,s);return r&&(a||e>=r.left&&e<=r.right)&&(i||t>=r.top&&t<=r.bottom)}class E extends z{constructor(e){super(),this.options=void 0,this.width=void 0,this.height=void 0,e&&Object.assign(this,e)}draw(e){const t=this.options,{inner:s,outer:a}=K(this),i=X(t.borderRadius);e.save(),a.w!==s.w||a.h!==s.h?(e.beginPath(),y(e,{x:a.x,y:a.y,w:a.w,h:a.h,radius:i}),y(e,{x:s.x,y:s.y,w:s.w,h:s.h,radius:i}),e.fillStyle=t.backgroundColor,e.fill(),e.fillStyle=t.borderColor,e.fill("evenodd")):(e.beginPath(),y(e,{x:s.x,y:s.y,w:s.w,h:s.h,radius:i}),e.fillStyle=t.backgroundColor,e.fill()),e.restore()}inRange(e,t,s){return w(this,e,t,s)}inXRange(e,t){return w(this,e,null,t)}inYRange(e,t){return w(this,null,e,t)}getCenterPoint(e){const{x:t,y:s,width:a,height:i}=this.getProps(["x","y","width","height"],e);return{x:t+a/2,y:s+i/2}}tooltipPosition(){return this.getCenterPoint()}getRange(e){return e==="x"?this.width/2:this.height/2}}E.id="matrix";E.defaults={backgroundColor:void 0,borderColor:void 0,borderWidth:void 0,borderRadius:0,anchorX:void 0,anchorY:void 0,width:20,height:20};document.location.search==="?e2e"&&(c.defaults.animation=!1,c.defaults.animations.colors=!1);c.register(h,E);c.register(F,b);const{namedLinear:Q}=V();P.addAll(Q);let u=x("default");function Z(n,e,t){const s=[];for(let a=0;a<n;a+=1)for(let i=0;i<e;i+=1){const r=u()*t;s.push({x:a,y:i,r})}return s}function ee(n,e,t,s){const a=[];for(let i=0;i<n;i+=1)a.push({x:u()*e,y:u()*t,r:u()*s});return a}const m=30,g=20,p=20;Object.assign(window,{Chart:c});function te(n,e){return{width:t=>{var s,a;return(((a=(s=t==null?void 0:t.chart)==null?void 0:s.chartArea)==null?void 0:a.width)||0)/n},height:t=>{var s,a;return(((a=(s=t==null?void 0:t.chart)==null?void 0:s.chartArea)==null?void 0:a.height)||0)/e}}}function ne(n){u=x("default");const e=Z(m,g,p);return{type:"matrix",data:{datasets:[{data:e,...te(m,g)}]},options:{responsive:!0,maintainAspectRatio:!1,animation:!1,scales:{x:{min:-.5,max:m-.5,grid:{display:!1},ticks:{callback:t=>Number.isInteger(t)?t:void 0},offset:!1},y:{min:-.5,max:g-.5,grid:{display:!1},ticks:{callback:t=>Number.isInteger(t)?t:void 0},offset:!1}},plugins:{title:{display:!1},legend:{display:!1},[b.id]:{colors:"default",converter:W,data:[{name:n,min:0,max:p,axis:"r",datasetIndex:0,value:"r"}]},tooltip:{callbacks:{title(t){return[t[0].raw.x,t[0].raw.y].join("/")},label({raw:t}){return t.r}}}}}}}function se(n){u=x("default");const e=ee(50,m,g,p);return{type:"bubble",data:{datasets:[{data:e}]},options:{responsive:!0,maintainAspectRatio:!1,animation:!1,plugins:{title:{display:!1},legend:{display:!1},[b.id]:{data:[{name:n,min:0,max:p,axis:"r",datasetIndex:0,value:"r"}]}}}}}const ae=document.getElementById("chart"),j={ToggleScale:n=>{var e;((e=n.scale)==null?void 0:e.display)!==!1?Object.assign(n,{scale:{display:!1}}):n.scale.display=!0},DefaultColor:n=>{n.min2=0,n.max2=1},ReverseColor:n=>{n.min2=1,n.max2=0},HalfColor:n=>{n.min2=.25,n.max2=.75}};let o=null;const k=document.getElementById("schemeName"),ie=document.getElementById("schemes");ie.innerHTML=P.names.map(n=>`<button class="btn scheme" id="${n}">${n}</button>`).join(" ");function S(n){Array.from(document.getElementsByClassName("scheme")).forEach(e=>{e.classList.toggle("btn-chartjs",e.id===n)}),k.innerText=n,o!=null&&(o.options.plugins.colorful.data[0].linear=n,o.update())}const re=document.getElementById("types"),oe=["bubble","matrix"];re.innerHTML=oe.map(n=>`<button class="btn type" id="${n}">${n}</button>`).join(" ");function T(n){Array.from(document.getElementsByClassName("type")).forEach(t=>{t.classList.toggle("btn-chartjs",t.id===n)}),o!=null&&o.destroy();const e=k.innerText;o=new c(ae,n==="bubble"?se(e):ne(e)),Object.assign(window,{chart:o})}const le=document.getElementById("handlers");le.innerHTML=Object.keys(j).map(n=>`<button class="btn btn-chartjs handler" id="${n}">${n}</button>`).join(" ");function de(n){o!=null&&(j[n](o.options.plugins[b.id].data[0]),o.update())}const ue=document.getElementById("buttons");ue.addEventListener("click",n=>{if(n.target.tagName!=="BUTTON")return;const{id:e,classList:t}=n.target;t.contains("scheme")?S(e):t.contains("handler")?de(e):T(e)});S("default");T("bubble");
