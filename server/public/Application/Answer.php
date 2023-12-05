<?php
class Answer{
    static $CODES = array(
        '400' => 'Bad Request',                     // Указаны не все параметры
        '401' => 'Unauthorized',                    // Неавторизованный запрос(неверный токен)
        '403' => 'Forbidden',                       // Неверный логин или пароль
        '405' => 'Method Not Allowed',              // Метод не указан
        '411' => 'Length Required',                 // Длина превышает лимит
        '413' => 'Invalid login(nickname)',         // Неверный формат логина 
        '501' => 'Not Implemented',                 // Метод не реализован на сервере
        '503' => 'DB Unavailable',                  // Не удалось подключиться к базе данных
        '460' => 'Login Occupied',                  // Логин занят
        '461' => 'User not Exist',                  // Пользователя не существует
        '462' => 'Database request Error',          // Ошибка запроса к базе
        '432' => 'Invalid Message',                 // Неправильные параметры сообщения  
        '234' => 'Insufficient level',              // Недостаточный уровень 
        '235' => 'Level less current gamer',        // Уровень меньше текущего игрока
        '236' => 'You taken this role',             // Данный игрок уже занял эту роль 
        '237' => 'Role taken',                      // Роль уже занята
        '238' => 'Place already occupied',          // Это место уже занято 
        '239' => 'Incorrect tank number',           // Неверный номер танка 
        '240' => 'Tank number have another type',   // Номер танка принадлежит другому типу
        '463' => 'Role not implemented',            // Роль не реализована  
        '9000' => 'Unknown Error'                   // Неизвестная ошибка
    );


    static function response($result = null) {
        if ($result) {
            if (is_array($result) && isset($result[0]) && !$result[0]) {
                $code = $result[1];
                return array(
                    'result' => 'error',
                    'error' => array(
                        'code' => $code,
                        'text' => self::$CODES[$code]
                    )
                );
            }
            return array(
                'result' => 'ok',
                'data' => $result
            );
        }
        $code = 9000;
        return array(
            'result' => 'error',
            'error' => array(
                'code' => $code,
                'text' => self::$CODES[$code]
            )
        );
    }
}
