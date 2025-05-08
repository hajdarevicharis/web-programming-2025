<?php

require_once __DIR__ . '/../dao/ProductDao.class.php';

class ProductService {

    private $product_dao;

    public function __construct() {
        $this->product_dao = new ProductDao();
    }

    public function add_product($product) {
        return $this->product_dao->add_product($product);
    }

    public function get_products_paginated($offset, $limit, $search, $order_column, $order_direction) {
        $count = $this->product_dao->count_products_paginated($search)["count"];
        $rows =  $this->product_dao->get_products_paginated($offset, $limit, $search, $order_column, $order_direction);

        return [
            'count' => $count,
            'data' => $rows
        ];
    }
    public function delete_product($product_id) {
        $this->product_dao->delete_product($product_id);
    }

    public function get_product_by_id($product_id) {
       return $this->product_dao->get_product_by_id($product_id);
    }

    public function edit_product($product) { // product = payload
        $id = $product["id"];
        unset($product["id"]); // after we edited the patiend, we want to unset the hidden id field, so it its value doesn't remain if we click edit, and then add product
        
        return $this->product_dao->edit_product($id, $product);
    }

    // for openAPI Swagger
    public function get_all_products() {
        return $this->product_dao->get_all_products();
    }
}