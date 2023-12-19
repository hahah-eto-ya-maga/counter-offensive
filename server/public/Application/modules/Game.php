<?php
require_once('BaseModule.php');

class Game extends BaseModule 
{

    private $mobs;
    private $gamers;    
    private $tanks;
    private $game;
    private $objects;


    private $bullets;
    
    private $time;

    private $winer;

    private $checkEnd;
    
    private $map;

    function __construct($db) {
        parent::__construct($db);
        $this->map = array_fill(0, 150, array_fill(0, 120, 0));
    }

    /*Math*/
    function calculateAngle($x1, $y1, $x2, $y2)
    {
        return atan2($y1 - $y2, $x1 - $x2);
    }

    function fire($user_id, $x, $y, $angle){
        $currentAngle = round($angle,2);
        $this->db->addBullet($user_id, $x+0.25*cos($currentAngle), $y+0.25*sin($currentAngle), $currentAngle);
        $this->db->updateBulletsHash(hash("sha256", $this->v4_UUID()));
        return true;
    }

    function calculateShiftPoint($x1, $y1, $x2, $y2, $distance) {
        $dx = $x2 - $x1;
        $dy = $y2 - $y1;
    
        $distanceBetweenPoints = sqrt($dx * $dx + $dy * $dy);
    
        $factor = $distance / $distanceBetweenPoints;
    
        return array($x1 + $dx * $factor, $y1 + $dy * $factor);
    }

    function calculateDistance($x1, $x2, $y1, $y2){
        return sqrt(pow(($x1 - $x2),2) + pow(($y1 - $y2),2));
    }

    /* Mobs */

    //Вернет только первую клетку для моба
    function EasyAStar($grid, $start, $end) {
        $queue = [[$start]];
        $visited = [];
        $rows = count($grid);
        $cols = count($grid[0]);
    
        while (count($queue) > 0) {
            $path = array_shift($queue);
            $node = end($path);
            list($x, $y) = $node;
    
            if ($x === $end[0] && $y === $end[1]) {
                return $path;
            }
    
            if (!isset($visited[$x][$y]) && $x >= 0 && $x < $rows && $y >= 0 && $y < $cols && $grid[$x][$y] === 0) {
                $visited[$x][$y] = true;
    
                foreach ([
                    [$x + 1, $y],
                    [$x - 1, $y],
                    [$x, $y + 1],
                    [$x, $y - 1]
                ] as list($newX, $newY)) {
                    $newPath = $path;
                    $newPath[] = [$newX, $newY];
                    array_push($queue, $newPath);
                }
            }
        }
    
        return [];
    }

    private function addMobs(){
        $mobsCount = count($this->mobs);
        if($mobsCount<=13){
            for($i=$mobsCount; $i<2; $i++){
                $this->db->addMobs(rand(8, 9));
            }
            $this->db->updateMobsHash(hash("sha256", $this->v4_UUID()));
        }
    }

    private function moveMobs() {
        if(!$this->gamers)
            return 0;
        foreach($this->mobs as $mob){
            $mobX=$mob->x;
            $mobY=$mob->y;
            $minDistanceToGamer = 10000;
            $targetGamer = null;
            $targetDistance = null;
            if($this->time->timer - $mob->path_update > 1000){
                foreach($this->gamers as $gamer){
                    if(in_array($gamer->person_id, array(3, 4, 5, 6, 7)))
                        continue;
                    $distance = $this->calculateDistance($gamer->x, $mobX, $gamer->y, $mobY);
                    if($distance < $minDistanceToGamer)
                        $targetGamer = $gamer;
                        $targetDistance = $distance; 
                }
                if($targetDistance && $targetGamer && $targetDistance<30){
                    if($targetDistance<2)
                    {
                        $angle = $this->calculateAngle($targetGamer->x, $targetGamer->y, $mobX, $mobY);
                        if ($this->time->timer - $mob->timestamp > $mob->reloadSpeed * 1000){
                            $this->fire(-1, $mobX, $mobY, $angle);
                            $this->db->updateMobTimestamp($mob->id); 
                        } 
                        continue;
                    }
                    $path = $this->EasyAStar($this->map, [ceil($mobX), ceil($mobY)], [ceil($targetGamer->x), ceil($targetGamer->y)]);
                    $this->db->setMobPath($mob->id, json_encode($path));
                    $angle = $this->calculateAngle($targetGamer->x, $targetGamer->y, $mobX, $mobY);
                    if ($this->time->timer - $mob->timestamp > $mob->reloadSpeed * 1000){
                        $this->fire(-1, $mobX, $mobY, $angle);            
                        $this->db->updateMobTimestamp($mob->id); 
                    }
                }
                else continue;
            }
            else {
                $path = json_decode($this->db->getMobPath($mob->id)->path);
                $targetCoord = $path[count($path)-1];
                $angle = $this->calculateAngle($targetCoord[0], $targetCoord[1], $mobX, $mobY);
                if ($this->time->timer - $mob->timestamp > $mob->reloadSpeed * 1000){
                    $this->fire(-1, $mobX, $mobY, $angle);     
                    $this->db->updateMobTimestamp($mob->id); 
                }
            }
            $distance = $mob->movementSpeed * ($this->time->timeout / 1000);
            $distance = $distance > 1 ? 1:$distance;
            $distanceToNextCell = $this->calculateDistance($mobX, $path[1][0], $mobY, $path[1][1]);            
            $newDistance = $distance - $distanceToNextCell;
            if($newDistance>0){
                $newCoords = $this->calculateShiftPoint($path[1][0], $path[1][1], $path[2][0], $path[2][1], $newDistance);    
            }
            else{
                $newCoords = $this->calculateShiftPoint($mobX, $mobY, $path[1][0], $path[1][1], $distance);    
            }

        $this->db->moveMob($newCoords[0], $newCoords[1], $angle, $mob->id);
        $this->db->updateMobsHash(hash("sha256", $this->v4_UUID()));
        }
    }

    /* Пули */

    private function moveBullets(){
        if (!$this->bullets){
            return 0;
        }
        foreach($this->bullets as $bullet){
            $this->moveBullet($bullet->id, $bullet->x2, $bullet->y2, $bullet->angle);
        }
        $this->db->updateBulletsHash(hash("sha256", $this->v4_UUID()));
    }
    
    private function moveBullet($id, $x, $y, $angle) {
        if ($x>=120 || $x<=0 || $y>=150 || $y<=0){
            $this->db->deleteBullet($id);
        } else {
            $x2 = $x + 2*cos($angle);
            $y2 = $y + 2*sin($angle);
            $this->db->updateBullet($x, $y, $x2, $y2, $id);
        }
    }

    private function shootRegs(){
        if (!$this->bullets){
            return 0;
        }
        foreach($this->bullets as $bullet){
            $minRange = [-1,0,150,0];
            $range = 0;
            foreach($this->gamers as $gamer){
                if($gamer->status == 'alive'){
                    $range = $this->shootReg($gamer->x, $gamer->y, $bullet->x1, $bullet->y1, $bullet->x2, $bullet->y2, 0.2);
                    if($range && $range<$minRange[2]){
                        $minRange[0] = 1;
                        $minRange[1] = $gamer->id;
                        $minRange[2] = $range;
                        $minRange[3] = $gamer->hp - 20;
                    }
                }
                
            }
            foreach($this->tanks as $tank){
                $range = $this->shootReg($tank->x, $tank->y, $bullet->x1, $bullet->y1, $bullet->x2, $bullet->y2, 0.3);
                if($range && $range<$minRange[2]){
                    $minRange[0] = 2;
                    $minRange[1] = $tank->id;
                    $minRange[2] = $range;
                    $minRange[3] = $tank->hp - 20;
                }
            }
            foreach($this->mobs as $mob){
                $range = $this->shootReg($mob->x, $mob->y, $bullet->x1, $bullet->y1, $bullet->x2, $bullet->y2, 0.2);
                if($range && $range<$minRange[2]){
                    $minRange[0] = 3;
                    $minRange[1] = $mob->id;
                    $minRange[2] = $range;
                    $minRange[3] = $mob->hp - 20;
                }
            }
            
            foreach($this->objects as $object){
                $range = $this->shootReg($object->x, $object->y, $bullet->x1, $bullet->y1, $bullet->x2, $bullet->y2, 0.3);
                if($range && $range<$minRange[2]){
                    $minRange[0] = 4;
                    $minRange[1] = $object->id;
                    $minRange[2] = $range;
                    $minRange[3] = $object->hp - 20;
                }
            }

            switch($minRange[0]){
                case -1: return 0;
                case 1: 
                    $this->db->lowerHpGamer($minRange[1], $minRange[3]);
                    break;
                case 2: 
                    $this->db->lowerHpTank($minRange[1], $minRange[3]);
                    break;
                case 3: 
                    $this->db->lowerHpMob($minRange[1], $minRange[3]);
                    break;
                case 4: 
                    $this->damageObjectHp($minRange[1], $minRange[3]);
                    break;
            } 
            $this->db->deleteBullet($bullet->id);
        }
        
        
    }
    private function shootReg($x, $y, $x1, $y1, $x2, $y2, $area) {
        
        $A = $x - $x1;
        $B = $y - $y1;
        $C = $x2 - $x1;
        $D = $y2 - $y1;

        $dot = $A * $C + $B * $D;
        $len_sq = $C * $C + $D * $D;
        $param = -1;
        if ($len_sq != 0) {
                $param = $dot / $len_sq;
        }
        $xx = $yy = 0;

        if ($param < 0) {
            $xx = $x1;
            $yy = $y1;
        } else if ($param > 1) {
            $xx = $x2;
            $yy = $y2;
        } else {
            $xx = $x1 + $param * $C;
            $yy = $y1 + $param * $D;
        }

        $dx = $x - $xx;
        $dy = $y - $yy;
        $sqrt = sqrt($dx * $dx + $dy * $dy);
        if ($sqrt<=$area){
            return ($A*$A+$B*$B);
        }
        return false;
        
    }

    /* Удаление мертвецов */

    function checkDead(){
        $gamerDelete = false;
        $mobsDelete = false;
        $tankDelete = false;

        foreach($this->gamers as $gamer){
            if($gamer->hp <= 0){      
                $this->db->killGamer($gamer->id);
                $this->db->setGamerBodies($gamer->x, $gamer->y, $gamer->angle);
                $gamerDelete = true;
            }
        }
        foreach($this->mobs as $mob){
            if($mob->hp <= 0){ 
                $this->db->killMob($mob->id);
                $this->db->setMobBodies($gamer->x, $gamer->y, $gamer->angle);
                $mobsDelete = true;
            }
        }
        foreach($this->tanks as $tank){
            if($tank->hp <= 0){
                $this->db->killTank($tank->id);
                if($tank->commander_id) {
                    $this->db->killGamerInHeavyTank($tank->mechanic_id, $tank->gunner_id, $tank->commander_id);
                    $this->db->setTankBodies($gamer->x, $gamer->y, $gamer->angle, 'h');
                }
                else { 
                    $this->db->killGamerInHeavyTank($tank->mechanic_id, $tank->gunner_id); 
                    $this->db->setTankBodies($gamer->x, $gamer->y, $gamer->angle, 'm');
                }
                $tankDelete = true;
            }
        }

        if($gamerDelete) $this->db->updateGamersHash(hash("sha256", $this->v4_UUID()));
        if($mobsDelete) $this->db->updateMobsHash(hash("sha256", $this->v4_UUID()));
        if($tankDelete) $this->db->updateTanksHash(hash("sha256", $this->v4_UUID()));
        
    }

    /* Конец игры */

    private function mobBannermanInZone(){
        $bannerman = $this->db->getMobBannerman();
        if (!$bannerman){
            if ($this->time->mBanner_timestamp != 0) $this->db->updateMobBannermanTimestamp(0);
            $this->time->mBanner_timestamp = 0;
            return false;
        }
        $dist = $this->calculateDistance($bannerman->x, $bannerman->playersBaseX, $bannerman->y, $bannerman->playersBaseY);
        if($dist <= $bannerman->baseRadius){
            if($this->time->mBanner_timestamp == 0){
                $this->db->updateMobBannermanTimestamp($this->time->timer); 
                $this->time->mBanner_timestamp = $this->time->timer;
            }
            return true;
        }
        if ($this->time->mBanner_timestamp != 0){
            $this->db->updateMobBannermanTimestamp(0);
            $this->time->mBanner_timestamp = 0;
        }
        return false;
    }

    private function playerBannermanInZone(){
        $bannerman = $this->db->getBannerman();
        if (!$bannerman){
            if ($this->time->pBanner_timestamp != 0){
                $this->db->updatePlayerBannermanTimestamp(0);
                $this->time->pBanner_timestamp = 0;
            }
            return false;
        }
        $dist = $this->calculateDistance($bannerman->x, $bannerman->mobBaseX, $bannerman->y, $bannerman->mobBaseY);
        if($dist <= $bannerman->baseRadius){
            if($this->time->pBanner_timestamp == 0){
                $this->db->updatePlayerBannermanTimestamp($this->time->timer); 
                $this->time->pBanner_timestamp == $this->time->timer;
            }
            return true;
        }
        if ($this->time->pBanner_timestamp != 0){
            $this->db->updatePlayerBannermanTimestamp(0);
            $this->time->pBanner_timestamp = 0;
        }
        return false;
    }

    function endGame(){
        $mob = $this->mobBannermanInZone();
        $player = $this->playerBannermanInZone();
        if($player){
            if($this->time->timer - $this->time->pBanner_timestamp >= $this->time->banner_timeout)
                return 'g';
            else return false;
        } 
        if($mob){
            if($this->time->timer - $this->time->mBanner_timestamp >= $this->time->banner_timeout)
                return 'm';
            else return false;
        }
    }

    /* Объекты */

    function damageObjectHp($objId, $currentHp) {     
        if ($currentHp <= 0) {
            $this->db->deleteObject($objId);
        }
        else $this->db->updateObjectHp($objId, $currentHp);
        $this->db->updateMapHash(hash("sha256", $this->v4_UUID()));
    }

    /* Получение данных */
    
    private function getGamers() {
        return $this->db->getGamers();
    }
    
    private function getMobs() {
        return $this->db->getAllMobs();
    }
    
    private function getBullets() {
        return $this->db->getAllBullets();
    }

    private function getObjects() {
        return $this->db->getObjects();
    }

    private function getTanks() {
        return $this->db->getAllTanks();
    }

    private function getBodies() {
        return $this->db->getBodies();
    }

    // Обновление сцены

    private function updateScene(){
        $this->bullets = $this->db->getBullets();
        $this->gamers = $this->db->getFootGamers(); 
        $this->mobs = $this->db->getMobs(); 
        $this->tanks = $this->db->getTanks();
        $this->objects = $this->db->getObjects();
        // Мобы
        $this->addMobs();
        $this->moveMobs();
        // Пули
        $this->moveBullets();
        $this->shootRegs();
        // Проверка знаменосца
        $this->winer = $this->endGame();
        // Смерть сущности
        $this->checkDead();
    }

    private function update() {
        $this->time = $this->db->getTime();
        if ($this->time->timer - $this->time->timestamp >= $this->time->timeout)
            $this->db->updateTimestamp($this->time->timer);
            $this->updateScene();
        // взять текущее время time()
        // взять $timestamp из БД
        // если time() - $timestamp >= $timeout (взять из БД)
        // то обновить сцену и $timestamp = time()
    }
    
    function getScene($userId, $hashGamers, $hashMobs, $hashBullets, $hashMap, $hashBodies) { 
        $this->update();
        $result = array();
        $hashes = $this->db->getHashes();
        
        if ($hashes->hashGamers !== $hashGamers) {
            $result['gamers'] = $this->getGamers();
            $result['tanks'] = $this->getTanks();
            $result['hashGamers'] = $hashes->hashGamers;
        }
        else {
            $result['gamers'] = true;
            $result['tanks'] = true;
        }
        
        if ($hashes->hashMobs !== $hashMobs) {
            $result['mobs'] = $this->getMobs();
            $result['hashMobs'] = $hashes->hashMobs;
        }
        else $result['mobs'] = true;
        
        if ($hashes->hashBullets !== $hashBullets) {
            $result['bullets'] = $this->getBullets();
            $result['hashBullets'] = $hashes->hashBullets;
        }
        else $result['bullets'] = true;

        if ($hashes->hashMap !== $hashMap) {
            $result['map'] = $this->getObjects();
            $result['hashMap'] = $hashes->hashMap;
        }
        else $result['map'] = true;

        if ($hashes->hashBodies !== $hashBodies) {
            $result['bodies'] = $this->getBodies();
            $result['hashBodies'] = $hashes->hashBodies;
        }
        else $result['bodies'] = true;
        if($this->winer){
            if ($this->winer =='g') $result['winer'] = 'gamers';
            if ($this->winer =='m') $result['winer'] = 'mobs';
        }

        
        //...
        /*
        array(
            'map' => [],
            'players' => [],
            'mobs' => [],
            'bullets' => [],
            'bodies' => [],
        );
        */
        return $result;
    }
    
    public function rotate($userId, $angle)
    {
        $gamer = $this->db->getGamerById($userId);
        if(in_array($gamer->person_id, array(3, 7))){
            $this->db->updateTowerRotate($userId, $angle);
            $this->db->updateGamersHash(hash("sha256", $this->v4_UUID()));
        }
        if(in_array($gamer->person_id, array(4, 6))){
            $this->db->updateTankRotate($userId, $angle);
            $this->db->updateGamersHash(hash("sha256", $this->v4_UUID()));
        }
        if($gamer->person_id == 5){
            $this->db->updateCommanderRotate($userId, $angle);
            $this->db->updateGamersHash(hash("sha256", $this->v4_UUID()));
        }
        else {
            $this->db->updateRotate($userId, $angle);
            $this->db->updateGamersHash(hash("sha256", $this->v4_UUID()));
        }
       return true;
    }

    public function move($userId, $x, $y)
    {
        $gamer = $this->db->getGamerById($userId);
        if(in_array($gamer->person_id, array(4, 6))){
            $this->db->updateTankMove($userId, $x, $y);
        }
        else $this->db->updateMove($userId, $x, $y);
        $this->db->updateGamersHash(hash("sha256", $this->v4_UUID()));
       return true;
    } 
}