<?php
require_once('BaseModule.php');

class Game extends BaseModule 
{

    private $mobs;
    private $gamers;

    private $game;

    private $duration;

    private $bullets;

    function __construct($db) {
        parent::__construct($db);
    }


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

    private function calculateAngle($targetX, $targetY, $mobX, $mobY){
        $deltaX = $targetX - $mobX;
        $deltaY = $targetY - $mobY;

        $angleRadians = atan($deltaY / $deltaX);
        return rad2deg($angleRadians);
    }

    function calculateShiftPoint($x1, $y1, $x2, $y2, $distance) {
        $dx = $x2 - $x1;
        $dy = $y2 - $y1;
    
        $distanceBetweenPoints = sqrt($dx * $dx + $dy * $dy);
    
        $factor = $distance / $distanceBetweenPoints;
    
        return array($x1 + $dx * $factor, $y1 + $dy * $factor);
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
            if($this->duration > 500){
                foreach($this->gamers as $gamer){
                    if(in_array($gamer->person_id, array(3, 4, 5, 6, 7)))
                        continue;
                    $distance = sqrt(pow(($gamer->x + $mobX),2) + pow(($gamer->y + $mobY),2));
                    if($distance < $minDistanceToGamer)
                        $targetGamer = $gamer;
                        $targetDistance = $distance; 
                }
                $map = array_fill(0, 120, array_fill(0, 150, 0));
                if($targetDistance && $targetGamer && $targetDistance<50){
                    $path = $this->EasyAStar($map, [ceil($mobX), ceil($mobY)], [ceil($targetGamer->x), ceil($targetGamer->y)]);
                    $this->db->setMobPath($mob->id, json_encode($path));
                    $angle = $this->calculateAngle($targetGamer->x, $targetGamer->y, $mobX, $mobY);
                }
                else continue;
            }
            else {
                $path = json_decode($this->db->getMobPath($mob->id)->path);
                $targetCoord = $path[count($path)-1];
                $angle = $this->calculateAngle($targetCoord[0], $targetCoord[1], $mobX, $mobY);
            }
            $distance = $mob->movementSpeed * ($this->duration / 1000);
            $distance = $distance > 1 ? 1:$distance;
            $newCoords = $this->calculateShiftPoint($mobX, $mobY, $path[1][0], $path[1][1], $distance);
            $this->db->moveMob($newCoords[0], $newCoords[1], $angle, $mob->id);
//            $this->fire($targetGamer->x, $targetGamer->y);
        }
    }

    private function updateScene(){
        $this->bullets = $this->db->getBullets();
        $this->gamers = $this->db->getGamers(); 
        $this->mobs = $this->db->getMobs(); 
        $this->addMobs();
        $this->moveMobs();
        $this->moveBullets();
    }

    private function update() {

        $time = $this->db->getTime();
        $this->duration = $time->timer - $time->timestamp;
        if ($this->duration >= $time->timeout)
            $this->updateScene();
    }

    private function getGamers() {
        return [];
    }

    private function getMobs() {
        return $this->db->getAllMobs();
    }

    function fire($user_id, $x, $y, $angle){
        $this->db->addBullet($user_id, $x, $y, $angle);
    }

    private function moveBullets(){
        if (!$this->bullets){
            return 0;
        }
        foreach($this->bullets as $bullet){
            $this->moveBullet($bullet->id, $bullet->x2, $bullet->y2, $bullet->angle);
        }
    }
    
    private function moveBullet($id, $x, $y, $angle) {
        if ($x>=120 || $x<=0 || $y>=150 || $y<=0){
            $this->db->deleteBullet($id);
        } else {
            $x2 = $x + 0.02*cos($angle);
            $y2 = $y + 0.02*sin($angle);
            $this->db->updateBullet($x, $y, $x2, $y2, $id);
        }
          
    }




    function getScene($userId, $hashGamers, $hashMobs) { 
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