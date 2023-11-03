<?php
    header("Access-Control-Allow-Origin: *");
    header('Content-Type: application/json; charset=utf-8');
    date_default_timezone_set("Europe/Moscow");

    require_once('Application/Answer.php');
    require_once('Application/Application.php');

    function request($params){  
        $method = $params['method']??false;
        if($method) {
            $app = new Application();
            if($app->dbError){
                switch($method){
                    case 'registration': return $app->registration($params);
                    case 'login': return $app->login($params);
                    case 'logout': return $app->logout($params);
                    case 'tokenVerification': return $app->tokenVerification($params);
                    case 'updatePassword': return $app->updatePassword($params);
                }
                return array(false, 501);
            }
            return array(false, 503);
            }
        return array(false, 405);
    }

    echo json_encode(Answer::response(request($_GET)));