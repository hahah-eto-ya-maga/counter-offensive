<?php

class GameMath 
{

    


    function calculateAngle($x1, $y1, $x2, $y2)
    {
        return atan2($y1 - $y2, $x1 - $x2);
    }

    function movePoint($x, $y, $angle, $distance) {
        $newX = $x + $distance * cos($angle);
        $newY = $y + $distance * sin($angle);
    
        return array($newX, $newY);
    }

    function calculateShiftPoint($x1, $y1, $x2, $y2, $distance) {
        $dx = $x2 - $x1;
        $dy = $y2 - $y1;
    
        $distanceBetweenPoints = sqrt($dx * $dx + $dy * $dy);
    
        $factor = $distance / $distanceBetweenPoints;
    
        return array($x1 + $dx * $factor, $y1 + $dy * $factor);
    }

    function calculateDistance($x1, $x2, $y1, $y2){
        return sqrt(pow(($x1 - $x2),2) + pow(($y1 - $y2),2));
    }
    function shootReg($x, $y, $x1, $y1, $x2, $y2, $area) {
        
        $A = $x - $x1;
        $B = $y - $y1;
        $C = $x2 - $x1;
        $D = $y2 - $y1;

        $dot = $A * $C + $B * $D;
        $len_sq = $C * $C + $D * $D;
        $param = -1;
        if ($len_sq != 0) {
                $param = $dot / $len_sq;
        }
        $xx = $yy = 0;

        if ($param < 0) {
            $xx = $x1;
            $yy = $y1;
        } else if ($param > 1) {
            $xx = $x2;
            $yy = $y2;
        } else {
            $xx = $x1 + $param * $C;
            $yy = $y1 + $param * $D;
        }

        $dx = $x - $xx;
        $dy = $y - $yy;
        $sqrt = sqrt($dx * $dx + $dy * $dy);
        if ($sqrt<=$area){
            return $x*$x1 + $y*$y1;
        }
        return false;
        
    }
}