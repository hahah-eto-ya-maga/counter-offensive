<?php
require_once('BaseModule.php');

class Game extends BaseModule 
{
    function __construct($db) {
        parent::__construct($db);
    }

    private function update() {

        $timestamp = $this->db->getTimestamp();
        $time = $this->db->getNowTime();
        // взять текущее время time()
        // взять $timestamp из БД
        // если time() - $timestamp >= $timeout (взять из БД)
        // то обновить сцену и $timestamp = time()
    }

    function getPlayers() {
        return [];
    }

    function getScene($userId, $hashPlayers) {
        $this->update();
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
}