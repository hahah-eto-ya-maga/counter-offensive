<?php
    header("Access-Control-Allow-Origin: *");
    header('Content-Type: application/json; charset=utf-8');
    date_default_timezone_set("UTC");

    require_once('Application/Answer.php');
    require_once('Application/Application.php');

    function request($params){  
        $method = $params['method']??false;
        if($method) {
            $app = new Application();
            if($app->dbStatus){
                switch($method){
                    // User
                    case 'registration': return $app->registration($params);
                    case 'login': return $app->login($params);
                    case 'logout': return $app->logout($params);
                    case 'tokenVerification': return $app->tokenVerification($params);
                    case 'updatePassword': return $app->updatePassword($params);
                    // Chat
                    case 'sendMessage': return $app->sendMessage($params);
                    case 'getMessages': return $app->getMessages($params);
                    // Lobby
                    case "setGamerRole": return $app->setGamerRole($params);
                    case "getLobby": return $app->getLobby($params);
                    case "suicide": return $app->suicide($params);
                    //Game
                    case 'motion': return $app->motion($params);
                    case "getScene": return $app->getScene($params);
                    case "fire": return $app->fire($params);
                } 
                return array(false, 501);
            }
            return array(false, 503);
        }
        return array(false, 405);
    }

    echo json_encode(Answer::response(request($_GET)));

