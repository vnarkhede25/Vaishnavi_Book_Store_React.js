package com.book.store.repository;

import com.book.store.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUserIdOrderById(Long userId);
    Optional<CartItem> findByUserIdAndBookId(Long userId, Long bookId);
}
