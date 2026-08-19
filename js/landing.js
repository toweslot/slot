// "?"?"? Landing Page "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?
function renderLanding(el) {
  el.innerHTML = `
    <!-- "?"? Navbar "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"? -->
    <nav class="lnd-nav">
      <div class="lnd-nav-brand brand-logo-wrap">
        <img class="brand-logo-img" src="" alt="logo" style="display:none;height:36px;object-fit:contain"/>
        <svg class="brand-logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="24" height="24">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
        </svg>
        <span class="brand-name">Tower Slot</span>
      </div>
      <div class="lnd-nav-menu">
        <button class="lnd-nav-link" onclick="navigate('#login')">Entrar</button>
        <button class="lnd-cta-sm" onclick="navigate('#cadastro')">Cadastrar</button>
      </div>
    </nav>

    <!-- "?"? Hero "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"? -->
    <div class="lnd-hero">
      <!-- Ceu animado com nuvens -->
      <div class="ts-sky" aria-hidden="true">
        <div class="ts-sky-glow"></div>
        <div class="ts-cloud-layer l3"></div>
        <div class="ts-cloud-layer l2"></div>
        <div class="ts-cloud-layer l1"></div>
        <div class="ts-skyline"></div>
      </div>
      <div class="lnd-hero-overlay"></div>

      <div class="lnd-hero-inner">
        <!-- Conteudo principal -->
        <div class="lnd-hero-left anim-slide">
          <div class="bonus-banner" onclick="navigate('#cadastro')" style="display:inline-flex;align-items:center;gap:10px;background:linear-gradient(135deg,#16a34a 0%,#22c55e 50%,#facc15 100%);color:#fff;padding:10px 16px;border-radius:999px;font-weight:800;font-size:13px;letter-spacing:.3px;box-shadow:0 10px 28px rgba(34,197,94,.45);cursor:pointer;margin-bottom:14px;animation:bonusPulse 1.8s infinite;text-transform:uppercase;">
            <span style="font-size:18px">🎁</span>
            <span>Cadastre-se e GANHE R$ 260 GRÁTIS</span>
            <span style="background:rgba(255,255,255,.25);padding:2px 8px;border-radius:999px;font-size:11px;text-transform:none;">por tempo limitado</span>
          </div>
          <style>@keyframes bonusPulse{0%,100%{box-shadow:0 10px 28px rgba(34,197,94,.45),0 0 0 0 rgba(250,204,21,.7)}50%{box-shadow:0 10px 28px rgba(34,197,94,.6),0 0 0 14px rgba(250,204,21,0)}}</style>
          <div class="lnd-dep-pill">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><polyline points="20 6 9 17 4 12"/></svg>
            Deposito a partir de <strong>R$ 15</strong> - Saque via PIX
          </div>

          <img src="images/tower-slot-logo.png" alt="Tower Slot" class="lnd-logo-banner"
            style="display:block;width:min(78vw,320px);max-height:150px;object-fit:contain;margin:0 0 10px;
            filter:drop-shadow(0 10px 24px rgba(0,0,0,.55));animation:tsLogoIn .7s cubic-bezier(.34,1.56,.64,1) both"/>
          <style>@keyframes tsLogoIn{0%{opacity:0;transform:scale(.75) translateY(14px)}100%{opacity:1;transform:none}}</style>
          <h1 class="lnd-title">Monte a torre.<br><em>Ganhe dinheiro real.</em></h1>

          <p class="lnd-sub">
            Encaixe as pecas, multiplique o valor e saque <strong>direto no PIX</strong>. Simples, rapido e sem burocracia.
          </p>

          <div class="lnd-actions">
            <button class="lnd-cta-btn" id="btn-jogar-gratis">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              <span id="btn-jogar-label">JOGAR AGORA</span>
            </button>
            <button class="lnd-ghost-btn" onclick="navigate('#login')">Ja tenho conta -></button>
          </div>

          <div class="lnd-trust">
            <span class="lnd-trust-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" width="13" height="13"><polyline points="20 6 9 17 4 12"/></svg>
              PIX imediato
            </span>
            <span class="lnd-trust-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" width="13" height="13"><polyline points="20 6 9 17 4 12"/></svg>
              7x na meta
            </span>
            <span class="lnd-trust-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" width="13" height="13"><polyline points="20 6 9 17 4 12"/></svg>
              Resultado na hora
            </span>
          </div>
        </div>

        <!-- Feed de ganhos ao vivo -->
        <div class="lnd-wins-col">
          <div class="lnd-feed-header">
            <span class="lnd-live-dot"></span>
            Pagamentos ao vivo
          </div>
          <div class="lnd-win-card" style="animation-delay:0s">
            <div class="lnd-win-avatar" style="background:linear-gradient(135deg,#2563eb,#1d4ed8)">C</div>
            <div class="lnd-win-info">
              <div class="lnd-win-name">Carlos ganhou</div>
              <div class="lnd-win-amount">+R$ 70,00</div>
              <div class="lnd-win-label">ha 2 minutos</div>
            </div>
            <svg viewBox="0 0 24 24" fill="#F59E0B" width="18" height="18"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>
          </div>
          <div class="lnd-win-card" style="animation-delay:1.6s">
            <div class="lnd-win-avatar" style="background:linear-gradient(135deg,#60a5fa,#2563eb)">A</div>
            <div class="lnd-win-info">
              <div class="lnd-win-name">Ana ganhou</div>
              <div class="lnd-win-amount">+R$ 45,00</div>
              <div class="lnd-win-label">ha 5 minutos</div>
            </div>
            <svg viewBox="0 0 24 24" fill="#F59E0B" width="18" height="18"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>
          </div>
          <div class="lnd-win-card" style="animation-delay:3.2s">
            <div class="lnd-win-avatar" style="background:linear-gradient(135deg,#1d4ed8,#1e40af)">L</div>
            <div class="lnd-win-info">
              <div class="lnd-win-name">Lucas ganhou</div>
              <div class="lnd-win-amount">+R$ 140,00</div>
              <div class="lnd-win-label">ha 8 minutos</div>
            </div>
            <svg viewBox="0 0 24 24" fill="#F59E0B" width="18" height="18"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>
          </div>
        </div>
      </div>
    </div>

    <!-- "?"? Stats "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"? -->
    <div class="lnd-stats">
      <div class="lnd-stat">
        <div class="lnd-stat-val" id="stat-online">0</div>
        <div class="lnd-stat-lbl">Jogadores online</div>
      </div>
      <div class="lnd-stat">
        <div class="lnd-stat-val" id="stat-pago">R$ 0</div>
        <div class="lnd-stat-lbl">Total pago hoje</div>
      </div>
      <div class="lnd-stat">
        <div class="lnd-stat-val" id="stat-maior">R$ 0</div>
        <div class="lnd-stat-lbl">Maior ganho do dia</div>
      </div>
    </div>

    <!-- "?"? Como funciona "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"? -->
    <section class="lnd-how">
      <div class="lnd-container">
        <div class="lnd-section-head">
          <h2>Como funciona</h2>
          <p>Tres passos. Sem complicacao.</p>
        </div>
        <div class="lnd-how-grid">
          <div class="lnd-how-card anim-slide" style="animation-delay:.1s">
            <div class="lnd-how-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24">
                <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </div>
            <h3>Deposite via PIX</h3>
            <p>A partir de R$ 10. Cai na hora, sem burocracia.</p>
          </div>
          <div class="lnd-how-card anim-slide" style="animation-delay:.15s">
            <div class="lnd-how-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24">
                <circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><line x1="2" y1="12" x2="22" y2="12"/>
              </svg>
            </div>
            <h3>Jogue Tower Slot</h3>
            <p>Solte a peca, encaixe na torre e multiplique a cada acerto.</p>
          </div>
          <div class="lnd-how-card anim-slide" style="animation-delay:.2s">
            <div class="lnd-how-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
              </svg>
            </div>
            <h3>Receba 7x no PIX</h3>
            <p>Alcance a meta e o PIX cai em segundos na sua conta.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- "?"? CTA final "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"? -->
    <section class="lnd-cta-sec">
      <h2>Pronto para <span>girar e ganhar</span>?</h2>
      <p style="font-size:18px;margin:8px 0 4px;color:#16a34a;font-weight:800">🎁 GANHE R$ 260 DE BÔNUS ao se cadastrar agora!</p>
      <p>Crie sua conta grátis e receba o bônus para apostar — sem depósito inicial necessário.</p>
      <button class="lnd-cta-btn" onclick="navigate('#cadastro')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="20" height="20">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
          <line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
        </svg>
        RESGATAR MEUS R$ 260
      </button>
    </section>

    <!-- "?"? Footer "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"? -->
    <footer class="lnd-footer">
      <div class="lnd-footer-brand">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="20" height="20">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
        </svg>
        <span class="brand-name">Tower Slot</span>
      </div>
      <div class="lnd-footer-links">
        <a href="#" onclick="navigate('#landing');return false">Inicio</a>
        <a href="#" onclick="navigate('#cadastro');return false">Cadastrar</a>
        <a href="#" onclick="navigate('#login');return false">Entrar</a>
        <a href="#">Termos de uso</a>
        <a href="#" data-suporte-href>Suporte</a>
      </div>
      <div class="lnd-footer-warning">
        Jogo de entretenimento com apostas. Jogue com responsabilidade.
        Proibido para menores de 18 anos. Se sentir que o jogo esta afetando sua vida,
        procure ajuda em <strong>jrc.org.br</strong>.
      </div>
      <p class="lnd-footer-copy">(c) 2026 <span class="brand-name">Tower Slot</span>. Todos os direitos reservados.</p>
    </footer>
  `;

  // Animar stats com numeros simulados
  setTimeout(() => {
    const elOnline = document.getElementById('stat-online');
    const elPago   = document.getElementById('stat-pago');
    const elMaior  = document.getElementById('stat-maior');
    if (elOnline) animateNumber(elOnline, 0, 1847 + Math.floor(Math.random() * 200));
    if (elPago)   animateNumber(elPago,   0, 8420, 1400, v => 'R$ ' + Math.round(v).toLocaleString('pt-BR'));
    if (elMaior)  animateNumber(elMaior,  0, 700,  1000, v => 'R$ ' + Math.round(v).toLocaleString('pt-BR'));
  }, 300);

  // Preencher ref via URL (query normal ou hash: #cadastro?ref=...)
  const ref = (typeof window.captureReferralFromUrl === 'function')
    ? window.captureReferralFromUrl()
    : (new URLSearchParams(window.location.search).get('ref') || '');
  if (ref) sessionStorage.setItem('ref_code', ref);

  // "?"? Carregar config publica e aplicar regras "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?
  fetch('/api/public/config?_=' + Date.now())
    .then(r => r.json())
    .catch(() => ({}))
    .then(cfg => {
      // Nome da plataforma
      const nome = cfg.site_nome || 'Tower Slot';
      document.querySelectorAll('.brand-name').forEach(el => el.textContent = nome);
      document.title = nome + ' - Gire e ganhe';

      // Deposito minimo
      if (cfg.deposito_minimo !== undefined) {
        const depVal = 'R$' + parseFloat(cfg.deposito_minimo)
          .toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
        const depMin = document.getElementById('lnd-dep-min');
        if (depMin) depMin.textContent = depVal;
        const depMinCta = document.getElementById('lnd-dep-min-cta');
        if (depMinCta) depMinCta.textContent = depVal;
      }

      // Modo Demo desabilitado ?' esconde botao de jogar gratis e redireciona para cadastro
      const btnJogar  = document.getElementById('btn-jogar-gratis');
      const btnLabel  = document.getElementById('btn-jogar-label');
      if (cfg.demo_mode === false || cfg.demo_mode === '0') {
        if (btnLabel) btnLabel.textContent = 'CRIAR CONTA';
        if (btnJogar) {
          btnJogar.onclick = () => navigate('#cadastro');
        }
      } else {
        if (btnLabel) btnLabel.textContent = 'JOGAR GRATIS';
      }

      // Registro fechado ?' esconde botoes de cadastro
      if (cfg.registro_aberto === false || cfg.registro_aberto === '0') {
        document.querySelectorAll('[onclick*="cadastro"], [onclick*="register"]').forEach(el => {
          el.style.display = 'none';
        });
      }

      // Modo manutencao ?' exibe overlay
      if (cfg.manutencao === true || cfg.manutencao === '1') {
        if (typeof showManutencao === 'function') {
          showManutencao(cfg.site_nome || 'Tower Slot', '');
        }
      }
    });

  // "?"? Botao principal JOGAR "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?
  document.getElementById('btn-jogar-gratis').addEventListener('click', function(e) {
    // Se onclick foi sobrescrito pelo bloco acima (demo_mode=false), nao entra aqui
    const btn = e.currentTarget;
    if (btn.onclick) return; // ja tem handler customizado

    btn.disabled = true;
    sessionStorage.setItem('partida_atual', JSON.stringify({
      partida_id:           'demo',
      valor_entrada:        5,
      valor_meta:           15,
      valor_por_plataforma: 1,
      dificuldade:          'demo',
      modo_demo:            true,
    }));
    navigate('#jogo');
    btn.disabled = false;
  });
}

