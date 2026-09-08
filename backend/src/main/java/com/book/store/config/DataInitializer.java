package com.book.store.config;

import com.book.store.model.Book;
import com.book.store.repository.BookRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner seedBooks(BookRepository repository) {
        return args -> {
            if (repository.count() > 0) {
                return;
            }

            repository.saveAll(List.of(
                    new Book(
                            "Atomic Habits",
                            "James Clear",
                            "Self Growth",
                            "A practical guide to building good habits and breaking bad ones.",
                            new BigDecimal("499.00"),
                            "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=700&q=80",
                            4.8,
                            24
                    ),
                    new Book(
                            "The Psychology of Money",
                            "Morgan Housel",
                            "Finance",
                            "Timeless lessons on wealth, greed, happiness and financial behaviour.",
                            new BigDecimal("399.00"),
                            "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=700&q=80",
                            4.7,
                            18
                    ),
                    new Book(
                            "Clean Code",
                            "Robert C. Martin",
                            "Technology",
                            "A classic guide to writing readable, maintainable and professional code.",
                            new BigDecimal("699.00"),
                            "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=700&q=80",
                            4.6,
                            12
                    ),
                    new Book(
                            "Ikigai",
                            "Héctor García & Francesc Miralles",
                            "Self Growth",
                            "Explore the Japanese concept of purpose, balance and a meaningful life.",
                            new BigDecimal("349.00"),
                            "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=700&q=80",
                            4.5,
                            31
                    ),
                    new Book(
                            "Designing Data-Intensive Applications",
                            "Martin Kleppmann",
                            "Technology",
                            "A deep practical look at scalable data systems and distributed applications.",
                            new BigDecimal("899.00"),
                            "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=700&q=80",
                            4.9,
                            9
                    ),
                    new Book(
                            "The Alchemist",
                            "Paulo Coelho",
                            "Fiction",
                            "A timeless story about dreams, courage and following your personal legend.",
                            new BigDecimal("299.00"),
                            "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=700&q=80",
                            4.7,
                            27
                    )
            ));
        };
    }
}
