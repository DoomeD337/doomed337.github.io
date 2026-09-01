
const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
const money=n=>new Intl.NumberFormat('ru-RU').format(Number(n)||0)+' ₽';
function toast(msg){let t=$('#toast');if(!t){t=document.createElement('div');t.className='toast';t.id='toast';document.body.appendChild(t)}t.textContent=msg;t.classList.add('show');clearTimeout(window.__toast);window.__toast=setTimeout(()=>t.classList.remove('show'),1900)}
function themeInit(){const saved=localStorage.getItem('vr_theme');const pref=matchMedia('(prefers-color-scheme:light)').matches?'light':'dark';document.documentElement.dataset.theme=saved||pref;$('#themeBtn')?.addEventListener('click',()=>{const next=document.documentElement.dataset.theme==='light'?'dark':'light';document.documentElement.dataset.theme=next;localStorage.setItem('vr_theme',next);toast(next==='light'?'Светлая тема':'Тёмная тема')})}
function authUI(){if(window.VRAuth?.isAdmin())document.body.classList.add('is-admin');$('#accountBtn')?.addEventListener('click',()=>location.href=window.VRAuth?.isAdmin()?'admin.html':'login.html')}
function nav(){const menu=$('#menuBtn'),mobile=$('#mobileNav');menu?.addEventListener('click',()=>mobile.classList.toggle('open'));const cartBtn=$('#cartBtn'),drawer=$('#cartDrawer'),overlay=$('#overlay'),close=$('#cartClose');const toggleCart=open=>{drawer?.classList.toggle('open',open);overlay?.classList.toggle('show',open);if(open)renderCart()};cartBtn?.addEventListener('click',()=>toggleCart(true));close?.addEventListener('click',()=>toggleCart(false));overlay?.addEventListener('click',()=>toggleCart(false))}
function productFallback(id){return /^vr-00[1-8]$/.test(id||'')?`assets/images/${id}.svg`:'assets/product-placeholder.svg'}
function defaultHeroObjectSrc(){return document.documentElement.dataset.theme==='light'?'assets/hero-object-light.png':'assets/hero-object-dark.png'}
async function hydrateProductMedia(root=document){
  if(!window.VRMedia)return;
  const nodes=$$('img[data-product-media]',root);
  await Promise.all(nodes.map(async im=>{
    try{
      const rows=await window.VRMedia.get(im.dataset.productMedia);
      if(rows[0]){
        if(im.dataset.vrObjectUrl)URL.revokeObjectURL(im.dataset.vrObjectUrl);
        const url=window.VRMedia.objectURL(rows[0]);
        im.src=url;im.dataset.vrObjectUrl=url;
      }
    }catch(e){}
  }));
}
function getCart(){return JSON.parse(localStorage.getItem('vr_cart')||'[]')}function saveCart(c){localStorage.setItem('vr_cart',JSON.stringify(c));updateCartCount()}function addCart(id,size='M'){const p=(window.VR_PRODUCTS||[]).find(x=>x.id===id);if(p&&p.stock===0){toast('Нет в наличии');return}const c=getCart(),found=c.find(x=>x.id===id&&x.size===size);if(found)found.qty++;else c.push({id,size,qty:1});saveCart(c);renderCart();$('#cartDrawer')?.classList.add('open');$('#overlay')?.classList.add('show')}function removeCart(idx){const c=getCart();c.splice(idx,1);saveCart(c);renderCart()}function updateCartCount(){const n=getCart().reduce((a,b)=>a+b.qty,0);const el=$('#cartCount');if(el)el.textContent=n}
function renderCart(){
  const box=$('#cartItems'),total=$('#cartTotal');if(!box)return;
  const c=getCart(),ps=window.VR_PRODUCTS||[];
  if(!c.length){box.innerHTML='<p style="color:var(--muted)">Корзина пока пустая.</p>';total.textContent='0 ₽';return}
  let sum=0;
  box.innerHTML=c.map((x,i)=>{const p=ps.find(p=>p.id===x.id);if(!p)return'';sum+=p.price*x.qty;return `<div class="cart-item"><img src="${productFallback(p.id)}" data-product-media="${p.id}" alt="${p.name}"><div><h4>${p.name}</h4><small>${x.size} · ${x.qty} шт. · ${money(p.price*x.qty)}</small></div><button class="cart-remove" onclick="removeCart(${i})">×</button></div>`}).join('');
  total.textContent=money(sum);hydrateProductMedia(box);
}
function reveals(){
  // Admin is a work surface: no decorative reveal/glitch animation there.
  if($('#adminRoot')){
    $$('.reveal').forEach(el=>el.classList.add('visible'));
    return;
  }
  const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
  const glitchSelectors='.section-head,.product-card,.brand-mark-panel,.brand-copy,.editorial .card,.info-box,.auth-card,.product-detail,.page-hero,.footer-brand';
  $$(glitchSelectors).forEach(el=>{
    el.classList.add('glitch-block');
    if(!el.dataset.glitchReady){
      el.dataset.glitchReady='1';
      if(!reduced){
        el.addEventListener('pointerenter',()=>{el.classList.remove('glitch-hover');void el.offsetWidth;el.classList.add('glitch-hover');setTimeout(()=>el.classList.remove('glitch-hover'),520)});
      }
    }
  });
  $$('.section-title,.page-title,.card h3,.quote,.product-detail h1,.auth-card h1').forEach(el=>el.classList.add('glitch-heading'));
  if(!window.__vrRevealIO){
    window.__vrRevealIO=new IntersectionObserver(es=>es.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('visible');
        if(!reduced && e.target.classList.contains('glitch-block') && !e.target.dataset.glitchedIn){
          e.target.dataset.glitchedIn='1';
          e.target.classList.add('glitch-burst');
          setTimeout(()=>e.target.classList.remove('glitch-burst'),760);
        }
      }
    }),{threshold:.1});
  }
  $$('.reveal').forEach(el=>{if(!el.dataset.revealBound){el.dataset.revealBound='1';window.__vrRevealIO.observe(el)}});
  if(!reduced && !window.__vrAmbientGlitch){
    window.__vrAmbientGlitch=setInterval(()=>{
      if(document.hidden)return;
      const pool=$$('.glitch-block.visible,[data-glitch-ready="1"]').filter(el=>{const r=el.getBoundingClientRect();return r.bottom>0&&r.top<innerHeight&&r.width>0&&r.height>0});
      if(!pool.length)return;
      const el=pool[Math.floor(Math.random()*pool.length)];
      el.classList.remove('glitch-idle');void el.offsetWidth;el.classList.add('glitch-idle');
      setTimeout(()=>el.classList.remove('glitch-idle'),420);
    },4700);
  }
}
function cursor(){const d=$('.cursor-dot');if(!d||matchMedia('(pointer:coarse)').matches)return;addEventListener('mousemove',e=>{d.style.left=e.clientX+'px';d.style.top=e.clientY+'px'})}
function renderProductCards(target,items){
  const el=$(target);if(!el)return;items=items.filter(p=>p.visible!==false);
  el.innerHTML=items.map(p=>`<article class="product-card reveal"><a href="product.html?id=${p.id}" class="product-image"><img src="${productFallback(p.id)}" data-product-media="${p.id}" alt="${p.name}">${p.tag?`<span class="product-tag">${p.tag}</span>`:''}</a><button class="quick-add" aria-label="Добавить в корзину" onclick="addCart('${p.id}')">+</button><a href="product.html?id=${p.id}" class="product-info"><span class="product-name">${p.name}</span><span class="product-price">${money(p.price)}</span></a></article>`).join('');
  hydrateProductMedia(el);reveals();
}
function initCatalog(){if(!$('#catalogGrid'))return;const ps=(window.VR_PRODUCTS||[]).filter(p=>p.visible!==false);let cat='Все',sort='featured';const draw=()=>{let a=cat==='Все'?[...ps]:ps.filter(p=>p.category===cat);if(sort==='price-asc')a.sort((x,y)=>x.price-y.price);if(sort==='price-desc')a.sort((x,y)=>y.price-x.price);renderProductCards('#catalogGrid',a);$('#catalogCount').textContent=a.length+' позиций'};$$('.chip').forEach(b=>b.addEventListener('click',()=>{$$('.chip').forEach(x=>x.classList.remove('active'));b.classList.add('active');cat=b.dataset.cat;draw()}));$('#sortSelect')?.addEventListener('change',e=>{sort=e.target.value;draw()});draw()}
function initHome(){if($('#homeProducts'))renderProductCards('#homeProducts',(window.VR_PRODUCTS||[]).filter(p=>p.visible!==false).slice(0,4))}
async function initProduct(){
  const host=$('#productHost');if(!host)return;
  const id=new URLSearchParams(location.search).get('id')||'vr-001';
  const p=(window.VR_PRODUCTS||[]).find(x=>x.id===id)||(window.VR_PRODUCTS||[])[0];
  if(!p){host.innerHTML='<p>Товар не найден.</p>';return}
  host.innerHTML=`<div class="product-layout"><div class="product-gallery" id="productGallery"><img class="wide" src="${productFallback(p.id)}" data-product-media="${p.id}" alt="${p.name}"><img src="${productFallback(p.id)}" data-product-media="${p.id}" alt="${p.name}"><img src="${productFallback(p.id)}" data-product-media="${p.id}" alt="${p.name}"></div><div class="product-detail"><div class="eyebrow">${p.category} ${p.tag?'· '+p.tag:''}</div><h1>${p.name}</h1><div class="price">${money(p.price)}</div><p>${p.desc}</p><div class="micro" style="margin-top:26px">Размер</div><div class="sizes">${['S','M','L','XL'].map((s,i)=>`<button class="size-btn ${i===1?'active':''}" data-size="${s}">${s}</button>`).join('')}</div><button class="btn" id="productAdd" ${p.stock===0?'disabled':''}>${p.stock===0?'Нет в наличии':'Добавить в корзину'}</button><div class="detail-list"><div class="detail-row"><span>Состав</span><span>Хлопок</span></div><div class="detail-row"><span>Посадка</span><span>Oversize</span></div><div class="detail-row"><span>Остаток</span><span>${p.stock??'—'} шт.</span></div><div class="detail-row"><span>Фото</span><span id="productPhotoCount">—</span></div><div class="detail-row"><span>Уход</span><span>30° / наизнанку</span></div></div></div></div>`;
  let size='M';$$('.size-btn',host).forEach(b=>b.addEventListener('click',()=>{$$('.size-btn',host).forEach(x=>x.classList.remove('active'));b.classList.add('active');size=b.dataset.size}));$('#productAdd')?.addEventListener('click',()=>addCart(p.id,size));
  try{
    const rows=window.VRMedia?await window.VRMedia.get(p.id):[];
    const gallery=$('#productGallery');
    if(rows.length&&gallery){
      gallery.innerHTML=rows.map((r,i)=>{const url=window.VRMedia.objectURL(r);return `<img class="${i===0?'wide':''}" src="${url}" alt="${p.name} — фото ${i+1}">`}).join('');
      $('#productPhotoCount').textContent=rows.length+' шт.';
    }else{
      $('#productPhotoCount').textContent='demo';
      hydrateProductMedia(gallery||host);
    }
  }catch(e){$('#productPhotoCount').textContent='—'}
}
function intro(){const x=$('#pageIntro');if(!x)return;if(sessionStorage.getItem('vr_intro_seen')){x.remove();return}sessionStorage.setItem('vr_intro_seen','1');setTimeout(()=>x.classList.add('leave'),800);setTimeout(()=>x.classList.add('gone'),1650)}
async function initTee(){
  const hero=$('#heroExperiment'),stage=$('#teeStage'),obj=$('#teeObject'),canvas=$('#pulseCanvas'),stack=$('#teeGlitchStack');
  if(!stage||!obj)return;
  const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
  const face=$('#heroObjectFace',obj)||$('.hero-object-face',obj);
  const signalProgress=$('#signalProgress'),signalStatus=$('#signalStatus'),signalLabel=$('#signalLabel'),micro=$('#heroMicrocopy');
  const heroUrls=[];
  let objectSrc=defaultHeroObjectSrc();
  let hasCustomObject=false;
  const defaultCfg={type:'monogram',scale:100,offsetY:0,rotateY:0,shadow:70,glow:20,speed:100};
  const readCfg=()=>{try{return {...defaultCfg,...JSON.parse(localStorage.getItem('vr_hero_object_settings')||'{}')}}catch(e){return {...defaultCfg}}};
  const cfg=readCfg();
  if(window.VRMedia){
    try{
      const rec=await window.VRMedia.heroGet('object');
      if(rec?.blob){objectSrc=window.VRMedia.objectURL(rec);heroUrls.push(objectSrc);hasCustomObject=true}
    }catch(e){console.warn('Hero object media unavailable',e)}
  }
  const applyObjectSrc=src=>{$$('.hero-object-face,.hero-object-depth',obj).forEach(im=>im.src=src)};
  const rebuildSlices=src=>{if(!stack)return;stack.innerHTML='';for(let i=0;i<14;i++){const im=document.createElement('img');im.className='glitch-slice';im.src=src;im.alt='';const top=i*7.05,bottom=Math.max(0,100-(top+8.6));im.style.clipPath=`inset(${top}% 0 ${bottom}% 0)`;stack.appendChild(im)}};
  applyObjectSrc(objectSrc);
  addEventListener('beforeunload',()=>heroUrls.forEach(u=>URL.revokeObjectURL(u)),{once:true});
  obj.style.setProperty('--hero-shadow',String((cfg.shadow??70)/100));
  obj.style.setProperty('--hero-glow',String((cfg.glow??20)/100));

  let tx=3,ty=-8,cx=3,cy=-8,pointer={x:.5,y:.5};
  let intensity=0,targetIntensity=0,lastGlitch=0;
  let autoActive=false,autoStart=0,autoDuration=3500,autoPeak=.62,autoTimer=0;
  rebuildSlices(objectSrc);
  let slices=stack?[...stack.children]:[];
  const syncDefaultHeroTheme=()=>{if(hasCustomObject)return;const next=defaultHeroObjectSrc();if(next===objectSrc)return;objectSrc=next;applyObjectSrc(objectSrc);rebuildSlices(objectSrc);slices=stack?[...stack.children]:[]};
  new MutationObserver(syncDefaultHeroTheme).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});

  const setPointer=(x,y)=>{const r=stage.getBoundingClientRect();pointer.x=Math.max(0,Math.min(1,(x-r.left)/r.width));pointer.y=Math.max(0,Math.min(1,(y-r.top)/r.height));tx=(pointer.y-.5)*-7;ty=(pointer.x-.5)*12-6};
  stage.addEventListener('pointermove',e=>setPointer(e.clientX,e.clientY),{passive:true});
  stage.addEventListener('pointerleave',()=>{pointer={x:.5,y:.5};tx=3;ty=-8});

  const scheduleAuto=(first=false)=>{
    if(reduced)return;
    clearTimeout(autoTimer);
    const delay=first?1500:2600+Math.random()*1400;
    autoTimer=setTimeout(()=>{if(document.hidden){scheduleAuto(false);return}startAuto()},delay);
  };
  const startAuto=()=>{
    if(reduced||autoActive)return;
    autoActive=true;autoStart=performance.now();autoDuration=3000+Math.random()*700;autoPeak=.82+Math.random()*.12;
    hero?.classList.add('is-auto');
    if(signalLabel)signalLabel.textContent='AUTO OBJECT / ACTIVE';
    if(micro)micro.textContent='AUTONOMOUS / MONOGRAM FLOW';
  };
  const stopAuto=()=>{
    autoActive=false;targetIntensity=0;hero?.classList.remove('is-auto');
    if(signalLabel)signalLabel.textContent='AUTO OBJECT / ON';
    if(signalStatus)signalStatus.textContent='GLITCH CYCLE / IDLE';
    if(micro)micro.textContent='AUTONOMOUS / MONOGRAM SIGNAL';
    scheduleAuto(false);
  };
  const smoothstep=t=>t*t*(3-2*t);
  function autoEnvelope(now){
    if(!autoActive)return 0;
    const t=Math.min(1,(now-autoStart)/autoDuration);
    const rise=smoothstep(Math.min(1,t/.28));
    const fall=1-smoothstep(Math.max(0,(t-.62)/.38));
    const pulse=.92+.08*Math.sin(t*Math.PI*4.0);
    const e=Math.max(0,Math.min(1,rise*fall*autoPeak*pulse));
    if(t>=1){stopAuto();return 0}
    return e;
  }
  scheduleAuto(true);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){clearTimeout(autoTimer);autoActive=false;hero?.classList.remove('is-auto')}else scheduleAuto(true)});

  function animateObject(nowRaw){
    const speedMul=(cfg.speed??100)/100;
    const now=nowRaw*speedMul;
    const auto=autoEnvelope(nowRaw);
    targetIntensity=auto;
    intensity+=(targetIntensity-intensity)*.092;
    hero?.style.setProperty('--glitch',intensity.toFixed(3));
    hero?.classList.toggle('is-distorting',intensity>.035);
    const cycle=autoActive?Math.min(1,(nowRaw-autoStart)/autoDuration):0;
    if(signalProgress)signalProgress.style.width=(cycle*100).toFixed(1)+'%';
    if(signalStatus)signalStatus.textContent=autoActive?`GLITCH CYCLE / ${String(Math.round(cycle*100)).padStart(2,'0')}%`:'GLITCH CYCLE / IDLE';

    cx+=(tx-cx)*.035;cy+=(ty-cy)*.035;
    const floatY=Math.sin(now/1280)*4.4+Math.sin(now/2600)*2.2;
    const driftY=Math.sin(now/4200)*4.6;
    const signalX=Math.sin(now/215)*intensity*5.8+Math.sin(now/470)*intensity*2.4;
    const signalY=Math.cos(now/285)*intensity*2.2;
    const rotX=cx+Math.sin(now/1600)*1.1+intensity*Math.sin(now/330)*2.1;
    const rotY=(cfg.rotateY??0)+cy+driftY+intensity*Math.sin(now/405)*5.4;
    const baseScale=(cfg.scale??100)/100;
    const offsetY=(cfg.offsetY??0);
    obj.style.transform=`translate3d(${signalX}px,${signalY+floatY+offsetY}px,0) rotateX(${rotX}deg) rotateY(${rotY}deg) skewX(${intensity*Math.sin(now/570)*.68}deg) scale(${baseScale*(1+intensity*.013)})`;

    if(intensity>.035 && now-lastGlitch>58){
      lastGlitch=now;
      slices.forEach((s,i)=>{
        const phase=now/170+i*1.37;
        const amp=intensity*(i%4===0?34:(i%2===0?22:14));
        s.style.transform=`translateX(${Math.sin(phase)*amp}px) scaleX(${1+Math.sin(phase*.63)*intensity*.035})`;
        s.style.opacity=String(.06+intensity*(.28+.25*(.5+.5*Math.sin(phase*.8))));
      });
    }else if(intensity<.025){slices.forEach(s=>{s.style.transform='translateX(0)';s.style.opacity='0'})}
  }

  if(canvas && !reduced){
    const ctx=canvas.getContext('2d',{alpha:true});let W=0,H=0,dpr=1,pts=[];
    const resize=()=>{dpr=Math.min(devicePixelRatio||1,1.6);W=innerWidth;H=innerHeight;canvas.width=Math.round(W*dpr);canvas.height=Math.round(H*dpr);canvas.style.width=W+'px';canvas.style.height=H+'px';ctx.setTransform(dpr,0,0,dpr,0,0);const n=W<760?44:92;pts=Array.from({length:n},(_,i)=>({a:Math.random()*Math.PI*2,r:.12+Math.random()*.42,s:(.00005+Math.random()*.00013)*(i%2?1:-1),z:Math.random(),p:Math.random()*6.28}))};
    resize();addEventListener('resize',resize,{passive:true});
    const draw=nowRaw=>{const speedMul=(cfg.speed??100)/100;const now=nowRaw*speedMul;const light=document.documentElement.dataset.theme==='light';const fg=light?'11,11,11':'245,245,243';ctx.clearRect(0,0,W,H);const ox=(pointer.x-.5)*W*.025,oy=(pointer.y-.5)*H*.025,cx0=W*.5+ox,cy0=H*.49+oy,min=Math.min(W,H);ctx.save();ctx.translate(cx0,cy0);ctx.lineWidth=1;
      for(let k=0;k<7;k++){const rr=min*(.13+k*.061)*(1+Math.sin(now*.00025+k)*.009);ctx.beginPath();ctx.strokeStyle=`rgba(${fg},${.042+k*.008+intensity*.04})`;const sides=6+k*2;for(let i=0;i<=sides;i++){let a=i/sides*Math.PI*2+now*(k%2?-.000012:.00001);let jitter=intensity*Math.sin(a*5+now*.006)*min*.0027;let x=Math.cos(a)*(rr+jitter),y=Math.sin(a)*(rr+jitter);i?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.stroke()}
      pts.forEach((p,i)=>{p.a+=p.s*(1+intensity*4);const rr=min*p.r*(1+Math.sin(now*.0005+p.p)*.025);let x=Math.cos(p.a)*rr,y=Math.sin(p.a)*rr*.74;const sz=.45+p.z*1.35+intensity*.55;ctx.fillStyle=`rgba(${fg},${.13+p.z*.22+intensity*.13})`;ctx.fillRect(x,y,sz,sz);if(i%8===0){ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x*.74,y*.74);ctx.strokeStyle=`rgba(${fg},${.028+intensity*.055})`;ctx.stroke()}});ctx.restore();
      if(intensity>.055){for(let i=0;i<9;i++){const y=(now*.022+i*H*.247)%H;const h=.9+intensity*4.8;const x=(.5+.5*Math.sin(now*.0009+i*1.9))*W*.55;const w=W*(.10+.22*(.5+.5*Math.sin(now*.0014+i)));ctx.fillStyle=`rgba(${fg},${.022+intensity*.085})`;ctx.fillRect(x,y,w,h)}}
    };
    const loopCanvas=now=>{draw(now);requestAnimationFrame(loopCanvas)};requestAnimationFrame(loopCanvas)
  }
  function frame(now){animateObject(now);requestAnimationFrame(frame)}requestAnimationFrame(frame)
}
function initInstagramGallery(){
  const rail=$('#socialRail'),box=$('#igLightbox'),img=$('#igLightboxImage');
  if(!rail||!box||!img)return;
  const shots=$$('.social-shot',rail),srcs=shots.map(s=>s.querySelector('img')?.getAttribute('src')).filter(Boolean),progress=$('#socialProgress');
  const prevBtn=$('#socialPrev'),nextBtn=$('#socialNext');
  let current=0,drag=false,startX=0,startScroll=0,moved=false,lastDragAt=0;

  const maxScroll=()=>Math.max(0,rail.scrollWidth-rail.clientWidth);
  const updateProgress=()=>{
    const max=maxScroll(), v=max ? Math.max(.035,Math.min(1,rail.scrollLeft/max)) : 1;
    progress?.parentElement?.style.setProperty('--ig-progress',v);
    if(prevBtn)prevBtn.disabled=rail.scrollLeft<=2;
    if(nextBtn)nextBtn.disabled=rail.scrollLeft>=max-2;
  };
  const step=()=>Math.max(280,Math.min(rail.clientWidth*.72,620));
  const scrollGallery=dir=>rail.scrollBy({left:dir*step(),behavior:'smooth'});

  rail.addEventListener('scroll',updateProgress,{passive:true});
  addEventListener('resize',updateProgress);
  requestAnimationFrame(updateProgress);
  setTimeout(updateProgress,250);

  prevBtn?.addEventListener('click',()=>scrollGallery(-1));
  nextBtn?.addEventListener('click',()=>scrollGallery(1));

  // Wheel / trackpad: vertical wheel movement moves the horizontal rail when hovered.
  rail.addEventListener('wheel',e=>{
    if(maxScroll()<=0)return;
    const dominant=Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY;
    if(!dominant)return;
    const before=rail.scrollLeft;
    rail.scrollLeft+=dominant*.9;
    if(rail.scrollLeft!==before)e.preventDefault();
  },{passive:false});

  rail.addEventListener('pointerdown',e=>{
    if(e.pointerType==='mouse' && e.button!==0)return;
    drag=true;moved=false;startX=e.clientX;startScroll=rail.scrollLeft;
    rail.classList.add('is-dragging');
    rail.setPointerCapture?.(e.pointerId);
  });
  rail.addEventListener('pointermove',e=>{
    if(!drag)return;
    const dx=e.clientX-startX;
    if(Math.abs(dx)>5)moved=true;
    rail.scrollLeft=startScroll-dx*1.2;
  });
  const end=e=>{
    if(!drag)return;
    if(moved)lastDragAt=performance.now();
    drag=false;
    rail.classList.remove('is-dragging');
    try{if(e?.pointerId!=null && rail.hasPointerCapture?.(e.pointerId))rail.releasePointerCapture(e.pointerId)}catch(_){}
  };
  rail.addEventListener('pointerup',end);
  rail.addEventListener('pointercancel',end);
  rail.addEventListener('lostpointercapture',end);

  const render=()=>{
    img.style.opacity='.1';img.src=srcs[current];
    $('#igLightboxCount').textContent=String(current+1).padStart(2,'0')+' / '+String(srcs.length).padStart(2,'0');
    requestAnimationFrame(()=>{img.style.opacity='1';img.style.animation='none';void img.offsetWidth;img.style.animation=''});
  };
  const open=i=>{current=i;render();box.classList.add('open');box.setAttribute('aria-hidden','false');document.body.style.overflow='hidden'};
  const close=()=>{box.classList.remove('open');box.setAttribute('aria-hidden','true');document.body.style.overflow=''};

  shots.forEach((s,i)=>s.addEventListener('click',e=>{
    if(moved || performance.now()-lastDragAt<180){e.preventDefault();return}
    open(i);
  }));
  $('#igLightboxClose')?.addEventListener('click',close);
  $('#igPrev')?.addEventListener('click',()=>{current=(current-1+srcs.length)%srcs.length;render()});
  $('#igNext')?.addEventListener('click',()=>{current=(current+1)%srcs.length;render()});
  box.addEventListener('click',e=>{if(e.target===box)close()});
  addEventListener('keydown',e=>{
    if(box.classList.contains('open')){
      if(e.key==='Escape')close();
      if(e.key==='ArrowLeft'){current=(current-1+srcs.length)%srcs.length;render()}
      if(e.key==='ArrowRight'){current=(current+1)%srcs.length;render()}
    }else if(document.activeElement===rail){
      if(e.key==='ArrowLeft'){e.preventDefault();scrollGallery(-1)}
      if(e.key==='ArrowRight'){e.preventDefault();scrollGallery(1)}
    }
  });

  if(!matchMedia('(prefers-reduced-motion:reduce)').matches){
    shots.forEach(s=>s.addEventListener('pointermove',e=>{
      if(drag)return;
      const r=s.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5,im=s.querySelector('img');
      if(im)im.style.transform=`scale(1.055) translate(${x*-9}px,${y*-9}px)`;
    }));
    shots.forEach(s=>s.addEventListener('pointerleave',()=>{const im=s.querySelector('img');if(im)im.style.transform=''}));
  }
}
function initLogin(){const form=$('#loginForm');if(!form)return;if(window.VRAuth?.isAdmin()){location.href='admin.html';return}form.addEventListener('submit',e=>{e.preventDefault();const u=$('#loginUser').value.trim(),p=$('#loginPass').value;if(window.VRAuth?.login(u,p)){toast('Вход выполнен');setTimeout(()=>location.href='admin.html',350)}else{$('#loginError').textContent='Неверный логин или пароль';form.animate([{transform:'translateX(0)'},{transform:'translateX(-6px)'},{transform:'translateX(6px)'},{transform:'translateX(0)'}],{duration:260})}})}
function initAdmin(){
  if(!$('#adminRoot'))return;if(!window.VRAuth?.isAdmin()){location.replace('login.html');return}
  const get=()=>window.VR_PRODUCTS||[];
  let pendingFiles=[],selectedProductId='',previewUrls=[];
  const save=a=>{localStorage.setItem('vr_products_override',JSON.stringify(a));window.VR_PRODUCTS=a;render()};
  const clearPreviewUrls=()=>{previewUrls.forEach(u=>URL.revokeObjectURL(u));previewUrls=[]};
  const imageDims=file=>new Promise(async(resolve,reject)=>{try{if('createImageBitmap'in window){const b=await createImageBitmap(file);const d={width:b.width,height:b.height};b.close();resolve(d);return}const u=URL.createObjectURL(file),im=new Image();im.onload=()=>{const d={width:im.naturalWidth,height:im.naturalHeight};URL.revokeObjectURL(u);resolve(d)};im.onerror=()=>{URL.revokeObjectURL(u);reject(new Error('Не удалось прочитать изображение'))};im.src=u}catch(e){reject(e)}});

  const defaultHeroCfg={type:'monogram',scale:100,offsetY:0,rotateY:0,shadow:70,glow:20,speed:100};
  const readHeroCfg=()=>{try{return {...defaultHeroCfg,...JSON.parse(localStorage.getItem('vr_hero_object_settings')||'{}')}}catch(e){return {...defaultHeroCfg}}};
  const writeHeroCfg=cfg=>localStorage.setItem('vr_hero_object_settings',JSON.stringify(cfg));

  let heroPreviewUrls=[];
  const clearHeroPreviewUrls=()=>{heroPreviewUrls.forEach(u=>URL.revokeObjectURL(u));heroPreviewUrls=[]};
  const renderHeroMedia=async()=>{
    if(!$('#heroObjectPreview'))return;
    clearHeroPreviewUrls();
    let rec=null;
    try{if(window.VRMedia)rec=await window.VRMedia.heroGet('object')}catch(e){console.warn(e)}
    const img=$('#heroObjectPreview'),state=$('#heroObjectState');
    if(rec?.blob){const u=window.VRMedia.objectURL(rec);heroPreviewUrls.push(u);img.src=u;state&&(state.textContent='CUSTOM')}else{img.src=defaultHeroObjectSrc();state&&(state.textContent='DEFAULT')}
  };
  const updateHeroSettingsUI=(cfg=readHeroCfg())=>{
    const map={type:['#heroObjType',v=>v],scale:['#heroObjScale',v=>v],offsetY:['#heroObjOffsetY',v=>v],rotateY:['#heroObjRotateY',v=>v],shadow:['#heroObjShadow',v=>v],glow:['#heroObjGlow',v=>v],speed:['#heroObjSpeed',v=>v]};
    Object.entries(map).forEach(([k,[sel]])=>{$(sel)&&($(sel).value=cfg[k])});
    $('#heroObjScaleVal')&&($('#heroObjScaleVal').textContent=`${cfg.scale}%`);
    $('#heroObjOffsetYVal')&&($('#heroObjOffsetYVal').textContent=`${cfg.offsetY>0?'+':''}${cfg.offsetY} px`);
    $('#heroObjRotateYVal')&&($('#heroObjRotateYVal').textContent=`${cfg.rotateY>0?'+':''}${cfg.rotateY}°`);
    $('#heroObjShadowVal')&&($('#heroObjShadowVal').textContent=`${cfg.shadow}%`);
    $('#heroObjGlowVal')&&($('#heroObjGlowVal').textContent=`${cfg.glow}%`);
    $('#heroObjSpeedVal')&&($('#heroObjSpeedVal').textContent=`${cfg.speed}%`);
  };
  const saveHeroSettingsFromUI=()=>{
    const cfg={
      type:$('#heroObjType')?.value||'monogram',
      scale:Number($('#heroObjScale')?.value)||100,
      offsetY:Number($('#heroObjOffsetY')?.value)||0,
      rotateY:Number($('#heroObjRotateY')?.value)||0,
      shadow:Number($('#heroObjShadow')?.value)||70,
      glow:Number($('#heroObjGlow')?.value)||20,
      speed:Number($('#heroObjSpeed')?.value)||100,
    };
    writeHeroCfg(cfg); updateHeroSettingsUI(cfg);
  };
  const saveHeroFile=async(file)=>{
    const err=$('#heroImageErrors');if(err)err.textContent='';
    if(!file)return;
    if(!/^image\//.test(file.type) && !/\.svg$/i.test(file.name||'')){if(err)err.textContent='Для баннера используйте SVG, PNG, WEBP или JPG.';return}
    try{
      if(file.type!=='image/svg+xml' && !/\.svg$/i.test(file.name||'')){
        const d=await imageDims(file);if(Math.max(d.width,d.height)<900){if(err)err.textContent=`${file.name}: ${d.width}×${d.height}. Для качественной анимации рекомендуем минимум 900 px по большей стороне.`;return}
      }
      await window.VRMedia.heroSet('object',file);await renderHeroMedia();toast('Объект баннера обновлён')
    }catch(e){if(err)err.textContent='Не удалось сохранить объект баннера';console.error(e)}
  };

  const renderMedia=async productId=>{
    const box=$('#pImagePreview');if(!box)return;clearPreviewUrls();
    let existing=[];try{existing=productId&&window.VRMedia?await window.VRMedia.get(productId):[]}catch(e){}
    if(!existing.length&&!pendingFiles.length){box.innerHTML='<div class="media-empty">Фото появятся здесь после выбора файлов</div>';return}
    const existingHtml=existing.map((r,i)=>{const u=window.VRMedia.objectURL(r);previewUrls.push(u);return `<div class="admin-media-card"><img src="${u}" alt="Фото товара"><span class="media-index">${String(i+1).padStart(2,'0')}</span>${i===0?'<span class="media-badge">Обложка</span>':''}<div class="media-card-actions">${i?`<button type="button" data-cover="${r.key}">На обложку</button>`:'<button type="button" disabled>Обложка</button>'}<button type="button" data-media-delete="${r.key}">×</button></div></div>`}).join('');
    const pendingHtml=pendingFiles.map((f,i)=>{const u=URL.createObjectURL(f);previewUrls.push(u);return `<div class="admin-media-card"><img src="${u}" alt="Новое фото"><span class="media-index">+${i+1}</span><span class="media-badge pending">После сохранения</span><div class="media-card-actions"><button type="button" disabled>1200×1600</button><button type="button" data-pending-delete="${i}">×</button></div></div>`}).join('');
    box.innerHTML=existingHtml+pendingHtml;
    $$('[data-media-delete]',box).forEach(b=>b.addEventListener('click',async()=>{if(!confirm('Удалить это фото?'))return;await window.VRMedia.remove(b.dataset.mediaDelete);await renderMedia(productId);render();toast('Фото удалено')}));
    $$('[data-cover]',box).forEach(b=>b.addEventListener('click',async()=>{await window.VRMedia.makeCover(productId,b.dataset.cover);await renderMedia(productId);render();toast('Обложка изменена')}));
    $$('[data-pending-delete]',box).forEach(b=>b.addEventListener('click',()=>{pendingFiles.splice(Number(b.dataset.pendingDelete),1);renderMedia(productId)}));
  };
  const handleFiles=async fileList=>{
    const errors=[];for(const f of [...fileList]){if(!/^image\/(jpeg|png|webp)$/.test(f.type)){errors.push(`${f.name}: нужен JPG, PNG или WEBP`);continue}try{const d=await imageDims(f);if(d.width!==1200||d.height!==1600){errors.push(`${f.name}: ${d.width}×${d.height}, нужно ровно 1200×1600 px`);continue}pendingFiles.push(f)}catch(e){errors.push(`${f.name}: файл не читается`)}}
    $('#pImageErrors').innerHTML=errors.join('<br>');await renderMedia(selectedProductId);if(pendingFiles.length)toast(`Фото готовы к сохранению: ${pendingFiles.length}`)
  };
  const render=()=>{
    const ps=get(),visible=ps.filter(p=>p.visible!==false),stock=ps.reduce((s,p)=>s+(Number(p.stock)||0),0),avg=ps.length?Math.round(ps.reduce((s,p)=>s+(Number(p.price)||0),0)/ps.length):0;
    $('#statProducts').textContent=ps.length;$('#statVisible').textContent=visible.length;$('#statStock').textContent=stock;$('#statAvg').textContent=money(avg);
    $('#adminRows').innerHTML=ps.map(p=>`<tr><td><div class="admin-product"><img src="${productFallback(p.id)}" data-product-media="${p.id}" alt=""><div>${p.name}<br><small style="color:var(--muted)">${p.id}</small></div></div></td><td>${p.category}</td><td>${money(p.price)}</td><td>${p.stock??0}</td><td><span class="status ${p.visible!==false?'ok':''}">${p.visible!==false?'ON':'OFF'}</span></td><td><button class="action-link" data-edit="${p.id}">Изменить</button></td></tr>`).join('');
    hydrateProductMedia($('#adminRows'));$$('[data-edit]').forEach(b=>b.addEventListener('click',()=>fill(get().find(p=>p.id===b.dataset.edit))));
  };
  const fill=async p=>{if(!p)return;selectedProductId=p.id;pendingFiles=[];$('#pImageErrors').textContent='';$('#pId').value=p.id;$('#pName').value=p.name;$('#pPrice').value=p.price;$('#pCategory').value=p.category;$('#pTag').value=p.tag||'';$('#pStock').value=p.stock??0;$('#pVisible').value=String(p.visible!==false);$('#pDesc').value=p.desc||'';$('#formTitle').textContent='Редактирование '+p.id;$('#deleteProduct').style.display='inline-flex';await renderMedia(p.id);scrollTo({top:0,behavior:'smooth'})};
  const form=$('#productForm');
  form?.addEventListener('submit',async e=>{e.preventDefault();let ps=[...get()];let id=$('#pId').value.trim();if(!id)id='vr-'+String(Date.now()).slice(-6);const obj={id,name:$('#pName').value.trim(),price:Number($('#pPrice').value)||0,category:$('#pCategory').value.trim(),tag:$('#pTag').value.trim(),stock:Number($('#pStock').value)||0,visible:$('#pVisible').value==='true',desc:$('#pDesc').value.trim()};const i=ps.findIndex(p=>p.id===id);if(i>=0)ps[i]=obj;else ps.unshift(obj);save(ps);selectedProductId=id;$('#pId').value=id;$('#formTitle').textContent='Редактирование '+id;$('#deleteProduct').style.display='inline-flex';if(pendingFiles.length&&window.VRMedia){try{await window.VRMedia.add(id,pendingFiles);pendingFiles=[];$('#pImages').value=''}catch(err){toast('Товар сохранён, но фото не записались');console.error(err)}}await renderMedia(id);render();toast('Товар и фотографии сохранены')});
  $('#newProduct')?.addEventListener('click',async()=>{form.reset();selectedProductId='';pendingFiles=[];$('#pId').value='';$('#pVisible').value='true';$('#formTitle').textContent='Новый товар';$('#deleteProduct').style.display='none';$('#pImageErrors').textContent='';await renderMedia('')});
  $('#deleteProduct')?.addEventListener('click',async()=>{const id=$('#pId').value;if(!id)return;if(confirm('Удалить '+id+' вместе с фотографиями?')){if(window.VRMedia)await window.VRMedia.removeProduct(id);save(get().filter(p=>p.id!==id));$('#newProduct').click();toast('Товар удалён')}});
  $('#resetCatalog')?.addEventListener('click',()=>{if(confirm('Вернуть исходный каталог? Пользовательские фотографии останутся в браузере.')){localStorage.removeItem('vr_products_override');window.VR_PRODUCTS=JSON.parse(JSON.stringify(window.VR_DEFAULT_PRODUCTS));render();toast('Каталог восстановлен')}});
  $('#exportCatalog')?.addEventListener('click',()=>{const blob=new Blob([JSON.stringify(get(),null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='vrode-rovno-catalog.json';a.click();URL.revokeObjectURL(a.href)});
  $('#logoutBtn')?.addEventListener('click',()=>{window.VRAuth.logout();location.href='index.html'});
  const input=$('#pImages'),drop=$('#mediaDropZone');input?.addEventListener('change',()=>handleFiles(input.files));drop?.addEventListener('dragover',e=>{e.preventDefault();drop.classList.add('is-dragover')});drop?.addEventListener('dragleave',()=>drop.classList.remove('is-dragover'));drop?.addEventListener('drop',e=>{e.preventDefault();drop.classList.remove('is-dragover');handleFiles(e.dataTransfer.files)});

  $('#heroObjectInput')?.addEventListener('change',e=>{const f=e.target.files?.[0];if(f)saveHeroFile(f);e.target.value=''});
  $('#heroObjectReset')?.addEventListener('click',async()=>{if(window.VRMedia){await window.VRMedia.heroRemove('object');await renderHeroMedia();toast('Объект баннера возвращён к стандартному')}});
  $('#heroSettingsReset')?.addEventListener('click',()=>{writeHeroCfg(defaultHeroCfg);updateHeroSettingsUI(defaultHeroCfg);toast('Параметры объекта сброшены')});
  ['#heroObjType','#heroObjScale','#heroObjOffsetY','#heroObjRotateY','#heroObjShadow','#heroObjGlow','#heroObjSpeed'].forEach(sel=>$(sel)?.addEventListener('input',saveHeroSettingsFromUI));
  ['#heroObjType'].forEach(sel=>$(sel)?.addEventListener('change',saveHeroSettingsFromUI));

  render();renderMedia('');renderHeroMedia();updateHeroSettingsUI();
  new MutationObserver(()=>renderHeroMedia()).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
}
document.addEventListener('DOMContentLoaded',()=>{themeInit();authUI();nav();updateCartCount();reveals();cursor();intro();initTee();initInstagramGallery();initHome();initCatalog();initProduct();initLogin();initAdmin()});
