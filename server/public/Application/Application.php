<?php
require_once("modules/DB.php");
require_once("modules/User.php");
require_once("modules/Chat.php");

class Application
{

    protected $user;
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

        if ($login && $password && $nickname) {
            $pattern = '/^[\p{L}\p{N}][\p{L}\p{N}_-]{5,14}$/u';
            if (preg_match($pattern, $login) && preg_match($pattern, $nickname)) {
                return $this->user->registration($login, $nickname, $password);
            }
            return array(false, 413);
        }
        return array(false, 400);
    }


    function login($params)
    {
        $login = $params['login'] ?? false;
        $password = $params['hash'] ?? false;
        $rnd = $params['rnd'] ?? false;

        if ($login && $password && $rnd) {
            return $this->user->login($login, $password, $rnd);
        }
        return array(false, 400);
    }

    function logout($params)
    {
        $login = $params['login'] ?? false;
        $token = $params['token'] ?? false;

        if ($login && $token) {
            return $this->user->logout($login, $token);

        }
        return array(false, 400);
    }


    function tokenVerification($params)
    {
        $login = $params['login'] ?? false;
        $token = $params['token'] ?? false;

        if ($login && $token) {
            return $this->user->tokenVerification($login, $token);
        }
        return array(false, 400);
    }


    function updatePassword($params)
    {
        $login = $params['login'] ?? false;
        $token = $params['token'] ?? false;
        $hash = $params['hash'] ?? false;

        if ($login && $token && $hash) {
            return $this->user->updatePassword($login, $token, $hash);
        }
        return array(false, 400);
    }

    function sendMessage($params)
    {
        $token = $params['token'] ?? false;
        $message = $params['message'] ?? false;
        if ($token && $message) {
            $pattern = '/^[a-zA-Z0-9\s\.,!?\"\'㋛-]{1,255}$/';
            if (preg_match($pattern, $message)) {
                return $this->chat->sendMessage($token, $message);
            }
            return array(false, 432);
        }
        return array(false, 400);
    }
}