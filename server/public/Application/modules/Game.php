<?php
require_once('BaseModule.php');

class Game extends BaseModule 
{

    private $mobs;
    private $gamers;

    private $game;

    private $timer;
    private $timeout;

    private $map;

    function __construct($db) {
        parent::__construct($db);
        $this->map = array_fill(0, 120, array_fill(0, 150, 0));
    }


    // // метод заполнения карты объектами
//     private function pullMap(){
//         foreach($this->objects as $object){
//             for($i)
//             $this->map[$object->y][$object->x] = 1;
//         }
//     }


    private function fire($x, $y){

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
                        // $this->fire();
                        continue;
                    }
                    $path = $this->EasyAStar($this->map, [ceil($mobX), ceil($mobY)], [ceil($targetGamer->x), ceil($targetGamer->y)]);
                    $this->db->setMobPath($mob->id, json_encode($path));
                    $angle = $this->calculateAngle($targetGamer->x, $targetGamer->y, $mobX, $mobY);
                }
                else continue;
            }
            else {
                print('qewqweqwe'."\n");
                $path = json_decode($this->db->getMobPath($mob->id)->path);
                $targetCoord = $path[count($path)-1];
                $angle = $this->calculateAngle($targetCoord[0], $targetCoord[1], $mobX, $mobY);
            }
            $distance = $mob->movementSpeed * ($this->timeout / 1000);
            $distance = $distance > 1 ? 1:$distance;
            $distanceToNextCell = $this->calculateDistance($mobX, $path[1][0], $mobY, $path[1][1]);            
            $newDistance = $distance - $distanceToNextCell;
            // print_r($newDistance);
            if($newDistance>0){
                $newCoords = $this->calculateShiftPoint($path[1][0], $path[1][1], $path[2][0], $path[2][1], $newDistance);    
                
            }
            else{
                $newCoords = $this->calculateShiftPoint($mobX, $mobY, $path[1][0], $path[1][1], $distance);    
            }

            $this->db->moveMob($newCoords[0], $newCoords[1], $angle, $mob->id);
            // $this->fire($targetGamer->x, $targetGamer->y);
        }
    }

    private function updateScene(){
        $this->gamers = $this->db->getGamers(); 
        $this->mobs = $this->db->getMobs(); 
        $this->addMobs();
        $this->moveMobs();
    }

    private function update() {

        $time = $this->db->getTime();
        $this->timer = $time->timer;
        $this->timeout = $time->timeout;
        if ($time->timer - $time->timestamp >= $time->timeout)
            $this->db->updateTimestamp($time->timer);
            $this->updateScene();
    }

    private function getGamers() {
        return [];
    }

    private function getMobs() {
        return $this->db->getAllMobs();
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