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


        function registration($login, $nickname, $password){
            $tokenLastUse = date('Y-m-d H:i:s');
            $timeCreate = $tokenLastUse;
            $token = hash('sha256', $this->v4_UUID());
            
            $checkUser = $this->db->getUserByLogin($login);
            if(!$checkUser){
                $this->db->addUser($login, $nickname, $password, $token, $tokenLastUse, $timeCreate); 
                return array(
                    'login'=>$login,
                    'nickname'=>$nickname,
                    'token'=>$token
                );
            }
            return array(false, 460);
        }


        function login($login, $hash, $rnd){
            $token = hash('sha256', $this->v4_UUID());
            $tokenLastUse = date('Y-m-d H:i:s');
            
            $user = $this->db->getUserByLogin($login);
            if($user != null && $user->login != null){
                $hashS = hash('sha256', $user->password.$rnd); // Хэш штрих. Строка сгенерированая с помощью хранящейсяв базе хэш-суммы
                if($hash == $hashS){
                    $this->db->updateToken($user->id, $tokenLastUse, $token);
                    return array(
                        'login'=>$user->login,
                        'nickname'=>$user->nickname,
                        'token'=>$token
                    );
                }
                return array(false, 403);
            }
            return array(false, 461);
        }


        function logout($login, $token){
            $tokenLastUse = date('Y-m-d H:i:s');
            
            $user = $this ->db-> getUserByLogin($login);
            if($user != null && $user->login != null){
                if($user->token != null && $user->token == $token && $user->token != 0){
                    $this->db->deleteToken($user->id, $tokenLastUse);
                    return true;
                }
                return array(false, 401); //неверный токен для этого пользователя
            }
            return array(false, 461);
        }
    

        function tokenVerification($login, $token){
            $tokenLastUse = date('Y-m-d H:i:s');
    
            $user = $this->db->getUserByLogin($login);
            if($user != null && $user->login != null){
                if($user->token != null && $user->token == $token && $user->token != 0){
                    $this->db->updateToken($user->id, $tokenLastUse, $token);
                    return true;
                }
                else return array(false, 401); //неверный токен для этого пользователя
            }
            else return array(false, 461);
        }


        function updatePassword($login, $token, $hash){
            $tokenLastUse = date('Y-m-d H:i:s');
     
            $user = $this->db->getUserByLogin($login);
            if($user != null && $user->login != null){
                if($user->token != null && $user->token == $token && $user->token != 0){
                    $this->db->updateToken($user->id, $tokenLastUse, $token);
                    $this->db->updatePassword($user->id, $hash);
                    return true;
                }
                else return array(false, 401); //неверный токен для этого пользователя
            }
            else return array(false, 461); 
        }


        function getUser($token){
            $tokenLastUse = date('Y-m-d H:i:s');
     
            $user = $this->db->getUserByToken($token);
            if($user != null && $user->token != 0 && $user->token != null){
                $this->db->updateToken($user->id, $tokenLastUse, $token);
                return array(
                    'login'=> $user->login,
                    'nickname'=> $user->nickname,
                    'token'=>$token
                );
            }
            else return array(false, 401); 
        }
    }