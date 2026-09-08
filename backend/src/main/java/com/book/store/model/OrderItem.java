package com.book.store.model;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", nullable = false)
    private PurchaseOrder order;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String author;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;

    @Column(nullable = false)
    private Integer quantity;

    public OrderItem() {}

    public OrderItem(String title, String author, BigDecimal unitPrice, Integer quantity) {
        this.title = title;
        this.author = author;
        this.unitPrice = unitPrice;
        this.quantity = quantity;
    }

    public void setOrder(PurchaseOrder order) { this.order = order; }
    public String getTitle() { return title; }
    public String getAuthor() { return author; }
    public BigDecimal getUnitPrice() { return unitPrice; }
    public Integer getQuantity() { return quantity; }
}
