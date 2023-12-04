<?php
    class Lobby{

        protected $db;

        private $lobbyState;

        public function __construct($db){
            $this->db = $db;
            $this->lobbyState = array(
                "general" => array(
                        "occupied" => false,
                        "available" => false
                    ),
                "bannerman" => array(
                        "occupied" => false,
                    ),
                "heavyTank" => array(
                    "commander" => false,
                    "mechanic" => false,
                    "gunner" => false
                    ),
                "middleTank" => array(
                    "gunner" => false,
                    "mechanic" => false,
                    ),
                "infantryRPG" => false
                );
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

        function checkTanks($userId)
        {
            $tankmans = $this->db->getTankmans();
            $usersByTank = [];
            foreach ($tankmans as $tankman){ 
                $tankId = $tankman->tank_id;
                if (!isset($usersByTank[$tankId])) 
                    $usersByTank[$tankId] = [];
                array_push($usersByTank[$tankId], $tankman);
            }
            $result['heavyTank'] = [];
            $result['middleTank'] = [];
            $tankKeys = array_keys($usersByTank);
            
            foreach($tankKeys as $tankKey){
                $heavyTank = array(
                    "id" => $tankKey,
                    "Gunner" => false,
                    "Mechanic" => false,
                    "Commander" => false
                );
                $middleTank = array(
                    "id" => $tankKey,
                    "Mechanic" => false,
                    "Gunner" => false
                );
                foreach($usersByTank[$tankKey] as $user){
                    switch($user->person_id){
                        case 3:
                            $heavyTank["Gunner"] = true;
                            break;
                        case 4:
                            $heavyTank["Mechanic"] = true;
                            break;
                        case 5:
                            $heavyTank["Commander"] = true;
                            break;
                        case 6:
                            $middleTank["Mechanic"] = true;
                            break;
                        case 7:
                            $middleTank["Gunner"] = true;
                            break;
                    }
                }
                if(in_array($usersByTank[$tankKey][0]->person_id, array(3, 4, 5)))
                    array_push($result['heavyTank'], $heavyTank); 
                    if(isset($tank["Commander"]) && isset($tank["Gunner"]) && 
                    isset($tank["Mechanic"])) $this->db->deleteTank($tankKey);
                    
                else if(in_array($usersByTank[$tankKey][0]->person_id, array(6, 7))){
                    array_push($result['middleTank'], $middleTank);
                    if(isset($tank["Gunner"]) && isset($tank["Mechanic"])) $this->db->deleteTank($tankKey);
                }                    
            }
            return $result;
        }

        function checkRoleOccupied($lobby){
            foreach($lobby as $role) {
                $personId = $role->person_id;
                switch($personId){
                    case 1: 
                        $this->lobbyState['general']['occupied'] = true;
                        break;
                    case 2: 
                        $this->lobbyState['bannerman']['occupied'] = true;
                        break;
                }
            }
        }

        function checkRoleAvailability($gamerRank, $persons){
            foreach($persons as $person) {
                switch($person->person_id){
                    case 1: 
                        $this->lobbyState['general']['available'] = $gamerRank->level >= $person->level ?  true : false;
                        break;
                    case 3: 
                        $this->lobbyState['heavyTank']['gunner'] = $gamerRank->level >= $person->level ?  true : false;
                        break;
                    case 4: 
                        $this->lobbyState['heavyTank']['mechanic'] = $gamerRank->level >= $person->level ?  true : false;
                        break;
                    case 5: 
                        $this->lobbyState['heavyTank']['commander'] = $gamerRank->level >= $person->level ?  true : false;
                        break;  
                    case 6: 
                        $this->lobbyState['middleTank']['gunner'] = $gamerRank->level >= $person->level ?  true : false;
                        break;                   
                    case 7: 
                        $this->lobbyState['middleTank']['mechanic'] = $gamerRank->level >= $person->level ?  true : false;
                        break;
                    case 9: 
                        $this->lobbyState['infantryRPG'] = $gamerRank->level >= $person->level ?  true : false;
                        break;    
                    }
            }
        }

        function setTankRole($userId, $roleId, $tankId){
            if(!$tankId || !is_numeric($tankId)) return array(false, 239); // Не указан номер танка 
            $tank = $this->db->getTankById($tankId);
            if (!$tank){
                $this->db->deleteGamerInTank($userId);
                $this->db->setTank($userId, $roleId, $tankId);
                $this->db->setGamerRole($userId, $roleId);
                $hashLobby = hash('sha256', $this->v4_UUID());
                $this->db->updateLobbyHash($hashLobby);
                return true;
            }
            $is_free = true;
            $checkTankId = $tank[0]->person_id;
            if((in_array($roleId, array(3, 4, 5)) && in_array($checkTankId, array(6, 7))) ||
            (in_array($roleId, array(6, 7)) && in_array($checkTankId, array(3, 4, 5)))) return array(false, 240);
            foreach($tank as $seat)
                if($seat->person_id == $roleId) $is_free=false;
            if ($is_free){
                $this->db->deleteGamerInTank($userId);
                $this->db->setTank($userId, $roleId, $tankId);
                $this->db->setGamerRole($userId, $roleId);
                $hashLobby = hash('sha256', $this->v4_UUID());
                $this->db->updateLobbyHash($hashLobby);
                return true;
            }
            else return array(false, 238);            
        }

        function setRoleHandler($roleId, $userId, $tankId=null){
            $nowPerson = $this->db->getPerson($roleId);
            $gamerRank = $this->db->getRankById($userId);
            $minPersonLevel = $this->db->getMinPersonLevelById($roleId);
            if(!$nowPerson || in_array($roleId, array(3, 4, 5, 6, 7, 9))){
                if(($gamerRank->level>=$minPersonLevel->level)){
                    $hashLobby = hash('sha256', $this->v4_UUID());
                    $this->db->updateLobbyHash($hashLobby);    
                    if(in_array($roleId, array(3, 4, 5, 6, 7))){
                        $setRole = $this->setTankRole($userId, $roleId, $tankId);
                        return $setRole;
                    }
                    $this->db->deleteGamerInTank($userId);
                    $this->db->setGamerRole($userId, $roleId);
                    return true;
                }
                return array(false, 234);
            }
            else if($nowPerson->user_id != $userId){
                if($roleId==1){
                    if ($gamerRank->gamer_exp>$nowPerson->experience){
                        $this->db->deleteRole($roleId);
                        $this->db->deleteGamerInTank($userId);
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

        function setGamerRole($role, $userId, $tankId){
            switch($role){
                case 'general': return $this->setRoleHandler(1, $userId);
                case 'bannerman': return $this->setRoleHandler(2, $userId);
                case 'heavyTankGunner': return $this->setRoleHandler(3, $userId, $tankId);                        
                case 'heavyTankMeh': return $this->setRoleHandler(4, $userId, $tankId);                
                case 'heavyTankCommander': return $this->setRoleHandler(5, $userId, $tankId);                        
                case 'middleTankMeh': return $this->setRoleHandler(6, $userId, $tankId);
                case 'middleTankGunner': return $this->setRoleHandler(7, $userId, $tankId);
                case 'infantryRPG': return $this->setRoleHandler(9, $userId, $tankId); 
                case 'infantry': 
                    {
                    $this->db->setGamerRole($userId, 8);
                    $hashLobby = hash('sha256', $this->v4_UUID());
                    $this->db->updateLobbyHash($hashLobby);
                    return true;
                }
            }
            return array(false, 463);
        }

        function getLobby($role, $userId, $oldHash){
            $hash = $this->db->getLobbyHash();       
            if ($hash->hashLobby !== $oldHash) {
                $lobby = $this->db->getLobby();
                $gamerRank = $this->db->getRankById($userId);
                $persons = $this->db->getPersons();
                $this->checkRoleOccupied($lobby);
                $this->checkRoleAvailability($gamerRank, $persons);
                $tanks = $this->checkTanks($userId);
                return array("lobby" => $this->lobbyState,"tanks" => $tanks, "lobbyHash" => $hash->hashLobby);
            }
            return true;
        }

        
    }


