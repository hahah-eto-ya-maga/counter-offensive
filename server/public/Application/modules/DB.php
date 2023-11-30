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

    function queryHandlerAll($query, $params) {
        $stmt = $this->link->prepare($query);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_OBJ);
    }
    
    public function getUserById($id) {
        $query = "SELECT id, login, password, nickname, token FROM users WHERE id=?";
        return $this->queryHandler($query, [$id], true);
    }

    public function getUserByLogin($login) {
        $query = "SELECT id, login, password, nickname, token FROM users WHERE login = ?";
        return $this->queryHandler($query, [$login], true);
    }

    public function getUserByToken($token) {     //vnntblck вся информация о пользователе по токину                     
        $query = "SELECT id, login, password, nickname, token FROM users WHERE token = ?";
        return $this->queryHandler($query, [$token], true);
    }

    public function updateToken($userId, $token) {
        $query = "UPDATE users SET tokenLastUse = NOW(), token = ? WHERE id=?";
        $this->queryHandler($query, [$token, $userId]);
    }

    function updatePassword($userId, $newPassword){
        $query = "UPDATE users SET password = ? WHERE id = ?";
        $this->queryHandler($query, [$newPassword, $userId]);
    }

    function deleteToken($userId) {             //Обновляет токен vnntblck
        $query = "UPDATE users SET tokenLastUse = NOW(), token = 0 WHERE id = ?";
        $this->queryHandler($query, [$userId]);
    }

    function addUser($login, $nickname, $hash, $token) {  //vnntblck Добвалнение юзера в таблицу с проверкойй на существование такого же логина
        $query = "INSERT INTO users (login, nickname, password, token, tokenLastUse, timeCreate) VALUES(?, ?, ?, ?, NOW(), NOW())"; // Запрос вставляет в базу данных полученные данные
        $this->queryHandler($query, [$login, $nickname, $hash, $token]); 
    }

    function addMessage($userId, $message) {
        $query = "INSERT INTO messages (userId, text, sendTime) VALUES(?, ?, NOW())";
        $this->queryHandler($query, [$userId, $message]); 
    }
    
    function updateChatHash($hash) {
        $query = "UPDATE game SET chatHash=? WHERE id=1";
        $this->queryHandler($query, [$hash]);
    }

    function getChatHash() {
        $query = "SELECT chatHash FROM game WHERE id=1";
        return $this->queryHandler($query, [], true);
    }

    function getMessages() {
        $query = "SELECT u.nickname AS nickname, m.text AS text, r.id AS level, r.name AS rank_name, m.sendTime AS sendTime
            FROM messages AS m 
            INNER JOIN users AS u ON m.userId=u.id
            JOIN gamers AS g ON u.id=g.user_id
            JOIN ranks AS r ON r.experience<=g.experience
            ORDER BY m.sendTime DESC
            LIMIT 30";
        return $this->queryHandlerAll($query, []);
    }

    function addGamer($userId){
        $query = "INSERT INTO `gamers` (`user_id`, `experience`, `status`) VALUES (?, 1, 'lobby');";
        $this->queryHandler($query, [$userId]); 
    }

    public function getRankById($userId) {
        $query = "SELECT u.id AS user_id, r.id AS level, r.name AS rank_name, g.experience AS gamer_exp, next_r.experience - g.experience AS next_rang
        FROM gamers g
        JOIN users u ON u.id=g.user_id
        JOIN ranks r ON r.experience<=g.experience
        JOIN ranks next_r ON next_r.id = r.id + 1
        WHERE u.id = ?
        ORDER BY r.id DESC LIMIT 1;";
        return $this->queryHandler($query, [$userId], true);
    }

    function setGamerRole($userId, $role, $status='alive') {
        $query = "UPDATE gamers SET person_id=?, hp=100, status=?, x=5, y=5, angle=0 WHERE user_id=?;";
        $this->queryHandler($query, [$role, $status, $userId]); 
    }
    
    function getLobby(){
        $query = "SELECT user_id, person_id FROM gamers WHERE person_id IN (1, 2, 3, 4, 5, 6, 7, 8, 9);";
        return $this->queryHandlerAll($query, []);
    }

    function getPerson($personId) {
        $query = "SELECT * FROM gamers WHERE person_id=? ;";
        return $this->queryHandler($query,[$personId], true);
    }

    function deleteRole($personId) {
        $query = "UPDATE gamers SET person_id=-1 WHERE person_id = ?";
        print($personId);
        $this->queryHandler($query, [$personId]);
    }

    public function getGamerById($userId) {
        $query = "SELECT * FROM gamers WHERE user_id=?";
        return $this->queryHandler($query, array($userId), true);
    }

    public function getMinPersonLevelById($personId){
        $query = "SELECT level FROM persons WHERE id=?;";
        return $this->queryHandler($query, array($personId), true);
    }

    public function updateLobbyHash($hash){
        $query = "UPDATE game SET hashLobby=? WHERE id=1";
        $this->queryHandler($query, array($hash));
    }
}