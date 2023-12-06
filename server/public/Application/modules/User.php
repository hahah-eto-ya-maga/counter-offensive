<?php
require_once('BaseModule.php');

    class User extends BaseModule {

        public function __construct($db){
            parent::__construct($db);
        }

        function registration($login, $nickname, $password)
        {
            $token = hash('sha256', $this->v4_UUID());
            $checkUser = $this->db->getUserByLogin($login);
            if(!$checkUser){
                $this->db->addUser($login, $nickname, $password, $token); 
                $user = $this->db->getUserByToken($token);
                $this->db->addGamer($user->id);
                $rank = $this->db->getRankById($user->id);
                return array(
                    'id'=>$user->id,
                    'token'=>$token,
                    'login'=>$login,
                    'nickname'=>$nickname,
                    'rank_name'=>$rank->rank_name,
                    'gamer_exp'=>$rank->gamer_exp,
                    'next_rang'=>$rank->next_rang,
                    'level'=>$rank->level
                );
            }
            return array(false, 460);
        }

        function login($login, $hash, $rnd)
        {
            $token = hash('sha256', $this->v4_UUID());
            $user = $this->db->getUserByLogin($login);
            if($user != null && $user->login != null){
                $hashS = hash('sha256', $user->password.$rnd); // Хэш штрих. Строка сгенерированая с помощью хранящейсяв базе хэш-суммы
                if($hash == $hashS){
                    $rank = $this->db->getRankById($user->id);
                    $this->db->updateToken($user->id, $token);
                    return array(
                        'id'=>$user->id,
                        'token'=>$token,
                        'login'=>$login,
                        'nickname'=>$user->nickname,
                        'rank_name'=>$rank->rank_name,
                        'gamer_exp'=>$rank->gamer_exp,
                        'next_rang'=>$rank->next_rang,
                        'level'=>$rank->level
                    );
                }
                return array(false, 403);
            }
            return array(false, 461);
        }

        function logout($token){
            $user = $this->db->getUserByToken($token);
            if($user != null && $user->token != 0 && $user->token != null){
                    $this->db->deleteToken($user->id);
                    return true;
            }
            return array(false, 401);
        }


        function tokenVerification($token){
            $user = $this->db->getUserByToken($token);
            if($user != null && $user->token != 0 && $user->token != null){
                $this->db->updateToken($user->id, $token);
                return true;
            }
            return array(false, 401);
        }

        function updatePassword($token, $hash){
            $user = $this->db->getUserByToken($token);
            if($user != null && $user->token != 0 && $user->token != null){
                $this->db->updateToken($user->id, $token);
                $this->db->updatePassword($user->id, $hash);
                return true;
            }
            return array(false, 401); 
        }

        function getUser($token){
            return $this->db->getUserByToken($token);
        }
    }