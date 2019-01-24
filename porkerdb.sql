-- phpMyAdmin SQL Dump
-- version 4.7.9
-- https://www.phpmyadmin.net/
--
-- 主機: 127.0.0.1:3306
-- 產生時間： 2019 年 01 月 15 日 07:48
-- 伺服器版本: 5.7.21
-- PHP 版本： 7.2.4
-- Schema version 0.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 資料庫： `porkerdb`
--

DELIMITER $$
--
-- Procedure
--
DROP PROCEDURE IF EXISTS `get_table_type`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_table_type` ()  BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		ROLLBACK;
	END;
	
	START TRANSACTION;
		SELECT id, table_name, game_name, mode_name, description FROM mapping_table_type ;
	COMMIT;
END$$

DROP PROCEDURE IF EXISTS `insert_club_game`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `insert_club_game` (IN `club` INT, IN `game_mode` TINYINT, IN `rule` INT, IN `hour` DECIMAL(5,1), IN `owner` INT, IN `name` VARCHAR(50), IN `people` TINYINT, IN `sb` INT, IN `bb` INT, IN `insurance` TINYINT, IN `multdeal` TINYINT, IN `jackpot` TINYINT, IN `status` TINYINT)  BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		ROLLBACK;
	END;
	
	START TRANSACTION;
		INSERT INTO summary_club_game (club, game_mode, rule, hour, owner, name, people, sb, bb, insurance, multdeal, jackpot, status)
		VALUES (club, game_mode, rule, hour, owner, name, people, sb, bb, insurance, multdeal, jackpot, status);
	COMMIT;
	SELECT id FROM summary_club_game WHERE club = club AND owner = owner ORDER BY start_time DESC LIMIT 1;
END$$

DROP PROCEDURE IF EXISTS `insert_club_session`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `insert_club_session` (IN `game` BIGINT)  BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		ROLLBACK;
	END;
	
	START TRANSACTION;
		INSERT INTO summary_club_session (game) 
		VALUES (game);
	COMMIT;
	SELECT id FROM summary_club_session WHERE game = game ORDER BY start_time DESC LIMIT 1;
END$$

DROP PROCEDURE IF EXISTS `insert_nlh_rule`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `insert_nlh_rule` (IN `club` INT, IN `owner` INT, IN `seat` TINYINT, IN `sec` TINYINT, IN `sb` INT, IN `bb` INT, IN `min_bet` INT, IN `max_bet` INT, IN `ante` INT, IN `auto_start` TINYINT, IN `start_people` TINYINT, IN `straddle` TINYINT, IN `multdeal` TINYINT, IN `insurance` TINYINT, IN `rake` DECIMAL(10,2), IN `top_rake` FLOAT, IN `buyin` TINYINT, IN `gps` TINYINT, IN `ip` TINYINT, IN `game_time` DECIMAL(10,1))  BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		ROLLBACK;
	END;
	
	START TRANSACTION;
		INSERT INTO rule_nlh_normal (club, owner, seat, sec, sb, bb, min_bet, max_bet, ante, auto_start, start_people, straddle, multdeal, insurance, rake, top_rake, buyin, gps, ip, game_time)
		VALUES (club, owner, seat, sec, sb, bb, min_bet, max_bet, ante, auto_start, start_people, straddle, multdeal, insurance, rake, top_rake, buyin, gps, ip, game_time);
	COMMIT;
	SELECT id FROM rule_nlh_normal WHERE club = club AND owner = owner ORDER BY now_time DESC LIMIT 1;
END$$

DROP PROCEDURE IF EXISTS `insert_player_game`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `insert_player_game` (IN `player` BIGINT, IN `game` BIGINT, IN `session` SMALLINT, IN `fish` TINYINT, IN `winner` TINYINT, IN `rich_man` TINYINT, IN `wtsd` SMALLINT, IN `wssd` SMALLINT, IN `steal` SMALLINT, IN `vpip` SMALLINT, IN `pfr` SMALLINT, IN `three_bet` SMALLINT, IN `c_bet` SMALLINT, IN `other_three_bet` SMALLINT, IN `fold_to_three_bet` SMALLINT, IN `other_c_bet` SMALLINT, IN `fold_to_c_bet` SMALLINT, IN `bet` SMALLINT, IN `raise` SMALLINT, IN `calls` SMALLINT, IN `check_raise` SMALLINT, IN `squeeze` SMALLINT, IN `win` INT, IN `take_in` INT)  BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		ROLLBACK;
	END;
	
	START TRANSACTION;
		INSERT INTO player_club_game (player, game, session, fish, winner, rich_man, wtsd, wssd, steal, vpip, pfr, three_bet, c_bet,
		other_three_bet, fold_to_three_bet, other_c_bet, fold_to_c_bet, bet, raise, calls, check_raise, squeeze, win, take_in)
		VALUES (player, game, session, fish, winner, rich_man, wtsd, wssd, steal, vpip, pfr, three_bet, c_bet,
		other_three_bet, fold_to_three_bet, other_c_bet, fold_to_c_bet, bet, raise, calls, check_raise, squeeze, win, take_in);
	COMMIT;
END$$

DROP PROCEDURE IF EXISTS `insert_player_session`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `insert_player_session` (IN `session` INT, IN `round` INT, IN `hands_amount` INT, IN `seat` INT, IN `privacy_card` INT, IN `sec` INT, IN `action` INT, IN `bet` INT, IN `pot` INT, IN `insurance_bet` INT)  BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		ROLLBACK;
	END;
	
	START TRANSACTION;
		INSERT INTO player_club_session (session, round, hands_amount, seat, privacy_card, sec, action, bet, pot, insurance_bet)
		VALUES (session, round, hands_amount, seat, privacy_card, sec, action, bet, pot, insurance_bet);
	COMMIT;
END$$

DROP PROCEDURE IF EXISTS `select_table_type`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `select_table_type` (IN `params` JSON)  BEGIN
	SELECT table_name, game_name, mode_name FROM mapping_table_type WHERE id = JSON_EXTRACT(params, '$.id');
END$$

DROP PROCEDURE IF EXISTS `update_club_game`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `update_club_game` (IN `params` JSON)  BEGIN

	DECLARE EXIT HANDLER FOR SQLEXCEPTION
   BEGIN
  
   	ROLLBACK;
   END;

	START TRANSACTION;   

		UPDATE summary_club_game SET 
		close_time = JSON_UNQUOTE(JSON_EXTRACT(params, '$.close_time')), -- 字串
		`session`= JSON_EXTRACT(params, '$.session'), -- 數字
		fish = JSON_EXTRACT(params, '$.fish'),
		winner = JSON_EXTRACT(params, '$.winner'),
		rich_man = JSON_EXTRACT(params, '$.rich_man'),
		take_in = JSON_EXTRACT(params, '$.take_in'),
		pot = JSON_EXTRACT(params, '$.pot'),
		proxy_pot = JSON_EXTRACT(params, '$.proxy_pot'),
		main_pot = JSON_EXTRACT(params, '$.main_pot'),
		insurance_bet = JSON_EXTRACT(params, '$.insurance_bet'),
		jackpot_bet = JSON_EXTRACT(params, '$.jackpot_bet'),
		status = 0, 
		close = 1 
		WHERE id = JSON_EXTRACT(params, '$.id');  
		
	COMMIT;
END$$

DROP PROCEDURE IF EXISTS `update_club_session`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `update_club_session` (IN `params` JSON)  BEGIN

	DECLARE EXIT HANDLER FOR SQLEXCEPTION
   BEGIN
  
   	ROLLBACK;
   END;

	START TRANSACTION;   

		UPDATE summary_club_session SET 
		end_time = JSON_UNQUOTE(JSON_EXTRACT(params, '$.end_time')), -- 字串
		`hour` = JSON_EXTRACT(params, '$.hour'), -- 數字
		pot = JSON_EXTRACT(params, '$.pot'), 
		dealer = JSON_EXTRACT(params, '$.dealer'), 
		winner = JSON_EXTRACT(params, '$.winner'), 
		public_card = JSON_UNQUOTE(JSON_EXTRACT(params, '$.public_card')),
		insurance_bet = JSON_EXTRACT(params, '$.insurance_bet')
		
		WHERE id = JSON_EXTRACT(params, '$.id');   
		
	COMMIT;
END$$

--
-- 函數
--
DROP FUNCTION IF EXISTS `get_game_id`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `get_game_id` (`club` INT, `owner` INT) RETURNS BIGINT(20) BEGIN
	RETURN (SELECT id FROM summary_club_game WHERE club = club AND owner = owner ORDER BY start_time DESC LIMIT 1);
END$$

DROP FUNCTION IF EXISTS `get_session_id`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `get_session_id` (`game` INT) RETURNS BIGINT(20) BEGIN
	RETURN (SELECT id FROM summary_club_session WHERE game = game ORDER BY start_time DESC LIMIT 1);
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- 資料表結構 `mapping_game_action`
--

DROP TABLE IF EXISTS `mapping_game_action`;
CREATE TABLE IF NOT EXISTS `mapping_game_action` (
  `id` tinyint(4) NOT NULL AUTO_INCREMENT COMMENT '流水號',
  `name` varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '名稱',
  `description` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '描述',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='遊戲動作類別';

--
-- 資料表的匯出資料 `mapping_game_action`
--

INSERT INTO `mapping_game_action` (`id`, `name`, `description`) VALUES
(0, 'NON', 'unknow'),
(1, 'CALL', '跟注'),
(2, 'RAISE', '加注'),
(3, 'ALLIN', '梭哈'),
(4, 'FOLD', '放棄'),
(5, 'CHECK', '看牌');

-- --------------------------------------------------------

--
-- 資料表結構 `mapping_game_mode`
--

DROP TABLE IF EXISTS `mapping_game_mode`;
CREATE TABLE IF NOT EXISTS `mapping_game_mode` (
  `id` tinyint(4) NOT NULL AUTO_INCREMENT COMMENT '流水號',
  `name` varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '名稱',
  `description` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '描述',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='德州撲克類型';

--
-- 資料表的匯出資料 `mapping_game_mode`
--

INSERT INTO `mapping_game_mode` (`id`, `name`, `description`) VALUES
(0, 'NON', 'unknow'),
(1, 'N', '常規桌'),
(2, 'S', 'SNG'),
(3, 'M', 'MTT'),
(4, 'BB', '血戰模式'),
(5, 'BINB', '血進血出');

-- --------------------------------------------------------

--
-- 資料表結構 `mapping_game_type`
--

DROP TABLE IF EXISTS `mapping_game_type`;
CREATE TABLE IF NOT EXISTS `mapping_game_type` (
  `id` tinyint(4) NOT NULL AUTO_INCREMENT COMMENT '流水號',
  `name` varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '英文簡寫(T、N、P、O)',
  `description` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '描述',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='遊戲類別(Teen Patti、NLH、PLO、OFG)';

--
-- 資料表的匯出資料 `mapping_game_type`
--

INSERT INTO `mapping_game_type` (`id`, `name`, `description`) VALUES
(0, 'NON', 'unknow'),
(1, 'N', 'NLH 無限注德州'),
(2, 'P', 'PLO 奧瑪哈'),
(3, 'O', 'OFC 大波蘿'),
(4, 'T', 'Teen Patti 短牌');

-- --------------------------------------------------------

--
-- 資料表結構 `mapping_round_status`
--

DROP TABLE IF EXISTS `mapping_round_status`;
CREATE TABLE IF NOT EXISTS `mapping_round_status` (
  `id` tinyint(4) NOT NULL AUTO_INCREMENT COMMENT '流水號',
  `name` varchar(10) COLLATE utf8_unicode_ci NOT NULL COMMENT '狀態',
  `description` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '描述',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='round狀態類別';

--
-- 資料表的匯出資料 `mapping_round_status`
--

INSERT INTO `mapping_round_status` (`id`, `name`, `description`) VALUES
(0, 'NON', 'unknow'),
(1, 'pre-flop', '翻牌圈前'),
(2, 'flop', '翻牌圈'),
(3, 'turn', '轉牌圈'),
(4, 'river', '河牌圈'),
(5, 'unusual', '不正常');

-- --------------------------------------------------------

--
-- 資料表結構 `mapping_table_belong`
--

DROP TABLE IF EXISTS `mapping_table_belong`;
CREATE TABLE IF NOT EXISTS `mapping_table_belong` (
  `id` tinyint(4) NOT NULL AUTO_INCREMENT COMMENT '流水號',
  `name` varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '英文簡寫(N、C、R、O)',
  `description` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '描述',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='桌子類別(Normal、Club、Rank、Official)';

--
-- 資料表的匯出資料 `mapping_table_belong`
--

INSERT INTO `mapping_table_belong` (`id`, `name`, `description`) VALUES
(0, 'NON', 'unknow'),
(1, 'P', 'public 公桌'),
(2, 'C', 'club 俱樂部'),
(3, 'O', 'offical 官方賽事'),
(4, 'R', 'rank 天梯聯賽');

-- --------------------------------------------------------

--
-- 資料表結構 `mapping_table_type`
--

DROP TABLE IF EXISTS `mapping_table_type`;
CREATE TABLE IF NOT EXISTS `mapping_table_type` (
  `id` tinyint(4) NOT NULL AUTO_INCREMENT COMMENT '流水號',
  `table_id` tinyint(4) DEFAULT NULL COMMENT '桌子類型(mapping_table_belong.id)',
  `table_name` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '桌子類型(mapping_table_belong.name)',
  `game_id` tinyint(4) DEFAULT NULL COMMENT '遊戲類型(mapping_game_type.id)',
  `game_name` varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '遊戲類型(mapping_game_type.name)',
  `mode_id` tinyint(4) DEFAULT NULL COMMENT '德州撲克類型(mapping_game_mode.id)',
  `mode_name` varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '德州撲克類型(mapping_game_mode.name)',
  `description` varchar(40) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '說明',
  PRIMARY KEY (`id`),
  KEY `FK_mapping_table_type_mapping_table_belong` (`table_id`),
  KEY `FK_mapping_table_type_mapping_game_type` (`game_id`),
  KEY `FK_mapping_table_type_mapping_game_mode` (`mode_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='牌桌類型';

--
-- 資料表的匯出資料 `mapping_table_type`
--

INSERT INTO `mapping_table_type` (`id`, `table_id`, `table_name`, `game_id`, `game_name`, `mode_id`, `mode_name`, `description`) VALUES
(1, 1, 'P', 1, 'N', 1, 'N', 'PUBLIC NLH NORMAL'),
(2, 1, 'P', 2, 'N', 1, 'N', 'PUBLIC PLO NORMAL'),
(3, 1, 'P', 3, 'O', 1, 'N', 'PUBLIC OFC NORMAL'),
(4, 1, 'P', 4, 'T', 1, 'N', 'PUBLIC TEEN PATTI NORMAL'),
(5, 2, 'C', 1, 'N', 1, 'N', 'CLUB NLH NORMAL');

-- --------------------------------------------------------

--
-- 資料表結構 `player_club_game`
--

DROP TABLE IF EXISTS `player_club_game`;
CREATE TABLE IF NOT EXISTS `player_club_game` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '流水號',
  `player` bigint(20) NOT NULL COMMENT '玩家ID',
  `game` bigint(20) NOT NULL COMMENT 'game流水號 (summary_club_game.id)',
  `session` smallint(6) NOT NULL DEFAULT '0' COMMENT '總手數',
  `fish` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否是肥魚',
  `winner` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否是冠軍',
  `rich_man` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否是豪客',
  `wtsd` smallint(6) NOT NULL DEFAULT '0' COMMENT '攤牌次數',
  `wssd` smallint(6) NOT NULL DEFAULT '0' COMMENT '攤牌贏的次數',
  `steal` smallint(6) NOT NULL DEFAULT '0' COMMENT '偷盲次數',
  `vpip` smallint(6) NOT NULL DEFAULT '0' COMMENT '入池數',
  `pfr` smallint(6) NOT NULL DEFAULT '0' COMMENT '翻前加注次數',
  `three_bet` smallint(6) NOT NULL DEFAULT '0' COMMENT '再加注次數',
  `c_bet` smallint(6) NOT NULL DEFAULT '0' COMMENT '持續下注次數',
  `other_three_bet` smallint(6) NOT NULL DEFAULT '0' COMMENT '對手再加注次數',
  `fold_to_three_bet` smallint(6) NOT NULL DEFAULT '0' COMMENT '對手再加注時，玩家棄牌次數',
  `other_c_bet` smallint(6) NOT NULL DEFAULT '0' COMMENT '對手持續下注次數',
  `fold_to_c_bet` smallint(6) NOT NULL DEFAULT '0' COMMENT '對手持續下注時，玩家棄牌次數',
  `bet` smallint(6) NOT NULL DEFAULT '0' COMMENT '下注次數',
  `raise` smallint(6) NOT NULL DEFAULT '0' COMMENT '加注次數',
  `calls` smallint(6) NOT NULL DEFAULT '0' COMMENT '跟注次數',
  `check_raise` smallint(6) NOT NULL DEFAULT '0' COMMENT '過牌加注次數',
  `squeeze` smallint(6) NOT NULL DEFAULT '0' COMMENT '擠壓次數',
  `win` int(11) NOT NULL DEFAULT '0' COMMENT '盈利',
  `take_in` int(11) NOT NULL DEFAULT '0' COMMENT '總帶入',
  `now_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '寫入時間',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='玩家在俱樂部的game紀錄';

-- --------------------------------------------------------

--
-- 資料表結構 `player_club_session`
--

DROP TABLE IF EXISTS `player_club_session`;
CREATE TABLE IF NOT EXISTS `player_club_session` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'round 流水號',
  `session` bigint(20) NOT NULL COMMENT 'session流水號',
  `round` tinyint(4) NOT NULL COMMENT 'round 圈 (mapping_round_status.id)',
  `hands_amount` decimal(20,3) NOT NULL COMMENT '玩家手上原有的籌碼(不扣當下下注額)',
  `seat` tinyint(4) NOT NULL COMMENT '座位',
  `privacy_card` varchar(30) COLLATE utf8_unicode_ci NOT NULL COMMENT '私牌',
  `sec` tinyint(4) NOT NULL COMMENT '玩家實際思考秒數',
  `action` tinyint(4) NOT NULL COMMENT '動作 (mapping_game_action.id)',
  `bet` int(11) NOT NULL COMMENT '下注金額',
  `pot` int(11) NOT NULL COMMENT '池底當下金額',
  `insurance_bet` int(11) NOT NULL COMMENT '玩家購買保險金額',
  `now_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '寫入時間',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='玩家在俱樂部的session紀錄';

-- --------------------------------------------------------

--
-- 資料表結構 `rule_nlh_mtt`
--

DROP TABLE IF EXISTS `rule_nlh_mtt`;
CREATE TABLE IF NOT EXISTS `rule_nlh_mtt` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '流水號 (規則代號)',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='NLH MTT規則';

-- --------------------------------------------------------

--
-- 資料表結構 `rule_nlh_normal`
--

DROP TABLE IF EXISTS `rule_nlh_normal`;
CREATE TABLE IF NOT EXISTS `rule_nlh_normal` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '流水號(規則代號)',
  `club` int(10) UNSIGNED NOT NULL COMMENT '俱樂部ID',
  `owner` int(10) UNSIGNED NOT NULL COMMENT '開桌玩家',
  `seat` tinyint(4) UNSIGNED NOT NULL DEFAULT '2' COMMENT '人數',
  `sec` tinyint(4) UNSIGNED NOT NULL DEFAULT '15' COMMENT '行動時間',
  `sb` int(10) UNSIGNED NOT NULL DEFAULT '1' COMMENT '小盲',
  `bb` int(10) UNSIGNED NOT NULL DEFAULT '2' COMMENT '大盲',
  `min_bet` int(10) UNSIGNED NOT NULL DEFAULT '40' COMMENT '最低攜入籌碼',
  `max_bet` int(10) UNSIGNED NOT NULL DEFAULT '1000' COMMENT '最高攜入籌碼',
  `ante` int(11) DEFAULT '0' COMMENT '前注',
  `auto_start` tinyint(1) DEFAULT '1' COMMENT '自動開始',
  `start_people` tinyint(4) UNSIGNED DEFAULT '2' COMMENT '自動開始人數',
  `straddle` tinyint(1) DEFAULT '0' COMMENT '搶大盲',
  `multdeal` tinyint(1) DEFAULT '0' COMMENT '多牌',
  `insurance` tinyint(1) DEFAULT '0' COMMENT '保險',
  `rake` decimal(10,2) DEFAULT '0.01' COMMENT '服務費',
  `top_rake` float DEFAULT '0.5' COMMENT '封頂',
  `buyin` tinyint(1) DEFAULT '0' COMMENT '授權買入',
  `gps` tinyint(1) DEFAULT '0' COMMENT 'GPS限制',
  `ip` tinyint(1) DEFAULT '0' COMMENT 'IP限制',
  `game_time` decimal(10,1) DEFAULT '0.5' COMMENT '總時長',
  `now_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '寫入時間',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='NLH 常規桌規則';

-- --------------------------------------------------------

--
-- 資料表結構 `rule_nlh_sng`
--

DROP TABLE IF EXISTS `rule_nlh_sng`;
CREATE TABLE IF NOT EXISTS `rule_nlh_sng` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '流水號 (規則代號)',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='NLH SNG規則';

-- --------------------------------------------------------

--
-- 資料表結構 `summary_club_game`
--

DROP TABLE IF EXISTS `summary_club_game`;
CREATE TABLE IF NOT EXISTS `summary_club_game` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'game流水號',
  `club` int(11) NOT NULL COMMENT '俱樂部流水號',
  `game_mode` tinyint(4) NOT NULL COMMENT '牌桌類型代碼 (mapping_table_type.id)',
  `rule` int(11) UNSIGNED NOT NULL COMMENT '規則流水號',
  `start_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '開桌時間',
  `close_time` datetime DEFAULT NULL COMMENT '關桌時間',
  `hour` decimal(5,1) NOT NULL COMMENT '賭桌耗時(小時)',
  `owner` int(11) NOT NULL COMMENT '開桌玩家',
  `name` varchar(50) COLLATE utf8_unicode_ci NOT NULL COMMENT '牌桌名稱',
  `session` int(11) DEFAULT '0' COMMENT '總手數',
  `fish` int(11) DEFAULT NULL COMMENT '肥魚ID',
  `winner` int(11) DEFAULT NULL COMMENT '冠軍ID',
  `rich_man` int(11) DEFAULT NULL COMMENT '豪客ID',
  `take_in` int(11) DEFAULT NULL COMMENT '總帶入',
  `pot` int(11) DEFAULT '0' COMMENT '底池的總金額',
  `proxy_pot` int(11) DEFAULT '0' COMMENT '代理抽水金額',
  `main_pot` int(11) DEFAULT '0' COMMENT '總代抽水金額',
  `insurance_bet` int(11) DEFAULT '0' COMMENT '保險金額',
  `jackpot_bet` int(11) DEFAULT '0' COMMENT '大獎池金額',
  `people` tinyint(4) NOT NULL COMMENT '開局人數(幾人桌)',
  `sb` int(11) NOT NULL COMMENT '小盲',
  `bb` int(11) NOT NULL COMMENT '大盲',
  `insurance` tinyint(1) NOT NULL DEFAULT '0' COMMENT '保險是否開啟',
  `multdeal` tinyint(1) NOT NULL DEFAULT '0' COMMENT '多牌是否開啟',
  `jackpot` tinyint(1) DEFAULT '0' COMMENT '大獎池是否開啟',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '狀態(1:開啟 0:關閉)',
  `close` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否正常關閉(0: 代表非正常, 1:代表有被修改過是正常的)',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='俱樂部 game總結紀錄';

-- --------------------------------------------------------

--
-- 資料表結構 `summary_club_session`
--

DROP TABLE IF EXISTS `summary_club_session`;
CREATE TABLE IF NOT EXISTS `summary_club_session` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'session流水號',
  `game` bigint(20) NOT NULL COMMENT 'game流水號(summary_club_game.id)',
  `start_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '開始時間',
  `end_time` datetime DEFAULT NULL COMMENT '結束時間',
  `hour` decimal(10,1) DEFAULT NULL COMMENT '牌局耗時',
  `pot` int(11) DEFAULT NULL COMMENT '底池的總金額',
  `dealer` tinyint(4) DEFAULT NULL COMMENT '莊家位置',
  `winner` int(11) DEFAULT NULL COMMENT '贏家',
  `public_card` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '公牌',
  `insurance_bet` int(11) DEFAULT NULL COMMENT '保險金額',
  PRIMARY KEY (`id`),
  KEY `FK_summary_club_session_summary_club_game` (`game`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='俱樂部 session總結紀錄';

--
-- 已匯出資料表的限制(Constraint)
--

--
-- 資料表的 Constraints `mapping_table_type`
--
ALTER TABLE `mapping_table_type`
  ADD CONSTRAINT `FK_mapping_table_type_mapping_game_mode` FOREIGN KEY (`mode_id`) REFERENCES `mapping_game_mode` (`id`),
  ADD CONSTRAINT `FK_mapping_table_type_mapping_game_type` FOREIGN KEY (`game_id`) REFERENCES `mapping_game_type` (`id`),
  ADD CONSTRAINT `FK_mapping_table_type_mapping_table_belong` FOREIGN KEY (`table_id`) REFERENCES `mapping_table_belong` (`id`);

--
-- 資料表的 Constraints `summary_club_session`
--
ALTER TABLE `summary_club_session`
  ADD CONSTRAINT `FK_summary_club_session_summary_club_game` FOREIGN KEY (`game`) REFERENCES `summary_club_game` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
