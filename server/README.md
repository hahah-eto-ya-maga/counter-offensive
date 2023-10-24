# Информациея о PHP сервере (API)
## Оглавление
+ [Docker Desktop](#docker-desktop)
+ [Запуск](#start)
+ [Подключение через браузер](#browser-connection)
+ [Разработка](#dev)
+ [Дополинтельные действия с контейнером](#other-moves)
	+ [Перезапуск](#restart)
	+ [Остановка](#stop)
<a name="docker-desktop"></a>
## Docker Desktop
Контейнер называется **api** (*counteroffensive-api*)

<a name="browser-connection"></a>
## Подключение через браузер
+ <a href="http://localhost/api/" target="_blank">http://localhost/api/</a>(Подключение через Nginx)
+ <a href="http://localhost:8080/" target="_blank">http://localhost:8080/</a>(Подключение напрямую)
Пример в браузере
![Пример подключения к API через браузер](../documents/docker/server/browser-api-connect-example.jpg)

<a name="dev"></a>
## Разработка
+ Вся разработка ведётся в папке **server**. Это общая папка с контейнером. 
+ Запускаемые скрипты находятся в папке **server/public/**
+ Модели данный из БД находятся в папке **server/models/**
+ Файл с переменными окружения и другими конфигурационными данными находится в папке **server/config/**
+ Все библиотеки находятся в папке **server/libs/**. Внутренние библиотеки находятся в папке **server/libs/inside/**. Внешние библиотеки находятся в папке **server/libs/outside/**

<a name="other-moves"></a>
## Дополнительные действия с контейнером

<a name="restart"></a>
+ Перезапуск
Через терминал
```bash
docker compose restart api
```
![Пример перезапуска контейнера через терминал](../documents/docker/server/cmd-container-restart-example.jpg)
Через Docker Desktop (Выделенная кнопка)
![Пример перезапуска контейнера через Docker Desktop](../documents/docker/server/docker-desktop-restart-container-example.jpg)

<a name="stop"></a>
+ Остановка
Через терминал
```bash
docker compose stop api
```
![Пример остановки контейнера через терминал](../documents/docker/server/cmd-container-stop-example.jpg)
Через Docker Desktop (Выделенная кнопка)
![Пример остановки контейнера через Docker Desktop](../documents/docker/server/docker-desktop-stop-container-example.jpg)
