<?php

class Game
{
    private $db;

    function __construct($db)
    {
        $this->db = $db;
    }

    function v4_UUID()
    {
        return sprintf(
            '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
            // 32 bits for the time_low
            mt_rand(0, 0xffff),
            mt_rand(0, 0xffff),
            // 16 bits for the time_mid
            mt_rand(0, 0xffff),
            // 16 bits for the time_hi,
            mt_rand(0, 0x0fff) | 0x4000,

            // 8 bits and 16 bits for the clk_seq_hi_res,
            // 8 bits for the clk_seq_low,
            mt_rand(0, 0x3fff) | 0x8000,
            // 48 bits for the node
            mt_rand(0, 0xffff),
            mt_rand(0, 0xffff),
            mt_rand(0, 0xffff)
        );
    }

    

    public function move($user_id, $x, $y)
    {
         $this->db->updateMove($user_id, $x, $y);
         $hash = hash("sha256", $this->v4_UUID());
         $this->db->updateHashGamers($hash);
       return true;
    }
    
}