// Replace the fixNames function in common.js
// Replace the fixNames function at the top of common.js with this:
(function fixNames(){
  if(!window.TN) return;
  TN.candidates.forEach(c => {
    // If name is a number or empty, pull it from the key string
    if(typeof c.name !== 'string' || !isNaN(c.name) || c.name === ""){
      // Splits "Name||Constituency" and takes the first part
      c.name = String(c.key).split('||')[0].trim();
    }
  });
})();

// Add this helper for the MyNeta button
function getMyNetaBtn(url) {
  if (!url) return '';
  return `<a href="${url}" target="_blank" class="tab active" style="text-decoration:none; display:inline-block; margin-top:10px; background:var(--blue); color:white;">Detailed View on MyNeta</a>`;
}

// ── Formatting ──────────────────────────────
function fmt(n){
  if(!n && n!==0) return '—';
  const a=Math.abs(n);
  let s;
  if(a>=10000000) s='₹'+(a/10000000).toFixed(2)+' Cr';
  else if(a>=100000) s='₹'+(a/100000).toFixed(2)+' L';
  else if(a>=1000) s='₹'+(a/1000).toFixed(1)+' K';
  else s='₹'+a.toLocaleString('en-IN');
  return n<0?'−'+s:s;
}
function fmtShort(n){
  const a=Math.abs(n);
  let s;
  if(a>=10000000) s='₹'+(a/10000000).toFixed(1)+' Cr';
  else if(a>=100000) s='₹'+(a/100000).toFixed(1)+' L';
  else s='₹'+a.toLocaleString('en-IN');
  return n<0?'−'+s:s;
}

// ── Party colours ─────────────────────────
const PCOL={
  'Tamilaga Vettri Kazhagam':'#E53E3E',
  'DMK':'#E53E3E','AIADMK':'#38A169','BJP':'#DD6B20',
  'INC':'#3182CE','PMK':'#805AD5','DMDK':'#D69E2E',
  'NTK':'#1A202C','VCK':'#2B6CB0','AMMK':'#6B46C1',
  'MNM':'#319795','CPI':'#C53030','CPM':'#C05621',
  'MDMK':'#2C7A7B','IUML':'#276749','AIFB':'#E53E3E',
  'IND':'#718096','Naam Tamilar Katchi':'#1A202C',
  'Kongunadu Makkal Desia Katchi':'#B7791F',
  'Desiya Murpokku Dravida Kazhagam':'#2C7A7B'
};
function partyColor(p){
  return PCOL[p]||(PCOL[Object.keys(PCOL).find(k=>p&&p.includes(k.split(' ')[0]))||''])||'#718096';
}

// ── Avatar ────────────────────────────────
const AVCOLS=['#1D4ED8','#0D9488','#B91C1C','#C9962A','#7C3AED','#059669','#D97706','#DC2626','#0891B2'];
function avatarColor(name){let h=0;for(let c of(name||''))h=(h*31+c.charCodeAt(0))%AVCOLS.length;return AVCOLS[h];}
function initials(name){return(name||'?').split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase();}

// ── Navigation ────────────────────────────
function navigate(page){window.location.href=page;}

// ── Sidebar builder ───────────────────────
function buildSidebar(activePage){
  const pages=[
    {id:'index',label:'Overview',icon:'grid',href:'index.html'},
    {id:'constituencies',label:'Constituencies',href:'constituencies.html',icon:'map'},
    {id:'candidates',label:'Candidates',href:'candidates.html',icon:'user'},
    {id:'banks',label:'Banks',href:'banks.html',icon:'bank'},
    {id:'parties',label:'Parties',href:'parties.html',icon:'users'},
  ];
  const icons={
    grid:`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
    map:`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
    user:`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>`,
    bank:`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="10" width="18" height="11" rx="1"/><path d="M3 10l9-7 9 7"/><line x1="12" y1="10" x2="12" y2="21"/><line x1="7" y1="10" x2="7" y2="21"/><line x1="17" y1="10" x2="17" y2="21"/></svg>`,
    users:`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`
  };
  const m=TN.meta;
  return `<nav class="sidebar">
    <div class="sb-brand">
      <div class="sb-badge">TN 2026</div>
      <div class="sb-title">Election Finance<br>Dashboard</div>
      <div class="sb-sub">${m.total_candidates.toLocaleString()} candidates · 234 seats</div>
    </div>
    <div class="sb-section">
      <div class="sb-label">Overview</div>
      ${pages.slice(0,1).map(p=>`<a class="nav-item${activePage===p.id?' active':''}" href="${p.href}">${icons[p.icon]}${p.label}</a>`).join('')}
    </div>
    <div class="sb-section">
      <div class="sb-label">Analysis</div>
      ${pages.slice(1).map(p=>`<a class="nav-item${activePage===p.id?' active':''}" href="${p.href}">${icons[p.icon]}${p.label}</a>`).join('')}
    </div>
    <div class="sb-footer">Data: myneta.info · May 2026</div>
  </nav>`;
}

// ── Topbar ────────────────────────────────
function buildTopbar(title,sub){
  return `<div class="topbar">
    <div><div class="page-title">${title}</div><div class="page-sub">${sub||'Tamil Nadu Legislative Assembly Election 2026'}</div></div>
    <div class="search-wrap"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9A9087" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg><input type="text" id="gs" placeholder="Search candidate…" oninput="globalSearch(this.value)"></div>
  </div>`;
}
function globalSearch(q){if(q.length>1)window.location.href='candidates.html?q='+encodeURIComponent(q);}
