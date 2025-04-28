<?php

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

Flight::route("/*", function() {
    if(strpos(Flight::request()->url, "/auth/login") === 0 || strpos(Flight::request()->url, "/auth/register") === 0) {
        return TRUE;
    } else {
        // throw new Exception("This works correctly, testing log error", 502);
        try {
            $token = Flight::request()->getHeader("Authentication");
            if(!$token) {
                Flight::halt(500, "Missing Auth Header");
            }
            $decoded_token = JWT::decode($token, new Key(Config::JWT_SECRET(), "HS256"));
    
            Flight::set("user", $decoded_token->user);
            Flight::set("jwt_token", $token);
            return TRUE;
    
        } catch(\Exception $e) {
            Flight::halt(401, $e->getMessage()); // errori vezani za provjeru tokena, token expired, pogresan jwt_secret...
        }
    }
});

// using this, we can have a log of errors to help up debug in general
Flight::map("error", function($e) {
    file_put_contents("logs.txt", $e . PHP_EOL, FILE_APPEND | LOCK_EX);

    Flight::halt($e->getCode(), $e->getMessage());
    Flight::stop($e->getCode());
});