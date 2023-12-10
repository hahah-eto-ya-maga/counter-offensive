<?php
require_once('BaseModule.php');

class Game extends BaseModule 
{

    private $mobs;
    private $gamers;

    private $game;

    function __construct($db) {
        parent::__construct($db);
        
    }

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

    private function calculateAngle($targetX, $targetY, $mobX, $mobY){
        $deltaX = $targetX - $mobX;
        $deltaY = $targetY - $mobY;

        $angleRadians = atan($deltaY / $deltaX);
        return rad2deg($angleRadians);
    }

    private function moveMobs() {
        if(!$this->gamers)
            return 0;
        foreach($this->mobs as $mob){
            $mobX=$mob->x;
            $mobY=$mob->y;
            $minDistanceToGamer = 10000;
            $targetGamer = null;
            foreach($this->gamers as $gamer){
                if(in_array($gamer->person_id, array(3, 4, 5, 6, 7)))
                    continue;
                if(sqrt(pow(($gamer->x + $mobX),2) + pow(($gamer->y + $mobY),2)) < $minDistanceToGamer)
                    $targetGamer = $gamer;
                }
            $map = array_fill(0, 120, array_fill(0, 150, 0));
            print_r([$mobX, $mobY]);
            print_r([$targetGamer->x, $targetGamer->y]);
            $path = $this->EasyAStar($map, [$mobX, $mobY], [$targetGamer->x, $targetGamer->y]);
            print_r($path[0]);
            $angle = $this->calculateAngle($targetGamer->x, $targetGamer->y, $mobX, $mobY);
            $this->db->moveMob($path[1][0], $path[1][1], $angle, $mob->id);
            $this->fire($targetGamer->x, $targetGamer->y);
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
        if ($time->timer - $time->timestamp >= $time->timeout)
            $this->updateScene();
        // взять текущее время time()
        // взять $timestamp из БД
        // если time() - $timestamp >= $timeout (взять из БД)
        // то обновить сцену и $timestamp = time()
    }

    private function getGamers() {
        return [];
    }

    private function getMobs() {
        return [];
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