<?php

require_once __DIR__ . '/config.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

function authorize() {
    try {
        $token = Flight::request()->getHeader("Authorization");
        if(!$token) {
            Flight::halt(500, "Missing Auth Header");
        }
        $decoded_token = JWT::decode($token, new Key(Config::JWT_SECRET(), "HS256"));
        // Flight::json([
        //     "jwt_decoded" => $decoded_token,
        //     "user" => $decoded_token->user
        // ]);
    } catch(\Exception $e) {
        Flight::halt(401, $e->getMessage()); // errori vezani za provjeru tokena, token expired, pogresan jwt_secret...
    }
}