// ─── Config pública cacheada ──────────────────────────────────────────────────
let _publicCfgCache = null;
async function getPublicConfig(force = false) {
  if (!force && _publicCfgCache) return _publicCfgCache;
  try {
    const r = await fetch('/api/public/config?_=' + Date.now());
    _publicCfgCache = await r.json();
  } catch { _publicCfgCache = {}; }
  return _publicCfgCache;
}
window.invalidatePublicCfgCache = function() { _publicCfgCache = null; };

async function applyBranding(force = false) {
  const cfg     = await getPublicConfig(force);
  const nome    = cfg.site_nome    || 'Tower Slot';
  const suporte = cfg.site_suporte || '';
  const promo   = cfg.site_promo   || '';
  const logoUrl    = cfg.site_logo_url    || null;
  const faviconUrl = cfg.site_favicon_url || null;

  document.querySelectorAll('.brand-name').forEach(el => { el.textContent = nome; });
  document.title = `${nome} - Gire e ganhe`;

  // Suporte: usa site_suporte ou primeiro item de suporte_links
  let supLink = suporte;
  if (!supLink && cfg.suporte_links && cfg.suporte_links.length > 0) {
    supLink = cfg.suporte_links[0].url || '';
  }
  document.querySelectorAll('[data-suporte-href]').forEach(el => {
    el.href = supLink || '#';
    el.style.display = supLink ? '' : 'none';
  });

  document.querySelectorAll('.brand-promo').forEach(el => {
    el.textContent = promo;
    el.style.display = promo ? '' : 'none';
  });

  // Logo dinâmico
  document.querySelectorAll('.brand-logo-wrap').forEach(wrap => {
    const imgEl  = wrap.querySelector('.brand-logo-img');
    const iconEl = wrap.querySelector('.brand-logo-icon');
    const nameEl = wrap.querySelector('.brand-name');
    if (logoUrl) {
      if (imgEl)  { imgEl.src = logoUrl + '?t=' + Date.now(); imgEl.style.display = ''; }
      if (iconEl) iconEl.style.display = 'none';
      if (nameEl) nameEl.style.display = 'none';
    } else {
      if (imgEl)  imgEl.style.display = 'none';
      if (iconEl) iconEl.style.display = '';
      if (nameEl) { nameEl.style.display = ''; nameEl.textContent = nome; }
    }
  });

  // Favicon
  if (faviconUrl) {
    let link = document.querySelector('link[rel~="icon"]');
    if (!link) { link = document.createElement('link'); link.rel = 'icon'; document.head.appendChild(link); }
    link.href = faviconUrl + '?t=' + Date.now();
  }

  // Cores dinâmicas do tema — aplica em todas as variáveis CSS do sistema
  if (cfg.cores) {
    const root = document.documentElement;
    const c = cfg.cores;

    // painel.html vars
    if (c.cor_bg)      root.style.setProperty('--bg',       c.cor_bg);
    if (c.cor_bg2)     root.style.setProperty('--bg2',      c.cor_bg2);
    if (c.cor_bg3)     root.style.setProperty('--bg3',      c.cor_bg3);
    if (c.cor_purple)  root.style.setProperty('--purple',   c.cor_purple);
    if (c.cor_purple2) root.style.setProperty('--purple2',  c.cor_purple2);
    if (c.cor_purple3) root.style.setProperty('--purple3',  c.cor_purple3);
    if (c.cor_pink)    root.style.setProperty('--pink',     c.cor_pink);
    if (c.cor_pink2)   root.style.setProperty('--pink2',    c.cor_pink2);
    if (c.cor_green)   root.style.setProperty('--green',    c.cor_green);
    if (c.cor_green2)  root.style.setProperty('--green2',   c.cor_green2);
    if (c.cor_red)     root.style.setProperty('--red',      c.cor_red);
    if (c.cor_yellow)  root.style.setProperty('--yellow',   c.cor_yellow);
    if (c.cor_text)    root.style.setProperty('--text',     c.cor_text);

    // style.css (landing/login/cadastro) vars
    if (c.cor_pink)    root.style.setProperty('--pink-light', c.cor_pink2 || c.cor_pink);
    if (c.cor_pink2)   root.style.setProperty('--pink-dark',  c.cor_pink2);
    if (c.cor_green)   root.style.setProperty('--green-dark', c.cor_green2 || c.cor_green);
    if (c.cor_red)     root.style.setProperty('--red',        c.cor_red);
    if (c.cor_bg)      root.style.setProperty('--dark',       c.cor_bg);

    // painel.js (pnl-*) vars
    if (c.cor_pink)    root.style.setProperty('--pnl-pink',        c.cor_pink);
    if (c.cor_pink2)   root.style.setProperty('--pnl-pink-light',  c.cor_pink2);
    if (c.cor_purple)  root.style.setProperty('--pnl-purple',      c.cor_purple);
    if (c.cor_purple2) root.style.setProperty('--pnl-purple2',     c.cor_purple2);
    if (c.cor_green)   root.style.setProperty('--pnl-green',       c.cor_green);
    if (c.cor_red)     root.style.setProperty('--pnl-red',         c.cor_red);
  }

  // Modo manutenção — exibe overlay para usuários não logados
  if (cfg.manutencao && !API.getToken()) {
    showManutencao(nome, supLink);
    return;
  }

  // Botão demo — oculta se desabilitado no admin
  document.querySelectorAll('.demo-btn-wrap,[data-demo-toggle]').forEach(el => {
    el.style.display = cfg.demo_mode ? '' : 'none';
  });

  // Botão cadastro — oculta se registro fechado
  document.querySelectorAll('[data-registro-toggle]').forEach(el => {
    el.style.display = cfg.registro_aberto ? '' : 'none';
  });
}

function showManutencao(nome, supLink) {
  if (document.getElementById('manutencao-overlay')) return;
  const d = document.createElement('div');
  d.id = 'manutencao-overlay';
  d.style.cssText = 'position:fixed;inset:0;z-index:99999;background:#080510;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:32px;font-family:sans-serif;color:#fff';
  d.innerHTML = `
    <div style="font-size:56px;margin-bottom:20px">🔧</div>
    <div style="font-size:26px;font-weight:800;margin-bottom:10px">${nome}</div>
    <div style="font-size:15px;color:rgba(255,255,255,.55);margin-bottom:28px;max-width:340px;line-height:1.6">
      Estamos em manutenção.<br>Voltamos em breve!
    </div>
    ${supLink ? `<a href="${supLink}" target="_blank" style="background:#25D366;color:#fff;padding:12px 28px;border-radius:50px;font-weight:700;text-decoration:none;font-size:14px">💬 Falar com suporte</a>` : ''}
  `;
  document.body.appendChild(d);
}
window.getPublicConfig = getPublicConfig;
window.showManutencao   = showManutencao;

// ─── Router SPA ───────────────────────────────────────────────────────────────
const PROTECTED = ['#painel', '#jogo'];
const PUBLIC    = ['#login', '#cadastro', '#landing', ''];

const Pages = {
  landing:  typeof renderLanding  !== 'undefined' ? renderLanding  : null,
  login:    typeof renderLogin    !== 'undefined' ? renderLogin    : null,
  cadastro: typeof renderCadastro !== 'undefined' ? renderCadastro : null,
  painel:   typeof renderPainel   !== 'undefined' ? renderPainel   : null,
  jogo:     typeof renderJogo     !== 'undefined' ? renderJogo     : null,
};

let currentPage = null;
let cleanupFn   = null;

function navigate(hash) {
  window.location.hash = hash;
}

function captureReferralFromUrl() {
  const fromSearch = new URLSearchParams(window.location.search).get('ref');
  if (fromSearch) {
    sessionStorage.setItem('ref_code', String(fromSearch).trim());
    return fromSearch;
  }

  const rawHash = window.location.hash || '';
  const qPos = rawHash.indexOf('?');
  if (qPos >= 0) {
    const hashQuery = rawHash.slice(qPos + 1);
    const fromHash = new URLSearchParams(hashQuery).get('ref');
    if (fromHash) {
      sessionStorage.setItem('ref_code', String(fromHash).trim());
      return fromHash;
    }
  }
  return '';
}

function getHash() {
  const rawHash = window.location.hash || '#landing';
  return rawHash.split('?')[0] || '#landing';
}

async function route() {
  captureReferralFromUrl();
  const rawHash = window.location.hash || '#landing';
  const hashPath = rawHash.split('?')[0] || '#landing';
  const hashQuery = rawHash.includes('?') ? rawHash.slice(rawHash.indexOf('?') + 1) : '';
  const hashRef = new URLSearchParams(hashQuery).get('ref') || '';
  const tokenNow = API.getToken();

  // Links antigos de indicação (#cadastro?ref=...) agora sempre abrem na landing
  if (!tokenNow && hashPath === '#cadastro' && hashRef) {
    navigate(`#landing?ref=${encodeURIComponent(hashRef)}`);
    return;
  }

  const hash     = hashPath;
  const pageName = hash.replace('#', '') || 'landing';
  const pageEl   = document.getElementById(`page-${pageName}`);

  if (!pageEl) {
    navigate('#landing');
    return;
  }

  // Verificar autenticação
  const isProtected = PROTECTED.includes(hash);
  const token       = tokenNow;

  // Permitir acesso a #jogo sem token se for modo demo
  const isDemoGame = hash === '#jogo' && (() => {
    try { return JSON.parse(sessionStorage.getItem('partida_atual'))?.modo_demo === true; }
    catch { return false; }
  })();

  if (isProtected && !token && !isDemoGame) {
    navigate('#login');
    return;
  }
  if ((hash === '#login' || hash === '#cadastro') && token) {
    navigate('#painel');
    return;
  }

  // Cleanup da página anterior
  if (typeof cleanupFn === 'function') {
    cleanupFn();
    cleanupFn = null;
  }

  // Esconder todas as páginas
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

  // Ativar página
  pageEl.classList.add('active');
  currentPage = pageName;

  // Renderizar
  const renderer = Pages[pageName];
  if (typeof renderer === 'function') {
    cleanupFn = await renderer(pageEl) || null;
  }
  // Aplicar branding dinâmico (nome da plataforma, suporte, etc.)
  applyBranding(true); // sempre busca config atualizada ao navegar

  // Scroll ao topo
  window.scrollTo({ top: 0, behavior: 'instant' });
}

// Verificar token válido ao carregar página protegida
async function checkAuth() {
  const token = API.getToken();
  if (!token) return false;
  try {
    await API.me();
    return true;
  } catch {
    API.clearToken();
    return false;
  }
}

// Iniciar router
window.addEventListener('hashchange', () => route());
window.addEventListener('DOMContentLoaded', async () => {
  captureReferralFromUrl();
  const hash = getHash();
  const isDemoGame = hash === '#jogo' && (() => {
    try { return JSON.parse(sessionStorage.getItem('partida_atual'))?.modo_demo === true; }
    catch { return false; }
  })();
  if (PROTECTED.includes(hash) && !isDemoGame) {
    showLoading();
    const ok = await checkAuth();
    hideLoading();
    if (!ok) { navigate('#login'); return; }
  }
  route();
});

// Expor navigate globalmente
window.navigate = navigate;
window.captureReferralFromUrl = captureReferralFromUrl;
