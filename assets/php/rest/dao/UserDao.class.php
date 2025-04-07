<?php

require_once __DIR__ . '/BaseDao.class.php';

class UserDao extends BaseDao {
    public function __construct() {
        parent::__construct('user'); // TABLE NAME PRODUCT in database
    }

    public function count_users_paginated($search) {
        $query = "SELECT COUNT(*) AS count
                  FROM user 
                  WHERE LOWER(firstName) LIKE CONCAT('%', :search, '%')
                  OR LOWER(lastName) LIKE CONCAT('%', :search, '%');";
        
        return $this->query_unique($query, ["search" => $search]);
    }

    public function get_users_paginated($offset, $limit, $search, $order_column, $order_direction) {
        $query = "SELECT * 
                  FROM user 
                  WHERE LOWER(firstName) LIKE CONCAT('%', :search, '%')
                  OR LOWER(lastName) LIKE CONCAT('%', :search, '%')
                  ORDER BY {$order_column} {$order_direction}
                  LIMIT {$offset}, {$limit};
                  ";
        
       return $this->query($query, ["search" => $search]);
    }

    public function delete_user($id) {
        $query = "DELETE FROM user WHERE id = :id";
        $this->execute($query, ["id" => $id]);
    }

    public function add_user($user) {
        $query = "INSERT INTO user(firstName, lastName, email, pwd) VALUES(:firstName, :lastName, :email, :pwd);";
        $statement = $this->connection->prepare($query);
        $statement->execute([
            "firstName" => $user["firstName"],
            "lastName" => $user["lastName"],
            "email" => $user["email"],
            "pwd" => $user["pwd"]
        ]);
        

        // THIS CODE IS USED FOR INSTANTLY CREATING A CART INSTANCE FOR EACH USER WHEN THAT USER IS CREATED
        $query_user_id = "SELECT id FROM user ORDER BY id DESC LIMIT 1;";
        $fetched_user_id = $this->query($query_user_id, []);

        $cart_query = "INSERT INTO cart(userId) VALUES(:userId);";
        $cart_stmt = $this->connection->prepare($cart_query);
        $cart_stmt->execute(["userId" => $fetched_user_id[0]["id"]]);

        return $user;
    }

    public function get_all_users() {
        $query = "SELECT * FROM user;";
        return $this->query($query, []);
    }

    public function get_user_by_id($id) {
        $query = "SELECT * FROM user WHERE id = :id";
        return $this->query_unique($query, ["id" => $id]);
    }
}
