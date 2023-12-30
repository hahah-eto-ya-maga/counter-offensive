<?php
require_once('BaseModule.php');


class Chat extends BaseModule 
{

    function __construct($db)
    {
        parent::__construct($db);
    }

    public function sendMessage($userId, $message)
    {
        $this->db->addMessage($userId, $message);
        $hash = hash("sha256", $this->v4_UUID());
        $this->db->updateChatHash($hash);
        return true;
    }

    public function getMessages($oldHash, $userId)
    {
        $hash = $this->db->getGame();
        if ($hash->chatHash !== $oldHash) {
            $messages = $this->db->getMessages($userId);
            return array("messages" => $messages, "chatHash" => $hash->chatHash);
        }
        return true;
    }
    
}