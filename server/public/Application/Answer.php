<?php
class Answer{
    static $CODES = array(
        '400' => 'Bad Request',             // Указаны не все параметры
        '401' => 'Unauthorized',            // Неавторизованный запрос(неверный токен)
        '403' => 'Forbidden',               // Неверный логин или пароль
        '405' => 'Method Not Allowed',      // Метод не указан
        '411' => 'Length Required',         // Длинна превышет лимит
        '413' => 'Invalid login(nickname)', // Неверный формат логина 
        '501' => 'Not Implemented',         // Метод не реализован на сервере
        '503' => 'DB Unavailable',          // Не удалось подключится к базе данных
        '460' => 'Login Occupied',          // Логин занят
        '461' => 'User not Exist',          // Пользователя не существует
        '462' => 'Database request Error',  // Ошибка запроса к базе
        '432' => 'Invalid Message',         // Неправильные параметры сообщения
        '9000' => 'Unknown Error'           // Неизветсная ошибка
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