<?php


// Set the reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL ^ (E_NOTICE | E_DEPRECATED));

mysql://w3s0s1dgmmik7z4s:kp2n55ymhi5kemur@ryfqldzbliwmq6g5.chr7pe7iynqr.eu-west-1.rds.amazonaws.com:3306/pd9fwo5sl5gq7bke
class Config
{
   public static function DB_NAME()
   {
       //return 'imperial_clothing'; 
       return 'pd9fwo5sl5gq7bke';
   }
   public static function DB_PORT()
   {
       return  3306;
   }
   public static function DB_USER()
   {
       //return 'root';
       return 'w3s0s1dgmmik7z4s';
   }
   public static function DB_PASSWORD()
   {
       //return '';
       return 'kp2n55ymhi5kemur';
   }
   public static function DB_HOST()
   {
       //return '127.0.0.1';
       return 'ryfqldzbliwmq6g5.chr7pe7iynqr.eu-west-1.rds.amazonaws.com';
   }


   public static function JWT_SECRET() {
       return 'bR8bZT9Y3nJc8V3kL9u3wzE1A2yE9kCw3v0U2Xn5eFq6P2vA7vWq9yTt5q5LmKz'; 
   }
}
