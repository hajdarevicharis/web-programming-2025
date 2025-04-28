<?php

require_once __DIR__ . '/../dao/CartDao.class.php';

class CartService {

    private $cart_dao;

    public function __construct() {
        $this->cart_dao = new CartDao();
    }


    public function get_cart_products($cartId) {
        $rows =  $this->cart_dao-> get_cart_products($cartId);

        return [
            'data' => $rows
        ];
    }
    public function delete_cart_product($cart_product_id) {
        $this->cart_dao->delete_cart_product($cart_product_id);
    }

    public function get_all_carts() {
        return $this->cart_dao->get_all_carts();
    }

    public function get_user_cart_products($userId) {
        return $this->cart_dao->get_user_cart_products($userId);
    }
}