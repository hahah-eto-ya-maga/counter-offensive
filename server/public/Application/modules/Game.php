<?php

class Game
{
    private $db;

    public function __construct($db)
    {
        $this->db = $db;
    }

    function UpdateUserStatus($userId, $status){
        $this->db->UpdateUserStatus($userId, $status);
        return true;
    }

    function updateGamerHp($userId, $hp) {
        $this->db->updateGamerHp($userId, $hp);
        return true;
    }

    function updateGamerExp($userId, $exp) {
        $this->db->updateGamerExp($userId, $exp);
        return true;
    }

    function updateGamerMoney($userId, $money) {
        $this->db->updateGamerMoney($userId, $money);
        return true;
    }
}