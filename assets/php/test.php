<?php
// Create this as simple_test.php in your assets/php folder
require "vendor/autoload.php";

Flight::route('GET /simple', function(){
    echo "Simple test works!";
});

Flight::route('/', function(){
    echo "Simple root works!";
});

Flight::start();