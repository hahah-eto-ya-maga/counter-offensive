<?php
    class User{

        protected $db;

        public function __construct($db){
            $this->db = $db;
        }


        // Функция регистрации. Возвращает токен и логин
        function registration($login, $hash, $token, $tokenLastUse, $timeCreate){
            // $hash = h(login.password); Хэш от пароля переходящий от клиента
            $query = "SELECT COUNT(*) FROM users WHERE login = ?;"; // Проверка существования пользователя с таким же логином
            $result = $this->db->execute_query($query, array($login));
            $arr = $result -> fetch_assoc();
            $checkLogin = $arr ? $arr['COUNT(*)'] : 1; // Запрос возвращает количество пользователей с таким же логином, как задал пользователь
            if($checkLogin > 0){
                return array(false, 460); //Такой аккаунт уже существует
            }

            $query = "INSERT INTO users (login, password, token, tokenLastUse, timeCreate) VALUES(?, ?, ?, ?, ?)"; // Запрос вставляет в базу данных полученные данные
            $this->db->execute_query($query, array($login, $hash, $token, $tokenLastUse, $timeCreate));

            return array('login'=>$login, 'token'=>$token);
        }
    
    }