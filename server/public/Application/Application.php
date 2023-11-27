<?php
require_once("modules/DB.php");
require_once("modules/User.php");
require_once("modules/Chat.php");

class Application
{

    private $user;
    private $chat;
    public $dbStatus;

    function __construct()
    {
        $db = new DB();
        $this->dbStatus = $db->dbStatus;
        $this->user = new User($db);
        $this->chat = new Chat($db);
    }


    function registration($params)
    {
        $login = $params['login'] ?? false;
        $password = $params['hash'] ?? false;
        $nickname = $params['nickname'] ?? false;
        
        if($login && $password && $nickname){
            $pattern = '/^[\p{L}\p{N}][\p{L}\p{N}_-]{5,14}$/u';
            $pattern1 = '/^.{3,15}$/';
            if(preg_match($pattern, $login) && preg_match($pattern1, $nickname)){
                return $this->user->registration($login, $nickname, $password);
            }
            return array(false,413);    
        }
        return array(false, 400);
    }


    function login($params)
    {
        $login = $params['login'] ?? false;
        $password = $params['hash'] ?? false;
        $rnd = $params['rnd'] ?? false;
        
        if($login && $password && $rnd){
            return $this->user->login($login, $password, $rnd);
        }
        return array(false, 400);
    }

    function logout($params){
        $token = $params['token'] ?? false;
        
        if($token){
            return $this->user->logout($token);
        }
        return array(false, 400);
    }


    function tokenVerification($params){ 
        $token = $params['token'] ?? false;

        if($token){
            return $this->user->tokenVerification($token);
        }
        return array(false, 400);
    }


    function updatePassword($params){
        $token = $params['token'] ?? false;
        $hash = $params['hash'] ?? false;
 
        if($token && $hash){
            return $this->user->updatePassword($token, $hash);
        }
        return array(false, 400);
    }

    function sendMessage($params)
    {
        $token = $params['token'] ?? false;
        $message = trim($params['message']) ?? false;
        if ($token && $message) {
            $pattern = '/^[\p{L}\p{N}0-9\s\.,!?\"\'㋛-]{1,200}$/u';
            if (preg_match($pattern, $message)) {
                $user = $this->user->getUser($token);
                if ($user != null && $user->token != 0 && $user->token != null) {
                    return $this->chat->sendMessage($user->id, $message);
                }
                return array(false, 401);
            }
            return array(false, 432);
        }
        return array(false, 400);
    }

    function getMessages($params) {
        $token = $params['token'] ?? false;
        $hash = $params['hash'] ?? false;
        if ($token && $hash) { 
            $user = $this->user->getUser($token);
            if ($user != null && $user->token != 0 && $user->token != null) {
                return $this->chat->getMessages($hash);
            }
            return array(false, 401);
        }
        return array(false, 400);
    }

    function setGamerRole($params){
        $token = $params['token'] ?? false;
        $role = $params['role'] ?? false;
 
        if($role && $token){
            $user = $this->user->getUser($token);
            if (($user != null && $user->token != 0 && $user->token != null)) {
                return $this->lobby->setGamerRole($token, $role);
            }
            return array(false, 401);
        }  
        return array(false, 400);
    }

    function getLobby($params){
        $token = $params['token'] ?? false;
        $hash = $params['hash'] ?? false;
        if($hash && $token){
            return $this->lobby->getLobby($token, $hash);
        }  
        return array(false, 400);
    }
}