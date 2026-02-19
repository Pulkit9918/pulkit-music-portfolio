import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════
   PULKIT J — MUSICAL PORTFOLIO
   Concept: High-fashion editorial meets analogue recording studio
   Theme: Warm ivory / deep charcoal / electric amber — LIGHT mode
   Typography: Cormorant Garamond (editorial serif) + JetBrains Mono
   Layout: Tape-reel sidebar nav, full-bleed typographic hero,
           music staff notation background, fader/knob interactions
═══════════════════════════════════════════════════════════════ */

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,700&family=JetBrains+Mono:wght@300;400;500&display=swap');`;

const GLOBAL_CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: #F5F0E8; color: #1a1410; font-family: 'JetBrains Mono', monospace; overflow-x: hidden; cursor: none; }
  ::selection { background: #D4A017; color: #1a1410; }
  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: #F5F0E8; }
  ::-webkit-scrollbar-thumb { background: #1a1410; }
  input, textarea { font-family: 'JetBrains Mono', monospace; }
  a { text-decoration: none; }
  button { font-family: 'JetBrains Mono', monospace; }

  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes spinR { to { transform: rotate(-360deg); } }
  @keyframes blink { 0%,49%{opacity:1} 50%,100%{opacity:0} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  @keyframes staffScroll { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  @keyframes reelSpin { to{transform:rotate(360deg)} }
  @keyframes floatNote { 0%{transform:translateY(0) rotate(0deg);opacity:1} 100%{transform:translateY(-110px) rotate(25deg);opacity:0} }
  @keyframes modalSlide { from{opacity:0;transform:translateY(30px) scale(.98)} to{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes vuMeter { 0%,100%{transform:scaleY(.3)} 50%{transform:scaleY(1)} }
  @keyframes glowPulse { 0%,100%{opacity:.6} 50%{opacity:1} }
  @keyframes heartbeat { 0%,100%{transform:scale(1)} 50%{transform:scale(1.2)} }
  @keyframes lyricsIn { from{clip-path:inset(0 100% 0 0)} to{clip-path:inset(0 0 0 0)} }

  .s1{animation:fadeUp .7s ease .05s both}
  .s2{animation:fadeUp .7s ease .15s both}
  .s3{animation:fadeUp .7s ease .25s both}
  .s4{animation:fadeUp .7s ease .35s both}
  .s5{animation:fadeUp .7s ease .45s both}
  .page-in{animation:fadeIn .35s ease both}
`;

// ── PALETTE ─────────────────────────────────────────────────────────────────
const T = {
  cream:   '#F5F0E8',
  paper:   '#EDE8DC',
  paperd:  '#E0D9CA',
  ink:     '#1a1410',
  inkL:    '#3d3228',
  muted:   '#8a7d6a',
  faint:   '#c4b89e',
  gold:    '#D4A017',
  goldD:   '#A07810',
  amber:   '#E8821A',
  red:     '#C0392B',
  teal:    '#1a6b6b',
  border:  '#d4c9b0',
  borderD: '#b8a98a',
};

// ── DATA ────────────────────────────────────────────────────────────────────
const RELEASES = [
  {
    id:1, title:'Echoes in the Dark', lang:'Hindi / English', dur:'3:45', type:'single',
    year:2024, bpm:92, key:'F# minor', color:T.teal,
    desc:'A haunting exploration of late-night thoughts, blending atmospheric production with bilingual lyricism.',
    lyrics:`Shadows dance on empty walls
रात की खामोशी में
Whispers echo through the halls
तेरी यादें साथ हैं

Lost in thoughts that never fade
अंधेरे में खो गया
Memories of us replay
तुझे ढूंढता रहा

[Chorus]
Echoes in the dark, echoes in the dark
हर तरफ तेरी आवाज़ है
Echoes in the dark, calling out your name
मेरे दिल में तेरा राज़ है`,
  },
  {
    id:2, title:'Midnight Conversations', lang:'English', dur:'4:12', type:'single',
    year:2024, bpm:78, key:'Bb major', color:T.amber,
    desc:'Smooth R&B vibes meet introspective songwriting in this late-night anthem.',
    lyrics:`Clock strikes twelve, we talk till dawn
Words flow smooth like velvet songs
Your voice cuts through the city noise
In this moment, we rejoice

Midnight talks and coffee cold
Stories shared and secrets told
Time stands still when you are near
Every word I want to hear`,
  },
  {
    id:3, title:'City Lights', lang:'English', dur:'3:55', type:'single',
    year:2025, bpm:115, key:'E minor', color:T.red,
    desc:'An intimate acoustic piece reflecting on urban solitude and quiet wonder.',
    lyrics:`Neon signs light up the street
Concrete jungle at my feet
Million faces passing by
Searching for their reasons why

City lights they never sleep
Promises they cannot keep
In the chaos I find peace
Urban symphony, release`,
  },
  {
    id:4, title:'Dil Ki Baatein', lang:'Hindi', dur:'15:20', type:'ep',
    year:2024, bpm:84, key:'D minor', color:T.gold, trackCount:4,
    desc:'A deeply personal EP exploring love, loss, and self-discovery through Hindi storytelling.',
    tracks:[
      {title:'Dil Ki Baatein', dur:'3:28', lang:'Hindi', lyrics:`दिल की बातें कह दूं तुझे\nतेरे बिना अधूरा हूं मैं\nसपनों में तू आ\nतेरा साथ चाहिए`},
      {title:'Raahein', dur:'4:05', lang:'Hindi', lyrics:`राहें अनजानी, चल पड़ा\nमंज़िल को ढूंढता रहा\nखुद से मिलने की चाह में\nसपनों को बुनता रहा`},
      {title:'Tanha Raat', dur:'3:47', lang:'Hindi', lyrics:`तन्हा रात में तेरी याद आई\nदिल की गहराई में दर्द छुपाई\nअकेले में खो जाता हूं\nतेरे ख्वाबों में सो जाता हूं`},
      {title:'Khoya Sa', dur:'4:00', lang:'Hindi', lyrics:`खोया सा रहता हूं मैं इन दिनों\nतेरी बातों में डूबा रहता हूं\nदिल ये मेरा समझे ना कुछ\nबस तुझे ही ढूंढता रहूं`},
    ],
  },
  {
    id:5, title:'Golden Hour', lang:'English / Hindi', dur:'42:15', type:'album',
    year:2025, bpm:96, key:'G major', color:T.amber, trackCount:12,
    desc:'A full-length journey through culture, identity, and the radiant beauty in everyday moments.',
    tracks:[
      {title:'Sunrise', dur:'3:33', lang:'English/Hindi', lyrics:`Sunrise paints the sky in gold\nसुनहरी सवेर आई\nStories waiting to be told\nनवीं शुरुआत हुई`},
      {title:'Morning Coffee', dur:'3:15', lang:'English', lyrics:`Morning coffee in my hand\nWatching dreams across the land\nEvery sip a new beginning\nFresh start, the world is spinning`},
      {title:'Golden', dur:'4:02', lang:'English', lyrics:`We are golden, we are bright\nShining through the darkest night\nEvery scar a story told\nWatch us turn from dust to gold`},
      {title:'अपना वक्त', dur:'3:48', lang:'Hindi', lyrics:`अपना वक्त आएगा\nसब्र रख, तू जाएगा\nहर मुश्किल के पार\nएक नया सवेरा होगा`},
    ],
  },
];

const LYRIC_SNIPPETS = [
  '"Shadows dance on empty walls"',
  '"Echoes in the dark"',
  '"City lights they never sleep"',
  '"Midnight talks and coffee cold"',
  '"दिल की बातें कह दूं तुझे"',
  '"We are golden, we are bright"',
  '"तेरी यादें साथ हैं"',
];

// ── CUSTOM CURSOR ────────────────────────────────────────────────────────────
function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  const pos = useRef({x:0,y:0});
  const rpos = useRef({x:0,y:0});

  useEffect(()=>{
    const move = e => { pos.current = {x:e.clientX, y:e.clientY}; };
    window.addEventListener('mousemove', move);
    let af;
    const loop = () => {
      rpos.current.x += (pos.current.x - rpos.current.x) * 0.12;
      rpos.current.y += (pos.current.y - rpos.current.y) * 0.12;
      if(dot.current) dot.current.style.transform = `translate(${pos.current.x-4}px,${pos.current.y-4}px)`;
      if(ring.current) ring.current.style.transform = `translate(${rpos.current.x-20}px,${rpos.current.y-20}px)`;
      af = requestAnimationFrame(loop);
    };
    loop();
    return () => { window.removeEventListener('mousemove', move); cancelAnimationFrame(af); };
  }, []);

  return (
    <>
      <div ref={dot} style={{position:'fixed',width:8,height:8,background:T.gold,borderRadius:'50%',pointerEvents:'none',zIndex:99999,top:0,left:0,mixBlendMode:'multiply'}} />
      <div ref={ring} style={{position:'fixed',width:40,height:40,border:`2px solid ${T.ink}`,borderRadius:'50%',pointerEvents:'none',zIndex:99998,top:0,left:0,opacity:.35}} />
    </>
  );
}

// ── MUSIC STAFF BACKGROUND ───────────────────────────────────────────────────
function StaffBackground() {
  const notes = ['♩','♪','♫','♬','𝄞','𝄢','♩','♪','♫'];
  return (
    <div style={{position:'fixed',inset:0,overflow:'hidden',pointerEvents:'none',zIndex:0}}>
      {[18,26,34,42,50,60,68,76,84,92].map((pct,i)=>(
        <div key={i} style={{
          position:'absolute',top:`${pct}%`,left:0,right:0,
          height:1,background:`rgba(26,20,16,${i%5===0?.1:.05})`,
        }}/>
      ))}
      <div style={{
        position:'absolute',top:'6%',display:'flex',gap:'5rem',
        fontSize:'2.2rem',color:`rgba(26,20,16,.04)`,
        animation:'staffScroll 50s linear infinite',
        whiteSpace:'nowrap',userSelect:'none',
      }}>
        {[...notes,...notes,...notes,...notes].map((n,i)=>(
          <span key={i} style={{fontFamily:'serif',transform:`rotate(${(i%3-1)*6}deg)`,display:'inline-block'}}>{n}</span>
        ))}
      </div>
      <svg style={{position:'absolute',inset:0,width:'100%',height:'100%',opacity:.035}}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch"/>
          <feColorMatrix type="saturate" values="0"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)"/>
      </svg>
    </div>
  );
}

// ── VU METER ─────────────────────────────────────────────────────────────────
function VUMeter({active, color=T.gold}) {
  const [vals, setVals] = useState(()=>Array(12).fill(.2));
  useEffect(()=>{
    if(!active) return;
    const id = setInterval(()=>{
      setVals(prev=>prev.map((_,i)=>{
        const t = Date.now()/800;
        return Math.max(.05, Math.abs(Math.sin(t+i*.7)*Math.cos(t*.5+i*.3))*.95+.05);
      }));
    }, 80);
    return () => clearInterval(id);
  }, [active]);

  return (
    <div style={{display:'flex',alignItems:'flex-end',gap:3,height:60}}>
      {vals.map((v,i)=>(
        <div key={i} style={{
          width:6,
          height:`${active ? v*100 : 8}%`,
          background: v>.8 ? T.red : v>.6 ? T.amber : color,
          borderRadius:'2px 2px 0 0',
          transition:'height .1s ease',
          minHeight:4,
        }}/>
      ))}
    </div>
  );
}

// ── TAPE REEL ─────────────────────────────────────────────────────────────────
function TapeReel({spinning, size=60, color=T.ink}) {
  return (
    <div style={{position:'relative',width:size,height:size,flexShrink:0}}>
      <div style={{
        width:size,height:size,borderRadius:'50%',
        border:`${Math.max(2, size/20)}px solid ${color}`,
        animation: spinning ? 'reelSpin 2s linear infinite' : 'none',
        display:'flex',alignItems:'center',justifyContent:'center',
        position:'relative',
      }}>
        {[0,120,240].map(deg=>(
          <div key={deg} style={{
            position:'absolute',width:'28%',height:'28%',
            background:color,borderRadius:'50%',
            top:'50%',left:'50%',
            transformOrigin:'-50% -50%',
            transform:`rotate(${deg}deg) translate(-50%,-50%)`,
          }}/>
        ))}
        <div style={{
          width:'33%',height:'33%',borderRadius:'50%',
          border:`2px solid ${color}`,
          position:'relative',zIndex:2,
        }}/>
      </div>
    </div>
  );
}

// ── FLOATING NOTES ─────────────────────────────────────────────────────────────
function FloatingNotes({trigger}) {
  const [notes, setNotes] = useState([]);
  useEffect(()=>{
    if(!trigger) return;
    const nn = Array.from({length:6},(_,i)=>({
      id: Date.now()+i,
      sym: ['♩','♪','♫','♬'][Math.floor(Math.random()*4)],
      x: trigger.x + (Math.random()-.5)*100,
      y: trigger.y,
      delay: i*90,
    }));
    setNotes(prev=>[...prev,...nn]);
    setTimeout(()=>setNotes(prev=>prev.filter(n=>!nn.find(nn2=>nn2.id===n.id))),1400);
  },[trigger]);

  return (
    <div style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:9990}}>
      {notes.map(n=>(
        <div key={n.id} style={{
          position:'fixed',left:n.x,top:n.y,
          fontSize:22,color:T.gold,fontFamily:'serif',fontWeight:700,
          animation:'floatNote 1.1s ease forwards',
          animationDelay:`${n.delay}ms`,
        }}>{n.sym}</div>
      ))}
    </div>
  );
}

// ── MODAL BASE ────────────────────────────────────────────────────────────────
function Modal({onClose, children}) {
  useEffect(()=>{
    document.body.style.overflow = 'hidden';
    const fn = e => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', fn);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', fn); };
  },[onClose]);

  return (
    <div onClick={onClose} style={{
      position:'fixed',inset:0,
      background:'rgba(26,20,16,.5)',
      backdropFilter:'blur(8px)',
      zIndex:5000,
      display:'flex',alignItems:'center',justifyContent:'center',
      padding:'2rem',
      animation:'fadeIn .2s ease',
    }}>
      <div onClick={e=>e.stopPropagation()} style={{
        background:T.cream,
        border:`2px solid ${T.ink}`,
        borderRadius:0,
        width:'100%',maxWidth:680,maxHeight:'88vh',
        overflowY:'auto',position:'relative',
        animation:'modalSlide .3s ease',
      }}>
        <button onClick={onClose} style={{
          position:'sticky',top:12,float:'right',margin:'12px 12px 0 0',
          width:34,height:34,
          border:`2px solid ${T.ink}`,
          background:T.cream,color:T.ink,
          fontSize:16,cursor:'none',
          display:'flex',alignItems:'center',justifyContent:'center',
          transition:'all .15s',
        }}
        onMouseEnter={e=>{e.currentTarget.style.background=T.ink;e.currentTarget.style.color=T.cream;}}
        onMouseLeave={e=>{e.currentTarget.style.background=T.cream;e.currentTarget.style.color=T.ink;}}
        >×</button>
        {children}
      </div>
    </div>
  );
}

// ── TRACK MODAL ───────────────────────────────────────────────────────────────
function TrackModal({track, onClose}) {
  const [flowing, setFlowing] = useState(false);
  const [revealed, setRevealed] = useState('');
  const words = (track.lyrics || '').split(/\s+/);
  const iRef = useRef(0);
  const tRef = useRef(null);

  const startFlow = useCallback(()=>{
    setRevealed(''); iRef.current=0; setFlowing(true);
    tRef.current = setInterval(()=>{
      if(iRef.current >= words.length){ clearInterval(tRef.current); setFlowing(false); return; }
      setRevealed(p => p + (iRef.current>0?' ':'') + words[iRef.current++]);
    }, 170);
  },[words]);

  const stopFlow = useCallback(()=>{ clearInterval(tRef.current); setFlowing(false); },[]);
  useEffect(()=>()=>clearInterval(tRef.current),[]);

  return (
    <Modal onClose={onClose}>
      <div style={{height:6,background:track.color||T.gold}}/>
      <div style={{padding:'2rem'}}>
        <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:'1.5rem',gap:'1rem'}}>
          <div>
            <div style={{fontSize:9,letterSpacing:'0.25em',color:T.muted,marginBottom:8,textTransform:'uppercase'}}>
              {track.type} · {track.year} · {track.key} · {track.bpm} BPM
            </div>
            <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'2.2rem',fontWeight:400,color:T.ink,lineHeight:1.1}}>
              {track.title}
            </h2>
            <div style={{fontSize:11,color:T.muted,marginTop:6}}>{track.lang} · {track.dur}</div>
          </div>
          <VUMeter active={flowing} color={track.color}/>
        </div>
        {track.desc && (
          <p style={{color:T.inkL,lineHeight:1.8,fontSize:13,marginBottom:'1.5rem',borderLeft:`3px solid ${track.color||T.gold}`,paddingLeft:'1rem'}}>{track.desc}</p>
        )}
        <div style={{background:T.paper,border:`1px solid ${T.border}`,padding:'1.5rem',marginBottom:'1rem'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'1.25rem'}}>
            <span style={{fontSize:9,letterSpacing:'0.2em',color:T.muted}}>LYRICS</span>
            <button onClick={flowing ? stopFlow : startFlow} style={{
              padding:'6px 18px',
              background:flowing ? T.ink : (track.color||T.gold),
              border:'none',color:T.cream,
              fontSize:10,letterSpacing:'0.12em',cursor:'none',transition:'all .2s',
            }}>
              {flowing ? '■ STOP' : '▶ FLOW LYRICS'}
            </button>
          </div>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'1.25rem',lineHeight:2,color:T.ink,minHeight:100,whiteSpace:'pre-line'}}>
            {flowing ? (
              <>{revealed}<span style={{display:'inline-block',width:2,height:22,background:track.color||T.gold,animation:'blink 1s infinite',marginLeft:4,verticalAlign:'middle'}}/></>
            ) : (
              <span style={{color:T.muted,whiteSpace:'pre-line'}}>{track.lyrics}</span>
            )}
          </div>
        </div>
        <div style={{fontSize:9,letterSpacing:'0.2em',color:T.faint,textAlign:'center'}}>♪ COMING SOON ON ALL PLATFORMS ♪</div>
      </div>
    </Modal>
  );
}

// ── ALBUM MODAL ───────────────────────────────────────────────────────────────
function AlbumModal({album, onClose, onTrack}) {
  return (
    <Modal onClose={onClose}>
      <div style={{height:6,background:album.color||T.gold}}/>
      <div style={{padding:'2rem'}}>
        <div style={{fontSize:9,letterSpacing:'0.25em',color:T.muted,marginBottom:8,textTransform:'uppercase'}}>
          {album.type} · {album.year} · {album.key} · {album.bpm} BPM
        </div>
        <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'2.5rem',fontWeight:400,color:T.ink,marginBottom:6,lineHeight:1.1}}>{album.title}</h2>
        <div style={{fontSize:11,color:T.muted,marginBottom:'1.5rem'}}>{album.lang} · {album.trackCount} tracks · {album.dur}</div>
        <p style={{color:T.inkL,lineHeight:1.8,fontSize:13,marginBottom:'2rem',borderLeft:`3px solid ${album.color||T.gold}`,paddingLeft:'1rem'}}>{album.desc}</p>
        <div style={{fontSize:9,letterSpacing:'0.2em',color:T.muted,marginBottom:'1rem'}}>TRACK LIST</div>
        {album.tracks?.map((t,i)=>(
          <AlbumTrackRow key={i} track={t} index={i} color={album.color}
            onClick={()=>onTrack({...t,type:album.type,year:album.year,bpm:album.bpm,key:album.key,color:album.color})}/>
        ))}
      </div>
    </Modal>
  );
}

function AlbumTrackRow({track,index,color,onClick}) {
  const [hov,setHov]=useState(false);
  return (
    <div onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{
      display:'flex',alignItems:'center',justifyContent:'space-between',
      padding:'14px 0',borderBottom:`1px solid ${T.border}`,
      cursor:'none',transition:'all .15s',
      paddingLeft: hov ? '8px' : '0',
    }}>
      <div style={{display:'flex',alignItems:'center',gap:14}}>
        <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'1rem',color:hov?color:T.muted,minWidth:24,fontStyle:'italic',transition:'color .15s'}}>
          {hov ? '▶' : `${index+1}.`}
        </span>
        <div>
          <div style={{color:hov?T.ink:T.inkL,fontSize:13,transition:'color .15s'}}>{track.title}</div>
          <div style={{color:T.muted,fontSize:10}}>{track.lang}</div>
        </div>
      </div>
      <span style={{color:T.muted,fontSize:12}}>{track.dur}</span>
    </div>
  );
}

// ── SIDEBAR NAV ───────────────────────────────────────────────────────────────
function Sidebar({page, onNav}) {
  const [reelOn, setReelOn] = useState(false);
  const pages = [{id:'home',label:'HOME'},{id:'music',label:'MUSIC'},{id:'about',label:'ABOUT'},{id:'contact',label:'CONTACT'}];

  return (
    <aside style={{
      position:'fixed',left:0,top:0,bottom:0,width:80,
      background:T.ink,zIndex:400,
      display:'flex',flexDirection:'column',alignItems:'center',
      padding:'1.5rem 0',
    }}>
      <button onClick={()=>{onNav('home');setReelOn(r=>!r);}} style={{background:'none',border:'none',cursor:'none',marginBottom:'1.5rem'}}>
        <TapeReel spinning={reelOn} size={46} color={T.gold}/>
      </button>
      <div style={{width:36,height:1,background:'rgba(245,240,232,.12)',marginBottom:'1.5rem'}}/>
      <div style={{flex:1,display:'flex',flexDirection:'column',justifyContent:'center',gap:'2.5rem'}}>
        {pages.map(p=>(
          <SidebarBtn key={p.id} label={p.label} active={page===p.id} onClick={()=>onNav(p.id)}/>
        ))}
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:3,width:28}}>
        {Array.from({length:6},(_,i)=>(
          <div key={i} style={{height:3,background:`rgba(212,160,23,${.12+i*.08})`,borderRadius:1}}/>
        ))}
      </div>
    </aside>
  );
}

function SidebarBtn({label, active, onClick}) {
  const [hov,setHov]=useState(false);
  return (
    <button onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{
      background:'none',border:'none',cursor:'none',
      fontSize:9,letterSpacing:'0.25em',
      color: active ? T.gold : hov ? 'rgba(245,240,232,.8)' : 'rgba(245,240,232,.35)',
      transform:'rotate(-90deg)',whiteSpace:'nowrap',
      transition:'color .2s',padding:'4px 0',
    }}>{label}</button>
  );
}

// ── MINI FADER ────────────────────────────────────────────────────────────────
function Fader({label, defaultVal}) {
  const [val] = useState(defaultVal);
  return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:6}}>
      <div style={{width:16,height:80,background:T.paperd,border:`1px solid ${T.borderD}`,borderRadius:8,position:'relative'}}>
        <div style={{
          position:'absolute',width:'140%',height:10,
          background:T.ink,borderRadius:2,
          top:`${100-val}%`,left:'50%',
          transform:'translateX(-50%) translateY(-50%)',
          boxShadow:'0 2px 6px rgba(26,20,16,.25)',
        }}/>
      </div>
      <div style={{fontSize:8,letterSpacing:'0.1em',color:T.muted}}>{label}</div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// HOME PAGE
// ══════════════════════════════════════════════════════════════
function HomePage({onNav}) {
  const [lyricIdx, setLyricIdx] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [notesTrigger, setNotesTrigger] = useState(null);

  useEffect(()=>{
    const id = setInterval(()=>setLyricIdx(i=>(i+1)%LYRIC_SNIPPETS.length), 3500);
    return()=>clearInterval(id);
  },[]);

  const handleVinylClick = useCallback(e=>{
    setSpinning(s=>!s);
    setNotesTrigger({x:e.clientX, y:e.clientY});
  },[]);

  return (
    <div style={{minHeight:'100vh',paddingLeft:80,position:'relative'}}>
      <FloatingNotes trigger={notesTrigger}/>
      <div style={{
        minHeight:'100vh',
        display:'grid',
        gridTemplateColumns:'1fr 360px',
        gridTemplateRows:'1fr auto',
      }}>
        {/* LEFT: Editorial text */}
        <div style={{
          display:'flex',flexDirection:'column',justifyContent:'center',
          padding:'5rem 3rem 5rem 4rem',
          borderRight:`1px solid ${T.border}`,
          position:'relative',overflow:'hidden',
        }}>
          <div style={{
            position:'absolute',bottom:'-3rem',left:'-1rem',
            fontFamily:"'Cormorant Garamond',serif",
            fontSize:'20vw',fontWeight:700,
            color:`rgba(26,20,16,.022)`,
            userSelect:'none',lineHeight:1,
            transform:'rotate(-8deg)',whiteSpace:'nowrap',
          }}>MUSIC</div>

          <div className="s1" style={{fontSize:9,letterSpacing:'0.35em',color:T.muted,marginBottom:'1.5rem'}}>
            ♪ PULKIT J — SINGER · SONGWRITER · PRODUCER
          </div>

          <h1 className="s2" style={{
            fontFamily:"'Cormorant Garamond',serif",
            fontSize:'clamp(4rem,9vw,8rem)',
            fontWeight:300,lineHeight:.92,
            color:T.ink,letterSpacing:'-0.02em',
            marginBottom:'1.2rem',
          }}>
            Making<br/>
            <em style={{fontStyle:'italic',fontWeight:400}}>music</em><br/>
            <span style={{color:T.gold}}>feel</span> real.
          </h1>

          <div className="s3" style={{
            height:42,overflow:'hidden',
            marginBottom:'2.5rem',
          }}>
            <div key={lyricIdx} style={{
              fontFamily:"'Cormorant Garamond',serif",
              fontSize:'1.2rem',fontStyle:'italic',
              color:T.muted,
              animation:'fadeUp .5s ease both',
            }}>
              {LYRIC_SNIPPETS[lyricIdx]}
            </div>
          </div>

          <div className="s4" style={{display:'flex',gap:'1rem',flexWrap:'wrap',marginBottom:'3rem'}}>
            <HeroBtn label="Listen →" page="music" bg={T.ink} fg={T.cream} onNav={onNav}/>
            <HeroBtn label="My Story" page="about" bg="transparent" fg={T.ink} onNav={onNav}/>
            <HeroBtn label="Collaborate" page="contact" bg={T.gold} fg={T.ink} onNav={onNav}/>
          </div>

          <div className="s5" style={{display:'flex',gap:'3rem'}}>
            {[['2','Languages'],['6+','Releases'],['Hindi & English','Languages'],['Pop · R&B','Genres']].map(([v,l])=>(
              <div key={l}>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'1.8rem',fontWeight:400,color:T.ink,lineHeight:1}}>{v}</div>
                <div style={{fontSize:9,letterSpacing:'0.15em',color:T.muted,marginTop:4}}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Studio panel */}
        <div style={{
          display:'flex',flexDirection:'column',padding:'2.5rem 2rem',gap:'2rem',
          background:T.paper,borderLeft:`1px solid ${T.border}`,
        }}>
          <div className="s1" style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <TapeReel spinning={spinning} size={50} color={T.ink}/>
            <div style={{fontSize:8,letterSpacing:'0.2em',color:T.muted}}>STUDIO A</div>
            <TapeReel spinning={spinning} size={50} color={T.ink}/>
          </div>

          {/* Vinyl */}
          <div className="s2" style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'0.6rem'}}>
            <div onClick={handleVinylClick} style={{
              width:150,height:150,borderRadius:'50%',
              background:'conic-gradient(from 0deg, #1a1410 0deg, #2a2018 25deg, #1a1410 50deg, #2a2018 75deg, #1a1410 100deg, #2a2018 125deg, #1a1410 150deg, #2a2018 175deg, #1a1410 200deg, #2a2018 225deg, #1a1410 250deg, #2a2018 275deg, #1a1410 300deg, #2a2018 325deg, #1a1410 350deg, #2a2018 375deg)',
              boxShadow:'0 8px 40px rgba(26,20,16,.3), inset 0 0 30px rgba(0,0,0,.4)',
              animation: spinning ? 'reelSpin 3s linear infinite' : 'none',
              cursor:'none',position:'relative',
              display:'flex',alignItems:'center',justifyContent:'center',
            }}>
              {[90,75,60,45,30].map((pct,i)=>(
                <div key={i} style={{
                  position:'absolute',width:`${pct}%`,height:`${pct}%`,borderRadius:'50%',
                  border:'1px solid rgba(90,70,40,.18)',
                }}/>
              ))}
              <div style={{
                width:54,height:54,borderRadius:'50%',
                background:`linear-gradient(135deg, ${T.gold}, ${T.amber})`,
                display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',
                zIndex:2,
              }}>
                <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:9,fontWeight:700,color:T.ink,letterSpacing:'0.1em'}}>PULKIT</span>
                <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:7,color:'#5a3a00',letterSpacing:'0.12em'}}>J</span>
              </div>
            </div>
            <div style={{fontSize:9,letterSpacing:'0.15em',color:T.muted}}>
              {spinning ? '◆ PLAYING' : '▷ CLICK TO SPIN'}
            </div>
          </div>

          {/* VU Meter */}
          <div className="s3">
            <div style={{fontSize:8,letterSpacing:'0.2em',color:T.muted,marginBottom:8}}>LEVELS</div>
            <VUMeter active={spinning} color={T.gold}/>
          </div>

          {/* Faders */}
          <div className="s4">
            <div style={{fontSize:8,letterSpacing:'0.2em',color:T.muted,marginBottom:12}}>MIX</div>
            <div style={{display:'flex',gap:'1.2rem',justifyContent:'center'}}>
              {[['VOX',78],['BEAT',92],['BASS',65],['FX',45]].map(([l,v])=>(
                <Fader key={l} label={l} defaultVal={v}/>
              ))}
            </div>
          </div>

          {/* Now playing */}
          <div className="s5" style={{background:T.ink,padding:'1rem',borderTop:`3px solid ${T.gold}`}}>
            <div style={{fontSize:8,letterSpacing:'0.25em',color:'rgba(245,240,232,.35)',marginBottom:6}}>NOW PLAYING</div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'1.05rem',color:T.cream,marginBottom:3}}>{RELEASES[0].title}</div>
            <div style={{fontSize:9,color:'rgba(245,240,232,.35)',letterSpacing:'0.1em'}}>{RELEASES[0].lang}</div>
            <div style={{marginTop:10,height:2,background:'rgba(245,240,232,.1)',borderRadius:1}}>
              <div style={{width:spinning?'45%':'0%',height:'100%',background:T.gold,transition:'width 2s ease',borderRadius:1}}/>
            </div>
          </div>
        </div>

        {/* Bottom tape strip */}
        <div style={{
          gridColumn:'1/-1',background:T.ink,overflow:'hidden',
          height:44,display:'flex',alignItems:'center',
          borderTop:`1px solid ${T.borderD}`,
        }}>
          <div style={{
            display:'flex',gap:'4rem',whiteSpace:'nowrap',
            fontSize:9,letterSpacing:'0.3em',color:'rgba(245,240,232,.3)',
            animation:'marquee 22s linear infinite',
          }}>
            {['POP','R&B','SINGER','SONGWRITER','HINDI','ENGLISH','BILINGUAL','PRODUCER','ARTIST','DEVELOPER',
              'POP','R&B','SINGER','SONGWRITER','HINDI','ENGLISH','BILINGUAL','PRODUCER','ARTIST','DEVELOPER'].map((t,i)=>(
              <span key={i}>◆ {t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroBtn({label, page, bg, fg, onNav}) {
  const [hov,setHov]=useState(false);
  return (
    <button onClick={()=>onNav(page)} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{
      padding:'10px 22px',
      background: hov && bg==='transparent' ? T.ink : hov && bg===T.gold ? T.goldD : hov ? '#2d2620' : bg,
      border:`2px solid ${bg==='transparent' ? T.ink : bg===T.gold ? T.gold : T.ink}`,
      color: hov && bg==='transparent' ? T.cream : fg,
      fontSize:10,letterSpacing:'0.18em',cursor:'none',
      transition:'all .2s',
      transform: hov ? 'translateY(-2px)' : 'none',
    }}>{label}</button>
  );
}

// ══════════════════════════════════════════════════════════════
// MUSIC PAGE
// ══════════════════════════════════════════════════════════════
function MusicPage() {
  const [active, setActive] = useState(null);
  const [activeAlbum, setActiveAlbum] = useState(null);
  const [filter, setFilter] = useState('all');
  const [hovRow, setHovRow] = useState(null);

  const filtered = filter==='all' ? RELEASES : RELEASES.filter(r=>r.type===filter);

  return (
    <div style={{minHeight:'100vh',paddingLeft:80}} className="page-in">
      <div style={{padding:'4rem 4rem 2rem',borderBottom:`1px solid ${T.border}`,display:'flex',alignItems:'flex-end',justifyContent:'space-between'}}>
        <div>
          <div style={{fontSize:9,letterSpacing:'0.35em',color:T.muted,marginBottom:8}}>// DISCOGRAPHY</div>
          <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'clamp(3rem,6vw,5rem)',fontWeight:300,color:T.ink,lineHeight:1}}>The Music</h1>
        </div>
        <div style={{display:'flex',gap:'1rem',alignItems:'center',opacity:.25}}>
          <TapeReel size={50} color={T.ink}/>
          <div style={{width:70,height:2,background:T.ink}}/>
          <TapeReel size={50} color={T.ink}/>
        </div>
      </div>

      <div style={{padding:'1.25rem 4rem',borderBottom:`1px solid ${T.border}`,display:'flex',gap:'0.5rem'}}>
        {[['all','All Releases'],['single','Singles'],['ep','EPs'],['album','Albums']].map(([val,lbl])=>(
          <button key={val} onClick={()=>setFilter(val)} style={{
            padding:'6px 16px',fontSize:9,letterSpacing:'0.2em',
            background:filter===val ? T.ink : 'transparent',
            border:`1px solid ${filter===val ? T.ink : T.border}`,
            color:filter===val ? T.cream : T.muted,
            cursor:'none',transition:'all .15s',
          }}>{lbl}</button>
        ))}
      </div>

      <div>
        {/* Header row */}
        <div style={{
          display:'grid',gridTemplateColumns:'60px 3fr 1fr 1fr 1fr 80px',
          alignItems:'center',gap:'1.5rem',
          padding:'0.75rem 4rem',borderBottom:`1px solid ${T.border}`,
        }}>
          {['#','TITLE','TYPE','YEAR','KEY / TRACKS','TIME'].map((h,i)=>(
            <div key={i} style={{fontSize:8,letterSpacing:'0.2em',color:T.faint,textAlign:i===5?'right':'left'}}>{h}</div>
          ))}
        </div>
        {filtered.map((r,i)=>(
          <MusicRow key={r.id} r={r} i={i} hov={hovRow===r.id}
            onHov={()=>setHovRow(r.id)} onLeave={()=>setHovRow(null)}
            onClick={()=>r.tracks ? setActiveAlbum(r) : setActive(r)}/>
        ))}
      </div>

      {active && <TrackModal track={active} onClose={()=>setActive(null)}/>}
      {activeAlbum && !active && (
        <AlbumModal album={activeAlbum} onClose={()=>setActiveAlbum(null)} onTrack={t=>setActive(t)}/>
      )}
    </div>
  );
}

function MusicRow({r, i, hov, onHov, onLeave, onClick}) {
  return (
    <div onMouseEnter={onHov} onMouseLeave={onLeave} onClick={onClick} style={{
      display:'grid',gridTemplateColumns:'60px 3fr 1fr 1fr 1fr 80px',
      alignItems:'center',gap:'1.5rem',
      padding:'1.2rem 4rem',borderBottom:`1px solid ${T.border}`,
      background: hov ? T.paper : 'transparent',
      cursor:'none',transition:'background .15s',
    }}>
      <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'1.4rem',color:hov?r.color:T.faint,fontStyle:'italic',transition:'color .15s'}}>
        {hov ? '▶' : `0${i+1}`}
      </div>
      <div>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'1.15rem',fontWeight:400,color:hov?T.ink:T.inkL,transition:'color .15s'}}>{r.title}</div>
        <div style={{fontSize:10,color:T.muted,marginTop:2}}>{r.lang}</div>
      </div>
      <div>
        <span style={{
          display:'inline-block',padding:'2px 8px',fontSize:8,letterSpacing:'0.15em',
          background:hov?r.color:'transparent',
          border:`1px solid ${hov?r.color:T.border}`,
          color:hov?T.cream:T.muted,transition:'all .15s',
        }}>{r.type.toUpperCase()}</span>
      </div>
      <div style={{fontSize:11,color:T.muted}}>{r.year}</div>
      <div style={{fontSize:11,color:T.muted}}>{r.trackCount ? `${r.trackCount} tracks` : r.key}</div>
      <div style={{fontSize:11,color:T.muted,textAlign:'right'}}>{r.dur}</div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// ABOUT PAGE
// ══════════════════════════════════════════════════════════════
function AboutPage() {
  const skills = [
    {n:'Songwriting', d:'Bilingual lyrical storytelling with emotional precision and poetic craft.', sym:'𝄞'},
    {n:'Vocals', d:'Expressive delivery across Pop, R&B, and Hindustani traditions.', sym:'♪'},
    {n:'Production', d:'Modern DAW workflow, layered textures, cinematic sound design.', sym:'♫'},
    {n:'Mixing', d:'Polished, emotionally resonant mixes that serve the song first.', sym:'♬'},
  ];

  return (
    <div style={{minHeight:'100vh',paddingLeft:80}} className="page-in">
      <div style={{padding:'4rem 4rem 2rem',borderBottom:`1px solid ${T.border}`}}>
        <div style={{fontSize:9,letterSpacing:'0.35em',color:T.muted,marginBottom:8}}>// ARTIST FILE</div>
        <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'clamp(3rem,6vw,5rem)',fontWeight:300,color:T.ink,lineHeight:1}}>The Artist</h1>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1.4fr 1fr',minHeight:'70vh'}}>
        <div style={{padding:'4rem',borderRight:`1px solid ${T.border}`}}>
          <blockquote style={{
            fontFamily:"'Cormorant Garamond',serif",
            fontSize:'clamp(1.6rem,2.8vw,2.5rem)',
            fontWeight:300,fontStyle:'italic',lineHeight:1.35,color:T.ink,
            marginBottom:'2.5rem',
            borderLeft:`4px solid ${T.gold}`,paddingLeft:'2rem',
          }}>
            "Music and code are two sides of the same creative coin — both create something from nothing."
          </blockquote>
          <p style={{color:T.inkL,lineHeight:1.9,fontSize:14,marginBottom:'1.5rem'}}>
            I'm Pulkit J — a bilingual artist and developer at the intersection of tradition and innovation. Growing up between cultures, I found myself drawn to blending South Asian musical traditions with contemporary pop and R&B production.
          </p>
          <p style={{color:T.inkL,lineHeight:1.9,fontSize:14,marginBottom:'1.5rem'}}>
            Hindi and English became more than languages — they became tools for emotional storytelling. As a developer, I see music production through a unique lens: every beat an algorithm, every melody a function, every song a carefully architected experience.
          </p>
          <p style={{color:T.inkL,lineHeight:1.9,fontSize:14}}>
            My goal isn't just to make songs, but to build experiences — soundscapes where tradition meets innovation, where every element serves the story I'm trying to tell.
          </p>
        </div>

        <div style={{padding:'3rem',background:T.paper}}>
          <div style={{fontSize:9,letterSpacing:'0.3em',color:T.muted,marginBottom:'1.5rem'}}>FACTS</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',marginBottom:'3rem'}}>
            {[{v:'2',l:'Languages',c:T.gold},{v:'6+',l:'Releases',c:T.amber},{v:'Pop',l:'Genre',c:T.teal},{v:'R&B',l:'Genre',c:T.red}].map(s=>(
              <div key={s.l} style={{padding:'1.25rem',background:T.cream,border:`1px solid ${T.border}`,borderTop:`3px solid ${s.c}`}}>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'2.5rem',fontWeight:400,color:T.ink,lineHeight:1}}>{s.v}</div>
                <div style={{fontSize:9,letterSpacing:'0.2em',color:T.muted,marginTop:4}}>{s.l}</div>
              </div>
            ))}
          </div>
          <div style={{fontSize:9,letterSpacing:'0.3em',color:T.muted,marginBottom:'1rem'}}>CRAFT</div>
          {skills.map(s=><SkillRow key={s.n} {...s}/>)}
        </div>
      </div>

      <div style={{padding:'1.5rem 4rem',borderTop:`1px solid ${T.border}`,background:T.paper,display:'flex',gap:'2.5rem',alignItems:'center'}}>
        {['Singer','Songwriter','Producer','Developer','Bilingual','Artist'].map((tag,i,arr)=>(
          <div key={i} style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'1.05rem',fontStyle:'italic',color:T.muted}}>
            {tag}{i<arr.length-1?' ·':''}
          </div>
        ))}
      </div>
    </div>
  );
}

function SkillRow({n,d,sym}) {
  const [hov,setHov]=useState(false);
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{
      display:'flex',gap:'1rem',alignItems:'flex-start',
      padding:'0.75rem 0',borderBottom:`1px solid ${T.border}`,
    }}>
      <span style={{fontFamily:'serif',fontSize:'1.3rem',color:hov?T.gold:T.faint,transition:'color .15s',marginTop:-2}}>{sym}</span>
      <div>
        <div style={{fontSize:12,fontWeight:500,color:T.ink,marginBottom:3}}>{n}</div>
        <div style={{fontSize:11,color:T.muted,lineHeight:1.6}}>{d}</div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// CONTACT PAGE
// ══════════════════════════════════════════════════════════════
function ContactPage() {
  const [form, setForm] = useState({name:'',email:'',type:'Collaboration',message:''});
  const [focus, setFocus] = useState(null);
  const [sent, setSent] = useState(false);
  const [notesTrigger, setNotesTrigger] = useState(null);

  const submit = useCallback(e=>{
    e.preventDefault();
    if(!form.name||!form.email||!form.message) return;
    setSent(true);
    setNotesTrigger({x:window.innerWidth/2,y:window.innerHeight/2});
    setTimeout(()=>setSent(false),5000);
    setForm({name:'',email:'',type:'Collaboration',message:''});
  },[form]);

  const socials = [
    {label:'Email', val:'contact@pulkitj.com', href:'mailto:contact@pulkitj.com', sym:'@'},
    {label:'Instagram', val:'@pulkitj', href:'https://instagram.com', sym:'◈'},
    {label:'YouTube', val:'Pulkit J', href:'https://youtube.com', sym:'▷'},
    {label:'Twitter/X', val:'@pulkitj', href:'https://twitter.com', sym:'✦'},
  ];

  return (
    <div style={{minHeight:'100vh',paddingLeft:80}} className="page-in">
      <FloatingNotes trigger={notesTrigger}/>

      <div style={{padding:'4rem 4rem 2rem',borderBottom:`1px solid ${T.border}`}}>
        <div style={{fontSize:9,letterSpacing:'0.35em',color:T.muted,marginBottom:8}}>// STUDIO SESSIONS</div>
        <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'clamp(3rem,6vw,5rem)',fontWeight:300,color:T.ink,lineHeight:1}}>Get In Touch</h1>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1.5fr',minHeight:'80vh'}}>
        <div style={{padding:'3rem 4rem',borderRight:`1px solid ${T.border}`}}>
          <p style={{color:T.inkL,lineHeight:1.9,fontSize:14,marginBottom:'2.5rem'}}>
            Interested in collaborations, live sessions, or just want to talk about music and code? The studio is always open.
          </p>
          <div style={{display:'flex',alignItems:'center',gap:10,padding:'1rem 1.25rem',background:T.paper,border:`1px solid ${T.border}`,marginBottom:'2rem'}}>
            <div style={{width:8,height:8,borderRadius:'50%',background:'#22c55e',animation:'glowPulse 2s infinite'}}/>
            <span style={{fontSize:11,color:T.inkL}}>Open to collaborations</span>
          </div>
          <div style={{fontSize:9,letterSpacing:'0.3em',color:T.muted,marginBottom:'1rem'}}>FIND ME</div>
          {socials.map((s,i)=><SocialRow key={i} {...s}/>)}
          <div style={{marginTop:'3rem',display:'flex',alignItems:'center',gap:'1rem',opacity:.12}}>
            <TapeReel size={38} color={T.ink}/>
            <div style={{flex:1,height:1,background:T.ink}}/>
            <TapeReel size={38} color={T.ink}/>
          </div>
        </div>

        <div style={{padding:'3rem 4rem',background:T.paper}}>
          {sent ? (
            <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'100%',gap:'1.5rem',animation:'fadeUp .4s ease',textAlign:'center'}}>
              <div style={{fontFamily:'serif',fontSize:'4rem',color:T.gold,animation:'heartbeat 1s ease 3'}}>♫</div>
              <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'2.5rem',fontWeight:300,color:T.ink}}>Message Sent!</h2>
              <p style={{color:T.muted,fontSize:13}}>I'll be in touch soon.</p>
            </div>
          ) : (
            <form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:'1.5rem'}}>
              <div style={{fontSize:9,letterSpacing:'0.3em',color:T.muted}}>SESSION REQUEST</div>
              <CField label="YOUR NAME" type="text" value={form.name} focused={focus==='name'}
                onFocus={()=>setFocus('name')} onBlur={()=>setFocus(null)} onChange={v=>setForm(f=>({...f,name:v}))} placeholder="What should I call you?"/>
              <CField label="EMAIL ADDRESS" type="email" value={form.email} focused={focus==='email'}
                onFocus={()=>setFocus('email')} onBlur={()=>setFocus(null)} onChange={v=>setForm(f=>({...f,email:v}))} placeholder="your@email.com"/>
              <div>
                <div style={{fontSize:9,letterSpacing:'0.22em',color:T.muted,marginBottom:8}}>SESSION TYPE</div>
                <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                  {['Collaboration','Booking','Production','Just Saying Hi'].map(t=>(
                    <button key={t} type="button" onClick={()=>setForm(f=>({...f,type:t}))} style={{
                      padding:'6px 14px',fontSize:9,letterSpacing:'0.12em',cursor:'none',
                      background:form.type===t?T.ink:'transparent',
                      border:`1px solid ${form.type===t?T.ink:T.borderD}`,
                      color:form.type===t?T.cream:T.muted,transition:'all .15s',
                    }}>{t}</button>
                  ))}
                </div>
              </div>
              <CField label="YOUR MESSAGE" type="textarea" value={form.message} focused={focus==='msg'}
                onFocus={()=>setFocus('msg')} onBlur={()=>setFocus(null)} onChange={v=>setForm(f=>({...f,message:v}))} placeholder="Tell me about your project, idea, or collab..."/>
              <button type="submit" style={{
                padding:'13px 28px',background:T.ink,border:'none',
                color:T.cream,fontSize:10,letterSpacing:'0.25em',cursor:'none',
                display:'flex',alignItems:'center',justifyContent:'center',gap:10,
                transition:'all .2s',borderBottom:`3px solid ${T.gold}`,
              }}
              onMouseEnter={e=>{e.currentTarget.style.background=T.gold;e.currentTarget.style.color=T.ink;}}
              onMouseLeave={e=>{e.currentTarget.style.background=T.ink;e.currentTarget.style.color=T.cream;}}
              >
                SEND MESSAGE ♪
              </button>
            </form>
          )}
        </div>
      </div>

      <div style={{padding:'1.5rem 4rem',borderTop:`1px solid ${T.border}`,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <span style={{fontSize:9,letterSpacing:'0.2em',color:T.muted}}>PULKIT J © 2025</span>
        <span style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:'italic',color:T.muted,fontSize:13}}>Made with love and code ♡</span>
        <span style={{fontSize:9,letterSpacing:'0.2em',color:T.muted}}>BILINGUAL ARTIST</span>
      </div>
    </div>
  );
}

function SocialRow({label,val,href,sym}) {
  const [hov,setHov]=useState(false);
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{display:'flex',alignItems:'center',gap:'1rem',padding:'1rem 0',borderBottom:`1px solid ${T.border}`,color:T.ink,transition:'all .15s', paddingLeft:hov?8:0}}
    >
      <span style={{fontSize:'1.3rem',fontFamily:'serif',color:hov?T.gold:T.faint,transition:'color .15s',width:24}}>{sym}</span>
      <div style={{flex:1}}>
        <div style={{fontSize:11,fontWeight:500,color:hov?T.ink:T.inkL}}>{label}</div>
        <div style={{fontSize:10,color:T.muted}}>{val}</div>
      </div>
      <span style={{color:hov?T.gold:'transparent',transition:'color .15s'}}>→</span>
    </a>
  );
}

function CField({label,type,value,placeholder,focused,onFocus,onBlur,onChange}) {
  const base = {
    width:'100%',padding:'12px 14px',
    background:T.cream,
    border:`1px solid ${focused?T.ink:T.border}`,
    borderBottom:`2px solid ${focused?T.gold:T.border}`,
    fontSize:13,fontFamily:"'JetBrains Mono',monospace",
    color:T.ink,outline:'none',transition:'border .15s',
    resize:type==='textarea'?'vertical':undefined,
  };
  return (
    <div>
      <div style={{fontSize:9,letterSpacing:'0.22em',color:focused?T.gold:T.muted,marginBottom:8,transition:'color .15s'}}>{label}</div>
      {type==='textarea'
        ? <textarea value={value} placeholder={placeholder} onFocus={onFocus} onBlur={onBlur} onChange={e=>onChange(e.target.value)} rows={5} style={base}/>
        : <input type={type} value={value} placeholder={placeholder} onFocus={onFocus} onBlur={onBlur} onChange={e=>onChange(e.target.value)} style={base}/>
      }
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// LOADING
// ══════════════════════════════════════════════════════════════
function LoadingScreen({text}) {
  return (
    <div style={{position:'fixed',inset:0,background:T.ink,display:'flex',alignItems:'center',justifyContent:'center',zIndex:9999,flexDirection:'column',gap:'2.5rem'}}>
      <div style={{display:'flex',alignItems:'center',gap:'2rem'}}>
        <TapeReel spinning size={70} color={T.gold}/>
        <div style={{display:'flex',flexDirection:'column',gap:5}}>
          {[1,.5,.8,.35,.9,.6].map((w,i)=>(
            <div key={i} style={{
              width:`${w*100}px`,height:3,background:`rgba(212,160,23,${w*.7})`,borderRadius:1,
              animation:`vuMeter ${.7+i*.15}s ease infinite`,animationDelay:`${i*.08}s`,
            }}/>
          ))}
        </div>
        <TapeReel spinning size={70} color={T.gold}/>
      </div>
      <div style={{color:T.gold,fontSize:11,letterSpacing:'0.18em',maxWidth:340,textAlign:'left',lineHeight:2,whiteSpace:'pre-wrap'}}>
        {text}<span style={{animation:'blink 1s infinite',display:'inline-block'}}>█</span>
      </div>
      <div style={{fontFamily:"'Cormorant Garamond',serif",color:'rgba(212,160,23,.12)',fontSize:'10rem',position:'absolute',bottom:'-3rem',right:'2rem',fontStyle:'italic',userSelect:'none',lineHeight:1}}>J</div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// ROOT APP
// ══════════════════════════════════════════════════════════════
export default function App() {
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [page, setPage] = useState('home');

  useEffect(()=>{
    const style = document.createElement('style');
    style.textContent = FONTS + GLOBAL_CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  },[]);

  useEffect(()=>{
    const lines = ['> INITIALIZING PULKIT J...','> LOADING AUDIO SYSTEMS...','> SYNCING BEATS...','> COMPILING LYRICS...','> TUNING INSTRUMENTS...','> READY ♪'].join('\n');
    let i=0;
    const t = setInterval(()=>{
      if(i<lines.length) setText(lines.slice(0,++i));
      else { clearInterval(t); setTimeout(()=>setLoading(false),350); }
    },16);
    return()=>clearInterval(t);
  },[]);

  const navigate = useCallback(p=>{
    setPage(p);
    window.scrollTo({top:0,behavior:'smooth'});
  },[]);

  if(loading) return <LoadingScreen text={text}/>;

  return (
    <div style={{minHeight:'100vh',background:T.cream,position:'relative'}}>
      <Cursor/>
      <StaffBackground/>
      <Sidebar page={page} onNav={navigate}/>
      <main style={{position:'relative',zIndex:10}}>
        {page==='home'    && <HomePage onNav={navigate}/>}
        {page==='music'   && <MusicPage/>}
        {page==='about'   && <AboutPage/>}
        {page==='contact' && <ContactPage/>}
      </main>
    </div>
  );
}