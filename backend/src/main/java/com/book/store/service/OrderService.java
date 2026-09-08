package com.book.store.service;

import com.book.store.dto.CartItemResponse;
import com.book.store.dto.InvoiceResponse;
import com.book.store.model.Book;
import com.book.store.model.CartItem;
import com.book.store.model.OrderItem;
import com.book.store.model.PurchaseOrder;
import com.book.store.model.User;
import com.book.store.repository.BookRepository;
import com.book.store.repository.CartItemRepository;
import com.book.store.repository.PurchaseOrderRepository;
import com.book.store.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Service
public class OrderService {

    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final CartItemRepository cartItemRepository;
    private final PurchaseOrderRepository orderRepository;

    public OrderService(UserRepository userRepository, BookRepository bookRepository,
                        CartItemRepository cartItemRepository, PurchaseOrderRepository orderRepository) {
        this.userRepository = userRepository;
        this.bookRepository = bookRepository;
        this.cartItemRepository = cartItemRepository;
        this.orderRepository = orderRepository;
    }

    public User requireUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Please sign in again."));
    }

    public List<CartItemResponse> getCart(Long userId) {
        requireUser(userId);
        return cartItemRepository.findByUserIdOrderById(userId).stream().map(this::toCartResponse).toList();
    }

    @Transactional
    public List<CartItemResponse> addToCart(Long userId, Long bookId) {
        User user = requireUser(userId);
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new IllegalArgumentException("This book is no longer available."));
        if (book.getStock() < 1) throw new IllegalArgumentException("This book is out of stock.");

        CartItem item = cartItemRepository.findByUserIdAndBookId(userId, bookId)
                .orElseGet(() -> new CartItem(user, book, 0));
        if (item.getQuantity() + 1 > book.getStock()) {
            throw new IllegalArgumentException("You cannot add more than the available stock.");
        }
        item.setQuantity(item.getQuantity() + 1);
        cartItemRepository.save(item);
        return getCart(userId);
    }

    @Transactional
    public List<CartItemResponse> updateQuantity(Long userId, Long itemId, Integer quantity) {
        requireUser(userId);
        CartItem item = cartItemRepository.findById(itemId)
                .filter(cartItem -> cartItem.getUser().getId().equals(userId))
                .orElseThrow(() -> new IllegalArgumentException("Cart item not found."));
        if (quantity == null || quantity < 1 || quantity > item.getBook().getStock()) {
            throw new IllegalArgumentException("Choose a quantity available in stock.");
        }
        item.setQuantity(quantity);
        return getCart(userId);
    }

    @Transactional
    public List<CartItemResponse> removeFromCart(Long userId, Long itemId) {
        requireUser(userId);
        CartItem item = cartItemRepository.findById(itemId)
                .filter(cartItem -> cartItem.getUser().getId().equals(userId))
                .orElseThrow(() -> new IllegalArgumentException("Cart item not found."));
        cartItemRepository.delete(item);
        return getCart(userId);
    }

    @Transactional
    public InvoiceResponse checkout(Long userId) {
        User user = requireUser(userId);
        List<CartItem> cart = cartItemRepository.findByUserIdOrderById(userId);
        if (cart.isEmpty()) throw new IllegalArgumentException("Your cart is empty.");

        BigDecimal total = BigDecimal.ZERO;
        PurchaseOrder order = new PurchaseOrder(
                "VS-" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"))
                        + "-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase(),
                user, total, LocalDateTime.now());

        for (CartItem cartItem : cart) {
            Book book = cartItem.getBook();
            if (cartItem.getQuantity() > book.getStock()) {
                throw new IllegalArgumentException("Not enough stock for " + book.getTitle() + ".");
            }
            book.setStock(book.getStock() - cartItem.getQuantity());
            bookRepository.save(book);
            total = total.add(book.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())));
            order.addItem(new OrderItem(book.getTitle(), book.getAuthor(), book.getPrice(), cartItem.getQuantity()));
        }

        PurchaseOrder saved = new PurchaseOrder(order.getInvoiceNumber(), user, total, order.getCreatedAt());
        order.getItems().forEach(saved::addItem);
        orderRepository.save(saved);
        cartItemRepository.deleteAll(cart);
        return toInvoiceResponse(saved);
    }

    public InvoiceResponse getLatestInvoice(Long userId) {
        requireUser(userId);
        return orderRepository.findFirstByUserIdOrderByCreatedAtDesc(userId)
                .map(this::toInvoiceResponse)
                .orElseThrow(() -> new IllegalArgumentException("No invoice found yet."));
    }

    private CartItemResponse toCartResponse(CartItem item) {
        Book book = item.getBook();
        return new CartItemResponse(item.getId(), book.getId(), book.getTitle(), book.getAuthor(),
                book.getCoverUrl(), book.getPrice(), item.getQuantity(), book.getStock());
    }

    private InvoiceResponse toInvoiceResponse(PurchaseOrder order) {
        return new InvoiceResponse(order.getInvoiceNumber(), order.getUser().getName(), order.getUser().getEmail(),
                order.getCreatedAt(), order.getItems().stream()
                .map(item -> new InvoiceResponse.InvoiceItem(item.getTitle(), item.getAuthor(), item.getUnitPrice(), item.getQuantity()))
                .toList(), order.getTotal());
    }
}
