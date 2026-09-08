package com.book.store.dto;

public record AuthResponse(
        boolean success,
        String message,
        Long userId,
        String name,
        String email
) {}
