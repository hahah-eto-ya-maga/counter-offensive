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
}