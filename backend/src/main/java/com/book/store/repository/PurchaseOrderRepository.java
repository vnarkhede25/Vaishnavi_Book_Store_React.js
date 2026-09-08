package com.book.store.repository;

import com.book.store.model.PurchaseOrder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Long> {
    Optional<PurchaseOrder> findFirstByUserIdOrderByCreatedAtDesc(Long userId);
}
