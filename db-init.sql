CREATE TABLE IF NOT EXISTS `game` (
  `id` MEDIUMINT NOT NULL AUTO_INCREMENT,
  `hashUnits` VARCHAR(100) NOT NULL DEFAULT "",
  `hashScene` VARCHAR(100) NOT NULL DEFAULT "",
  `chatHash` VARCHAR(100) NOT NULL DEFAULT "",
  `hashBullets` VARCHAR(100) NOT NULL DEFAULT "",
  `hashLobby` VARCHAR(100) NOT NULL DEFAULT "",
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

/* Создание юзеров для тестирования*/

INSERT INTO users(login, nickname, password)
VALUES ('puppy1', 'regresskil', '4562df1406be2e97bae613dd15c16fa9b76a221ab550a9be1aa7c517277cc2be');

INSERT INTO users(login, nickname, password)
VALUES ('sergeant1', 'regresskil', '7dd348ad7304089af7276ce90a5406084cdf9622ff9b6ca3c25bf4bd3eed7d05');

INSERT INTO users(login, nickname, password)
VALUES ('officer1', 'regresskil', '0a83eaf3b88b3fd111dd87132231898ed41f13a634df5ebe3d4e9a4165292761');

INSERT INTO users(login, nickname, password)
VALUES ('general1', 'regresskil', 'c27d011242c894a577ddc4b2431c35a815c6bb5d981c1b13e24ff7cbdc66d617');

INSERT INTO users(login, nickname, password)
VALUES ('general2', 'regresskil', '641ccaeb2bae9253a03c2737b88706ff433804b3bd897ca73fb8b13bbe11a91a');

INSERT INTO users(login, nickname, password)
VALUES ('testuse', 'regresskil', 'f836c534387323b096f080676dfe75f8d486bb02aa76393f8fa12b6191b5434e');

INSERT INTO users(login, nickname, password)
VALUES ('puppy2', 'regresskil', 'c4afddcb4b4624193e2132e958dda90921a6ffe5950e467ad413c6e73c562921');

INSERT INTO users(login, nickname, password)
VALUES ('sergeant2', 'regresskil', '14daf687442d9d6a81e57e87e466d592f786fcfdfef65ba20c743b469bba4a7b');

INSERT INTO users(login, nickname, password)
VALUES ('officer2', 'regresskil', '2fb5c5cdd96005d70fc7f565f77d841ec4460985b78881baf7480a4e80cea815');