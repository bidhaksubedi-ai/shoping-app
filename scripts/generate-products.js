import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve current directory for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PRODUCTS_DIR = path.join(__dirname, '..', 'public', 'products');
const OUTPUT_FILE = path.join(__dirname, '..', 'public', 'products.json');

const CATEGORIES = ['clothes', 'footwear', 'cosmetics', 'babywear'];

// SVG drawings for all 12 demo products to make them look stunning
const SAMPLE_IMAGES = {
  'classic-denim-jacket': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
    <rect width="400" height="400" fill="#1e1b4b"/>
    <path d="M200,80 L250,110 L280,95 L330,150 L280,180 L280,320 L120,320 L120,180 L70,150 L120,95 L150,110 Z" fill="#4f46e5" opacity="0.9"/>
    <path d="M170,80 C170,95 230,95 230,80 Z" fill="#1e1b4b"/>
    <circle cx="200" cy="150" r="10" fill="#ffffff" opacity="0.8"/>
    <circle cx="200" cy="200" r="10" fill="#ffffff" opacity="0.8"/>
    <circle cx="200" cy="250" r="10" fill="#ffffff" opacity="0.8"/>
    <text x="200" y="360" font-family="'Plus Jakarta Sans', sans-serif" font-size="20" fill="#ffffff" font-weight="bold" text-anchor="middle">Denim Jacket</text>
  </svg>`,
  'linen-casual-shirt': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
    <rect width="400" height="400" fill="#f8fafc"/>
    <path d="M200,90 L260,115 L290,100 L320,160 L270,185 L270,330 L130,330 L130,185 L80,160 L110,100 L140,115 Z" fill="#bae6fd" opacity="0.95"/>
    <path d="M175,90 L200,120 L225,90 Z" fill="#f8fafc"/>
    <line x1="200" y1="130" x2="200" y2="330" stroke="#38bdf8" stroke-width="3" stroke-dasharray="10 10"/>
    <text x="200" y="370" font-family="'Plus Jakarta Sans', sans-serif" font-size="20" fill="#0f172a" font-weight="bold" text-anchor="middle">Linen Shirt</text>
  </svg>`,
  'high-waisted-jeans': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
    <rect width="400" height="400" fill="#f1f5f9"/>
    <path d="M140,90 L260,90 L280,330 L210,330 L200,160 L190,330 L120,330 Z" fill="#2563eb" opacity="0.9"/>
    <path d="M140,90 H260 V120 H140 Z" fill="#1d4ed8"/>
    <rect x="180" y="90" width="40" height="15" fill="#facc15"/>
    <text x="200" y="370" font-family="'Plus Jakarta Sans', sans-serif" font-size="20" fill="#0f172a" font-weight="bold" text-anchor="middle">Waisted Jeans</text>
  </svg>`,
  'retro-court-sneakers': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
    <rect width="400" height="400" fill="#0f172a"/>
    <path d="M100,260 L120,200 L180,180 L280,180 C320,180 340,210 330,240 L310,270 L100,270 Z" fill="#fbbf24" opacity="0.95"/>
    <path d="M100,270 L310,270 L300,290 L110,290 Z" fill="#ffffff" opacity="0.9"/>
    <path d="M180,180 L195,140 L220,140 L210,180 Z" fill="#1e293b"/>
    <text x="200" y="360" font-family="'Plus Jakarta Sans', sans-serif" font-size="20" fill="#ffffff" font-weight="bold" text-anchor="middle">Retro Sneakers</text>
  </svg>`,
  'classic-leather-loafers': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
    <rect width="400" height="400" fill="#fafaf9"/>
    <path d="M100,250 L120,205 L230,195 L310,205 C330,208 340,225 330,245 L310,265 L100,265 Z" fill="#78350f" opacity="0.95"/>
    <path d="M95,265 L320,265 L315,275 L100,275 Z" fill="#1c1917"/>
    <rect x="190" y="195" width="50" height="10" rx="3" fill="#451a03"/>
    <text x="200" y="360" font-family="'Plus Jakarta Sans', sans-serif" font-size="20" fill="#1c1917" font-weight="bold" text-anchor="middle">Leather Loafers</text>
  </svg>`,
  'athletic-running-shoes': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
    <rect width="400" height="400" fill="#f8fafc"/>
    <path d="M80,260 L110,190 L190,170 L290,170 C330,170 350,195 340,230 L320,260 L80,260 Z" fill="#3b82f6" opacity="0.9"/>
    <path d="M80,260 L330,260 L320,280 L90,280 Z" fill="#ef4444" opacity="0.9"/>
    <path d="M150,185 L180,220 M170,180 L200,215 M190,175 L220,210" stroke="#ffffff" stroke-width="5" stroke-linecap="round"/>
    <text x="200" y="360" font-family="'Plus Jakarta Sans', sans-serif" font-size="20" fill="#0f172a" font-weight="bold" text-anchor="middle">Running Shoes</text>
  </svg>`,
  'velvet-matte-lipstick': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
    <rect width="400" height="400" fill="#fdf2f8"/>
    <rect x="160" y="200" width="80" height="130" rx="6" fill="#1e293b"/>
    <rect x="175" y="140" width="50" height="60" fill="#ec4899"/>
    <path d="M175,140 L225,140 L210,95 L175,95 Z" fill="#db2777"/>
    <text x="200" y="370" font-family="'Plus Jakarta Sans', sans-serif" font-size="20" fill="#1e293b" font-weight="bold" text-anchor="middle">Matte Lipstick</text>
  </svg>`,
  'hydrating-face-serum': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
    <rect width="400" height="400" fill="#f0fdf4"/>
    <rect x="150" y="160" width="100" height="170" rx="12" fill="#ffffff" stroke="#10b981" stroke-width="4"/>
    <rect x="180" y="110" width="40" height="50" fill="#6b7280"/>
    <path d="M190,110 L210,110 L200,60 Z" fill="#d1d5db"/>
    <rect x="170" y="210" width="60" height="40" rx="4" fill="#a7f3d0"/>
    <text x="200" y="370" font-family="'Plus Jakarta Sans', sans-serif" font-size="20" fill="#14532d" font-weight="bold" text-anchor="middle">Face Serum</text>
  </svg>`,
  'waterproof-mascara': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
    <rect width="400" height="400" fill="#fafaf9"/>
    <rect x="140" y="100" width="40" height="230" rx="8" fill="#1c1917"/>
    <rect x="220" y="120" width="20" height="210" rx="4" fill="#a8a29e"/>
    <path d="M210,120 L250,120 L230,80 Z" fill="#7c2d12"/>
    <text x="200" y="370" font-family="'Plus Jakarta Sans', sans-serif" font-size="20" fill="#1c1917" font-weight="bold" text-anchor="middle">Waterproof Mascara</text>
  </svg>`,
  'organic-cotton-onesie': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
    <rect width="400" height="400" fill="#ecfeff"/>
    <path d="M150,100 L250,100 L270,140 L230,170 L230,280 L260,300 L220,330 L180,330 L140,300 L170,280 L170,170 L130,140 Z" fill="#06b6d4" opacity="0.9"/>
    <path d="M180,100 C180,115 220,115 220,100 Z" fill="#ecfeff"/>
    <text x="200" y="375" font-family="'Plus Jakarta Sans', sans-serif" font-size="20" fill="#083344" font-weight="bold" text-anchor="middle">Baby Onesie</text>
  </svg>`,
  'knit-hooded-romper': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
    <rect width="400" height="400" fill="#fffbeb"/>
    <path d="M150,120 L250,120 L270,160 L230,190 L230,290 L220,330 L180,330 L170,290 L130,160 Z" fill="#f59e0b" opacity="0.95"/>
    <circle cx="200" cy="80" r="30" fill="#f59e0b"/>
    <circle cx="175" cy="55" r="10" fill="#b45309"/>
    <circle cx="225" cy="55" r="10" fill="#b45309"/>
    <text x="200" y="375" font-family="'Plus Jakarta Sans', sans-serif" font-size="20" fill="#451a03" font-weight="bold" text-anchor="middle">Knit Romper</text>
  </svg>`,
  'swaddle-blanket-set': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
    <rect width="400" height="400" fill="#f0fdfa"/>
    <rect x="120" y="110" width="160" height="60" rx="10" fill="#2dd4bf" opacity="0.9"/>
    <rect x="120" y="180" width="160" height="60" rx="10" fill="#99f6e4" opacity="0.9"/>
    <rect x="120" y="250" width="160" height="60" rx="10" fill="#0d9488" opacity="0.9"/>
    <text x="200" y="370" font-family="'Plus Jakarta Sans', sans-serif" font-size="20" fill="#042f2e" font-weight="bold" text-anchor="middle">Swaddle Set</text>
  </svg>`
};

const SAMPLE_PRODUCTS = {
  clothes: [
    {
      folder: 'classic-denim-jacket',
      imageName: 'jacket.svg',
      info: {
        name: "Classic Indigo Denim Jacket",
        price: 1899,
        originalPrice: 3499,
        description: "A premium weight indigo wash denim jacket with button chest pockets, button cuffs, and adjustable waist tabs. Styled for a timeless streetwear aesthetic.",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Indigo Wash", "Light Blue", "Vintage Black"],
        stock: 12,
        isFeatured: true
      }
    },
    {
      folder: 'linen-casual-shirt',
      imageName: 'shirt.svg',
      info: {
        name: "Premium Linen Casual Shirt",
        price: 1499,
        originalPrice: 2499,
        description: "Crafted from highly breathable organic flax linen, this relaxed-fit shirt features a button-down collar and a patch chest pocket. Ideal for summer styling.",
        sizes: ["M", "L", "XL"],
        colors: ["Mint Green", "Sand Beige", "Pastel Pink", "Classic White"],
        stock: 18,
        isFeatured: true
      }
    },
    {
      folder: 'high-waisted-jeans',
      imageName: 'jeans.svg',
      info: {
        name: "Vintage High-Waisted Slim Jeans",
        price: 1999,
        originalPrice: 3999,
        description: "Sturdy cotton denim jeans with a flattering high-rise waist, classic 5-pocket construction, and a slightly tapered slim ankle profile.",
        sizes: ["28", "30", "32", "34"],
        colors: ["Acid Blue", "Stone Wash Grey", "Deep Indigo"],
        stock: 15,
        isFeatured: false
      }
    }
  ],
  footwear: [
    {
      folder: 'retro-court-sneakers',
      imageName: 'sneakers.svg',
      info: {
        name: "Retro Court Leather Sneakers",
        price: 2499,
        originalPrice: 4999,
        description: "Classic court-inspired sneakers with a genuine soft-grain leather upper, textured rubber outsole for traction, and vintage cream overlays.",
        sizes: ["7", "8", "9", "10", "11"],
        colors: ["Vintage White", "Forest Green Accent", "Midnight Navy Accent"],
        stock: 8,
        isFeatured: true
      }
    },
    {
      folder: 'classic-leather-loafers',
      imageName: 'loafers.svg',
      info: {
        name: "Handcrafted Leather Penny Loafers",
        price: 2999,
        originalPrice: 5499,
        description: "Elegant and comfortable, these loafers are made with hand-stitched grain leather, detailed with a penny strap across the vamp and finished with lightweight stacked heels.",
        sizes: ["8", "9", "10", "11"],
        colors: ["Mahogany Brown", "Classic Black", "Tan Leather"],
        stock: 6,
        isFeatured: true
      }
    },
    {
      folder: 'athletic-running-shoes',
      imageName: 'running.svg',
      info: {
        name: "AeroPulse Athletic Running Shoes",
        price: 3499,
        originalPrice: 6999,
        description: "High-performance running shoes equipped with a multi-directional mesh outer shell for ventilation, and a responsive EVA foam sole to absorb high impacts.",
        sizes: ["7", "8", "9", "10"],
        colors: ["Neon Blue", "Signal Orange", "Stealth Grey"],
        stock: 10,
        isFeatured: false
      }
    }
  ],
  cosmetics: [
    {
      folder: 'velvet-matte-lipstick',
      imageName: 'lipstick.svg',
      info: {
        name: "Velvet Matte Moisture Lipstick",
        price: 799,
        originalPrice: 1299,
        description: "Richly pigmented moisturizing matte lipstick that glides on smoothly and stays comfortable all day without drying your lips.",
        sizes: ["Standard"],
        colors: ["Ruby Sunset", "Dusty Rose", "Plum Fusion"],
        stock: 25,
        isFeatured: true
      }
    },
    {
      folder: 'hydrating-face-serum',
      imageName: 'serum.svg',
      info: {
        name: "GlowBoost Hydrating Face Serum",
        price: 1199,
        originalPrice: 1999,
        description: "Formulated with 10% Vitamin C and pure Hyaluronic Acid, this ultra-light serum hydrates deeply, brightens dark spots, and rejuvenates tired skin.",
        sizes: ["30ml Bottle"],
        colors: ["Standard Drops"],
        stock: 30,
        isFeatured: true
      }
    },
    {
      folder: 'waterproof-mascara',
      imageName: 'mascara.svg',
      info: {
        name: "Infinity Lash Waterproof Mascara",
        price: 699,
        originalPrice: 1099,
        description: "Get maximum length and lift. Our signature smudge-proof, carbon-black waterproof formula lasts up to 24 hours without flaking.",
        sizes: ["Standard Tube"],
        colors: ["Pitch Black", "Brownish Black"],
        stock: 40,
        isFeatured: false
      }
    }
  ],
  babywear: [
    {
      folder: 'organic-cotton-onesie',
      imageName: 'onesie.svg',
      info: {
        name: "Organic Cotton Baby Onesie Pack",
        price: 999,
        originalPrice: 1699,
        description: "Super-soft, breathable organic cotton onesies featuring nickel-free snaps at the diaper line and expandable shoulders for easy dressing.",
        sizes: ["0-3M", "3-6M", "6-12M", "12-18M"],
        colors: ["Sky Blue", "Cloud Gray", "Sage Green"],
        stock: 15,
        isFeatured: false
      }
    },
    {
      folder: 'knit-hooded-romper',
      imageName: 'romper.svg',
      info: {
        name: "Bear-Ears Knit Hooded Romper",
        price: 1299,
        originalPrice: 2199,
        description: "Adorable heavy-knit romper with teddy bear ears on the hood, finished with cozy cuffs and front-opening wooden buttons for quick baby styling.",
        sizes: ["3-6M", "6-12M", "12-18M"],
        colors: ["Caramel Wool", "Cream Beige", "Oatmeal Grey"],
        stock: 10,
        isFeatured: true
      }
    },
    {
      folder: 'swaddle-blanket-set',
      imageName: 'swaddles.svg',
      info: {
        name: "Muslin Swaddle Blanket 3-Pack",
        price: 899,
        originalPrice: 1499,
        description: "Made of 100% cotton muslin, these lightweight, breathable swaddles become softer with every wash. Printed with certified non-toxic organic inks.",
        sizes: ["One Size"],
        colors: ["Animal Print Set", "Botanical Set", "Solid Pastels Set"],
        stock: 12,
        isFeatured: true
      }
    }
  ]
};

function ensureDirectories() {
  if (!fs.existsSync(PRODUCTS_DIR)) {
    fs.mkdirSync(PRODUCTS_DIR, { recursive: true });
    console.log(`Created directory: ${PRODUCTS_DIR}`);
  }

  CATEGORIES.forEach(category => {
    const categoryPath = path.join(PRODUCTS_DIR, category);
    if (!fs.existsSync(categoryPath)) {
      fs.mkdirSync(categoryPath, { recursive: true });
      console.log(`Created category directory: ${categoryPath}`);
    }

    if (SAMPLE_PRODUCTS[category]) {
      SAMPLE_PRODUCTS[category].forEach(sample => {
        const productPath = path.join(categoryPath, sample.folder);
        if (!fs.existsSync(productPath)) {
          fs.mkdirSync(productPath, { recursive: true });

          // Write info.json
          fs.writeFileSync(
            path.join(productPath, 'info.json'),
            JSON.stringify(sample.info, null, 2),
            'utf-8'
          );

          // Write SVG image
          fs.writeFileSync(
            path.join(productPath, sample.imageName),
            SAMPLE_IMAGES[sample.folder] || SAMPLE_IMAGES[category],
            'utf-8'
          );

          console.log(`Seeded demo product in category ${category}: ${sample.folder}`);
        }
      });
    }
  });
}

function generateProductIndex() {
  ensureDirectories();

  const productsList = [];

  const categories = fs.readdirSync(PRODUCTS_DIR);

  categories.forEach(category => {
    const categoryPath = path.join(PRODUCTS_DIR, category);
    if (!fs.statSync(categoryPath).isDirectory()) return;

    const productFolders = fs.readdirSync(categoryPath);

    productFolders.forEach(productFolder => {
      const productPath = path.join(categoryPath, productFolder);
      if (!fs.statSync(productPath).isDirectory()) return;

      const infoPath = path.join(productPath, 'info.json');
      let info = {};

      if (fs.existsSync(infoPath)) {
        try {
          const rawInfo = fs.readFileSync(infoPath, 'utf-8');
          info = JSON.parse(rawInfo);
        } catch (err) {
          console.error(`Error parsing info.json in ${productPath}:`, err);
        }
      } else {
        // Fallback info template
        info = {
          name: productFolder.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
          price: 999,
          originalPrice: 1499,
          description: "No description provided.",
          sizes: ["Standard"],
          colors: ["Default"],
          stock: 10,
          isFeatured: false,
          isFlashSale: false
        };
        // Auto-create info.json template for convenience
        fs.writeFileSync(infoPath, JSON.stringify(info, null, 2), 'utf-8');
      }

      // Read images in the product folder
      const files = fs.readdirSync(productPath);
      const images = files.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.webp', '.svg'].includes(ext);
      }).map(file => {
        // Output path relative to client app serving public folder
        return `/products/${category}/${productFolder}/${file}`;
      });

      // Assemble final product object
      const product = {
        id: `${category}-${productFolder}`,
        category: category,
        name: info.name || productFolder,
        price: Number(info.price) || 0,
        originalPrice: Number(info.originalPrice) || 0,
        description: info.description || "",
        sizes: Array.isArray(info.sizes) ? info.sizes : [],
        colors: Array.isArray(info.colors) ? info.colors : [],
        images: images.length > 0 ? images : ['/placeholder.svg'],
        stock: Number(info.stock) || 0,
        isFeatured: !!info.isFeatured,
        isFlashSale: !!info.isFlashSale
      };

      productsList.push(product);
    });
  });

  // Write index file
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(productsList, null, 2), 'utf-8');
  console.log(`Successfully compiled ${productsList.length} products to ${OUTPUT_FILE}`);

  // Generate sitemap.xml dynamically
  try {
    const todayStr = new Date().toISOString().split('T')[0];
    const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
    
    // Extract site url from .env
    let siteUrl = 'https://karishmasubedi.com.np';
    const envPath = path.join(__dirname, '..', '.env');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf-8');
      const match = envContent.match(/VITE_SITE_URL\s*=\s*(.*)/);
      if (match && match[1]) {
        siteUrl = match[1].trim().replace(/['";]/g, '');
      }
    }
    if (siteUrl.endsWith('/')) {
      siteUrl = siteUrl.slice(0, -1);
    }

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    
    // 1. Homepage
    xml += `  <!-- Main Catalog View -->\n`;
    xml += `  <url>\n`;
    xml += `    <loc>${siteUrl}/</loc>\n`;
    xml += `    <lastmod>${todayStr}</lastmod>\n`;
    xml += `    <changefreq>daily</changefreq>\n`;
    xml += `    <priority>1.0</priority>\n`;
    xml += `  </url>\n\n`;
    
    // 2. Help Pages
    xml += `  <!-- Help & Support -->\n`;
    xml += `  <url>\n`;
    xml += `    <loc>${siteUrl}/?view=help-center</loc>\n`;
    xml += `    <lastmod>${todayStr}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.5</priority>\n`;
    xml += `  </url>\n`;
    xml += `  <url>\n`;
    xml += `    <loc>${siteUrl}/?view=help-center&amp;tab=how-to-buy</loc>\n`;
    xml += `    <lastmod>${todayStr}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.5</priority>\n`;
    xml += `  </url>\n`;
    xml += `  <url>\n`;
    xml += `    <loc>${siteUrl}/?view=help-center&amp;tab=contact</loc>\n`;
    xml += `    <lastmod>${todayStr}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.5</priority>\n`;
    xml += `  </url>\n\n`;

    // 3. Products
    xml += `  <!-- Dynamic Products Catalog -->\n`;
    productsList.forEach(product => {
      xml += `  <url>\n`;
      xml += `    <loc>${siteUrl}/?product=${product.id}</loc>\n`;
      xml += `    <lastmod>${todayStr}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `  </url>\n`;
    });
    
    xml += `</urlset>\n`;
    
    fs.writeFileSync(sitemapPath, xml, 'utf-8');
    console.log(`Successfully generated dynamic sitemap with ${productsList.length} products to ${sitemapPath} using base URL ${siteUrl}`);
  } catch (err) {
    console.error('Failed to generate sitemap.xml:', err);
  }
}

generateProductIndex();
