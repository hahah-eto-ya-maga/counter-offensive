<?php
require_once('BaseModule.php');

    class Lobby extends BaseModule{

        private $lobbyState;

        public function __construct($db){
            parent::__construct($db);
            $this->lobbyState = array(
                "general" => false,
                "bannerman" => true
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
                if(in_array($usersByTank[$tankKey][0]->person_id, array(3, 4, 5))){
                    if($heavyTank["Commander"] && $heavyTank["Gunner"] && 
                    $heavyTank["Mechanic"]){
                        $this->db->deleteTank($tankKey);
                        break;
                    }
                    array_push($result['heavyTank'], $heavyTank); 
                }

                else if(in_array($usersByTank[$tankKey][0]->person_id, array(6, 7))){
                    if($middleTank["Gunner"] && $middleTank["Mechanic"]){
                        $this->db->deleteTank($tankKey);
                        break;
                    }
                    array_push($result['middleTank'], $middleTank);

                }                    
            }
            return $result;
        }

        function checkRoleAvailability($userId){
            $lobby = $this->db->getLobby();
            $gamerRank = $this->db->getRankById($userId);
            $persons = $this->db->getPersons();
            foreach($persons as $person) {
                switch($person->person_id){
                    case 1: 
                        $this->lobbyState['general'] = $gamerRank->level >= $person->level ?  true : false;
                        break;
                    case 3: 
                        $this->lobbyState['gunner'] = $gamerRank->level >= $person->level ?  true : false;
                        break;
                    case 4: 
                        $this->lobbyState['mechanic'] = $gamerRank->level >= $person->level ?  true : false;
                        break;

                    case 9: 
                        $this->lobbyState['infantryRPG'] = $gamerRank->level >= $person->level ?  true : false;
                        break;    
                    }
            }
            foreach($lobby as $role) {
                switch($role->person_id){
                    case 1: 
                        $this->lobbyState['general'] = false;
                        break;
                    case 2: 
                        $this->lobbyState['bannerman'] = false;
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

        function getLobby($userId, $oldHash){
            $hash = $this->db->getHashes();       
            if ($hash->hashLobby !== $oldHash) {
                $this->checkRoleAvailability($userId);
                $tanks = $this->checkTanks($userId);
                $this->lobbyState['tanks'] = $tanks;
                $is_alive = $this->db->getGamerStatus($userId);
                $this->lobbyState['is_alive'] = ($is_alive && $is_alive->status=="alive") ? true : false; 
                return array("lobby" => $this->lobbyState, "lobbyHash" => $hash->hashLobby);
            }
            return true;
        }

        function suicide($userId){
            $this->db->suicide($userId);  
            return true;
        }
        
    }


