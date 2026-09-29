console.log("%cwhy are you here bru stop trying to look at my shit", "color: #00ff66; font-size: 14px; font-weight: bold; font-family: monospace;");
const canvas=document.getElementById('bg-canvas');
const ctx=canvas.getContext('2d',{alpha:true});
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const chars='01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモ';
const charSize=22,colStep=18;
let cols=0,rows=0,grid=[],tick=0,matrix=false,frameId=null,tabActive=true,lastFrameTime=0;
let audioCtx=null,analyser=null,freqData=null,prevFreqData=null;
let bassEnergy=0,kickPulse=0,midEnergy=0,highEnergy=0,avgBassTracker=0.15,fluxEnergy=0,avgFluxTracker=0.01,globalPulse=0,lastOnset=0,shockwaves=[],flash=0;
function resizeCanvas(){
const dpr=Math.min(window.devicePixelRatio||1,2),w=window.innerWidth,h=window.innerHeight;
canvas.width=Math.floor(w*dpr);canvas.height=Math.floor(h*dpr);ctx.scale(dpr,dpr);
cols=Math.ceil(w/colStep)+1;rows=Math.ceil(h/charSize)+1;grid=[];
const midX=w*0.5,midY=h*0.5,maxDist=Math.sqrt(midX*midX+midY*midY)||1;
for(let r=0;r<rows;r++){const row=[],py=(r+1)*charSize;
for(let c=0;c<cols;c++){const px=c*colStep,dx=px-midX,dy=py-midY;
row.push({char:chars[(Math.random()*chars.length)|0],offset:Math.random()*6.28,d:Math.sqrt(dx*dx+dy*dy)/maxDist});}
grid[r]=row;}}
const visualizerBars=document.querySelectorAll('.audio-bar');
let bandEdges=[],bandLevels=new Array(visualizerBars.length).fill(0);
function buildBands(){
const hzPerBin=audioCtx.sampleRate/analyser.fftSize,binAt=hz=>Math.max(1,Math.round(hz/hzPerBin));
const ranges=[[20,60,1.0],[60,150,1.0],[150,400,1.1],[400,1000,1.25],[1000,2500,1.45],[2500,6000,1.7],[6000,14000,2.1]];
bandEdges=ranges.slice(0,visualizerBars.length).map(([lo,hi,gain])=>({start:binAt(lo),end:binAt(hi),gain}));}
function lerpColor(r1,g1,b1,r2,g2,b2,t){return[r1+(r2-r1)*t,g1+(g2-g1)*t,b1+(b2-b1)*t];}
function renderBackground(time){
if(!tabActive)return;
if(!reducedMotion)frameId=requestAnimationFrame(renderBackground);
if(!lastFrameTime)lastFrameTime=time;
const dt=Math.min(2.5,Math.max(0,(time-lastFrameTime)/(1000/60)));lastFrameTime=time;
let subBassRaw=0,kickRaw=0,midRaw=0,highRaw=0;
if(analyser&&freqData){
analyser.getByteFrequencyData(freqData);
const hzPerBin=audioCtx.sampleRate/analyser.fftSize,binAt=hz=>Math.max(1,Math.round(hz/hzPerBin));
const subEnd=binAt(60),kickEnd=binAt(150),midStart=binAt(300),midEnd=binAt(2000);
let subSum=0;for(let i=1;i<subEnd;i++)subSum+=freqData[i];subBassRaw=subSum/Math.max(1,(subEnd-1)*255);
let kickSum=0;for(let i=subEnd;i<kickEnd;i++)kickSum+=freqData[i];kickRaw=kickSum/Math.max(1,(kickEnd-subEnd)*255);
let mSum=0,mCount=0;for(let i=midStart;i<=midEnd;i+=2){mSum+=freqData[i];mCount++;}midRaw=mSum/Math.max(1,mCount*255);
let hSum=0,hCount=0;for(let i=binAt(4000);i<binAt(12000);i+=8){hSum+=freqData[i];hCount++;}highRaw=hSum/Math.max(1,hCount*255);
bassEnergy+=(subBassRaw-bassEnergy)*0.5;midEnergy+=(midRaw-midEnergy)*0.4;highEnergy+=(highRaw-highEnergy)*0.4;
avgBassTracker=avgBassTracker*0.985+subBassRaw*0.015;
if(prevFreqData){
let flux=0;const bassBins=kickEnd;
for(let i=1;i<=bassBins;i++){const d=freqData[i]-prevFreqData[i];if(d>0)flux+=d;}
flux/=bassBins*255;fluxEnergy+=(flux-fluxEnergy)*0.4;avgFluxTracker=avgFluxTracker*0.98+fluxEnergy*0.02;
const isBassHit=(subBassRaw>0.4||kickRaw>0.4);
const isOnset=fluxEnergy>avgFluxTracker*2.8&&fluxEnergy>0.015&&isBassHit&&(time-lastOnset>250);
if(isOnset){lastOnset=time;
const strength=Math.min(1,(fluxEnergy/avgFluxTracker-1)*0.4);
kickPulse=Math.min(0.8,kickPulse+0.45+strength*0.35);
globalPulse=Math.min(1.0,globalPulse+0.6+strength*0.3);
flash=Math.min(1,flash+0.30+strength*0.35);
shockwaves.push({x:window.innerWidth*0.5,y:window.innerHeight*0.5,born:time,life:950,maxR:Math.max(window.innerWidth,window.innerHeight)*(0.5+strength*0.45+bassEnergy*0.2),strength:strength,r:0,intensity:0});
if(shockwaves.length>3)shockwaves.shift();}
prevFreqData.set(freqData);}
kickPulse*=Math.pow(0.70,dt);globalPulse*=Math.pow(0.80,dt);flash*=Math.pow(0.86,dt);
if(visualizerBars.length){for(let b=0;b<bandEdges.length;b++){const e=bandEdges[b];let sum=0;
for(let i=e.start;i<e.end;i++)sum+=freqData[i];
const raw=sum/Math.max(1,(e.end-e.start)*255),boosted=Math.min(1,raw*e.gain);
bandLevels[b]+=(boosted-bandLevels[b])*(boosted>bandLevels[b]?0.55:0.18);
visualizerBars[b].style.height=`${Math.max(2.5,bandLevels[b]*16)}px`;}}
}else if(visualizerBars.length){for(let b=0;b<visualizerBars.length;b++)visualizerBars[b].style.height='2.5px';}
tick+=(0.022+bassEnergy*0.05+kickPulse*0.02+globalPulse*0.01)*dt;
for(let i=shockwaves.length-1;i>=0;i--){const sw=shockwaves[i],t=(time-sw.born)/sw.life;
if(t>=1)shockwaves.splice(i,1);else{sw.r=sw.maxR*(1-Math.pow(1-t,3));sw.intensity=Math.pow(1-t,2)*sw.strength;}}
const w=window.innerWidth,h=window.innerHeight;ctx.clearRect(0,0,w,h);
if(flash>0.02){const fx=w*0.5,fy=h*0.5,fr=Math.min(w,h)*0.7;
const glow=ctx.createRadialGradient(fx,fy,0,fx,fy,fr);
glow.addColorStop(0,`rgba(140, 190, 255, ${(flash*0.16).toFixed(3)})`);
glow.addColorStop(1,'rgba(140, 190, 255, 0)');ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);}
ctx.font=`600 ${charSize-4}px monospace`;
const energyShift=Math.min(1,bassEnergy*3.0+kickPulse*2.0);
let cr,cg,cb;
if(matrix)[cr,cg,cb]=lerpColor(0,210,115,60,245,200,energyShift);
else[cr,cg,cb]=lerpColor(65,115,195,105,185,255,energyShift);
const paletteSteps=48,palette=new Array(paletteSteps);
for(let i=1;i<=paletteSteps;i++)palette[i-1]=`rgba(${cr|0},${cg|0},${cb|0},${(i/paletteSteps*0.95).toFixed(3)})`;
const bins=freqData?freqData.length:0;
for(let r=0;r<rows;r++){const row=grid[r],py=(r+1)*charSize,rowNorm=r/rows;
let rowFreq=0;
if(freqData&&bins>0){const logBin=Math.floor(Math.pow(rowNorm,1.5)*400);rowFreq=(freqData[logBin]||0)/255;}
for(let c=0;c<cols;c++){const item=row[c],px=c*colStep,distFromCenter=item.d;
const spotlightMult=Math.max(0.65,1.15-kickPulse*0.45-globalPulse*0.18);
const spotlight=Math.max(0,1-distFromCenter*spotlightMult);
let shockBoost=0;
for(let i=0;i<shockwaves.length;i++){const sw=shockwaves[i];if(sw.r<1)continue;
const sdx=px-sw.x,sdy=py-sw.y,sd=Math.sqrt(sdx*sdx+sdy*sdy);
if(sd<sw.r){const inner=1-sd/sw.r,v=sw.intensity*inner*inner*0.55;if(v>shockBoost)shockBoost=v;}}
let colFreq=0;
if(freqData&&bins>0){const logCol=Math.pow(c/cols,1.2),bin=Math.floor(logCol*400);
colFreq=((freqData[bin]||0)+(freqData[bin+1]||0))/(2*255);}
const wave1=Math.sin(tick+c*0.17+r*0.13+item.offset);
const wave2=Math.sin(tick*0.6+c*0.08-r*0.10+item.offset*1.4)*0.3;
const wave3=Math.sin(tick*0.28+c*0.055+r*0.075+item.offset*0.7)*0.18;
const waveCombined=(wave1+wave2+wave3)/1.48;
const vocalFactor=Math.max(0,1-distFromCenter*3.0);
const vocalBoost=Math.pow(vocalFactor,1.5)*midEnergy*1.4;
const audioBoost=bassEnergy*0.22+kickPulse*0.26+colFreq*0.14+rowFreq*0.10+shockBoost*0.5+globalPulse*0.16+vocalBoost;
const rawNorm=waveCombined*0.36+0.5+audioBoost,norm=Math.min(0.99,rawNorm)*spotlight;
if(norm<0.18)continue;
const normMapped=(norm-0.18)/0.81;
const finalAlpha=normMapped*(matrix?0.55:0.44)+shockBoost*0.15+globalPulse*0.06;
if(finalAlpha<0.018)continue;
const scrambleChance=0.0006+highEnergy*0.016+kickPulse*0.014+(vocalFactor*midEnergy*0.035);
if(Math.random()<scrambleChance)item.char=chars[(Math.random()*chars.length)|0];
let qi=(finalAlpha*(paletteSteps/0.95))|0;
if(qi>=paletteSteps)qi=paletteSteps-1;
ctx.fillStyle=palette[qi];ctx.fillText(item.char,px,py);}}}
if(!reducedMotion){
resizeCanvas();frameId=requestAnimationFrame(renderBackground);
let resizeTimer;
window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(resizeCanvas,150);},{passive:true});
document.addEventListener('visibilitychange',()=>{tabActive=!document.hidden;
if(tabActive){if(!frameId)frameId=requestAnimationFrame(renderBackground);}
else{if(frameId)cancelAnimationFrame(frameId);frameId=null;lastFrameTime=0;}});
}else{resizeCanvas();renderBackground(0);
let staticResizeTimer;
window.addEventListener('resize',()=>{clearTimeout(staticResizeTimer);staticResizeTimer=setTimeout(()=>{resizeCanvas();renderBackground(0);},150);},{passive:true});}
const dot=document.getElementById('cursor-dot');
if(window.matchMedia('(hover: hover) and (pointer: fine)').matches&&!reducedMotion){
let mx=-100,my=-100,lastX=-100,lastY=-100,target=null,box={x:0,y:0,w:10,h:10,r:50};
document.addEventListener('mousemove',(e)=>{mx=e.clientX;my=e.clientY;},{passive:true});
function lerp(s,e,f){return s+(e-s)*f;}
function stepCursor(){
if(target){const rect=target.getBoundingClientRect();
const tr=parseFloat(window.getComputedStyle(target).borderRadius)||16;
box.x=lerp(box.x,rect.left,0.25);box.y=lerp(box.y,rect.top,0.25);
box.w=lerp(box.w,rect.width,0.25);box.h=lerp(box.h,rect.height,0.25);box.r=lerp(box.r,tr,0.25);
dot.style.transform=`translate3d(${box.x}px, ${box.y}px, 0)`;
dot.style.width=`${box.w}px`;dot.style.height=`${box.h}px`;dot.style.borderRadius=`${box.r}px`;
}else{dot.style.width='10px';dot.style.height='10px';dot.style.borderRadius='50%';
const dx=mx-lastX,dy=my-lastY;lastX=mx;lastY=my;
const dist=Math.sqrt(dx*dx+dy*dy);
if(dist<0.3)dot.style.transform=`translate3d(${mx-5}px, ${my-5}px, 0)`;
else{const angle=Math.atan2(dy,dx)*(180/Math.PI),stretch=Math.min(dist*0.05,1.2);
dot.style.transform=`translate3d(${mx-5}px, ${my-5}px, 0) rotate(${angle}deg) scale(${1+stretch}, ${Math.max(1-stretch*0.3,0.5)})`;}}
requestAnimationFrame(stepCursor);}
requestAnimationFrame(stepCursor);
const morphSelector='a:not(.inline-link), .glass-btn, .floating-audio-player, .audio-btn, .audio-vol-btn';
document.addEventListener('mouseover',(e)=>{
const el=e.target&&e.target.closest?e.target.closest(morphSelector):null;
if(!el||target===el)return;
if(!target){const rect=el.getBoundingClientRect();box.x=rect.left;box.y=rect.top;box.w=rect.width;box.h=rect.height;}
target=el;dot.classList.add('on-box');});
document.addEventListener('mouseout',(e)=>{
const el=e.target&&e.target.closest?e.target.closest(morphSelector):null;
if(!el||target!==el)return;
if(e.relatedTarget&&el.contains(e.relatedTarget))return;
target=null;dot.classList.remove('on-box');});}
let secretKeys='';
document.addEventListener('keydown',(e)=>{
if(['input','textarea'].includes(document.activeElement.tagName.toLowerCase()))return;
if(e.key==='m'||e.key==='M'||e.key===' ')return;
secretKeys+=e.key.toLowerCase();
if(secretKeys.length>8)secretKeys=secretKeys.slice(-8);
if(secretKeys.endsWith('fibre')){matrix=!matrix;secretKeys='';}});
function initAudioPlayer(){
const audio=document.getElementById('audio-element'),player=document.getElementById('audio-player-widget');
const playBtn=document.getElementById('audio-play-btn'),playIcon=document.getElementById('audio-play-icon');
const progressBar=document.getElementById('audio-progress-bar'),progressFill=document.getElementById('audio-progress-fill');
const timeLabel=document.getElementById('audio-time'),volBtn=document.getElementById('audio-vol-btn'),volIcon=document.getElementById('audio-vol-icon');
if(!audio||!player||!playBtn||!progressBar)return;
let userMuted=false,hasStarted=false;
const fmt=(sec)=>{if(isNaN(sec)||!isFinite(sec))return'0:00';const m=Math.floor(sec/60),s=Math.floor(sec%60);return`${m}:${s<10?'0':''}${s}`;};
const updatePlay=(p)=>{playIcon.className=p?'fa-solid fa-pause':'fa-solid fa-play';playBtn.setAttribute('aria-label',p?'Pause':'Play');player.classList.toggle('is-playing',p);};
const syncVol=()=>{volIcon.className=audio.muted?'fa-solid fa-volume-xmark':'fa-solid fa-volume-high';volBtn.setAttribute('aria-label',audio.muted?'Unmute':'Mute');};
const initCtx=()=>{
if(audioCtx){if(audioCtx.state==='suspended')audioCtx.resume();return;}
try{const AC=window.AudioContext||window.webkitAudioContext;
if(AC){audioCtx=new AC();analyser=audioCtx.createAnalyser();analyser.fftSize=2048;analyser.smoothingTimeConstant=0.82;
freqData=new Uint8Array(analyser.frequencyBinCount);prevFreqData=new Uint8Array(analyser.frequencyBinCount);buildBands();
const src=audioCtx.createMediaElementSource(audio);src.connect(analyser);analyser.connect(audioCtx.destination);}}catch(err){}};
audio.addEventListener('loadedmetadata',()=>{
const sp=parseFloat(sessionStorage.getItem('osi_track_pos'));
if(!isNaN(sp)&&sp>0&&sp<audio.duration){audio.currentTime=sp;progressFill.style.width=`${(sp/audio.duration)*100}%`;timeLabel.textContent=fmt(sp);}});
const tryPlay=(e)=>{
if(hasStarted||userMuted)return;
if(e&&e.target&&player.contains(e.target))return;
initCtx();const res=audio.play();
if(res&&res.then)res.then(()=>{hasStarted=true;updatePlay(true);unbind();}).catch(()=>{if(audio.paused)bind();});};
const evs=['pointerdown','touchend','click','keydown'];
const bind=()=>evs.forEach(ev=>window.addEventListener(ev,tryPlay,{passive:true}));
const unbind=()=>evs.forEach(ev=>window.removeEventListener(ev,tryPlay));
tryPlay();bind();
playBtn.addEventListener('click',(e)=>{e.stopPropagation();initCtx();
if(audio.paused){userMuted=false;audio.play().then(()=>{hasStarted=true;updatePlay(true);}).catch(()=>{});}
else{userMuted=true;audio.pause();updatePlay(false);}});
volBtn.addEventListener('click',(e)=>{e.stopPropagation();audio.muted=!audio.muted;syncVol();});
if('mediaSession' in navigator){try{
navigator.mediaSession.metadata=new MediaMetadata({title:'Guilt Trip',artist:'Kanye West',album:'Yeezus',artwork:[{src:'cover.jfif',sizes:'512x512',type:'image/jpeg'}]});
navigator.mediaSession.setActionHandler('play',()=>{userMuted=false;audio.play().then(()=>updatePlay(true)).catch(()=>{});});
navigator.mediaSession.setActionHandler('pause',()=>{userMuted=true;audio.pause();updatePlay(false);});}catch(err){}}
audio.addEventListener('timeupdate',()=>{
if(audio.duration){const pct=(audio.currentTime/audio.duration)*100;
progressFill.style.width=`${pct}%`;timeLabel.textContent=fmt(audio.currentTime);
progressBar.setAttribute('aria-valuenow',pct.toFixed(0));sessionStorage.setItem('osi_track_pos',audio.currentTime);}});
audio.addEventListener('ended',()=>{updatePlay(false);progressFill.style.width='0%';timeLabel.textContent='0:00';sessionStorage.removeItem('osi_track_pos');});
let seeking=false;
const seekTo=(x)=>{const r=progressBar.getBoundingClientRect(),ratio=Math.min(1,Math.max(0,(x-r.left)/r.width));
if(audio.duration){audio.currentTime=ratio*audio.duration;progressFill.style.width=`${ratio*100}%`;timeLabel.textContent=fmt(ratio*audio.duration);}};
progressBar.addEventListener('pointerdown',(e)=>{e.stopPropagation();seeking=true;progressBar.setPointerCapture(e.pointerId);seekTo(e.clientX);});
progressBar.addEventListener('pointermove',(e)=>{if(seeking)seekTo(e.clientX);});
progressBar.addEventListener('pointerup',()=>{seeking=false;});
progressBar.addEventListener('pointercancel',()=>{seeking=false;});
progressBar.addEventListener('keydown',(e)=>{
if(!audio.duration)return;let next=null;
if(e.key==='ArrowRight')next=audio.currentTime+5;else if(e.key==='ArrowLeft')next=audio.currentTime-5;
else if(e.key==='Home')next=0;else if(e.key==='End')next=audio.duration-0.5;
if(next!==null){e.preventDefault();e.stopPropagation();audio.currentTime=Math.min(audio.duration,Math.max(0,next));}});
document.addEventListener('keydown',(e)=>{
if(['input','textarea'].includes(document.activeElement.tagName.toLowerCase()))return;
if(e.key==='m'||e.key==='M'){audio.muted=!audio.muted;syncVol();return;}
if(e.key===' '){e.preventDefault();initCtx();
if(audio.paused){userMuted=false;audio.play().then(()=>updatePlay(true)).catch(()=>{});}
else{userMuted=true;audio.pause();updatePlay(false);}}});}
let copyResetTimer=null;
function initDiscordCopy(){
const card=document.getElementById('discord-card'),badge=document.getElementById('discord-copy-badge'),txt=document.getElementById('discord-copy-text');
if(!card||!badge||!txt)return;
card.addEventListener('click',()=>{
const handle='@osiriscodes';let done;
if(navigator.clipboard&&navigator.clipboard.writeText)done=navigator.clipboard.writeText(handle);
else{const ta=document.createElement('textarea');ta.value=handle;document.body.appendChild(ta);ta.select();document.execCommand('copy');document.body.removeChild(ta);done=Promise.resolve();}
done.then(()=>{badge.classList.add('copied');txt.textContent='copied!';
clearTimeout(copyResetTimer);
copyResetTimer=setTimeout(()=>{badge.classList.remove('copied');txt.textContent='copy';},1800);}).catch(()=>{});});
card.addEventListener('keydown',(e)=>{if(e.key==='Enter'||e.key===' '){e.stopPropagation();e.preventDefault();card.click();}});}
function initPage(){clearTimeout(copyResetTimer);initDiscordCopy();}
function loadPage(url,push){
fetch(url,{credentials:'same-origin'})
.then((res)=>{if(!res.ok)throw new Error('fetch failed: '+res.status);return res.text();})
.then((html)=>{
const doc=new DOMParser().parseFromString(html,'text/html');
const nextMain=doc.querySelector('main.app-shell'),curMain=document.querySelector('main.app-shell');
if(!nextMain||!curMain)throw new Error('no app-shell found');
curMain.replaceWith(nextMain);
if(doc.title)document.title=doc.title;
if(push)history.pushState(null,'',url);
window.scrollTo(0,0);
initPage();})
.catch(()=>{window.location.href=url;});}
function shouldIntercept(a){
if(!a)return false;
if(a.target==='_blank')return false;
if(a.hasAttribute('download'))return false;
const href=a.getAttribute('href');
if(!href||href.startsWith('#'))return false;
if(/^(mailto|tel|sms|javascript):/i.test(href))return false;
let url;try{url=new URL(href,window.location.href);}catch(err){return false;}
if(url.origin!==window.location.origin)return false;
if(url.pathname===window.location.pathname&&url.search===window.location.search)return false;
return true;}
document.addEventListener('click',(e)=>{
if(e.defaultPrevented||e.button!==0)return;
if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
const a=e.target&&e.target.closest?e.target.closest('a'):null;
if(!shouldIntercept(a))return;
e.preventDefault();
const url=new URL(a.getAttribute('href'),window.location.href);
loadPage(url.pathname+url.search,true);});
window.addEventListener('popstate',()=>{loadPage(window.location.pathname+window.location.search,false);});
initAudioPlayer();
initPage();
