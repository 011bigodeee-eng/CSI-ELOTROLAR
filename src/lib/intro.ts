/** One clock for the six scenes. The parser-time controller also works without React. */
export const INTRO_SESSION_KEY = "csi-brand-intro-v1";
export const INTRO_COMPLETE_EVENT = "csi:intro-complete";
export const INTRO_TIMELINE = {
  spark: 0,
  circuits: 600,
  logo: 1350,
  impact: 2500,
  typography: 3200,
  reveal: 4300,
  complete: 5000,
  skip: 240,
  watchdog: 8000,
} as const;
export type IntroController = {
  active: boolean;
  start: number;
  skip: () => void;
  finish: (reason?: string) => void;
};
declare global {
  interface Window {
    __CSI_INTRO__?: IntroController;
  }
}

// No user values are interpolated. This synchronous head script runs before body markup.
export const INTRO_BOOTSTRAP = `(()=>{
const html=document.documentElement, times=${JSON.stringify(INTRO_TIMELINE)}, key=${JSON.stringify(INTRO_SESSION_KEY)}, event=${JSON.stringify(INTRO_COMPLETE_EVENT)};
let active=false,started=false,revealTimer=0,endTimer=0,watchdog=0,media;
const state={active:false,start:0,skip,finish};window.__CSI_INTRO__=state;
function clear(){clearTimeout(revealTimer);clearTimeout(endTimer);clearTimeout(watchdog);document.removeEventListener('animationstart',startClock);document.removeEventListener('animationend',animationEnd);document.removeEventListener('click',click);document.removeEventListener('keydown',keydown);document.removeEventListener('visibilitychange',visibility);if(media&&media.removeEventListener)media.removeEventListener('change',preference)}
function finish(reason){const wasActive=active;active=false;state.active=false;clear();html.dataset.csiIntro='done';const shell=document.getElementById('csi-site-shell');if(shell)shell.inert=false;if(wasActive){window.dispatchEvent(new CustomEvent(event,{detail:{reason:reason||'complete'}}));const focused=document.activeElement;if(focused&&focused.closest&&focused.closest('#csi-brand-intro')){const target=document.querySelector('main a[href]');if(target)target.focus({preventScroll:true})}}}
function skip(){if(!active||html.dataset.csiIntro==='skipping')return;clearTimeout(revealTimer);clearTimeout(endTimer);html.dataset.csiIntro='skipping';endTimer=setTimeout(()=>finish('skip'),times.skip+30)}
function startClock(e){if(e.target.id!=='csi-brand-intro'||!/^csi-intro-(aperture|curtain)$/.test(e.animationName)||started||!active)return;started=true;state.start=performance.now();const shell=document.getElementById('csi-site-shell');if(shell)shell.inert=true;revealTimer=setTimeout(()=>{if(active&&html.dataset.csiIntro==='playing')html.dataset.csiIntro='revealing'},times.reveal);endTimer=setTimeout(()=>finish(),times.complete+60)}
function animationEnd(e){if(e.target.id==='csi-brand-intro'&&/^csi-intro-(aperture|curtain|short-exit)$/.test(e.animationName))finish(html.dataset.csiIntro==='skipping'?'skip':'complete')}
function click(e){if(e.target.closest&&e.target.closest('[data-csi-intro-skip]')){e.preventDefault();skip()}}
function keydown(e){if(e.key==='Escape'){e.preventDefault();skip()}}
function preference(e){if(e.matches)finish('reduced-motion')}
function visibility(){if(!document.hidden&&state.start&&performance.now()-state.start>=times.complete)finish('resume')}
try{media=window.matchMedia('(prefers-reduced-motion: reduce)');if(location.pathname!=='/'||media.matches||sessionStorage.getItem(key)){finish('bypass');return}sessionStorage.setItem(key,'seen')}catch{finish('storage-unavailable');return}
active=true;state.active=true;html.dataset.csiIntro='playing';if((navigator.hardwareConcurrency&&navigator.hardwareConcurrency<=4)||(navigator.deviceMemory&&navigator.deviceMemory<=4)||matchMedia('(max-width: 640px)').matches)html.dataset.csiIntroLite='true';
document.addEventListener('animationstart',startClock);document.addEventListener('animationend',animationEnd);document.addEventListener('click',click);document.addEventListener('keydown',keydown);document.addEventListener('visibilitychange',visibility);if(media.addEventListener)media.addEventListener('change',preference);watchdog=setTimeout(()=>finish('watchdog'),times.watchdog);
})()`;

/** Critical visibility rules live in the head; external CSS or hydration cannot expose the shell. */
export const INTRO_CRITICAL_CSS = `
html{background:#020a18;--csi-intro-duration:${INTRO_TIMELINE.complete}ms;--csi-intro-circuits:${INTRO_TIMELINE.circuits}ms;--csi-intro-logo:${INTRO_TIMELINE.logo}ms;--csi-intro-impact:${INTRO_TIMELINE.impact}ms;--csi-intro-type:${INTRO_TIMELINE.typography}ms;--csi-intro-reveal:${INTRO_TIMELINE.reveal}ms;--csi-intro-skip:${INTRO_TIMELINE.skip}ms}
#csi-brand-intro{display:none}
html:is([data-csi-intro="playing"],[data-csi-intro="revealing"],[data-csi-intro="skipping"]) body{background:#020a18;overflow:hidden;overscroll-behavior:none}
html:is([data-csi-intro="playing"],[data-csi-intro="revealing"],[data-csi-intro="skipping"]) #csi-brand-intro{display:grid;position:fixed;inset:0;z-index:2147483000;background:#020a18;isolation:isolate}
html[data-csi-intro="playing"] #csi-site-shell{visibility:hidden!important;pointer-events:none!important}
html:is([data-csi-intro="revealing"],[data-csi-intro="skipping"]) #csi-site-shell{pointer-events:none!important}
@media(prefers-reduced-motion:reduce){html #csi-brand-intro{display:none!important}html #csi-site-shell{visibility:visible!important;pointer-events:auto!important}html body{overflow:auto!important}}
`;
