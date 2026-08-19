PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT DEFAULT '',
  apelido_admin TEXT DEFAULT '',
  email TEXT DEFAULT '',
  telefone TEXT NOT NULL UNIQUE,
  senha_hash TEXT NOT NULL,
  chave_pix TEXT DEFAULT '',
  codigo_indicacao TEXT UNIQUE,
  convidado_por_id INTEGER NULL,
  is_admin INTEGER NOT NULL DEFAULT 0,
  is_influencer INTEGER NOT NULL DEFAULT 0,
  comissao_indicacao_perc REAL NULL,
  saldo REAL NOT NULL DEFAULT 0,
  saldo_afiliado REAL NOT NULL DEFAULT 0,
  recebeu_bonus_primeiro_deposito INTEGER NOT NULL DEFAULT 0,
  primeiro_deposito_valor REAL NOT NULL DEFAULT 0,
  bonus_primeiro_deposito_valor REAL NOT NULL DEFAULT 0,
  primeiro_deposito_total_com_bonus REAL NOT NULL DEFAULT 0,
  rollover_exigido_bonus REAL NOT NULL DEFAULT 0,
  rollover_cumprido_bonus REAL NOT NULL DEFAULT 0,
  rollover_restante_bonus REAL NOT NULL DEFAULT 0,
  saque_liberado_bonus INTEGER NOT NULL DEFAULT 1,
  total_partidas INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (convidado_por_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS configs (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS partidas (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  valor_entrada REAL NOT NULL,
  valor_meta REAL NOT NULL,
  valor_por_plataforma REAL NOT NULL,
  multiplicador_meta REAL NOT NULL,
  dificuldade TEXT NOT NULL DEFAULT 'normal',
  killer_chance_override REAL NULL,
  plataformas_passadas INTEGER NOT NULL DEFAULT 0,
  resgatou INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'ativa',
  valor_resultado REAL NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  finalized_at TEXT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS transacoes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  tipo TEXT NOT NULL,
  valor REAL NOT NULL,
  status TEXT NOT NULL DEFAULT 'aprovado',
  referencia TEXT DEFAULT '',
  meta_json TEXT DEFAULT '{}',
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS depositos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  txid TEXT NOT NULL UNIQUE,
  user_id INTEGER NOT NULL,
  provider TEXT NOT NULL,
  valor REAL NOT NULL,
  status TEXT NOT NULL DEFAULT 'pendente',
  qrcode_texto TEXT DEFAULT '',
  qrcode_imagem TEXT DEFAULT '',
  expires_at TEXT NULL,
  provider_ref TEXT DEFAULT '',
  meta_json TEXT DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS saques (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  tipo TEXT NOT NULL DEFAULT 'saque',
  valor REAL NOT NULL,
  pix_chave TEXT DEFAULT '',
  cpf TEXT DEFAULT '',
  nome_solicitante TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pendente',
  meta_json TEXT DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS cupons (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  codigo TEXT NOT NULL UNIQUE,
  ativo INTEGER NOT NULL DEFAULT 1,
  tipo TEXT NOT NULL DEFAULT 'bonus_percentual',
  valor REAL NOT NULL DEFAULT 10,
  uso_maximo INTEGER NOT NULL DEFAULT 0,
  usos INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS cupons_usos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cupom_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  UNIQUE(cupom_id, user_id),
  FOREIGN KEY (cupom_id) REFERENCES cupons(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS suporte_links (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  url TEXT NOT NULL,
  ordem INTEGER NOT NULL DEFAULT 0,
  ativo INTEGER NOT NULL DEFAULT 1
);

