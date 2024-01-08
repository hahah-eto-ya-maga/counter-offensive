<?php
require_once('BaseModule.php');

class Game extends BaseModule 
{

    private $hashFlagGamers; // Флаг изменения состояния игроков
    private $hashFlagBullets; // Флаг изменения состояния пуль
    private $hashFlagBodies; // Флаг изменения состояния тел
    private $hashFlagMobs; // Флаг изменения состояния мобов
    private $hashFlagMap; // Флаг изменения состояния карты
    private $recreateFlagMap; // Флаг пересоздания карты


    private $mobs;
    private $gamers;  
    private $tanks;
    private $game;
    private $objects;
    private $bullets;
    private $winer;
    private $checkEnd;

    private $map;

    function __construct($db) {
        parent::__construct($db);
        
    }

    /*Math*/
    private function calculateAngle($x1, $y1, $x2, $y2)
    {
        return atan2($y1 - $y2, $x1 - $x2);
    }

    private function movePoint($x, $y, $angle, $distance) {
        $newX = $x + $distance * cos($angle);
        $newY = $y + $distance * sin($angle);
    
        return array($newX, $newY);
    }

    private function calculateShiftPoint($x1, $y1, $x2, $y2, $distance) {
        $dx = $x2 - $x1;
        $dy = $y2 - $y1;
    
        $distanceBetweenPoints = sqrt($dx * $dx + $dy * $dy);
    
        $factor = $distance / $distanceBetweenPoints;
    
        return array($x1 + $dx * $factor, $y1 + $dy * $factor);
    }

    private function calculateDistance($x1, $x2, $y1, $y2){
        return sqrt(pow(($x1 - $x2),2) + pow(($y1 - $y2),2));
    }

    /*Map*/

    function fillMap(){
        // Заполнение карты
        $this->map = array_fill(0, 120, array_fill(0, 150, 0));

        foreach ($this->objects as $object) {
            for ($i = $object->x - 1; $i < $object->x + $object->sizeX - 1 ; $i++) {
                for ($j = $object->y; $j < $object->y + $object->sizeY; $j++) {
                    $this->map[120-$j][$i] = 1;
                }
            }
        }
    }

    private function createMobMap($x1, $y1, $x2, $y2) {
        $desired_part = [];
        for ($i = 120-$y2-1; $i < 120-$y1; $i++) {
            $row = $this->map[$i];
            $desired_part_row = array_slice($row, $x1, $x2 - $x1 + 1);
            $desired_part[] = $desired_part_row;
        }
        return $desired_part;
    }


    /* Mobs */

    private function EasyAStar($grid, $start, $end) {
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
        $gamerCount = count($this->gamers)+count($this->tanks);
        if($mobsCount<=$gamerCount){
            for($i=$mobsCount; $i<$gamerCount; $i++){
                $this->db->addMobs(rand(8, 9),rand(10, 30), rand(10, 30));
            }
            $this->hashFlagMobs = true;
        }
    }

    private function mobFire($x, $y, $angle, $personId){
        $dx = cos($angle);
        $dy = sin($angle);
        $this->db->addBullet(-1, $x+0.25*$dx, $y+0.25*$dy, $dx, $dy, $personId);
        $this->hashFlagBullets = true;
    }

    private function moveMobs() {
        if(!$this->gamers && !$this->tanks)
            return 0;
        foreach($this->mobs as $mob){
            $mobX=$mob->x;
            $mobY=$mob->y;
            $minDistanceToGamer = 10000;
            $targetGamer = null;
            $targetDistance = null;
            if($this->game->timer - $mob->path_update > 1000){
                if($mob->personId == 9){
                    $gamers = $this->gamers + $this->tanks;
                } else $gamers = $this->gamers;
                foreach($gamers as $gamer){
                    $distance = $this->calculateDistance($gamer->x, $mobX, $gamer->y, $mobY);
                    if($distance < $minDistanceToGamer)
                        $targetGamer = $gamer;
                        $targetDistance = $distance; 
                }
                if($targetDistance && $targetGamer && $targetDistance<15){
                    if($targetDistance<2)
                    {
                        $angle = $this->calculateAngle($targetGamer->x, $targetGamer->y, $mobX, $mobY);
                        if ($this->game->timer - $mob->timestamp > $mob->reloadSpeed * 1000){
                            $this->mobFire($mobX, $mobY, $angle, $mob->personId);
                            $this->db->rotateMob($angle, $mob->id);    
                            $this->db->updateMobTimestamp($mob->id);    

                        } 
                        continue;
                    }
                    $path = $this->EasyAStar($this->map, [ceil($mobX), ceil($mobY)], [ceil($targetGamer->x), ceil($targetGamer->y)]);
                    $this->db->setMobPath($mob->id, json_encode($path));
                    $angle = $this->calculateAngle($targetGamer->x, $targetGamer->y, $mobX, $mobY);
                    if ($this->game->timer - $mob->timestamp > $mob->reloadSpeed * 1000){
                        $this->mobFire($mobX, $mobY, $angle, $mob->personId);     
                        $this->db->updateMobTimestamp($mob->id); 
                    }
                }
                //случай когда игрок далеко и мобы просто двигаются к нему
                else{
                    $distance = $mob->movementSpeed/2 * ($this->game->timeout / 1000);
                    if($targetGamer->x && $targetGamer->y){
                        $targetX = $targetGamer->x;
                        $targetY = $targetGamer->y;
                    }
                    $angle = $this->calculateAngle($targetX, $targetY, $mobX, $mobY);
                    $newCoords = $this->movePoint($mobX, $mobY, $angle, $distance);
                    $this->db->moveMob($newCoords[0], $newCoords[1], $angle, $mob->id);
                    $this->hashFlagMobs = true;
                    continue;
                }
            }
            else {
                $path = $this->db->getMobPath($mob->id);
                if($path){
                    $path = json_decode($path->path);
                    $targetCoord = $path[count($path)-1];
                    $angle = $this->calculateAngle($targetCoord[0], $targetCoord[1], $mobX, $mobY);
                    if ($this->game->timer - $mob->timestamp > $mob->reloadSpeed * 1000){
                        $this->mobFire($mobX, $mobY, $angle, $mob->personId);     
                        $this->db->updateMobTimestamp($mob->id); 
                    }
                } else continue;
            }
            $distance = $mob->movementSpeed * ($this->game->timeout / 1000);
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
            $this->hashFlagMobs = true;
        }
    }

    /* Пули */

    private function moveBullets(){
        if (!$this->bullets){
            return 0;
        }
        foreach($this->bullets as $bullet){
            $this->moveBullet($bullet->id, $bullet->x2, $bullet->y2, $bullet->dx, $bullet->dy);
        }
        $this->hashFlagBullets = true;
    }
    
    private function moveBullet($id, $x, $y, $dx, $dy) {
        if ($x>=120 || $x<=0 || $y>=150 || $y<=0){
            $this->db->deleteBullet($id);
        } else {
            $x2 = $x + $dx;
            $y2 = $y + $dy;
            $this->db->updateBullet($x, $y, $x2, $y2, $id);
        }
    }

    private function shootRegs(){
        if (!$this->bullets){
            // print_r("Нет пуль");
            return 0;
        }
        foreach($this->bullets as $bullet){
            $shootFlag = false;
            foreach($this->gamers as $gamer){
                $range = $this->shootReg($gamer->x, $gamer->y, $bullet->x1, $bullet->y1, $bullet->x2, $bullet->y2, 0.2);
                if($range){
                    $this->db->lowerHpGamer($gamer->id, $gamer->hp-20);
                    $this->db->deleteBullet($bullet->id);
                    $shootFlag = true;
                    break;
                }
            }
            if(!$shootFlag){
                foreach($this->tanks as $tank){
                    $range = $this->shootReg($tank->x, $tank->y, $bullet->x1, $bullet->y1, $bullet->x2, $bullet->y2, 0.3);
                    if($range){
                        $this->db->lowerHpTank($tank->id, $tank->hp-20);
                        $this->db->deleteBullet($bullet->id);
                        $shootFlag = true;
                        break;
                    }
                }
            }
            if(!$shootFlag){
                foreach($this->mobs as $mob){
                    $range = $this->shootReg($mob->x, $mob->y, $bullet->x1, $bullet->y1, $bullet->x2, $bullet->y2, 0.2);
                    if($range){
                        $this->db->lowerHpMob($mob->id, $mob->hp-20);
                        $this->db->deleteBullet($bullet->id);
                        $shootFlag = true;
                        break;
                    }
                }
            }
            if(!$shootFlag){
                foreach($this->objects as $object){
                    $range = $this->shootReg($object->x, $object->y, $bullet->x1, $bullet->y1, $bullet->x2, $bullet->y2, 0.3);
                    if($range){
                        $this->damageObjectHp($object->id, $object->hp-20);
                        $this->db->deleteBullet($bullet->id);
                        $shootFlag = true;
                        break;
                    }
                }
            }
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
            //return ($A*$A+$B*$B);
            return true;
        }
        return false;
        
    }

    /* Удаление мертвецов */

    private function checkDead(){
        foreach($this->gamers as $gamer){
            if($gamer->hp <= 0){      
                $this->db->killGamer($gamer->id);
                $this->db->setGamerBodies($gamer->x, $gamer->y, $gamer->angle, $gamer->person_id);
                $this->hashFlagBodies = true;
                $this->hashFlagGamers = true;
            }
        }
        foreach($this->mobs as $mob){
            if($mob->hp <= 0){ 
                $this->db->killMob($mob->id);
                $this->db->setMobBodies($mob->x, $mob->y, $mob->angle, $mob->personId);
                $this->hashFlagBodies = true;
                $this->hashFlagMobs = true;
            }
        }
        foreach($this->tanks as $tank){
            if($tank->hp <= 0){
                $this->db->killTank($tank->id);
                if($tank->commander_id) {
                    $this->db->killGamerInHeavyTank($tank->driver_id, $tank->gunner_id, $tank->commander_id);
                    $this->db->setGamerBodies($tank->x, $tank->y, $tank->angle, 3);
                }
                else { 
                    $this->db->killGamerInMiddleTank($tank->driver_id, $tank->gunner_id); 
                    $this->db->setGamerBodies($tank->x, $tank->y, $tank->angle, 6);
                }
                $this->hashFlagGamers = true;
                $this->hashFlagBodies = true;
            }
        }
    }

    private function playerBannermanInZone(){
        $bannerman = $this->db->getBannerman();
        if (!$bannerman){
            if ($this->game->pBanner_timestamp != 0){
                $this->db->updatePlayerBannermanTimestamp(0);
                $this->game->pBanner_timestamp = 0;
            }
            return false;
        }
        $dist = $this->calculateDistance($bannerman->x, $bannerman->mobBaseX, $bannerman->y, $bannerman->mobBaseY);
        if($dist <= $bannerman->baseRadius){
            if($this->game->pBanner_timestamp == 0){
                $this->db->updatePlayerBannermanTimestamp($this->game->timer); 
                $this->game->pBanner_timestamp == $this->game->timer;
            }
            return true;
        }
        if ($this->game->pBanner_timestamp != 0){
            $this->db->updatePlayerBannermanTimestamp(0);
            $this->game->pBanner_timestamp = 0;
        }
        return false;
    }
    
    private function endGame(){
        $player = $this->playerBannermanInZone();
        if($player){
            if($this->game->timer - $this->game->pBanner_timestamp >= $this->game->banner_timeout){
                $this->db->deleteBodies();
                $this->db->deleteBullets();
                $this->db->deleteTanks();
                $this->db->deleteMobs();
                $this->db->setWinners();
                // $this->db->updateGame();
                $this->db->updateObjectsHp();
            }
        } 
    }

    /* Объекты */

    private function damageObjectHp($objId, $currentHp) {     
        if ($currentHp <= 0) {
            $this->db->deleteObject($objId);
            $this->fillMap();
        }
        else $this->db->updateObjectHp($objId, $currentHp);
        $this->hashFlagMap = true;
    }

    /* Обновление хешей */

    private function hashUpdate() {
        $hash = hash("sha256", $this->v4_UUID());
        if ($this->hashFlagGamers){
            $this->db->updateGamersHash($hash);
        }
        if ($this->hashFlagBullets){
            $this->db->updateBulletsHash($hash);
        }
        if ($this->hashFlagBodies){
            $this->db->updateBodiesHash($hash);
        }
        if ($this->hashFlagMobs){
            $this->db->updateMobsHash($hash);
        }
        if ($this->hashFlagMap){
            $this->db->updateMapHash($hash);
        }
        // Вызывается для пересоздания текущей карты
        if($this->recreateFlagMap){
            $this->fillMap();
        }
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
        $this->objects = $this->db->getAllObjects();
        // Мобы
        $this->addMobs();
        $this->fillMap();
        $this->moveMobs();
        // Пули
        $this->moveBullets();
        $this->shootRegs();
        // Проверка знаменосца
        $this->endGame();
        // Смерть сущности
        $this->checkDead();
        // Обновление хещей
        $this->hashUpdate();
    }

    private function update() {
        if ($this->game->timer - $this->game->timestamp >= $this->game->timeout)
            $this->db->updateTimestamp($this->game->timer);
            $this->updateScene();
    }
    
    function getScene($userId, $hashGamers, $hashMobs, $hashBullets, $hashMap, $hashBodies) { 
        $gamer = $this->db->getGamerById($userId);
        $result = array();
        $this->game = $this->db->getGame();

        if(in_array($gamer->status, array("dead", "lobby"))){
            $result['is_dead'] = true;
        }


        if($gamer->status == "w"){
            $result['is_end'] = 'true';
        } else $this->update();
        
        

        if(in_array($gamer->person_id, array(1, 2, 8, 9))){
            $result['gamer'] = array(
                'person_id' => $gamer->person_id,
                'x' => $gamer->x,
                'y' => $gamer->y,
                'angle' => $gamer->angle
            );
        } else{
            $tank = $this->db->getTankByUserId($userId);
            if($tank && in_array($gamer->person_id, array(3, 4, 5, 6, 7))){
                $result['gamer'] = array(
                    'person_id' => $gamer->person_id,
                    'x' => $tank->x,
                    'y' => $tank->y,
                    'angle' => $tank->angle,
                    'tower_angle' => $tank->tower_angle
                );
            } else $result['gamer'] = null;
        }
        
        if ($this->game->hashGamers !== $hashGamers) {
            $result['gamers'] = $this->getGamers();
            $result['tanks'] = $this->getTanks();
            $result['hashGamers'] = $this->game->hashGamers;
        }
        
        if ($this->game->hashMobs !== $hashMobs) {
            $result['mobs'] = $this->getMobs();
            $result['hashMobs'] = $this->game->hashMobs;
        }
        
        if ($this->game->hashBullets !== $hashBullets) {
            $result['bullets'] = $this->getBullets();
            $result['hashBullets'] = $this->game->hashBullets;
        }

        if ($this->game->hashMap !== $hashMap) {
            $result['map'] = $this->getObjects();
            $result['hashMap'] = $this->game->hashMap;
        }

        if ($this->game->hashBodies !== $hashBodies) {
            $result['bodies'] = $this->getBodies();
            $result['hashBodies'] = $this->game->hashBodies;
        }

        return $result;
    }
    
    public function motion($userId, $x, $y, $angle)
    {
        $gamer = $this->db->getGamerById($userId);
        if(in_array($gamer->person_id, array(3, 7))){
            if (is_numeric($angle)) {
                $this->db->updateTowerRotate($userId, $angle);
                $this->db->updateGamersHash(hash("sha256", $this->v4_UUID()));
            } else return array(false, 422);
        }
        elseif(in_array($gamer->person_id, array(4, 6))){
            if (is_numeric($x) && is_numeric($y) && is_numeric($angle)) {
                $this->db->updateTankMotion($userId, $x, $y, $angle);
                $this->db->updateGamersHash(hash("sha256", $this->v4_UUID()));
            } else return array(false, 422);
        }
        elseif($gamer->person_id == 5){
            if (is_numeric($angle)) {
                $this->db->updateCommanderRotate($userId, $angle);
                $this->db->updateGamersHash(hash("sha256", $this->v4_UUID()));
            } else return array(false, 422);
        }
        else {
            if (is_numeric($x) && is_numeric($y) && is_numeric($angle)) {
                $this->db->updateMotion($userId, $x, $y, $angle);
                $this->db->updateGamersHash(hash("sha256", $this->v4_UUID()));
            } else return array(false, 422);
        }
        return true;
    }

    function fire($user_id, $x, $y, $angle){
        $gamer = $this->db->getGamerAndPersonByUserId($user_id);
        switch($gamer->person_id){
            case 3:
                $tank = $this->db->getTankByGunnerId($user_id);
                if($tank && ($gamer->timer - $tank->reload_timestamp)>($gamer->reloadSpeed * 1000)){
                    $dx = cos($angle);
                    $dy = sin($angle);
                    $this->db->addBullet($user_id, $x+0.3*$dx, $y+0.3*$dy, $dx, $dy, 3);
                    $this->db->updateTankTimestamp($user_id);
                    $this->db->updateBulletsHash(hash("sha256", $this->v4_UUID()));
                }
                break;
            case 7:
                $tank = $this->db->getTankByGunnerId($user_id);
                if($tank && ($gamer->timer - $tank->reload_timestamp)>($gamer->reloadSpeed * 1000)){
                    $dx = cos($angle);
                    $dy = sin($angle);
                    $this->db->addBullet($user_id, $x+0.3*$dx, $y+0.3*$dy, $dx, $dy, 7);
                    $this->db->updateTankTimestamp($user_id);
                    $this->db->updateBulletsHash(hash("sha256", $this->v4_UUID()));
                }
                break;            
            case 8:
                if($gamer && ($gamer->timer - $gamer->reload_timestamp)>($gamer->reloadSpeed * 1000)){
                    $dx = cos($angle);
                    $dy = sin($angle);
                    $this->db->addBullet($user_id, $x+0.3*$dx, $y+0.3*$dy, $dx, $dy, 8);
                    $this->db->updateGamerTimestamp($user_id);
                    $this->db->updateBulletsHash(hash("sha256", $this->v4_UUID()));
                } 
                break;            
            case 9:
                if($gamer && ($gamer->timer - $gamer->reload_timestamp)>($gamer->reloadSpeed * 1000)){
                    $dx = cos($angle);
                    $dy = sin($angle);
                    $this->db->addBullet($user_id, $x+0.3*$dx, $y+0.3*$dy, $dx, $dy, 9);
                    $this->db->updateGamerTimestamp($user_id);
                    $this->db->updateBulletsHash(hash("sha256", $this->v4_UUID()));
                }
                break;             
        }
        return true;
    }
}