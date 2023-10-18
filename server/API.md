# Документ с методами API
---
## Как отправить запрос
    http://localhost/api/?(ключи и значения)
---  
## Значение ошибок по их коду
400:**Bad Request** - Указаны не все параметры

*401*:**Unauthorized** - Неавторизованый запрос(неверный токен)

*403*:**Forbidden** - Неверный логин и пароль

*405*:**Method Not Allowed** - Метод не указан

*413*:**Invalid login** - Неверный формат логина

*501*:**Not Implemented** - Метод не реализован на сервере
        
*503*:**DB Unavailable** - Не удалось подключится к базе данных

*460*:**Login Occupied** - Логин занят

*461*:**User not Exist** - Пользователя не существует
        
*9000*:**Unknown Error** - Неизветсная ошибка


---
## Метод регистрации
* **Ключи:** login (имя пользователя, максимальная длина которого составляет от **6** до **15** символов, состоящее из латиницы и кирилицы и спецсимволов "_-"), hash (хешированый логин с паролем), method (метод)
* **Значения ключей:**  login=vasya(пример), hash=sha256(login+password) , method=registration
* **Пример запроса:** http://localhost/api/?login=vasya&hash=b4db9409712fb0a747b2bd8731bf3db7f1926d2136ab87933eb357668010d7b1&method=registration
* **Возвращаемое значение в случае успеха:** {'result':'ok'(string),
                'data':{'login':login(string), 'token':token(string)}}
* **Возвращаемое значение в случае неудачи:** {'result':'error',
                'error':{'code':9000, 'text':'Unknown Error'}}
---
## Метод логина
* **Ключи:** login (имя пользователя), hash (хешированый логин с паролем), method (метод) rnd(рандомное число)
* **Значения ключей:**  login=vasya(пример), hash=sha256(sha256(login+password)+rnd), rnd=324(пример), method=login
* **Пример запроса:** http://localhost/api/?login=vasya&hash=e3534ea190311a3c9d23b1475ba455de0e513b184781ef05ca2276c89d6ed163&method=login
* **Возвращаемое значение в случае успеха:** {'result':'ok'(string),
                'data':{'login':login(string), 'token':token(string)]}
* **Возвращаемое значение в случае неудачи:** {'result':'error',
                'error':{'code':'9000', 'text':'Unknown Error'}}
---
## Метод выхода
* **Ключи:** login (имя пользователя), token (Уникальная хешированая строка), method (метод)
* **Значения ключей:**  login=vasya(пример), token=sha256(uuid4) , method=logout
* **Пример запроса:** http://localhost/api/?login=vasya&token=98c4cd79e47f81683a7f3a1de5bf71d11a950ecb1a905a91e0cd2b8a3a89b867&method=logout
* **Возвращаемое значение в случае успеха:** {'result':'ok',
                'data': true(bool)}
* **Возвращаемое значение в случае неудачи:** {'result':'error',
                'error':{'code':'9000'(number), 'text':'Unknown Error'}}
---
## Метод потверждения токена
* **Ключи:** login (имя пользователя), token (Уникальная хешированая строка), method (метод)
* **Значения ключей:**  login=vasya(пример), token=sha256(uuid4) , method=tokenVerification
* **Пример запроса:** http://localhost/api/?login=vasya&token=98c4cd79e47f81683a7f3a1de5bf71d11a950ecb1a905a91e0cd2b8a3a89b867&method=tokenVerification
* **Возвращаемое значение в случае успеха:** {'result':'ok',
                'data': true(bool)}
* **Возвращаемое значение в случае неудачи:** {'result':'error',
                'error':{'code':'9000', 'text':'Unknown Error'}}
---
## Метод получения информации о пользователе
* **Ключи:** login (имя пользователя),  token (Уникальная хешированая строка), method (метод)
* **Значения ключей:**  login=vasya(пример), token=sha256(uuid4), method=getAllInfo
* **Пример запроса:** http://localhost/api/?login=vasya&token=b4db9409712fb0a747b2bd8731bf3db7f1926d2136ab87933eb357668010d7b1&method=getAllInfo
* **Возвращаемое значение в случае успеха:** {'result':'ok',
                'data':{'gameCount':gameCount(number), 'scoreCount':scoreCount(number)}}
* **Возвращаемое значение в случае неудачи:** {'result':'error',
                'error':{code':'9000', 'text':'Unknown Error'}}
---
## Метод обновления пароля
* **Ключи:** login (имя пользователя), hash (хешированый логин с  новым паролем), token (Уникальная хешированая строка), method (метод)
* **Значения ключей:**  login=vasya(пример), token=sha256(uuid4), hash = sha256(login+newPassword), method=updatePassword
* **Пример запроса:** http://localhost/api/?login=vasya&hash=72d3d1f02fb92cdd0a5c82eb333188977bcb64c64a5812e799f7dd0c9171665d&token=98c4cd79e47f81683a7f3a1de5bf71d11a950ecb1a905a91e0cd2b8a3a89b867&method=updatePassword
* **Возвращаемое значение в случае успеха:** {'result':'ok',
                'data': true(bool)}
* **Возвращаемое значение в случае неудачи:** {'result':'error',
                'error':{'code':'code':9000, 'text':'Unknown Error'}}