<?php
require_once('./Application/modules/BaseModule.php');

    class Lobby extends BaseModule{

        private $lobbyState;

        public function __construct($db){
            parent::__construct($db);
            $this->lobbyState = array(
                "general" => true,
                "bannerman" => true
                );
        }

        private function addTank($tank, $is_middle=false){
            foreach($tank as $tankMan){
                switch($tankMan->person_id){
                    case 3:
                        $gunnerId = $tankMan->user_id; 
                        break;
                    case 4:
                        $driverId = $tankMan->user_id; 
                        break;    
                    case 5:
                        $commanderId = $tankMan->user_id; 
                        break;
                    case 6:
                        $driverId = $tankMan->user_id; 
                        break;
                    case 7:
                        $gunnerId = $tankMan->user_id; 
                        break;
                    }
            }
            if($is_middle) $this->db->addMiddleTank($driverId, $gunnerId, 250);
            else $this->db->addHeavyTank($driverId, $gunnerId, $commanderId, 400);
        }

        private function checkTanks()
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
                        $this->addTank($usersByTank[$tankKey]);
                        $this->db->deleteTank($tankKey);
                        break;
                    }
                    array_push($result['heavyTank'], $heavyTank); 
                }

                else if(in_array($usersByTank[$tankKey][0]->person_id, array(6, 7))){
                    if($middleTank["Gunner"] && $middleTank["Mechanic"]){
                        $this->addTank($usersByTank[$tankKey], true);
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
            foreach($lobby as $role) {
                switch($role->person_id){
                    case 1: 
                        if($role->experience < $gamerRank->gamer_exp) 
                            $this->lobbyState['general'] = true;
                        else
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
                if($this->db->checkLiveGamer())
                    $this->db->setStartGameTimestamp();
                $this->db->setGamerRole($userId, $roleId, 8);
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
                if($this->db->checkLiveGamer())
                    $this->db->setStartGameTimestamp();
                $this->db->setGamerRole($userId, $roleId, 8);
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
            if(!$nowPerson || in_array($roleId, array(3, 4, 5, 6, 7))){
                if(($gamerRank->level>=$minPersonLevel->level)){
                    $hashLobby = hash('sha256', $this->v4_UUID());
                    $this->db->updateLobbyHash($hashLobby);    
                    if(in_array($roleId, array(3, 4, 5, 6, 7))){
                        $setRole = $this->setTankRole($userId, $roleId, $tankId);
                        return $setRole;
                    }
                    $this->db->deleteGamerInTank($userId);
                    if($this->db->checkLiveGamer())
                        $this->db->setStartGameTimestamp();
                    $this->db->setGamerRole($userId, $roleId, 8);
                    return true;
                }
                return array(false, 234);
            }
            else if($nowPerson->user_id != $userId){
                if($roleId==1){
                    if($gamerRank->level<$minPersonLevel->level)
                        return array(false, 234);
                    if ($gamerRank->gamer_exp>$nowPerson->experience){
                        $this->db->deleteRole($roleId);
                        $this->db->deleteGamerInTank($userId);
                        if($this->db->checkLiveGamer())
                            $this->db->setStartGameTimestamp();
                        $this->db->setGamerRole($userId, $roleId, 8);
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
            if(in_array($role, array(1, 2))){
                return $this->setRoleHandler($role, $userId);
            }
            else if(in_array($role, array(3, 4, 5, 6, 7)))
                return $this->setRoleHandler($role, $userId, $tankId);
            else if(in_array($role, array(8, 9)))
            {
                $this->db->deleteGamerInTank($userId);
                if($this->db->checkLiveGamer())
                    $this->db->setStartGameTimestamp();
                $this->db->setGamerRole($userId, $role, 8);
                $this->db->setStartGameTimestamp();
                $hashLobby = hash('sha256', $this->v4_UUID());
                $this->db->updateLobbyHash($hashLobby);
                return true;
            }
            return array(false, 463);
        }

        private function getGamer($userId){
            $gamer = $this->db->getGamerById($userId);
            if($gamer->person_id != -1){
                if(in_array($gamer->person_id, array(3, 4, 5, 6, 7))){
                    $tank = $this->db->getTankByUserId($userId);
                    if($tank){
                        return array("personId" => $gamer->person_id, "x"=>$tank->x, "y"=>$tank->y,
                        "angle"=>$tank->angle, "towerAngle"=>$tank->tower_angle,
                        "commanderAngle"=>$tank->commander_angle);
                    }
                    else return false;
                }
                return array("personId"=>$gamer->person_id, "x"=>$gamer->x,
                "y"=>$gamer->y, "angle"=>$gamer->angle);
            }
            else return false;
        }   

        function getLobby($userId, $oldHash){
            $hash = $this->db->getGame();       
            if ($hash->hashLobby !== $oldHash) {
                $this->checkRoleAvailability($userId);
                $tanks = $this->checkTanks();
                $rank = $this->db->getRankById($userId);
                $this->lobbyState['userInfo'] = array(
                    'rank_name'=>$rank->rank_name,
                    'gamer_exp'=>$rank->gamer_exp,
                    'next_rang'=>$rank->next_rang
                );
                $this->lobbyState['tanks'] = $tanks;
                $this->lobbyState['is_alive'] = $this->getGamer($userId);
                return array("lobby" => $this->lobbyState,"lobbyHash" => $hash->hashLobby);
            }
            return true;
        }

        function suicide($userId){
            $gamer = $this->db->getGamerById($userId);
            $tank=$this->db->getTankByUserId($userId);
            if($tank){
                switch($gamer->person_id){
                    case 3:
                        $this->db->suicide($tank->commander_id);
                        $this->db->suicide($userId);
                        $this->db->suicide($tank->driver_id);
                        $this->db->endTankGame($tank->id);
                        break;
                    case 4:
                        $this->db->suicide($tank->commander_id);
                        $this->db->suicide($tank->gunner_id);
                        $this->db->suicide($userId);
                        $this->db->endTankGame($tank->id);
                        break;            
                    case 5:
                        $this->db->suicide($tank->driver_id);
                        $this->db->suicide($tank->gunner_id);                        
                        $this->db->suicide($userId);
                        $this->db->endTankGame($tank->id);
                        break;            
                    case 6:
                        $this->db->suicide($tank->gunner_id);
                        $this->db->suicide($userId);
                        $this->db->endTankGame($tank->id);
                        break; 
                    case 7:
                        $this->db->suicide($tank->driver_id);
                        $this->db->suicide($userId);
                        $this->db->endTankGame($tank->id);
                        break; 
                }
            }
            else $this->db->suicide($userId);
            $this->db->updateLobbyHash(hash('sha256', $this->v4_UUID()));
            return true;
        }
        
    }


