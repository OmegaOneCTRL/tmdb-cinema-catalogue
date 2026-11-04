// TMDB API v3. Create a key at https://www.themoviedb.org/settings/api
// For a public/production deployment, proxy TMDB requests through a backend and keep the key secret.
const TMDB_KEY = 'YOUR_TMDB_API_KEY';
const API = 'https://api.themoviedb.org/3';
const IMG = 'https://image.tmdb.org/t/p/w500';
const BACKDROP = 'https://image.tmdb.org/t/p/w1280';
const statusEl = document.querySelector('#status');
const resultsEl = document.querySelector('#results');
let currentKind = 'movie';
let genreMap = {};
const escapeHTML = (s='') => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

async function tmdb(path) {
  if (!TMDB_KEY || TMDB_KEY === 'YOUR_TMDB_API_KEY') throw new Error('Ajoutez votre clé API TMDB dans app.js (TMDB_KEY) pour charger le catalogue.');
  const sep = path.includes('?') ? '&' : '?';
  const response = await fetch(`${API}${path}${sep}api_key=${encodeURIComponent(TMDB_KEY)}&language=fr-FR`);
  if (!response.ok) throw new Error(`TMDB a répondu avec le statut ${response.status}. Vérifiez la clé API et les limites d’utilisation.`);
  return response.json();
}
function titleOf(item, kind=currentKind) { return item.title || item.name || item.original_title || item.original_name || 'Sans titre'; }
function render(items, kind=currentKind) {
  resultsEl.innerHTML = items.map(item => {
    const title = titleOf(item,kind);
    const poster = item.poster_path ? `${IMG}${item.poster_path}` : '';
    const date = (item.release_date || item.first_air_date || '').slice(0,4) || '—';
    const rating = Number(item.vote_average || 0).toFixed(1);
    return `<article class="card" data-id="${Number(item.id)}" data-kind="${kind}" tabindex="0" aria-label="Détails : ${escapeHTML(title)}"><div class="poster-wrap">${poster ? `<img loading="lazy" src="${poster}" alt="Affiche de ${escapeHTML(title)}">` : '<div class="no-poster"></div>'}<span class="rating">★ ${rating}</span></div><h3>${escapeHTML(title)}</h3><p>${date} · ${kind === 'movie' ? 'Film' : 'Série'}</p></article>`;
  }).join('');
  resultsEl.querySelectorAll('.card').forEach(card => {card.addEventListener('click', () => showDetails(card.dataset.id,card.dataset.kind));card.addEventListener('keydown', e => {if(e.key==='Enter')showDetails(card.dataset.id,card.dataset.kind)})});
}
async function loadTrending(kind='movie') {
  currentKind=kind; statusEl.textContent='Chargement des tendances…'; resultsEl.innerHTML='';
  try {const data=await tmdb(`/trending/${kind}/week`); render(data.results || [],kind); statusEl.textContent='';}
  catch(e){statusEl.textContent=e.message;statusEl.classList.add('error');}
}
async function loadGenres() {
  try {const data=await tmdb(`/genre/${currentKind}/list`);genreMap=Object.fromEntries((data.genres||[]).map(x=>[x.id,x.name]));document.querySelector('#genres').innerHTML=(data.genres||[]).map(g=>`<button class="genre-chip" data-id="${g.id}">${escapeHTML(g.name)}</button>`).join('');document.querySelectorAll('.genre-chip').forEach(btn=>btn.onclick=()=>loadGenre(btn.dataset.id));}
  catch(e){document.querySelector('#genres').innerHTML='<span class="muted">Les genres seront disponibles après configuration de la clé API.</span>';}
}
async function loadGenre(id) {
  statusEl.textContent=`Chargement du genre ${genreMap[id]||''}…`; resultsEl.innerHTML=''; document.querySelector('#trending').scrollIntoView({behavior:'smooth'});
  try {const data=await tmdb(`/discover/${currentKind}?with_genres=${encodeURIComponent(id)}&sort_by=popularity.desc`);render(data.results||[],currentKind);statusEl.textContent='';}
  catch(e){statusEl.textContent=e.message;statusEl.classList.add('error');}
}
async function search(query) {
  const clean=query.trim();if(!clean)return;statusEl.textContent=`Recherche de « ${clean} »…`;resultsEl.innerHTML='';document.querySelector('#trending').scrollIntoView({behavior:'smooth'});
  try {const data=await tmdb(`/search/multi?query=${encodeURIComponent(clean)}&include_adult=false`);const items=(data.results||[]).filter(x=>x.media_type==='movie'||x.media_type==='tv');render(items,'movie');resultsEl.querySelectorAll('.card').forEach((card,i)=>{const item=items[i];card.dataset.kind=item.media_type});statusEl.textContent=items.length?`Résultats pour « ${clean} »`:`Aucun résultat pour « ${clean} »`;}
  catch(e){statusEl.textContent=e.message;statusEl.classList.add('error');}
}
async function showDetails(id,kind) {
  const dialog=document.querySelector('#details'), box=document.querySelector('#detail-content');box.innerHTML='<p>Chargement…</p>';dialog.showModal();
  try {const item=await tmdb(`/${kind}/${encodeURIComponent(id)}`);const title=titleOf(item,kind),year=(item.release_date||item.first_air_date||'').slice(0,4);const img=item.poster_path?`${IMG}${item.poster_path}`:'';const genres=(item.genres||[]).map(g=>g.name).join(' · ');box.innerHTML=`${img?`<img src="${img}" alt="Affiche de ${escapeHTML(title)}">`:'<div></div>'}<div><p class="eyebrow">${kind==='movie'?'FILM':'SÉRIE'}${year?' · '+year:''}</p><h2 id="detail-title">${escapeHTML(title)}</h2><p class="detail-meta">★ ${Number(item.vote_average||0).toFixed(1)}${genres?' · '+escapeHTML(genres):''}</p><p>${escapeHTML(item.overview||'Aucun synopsis disponible.')}</p><p class="muted">Cette fiche fournit des informations éditoriales uniquement. Aucune vidéo n’est hébergée ou liée ici.</p></div>`;}
  catch(e){box.innerHTML=`<p class="error">${escapeHTML(e.message)}</p>`;}
}
document.querySelector('#search-form').addEventListener('submit',e=>{e.preventDefault();search(document.querySelector('#search-input').value)});
document.querySelectorAll('.tab').forEach(tab=>tab.addEventListener('click',()=>{document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('selected',t===tab));loadTrending(tab.dataset.kind);loadGenres()}));
document.querySelector('.close').addEventListener('click',()=>document.querySelector('#details').close());
document.querySelector('#details').addEventListener('click',e=>{if(e.target===e.currentTarget)e.currentTarget.close()});
loadTrending();loadGenres();
