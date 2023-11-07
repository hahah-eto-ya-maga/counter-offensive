# База данных
## Оглавление
+ [Docker Desktop](#docker-desktop)
+ [Подключение через браузер](#browser-connection)
+ [Подключение через сторонние приложения](#other-connection)
+ [Таблицы](#tables)
    + [game](#table-game)
    + [users](#table-users)
    + [gamers](#table-gamers)
    + [persons](#table-persons)
    + [ranks](#table-ranks)
    + [games](#table-games)
    + [log](#table-log)
+ [Разработка](#dev)

<a name="docker-desktop"></a>
## Docker Desktop
Контейнер называется database (*counteroffensive-database*)

<a name="browser-connection"></a>
## Подключение через браузер
<a href="http://localhost:8081/" target="_blank">http://localhost:8081/</a>(Подключение через PMA)
![Пример подключения через PMA](images/pma/browser-view-example.jpg)

<a name="other-connection"></a>
## Подключение через сторонние приложения
|             |                                        |
| ----------- | -------------------------------------- |
| Логин       | *admin*                                |
| Пароль      | *b446b342-608c-11ee-8c99-0242ac120002* |
| Хост        | *localhost*                            |
| Порт        | *3306*                                 |
| База данных | *contrnasup*                           |

<a name="tables"></a>
## Таблицы

<table>
    <tr><td colspan=3 align="center">users (Список пользователей)</td></tr>
    <tr><td>Колонка</td><td>Тип данных</td><td>Описание</td></tr>
    <tr><td>Вопрос</td><td>Ответ</td><td>Задание</td></tr>
</table>


<a name="dev"></a>
## Разработка
+ Все данные хранятся в папке db
+ Папка db создаётся автоматически при запуске контейнера
+ Чтобы очистить БД нужно остановить контейнер, удалить папку db и запустить контейнер
+ К БД может подключиться только API (PMA не учитывается т.к. это менеджер БД)