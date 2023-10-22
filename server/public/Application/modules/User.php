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


        // Функция выхода из аккаунта. В случае успешного срабатывания возвращает true, иначе код ошибки.
        function logout($login, $token, $tokenLastUse){
            $query = "SELECT login FROM users WHERE login = ? ";
            $result = $this->db->execute_query($query,array($login));
            $arr = $result -> fetch_assoc();
            $checkLogin = $arr ? $arr['login'] : '';
            
            if($checkLogin != ''){ // Проверка существования пользователя
                
                $query = "SELECT token FROM users WHERE login=?";
                $result = $this->db->execute_query($query, array($login));
                $arr = $result->fetch_assoc();
                $checkToken = $arr ? $arr['token'] : ''; // Проверка существования токена 
                
                if($checkToken != '' && $checkToken == $token){
                    $query = "UPDATE users SET token=0, tokenLastUse=? where login=?";
                    $this->db->execute_query($query, array($tokenLastUse, $login));
                    
                    return true;
                }

                else return array(false, 401);//неверный токен для этого пользователя
            }

            else return array(false, 461);// неверный логин пользователя 
        }



        // Функция потверждения актуального токена
        function tokenVerification($login, $token, $tokenLastUse){
            $query = "SELECT login FROM users WHERE login=?";
            $result = $this->db->execute_query($query,array($login));
            $checkLogin = $result->fetch_assoc()['login'];
            
            if($checkLogin != ''){ // Проверка существования пользователя
                $query = "SELECT token FROM users WHERE login=?";
                $result = $this->db->execute_query($query, array($login));
                $arr = $result->fetch_assoc();
                $checkToken = $arr ? $arr['token'] : '';
                
                if($checkToken != '' && $checkToken == $token){ // Проврека существования токена 
                    $query = "UPDATE users SET tokenLastUse = ? WHERE login = ?";
                    $this->db->execute_query($query, array($tokenLastUse,$login)); //Запрос на обновление данных в таблице
                    return true; //придумать какой то формат данных для отдачи обратно
                }

                else return array(false, 401); //неверный токен для этого пользователя
            }
            
            else return array(false, 461); //такого пользователя не существует
        }
        

        // Метод получения информации
        function getAllInfo($login, $token, $tokenLastUse){
            $query = "SELECT login FROM users WHERE login=?";
            $result = $this->db->execute_query($query, array($login));
            $arr = $result -> fetch_assoc();
            $checkLogin = $arr ? $arr['login'] : '';
            
            if($checkLogin != ''){ // Проверка существования пользователя
                $query = "SELECT token FROM users WHERE login=?";
                $result = $this->db->execute_query($query, array($login));
                $arr = $result->fetch_assoc();
                $checkToken = $arr ? $arr['token'] : '';
                
                if($checkToken != '' && $checkToken == $token){ // Проверка существования токена 
                    $query = "SELECT gameCount, scoreCount, timeCreate FROM users WHERE login = ?;";
                    $result = $this->db->execute_query($query, array($login));
                    $arr = $result -> fetch_assoc(); // Запрос для получения основных данных о пользователе
                    $query = "UPDATE users SET tokenLastUse = ? WHERE login = ?";
                    $this->db->execute_query($query, array($tokenLastUse,$login)); //Запрос на обновление данных в таблице

                    $gameCount = 0;
                    $scoreCount = 0;
                    if($arr){
                        $gameCount = $arr['gameCount'];
                        $scoreCount = $arr['scoreCount'];
                    }

                    return array(
                        'gameCount'=>$gameCount,
                        'scoreCount'=>$scoreCount,
                    );
                }

                else return array(false, 401);//неверный токен для этого пользователя
            }

            else return array(false, 461);//такого пользователя не существует
        }
        

        // Функция изменения пароля
        function updatePassword($login, $token, $hash, $tokenLastUse){ // Новый пароль отправляется в виде h($login.$password)
            $query = "SELECT login FROM users WHERE login=?";
            $result = $this->db->execute_query($query, array($login));
            $arr = $result -> fetch_assoc();
            $checkLogin = $arr ? $arr['login'] : '';

            if($checkLogin != ''){ // Проверка существования пользователя
                $query = "SELECT token FROM users WHERE login=?";
                $result = $this->db->execute_query($query,array($login));
                $arr = $result->fetch_assoc();
                $checkToken = $arr ? $arr['token'] : '';

                if($checkToken != '' && $checkToken == $token){ // Проврека существования токена 
                    $query = "UPDATE users SET password=?, tokenLastUse=? where login=?";
                    $this->db->execute_query($query, array($hash, $tokenLastUse, $login)); //Запрос замены имени
                    return true;
                }

                else return array(false, 401);//неверный токен для этого пользователя
            }

            else return array(false, 461);//такого пользователя не существует
        }

        function getUserById($id){
            $query = "SELECT * FROM users WHERE id=?";
            $result = $this->db->execute_query($query,array($id));
            $arr = $result->fetch_assoc();
            $checkId = $arr ? $arr['id'] : '';

            if($checkId != ''){//Проверка существования пользователя
                return $arr;
            }

            else return array(false, 461);//такого пользователя не существует
        }

    }
