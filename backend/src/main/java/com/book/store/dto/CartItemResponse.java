package com.book.store.dto;

import java.math.BigDecimal;

public record CartItemResponse(
        Long id,
        Long bookId,
        String title,
        String author,
        String coverUrl,
        BigDecimal price,
        Integer quantity,
        Integer stock
) {}
