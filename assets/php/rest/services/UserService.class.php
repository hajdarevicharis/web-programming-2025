<?php

require_once __DIR__ ."/../dao/UserDao.class.php";

class UserService {
    private $user_dao;

    public function __construct() {
        $this->user_dao = new UserDao();
    }

    public function add_user($user) {
       return $this->user_dao->add_user($user);
    }
}