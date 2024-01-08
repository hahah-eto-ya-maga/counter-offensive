<?php
class DB {

    public $link;
    public $dbStatus;

    function __construct() {

        // $host = getenv('MYSQL_HOST');
        // $port = (int)getenv('MYSQL_PORT');
        // $db = getenv('MYSQL_DATABASE');
        // $user = getenv('MYSQL_USER');
        // $pass = getenv('MYSQL_PASSWORD');
        
        $host = '127.0.0.1';
        $port = 3306;
        $db = 'counter_offensive';
        $user = 'root';
        $pass = '';

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
    
    /* Юзер */

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

    function addUser($login, $nickname, $hash, $token) {  //vnntblck Добавлнение юзера в таблицу с проверкой на существование такого же логина
        $query = "INSERT INTO users (login, nickname, password, token, tokenLastUse, timeCreate) VALUES(?, ?, ?, ?, NOW(), NOW())"; // Запрос вставляет в базу данных полученные данные
        $this->queryHandler($query, [$login, $nickname, $hash, $token]); 
    }

    function addGamer($userId){
        $query = "INSERT INTO `gamers` (`user_id`, `experience`, `status`) VALUES (?, 0, 'lobby');";
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

    public function getGamerById($userId) {
        $query = "SELECT * FROM gamers WHERE user_id=?";
        return $this->queryHandler($query, array($userId), true);
    }

    public function getMinPersonLevelById($personId){
        $query = "SELECT level FROM persons WHERE id=?;";
        return $this->queryHandler($query, array($personId), true);
    }

    /* Чат */

    function addMessage($userId, $message) {
        $query = "INSERT INTO messages (userId, text, sendTime) VALUES(?, ?, NOW())";
        $this->queryHandler($query, [$userId, $message]); 
    }

    function getMessages($userId){
        $query = "SELECT u.id AS userId, u.nickname AS nickname, m.text AS text, r.id AS level, r.name AS rank_name, m.sendTime AS sendTime
        FROM messages AS m 
        INNER JOIN users AS u ON m.userId=u.id
        JOIN ranks AS r ON r.id=(SELECT MAX(r.id) as level FROM gamers AS g JOIN ranks as r ON r.experience<=g.experience WHERE g.user_id=u.id)
        ORDER BY m.sendTime DESC
        LIMIT 30";
        return $this->queryHandlerAll($query, []);
    }

    /* Получение и изменения для сцены */

    public function updateTimestamp($timestamp) {
        $query = "UPDATE game SET timestamp=? WHERE id=1";
        return $this->queryHandler($query, [$timestamp]);
    }

    function getGame() {
        $query = "SELECT *, ROUND(UNIX_TIMESTAMP(CURTIME(4)) * 1000) as timer FROM game WHERE id=1";
        return $this->queryHandler($query, [], true);
    }

    public function getTime() {
        $query = "SELECT timestamp, ROUND(UNIX_TIMESTAMP(CURTIME(4)) * 1000) as timer, timeout, banner_timeout, pBanner_timestamp, mBanner_timestamp FROM game WHERE id=1";
        return $this->queryHandler($query, [], true);
    }

    public function getGamerAndPersonByUserId($userId) {
        $query = "SELECT g.reload_timestamp, g.person_id, p.reloadSpeed,
        ROUND(UNIX_TIMESTAMP(CURTIME(4)) * 1000) AS timer
        FROM gamers g
        JOIN persons p ON g.person_id = p.id WHERE user_id=?";
        return $this->queryHandler($query, array($userId), true);
    }

    public function updateGamerTimestamp($userId) {
        $query = "UPDATE gamers SET reload_timestamp=ROUND(UNIX_TIMESTAMP(CURTIME(4)) * 1000) WHERE user_id=?";
        return $this->queryHandler($query, [$userId]);
    }

    public function updateTankTimestamp($userId) {
        $query = "UPDATE tanks SET reload_timestamp=ROUND(UNIX_TIMESTAMP(CURTIME(4)) * 1000) WHERE gunner_id=?";
        return $this->queryHandler($query, [$userId]);
    }

    public function getAllMobs() {
        $query = "SELECT person_id, x, y, angle FROM mobs;";
        return $this->queryHandlerAll($query, []);
    }

    function getAllBullets() {
        $query = "SELECT type, x2 AS x, y2 AS y, dx, dy FROM bullets";
        return $this->queryHandlerAll($query, []);
    }

    function getAllTanks() {
        $query = "SELECT type, x, y, angle, tower_angle FROM tanks";
        return $this->queryHandlerAll($query, []);
    }

    function getBullets(){
        $query = "SELECT * FROM bullets";
        return $this->queryHandlerAll($query, []);
    }

    function getFootGamers(){
        $query = "SELECT * FROM gamers WHERE status='alive' AND person_id IN (2, 8, 9)";
        return $this->queryHandlerAll($query, []);
    }

    function getTanks(){
        $query = "SELECT * FROM tanks";
        return $this->queryHandlerAll($query, []);
    }
    
    function updateMotion($user_id, $x, $y, $angle){
        $query= "UPDATE gamers SET x=?, y=?, angle=? WHERE user_id=?;";
        $this->queryHandler($query, [$x, $y, $angle, $user_id],true);
    }

    function updateTowerRotate($user_id, $angle){
        $query= "UPDATE tanks SET tower_angle=? WHERE gunner_id=?;";
        $this->queryHandler($query, [$angle, $user_id],true);
    }

    function updateTankMotion($user_id, $x, $y, $angle){
        $query= "UPDATE tanks SET x=?, y=?, angle=? WHERE driver_id=?;";
        $this->queryHandler($query, [$x, $y, $angle, $user_id],true);
    }

    function updateCommanderRotate($user_id, $angle){
        $query= "UPDATE tanks SET commander_angle=? WHERE commander_id=?;";
        $this->queryHandler($query, [$angle, $user_id],true);
    }

    /* Обновление хэша*/


    function updateChatHash($hash) {
        $query = "UPDATE game SET chatHash=? WHERE id=1";
        $this->queryHandler($query, [$hash]);
    }

    public function updateLobbyHash($hash){
        $query = "UPDATE game SET hashLobby=? WHERE id=1";
        $this->queryHandler($query, array($hash));
    }

    public function updateGamersHash($hash){
        $query = "UPDATE game SET hashGamers=? WHERE id=1";
        $this->queryHandler($query, array($hash));
    }

    public function updateMobsHash($hash){
        $query = "UPDATE game SET hashMobs=? WHERE id=1";
        $this->queryHandler($query, array($hash));
    }

    public function updateMapHash($hash){
        $query = "UPDATE game SET hashMap=? WHERE id=1";
        $this->queryHandler($query, array($hash));
    }

    public function updateTanksHash($hash){
        $query = "UPDATE game SET hashTanks=? WHERE id=1";
        $this->queryHandler($query, array($hash));
    }

    public function updateBulletsHash($hash){
        $query = "UPDATE game SET hashBullets=? WHERE id=1";
        $this->queryHandler($query, array($hash));
    }

    public function updateBodiesHash($hash){
        $query = "UPDATE game SET hashBodies=? WHERE id=1";
        $this->queryHandler($query, array($hash));
    }

    /* Убийство */

    function killGamer($userId){
        $query = "UPDATE `gamers` SET status='dead', person_id=-1 WHERE id=?";
        $this->queryHandler($query,[$userId]);
    }

    function killTank($tankId){
        $query = "DELETE FROM `tanks` WHERE id=?";
        $this->queryHandler($query,[$tankId]);
    }

    function killMob($tankId){
        $query = "DELETE FROM `mobs` WHERE id=?";
        $this->queryHandler($query,[$tankId]);
    }

    function killGamerInHeavyTank($mechId, $gunnerId, $commId) {
        $query = "UPDATE `gamers` SET status='dead', person_id=-1 WHERE id IN (?, ?, ?)";
        $this->queryHandler($query,[$mechId, $gunnerId, $commId]);
    }

    function killGamerInMiddleTank($mechId, $gunnerId) {
        $query = "UPDATE `gamers` SET status='dead', person_id=-1 WHERE id IN (?, ?)";
        $this->queryHandler($query,[$mechId, $gunnerId]);
    }

    function endUserGame($userId) {
        $query = "DELETE FROM tanks WHERE commander_id=? OR gunner_id = ? OR driver_id =?";
        $this->queryHandler($query, [$userId, $userId, $userId]);
    }

    /* Пули */

    function deleteBullet($id){
        $query = "DELETE FROM bullets WHERE id = ?";
        $this->queryHandler($query, [$id]);
    }
    
    function updateBullet($x1, $y1, $x2, $y2, $bulletId){
        $query = "UPDATE bullets SET x1 = ?, y1 = ?, x2 = ?, y2 = ? WHERE id = ?";
        $this->queryHandler($query, [$x1, $y1, $x2, $y2, $bulletId]);
    }

    function addBullet($user_id, $x, $y, $dx, $dy, $type){
        $query = "INSERT INTO bullets (user_id, x1, y1, x2, y2, dx, dy, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        $this->queryHandler($query, [$user_id, $x, $y, $x, $y, $dx, $dy, $type]);
    }

    /* Уменьшение жизней*/

    function lowerHpGamer($id, $newHp){
        $query = "UPDATE gamers SET hp = ? WHERE id = ?";
        $this->queryHandler($query, [$newHp, $id]);
    }
    function lowerHpTank($id, $newHp){
        $query = "UPDATE tanks SET hp = ? WHERE id = ?";
        $this->queryHandler($query, [$newHp, $id]);
    }
    function lowerHpMob($id, $newHp){
        $query = "UPDATE mobs SET hp = ? WHERE id = ?";
        $this->queryHandler($query, [$newHp, $id]);
    }
    function lowerHpObject($id, $newHp){
        $query = "UPDATE objects SET hp = ? WHERE id = ?";
        $this->queryHandler($query, [$newHp, $id]);
    }

    /* Мобы */

    function addMobs($role, $x, $y) {
        $query = "INSERT INTO mobs (person_id, hp, x, y, angle, reload_timestamp) VALUES (?, 100, ?, ?, 0, ROUND(UNIX_TIMESTAMP(CURTIME(4)) * 1000));";
        $this->queryHandler($query, [$role, $x, $y]);
    }

    function moveMob($mobX, $mobY, $angle, $mobId) {
        $query = "UPDATE mobs SET x=?, y=?, angle=? WHERE id=?;";
        $this->queryHandler($query, [$mobX, $mobY, $angle, $mobId]);
    }

    function rotateMob($angle, $mobId) {
        $query = "UPDATE mobs SET angle=? WHERE id=?;";
        $this->queryHandler($query, [$angle, $mobId]);
    }


    function getMobPath($mobId){
        $query = "SELECT path FROM mobs WHERE id=?";
        return $this->queryHandler($query, [$mobId], true);
    }

    function setMobPath($mobId, $path){
        $query = "UPDATE mobs SET path=?, path_update=ROUND(UNIX_TIMESTAMP(CURTIME(4)) * 1000) WHERE id=?";
        $this->queryHandler($query, [$path, $mobId]);
    }

    function getMobById($mobId){
        $query = "SELECT x, y, angle FROM mobs WHERE id=?";
        return $this->queryHandler($query, [$mobId], true);
    }

    function updateMobTimestamp($mobId){
        $query = "UPDATE mobs SET reload_timestamp=ROUND(UNIX_TIMESTAMP(CURTIME(4)) * 1000) WHERE id=?";
        $this->queryHandler($query, [$mobId]);
    }

    public function getMobs() {
        $query = "SELECT m.id AS id, m.hp AS hp, m.path_update AS path_update, m.reload_timestamp AS timestamp,
         m.person_id AS personId, m.x AS x, m.y AS y, m.angle AS angle,
        p.reloadSpeed AS reloadSpeed, p.rotateSpeed AS rotateSpeed, p.movementSpeed AS movementSpeed 
        FROM mobs m JOIN persons p ON m.person_id=p.id;";
        return $this->queryHandlerAll($query, []);
    }

    /* Лобби */

    function setGamerRole($userId, $role) {
        $query = "UPDATE gamers SET person_id=?, hp=100, status='alive', x=5, y=5, angle=0 WHERE user_id=?;";
        $this->queryHandler($query, [$role, $userId]); 
    }
    
    function getLobby(){
        $query = "SELECT user_id, person_id, experience FROM gamers WHERE person_id IN (1, 2, 3, 4, 5, 6, 7, 8, 9);";
        return $this->queryHandlerAll($query, []);
    }

    function getTankByUserId($userId) {
        $query = "SELECT id, x, y, angle, tower_angle, commander_angle, commander_id, driver_id, gunner_id FROM tanks
        WHERE commander_id=? OR gunner_id = ? OR driver_id =?";
        return $this->queryHandler($query, [$userId, $userId, $userId], true);
    }

    function getTankByGunnerId($userId) {
        $query = "SELECT reload_timestamp FROM tanks WHERE gunner_id = ?";
        return $this->queryHandler($query, [$userId], true);
    }


    function getPerson($personId) {
        $query = "SELECT * FROM gamers WHERE person_id=? ;";
        return $this->queryHandler($query,[$personId], true);
    }

    function deleteRole($personId) {
        $query = "UPDATE gamers SET person_id=-1, status = 'lobby' WHERE person_id = ?";
        $this->queryHandler($query, [$personId]);
    }

    function addHeavyTank($driverId, $gunnerId, $commanderId){
        $query = "INSERT INTO tanks (type, driver_id, gunner_id, commander_id, x, y, reload_timestamp) VALUES (1, ?, ?, ?, 5, 5, ROUND(UNIX_TIMESTAMP(CURTIME(4)) * 1000));";
        $this->queryHandler($query, [$driverId, $gunnerId, $commanderId]);
    }

    function addMiddleTank($driverId, $gunnerId){
        $query = "INSERT INTO tanks (type, driver_id, gunner_id, x, y, reload_timestamp) VALUES (0, ?, ?, 5, 5, ROUND(UNIX_TIMESTAMP(CURTIME(4)) * 1000));";
        $this->queryHandler($query, [$driverId, $gunnerId]);
    }

    public function setTank($userId, $roleId, $tankId){
        $query = "INSERT INTO tank_lobby (person_id, user_id, tank_id) VALUES (?, ?, ?)";
        $this->queryHandler($query, [$roleId, $userId, $tankId]);
    }

    public function getTankById($tankId){
        $query = "SELECT person_id, user_id FROM tank_lobby WHERE tank_id=?";
        return $this->queryHandlerAll($query, [$tankId]);
    }

    public function deleteGamerInTank($userId){
        $query = "DELETE FROM tank_lobby WHERE user_id = ?";
        $this->queryHandler($query, [$userId]);
    }

    function getPersons() {
        $query = "SELECT p.id AS person_id, p.name AS name, p.level as level, r.experience AS exp 
        FROM persons p
        JOIN ranks r ON p.level = r.id";
        return $this->queryHandlerAll($query, []);
    }

    function getTankmans(){
        $query = "SELECT person_id, user_id, tank_id FROM tank_lobby;";
        return $this->queryHandlerAll($query, []);
    }

    function deleteTank($tankId){
        $query = "DELETE FROM tank_lobby WHERE tank_id = ?";
        $this->queryHandler($query, [$tankId]);
    }

    public function getGamers() {
        $query = "SELECT person_id, x, y, angle  FROM gamers WHERE person_id IN (1, 2, 8, 9) AND status='alive'";
        return $this->queryHandlerAll($query, []);
    }

    function getGamerStatus($userId) {
        $query = "SELECT status, person_id FROM gamers WHERE id=?";
        return $this->queryHandler($query, [$userId], true);
    }

    function suicide($userId) {
        $query = "UPDATE gamers SET person_id=-1, status='lobby' WHERE user_id = ?";
        $this->queryHandler($query, [$userId]);
    }

    function tankExit($userId) {
        $query = "DELETE FROM tank_lobby WHERE user_id = ?";
        $this->queryHandler($query, [$userId]);
    }

    function endTankGame($tankId){
        $query = "DELETE FROM tanks WHERE id = ?";
        $this->queryHandler($query, [$tankId]);
    }

    /* Трупы */

    public function setGamerBodies($x, $y, $angle, $type){
        $query = "INSERT INTO bodies (x, y, angle, type) VALUES (?, ?, ?, ?)";
        $this->queryHandler($query, [$x, $y, $angle, $type]);
    }

    public function setMobBodies($x, $y, $angle, $type){
        $query = "INSERT INTO bodies (x, y, angle, type, isMob) VALUES (?, ?, ?, ?, TRUE)";
        $this->queryHandler($query, [$x, $y, $angle, $type]);
    }

    public function getBodies(){
        $query = "SELECT x, y, angle, type FROM bodies";
        return $this->queryHandlerAll($query, []);
    }

    /*Знаменосец*/

    function getBannerman(){
        $query = "SELECT ga.x AS x, ga.y AS y, g.mobBase_x AS mobBaseX, g.mobBase_y AS mobBaseY,
        g.playersBase_x AS playerBaseX, g.playersBase_y AS playersBaseY, g.base_radius AS baseRadius
        FROM game g JOIN gamers ga ON ga.person_id=2 ";
        return $this->queryHandler($query, [], true);
    }

    function getMobBannerman(){
        $query = "SELECT m.x AS x, m.y AS y, g.mobBase_x AS mobBaseX, g.mobBase_y AS mobeBaseY,
        g.playersBase_x AS playerBaseX, g.playersBase_y AS playersBaseY, g.base_radius AS baseRadius
        FROM game g JOIN mobs m ON m.person_id=2 ";
        return $this->queryHandler($query, [], true);
    }

    public function getBannermanTime() {
        $query = "SELECT banner_timestamp, NOW()+ 0 as nowTime, banner_timeout FROM game WHERE id=1";
        return $this->queryHandler($query, [], true);
    }

    public function updatePlayerBannermanTimestamp($timestamp) {
        $query = "UPDATE game SET pBanner_timestamp=? WHERE id=1";
        return $this->queryHandler($query, [$timestamp]);
    }

    public function updateMobBannermanTimestamp($timestamp) {
        $query = "UPDATE game SET mBanner_timestamp=? WHERE id=1";
        return $this->queryHandler($query, [$timestamp]);
    }

    public function getMobPerson($personId){
        $query = "SELECT * FROM mobs WHERE person_id=? ;";
        return $this->queryHandler($query,[$personId], true);
    }

    /* Объекты */

    function getObjects() {
        $query = "SELECT type, x, y, sizeX, sizeY FROM objects WHERE status='a'";
        return $this->queryHandlerAll($query, []);
    }

    function getAllObjects() {
        $query = "SELECT id, hp, x, y, sizeX, sizeY FROM objects WHERE status='a'";
        return $this->queryHandlerAll($query, []);
    }

    function deleteObject($objectId) {
        $query = "UPDATE objects SET hp = 0, status='d' WHERE id = ?";
        $this->queryHandler($query, [$objectId]);
    }

    function updateObjectHp($id, $newHp) {
        $query = "UPDATE objects SET hp = ? WHERE id = ?";
        $this->queryHandler($query, [$newHp, $id]);
    }

    /* Очистка игры*/
    function deleteBodies() {
        $query = "TRUNCATE TABLE bodies";
        $this->queryHandler($query, []);
    }

    function deleteBullets() {
        $query = "TRUNCATE TABLE bullets;";
        $this->queryHandler($query, []);
    }
    
    function deleteTanks() {
        $query = "TRUNCATE TABLE tanks;";
        $this->queryHandler($query, []);
    }

    function deleteMobs() {
        $query = "TRUNCATE TABLE mobs;";
        $this->queryHandler($query, []);
    }

    function setWinners() {
        $query = "UPDATE `gamers` SET status='w', person_id=-1, hp=0 WHERE status='alive'";
        $this->queryHandler($query, []);
    }

    function updateObjectsHp() {
        $query = "UPDATE `objects` SET status='a', hp=100";
        $this->queryHandler($query, []);
    }

}