<?php
class DB {

    public $link;
    public $dbStatus;

    function __construct() {

        $host = getenv('MYSQL_HOST');
        $port = (int)getenv('MYSQL_PORT');
        $db = getenv('MYSQL_DATABASE');
        $user = getenv('MYSQL_USER');
        $pass = getenv('MYSQL_PASSWORD');
        
        // $host = '127.0.0.1';
        // $port = 3306;
        // $db = 'counter_offensive';
        // $user = 'root';
        // $pass = '';
        // $this->link = new mysqli($host, $user, $pass, $db, $port);

        try {
            $this->link = new mysqli($host, $user, $pass, $db, $port);
            $this->dbStatus = true;
        } catch (Exception $e) {
            $this->dbStatus = false;
        }

    }

    function __destruct() {
        if($this->link){
            $this->link->close();
        }
    }

    public function getUserById($id) {
        $query = "SELECT * FROM users WHERE id=?";
        $result = $this->link->execute_query($query,array($id));
        return $result->fetch_object();
    }

    public function getUserByLogin($login) {
        $query = "SELECT * FROM users WHERE login = ?";
        $result = $this->link->execute_query($query, array($login));
        return $result->fetch_object();
    }

    public function getUserByToken($token) {     //vnntblck вся информация о пользователе по токину                     
        $query = "SELECT * FROM users WHERE token = ?";
        $result = $this->link->execute_query($query, array($token));
        return $result->fetch_object();
    }

    public function updateToken($userId, $tokenLastUse, $token) {
        $query = "UPDATE users SET tokenLastUse = ?, token = ? WHERE id=?";
        $this->link->execute_query($query, array($tokenLastUse, $token, $userId));
    }


    function updatePassword($userId, $newPassword){
        $query = "UPDATE users SET password = ? WHERE id = ?";
        $this->link->execute_query($query, array($newPassword, $userId));
    }


    function deleteToken($userId, $tokenLastUse) {             //Обновляет токен vnntblck
        $query = "UPDATE users SET tokenLastUse = ?, token = 0 WHERE id = ?";
        $this->link->execute_query($query, array($tokenLastUse, $userId));
    }


    function addUser($login, $nickname, $hash, $token, $tokenLastUse=0, $timeCreate=0) {  //vnntblck Добвалнение юзера в таблицу с проверкойй на существование такого же логина
        $query = "INSERT INTO users (login, nickname, password, token, tokenLastUse, timeCreate) VALUES(?, ?, ?, ?, ?, ?)"; // Запрос вставляет в базу данных полученные данные
        $this->link->execute_query($query, array($login, $nickname, $hash, $token, $tokenLastUse, $timeCreate));
    } 
}