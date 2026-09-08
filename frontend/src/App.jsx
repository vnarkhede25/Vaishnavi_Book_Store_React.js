import React, { useEffect, useMemo, useState } from "react";
import { Link, NavLink, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Heart,
  LibraryBig,
  LogIn,
  LogOut,
  Menu,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
  Star,
  Trash2,
  UserPlus,
  X
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { api } from "./api";

const MotionLink = motion(Link);

function App() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("vaishnavi_user")) || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (!user) return;
    api.getCart().then(setCart).catch(() => setCart([]));
  }, [user]);

  const [cart, setCart] = useState([]);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("vaishnavi_user", JSON.stringify(userData));
    localStorage.setItem("vaishnavi_user_id", String(userData.userId));
  };

  const logout = () => {
    setUser(null);
    setCart([]);
    localStorage.removeItem("vaishnavi_user");
    localStorage.removeItem("vaishnavi_user_id");
  };

  const addToCart = async (book) => {
    if (!user) return { success: false, message: "Please login first to add books to your cart." };
    try {
      setCart(await api.addToCart(book.id));
      return { success: true, message: `${book.title} added to your bag.` };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  return (
    <div className="app-shell">
      <Navbar user={user} cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} logout={logout} />
      <main>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login onLogin={login} />} />
            <Route path="/register" element={<Register onLogin={login} />} />
            <Route path="/catalogue" element={<Catalogue onAddToCart={addToCart} />} />
            <Route path="/cart" element={<Cart user={user} cart={cart} setCart={setCart} />} />
            <Route path="/invoice" element={<Invoice user={user} />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

function Navbar({ user, cartCount, logout }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <header className="navbar-wrap">
      <nav className="navbar">
        <Link to="/" className="brand">
          <span className="brand-mark"><BookOpen size={19} /></span>
          <span>Vaishnavi</span>
        </Link>

        <div className={`nav-links ${open ? "open" : ""}`}>
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/catalogue">Catalogue</NavLink>
          {!user && <NavLink to="/login">Login</NavLink>}
          {!user && <NavLink to="/register">Register</NavLink>}
          {user && (
            <button className="nav-logout" onClick={logout}>
              <LogOut size={16} /> Logout
            </button>
          )}
        </div>

        <div className="nav-actions">
          <Link to="/cart" className="cart-button" aria-label="Cart">
            <ShoppingBag size={19} />
            {cartCount > 0 && <span>{cartCount}</span>}
          </Link>
          <button className="mobile-menu" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </nav>
    </header>
  );
}

function Home() {
  const featured = [
    ["Atomic Habits", "James Clear", "Self Growth", "499"],
    ["Clean Code", "Robert C. Martin", "Technology", "699"],
    ["The Alchemist", "Paulo Coelho", "Fiction", "299"]
  ];

  return (
    <motion.div
      className="page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <section className="hero">
        <div className="hero-orb orb-one" />
        <div className="hero-orb orb-two" />

        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="eyebrow"><Sparkles size={15} /> A better place for readers</div>
          <h1>Stories that stay<br /><span>with you.</span></h1>
          <p>
            Discover thoughtfully selected books for curious minds,
            ambitious builders and everyday dreamers.
          </p>

          <div className="hero-buttons">
            <MotionLink whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} to="/catalogue" className="primary-btn">
              Explore Catalogue <ArrowRight size={18} />
            </MotionLink>
            <MotionLink whileHover={{ x: 4 }} to="/register" className="text-btn">
              Create an account <ChevronRight size={17} />
            </MotionLink>
          </div>

          <div className="hero-stats">
            <div><strong>500+</strong><span>Books</span></div>
            <div><strong>4.8/5</strong><span>Reader rating</span></div>
            <div><strong>24/7</strong><span>Online access</span></div>
          </div>
        </motion.div>

        <motion.div
          className="hero-book-stack"
          initial={{ opacity: 0, x: 60, rotate: 3 }}
          animate={{ opacity: 1, x: 0, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          <div className="floating-card card-top">
            <Star size={15} fill="currentColor" /> 4.9 reader rating
          </div>
          <div className="book-visual">
            <div className="book-cover">
              <small>THE ART OF</small>
              <b>READING</b>
              <span>VAISHNAVI EDITION</span>
            </div>
            <div className="book-shadow" />
          </div>
          <div className="floating-card card-bottom">
            <LibraryBig size={16} /> Curated for you
          </div>
        </motion.div>
      </section>

      <section className="section">
        <SectionHeading
          kicker="Editor's picks"
          title="Books worth opening today"
          action={<Link to="/catalogue" className="section-link">View all <ArrowRight size={16} /></Link>}
        />

        <div className="featured-grid">
          {featured.map(([title, author, category, price], index) => (
            <motion.div
              key={title}
              className="mini-book-card"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -7 }}
            >
              <div className={`mini-cover cover-${index + 1}`}>
                <BookOpen size={27} />
                <strong>{title}</strong>
                <small>{author}</small>
              </div>
              <div className="mini-info">
                <div>
                  <span className="tag">{category}</span>
                  <h3>{title}</h3>
                  <p>{author}</p>
                </div>
                <strong>₹{price}</strong>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="feature-banner">
        <div>
          <div className="eyebrow dark"><Sparkles size={15} /> Made for modern readers</div>
          <h2>Find your next<br />favourite chapter.</h2>
          <p>Search by title, author or category and build your personal reading list.</p>
        </div>
        <Link to="/catalogue" className="light-btn">Browse books <ArrowRight size={17} /></Link>
      </section>
    </motion.div>
  );
}

function SectionHeading({ kicker, title, action }) {
  return (
    <div className="section-heading">
      <div>
        <div className="eyebrow">{kicker}</div>
        <h2>{title}</h2>
      </div>
      {action}
    </div>
  );
}

function Catalogue({ onAddToCart }) {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("featured");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const categories = ["All", "Technology", "Finance", "Self Growth", "Fiction"];

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
      api.getBooks({ search, category })
        .then(setBooks)
        .catch(() => setBooks([]))
        .finally(() => setLoading(false));
    }, 220);

    return () => clearTimeout(timer);
  }, [search, category]);

  const sortedBooks = useMemo(() => {
    return [...books].sort((a, b) => {
      if (sort === "price-low") return Number(a.price) - Number(b.price);
      if (sort === "price-high") return Number(b.price) - Number(a.price);
      if (sort === "rating") return b.rating - a.rating;
      return b.rating - a.rating;
    });
  }, [books, sort]);

  const add = (book) => {
    onAddToCart(book).then((result) => {
      setMessage(result.message);
      setTimeout(() => setMessage(""), 2200);
    });
  };

  return (
    <motion.div className="page catalogue-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <section className="catalogue-header">
        <div>
          <div className="eyebrow"><LibraryBig size={15} /> The catalogue</div>
          <h1>Choose your<br /><span>next read.</span></h1>
          <p>Hand-picked titles across technology, finance, fiction and self-growth.</p>
        </div>
        <div className="catalogue-stat"><strong>{books.length}</strong><span>titles available</span></div>
      </section>

      <section className="catalogue-controls">
        <div className="search-box">
          <Search size={19} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title or author..."
          />
          {search && <button onClick={() => setSearch("")}><X size={17} /></button>}
        </div>

        <div className="category-row">
          {categories.map((item) => (
            <button
              key={item}
              className={category === item ? "category active" : "category"}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <select value={sort} onChange={(e) => setSort(e.target.value)} className="sort-select">
          <option value="featured">Sort: Featured</option>
          <option value="rating">Highest rated</option>
          <option value="price-low">Price: Low to high</option>
          <option value="price-high">Price: High to low</option>
        </select>
      </section>

      <AnimatePresence>
        {message && (
          <motion.div className="toast" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
            <CheckCircle2 size={18} /> {message}
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="loading-grid">
          {[1, 2, 3, 4].map((n) => <div className="skeleton" key={n} />)}
        </div>
      ) : sortedBooks.length ? (
        <div className="book-grid">
          {sortedBooks.map((book, index) => (
            <BookCard book={book} key={book.id} index={index} onAdd={() => add(book)} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Search size={32} />
          <h3>No books found</h3>
          <p>Try another title, author or category.</p>
        </div>
      )}
    </motion.div>
  );
}

function Cart({ user, cart, setCart }) {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const total = cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  const refresh = async (request) => {
    try {
      setError("");
      setCart(await request());
    } catch (err) {
      setError(err.message);
    }
  };

  const checkout = async () => {
    setLoading(true);
    try {
      await api.checkout();
      navigate("/invoice");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <EmptyPage icon={<ShoppingBag size={34} />} title="Login to view your cart" text="Your cart is saved to your account, so sign in to continue." action={<Link className="primary-btn" to="/login">Login to continue <LogIn size={17} /></Link>} />;
  }

  return (
    <motion.div className="page cart-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <section className="simple-page-header"><div className="eyebrow"><ShoppingBag size={15} /> Your bag</div><h1>Ready when<br /><span>you are.</span></h1><p>Review your books, then generate your invoice. No payment is collected here.</p></section>
      {error && <div className="form-error page-message">{error}</div>}
      {!cart.length ? <EmptyPage icon={<ShoppingBag size={34} />} title="Your cart is empty" text="Find a book you would like to take home." action={<Link className="primary-btn" to="/catalogue">Browse catalogue <ArrowRight size={17} /></Link>} /> : (
        <div className="cart-layout">
          <div className="cart-items">
            {cart.map((item) => <div className="cart-item" key={item.id}>
              <img src={item.coverUrl} alt={item.title} />
              <div className="cart-item-info"><span className="tag">{item.author}</span><h3>{item.title}</h3><strong>₹{Number(item.price).toFixed(0)}</strong></div>
              <div className="quantity-control"><button aria-label="Decrease quantity" onClick={() => item.quantity === 1 ? refresh(() => api.removeCartItem(item.id)) : refresh(() => api.updateCartItem(item.id, item.quantity - 1))}><Minus size={15} /></button><span>{item.quantity}</span><button aria-label="Increase quantity" onClick={() => refresh(() => api.updateCartItem(item.id, item.quantity + 1))}><Plus size={15} /></button></div>
              <button className="icon-btn" aria-label={`Remove ${item.title}`} onClick={() => refresh(() => api.removeCartItem(item.id))}><Trash2 size={17} /></button>
            </div>)}
          </div>
          <aside className="cart-summary"><span className="eyebrow">Order summary</span><div><span>Books</span><strong>{cart.reduce((sum, item) => sum + item.quantity, 0)}</strong></div><div className="summary-total"><span>Total</span><strong>₹{total.toFixed(2)}</strong></div><button className="submit-btn full-btn" onClick={checkout} disabled={loading}>{loading ? "Generating invoice..." : "Place order & generate invoice"} <ArrowRight size={17} /></button></aside>
        </div>
      )}
    </motion.div>
  );
}

function Invoice({ user }) {
  const [invoice, setInvoice] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => { if (user) api.getLatestInvoice().then(setInvoice).catch((err) => setError(err.message)); }, [user]);
  if (!user) return <EmptyPage icon={<LogIn size={34} />} title="Login to view invoices" text="Your invoices are connected to your account." action={<Link className="primary-btn" to="/login">Login <LogIn size={17} /></Link>} />;
  if (error) return <EmptyPage icon={<BookOpen size={34} />} title="No invoice yet" text={error} action={<Link className="primary-btn" to="/catalogue">Shop books <ArrowRight size={17} /></Link>} />;
  if (!invoice) return <div className="loading-state">Loading your invoice...</div>;
  return <motion.div className="page invoice-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><div className="invoice-sheet"><div className="invoice-top"><div><div className="eyebrow"><CheckCircle2 size={15} /> Order confirmed</div><h1>Your invoice</h1><p>Thank you for choosing Vaishnavi Books.</p></div><div className="invoice-brand"><BookOpen size={18} /> Vaishnavi</div></div><div className="invoice-meta"><div><span>Invoice number</span><strong>{invoice.invoiceNumber}</strong></div><div><span>Issued</span><strong>{new Date(invoice.createdAt).toLocaleString()}</strong></div><div><span>Billed to</span><strong>{invoice.customerName}<br />{invoice.customerEmail}</strong></div></div><div className="invoice-table"><div className="invoice-row invoice-head"><span>Book</span><span>Qty</span><span>Price</span></div>{invoice.items.map((item) => <div className="invoice-row" key={item.title}><span><strong>{item.title}</strong><small>{item.author}</small></span><span>{item.quantity}</span><span>₹{(Number(item.unitPrice) * item.quantity).toFixed(2)}</span></div>)}</div><div className="invoice-total"><span>Total</span><strong>₹{Number(invoice.total).toFixed(2)}</strong></div><Link to="/catalogue" className="text-btn">Continue browsing <ArrowRight size={17} /></Link></div></motion.div>;
}

function EmptyPage({ icon, title, text, action }) {
  return <div className="empty-state page-empty">{icon}<h2>{title}</h2><p>{text}</p>{action}</div>;
}

function BookCard({ book, index, onAdd }) {
  return (
    <motion.article
      className="book-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      whileHover={{ y: -8 }}
    >
      <div className="book-image-wrap">
        <img src={book.coverUrl} alt={book.title} className="book-image" />
        <button className="heart-btn" aria-label="Favourite"><Heart size={18} /></button>
        <span className="stock-pill">{book.stock} left</span>
      </div>

      <div className="book-info">
        <div className="book-meta">
          <span className="tag">{book.category}</span>
          <span className="rating"><Star size={14} fill="currentColor" /> {book.rating}</span>
        </div>
        <h3>{book.title}</h3>
        <p className="author">{book.author}</p>
        <p className="description">{book.description}</p>

        <div className="book-footer">
          <strong>₹{Number(book.price).toFixed(0)}</strong>
          <button onClick={onAdd} className="add-btn">Add <ShoppingBag size={15} /></button>
        </div>
      </div>
    </motion.article>
  );
}

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await api.login(form);
      if (!result.success) throw new Error(result.message);
      onLogin(result);
      navigate("/catalogue");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back."
      subtitle="Sign in to continue your reading journey."
      sideTitle="Your shelf is waiting."
      sideText="Keep your favourite books close and discover something new."
    >
      <AuthForm
        title="Sign in"
        submitText={loading ? "Signing in..." : "Sign in"}
        form={form}
        setForm={setForm}
        onSubmit={submit}
        error={error}
        footer={<span>New here? <Link to="/register">Create an account</Link></span>}
      />
    </AuthLayout>
  );
}

function Register({ onLogin }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await api.register(form);
      if (!result.success) throw new Error(result.message);
      onLogin(result);
      navigate("/catalogue");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Start your journey."
      subtitle="Create your free account and explore the catalogue."
      sideTitle="Read. Learn. Grow."
      sideText="A simple online book store designed for curious readers."
    >
      <AuthForm
        title="Create account"
        register
        submitText={loading ? "Creating..." : "Create account"}
        form={form}
        setForm={setForm}
        onSubmit={submit}
        error={error}
        footer={<span>Already registered? <Link to="/login">Sign in</Link></span>}
      />
    </AuthLayout>
  );
}

function AuthLayout({ title, subtitle, sideTitle, sideText, children }) {
  return (
    <motion.div className="auth-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="auth-visual">
        <div className="auth-glow" />
        <Link to="/" className="auth-logo"><BookOpen size={18} /> Vaishnavi</Link>
        <div className="auth-copy">
          <div className="eyebrow dark"><Sparkles size={15} /> Online book store</div>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
        <div className="quote-card">
          <div className="quote-icon">“</div>
          <h2>{sideTitle}</h2>
          <p>{sideText}</p>
        </div>
      </div>

      <div className="auth-panel">
        <div className="auth-panel-inner">{children}</div>
      </div>
    </motion.div>
  );
}

function AuthForm({ title, register, submitText, form, setForm, onSubmit, error, footer }) {
  return (
    <form className="auth-form" onSubmit={onSubmit}>
      <div className="form-icon">{register ? <UserPlus size={21} /> : <LogIn size={21} />}</div>
      <h2>{title}</h2>
      <p className="form-subtitle">{register ? "It only takes a minute." : "Enter your details below."}</p>

      {register && (
        <label>
          Full name
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Vaishnavi Narkhede"
          />
        </label>
      )}

      <label>
        Email address
        <input
          required
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="you@example.com"
        />
      </label>

      <label>
        Password
        <input
          required
          minLength={6}
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="Minimum 6 characters"
        />
      </label>

      {error && <div className="form-error">{error}</div>}

      <button className="submit-btn" disabled={submitText.includes("...")} type="submit">
        {submitText} <ArrowRight size={17} />
      </button>

      <div className="form-footer">{footer}</div>
    </form>
  );
}


function Footer() {
  return (
    <footer className="footer">
      <div className="footer-brand"><BookOpen size={17} /> Vaishnavi</div>
      <p>Modern books. Meaningful stories.</p>
      <div className="copyright">© 2026 Vaishnavi Narkhede roll no:48</div>
    </footer>
  );
}

export default App;
