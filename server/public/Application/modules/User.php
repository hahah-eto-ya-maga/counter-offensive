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
    

        // Функция входа в аккаунт. Возвращает токен и логин
        function login($login, $hash, $rnd, $token, $tokenLastUse){
            $query = "SELECT login FROM users WHERE login = ?;";
            $result = $this->db->execute_query($query, array($login)); // Выбирает логин по $login
            $arr = $result -> fetch_assoc();
            $checkLogin = $arr ? $arr['login'] : '';
            
            if($checkLogin != ''){// Проверка существования логина
                $query = "SELECT password FROM users WHERE login = ?;"; //Выбирает хэшсумму по $login
                $result = $this->db->execute_query($query, array($login));
                $arr = $result -> fetch_assoc();
                $hashPassword = $arr ? $arr['password'] : '';
                $hashS = hash('sha256', $hashPassword.$rnd); // Хэш штрих. Строка сгенерированая с помощью хранящейсяв базе хэш-суммы
                
                if($hashS == $hash){
                    $query = "UPDATE users SET tokenLastUse = ?, token = ? WHERE login = ?";
                    $this->db->execute_query($query, array($tokenLastUse, $token, $login)); //Запрос на обновление данных в таблице
                    return array('login'=>$login, 'token'=>$token);
                }

                return array(false, 403);//Неверный пароль или логин
            }
            
            else return array(false, 461);// неверный логин пользователя 

        }

    }