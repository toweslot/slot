// ─── Domain Lock: Removido para funcionar em qualquer domínio ─────────────────
// Bloqueio de domínio desativado pelo usuário.

// ─── API Client ───────────────────────────────────────────────────────────────
const API = (() => {
  const BASE = '/api';

  function getToken() {
    return localStorage.getItem('hw_token');
  }
  function setToken(t) {
    if (t) localStorage.setItem('hw_token', t);
    else   localStorage.removeItem('hw_token');
  }
  function clearToken() {
    localStorage.removeItem('hw_token');
    localStorage.removeItem('hw_user');
  }

  function saveUser(u) {
    if (u) localStorage.setItem('hw_user', JSON.stringify(u));
  }
  function getUser() {
    try { return JSON.parse(localStorage.getItem('hw_user') || 'null'); } catch { return null; }
  }

  async function request(method, path, body = null, auth = true) {
    const headers = { 'Content-Type': 'application/json' };
    if (auth) {
      const token = getToken();
      if (!token) {
        clearToken();
        window.location.hash = '#login';
        throw new Error('Sessão expirada. Faça login novamente.');
      }
      headers['Authorization'] = `Bearer ${token}`;
    }

    const opts = { method, headers };
    if (body && method !== 'GET') opts.body = JSON.stringify(body);

    const res = await fetch(BASE + path, opts);
    const data = await res.json().catch(() => ({}));

    if (res.status === 401) {
      if (auth) {
        // Só redireciona para login em chamadas autenticadas (não no próprio login)
        clearToken();
        window.location.hash = '#login';
      }
      throw new Error(data.error || 'Sessão expirada.');
    }
    if (!res.ok) {
      throw new Error(data.error || `Erro ${res.status}`);
    }
    return data;
  }

  // ── Auth ─────────────────────────────────────────────────────────────────
  async function login(telefone, senha) {
    const data = await request('POST', '/auth/login', { telefone, senha }, false);
    setToken(data.token);
    saveUser(data.user);
    return data;
  }

  async function register(payload) {
    const data = await request('POST', '/auth/register', payload, false);
    setToken(data.token);
    saveUser(data.user);
    return data;
  }

  async function me() {
    const data = await request('GET', '/auth/me');
    saveUser(data.user);
    return data;
  }

  // ── User ─────────────────────────────────────────────────────────────────
  async function dashboard() {
    return request('GET', '/user/dashboard');
  }
  async function salvarPix(chave_pix) {
    return request('PUT', '/user/pix', { chave_pix });
  }
  async function alterarSenha(senha_atual, senha_nova) {
    return request('PUT', '/user/senha', { senha_atual, senha_nova });
  }

  // ── Game ─────────────────────────────────────────────────────────────────
  async function gameConfigs() {
    return request('GET', '/game/configs');
  }
  async function iniciarPartida(valor_entrada, multiplicador_meta) {
    return request('POST', '/game/iniciar', { valor_entrada, multiplicador_meta });
  }
  async function finalizarPartida(partida_id, plataformas_passadas, resgatou) {
    return request('POST', '/game/finalizar', { partida_id, plataformas_passadas, resgatou });
  }

  // ── Financeiro ───────────────────────────────────────────────────────────
  async function depositoInfo() {
    return request('GET', '/user/deposito-info');
  }
  async function deposito(valor, cpf, nome, email, telefone) {
    const u = getUser() || {};
    const payload = {
      valor,
      cpf,
      nome: nome || u.nome || '',
      email: email || u.email || '',
      telefone: telefone || u.telefone || '',
    };
    return request('POST', '/financeiro/deposito', payload);
  }
  async function depositoStatus(txid) {
    return request('GET', `/financeiro/deposito/status/${txid}`);
  }
  async function saque(valor, chave_pix, cpf) {
    return request('POST', '/financeiro/saque', { valor, chave_pix, cpf });
  }
  async function saqueAfiliado(valor, chave_pix) {
    return request('POST', '/financeiro/saque-afiliado', { valor, chave_pix });
  }
  async function historico(pagina = 1, limite = 20) {
    return request('GET', `/financeiro/historico?pagina=${pagina}&limite=${limite}`);
  }
  async function meusSaques() {
    return request('GET', '/financeiro/meus-saques');
  }

  // ── Indicação ────────────────────────────────────────────────────────────
  async function indicacaoInfo() {
    return request('GET', '/indicacao/info');
  }

  // ── Suporte ──────────────────────────────────────────────────────────────
  async function suporteLinks() {
    return request('GET', '/user/suporte');
  }

  // ── Cupons ───────────────────────────────────────────────────────────────
  async function validarCupom(codigo) {
    return request('POST', '/cupons/validar', { codigo });
  }
  async function resgatarCupom(codigo) {
    return request('POST', '/cupons/resgatar', { codigo });
  }

  return {
    getToken, setToken, clearToken, getUser, saveUser,
    login, register, me,
    dashboard, salvarPix, alterarSenha, depositoInfo,
    gameConfigs, iniciarPartida, finalizarPartida,
    deposito, depositoStatus, saque, saqueAfiliado, historico, meusSaques,
    indicacaoInfo, suporteLinks,
    validarCupom, resgatarCupom,
  };
})();
