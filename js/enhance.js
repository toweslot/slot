/* ============================================================
   Tower Slot — melhorias visuais (capa animada, depósito, promo)
   Somente camada de apresentação. Não altera regras do jogo.
   ============================================================ */
(function () {
  'use strict';

  var GIFT = '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="#3a2300" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="13" rx="2"/><path d="M12 8v13M3 13h18M12 8S9.5 3 7.5 4.5 9 8 12 8zM12 8s2.5-5 4.5-3.5S15 8 12 8z"/></svg>';

  // ── 1. Capa animada do jogo no topo do painel ─────────────────────────────
  function montarHero() {
    var scroll = document.querySelector('#page-painel .pnl-scroll');
    if (!scroll || scroll.querySelector('.tsx-hero')) return;

    var hero = document.createElement('div');
    hero.className = 'tsx-hero';
    hero.innerHTML =
      '<img class="tsx-hero-img" src="images/hero-tower.jpg" alt="Tower Slot - monte a torre e multiplique">' +
      '<div class="tsx-hero-clouds">' +
        '<span class="tsx-cloud c1"></span><span class="tsx-cloud c2"></span><span class="tsx-cloud c3"></span>' +
      '</div>' +
      '<span class="tsx-coin" style="left:18%;animation-delay:.2s"></span>' +
      '<span class="tsx-coin" style="left:46%;animation-delay:1.8s"></span>' +
      '<span class="tsx-coin" style="left:74%;animation-delay:3.4s"></span>' +
      '<div class="tsx-leds"></div>' +
      '<div class="tsx-hero-content">' +
        '<span class="tsx-hero-kicker"><i></i> Ao vivo agora</span>' +
        '<div class="tsx-hero-title">TOWER <span>SLOT</span></div>' +
        '<div class="tsx-hero-sub">Empilhe as peças, multiplique sua aposta e saque via PIX.</div>' +
        '<button type="button" class="tsx-hero-cta" id="tsx-hero-play">Jogar agora</button>' +
      '</div>';

    scroll.insertBefore(hero, scroll.firstChild);

    var cta = hero.querySelector('#tsx-hero-play');
    if (cta) cta.addEventListener('click', function () {
      var alvo = document.querySelector('.pnl-game-card');
      if (alvo) alvo.scrollIntoView({ behavior: 'smooth', block: 'center' });
      var play = document.querySelector('.pnl-play-btn');
      if (play && !alvo) play.click();
    });
  }

  // ── 2. Depósito: banner + selos nos valores rápidos ───────────────────────
  var TAGS = {
    '20':   ['MÍNIMO',    'min'],
    '30':   ['BOM',       'bom'],
    '50':   ['ÓTIMO',     'otimo'],
    '100':  ['EXCELENTE', 'exc'],
    '500':  ['SUPER',     'super'],
    '1000': ['SUPER',     'super']
  };

  function melhorarDeposito() {
    var step = document.getElementById('dep-step1');
    if (!step) return;

    if (!step.querySelector('.tsx-dep-banner')) {
      var b = document.createElement('div');
      b.className = 'tsx-dep-banner';
      b.innerHTML =
        '<img src="images/dep-promo.jpg" alt="Quanto maior seu depósito, maiores suas chances">' +
        '<div class="tsx-dep-copy">' +
          '<b>Quanto <em>maior</em><br>seu depósito,<br>maiores as chances</b>' +
          '<small>Depósito seguro • Crédito na hora • Saque via PIX</small>' +
        '</div>';
      step.insertBefore(b, step.firstChild);
    }

    if (!step.querySelector('.tsx-first-dep')) {
      var fd = document.createElement('div');
      fd.className = 'tsx-first-dep';
      fd.innerHTML =
        '<span class="tsx-fd-ico">' + GIFT + '</span>' +
        '<span>Promoção de <b>1º depósito</b>: bônus liberado automaticamente assim que o PIX for confirmado.</span>';
      var promo = document.getElementById('dep-promo-banner');
      if (promo && promo.nextSibling) step.insertBefore(fd, promo.nextSibling);
      else step.insertBefore(fd, step.firstChild);
    }

    var row = document.getElementById('dep-quick-row');
    if (!row || row.getAttribute('data-tsx') === '1') return;
    row.setAttribute('data-tsx', '1');
    var quicks = row.querySelectorAll('.pnl-quick');
    Array.prototype.forEach.call(quicks, function (btn) {
      var v = String(btn.getAttribute('data-dep') || '').replace(/\D/g, '');
      var t = TAGS[v];
      if (t) { btn.setAttribute('data-tag', t[0]); btn.setAttribute('data-tone', t[1]); }
    });
  }

  // ── 3. Notificação de promoção de 1º depósito ─────────────────────────────
  function toastPromo() {
    if (document.getElementById('tsx-promo-toast')) return;
    try { if (sessionStorage.getItem('tsx_promo_visto') === '1') return; } catch (e) {}

    var t = document.createElement('div');
    t.id = 'tsx-promo-toast';
    t.className = 'tsx-promo-toast';
    t.innerHTML =
      '<button class="tsx-pt-x" aria-label="Fechar">×</button>' +
      '<span class="tsx-pt-ico">' + GIFT + '</span>' +
      '<div><div class="tsx-pt-t">Bônus de 1º depósito ativo</div>' +
      '<div>Deposite agora e receba o bônus na hora.</div></div>' +
      '<button class="tsx-pt-cta">Depositar</button>';
    document.body.appendChild(t);
    requestAnimationFrame(function () { t.classList.add('show'); });

    function fechar() {
      t.classList.remove('show');
      try { sessionStorage.setItem('tsx_promo_visto', '1'); } catch (e) {}
      setTimeout(function () { t.remove(); }, 500);
    }
    t.querySelector('.tsx-pt-x').onclick = fechar;
    t.querySelector('.tsx-pt-cta').onclick = function () {
      fechar();
      var d = document.getElementById('btn-depositar') || document.getElementById('psd-btn-depositar');
      if (d) d.click();
    };
    setTimeout(function () { if (document.body.contains(t)) fechar(); }, 12000);
  }

  // ── 4. Observa a SPA e reaplica quando as telas são montadas ──────────────
  function aplicar() {
    var painel = document.getElementById('page-painel');
    if (painel && painel.innerHTML.trim()) {
      montarHero();
      melhorarDeposito();
      var modal = document.getElementById('modal-deposito');
      if (modal && !modal.classList.contains('hidden')) melhorarDeposito();
      if (!aplicar._toast) { aplicar._toast = true; setTimeout(toastPromo, 2500); }
    }
  }

  function iniciar() {
    aplicar();
    var tmr = null;
    var obs = new MutationObserver(function () {
      if (tmr) return;
      tmr = setTimeout(function () { tmr = null; aplicar(); }, 150);
    });
    obs.observe(document.getElementById('app') || document.body, { childList: true, subtree: true });
    window.addEventListener('hashchange', function () { setTimeout(aplicar, 120); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
