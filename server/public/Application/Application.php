<?php
require_once("modules/DB.php");
require_once("modules/User.php");
date_default_timezone_set("Europe/Moscow");

class Application{

    protected $user;

    function __construct(){
        $DB = new DB();
        $this->user = new User($DB->link);
    }
    

    function v4_UUID() {
        return sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
          // 32 bits for the time_low
          mt_rand(0, 0xffff), mt_rand(0, 0xffff),
          // 16 bits for the time_mid
          mt_rand(0, 0xffff),
          // 16 bits for the time_hi,
          mt_rand(0, 0x0fff) | 0x4000,
    
          // 8 bits and 16 bits for the clk_seq_hi_res,
          // 8 bits for the clk_seq_low,
          mt_rand(0, 0x3fff) | 0x8000,
          // 48 bits for the node
          mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
        );
      }



    function registration($params){
        $login = $params['login'];
        $password = $params['hash'];
        $token = hash('sha256', $this->v4_UUID());
        $tokenLastUse = date('Y-m-d H:i:s');
        $timeCreate = $tokenLastUse;
        
        if($login && $password){
            $pattern = '/^[\p{L}\p{N}][\p{L}\p{N}_-]{5,16}$/u';
            if(preg_match($pattern, $login)){
                return $this -> user -> registration($login, $password, $token, $tokenLastUse, $timeCreate);
            }   
            else return array(false,413);    
        }
        else return array(false, 400);
    }


    function login($params){
        $login = $params['login'];
        $hash = $params['hash'];
        $rnd = $params['rnd'];
        $token = hash('sha256', $this->v4_UUID());
        $tokenLastUse = date('Y-m-d H:i:s');
        
        if($login && $hash && $rnd){
            return $this -> user -> login($login, $hash, $rnd, $token, $tokenLastUse);
        }
        else return array(false, 400);
    }

    function logout($params){
        $login = $params['login'];
        $token = $params['token'];
        $tokenLastUse = date('Y-m-d H:i:s');
        
        if($login && $token){
            return $this -> user -> logout($login, $token, $tokenLastUse);
        }
        return array(false, 400);
    }


    function tokenVerification($params){
        $login = $params['login'];
        $token = $params['token'];
        $tokenLastUse = date('Y-m-d H:i:s');

        if($login && $token){
            return $this -> user -> tokenVerification($login, $token, $tokenLastUse);
        }
        return array(false, 400);
    }
}