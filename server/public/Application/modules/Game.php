<?php

class Game {
    private $db;

    function __construct($db) {
        $this->db = $db;
    }

    private function moveBullet($params) {
        $x2 = $params['x2'] + cos($params['angle']);
        $y2 = $params['y2'] + sin($params['angle']);
        $this->db->updateBullet($params['x2'], $x2, $params['y2'], $y2, $params['id']);  
    }

    private function shootReg($params) {
        
    }

    private function update() {
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