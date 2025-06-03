<?php
// rest/routes/order_routes.php

Flight::route('POST /orders', function() {
    $data = json_decode(Flight::request()->getBody(), true);
    
    try {
        Flight::db()->beginTransaction();
        
        $orderSql = "INSERT INTO `order` (userId, paymentId, total, createdAt) 
                     VALUES (?, ?, ?, ?)";
        
        $stmt = Flight::db()->prepare($orderSql);
        $stmt->execute([
            $data['user_id'],
            $data['payment_id'] ?? null, 
            $data['order_details']['total_amount'],
            date('Y-m-d H:i:s') 
        ]);
        
        $orderId = Flight::db()->lastInsertId();
        
        $itemSql = "INSERT INTO order_products (orderId, productId, quantity) 
                    VALUES (?, ?, ?)";
        
        $itemStmt = Flight::db()->prepare($itemSql);
        
        foreach ($data['items'] as $item) {
            $itemStmt->execute([
                $orderId,
                $item['product_id'],
                $item['quantity']
            ]);
        }
        
        $clearCartSql = "DELETE FROM cart_products WHERE user_id = ?";
        $clearStmt = Flight::db()->prepare($clearCartSql);
        $clearStmt->execute([$data['user_id']]);
        
        Flight::db()->commit();
        
        Flight::json([
            'success' => true,
            'message' => 'Order placed successfully',
            'order_id' => $orderId,
            'total_amount' => $data['order_details']['total_amount']
        ]);
        
    } catch (Exception $e) {
        Flight::db()->rollback();
        
        Flight::json([
            'success' => false,
            'message' => 'Error processing order: ' . $e->getMessage()
        ], 500);
    }
});

Flight::route('POST /order_records', function() {
    $data = json_decode(Flight::request()->getBody(), true);
    
    try {
        $sql = "INSERT INTO `order` (userId, paymentId, total, createdAt) 
                VALUES (?, ?, ?, ?)";
        
        $stmt = Flight::db()->prepare($sql);
        $stmt->execute([
            $data['user_id'],
            $data['payment_id'] ?? null,
            $data['total_amount'],
            date('Y-m-d H:i:s')
        ]);
        
        $orderId = Flight::db()->lastInsertId();
        
        Flight::json([
            'success' => true,
            'message' => 'Order record created',
            'id' => $orderId,
            'order_id' => $orderId
        ]);
        
    } catch (Exception $e) {
        Flight::json([
            'success' => false,
            'message' => 'Error creating order: ' . $e->getMessage()
        ], 500);
    }
});

Flight::route('POST /order_items', function() {
    $data = json_decode(Flight::request()->getBody(), true);
    
    try {
        $sql = "INSERT INTO order_products (orderId, productId, quantity) 
                VALUES (?, ?, ?)";
        
        $stmt = Flight::db()->prepare($sql);
        $stmt->execute([
            $data['order_id'],
            $data['product_id'],
            $data['quantity']
        ]);
        
        $itemId = Flight::db()->lastInsertId();
        
        Flight::json([
            'success' => true,
            'message' => 'Order item added',
            'id' => $itemId
        ]);
        
    } catch (Exception $e) {
        Flight::json([
            'success' => false,
            'message' => 'Error adding order item: ' . $e->getMessage()
        ], 500);
    }
});

Flight::route('GET /orders/user/@user_id', function($user_id) {
    try {
        $sql = "SELECT o.orderId, o.userId, o.paymentId, o.total, o.createdAt,
                       op.id as item_id, op.productId, op.quantity,
                       p.name as product_name, p.price as product_price, p.image as product_image
                FROM `order` o 
                LEFT JOIN order_products op ON o.orderId = op.orderId 
                LEFT JOIN products p ON op.productId = p.id
                WHERE o.userId = ? 
                ORDER BY o.createdAt DESC";
        
        $stmt = Flight::db()->prepare($sql);
        $stmt->execute([$user_id]);
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $orders = [];
        foreach ($results as $row) {
            $orderId = $row['orderId'];
            
            if (!isset($orders[$orderId])) {
                $orders[$orderId] = [
                    'orderId' => $row['orderId'],
                    'userId' => $row['userId'],
                    'paymentId' => $row['paymentId'],
                    'total' => $row['total'],
                    'createdAt' => $row['createdAt'],
                    'items' => []
                ];
            }
            
            if ($row['item_id']) {
                $orders[$orderId]['items'][] = [
                    'id' => $row['item_id'],
                    'productId' => $row['productId'],
                    'quantity' => $row['quantity'],
                    'product_name' => $row['product_name'],
                    'product_price' => $row['product_price'],
                    'product_image' => $row['product_image']
                ];
            }
        }
        
        Flight::json([
            'success' => true,
            'orders' => array_values($orders)
        ]);
        
    } catch (Exception $e) {
        Flight::json([
            'success' => false,
            'message' => 'Error fetching orders: ' . $e->getMessage()
        ], 500);
    }
});

Flight::route('DELETE /cart_products/user/@user_id/clear', function($user_id) {
    try {
        $sql = "DELETE FROM cart_products WHERE user_id = ?";
        $stmt = Flight::db()->prepare($sql);
        $stmt->execute([$user_id]);
        
        $deletedCount = $stmt->rowCount();
        
        Flight::json([
            'success' => true,
            'message' => "Cleared {$deletedCount} items from cart"
        ]);
        
    } catch (Exception $e) {
        Flight::json([
            'success' => false,
            'message' => 'Error clearing cart: ' . $e->getMessage()
        ], 500);
    }
});

Flight::route('GET /orders/@order_id', function($order_id) {
    try {
        $orderSql = "SELECT * FROM `order` WHERE orderId = ?";
        $orderStmt = Flight::db()->prepare($orderSql);
        $orderStmt->execute([$order_id]);
        $order = $orderStmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$order) {
            Flight::json(['success' => false, 'message' => 'Order not found'], 404);
            return;
        }
        
        $itemsSql = "SELECT op.*, p.name as product_name, p.price as product_price, p.image as product_image
                     FROM order_products op 
                     LEFT JOIN products p ON op.productId = p.id
                     WHERE op.orderId = ?";
        $itemsStmt = Flight::db()->prepare($itemsSql);
        $itemsStmt->execute([$order_id]);
        $items = $itemsStmt->fetchAll(PDO::FETCH_ASSOC);
        
        $order['items'] = $items;
        
        Flight::json([
            'success' => true,
            'order' => $order
        ]);
        
    } catch (Exception $e) {
        Flight::json([
            'success' => false,
            'message' => 'Error fetching order: ' . $e->getMessage()
        ], 500);
    }
});

Flight::route('PUT /orders/@order_id/payment', function($order_id) {
    $data = json_decode(Flight::request()->getBody(), true);
    
    try {
        $sql = "UPDATE `order` SET paymentId = ? WHERE orderId = ?";
        $stmt = Flight::db()->prepare($sql);
        $stmt->execute([$data['payment_id'], $order_id]);
        
        if ($stmt->rowCount() > 0) {
            Flight::json([
                'success' => true,
                'message' => 'Payment ID updated successfully'
            ]);
        } else {
            Flight::json([
                'success' => false,
                'message' => 'Order not found'
            ], 404);
        }
        
    } catch (Exception $e) {
        Flight::json([
            'success' => false,
            'message' => 'Error updating payment ID: ' . $e->getMessage()
        ], 500);
    }
});

?>