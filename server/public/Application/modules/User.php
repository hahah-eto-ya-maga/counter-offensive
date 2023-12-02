<?php
    class User{

        protected $db;

        public function __construct($db){
            $this->db = $db;
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