(() => {
  'use strict';
  const $ = s=>document.querySelector(s);
  const money = v=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(v);
  const normalize = v=>String(v).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
  const esc = v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const key='pontal-list-v1';
  let products=[], category='Todos', offers=false, chosen=[], deferredPrompt=null, toastTimer, isDemo=true;
  try { const saved=JSON.parse(localStorage.getItem(key)||'[]'); if(Array.isArray(saved)) chosen=[...new Set(saved.filter(id=>typeof id==='string'))]; } catch{}
  const state = p=>p.stock<=0?'unavailable':p.stock<=CATALOG_CONFIG.lowStockThreshold?'low':'available';
  const labels={available:'Disponível',low:'Poucas unidades',unavailable:'Indisponível'};
  const badge=p=>`<span class="status ${state(p)}">${labels[state(p)]}</span>`;
  const onOffer=p=>Number.isFinite(p.oldPrice)&&p.oldPrice>p.price;
  function toast(text){$('#toast').textContent=text;$('#toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),2600);}
  function persist(){try{localStorage.setItem(key,JSON.stringify(chosen));}catch{toast('A lista funciona nesta visita, mas não pôde ser salva.');}$('#list-count').textContent=chosen.length;}
  function toggle(id){if(chosen.includes(id)){chosen=chosen.filter(x=>x!==id);toast('Produto removido da lista.');}else{chosen.push(id);toast('Produto adicionado à lista.');}persist();render();renderList();renderSuggestions();if($('#product-dialog').open)detail(id,false);}
  function renderCategories(){const symbols={'Todos':'▦','Bebidas':'◉','Refrigerados':'❄','Gelados':'❄','Mercearia':'▤','Hortifruti':'✳','Cuidados':'◇','Pets':'♡'};$('#categories').innerHTML=['Todos',...new Set(products.map(p=>p.category))].map(c=>`<button class="category" data-category="${esc(c)}" aria-pressed="${category===c}"><span class="cat-symbol" aria-hidden="true">${symbols[c]||'◇'}</span>${esc(c)}</button>`).join('');}
  function render(){
    const q=normalize($('#search').value), status=$('#availability').value;
    const terms=q.split(/\s+/).filter(Boolean);
    let shown=products.filter(p=>(category==='Todos'||p.category===category)&&(!offers||onOffer(p))&&(!$('#only-available').checked||p.stock>0)&&(status==='all'||state(p)===status)&&terms.every(t=>normalize(`${p.name} ${p.category} ${p.code}`).includes(t)));
    const sort=$('#sort').value;
    if(sort==='price-asc')shown.sort((a,b)=>a.price-b.price);else if(sort==='price-desc')shown.sort((a,b)=>b.price-a.price);else if(sort==='name')shown.sort((a,b)=>a.name.localeCompare(b.name,'pt-BR'));
    $('#results').textContent=`${shown.length} ${shown.length===1?'produto encontrado':'produtos encontrados'}${offers?' em oferta':''}`;
    $('#empty').hidden=shown.length!==0;
    $('#reset-filters').hidden=!q&&category==='Todos'&&!offers&&!$('#only-available').checked&&status==='all';
    $('#offers-filter').setAttribute('aria-pressed',offers);
    $('#product-grid').innerHTML=shown.map(p=>`<article class="product-card">${onOffer(p)?`<span class="discount">−${Math.round((1-p.price/p.oldPrice)*100)}%</span>`:''}<button class="product-open" data-detail="${esc(p.id)}" aria-label="Ver detalhes de ${esc(p.name)}"><div class="product-image"><img src="${esc(p.image)}" alt="${esc(p.name)} — foto ilustrativa" loading="lazy" width="200" height="170"></div><div class="product-body"><span class="product-category">${esc(p.category)}</span><h3>${esc(p.name)}</h3><span class="unit">${esc(p.unit)}</span><div class="price-row"><strong class="price">${money(p.price)}</strong>${onOffer(p)?`<del class="old-price">${money(p.oldPrice)}</del>`:''}</div></div></button><div class="product-bottom">${badge(p)}<button class="add-button ${chosen.includes(p.id)?'added':''}" data-toggle="${esc(p.id)}" aria-pressed="${chosen.includes(p.id)}" aria-label="${chosen.includes(p.id)?'Remover':'Adicionar'} ${esc(p.name)} ${chosen.includes(p.id)?'da':'à'} lista">${chosen.includes(p.id)?'✓':'+'}</button></div></article>`).join('');
    renderCategories();
  }
  function reset(){category='Todos';offers=false;$('#search').value='';$('#only-available').checked=false;$('#availability').value='all';$('#sort').value='featured';render();}
  function detail(id,open=true){const p=products.find(p=>p.id===id);if(!p)return;$('#product-detail').innerHTML=`<img class="detail-image" src="${esc(p.image)}" alt="${esc(p.name)} — foto ilustrativa"><span class="eyebrow">${esc(p.category)}</span><h2 id="detail-title">${esc(p.name)}</h2><p class="detail-meta">${esc(p.unit)} · Código ${esc(p.code)}</p><div class="detail-price"><strong class="price">${money(p.price)}</strong>${onOffer(p)?`<del class="old-price">${money(p.oldPrice)}</del>`:''}</div>${badge(p)}<p class="detail-description">${esc(p.description)}</p><p class="muted">${isDemo?'Preço e disponibilidade fictícios. Foto ilustrativa.':'A disponibilidade pode mudar até sua visita.'}${!navigator.onLine?' Você está offline.':''}</p><button class="primary" data-toggle="${esc(p.id)}">${chosen.includes(p.id)?'Remover da minha lista':'Adicionar à minha lista'}</button>`;if(open)$('#product-dialog').showModal();}
  function renderList(){const known=chosen.map(id=>products.find(p=>p.id===id));const available=known.filter(p=>p&&p.stock>0).length;$('#list-summary').textContent=chosen.length?`${available} de ${chosen.length} ${chosen.length===1?'item disponível':'itens disponíveis'}${isDemo?' • Demonstração':''}${!navigator.onLine?' • Consulta offline':''}`:'Sua lista está vazia. Que tal começar?';$('#list-items').innerHTML=known.map((p,i)=>`<div class="list-item">${p?`<img src="${esc(p.image)}" alt=""><div><strong>${esc(p.name)}</strong>${badge(p)} <span class="unit">· ${money(p.price)}</span></div>`:`<div><strong>Item fora do catálogo</strong><span class="muted">Disponibilidade desconhecida</span></div>`}<button class="remove" data-toggle="${esc(chosen[i])}" aria-label="Remover ${p?esc(p.name):'item'} da lista">×</button></div>`).join('');$('#clear-list').hidden=!chosen.length;}
  function renderSuggestions(){const q=normalize($('#list-search').value);const found=products.filter(p=>normalize(`${p.name} ${p.code}`).includes(q)).slice(0,6);$('#list-suggestions').innerHTML=!q?'':found.length?found.map(p=>`<div class="suggestion"><span>${esc(p.name)}<br>${badge(p)}</span><button data-toggle="${esc(p.id)}" aria-label="${chosen.includes(p.id)?'Remover':'Adicionar'} ${esc(p.name)}">${chosen.includes(p.id)?'Remover':'Adicionar'}</button></div>`).join(''):'<p>Produto não encontrado no catálogo. Tente um nome mais curto.</p>';}
  function openList(){renderList();$('#list-dialog').showModal();}
  function connection(){const offline=!navigator.onLine;$('#connection').hidden=!offline;$('#connection').textContent=isDemo?'Você está offline. Exibindo o catálogo demonstrativo salvo neste aparelho.':'Você está offline. Os preços e a disponibilidade exibidos podem estar desatualizados.';renderList();}
  async function load(){
    $('#load-error').hidden=true;$('#empty').hidden=true;$('#results').textContent='Carregando produtos…';
    try{const data=await CatalogSource.getProducts();products=data.products;isDemo=data.isDemo;$('.demo-bar').hidden=!isDemo;$('#data-label').textContent=isDemo?'Demonstração • Fotos ilustrativas.':`Dados atualizados em ${new Date(data.updatedAt).toLocaleString('pt-BR')}`;render();persist();connection();}
    catch{products=[];$('#product-grid').innerHTML='';$('#results').textContent='Catálogo indisponível';$('#load-error').hidden=false;$('#empty').hidden=true;renderList();}
  }
  document.addEventListener('click',e=>{const categoryButton=e.target.closest('[data-category]');if(categoryButton){category=categoryButton.dataset.category;render();document.querySelectorAll('[data-category]').forEach(b=>{if(b.dataset.category===category)b.focus({preventScroll:true});});}const d=e.target.closest('[data-detail]');if(d)detail(d.dataset.detail);const t=e.target.closest('[data-toggle]');if(t){const id=t.dataset.toggle;const inList=$('#list-dialog').contains(t);const inDetail=$('#product-dialog').contains(t);toggle(id);const region=inList?$('#list-dialog'):inDetail?$('#product-dialog'):$('#product-grid');const replacement=[...region.querySelectorAll('[data-toggle]')].find(b=>b.dataset.toggle===id);(replacement||region.querySelector('button'))?.focus({preventScroll:true});}if(e.target.closest('[data-close]'))e.target.closest('dialog').close();});
  document.addEventListener('error',e=>{if(e.target.tagName==='IMG'&&!e.target.src.endsWith('/assets/icon.svg')){e.target.src='assets/icon.svg';e.target.alt='Imagem indisponível';}},true);
  $('#search').addEventListener('input',render);
  ['only-available','availability','sort'].forEach(id=>$('#'+id).addEventListener('change',render));
  $('#offers-filter').onclick=()=>{offers=!offers;render();};
  $('#nav-offers').onclick=()=>{reset();offers=true;render();$('#catalogo').scrollIntoView();};
  $('#reset-filters').onclick=reset;$('#empty-reset').onclick=reset;$('#retry').onclick=load;
  $('#open-list').onclick=openList;$('#banner-list').onclick=openList;
  $('#list-search').addEventListener('input',renderSuggestions);$('#list-search-form').onsubmit=e=>{e.preventDefault();renderSuggestions();};
  $('#clear-list').onclick=()=>{chosen=[];persist();renderList();renderSuggestions();render();toast('Lista limpa.');};
  window.addEventListener('online',connection);window.addEventListener('offline',connection);
  window.addEventListener('storage',e=>{if(e.key===key){try{const next=JSON.parse(e.newValue||'[]');if(Array.isArray(next))chosen=[...new Set(next.filter(id=>typeof id==='string'))];}catch{}$('#list-count').textContent=chosen.length;render();renderList();renderSuggestions();}});
  window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;$('#install-button').textContent='Instalar catálogo';});
  $('#install-button').onclick=async()=>{if(deferredPrompt){await deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;$('#install-button').textContent='Como instalar';}else $('#install-dialog').showModal();};
  window.addEventListener('appinstalled',()=>{$('#install-section').hidden=true;toast('Catálogo instalado!');});
  if(window.matchMedia('(display-mode: standalone)').matches)$('#install-section').hidden=true;
  if('serviceWorker' in navigator&&['http:','https:'].includes(location.protocol))window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
  load();
})();
