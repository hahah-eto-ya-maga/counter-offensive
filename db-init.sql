CREATE TABLE IF NOT EXISTS `game` (
  `id` MEDIUMINT NOT NULL AUTO_INCREMENT,
  `hashUnits` VARCHAR(100) NOT NULL DEFAULT "",
  `hashScene` VARCHAR(100) NOT NULL DEFAULT "",
  `chatHash` VARCHAR(100) NOT NULL DEFAULT "",
  `hashBullets` VARCHAR(100) NOT NULL DEFAULT "",
  `hashLobby` VARCHAR(100) NOT NULL DEFAULT "",
  `hashGamers` VARCHAR(100) NOT NULL DEFAULT "",
  `hashMobs` VARCHAR(100) NOT NULL DEFAULT "",
  `hashMap` VARCHAR(100) NOT NULL DEFAULT "",
  `hashBodies` VARCHAR(100) NOT NULL DEFAULT "",
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `users` ( 
  `id` MEDIUMINT NOT NULL AUTO_INCREMENT, 
  `login` VARCHAR(20) NOT NULL DEFAULT "",
  `nickname` VARCHAR(20) NOT NULL DEFAULT "", 
  `password` VARCHAR(100) NOT NULL DEFAULT "", 
  `token` VARCHAR(100) NOT NULL DEFAULT "", 
  `tokenLastUse` DATETIME NOT NULL DEFAULT "2000-10-01 00:00:00",
  `timeCreate` DATETIME NOT NULL DEFAULT "2000-10-01 00:00:00", 
  `photo` VARCHAR(100) NOT NULL DEFAULT "default.jpg",
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
  `angle` FLOAT NULL DEFAULT NULL,
  `status` VARCHAR(32) NOT NULL DEFAULT "",
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `persons` (
  `id` MEDIUMINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL DEFAULT "Пехотинец",
  `hp` INT NOT NULL DEFAULT 0,
  `image` VARCHAR(100) NOT NULL DEFAULT "standartPerson.jpg",
  `reloadSpeed` FLOAT NOT NULL DEFAULT 1,
  `movementSpeed` FLOAT NOT NULL DEFAULT 1,
  `rotateSpeed` FLOAT NOT NULL DEFAULT 1,
  `level` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `ranks` (
  `id` MEDIUMINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL DEFAULT "Медный ранг",
  `experience` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `games` ( 
  `id` MEDIUMINT NOT NULL AUTO_INCREMENT, 
  `users` VARCHAR(100) NOT NULL DEFAULT "[]", 
  `usersCount` INT NOT NULL DEFAULT 0, 
  `startTime` DATETIME NOT NULL DEFAULT "2000-10-01 00:00:00", 
  `endTime` DATETIME NOT NULL DEFAULT "2000-10-01 00:00:00", 
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `messages` (
  `id` MEDIUMINT NOT NULL AUTO_INCREMENT, 
  `userId` MEDIUMINT NOT NULL DEFAULT -1,
  `text` VARCHAR(200) NOT NULL DEFAULT "",
  `sendTime` DATETIME NOT NULL DEFAULT "2000-10-01 00:00:00",
  PRIMARY KEY (`id`)
);

CREATE TABLE `tank_lobby` (
  `id` MEDIUMINT NOT NULL AUTO_INCREMENT, 
  `person_id` MEDIUMINT NOT NULL DEFAULT -1,
  `user_id` MEDIUMINT NOT NULL DEFAULT -1,
  `tank_id` INT NOT NULL DEFAULT -1,
  PRIMARY KEY (`id`)
); 

/* Создание юзеров для тестирования*/

INSERT INTO users(login, nickname, password) VALUES 
('testuse', 'testuser', 'f836c534387323b096f080676dfe75f8d486bb02aa76393f8fa12b6191b5434e'),
('testpuppy1', 'testuser', 'f1e4b081ffe08f6d8f9403ed1bc6b83ea6d027d8a9d6f73b5d1175bed693d385'),
('testpuppy2', 'testuser', '344af117117405ed0833acbd224d259b02da239ef686f32a5394f652f9dbfe9f'),
('testsergeant1', 'testuser', 'c47ecdbe986e2e7a3a7400b382ee8c7d8c8d283b3c38294eb9836e2145882508'),
('testsergeant2', 'testuser', '57d4716b29517cdef63b773faac14ee2ebd08b3f2f79b78412ce818ad438b62a'),
('testofficer1', 'testuser', '3defc6de1987c02e2456c44f25f5e3f9adf8f4155458562642a930a04d271883'),
('testofficer2', 'testuser', '6cc57c932bde7360e32109400438f8f6be28b5a908d6e6a1156b170859c69cdf'),
('testgeneral1', 'testuser', 'aac5a55cac1167803fb0437337f5236cc590c08b939add1f0eb753b5ac2a4547'),
('testgeneral2', 'testuser', 'f13da73dfccd34814fc79bdfd6d7d4d75b6369c1802ff89a3e522897c9d575c5');

INSERT INTO gamers(user_id,experience) VALUES
(1, 0), (2, 0), (3, 0), (4, 720), (5, 720), (6, 5088), (7, 5088), (8, 9600), (9, 17948);

/* Значения по умолчанию в таблице game*/

INSERT INTO game(hashUnits, hashScene, chatHash, hashBullets, hashLobby) VALUES ("1", "1", "1", "1", "1");


/* Добавление уровней в таблицу ranks */
INSERT INTO ranks (id, name, experience) VALUES 
(1, "Private", 0),
(2, "Private", 144),
(3, "Private", 288),
(4, "Private", 480),
(5, "Sergeant", 720),
(6, "Sergeant", 1056),
(7, "Sergeant", 1488),
(8, "Sergeant", 2016),
(9, "Sergeant", 2640),
(10, "Sergeant", 3360),
(11, "Sergeant", 4176),
(12, "Officer", 5088),
(13, "Officer", 6072),
(14, "Officer", 7128),
(15, "Officer", 8256),
(16, "General", 9600),
(17, "General", 11040),
(18, "General", 12576),
(19, "General", 14156),
(20, "General", 17948);

/* Добавление ролей в таблицу persons*/
INSERT INTO `persons` (`id`, `name`, `hp`, `image`, `reloadSpeed`, `movementSpeed`, `rotateSpeed`, `level`) VALUES
(1, 'general', 100, 'standartPerson.jpg', 1, 1, 1, 16),
(2, 'bannerman', 100, 'standartPerson.jpg', 1, 1, 1, 1),
(3, 'heavyTankGunner', 100, 'standartPerson.jpg', 1, 1, 1, 5),
(4, 'heavyTankMeh', 1000, 'standartPerson.jpg', 1, 1, 1, 5),
(5, 'heavyTankCommander', 1000, 'standartPerson.jpg', 1, 1, 1, 12),
(6, 'middleTankMeh', 1000, 'standartPerson.jpg', 1, 1, 1, 5),
(7, 'middleTankGunner', 1000, 'standartPerson.jpg', 1, 1, 1, 5),
(8, 'infantry', 100, 'standartPerson.jpg', 1, 1, 1, 1),
(9, 'infantryRPG', 100, 'standartPerson.jpg', 1, 1, 1, 5);
