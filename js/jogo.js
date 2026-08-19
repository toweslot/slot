// "?"? Pagina do Jogo ?" mecanica de resgate livre "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?
// Nova mecanica:
//  ? Plataformas infinitas ?" o jogo nao para por numero de plataformas
//  ? Cada plataforma = valor_por_plataforma (fixo, configurado no admin)
//  ? Meta = valor_entrada - multiplicador ?" indica quando o botao de resgate aparece
//  ? Jogador ESCOLHE quando parar clicando em "Resgatar"
//  ? Se morrer sem resgatar: perde o valor de entrada

function renderJogo(container) {
  // Ler dificuldade e flag influencer ANTES de montar o HTML
  let _difInicial = 'normal';
  let _infInicial = 0;
  let _kcoInicial = '';
  let _miInicial = 1, _mcInicial = 0.2, _mxInicial = 0;
  try {
    const _p = JSON.parse(sessionStorage.getItem('partida_atual'));
    if (_p && _p.dificuldade) _difInicial = _p.dificuldade;
    if (_p && _p.is_influencer) _infInicial = 1;
    if (_p && _p.killer_chance_override !== null && _p.killer_chance_override !== undefined) {
      _kcoInicial = String(_p.killer_chance_override);
    }
    if (_p && parseFloat(_p.multiplicador_inicial) > 0) _miInicial = parseFloat(_p.multiplicador_inicial);
    if (_p && parseFloat(_p.multiplicador_incremento) > 0) _mcInicial = parseFloat(_p.multiplicador_incremento);
    if (_p && parseFloat(_p.multiplicador_max) > 0) _mxInicial = parseFloat(_p.multiplicador_max);
  } catch (_e) {}

  container.innerHTML = `
    <div id="jogo-wrapper" style="position:relative;width:100%;height:100vh;overflow:hidden;background:#0a0a1a">

      <!-- iframe do jogo (src ja inclui dificuldade e config de multiplicador) -->
      <iframe id="game-iframe" src="jogo/index.html?dif=${encodeURIComponent(_difInicial)}&inf=${_infInicial}&mi=${_miInicial}&mc=${_mcInicial}&mx=${_mxInicial}${_kcoInicial !== '' ? '&kco=' + encodeURIComponent(_kcoInicial) : ''}"
        style="width:100%;height:100%;border:none;display:block"
        allow="accelerometer; autoplay"
        title="Game">
      </iframe>

      <!-- HUD overlay -->
      <div id="hud-container" style="
        position:fixed;top:0;left:0;right:0;z-index:1000;
        background:linear-gradient(180deg,rgba(0,0,0,.85) 0%,transparent 100%);
        padding:12px 16px 20px;
        display:none;
      ">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap">

          <!-- Aposta e meta -->
          <div style="display:flex;flex-direction:column;gap:2px">
            <div style="font-size:11px;color:rgba(255,255,255,.5);text-transform:uppercase;letter-spacing:.5px">Aposta</div>
            <div id="hud-aposta" style="font-size:16px;font-weight:800;color:#fff">R$ 0,00</div>
          </div>

          <!-- Progresso central -->
          <div style="flex:1;max-width:360px;text-align:center">
            <div style="display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:5px">
              <div id="hud-acumulado" style="font-size:20px;font-weight:800;color:#00C97A;transition:all .2s">R$ 0,00</div>
              <div style="font-size:12px;color:rgba(255,255,255,.4)">|</div>
              <div id="hud-meta" style="font-size:14px;color:rgba(255,255,255,.6)">x1,00</div>
            </div>
            <!-- Barra de progresso -->
            <div style="background:rgba(255,255,255,.1);border-radius:50px;height:6px;overflow:hidden">
              <div id="hud-barra" style="height:100%;border-radius:50px;background:linear-gradient(90deg,#00C97A,#FFD700);width:0%;transition:width .3s ease"></div>
            </div>
            <div id="hud-plat" style="font-size:11px;color:rgba(255,255,255,.4);margin-top:4px">0 acertos</div>
          </div>

          <!-- Multiplicador e botao sair -->
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px">
            <div style="font-size:11px;color:rgba(255,255,255,.5);text-transform:uppercase;letter-spacing:.5px">Multiplicador</div>
            <div id="hud-meta-label" style="font-size:16px;font-weight:800;color:#FFD700">x1,00</div>
            <button onclick="voltarPainel()" style="
              background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);
              border-radius:8px;padding:4px 10px;color:rgba(255,255,255,.5);
              font-size:11px;cursor:pointer;font-family:inherit
            ">Sair</button>
          </div>
        </div>
      </div>

      <!-- Painel inferior: SACAR AGORA + SOLTAR -->
      <div id="dock" style="
        display:none;position:fixed;left:0;right:0;bottom:0;z-index:2000;
        flex-direction:column;gap:8px;
        padding:16px 14px calc(16px + env(safe-area-inset-bottom,0px));
        background:linear-gradient(180deg,rgba(10,10,26,0) 0%,rgba(10,10,26,.92) 30%,#0a0a1a 100%);
        border-top:3px solid transparent;
        border-image:repeating-linear-gradient(45deg,#FFC107 0 12px,#151515 12px 24px) 1;
      ">
        <button id="btn-resgatar" onclick="executarResgate()" style="
          width:100%;border:none;border-radius:16px;cursor:pointer;font-family:inherit;
          padding:12px 18px;color:#fff;opacity:.45;pointer-events:none;
          background:linear-gradient(180deg,#3aa0ff,#1565c0);
          box-shadow:inset 0 2px 0 rgba(255,255,255,.35),0 6px 18px rgba(0,0,0,.45);
        ">
          <span style="display:block;font-size:20px;font-weight:900;letter-spacing:1px;text-shadow:0 2px 4px rgba(0,0,0,.45)">SACAR AGORA</span>
          <span id="btn-resgatar-valor" style="display:block;font-size:16px;font-weight:800;margin-top:2px;opacity:.95">R$ 0,00</span>
        </button>
        <div id="btn-resgatar-hint" style="
          font-size:11px;color:rgba(255,255,255,.55);text-align:center;
        ">Saque liberado apos 5 acertos</div>
        <button id="btn-soltar" onclick="soltarPeca()" style="
          width:100%;border:none;border-radius:16px;cursor:pointer;font-family:inherit;
          padding:16px 18px;font-size:24px;font-weight:900;letter-spacing:1.5px;color:#3b2600;
          background:linear-gradient(180deg,#ffd54f,#f5a300);
          box-shadow:inset 0 2px 0 rgba(255,255,255,.5),0 6px 18px rgba(0,0,0,.45);
          text-transform:uppercase;
        ">Soltar</button>
      </div>

      <!-- Tela de carregamento -->
      <div id="tela-loading" style="
        position:fixed;inset:0;z-index:3000;
        background:radial-gradient(ellipse at 50% 40%, #1a0040 0%, #0a0a1a 70%);
        display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0;
        overflow:hidden;
      ">
        <!-- Orbs de fundo -->
        <div style="position:absolute;width:340px;height:340px;border-radius:50%;
          background:radial-gradient(circle,rgba(100,0,255,0.18) 0%,transparent 70%);
          top:50%;left:50%;transform:translate(-50%,-60%);pointer-events:none"></div>
        <div style="position:absolute;width:220px;height:220px;border-radius:50%;
          background:radial-gradient(circle,rgba(255,107,157,0.13) 0%,transparent 70%);
          top:50%;left:50%;transform:translate(-30%,-30%);pointer-events:none"></div>

        <!-- Logo animado -->
        <div style="position:relative;width:88px;height:88px;margin-bottom:32px">
          <!-- Anel externo -->
          <svg viewBox="0 0 88 88" style="position:absolute;inset:0;width:100%;height:100%;animation:ldRingSpin 1.4s linear infinite">
            <circle cx="44" cy="44" r="38" fill="none" stroke="rgba(255,107,157,0.18)" stroke-width="4"/>
            <circle cx="44" cy="44" r="38" fill="none" stroke="url(#ldGrad1)" stroke-width="4"
              stroke-linecap="round" stroke-dasharray="60 180" stroke-dashoffset="0"/>
            <defs>
              <linearGradient id="ldGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#FF6B9D"/>
                <stop offset="100%" stop-color="#a855f7"/>
              </linearGradient>
            </defs>
          </svg>
          <!-- Anel interno -->
          <svg viewBox="0 0 88 88" style="position:absolute;inset:0;width:100%;height:100%;animation:ldRingSpin 0.9s linear infinite reverse">
            <circle cx="44" cy="44" r="26" fill="none" stroke="rgba(168,85,247,0.15)" stroke-width="3"/>
            <circle cx="44" cy="44" r="26" fill="none" stroke="url(#ldGrad2)" stroke-width="3"
              stroke-linecap="round" stroke-dasharray="30 120" stroke-dashoffset="0"/>
            <defs>
              <linearGradient id="ldGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#a855f7"/>
                <stop offset="100%" stop-color="#00C97A"/>
              </linearGradient>
            </defs>
          </svg>
          <!-- Icone central -->
          <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center">
            <svg viewBox="0 0 32 32" fill="none" width="32" height="32" style="animation:ldPulse 1.8s ease-in-out infinite">
              <circle cx="16" cy="16" r="14" stroke="rgba(255,255,255,0.12)" stroke-width="2"/>
              <path d="M16 2a17 17 0 0 1 5 14 17 17 0 0 1-5 14 17 17 0 0 1-5-14A17 17 0 0 1 16 2z"
                stroke="#FF6B9D" stroke-width="2" stroke-linecap="round"/>
              <line x1="2" y1="16" x2="30" y2="16" stroke="#FF6B9D" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
        </div>

        <!-- Texto principal -->
        <div style="font-size:20px;font-weight:800;color:#fff;letter-spacing:-0.3px;margin-bottom:10px;text-align:center">
          Preparando partida...
        </div>

        <!-- Subtitulo dinamico -->
        <div id="loading-msg" style="font-size:14px;color:rgba(255,255,255,0.42);font-weight:500;text-align:center;margin-bottom:36px">
          Aguarde
        </div>

        <!-- Barra de progresso animada -->
        <div style="width:180px;height:3px;background:rgba(255,255,255,0.08);border-radius:50px;overflow:hidden">
          <div style="height:100%;border-radius:50px;
            background:linear-gradient(90deg,#FF6B9D,#a855f7,#00C97A);
            background-size:200% 100%;
            animation:ldShimmer 1.5s ease-in-out infinite">
          </div>
        </div>

        <style>
          @keyframes ldRingSpin { to { transform: rotate(360deg); } }
          @keyframes ldPulse {
            0%,100% { opacity:1; transform:scale(1); }
            50%      { opacity:0.6; transform:scale(0.88); }
          }
          @keyframes ldShimmer {
            0%   { background-position: 200% 0; width:0%; }
            50%  { width:100%; }
            100% { background-position: -200% 0; width:0%; }
          }
        </style>
      </div>

      <!-- Tela de resultado -->
      <div id="tela-resultado" style="
        position:fixed;inset:0;z-index:3000;display:none;
        align-items:center;justify-content:center;
        background:rgba(0,0,0,.88);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);
        padding:20px;
      ">
        <div id="resultado-card" style="
          background:linear-gradient(160deg,#13001f 0%,#1e003a 100%);
          border-radius:28px;padding:0;
          max-width:360px;width:100%;text-align:center;
          border:1.5px solid transparent;
          box-shadow:0 32px 80px rgba(0,0,0,.7);
          overflow:hidden;
          animation:resCardIn .45s cubic-bezier(.34,1.56,.64,1) both;
        ">
          <!-- Faixa topo colorida -->
          <div id="resultado-topo" style="padding:28px 28px 20px;position:relative;">
            <!-- Icone com glow -->
            <div id="resultado-icon-wrap" style="
              width:72px;height:72px;border-radius:50%;margin:0 auto 14px;
              display:flex;align-items:center;justify-content:center;
              font-size:36px;
            "></div>
            <div id="resultado-titulo" style="font-size:22px;font-weight:900;letter-spacing:.5px;margin-bottom:6px"></div>
            <div id="resultado-subtitulo" style="font-size:13px;color:rgba(255,255,255,.55);line-height:1.5"></div>
          </div>

          <!-- Valor principal -->
          <div id="resultado-valor-wrap" style="
            margin:0 20px 16px;border-radius:16px;padding:16px 20px;
          ">
            <div style="font-size:11px;font-weight:700;letter-spacing:.08em;opacity:.7;margin-bottom:6px" id="resultado-valor-label"></div>
            <div id="resultado-valor" style="font-size:38px;font-weight:900;line-height:1"></div>
          </div>

          <!-- Info -->
          <div style="padding:0 24px 20px">
            <div id="resultado-plat" style="font-size:12px;color:rgba(255,255,255,.45);margin-bottom:6px"></div>
            <div id="resultado-saldo" style="
              font-size:13px;font-weight:600;color:rgba(255,255,255,.65);
              background:rgba(255,255,255,.06);border-radius:10px;
              padding:8px 14px;margin-top:10px;
            "></div>
          </div>

          <!-- Botoes -->
          <div style="padding:0 20px 24px;display:flex;gap:10px">
            <button onclick="jogarNovamente()" style="
              flex:1;background:linear-gradient(135deg,#FF6B9D,#c026d3);
              color:#fff;border:none;border-radius:50px;
              padding:14px 0;font-size:14px;font-weight:800;
              cursor:pointer;font-family:inherit;letter-spacing:.3px;
              box-shadow:0 4px 20px rgba(255,107,157,.4);
              display:flex;align-items:center;justify-content:center;gap:8px;
              transition:transform .15s,box-shadow .15s;
            " onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform=''">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              Jogar Novamente
            </button>
            <button onclick="voltarPainel()" style="
              background:rgba(255,255,255,.08);border:1.5px solid rgba(255,255,255,.15);
              color:rgba(255,255,255,.75);border-radius:50px;
              padding:14px 20px;font-size:14px;font-weight:700;
              cursor:pointer;font-family:inherit;
              display:flex;align-items:center;justify-content:center;gap:6px;
              transition:background .15s;
            " onmouseover="this.style.background='rgba(255,255,255,.14)'" onmouseout="this.style.background='rgba(255,255,255,.08)'">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="15" height="15"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              Painel
            </button>
          </div>
        </div>
      </div>

      <!-- Confetti canvas -->
      <canvas id="confetti-canvas" style="position:fixed;inset:0;z-index:3500;pointer-events:none;display:none"></canvas>

    </div>

    <style>
      @keyframes pulseGold {
        0%,100% { transform:translateX(-50%) scale(1);    box-shadow:0 0 30px rgba(255,215,0,.6),0 4px 20px rgba(0,0,0,.4); }
        50%      { transform:translateX(-50%) scale(1.04); box-shadow:0 0 50px rgba(255,215,0,.9),0 4px 24px rgba(0,0,0,.5); }
      }
      @keyframes pulseAzul {
        0%,100% { box-shadow:inset 0 2px 0 rgba(255,255,255,.35),0 0 0 rgba(58,160,255,0),0 6px 18px rgba(0,0,0,.45); }
        50%      { box-shadow:inset 0 2px 0 rgba(255,255,255,.35),0 0 26px rgba(58,160,255,.75),0 6px 18px rgba(0,0,0,.45); }
      }
      #btn-soltar:active { transform:scale(.97) }
      #btn-resgatar:active { transform:scale(.98) }
      @keyframes jogoPopIn {
        from { transform:scale(.85); opacity:0; }
        to   { transform:scale(1);  opacity:1; }
      }
      @keyframes resCardIn {
        from { transform:scale(.75) translateY(30px); opacity:0; }
        to   { transform:scale(1)   translateY(0);    opacity:1; }
      }
      @keyframes iconPop {
        0%   { transform:scale(0) rotate(-20deg); }
        70%  { transform:scale(1.25) rotate(5deg); }
        100% { transform:scale(1) rotate(0deg); }
      }
      @keyframes slideDown {
        from { transform:translateY(-20px); opacity:0; }
        to   { transform:translateY(0);     opacity:1; }
      }
    </style>
  `;

  // "?"? Expor funcoes globais necessarias pelos botoes inline "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?
  window.executarResgate = executarResgate;
  window.jogarNovamente  = jogarNovamente;
  window.voltarPainel    = voltarPainel;
  window.soltarPeca      = soltarPeca;

  // "?"? Estado da partida "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?
  let partida            = null;
  let plataformasPassadas = 0;
  let valorAcumulado      = 0;
  let metaAtingida        = false;
  let resgatou            = false;
  let partidaFinalizada   = false;

  // "?"? Carregar dados da partida do sessionStorage "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?
  try {
    partida = JSON.parse(sessionStorage.getItem('partida_atual'));
  } catch {}

  if (!partida?.partida_id) {
    document.getElementById('loading-msg').textContent = 'Nenhuma partida ativa. Voltando...';
    setTimeout(voltarPainel, 2000);
    return;
  }

  const {
    partida_id,
    valor_entrada,
    valor_meta,
    valor_por_plataforma,
    dificuldade,
    modo_demo,
    is_influencer,
    killer_chance_override,
  } = partida;

  const IS_DEMO = !!modo_demo;
  const dificuladadeAtiva = dificuldade || 'normal';

  // Regras de multiplicador (configuraveis no painel admin)
  const MULT_INI = parseFloat(partida.multiplicador_inicial) > 0 ? parseFloat(partida.multiplicador_inicial) : 1;
  const MULT_INC = parseFloat(partida.multiplicador_incremento) > 0 ? parseFloat(partida.multiplicador_incremento) : 0.2;
  const MULT_MAX = parseFloat(partida.multiplicador_max) > 0 ? parseFloat(partida.multiplicador_max) : 0;
  const MIN_ACERTOS = parseInt(partida.min_acertos_saque, 10) > 0 ? parseInt(partida.min_acertos_saque, 10) : 5;

  function multPara(n) {
    let m = MULT_INI + n * MULT_INC;
    if (MULT_MAX > 0) m = Math.min(m, MULT_MAX);
    return parseFloat(m.toFixed(2));
  }
  function valorPara(n) {
    if (n <= 0) return 0;
    return parseFloat((parseFloat(valor_entrada) * multPara(n)).toFixed(2));
  }
  function fmtMult(m) {
    return 'x' + parseFloat(m || 0).toFixed(2).replace('.', ',');
  }

  // Envia comandos para o jogo dentro do iframe
  function enviarAoJogo(msg) {
    const f = document.getElementById('game-iframe');
    if (f && f.contentWindow) { try { f.contentWindow.postMessage(msg, '*'); } catch (_e) {} }
  }
  function soltarPeca() {
    if (partidaFinalizada) return;
    enviarAoJogo({ tipo: 'soltar' });
  }

  // "?"? Configurar gameEvents (comunicacao com o iframe) "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?
  window.gameEvents = {
    onPlataformaPassada:  null,
    onMorreu:             null,
    onMetaAtingida:       null, // nao usado mais, mas mantido por compatibilidade
    metaPlataformas:      999999,   // infinito ?" jogo nunca para por plataformas
    valorPorPlataforma:   parseFloat(valor_por_plataforma),
    valorMeta:            parseFloat(valor_meta),
    dificuldade:          dificuladadeAtiva,
    is_influencer:        is_influencer ? 1 : 0,
    killerChanceOverride: (killer_chance_override !== null && killer_chance_override !== undefined) ? parseFloat(killer_chance_override) : null,
    partidaAtiva:         false,
    _plataformasPassadas: 0,
  };

  // "?"? Ativar a partida apos o iframe carregar "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?
  function ativarPartida() {
    plataformasPassadas = 0;
    valorAcumulado      = 0;
    metaAtingida        = false;
    resgatou            = false;
    partidaFinalizada   = false;

    window.gameEvents._plataformasPassadas = 0;
    window.gameEvents.partidaAtiva         = true;

    // Callback: acerto (peca encaixada)
    window.gameEvents.onPlataformaPassada = (n) => {
      plataformasPassadas = n;
      valorAcumulado      = valorPara(n);
      if (window.TutorialTS && TutorialTS.ativo()) TutorialTS.coachAcerto(n, fmtMult(multPara(n)));
      atualizarHUD(n, valorAcumulado);
      enviarAoJogo({ tipo: 'mult', valor: multPara(n) });

      if (!metaAtingida && n >= MIN_ACERTOS) {
        metaAtingida = true;
        mostrarBotaoResgatar(valorAcumulado);
      } else if (metaAtingida) {
        atualizarBotaoResgatar(valorAcumulado);
      } else {
        atualizarBotaoResgatar(valorAcumulado);
      }
    };

    // Callback: morreu sem resgatar
    window.gameEvents.onMorreu = async () => {
      if (resgatou || partidaFinalizada) return;
      partidaFinalizada              = true;
      window.gameEvents.partidaAtiva = false;
      esconderHUD();
      esconderBotaoResgatar();

      if (IS_DEMO) {
        mostrarModalDemo(valorAcumulado, false);
        return;
      }

      try {
        const res = await API.finalizarPartida(partida_id, plataformasPassadas, false);
        mostrarDerrota(res);
      } catch (e) {
        mostrarDerrota({ saldo_novo: null, valor_ganho_ou_perdido: parseFloat(valor_entrada) });
      }
    };

    // Atualizar HUD
    document.getElementById('hud-container').style.display = 'block';
    if (partida.tutorial && window.TutorialTS && !TutorialTS.jaFez()) {
      setTimeout(() => TutorialTS.iniciarCoach({ minAcertos: MIN_ACERTOS }), 700);
    }
    document.getElementById('dock').style.display = 'flex';
    document.getElementById('hud-aposta').textContent   = IS_DEMO ? 'DEMO' : formatMoney(valor_entrada);
    document.getElementById('hud-meta-label').textContent = fmtMult(MULT_INI);
    document.getElementById('hud-meta').textContent     = fmtMult(MULT_INI);
    atualizarHUD(0, 0);
    enviarAoJogo({ tipo: 'mult', valor: MULT_INI });

    // Esconder loading
    document.getElementById('tela-loading').style.display = 'none';
  }

  // Aguardar iframe carregar, depois ativar
  const iframe = document.getElementById('game-iframe');
  iframe.addEventListener('load', () => setTimeout(ativarPartida, 400));
  // Fallback: se iframe ja carregou
  setTimeout(() => {
    if (!window.gameEvents.partidaAtiva) ativarPartida();
  }, 3000);

  // "?"? HUD "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?
  function atualizarHUD(n, acumulado) {
    const mult = multPara(n);
    const pct  = n >= MIN_ACERTOS
      ? 100
      : Math.min((n / MIN_ACERTOS) * 100, 100);

    document.getElementById('hud-acumulado').textContent = formatMoney(acumulado);
    document.getElementById('hud-meta').textContent      = fmtMult(mult);
    document.getElementById('hud-meta-label').textContent = fmtMult(mult);
    document.getElementById('hud-plat').textContent = n >= MIN_ACERTOS
      ? `${n} acerto${n !== 1 ? 's' : ''} - saque liberado`
      : `${n}/${MIN_ACERTOS} acertos para liberar o saque`;

    // Barra
    const barra = document.getElementById('hud-barra');
    barra.style.width = pct + '%';
    if (pct >= 100) {
      barra.style.background = 'linear-gradient(90deg,#FFD700,#FFA500)';
      document.getElementById('hud-acumulado').style.color = '#FFD700';
    } else if (pct >= 60) {
      barra.style.background = 'linear-gradient(90deg,#00C97A,#FFD700)';
      document.getElementById('hud-acumulado').style.color = '#FFD700';
    } else {
      barra.style.background = 'linear-gradient(90deg,#00C97A,#4D9EFF)';
      document.getElementById('hud-acumulado').style.color = '#00C97A';
    }
  }

  function esconderHUD() {
    document.getElementById('hud-container').style.display = 'none';
    if (window.TutorialTS && TutorialTS.ativo()) TutorialTS.coachFim();
  }

  // "?"? Botao SACAR AGORA "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?
  function mostrarBotaoResgatar(valor) {
    const btn  = document.getElementById('btn-resgatar');
    const hint = document.getElementById('btn-resgatar-hint');
    btn.style.opacity = '1';
    btn.style.pointerEvents = 'auto';
    btn.style.animation = 'jogoPopIn .35s ease, pulseAzul 1.6s ease-in-out .35s infinite';
    hint.textContent = 'Voce pode parar agora e garantir o valor';
    hint.style.color = 'rgba(120,200,255,.9)';
    atualizarBotaoResgatar(valor);
    if (window.TutorialTS && TutorialTS.ativo()) TutorialTS.coachLiberado(formatMoney(valor));
  }

  function atualizarBotaoResgatar(valor) {
    const el = document.getElementById('btn-resgatar-valor');
    if (el) el.textContent = formatMoney(valor);
    if (!metaAtingida) {
      const falta = Math.max(0, MIN_ACERTOS - plataformasPassadas);
      document.getElementById('btn-resgatar-hint').textContent =
        `Saque liberado apos ${MIN_ACERTOS} acertos (faltam ${falta})`;
    }
  }

  function esconderBotaoResgatar() {
    const dock = document.getElementById('dock');
    if (dock) dock.style.display = 'none';
  }

  // "?"? Acao de resgate "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?
  async function executarResgate() {
    if (resgatou || partidaFinalizada) return;
    if (plataformasPassadas < MIN_ACERTOS) {
      alert(`Voce so pode parar depois de ${MIN_ACERTOS} acertos!`);
      return;
    }
    if (valorAcumulado <= 0) {
      alert('Voce ainda nao acumulou nenhum valor! Continue jogando.');
      return;
    }
    resgatou            = true;
    partidaFinalizada   = true;
    window.gameEvents.partidaAtiva = false;
    enviarAoJogo({ tipo: 'pausar' });
    esconderBotaoResgatar();
    esconderHUD();

    if (IS_DEMO) {
      mostrarModalDemo(valorAcumulado, true);
      return;
    }

    try {
      const res = await API.finalizarPartida(partida_id, plataformasPassadas, true);
      mostrarVitoria(res);
    } catch (e) {
      mostrarVitoria({
        saldo_novo: null,
        valor_ganho_ou_perdido: valorAcumulado,
        plataformas_passadas: plataformasPassadas,
      });
    }
  }

  // "?"? Telas de resultado "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?
  function mostrarVitoria(res) {
    const valor = res.valor_ganho_ou_perdido ?? valorAcumulado;
    const plat  = res.plataformas_passadas  ?? plataformasPassadas;

    // Cores de vitoria ?" dourado
    const card = document.getElementById('resultado-card');
    card.style.border = '1.5px solid rgba(255,215,0,.5)';
    card.style.boxShadow = '0 32px 80px rgba(0,0,0,.7), 0 0 60px rgba(255,215,0,.15)';

    const topo = document.getElementById('resultado-topo');
    topo.style.background = 'linear-gradient(160deg,rgba(255,180,0,.12) 0%,rgba(255,215,0,.05) 100%)';

    const iconWrap = document.getElementById('resultado-icon-wrap');
    iconWrap.style.background = 'linear-gradient(135deg,#f59e0b,#fbbf24)';
    iconWrap.style.boxShadow  = '0 0 40px rgba(251,191,36,.5)';
    iconWrap.style.animation  = 'iconPop .55s cubic-bezier(.34,1.56,.64,1) both';
    iconWrap.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="36" height="36"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg>';

    document.getElementById('resultado-titulo').textContent  = 'SAQUE REALIZADO!';
    document.getElementById('resultado-titulo').style.color  = '#fbbf24';
    document.getElementById('resultado-subtitulo').textContent = `Voce fez ${plat} acerto${plat !== 1 ? 's' : ''} e sacou no ${fmtMult(multPara(plat))}!`;

    const vWrap = document.getElementById('resultado-valor-wrap');
    vWrap.style.background = 'linear-gradient(135deg,rgba(251,191,36,.15),rgba(245,158,11,.08))';
    vWrap.style.border     = '1px solid rgba(251,191,36,.25)';
    document.getElementById('resultado-valor-label').textContent = 'VOCE GANHOU';
    document.getElementById('resultado-valor-label').style.color = '#fbbf24';
    document.getElementById('resultado-valor').textContent = `+ ${formatMoney(valor)}`;
    document.getElementById('resultado-valor').style.color = '#fbbf24';

    document.getElementById('resultado-plat').textContent =
      `${formatMoney(valor_entrada)} x ${fmtMult(multPara(plat))} = ${formatMoney(valor)}`;

    const saldoEl = document.getElementById('resultado-saldo');
    saldoEl.textContent = res.saldo_novo != null ? `Novo saldo: ${formatMoney(res.saldo_novo)}` : '';
    saldoEl.style.display = res.saldo_novo != null ? '' : 'none';

    document.getElementById('tela-resultado').style.display = 'flex';
    dispararConfetti();
  }

  function mostrarDerrota(res) {
    const perdido = res.valor_ganho_ou_perdido ?? parseFloat(valor_entrada);
    const acumuladoMsg = metaAtingida
      ? `Voce tinha ${formatMoney(valorAcumulado)} no ${fmtMult(multPara(plataformasPassadas))} mas nao sacou a tempo!`
      : plataformasPassadas > 0
        ? `Voce fez ${plataformasPassadas} acerto${plataformasPassadas !== 1 ? 's' : ''}, precisava de ${MIN_ACERTOS} para poder sacar.`
        : fraseMotivaional();

    // Cores de derrota ?" vermelho-rosa
    const card = document.getElementById('resultado-card');
    card.style.border = '1.5px solid rgba(239,68,68,.45)';
    card.style.boxShadow = '0 32px 80px rgba(0,0,0,.7), 0 0 60px rgba(239,68,68,.12)';

    const topo = document.getElementById('resultado-topo');
    topo.style.background = 'linear-gradient(160deg,rgba(239,68,68,.10) 0%,rgba(30,0,58,.0) 100%)';

    const iconWrap = document.getElementById('resultado-icon-wrap');
    iconWrap.style.background = 'linear-gradient(135deg,#ef4444,#f97316)';
    iconWrap.style.boxShadow  = '0 0 40px rgba(239,68,68,.45)';
    iconWrap.style.animation  = 'iconPop .55s cubic-bezier(.34,1.56,.64,1) both';
    iconWrap.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="36" height="36"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';

    document.getElementById('resultado-titulo').textContent  = 'VOCE PERDEU!';
    document.getElementById('resultado-titulo').style.color  = '#f87171';
    document.getElementById('resultado-subtitulo').textContent = acumuladoMsg;

    const vWrap = document.getElementById('resultado-valor-wrap');
    vWrap.style.background = 'linear-gradient(135deg,rgba(239,68,68,.13),rgba(239,68,68,.05))';
    vWrap.style.border     = '1px solid rgba(239,68,68,.22)';
    document.getElementById('resultado-valor-label').textContent = 'VALOR PERDIDO';
    document.getElementById('resultado-valor-label').style.color = '#f87171';
    document.getElementById('resultado-valor').textContent = `- ${formatMoney(perdido)}`;
    document.getElementById('resultado-valor').style.color = '#f87171';

    document.getElementById('resultado-plat').textContent =
      `${plataformasPassadas} acerto${plataformasPassadas !== 1 ? 's' : ''} - multiplicador ${fmtMult(multPara(plataformasPassadas))}`;

    const saldoEl = document.getElementById('resultado-saldo');
    saldoEl.textContent = res.saldo_novo != null ? `Saldo restante: ${formatMoney(res.saldo_novo)}` : '';
    saldoEl.style.display = res.saldo_novo != null ? '' : 'none';

    document.getElementById('tela-resultado').style.display = 'flex';
  }

  function fraseMotivaional() {
    const frases = [
      'Na proxima voce chega la!',
      'Todo mestre ja foi aprendiz!',
      'Tente novamente, voce consegue!',
      'A vitoria esta pertinho!',
    ];
    return frases[Math.floor(Math.random() * frases.length)];
  }

  // "?"? Acoes dos botoes de resultado "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?
  function jogarNovamente() {
    if (IS_DEMO) {
      // Re-inicia a demo sem sair
      sessionStorage.setItem('partida_atual', JSON.stringify({
        partida_id: 'demo', valor_entrada: 5, valor_meta: 15,
        valor_por_plataforma: 1, dificuldade: 'demo', modo_demo: true,
      }));
      window.location.hash = '#jogo';
      window.location.reload();
      return;
    }
    window.location.hash = '#painel';
  }

  function voltarPainel() {
    sessionStorage.removeItem('partida_atual');
    window.location.hash = IS_DEMO ? '#landing' : '#painel';
  }

  // "?"? Modal Demo "?"? aparece no fim da partida demo "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?
  function mostrarModalDemo(valorGanho, resgatou) {
    const overlay = document.getElementById('tela-resultado');
    const displayValor = valorGanho > 0 ? valorGanho : parseFloat(valor_meta);

    overlay.innerHTML = `
      <div id="demo-modal" style="
        background:linear-gradient(160deg,#13001f 0%,#1e003a 100%);
        border:1.5px solid rgba(255,215,0,.4);
        border-radius:28px; max-width:360px; width:92%;
        text-align:center; overflow:hidden;
        box-shadow:0 32px 80px rgba(0,0,0,.75), 0 0 60px rgba(255,215,0,.12);
        animation:resCardIn .45s cubic-bezier(.34,1.56,.64,1) both;
      ">

        <!-- Topo dourado -->
        <div style="
          background:linear-gradient(160deg,rgba(255,180,0,.14) 0%,rgba(255,215,0,.04) 100%);
          padding:30px 28px 22px; position:relative;
        ">
          <!-- Icone trofeu -->
          <div style="
            width:76px;height:76px;border-radius:50%;margin:0 auto 16px;
            display:flex;align-items:center;justify-content:center;
            background:linear-gradient(135deg,#f59e0b,#fbbf24);
            box-shadow:0 0 40px rgba(251,191,36,.55);
            animation:iconPop .55s cubic-bezier(.34,1.56,.64,1) both;
          ">
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="38" height="38">
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
              <path d="M4 22h16"/>
              <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
              <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
              <path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/>
            </svg>
          </div>

          <div style="font-size:24px;font-weight:900;color:#fbbf24;letter-spacing:.6px;margin-bottom:6px">
            PARAB?NS!
          </div>
          <div style="font-size:13px;color:rgba(255,255,255,.5);line-height:1.5">
            Veja quanto voce poderia ter ganho:
          </div>
        </div>

        <!-- Valor -->
        <div style="
          margin:0 20px 16px;
          background:linear-gradient(135deg,rgba(251,191,36,.14),rgba(245,158,11,.07));
          border:1px solid rgba(251,191,36,.28); border-radius:16px;
          padding:18px 20px;
        ">
          <div style="font-size:11px;font-weight:700;letter-spacing:.1em;color:rgba(251,191,36,.7);margin-bottom:6px;text-transform:uppercase">
            Voce poderia ter ganhado
          </div>
          <div style="font-size:42px;font-weight:900;color:#fbbf24;line-height:1;letter-spacing:1px">
            + ${formatMoney(displayValor)}
          </div>
        </div>

        <!-- Texto CTA -->
        <div style="padding:0 24px 20px;font-size:13px;color:rgba(255,255,255,.6);line-height:1.7">
          Parabens pelo seu desempenho no teste gratis!<br>
          <span style="color:#FF6B9D;font-weight:700">Ganhe 50% de bonus</span> no seu primeiro deposito.<br>
          Comece a ganhar dinheiro de verdade agora!
        </div>

        <!-- Botoes -->
        <div style="padding:0 20px 24px;display:flex;flex-direction:column;gap:10px">
          <button onclick="navigate('#cadastro')" style="
            width:100%;padding:16px;border-radius:50px;border:none;cursor:pointer;
            background:linear-gradient(135deg,#FF6B9D,#c026d3);
            color:#fff;font-size:16px;font-weight:900;letter-spacing:.5px;
            font-family:inherit;text-transform:uppercase;
            box-shadow:0 6px 28px rgba(255,107,157,.50);
            transition:transform .15s,box-shadow .15s;
            display:flex;align-items:center;justify-content:center;gap:10px;
          " onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 10px 36px rgba(255,107,157,.65)'"
             onmouseout="this.style.transform='';this.style.boxShadow='0 6px 28px rgba(255,107,157,.50)'">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <line x1="19" y1="8" x2="19" y2="14"/>
              <line x1="22" y1="11" x2="16" y2="11"/>
            </svg>
            CRIAR CONTA GRATIS
          </button>
        </div>
      </div>
    `;

    overlay.style.display = 'flex';
    overlay.style.background = 'rgba(0,0,0,.75)';
    overlay.style.backdropFilter = 'blur(10px)';

    if (resgatou) dispararConfetti();
  }

  // "?"? Confetti "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?
  function dispararConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    canvas.style.display = 'block';
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    const particles = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      r: Math.random() * 6 + 3,
      color: ['#FFD700','#FFA500','#FF6B9D','#00C97A','#4D9EFF'][Math.floor(Math.random() * 5)],
      speed: Math.random() * 3 + 1,
      wobble: Math.random() * 10,
    }));
    let frames = 0;
    const anim = () => {
      if (++frames > 200) { canvas.style.display = 'none'; return; }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.y += p.speed;
        p.x += Math.sin(frames * 0.05 + p.wobble) * 1.5;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(anim);
    };
    anim();
  }

  // "?"? Helper de formatacao "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?
  function formatMoney(v) {
    return 'R$ ' + parseFloat(v || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  // "?"? Limpeza ao sair da pagina "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?
  return function cleanup() {
    // Remove <style> tags injetadas pelo jogo para nao vazar animacoes globais
    container.querySelectorAll('style').forEach(s => s.remove());
  };
}

