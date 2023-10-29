<?php
    class User{

        protected $db;

        public function __construct($db){
            $this->db = $db;
        }


        function updatePassword($login, $newPassword){
            $query = "UPDATE users SET password = ? WHERE login = ?";
            $result = $this -> db -> execute_query($query, array($newPassword, $login));
            if ($result) {
                return true;
            }
            return false;
        }

        function getUserById($id){//Получение всей информации о пользователе KreKer
            $query = "SELECT * FROM users WHERE id=?";
            $result = $this->db->execute_query($query,array($id));
            if ($result -> num_rows > 0) {
                $user = $result ->fetch_assoc();
                return $user;
            }
            return false;
        }


        function updateToken($login, $token, $tokenLastUse) {             //Обновляет токен vnntblck
            $query = "UPDATE users SET tokenLastUse = ?, token = ? WHERE login = ?";
            $result = $this -> db -> execute_query($query, array($tokenLastUse, $token, $login));
            if ($result) {
                return true;
            }
            return false;
        }


        function deleteToken($login, $tokenLastUse) {             //Обновляет токен vnntblck
            $query = "UPDATE users SET tokenLastUse = ?, token = 0 WHERE login = ?";
            $result = $this -> db -> execute_query($query, array($tokenLastUse, $login));
            if ($result) {
                return true;
            }
            return false;
        }

    
         function getUserByLogin($login) {    //vnntblck вся информауию о пользователе по логину               
             $query = "SELECT * FROM users WHERE login = ?";
             $result = $this -> db -> execute_query($query, array($login));
             if ($result -> num_rows > 0) {
                $user = $result ->fetch_assoc();
                return $user;
             }
             return false;
         }

        function getUserByToken($token) {     //vnntblck вся информация о пользователе по токину                     
            $query = "SELECT * FROM users WHERE token = ?";
            $result = $this -> db -> execute_query($query, array($token));
            if ($result -> num_rows > 0) {
                $user = $result ->fetch_assoc();
                return $user;
            }
            return false;
        }

        function addUser($login, $hash, $token, $tokenLastUse=0, $timeCreate=0) {  //vnntblck Добвалнение юзера в таблицу с проверкойй на существование такого же логина
            $query = "INSERT INTO users (login, password, token, tokenLastUse, timeCreate) VALUES(?, ?, ?, ?, ?)"; // Запрос вставляет в базу данных полученные данные
            $result =$this->db->execute_query($query, array($login, $hash, $token, $tokenLastUse, $timeCreate));
            if ($result) {
                return true;
            }
            return false;
        } 


        
    }