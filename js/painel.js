// "?"?"? Painel Page ?" mobile-first redesign "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?
function renderPainel(el) {
  const user    = API.getUser() || {};
  const inicial = (user.nome || 'U').charAt(0).toUpperCase();

  el.innerHTML = `
    <div class="pnl-root">

      <!-- Ceu animado com nuvens (fundo da plataforma) -->
      <div class="ts-sky light" aria-hidden="true">
        <div class="ts-sky-glow"></div>
        <div class="ts-cloud-layer l3"></div>
        <div class="ts-cloud-layer l2"></div>
        <div class="ts-cloud-layer l1"></div>
        <div class="ts-skyline"></div>
      </div>



      <!-- .. HEADER ...................................................... -->
      <header class="pnl-header">
        <div class="pnl-header-inner">
          <div class="pnl-logo brand-logo-wrap">
            <img class="brand-logo-img" src="" alt="logo" style="display:none;height:32px;object-fit:contain"/>
            <div class="pnl-logo-icon brand-logo-icon">HLX</div>
            <span class="brand-name">Tower Slot</span>
          </div>
          <div class="pnl-header-right">
            <!-- Saldo chip com dropdown -->
            <div class="pnl-saldo-wrap" id="saldo-chip-wrap">
              <div class="pnl-saldo-chip" id="saldo-chip">
                <div class="pnl-saldo-chip-inner">
                  <span class="pnl-saldo-chip-lbl">Saldo</span>
                  <span class="pnl-saldo-chip-val" id="saldo-badge">...</span>
                </div>
                <svg class="saldo-chip-caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" width="10" height="10"><polyline points="6 9 12 15 18 9"/></svg>
              </div>
              <div class="pnl-saldo-drop hidden" id="saldo-drop">
                <div class="psd-arrow"></div>
                <button class="psd-item" id="psd-btn-depositar">
                  <span class="psd-icon psd-icon-green">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="15" height="15"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
                  </span>
                  <div class="psd-text">
                    <span class="psd-label">Depositar</span>
                    <span class="psd-sub">Adicionar saldo via PIX</span>
                  </div>
                </button>
                <div class="psd-divider"></div>
                <button class="psd-item" id="psd-btn-sacar">
                  <span class="psd-icon psd-icon-red">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="15" height="15"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
                  </span>
                  <div class="psd-text">
                    <span class="psd-label">Sacar</span>
                    <span class="psd-sub">Retirar seu saldo</span>
                  </div>
                </button>
              </div>
            </div>
            <div class="pnl-avatar-wrap">
              <div class="pnl-avatar" id="btn-perfil" title="${user.nome || ''}">${inicial}</div>
              <!-- Dropdown do perfil -->
              <div class="pnl-profile-drop hidden" id="profile-drop">
                <div class="ppd-arrow"></div>
                <div class="ppd-header">
                  <div class="ppd-avatar">${inicial}</div>
                  <div>
                    <div class="ppd-name" id="ppd-nome">${user.nome || 'Usuario'}</div>
                    <div class="ppd-email" id="ppd-email">${user.email || ''}</div>
                  </div>
                </div>
                <div class="ppd-divider"></div>
                <button class="ppd-item" id="ppd-btn-perfil">
                  <span class="ppd-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg></span>
                  <span>Meu Perfil</span>
                </button>
                <button class="ppd-item" id="ppd-btn-indique">
                  <span class="ppd-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg></span>
                  <span>Indique e ganhe</span>
                  <span class="ppd-badge" id="ppd-saldo-afil">R$ 0,00</span>
                </button>
                <button class="ppd-item" id="ppd-btn-suporte">
                  <span class="ppd-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span>
                  <span>Suporte</span>
                </button>
                <div class="ppd-divider"></div>
                <button class="ppd-item ppd-item-danger" id="ppd-btn-sair">
                  <span class="ppd-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg></span>
                  <span>Sair</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- .. SCROLL AREA .................................................. -->
      <div class="pnl-scroll">

        <!-- 🔒 Bônus bloqueado (persistente até o 1º depósito) -->
        <div id="bonus-lock-bar" class="bonus-lock-bar hidden" role="button" tabindex="0" aria-label="Bônus de R$ 260 bloqueado. Faça seu primeiro depósito para liberar.">
          <div class="blb-glow"></div>
          <div class="blb-icon">
            <div class="blb-lock-wrap">
              <svg class="blb-lock" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" width="22" height="22">
                <rect x="4" y="11" width="16" height="10" rx="2"/>
                <path d="M8 11V8a4 4 0 0 1 8 0v3"/>
              </svg>
              <span class="blb-shake-dot"></span>
            </div>
          </div>
          <div class="blb-text">
            <div class="blb-title">
              Bônus de <strong>R$ 260</strong> bloqueado
              <span class="blb-badge-live"><span class="blb-live-dot"></span>AGUARDANDO</span>
            </div>
            <div class="blb-sub">Faça seu 1º depósito e <strong>libere agora</strong> seu bônus de boas-vindas</div>
          </div>
          <button type="button" class="blb-cta" id="bonus-lock-cta">
            LIBERAR
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
          <div class="blb-shine"></div>
        </div>


        <!-- Botoes ocultos mantidos para compatibilidade com JS -->
        <button id="btn-depositar" style="display:none"></button>
        <button id="btn-sacar" style="display:none"></button>
        <button id="btn-indicar" style="display:none"></button>
        <span id="st-saldo" style="display:none"></span>
        <!-- "?"? Banner slider "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"? -->
        <div id="pnl-banner-wrap" style="display:none;margin:14px auto 0;padding:0 12px;box-sizing:border-box;position:relative">
          <div id="pnl-banner-track" style="display:flex;transition:transform .4s cubic-bezier(.4,0,.2,1);border-radius:14px;overflow:hidden">
          </div>
          <!-- dots -->
          <div id="pnl-banner-dots" style="position:absolute;bottom:10px;left:50%;transform:translateX(-50%);display:flex;gap:6px;z-index:2"></div>
          <!-- arrows -->
          <button id="pnl-banner-prev" style="position:absolute;left:8px;top:50%;transform:translateY(-50%);background:rgba(0,0,0,.45);border:none;border-radius:50%;width:30px;height:30px;color:#fff;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;z-index:2;backdrop-filter:blur(4px)">&lt;</button>
          <button id="pnl-banner-next" style="position:absolute;right:8px;top:50%;transform:translateY(-50%);background:rgba(0,0,0,.45);border:none;border-radius:50%;width:30px;height:30px;color:#fff;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;z-index:2;backdrop-filter:blur(4px)">&gt;</button>
        </div>

        <!-- "?"? Dicas rotativas "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"? -->
        <div class="pnl-tips-wrap" id="pnl-tips-wrap">
          <div class="pnl-tips-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <div class="pnl-tips-text" id="pnl-tips-text"></div>
        </div>

        <!-- "?"? Game card "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"? -->
        <div class="pnl-game-card">

          <!-- Topo do card -->
          <div class="pnl-game-top">
            <div>
              <div class="pnl-game-title">INICIAR PARTIDA</div>
              <div class="pnl-game-sub">Passe plataformas, acumule dinheiro e escolha quando resgatar!</div>
            </div>
            <div class="pnl-game-badge" id="users-playing-badge">
              <span class="badge-dot"></span>
              <span class="badge-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="11" height="11"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </span>
              <span id="n-jogando">0</span>
              <span class="badge-label">online</span>
            </div>
          </div>

          <!-- Chips informativos -->
          <div class="pnl-chips">
            <div class="pnl-chip pnl-chip-gold" id="chip-mult">
              <span class="chip-icon">ALVO</span>
              <span>Meta = <strong id="chip-mult-val">...x</strong></span>
            </div>
            <div class="pnl-chip pnl-chip-blue">
              <span class="chip-icon">INF</span>
              <span>Plataformas</span>
            </div>
          </div>

          <!-- Secao de aposta centralizada -->
          <div class="pnl-bet-center">

            <div class="pnl-quick-label">Valor de entrada</div>
            <div class="pnl-quick-row" id="quick-amounts">
              <button class="pnl-quick" data-v="1">R$1</button>
              <button class="pnl-quick" data-v="2">R$2</button>
              <button class="pnl-quick" data-v="5">R$5</button>
              <button class="pnl-quick" data-v="10">R$10</button>
              <button class="pnl-quick" data-v="20">R$20</button>
              <button class="pnl-quick" data-v="50">R$50</button>
            </div>
            <!-- valores dinamicos sobrescrevem os acima via JS -->

            <div class="pnl-input-wrap">
              <span class="pnl-input-prefix">R$</span>
              <input id="entrada-val" class="pnl-input" type="number"
                placeholder="0,00" min="1" max="100" step="0.01" inputmode="decimal" />
            </div>

            <div class="pnl-meta-row" id="meta-preview">
              <div class="pnl-meta-item">
                <div class="pnl-meta-lbl">Valor no saque liberado</div>
                <div class="pnl-meta-val pnl-meta-gold" id="meta-val">R$ 0,00</div>
              </div>
              <div class="pnl-meta-item">
                <div class="pnl-meta-lbl">Por acerto</div>
                <div class="pnl-meta-val" id="meta-vpp">+0,20x</div>
              </div>
              <div class="pnl-meta-item">
                <div class="pnl-meta-lbl">Libera saque em</div>
                <div class="pnl-meta-val" id="meta-plat">5 acertos</div>
              </div>
            </div>

          </div>

          <!-- Alerta saldo -->
          <div id="saldo-warn" class="pnl-warn hidden">
            Aviso: Saldo insuficiente
            <button class="pnl-warn-btn" id="dep-from-warn">Depositar agora</button>
          </div>

          <!-- Botao jogar -->
          <button class="pnl-play-btn" id="btn-jogar">
            <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><polygon points="5,3 19,12 5,21"/></svg>
            JOGAR AGORA
          </button>

          <!-- Botao demo (jogar gratis) -->
          <button class="pnl-demo-btn" id="btn-jogar-demo" type="button">
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><polygon points="5,3 19,12 5,21"/></svg>
            Jogar Grátis (Demo)
          </button>
        </div>

        <div style="height:80px"></div>
      </div><!-- /scroll -->

      <!-- .. BOTTOM NAV .................................................. -->
      <nav class="pnl-bottom-nav">
        <button class="pnl-nav-item pnl-nav-active" id="nav-jogar" onclick="document.getElementById('btn-jogar')?.scrollIntoView({behavior:'smooth',block:'center'})">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>
          <span>Jogar</span>
        </button>
        <button class="pnl-nav-item" id="nav-dep">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
          <span>Depositar</span>
        </button>
        <button class="pnl-nav-item" id="nav-sac">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
          <span>Sacar</span>
        </button>
        <button class="pnl-nav-item" id="nav-ind">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          <span>Indicar</span>
        </button>
        <button class="pnl-nav-item" id="nav-sair">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>
          <span>Sair</span>
        </button>
      </nav>


    </div><!-- /pnl-root -->

    <!-- .. MODAIS .......................................................... -->

    <!-- Modal Depositar -->
    <div class="pnl-modal-bg hidden" id="modal-deposito">
      <div class="pnl-modal">
        <div class="pnl-modal-header">
          <span class="pnl-modal-title">Depositar via PIX</span>
          <button class="pnl-modal-close" id="close-deposito">x</button>
        </div>
        <div id="dep-step1">
          <div id="dep-promo-banner" style="position:relative;overflow:hidden;border-radius:14px;padding:14px;margin-bottom:16px;color:#fff;background:linear-gradient(135deg,#7c2d12 0%,#b91c1c 45%,#f59e0b 100%);border:1px solid rgba(255,255,255,.18);box-shadow:0 10px 30px rgba(239,68,68,.35), inset 0 1px 0 rgba(255,255,255,.15)">
            <div style="display:flex;align-items:center;gap:10px;position:relative;z-index:1">
              <span style="display:inline-flex;align-items:center;gap:6px;background:rgba(0,0,0,.35);padding:4px 9px;border-radius:999px;font-size:10px;font-weight:800;letter-spacing:.12em">
                <span style="width:8px;height:8px;border-radius:50%;background:#22c55e;box-shadow:0 0 0 0 rgba(34,197,94,.7);animation:pulseDot 1.4s ease-out infinite"></span>MULTIPLICADOR ONLINE
              </span>
              <span style="margin-left:auto;font-size:13px;font-weight:800;letter-spacing:.04em;text-transform:uppercase;opacity:.95">Bônus 2x</span>
            </div>
            <div style="display:flex;align-items:baseline;gap:10px;margin-top:6px;position:relative;z-index:1">
              <div style="font-size:34px;font-weight:900;line-height:1;text-shadow:0 2px 8px rgba(0,0,0,.35)">2x<small style="font-size:13px;font-weight:800;opacity:.9;margin-left:2px">SEU DEPÓSITO</small></div>
              <div style="font-size:13px;font-weight:700;line-height:1.25;flex:1">O valor que você depositar agora será <u>dobrado</u> e creditado na hora.</div>
            </div>
            <div style="margin-top:10px;display:flex;align-items:center;justify-content:space-between;gap:8px;background:rgba(0,0,0,.35);border-radius:10px;padding:8px 10px;position:relative;z-index:1">
              <span style="font-size:11px;font-weight:700;opacity:.95;letter-spacing:.06em;text-transform:uppercase">⏱ Termina em</span>
              <div style="display:flex;gap:4px;align-items:center">
                <div id="dep-promo-m" style="background:#0b0f1a;border:1px solid rgba(255,255,255,.18);border-radius:6px;padding:4px 8px;font-weight:800;font-size:14px;font-variant-numeric:tabular-nums;min-width:34px;text-align:center">20</div>
                <span style="font-weight:800;opacity:.85">:</span>
                <div id="dep-promo-s" style="background:#0b0f1a;border:1px solid rgba(255,255,255,.18);border-radius:6px;padding:4px 8px;font-weight:800;font-size:14px;font-variant-numeric:tabular-nums;min-width:34px;text-align:center">00</div>
              </div>
            </div>
            <style>@keyframes pulseDot{0%{box-shadow:0 0 0 0 rgba(34,197,94,.6)}70%{box-shadow:0 0 0 10px rgba(34,197,94,0)}100%{box-shadow:0 0 0 0 rgba(34,197,94,0)}}</style>
          </div>
          <div class="dep-amount-grid" id="dep-quick-row" style="margin-bottom:14px">
            <button class="pnl-quick" data-dep="20">R$20</button>
            <button class="pnl-quick" data-dep="30">R$30</button>
            <button class="pnl-quick" data-dep="50">R$50</button>
            <button class="pnl-quick" data-dep="100">R$100</button>
            <button class="pnl-quick" data-dep="500">R$500</button>
            <button class="pnl-quick" data-dep="1000">R$1000</button>
          </div>
          <div class="pnl-input-wrap" style="margin-bottom:16px">
            <span class="pnl-input-prefix">R$</span>
            <input id="dep-valor" class="pnl-input" type="number" placeholder="Minimo R$20,00" min="20" step="1" inputmode="decimal" data-min="20" data-max="0" />
          </div>
          <!-- Card de bonus ?" so aparece quando bonus esta ativo -->
          <div id="dep-bonus-card" class="hidden" style="background:linear-gradient(135deg,#1a7a3a,#22a850);border-radius:12px;padding:14px 16px;margin-bottom:16px;color:#fff">
            <div style="font-size:11px;font-weight:700;letter-spacing:.08em;opacity:.85;margin-bottom:6px" id="dep-bonus-label">BONUS DE 0%</div>
            <div style="font-size:22px;font-weight:800;margin-bottom:8px" id="dep-bonus-valor">+ R$ 0,00</div>
            <div style="border-top:1px solid rgba(255,255,255,.25);padding-top:8px;font-size:13px;opacity:.9">
              Total na conta: <strong id="dep-bonus-total">R$ 0,00</strong>
            </div>
          </div>
          <!-- Cupom discreto -->
          <div id="dep-cupom-wrap" style="margin-bottom:14px">
            <div id="dep-cupom-toggle" style="display:flex;align-items:center;gap:6px;cursor:pointer;width:fit-content;opacity:.6;font-size:12px;color:var(--pnl-muted,#52796f)" onclick="toggleDepCupom()">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
              Tenho um cupom
            </div>
            <div id="dep-cupom-field" style="display:none;margin-top:8px">
              <div style="display:flex;gap:8px;align-items:center">
                <input id="dep-cupom-input" class="pnl-input" type="text" placeholder="Codigo do cupom" style="flex:1;text-transform:uppercase;background:transparent" oninput="this.value=this.value.toUpperCase().replace(/\s/g,'')" />
                <button id="dep-cupom-btn" style="flex-shrink:0;background:#2d6a4f;color:#fff;border:none;border-radius:8px;padding:9px 14px;font-size:12px;font-weight:600;cursor:pointer;white-space:nowrap" onclick="aplicarCupomDep()">Aplicar</button>
              </div>
              <div id="dep-cupom-status" style="margin-top:6px;font-size:12px;min-height:18px;display:flex;align-items:center;flex-wrap:wrap;gap:8px">
              </div>
              <div id="dep-cupom-alterar-wrap" style="display:none;margin-top:6px">
                <button onclick="alterarCupomDep()" style="display:inline-flex;align-items:center;gap:5px;background:none;border:1px solid #d1d5db;border-radius:6px;padding:5px 10px;font-size:11px;font-weight:600;color:#6b7280;cursor:pointer;transition:all .15s">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  Alterar cupom
                </button>
              </div>
            </div>
          </div>
          <button class="pnl-play-btn" id="dep-confirmar">Gerar QR Code PIX</button>
        </div>
        <div id="dep-step2" class="hidden" style="text-align:center">
          <!-- Loading enquanto aguarda resposta do gateway -->
          <div id="dep-loading" style="padding:40px 0">
            <div style="width:48px;height:48px;border:4px solid #d0f5e8;border-top-color:#2d6a4f;border-radius:50%;animation:spin .8s linear infinite;margin:0 auto 16px"></div>
            <div style="font-size:13px;color:#52796f">Gerando cobranca PIX...</div>
          </div>
          <!-- Conteudo apos retorno do gateway -->
          <div id="dep-content" class="hidden">
            <div id="dep-qr-wrap" style="background:linear-gradient(135deg,#e8fff4,#d0f5e8);border-radius:12px;padding:16px;margin-bottom:16px">
              <div id="dep-qr-canvas" style="width:180px;height:180px;display:flex;align-items:center;justify-content:center;margin:0 auto"></div>
              <img id="dep-qr-img" src="" alt="QR PIX" style="width:180px;height:180px;border-radius:8px;display:none;margin:0 auto" />
            </div>
            <div style="margin-bottom:14px">
              <div style="font-size:11px;color:#52796f;margin-bottom:6px;font-weight:600;text-transform:uppercase;letter-spacing:.05em">Codigo Copia e Cola</div>
              <div style="display:flex;align-items:center;gap:8px;background:#f1fdf7;border:1px solid #b7e4c7;border-radius:10px;padding:10px 12px">
                <div id="dep-pix-txt" style="flex:1;font-size:11px;color:#1b4332;text-align:left;overflow:hidden;white-space:nowrap;text-overflow:ellipsis"></div>
                <button id="dep-copy-btn"
                  style="flex-shrink:0;background:#2d6a4f;color:#fff;border:none;border-radius:7px;padding:7px 12px;font-size:12px;font-weight:600;cursor:pointer">Copiar</button>
              </div>
            </div>
            <div class="pnl-info-box pnl-info-green">Apos o pagamento, seu saldo e creditado automaticamente em ate 1 minuto.</div>
            <div class="pnl-timer" id="dep-timer"></div>
          </div>
          <button class="pnl-btn-outline" onclick="document.getElementById('modal-deposito').classList.add('hidden')" style="margin-top:12px">Fechar</button>
        </div>
      </div>
    </div>

    <!-- Modal Deposito Confirmado -->
    <div class="pnl-modal-bg hidden" id="modal-dep-confirmado">
      <div class="pnl-modal" style="text-align:center;max-width:360px">
        <div style="margin:0 auto 16px;width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,#22c55e,#16a34a);display:flex;align-items:center;justify-content:center;animation:depConfirmPop .5s cubic-bezier(.34,1.56,.64,1) both">
          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" width="36" height="36"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <div style="font-size:20px;font-weight:800;color:#22c55e;margin-bottom:6px">Deposito Confirmado!</div>
        <div style="font-size:13px;color:rgba(255,255,255,.6);margin-bottom:18px">Seu pagamento foi recebido com sucesso.</div>
        <div style="background:rgba(34,197,94,.1);border:1px solid rgba(34,197,94,.3);border-radius:12px;padding:14px;margin-bottom:20px">
          <div style="font-size:11px;color:rgba(255,255,255,.5);text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px">Valor creditado</div>
          <div id="dep-confirmado-valor" style="font-size:28px;font-weight:800;color:#22c55e">R$ 0,00</div>
          <div style="font-size:12px;color:rgba(255,255,255,.5);margin-top:6px">Novo saldo: <strong id="dep-confirmado-saldo" style="color:#fff">R$ 0,00</strong></div>
        </div>
        <button class="pnl-play-btn" onclick="document.getElementById('modal-dep-confirmado').classList.add('hidden')" style="width:100%">Jogar Agora</button>
      </div>
    </div>

    <!-- Modal Saque -->
    <div class="pnl-modal-bg hidden" id="modal-saque">
      <div class="pnl-modal">
        <div class="pnl-modal-header">
          <span class="pnl-modal-title">Solicitar Saque</span>
          <button class="pnl-modal-close" id="close-saque">x</button>
        </div>
        <div class="pnl-saldo-modal-info">Saldo disponivel: <strong id="saldo-saque-disp">...</strong></div>
        <div class="pnl-input-wrap" style="margin-bottom:14px">
          <span class="pnl-input-prefix">R$</span>
          <input id="saq-valor" class="pnl-input" type="number" placeholder="Minimo R$20,00" min="20" step="0.01" inputmode="decimal" data-min="20" data-max="0" />
        </div>
        <div class="pnl-input-wrap" style="margin-bottom:14px;background:#f8f8f8">
          <span class="pnl-input-prefix" style="font-size:11px;white-space:nowrap">PIX</span>
          <input id="saq-pix" class="pnl-input" type="text" placeholder="Chave PIX" style="background:transparent" />
        </div>
        <div class="pnl-input-wrap" style="margin-bottom:14px;background:#f8f8f8">
          <span class="pnl-input-prefix" style="font-size:11px;white-space:nowrap">CPF</span>
          <input id="saq-cpf" class="pnl-input" type="text" placeholder="CPF do titular" maxlength="14" inputmode="numeric" style="background:transparent" />
        </div>
        <div class="pnl-info-box pnl-info-orange"> Saques processados em ate 24h uteis.</div>
        <button class="pnl-play-btn" id="saq-confirmar" style="margin-top:16px;background:linear-gradient(135deg,var(--pnl-pink,#FF6B9D),var(--pnl-pink-light,#FF8CC8))">Solicitar Saque</button>

        <!-- Meus Saques -->
        <div id="meus-saques-section" style="display:none;margin-top:22px">
          <div style="font-size:13px;font-weight:700;color:#9980aa;margin-bottom:10px;display:flex;align-items:center;gap:6px">
            <span>Y"<</span> Meus Saques
          </div>
          <div id="meus-saques-lista"></div>
        </div>
      </div>
    </div>

    <!-- .. MODAL SAQUE AFILIADO ............................................ -->
    <div class="pnl-modal-bg hidden" id="modal-saque-afiliado">
      <div class="pnl-modal">
        <div class="pnl-modal-header">
          <span class="pnl-modal-title">Sacar Comissao</span>
          <button class="pnl-modal-close" id="close-saque-afiliado">x</button>
        </div>
        <div class="pnl-saldo-modal-info">Saldo de comissao: <strong id="saldo-afil-disp">...</strong></div>
        <div class="pnl-input-wrap" style="margin-bottom:14px">
          <span class="pnl-input-prefix">R$</span>
          <input id="saq-afil-valor" class="pnl-input" type="number" placeholder="Minimo R$50,00" min="50" step="0.01" inputmode="decimal" />
        </div>
        <div class="pnl-input-wrap" style="margin-bottom:14px;background:#f8f8f8">
          <span class="pnl-input-prefix" style="font-size:11px;white-space:nowrap">PIX</span>
          <input id="saq-afil-pix" class="pnl-input" type="text" placeholder="CPF, e-mail, telefone ou chave aleatoria" required style="background:transparent" />
        </div>
        <div class="pnl-info-box pnl-info-orange"> Saques processados em ate 24h uteis.</div>
        <button class="pnl-play-btn" id="saq-afil-confirmar" style="margin-top:16px;background:linear-gradient(135deg,var(--pnl-purple,#7c3aed),var(--pnl-purple2,#a855f7))">Solicitar Saque de Comissao</button>
      </div>
    </div>

    <!-- Modal Indicacao -->
    <!-- .. MODAL SUPORTE .................................................. -->
    <div class="pnl-modal-bg hidden" id="modal-suporte">
      <div class="pnl-modal">
        <div class="pnl-modal-header">
          <span class="pnl-modal-title">Suporte</span>
          <button class="pnl-modal-close" id="close-suporte">x</button>
        </div>
        <div id="suporte-loading" style="text-align:center;padding:30px 0;color:#9980aa;font-size:14px">Carregando...</div>
        <div id="suporte-links-wrap"></div>
      </div>
    </div>

    <!-- .. MODAL PERFIL ................................................... -->
    <div class="pnl-modal-bg hidden" id="modal-perfil">
      <div class="pnl-modal">
        <div class="pnl-modal-header">
          <span class="pnl-modal-title">Meu Perfil</span>
          <button class="pnl-modal-close" id="close-perfil">x</button>
        </div>

        <!-- Avatar e nome -->
        <div style="display:flex;flex-direction:column;align-items:center;padding:10px 0 20px;gap:8px">
          <div class="prf-avatar-lg" id="prf-avatar-lg">${inicial}</div>
          <div style="font-size:18px;font-weight:800;color:#2d0040" id="prf-nome">${user.nome || ''}</div>
          <div style="font-size:12px;color:#9980aa" id="prf-email">${user.email || ''}</div>
        </div>

        <!-- Stats do perfil -->
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:20px">
          <div class="prf-stat">
            <div class="prf-stat-val" id="prf-saldo">R$ 0,00</div>
            <div class="prf-stat-lbl">Saldo</div>
          </div>
          <div class="prf-stat">
            <div class="prf-stat-val" id="prf-partidas">0</div>
            <div class="prf-stat-lbl">Partidas</div>
          </div>
          <div class="prf-stat">
            <div class="prf-stat-val" id="prf-afil">R$ 0,00</div>
            <div class="prf-stat-lbl">Afiliado</div>
          </div>
        </div>

        <!-- Alterar senha -->
        <div class="prf-section">
          <div class="prf-section-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            Alterar Senha
          </div>
          <input class="pnl-input-modal" id="prf-senha-atual" type="password" placeholder="Senha atual"/>
          <input class="pnl-input-modal" id="prf-senha-nova" type="password" placeholder="Nova senha"/>
          <input class="pnl-input-modal" id="prf-senha-conf" type="password" placeholder="Confirmar nova senha"/>
          <button class="prf-btn-salvar" id="prf-btn-senha">Alterar Senha</button>
        </div>
      </div>
    </div>

    <div class="pnl-modal-bg hidden" id="modal-indicacao">
      <div class="pnl-modal">
        <div class="pnl-modal-header">
          <span class="pnl-modal-title">Indicar Amigos</span>
          <button class="pnl-modal-close" id="close-indicacao">x</button>
        </div>
        <div class="pnl-info-box pnl-info-pink" style="text-align:center;margin-bottom:16px">
          Ganhe <strong id="ind-comissao-perc">...</strong> de comissao para cada amigo que fizer o primeiro deposito!
        </div>

        <!-- Saldo Afiliado destaque -->
        <div id="ind-comissao-box" class="pnl-info-box" style="margin-bottom:14px;border:1px solid rgba(37,99,235,.35);background:linear-gradient(135deg,rgba(37,99,235,.10),rgba(59,130,246,.06))">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px">
            <div style="font-size:12px;font-weight:700;color:#1d4ed8">Minha comissao (%)</div>
            <div id="ind-comissao-origem" style="font-size:11px;font-weight:700;color:#1e40af">Padrao</div>
          </div>
          <div style="display:flex;align-items:baseline;gap:8px;margin-bottom:8px">
            <div id="ind-comissao-efetiva" style="font-size:22px;font-weight:800;color:#1d4ed8">0%</div>
            <div style="font-size:12px;color:#475569">Padrao plataforma: <strong id="ind-comissao-padrao">0%</strong></div>
          </div>
          <div style="width:100%;height:10px;border-radius:999px;background:rgba(37,99,235,.16);overflow:hidden">
            <div id="ind-comissao-bar" style="height:100%;width:0%;border-radius:999px;background:linear-gradient(90deg,#2563eb,#22c55e)"></div>
          </div>
        </div>

        <div id="ind-saldo-box" style="background:linear-gradient(135deg,#4a1080,#2d0a50);border-radius:14px;padding:18px 20px;margin-bottom:14px">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px">
            <div>
              <div style="font-size:11px;color:#ffffff;text-transform:uppercase;letter-spacing:.6px;margin-bottom:4px">Saldo atual de comissao</div>
              <div id="ind-saldo-afil" style="font-size:24px;font-weight:700;color:#fff">R$ 0,00</div>
              <div style="font-size:11px;color:#9d74c5;margin-top:2px">disponivel para saque</div>
            </div>
            <div style="text-align:right">
              <div style="font-size:11px;color:#ffffff;text-transform:uppercase;letter-spacing:.6px;margin-bottom:4px">Total ja ganho</div>
              <div id="ind-total-comissao" style="font-size:18px;font-weight:600;color:#e9d5ff">R$ 0,00</div>
              <div style="font-size:11px;color:#9d74c5;margin-top:2px">em comissoes</div>
            </div>
          </div>
          <button id="btn-sacar-afil" style="width:100%;padding:12px;border-radius:10px;border:none;cursor:pointer;background:linear-gradient(135deg,#00c97a,#00c97a);color:#fff;font-weight:700;font-size:14px;display:flex;align-items:center;justify-content:center;gap:8px;transition:opacity .2s">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
            Sacar Comissao
          </button>
        </div>

        <div id="ind-saque-resumo-grid" style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:14px">
          <div class="pnl-mini-stat">
            <div class="pnl-mini-val" id="ind-saq-pendente">R$ 0,00</div>
            <div class="pnl-mini-lbl">Pendentes</div>
          </div>
          <div class="pnl-mini-stat">
            <div class="pnl-mini-val" id="ind-saq-pago">R$ 0,00</div>
            <div class="pnl-mini-lbl">Pagos</div>
          </div>
          <div class="pnl-mini-stat">
            <div class="pnl-mini-val" id="ind-saq-recusado">R$ 0,00</div>
            <div class="pnl-mini-lbl">Recusados</div>
          </div>
        </div>

        <div id="ind-influencer-cta" class="pnl-info-box" style="margin-bottom:14px;border:1px solid rgba(37,99,235,.35);background:linear-gradient(135deg,rgba(37,99,235,.12),rgba(59,130,246,.07));display:flex;flex-direction:column;gap:10px">
          <div style="font-size:13px;font-weight:600;color:#1e3a8a">Voce e influencer e quer negociar comissao? Fale com nosso suporte no WhatsApp.</div>
          <a id="ind-whats-btn" href="https://wa.link/x6cefb" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;justify-content:center;padding:10px 12px;border-radius:10px;background:#16a34a;color:#fff;font-weight:700;text-decoration:none">
            Falar no WhatsApp
          </a>
        </div>

        <div id="ind-bonus-primeiro-box" class="pnl-info-box" style="margin-bottom:14px;border:1px solid rgba(34,197,94,.35);background:linear-gradient(135deg,rgba(34,197,94,.12),rgba(16,185,129,.08));display:flex;flex-direction:column;gap:8px">
          <div id="ind-bpd-title" style="font-size:13px;font-weight:700;color:#166534">Bonus de primeiro deposito</div>
          <div style="font-size:12px;color:#14532d">Status: <strong id="ind-bpd-status">Aguardando primeiro deposito</strong></div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
            <div class="pnl-mini-stat"><div class="pnl-mini-val" id="ind-bpd-dep">R$ 0,00</div><div class="pnl-mini-lbl">Deposito</div></div>
            <div class="pnl-mini-stat"><div class="pnl-mini-val" id="ind-bpd-bonus">R$ 0,00</div><div class="pnl-mini-lbl">Bonus</div></div>
            <div class="pnl-mini-stat"><div class="pnl-mini-val" id="ind-bpd-total">R$ 0,00</div><div class="pnl-mini-lbl">Total com bonus</div></div>
            <div class="pnl-mini-stat"><div class="pnl-mini-val" id="ind-bpd-rollover-exigido">R$ 0,00</div><div class="pnl-mini-lbl">Rollover exigido</div></div>
            <div class="pnl-mini-stat"><div class="pnl-mini-val" id="ind-bpd-rollover-cumprido">R$ 0,00</div><div class="pnl-mini-lbl">Rollover cumprido</div></div>
            <div class="pnl-mini-stat"><div class="pnl-mini-val" id="ind-bpd-rollover-restante">R$ 0,00</div><div class="pnl-mini-lbl">Rollover restante</div></div>
          </div>
        </div>

        <div class="pnl-link-box">
          <div class="pnl-link-label">Seu link exclusivo</div>
          <div class="pnl-link-val" id="ind-link">...</div>
          <button class="pnl-btn-copy" onclick="copyToClipboard(document.getElementById('ind-link').textContent)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            Copiar
          </button>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">
          <div class="pnl-mini-stat">
            <div class="pnl-mini-val" id="ind-total">0</div>
            <div class="pnl-mini-lbl">Indicados</div>
          </div>
          <div class="pnl-mini-stat">
            <div class="pnl-mini-val" id="ind-bonus">R$ 0,00</div>
            <div class="pnl-mini-lbl">Com deposito</div>
          </div>
        </div>

        <!-- CARD MONTANTE -->
        <div id="ind-card-montante" style="display:none;background:linear-gradient(135deg,#ff6b9d,#ff6b9d);border-radius:14px;padding:18px 20px;margin-bottom:16px">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px">
            
            <div style="flex:1">
              <div style="font-size:11px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;color:#ffffff;margin-bottom:2px">MONTANTE</div>
              <div style="font-size:11px;color:#ffffff">Volume total de depositos</div>
            </div>
            <div style="display:flex;align-items:center;gap:4px;color:#00C97A;font-size:13px;font-weight:700">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
              <span id="ind-montante-perc">0%</span>
            </div>
          </div>
          <div id="ind-montante" style="font-size:28px;font-weight:800;color:#fff;letter-spacing:-.5px">R$ 0,00</div>
        </div>

        <div style="font-size:12px;color:#9980aa;text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px">Historico de saques da comissao</div>
        <div id="ind-saques-lista" class="pnl-tx-list" style="margin-bottom:16px"></div>
        <div id="ind-lista"></div>
      </div>
    </div>

    <style>
      /* "?"? Root & layout "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"? */
      .pnl-root {
        display: flex; flex-direction: column; height: 100vh;
        font-family: 'Poppins', system-ui, sans-serif;
        overflow: hidden; position: relative; isolation: isolate;
        background:
          radial-gradient(760px 380px at 12% -10%, rgba(37,99,235,.10), transparent 60%),
          linear-gradient(180deg, #cfe6fd 0%, #e8f3ff 45%, #eef6ff 100%);

      }
      :root {
        --pnl-blue: #2563eb; --pnl-blue-d: #1d4ed8; --pnl-blue-l: #eff4ff;
        --pnl-green: #00C97A; --pnl-red: #ef4444;
        --pnl-text: #0f172a; --pnl-muted: rgba(15,23,42,0.50);
        --pnl-border: rgba(15,23,42,0.10); --pnl-surface: #ffffff;
      }
      .pnl-header, .pnl-scroll, .pnl-bottom-nav { position: relative; z-index: 1; }
      .pnl-root > .ts-sky { position: absolute; inset: 0; z-index: 0; }
      .pnl-root .ts-skyline { opacity: .55; }
      .pnl-card {
        background: rgba(255,255,255,.86) !important;
        backdrop-filter: blur(10px);
      }
      .pnl-bottom-nav { background: rgba(255,255,255,.90) !important; backdrop-filter: blur(12px); }


      /* "?"? Header "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"? */
      .pnl-header {
        background: rgba(255,255,255,.88); border-bottom: 1px solid var(--pnl-border);
        backdrop-filter: blur(12px);
        padding: 0 16px; flex-shrink: 0; position: sticky; top: 0; z-index: 100;
        box-shadow: 0 8px 24px rgba(15,23,42,0.08);
      }
      .pnl-header-inner {
        display: flex; align-items: center; justify-content: space-between; height: 56px;
        color: var(--pnl-text);
      }
      .pnl-logo { display: flex; align-items: center; gap: 8px; }
      .pnl-logo-icon { font-size: 22px; }
      .pnl-logo span { font-size: 18px; font-weight: 800; color: var(--pnl-blue); }
      .pnl-header-right { display: flex; align-items: center; gap: 10px; }
      .pnl-saldo-wrap { position: relative; }
      .pnl-saldo-chip {
        display: flex; flex-direction: row; align-items: center; gap: 6px;
        background: linear-gradient(135deg, var(--pnl-blue), var(--pnl-blue-d));
        border-radius: 20px; padding: 5px 12px; cursor: pointer;
        transition: filter .15s, transform .15s; user-select: none;
        box-shadow: 0 4px 14px rgba(37,99,235,0.30);
      }
      .pnl-saldo-chip:hover { filter: brightness(1.08); transform: translateY(-1px); }
      .pnl-saldo-chip:active { transform: scale(.97); }
      .pnl-saldo-chip-inner { display: flex; flex-direction: column; align-items: flex-end; }
      .pnl-saldo-chip-lbl { font-size: 9px; color: rgba(255,255,255,.8); text-transform: uppercase; letter-spacing: .5px; line-height: 1; }
      .pnl-saldo-chip-val { font-size: 14px; font-weight: 800; color: #fff; line-height: 1.3; }
      .saldo-chip-caret { color: rgba(255,255,255,.75); flex-shrink: 0; transition: transform .2s; }
      .pnl-saldo-chip.open .saldo-chip-caret { transform: rotate(180deg); }

      /* "?"? Saldo Dropdown "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"? */
      .pnl-saldo-drop {
        position: absolute; top: calc(100% + 10px); right: 0; width: 210px;
        background: #ffffff; border: 1px solid var(--pnl-border);
        border-radius: 14px; box-shadow: 0 16px 48px rgba(15,23,42,0.14);
        z-index: 9999; animation: dropIn .18s ease both;
      }
      .psd-arrow {
        position: absolute; top: -7px; right: 18px; width: 13px; height: 13px;
        background: #fff; border-left: 1px solid var(--pnl-border);
        border-top: 1px solid var(--pnl-border);
        transform: rotate(45deg); border-radius: 2px;
      }
      .psd-item {
        display: flex; align-items: center; gap: 12px;
        width: 100%; padding: 12px 14px; background: none; border: none;
        color: var(--pnl-text); font-size: 13px; font-family: inherit;
        cursor: pointer; text-align: left; transition: background .15s; border-radius: 14px;
      }
      .psd-item:hover { background: var(--pnl-blue-l); }
      .psd-item:first-of-type { border-radius: 14px 14px 0 0; }
      .psd-item:last-of-type  { border-radius: 0 0 14px 14px; }
      .psd-icon {
        width: 32px; height: 32px; border-radius: 10px;
        display: flex; align-items: center; justify-content: center; flex-shrink: 0;
      }
      .psd-icon-green { background: rgba(0,201,122,.12); color: #00C97A; }
      .psd-icon-red   { background: rgba(239,68,68,.10); color: #ef4444; }
      .psd-text { display: flex; flex-direction: column; gap: 1px; }
      .psd-label { font-weight: 700; font-size: 13px; color: var(--pnl-text); }
      .psd-sub   { font-size: 11px; color: var(--pnl-muted); }
      .psd-divider { height: 1px; background: var(--pnl-border); margin: 0 10px; }

      .pnl-avatar {
        width: 36px; height: 36px; border-radius: 50%;
        background: linear-gradient(135deg, var(--pnl-blue), var(--pnl-blue-d));
        color: #fff; font-weight: 800; font-size: 15px;
        display: flex; align-items: center; justify-content: center;
        cursor: pointer; flex-shrink: 0; transition: transform .15s, box-shadow .15s;
      }
      .pnl-avatar:hover { transform: scale(1.08); box-shadow: 0 0 0 3px rgba(37,99,235,.25); }
      .pnl-avatar-wrap { position: relative; }

      /* "?"? Profile Dropdown "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"? */
      .pnl-profile-drop {
        position: absolute; top: calc(100% + 10px); right: 0; width: 240px;
        background: #ffffff; border: 1px solid var(--pnl-border);
        border-radius: 16px; box-shadow: 0 16px 48px rgba(15,23,42,0.14);
        z-index: 9999; overflow: hidden;
        animation: dropIn .2s cubic-bezier(.34,1.56,.64,1);
      }
      @keyframes dropIn {
        from { opacity: 0; transform: translateY(-8px) scale(.95); }
        to   { opacity: 1; transform: translateY(0) scale(1); }
      }
      .ppd-arrow {
        position: absolute; top: -6px; right: 14px; width: 12px; height: 12px;
        background: #fff; border-left: 1px solid var(--pnl-border);
        border-top: 1px solid var(--pnl-border); transform: rotate(45deg);
      }
      .ppd-header { display: flex; align-items: center; gap: 10px; padding: 14px 16px 12px; }
      .ppd-avatar {
        width: 38px; height: 38px; border-radius: 50%; flex-shrink: 0;
        background: linear-gradient(135deg, var(--pnl-blue), var(--pnl-blue-d));
        color: #fff; font-weight: 800; font-size: 15px;
        display: flex; align-items: center; justify-content: center;
      }
      .ppd-name  { font-size: 13px; font-weight: 700; color: var(--pnl-text); }
      .ppd-email { font-size: 11px; color: var(--pnl-muted); margin-top: 1px; }
      .ppd-divider { height: 1px; background: var(--pnl-border); margin: 2px 0; }
      .ppd-item {
        display: flex; align-items: center; gap: 10px;
        width: 100%; padding: 11px 16px; background: transparent;
        border: none; color: var(--pnl-text); font-size: 13px; font-weight: 500;
        cursor: pointer; font-family: inherit; transition: background .15s; text-align: left;
      }
      .ppd-item:hover { background: var(--pnl-blue-l); }
      .ppd-icon { display: flex; align-items: center; opacity: .55; flex-shrink: 0; }
      .ppd-item:hover .ppd-icon { opacity: 1; }
      .ppd-badge {
        margin-left: auto; font-size: 10px; font-weight: 700;
        background: rgba(0,201,122,.10); color: #059669;
        border: 1px solid rgba(0,201,122,.25); border-radius: 20px;
        padding: 2px 7px; white-space: nowrap;
      }
      .ppd-item-danger { color: #ef4444; }
      .ppd-item-danger:hover { background: rgba(239,68,68,.06); }
      .ppd-item-danger .ppd-icon { opacity: .7; }

      /* "?"? Modal Perfil "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"? */
      .prf-avatar-lg {
        width: 72px; height: 72px; border-radius: 50%;
        background: linear-gradient(135deg, var(--pnl-blue), var(--pnl-blue-d));
        color: #fff; font-weight: 800; font-size: 28px;
        display: flex; align-items: center; justify-content: center;
        box-shadow: 0 4px 20px rgba(37,99,235,0.30);
      }
      .prf-stat {
        background: var(--pnl-blue-l); border: 1px solid rgba(37,99,235,0.14);
        border-radius: 12px; padding: 12px 8px; text-align: center;
      }
      .prf-stat-val { font-size: 14px; font-weight: 800; color: var(--pnl-blue); }
      .prf-stat-lbl { font-size: 10px; color: var(--pnl-muted); text-transform: uppercase; letter-spacing: .4px; margin-top: 3px; }
      .prf-section { margin-bottom: 12px; }
      .prf-section-title {
        display: flex; align-items: center; gap: 6px;
        font-size: 11px; font-weight: 700; color: var(--pnl-muted);
        text-transform: uppercase; letter-spacing: .5px; margin-bottom: 10px;
      }
      .pnl-input-modal {
        width: 100%; background: #f8faff; border: 1px solid rgba(37,99,235,0.15);
        border-radius: 10px; color: var(--pnl-text); font-size: 14px; padding: 11px 14px;
        font-family: inherit; outline: none; box-sizing: border-box; margin-bottom: 8px;
        transition: border-color .15s;
      }
      .pnl-input-modal:focus { border-color: var(--pnl-blue); box-shadow: 0 0 0 3px rgba(37,99,235,.08); }
      .pnl-input-modal::placeholder { color: rgba(15,23,42,.30); }
      .prf-btn-salvar {
        width: 100%; margin-top: 4px;
        background: linear-gradient(135deg, var(--pnl-blue), var(--pnl-blue-d));
        border: none; border-radius: 10px; color: #fff;
        font-size: 14px; font-weight: 700; padding: 13px;
        cursor: pointer; font-family: inherit; transition: opacity .15s, transform .15s;
        box-shadow: 0 4px 14px rgba(37,99,235,0.30);
      }
      .prf-btn-salvar:hover { opacity: .92; transform: translateY(-1px); }
      .prf-btn-salvar:disabled { opacity: .5; cursor: not-allowed; transform: none; }

      /* "?"? Modal Suporte "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"? */
      .sup-link-item {
        display: flex; align-items: center; gap: 12px;
        padding: 13px 16px; border-radius: 12px;
        background: var(--pnl-blue-l); border: 1px solid rgba(37,99,235,0.14);
        margin-bottom: 10px; cursor: pointer; text-decoration: none; color: inherit;
        transition: background .15s, transform .12s, box-shadow .15s;
      }
      .sup-link-item:hover {
        background: #dbeafe; transform: translateY(-1px);
        box-shadow: 0 4px 16px rgba(37,99,235,0.12);
      }
      .sup-link-icon {
        width: 40px; height: 40px; border-radius: 12px; flex-shrink: 0;
        background: linear-gradient(135deg, var(--pnl-blue), var(--pnl-blue-d));
        display: flex; align-items: center; justify-content: center; color: #fff;
      }
      .sup-link-name { font-size: 14px; font-weight: 700; color: var(--pnl-text); }
      .sup-link-url  { font-size: 11px; color: var(--pnl-muted); margin-top: 2px; }
      .sup-link-arrow { margin-left: auto; color: var(--pnl-muted); flex-shrink: 0; }
      .sup-empty { text-align: center; padding: 30px 0; color: var(--pnl-muted); font-size: 13px; }

      /* "?"? Scroll area "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"? */
      .pnl-scroll { flex: 1; overflow-y: auto; -webkit-overflow-scrolling: touch; padding-bottom: 70px; background: transparent; }

      /* "?"? Banner responsivo "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"? */
      #pnl-banner-wrap { width: 100%; box-sizing: border-box; }
      #pnl-banner-wrap img { width: 100%; height: auto; display: block; }
      @media (min-width: 600px) {
        #pnl-banner-wrap, .pnl-tips-wrap, .pnl-game-card {
          max-width: 860px; margin-left: auto !important; margin-right: auto !important; box-sizing: border-box;
        }
        #pnl-banner-wrap { padding: 0 12px; }
        .pnl-tips-wrap { width: calc(100% - 24px); }
        .pnl-game-card { width: calc(100% - 24px); }
      }

      /* "?"? Dicas rotativas "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"? */
      .pnl-tips-wrap {
        display: flex; align-items: center; gap: 12px;
        margin: 14px 14px 12px; padding: 13px 16px;
        background: #ffffff; border: 1px solid var(--pnl-border);
        border-left: 3px solid var(--pnl-blue);
        border-radius: 12px; box-shadow: 0 2px 8px rgba(15,23,42,0.05);
        min-height: 48px; overflow: hidden;
      }
      .pnl-tips-icon { flex-shrink: 0; color: var(--pnl-blue); display: flex; align-items: center; }
      .pnl-tips-text {
        font-size: 13px; font-weight: 500; color: var(--pnl-text);
        line-height: 1.5; flex: 1; opacity: 1; transition: opacity .45s ease;
      }
      .pnl-tips-text.fade-out { opacity: 0; }

      /* "?"? Game card "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"? */
      .pnl-game-card {
        background: #ffffff; border: 1px solid var(--pnl-border);
        margin: 0 12px 16px; border-radius: 16px; padding: 20px 18px 18px;
        box-shadow: 0 14px 34px rgba(37,99,235,0.14);
      }
      .pnl-game-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 12px; gap: 8px; }
      .pnl-game-title { font-size: 16px; font-weight: 800; color: var(--pnl-text); letter-spacing: .2px; }
      .pnl-game-sub { font-size: 12px; color: var(--pnl-muted); margin-top: 3px; line-height: 1.4; }
      @keyframes badgePulse {
        0%   { box-shadow: 0 0 0 0 rgba(37,99,235,.40); }
        70%  { box-shadow: 0 0 0 6px rgba(37,99,235,0); }
        100% { box-shadow: 0 0 0 0 rgba(37,99,235,0); }
      }
      @keyframes dotPing {
        0%, 100% { transform: scale(1); opacity: 1; }
        50%       { transform: scale(1.5); opacity: .5; }
      }
      @keyframes countUp {
        from { transform: translateY(6px); opacity: 0; }
        to   { transform: translateY(0); opacity: 1; }
      }
      .pnl-game-badge {
        display: flex; align-items: center; gap: 5px; flex-shrink: 0;
        background: var(--pnl-blue-l); border: 1px solid rgba(37,99,235,.25);
        border-radius: 20px; padding: 5px 11px; font-size: 11px; font-weight: 700;
        color: var(--pnl-blue); white-space: nowrap;
        animation: badgePulse 2.4s ease-out infinite;
      }
      .badge-dot {
        width: 7px; height: 7px; border-radius: 50%; background: var(--pnl-blue);
        animation: dotPing 2s ease-in-out infinite; flex-shrink: 0;
      }
      .badge-icon { display: flex; align-items: center; opacity: .75; }
      .badge-label { color: var(--pnl-muted); font-weight: 500; }
      #n-jogando { animation: countUp .4s ease; }

      /* "?"? Bet center "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"? */
      .pnl-bet-center {
        display: flex; flex-direction: column; align-items: center;
        padding: 16px 0 4px; border-top: 1px solid var(--pnl-border); margin-top: 4px;
      }
      .pnl-bet-center .pnl-quick-label { text-align: center; }
      .pnl-bet-center .pnl-quick-row { justify-content: center; }
      .pnl-bet-center .pnl-input-wrap { max-width: 260px; width: 100%; font-size: 22px; }
      .pnl-bet-center .pnl-input { font-size: 26px; text-align: center; }
      .pnl-bet-center .pnl-meta-row { width: 100%; }

      /* "?"? Chips "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"? */
      .pnl-chips { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px; }
      .pnl-chip {
        display: flex; align-items: center; gap: 6px;
        font-size: 12px; font-weight: 700; padding: 7px 14px;
        border-radius: 50px; white-space: nowrap; letter-spacing: .2px;
        transition: transform .15s;
      }
      .pnl-chip:hover { transform: translateY(-1px); }
      .chip-icon { font-size: 13px; line-height: 1; }
      .pnl-chip-gold  { background: #fef9c3; color: #92400e; border: 1px solid #fde68a; }
      .pnl-chip-blue  { background: var(--pnl-blue-l); color: var(--pnl-blue); border: 1px solid rgba(37,99,235,.20); }
      .pnl-chip-green { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }

      /* "?"? Quick amounts "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"? */
      .pnl-quick-label { font-size: 11px; color: var(--pnl-muted); text-transform: uppercase; letter-spacing: .5px; margin-bottom: 8px; }
      .pnl-quick-row { display: flex; gap: 7px; flex-wrap: wrap; margin-bottom: 14px; }
      .dep-amount-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; margin-bottom: 14px; }
      .pnl-quick {
        position: relative; padding: 10px 8px 8px; border-radius: 10px;
        font-size: 14px; font-weight: 700;
        background: #f8faff; color: var(--pnl-text);
        border: 1.5px solid rgba(37,99,235,0.15); cursor: pointer; font-family: inherit;
        transition: background .1s, border-color .1s, color .1s;
        display: inline-flex; flex-direction: column; align-items: center; line-height: 1.2;
        touch-action: manipulation; -webkit-tap-highlight-color: transparent; user-select: none;
      }
      .pnl-quick:hover, .pnl-quick.active {
        background: var(--pnl-blue); color: #fff; border-color: var(--pnl-blue);
      }
      .dep-quick-badge { font-size: 9px; font-weight: 800; color: #15803d; letter-spacing: .2px; line-height: 1; margin-top: 1px; }
      .pnl-quick.active .dep-quick-badge { color: rgba(255,255,255,.85); }
      .dep-preset-label {
        position: absolute; top: -1px; left: 50%; transform: translateX(-50%);
        font-size: 8px; font-weight: 800; letter-spacing: .4px; text-transform: uppercase;
        padding: 2px 7px; border-radius: 20px; white-space: nowrap; pointer-events: none;
      }
      .dep-preset-label.lbl-destaque { background: var(--pnl-blue); color: #fff; }
      .dep-preset-label.lbl-bonus    { background: #22c55e; color: #fff; }
      .dep-preset-label.lbl-popular  { background: #f59e0b; color: #fff; }
      .dep-preset-label.lbl-vip      { background: #ef4444; color: #fff; }
      .dep-preset-label.lbl-custom   { background: #64748b; color: #fff; }
      .dep-amount-grid .pnl-quick { padding-top: 10px; }
      .dep-amount-grid .pnl-quick:has(.dep-preset-label) { padding-top: 18px; }
      .pnl-modal .pnl-quick { background: #f8faff; color: var(--pnl-text); border-color: rgba(37,99,235,0.15); }
      .pnl-modal .pnl-quick:hover, .pnl-modal .pnl-quick.active {
        background: var(--pnl-blue); color: #fff; border-color: var(--pnl-blue);
      }

      /* "?"? Input "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"? */
      .pnl-input-wrap {
        display: flex; align-items: center; gap: 8px;
        background: #f8faff; border: 1.5px solid rgba(37,99,235,0.15);
        border-radius: 12px; padding: 0 14px; margin-bottom: 14px; transition: border-color .2s;
      }
      .pnl-input-wrap:focus-within { border-color: var(--pnl-blue); background: #eff4ff; }
      .pnl-input-prefix { font-size: 28px; font-weight: 700; color: var(--pnl-muted); flex-shrink: 0; }
      .pnl-input {
        background: transparent; border: none; outline: none;
        color: var(--pnl-text); font-size: 20px; font-weight: 700;
        font-family: inherit; padding: 14px 0; flex: 1;
      }
      .pnl-input::placeholder { color: rgba(15,23,42,.25); }

      /* "?"? Meta preview "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"? */
      .pnl-meta-row {
        display: grid; grid-template-columns: repeat(3,1fr);
        background: #f8faff; border: 1px solid var(--pnl-border);
        border-radius: 10px; padding: 12px; margin-bottom: 14px; gap: 8px;
      }
      .pnl-meta-item { text-align: center; }
      .pnl-meta-lbl { font-size: 10px; color: var(--pnl-muted); text-transform: uppercase; letter-spacing: .4px; margin-bottom: 3px; }
      .pnl-meta-val { font-size: 14px; font-weight: 800; color: var(--pnl-text); }
      .pnl-meta-gold { color: var(--pnl-blue); }

      /* "?"? Warn "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"? */
      .pnl-warn {
        background: #fef2f2; border: 1px solid #fecaca;
        border-radius: 10px; padding: 10px 14px; font-size: 13px; font-weight: 700;
        color: #b91c1c; display: flex; align-items: center; justify-content: space-between;
        gap: 8px; margin-bottom: 12px;
      }
      .pnl-warn-btn {
        background: #ef4444; color: #fff; border: none; border-radius: 20px;
        padding: 5px 12px; font-size: 11px; font-weight: 700; cursor: pointer;
        font-family: inherit; white-space: nowrap;
      }

      /* "?"? Play button "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"? */
      .pnl-play-btn {
        width: 100%; padding: 15px; border-radius: 10px; border: none;
        background: linear-gradient(135deg, var(--pnl-blue), var(--pnl-blue-d));
        color: #fff; font-size: 15px; font-weight: 800; cursor: pointer;
        font-family: inherit; display: flex; align-items: center; justify-content: center;
        gap: 10px; box-shadow: 0 6px 20px rgba(37,99,235,.35);
        transition: all .2s; letter-spacing: .5px;
      }
      .pnl-play-btn:hover:not(:disabled) { filter: brightness(1.08); transform: translateY(-1px); box-shadow: 0 8px 28px rgba(37,99,235,.45); }
      .pnl-play-btn:disabled { opacity: .5; cursor: not-allowed; transform: none; }

      /* Botao demo (jogar gratis) */
      .pnl-demo-btn {
        width: 100%; margin-top: 10px; padding: 11px;
        border-radius: 10px;
        border: 1px solid rgba(96,165,250,.45);
        background: transparent;
        color: #cbd5e1; font-size: 13px; font-weight: 700;
        cursor: pointer; font-family: inherit;
        display: flex; align-items: center; justify-content: center; gap: 8px;
        transition: all .2s; letter-spacing: .3px;
      }
      .pnl-demo-btn:hover { background: rgba(96,165,250,.08); color: #fff; border-color: rgba(96,165,250,.7); }
      .pnl-demo-btn:disabled { opacity: .5; cursor: not-allowed; }

      /* "?"? Card generico "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"? */
      .pnl-card {
        background: #fff; margin: 0 12px 12px; border-radius: 14px;
        overflow: hidden; box-shadow: 0 12px 30px rgba(37,99,235,.10);
        border: 1px solid var(--pnl-border);
      }
      .pnl-card-header {
        display: flex; align-items: center; justify-content: space-between;
        padding: 14px 16px; border-bottom: 1px solid var(--pnl-border);
      }
      .pnl-card-title { font-size: 14px; font-weight: 700; color: var(--pnl-text); }
      .pnl-card-action { background: none; border: none; cursor: pointer; color: var(--pnl-blue); font-size: 13px; font-weight: 600; font-family: inherit; }
      .pnl-loading { text-align: center; padding: 24px; color: var(--pnl-muted); font-size: 14px; }

      /* "?"? Transacoes "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"? */
      .pnl-tx-list { display: flex; flex-direction: column; }
      .pnl-tx-item {
        display: flex; align-items: center; gap: 12px;
        padding: 12px 16px; border-bottom: 1px solid var(--pnl-border); transition: background .15s;
      }
      .pnl-tx-item:last-child { border-bottom: none; }
      .pnl-tx-item:active { background: #f8faff; }
      .pnl-tx-ico {
        width: 38px; height: 38px; border-radius: 10px; flex-shrink: 0;
        display: flex; align-items: center; justify-content: center; font-size: 17px;
      }
      .pnl-tx-ico-win    { background: #f0fdf4; }
      .pnl-tx-ico-loss   { background: #fef2f2; }
      .pnl-tx-ico-dep    { background: #eff4ff; }
      .pnl-tx-ico-saq    { background: #fffbeb; }
      .pnl-tx-ico-bonus  { background: #f0fdf4; }
      .pnl-tx-body { flex: 1; min-width: 0; }
      .pnl-tx-desc { font-size: 13px; font-weight: 600; color: var(--pnl-text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .pnl-tx-date { font-size: 11px; color: var(--pnl-muted); margin-top: 1px; }
      .pnl-tx-right { display: flex; flex-direction: column; align-items: flex-end; gap: 3px; flex-shrink: 0; }
      .pnl-tx-val { font-size: 14px; font-weight: 800; }
      .pnl-tx-pos { color: #15803d; }
      .pnl-tx-neg { color: #ef4444; }
      .pnl-badge { font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 20px; }
      .pnl-badge-green  { background: #f0fdf4; color: #15803d; }
      .pnl-badge-orange { background: #fffbeb; color: #92400e; }
      .pnl-badge-red    { background: #fef2f2; color: #b91c1c; }

      /* "?"? Bottom nav "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"? */
      .pnl-bottom-nav {
        position: fixed; bottom: 0; left: 0; right: 0;
        min-height: 40px; padding-bottom: max(env(safe-area-inset-bottom), 10px);
        background: rgba(255,255,255,.92); border-top: 1px solid var(--pnl-border);
        backdrop-filter: blur(10px);
        display: flex; align-items: stretch; z-index: 200;
        box-shadow: 0 -8px 24px rgba(15,23,42,0.08);
      }
      .pnl-nav-item {
        flex: 1; display: flex; flex-direction: column; align-items: center;
        justify-content: center; gap: 1px; background: none; border: none;
        cursor: pointer; color: rgba(15,23,42,.35); font-size: 8px; font-weight: 600;
        font-family: inherit; transition: color .2s; padding: 4px 0 2px;
      }
      .pnl-nav-item svg { width: 16px; height: 16px; stroke: currentColor; }
      .pnl-nav-item:hover { color: var(--pnl-blue); }
      .pnl-nav-active { color: var(--pnl-blue) !important; }
      .pnl-nav-item:last-child { color: rgba(239,68,68,.6); }
      .pnl-nav-item:last-child:hover { color: #ef4444; }

      #floating-whatsapp {
        position: fixed;
        right: 14px;
        bottom: calc(72px + env(safe-area-inset-bottom));
        width: 56px;
        height: 56px;
        border-radius: 999px;
        background: linear-gradient(135deg,#25d366,#16a34a);
        color: #fff;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 10px 24px rgba(22,163,74,.45);
        border: 2px solid rgba(255,255,255,.85);
        z-index: 450;
        text-decoration: none;
        transition: transform .18s ease, box-shadow .18s ease, opacity .18s ease;
      }
      #floating-whatsapp:hover {
        transform: translateY(-2px) scale(1.02);
        box-shadow: 0 14px 28px rgba(22,163,74,.5);
      }
      #floating-whatsapp:active { transform: scale(.96); }

      /* "?"? Modais "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"? */
      .pnl-modal-bg {
        position: fixed; inset: 0; z-index: 500;
        background: rgba(15,23,42,.40); display: flex;
        align-items: flex-end; backdrop-filter: blur(4px);
      }
      .pnl-modal-bg.hidden { display: none; }
      .pnl-modal {
        background: #fff; width: 100%; border-radius: 20px 20px 0 0;
        padding: 20px 20px 40px; max-height: 90vh; overflow-y: auto;
        animation: slideUp .28s ease;
        box-shadow: 0 -20px 55px rgba(15,23,42,0.30);
      }
      @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
      #modal-dep-confirmado { align-items: center; justify-content: center; padding: 20px; }
      #modal-dep-confirmado .pnl-modal {
        border-radius: 20px; width: auto; max-width: 360px;
        padding: 32px 28px 28px; animation: popIn .35s cubic-bezier(.34,1.56,.64,1) both;
      }
      .pnl-modal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
      .pnl-modal-title { font-size: 17px; font-weight: 800; color: var(--pnl-text); }
      .pnl-modal-close {
        width: 32px; height: 32px; border-radius: 50%; background: #f8faff;
        border: 1px solid var(--pnl-border); cursor: pointer; font-size: 14px;
        color: var(--pnl-muted); display: flex; align-items: center; justify-content: center;
      }
      .pnl-modal .pnl-input-wrap { background: #f8faff; border-color: rgba(37,99,235,0.15); }
      .pnl-modal .pnl-input-prefix { color: var(--pnl-muted); }
      .pnl-modal .pnl-input { color: var(--pnl-text); }
      .pnl-modal .pnl-input::placeholder { color: rgba(15,23,42,.30); }

      /* "?"? Copy box "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"? */
      .pnl-copy-box {
        background: #f8faff; border: 1px solid var(--pnl-border); border-radius: 8px;
        padding: 10px; font-size: 11px; font-family: monospace; color: var(--pnl-text);
        word-break: break-all; cursor: pointer; line-height: 1.4;
      }
      .pnl-copy-box:active { background: #eff4ff; }

      /* "?"? Info boxes "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"? */
      .pnl-info-box { border-radius: 10px; padding: 12px 14px; font-size: 13px; line-height: 1.5; }
      .pnl-info-green  { background: #f0fdf4; color: #166534; }
      .pnl-info-orange { background: #fffbeb; color: #92400e; }
      .pnl-info-pink   { background: #eff4ff; color: #1e40af; }

      /* "?"? Timer "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"? */
      .pnl-timer { font-size: 12px; color: #ef4444; font-weight: 700; text-align: center; margin-top: 8px; }

      /* "?"? Link box "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"? */
      .pnl-link-box {
        background: linear-gradient(135deg, var(--pnl-blue), var(--pnl-blue-d));
        border-radius: 14px; padding: 16px; margin-bottom: 16px; position: relative;
      }
      .pnl-link-label { font-size: 11px; color: rgba(255,255,255,.65); margin-bottom: 4px; }
      .pnl-link-val { font-size: 13px; color: #fff; font-weight: 600; word-break: break-all; margin-bottom: 12px; }
      .pnl-btn-copy {
        display: flex; align-items: center; gap: 6px;
        background: rgba(255,255,255,.18); border: 1px solid rgba(255,255,255,.28);
        color: #fff; border-radius: 20px; padding: 8px 16px; font-size: 12px;
        font-weight: 700; cursor: pointer; font-family: inherit;
      }
      .pnl-btn-copy:active { background: rgba(255,255,255,.28); }

      /* "?"? Mini stats (indicacao) "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"? */
      .pnl-mini-stat { background: var(--pnl-blue-l); border: 1px solid rgba(37,99,235,0.14); border-radius: 12px; padding: 14px; text-align: center; }
      .pnl-mini-val { font-size: 18px; font-weight: 800; color: var(--pnl-blue); margin-bottom: 2px; }
      .pnl-mini-lbl { font-size: 11px; color: var(--pnl-muted); text-transform: uppercase; letter-spacing: .4px; }

      /* "?"? Saldo info modal "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"? */
      .pnl-saldo-modal-info {
        font-size: 13px; color: var(--pnl-muted); background: #f8faff;
        border: 1px solid var(--pnl-border); border-radius: 10px; padding: 10px 14px; margin-bottom: 14px;
      }
      .pnl-saldo-modal-info strong { color: #15803d; font-size: 15px; }

      /* "?"? Botao outline "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"? */
      .pnl-btn-outline {
        width: 100%; padding: 13px; border-radius: 10px; border: 1.5px solid var(--pnl-border);
        background: transparent; color: var(--pnl-muted); font-size: 14px; font-weight: 700;
        cursor: pointer; font-family: inherit;
      }

      /* "?"? Spin loader "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"? */
      @keyframes spin { to { transform: rotate(360deg); } }
      .spin-icon { animation: spin .7s linear infinite; }
      @keyframes depConfirmPop {
        0%   { transform: scale(0); opacity: 0; }
        80%  { transform: scale(1.1); opacity: 1; }
        100% { transform: scale(1); }
      }

      /* 🔒 Bônus bloqueado — banner persistente */
      .bonus-lock-bar{
        position:relative;display:flex;align-items:center;gap:12px;
        margin:12px 12px 0;padding:12px 14px;border-radius:14px;
        background:linear-gradient(135deg,#1a0a0a 0%,#3a0d0d 45%,#5a1212 100%);
        border:1px solid rgba(255,80,80,.45);
        box-shadow:0 8px 24px -10px rgba(220,38,38,.55), inset 0 1px 0 rgba(255,255,255,.06);
        overflow:hidden;cursor:pointer;
        animation:blbIn .55s cubic-bezier(.2,.9,.25,1.2) both, blbPulseBorder 2.4s ease-in-out infinite;
      }
      .bonus-lock-bar:hover{transform:translateY(-1px);transition:transform .15s}
      .bonus-lock-bar:active{transform:scale(.985)}
      .blb-glow{position:absolute;inset:-40%;background:radial-gradient(closest-side,rgba(255,80,80,.35),transparent 70%);filter:blur(20px);animation:blbGlow 3.2s ease-in-out infinite;pointer-events:none}
      .blb-icon{position:relative;flex-shrink:0;width:42px;height:42px;border-radius:12px;
        background:linear-gradient(135deg,#dc2626,#7f1d1d);
        display:flex;align-items:center;justify-content:center;color:#fff;
        box-shadow:0 4px 14px rgba(220,38,38,.45), inset 0 1px 0 rgba(255,255,255,.25);
      }
      .blb-lock-wrap{position:relative;display:flex;align-items:center;justify-content:center}
      .blb-lock{animation:blbShake 2.6s ease-in-out infinite;transform-origin:50% 60%}
      .blb-shake-dot{position:absolute;top:-3px;right:-4px;width:10px;height:10px;border-radius:50%;background:#fde047;border:2px solid #1a0a0a;animation:blbDot 1.1s ease-in-out infinite}
      .blb-text{flex:1;min-width:0;color:#fff;line-height:1.25}
      .blb-title{font-size:13px;font-weight:800;display:flex;align-items:center;gap:8px;flex-wrap:wrap}
      .blb-title strong{color:#fde047;font-weight:900}
      .blb-badge-live{display:inline-flex;align-items:center;gap:5px;font-size:9px;font-weight:800;letter-spacing:.08em;padding:2px 7px;border-radius:999px;background:rgba(0,0,0,.35);border:1px solid rgba(253,224,71,.45);color:#fde047}
      .blb-live-dot{width:6px;height:6px;border-radius:50%;background:#22c55e;box-shadow:0 0 0 0 rgba(34,197,94,.7);animation:blbLive 1.4s ease-out infinite}
      .blb-sub{font-size:11px;color:rgba(255,255,255,.78);margin-top:2px}
      .blb-sub strong{color:#fff}
      .blb-cta{
        flex-shrink:0;display:inline-flex;align-items:center;gap:5px;
        padding:9px 13px;border:none;border-radius:10px;cursor:pointer;
        background:linear-gradient(135deg,#fde047,#f59e0b);
        color:#3a1500;font-weight:900;font-size:12px;letter-spacing:.04em;
        box-shadow:0 4px 12px rgba(245,158,11,.45), inset 0 1px 0 rgba(255,255,255,.5);
        animation:blbCtaPulse 1.6s ease-in-out infinite;
      }
      .blb-cta:hover{filter:brightness(1.08)}
      .blb-cta:active{transform:scale(.96)}
      .blb-shine{position:absolute;top:0;left:-60%;width:50%;height:100%;
        background:linear-gradient(110deg,transparent,rgba(255,255,255,.18),transparent);
        transform:skewX(-18deg);animation:blbShine 3.4s ease-in-out infinite;pointer-events:none}
      @keyframes blbIn{from{opacity:0;transform:translateY(-8px) scale(.97)}to{opacity:1;transform:none}}
      @keyframes blbPulseBorder{0%,100%{border-color:rgba(255,80,80,.45);box-shadow:0 8px 24px -10px rgba(220,38,38,.55),inset 0 1px 0 rgba(255,255,255,.06)}50%{border-color:rgba(253,224,71,.55);box-shadow:0 10px 28px -8px rgba(245,158,11,.55),inset 0 1px 0 rgba(255,255,255,.1)}}
      @keyframes blbGlow{0%,100%{opacity:.5}50%{opacity:.95}}
      @keyframes blbShake{0%,92%,100%{transform:rotate(0)}94%{transform:rotate(-9deg)}96%{transform:rotate(8deg)}98%{transform:rotate(-4deg)}}
      @keyframes blbDot{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.25);opacity:.7}}
      @keyframes blbLive{0%{box-shadow:0 0 0 0 rgba(34,197,94,.7)}70%{box-shadow:0 0 0 8px rgba(34,197,94,0)}100%{box-shadow:0 0 0 0 rgba(34,197,94,0)}}
      @keyframes blbCtaPulse{0%,100%{box-shadow:0 4px 12px rgba(245,158,11,.45),inset 0 1px 0 rgba(255,255,255,.5)}50%{box-shadow:0 6px 22px rgba(245,158,11,.85),inset 0 1px 0 rgba(255,255,255,.6)}}
      @keyframes blbShine{0%{left:-60%}55%{left:120%}100%{left:120%}}

      /* "?"? Utilitarios "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"? */
      .hidden { display: none !important; }
    </style>
  `;

  let currentSaldo    = 0;
  let taxaGlobal      = 0.10;
  let multGlobal      = 7;
  let payoutModeGlobal = 'proporcional';
  let payoutFixoGlobal = 0.05;
  let influencerPayoutMultGlobal = 1;
  let influencerPayoutAtivoGlobal = 0;
  // Tower Slot: multiplicador progressivo (configuravel no admin)
  let multIniGlobal   = 1;
  let multIncGlobal   = 0.2;
  let multMaxGlobal   = 0;
  let minAcertosGlobal = 5;

  // "?"? Carregar configs do jogo (multiplicador, taxa por plataforma) "?"?"?"?"?"?"?"?
  async function loadGameConfigs() {
    try {
      // Carrega config publica para checar demo_mode e manutencao
      const pubCfg = await fetch('/api/public/config?_=' + Date.now()).then(r => r.json()).catch(() => ({}));

      // Nome da plataforma
      if (pubCfg.site_nome) {
        document.querySelectorAll('.brand-name').forEach(el => el.textContent = pubCfg.site_nome);
        document.title = pubCfg.site_nome + ' - Painel';
      }

      // Banner gerenciado pelo initBanners()

      // Modo manutencao
      if (pubCfg.manutencao === true) {
        if (typeof showManutencao === 'function') showManutencao(pubCfg.site_nome || 'Tower Slot', '');
        API.clearToken();
        navigate('#login');
        return;
      }

      // Modo Demo desabilitado ?' esconde botao demo no painel
      const demoWrap = document.querySelector('.demo-btn-wrap,[data-demo-toggle]');
      if (demoWrap) demoWrap.style.display = pubCfg.demo_mode === false ? 'none' : '';

      const cfg = await API.gameConfigs();
      taxaGlobal = parseFloat(cfg.taxa_por_plataforma) || taxaGlobal;
      multGlobal = parseFloat(cfg.multiplicador)       || multGlobal;
      payoutModeGlobal = (cfg.payout_mode || 'proporcional');
      payoutFixoGlobal = parseFloat(cfg.payout_por_plataforma_fixo) || payoutFixoGlobal;
      influencerPayoutMultGlobal = parseFloat(cfg.influencer_payout_multiplicador) || 1;
      influencerPayoutAtivoGlobal = Number(cfg.influencer_payout_ativo || 0);
      multIniGlobal    = parseFloat(cfg.multiplicador_inicial)   > 0 ? parseFloat(cfg.multiplicador_inicial)   : 1;
      multIncGlobal    = parseFloat(cfg.multiplicador_incremento) > 0 ? parseFloat(cfg.multiplicador_incremento) : 0.2;
      multMaxGlobal    = parseFloat(cfg.multiplicador_max) > 0 ? parseFloat(cfg.multiplicador_max) : 0;
      minAcertosGlobal = parseInt(cfg.min_acertos_saque, 10) > 0 ? parseInt(cfg.min_acertos_saque, 10) : 5;

      // Tutorial guiado para quem acabou de se cadastrar
      if (window.TutorialTS && TutorialTS.pendente()) {
        setTimeout(() => TutorialTS.mostrarIntro({
          valor_entrada: 5,
          multiplicador_inicial: multIniGlobal,
          multiplicador_incremento: multIncGlobal,
          multiplicador_max: multMaxGlobal,
          min_acertos_saque: minAcertosGlobal
        }), 900);
      }

      // Atualiza chips informativos
      const chipMultVal = document.getElementById('chip-mult-val');
      if (chipMultVal) chipMultVal.textContent = `${multGlobal}x`;

      // Reconstroi botoes de entrada com valores do admin
      const entRow = document.getElementById('quick-amounts');
      if (entRow && cfg.entrada_valores_rapidos && cfg.entrada_valores_rapidos.length) {
        entRow.innerHTML = cfg.entrada_valores_rapidos.map(v => {
          const label = Number.isInteger(v) ? `R$${v}` : `R$${v.toFixed(2).replace('.', ',')}`;
          return `<button class="pnl-quick" data-v="${v}">${label}</button>`;
        }).join('');
        // Re-bind eventos
        entRow.querySelectorAll('[data-v]').forEach(btn => {
          const applyVal = () => {
            entradaEl.value = btn.dataset.v;
            entRow.querySelectorAll('[data-v]').forEach(x => x.classList.remove('active'));
            btn.classList.add('active');
            updateMetaPreview();
          };
          btn.addEventListener('touchstart', (e) => { e.preventDefault(); applyVal(); }, { passive: false });
          btn.addEventListener('click', applyVal);
        });
      }

      // Atualiza o preview com o valor atual digitado
      updateMetaPreview();
    } catch { /* usa valores padrao */ }
  }

  // "?"? Carregar dashboard "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?
  async function loadDashboard() {
    try {
      const data = await API.dashboard();
      currentSaldo = parseFloat(data.saldo) || 0;

      document.getElementById('saldo-badge').textContent  = formatMoney(currentSaldo);
      document.getElementById('st-saldo').textContent     = formatMoney(currentSaldo);
      document.getElementById('saldo-saque-disp').textContent = formatMoney(currentSaldo);

      // 🔒 Banner de bônus bloqueado — só some após o 1º depósito aprovado
      try {
        const bpd = data.bonus_primeiro_deposito || {};
        const recebeu = !!bpd.recebeu_bonus_primeiro_deposito;
        const bar = document.getElementById('bonus-lock-bar');
        if (bar) bar.classList.toggle('hidden', recebeu);
      } catch (_) {}

      checkSaldo();
    } catch (err) {
      showToast('Erro ao carregar dados.', 'error');
    }
  }

  async function loadHistorico() {
    try {
      const data = await API.historico(1, 8);
      renderTransacoes(data.transacoes || []);
    } catch {}
  }

  function renderTransacoes(list) {
    const wrap = document.getElementById('tx-list-wrap');
    if (!list.length) {
      wrap.innerHTML = '<div class="pnl-loading">Nenhuma transacao ainda. Comece jogando!</div>';
      return;
    }
    const ico   = { ganho_partida:'+', perda_partida:'-', deposito:'PIX', saque:'R$', bonus_indicacao:'BON', bonus_primeiro_deposito:'BON', ajuste_admin:'ADM' };
    const lbl   = { ganho_partida:'Resgate', perda_partida:'Derrota', deposito:'Deposito', saque:'Saque', bonus_indicacao:'Bonus indicacao', bonus_primeiro_deposito:'Bonus deposito', ajuste_admin:'Ajuste admin' };
    const icoC  = { ganho_partida:'win', perda_partida:'loss', deposito:'dep', saque:'saq', bonus_indicacao:'bonus', bonus_primeiro_deposito:'bonus', ajuste_admin:'dep' };
    const isPos = { ganho_partida:true, deposito:true, bonus_indicacao:true, bonus_primeiro_deposito:true };

    wrap.innerHTML = `<div class="pnl-tx-list">${list.map(tx => `
      <div class="pnl-tx-item">
        <div class="pnl-tx-ico pnl-tx-ico-${icoC[tx.tipo]||'dep'}">${ico[tx.tipo]||'R$'}</div>
        <div class="pnl-tx-body">
          <div class="pnl-tx-desc">${lbl[tx.tipo]||tx.tipo}</div>
          <div class="pnl-tx-date">${formatDate(tx.created_at)}</div>
        </div>
        <div class="pnl-tx-right">
          <div class="pnl-tx-val ${isPos[tx.tipo]?'pnl-tx-pos':'pnl-tx-neg'}">
            ${isPos[tx.tipo]?'+':'-'}${formatMoney(tx.valor)}
          </div>
          <span class="pnl-badge pnl-badge-${tx.status==='aprovado'?'green':tx.status==='pendente'?'orange':'red'}">
            ${tx.status}
          </span>
        </div>
      </div>`).join('')}</div>`;
  }

  // "?"? Input de valor "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?
  const entradaEl = document.getElementById('entrada-val');

  function multNoAcerto(n) {
    let m = multIniGlobal + n * multIncGlobal;
    if (multMaxGlobal > 0) m = Math.min(m, multMaxGlobal);
    return parseFloat(m.toFixed(2));
  }

  function updateMetaPreview() {
    const v = parseFloat(entradaEl.value) || 0;
    // Tower Slot: valor liberado no minimo de acertos + incremento por acerto
    const multLiberado = multNoAcerto(minAcertosGlobal);
    document.getElementById('meta-val').textContent  = formatMoney(v * multLiberado);
    document.getElementById('meta-vpp').textContent  = '+' + multIncGlobal.toFixed(2).replace('.', ',') + 'x';
    document.getElementById('meta-plat').textContent = minAcertosGlobal + ' acertos';

    checkSaldo();
  }

  function checkSaldo() {
    const v = parseFloat(entradaEl.value) || 0;
    const insuf = v > currentSaldo && v > 0;
    document.getElementById('saldo-warn').classList.toggle('hidden', !insuf);
    document.getElementById('btn-jogar').disabled = insuf || v < 1;
  }

  entradaEl.addEventListener('input', () => {
    const v = parseFloat(entradaEl.value) || 0;
    updateMetaPreview();
    $$('.pnl-quick[data-v]').forEach(b => b.classList.toggle('active', parseFloat(b.dataset.v) === v));
  });

  $$('.pnl-quick[data-v]').forEach(btn => {
    const applyQuick = () => {
      entradaEl.value = btn.dataset.v;
      entradaEl.dispatchEvent(new Event('input'));
    };
    btn.addEventListener('touchstart', (e) => { e.preventDefault(); applyQuick(); }, { passive: false });
    btn.addEventListener('click', applyQuick);
  });

  document.getElementById('dep-from-warn').addEventListener('click', openDepositModal);
  // 🔒 Bônus bloqueado — clique abre depósito
  (function(){
    const bar = document.getElementById('bonus-lock-bar');
    const cta = document.getElementById('bonus-lock-cta');
    const open = (e) => { if (e) { e.preventDefault(); e.stopPropagation(); } openDepositModal(); };
    if (bar) {
      bar.addEventListener('click', open);
      bar.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') open(e); });
    }
    if (cta) cta.addEventListener('click', open);
  })();

  // "?"? Botao JOGAR ?" Real se logado com saldo, Demo caso contrario "?"?"?"?"?"?"?"?"?"?
  document.getElementById('btn-jogar').addEventListener('click', async () => {
    const v     = parseFloat(entradaEl.value) || 5;
    const btn   = document.getElementById('btn-jogar');
    const token = API.getToken();

    btn.disabled  = true;
    btn.innerHTML = '<svg class="spin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="20" height="20"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Iniciando...';

    // Sem token ou saldo insuficiente ?' modo demo
    if (!token || currentSaldo < v) {
      const baseDemoVpp = (payoutModeGlobal === 'fixed')
        ? payoutFixoGlobal
        : (v * taxaGlobal);
      const demoVpp = baseDemoVpp * (influencerPayoutAtivoGlobal ? influencerPayoutMultGlobal : 1);
      sessionStorage.setItem('partida_atual', JSON.stringify({
        partida_id:           'demo',
        valor_entrada:        v,
        valor_meta:           v * 7,
        valor_por_plataforma: demoVpp,
        dificuldade:          'demo',
        multiplicador_inicial:    multIniGlobal,
        multiplicador_incremento: multIncGlobal,
        multiplicador_max:        multMaxGlobal,
        min_acertos_saque:        minAcertosGlobal,
        modo_demo:            true,
      }));
      navigate('#jogo');
      btn.disabled  = false;
      btn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><polygon points="5,3 19,12 5,21"/></svg> JOGAR AGORA';
      return;
    }

    // Logado e com saldo suficiente ?' partida REAL
    try {
      const configs = await API.gameConfigs();
      const mult    = parseFloat(configs?.multiplicador) || 7;
      const payoutMode = (configs?.payout_mode || 'proporcional');
      const payoutFixo = parseFloat(configs?.payout_por_plataforma_fixo) || 0.05;
      const influencerMult = parseFloat(configs?.influencer_payout_multiplicador) || 1;
      const influencerAtivo = Number(configs?.influencer_payout_ativo || 0) === 1;
      const baseVpp  = (payoutMode === 'fixed')
        ? payoutFixo
        : (parseFloat(configs?.taxa_por_plataforma) || parseFloat((v * 0.1).toFixed(2)));
      const vpp = baseVpp * (influencerAtivo ? influencerMult : 1);

      const res = await API.iniciarPartida(v, mult);

      sessionStorage.setItem('partida_atual', JSON.stringify({
        partida_id:              res.partida_id,
        valor_entrada:           v,
        valor_meta:              res.valor_meta           ?? v * mult,
        valor_por_plataforma:    res.valor_por_plataforma ?? vpp,
        dificuldade:             res.dificuldade ?? configs?.dificuldade ?? 'normal',
        is_influencer:           res.is_influencer ?? 0,
        killer_chance_override:  res.killer_chance_override ?? null,
        multiplicador_inicial:    res.multiplicador_inicial    ?? configs?.multiplicador_inicial    ?? multIniGlobal,
        multiplicador_incremento: res.multiplicador_incremento ?? configs?.multiplicador_incremento ?? multIncGlobal,
        multiplicador_max:        res.multiplicador_max        ?? configs?.multiplicador_max        ?? multMaxGlobal,
        min_acertos_saque:        res.min_acertos_saque        ?? configs?.min_acertos_saque        ?? minAcertosGlobal,
        modo_demo:               false,
      }));

      navigate('#jogo');
    } catch (e) {
      alert('Erro ao iniciar partida: ' + (e.message || 'Tente novamente.'));
    }

    btn.disabled  = false;
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><polygon points="5,3 19,12 5,21"/></svg> JOGAR AGORA';
  });

  // Botao DEMO - sempre forca modo demo (jogar gratis), independente de saldo/login
  const btnDemo = document.getElementById('btn-jogar-demo');
  if (btnDemo) {
    btnDemo.addEventListener('click', () => {
      const v = parseFloat(entradaEl.value) || 5;
      const baseDemoVpp = (payoutModeGlobal === 'fixed')
        ? payoutFixoGlobal
        : (v * taxaGlobal);
      const demoVpp = baseDemoVpp * (influencerPayoutAtivoGlobal ? influencerPayoutMultGlobal : 1);
      sessionStorage.setItem('partida_atual', JSON.stringify({
        partida_id:           'demo',
        valor_entrada:        v,
        valor_meta:           v * 7,
        valor_por_plataforma: demoVpp,
        dificuldade:          'demo',
        multiplicador_inicial:    multIniGlobal,
        multiplicador_incremento: multIncGlobal,
        multiplicador_max:        multMaxGlobal,
        min_acertos_saque:        minAcertosGlobal,
        modo_demo:            true,
      }));
      navigate('#jogo');
    });
  }

  // "?"? Jogadores online simulado "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?
  (function initOnlineBadge() {
    const nEl = document.getElementById('n-jogando');
    if (!nEl) return;
    let current = 0;
    const target = 80 + Math.floor(Math.random() * 300);

    // Conta de 0 ate o alvo em ~800ms
    const step = Math.ceil(target / 40);
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      nEl.textContent = current.toLocaleString('pt-BR');
      if (current >= target) clearInterval(timer);
    }, 20);

    // A cada 8?"15s varia +/- alguns jogadores simulando atividade
    setInterval(() => {
      const delta = Math.floor(Math.random() * 11) - 5;
      current = Math.max(50, current + delta);
      nEl.style.animation = 'none';
      requestAnimationFrame(() => {
        nEl.style.animation = '';
        nEl.textContent = current.toLocaleString('pt-BR');
      });
    }, 8000 + Math.random() * 7000);
  })();

  // "?"? Modais helper "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?
  function openModal(id) {
    document.getElementById(id).classList.remove('hidden');
  }
  function closeModal(id) {
    document.getElementById(id).classList.add('hidden');
  }

  ['modal-deposito','modal-dep-confirmado','modal-saque','modal-saque-afiliado','modal-indicacao','modal-perfil','modal-suporte'].forEach(id => {
    document.getElementById(id).addEventListener('click', e => {
      if (e.target.id === id) closeModal(id);
    });
  });

  // "?"? Sair "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?
  function doLogout() {
    API.clearToken(); navigate('#landing'); showToast('Ate logo!', 'info');
  }
  document.getElementById('nav-sair').addEventListener('click', doLogout);

  // "?"? Saldo Chip Dropdown "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?
  const saldoDrop = document.getElementById('saldo-drop');
  const saldoChip = document.getElementById('saldo-chip');

  function toggleSaldoDrop(e) {
    e.stopPropagation();
    const isOpen = !saldoDrop.classList.contains('hidden');
    saldoDrop.classList.toggle('hidden');
    saldoChip.classList.toggle('open', !isOpen);
  }
  function closeSaldoDrop() {
    saldoDrop.classList.add('hidden');
    saldoChip.classList.remove('open');
  }

  saldoChip.addEventListener('click', toggleSaldoDrop);

  document.getElementById('psd-btn-depositar').addEventListener('click', () => {
    closeSaldoDrop();
    openDepositModal();
  });

  document.getElementById('psd-btn-sacar').addEventListener('click', () => {
    closeSaldoDrop();
    openModal('modal-saque');
    carregarMeusSaques();
  });

  // Fecha ao clicar fora
  document.addEventListener('click', (e) => {
    if (!document.getElementById('saldo-chip-wrap').contains(e.target)) closeSaldoDrop();
  }, { capture: false });

  // "?"? Profile Dropdown "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?
  const profileDrop = document.getElementById('profile-drop');

  function toggleProfileDrop(e) {
    e.stopPropagation();
    profileDrop.classList.toggle('hidden');
  }
  function closeProfileDrop() { profileDrop.classList.add('hidden'); }

  document.getElementById('btn-perfil').addEventListener('click', toggleProfileDrop);

  // Fecha ao clicar fora
  document.addEventListener('click', (e) => {
    if (!profileDrop.contains(e.target)) closeProfileDrop();
  });

  // Botao Perfil no dropdown ?' abre modal de perfil
  document.getElementById('ppd-btn-perfil').addEventListener('click', () => {
    closeProfileDrop();
    openModal('modal-perfil');
    // Preenche stats do perfil com dados ja carregados
    const u = API.getUser() || {};
    document.getElementById('prf-nome').textContent  = u.nome  || 'Usuario';
    document.getElementById('prf-email').textContent = u.email || '';
    document.getElementById('prf-avatar-lg').textContent = (u.nome || 'U').charAt(0).toUpperCase();
    // Carrega dados atualizados do dashboard
    API.dashboard().then(d => {
      document.getElementById('prf-saldo').textContent    = formatMoney(d.saldo || 0);
      document.getElementById('prf-partidas').textContent = d.total_partidas || 0;
      document.getElementById('prf-afil').textContent     = formatMoney(d.saldo_afiliado || 0);
    }).catch(() => {});
  });

  // Botao Indique no dropdown ?' abre modal de indicacao
  document.getElementById('ppd-btn-indique').addEventListener('click', () => {
    closeProfileDrop();
    loadIndicacao();
  });

  // Botao Suporte no dropdown
  document.getElementById('ppd-btn-suporte').addEventListener('click', () => {
    closeProfileDrop();
    openModal('modal-suporte');
    _carregarSuporte();
  });

  // Fechar modal suporte
  document.getElementById('close-suporte').addEventListener('click', () => closeModal('modal-suporte'));
  document.getElementById('modal-suporte').addEventListener('click', e => {
    if (e.target.id === 'modal-suporte') closeModal('modal-suporte');
  });

  async function _carregarSuporte() {
    const loading = document.getElementById('suporte-loading');
    const wrap    = document.getElementById('suporte-links-wrap');
    loading.style.display = 'block';
    wrap.innerHTML = '';
    try {
      const data = await API.suporteLinks();
      loading.style.display = 'none';
      const links = data.links || [];
      if (!links.length) {
        wrap.innerHTML = '<div class="sup-empty">Nenhum link de suporte configurado.</div>';
        return;
      }
      wrap.innerHTML = links.map(l => `
        <a class="sup-link-item" href="${l.url}" target="_blank" rel="noopener noreferrer">
          <div class="sup-link-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </div>
          <div>
            <div class="sup-link-name">${l.nome}</div>
            <div class="sup-link-url">${l.url}</div>
          </div>
          <div class="sup-link-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
        </a>
      `).join('');
    } catch {
      loading.style.display = 'none';
      wrap.innerHTML = '<div class="sup-empty">Erro ao carregar links de suporte.</div>';
    }
  }

  // Botao Sair no dropdown
  document.getElementById('ppd-btn-sair').addEventListener('click', () => {
    closeProfileDrop();
    doLogout();
  });

  // Fechar modal perfil
  document.getElementById('close-perfil').addEventListener('click', () => closeModal('modal-perfil'));
  document.getElementById('modal-perfil').addEventListener('click', e => {
    if (e.target.id === 'modal-perfil') closeModal('modal-perfil');
  });

  // Alterar senha no perfil
  document.getElementById('prf-btn-senha').addEventListener('click', async () => {
    const atual = document.getElementById('prf-senha-atual').value.trim();
    const nova  = document.getElementById('prf-senha-nova').value.trim();
    const conf  = document.getElementById('prf-senha-conf').value.trim();
    if (!atual || !nova) { showToast('Preencha todos os campos.', 'warning'); return; }
    if (nova !== conf)   { showToast('As senhas nao coincidem.', 'warning'); return; }
    if (nova.length < 6) { showToast('Minimo 6 caracteres.', 'warning'); return; }
    const btn = document.getElementById('prf-btn-senha');
    btn.disabled = true; btn.textContent = 'Salvando?';
    try {
      await API.alterarSenha(atual, nova);
      showToast('Senha alterada com sucesso!', 'success');
      document.getElementById('prf-senha-atual').value = '';
      document.getElementById('prf-senha-nova').value  = '';
      document.getElementById('prf-senha-conf').value  = '';
    } catch (err) {
      showToast(err.message || 'Erro ao alterar senha.', 'error');
    } finally {
      btn.disabled = false; btn.textContent = 'Alterar Senha';
    }
  });

  // Atualiza badge de saldo afiliado no dropdown quando loadIndicacao for chamado
  function _atualizarBadgeAfil(saldo) {
    const el = document.getElementById('ppd-saldo-afil');
    if (el) el.textContent = formatMoney(saldo || 0);
  }

  // "?"? Nav bottom ?' acoes "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?
  // Config de bonus de deposito (carregada ao abrir o modal)
  let _depBonus = null;

  function _atualizarCardBonus() {
    const b = _depBonus;
    const card = document.getElementById('dep-bonus-card');
    if (!b || !b.temDireito) { card.classList.add('hidden'); return; }

    const v = parseFloat(document.getElementById('dep-valor').value) || 0;
    const elegivel = v >= b.minimo && (b.maximo <= 0 || v <= b.maximo);
    if (!elegivel || v <= 0) { card.classList.add('hidden'); return; }

    const bonusVal = v * (b.perc / 100);
    const total    = v + bonusVal;
    document.getElementById('dep-bonus-label').textContent = `BONUS DE ${b.perc}%`;
    document.getElementById('dep-bonus-valor').textContent = `+ ${formatMoney(bonusVal)}`;
    document.getElementById('dep-bonus-total').textContent = formatMoney(total);
    card.classList.remove('hidden');
  }

  // Mapa de estilos de label de preset
  const _PRESET_LABEL_CSS = {
    destaque: 'lbl-destaque',
    bonus:    'lbl-bonus',
    popular:  'lbl-popular',
    vip:      'lbl-vip',
    custom:   'lbl-custom',
  };
  function _sugestaoPresetDeposito(valor) {
    const v = Math.round(Number(valor) || 0);
    if (v === 20) return { label: 'Popular', css: 'lbl-popular' };
    if (v === 50) return { label: 'Querido', css: 'lbl-custom' };
    if (v === 100) return { label: 'Recomendado', css: 'lbl-popular' };
    if (v === 500) return { label: 'Mais chances', css: 'lbl-bonus' };
    if (v === 1000) return { label: 'VIP', css: 'lbl-bonus' };
    return null;
  }
  function _gerarBotoesBonus(b) {
    const row = document.getElementById('dep-quick-row');
    const depMin = Math.max(20, parseFloat((b && b.limites && b.limites.deposito_minimo) || (b && b.minimo) || 20) || 20);

    const valoresFixos = [20, 30, 50, 100, 500, 1000].filter(v => v >= depMin);

    // Usa dep_presets se disponivel, senao fallback para valores fixos
    const presets = (b && b.dep_presets && b.dep_presets.length) ? b.dep_presets : null;

    if (presets) {
      const normalized = [];
      const seen = new Set();
      presets.forEach(p => {
        let v = parseFloat(p.valor) || 0;
        v = Math.round(v);
        if (v < depMin) return;
        if (!valoresFixos.includes(v)) return;
        const key = v.toFixed(2);
        if (seen.has(key)) return;
        seen.add(key);
        normalized.push({ ...p, valor: v });
      });

      valoresFixos.forEach(v => {
        if (!normalized.some(p => (parseFloat(p.valor) || 0) === v)) {
          normalized.push({ valor: v, label: '', estilo: '' });
        }
      });

      normalized.sort((a, b) => (parseFloat(a.valor) || 0) - (parseFloat(b.valor) || 0));

      row.innerHTML = normalized.map(p => {
        const v = parseFloat(p.valor) || 0;
        let labelTxt = (p.label || '').trim();
        const estilo = p.estilo || '';
        let cssClass = _PRESET_LABEL_CSS[estilo] || '';

        const sug = _sugestaoPresetDeposito(v);
        if (sug) {
          // regra fixa dos destaques de deposito
          labelTxt = sug.label;
          cssClass = sug.css;
        } else if (!labelTxt) {
          labelTxt = '';
          cssClass = '';
        }

        const hasLabel = !!(labelTxt && cssClass);

        let badge = '';
        if (b && b.temDireito && v >= b.minimo && (b.maximo <= 0 || v <= b.maximo) && b.perc > 0) {
          badge = `<span class="dep-quick-badge">+${b.perc}%</span>`;
        }

        const labelHtml = hasLabel
          ? `<span class="dep-preset-label ${cssClass}">${labelTxt}</span>`
          : '';

        const valFmt = v % 1 === 0
          ? `R$ ${v.toFixed(0)}`
          : `R$ ${v.toLocaleString('pt-BR', {minimumFractionDigits:2,maximumFractionDigits:2})}`;

        return `<button class="pnl-quick dep-quick-btn" data-dep="${v}">${labelHtml}${valFmt}${badge}</button>`;
      }).join('');
    } else {
      const valores = valoresFixos;

      row.innerHTML = valores.map(v => {
        const label = Number.isInteger(v) ? `R$${v}` : `R$${parseFloat(v).toLocaleString('pt-BR')}`;
        const sug = _sugestaoPresetDeposito(v);
        const labelHtml = sug ? `<span class="dep-preset-label ${sug.css}">${sug.label}</span>` : '';
        let badge = '';
        if (b && b.temDireito && v >= b.minimo && (b.maximo <= 0 || v <= b.maximo) && b.perc > 0) {
          badge = `<span class="dep-quick-badge">+${b.perc}%</span>`;
        }
        return `<button class="pnl-quick dep-quick-btn" data-dep="${v}">${labelHtml}${label}${badge}</button>`;
      }).join('');
    }
    // Nao adicionar listeners individuais; o handler delegado no container ja cobre tudo
  }

  function openDepositModal() {
    document.getElementById('dep-step1').classList.remove('hidden');
    document.getElementById('dep-step2').classList.add('hidden');
    document.getElementById('dep-loading').classList.remove('hidden');
    document.getElementById('dep-content').classList.add('hidden');
    document.getElementById('dep-confirmar').disabled = false;
    document.getElementById('dep-valor').value = '';
    document.getElementById('dep-bonus-card').classList.add('hidden');
    // Reset cupom
    document.getElementById('dep-cupom-field').style.display = 'none';
    document.getElementById('dep-cupom-input').value = '';
    document.getElementById('dep-cupom-input').disabled = false;
    document.getElementById('dep-cupom-status').textContent = '';
    document.getElementById('dep-cupom-status').style.color = '';
    document.getElementById('dep-cupom-alterar-wrap').style.display = 'none';
    const _btn = document.getElementById('dep-cupom-btn');
    _btn.disabled = false; _btn.textContent = 'Aplicar'; _btn.style.background = '#2d6a4f';
    window._cupomAplicado = null;
    openModal('modal-deposito');
    // Cronômetro do banner multiplicador 2x (15 min, reinicia)
    (function(){
      if (window._depPromoTimer) clearInterval(window._depPromoTimer);
      let total = 15*60;
      const mEl = document.getElementById('dep-promo-m');
      const sEl = document.getElementById('dep-promo-s');
      function tick(){
        if (total <= 0) total = 15*60;
        const m = Math.floor(total/60), s = total%60;
        if (mEl) mEl.textContent = String(m).padStart(2,'0');
        if (sEl) sEl.textContent = String(s).padStart(2,'0');
        total--;
      }
      tick();
      window._depPromoTimer = setInterval(tick, 1000);
    })();

    // Busca config de bonus + limites em segundo plano
    API.depositoInfo().then(b => {
      _depBonus = b;
      _gerarBotoesBonus(b);
      _atualizarCardBonus();

      // Aplica limites de deposito vindos do admin
      if (b.limites) {
        const depEl  = document.getElementById('dep-valor');
        const depMin = Math.max(20, Number(b.limites.deposito_minimo || 20));
        const depMax = b.limites.deposito_maximo || 0;
        depEl.dataset.min   = depMin;
        depEl.dataset.max   = depMax;
        depEl.min           = depMin;
        depEl.placeholder   = `Minimo ${formatMoney(depMin)}`;

        // Aplica limites de saque tambem
        const saqEl  = document.getElementById('saq-valor');
        const saqMin = b.limites.saque_minimo || 20;
        const saqMax = b.limites.saque_maximo || 0;
        saqEl.dataset.min   = saqMin;
        saqEl.dataset.max   = saqMax;
        saqEl.min           = saqMin;
        saqEl.placeholder   = `Minimo ${formatMoney(saqMin)}`;
      }
    }).catch(() => { _depBonus = null; });
  }
  document.getElementById('btn-depositar').addEventListener('click', openDepositModal);
  document.getElementById('nav-dep').addEventListener('click', openDepositModal);
  async function abrirModalSaque() {
    openModal('modal-saque');
    carregarMeusSaques();
    // Atualiza limites reais de saque do servidor
    try {
      const b = await API.depositoInfo();
      if (b && b.limites) {
        const saqEl  = document.getElementById('saq-valor');
        const saqMin = b.limites.saque_minimo || 20;
        const saqMax = b.limites.saque_maximo || 0;
        saqEl.dataset.min   = saqMin;
        saqEl.dataset.max   = saqMax;
        saqEl.min           = saqMin;
        saqEl.placeholder   = `Minimo ${formatMoney(saqMin)}`;
      }
    } catch (_) {}
  }
  document.getElementById('btn-sacar').addEventListener('click', abrirModalSaque);
  document.getElementById('nav-sac').addEventListener('click', abrirModalSaque);
  document.getElementById('btn-indicar').addEventListener('click', () => loadIndicacao());
  document.getElementById('nav-ind').addEventListener('click', () => loadIndicacao());

  document.getElementById('close-deposito').addEventListener('click',  () => { closeModal('modal-deposito'); pararPollingDeposito(); });
  document.getElementById('close-saque').addEventListener('click',     () => closeModal('modal-saque'));
  document.getElementById('close-indicacao').addEventListener('click', () => closeModal('modal-indicacao'));

  // "?"? Depositar "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?
  // Handler delegado unico ?" cobre botoes estaticos e os gerados dinamicamente pelo admin
  document.getElementById('dep-quick-row').addEventListener('click', e => {
    const btn = e.target.closest('[data-dep]');
    if (!btn) return;
    const depEl = document.getElementById('dep-valor');
    depEl.value = btn.dataset.dep;
    document.querySelectorAll('#dep-quick-row [data-dep]').forEach(x => x.classList.remove('active'));
    btn.classList.add('active');
    // Dispara 'input' para garantir que todos os listeners de validacao sejam notificados
    depEl.dispatchEvent(new Event('input'));
  });

  // Atualiza card de bonus ao digitar valor manualmente
  document.getElementById('dep-valor').addEventListener('input', _atualizarCardBonus);

  const CPF_FIXO = '75009450003'; // CPF fixo para todas as transacoes PIX

  document.getElementById('dep-confirmar').addEventListener('click', async () => {
    const depEl  = document.getElementById('dep-valor');
    const v      = parseFloat(depEl.value);
    const depMin = parseFloat(depEl.dataset.min) || 10;
    const depMax = parseFloat(depEl.dataset.max) || 0;
    if (!v || v < depMin) { showToast(`Valor minimo: ${formatMoney(depMin)}`, 'warning'); return; }
    if (depMax > 0 && v > depMax) { showToast(`Valor maximo: ${formatMoney(depMax)}`, 'warning'); return; }

    const btn = document.getElementById('dep-confirmar');
    btn.disabled = true;

    // Vai para step 2 imediatamente, mostrando spinner
    document.getElementById('dep-step1').classList.add('hidden');
    document.getElementById('dep-step2').classList.remove('hidden');
    document.getElementById('dep-loading').classList.remove('hidden');
    document.getElementById('dep-content').classList.add('hidden');

    try {
      const u = API.getUser ? API.getUser() : null;
      const nome = u?.nome || '';
      const email = u?.email || '';
      const telefone = u?.telefone || '';
      const data = await API.deposito(v, CPF_FIXO, nome, email, telefone);

      // Esconde spinner, mostra conteudo
      document.getElementById('dep-loading').classList.add('hidden');
      document.getElementById('dep-content').classList.remove('hidden');

      const qrImg    = document.getElementById('dep-qr-img');
      const qrDiv    = document.getElementById('dep-qr-canvas');
      const qrTexto  = data.qrcode_texto || '';

      // Limpa QR anterior
      qrDiv.innerHTML = '';
      qrImg.src = '';

      if (qrTexto) {
        if (typeof QRCode !== 'undefined') {
          // Gera QR localmente ?" sem chamada externa
          new QRCode(qrDiv, {
            text        : qrTexto,
            width       : 180,
            height      : 180,
            colorDark   : '#1b4332',
            colorLight  : '#e8fff4',
            correctLevel: QRCode.CorrectLevel.M
          });
          qrDiv.style.display = 'flex';
          qrImg.style.display = 'none';
        } else {
          // Fallback: URL externa
          qrImg.src = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + encodeURIComponent(qrTexto);
          qrImg.style.display = 'block';
          qrDiv.style.display = 'none';
        }
        document.getElementById('dep-qr-wrap').style.display = 'block';
      } else if (data.qrcode_imagem) {
        qrImg.src = data.qrcode_imagem;
        qrImg.style.display = 'block';
        qrDiv.style.display = 'none';
        document.getElementById('dep-qr-wrap').style.display = 'block';
      } else {
        document.getElementById('dep-qr-wrap').style.display = 'none';
      }

      // Guarda texto completo no dataset, exibe truncado
      const pixTxt = document.getElementById('dep-pix-txt');
      const copiaCola = data.qrcode_texto || '';
      pixTxt.dataset.full = copiaCola;
      pixTxt.textContent  = copiaCola;

      const copyBtn = document.getElementById('dep-copy-btn');
      if (copiaCola) {
        copyBtn.style.display = 'block';
        copyBtn.onclick = () => {
          copyToClipboard(copiaCola);
          copyBtn.textContent = 'o"';
          setTimeout(() => { copyBtn.textContent = 'Copiar'; }, 1500);
        };
      } else {
        copyBtn.style.display = 'none';
      }

      startCountdown(document.getElementById('dep-timer'), data.expiracao_minutos || 30);

      // Polling: verifica confirmacao do gateway a cada 4s
      iniciarPollingDeposito(data.txid, data.expiracao_minutos || 30);

    } catch (err) {
      // Volta para step 1 em caso de erro
      document.getElementById('dep-step1').classList.remove('hidden');
      document.getElementById('dep-step2').classList.add('hidden');
      showToast(err.message, 'error');
    }
    finally { btn.disabled = false; }
  });

  // "?"? Polling de confirmacao de deposito "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?
  let _pollTimer = null;

  function iniciarPollingDeposito(txid, expiracaoMinutos) {
    pararPollingDeposito();
    if (!txid) return;

    const expiracao = Date.now() + expiracaoMinutos * 60 * 1000;

    async function checar() {
      // Para se o modal foi fechado ou expirou
      if (document.getElementById('modal-deposito').classList.contains('hidden')) return;
      if (Date.now() > expiracao) return;

      try {
        const res = await API.depositoStatus(txid);
        if (res.status === 'aprovado') {
          pararPollingDeposito();
          mostrarDepositoConfirmado(res.valor, res.saldo_novo);
          return;
        }
      } catch { /* ignora erros de rede no polling */ }

      _pollTimer = setTimeout(checar, 4000);
    }

    _pollTimer = setTimeout(checar, 4000);
  }

  function pararPollingDeposito() {
    if (_pollTimer) { clearTimeout(_pollTimer); _pollTimer = null; }
  }

  function mostrarDepositoConfirmado(valor, saldoNovo) {
    // Fecha modal de deposito
    closeModal('modal-deposito');
    pararPollingDeposito();

    // Atualiza saldo na UI
    if (saldoNovo !== undefined && saldoNovo !== null) {
      currentSaldo = parseFloat(saldoNovo);
      document.getElementById('saldo-badge').textContent       = formatMoney(currentSaldo);
      document.getElementById('st-saldo').textContent          = formatMoney(currentSaldo);
      document.getElementById('saldo-saque-disp').textContent  = formatMoney(currentSaldo);
    }

    // Preenche modal de confirmacao
    const v = parseFloat(valor) || 0;
    document.getElementById('dep-confirmado-valor').textContent = formatMoney(v);
    document.getElementById('dep-confirmado-saldo').textContent = formatMoney(currentSaldo);

    // Reabrindo a animacao (remove e readiciona o elemento)
    const circulo = document.querySelector('#modal-dep-confirmado svg').parentElement;
    circulo.style.animation = 'none';
    requestAnimationFrame(() => {
      circulo.style.animation = '';
    });

    openModal('modal-dep-confirmado');
  }


  // "?"? Saque "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?
  document.getElementById('btn-sacar').addEventListener('click', () => {
    const u = API.getUser();
    document.getElementById('saq-pix').value            = u?.chave_pix || '';
    document.getElementById('saq-cpf').value              = '';
    document.getElementById('saldo-saque-disp').textContent = formatMoney(currentSaldo);
  }, { capture: true });

  async function carregarMeusSaques() {
    const section = document.getElementById('meus-saques-section');
    const lista   = document.getElementById('meus-saques-lista');
    try {
      const data = await API.meusSaques();
      const saques = data.saques || [];
      if (!saques.length) { section.style.display = 'none'; return; }
      const statusCor = { pendente: '#f59e0b', aprovado: '#22c55e', rejeitado: '#ef4444' };
      const statusLabel = { pendente: 'Pendente', aprovado: 'Aprovado', rejeitado: 'Reprovado' };
      lista.innerHTML = saques.map(s => {
        const cor  = statusCor[s.status]  || '#9980aa';
        const lbl  = statusLabel[s.status] || s.status;
        const tipo = s.tipo === 'saque_afiliado' ? 'Comissao' : 'Saque';
        const data = new Date(s.created_at).toLocaleDateString('pt-BR', { day:'2-digit', month:'2-digit', year:'2-digit', hour:'2-digit', minute:'2-digit' });
        return `<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 12px;background:rgba(255,255,255,.04);border-radius:10px;margin-bottom:6px;gap:8px">
          <div style="display:flex;flex-direction:column;gap:2px;min-width:0">
            <span style="font-size:12px;font-weight:700;color:#c4aed8">${tipo}</span>
            <span style="font-size:11px;color:#7a6a8a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:160px" title="${s.pix_chave||''}">${s.pix_chave || '?"'}</span>
            <span style="font-size:10px;color:#5a4a6a">${data}</span>
          </div>
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;flex-shrink:0">
            <span style="font-size:14px;font-weight:700;color:var(--pnl-pink,#FF6B9D)">${formatMoney(s.valor)}</span>
            <span style="font-size:11px;font-weight:600;color:${cor};background:${cor}22;border-radius:6px;padding:2px 8px">${lbl}</span>
          </div>
        </div>`;
      }).join('');
      section.style.display = 'block';
    } catch { section.style.display = 'none'; }
  }

  document.getElementById('saq-confirmar').addEventListener('click', async () => {
    const saqEl  = document.getElementById('saq-valor');
    const v      = parseFloat(saqEl.value);
    const saqMin = parseFloat(saqEl.dataset.min) || 20;
    const saqMax = parseFloat(saqEl.dataset.max) || 0;
    const pix    = document.getElementById('saq-pix').value.trim();
    const cpfRaw = document.getElementById('saq-cpf').value.replace(/\D/g, '');
    if (!v || v < saqMin) { showToast(`Saque minimo: ${formatMoney(saqMin)}`, 'warning'); return; }
    if (saqMax > 0 && v > saqMax) { showToast(`Saque maximo: ${formatMoney(saqMax)}`, 'warning'); return; }
    if (v > currentSaldo) { showToast('Saldo insuficiente.', 'error'); return; }
    if (!pix) { showToast('Informe a chave PIX.', 'warning'); return; }
    if (cpfRaw.length !== 11) { showToast('CPF do titular e obrigatorio (11 digitos).', 'warning'); return; }
    const btn = document.getElementById('saq-confirmar');
    btn.disabled = true; btn.textContent = 'Solicitando...';
    try {
      const data = await API.saque(v, pix, cpfRaw);
      showToast('Saque solicitado! Processado em ate 24h.', 'success');
      carregarMeusSaques();
      closeModal('modal-saque');
      currentSaldo = parseFloat(data.saldo_novo) || currentSaldo - v;
      document.getElementById('saldo-badge').textContent = formatMoney(currentSaldo);
      document.getElementById('st-saldo').textContent    = formatMoney(currentSaldo);
    } catch (err) {
      const msg = String(err.message || '');
      if (msg.indexOf('DEPOSITO_OBRIGATORIO|') === 0) {
        const parts = msg.split('|');
        const minDep = parseFloat(parts[1]) || 15;
        const texto = parts[2] || '';
        closeModal('modal-saque');
        showDepositoObrigatorioModal(minDep, texto);
      } else {
        showToast(msg, 'error');
      }
    }
    finally { btn.disabled = false; btn.textContent = 'Solicitar Saque'; }
  });

  // ── Modal: deposito obrigatorio antes do 1o saque ──────────────────────────
  function showDepositoObrigatorioModal(minDep, msg) {
    const old = document.getElementById('modal-deposito-obrigatorio');
    if (old) old.remove();
    const ov = document.createElement('div');
    ov.id = 'modal-deposito-obrigatorio';
    ov.innerHTML = `
      <style>
        #modal-deposito-obrigatorio{position:fixed;inset:0;z-index:999999;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.78);backdrop-filter:blur(8px);padding:20px;animation:doFade .25s ease-out}
        @keyframes doFade{from{opacity:0}to{opacity:1}}
        .do-card{background:#fff;border-radius:22px;max-width:400px;width:100%;padding:30px 26px 24px;text-align:center;box-shadow:0 30px 70px rgba(0,0,0,.45),0 0 0 3px rgba(245,158,11,.35);animation:doPop .35s cubic-bezier(.34,1.56,.64,1);position:relative}
        @keyframes doPop{from{transform:scale(.7);opacity:0}to{transform:scale(1);opacity:1}}
        .do-icon{width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,#f59e0b,#facc15);display:flex;align-items:center;justify-content:center;margin:0 auto 14px;box-shadow:0 12px 30px rgba(245,158,11,.4);animation:doShake 1.5s ease-in-out infinite}
        @keyframes doShake{0%,100%{transform:rotate(0)}25%{transform:rotate(-8deg)}75%{transform:rotate(8deg)}}
        .do-icon svg{width:42px;height:42px;color:#fff}
        .do-title{font-size:22px;font-weight:900;color:#0f172a;margin-bottom:8px}
        .do-sub{font-size:14px;color:#64748b;margin-bottom:18px;line-height:1.5}
        .do-amount-box{background:linear-gradient(135deg,#fef3c7,#fde68a);border:2px dashed #f59e0b;border-radius:14px;padding:14px;margin-bottom:18px}
        .do-amount-lbl{font-size:11px;color:#92400e;font-weight:700;letter-spacing:.5px;text-transform:uppercase}
        .do-amount{font-size:32px;font-weight:900;color:#b45309;line-height:1.1;margin-top:2px}
        .do-btn{width:100%;padding:15px;border:none;border-radius:12px;font-weight:800;font-size:15px;cursor:pointer;background:linear-gradient(135deg,#16a34a,#22c55e);color:#fff;box-shadow:0 10px 25px rgba(34,197,94,.4);transition:transform .15s;text-transform:uppercase;letter-spacing:.5px}
        .do-btn:hover{transform:translateY(-2px)}
        .do-btn-ghost{width:100%;padding:12px;border:none;background:transparent;color:#64748b;font-weight:600;cursor:pointer;margin-top:10px;font-size:13px}
        .do-btn-ghost:hover{color:#0f172a}
      </style>
      <div class="do-card">
        <div class="do-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        </div>
        <div class="do-title">Saque bloqueado 🔒</div>
        <div class="do-sub">${msg || 'Para liberar o saque do seu bônus de boas-vindas, você precisa fazer um depósito mínimo. Isso confirma sua conta e libera os saques no PIX.'}</div>
        <div class="do-amount-box">
          <div class="do-amount-lbl">Depósito mínimo necessário</div>
          <div class="do-amount">R$ ${minDep.toFixed(2).replace('.', ',')}</div>
        </div>
        <button class="do-btn" id="do-depositar">💰 DEPOSITAR AGORA E SACAR</button>
        <button class="do-btn-ghost" id="do-cancelar">Agora não</button>
      </div>
    `;
    document.body.appendChild(ov);
    ov.addEventListener('click', (e) => { if (e.target === ov) ov.remove(); });
    ov.querySelector('#do-cancelar').addEventListener('click', () => ov.remove());
    ov.querySelector('#do-depositar').addEventListener('click', () => {
      ov.remove();
      const btnDep = document.getElementById('btn-depositar') || document.getElementById('psd-btn-depositar');
      if (btnDep) btnDep.click();
    });
  }

  // "?"? Saque de Comissao (Afiliado) "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?
  let currentSaldoAfil = 0;

  document.getElementById('btn-sacar-afil').addEventListener('click', async () => {
    const u = API.getUser();
    document.getElementById('saq-afil-pix').value = u?.chave_pix || '';
    document.getElementById('saldo-afil-disp').textContent = formatMoney(currentSaldoAfil);
    document.getElementById('saq-afil-valor').value = '';
    try {
      const b = await API.depositoInfo();
      if (b && b.limites) {
        const minA = Math.max(50, Number(b.limites.saque_afiliado_minimo ?? 50));
        const maxA = b.limites.saque_afiliado_maximo ?? 0;
        const el = document.getElementById('saq-afil-valor');
        el.min = minA;
        el.dataset.min = minA;
        el.dataset.max = maxA;
        el.placeholder = maxA > 0 ? `Min. ${formatMoney(minA)} - Max. ${formatMoney(maxA)}` : `Minimo ${formatMoney(minA)}`;
      }
    } catch (_) {}
    closeModal('modal-indicacao');
    openModal('modal-saque-afiliado');
  });

  document.getElementById('close-saque-afiliado').addEventListener('click', () => closeModal('modal-saque-afiliado'));
  document.getElementById('modal-saque-afiliado').addEventListener('click', e => {
    if (e.target.id === 'modal-saque-afiliado') closeModal('modal-saque-afiliado');
  });

  document.getElementById('saq-afil-confirmar').addEventListener('click', async () => {
    const el = document.getElementById('saq-afil-valor');
    const v   = parseFloat(el.value);
    const pix = document.getElementById('saq-afil-pix').value.trim();
    const minA = Math.max(50, parseFloat(el.dataset.min) || 50);
    const maxA = parseFloat(el.dataset.max) || 0;
    if (!v || v < minA) { showToast(`Saque minimo: ${formatMoney(minA)}`, 'warning'); return; }
    if (maxA > 0 && v > maxA) { showToast(`Saque maximo: ${formatMoney(maxA)}`, 'error'); return; }
    if (v > currentSaldoAfil) { showToast('Saldo de comissao insuficiente.', 'error'); return; }
    if (!pix) { showToast('Informe sua chave PIX.', 'warning'); return; }
    const btn = document.getElementById('saq-afil-confirmar');
    btn.disabled = true; btn.textContent = 'Solicitando...';
    try {
      const data = await API.saqueAfiliado(v, pix);
      showToast('Saque de comissao solicitado! Processado em ate 24h.', 'success');
      closeModal('modal-saque-afiliado');
      currentSaldoAfil = parseFloat(data.saldo_afiliado_novo) || Math.max(0, currentSaldoAfil - v);
      document.getElementById('ind-saldo-afil').textContent = formatMoney(currentSaldoAfil);
      _atualizarBadgeAfil(currentSaldoAfil);
    } catch (err) { showToast(err.message, 'error'); }
    finally { btn.disabled = false; btn.textContent = 'Solicitar Saque de Comissao'; }
  });

  // "?"? Indicacao "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?
  function ensureInfluencerCta() {
    const modal = document.querySelector('#modal-indicacao .pnl-modal');
    if (!modal) return;
    if (document.getElementById('ind-influencer-cta')) return;

    const cta = document.createElement('div');
    cta.id = 'ind-influencer-cta';
    cta.className = 'pnl-info-box';
    cta.style.marginBottom = '14px';
    cta.style.border = '1px solid rgba(37,99,235,.35)';
    cta.style.background = 'linear-gradient(135deg,rgba(37,99,235,.12),rgba(59,130,246,.07))';
    cta.style.display = 'flex';
    cta.style.flexDirection = 'column';
    cta.style.gap = '10px';
    cta.innerHTML = `
      <div style="font-size:13px;font-weight:600;color:#1e3a8a">Voce e influencer e quer negociar comissao? Fale com nosso suporte no WhatsApp.</div>
      <a id="ind-whats-btn" href="https://wa.link/x6cefb" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;justify-content:center;padding:10px 12px;border-radius:10px;background:#16a34a;color:#fff;font-weight:700;text-decoration:none">Falar no WhatsApp</a>
    `;

    const bonusBox = document.getElementById('ind-bonus-primeiro-box');
    if (bonusBox && bonusBox.parentNode === modal) {
      modal.insertBefore(cta, bonusBox);
    } else {
      modal.appendChild(cta);
    }
  }

  async function loadIndicacao() {
    openModal('modal-indicacao');
    ensureInfluencerCta();
    try {
      const data = await API.indicacaoInfo();
      document.getElementById('ind-link').textContent          = data.link || '';
      document.getElementById('ind-total').textContent         = data.total_indicados || 0;
      document.getElementById('ind-bonus').textContent         = (data.total_indicados - (data.total_com_deposito || 0)) >= 0
        ? `${data.total_com_deposito || 0} / ${data.total_indicados}`
        : data.total_indicados;
      currentSaldoAfil = parseFloat(data.saldo_afiliado || 0);
      document.getElementById('ind-saldo-afil').textContent    = formatMoney(currentSaldoAfil);
      document.getElementById('ind-total-comissao').textContent = formatMoney(data.total_comissao  || 0);
      _atualizarBadgeAfil(currentSaldoAfil);
      const percPadrao = Number(data.comissao_nivel1_perc ?? 0);
      const percEfetiva = Number(data.comissao_efetiva_perc ?? percPadrao);
      const percCustom = data.comissao_custom_perc;
      document.getElementById('ind-comissao-perc').textContent = `${percEfetiva}%`;
      const comissaoPadraoEl = document.getElementById('ind-comissao-padrao');
      const comissaoEfetivaEl = document.getElementById('ind-comissao-efetiva');
      const comissaoOrigemEl = document.getElementById('ind-comissao-origem');
      const comissaoBarEl = document.getElementById('ind-comissao-bar');
      if (comissaoPadraoEl) comissaoPadraoEl.textContent = `${percPadrao}%`;
      if (comissaoEfetivaEl) comissaoEfetivaEl.textContent = `${percEfetiva}%`;
      const temCustom = (percCustom !== null && percCustom !== undefined && percCustom !== '' && Number(percCustom) > 0);
      if (comissaoOrigemEl) comissaoOrigemEl.textContent = temCustom ? 'Personalizada' : 'Padrao';
      if (comissaoBarEl) comissaoBarEl.style.width = `${Math.max(0, Math.min(100, percEfetiva))}%`;
      document.getElementById('ind-comissao-perc').title = (percCustom !== null && percCustom !== undefined && percCustom !== '' && Number(percCustom) > 0)
        ? `Comissao personalizada ativa: ${Number(percCustom)}%`
        : `Comissao padrao da plataforma: ${percPadrao}%`;

      const bpd = data.bonus_primeiro_deposito || {};
      const bpdRecebeu = !!bpd.recebeu_bonus_primeiro_deposito;
      const bpdSaqueLiberado = !!bpd.saque_liberado;
      const bpdModoSempre = String(bpd.modo_aplicacao || 'primeiro_deposito') === 'sempre';
      const bpdTitleEl = document.getElementById('ind-bpd-title');
      if (bpdTitleEl) bpdTitleEl.textContent = bpdModoSempre ? 'Bonus de deposito (sempre ativo)' : 'Bonus de primeiro deposito';
      document.getElementById('ind-bpd-dep').textContent = formatMoney(bpd.primeiro_deposito_valor || 0);
      document.getElementById('ind-bpd-bonus').textContent = formatMoney(bpd.bonus_recebido_valor || 0);
      document.getElementById('ind-bpd-total').textContent = formatMoney(bpd.total_com_bonus || 0);
      document.getElementById('ind-bpd-rollover-exigido').textContent = formatMoney(bpd.rollover_necessario || 0);
      document.getElementById('ind-bpd-rollover-cumprido').textContent = formatMoney(bpd.rollover_cumprido || 0);
      document.getElementById('ind-bpd-rollover-restante').textContent = formatMoney(bpd.rollover_restante || 0);
      if (!bpdRecebeu) {
        document.getElementById('ind-bpd-status').textContent = bpdModoSempre
          ? 'Aguardando deposito confirmado para aplicar bonus'
          : 'Aguardando primeiro deposito confirmado';
      } else {
        document.getElementById('ind-bpd-status').textContent = bpdSaqueLiberado
          ? 'Saque liberado (rollover concluido)'
          : `Saque bloqueado. Falta ${formatMoney(bpd.rollover_restante || 0)} em rollover`;
      }

      const resumo = data.resumo_saques_afiliado || {};
      document.getElementById('ind-saq-pendente').textContent = formatMoney(resumo.pendente?.valor || 0);
      document.getElementById('ind-saq-pago').textContent = formatMoney(resumo.pago?.valor || 0);
      document.getElementById('ind-saq-recusado').textContent = formatMoney(resumo.recusado?.valor || 0);

      const histEl = document.getElementById('ind-saques-lista');
      const saquesAfiliado = Array.isArray(data.saques_afiliado) ? data.saques_afiliado : [];
      if (!saquesAfiliado.length) {
        histEl.innerHTML = '<div class="muted">Nenhum saque de comissao ainda.</div>';
      } else {
        histEl.innerHTML = saquesAfiliado.map(s => {
          const st = String(s.status || 'pendente').toLowerCase();
          const stLabel = st === 'pago' ? 'Pago' : (st === 'recusado' ? 'Recusado' : 'Pendente');
          const badge = st === 'pago'
            ? 'pnl-badge pnl-badge-green'
            : (st === 'recusado' ? 'pnl-badge pnl-badge-red' : 'pnl-badge pnl-badge-orange');
          const nome = s.nome_solicitante ? `  ${s.nome_solicitante}` : '';
          return `
            <div class="pnl-tx-item" style="padding:10px 0">
              <div class="pnl-tx-ico dep">R$</div>
              <div class="pnl-tx-body">
                <div class="pnl-tx-desc">Saque comissao${nome}</div>
                <div class="pnl-tx-date">${formatDate(s.created_at)}  ${formatMoney(s.valor || 0)}</div>
              </div>
              <span class="${badge}">${stLabel}</span>
            </div>
          `;
        }).join('');
      }

      // "?"? Visibilidade controlada pelo Admin "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?
      const _show = (id, flag) => {
        const el = document.getElementById(id);
        if (el) el.style.display = (flag == 1 || flag === true) ? '' : 'none';
      };
      // Banner de comissao
      const bannerComissao = document.querySelector('#modal-indicacao .pnl-info-pink');
      if (bannerComissao) bannerComissao.style.display = (data.show_comissao_banner == 1) ? '' : 'none';
      // Card saldo afiliado (inclui botao sacar)
      _show('ind-saldo-box', data.show_saldo_afiliado ?? 1);
      // Botao sacar comissao (dentro do card, controle independente)
      if (data.show_saldo_afiliado == 1) {
        _show('btn-sacar-afil', data.show_botao_sacar_afil ?? 1);
      }
      // Link de indicacao
      const linkBox = document.querySelector('#modal-indicacao .pnl-link-box');
      if (linkBox) linkBox.style.display = (data.show_link_afiliado == 1) ? '' : 'none';
      // Stats Indicados / Com Deposito
      const statsGrid = document.querySelector('#modal-indicacao [style*="grid-template-columns:1fr 1fr"]');
      if (statsGrid) statsGrid.style.display = (data.show_stats_indicados == 1) ? 'grid' : 'none';
      const bonusPrimeiroBox = document.getElementById('ind-bonus-primeiro-box');
      if (bonusPrimeiroBox) {
        bonusPrimeiroBox.style.display = (bpd.enabled || bpd.recebeu_bonus_primeiro_deposito) ? 'flex' : 'none';
      }

      // MONTANTE
      const cardMontante = document.getElementById('ind-card-montante');
      if (data.show_montante == 1) {
        const montante = parseFloat(data.montante_depositos) || 0;
        document.getElementById('ind-montante').textContent = formatMoney(montante);
        const percMontante = montante > 0
          ? Math.round((parseFloat(data.total_comissao) || 0) / montante * 100)
          : 0;
        document.getElementById('ind-montante-perc').textContent = percMontante + '%';
        cardMontante.style.display = 'block';
      } else {
        cardMontante.style.display = 'none';
      }
      if (data.indicados_recentes?.length) {
        document.getElementById('ind-lista').innerHTML = (data.show_lista_indicados == 1) ? `
          <div style="font-size:12px;color:#9980aa;text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px">Indicados recentes</div>
          <div class="pnl-tx-list">${data.indicados_recentes.map(i => `
            <div class="pnl-tx-item" style="padding:10px 0">
              <div class="pnl-tx-ico" style="width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;letter-spacing:.5px;flex-shrink:0;background:${i.nivel_afil===1?'rgba(139,92,246,.25)':i.nivel_afil===2?'rgba(59,130,246,.25)':'rgba(16,185,129,.25)'};color:${i.nivel_afil===1?'#a78bfa':i.nivel_afil===2?'#60a5fa':'#34d399'};border:1.5px solid ${i.nivel_afil===1?'rgba(139,92,246,.4)':i.nivel_afil===2?'rgba(59,130,246,.4)':'rgba(16,185,129,.4)'}">N${i.nivel_afil||1}</div>
              <div class="pnl-tx-body">
                <div class="pnl-tx-desc">${i.nome}</div>
                <div class="pnl-tx-date">${formatDate(i.data_cadastro)}  Depositos: ${formatMoney(i.total_depositado || 0)}${(data.show_valor_comissao_lista == 1 && i.total_comissao_indicado > 0) ? `  Comissao: ${formatMoney(i.total_comissao_indicado)}` : ''}</div>
              </div>
              <span class="pnl-badge ${i.bonus_pago?'pnl-badge-green':'pnl-badge-orange'}">
                ${i.bonus_pago ? 'Pago' : 'Nao pago'}
              </span>
            </div>`).join('')}</div>` : '';
      }
    } catch {}
  }

  // "?"? Dicas rotativas "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?
  (function initTips() {
    const tips = [
      'Quanto maior a meta de plataformas, maior o seu premio!',
      'Resgate no momento certo ?" esperar demais pode custar caro.',
      'Aposte com responsabilidade. Defina um limite antes de jogar.',
      'Plataformas infinitas: jogue quantas rodadas quiser sem parar.',
      'Acompanhe seu saldo em tempo real no topo da tela.',
      'Indique amigos e ganhe comissao em cada deposito deles!',
      'Quanto mais voce joga, mais familiarizado com o ritmo voce fica.',
      'Use os valores rapidos para agilizar suas apostas.',
      'Suas transacoes sao 100% seguras e processadas via Pix.',
      'Cada rodada e independente ?" mantenha o foco e boa sorte!',
    ];
    let idx = 0;
    const el = document.getElementById('pnl-tips-text');
    if (!el) return;
    function showTip() {
      el.classList.add('fade-out');
      setTimeout(() => {
        el.textContent = tips[idx];
        idx = (idx + 1) % tips.length;
        el.classList.remove('fade-out');
      }, 400);
    }
    showTip();
    setInterval(showTip, 10000);
  })();

  // "?"? Cupom no deposito "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?
  window._cupomAplicado = null;

  window.toggleDepCupom = function() {
    const field  = document.getElementById('dep-cupom-field');
    const toggle = document.getElementById('dep-cupom-toggle');
    const visible = field.style.display !== 'none';
    field.style.display  = visible ? 'none' : 'block';
    toggle.style.opacity = visible ? '.6' : '1';
    if (!visible) document.getElementById('dep-cupom-input').focus();
  };

  window.aplicarCupomDep = async function() {
    const codigo = document.getElementById('dep-cupom-input').value.trim().toUpperCase();
    const stEl   = document.getElementById('dep-cupom-status');
    const btn    = document.getElementById('dep-cupom-btn');
    if (!codigo) { stEl.textContent = 'Informe o codigo.'; stEl.style.color = '#ef4444'; return; }

    btn.disabled = true;
    btn.textContent = '...';
    stEl.textContent = '';

    try {
      const res = await API.validarCupom(codigo);
      window._cupomAplicado = res;

      let msgHtml = '';
      if (res.tipo === 'saldo') {
        msgHtml = `o. <strong style="color:#22c55e">+${formatMoney(res.valor)}</strong> de saldo sera creditado imediatamente.`;
      } else if (res.tipo === 'bonus_deposito_valor') {
        msgHtml = `o. Bonus de <strong style="color:#f59e0b">+${formatMoney(res.valor)}</strong> fixo sera adicionado ao seu deposito.`;
      } else {
        msgHtml = `o. Bonus de <strong style="color:#22c55e">+${res.valor.toFixed(0)}%</strong> sobre o valor do seu deposito.`;
      }
      stEl.innerHTML = msgHtml;
      stEl.style.color = '';
      btn.textContent = 'o" Aplicado';
      btn.style.background = '#16a34a';
      document.getElementById('dep-cupom-input').disabled = true;
      document.getElementById('dep-cupom-alterar-wrap').style.display = 'block';
    } catch (e) {
      window._cupomAplicado = null;
      stEl.innerHTML = `<span style="color:#ef4444">O ${e.message}</span>`;
      btn.disabled = false;
      btn.textContent = 'Aplicar';
      btn.style.background = '#2d6a4f';
      document.getElementById('dep-cupom-alterar-wrap').style.display = 'none';
    }
  };

  window.alterarCupomDep = function() {
    window._cupomAplicado = null;
    const input = document.getElementById('dep-cupom-input');
    const btn   = document.getElementById('dep-cupom-btn');
    const stEl  = document.getElementById('dep-cupom-status');
    input.disabled = false;
    input.value = '';
    btn.disabled = false;
    btn.textContent = 'Aplicar';
    btn.style.background = '#2d6a4f';
    stEl.innerHTML = '';
    document.getElementById('dep-cupom-alterar-wrap').style.display = 'none';
    input.focus();
  };

  // Hook no botao de confirmar deposito para resgatar cupom junto
  const _depConfBtn = document.getElementById('dep-confirmar');
  const _depConfOrigHandler = _depConfBtn.onclick;

  document.getElementById('dep-confirmar').addEventListener('click', async () => {
    if (window._cupomAplicado) {
      try {
        const r = await API.resgatarCupom(window._cupomAplicado.codigo);
        if (r.tipo === 'saldo') {
          showToast(`Cupom aplicado! ${formatMoney(r.valor)} adicionado ao seu saldo.`, 'success');
        } else {
          showToast(`Bonus de deposito de ${formatMoney(r.valor)} registrado!`, 'success');
        }
        window._cupomAplicado = null;
      } catch (e) {
        // Nao bloqueia o deposito se o cupom falhar
        showToast('Cupom nao pode ser aplicado: ' + e.message, 'warning');
        window._cupomAplicado = null;
      }
    }
  }, true); // capture=true para rodar antes do handler de deposito

  // "?"? Banners "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?
  (function initBanners() {
    const wrap  = document.getElementById('pnl-banner-wrap');
    const track = document.getElementById('pnl-banner-track');
    const dots  = document.getElementById('pnl-banner-dots');
    const prev  = document.getElementById('pnl-banner-prev');
    const next  = document.getElementById('pnl-banner-next');
    if (!wrap) return;

    let banners = [];
    let current = 0;
    let autoTimer = null;

    function renderBanners(list) {
      banners = list;
      if (!banners.length) { wrap.style.display = 'none'; return; }
      wrap.style.display = 'block';

      // Hide arrows if only 1 banner
      prev.style.display = banners.length > 1 ? 'flex' : 'none';
      next.style.display = banners.length > 1 ? 'flex' : 'none';

      track.innerHTML = banners.map((b, i) => `
        <div style="min-width:100%;position:relative" data-idx="${i}">
          <img src="${b.url}" alt="Banner ${i+1}"
            style="width:100%;display:block;height:auto;border-radius:0"
            onerror="this.parentElement.style.display='none'" />
        </div>`).join('');

      dots.innerHTML = banners.map((_, i) =>
        `<div data-dot="${i}" style="width:${i===0?'20px':'7px'};height:7px;border-radius:4px;background:${i===0?'#fff':'rgba(255,255,255,.4)'};transition:all .3s;cursor:pointer"></div>`
      ).join('');

      dots.querySelectorAll('[data-dot]').forEach(d => {
        d.addEventListener('click', () => goTo(parseInt(d.dataset.dot)));
      });

      track.addEventListener('click', e => {
        const slide = e.target.closest('[data-idx]');
        if (slide && banners[parseInt(slide.dataset.idx)]?.link) {
          window.open(banners[parseInt(slide.dataset.idx)].link, '_blank');
        }
      });

      goTo(0);
      if (banners.length > 1) startAuto();
    }

    function goTo(idx) {
      current = (idx + banners.length) % banners.length;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.querySelectorAll('[data-dot]').forEach((d, i) => {
        d.style.width     = i === current ? '20px' : '7px';
        d.style.background = i === current ? '#fff' : 'rgba(255,255,255,.4)';
      });
    }

    function startAuto() {
      clearInterval(autoTimer);
      autoTimer = setInterval(() => goTo(current + 1), 4000);
    }

    prev.addEventListener('click', e => { e.stopPropagation(); clearInterval(autoTimer); goTo(current - 1); startAuto(); });
    next.addEventListener('click', e => { e.stopPropagation(); clearInterval(autoTimer); goTo(current + 1); startAuto(); });

    // Swipe support
    let touchX = 0;
    wrap.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
    wrap.addEventListener('touchend',   e => {
      const diff = touchX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) { clearInterval(autoTimer); goTo(current + (diff > 0 ? 1 : -1)); startAuto(); }
    });

    // Load banners from public config
    fetch('/api/public/config?_=' + Date.now())
      .then(r => r.json())
      .then(cfg => {
        const list = cfg.banners && cfg.banners.length ? cfg.banners : (cfg.banner_url ? [{ url: cfg.banner_url, link: cfg.banner_link || '' }] : []);
        renderBanners(list);
      })
      .catch(() => {});
  })();

  // "?"? Boot "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?
  updateMetaPreview();
  loadDashboard();
  loadGameConfigs();

  // Abre modal de depósito automaticamente após cadastro
  if (sessionStorage.getItem('open_deposit_after_signup') === '1') {
    sessionStorage.removeItem('open_deposit_after_signup');
    setTimeout(() => {
      try { openDepositModal(); } catch (_) {}
    }, 700);
  }
}

