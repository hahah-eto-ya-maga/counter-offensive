<?php
require_once('BaseModule.php');

class Game extends BaseModule 
{
    function __construct($db) {
        parent::__construct($db);
    }

    private function update() {

        $time = $this->db->getTime();
        if ($time->nowTime - $time->timestamp >= $time->timeout)
            return true;
        return false;
        // взять текущее время time()
        // взять $timestamp из БД
        // если time() - $timestamp >= $timeout (взять из БД)
        // то обновить сцену и $timestamp = time()
    }

    function getPlayers() {
        return [];
    }

    function getScene($userId, $hashPlayers) {
        if ($this->update())
            return true; 
        $result = array();
        $hashes = $this->db->getHashes();
        if ($hashes->hashU !== $hashPlayers) {
            $result['players'] = $this->getPlayers();
            $result['hashPlayers'] = $hashes->hashPlayers;
        }
        if ($hashes->hashPlayers !== $hashPlayers) {
            $result['players'] = $this->getPlayers();
            $result['hashPlayers'] = $hashes->hashPlayers;
        }
        if ($hashes->hashPlayers !== $hashPlayers) {
            $result['players'] = $this->getPlayers();
            $result['hashPlayers'] = $hashes->hashPlayers;
        }
        if ($hashes->hashPlayers !== $hashPlayers) {
            $result['players'] = $this->getPlayers();
            $result['hashPlayers'] = $hashes->hashPlayers;
        }
        if ($hashes->hashPlayers !== $hashPlayers) {
            $result['players'] = $this->getPlayers();
            $result['hashPlayers'] = $hashes->hashPlayers;
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

    function deleteDead()
    {
        $this->db->deleteDead();
        $hash = hash("sha256", $this->v4_UUID());
        $this->db->updateHashGamers($hash);
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