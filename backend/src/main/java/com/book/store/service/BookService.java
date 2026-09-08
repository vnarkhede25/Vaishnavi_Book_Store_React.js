package com.book.store.service;

import com.book.store.model.Book;
import com.book.store.repository.BookRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookService {

    private final BookRepository bookRepository;

    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    public List<Book> getBooks(String search, String category) {
        if (search != null && !search.isBlank()) {
            return bookRepository
                    .findByTitleContainingIgnoreCaseOrAuthorContainingIgnoreCase(search.trim(), search.trim());
        }

        if (category != null && !category.isBlank() && !category.equalsIgnoreCase("All")) {
            return bookRepository.findByCategoryIgnoreCase(category.trim());
        }

        return bookRepository.findAll();
    }

    public Book getBook(Long id) {
        return bookRepository.findById(id).orElse(null);
    }
}
