<?php
class DB{
    public $link;
    function __construct(){
        $user = getenv('MYSQL_USER');
        $password = getenv('MYSQL_PASSWORD');
        $host = getenv('MYSQL_HOST');
        $port = (int)getenv('MYSQL_PORT');
        $database = getenv('MYSQL_DATABASE');
        
        $this -> link = new mysqli($host, $user, $password, $database, $port);
    }

}