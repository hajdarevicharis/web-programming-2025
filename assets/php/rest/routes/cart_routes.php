<?php

require_once __DIR__ . "/../services/CartService.class.php";

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

Flight::set("cart_service", new CartService());

/**
 * @OA\Get(
 *      path="/cart/all",
 *      tags={"cart"},
 *      summary="Get all carts",
 *      security={
 *          {"ApiKey":{}}
 *      },
 *      @OA\Response(
 *           response=200,
 *           description="Get all carts"
 *      ),
 * )
 */
Flight::route("GET /cart/all", function() {
    $data = Flight::get("cart_service")->get_all_carts();
    Flight::json($data);
});


/**
 * @OA\Get(
 *      path="/cart_products/{cart_id}",
 *      tags={"cart"},
 *      summary="Get all products from a specified cart",
 *      security={
 *          {"ApiKey":{}}
 *      },
 *      @OA\Response(
 *           response=200,
 *           description="Get all cart products"
 *      ),
 *      @OA\Parameter(@OA\Schema(type="number"), in="path", name="cart_id", example="1", description="Cart ID")
 * )
 */
Flight::route("GET /cart_products/@cart_id", function($cart_id) {
    // $payload = Flight::request()->query;
    // Flight::json($payload);
    $data = Flight::get("cart_service")->get_cart_products($cart_id);
    Flight::json($data["data"]);
});


/**
 * @OA\Get(
 *      path="/cart_products/user/{user_id}",
 *      tags={"cart"},
 *      summary="Get all products from a specified user's cart",
 *      security={
 *          {"ApiKey":{}}
 *      },
 *      @OA\Response(
 *           response=200,
 *           description="Get all cart products from a certain user"
 *      ),
 *      @OA\Parameter(@OA\Schema(type="number"), in="path", name="user_id", example="1", description="User ID")
 * )
 */
Flight::route("GET /cart_products/user/@user_id", function($user_id) {
    $data = Flight::get("cart_service")->get_user_cart_products($user_id);
    Flight::json($data);
});

/**
 * @OA\Delete(
 *      path="/cart_products/delete/{cart_id}",
 *      tags={"cart"},
 *      summary="Delete cart by id",
 *      security={
 *          {"ApiKey":{}}
 *      },
 *      @OA\Response(
 *           response=200,
 *           description="Delete the cart with the specified id from the database"
 *      ),
 *      @OA\Parameter(@OA\Schema(type="number"), in="path", name="cart_id", example="1", description="Cart ID")
 * )
 */
Flight::route("DELETE /cart_products/delete/@cart_id", function($cart_id) {
    // $cart_product_id = $_REQUEST["id"]; // passali smo ga u url (?id=id)

    if ($cart_id == NULL || $cart_id == "") {
        // header("HTTP/1.1 500 Bad Request");
        // die(json_encode(["error" => "Invalid cart product id"]));
        Flight::halt(500, "Invalid cart product id");
    }
    
    Flight::get("cart_service")->delete_cart_product($cart_id);
    
    Flight::json(["message" => "you have successfully deleted a cart product"]);
});