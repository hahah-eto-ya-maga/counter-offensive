# Игра Контрнаступ (ContrNastup)
Браузерный 2д шутер про танки.

## Оглавление
+ [Требуемые программы](#required-programs)
+ [Запуск проекта](#start)
+ [Сборка](#build)
+ [Запуск собранного проекта](#up)
+ [Перезапуск](#restart)
+ [Остановка](#stop)
+ [Лог](#log)
+ [Контейнеры](#containers)
+ [Внутренние ссылки](#inside-links)

<a name="required-programs"></a>
## Требуемые программы
* [Docker](https://docs.docker.com/desktop/install/windows-install/) и дополнение Docker Compose (на Windows идёт из коробки)
* [NodeJS](https://nodejs.org/en/download)

<a name="start"></a>
## Запуск проекта
Все команды нужно запускать в терминале в корневой папке проекта и при запущенном Docker Desktop

<a name="build"></a>
## Сборка (Терминал из корневой папки)
* Сборка клиента
```bash
cd client
npm install
npm run build
cd ..
```
* Сборка проекта в Docker
```bash
docker compose build
```
![Пример сборки проекта](documents/images/readme/cmd-build-example.jpg)


<a name="up"></a>
## Запуск собранного проекта
+ Терминал
```bash
docker compose up -d
```
![Пример запуска проекта](documents/images/readme/cmd-up-example.jpg)
+ Docker Desktop
![Пример запуска проекта в главном меню Docker Desktop](documents/images/readme/docker-desktop-up-example.jpg)

<a name="restart"></a>
## Перезапуск проекта
+ Терминал
```bash
docker compose restart
```
![Пример перезапуска проекта](documents/images/readme/cmd-restart-example.jpg)
+ Docker Desktop
![Пример перезапуска проекта в главном меню Docker Desktop](documents/images/readme/docker-desktop-restart-example.jpg)

<a name="stop"></a>
## Остановка запущенного проекта
+ Терминал
```bash
docker compose stop
```
![Пример остановки проекта](documents/images/readme/cmd-stop-example.jpg)
+ Docker Desktop
![Пример остановки проекта в главном меню Docker Desktop](documents/images/readme/docker-desktop-stop-example.jpg)

<a name="log"></a>
## Лог
+ Терминал (вывод последних 20 строчек)
```bash
docker compose logs --tail 20 -f
```
![Пример вывода лога в терминал](documents/images/readme/cmd-log-example.jpg)
+ Docker Desktop
![Пример вывода лога в Docker Desktop](documents/images/readme/docker-desktop-log-example.jpg)

<a name="containers"></a>
## Контейнеры
Проект содержит 5 конейтеров:
1. database - База данных - MySQL ([DB.md](./documents/DB.md))
2. api - PHP server ([SERVER.md](./documents/SERVER.md), [API.md](./server/API.md))
3. phpmyadmin - PMA - Клиент для работы с БД ([PMA.md](./documents/PMA.md))
4. web_server - Nginx ([WEBSERVER.md](./documents/WEBSERVER.md))

<a name="inside-links"></a>
## Полезные ссылки внутри проекта:
1. Концепт проекта ([CONCEPT.md](./documents/CONCEPT.md))
2. Техническое задание ([TZ.md](./documents/TZ.md))
3. Чек-лист ([CHECK-LIST.md](./documents/CHECK-LIST.md))