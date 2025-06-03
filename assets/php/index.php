<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

if (ob_get_level()) {
    ob_end_clean();
}

require "vendor/autoload.php";

if (file_exists("rest/authorization.php")) {
    require "rest/authorization.php";
}

Flight::set('flight.debug', true);

Flight::map('error', function($ex) {
    error_log("Flight Error: " . $ex->getMessage() . " in " . $ex->getFile() . " on line " . $ex->getLine());
    
    Flight::json([
        'error' => true,
        'message' => 'Internal server error',
        'debug' => Flight::get('flight.debug') ? [
            'message' => $ex->getMessage(),
            'file' => $ex->getFile(),
            'line' => $ex->getLine()
        ] : null
    ], 500);
});

Flight::route('OPTIONS /*', function() {
    Flight::response()->header('Access-Control-Allow-Origin', '*');
    Flight::response()->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    Flight::response()->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    Flight::response()->status(200);
});

Flight::map('start', function() {
    Flight::response()->header('Access-Control-Allow-Origin', '*');
    Flight::response()->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    Flight::response()->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
});

$routeFiles = [
    "rest/routes/middleware_routes.php",
    "rest/routes/product_routes.php",
    "rest/routes/user_routes.php",
    "rest/routes/cart_routes.php",
    "rest/routes/auth_routes.php"
];

foreach ($routeFiles as $routeFile) {
    if (file_exists($routeFile)) {
        require $routeFile;
    } else {
        error_log("Route file not found: " . $routeFile);
        echo "Error: Route file not found: " . $routeFile . "<br>";
    }
}


Flight::route("GET /web", function() {
    Flight::response()->status(200);
    Flight::response()->header('Content-Type', 'text/plain');
    Flight::response()->write("GET REQ RADI - Web route working!");
    Flight::response()->send();
});

Flight::route("GET /test", function() {
    Flight::response()->status(200);
    Flight::response()->header('Content-Type', 'application/json');
    Flight::response()->write(json_encode([
        "message" => "API is working", 
        "timestamp" => date('Y-m-d H:i:s'),
        "route" => "/test"
    ]));
    Flight::response()->send();
});

Flight::route("GET /", function() {
    Flight::response()->status(200);
    Flight::response()->header('Content-Type', 'text/plain');
    Flight::response()->write("Root route works!");
    Flight::response()->send();
});

Flight::start();