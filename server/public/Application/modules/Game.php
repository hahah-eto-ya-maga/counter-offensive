<?php
require_once('BaseModule.php');

class Game extends BaseModule 
{

    private $mobs;
    private $gamers;    
    private $tanks;
    private $game;

    private $bullets;
    private $timer;
    private $timeout;

    private $map;

    function __construct($db) {
        parent::__construct($db);
        $this->map = array_fill(0, 120, array_fill(0, 150, 0));
    }

    /*Math*/
    function calculateAngle($x1, $y1, $x2, $y2)
    {
        return atan2($y1 - $y2, $x1 - $x2);
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
            // print($this->duration);
            if($this->timer - $mob->path_update > 1000){
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
                        // $this->fire(-1, $targetGamer->x, $targetGamer->y, $angle);            
                        continue;
                    }
                    $path = $this->EasyAStar($this->map, [ceil($mobX), ceil($mobY)], [ceil($targetGamer->x), ceil($targetGamer->y)]);
                    $this->db->setMobPath($mob->id, json_encode($path));
                    $angle = $this->calculateAngle($targetGamer->x, $targetGamer->y, $mobX, $mobY);
                    $this->fire(-1, $targetGamer->x, $targetGamer->y, $angle);            
                }
                else continue;
            }
            else {
                $path = json_decode($this->db->getMobPath($mob->id)->path);
                $targetCoord = $path[count($path)-1];
                $angle = $this->calculateAngle($targetCoord[0], $targetCoord[1], $mobX, $mobY);
                // $this->fire(-1, $targetCoord[0], $targetCoord[0], $angle);            
            }
            $distance = $mob->movementSpeed * ($this->timeout / 1000);
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

    function fire($user_id, $x, $y, $angle){
        $this->db->addBullet($user_id, $x, $y, round($angle,1));
        $this->db->updateBulletsHash(hash("sha256", $this->v4_UUID()));
    }

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
            $this->db->updateBulletsHash($x, $y, $x2, $y2, $id);
        }
    }

    private function crossing($x0, $y0, $x1, $y1, $x2, $y2,){

    }

    private function shootRegs(){
        if (!$this->bullets){
            return 0;
        }
        if(!$this->gamers){
            foreach($this->bullets as $bullet){
                $this->shootReg($bullet->id, $bullet->x1, $bullet->y1, $bullet->x2, $bullet->y2);
            }
        }

        
    }
    private function shootReg($id, $x1, $y1, $x2, $y2) {
        foreach($this->gamers as $gamer){
            $A = $gamer->x - $x1;
            $B = $gamer->y - $y1;
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
            
            $dx = $gamer->x - $xx;
            $dy = $gamer->y - $yy;

            if (sqrt($dx * $dx + $dy * $dy)<=0.2){
                // Сюда запихиваем метод по уменьшению у геймера $gamer->id
                $this->db->deleteBullet($id);
            }
        }
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

    /* Получение данных */

    private function getGamers() {
        return $this->db->getGamers();
    }

    private function getMobs() {
        return $this->db->getAllMobs();
    }

    private function getBullets() {
        return $this->db->getBullets();
    }

    private function getTanks() {
        return $this->db->getTanks();
    }

    // Обновление сцены

    private function updateScene(){
        $this->bullets = $this->db->getBullets();
        $this->gamers = $this->db->getFootGamers(); 
        $this->mobs = $this->db->getMobs(); 
        $this->tanks = $this->db->getTanks();
        // Мобы
        $this->addMobs();
        $this->moveMobs();
        // Пули
        $this->moveBullets();
        //$this->shootRegs();
        // Смерть сущности
        $this->checkDead();
    }

    private function update() {
        $time = $this->db->getTime();
        $this->timer = $time->timer;
        $this->timeout = $time->timeout;
        if ($time->timer - $time->timestamp >= $time->timeout)
            $this->db->updateTimestamp($time->timer);
            $this->updateScene();
    }

    function getScene($userId, $hashGamers, $hashMobs, $hashBullets) { 
        $this->update();
        $result = array();
        $hashes = $this->db->getHashes();
        if ($hashes->hashGamers !== $hashGamers) {
            $result['gamers'] = $this->getGamers();
            $result['hashGamers'] = $hashes->hashGamers;
        }
        if ($hashes->hashMobs !== $hashMobs) {
            $result['mobs'] = $this->getMobs();
            $result['hashMobs'] = $hashes->hashMobs;
        }
        if ($hashes->hashBullets !== $hashBullets) {
            $result['bullets'] = $this->getBullets();
            $result['hashBullets'] = $hashes->hashBullets;
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
    
    public function rotate($user_id, $angle)
    {
         $this->db->updateRotate($user_id, $angle);
         $hash = hash("sha256", $this->v4_UUID());
         $this->db->updateGamersHash($hash);
       return true;
    }

}


// получить все данные из базоньки
        // юзеров
        // мобов
        // пули
        // объекты
        // позиция базы

        // посчитать конец игры  Миша
        // в game сделать поле, в котором буквально считать время, проведённое знаменосцем на точке базы
        // если игра закончилась, в getScene возвращать флаг endGame = true

        // юзеров, которые умерли, удалить из базоньки Артур

        // раздавить блоки, которые оказались под танками Ваня

        // передвинуть пули   Костя
        // переместить вообще все пули, имеющиеся в сцене
        // для каждой пули хранить: её автора, её текущие координаты, вектор движения, тип пули, старые координаты

        // посчитать коллизии пуль Костя
        // попадание пули всчитывается по отрезку её текущих координат и старых координат
        // все элементы сцены или кружочки, или + прямоугольники
        // учитывать, куда или в кого пуля попала первой

        // разрушить блоки, если надо Ваня
        // уменьшить ХП блока, если он < 0 - разрушить его

        // убить юзеров и мобов, если они умерли Артур
        // юзеру выставляется флаг, что он умер
        // моб удаляется с карты (вместо него положить трупик?)

        // переместить мобов Никита
        // найти ближайшего игрока, которого может убить моб (РПГ или автоматик)
        // повернуться к игроку и сделать шаг к нему
        // с помощью easystar найти путь до ближайшего игрока с учётом препятствий

        // выстрелить мобами по игрокам Никита
        // Вариант 1. Стрелять по игроку всегда
        // Вариант 1.5 НЕ стрелять, если между игроком и мобом есть свои
        // Вариант 2. Стрелять по игроку, учитывая его направление движения и скорость (с упреждением)
        // Вариант 3. Учитывать препятствия до игрока

        // создать новых мобов Никита
        // если мобов меньше, чем надо - добавить новых

    
    
