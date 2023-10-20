<?php
    header("Access-Control-Allow-Origin: *");
    header('Content-Type: application/json; charset=utf-8');

    require_once('Application/Answer.php');
    require_once('Application/Application.php');

    $login = isset($_GET["login"]) ? $_GET["login"] : false;
    $hash = isset($_GET["hash"]) ? $_GET["hash"] : false;
    $token = isset($_GET["token"]) ? $_GET["token"] : false;
    $method = isset($_GET["method"]) ? $_GET["method"] : false;
    $rnd = isset($_GET["rnd"]) ? $_GET["rnd"] : false;
    $newPassword = isset($_GET["newPassword"]) ? $_GET["newPassword"] : false;


    $answer = new Answer();

    $params = array(
        'login' => $login,
        'hash' => $hash,
        'token' => $token,
        'rnd' => $rnd,
        'method' => $method,
        'newPassword' => $newPassword
    );

    function request($params){  
        $method = $params['method'];
        $App = new Application();
        if($method){
            switch($method){
                case 'registration': return $App->registration($params);
                case 'login': return $App->login($params);
                case 'logout': return $App->logout($params);
                case 'tokenVerification': return $App->tokenVerification($params);
                case 'getAllInfo': return $App->getAllInfo($params);
                case 'updatePassword': return $App->updatePassword($params);


            }
            return array(false, 501);
        }
        return array(false, 405);
    }

    echo json_encode($answer->response(request($params)));