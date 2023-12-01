<?php
    class Lobby{

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

        function setTank($userId, $roleId, $tankId){
            
        }

        function setRoleHandler($roleId, $userId, $tankId=null){
            $nowPerson = $this->db->getPerson($roleId);
            $gamerRank = $this->db->getRankById($userId);
            $minPersonLevel = $this->db->getMinPersonLevelById($roleId);
            if(!$nowPerson){
                if(($gamerRank->level>=$minPersonLevel->level)){    
                    in_array($roleId, array(3, 4, 5, 6, 7)) ? $this->db->setTank($userId, $roleId, $tankId) : $this->db->setGamerRole($userId, $roleId);
                    $hashLobby = hash('sha256', $this->v4_UUID());
                    $this->db->updateLobbyHash($hashLobby);
                    return true;
                }
                return array(false, 234);
            }
            else if($nowPerson->user_id != $userId){
                if($roleId==1){
                    if ($gamerRank->gamer_exp>$nowPerson->experience){
                        $this->db->deleteRole($roleId);
                        $this->db->setGamerRole($userId, $roleId);
                        $hashLobby = hash('sha256', $this->v4_UUID());
                        $this->db->updateLobbyHash($hashLobby);
                        return true;
                    }
                    return array(false, 235);
                }
                return array(false, 237);
            }
            return array(false, 236);

        }

        function setGamerRole($role, $userId, $tankId=null){
            switch($role){
                case 'general': return $this->setRoleHandler(1, $userId);
                case 'bannerman': return $this->setRoleHandler(2, $userId);
                case 'heavyTankGunner': return $this->setRoleHandler(3, $userId, $tankId);                        
                case 'heavyTankMeh': return $this->setRoleHandler(4, $userId, $tankId);                
                case 'heavyTankCommander': return $this->setRoleHandler(5, $userId, $tankId);                        
                case 'middleTankMeh': return $this->setRoleHandler(6, $userId, $tankId);
                case 'middleTankGunner': return $this->setRoleHandler(7, $userId, $tankId);
                case 'infantry': 
                    {
                    $this->db->setGamerRole($userId, 8);
                    $hashLobby = hash('sha256', $this->v4_UUID());
                    $this->db->updateLobbyHash($hashLobby);
                    return true;
                }
                case 'infantryRPG': {
                    $this->db->setGamerRole($userId, 9);
                    $hashLobby = hash('sha256', $this->v4_UUID());
                    $this->db->updateLobbyHash($hashLobby);
                    return true;
                }
            }
            return array(false, 463);
        }
    }


