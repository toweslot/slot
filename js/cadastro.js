// ─── Cadastro Page ────────────────────────────────────────────────────────────
function renderCadastro(el) {
  const refCode =
    (typeof window.captureReferralFromUrl === 'function' ? window.captureReferralFromUrl() : '') ||
    sessionStorage.getItem('ref_code') ||
    (() => {
      const fromSearch = new URLSearchParams(window.location.search).get('ref');
      if (fromSearch) return fromSearch;
      const rawHash = window.location.hash || '';
      const qPos = rawHash.indexOf('?');
      if (qPos >= 0) return new URLSearchParams(rawHash.slice(qPos + 1)).get('ref') || '';
      return '';
    })() ||
    '';

  el.innerHTML = `
    <style>
      #page-cadastro.active {
        display: flex; align-items: center; justify-content: center;
        min-height: 100vh; width: 100%; overflow-x: hidden;
        padding: 24px 16px;
        background:
          radial-gradient(1200px 500px at 10% -5%, rgba(37,99,235,0.18), transparent 60%),
          radial-gradient(900px 480px at 100% 0%, rgba(59,130,246,0.14), transparent 58%),
          linear-gradient(180deg, #edf4ff 0%, #f7faff 100%);
      }
      .reg-wrap {
        width: 100%; max-width: 420px; box-sizing: border-box;
        background: rgba(255,255,255,0.92);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(37,99,235,0.16);
        border-radius: 20px; padding: 40px 32px;
        box-shadow: 0 22px 60px rgba(15,23,42,0.12), 0 4px 18px rgba(37,99,235,0.08);
        animation: popIn 0.35s ease both;
      }
      .reg-logo {
        display: flex; align-items: center; justify-content: center; gap: 10px;
        font-size: 20px; font-weight: 800; color: #2563eb; margin-bottom: 8px;
      }
      .reg-title {
        font-size: 22px; font-weight: 800; color: #0f172a; text-align: center; margin-bottom: 6px;
      }
      .reg-sub {
        font-size: 14px; color: rgba(15,23,42,0.50); text-align: center; margin-bottom: 28px;
      }
      .reg-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
      .reg-label {
        font-size: 13px; font-weight: 600; color: rgba(15,23,42,0.65); letter-spacing: 0.2px;
      }
      .reg-input-wrap { position: relative; }
      .reg-input {
        width: 100%; padding: 12px 16px; border-radius: 8px;
        background: #f8faff; border: 1.5px solid rgba(37,99,235,0.15);
        color: #0f172a; font-size: 15px; font-family: inherit;
        outline: none; transition: border-color 0.2s, background 0.2s;
      }
      .reg-input::placeholder { color: rgba(15,23,42,0.30); }
      .reg-input:focus { border-color: #2563eb; background: #eff4ff; }
      .reg-input.error { border-color: #ef4444; }
      .reg-input.valid { border-color: #22c55e; }
      .reg-eye {
        position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
        cursor: pointer; color: rgba(15,23,42,0.35); display: flex; align-items: center;
        transition: color 0.2s;
      }
      .reg-eye:hover { color: rgba(15,23,42,0.65); }
      .reg-input.has-icon { padding-right: 44px; }
      .reg-error { font-size: 12px; color: #ef4444; font-weight: 600; display: none; }

      /* Password strength */
      .reg-strength { margin-top: 8px; display: none; }
      .reg-strength-row {
        display: flex; justify-content: space-between;
        font-size: 12px; color: rgba(15,23,42,0.45); margin-bottom: 5px;
      }
      .reg-strength-bar {
        height: 4px; background: rgba(15,23,42,0.10); border-radius: 50px; overflow: hidden;
      }
      .reg-strength-fill { height: 100%; border-radius: 50px; width: 0; transition: 0.35s ease; }

      /* Terms box */
      .reg-terms {
        background: rgba(37,99,235,0.04);
        border: 1px solid rgba(37,99,235,0.12);
        border-radius: 8px; padding: 12px 14px;
        font-size: 13px; color: rgba(15,23,42,0.50); margin-bottom: 20px; line-height: 1.5;
      }
      .reg-terms strong { color: #2563eb; }

      /* Submit */
      .reg-btn {
        width: 100%; padding: 14px; border-radius: 8px; border: none; cursor: pointer;
        background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 60%, #3b82f6 100%);
        color: #fff; font-weight: 700; font-size: 15px; letter-spacing: 0.3px;
        display: flex; align-items: center; justify-content: center; gap: 10px;
        transition: transform 0.2s, box-shadow 0.2s;
        box-shadow: 0 10px 28px rgba(37,99,235,0.35);
      }
      .reg-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 28px rgba(37,99,235,0.50); }
      .reg-btn:active { transform: scale(0.98); }
      .reg-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

      /* Footer links */
      .reg-footer {
        text-align: center; margin-top: 20px;
        font-size: 14px; color: rgba(15,23,42,0.45);
      }
      .reg-footer a {
        color: #2563eb; font-weight: 700; cursor: pointer; text-decoration: none;
        transition: opacity 0.2s;
      }
      .reg-footer a:hover { opacity: 0.75; }
      .reg-back {
        display: flex; align-items: center; justify-content: center; gap: 6px;
        margin-top: 12px; font-size: 13px; color: rgba(15,23,42,0.35);
        cursor: pointer; background: none; border: none; transition: color 0.2s;
      }
      .reg-back:hover { color: rgba(15,23,42,0.60); }
    </style>

    <div class="reg-wrap">
      <!-- Logo -->
      <div class="reg-logo brand-logo-wrap">
        <img class="brand-logo-img" src="" alt="logo" style="display:none;height:36px;object-fit:contain"/>
        <svg class="brand-logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="24" height="24">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
        </svg>
        <span class="brand-name">Tower Slot</span>
      </div>
      <div style="background:linear-gradient(135deg,#16a34a 0%,#22c55e 50%,#facc15 100%);color:#fff;padding:14px 16px;border-radius:14px;margin-bottom:18px;text-align:center;box-shadow:0 12px 30px rgba(34,197,94,.35);animation:bonusPulse 1.8s infinite;">
        <div style="font-size:13px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;opacity:.95">🎁 Bônus de boas-vindas</div>
        <div style="font-size:22px;font-weight:900;margin-top:2px">R$ 260,00 GRÁTIS</div>
        <div style="font-size:12px;opacity:.95;margin-top:2px">liberados após seu primeiro depósito</div>
      </div>
      <style>@keyframes bonusPulse{0%,100%{box-shadow:0 12px 30px rgba(34,197,94,.4),0 0 0 0 rgba(250,204,21,.6)}50%{box-shadow:0 12px 30px rgba(34,197,94,.55),0 0 0 10px rgba(250,204,21,0)}}</style>
      <h2 class="reg-title">Criar conta e resgatar bônus</h2>
      <p class="reg-sub">Crie sua conta e desbloqueie <strong style="color:#16a34a">R$ 260</strong> no seu 1º depósito</p>

      <form id="cad-form" novalidate>

        <!-- Telefone -->
        <div class="reg-group">
          <label class="reg-label">Telefone (WhatsApp)</label>
          <input id="c-tel" class="reg-input" type="tel" placeholder="(11) 99999-0000" autocomplete="tel" inputmode="numeric" />
          <span class="reg-error" id="c-tel-err"></span>
        </div>

        <!-- Senha -->
        <div class="reg-group">
          <label class="reg-label">Senha</label>
          <div class="reg-input-wrap">
            <input id="c-senha" class="reg-input has-icon" type="password" placeholder="Mínimo 6 caracteres" autocomplete="new-password" />
            <span class="reg-eye" id="c-toggle1" title="Mostrar/ocultar senha">
              <svg id="c-eye1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            </span>
          </div>
          <div class="reg-strength" id="c-strength-bar">
            <div class="reg-strength-row">
              <span>Força da senha</span>
              <span id="c-strength-text"></span>
            </div>
            <div class="reg-strength-bar">
              <div class="reg-strength-fill" id="c-strength-fill"></div>
            </div>
          </div>
          <span class="reg-error" id="c-senha-err"></span>
        </div>

        <!-- Código de indicação salvo em segundo plano (sem aviso visual) -->
        <input id="c-ref" type="hidden" value="${refCode}" />

        <!-- Termos -->
        <div class="reg-terms">
          Ao criar conta você concorda com os <strong>Termos de Uso</strong>
          e confirma ter mais de 18 anos.
        </div>

        <button type="submit" class="reg-btn" id="c-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
            <line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
          </svg>
          RESGATAR MEUS R$ 260
        </button>
      </form>

      <div class="reg-footer">
        Já tem conta? <a onclick="navigate('#login')">Fazer login</a>
      </div>
      <div style="text-align:center;margin-top:12px">
        <button class="reg-back" onclick="navigate('#landing')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><polyline points="15 18 9 12 15 6"/></svg>
          Voltar ao início
        </button>
      </div>
    </div>
  `;

  const form    = document.getElementById('cad-form');
  const telEl   = document.getElementById('c-tel');
  const senhaEl = document.getElementById('c-senha');
  const refEl   = document.getElementById('c-ref');
  const btn     = document.getElementById('c-btn');

  // ── Verificar se registro está aberto ────────────────────────────────────
  fetch('/api/public/config?_=' + Date.now())
    .then(r => r.json())
    .catch(() => ({}))
    .then(cfg => {
      if (cfg.registro_aberto === false) {
        // Desabilita o form e mostra mensagem
        btn.disabled = true;
        btn.textContent = 'Cadastro temporariamente fechado';
        btn.style.opacity = '0.5';
        const warn = document.createElement('div');
        warn.style.cssText = 'background:rgba(239,68,68,.06);border:1px solid rgba(239,68,68,.20);border-radius:8px;padding:12px 14px;font-size:13px;color:#b91c1c;text-align:center;margin-top:12px';
        warn.textContent = '⚠️ O cadastro de novos usuários está temporariamente suspenso.';
        btn.parentElement.appendChild(warn);
      }
    });

  // ── Toggle visibilidade de senha ──────────────────────────────────────────
  const eyeSVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
  const eyeOffSVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;

  document.getElementById('c-toggle1').addEventListener('click', () => {
    const show = senhaEl.type === 'password';
    senhaEl.type = show ? 'text' : 'password';
    document.getElementById('c-toggle1').innerHTML = show ? eyeOffSVG : eyeSVG;
  });

  // ── Força da senha ────────────────────────────────────────────────────────
  senhaEl.addEventListener('input', () => {
    const v   = senhaEl.value;
    const bar = document.getElementById('c-strength-bar');
    bar.style.display = v ? 'block' : 'none';
    let score = 0;
    if (v.length >= 6)          score++;
    if (v.length >= 10)         score++;
    if (/[A-Z]/.test(v))        score++;
    if (/[0-9]/.test(v))        score++;
    if (/[^A-Za-z0-9]/.test(v)) score++;
    const steps = [
      { w: '20%', color: '#ff4d6d', t: 'Muito fraca' },
      { w: '40%', color: '#ff8c42', t: 'Fraca' },
      { w: '60%', color: '#ffb800', t: 'Média' },
      { w: '80%', color: '#4d9eff', t: 'Forte' },
      { w: '100%',color: '#00c97a', t: 'Muito forte' },
    ];
    const s = steps[Math.min(score, 4)];
    const fill = document.getElementById('c-strength-fill');
    const text = document.getElementById('c-strength-text');
    fill.style.width      = s.w;
    fill.style.background = s.color;
    text.textContent      = s.t;
    text.style.color      = s.color;
    _regClearErr(senhaEl, 'c-senha-err');
  });

  // ── Máscara de telefone ───────────────────────────────────────────────────
  telEl.addEventListener('input', () => {
    let v = telEl.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 6)      v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
    else if (v.length > 2) v = `(${v.slice(0,2)}) ${v.slice(2)}`;
    else if (v.length > 0) v = `(${v}`;
    telEl.value = v;
    _regClearErr(telEl, 'c-tel-err');
  });

  // ── Submit ────────────────────────────────────────────────────────────────
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let valid = true;

    const telRaw = telEl.value.replace(/\D/g, '');
    const senha  = senhaEl.value;
    const ref    = refEl.value.trim();

    if (!telRaw || telRaw.length < 10) {
      _regSetErr(telEl, 'c-tel-err', 'Informe um telefone válido com DDD.'); valid = false;
    }
    if (!senha || senha.length < 6) {
      _regSetErr(senhaEl, 'c-senha-err', 'Senha deve ter pelo menos 6 caracteres.'); valid = false;
    }
    if (!valid) return;

    btn.disabled = true;
    btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="18" height="18" style="animation:spin .7s linear infinite"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-.06-8.5"/></svg> Criando conta...`;

    try {
      const payload = { telefone: telRaw, senha };
      if (ref) payload.codigo_indicacao = ref;

      await API.register(payload);
      sessionStorage.removeItem('ref_code');
      if (window.TutorialTS) TutorialTS.marcarPendente();
      // Sem tela de bonus aqui: o bonus aparece dentro da plataforma e no deposito
      navigate('#painel');
    } catch (err) {
      showToast(err.message, 'error');
      btn.disabled = false;
      btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg> RESGATAR MEUS R$ 260`;
    }
  });
}

// ── Tela de Bônus Reservado (exige depósito mínimo para liberar) ─────────────
function showBonusLockedDeposit(onClose) {
  const overlay = document.createElement('div');
  overlay.id = 'bonus-locked';
  overlay.innerHTML = `
    <style>
      #bonus-locked{position:fixed;inset:0;z-index:999999;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle at center,rgba(22,163,74,.28),rgba(2,6,23,.92));backdrop-filter:blur(10px);animation:blFade .4s ease-out;padding:20px;overflow:hidden}
      @keyframes blFade{from{opacity:0}to{opacity:1}}
      .bl-card{position:relative;background:linear-gradient(160deg,#ffffff 0%,#f0fdf4 100%);border-radius:28px;padding:34px 26px 28px;max-width:400px;width:100%;text-align:center;box-shadow:0 40px 80px rgba(0,0,0,.5),0 0 0 4px rgba(250,204,21,.45),0 0 90px rgba(34,197,94,.55);animation:blPop .6s cubic-bezier(.34,1.56,.64,1);z-index:2;overflow:hidden}
      @keyframes blPop{0%{transform:scale(.4) rotate(-8deg);opacity:0}60%{transform:scale(1.06) rotate(2deg)}100%{transform:scale(1) rotate(0);opacity:1}}
      .bl-shine{position:absolute;top:0;left:-100%;width:60%;height:100%;background:linear-gradient(120deg,transparent,rgba(255,255,255,.55),transparent);animation:blShine 2.4s infinite;pointer-events:none}
      @keyframes blShine{0%{left:-100%}100%{left:200%}}
      .bl-badge{display:inline-flex;align-items:center;gap:6px;background:linear-gradient(135deg,#facc15,#f59e0b);color:#7c2d12;font-weight:900;font-size:11px;letter-spacing:.8px;text-transform:uppercase;padding:6px 12px;border-radius:50px;box-shadow:0 6px 16px rgba(245,158,11,.4);margin-bottom:14px;animation:blBadge 1.6s infinite}
      @keyframes blBadge{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
      .bl-vault{position:relative;width:120px;height:120px;margin:0 auto 10px;display:flex;align-items:center;justify-content:center}
      .bl-vault-bg{position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle,rgba(34,197,94,.25),transparent 70%);animation:blGlow 1.8s ease-in-out infinite}
      @keyframes blGlow{0%,100%{transform:scale(1);opacity:.7}50%{transform:scale(1.25);opacity:1}}
      .bl-emoji{font-size:78px;display:inline-block;filter:drop-shadow(0 10px 20px rgba(0,0,0,.25));animation:blShake 2.2s ease-in-out infinite;position:relative;z-index:2}
      @keyframes blShake{0%,100%{transform:rotate(0) translateY(0)}25%{transform:rotate(-6deg) translateY(-4px)}50%{transform:rotate(0) translateY(0)}75%{transform:rotate(6deg) translateY(-4px)}}
      .bl-lock{position:absolute;bottom:4px;right:8px;background:linear-gradient(135deg,#ef4444,#dc2626);color:#fff;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 6px 14px rgba(220,38,38,.5);animation:blLockPulse 1.4s infinite;z-index:3}
      @keyframes blLockPulse{0%,100%{box-shadow:0 6px 14px rgba(220,38,38,.5),0 0 0 0 rgba(239,68,68,.6)}50%{box-shadow:0 6px 14px rgba(220,38,38,.6),0 0 0 12px rgba(239,68,68,0)}}
      .bl-title{font-size:24px;font-weight:900;color:#0f172a;margin:6px 0 4px;letter-spacing:-.4px;line-height:1.15}
      .bl-title span{background:linear-gradient(135deg,#16a34a,#22c55e,#facc15);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
      .bl-sub{font-size:14px;color:#475569;font-weight:600;margin-bottom:16px}
      .bl-amount-box{background:linear-gradient(135deg,#dcfce7,#fef9c3);border:2px dashed #22c55e;border-radius:16px;padding:14px 12px;margin:10px 0 16px;position:relative}
      .bl-amount-label{font-size:11px;font-weight:800;color:#15803d;letter-spacing:.8px;text-transform:uppercase}
      .bl-amount{font-size:46px;font-weight:900;color:#16a34a;line-height:1;margin-top:4px;text-shadow:0 4px 14px rgba(34,197,94,.3)}
      .bl-amount small{font-size:22px;vertical-align:top;margin-right:3px;font-weight:800}
      .bl-amount-tag{position:absolute;top:-10px;right:10px;background:#ef4444;color:#fff;font-size:10px;font-weight:900;letter-spacing:.6px;padding:3px 9px;border-radius:50px;text-transform:uppercase;box-shadow:0 4px 10px rgba(239,68,68,.4);transform:rotate(6deg)}
      .bl-steps{text-align:left;background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:12px 14px;margin:0 0 16px;font-size:13px}
      .bl-step{display:flex;align-items:center;gap:10px;padding:5px 0;color:#334155;font-weight:600}
      .bl-step .bl-check{width:22px;height:22px;border-radius:50%;background:#22c55e;color:#fff;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:900;flex-shrink:0}
      .bl-step.pending{color:#64748b}
      .bl-step.pending .bl-check{background:#fff;border:2px solid #cbd5e1;color:#cbd5e1}
      .bl-step.active .bl-check{background:linear-gradient(135deg,#facc15,#f59e0b);color:#7c2d12;animation:blBadge 1.4s infinite}
      .bl-min{font-size:13px;color:#0f172a;font-weight:700;margin:-6px 0 14px;background:#fff7ed;border:1px dashed #fb923c;border-radius:10px;padding:8px 10px}
      .bl-min strong{color:#ea580c;font-size:15px}
      .bl-btn{width:100%;padding:16px;border:none;border-radius:14px;background:linear-gradient(135deg,#16a34a 0%,#22c55e 50%,#facc15 100%);color:#fff;font-weight:900;font-size:16px;letter-spacing:.5px;text-transform:uppercase;cursor:pointer;box-shadow:0 12px 30px rgba(34,197,94,.5);transition:transform .15s;animation:blPulse 1.6s infinite;display:flex;align-items:center;justify-content:center;gap:8px}
      .bl-btn:hover{transform:translateY(-2px)}
      .bl-btn:active{transform:scale(.97)}
      @keyframes blPulse{0%,100%{box-shadow:0 12px 30px rgba(34,197,94,.5),0 0 0 0 rgba(250,204,21,.7)}50%{box-shadow:0 12px 30px rgba(34,197,94,.6),0 0 0 18px rgba(250,204,21,0)}}
      .bl-later{margin-top:10px;background:transparent;border:none;color:#94a3b8;font-size:12px;font-weight:600;cursor:pointer;text-decoration:underline;opacity:.7;transition:opacity .2s}
      .bl-later:hover{opacity:1;color:#64748b}
      .bl-timer{margin-top:12px;font-size:12px;color:#dc2626;font-weight:800;display:flex;align-items:center;justify-content:center;gap:6px}
      .bl-timer-dot{width:8px;height:8px;border-radius:50%;background:#dc2626;animation:blDot 1s infinite}
      @keyframes blDot{0%,100%{opacity:1}50%{opacity:.3}}
      
      .bl-countdown{margin:0 0 14px;background:linear-gradient(135deg,#7f1d1d,#dc2626);border-radius:14px;padding:12px 14px;color:#fff;box-shadow:0 10px 24px rgba(220,38,38,.35);position:relative;overflow:hidden;animation:blUrg 1.4s ease-in-out infinite}
      @keyframes blUrg{0%,100%{box-shadow:0 10px 24px rgba(220,38,38,.35),0 0 0 0 rgba(239,68,68,.55)}50%{box-shadow:0 10px 24px rgba(220,38,38,.5),0 0 0 12px rgba(239,68,68,0)}}
      .bl-cd-label{display:flex;align-items:center;justify-content:center;gap:6px;font-size:11px;font-weight:800;letter-spacing:.8px;text-transform:uppercase;opacity:.95;margin-bottom:6px}
      .bl-cd-label .bl-cd-dot{width:8px;height:8px;border-radius:50%;background:#fde047;box-shadow:0 0 10px #fde047;animation:blDot 1s infinite}
      .bl-cd-clock{display:flex;align-items:center;justify-content:center;gap:6px;font-family:'SF Mono','Menlo','Consolas',monospace;font-weight:900}
      .bl-cd-box{background:rgba(0,0,0,.35);border-radius:10px;padding:6px 10px;min-width:54px;text-align:center;font-size:26px;line-height:1;letter-spacing:1px;text-shadow:0 2px 6px rgba(0,0,0,.4);position:relative;overflow:hidden}
      .bl-cd-box::after{content:"";position:absolute;left:0;right:0;top:50%;height:1px;background:rgba(255,255,255,.08)}
      .bl-cd-sep{font-size:24px;font-weight:900;opacity:.8;animation:blBlink 1s infinite}
      @keyframes blBlink{0%,100%{opacity:.85}50%{opacity:.25}}
      .bl-cd-unit{font-size:9px;font-weight:700;opacity:.85;display:block;margin-top:3px;letter-spacing:1px;text-transform:uppercase}
      .bl-cd-bar{height:5px;background:rgba(0,0,0,.3);border-radius:50px;margin-top:10px;overflow:hidden}
      .bl-cd-fill{height:100%;width:100%;background:linear-gradient(90deg,#fde047,#facc15,#f97316);border-radius:50px;transition:width 1s linear}
      .bl-cd-warn{font-size:11px;font-weight:700;text-align:center;margin-top:6px;opacity:.95}
      .bl-confetti{position:absolute;width:10px;height:10px;top:-20px;border-radius:2px;pointer-events:none;animation:blFall linear forwards}
      @keyframes blFall{to{transform:translateY(110vh) rotate(720deg);opacity:0}}
    </style>
    <div class="bl-card">
      <div class="bl-shine"></div>
      <div class="bl-badge">⚡ Última etapa</div>
      <div class="bl-countdown" id="bl-cd">
        <div class="bl-cd-label"><span class="bl-cd-dot"></span><span>Seu bônus expira em</span></div>
        <div class="bl-cd-clock">
          <div class="bl-cd-box"><span id="bl-cd-h">00</span><span class="bl-cd-unit">horas</span></div>
          <div class="bl-cd-sep">:</div>
          <div class="bl-cd-box"><span id="bl-cd-m">24</span><span class="bl-cd-unit">min</span></div>
          <div class="bl-cd-sep">:</div>
          <div class="bl-cd-box"><span id="bl-cd-s">00</span><span class="bl-cd-unit">seg</span></div>
        </div>
        <div class="bl-cd-bar"><div class="bl-cd-fill" id="bl-cd-fill"></div></div>
        <div class="bl-cd-warn">⚠️ Após o tempo, a oferta de R$ 260 será removida</div>
      </div>
      <div class="bl-vault">
        <div class="bl-vault-bg"></div>
        <div class="bl-emoji">💰</div>
        <div class="bl-lock">🔒</div>
      </div>
      <div class="bl-title">Seu bônus está <span>reservado!</span></div>
      <div class="bl-sub">Falta apenas 1 passo para liberar seu saldo</div>

      <div class="bl-amount-box">
        <div class="bl-amount-tag">Aguardando</div>
        <div class="bl-amount-label">Bônus reservado em sua conta</div>
        <div class="bl-amount"><small>R$</small><span id="bl-counter">0</span></div>
      </div>

      <div class="bl-steps">
        <div class="bl-step"><div class="bl-check">✓</div>Conta criada com sucesso</div>
        <div class="bl-step active"><div class="bl-check">2</div>Fazer 1º depósito para liberar bônus</div>
        <div class="bl-step pending"><div class="bl-check">3</div>Começar a jogar e multiplicar</div>
      </div>

      <div class="bl-min">Depósito mínimo: <strong id="bl-min-val">R$ 15,00</strong> • Pix instantâneo 🚀</div>

      <button class="bl-btn" id="bl-go">
        <span>💸 DEPOSITAR E LIBERAR BÔNUS</span>
      </button>
      <div class="bl-timer"><span class="bl-timer-dot"></span><span>Oferta limitada — não perca seu bônus</span></div>
      <button class="bl-later" id="bl-later">Depositar mais tarde</button>
    </div>
  `;
  document.body.appendChild(overlay);

  // Confetes sutis
  const colors = ['#16a34a','#22c55e','#facc15','#f59e0b','#3b82f6','#fff'];
  for (let i = 0; i < 50; i++) {
    const c = document.createElement('div');
    c.className = 'bl-confetti';
    c.style.left = Math.random() * 100 + '%';
    c.style.background = colors[Math.floor(Math.random() * colors.length)];
    c.style.animationDuration = (2.2 + Math.random() * 2.5) + 's';
    c.style.animationDelay = (Math.random() * 0.8) + 's';
    c.style.transform = `rotate(${Math.random() * 360}deg)`;
    if (Math.random() > 0.5) c.style.borderRadius = '50%';
    overlay.appendChild(c);
  }

  // Contador animado de 0 a 260
  const counter = overlay.querySelector('#bl-counter');
  let val = 0;
  const tick = () => {
    val += 10;
    if (val >= 260) { val = 260; counter.textContent = '260,00'; return; }
    counter.textContent = val + ',00';
    requestAnimationFrame(tick);
  };
  setTimeout(() => requestAnimationFrame(tick), 350);

  // Tenta buscar o valor mínimo real da API e atualiza o texto
  try {
    if (window.API && typeof API.getLimites === 'function') {
      API.getLimites().then(r => {
        const m = (r && (r.deposito_minimo || (r.limites && r.limites.deposito_minimo))) || 15;
        const el = overlay.querySelector('#bl-min-val');
        if (el) el.textContent = 'R$ ' + Number(m).toFixed(2).replace('.', ',');
      }).catch(()=>{});
    }
  } catch(_) {}


  // Countdown 24 minutos (persistente por sessão para não resetar ao reabrir)
  (function(){
    const KEY = 'bonus_deadline_ts';
    const DUR = 24 * 60 * 1000;
    let deadline = parseInt(sessionStorage.getItem(KEY) || '0', 10);
    if (!deadline || deadline < Date.now()) {
      deadline = Date.now() + DUR;
      sessionStorage.setItem(KEY, String(deadline));
    }
    const total = deadline - Date.now();
    const elH = overlay.querySelector('#bl-cd-h');
    const elM = overlay.querySelector('#bl-cd-m');
    const elS = overlay.querySelector('#bl-cd-s');
    const elF = overlay.querySelector('#bl-cd-fill');
    const elCd = overlay.querySelector('#bl-cd');
    const pad = (n) => String(Math.max(0, n)).padStart(2,'0');
    const update = () => {
      const left = deadline - Date.now();
      if (left <= 0) {
        elH.textContent = '00'; elM.textContent = '00'; elS.textContent = '00';
        elF.style.width = '0%';
        if (elCd) elCd.querySelector('.bl-cd-warn').innerHTML = '⛔ Tempo esgotado — recupere agora antes que seja tarde';
        return;
      }
      const h = Math.floor(left / 3600000);
      const m = Math.floor((left % 3600000) / 60000);
      const sec = Math.floor((left % 60000) / 1000);
      elH.textContent = pad(h); elM.textContent = pad(m); elS.textContent = pad(sec);
      const pct = Math.max(0, Math.min(100, (left / DUR) * 100));
      elF.style.width = pct + '%';
      if (left < 5 * 60 * 1000 && elCd) elCd.style.animationDuration = '0.8s';
    };
    update();
    const iv = setInterval(() => {
      if (!document.body.contains(overlay)) { clearInterval(iv); return; }
      update();
    }, 1000);
  })();

  if (navigator.vibrate) navigator.vibrate([60, 40, 60]);

  const goDeposit = () => {
    overlay.remove();
    sessionStorage.setItem('open_deposit_after_signup', '1');
    if (onClose) onClose();
  };
  const later = () => {
    overlay.remove();
    if (onClose) onClose();
  };
  overlay.querySelector('#bl-go').addEventListener('click', goDeposit);
  overlay.querySelector('#bl-later').addEventListener('click', later);
}

// ── Helpers de validação ──────────────────────────────────────────────────────
function _regSetErr(inputEl, errId, msg) {
  inputEl.classList.add('error');
  const el = document.getElementById(errId);
  if (el) { el.textContent = msg; el.style.display = 'block'; }
}
function _regClearErr(inputEl, errId) {
  inputEl.classList.remove('error');
  const el = document.getElementById(errId);
  if (el) el.style.display = 'none';
}
