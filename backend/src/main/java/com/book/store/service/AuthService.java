package com.book.store.service;

import com.book.store.dto.AuthResponse;
import com.book.store.dto.LoginRequest;
import com.book.store.dto.RegisterRequest;
import com.book.store.model.User;
import com.book.store.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public AuthResponse register(RegisterRequest request) {
        if (request == null || isBlank(request.name()) ||
                isBlank(request.email()) || isBlank(request.password())) {
            return new AuthResponse(false, "All fields are required.", null, null, null);
        }

        if (request.password().length() < 6) {
            return new AuthResponse(false, "Password must contain at least 6 characters.",
                    null, null, null);
        }

        String email = request.email().trim().toLowerCase();

        if (userRepository.existsByEmailIgnoreCase(email)) {
            return new AuthResponse(false, "An account with this email already exists.",
                    null, null, null);
        }

        User user = new User(
                request.name().trim(),
                email,
                hash(request.password())
        );

        User saved = userRepository.save(user);

        return new AuthResponse(
                true,
                "Registration successful.",
                saved.getId(),
                saved.getName(),
                saved.getEmail()
        );
    }

    public AuthResponse login(LoginRequest request) {
        if (request == null || isBlank(request.email()) || isBlank(request.password())) {
            return new AuthResponse(false, "Email and password are required.",
                    null, null, null);
        }

        return userRepository.findByEmailIgnoreCase(request.email().trim())
                .filter(user -> user.getPasswordHash().equals(hash(request.password())))
                .map(user -> new AuthResponse(
                        true,
                        "Login successful.",
                        user.getId(),
                        user.getName(),
                        user.getEmail()
                ))
                .orElse(new AuthResponse(
                        false,
                        "Invalid email or password.",
                        null,
                        null,
                        null
                ));
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private String hash(String value) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] encoded = digest.digest(value.getBytes(StandardCharsets.UTF_8));

            StringBuilder hex = new StringBuilder();
            for (byte b : encoded) {
                hex.append(String.format("%02x", b));
            }
            return hex.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 is not available.", e);
        }
    }
}
