# How to Add New Products to Your Shop

Adding products to your StyleVault shop is designed to be extremely simple and entirely file-based. You do not need to edit any code!

Follow these 4 simple steps to list a new product:

---

### Step 1: Choose or Create a Product Folder
Navigate to the `public/products/` directory, select the appropriate category folder, and create a **new subfolder** named after your product (use lowercase and hyphens, e.g., `satin-midi-dress`):
```text
public/
  products/
    clothes/
      satin-midi-dress/    <-- Create this folder
```

---

### Step 2: Add Product Images
Copy your product pictures (`.jpg`, `.png`, `.webp`, or `.svg`) directly into your newly created folder.
* **Pro Tip:** You can add multiple images! The website will automatically detect them all and create an image gallery with thumbnails on the product detail page. The first image sorted alphabetically will be used as the main cover preview.

---

### Step 3: Create `info.json` for Details
Create a text file named **`info.json`** inside the product folder, and copy-paste the template below, adjusting the values to fit your product:

```json
{
  "name": "Elegant Satin Midi Dress",
  "price": 2499,
  "originalPrice": 3999,
  "description": "A gorgeous cowl-neck satin midi dress with adjustable spaghetti straps and a side slit. Perfect for evening parties.",
  "sizes": ["S", "M", "L"],
  "colors": ["Emerald Green", "Champagne Gold", "Midnight Black"],
  "rating": 4.8,
  "stock": 10,
  "isFeatured": true
}
```

#### Field Details:
* `name`: The title of the product displayed on the site.
* `price`: The selling price (numbers only, do not write currency symbols).
* `originalPrice`: The cross-out price to show discounts. If no discount is active, make this the same as `price`.
* `description`: The full description of the item.
* `sizes`: List of sizes available (leave as `[]` if not applicable).
* `colors`: List of colors/variants available (leave as `[]` if not applicable).
* `rating`: The star rating (from `1.0` to `5.0`).
* `stock`: Quantity in stock.
* `isFeatured`: Set to `true` to prioritize display or `false` otherwise.

*Note: If you run the build script and forget to create this file, the system will automatically generate a default template `info.json` for you inside your product folder, which you can simply open and customize.*

---

### Step 4: Run the Build / Indexer
Run either the development server or compile the final static site:
* For local testing: `npm run dev`
* For hosting build: `npm run build`

**What happens next?**
1. The pre-build script scans `public/products/`, parses the images and `info.json` files, and automatically compiles them into `public/products.json`.
2. The website loads the compiled JSON list at runtime, and your new product is live instantly with search, filters, cart support, and WhatsApp deep-links!
