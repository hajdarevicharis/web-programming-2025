<?php

require __DIR__ . '/../../../vendor/autoload.php';

($_SERVER["SERVER_NAME"] == "localhost" || $_SERVER["SERVER_NAME"] == "127.0.0.1") &&
define('BASE_URL', 'http://localhost/web-programming-2025/assets/php/');


error_reporting(0);

$openapi = \OpenApi\Generator::scan(['../../../rest/routes', './']);
// $openapi = \OpenApi\Util::finder(['../../../rest/routes', './'], NULL, '*.php');
// $openapi = \OpenApi\scan(['../../../rest', './'], ['pattern' => '*.php']);

header('Content-Type: application/x-yaml');
echo $openapi->toYaml();
?>