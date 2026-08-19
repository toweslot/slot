// ─── Tutorial Tower Slot ──────────────────────────────────────────────────────
// Fluxo:
//  1. Usuario se cadastra  -> flag "ts_tutorial_pendente"
//  2. Ao abrir o painel    -> card "JOGUE GRATIS / TUTORIAL"
//  3. Jogo em modo demo    -> balloes guiados (barra, SOLTAR, multiplicador, SACAR)
//  4. Fim da demo          -> convite para depositar e jogar valendo
(function () {
  'use strict';

  var K_FEITO    = 'ts_tutorial_feito';
  var K_PENDENTE = 'ts_tutorial_pendente';

  function ls(get, k, v) {
    try { return get ? localStorage.getItem(k) : localStorage.setItem(k, v); }
    catch (e) { return null; }
  }

  function marcarPendente()  { ls(false, K_PENDENTE, '1'); }
  function limparPendente()  { try { localStorage.removeItem(K_PENDENTE); } catch (e) {} }
  function marcarFeito()     { ls(false, K_FEITO, '1'); limparPendente(); }
  function jaFez()           { return ls(true, K_FEITO) === '1'; }
  function pendente()        { return ls(true, K_PENDENTE) === '1' && !jaFez(); }

  // ── Estilos (injetados uma vez) ────────────────────────────────────────────
  function css() {
    if (document.getElementById('ts-tut-css')) return;
    var st = document.createElement('style');
    st.id = 'ts-tut-css';
    st.textContent = [
      '#ts-tut-intro{position:fixed;inset:0;z-index:100010;background:rgba(4,2,12,.88);backdrop-filter:blur(6px);',
      'display:flex;align-items:center;justify-content:center;padding:18px;font-family:inherit}',
      '.ts-tut-card{width:100%;max-width:360px;background:linear-gradient(165deg,#160a2b 0%,#0c0618 100%);',
      'border:1px solid rgba(255,255,255,.10);border-radius:24px;padding:18px;text-align:center;color:#fff;',
      'box-shadow:0 30px 80px rgba(0,0,0,.7);animation:tsTutIn .45s cubic-bezier(.34,1.56,.64,1) both}',
      '@keyframes tsTutIn{0%{opacity:0;transform:scale(.9) translateY(16px)}100%{opacity:1;transform:none}}',
      '.ts-tut-banner{width:100%;border-radius:16px;background:radial-gradient(circle at 50% 30%,#2a1250,#120826);',
      'padding:14px 10px;margin-bottom:14px}',
      '.ts-tut-banner img{width:100%;max-width:230px;display:block;margin:0 auto;object-fit:contain;',
      'filter:drop-shadow(0 8px 18px rgba(0,0,0,.55))}',
      '.ts-tut-badge{display:inline-block;padding:5px 14px;border-radius:999px;font-size:11px;font-weight:800;',
      'letter-spacing:1.2px;color:#00e07a;background:rgba(0,224,122,.12);border:1px solid rgba(0,224,122,.35)}',
      '.ts-tut-txt{font-size:15px;line-height:1.55;color:rgba(255,255,255,.82);margin:12px 4px 16px;font-weight:600}',
      '.ts-tut-btn{width:100%;border:none;cursor:pointer;font-family:inherit;font-weight:900;font-size:15px;',
      'padding:15px;border-radius:14px;letter-spacing:.6px;text-transform:uppercase}',
      '.ts-tut-btn.p{background:linear-gradient(180deg,#22e07e,#0fa85a);color:#04250f;',
      'box-shadow:0 10px 26px rgba(20,200,110,.4);animation:tsTutPulse 1.8s infinite}',
      '@keyframes tsTutPulse{0%,100%{box-shadow:0 10px 26px rgba(20,200,110,.4),0 0 0 0 rgba(34,224,126,.6)}',
      '50%{box-shadow:0 10px 26px rgba(20,200,110,.5),0 0 0 12px rgba(34,224,126,0)}}',
      '.ts-tut-btn.s{background:transparent;color:rgba(255,255,255,.6);border:1px solid rgba(255,255,255,.16);margin-top:9px}',
      '#ts-coach{position:fixed;inset:0;z-index:2500;pointer-events:none}',
      '#ts-coach-spot{position:absolute;border-radius:18px;border:2px solid #ffd54f;',
      'box-shadow:0 0 0 9999px rgba(3,2,10,.62),0 0 26px rgba(255,213,79,.65);transition:all .3s ease}',
      '#ts-coach-bubble{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);',
      'max-width:min(420px,92vw);width:min(420px,92vw);max-height:70vh;overflow:auto;',
      'background:rgba(14,10,26,.97);border:1px solid rgba(255,213,79,.35);border-radius:20px;',
      'padding:20px 20px 16px;color:#fff;font-size:clamp(15px,4.2vw,18px);line-height:1.55;font-weight:600;',
      'text-align:center;pointer-events:auto;z-index:3;',
      'box-shadow:0 24px 70px rgba(0,0,0,.75);animation:tsTutIn .3s ease both}',
      '#ts-coach-dim{position:fixed;inset:0;background:rgba(3,2,10,.55);backdrop-filter:blur(2px);z-index:1}',
      '#ts-coach-spot{z-index:2}',
      '.ts-coach-step{display:block;font-size:11px;font-weight:900;letter-spacing:1.4px;color:#ffd54f;',
      'text-transform:uppercase;margin-bottom:8px;opacity:.9}',
      '#ts-coach-bubble b{color:#ffd54f}',
      '.ts-coach-next{margin-top:16px;display:block;width:100%;background:linear-gradient(180deg,#ffe083,#ffc82e);',
      'color:#3b2600;border:none;border-radius:14px;padding:14px 20px;font-weight:900;font-size:15px;',
      'cursor:pointer;font-family:inherit;text-transform:uppercase;letter-spacing:.8px;',
      'box-shadow:0 10px 24px rgba(255,200,46,.35)}',
      '.ts-coach-skip{display:block;margin:12px auto 0;background:none;border:none;color:rgba(255,255,255,.5);',
      'font-size:12px;text-decoration:underline;cursor:pointer;font-family:inherit}'
    ].join('');
    document.head.appendChild(st);
  }

  // ── 1) Card de intro (aparece no painel do novato) ─────────────────────────
  function mostrarIntro(opts) {
    css();
    if (document.getElementById('ts-tut-intro')) return;
    var o = opts || {};
    var wrap = document.createElement('div');
    wrap.id = 'ts-tut-intro';
    wrap.innerHTML =
      '<div class="ts-tut-card">' +
        '<div class="ts-tut-banner"><img src="images/tower-slot-logo.png" alt="Tower Slot"></div>' +
        '<span class="ts-tut-badge">TUTORIAL</span>' +
        '<div class="ts-tut-txt">Teste o jogo <b style="color:#22e07e">de gra&ccedil;a</b> e aprenda em 30 segundos como encaixar as pe&ccedil;as, multiplicar o valor e sacar no PIX.</div>' +
        '<button class="ts-tut-btn p" id="ts-tut-go">Jogar gr&aacute;tis</button>' +
        '<button class="ts-tut-btn s" id="ts-tut-skip">Pular tutorial</button>' +
      '</div>';
    document.body.appendChild(wrap);

    document.getElementById('ts-tut-go').onclick = function () {
      wrap.remove();
      iniciarDemoTutorial(o);
    };
    document.getElementById('ts-tut-skip').onclick = function () {
      wrap.remove();
      marcarFeito();
    };
  }

  function iniciarDemoTutorial(o) {
    var cfg = o || {};
    try {
      sessionStorage.setItem('partida_atual', JSON.stringify({
        partida_id: 'demo',
        valor_entrada: cfg.valor_entrada || 5,
        valor_meta: (cfg.valor_entrada || 5) * 7,
        valor_por_plataforma: 0.5,
        dificuldade: 'facil',
        modo_demo: true,
        tutorial: true,
        multiplicador_inicial: cfg.multiplicador_inicial || 1,
        multiplicador_incremento: cfg.multiplicador_incremento || 0.2,
        multiplicador_max: cfg.multiplicador_max || 0,
        min_acertos_saque: cfg.min_acertos_saque || 5
      }));
    } catch (e) {}
    limparPendente();
    if (typeof navigate === 'function') navigate('#jogo');
    else window.location.hash = '#jogo';
  }

  // ── 2) Coach dentro do jogo ────────────────────────────────────────────────
  var coach = { ativo: false, minAcertos: 5, passo: 0 };

  function layer() {
    var el = document.getElementById('ts-coach');
    if (!el) {
      el = document.createElement('div');
      el.id = 'ts-coach';
      el.innerHTML = '<div id="ts-coach-dim" style="display:none"></div>' +
        '<div id="ts-coach-spot" style="display:none"></div><div id="ts-coach-bubble" style="display:none"></div>';
      document.body.appendChild(el);
    }
    return el;
  }

  function esconderBalao() {
    var b = document.getElementById('ts-coach-bubble');
    var s = document.getElementById('ts-coach-spot');
    var d = document.getElementById('ts-coach-dim');
    if (b) b.style.display = 'none';
    if (s) s.style.display = 'none';
    if (d) d.style.display = 'none';
  }

  // texto, seletor do alvo, botao "entendi" (ou null = fecha sozinho)
  function balao(texto, seletor, comBotao, posicao) {
    if (!coach.ativo) return;
    css(); layer();
    var b = document.getElementById('ts-coach-bubble');
    var s = document.getElementById('ts-coach-spot');
    var alvo = seletor ? document.querySelector(seletor) : null;

    if (alvo) {
      var r = alvo.getBoundingClientRect();
      s.style.display = 'block';
      s.style.left   = (r.left - 8) + 'px';
      s.style.top    = (r.top - 8) + 'px';
      s.style.width  = (r.width + 16) + 'px';
      s.style.height = (r.height + 16) + 'px';
    } else {
      s.style.display = 'none';
    }

    var d = document.getElementById('ts-coach-dim');
    if (d) d.style.display = 'block';

    coach.passo = coach.passo || 1;
    b.style.display = 'block';
    b.innerHTML =
      '<span class="ts-coach-step">Tutorial &bull; passo ' + coach.passo + '</span>' +
      '<div>' + texto + '</div>' +
      (comBotao ? '<button class="ts-coach-next" id="ts-coach-next">Entendi, continuar</button>' : '') +
      '<button class="ts-coach-skip" id="ts-coach-skip">pular tutorial</button>';

    var nx = document.getElementById('ts-coach-next');
    if (nx) nx.onclick = function () {
      esconderBalao();
      if (coach.passo === 1 && coach.onNext) coach.onNext();
      else if (coach.passo === 2 && coach.onNext2) coach.onNext2();
    };
    document.getElementById('ts-coach-skip').onclick = function () { pararCoach(); marcarFeito(); };
  }

  function iniciarCoach(opts) {
    coach.ativo = true;
    coach.minAcertos = (opts && opts.minAcertos) || 5;
    coach.passo = 0;
    css(); layer();

    coach.onNext = function () {
      coach.passo = 2;
      balao('A pe&ccedil;a fica balan&ccedil;ando na grua. Toque em <b>SOLTAR</b> no momento em que ela estiver alinhada com o topo da torre.<br><br>Encaixou? Voc&ecirc; ganha um <b>acerto</b> e o multiplicador sobe.',
        '#btn-soltar', true);
    };
    coach.onNext2 = function () {
      coach.passo = 3;
      balao('Depois de <b>' + coach.minAcertos + ' acertos</b> o bot&atilde;o <b>SACAR AGORA</b> libera.<br><br>A&iacute; voc&ecirc; escolhe: sacar o valor multiplicado ou continuar subindo. Se a torre cair antes, a aposta &eacute; perdida.',
        '#btn-resgatar', false);
      setTimeout(esconderBalao, 6000);
    };
    coach.passo = 1;
    balao('Aqui em cima ficam o seu <b>valor acumulado</b> e o <b>multiplicador</b> da rodada.<br><br>Cada pe&ccedil;a encaixada aumenta os dois.',
      '#hud-container', true);
  }

  function coachAcerto(n, mult) {
    if (!coach.ativo) return;
    if (n === 1) {
      balao('Perfeito! Seu valor agora est&aacute; em <b>' + (mult || 'x1,20') + '</b>. Continue soltando as pe&ccedil;as para multiplicar mais.',
        '#hud-acumulado', false);
      setTimeout(esconderBalao, 4000);
    } else if (n > 0 && n < coach.minAcertos) {
      balao('Faltam <b>' + (coach.minAcertos - n) + '</b> acerto(s) para liberar o <b>SACAR AGORA</b>.', null, false);
      setTimeout(esconderBalao, 2600);
    }
  }

  function coachLiberado(valorTexto) {
    if (!coach.ativo) return;
    balao('<b>Saque liberado!</b> Toque em <b>SACAR AGORA</b> para garantir ' + (valorTexto || 'o valor') +
      '.<br><br>Quer arriscar mais? Continue soltando &mdash; mas se a torre cair, a aposta &eacute; perdida.', '#btn-resgatar', false);
    setTimeout(esconderBalao, 7000);
  }

  function coachFim() {
    if (!coach.ativo) return;
    pararCoach();
    marcarFeito();
  }

  function pararCoach() {
    coach.ativo = false;
    var el = document.getElementById('ts-coach');
    if (el) el.remove();
  }

  window.TutorialTS = {
    marcarPendente: marcarPendente,
    marcarFeito: marcarFeito,
    pendente: pendente,
    jaFez: jaFez,
    mostrarIntro: mostrarIntro,
    iniciarDemoTutorial: iniciarDemoTutorial,
    iniciarCoach: iniciarCoach,
    coachAcerto: coachAcerto,
    coachLiberado: coachLiberado,
    coachFim: coachFim,
    pararCoach: pararCoach,
    ativo: function () { return coach.ativo; }
  };
})();
