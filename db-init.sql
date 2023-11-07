CREATE TABLE IF NOT EXISTS `game` ( 
-- Таблица игр
  `id` MEDIUMINT NOT NULL AUTO_INCREMENT, 
  -- Номер игры. В пустой базе первая игра будет равена 1, а все последующие больше на единицу
  `users` VARCHAR(100) NOT NULL DEFAULT "[]", 
  -- Список пользователей, которые сейчас играют в данную игру
  `usersCount` INT NOT NULL DEFAULT 0, 
  -- Количетсво игроков в данный момент
  `startTime` DATETIME NOT NULL DEFAULT "2000-10-01 00:00:00", 
  -- Время начала игры
  `endTime` DATETIME NOT NULL DEFAULT "2000-10-01 00:00:00", 
  -- Время окончания игры
  `status` VARCHAR(20) NOT NULL DEFAULT "closed", 
  -- Статус игры. Оконченная (finished), сбор игроков (finding), активная (active)
  `info` TEXT,
  -- Внутренняя информация об игре. К примеру местоположение игроков на карте, оружие игрока, инвентарь...
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `log` ( 
-- Таблица всех запросов к АПИ
  `id` MEDIUMINT NOT NULL AUTO_INCREMENT, 
  -- Номер запроса. В пустой базе первый лог будет равен 1, а все последующие больше на единицу
  `date` DATETIME NOT NULL DEFAULT "2000-10-01 00:00:00", 
  -- Дата запроса
  `method` VARCHAR(20) NOT NULL DEFAULT "GET", 
  -- Метод запроса (GET, POST, PUT...)
  `params` TEXT, 
  -- Список переданных параметров
  `result` TEXT,
  -- Результат запроса
  `resultCode` INT,
  -- Код запроса (200, 404, ...)
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `users` ( 
-- Таблица пользователей
  `id` MEDIUMINT NOT NULL AUTO_INCREMENT, 
  -- Номер пользователей. В пустой базе первый пользователь будет равен 1, а все последующие больше на единицу
  `login` VARCHAR(20) NOT NULL DEFAULT "", 
  -- Логин пользователя. Длина от 4 до 20 символов
  `nickname` VARCHAR(20) NOT NULL DEFAULT "", 
  -- Никнейм пользователя. Длина от 4 до 20 символов
  `password` VARCHAR(100) NOT NULL DEFAULT "", 
  -- Пароль пользователя. Хранится в хешированном формате. Алгоритм шифрования sha256
  `token` VARCHAR(100) NOT NULL DEFAULT "", 
  -- Токен куки. Это строка, которая выдаётся пользователю после авторизации по паролю и хранится в куки браузера. Хранится в шифровании sha256
  `tokenLastUse` DATETIME NOT NULL DEFAULT "2000-10-01 00:00:00",
  -- Время последнего использования токена, чтобы пользователь авторизировался через некоторое время
  `timeCreate` DATETIME NOT NULL DEFAULT "2000-10-01 00:00:00", 
  -- Время создания аккаунта
  `photo` VARCHAR(100) NOT NULL DEFAULT "default.jpg",
  -- Путь к аватарке пользователя. Если пользователь не поставил аватарку, то будет отдан файл default.jpg
  PRIMARY KEY (`id`)
);