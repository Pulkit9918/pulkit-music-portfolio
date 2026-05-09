import { useState, useEffect, useRef, useCallback } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Instrument+Sans:wght@300;400;500&display=swap');`;

const GLOBAL_CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: #F7F4EF; color: #1C1814; font-family: 'Instrument Sans', sans-serif; overflow-x: hidden; cursor: none; }
  ::selection { background: #1C1814; color: #F7F4EF; }
  ::-webkit-scrollbar { width: 2px; }
  ::-webkit-scrollbar-track { background: #F7F4EF; }
  ::-webkit-scrollbar-thumb { background: #1C1814; }

  @keyframes blink { 0%,49%{opacity:1} 50%,100%{opacity:0} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  @keyframes marqueeScroll { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  @keyframes lineReveal { from{transform:scaleX(0)} to{transform:scaleX(1)} }
  @keyframes modalIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes textReveal { from{clip-path:inset(0 100% 0 0)} to{clip-path:inset(0 0% 0 0)} }
  @keyframes cursorPulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.4)} }

  .s1{animation:fadeUp .6s ease .05s both}
  .s2{animation:fadeUp .6s ease .15s both}
  .s3{animation:fadeUp .6s ease .25s both}
  .s4{animation:fadeUp .6s ease .35s both}
  .s5{animation:fadeUp .6s ease .45s both}
  .page-in{animation:fadeIn .3s ease both}
`;

const T = {
  bg:      '#F7F4EF',
  paper:   '#EDEAE3',
  ink:     '#1C1814',
  inkL:    '#3A3028',
  muted:   '#8C7E6E',
  faint:   '#C4B8A6',
  hairline:'#DDD8CF',
  gold:    '#C49A1A',
  accent:  '#1C1814',
};

const RELEASES = [
  {
    id:1, title:'Calling Me Back', lang:'English & Hindi', dur:'4:12', type:'single',
    year:2026, key:'Bb major',
    desc:'Smooth R&B vibes meet introspective songwriting in this late-night anthem.',
    highlight: 'Time stands still when you are near',
    lyrics:`Verse 1]
Phone screen glow
3 a.m. in Delhi sky
Your name there
but I just let it slide
Crowded room
parchi parchi sa dil yahan
Laughing loud
par khali sa hai yeh jahaan

[Pre-Chorus]
Tu door hai phir bhi
tera sheher mere saath
Har gali se aati
teri awaaz, tera raasta

[Chorus]
That country’s calling me back to you
Har border pe tera naam likhu
Doori doori, but I feel you close
Saanson mein teri vo old perfume
That country’s calling me back to you
Har ticket pe tera chehra dhoondhu
Jaun ya na jaun, I’m split in two
Kyunki wahan ho tum
it’s calling me back to you (oh-woh)

[Verse 2]
Metal chair
airport gate pe baitha main
One-way flight
par mann tera hi reh gaya
Boarding call
par aankhon mein sirf tera ghar
Google maps
zoom in on the place we were

[Pre-Chorus]
Tu keh rahi “mat aa”
par teri khamoshi loud
Har dhadkan mein budget
par dil bana hai crowd

[Chorus]
That country’s calling me back to you
Har border pe tera naam likhu
Doori doori, but I feel you close
Saanson mein teri vo old perfume
That country’s calling me back to you
Har ticket pe tera chehra dhoondhu
Jaun ya na jaun, I’m split in two
Kyunki wahan ho tum
it’s calling me back to you (yeah)

[Bridge]
Yaad hai vo raat
taxi ride in pouring rain
Tum muskura ke boli
“kabhi mat change”
Ab planes udate
par promises girte hain
Par jab bhi aankhein bandh karu
main wahi pe phir se hoon

[Chorus]
That country’s calling me back to you
Har border pe tera naam likhu
Doori doori, but I feel you close
Saanson mein teri vo old perfume
That country’s calling me back to you
Har ticket pe tera chehra dhoondhu
Jaun ya na jaun, I’m split in two
Kyunki wahan ho tum
it’s calling me back to you (calling me back)
(it’s calling me back to you)`,
  },
  {
    id:2, title:'Khaali Apartment', lang:'English', dur:'3:55', type:'single',
    year:2026, key:'E minor',
    desc:'An intimate piece reflecting on urban solitude and quiet wonder.',
    highlight: 'In the chaos I find peace',
    lyrics:`
[Verse 1]
Khaali apartment, geeli deewar
Bahar barish, andar bukhar
Binds ke paar, roshni ka zakhm
Main khada hoon, jaise band ek waqt

Sab log bhaage, main yahin ruka
Sheher ka shor, par dil na jaga
Table pe chaabi, phone bhi chup
Mere naam se hi, lagta hoon gum

[Pre-Chorus]
Aankhon mein dhuaan
Saanson mein tha
Kuch bhi nahi
Phir bhi sab tha

Main kaun hoon yahan
Bol de zara
Iss bheed mein
Kyon hoon akela?

[Chorus]
Main frozen hoon, frozen hoon
Is sheher mein frozen hoon
Main kahan hoon, kahan hoon
Apne hi andar kho gaya hoon
Frozen hoon, frozen hoon
Dil se main thoda door hoon
Sab tez chale
Main bas ruk gaya hoon (oh-oh)

[Verse 2]
Lift ki awaaz, phir khaali corridor
Khidki pe paani, jaise slow report
Blinds ke through woh safed sa noor
Mere chehre pe, chhod gaya blur

Doston ke text, sab short aur dry
"Busy hoon yaar" ka ek hi reply
Main bhi likhun, phir mita doon line
Jaise mere andar koi offline

[Pre-Chorus]
Aankhon mein dhuaan
Saanson mein tha
Kuch bhi nahi
Phir bhi sab tha

Main kaun hoon yahan
Bol de zara
Iss bheed mein
Kyon hoon akela?

[Chorus]
Main frozen hoon, frozen hoon
Is sheher mein frozen hoon
Main kahan hoon, kahan hoon
Apne hi andar kho gaya hoon
Frozen hoon, frozen hoon
Dil se main thoda door hoon
Sab tez chale
Main bas ruk gaya hoon (oh-oh)

[Bridge]
Rain on the glass
Naam bhi dhundla
Jis chehre ko dhoonda
Woh bhi tha adhoora

Agar main tootun
Kya koi sunega?
Iss concrete saal mein
Kya koi rukega?

[Final Chorus]
Main frozen hoon, frozen hoon
Is sheher mein frozen hoon
Main kahan hoon, kahan hoon
Apne hi andar kho gaya hoon
Frozen hoon, frozen hoon
Dil se main thoda door hoon
Sab tez chale
Main bas ruk gaya hoon (oh-oh)`,
  },
];

function Cursor() {
  const dot = useRef(null);
  const pos = useRef({x:0,y:0});
  const rpos = useRef({x:0,y:0});

  useEffect(()=>{
    const move = e => { pos.current = {x:e.clientX, y:e.clientY}; };
    window.addEventListener('mousemove', move);
    let af;
    const loop = () => {
      rpos.current.x += (pos.current.x - rpos.current.x) * 0.1;
      rpos.current.y += (pos.current.y - rpos.current.y) * 0.1;
      if(dot.current) dot.current.style.transform = `translate(${rpos.current.x-10}px,${rpos.current.y-10}px)`;
      af = requestAnimationFrame(loop);
    };
    loop();
    return () => { window.removeEventListener('mousemove', move); cancelAnimationFrame(af); };
  }, []);

  return (
    <div ref={dot} style={{
      position:'fixed',width:20,height:20,
      border:`1.5px solid ${T.ink}`,borderRadius:'50%',
      pointerEvents:'none',zIndex:99999,top:0,left:0,
      mixBlendMode:'difference',
      background:'rgba(28,24,20,0.06)',
      transition:'width .15s, height .15s',
    }} />
  );
}

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
      background:'rgba(28,24,20,.65)',
      backdropFilter:'blur(12px)',
      zIndex:5000,display:'flex',alignItems:'center',justifyContent:'center',
      padding:'2rem',animation:'fadeIn .2s ease',
    }}>
      <div onClick={e=>e.stopPropagation()} style={{
        background:T.bg,
        width:'100%',maxWidth:640,maxHeight:'90vh',
        overflowY:'auto',position:'relative',
        animation:'modalIn .3s ease',
        borderBottom:`3px solid ${T.ink}`,
      }}>
        <button onClick={onClose} style={{
          position:'sticky',top:0,float:'right',
          width:44,height:44,
          background:T.bg,border:'none',
          color:T.muted,fontSize:20,cursor:'none',
          display:'flex',alignItems:'center',justifyContent:'center',
          transition:'color .15s',zIndex:2,
        }}
        onMouseEnter={e=>e.currentTarget.style.color=T.ink}
        onMouseLeave={e=>e.currentTarget.style.color=T.muted}
        >×</button>
        {children}
      </div>
    </div>
  );
}

function LyricsModal({track, onClose}) {
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
    }, 160);
  },[words]);

  const stopFlow = useCallback(()=>{ clearInterval(tRef.current); setFlowing(false); setRevealed(''); },[]);
  useEffect(()=>()=>clearInterval(tRef.current),[]);

  return (
    <Modal onClose={onClose}>
      <div style={{padding:'0 2.5rem 3rem'}}>
        <div style={{paddingTop:'0.5rem',marginBottom:'2rem'}}>
          <div style={{fontSize:10,letterSpacing:'0.3em',color:T.muted,marginBottom:'0.75rem',textTransform:'uppercase'}}>
            {track.type} · {track.year} · {track.lang}
          </div>
          <h2 style={{
            fontFamily:"'Cormorant Garamond',serif",
            fontSize:'clamp(2rem,5vw,3rem)',fontWeight:300,
            color:T.ink,lineHeight:1.05,marginBottom:'0.5rem',
          }}>{track.title}</h2>
          {track.key && <div style={{fontSize:11,color:T.faint,letterSpacing:'0.1em'}}>{track.key} · {track.dur}</div>}
        </div>

        {track.desc && (
          <p style={{
            color:T.muted,lineHeight:1.8,fontSize:13,
            marginBottom:'2.5rem',
            paddingLeft:'1.25rem',
            borderLeft:`2px solid ${T.hairline}`,
          }}>{track.desc}</p>
        )}

        <div style={{marginBottom:'1.5rem',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <span style={{fontSize:9,letterSpacing:'0.3em',color:T.faint}}>LYRICS</span>
          <button
            onClick={flowing ? stopFlow : startFlow}
            style={{
              fontSize:9,letterSpacing:'0.2em',
              background:'none',border:`1px solid ${T.ink}`,
              color:T.ink,padding:'6px 16px',cursor:'none',
              transition:'all .15s',
            }}
            onMouseEnter={e=>{e.currentTarget.style.background=T.ink;e.currentTarget.style.color=T.bg;}}
            onMouseLeave={e=>{e.currentTarget.style.background='none';e.currentTarget.style.color=T.ink;}}
          >
            {flowing ? 'STOP' : 'FLOW LYRICS'}
          </button>
        </div>

        <div style={{
          fontFamily:"'Cormorant Garamond',serif",
          fontSize:'1.4rem',lineHeight:2.1,
          color: flowing ? T.ink : T.inkL,
          whiteSpace:'pre-line',
          minHeight:120,
        }}>
          {flowing ? (
            <>{revealed}<span style={{display:'inline-block',width:2,height:20,background:T.gold,animation:'blink 1s infinite',marginLeft:3,verticalAlign:'middle'}}/></>
          ) : track.lyrics}
        </div>
      </div>
    </Modal>
  );
}

function AlbumModal({album, onClose, onTrack}) {
  return (
    <Modal onClose={onClose}>
      <div style={{padding:'0.5rem 2.5rem 3rem'}}>
        <div style={{fontSize:10,letterSpacing:'0.3em',color:T.muted,marginBottom:'0.75rem',textTransform:'uppercase'}}>
          {album.type} · {album.year}
        </div>
        <h2 style={{
          fontFamily:"'Cormorant Garamond',serif",
          fontSize:'clamp(2rem,5vw,3rem)',fontWeight:300,
          color:T.ink,marginBottom:'0.5rem',lineHeight:1.05,
        }}>{album.title}</h2>
        <div style={{fontSize:11,color:T.faint,letterSpacing:'0.1em',marginBottom:'1.5rem'}}>
          {album.lang} · {album.trackCount} tracks
        </div>
        <p style={{color:T.muted,lineHeight:1.8,fontSize:13,marginBottom:'2.5rem',paddingLeft:'1.25rem',borderLeft:`2px solid ${T.hairline}`}}>
          {album.desc}
        </p>
        <div style={{fontSize:9,letterSpacing:'0.3em',color:T.faint,marginBottom:'1rem'}}>TRACKLIST</div>
        {album.tracks?.map((t,i)=>(
          <div
            key={i}
            onClick={()=>onTrack({...t,type:album.type,year:album.year,key:album.key})}
            style={{
              display:'flex',alignItems:'center',gap:'1.5rem',
              padding:'1rem 0',borderBottom:`1px solid ${T.hairline}`,
              cursor:'none',
            }}
            onMouseEnter={e=>{e.currentTarget.style.paddingLeft='8px';}}
            onMouseLeave={e=>{e.currentTarget.style.paddingLeft='0';}}
          >
            <span style={{
              fontFamily:"'Cormorant Garamond',serif",
              fontSize:'1.1rem',fontStyle:'italic',color:T.faint,
              minWidth:24,
            }}>{i+1}.</span>
            <div style={{flex:1}}>
              <div style={{
                fontFamily:"'Cormorant Garamond',serif",
                fontSize:'1.15rem',fontWeight:400,color:T.inkL,marginBottom:2,
              }}>{t.title}</div>
              {t.highlight && (
                <div style={{fontSize:11,color:T.faint,fontStyle:'italic'}}>"{t.highlight}"</div>
              )}
            </div>
            <span style={{fontSize:11,color:T.faint}}>{t.dur}</span>
          </div>
        ))}
      </div>
    </Modal>
  );
}

function Nav({page, onNav}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [{id:'home',label:'Home'},{id:'lyrics',label:'Lyrics'},{id:'about',label:'About'},{id:'contact',label:'Contact'}];

  return (
    <nav style={{
      position:'fixed',top:0,left:0,right:0,zIndex:400,
      padding:'0 3rem',height:64,
      display:'flex',alignItems:'center',justifyContent:'space-between',
      background:T.bg,
      borderBottom:`1px solid ${T.hairline}`,
    }}>
      <button onClick={()=>onNav('home')} style={{
        fontFamily:"'Cormorant Garamond',serif",
        fontSize:'1.3rem',fontStyle:'italic',fontWeight:300,
        background:'none',border:'none',color:T.ink,cursor:'none',
        letterSpacing:'0.02em',
      }}>Pulkit J.</button>

      <div style={{display:'flex',gap:'2.5rem',alignItems:'center'}}>
        {links.map(l=>(
          <button key={l.id} onClick={()=>onNav(l.id)} style={{
            fontSize:11,letterSpacing:'0.2em',textTransform:'uppercase',
            background:'none',border:'none',cursor:'none',
            color: page===l.id ? T.ink : T.muted,
            fontWeight: page===l.id ? 500 : 300,
            transition:'color .15s',
            borderBottom: page===l.id ? `1px solid ${T.ink}` : '1px solid transparent',
            paddingBottom:2,
          }}>{l.label}</button>
        ))}
      </div>
    </nav>
  );
}

function HomePage({onNav}) {
  const [lyricIdx, setLyricIdx] = useState(0);
  const snippets = [
    { text: 'Ab dil hai khali, bilkul khali', song: 'Khali' },
    { text: 'That country’s calling me back to you', song: 'Calling Me Back' },
  ];

  useEffect(()=>{
    const id = setInterval(()=>setLyricIdx(i=>(i+1)%snippets.length), 3800);
    return()=>clearInterval(id);
  },[]);

  return (
    <div style={{minHeight:'100vh',paddingTop:64,display:'flex',flexDirection:'column'}}>
      <div style={{
        flex:1,display:'flex',flexDirection:'column',
        justifyContent:'center',padding:'5rem 3rem 5rem 3rem',
        maxWidth:960,margin:'0 auto',width:'100%',
      }}>
        <div className="s1" style={{fontSize:10,letterSpacing:'0.4em',color:T.muted,marginBottom:'2rem',textTransform:'uppercase'}}>
          Singer · Songwriter · Bilingual Artist
        </div>

        <h1 className="s2" style={{
          fontFamily:"'Cormorant Garamond',serif",
          fontSize:'clamp(4.5rem,10vw,9rem)',
          fontWeight:300,lineHeight:0.9,
          color:T.ink,letterSpacing:'-0.025em',
          marginBottom:'3.5rem',
        }}>
          Making<br/>
          <em style={{fontWeight:300}}>music</em><br/>
          <span style={{color:T.gold}}>feel</span> real.
        </h1>

        <div className="s3" style={{marginBottom:'4rem',overflow:'hidden',height:52}}>
          <div key={lyricIdx} style={{animation:'fadeUp .5s ease both'}}>
            <div style={{
              fontFamily:"'Cormorant Garamond',serif",
              fontSize:'1.3rem',fontStyle:'italic',
              color:T.muted,marginBottom:4,
            }}>
              "{snippets[lyricIdx].text}"
            </div>
            <div style={{fontSize:10,letterSpacing:'0.2em',color:T.faint}}>
              — {snippets[lyricIdx].song}
            </div>
          </div>
        </div>

        <div className="s4" style={{display:'flex',gap:'1rem',flexWrap:'wrap'}}>
          <button onClick={()=>onNav('lyrics')} style={{
            padding:'12px 28px',fontSize:10,letterSpacing:'0.2em',textTransform:'uppercase',
            background:T.ink,border:`1px solid ${T.ink}`,color:T.bg,
            cursor:'none',transition:'all .15s',
          }}
          onMouseEnter={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.color=T.ink;}}
          onMouseLeave={e=>{e.currentTarget.style.background=T.ink;e.currentTarget.style.color=T.bg;}}
          >Read Lyrics</button>

          <button onClick={()=>onNav('about')} style={{
            padding:'12px 28px',fontSize:10,letterSpacing:'0.2em',textTransform:'uppercase',
            background:'transparent',border:`1px solid ${T.hairline}`,color:T.muted,
            cursor:'none',transition:'all .15s',
          }}
          onMouseEnter={e=>{e.currentTarget.style.borderColor=T.ink;e.currentTarget.style.color=T.ink;}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor=T.hairline;e.currentTarget.style.color=T.muted;}}
          >About Me</button>
        </div>
      </div>

      <div style={{
        overflow:'hidden',
        borderTop:`1px solid ${T.hairline}`,
        height:48,display:'flex',alignItems:'center',
        background:T.paper,
      }}>
        <div style={{
          display:'flex',gap:'4rem',whiteSpace:'nowrap',
          fontFamily:"'Cormorant Garamond',serif",
          fontSize:'0.9rem',fontStyle:'italic',
          color:T.faint,
          animation:'marqueeScroll 30s linear infinite',
        }}>
          {[...snippets,...snippets].map((s,i)=>(
            <span key={i}>"{s.text}"</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function LyricsPage() {
  const [active, setActive] = useState(null);
  const [activeAlbum, setActiveAlbum] = useState(null);
  const [filter, setFilter] = useState('all');

  const filtered = filter==='all' ? RELEASES : RELEASES.filter(r=>r.type===filter);

  return (
    <div style={{minHeight:'100vh',paddingTop:64}} className="page-in">
      <div style={{padding:'4rem 3rem 3rem',maxWidth:960,margin:'0 auto'}}>
        <div style={{fontSize:10,letterSpacing:'0.4em',color:T.muted,marginBottom:'0.75rem',textTransform:'uppercase'}}>
          Discography
        </div>
        <h1 style={{
          fontFamily:"'Cormorant Garamond',serif",
          fontSize:'clamp(2.5rem,6vw,4.5rem)',
          fontWeight:300,color:T.ink,lineHeight:1,
          marginBottom:'3rem',
        }}>The Lyrics</h1>

        <div style={{display:'flex',gap:'0.5rem',marginBottom:0}}>
          {[['all','All'],['single','Singles'],['ep','EPs'],['album','Albums']].map(([val,lbl])=>(
            <button key={val} onClick={()=>setFilter(val)} style={{
              padding:'5px 14px',fontSize:9,letterSpacing:'0.2em',textTransform:'uppercase',
              background:filter===val ? T.ink : 'transparent',
              border:`1px solid ${filter===val ? T.ink : T.hairline}`,
              color:filter===val ? T.bg : T.muted,
              cursor:'none',transition:'all .12s',
            }}>{lbl}</button>
          ))}
        </div>
      </div>

      <div style={{borderTop:`1px solid ${T.hairline}`}}>
        {filtered.map((r,i)=>(
          <LyricsRow
            key={r.id}
            r={r}
            index={i}
            onClick={()=>r.tracks ? setActiveAlbum(r) : setActive(r)}
          />
        ))}
      </div>

      {active && <LyricsModal track={active} onClose={()=>setActive(null)}/>}
      {activeAlbum && !active && (
        <AlbumModal album={activeAlbum} onClose={()=>setActiveAlbum(null)} onTrack={t=>setActive(t)}/>
      )}
    </div>
  );
}

function LyricsRow({r, index, onClick}) {
  const [hov, setHov] = useState(false);

  return (
    <div
      onMouseEnter={()=>setHov(true)}
      onMouseLeave={()=>setHov(false)}
      onClick={onClick}
      style={{
        borderBottom:`1px solid ${T.hairline}`,
        background: hov ? T.paper : 'transparent',
        cursor:'none',transition:'background .15s',
        maxWidth:'100%',
      }}
    >
      <div style={{
        padding:'2.5rem 3rem',
        maxWidth:960,margin:'0 auto',
        display:'grid',
        gridTemplateColumns:'1fr auto',
        gap:'2rem',alignItems:'start',
      }}>
        <div>
          <div style={{
            display:'flex',alignItems:'center',gap:'1.5rem',
            marginBottom:'0.75rem',
          }}>
            <span style={{
              fontFamily:"'Cormorant Garamond',serif",
              fontSize:'0.9rem',fontStyle:'italic',
              color:T.faint,minWidth:28,
            }}>
              {String(index+1).padStart(2,'0')}.
            </span>
            <span style={{
              fontSize:9,letterSpacing:'0.2em',textTransform:'uppercase',
              color:T.muted,
            }}>{r.type} · {r.lang}</span>
          </div>

          <h2 style={{
            fontFamily:"'Cormorant Garamond',serif",
            fontSize:'clamp(1.6rem,3vw,2.2rem)',
            fontWeight:300,color:T.ink,lineHeight:1.1,
            marginBottom:'0.75rem',
            transition:'color .15s',
          }}>{r.title}</h2>

          <div style={{
            fontFamily:"'Cormorant Garamond',serif",
            fontSize:'1.05rem',fontStyle:'italic',
            color: hov ? T.inkL : T.faint,
            transition:'color .2s',
            overflow:'hidden',
          }}>
            {hov ? (
              <span style={{animation:'fadeUp .25s ease both',display:'block'}}>
                "{r.highlight}"
              </span>
            ) : (
              <span>"{r.highlight}"</span>
            )}
          </div>
        </div>

        <div style={{
          display:'flex',flexDirection:'column',
          alignItems:'flex-end',gap:'0.5rem',
          paddingTop:'0.25rem',
        }}>
          <span style={{fontSize:11,color:T.muted}}>{r.year}</span>
          <span style={{fontSize:11,color:T.faint}}>{r.trackCount ? `${r.trackCount} tracks` : r.dur}</span>
          <span style={{
            fontSize:9,letterSpacing:'0.15em',
            color: hov ? T.ink : 'transparent',
            transition:'color .2s',
            textTransform:'uppercase',
            marginTop:'0.25rem',
          }}>
            {r.tracks ? 'View Tracklist →' : 'Read Lyrics →'}
          </span>
        </div>
      </div>
    </div>
  );
}

function AboutPage() {
  return (
    <div style={{minHeight:'100vh',paddingTop:64}} className="page-in">
      <div style={{maxWidth:960,margin:'0 auto',padding:'4rem 3rem'}}>
        <div style={{fontSize:10,letterSpacing:'0.4em',color:T.muted,marginBottom:'0.75rem',textTransform:'uppercase'}}>
          Artist
        </div>
        <h1 style={{
          fontFamily:"'Cormorant Garamond',serif",
          fontSize:'clamp(2.5rem,6vw,4.5rem)',
          fontWeight:300,color:T.ink,lineHeight:1,
          marginBottom:'4rem',
        }}>The Story</h1>

        <div style={{display:'grid',gridTemplateColumns:'3fr 2fr',gap:'5rem',alignItems:'start'}}>
          <div>
            <blockquote style={{
              fontFamily:"'Cormorant Garamond',serif",
              fontSize:'clamp(1.4rem,2.5vw,2rem)',
              fontWeight:300,fontStyle:'italic',
              lineHeight:1.4,color:T.ink,
              marginBottom:'3rem',
              paddingLeft:'1.5rem',
              borderLeft:`2px solid ${T.gold}`,
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

          <div>
            <div style={{marginBottom:'3rem'}}>
              {[
                {v:'2', l:'Languages spoken in song'},
                {v:'6+', l:'Releases to date'},
                {v:'Pop & R&B', l:'Primary genres'},
                {v:'2024–', l:'Active since'},
              ].map(s=>(
                <div key={s.l} style={{padding:'1.5rem 0',borderBottom:`1px solid ${T.hairline}`}}>
                  <div style={{
                    fontFamily:"'Cormorant Garamond',serif",
                    fontSize:'2rem',fontWeight:300,color:T.ink,lineHeight:1,marginBottom:4,
                  }}>{s.v}</div>
                  <div style={{fontSize:11,color:T.muted}}>{s.l}</div>
                </div>
              ))}
            </div>

            <div>
              <div style={{fontSize:9,letterSpacing:'0.3em',color:T.faint,marginBottom:'1.25rem',textTransform:'uppercase'}}>Craft</div>
              {[
                {n:'Songwriting', d:'Bilingual lyricism with emotional precision'},
                {n:'Vocals', d:'Expressive across Pop, R&B & Hindustani traditions'},
                {n:'Production', d:'Layered textures, cinematic sound design'},
                {n:'Mixing', d:'Polished mixes that serve the song first'},
              ].map(s=>(
                <div key={s.n} style={{padding:'0.75rem 0',borderBottom:`1px solid ${T.hairline}`}}>
                  <div style={{fontSize:12,color:T.inkL,marginBottom:3}}>{s.n}</div>
                  <div style={{fontSize:11,color:T.muted,lineHeight:1.6}}>{s.d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{
          marginTop:'5rem',paddingTop:'2rem',
          borderTop:`1px solid ${T.hairline}`,
          display:'flex',gap:'2rem',flexWrap:'wrap',
        }}>
          {['Singer','Songwriter','Producer','Developer','Bilingual','Artist'].map((tag,i,arr)=>(
            <span key={i} style={{
              fontFamily:"'Cormorant Garamond',serif",
              fontSize:'1.1rem',fontStyle:'italic',color:T.faint,
            }}>{tag}{i<arr.length-1 ? ' ·' : ''}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function ContactPage() {
  const [form, setForm] = useState({name:'',email:'',type:'Collaboration',message:''});
  const [focus, setFocus] = useState(null);
  const [sent, setSent] = useState(false);

  const submit = useCallback(e=>{
    e.preventDefault();
    if(!form.name||!form.email||!form.message) return;
    setSent(true);
    setTimeout(()=>setSent(false),5000);
    setForm({name:'',email:'',type:'Collaboration',message:''});
  },[form]);

  const field = (label,key,type='text',placeholder='') => (
    <div>
      <label style={{
        display:'block',fontSize:9,letterSpacing:'0.25em',textTransform:'uppercase',
        color:focus===key ? T.ink : T.muted,marginBottom:8,transition:'color .15s',
      }}>{label}</label>
      {type==='textarea' ? (
        <textarea
          rows={5}
          value={form[key]}
          placeholder={placeholder}
          onFocus={()=>setFocus(key)}
          onBlur={()=>setFocus(null)}
          onChange={e=>setForm(f=>({...f,[key]:e.target.value}))}
          style={{
            width:'100%',padding:'12px 14px',fontSize:13,
            background:'transparent',
            border:`1px solid ${focus===key ? T.ink : T.hairline}`,
            borderBottom:`2px solid ${focus===key ? T.ink : T.hairline}`,
            color:T.ink,outline:'none',resize:'vertical',
            fontFamily:'inherit',transition:'border .15s',
          }}
        />
      ) : (
        <input
          type={type}
          value={form[key]}
          placeholder={placeholder}
          onFocus={()=>setFocus(key)}
          onBlur={()=>setFocus(null)}
          onChange={e=>setForm(f=>({...f,[key]:e.target.value}))}
          style={{
            width:'100%',padding:'12px 14px',fontSize:13,
            background:'transparent',
            border:`1px solid ${focus===key ? T.ink : T.hairline}`,
            borderBottom:`2px solid ${focus===key ? T.ink : T.hairline}`,
            color:T.ink,outline:'none',
            fontFamily:'inherit',transition:'border .15s',
          }}
        />
      )}
    </div>
  );

  return (
    <div style={{minHeight:'100vh',paddingTop:64}} className="page-in">
      <div style={{maxWidth:960,margin:'0 auto',padding:'4rem 3rem'}}>
        <div style={{fontSize:10,letterSpacing:'0.4em',color:T.muted,marginBottom:'0.75rem',textTransform:'uppercase'}}>
          Studio Sessions
        </div>
        <h1 style={{
          fontFamily:"'Cormorant Garamond',serif",
          fontSize:'clamp(2.5rem,6vw,4.5rem)',
          fontWeight:300,color:T.ink,lineHeight:1,
          marginBottom:'4rem',
        }}>Get in Touch</h1>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1.4fr',gap:'5rem',alignItems:'start'}}>
          <div>
            <p style={{color:T.muted,lineHeight:1.9,fontSize:14,marginBottom:'3rem'}}>
              Interested in collaborations, live sessions, or just want to talk music and code? The studio is always open.
            </p>

            <div style={{display:'flex',alignItems:'center',gap:'0.75rem',marginBottom:'3rem'}}>
              <div style={{width:7,height:7,borderRadius:'50%',background:'#22c55e'}}/>
              <span style={{fontSize:12,color:T.muted}}>Open to collaborations</span>
            </div>

            <div style={{fontSize:9,letterSpacing:'0.3em',color:T.faint,marginBottom:'1.25rem',textTransform:'uppercase'}}>Find Me</div>
            {[
              {label:'Email', val:'contact@pulkitj.com', href:'mailto:contact@pulkitj.com'},
              {label:'Instagram', val:'@pulkitj', href:'https://instagram.com'},
            ].map((s,i)=>(
              <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" style={{
                display:'flex',alignItems:'center',justifyContent:'space-between',
                padding:'1rem 0',borderBottom:`1px solid ${T.hairline}`,
                color:T.inkL,textDecoration:'none',transition:'padding .15s',
              }}
              onMouseEnter={e=>e.currentTarget.style.paddingLeft='8px'}
              onMouseLeave={e=>e.currentTarget.style.paddingLeft='0'}
              >
                <div>
                  <div style={{fontSize:12,fontWeight:500,marginBottom:2}}>{s.label}</div>
                  <div style={{fontSize:11,color:T.muted}}>{s.val}</div>
                </div>
                <span style={{color:T.faint,fontSize:12}}>→</span>
              </a>
            ))}
          </div>

          <div>
            {sent ? (
              <div style={{
                padding:'4rem 2rem',textAlign:'center',
                border:`1px solid ${T.hairline}`,
                animation:'fadeUp .4s ease',
              }}>
                <div style={{
                  fontFamily:"'Cormorant Garamond',serif",
                  fontSize:'3rem',color:T.gold,marginBottom:'1rem',
                }}>♫</div>
                <h3 style={{
                  fontFamily:"'Cormorant Garamond',serif",
                  fontSize:'2rem',fontWeight:300,color:T.ink,marginBottom:'0.5rem',
                }}>Message sent.</h3>
                <p style={{fontSize:12,color:T.muted}}>I'll be in touch soon.</p>
              </div>
            ) : (
              <form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:'1.75rem'}}>
                {field('Your Name','name','text','What should I call you?')}
                {field('Email Address','email','email','your@email.com')}

                <div>
                  <div style={{fontSize:9,letterSpacing:'0.25em',textTransform:'uppercase',color:T.muted,marginBottom:10}}>
                    Session Type
                  </div>
                  <div style={{display:'flex',gap:'0.5rem',flexWrap:'wrap'}}>
                    {['Collaboration','Booking','Production','Just Saying Hi'].map(t=>(
                      <button key={t} type="button" onClick={()=>setForm(f=>({...f,type:t}))} style={{
                        padding:'6px 14px',fontSize:9,letterSpacing:'0.12em',cursor:'none',
                        background: form.type===t ? T.ink : 'transparent',
                        border:`1px solid ${form.type===t ? T.ink : T.hairline}`,
                        color: form.type===t ? T.bg : T.muted,
                        transition:'all .12s',
                      }}>{t}</button>
                    ))}
                  </div>
                </div>

                {field('Your Message','message','textarea','Tell me about your project...')}

                <button type="submit" style={{
                  padding:'13px 28px',background:T.ink,border:`1px solid ${T.ink}`,
                  color:T.bg,fontSize:10,letterSpacing:'0.25em',textTransform:'uppercase',
                  cursor:'none',transition:'all .15s',alignSelf:'flex-start',
                }}
                onMouseEnter={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.color=T.ink;}}
                onMouseLeave={e=>{e.currentTarget.style.background=T.ink;e.currentTarget.style.color=T.bg;}}
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Footer({onNav}) {
  return (
    <footer style={{
      borderTop:`1px solid ${T.hairline}`,
      padding:'2rem 3rem',
      display:'flex',alignItems:'center',justifyContent:'space-between',
      background:T.paper,
    }}>
      <span style={{fontSize:10,letterSpacing:'0.2em',color:T.faint,textTransform:'uppercase'}}>
        Pulkit J © 2025
      </span>
      <button onClick={()=>onNav('lyrics')} style={{
        fontFamily:"'Cormorant Garamond',serif",
        fontStyle:'italic',fontSize:'1rem',
        color:T.muted,background:'none',border:'none',cursor:'none',
        transition:'color .15s',
      }}
      onMouseEnter={e=>e.currentTarget.style.color=T.ink}
      onMouseLeave={e=>e.currentTarget.style.color=T.muted}
      >Read the lyrics →</button>
      <span style={{fontSize:10,letterSpacing:'0.2em',color:T.faint,textTransform:'uppercase'}}>
        Bilingual Artist
      </span>
    </footer>
  );
}

export default function App() {
  const [page, setPage] = useState('home');

  useEffect(()=>{
    const style = document.createElement('style');
    style.textContent = FONTS + GLOBAL_CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  },[]);

  const navigate = useCallback(p=>{
    setPage(p);
    window.scrollTo({top:0,behavior:'smooth'});
  },[]);

  return (
    <div style={{minHeight:'100vh',background:T.bg,position:'relative'}}>
      <Cursor/>
      <Nav page={page} onNav={navigate}/>
      <main>
        {page==='home'    && <HomePage onNav={navigate}/>}
        {page==='lyrics'  && <LyricsPage/>}
        {page==='about'   && <AboutPage/>}
        {page==='contact' && <ContactPage/>}
      </main>
      <Footer onNav={navigate}/>
    </div>
  );
}