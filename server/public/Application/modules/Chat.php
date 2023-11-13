<?php

class Chat
{
    private $db;

    function __construct($db)
    {
        $this->db = $db;
    }

    public function sendMessage($token, $message)
    {
        $user = $this->db->getUserByToken($token);

        if (isset($user)) {
            if(isset($message) && $message != '' && trim($message) != ''){
            if (strlen($message) <= 200) {
                $this->db->addMessage($user->id, trim($message));
                $hash = hash("sha256", rand(1, 100000001));
                $this->db->updateChatHash($hash);
                return true;
            }
            else {
                return array(false, 411);
            }
        } else{
            return array(false, 204);
        }
             
        }
        return array(false, 461);
    }
}