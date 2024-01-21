<?php
require_once('./Application/modules/BaseModule.php');
require_once('GameMath.php');

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
    private $deleteBullets;
    private $lowerGamersHp;
    private $lowerMobsHp;
    private $lowerTanksHp;
    private $lowerObjectsHp;
    private $updateBullets;
    private $updateExp;
    private $map;
    private $gameMath;
    function __construct($db) {
        parent::__construct($db);
        $this->gameMath = new GameMath();
    }

    /* Fire */

    private function tankFire($user_id, $gamer, $x, $y, $angle){
        $tank = $this->db->getTankByGunnerId($user_id);
        if($tank && ($gamer->timer - $tank->reload_timestamp)>($gamer->reloadSpeed * 1000)){
            $dx = cos($angle);
            $dy = sin($angle);
            $this->db->addBullet($user_id, $x+3*$dx, $y+3*$dy, $dx, $dy, 1);
            $this->db->updateTankTimestamp($user_id);
            $this->db->updateBulletsHash(hash("sha256", $this->v4_UUID()));
        }
    }

    private function infantryFire($user_id, $gamer, $x, $y, $angle, $bulletType){
        if($gamer && ($gamer->timer - $gamer->reload_timestamp)>($gamer->reloadSpeed * 1000)){
            $dx = cos($angle);
            $dy = sin($angle);
            $this->db->addBullet($user_id, $x+$dx, $y+$dy, $dx, $dy, $bulletType);
            $this->db->updateGamerTimestamp($user_id);
            $this->db->updateBulletsHash(hash("sha256", $this->v4_UUID()));
        }
    }

    /*Math*/
    

    /*Map*/

    function fillMap(){
        // Заполнение карты
        $this->map = array_fill(0, 120, array_fill(0, 150, 0));

        foreach ($this->objects as $object) {
            for ($i = $object->x; $i < $object->x + $object->sizeX + 1; $i++) {
                for ($j = $object->y; $j < $object->y + $object->sizeY + 1; $j++) {
                    $this->map[$i][$j] = 1;
                }
            }
        }

        // foreach ($this->map as $row) {
        //     foreach ($row as $value) {
        //         echo $value . " ";
        //     }
        //     echo "\n";
        // }
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
                $this->db->addMobs(rand(8, 9),rand(10, 30), rand(10, 30), 8);
            }
            $this->hashFlagMobs = true;
        }
    }

    private function mobFire($x, $y, $angle, $personId){
        $dx = cos($angle);
        $dy = sin($angle);
        $bulletType = $personId == 9 ? 1 : 0;
        $this->db->addBullet(-1, $x+$dx, $y+$dy, $dx, $dy, $bulletType);
        $this->hashFlagBullets = true;
    }

    private function findTargetGamer($mob, $mobX, $mobY) {
        $minDistanceToGamer = 10000;
        $targetGamer = null;
        $targetDistance = null;
        if($mob->personId == 9){
            $gamers = $this->gamers + $this->tanks;
        } else $gamers = $this->gamers;
        foreach($gamers as $gamer){
            $distance = $this->gameMath->calculateDistance($gamer->x, $mobX, $gamer->y, $mobY);
            if($distance < $minDistanceToGamer)
                $targetGamer = $gamer;
                $targetDistance = $distance; 
        }
        return array($targetGamer, $targetDistance);
    }

    private function mobAction($mob, $mobX, $mobY, $angle){
        if ($this->game->timer - $mob->timestamp > $mob->reloadSpeed * 1000){
            $this->mobFire($mobX, $mobY, $angle, $mob->personId);  
            $this->db->rotateMob($angle, $mob->id);   
            $this->db->updateMobTimestamp($mob->id); 
        }
    }

    private function moveMobs() {
        if(!$this->gamers && !$this->tanks)
            return 0;
        foreach($this->mobs as $mob){
            $mobX=$mob->x;
            $mobY=$mob->y;
            if($this->game->timer - $mob->path_update > 1000){
                $target = $this->findTargetGamer($mob, $mobX, $mobY);
                $targetGamer = $target[0];
                $targetDistance = $target[1];
                if($targetDistance && $targetGamer && $targetDistance<15){
                    if($targetDistance<2)
                    {
                        $angle = $this->gameMath->calculateAngle($targetGamer->x, $targetGamer->y, $mobX, $mobY);
                        $this->mobAction($mob, $mobX, $mobY, $angle);
                        continue;
                    }
                    $path = $this->EasyAStar($this->map, [ceil($mobX), ceil($mobY)], [ceil($targetGamer->x), ceil($targetGamer->y)]);
                    if(!$path)
                        continue;
                    $this->db->setMobPath($mob->id, json_encode($path));
                    $angle = $this->gameMath->calculateAngle($targetGamer->x, $targetGamer->y, $mobX, $mobY);
                    $this->mobAction($mob, $mobX, $mobY, $angle);
                } else continue; //случай когда игрок далеко и мобы просто двигаются к нему
            }
            else {
                $path = $this->db->getMobPath($mob->id);
                if($path){
                    $path = json_decode($path->path);
                    if($path && count($path)>0) {
                        $targetCoord = $path[count($path)-1];
                        $angle = $this->gameMath->calculateAngle($targetCoord[0], $targetCoord[1], $mobX, $mobY);
                        $this->mobAction($mob, $mobX, $mobY, $angle);
                    } else continue;
                } else continue;
            }
            $distance = $mob->movementSpeed * ($this->game->timeout / 1000);
            $distance = $distance > 1 ? 1:$distance;
            $distanceToNextCell = $this->gameMath->calculateDistance($mobX, $path[1][0], $mobY, $path[1][1]);            
            $newDistance = $distance - $distanceToNextCell;
            if($newDistance>0){
                $newCoords = $this->gameMath->calculateShiftPoint($path[1][0], $path[1][1], $path[2][0], $path[2][1], $newDistance);    
            }
            else{
                $newCoords = $this->gameMath->calculateShiftPoint($mobX, $mobY, $path[1][0], $path[1][1], $distance);    
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
            $this->deleteBullets[] = $id;
        } else {
            $x2 = $x + $dx;
            $y2 = $y + $dy;
            $this->updateBullets[] = ['id'=>$id, 'x1'=>$x, 'y1'=>$y, 'x2'=>$x2, 'y2'=>$y2];
        }
    }

    private function shootRegs(){
        
        if (!$this->bullets){
            return 0;
        }
        foreach($this->bullets as $bullet){
            $currentHp = 0;
            $damage = $bullet->type == 0 ? 2 : 50; // Определение урона в зависимости от типа пули
            $shootFlag = false;
            foreach($this->gamers as $gamer){
                if(!$bullet->user_id!=$gamer->id || $gamer->hp>0){
                    $range = $this->gameMath->shootReg($gamer->x, $gamer->y, $bullet->x1, $bullet->y1, $bullet->x2, $bullet->y2, 0.2);
                    if($range){
                        $currentHp = $gamer->hp-$damage;
                        $this->lowerGamersHp[]= ['id'=>$gamer->id, 'hp'=>$currentHp];
                        $this->deleteBullets[] = $bullet->id;
                        $shootFlag = true;
                        if($currentHp<=0 && $bullet->user_id != -1){
                            $this->updateExp[] = ['id'=>$bullet->user_id, 'exp'=>-5];
                        }
                        break;
                    }
                }
            }
            if(!$shootFlag){
                foreach($this->tanks as $tank){
                $range = $this->gameMath->shootReg($tank->x, $tank->y, $bullet->x1, $bullet->y1, $bullet->x2, $bullet->y2, 0.5);
                if($range){
                    $currentHp = $tank->hp-$damage;
                    $this->lowerTanksHp[]= ['id'=>$tank->id, 'hp'=>$currentHp];
                    $this->deleteBullets[] = $bullet->id;
                    $shootFlag = true;
                    if($currentHp<=0 && $bullet->user_id != -1){
                        $this->updateExp[] = ['id'=>$bullet->user_id, 'exp'=>-5];
                    }
                    break;
                }
                }
            }
            
            if(!$shootFlag){
                foreach($this->mobs as $mob){
                    $range = $this->gameMath->shootReg($mob->x, $mob->y, $bullet->x1, $bullet->y1, $bullet->x2, $bullet->y2, 0.2);
                    if($range){
                        $currentHp = $mob->hp-$damage;
                        $this->lowerMobsHp[]= ['id'=>$mob->id, 'hp'=>$currentHp];
                        $this->deleteBullets[] = $bullet->id;
                        $shootFlag = true;
                        if($currentHp<=0 && $bullet->user_id != -1){
                            $this->updateExp[] = ['id'=>$bullet->user_id, 'exp'=>10];
                        }
                        break;
                    }
                }
            }
            if(!$shootFlag){
                foreach($this->objects as $object){
                    if(($bullet->x2>=$object->x && $bullet->x2<=$object->x+$object->sizeX) && ($bullet->y2>=$object->y && $bullet->y2<=$object->y+$object->sizeY)){
                        if($object->status != 'i'){ // Проверка на разрушаемость объекта, i - неразрушаем
                            $this->lowerObjectsHp[]= ['id'=>$object->id, 'hp'=>$object->hp-$damage];
                        }
                        $this->deleteBullets[] = $bullet->id;
                        $shootFlag = true;                
                        break;
                    }
            }
            }
        }
    }

    /* Удаление мертвецов */

    private function checkDead(){
        $gamers = array();
        $mobs = array();
        $objects = array();
        $bodies = array();
        foreach($this->gamers as $gamer){
            if($gamer->hp <= 0){
                $gamers[] = $gamer->id;      
                $bodies[] = array('x'=>$gamer->x, 'y'=>$gamer->y, 'angle'=>$gamer->angle, 'type'=>0, 'isMob'=>0);
            }
        }
        foreach($this->mobs as $mob){
            if($mob->hp <= 0){ 
                $mobs[] = $mob->id;      
                $bodies[] = array('x'=>$mob->x, 'y'=>$mob->y, 'angle'=>$mob->angle, 'type'=>0, 'isMob'=>1);
            }
        }
        foreach($this->tanks as $tank){
            if($tank->hp <= 0){
                $this->db->killTank($tank->id);
                if($tank->commander_id) {
                    $this->db->killGamerInHeavyTank($tank->driver_id, $tank->gunner_id, $tank->commander_id);
                    $bodies[] = array('x'=>$tank->x, 'y'=>$tank->y, 'angle'=>$tank->angle, 'type'=>1, 'isMob'=>0);
                    $bodies[] = array('x'=>$tank->x, 'y'=>$tank->y, 'angle'=>$tank->tower_angle,  'type'=>3, 'isMob'=>0);
                }
                else { 
                    $this->db->killGamerInMiddleTank($tank->driver_id, $tank->gunner_id); 
                    $bodies[] = array('x'=>$tank->x, 'y'=>$tank->y, 'angle'=>$tank->angle, 'type'=>1, 'isMob'=>0);
                    $bodies[] = array('x'=>$tank->x, 'y'=>$tank->y, 'angle'=>$tank->tower_angle,  'type'=>4, 'isMob'=>0);
                }
                $this->hashFlagGamers = true;
            }
        }
        foreach($this->objects as $object){
            if($object->hp <= 0){
                $objects[] = $object->id;      
            }
        }
        if($gamers){
            count($gamers)==1 ? $this->db->killGamer($gamers[0]) : $this->db->killGamersById($gamers);
            $this->hashFlagGamers = true;
        }
        if($objects){
            count($objects)==1 ? $this->db->killObject($objects[0]) : $this->db->killObjectsById($objects);
            $this->hashFlagMap = true;
        }
        if($mobs){
            count($mobs)==1 ? $this->db->killMob($mobs[0]) : $this->db->deleteMobsById($mobs);
            $this->hashFlagMobs = true;
        }
        if($bodies){
            $this->db->setBodies($bodies);
            $this->hashFlagBodies = true;
        }
    }

    
    

    /* Конец игры */

    private function playerBannermanInZone(){
        $bannerman = $this->db->getBannerman();
        if (!$bannerman){
            if ($this->game->pBanner_timestamp != 0){
                $this->db->updatePlayerBannermanTimestamp(0);
                $this->game->pBanner_timestamp = 0;
            }
            return false;
        }
        $dist = $this->gameMath->calculateDistance($bannerman->x, $bannerman->mobBaseX, $bannerman->y, $bannerman->mobBaseY);
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

    /*  Обновление данных */
    private function lowerGamersHp(){
        if($this->lowerGamersHp)
            $this->db->damageGamers($this->lowerGamersHp);
    }

    private function lowerObjectsHp(){
        if($this->lowerObjectsHp)
            $this->db->damageObjects($this->lowerObjectsHp);
    }

    private function lowerTanksHp(){
        if($this->lowerTanksHp)
            $this->db->damageTanks($this->lowerTanksHp);
    }
    private function lowerMobsHp(){
        if($this->lowerMobsHp)
            $this->db->damageMobs($this->lowerMobsHp);
    }

    private function updateBullets(){
        if($this->updateBullets)
            $this->db->moveBullets($this->updateBullets);
    }

    private function deleteBullets(){
        if($this->deleteBullets)
            count($this->deleteBullets)==1 ? $this->db->deleteBullet($this->deleteBullets[0]):$this->db->deleteBulletsById($this->deleteBullets);
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
        $this->updateBullets();
        $this->deleteBullets();
        // Понижение хп
        $this->lowerObjectsHp();
        $this->lowerGamersHp();
        $this->lowerTanksHp();
        $this->lowerMobsHp();
        // Проверка знаменосца
        $this->endGame();
        // Смерть сущности
        $this->checkDead();
        // Обновление хешей
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

        
        $result['gametime'] = $this->game->timer - $this->game->startGameTimestamp;

        if(in_array($gamer->person_id, array(1, 2, 8, 9))){
            $result['gamer'] = array(
                'person_id' => $gamer->person_id,
                'x' => $gamer->x,
                'y' => $gamer->y,
                'angle' => $gamer->angle,
                'hp' => $gamer->hp
            );
        } else{
            $tank = $this->db->getTankByUserId($userId);
            if($tank && in_array($gamer->person_id, array(3, 4, 5, 6, 7))){
                $result['gamer'] = array(
                    'person_id' => $gamer->person_id,
                    'x' => $tank->x,
                    'y' => $tank->y,
                    'angle' => $tank->angle,
                    'tower_angle' => $tank->tower_angle,
                    'hp' => $tank->hp
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
            $result['mobBase']['mobBase_x'] = $this->game->mobBase_x;
            $result['mobBase']['mobBase_y'] = $this->game->mobBase_y;
            $result['mobBase']['base_radius'] = $this->game->base_radius;
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

        if(!$gamer) return true;

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
        elseif(in_array($gamer->person_id, array(1, 2, 8, 9))) {
            if (is_numeric($x) && is_numeric($y) && is_numeric($angle)) {
                $this->db->updateMotion($userId, $x, $y, $angle);
                $this->db->updateGamersHash(hash("sha256", $this->v4_UUID()));
            } else return array(false, 422);
        }
        return true;
    }

    function fire($user_id, $x, $y, $angle){
        $gamer = $this->db->getGamerAndPersonByUserId($user_id);
        if(!$gamer) return true;

        if(in_array($gamer->person_id, array(3, 7))) {
            $this->tankFire($user_id, $gamer, $x, $y, $angle);
        } else if($gamer->person_id === 9) {
            $this->infantryFire($user_id, $gamer,$x, $y, $angle, 1);
        } else if($gamer->person_id === 8) {
            $this->infantryFire($user_id, $gamer, $x, $y, $angle, 0);
        } else if($gamer->person_id === 1) {
            $this->infantryFire($user_id, $gamer, $x, $y, $angle, 0);
        };
        return true;
    }
}