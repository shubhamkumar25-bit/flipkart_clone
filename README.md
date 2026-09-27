# flipkart_clone

Responsive Flipkart-style shopping UI built with plain HTML, CSS and JavaScript.

## Pages

- `index.html` — header with search, category strip, banner, product grid with add-to-cart
- `cart.html` — cart items with quantity update/remove and price summary
- `payment.html` — card / UPI / cash-on-delivery payment with validation and order confirmation

Cart state is stored in `localStorage`, so no backend is needed.

## Run locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```
