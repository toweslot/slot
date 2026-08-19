-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Tempo de geração: 10/04/2026 às 20:12
-- Versão do servidor: 11.8.6-MariaDB-log
-- Versão do PHP: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `u950455194_pagamentosengg`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `configs`
--

CREATE TABLE `configs` (
  `key` varchar(80) NOT NULL,
  `value` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `configs`
--

INSERT INTO `configs` (`key`, `value`) VALUES
('bonus_primeiro_deposito', '{\"enabled\":true,\"modo_aplicacao\":\"primeiro_deposito\",\"percentual_bonus\":100,\"rollover_multiplicador\":5}'),
('deposito_bonus', '{\"temDireito\":false,\"perc\":50,\"minimo\":10,\"maximo\":0,\"valores_rapidos\":[10,25,50,100,200],\"dep_presets\":[{\"valor\":10,\"label\":\"\",\"estilo\":\"\"},{\"valor\":25,\"label\":\"\",\"estilo\":\"\"},{\"valor\":50,\"label\":\"\",\"estilo\":\"\"},{\"valor\":100,\"label\":\"\",\"estilo\":\"\"},{\"valor\":200,\"label\":\"\",\"estilo\":\"\"}]}'),
('game', '{\"multiplicador\":5,\"dificuldade\":\"impossivel\",\"entrada_valores_rapidos\":[1,2,5,10,20,50],\"payout_mode\":\"proporcional\",\"taxa_por_plataforma\":0.1,\"payout_por_plataforma_fixo\":0.1,\"killer_chance_global\":0.14,\"influencer_mode\":true,\"influencer_meta_multiplicador\":3,\"deposito_minimo\":10,\"deposito_maximo\":0,\"saque_minimo\":20,\"saque_maximo\":0,\"saque_afiliado_minimo\":50,\"saque_afiliado_maximo\":0,\"influencer_easy_users\":[5,23,58,1,67,68]}'),
('gateway', '{\"provider\":\"ecompag\",\"mercadopago\":{\"enabled\":true},\"ecompag\":{\"enabled\":true},\"sigilopay\":{\"enabled\":true}}'),
('indicacao', '{\"comissao_nivel1_perc\":55,\"bonus_deposito_indicado\":0,\"show_comissao_banner\":1,\"show_saldo_afiliado\":1,\"show_botao_sacar_afil\":1,\"show_link_afiliado\":1,\"show_stats_indicados\":1,\"show_montante\":1,\"show_lista_indicados\":1,\"show_valor_comissao_lista\":1}'),
('public', '{\"site_nome\":\"Jump Cash\",\"site_suporte\":\"\",\"site_promo\":\"\",\"site_logo_url\":\"https:\\/\\/jumppcash.com\\/uploads\\/admin\\/logo_20260324_222130_72da4902.png\",\"site_favicon_url\":\"https:\\/\\/jumppcash.com\\/uploads\\/admin\\/favicon_20260324_222132_b5008620.png\",\"demo_mode\":true,\"registro_aberto\":true,\"manutencao\":false,\"banners\":[{\"url\":\"https:\\/\\/jumppcash.com\\/uploads\\/admin\\/banner_20260324_223315_bdadce23.png\",\"link\":\"\"}],\"suporte_links\":[],\"cores\":{\"cor_bg\":\"#FFE4EE\",\"cor_bg2\":\"#FFB3CB\",\"cor_pink\":\"#FF6B9D\",\"cor_pink2\":\"#FF8CC8\",\"cor_purple\":\"#7c3aed\",\"cor_purple2\":\"#a855f7\",\"cor_green\":\"#22c55e\",\"cor_green2\":\"#16a34a\",\"cor_red\":\"#ef4444\",\"cor_text\":\"#0f172a\"},\"banner_url\":\"https:\\/\\/jumppcash.com\\/uploads\\/admin\\/banner_20260324_223315_bdadce23.png\",\"banner_link\":\"\"}');

-- --------------------------------------------------------

--
-- Estrutura para tabela `cupons`
--

CREATE TABLE `cupons` (
  `id` int(10) UNSIGNED NOT NULL,
  `codigo` varchar(40) NOT NULL,
  `ativo` tinyint(1) NOT NULL DEFAULT 1,
  `tipo` varchar(40) NOT NULL DEFAULT 'bonus_percentual',
  `valor` decimal(14,2) NOT NULL DEFAULT 10.00,
  `uso_maximo` int(11) NOT NULL DEFAULT 0,
  `usos` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `cupons_usos`
--

CREATE TABLE `cupons_usos` (
  `id` int(10) UNSIGNED NOT NULL,
  `cupom_id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `depositos`
--

CREATE TABLE `depositos` (
  `id` int(10) UNSIGNED NOT NULL,
  `txid` varchar(120) NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `provider` varchar(40) NOT NULL,
  `valor` decimal(14,2) NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'pendente',
  `qrcode_texto` longtext DEFAULT NULL,
  `qrcode_imagem` longtext DEFAULT NULL,
  `expires_at` datetime DEFAULT NULL,
  `provider_ref` varchar(120) NOT NULL DEFAULT '',
  `meta_json` longtext NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `partidas`
--

CREATE TABLE `partidas` (
  `id` varchar(64) NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `valor_entrada` decimal(14,2) NOT NULL,
  `valor_meta` decimal(14,2) NOT NULL,
  `valor_por_plataforma` decimal(14,4) NOT NULL,
  `multiplicador_meta` decimal(10,2) NOT NULL,
  `dificuldade` varchar(40) NOT NULL DEFAULT 'normal',
  `killer_chance_override` decimal(10,4) DEFAULT NULL,
  `plataformas_passadas` int(11) NOT NULL DEFAULT 0,
  `resgatou` tinyint(1) NOT NULL DEFAULT 0,
  `status` varchar(20) NOT NULL DEFAULT 'ativa',
  `valor_resultado` decimal(14,2) NOT NULL DEFAULT 0.00,
  `created_at` datetime NOT NULL,
  `finalized_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `saques`
--

CREATE TABLE `saques` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `tipo` varchar(40) NOT NULL DEFAULT 'saque',
  `valor` decimal(14,2) NOT NULL,
  `pix_chave` varchar(255) NOT NULL DEFAULT '',
  `cpf` varchar(20) NOT NULL DEFAULT '',
  `nome_solicitante` varchar(190) NOT NULL DEFAULT '',
  `status` varchar(20) NOT NULL DEFAULT 'pendente',
  `meta_json` longtext NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `suporte_links`
--

CREATE TABLE `suporte_links` (
  `id` int(10) UNSIGNED NOT NULL,
  `nome` varchar(120) NOT NULL,
  `url` varchar(500) NOT NULL,
  `ordem` int(11) NOT NULL DEFAULT 0,
  `ativo` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `transacoes`
--

CREATE TABLE `transacoes` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `tipo` varchar(40) NOT NULL,
  `valor` decimal(14,2) NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'aprovado',
  `referencia` varchar(120) NOT NULL DEFAULT '',
  `meta_json` longtext NOT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `nome` varchar(120) NOT NULL DEFAULT '',
  `apelido_admin` varchar(120) NOT NULL DEFAULT '',
  `email` varchar(190) NOT NULL DEFAULT '',
  `telefone` varchar(30) NOT NULL,
  `senha_hash` varchar(255) NOT NULL,
  `chave_pix` varchar(255) NOT NULL DEFAULT '',
  `codigo_indicacao` varchar(40) DEFAULT NULL,
  `convidado_por_id` int(10) UNSIGNED DEFAULT NULL,
  `is_admin` tinyint(1) NOT NULL DEFAULT 0,
  `is_influencer` tinyint(1) NOT NULL DEFAULT 0,
  `comissao_indicacao_perc` decimal(6,2) DEFAULT NULL,
  `saldo` decimal(14,2) NOT NULL DEFAULT 0.00,
  `saldo_afiliado` decimal(14,2) NOT NULL DEFAULT 0.00,
  `recebeu_bonus_primeiro_deposito` tinyint(1) NOT NULL DEFAULT 0,
  `primeiro_deposito_valor` decimal(14,2) NOT NULL DEFAULT 0.00,
  `bonus_primeiro_deposito_valor` decimal(14,2) NOT NULL DEFAULT 0.00,
  `primeiro_deposito_total_com_bonus` decimal(14,2) NOT NULL DEFAULT 0.00,
  `rollover_exigido_bonus` decimal(14,2) NOT NULL DEFAULT 0.00,
  `rollover_cumprido_bonus` decimal(14,2) NOT NULL DEFAULT 0.00,
  `rollover_restante_bonus` decimal(14,2) NOT NULL DEFAULT 0.00,
  `saque_liberado_bonus` tinyint(1) NOT NULL DEFAULT 1,
  `total_partidas` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `configs`
--
ALTER TABLE `configs`
  ADD PRIMARY KEY (`key`);

--
-- Índices de tabela `cupons`
--
ALTER TABLE `cupons`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_cupons_codigo` (`codigo`);

--
-- Índices de tabela `cupons_usos`
--
ALTER TABLE `cupons_usos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_cupons_usos` (`cupom_id`,`user_id`),
  ADD KEY `idx_cupons_usos_user` (`user_id`);

--
-- Índices de tabela `depositos`
--
ALTER TABLE `depositos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_depositos_txid` (`txid`),
  ADD KEY `idx_depositos_user` (`user_id`),
  ADD KEY `idx_depositos_status` (`status`);

--
-- Índices de tabela `partidas`
--
ALTER TABLE `partidas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_partidas_user` (`user_id`);

--
-- Índices de tabela `saques`
--
ALTER TABLE `saques`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_saques_user` (`user_id`),
  ADD KEY `idx_saques_status` (`status`);

--
-- Índices de tabela `suporte_links`
--
ALTER TABLE `suporte_links`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `transacoes`
--
ALTER TABLE `transacoes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_transacoes_user` (`user_id`),
  ADD KEY `idx_transacoes_tipo_status` (`tipo`,`status`);

--
-- Índices de tabela `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_users_telefone` (`telefone`),
  ADD UNIQUE KEY `uk_users_codigo_indicacao` (`codigo_indicacao`),
  ADD KEY `idx_users_convidado_por` (`convidado_por_id`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `cupons`
--
ALTER TABLE `cupons`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `cupons_usos`
--
ALTER TABLE `cupons_usos`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `depositos`
--
ALTER TABLE `depositos`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT de tabela `saques`
--
ALTER TABLE `saques`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de tabela `suporte_links`
--
ALTER TABLE `suporte_links`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `transacoes`
--
ALTER TABLE `transacoes`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=620;

--
-- AUTO_INCREMENT de tabela `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=103;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `cupons_usos`
--
ALTER TABLE `cupons_usos`
  ADD CONSTRAINT `fk_cupons_usos_cupom` FOREIGN KEY (`cupom_id`) REFERENCES `cupons` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_cupons_usos_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `depositos`
--
ALTER TABLE `depositos`
  ADD CONSTRAINT `fk_depositos_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `partidas`
--
ALTER TABLE `partidas`
  ADD CONSTRAINT `fk_partidas_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `saques`
--
ALTER TABLE `saques`
  ADD CONSTRAINT `fk_saques_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `transacoes`
--
ALTER TABLE `transacoes`
  ADD CONSTRAINT `fk_transacoes_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_users_convidado_por` FOREIGN KEY (`convidado_por_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
