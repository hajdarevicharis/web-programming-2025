<?php

require_once __DIR__ . "/../services/CartService.class.php";

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

Flight::set("cart_service", new CartService());

/**
 * @OA\Post(
 *      path="/cart_products",
 *      tags={"cart"},
 *      summary="Add product to cart",
 *      security={{"ApiKey":{}}},
 *      @OA\RequestBody(
 *          @OA\JsonContent(
 *              required={"user_id", "product_id", "product_size", "product_quantity"},
 *              @OA\Property(property="user_id", type="integer", example=1),
 *              @OA\Property(property="product_id", type="integer", example=5),
 *              @OA\Property(property="product_size", type="string", example="M"),
 *              @OA\Property(property="product_quantity", type="integer", example=2)
 *          )
 *      ),
 *      @OA\Response(
 *           response=200,
 *           description="Product added to cart"
 *      )
 * )
 */
Flight::route('POST /cart_products', function() {
    $input = json_decode(file_get_contents('php://input'), true);
    
    error_log("Cart POST data: " . print_r($input, true));
    
    if (!$input) {
        Flight::json(['error' => 'Invalid JSON data'], 400);
        return;
    }
    
    $required_fields = ['user_id', 'product_id', 'product_size', 'product_quantity'];
    foreach ($required_fields as $field) {
        if (!isset($input[$field])) {
            Flight::json(['error' => "Missing field: $field"], 400);
            return;
        }
    }
    
    try {
        Flight::json([
            'success' => true,
            'message' => 'Product added to cart successfully',
            'data' => $input
        ]);
        
    } catch (Exception $e) {
        error_log("Cart error: " . $e->getMessage());
        Flight::json(['error' => 'Failed to add product to cart'], 500);
    }
});

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
    try {
        $data = Flight::get("cart_service")->get_all_carts();
        Flight::json($data);
    } catch (Exception $e) {
        Flight::halt(500, "Error fetching carts: " . $e->getMessage());
    }
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
    if (!$cart_id || !is_numeric($cart_id)) {
        Flight::halt(400, "Invalid cart ID");
        return;
    }
    
    try {
        $data = Flight::get("cart_service")->get_cart_products($cart_id);
        Flight::json($data["data"]);
    } catch (Exception $e) {
        Flight::halt(500, "Error fetching cart products: " . $e->getMessage());
    }
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
    if (!$user_id || !is_numeric($user_id)) {
        Flight::halt(400, "Invalid user ID");
        return;
    }
    
    try {
        $data = Flight::get("cart_service")->get_user_cart_products($user_id);
        Flight::json($data);
    } catch (Exception $e) {
        Flight::halt(500, "Error fetching user cart products: " . $e->getMessage());
    }
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
    if (!$cart_id || !is_numeric($cart_id)) {
        Flight::halt(400, "Invalid cart product ID");
        return;
    }
    
    try {
        Flight::get("cart_service")->delete_cart_product($cart_id);
        Flight::json(["message" => "You have successfully deleted a cart product"]);
    } catch (Exception $e) {
        Flight::halt(500, "Error deleting cart product: " . $e->getMessage());
    }
});

?>