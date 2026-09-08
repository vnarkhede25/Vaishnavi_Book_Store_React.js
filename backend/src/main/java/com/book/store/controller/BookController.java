package com.book.store.controller;

import com.book.store.model.Book;
import com.book.store.service.BookService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @GetMapping
    public List<Book> getBooks(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category
    ) {
        return bookService.getBooks(search, category);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Book> getBook(@PathVariable Long id) {
        Book book = bookService.getBook(id);
        return book == null
                ? ResponseEntity.notFound().build()
                : ResponseEntity.ok(book);
    }
}
