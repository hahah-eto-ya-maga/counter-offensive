<?php
require_once("modules/DB.php");
require_once("modules/User.php");

class Application{

    protected $user;
    public $dbError;

    function __construct(){
        $db = new DB();
        $this->dbError = $db->dbStatus;
        $this->user = new User($db);
    }
    

    function registration($params){
        $login = $params['login'] ?? false;
        $password = $params['hash'] ?? false;
        
        if($login && $password){
            $pattern = '/^[\p{L}\p{N}][\p{L}\p{N}_-]{5,16}$/u';
            if(preg_match($pattern, $login)){
                return $this->user->registration($login, $password);
            }
            return array(false,413);    
        }
        return array(false, 400);
    }


    function login($params){
        $login = $params['login'] ?? false;
        $password = $params['hash'] ?? false;
        $rnd = $params['rnd'] ?? false;
        
        if($login && $password && $rnd){
            return $this->user->login($login, $password, $rnd);
        }
        return array(false, 400);
    }

    function logout($params){
        $login = $params['login'] ?? false;
        $token = $params['token'] ?? false;
        
        if($login && $token){
            return $this->user->logout($login, $token);
            
        }
        return array(false, 400);
    }


    function tokenVerification($params){
        $login = $params['login'] ?? false;
        $token = $params['token'] ?? false;

        if($login && $token){
            return $this->user->tokenVerification($login, $token);
        }
        return array(false, 400);
    }


    function updatePassword($params){
        $login = $params['login'] ?? false;
        $token = $params['token'] ?? false;
        $hash = $params['hash'] ?? false;
 
        if($login && $token && $hash){
            return $this->user->updatePassword($login, $token, $hash);
        }
        return array(false, 400);
    }
}