/* =====================================================================
 *  Notificações sociais (prova social)
 *  - Toasts compactos (estilo "SAQUE CONFIRMADO")
 *  - Carrossel "AO VIVO" de ganhadores no topo do painel
 *  - Não aparece quando o usuário está jogando (page-jogo ativa)
 * ===================================================================*/
(function () {
  'use strict';

  const NOMES = [
    'João S.', 'Maria L.', 'Carlos R.', 'Ana P.', 'Lucas M.', 'Beatriz A.',
    'Rafael O.', 'Juliana T.', 'Pedro H.', 'Camila F.', 'Bruno C.', 'Larissa N.',
    'Gustavo D.', 'Fernanda V.', 'Thiago B.', 'Patricia G.', 'Eduardo K.',
    'Mariana Q.', 'Felipe Z.', 'Amanda I.', 'Ricardo W.', 'Tatiane J.',
    'Vinicius E.', 'Paula Y.', 'Rodrigo X.', 'Sabrina U.', 'André M.',
    'Renata P.', 'Diego F.', 'Carolina S.', 'Marcos L.', 'Vanessa R.',
    'Otávio A.', 'Juliana C.', 'Henrique B.', 'Letícia M.', 'Gabriel T.'
  ];

  const VALORES_DEP = [15, 20, 30, 50, 75, 100, 150, 200, 300, 500, 750, 1000];
  const VALORES_SAQ = [40, 50, 80, 120, 180, 238, 250, 320, 480, 600, 850, 1200, 1850, 2400, 3500];
  const VALORES_GAN = [38, 50, 75, 110, 165, 210, 238, 295, 360, 480, 620, 815, 1100, 1480, 2200];

  function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function fmt(v)    { return 'R$ ' + v.toFixed(2).replace('.', ','); }

  function gerarNotificacao() {
    const isSaque = Math.random() < 0.55; // 55% saques (mais "wow"), 45% depósitos
    return {
      tipo:  isSaque ? 'saque' : 'deposito',
      nome:  rand(NOMES),
      valor: fmt(isSaque ? rand(VALORES_SAQ) : rand(VALORES_DEP))
    };
  }

  // ---------- estilos injetados ----------
  const style = document.createElement('style');
  style.textContent = `
    /* ====== TOAST COMPACTO ====== */
    #ns-stack {
      position: fixed; left: 12px; bottom: 84px; z-index: 9998;
      display: flex; flex-direction: column; gap: 8px;
      pointer-events: none; max-width: 290px;
    }
    .ns-toast {
      pointer-events: auto;
      display: flex; align-items: center; gap: 9px;
      background: #0f1825;
      border: 1px solid rgba(255,255,255,.06);
      border-radius: 10px; padding: 7px 12px 7px 8px;
      box-shadow: 0 8px 22px rgba(0,0,0,.45);
      color: #fff;
      font-family: -apple-system,Segoe UI,Roboto,Inter,sans-serif;
      transform: translateX(-115%); opacity: 0;
      transition: transform .4s cubic-bezier(.22,1,.36,1), opacity .3s ease;
      will-change: transform, opacity;
      max-width: 290px;
    }
    .ns-toast.show { transform: translateX(0); opacity: 1; }
    .ns-toast.hide { transform: translateX(-115%); opacity: 0; }
    .ns-icon {
      width: 30px; height: 30px; border-radius: 50%;
      display:flex; align-items:center; justify-content:center;
      flex-shrink:0;
      background: linear-gradient(135deg,#16a34a,#22c55e);
      box-shadow: inset 0 1px 0 rgba(255,255,255,.18);
    }
    .ns-icon svg { width: 16px; height: 16px; color: #fff; }
    .ns-body { flex:1; min-width:0; line-height:1.15; }
    .ns-tag {
      font-size: 9.5px; font-weight: 800; letter-spacing: .8px;
      color: #22c55e; text-transform: uppercase;
    }
    .ns-name {
      font-size: 12.5px; font-weight: 700; color: #fff;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .ns-name .muted { color: #9aa7c2; font-weight: 500; }
    .ns-val {
      font-size: 13px; font-weight: 800; color: #fff;
      margin-top: 1px;
    }

    @media (max-width: 480px) {
      #ns-stack { left: 10px; right: auto; bottom: 78px; max-width: 270px; }
      .ns-toast { max-width: 270px; }
    }

    /* ====== CARROSSEL "AO VIVO" ====== */
    #ns-live-bar {
      margin: 10px 12px 0;
      background: rgba(13,28,46,.55);
      border: 1px solid rgba(96,165,250,.18);
      border-radius: 999px;
      padding: 7px 12px;
      display: flex; align-items: center; gap: 10px;
      overflow: hidden;
      backdrop-filter: blur(6px);
      box-shadow: inset 0 1px 0 rgba(255,255,255,.04);
    }
    #ns-live-bar .live-pill {
      flex-shrink: 0;
      display: inline-flex; align-items: center; gap: 6px;
      background: rgba(34,197,94,.10);
      border: 1px solid rgba(34,197,94,.45);
      color: #22c55e;
      font-size: 10.5px; font-weight: 800; letter-spacing: .6px;
      padding: 4px 9px; border-radius: 999px;
      text-transform: uppercase;
    }
    #ns-live-bar .live-pill .live-dot {
      width: 7px; height: 7px; border-radius: 50%; background: #22c55e;
      box-shadow: 0 0 0 0 rgba(34,197,94,.7);
      animation: nsLivePulse 1.6s infinite;
    }
    @keyframes nsLivePulse {
      0%{box-shadow:0 0 0 0 rgba(34,197,94,.55)}
      70%{box-shadow:0 0 0 7px rgba(34,197,94,0)}
      100%{box-shadow:0 0 0 0 rgba(34,197,94,0)}
    }
    #ns-live-viewport {
      flex: 1; min-width: 0; height: 22px; position: relative; overflow: hidden;
    }
    #ns-live-track {
      position: absolute; inset: 0;
      display: flex; align-items: center;
      transition: transform .5s cubic-bezier(.22,1,.36,1);
      will-change: transform;
    }
    .ns-live-item {
      flex: 0 0 100%;
      font-size: 13px; font-weight: 600; color: #cbd5e1;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      line-height: 22px;
    }
    .ns-live-item b { color: #fff; font-weight: 800; }
    .ns-live-item .gain {
      color: #22c55e; font-weight: 800; margin-left: 4px;
    }
    .ns-live-coin {
      flex-shrink: 0;
      width: 22px; height: 22px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      background: linear-gradient(135deg,#fbbf24,#d97706);
      color: #fff; font-weight: 900; font-size: 12px;
      box-shadow: inset 0 1px 0 rgba(255,255,255,.25);
    }

    @media (max-width: 480px) {
      #ns-live-bar { margin: 10px 10px 0; padding: 6px 10px; gap: 8px; }
      .ns-live-item { font-size: 12px; }
    }
  `;
  document.head.appendChild(style);

  // ---------- container de toasts ----------
  const stack = document.createElement('div');
  stack.id = 'ns-stack';
  document.body.appendChild(stack);

  // ---------- detecta se está jogando ----------
  function estaJogando() {
    const pg = document.getElementById('page-jogo');
    if (!pg) return false;
    return pg.classList.contains('active') ||
           pg.style.display === 'block' ||
           getComputedStyle(pg).display !== 'none';
  }

  // ====== TOAST ======
  const ICON_CHECK =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';

  function mostrarToast() {
    if (estaJogando()) return;
    if (document.hidden) return;
    if (stack.children.length >= 2) return;

    const n = gerarNotificacao();
    const isSaq = n.tipo === 'saque';

    const el = document.createElement('div');
    el.className = 'ns-toast';
    el.innerHTML = `
      <div class="ns-icon">${ICON_CHECK}</div>
      <div class="ns-body">
        <div class="ns-tag">${isSaq ? 'Saque confirmado' : 'Depósito confirmado'}</div>
        <div class="ns-name"><b>${n.nome}</b> <span class="muted">${isSaq ? 'sacou' : 'depositou'}</span></div>
        <div class="ns-val">${n.valor}</div>
      </div>
    `;
    stack.appendChild(el);
    requestAnimationFrame(() => el.classList.add('show'));

    const dur = 4200 + Math.random() * 1200;
    setTimeout(() => {
      el.classList.remove('show');
      el.classList.add('hide');
      setTimeout(() => el.remove(), 450);
    }, dur);
  }

  function agendarToast() {
    const delay = 6000 + Math.random() * 6000;
    setTimeout(() => { mostrarToast(); agendarToast(); }, delay);
  }
  setTimeout(() => { mostrarToast(); agendarToast(); }, 3500);

  // ====== CARROSSEL "AO VIVO" ======
  let liveBar = null;
  let liveTrack = null;
  let liveIdx = 0;
  let liveTimer = null;

  function gerarGanhador() {
    return {
      nome: rand(NOMES),
      valor: fmt(rand(VALORES_GAN))
    };
  }

  function novoItemHTML(g) {
    return `<div class="ns-live-item"><b>${g.nome}</b> ganhou<span class="gain">+${g.valor}</span></div>`;
  }

  function montarLiveBar() {
    if (liveBar && document.body.contains(liveBar)) return;
    // ponto de inserção: logo abaixo do banner do painel, antes das dicas
    const tips = document.getElementById('pnl-tips-wrap');
    const banner = document.getElementById('pnl-banner-wrap');
    const anchor = tips || banner;
    if (!anchor || !anchor.parentNode) return;

    liveBar = document.createElement('div');
    liveBar.id = 'ns-live-bar';
    liveBar.innerHTML = `
      <span class="live-pill"><span class="live-dot"></span>AO VIVO</span>
      <div id="ns-live-viewport">
        <div id="ns-live-track"></div>
      </div>
      <div class="ns-live-coin">$</div>
    `;
    anchor.parentNode.insertBefore(liveBar, anchor);

    liveTrack = liveBar.querySelector('#ns-live-track');
    // popular com 2 itens iniciais para o slide funcionar
    liveTrack.innerHTML = novoItemHTML(gerarGanhador()) + novoItemHTML(gerarGanhador());
    liveIdx = 0;
    liveTrack.style.transform = 'translateX(0)';

    if (liveTimer) clearInterval(liveTimer);
    liveTimer = setInterval(rotacionarLive, 3500);
  }

  function rotacionarLive() {
    if (!liveTrack || !document.body.contains(liveTrack)) {
      if (liveTimer) { clearInterval(liveTimer); liveTimer = null; }
      liveBar = liveTrack = null;
      return;
    }
    if (document.hidden) return;

    // adiciona próximo item e desliza
    liveTrack.insertAdjacentHTML('beforeend', novoItemHTML(gerarGanhador()));
    liveIdx++;
    liveTrack.style.transform = `translateX(-${liveIdx * 100}%)`;

    // limpa itens antigos para não crescer infinitamente
    if (liveTrack.children.length > 4) {
      // remove o primeiro e reseta o offset visual sem animar
      const first = liveTrack.firstElementChild;
      const onEnd = () => {
        liveTrack.removeEventListener('transitionend', onEnd);
        liveTrack.style.transition = 'none';
        first.remove();
        liveIdx--;
        liveTrack.style.transform = `translateX(-${liveIdx * 100}%)`;
        // força reflow e restaura transição
        void liveTrack.offsetWidth;
        liveTrack.style.transition = '';
      };
      liveTrack.addEventListener('transitionend', onEnd, { once: true });
    }
  }

  // tenta montar quando o painel aparecer
  function tentarMontar() {
    if (estaJogando()) return;
    montarLiveBar();
  }
  // observador para reinserir caso o painel seja re-renderizado
  const mo = new MutationObserver(() => {
    if (!document.body.contains(liveBar)) {
      liveBar = liveTrack = null;
    }
    tentarMontar();
  });
  mo.observe(document.body, { childList: true, subtree: true });

  setTimeout(tentarMontar, 800);
  setTimeout(tentarMontar, 2000);
})();
