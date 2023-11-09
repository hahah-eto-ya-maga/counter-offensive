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

        try {
            $this->link = new PDO("mysql:host=$host;port=$port;dbname=$db", $user, $pass);
            $this->dbStatus = true;
        } catch (PDOException $e) {
            $this->dbStatus = false;
        }

    }

    function __destruct() {
        $this->link = null;
    }

    function queryHandler($query, $params, $isResult=false){
        $stmt = $this->link->prepare($query);
        $stmt->execute($params);
        if($isResult){
            return $stmt->fetch(PDO::FETCH_OBJ);
        }
    }
    
    public function getUserById($id) {
        $query = "SELECT * FROM users WHERE id=?";
        return $this->queryHandler($query, array($id), true);
    }

    public function getUserByLogin($login) {
        $query = "SELECT * FROM users WHERE login = ?";
        return $this->queryHandler($query, array($login), true);
    }

    public function getUserByToken($token) {     //vnntblck вся информация о пользователе по токину                     
        $query = "SELECT * FROM users WHERE token = ?";
        return $this->queryHandler($query, array($token), true);
    
    }

    public function updateToken($userId, $tokenLastUse, $token) {
        $query = "UPDATE users SET tokenLastUse = ?, token = ? WHERE id=?";
        $this->queryHandler($query, array($tokenLastUse, $token, $userId));
    }


    function updatePassword($userId, $newPassword){
        $query = "UPDATE users SET password = ? WHERE id = ?";
        $this->queryHandler($query, array($newPassword, $userId));

    }


    function deleteToken($userId, $tokenLastUse) {             //Обновляет токен vnntblck
        $query = "UPDATE users SET tokenLastUse = ?, token = 0 WHERE id = ?";
        $this->queryHandler($query, array($tokenLastUse, $userId));
    }


    function addUser($login, $nickname, $hash, $token, $tokenLastUse=0, $timeCreate=0) {  //vnntblck Добвалнение юзера в таблицу с проверкойй на существование такого же логина
        $query = "INSERT INTO users (login, nickname, password, token, tokenLastUse, timeCreate) VALUES(?, ?, ?, ?, ?, ?)"; // Запрос вставляет в базу данных полученные данные
        $this->queryHandler($query, array($login, $nickname, $hash, $token, $tokenLastUse, $timeCreate)); 
    } 
}