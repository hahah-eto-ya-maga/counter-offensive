<?php

class Game extends BaseModule
{

    function __construct($db)
    {
        parent::__construct($db);
    }

    public function move($user_id, $x, $y)
    {
         $this->db->updateMove($user_id, $x, $y);
         $hash = hash("sha256", $this->v4_UUID());
         $this->db->updateHashGamers($hash);
       return true;
    }
    
}