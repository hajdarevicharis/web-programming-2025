<?php

require_once __DIR__ . "/../services/AuthService.class.php";

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

Flight::set("auth_service", new AuthService);

Flight::group("/auth", function() {
    /** 
    * @OA\Post(
        *      path="/auth/register",
        *      tags={"auth"},
        *      summary="Register new user account",
        *      @OA\Response(
        *           response=201,
        *           description="User registered successfully"
        *      ),
        *      @OA\Response(
        *           response=400,
        *           description="Registration failed - validation error"
        *      ),
        *      @OA\RequestBody(
        *          description="User registration data",
        *          @OA\JsonContent(
        *              required={"firstName", "lastName", "email", "pwd", "repeat_password"},
        *              @OA\Property(property="firstName", type="string", example="Haris", description="User First Name"),
        *              @OA\Property(property="lastName", type="string", example="Hajdarevic", description="User Last Name"),
        *              @OA\Property(property="email", type="string", example="haris.hajdarevic@gmail.com", description="User Email"),
        *              @OA\Property(property="pwd", type="string", example="password123", description="User Password"),
        *              @OA\Property(property="repeat_password", type="string", example="password123", description="Repeat Password"),
        *          )
        *      )
        * )
        */
       Flight::route("POST /register", function() {
           $payload = Flight::request()->data->getData();
           
           $required_fields = ['firstName', 'lastName', 'email', 'pwd', 'repeat_password'];
           foreach($required_fields as $field) {
               if(empty($payload[$field])) {
                   Flight::halt(400, "Field '{$field}' is required");
               }
           }
           
           if($payload['pwd'] !== $payload['repeat_password']) {
               Flight::halt(400, "Passwords do not match");
           }
           
           if(!filter_var($payload['email'], filter: FILTER_VALIDATE_EMAIL)) {
               Flight::halt(400, "Invalid email format");
           }
           
           if(strlen($payload['pwd']) < 6) {
               Flight::halt(400, "Password must be at least 6 characters long");
           }
           
           $existing_user = Flight::get("auth_service")->get_user_by_email($payload["email"]);
           if($existing_user) {
               Flight::halt(400, "User with this email already exists");
           }
           
           $fullName = trim($payload['firstName'] . ' ' . $payload['lastName']);
           
           $result = Flight::get("auth_service")->register(
               $payload['email'], 
               $payload['pwd'], 
               $fullName,
               $payload['firstName'],
               $payload['lastName']
           );
           
           if($result['success']) {
               Flight::json([
                   'success' => true,
                   'message' => $result['message'],
                   'user_id' => $result['user_id']
               ], 201);
           } else {
               Flight::halt(400, $result['message']);
           }
       });
     
    /**
     * @OA\Post(
     *      path="/auth/login",
     *      tags={"auth"},
     *      summary="Login to system with email",
     *      @OA\Response(
     *           response=200,
     *           description="Returns user data and JWT"
     *      ),
     *      @OA\RequestBody(
     *          description="Credentials",
     *          @OA\JsonContent(
     *              required={"firstName", "password"},
     *              @OA\Property(property="email", type="string", example="example@gmail.com", description="User Email"),
     *              @OA\Property(property="pwd", type="string", example="Example Password", description="User Password"),
     *          )
     *      )
     * )
     */
    Flight::route("POST /login", function() {
        $payload = Flight::request()->data->getData(); // ovo se proslijedjuje kroz login formu

        $user = Flight::get("auth_service")->get_user_by_email($payload["email"]); // user nam je user koji smo fetchali iz base na osnovu emaila

        // Password
        if (!$user) {   
            Flight::halt(400, "user not found");
        }

        if(!password_verify($payload["pwd"], $user["pwd"])) {
            // echo $payload["pwd"];
            // echo $user["pwd"];
            var_dump(password_verify("emir", '$2y$10$YhVve9XDKvH5n'));
            Flight::halt(400, "Invalid email or password");
        }
        unset($user["pwd"]); // we don't even want to return the hashed password of the user
        
        $jwt_payload = [
            "user" => $user,
            "iat" => time(), // issued at, when the token has been issued
            "exp" => time() + (60 * 60 * 24) // valid for 1 day
        ];

        $token = JWT::encode(
            $jwt_payload,
            Config::JWT_SECRET(),
            "HS256"
        );

        Flight::json(
            array_merge($user, ["token" => $token])
        );
    });

    /**
     * @OA\Post(
     *      path="/auth/logout",
     *      tags={"auth"},
     *      summary="Logout of system with email",
     *      security={
     *          {"ApiKey":{}}
     *      },
     *      @OA\Response(
     *           response=200,
     *           description="Returns success response or exception"
     *      ),
     * )
     */
    Flight::route("POST /logout", function() {
        try {
            $token = Flight::request()->getHeader("Authentication");
            if(!$token) {
                Flight::halt(500, "Missing Auth Header");
            }
            $decoded_token = JWT::decode($token, new Key(Config::JWT_SECRET(), "HS256"));
            Flight::json([
                "jwt_decoded" => $decoded_token,
                "user" => $decoded_token->user
            ]);
        } catch(\Exception $e) {
            Flight::halt(401, $e->getMessage()); // errori vezani za provjeru tokena, token expired, pogresan jwt_secret...
        }
    });
});
