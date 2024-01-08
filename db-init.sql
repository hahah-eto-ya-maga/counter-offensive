CREATE TABLE IF NOT EXISTS `game` (
  `id` MEDIUMINT NOT NULL AUTO_INCREMENT,
  `hashUnits` VARCHAR(100) NOT NULL DEFAULT '',
  `hashScene` VARCHAR(100) NOT NULL DEFAULT '',
  `chatHash` VARCHAR(100) NOT NULL DEFAULT '',
  `hashBullets` VARCHAR(100) NOT NULL DEFAULT '',
  `hashLobby` VARCHAR(100) NOT NULL DEFAULT '',
  `hashGamers` VARCHAR(100) NOT NULL DEFAULT '',
  `hashMobs` VARCHAR(100) NOT NULL DEFAULT '',
  `hashMap` VARCHAR(100) NOT NULL DEFAULT '',
  `hashBodies` VARCHAR(100) NOT NULL DEFAULT '',
  `hashTanks` VARCHAR(100) NOT NULL DEFAULT '',
  `timestamp` BIGINT NOT NULL DEFAULT 0,
  `timeout` INT NOT NULL DEFAULT 100,
  `pBanner_timestamp` BIGINT NOT NULL DEFAULT 0,
  `mBanner_timestamp` BIGINT NOT NULL DEFAULT 0,
  `banner_timeout` INT NOT NULL DEFAULT 5000,
  `mobBase_x` FLOAT NULL DEFAULT NULL,
  `mobBase_y` FLOAT NULL DEFAULT NULL,
  `playersBase_x` FLOAT NULL DEFAULT NULL,
  `playersBase_y` FLOAT NULL DEFAULT NULL,
  `base_radius` FLOAT NULL DEFAULT 20,
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `users` ( 
  `id` MEDIUMINT NOT NULL AUTO_INCREMENT, 
  `login` VARCHAR(20) NOT NULL DEFAULT '',
  `nickname` VARCHAR(20) NOT NULL DEFAULT '', 
  `password` VARCHAR(100) NOT NULL DEFAULT '', 
  `token` VARCHAR(100) NOT NULL DEFAULT '', 
  `tokenLastUse` DATETIME NOT NULL DEFAULT '2000-10-01 00:00:00',
  `timeCreate` DATETIME NOT NULL DEFAULT '2000-10-01 00:00:00', 
  `photo` VARCHAR(100) NOT NULL DEFAULT 'default.jpg',
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `gamers` (
  `id` MEDIUMINT NOT NULL AUTO_INCREMENT,
  `user_id` MEDIUMINT NOT NULL DEFAULT -1,
  `person_id` MEDIUMINT NOT NULL DEFAULT -1,
  `experience` INT NOT NULL DEFAULT 0,
  `hp` INT NOT NULL DEFAULT 0,
  `money` INT NOT NULL DEFAULT 0,
  `x` FLOAT NULL DEFAULT NULL,
  `y` FLOAT NULL DEFAULT NULL,
  `angle` FLOAT NULL DEFAULT 0,
  `status` VARCHAR(32) NOT NULL DEFAULT '',
  `reload_timestamp` BIGINT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `mobs` (
  `id` MEDIUMINT NOT NULL AUTO_INCREMENT,
  `person_id` MEDIUMINT NOT NULL DEFAULT -1,
  `hp` INT NOT NULL DEFAULT 0,
  `x` FLOAT NULL DEFAULT NULL,
  `y` FLOAT NULL DEFAULT NULL,
  `angle` FLOAT NULL DEFAULT NULL,
  `path` JSON,
  `path_update` BIGINT NOT NULL DEFAULT 0,
  `reload_timestamp` BIGINT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `persons` (
  `id` MEDIUMINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL DEFAULT 'Пехотинец',
  `hp` INT NOT NULL DEFAULT 0,
  `image` VARCHAR(100) NOT NULL DEFAULT 'standartPerson.jpg',
  `reloadSpeed` FLOAT NOT NULL DEFAULT 1,
  `movementSpeed` FLOAT NOT NULL DEFAULT 1,
  `rotateSpeed` FLOAT NOT NULL DEFAULT 1,
  `level` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `kills` (
  `id` MEDIUMINT NOT NULL AUTO_INCREMENT,
  `person_id` MEDIUMINT NOT NULL DEFAULT -1,
  `x` FLOAT NOT NULL,
  `y` FLOAT NOT NULL,
  `angle` FLOAT NOT NULL DEFAULT 0,
  `killTime` DATETIME NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `ranks` (
  `id` MEDIUMINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL DEFAULT 'Медный ранг',
  `experience` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `games` ( 
  `id` MEDIUMINT NOT NULL AUTO_INCREMENT,
  `startTime` DATETIME NOT NULL DEFAULT '2000-10-01 00:00:00', 
  `endTime` DATETIME NOT NULL DEFAULT '2000-10-01 00:00:00', 
  `status` VARCHAR(10) NOT NULL DEFAULT 'end',
  `winner` VARCHAR(10) NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `messages` (
  `id` MEDIUMINT NOT NULL AUTO_INCREMENT, 
  `userId` MEDIUMINT NOT NULL DEFAULT -1,
  `text` VARCHAR(200) NOT NULL DEFAULT '',
  `sendTime` DATETIME NOT NULL DEFAULT '2000-10-01 00:00:00',
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `tank_lobby` (
  `id` MEDIUMINT NOT NULL AUTO_INCREMENT, 
  `person_id` MEDIUMINT NOT NULL DEFAULT -1,
  `user_id` MEDIUMINT NOT NULL DEFAULT -1,
  `tank_id` INT NOT NULL DEFAULT -1,
  PRIMARY KEY (`id`)
); 

CREATE TABLE IF NOT EXISTS`bullets` (
  `id` BIGINT NOT NULL AUTO_INCREMENT, 
  `user_id` MEDIUMINT NOT NULL DEFAULT -1,
  `type` TINYINT NOT NULL Default 1,
  `x1` FLOAT NOT NULL DEFAULT 0,
  `y1` FLOAT NOT NULL DEFAULT 0,
  `x2` FLOAT NOT NULL DEFAULT 0,
  `y2` FLOAT NOT NULL DEFAULT 0,
  `dx` FLOAT NOT NULL DEFAULT 0,
  `dy` FLOAT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
); 

CREATE TABLE IF NOT EXISTS `tanks` (
  `id` MEDIUMINT NOT NULL AUTO_INCREMENT,
  `type` MEDIUMINT NOT NULL DEFAULT 1,
  `driver_id` MEDIUMINT NOT NULL DEFAULT -1,
  `gunner_id` MEDIUMINT NOT NULL DEFAULT -1,
  `commander_id` MEDIUMINT NOT NULL DEFAULT -1,
  `hp` INT NOT NULL DEFAULT 100,
  `x` FLOAT NULL DEFAULT NULL,
  `y` FLOAT NULL DEFAULT NULL,
  `angle` FLOAT NOT NULL DEFAULT 0,
  `speed` FLOAT NOT NULL DEFAULT 0,
  `tower_angle` FLOAT NOT NULL DEFAULT 0,
  `commander_angle` FLOAT NOT NULL DEFAULT 0,
  `reload_timestamp` BIGINT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `bodies` (
  `id` MEDIUMINT NOT NULL AUTO_INCREMENT,
  `x` FLOAT NULL DEFAULT NULL,
  `y` FLOAT NULL DEFAULT NULL,
  `angle` FLOAT NULL DEFAULT NULL,
  `type` MEDIUMINT NOT NULL DEFAULT -1, 
  `isMob` BOOLEAN NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `objects` (
  `id` MEDIUMINT NOT NULL AUTO_INCREMENT,
  `type` MEDIUMINT NOT NULL DEFAULT -1,
  `hp` INT NOT NULL DEFAULT 1000,
  `x` FLOAT NULL DEFAULT NULL,
  `y` FLOAT NULL DEFAULT NULL,
  `sizeX` TINYINT NOT NULL DEFAULT 0,
  `sizeY` TINYINT NOT NULL DEFAULT 0,
  `status` CHAR(1) NOT NULL DEFAULT 'a',
  PRIMARY KEY (`id`)
);

/* Создание юзеров для тестирования*/
-- У каждого пользователя пароль 12345678

INSERT INTO `users` (`login`, `nickname`, `password`) VALUES 
('testuse', 'testuser', 'f836c534387323b096f080676dfe75f8d486bb02aa76393f8fa12b6191b5434e'),
('testpuppy1', 'testuser', 'f1e4b081ffe08f6d8f9403ed1bc6b83ea6d027d8a9d6f73b5d1175bed693d385'),
('testpuppy2', 'testuser', '344af117117405ed0833acbd224d259b02da239ef686f32a5394f652f9dbfe9f'),
('testsergeant1', 'testuser', 'c47ecdbe986e2e7a3a7400b382ee8c7d8c8d283b3c38294eb9836e2145882508'),
('testsergeant2', 'testuser', '57d4716b29517cdef63b773faac14ee2ebd08b3f2f79b78412ce818ad438b62a'),
('testofficer1', 'testuser', '3defc6de1987c02e2456c44f25f5e3f9adf8f4155458562642a930a04d271883'),
('testofficer2', 'testuser', '6cc57c932bde7360e32109400438f8f6be28b5a908d6e6a1156b170859c69cdf'),
('testgeneral1', 'testuser', 'aac5a55cac1167803fb0437337f5236cc590c08b939add1f0eb753b5ac2a4547'),
('testgeneral2', 'testuser', 'f13da73dfccd34814fc79bdfd6d7d4d75b6369c1802ff89a3e522897c9d575c5');

INSERT INTO `gamers` (`user_id`, `experience`, `reload_timestamp`) VALUES
(1, 0, ROUND(UNIX_TIMESTAMP(CURTIME(4)) * 1000)), 
(2, 0, ROUND(UNIX_TIMESTAMP(CURTIME(4)) * 1000)), 
(3, 0, ROUND(UNIX_TIMESTAMP(CURTIME(4)) * 1000)), 
(4, 720, ROUND(UNIX_TIMESTAMP(CURTIME(4)) * 1000)), 
(5, 720, ROUND(UNIX_TIMESTAMP(CURTIME(4)) * 1000)), 
(6, 5088, ROUND(UNIX_TIMESTAMP(CURTIME(4)) * 1000)), 
(7, 5088, ROUND(UNIX_TIMESTAMP(CURTIME(4)) * 1000)), 
(8, 9600, ROUND(UNIX_TIMESTAMP(CURTIME(4)) * 1000)), 
(9, 17948, ROUND(UNIX_TIMESTAMP(CURTIME(4)) * 1000));

/* Значения по умолчанию в таблице game*/

INSERT INTO `game` (`hashUnits`, `hashScene`, `chatHash`, `hashBullets`, `hashLobby`, `hashGamers`, `hashMobs`, `hashMap`, `hashBodies`, `timestamp`, `mobBase_x`, `mobBase_y`, `playersBase_x`, `playersBase_y`) 
VALUES ('1', '1', '1', '1', '1', '1', '1', '1', '1', ROUND(UNIX_TIMESTAMP(CURTIME(4)) * 1000), '30', '30', '3', '3');

/* Добавление уровней в таблицу ranks */
INSERT INTO `ranks` (`name`, `experience`) VALUES 
('Private', 0),
('Private', 144),
('Private', 288),
('Private', 480),
('Sergeant', 720),
('Sergeant', 1056),
('Sergeant', 1488),
('Sergeant', 2016),
('Sergeant', 2640),
('Sergeant', 3360),
('Sergeant', 4176),
('Officer', 5088),
('Officer', 6072),
('Officer', 7128),
('Officer', 8256),
('General', 9600),
('General', 11040),
('General', 12576),
('General', 14156),
('General', 17948);

/* Добавление ролей в таблицу persons*/
INSERT INTO `persons` (`name`, `hp`, `reloadSpeed`, `movementSpeed`, `rotateSpeed`, `level`) VALUES
('general', 100, 1, 1, 1, 16),
('bannerman', 100, 1, 1, 1, 1),
('heavyTankGunner', 1000, 1, 1, 1, 5),
('heavyTankMeh', 1000, 1, 1, 1, 5),
('heavyTankCommander', 1000, 1, 1, 1, 12),
('middleTankMeh', 1000, 1, 1, 1, 5),
('middleTankGunner', 1000, 1, 1, 1, 5),
('infantry', 100, 18, 0.2, 1, 1),
('infantryRPG', 100, 15, 0.2, 1, 1);

INSERT INTO `objects` (`type`, `hp`, `x`, `y`, `sizeX`, `sizeY`) VALUES
(1, 100, 1, 1, 1, 1),
(1, 100, 5, 6, 1, 1),
(1, 100, 9, 30, 1, 1),
(1, 100, 2, 15, 1, 1),
(1, 100, 10, 20, 1, 1),
(1, 100, 23, 4, 1, 1),
(1, 100, 3, 24, 1, 1),
(1, 100, 4, 17, 1, 1),
(1, 100, 15, 27, 1, 1);

