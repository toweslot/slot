// ─── Login Page ───────────────────────────────────────────────────────────────
function renderLogin(el) {
  el.innerHTML = `
    <style>
      #page-login.active {
        display: flex; align-items: center; justify-content: center;
        min-height: 100vh; width: 100%; overflow-x: hidden;
        padding: 24px 16px;
        background: #f0f5ff;
      }
      .lgn-wrap {
        width: 100%; max-width: 420px; box-sizing: border-box;
        background: #ffffff;
        border: 1px solid rgba(37,99,235,0.14);
        border-radius: 16px; padding: 40px 32px;
        box-shadow: 0 8px 40px rgba(15,23,42,0.10);
        animation: popIn 0.35s ease both;
      }
      .lgn-logo {
        display: flex; align-items: center; justify-content: center; gap: 10px;
        font-size: 20px; font-weight: 800; color: #2563eb; margin-bottom: 8px;
      }
      .lgn-title {
        font-size: 22px; font-weight: 800; color: #0f172a; text-align: center; margin-bottom: 6px;
      }
      .lgn-sub {
        font-size: 14px; color: rgba(15,23,42,0.50); text-align: center; margin-bottom: 28px;
      }
      .lgn-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
      .lgn-label {
        font-size: 13px; font-weight: 600; color: rgba(15,23,42,0.65); letter-spacing: 0.2px;
      }
      .lgn-input-wrap { position: relative; }
      .lgn-input {
        width: 100%; padding: 12px 16px; border-radius: 8px;
        background: #f8faff; border: 1.5px solid rgba(37,99,235,0.15);
        color: #0f172a; font-size: 15px; font-family: inherit;
        outline: none; transition: border-color 0.2s, background 0.2s;
      }
      .lgn-input::placeholder { color: rgba(15,23,42,0.30); }
      .lgn-input:focus { border-color: #2563eb; background: #eff4ff; }
      .lgn-input.error { border-color: #ef4444; }
      .lgn-input.has-icon { padding-right: 44px; }
      .lgn-eye {
        position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
        cursor: pointer; color: rgba(15,23,42,0.35); display: flex; align-items: center;
        transition: color 0.2s;
      }
      .lgn-eye:hover { color: rgba(15,23,42,0.65); }
      .lgn-error { font-size: 12px; color: #ef4444; font-weight: 600; display: none; }
      .lgn-forgot {
        text-align: right; margin-bottom: 20px;
        font-size: 13px; color: #2563eb; font-weight: 600; cursor: pointer;
        opacity: 0.80; transition: opacity 0.2s;
      }
      .lgn-forgot:hover { opacity: 1; }
      .lgn-btn {
        width: 100%; padding: 14px; border-radius: 8px; border: none; cursor: pointer;
        background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
        color: #fff; font-weight: 700; font-size: 15px; letter-spacing: 0.3px;
        display: flex; align-items: center; justify-content: center; gap: 10px;
        transition: transform 0.2s, box-shadow 0.2s;
        box-shadow: 0 4px 20px rgba(37,99,235,0.35);
      }
      .lgn-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 28px rgba(37,99,235,0.50); }
      .lgn-btn:active { transform: scale(0.98); }
      .lgn-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
      .lgn-footer {
        text-align: center; margin-top: 20px;
        font-size: 14px; color: rgba(15,23,42,0.45);
      }
      .lgn-footer a {
        color: #2563eb; font-weight: 700; cursor: pointer; text-decoration: none;
        transition: opacity 0.2s;
      }
      .lgn-footer a:hover { opacity: 0.75; }
      .lgn-back {
        display: flex; align-items: center; justify-content: center; gap: 6px;
        margin-top: 12px; font-size: 13px; color: rgba(15,23,42,0.35);
        cursor: pointer; background: none; border: none; transition: color 0.2s;
      }
      .lgn-back:hover { color: rgba(15,23,42,0.60); }
    </style>

    <div class="lgn-wrap">
      <!-- Logo -->
      <div class="lgn-logo brand-logo-wrap">
        <img class="brand-logo-img" src="" alt="logo" style="display:none;height:36px;object-fit:contain"/>
        <svg class="brand-logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="24" height="24">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
        </svg>
        <span class="brand-name">Tower Slot</span>
      </div>
      <h2 class="lgn-title">Entrar na conta</h2>
      <p class="lgn-sub">Bem-vindo de volta! Acesse para jogar.</p>

      <form id="login-form" novalidate>

        <!-- Telefone -->
        <div class="lgn-group">
          <label class="lgn-label">Telefone (WhatsApp)</label>
          <input id="l-tel" class="lgn-input" type="tel" placeholder="(11) 99999-0000" autocomplete="tel" inputmode="numeric" />
          <span class="lgn-error" id="l-tel-err"></span>
        </div>

        <!-- Senha -->
        <div class="lgn-group">
          <label class="lgn-label">Senha</label>
          <div class="lgn-input-wrap">
            <input id="l-senha" class="lgn-input has-icon" type="password" placeholder="Sua senha" autocomplete="current-password" />
            <span class="lgn-eye" id="l-toggle-pwd">
              <svg id="l-eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            </span>
          </div>
          <span class="lgn-error" id="l-senha-err"></span>
        </div>

        <div class="lgn-forgot">Esqueci minha senha</div>

        <button type="submit" class="lgn-btn" id="l-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
            <polyline points="10 17 15 12 10 7"/>
            <line x1="15" y1="12" x2="3" y2="12"/>
          </svg>
          ENTRAR
        </button>
      </form>

      <div class="lgn-footer">
        Não tem conta? <a onclick="navigate('#cadastro')">Cadastre-se grátis</a>
      </div>
      <div style="text-align:center;margin-top:12px">
        <button class="lgn-back" onclick="navigate('#landing')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><polyline points="15 18 9 12 15 6"/></svg>
          Voltar ao início
        </button>
      </div>
    </div>
  `;

  const form      = document.getElementById('login-form');
  const telEl     = document.getElementById('l-tel');
  const senhaEl   = document.getElementById('l-senha');
  const btn       = document.getElementById('l-btn');
  const togglePwd = document.getElementById('l-toggle-pwd');

  // SVGs do olho
  const eyeSVG    = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
  const eyeOffSVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;

  // Máscara de telefone
  telEl.addEventListener('input', () => {
    let v = telEl.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 6)      v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
    else if (v.length > 2) v = `(${v.slice(0,2)}) ${v.slice(2)}`;
    else if (v.length > 0) v = `(${v}`;
    telEl.value = v;
    _lgnClearErr(telEl, 'l-tel-err');
  });

  // Toggle visibilidade da senha
  togglePwd.addEventListener('click', () => {
    const show = senhaEl.type === 'password';
    senhaEl.type = show ? 'text' : 'password';
    togglePwd.innerHTML = show ? eyeOffSVG : eyeSVG;
  });

  senhaEl.addEventListener('input', () => _lgnClearErr(senhaEl, 'l-senha-err'));

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let valid = true;

    const telRaw = telEl.value.replace(/\D/g, '');
    const senha  = senhaEl.value;

    if (!telRaw || telRaw.length < 10) {
      _lgnSetErr(telEl, 'l-tel-err', 'Informe um telefone válido com DDD.'); valid = false;
    }
    if (!senha) {
      _lgnSetErr(senhaEl, 'l-senha-err', 'Informe sua senha.'); valid = false;
    }
    if (!valid) return;

    btn.disabled = true;
    btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="18" height="18" style="animation:spin .7s linear infinite"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-.06-8.5"/></svg> Entrando...`;

    try {
      await API.login(telRaw, senha);
      showToast('Login realizado! Bem-vindo de volta!', 'success');
      setTimeout(() => navigate('#painel'), 500);
    } catch (err) {
      showToast(err.message, 'error');
      _lgnSetErr(telEl, 'l-tel-err', err.message);
      btn.disabled = false;
      btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg> ENTRAR`;
    }
  });
}

function _lgnSetErr(inputEl, errId, msg) {
  inputEl.classList.add('error');
  const el = document.getElementById(errId);
  if (el) { el.textContent = msg; el.style.display = 'block'; }
}
function _lgnClearErr(inputEl, errId) {
  inputEl.classList.remove('error');
  const el = document.getElementById(errId);
  if (el) el.style.display = 'none';
}
