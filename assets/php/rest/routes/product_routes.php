<?php

require_once __DIR__ . "/../services/ProductService.class.php";

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

Flight::set("product_service", new ProductService());

Flight::group("/products", function() {

    /**
     * @OA\Get(
     *      path="/products/all",
     *      tags={"products"},
     *      summary="Get all products",
     *      security={
     *          {"ApiKey":{}}
     *      },
     *      @OA\Response(
     *           response=200,
     *           description="Get all products"
     *      )
     * )
     */
    Flight::route('GET /all', function() {
        $data = Flight::get("product_service")->get_all_products();
        Flight::json($data);
    });

    /**
     * @OA\Get(
     *      path="/products/product",
     *      tags={"products"},
     *      summary="Get product by id with query parameter",
     *      security={
     *          {"ApiKey":{}}
     *      },
     *      @OA\Response(
     *           response=200,
     *           description="A single product, or false if the product with the specified id doesn't exist"
     *      ),
     *      @OA\Parameter(@OA\Schema(type="number"), in="query", name="product_id", example="1", description="Product ID")
     * )
     */
    Flight::route("GET /product", function() {
        $params = Flight::request()->query;
        $product = Flight::get("product_service")->get_product_by_id($params["product_id"]);
        Flight::json($product);
    });

    /**
     * @OA\Get(
     *      path="/products/product/{product_id}",
     *      tags={"products"},
     *      summary="Get product by id with path parameter",
     *      security={
     *          {"ApiKey":{}}
     *      },
     *      @OA\Response(
     *           response=200,
     *           description="A single product, or false if the product with the specified id doesn't exist"
     *      ),
     *      @OA\Parameter(@OA\Schema(type="number"), in="path", name="product_id", example="1", description="Product ID")
     * )
     */
    Flight::route("GET /product/@product_id", function($product_id) {
        $product = Flight::get("product_service")->get_product_by_id($product_id);
        Flight::json($product);
    });

    Flight::route('GET /', function() {
        // $payload = $_REQUEST;
    
        $payload = Flight::request()->query;
    
        // ovi params se passaju kroz payload koji dodje uz DataTables, sve ove values su definisani od njegove strane
        // oni ce nam trebati kako bi u queriju znali kako da sortamo, po cemu da sortamo...
        $params = [
            'start' => (int) $payload['start'], // offset, vezano za table page numbers, ako je page 2, onda ide od 11-og itema...
            'search' => $payload['search']['value'],
            'draw' => $payload['draw'],
            'limit' => (int) $payload['length'], // number of entries per page
            'order_column' => $payload['order'][0]['name'],
            'order_direction' => $payload['order'][0]['dir']
        ];
        
        //$product_service = new ProductService(); replaced with Flight::set()
        
        // Count query
        
        //$data = $product_service->get_products_paginated($params["start"], $params["limit"], $params["search"], $params["order_column"], $params["order_direction"]);
        $data = Flight::get("product_service")->get_products_paginated($params["start"], $params["limit"], $params["search"], $params["order_column"], $params["order_direction"]);
    
        // Get data query
        
        // kako ovo radi??????????? 
        //$data variable [data, zato sto imamo i draw, end, recordsFiletered...] [id, da znamo koji row u data array] [action, targetamno action field] 
        //$data["data"] je associative array, i mi loopamo kroz njega u vidu key:id, value: productObject(koji ima id,name,brand...), data["data"] mozemo vidjeti u payload
        foreach($data["data"] as $id => $product) {
            $data["data"][$id]["action"] = '<div class="btn-group" role="group" aria-label="Actions">
                                                <button type="button" class="btn btn-outline-warning" onclick="ProductService.open_edit_product_modal(' . $product["id"] . ')">Edit</button>
                                                <button type="button" class="btn btn-outline-danger" onclick="ProductService.delete_product(' . $product["id"] . ')">Delete</button>
                                            </div>';
        }
        
        // this is the response we want to return
        // echo json_encode([
        //     'draw' => $params['draw'],
        //     'data' => $data["data"], // OVAJ DATA NAM SADRZI SVE ROWS IZ TABELE I COLUMNS IZ BAZE, I U services/product.js "data" se referenca na ovu data
        //     'recordsFiltered' => $data['count'],
        //     'recordsTotal' => $data['count'],
        //     'end' => $data['count']
        // ]);
        
        Flight::json([
            'draw' => $params['draw'],
            'data' => $data["data"], // OVAJ DATA NAM SADRZI SVE ROWS IZ TABELE I COLUMNS IZ BAZE, I U services/product.js "data" se referenca na ovu data
            'recordsFiltered' => $data['count'],
            'recordsTotal' => $data['count'],
            'end' => $data['count']
        ]);
    
    });
    
    /**
     * @OA\Post(
     *      path="/products/add",
     *      tags={"products"},
     *      summary="Add or edit a product",
     *      security={
     *          {"ApiKey":{}}
     *      },
     *      @OA\Response(
     *           response=200,
     *           description="To add a product, leave out the product_id. If you want to edit a product, specity its Product ID"
     *      ),
     *      @OA\RequestBody(
     *          description="Product data payload",
     *          @OA\JsonContent(
     *              required={"name", "brand", "description", "gender", "categroy", "rating", "price"},
     *              @OA\Property(property="id", type="int", example="1", description="Product ID"),
     *              @OA\Property(property="name", type="string", example="Example Name", description="Product Name"),
     *              @OA\Property(property="brand", type="string", example="Example Brand", description="Product Brand"),
     *              @OA\Property(property="description", type="string", example="Example Description", description="Product Descripiton"),
     *              @OA\Property(property="gender", type="string", example="Example Gender", description="Product Gender"),
     *              @OA\Property(property="category", type="string", example="Example Category", description="Product Category"),
     *              @OA\Property(property="rating", type="int", example="5", description="Product Rating"),
     *              @OA\Property(property="price", type="double", example="199.99", description="Product Price")
     *          )
     *      )
     * )
     */
    Flight::route("POST /add", function() {
        // $payload = $_REQUEST;
        $payload = Flight::request()->data->getData();
        // TODO implement error handling
    
        if ($payload["name"] == NULL || $payload["name"] == "") {
            // header("HTTP/1.1 500 Bad Request");
            // die(json_encode(["error" => "name field missing"]));
            Flight::halt(500, "name field missing");
        }
    
        // $product_service = new ProductService();
        // ovaj if imamo kako bi add_product koristili za edit i add
        if($payload["id"] != NULL && $payload["id"] != "") {
            // if hidden id is set, patient is already added, and we got the modal by clicking the edit button; edit the product
            $product = Flight::get("product_service")->edit_product($payload);
    
            Flight::json(["message" => "You have successfully edited a product", "data" => $product, "payload" => $payload]);
    
        } else {
            // add product
            unset($payload["id"]);
            $product = Flight::get("product_service")->add_product($payload);
    
            Flight::json(["message" => "You have successfully added a product", "data" => $product, "payload" => $payload]);
        }
    });
    
    /**
     * @OA\Delete(
     *      path="/products/delete/{product_id}",
     *      tags={"products"},
     *      summary="Delete product by id",
     *      security={
     *          {"ApiKey":{}}
     *      },
     *      @OA\Response(
     *           response=200,
     *           description="Delete the product with the specified id from the database, or 'Invalid product id'"
     *      ),
     *      @OA\Parameter(@OA\Schema(type="number"), in="path", name="product_id", example="1", description="Product ID")
     * )
     */
    Flight::route("DELETE /delete/@product_id", function($product_id) {
        // $product_id = $_REQUEST["id"]; // passali smo ga u url (?id=id)
        
        // NE TREBA NAM UOPSTE REQUEST JER PRODUCT ID PASSAMO IZNAD U FUNKCIJI, TJ PASSAMO GA SADA KAO PATH PARAMETER, DOSTUPAN JE ODMAH
    
    
        if ($product_id == NULL || $product_id == "") {
            // header("HTTP/1.1 500 Bad Request");
            // die(json_encode(["error" => "Invalid product id"]));
            Flight::halt(500, "Invalid product id");
        }
        
        // $product_service = new ProductService();
        
        Flight::get("product_service")->delete_product($product_id);
        
        Flight::json(["message" => "you have successfully deleted a product"]);
    });
    
    Flight::route("GET /@product_id", function($product_id) {
        // $product_id = $_REQUEST["id"];
    
        // $product_service = new ProductService();
        
        $product = Flight::get("product_service")->get_product_by_id($product_id);
        
        // ovo treba da bi edit dugme radilo, inace returna text, a mi hocemo da nam returna json kako bi
        // mogli accessat sa data.id, data.name,...
        // header('Content-Type: application/json');
        // echo json_encode($product);
        Flight::json($product);
    });

});

// OVDJE RADI product/all ALI NE RADI IZNAD products/all_products
// NE TREBA OVO IPAK, PROBLEM JE STO JE OVAJ ROUTE BIO NA DNU GROUPA, SAMO RADI KAD JE IZNAD, STO, IDK????

// Flight::route('GET /product/all', function() {
//     $data = Flight::get("product_service")->get_all_products();
//     Flight::json($data);
//     // echo "NICE NICE";
// });