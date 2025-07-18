 let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function updateCartUI() {
    const cartContainer = document.querySelector(".cart");
    if (cart.length === 0) {
      cartContainer.innerHTML = `<h5>Your Cart</h5><p class="cart-empty">Cart is empty.</p>`;
      document.querySelector(".badge").textContent = 0;
      return;
    }

    const itemsHTML = cart.map((item, index) => `
      <div class="cart-item d-flex justify-content-between align-items-center">
        <div>
          <strong>${item.name}</strong><br>
          $${item.price} x ${item.quantity} = $${item.price * item.quantity}
        </div>
        <div class="cart-controls">
          <button class="btn btn-sm btn-outline-secondary" onclick="changeQuantity(${index}, -1)">-</button>
          <button class="btn btn-sm btn-outline-secondary" onclick="changeQuantity(${index}, 1)">+</button>
          <button class="btn btn-sm btn-outline-danger" onclick="removeItem(${index})">🗑️</button>
        </div>
      </div>
    `).join("");

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    cartContainer.innerHTML = `
      <h5>Your Cart</h5>
      ${itemsHTML}
      <div class="total d-flex justify-content-between mt-3">
        <span>Total:</span>
        <span>$${total}</span>
      </div>
      <button class="btn btn-success w-100 mt-3" id="checkoutBtn">Checkout</button>
      <div id="userFormContainer" class="mt-3"></div>
    `;

    document.querySelector(".badge").textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  function addToCart(name, price) {
    const existing = cart.find(item => item.name === name);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ name, price, quantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartUI();
  }

  function changeQuantity(index, delta) {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartUI();
  }

  function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartUI();
  }

  // Add to cart buttons
  document.querySelectorAll(".add-to-cart-btn").forEach(button => {
    button.addEventListener("click", () => {
      const card = button.closest(".product-card");
      const name = card.querySelector("h5").textContent;
      const price = parseFloat(card.querySelector("p").textContent.replace("$", ""));
      addToCart(name, price);
    });
  });

  // Toggle cart overlay
  document.getElementById("toggleCart").addEventListener("click", function () {
    const cartSection = document.getElementById("cartSection");
    cartSection.style.display = cartSection.style.display === "none" ? "block" : "none";
    updateCartUI();
  });

  // Checkout process
  document.addEventListener("click", function (e) {
    if (e.target && e.target.id === "checkoutBtn") {
      const formHTML = `
        <div class="mt-3">
          <input type="text" id="userName" class="form-control mb-2" placeholder="Enter your name" required>
          <input type="text" id="userAddress" class="form-control mb-2" placeholder="Enter your address" required>
          <input type="text" id="userPhone" class="form-control mb-2" placeholder="Enter your phone number" required>
          <button class="btn btn-warning w-100" id="confirmOrder">Confirm Order</button>
        </div>
      `;
      document.getElementById("userFormContainer").innerHTML = formHTML;
    }

    if (e.target && e.target.id === "confirmOrder") {
      const name = document.getElementById("userName").value.trim();
      const address = document.getElementById("userAddress").value.trim();
      const phone = document.getElementById("userPhone").value.trim();

      if (!name || !address || !phone) {
        alert("Please fill in all the details.");
        return;
      }

      const orderDetails = {
        user: { name, address, phone },
        cart,
        total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        date: new Date().toLocaleString()
      };

      localStorage.setItem("order", JSON.stringify(orderDetails));
      alert("✅ Order placed successfully!");

      cart = [];
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartUI();
    }
  });

  // Clear cart button
  document.getElementById("clearCartBtn").addEventListener("click", function () {
    if (confirm("Are you sure you want to clear the cart?")) {
      cart = [];
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartUI();
    }
  });

  // Search functionality
  document.querySelector("#searchform button[type='submit']").addEventListener("click", function () {
    const query = document.getElementById("searchinput").value.trim().toLowerCase();
    const productCards = document.querySelectorAll(".product-card");

    productCards.forEach(card => {
      const productName = card.querySelector("h5").textContent.toLowerCase();
      card.parentElement.style.display = productName.includes(query) ? "block" : "none";
    });
  });

  // Reset product visibility when input is cleared
  document.getElementById("searchinput").addEventListener("input", function () {
    if (this.value.trim() === "") {
      document.querySelectorAll(".product-card").forEach(card => {
        card.parentElement.style.display = "block";
      });
    }
  });

  // Initial load
  updateCartUI();