<?php

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

Flight::route("/*", function() {
    $url = Flight::request()->url;
    
    $publicRoutes = [
        "/auth/login",
        "/users/add",
        "/test",           
        "/web",             
        "/",               
        "/cart_products"   
    ];
    
    foreach ($publicRoutes as $route) {
        if (strpos($url, $route) === 0) {
            return TRUE; 
        }
    }
    
    return requireAuth();
});

Flight::map("error", function($e) {
    file_put_contents("logs.txt", $e . PHP_EOL, FILE_APPEND | LOCK_EX);

    $httpStatusCode = 500; 
    
    switch($e->getCode()) {
        case 404:
            $httpStatusCode = 404;
            break;
        case 401:
            $httpStatusCode = 401;
            break;
        case 403:
            $httpStatusCode = 403;
            break;
        default:
            $httpStatusCode = 500;
            break;
    }

    Flight::halt($httpStatusCode, $e->getMessage());
    Flight::stop($httpStatusCode);
});