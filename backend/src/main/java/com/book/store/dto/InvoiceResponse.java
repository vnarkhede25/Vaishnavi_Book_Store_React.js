package com.book.store.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record InvoiceResponse(
        String invoiceNumber,
        String customerName,
        String customerEmail,
        LocalDateTime createdAt,
        List<InvoiceItem> items,
        BigDecimal total
) {
    public record InvoiceItem(String title, String author, BigDecimal unitPrice, Integer quantity) {}
}
