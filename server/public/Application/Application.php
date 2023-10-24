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
                $checkUser = $this -> user -> getUserByLogin($login);
                if(!$checkUser){
                    $addUser = $this -> user -> addUser($login, $password, $token, $tokenLastUse, $timeCreate); 
                    if(!$addUser){
                        return array(false, 462); // Ошибка запроса 
                    }
                    else return array('login'=>$login, 'token'=>$token);
                }
                else return array(false, 460);
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
            $user = $this -> user -> getUserByLogin($login);
            $checkLogin = $user ? $user['login'] : '';
            if($checkLogin != ''){
                $hashPassword = $user ? $user['password'] : '';
                $hashS = hash('sha256', $hashPassword.$rnd); // Хэш штрих. Строка сгенерированая с помощью хранящейсяв базе хэш-суммы
                if($hash == $hashS){
                    $updateToken = $this -> user -> updateToken($login, $token, $tokenLastUse);
                    if(!$updateToken){
                        return array(false, 462); // Ошибка запроса 
                    }
                    else return array('login'=>$login, 'token'=>$token);
                }
                else return array(false, 403);
            }
            else return array(false, 461);
        }
        else return array(false, 400);
    }

    function logout($params){
        $login = $params['login'];
        $token = $params['token'];
        $tokenLastUse = date('Y-m-d H:i:s');
        
        if($login && $token){
            $user = $this -> user -> getUserByLogin($login);
            $checkLogin = $user ? $user['login'] : '';
            if($checkLogin != ''){
                $checkToken = $user ? $user['token'] : '';
                if($checkToken != '' && $checkToken == $token){
                    $deleteToken = $this->user->deleteToken($login, $tokenLastUse);
                    if(!$deleteToken){
                        return array(false, 462); // Ошибка запроса 
                    }
                    else return true;
                }
                else return array(false, 401); //неверный токен для этого пользователя
            }
            else return array(false, 461);
        }
        return array(false, 400);
    }


    function tokenVerification($params){
        $login = $params['login'];
        $token = $params['token'];
        $tokenLastUse = date('Y-m-d H:i:s');

        if($login && $token){
            $user = $this -> user -> getUserByLogin($login);
            $checkLogin = $user ? $user['login'] : '';
            if($checkLogin != ''){
                $checkToken = $user ? $user['token'] : '';
                if($checkToken != '' && $checkToken == $token){
                    $verificateToken = $this->user->updateToken($login, $token, $tokenLastUse);
                    if(!$verificateToken){
                        return array(false, 462); // Ошибка запроса 
                    }
                    else return true;
                }
                else return array(false, 401); //неверный токен для этого пользователя
            }
            else return array(false, 461);
        }
        return array(false, 400);
    }


    function getAllInfo($params){
        $login = $params['login'];
        $token = $params['token'];
        $tokenLastUse = date('Y-m-d H:i:s');

        if($login && $token){
            $user = $this -> user -> getUserByLogin($login);
            $checkLogin = $user ? $user['login'] : '';
            if($checkLogin != ''){
                $checkToken = $user ? $user['token'] : '';
                if($checkToken != '' && $checkToken == $token){
                    $updateToken = $this -> user -> updateToken($login, $token, $tokenLastUse);
                    if(!$updateToken){
                        return array(false, 462); // Ошибка запроса 
                    }
                    $gameCount = $user['gameCount'];
                    $scoreCount = $user['scoreCount'];
                    return array(
                        'gameCount'=>$gameCount,
                        'scoreCount'=>$scoreCount,
                    );
                }
                else return array(false, 401); //неверный токен для этого пользователя
            }
            else return array(false, 461);
        }
        return array(false, 400); 
    }


    function updatePassword($params){
        $login = $params['login'];
        $token = $params['token'];
        $hash = $params['hash'];
        $tokenLastUse = date('Y-m-d H:i:s');
 
        if($login && $token && $hash){
            $user = $this -> user -> getUserByLogin($login);
            $checkLogin = $user ? $user['login'] : '';
            if($checkLogin != ''){
                $checkToken = $user ? $user['token'] : '';
                if($checkToken != '' && $checkToken == $token){
                    $updateToken = $this -> user -> updateToken($login, $token, $tokenLastUse);
                    if(!$updateToken){
                        return array(false, 462); // Ошибка запроса 
                    }
                    $updatePassword = $this -> user -> updatePassword($login, $hash);
                    if(!$updatePassword){
                        return array(false, 462); // Ошибка запроса 
                    }
                    return true;

                }
                else return array(false, 401); //неверный токен для этого пользователя
            }
            else return array(false, 461); 
        }
        return array(false, 400);
    }
}