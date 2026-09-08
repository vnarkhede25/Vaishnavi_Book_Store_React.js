package com.book.store.controller;

import com.book.store.dto.CartItemResponse;
import com.book.store.dto.InvoiceResponse;
import com.book.store.service.OrderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping("/cart")
    public List<CartItemResponse> getCart(@RequestHeader("X-User-Id") Long userId) {
        return orderService.getCart(userId);
    }

    @PostMapping("/cart/items/{bookId}")
    public List<CartItemResponse> addToCart(@RequestHeader("X-User-Id") Long userId, @PathVariable Long bookId) {
        return orderService.addToCart(userId, bookId);
    }

    @PutMapping("/cart/items/{itemId}")
    public List<CartItemResponse> updateQuantity(@RequestHeader("X-User-Id") Long userId,
                                                  @PathVariable Long itemId,
                                                  @RequestBody Map<String, Integer> body) {
        return orderService.updateQuantity(userId, itemId, body.get("quantity"));
    }

    @DeleteMapping("/cart/items/{itemId}")
    public List<CartItemResponse> removeFromCart(@RequestHeader("X-User-Id") Long userId,
                                                  @PathVariable Long itemId) {
        return orderService.removeFromCart(userId, itemId);
    }

    @PostMapping("/orders/checkout")
    public InvoiceResponse checkout(@RequestHeader("X-User-Id") Long userId) {
        return orderService.checkout(userId);
    }

    @GetMapping("/orders/latest")
    public InvoiceResponse latestInvoice(@RequestHeader("X-User-Id") Long userId) {
        return orderService.getLatestInvoice(userId);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleBadRequest(IllegalArgumentException exception) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", exception.getMessage()));
    }
}
