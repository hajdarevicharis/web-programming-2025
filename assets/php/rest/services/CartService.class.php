<?php

require_once __DIR__ . '/../dao/CartDao.class.php';

class CartService {

    private $cart_dao;

    public function __construct() {
        $this->cart_dao = new CartDao();
    }

    public function get_cart_products($cartId) {
        try {
            $rows = $this->cart_dao->get_cart_products($cartId);
            return [
                'data' => $rows
            ];
        } catch (Exception $e) {
            throw new Exception("Failed to retrieve cart products: " . $e->getMessage());
        }
    }
    
    public function delete_cart_product($cart_product_id) {
        try {
            $this->cart_dao->delete_cart_product($cart_product_id);
        } catch (Exception $e) {
            throw new Exception("Failed to delete cart product: " . $e->getMessage());
        }
    }

    public function get_all_carts() {
        try {
            return $this->cart_dao->get_all_carts();
        } catch (Exception $e) {
            throw new Exception("Failed to retrieve carts: " . $e->getMessage());
        }
    }

    public function get_user_cart_products($userId) {
        try {
            return $this->cart_dao->get_user_cart_products($userId);
        } catch (Exception $e) {
            throw new Exception("Failed to retrieve user cart products: " . $e->getMessage());
        }
    }

    public function add_product_to_cart($cartData) {
        try {
            $requiredFields = ['user_id', 'product_id', 'product_size', 'product_quantity'];
            foreach ($requiredFields as $field) {
                if (!isset($cartData[$field])) {
                    throw new Exception("Missing required field: $field");
                }
            }
            
            $dbData = [
                'userId' => $cartData['user_id'],
                'productId' => $cartData['product_id'],
                'size' => $cartData['product_size'],
                'quantity' => $cartData['product_quantity']
            ];
            
            $this->cart_dao->insert("cart_products", $dbData);
        } catch (Exception $e) {
            throw new Exception("Failed to add product to cart: " . $e->getMessage());
        }
    }
}

?>