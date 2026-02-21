#!/usr/bin/env node
/**
 * Migration script: Supabase -> Medusa.js v2
 *
 * Usage:
 *   SUPABASE_URL=xxx SUPABASE_ANON_KEY=xxx node scripts/migrate-from-supabase.mjs
 *
 * Prerequisites:
 *   - npm install @supabase/supabase-js (run from mulyam-medusa/)
 *   - Medusa server running at http://localhost:9000
 *   - Admin user created (run `npx medusa user -e admin@mulyamjewels.com -p admin123`)
 */

import { createClient } from "@supabase/supabase-js";

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const MEDUSA_URL = process.env.MEDUSA_URL || "http://localhost:9000";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@mulyamjewels.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error(
    "Error: SUPABASE_URL and SUPABASE_ANON_KEY environment variables are required."
  );
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let authToken = null;

async function medusaAdmin(method, path, body) {
  const url = `${MEDUSA_URL}/admin${path}`;
  const opts = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(url, opts);
  const text = await res.text();

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }

  if (!res.ok) {
    const msg =
      typeof data === "object" ? JSON.stringify(data, null, 2) : data;
    throw new Error(`${method} ${path} failed (${res.status}): ${msg}`);
  }
  return data;
}

function log(emoji, msg) {
  console.log(`${emoji}  ${msg}`);
}

// ---------------------------------------------------------------------------
// Step 1 - Authenticate with Medusa Admin API
// ---------------------------------------------------------------------------

async function authenticate() {
  log("[AUTH]", "Authenticating with Medusa Admin API...");

  const res = await fetch(`${MEDUSA_URL}/auth/user/emailpass`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(
      `Authentication failed (${res.status}): ${err}\n` +
        `Make sure admin user exists: npx medusa user -e ${ADMIN_EMAIL} -p ${ADMIN_PASSWORD}`
    );
  }

  const data = await res.json();
  authToken = data.token;
  log("[AUTH]", "Authenticated successfully.");
}

// ---------------------------------------------------------------------------
// Step 2 - Create Sales Channel
// ---------------------------------------------------------------------------

async function createSalesChannel() {
  log("[CHANNEL]", "Creating sales channel...");

  // Check for existing sales channels
  const existing = await medusaAdmin("GET", "/sales-channels");
  const found = existing.sales_channels?.find(
    (sc) => sc.name === "Mulyam Jewels Online Store"
  );
  if (found) {
    log("[CHANNEL]", `Sales channel already exists: ${found.id}`);
    return found;
  }

  const { sales_channel } = await medusaAdmin("POST", "/sales-channels", {
    name: "Mulyam Jewels Online Store",
    description: "Online store for Mulyam Jewels - demi-fine jewelry",
    is_disabled: false,
  });

  log("[CHANNEL]", `Created sales channel: ${sales_channel.id}`);
  return sales_channel;
}

// ---------------------------------------------------------------------------
// Step 3 - Configure Store Currency (INR)
// ---------------------------------------------------------------------------

async function configureStore() {
  log("[STORE]", "Configuring store with INR currency...");

  // Get the store (v2 uses plural /stores endpoint)
  const { stores } = await medusaAdmin("GET", "/stores");
  const store = stores[0];

  // Update store with supported currencies
  await medusaAdmin("POST", `/stores/${store.id}`, {
    supported_currencies: [
      {
        currency_code: "inr",
        is_default: true,
      },
    ],
  });

  log("[STORE]", "Store configured with INR as default currency.");
  return store;
}

// ---------------------------------------------------------------------------
// Step 4 - Create Shipping Profile
// ---------------------------------------------------------------------------

async function getOrCreateShippingProfile() {
  log("[SHIPPING]", "Setting up shipping profile...");

  const { shipping_profiles } = await medusaAdmin(
    "GET",
    "/shipping-profiles"
  );

  // Use the default profile if it exists
  if (shipping_profiles?.length > 0) {
    const profile = shipping_profiles[0];
    log("[SHIPPING]", `Using existing shipping profile: ${profile.id}`);
    return profile;
  }

  const { shipping_profile } = await medusaAdmin(
    "POST",
    "/shipping-profiles",
    {
      name: "Standard",
      type: "default",
    }
  );

  log("[SHIPPING]", `Created shipping profile: ${shipping_profile.id}`);
  return shipping_profile;
}

// ---------------------------------------------------------------------------
// Step 5 - Create Stock Location & Fulfillment
// ---------------------------------------------------------------------------

async function setupFulfillment(salesChannel) {
  log("[FULFILLMENT]", "Setting up fulfillment and stock location...");

  // Create stock location
  let stockLocation;
  const { stock_locations } = await medusaAdmin("GET", "/stock-locations");
  if (stock_locations?.length > 0) {
    stockLocation = stock_locations[0];
    log(
      "[FULFILLMENT]",
      `Using existing stock location: ${stockLocation.id}`
    );
  } else {
    const result = await medusaAdmin("POST", "/stock-locations", {
      name: "Mulyam Jewels Warehouse",
      address: {
        address_1: "Mumbai",
        country_code: "in",
      },
    });
    stockLocation = result.stock_location;
    log("[FULFILLMENT]", `Created stock location: ${stockLocation.id}`);
  }

  // Associate sales channel with stock location
  try {
    await medusaAdmin(
      "POST",
      `/stock-locations/${stockLocation.id}/sales-channels`,
      {
        add: [salesChannel.id],
      }
    );
    log("[FULFILLMENT]", "Linked stock location to sales channel.");
  } catch (e) {
    log("[FULFILLMENT]", `Sales channel link note: ${e.message}`);
  }

  // Get or create fulfillment set
  let fulfillmentSet;
  try {
    const { fulfillment_sets } = await medusaAdmin(
      "GET",
      "/fulfillment-sets"
    );
    if (fulfillment_sets?.length > 0) {
      fulfillmentSet = fulfillment_sets[0];
    }
  } catch {
    // fulfillment sets endpoint may not exist, that's okay
  }

  return { stockLocation, fulfillmentSet };
}

// ---------------------------------------------------------------------------
// Step 6 - Create Region (India)
// ---------------------------------------------------------------------------

async function createRegion() {
  log("[REGION]", "Creating India region...");

  const { regions } = await medusaAdmin("GET", "/regions");
  const existing = regions?.find(
    (r) => r.name === "India" || r.currency_code === "inr"
  );
  if (existing) {
    log("[REGION]", `Region already exists: ${existing.id}`);
    return existing;
  }

  const { region } = await medusaAdmin("POST", "/regions", {
    name: "India",
    currency_code: "inr",
    countries: ["in"],
    automatic_taxes: true,
    tax_rate: 3, // 3% GST for jewelry under 5 lakhs
  });

  log("[REGION]", `Created region: ${region.id}`);
  return region;
}

// ---------------------------------------------------------------------------
// Step 7 - Create Collections
// ---------------------------------------------------------------------------

const COLLECTION_MAP = {
  diva: { title: "Mulyam DIVA", handle: "diva" },
  mini: { title: "Mulyam MINI", handle: "mini" },
  paws: { title: "Mulyam PAWS", handle: "paws" },
  bond: { title: "Mulyam BOND", handle: "bond" },
};

async function createCollections() {
  log("[COLLECTIONS]", "Creating product collections...");

  const collectionIds = {};

  for (const [key, meta] of Object.entries(COLLECTION_MAP)) {
    // Check if exists
    const { collections } = await medusaAdmin(
      "GET",
      `/collections?handle[]=${meta.handle}`
    );
    if (collections?.length > 0) {
      collectionIds[key] = collections[0].id;
      log("[COLLECTIONS]", `  ${meta.title} already exists: ${collections[0].id}`);
      continue;
    }

    const { collection } = await medusaAdmin("POST", "/collections", {
      title: meta.title,
      handle: meta.handle,
    });
    collectionIds[key] = collection.id;
    log("[COLLECTIONS]", `  Created ${meta.title}: ${collection.id}`);
  }

  return collectionIds;
}

// ---------------------------------------------------------------------------
// Step 8 - Create Categories
// ---------------------------------------------------------------------------

const CATEGORIES = ["Bracelets", "Earrings", "Necklaces", "Rings", "Anklets"];

async function createCategories() {
  log("[CATEGORIES]", "Creating product categories...");

  const categoryIds = {};

  for (const name of CATEGORIES) {
    const handle = name.toLowerCase();

    // Check if exists
    const { product_categories } = await medusaAdmin(
      "GET",
      `/product-categories?handle[]=${handle}`
    );
    if (product_categories?.length > 0) {
      categoryIds[handle] = product_categories[0].id;
      log(
        "[CATEGORIES]",
        `  ${name} already exists: ${product_categories[0].id}`
      );
      continue;
    }

    const { product_category } = await medusaAdmin(
      "POST",
      "/product-categories",
      {
        name,
        handle,
        is_active: true,
        is_internal: false,
      }
    );
    categoryIds[handle] = product_category.id;
    log("[CATEGORIES]", `  Created ${name}: ${product_category.id}`);
  }

  return categoryIds;
}

// ---------------------------------------------------------------------------
// Step 9 - Fetch Products from Supabase
// ---------------------------------------------------------------------------

async function fetchSupabaseProducts() {
  log("[SUPABASE]", "Fetching products from Supabase...");

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    throw new Error(`Supabase query failed: ${error.message}`);
  }

  log("[SUPABASE]", `Fetched ${data.length} products.`);
  return data;
}

// ---------------------------------------------------------------------------
// Step 10 - Migrate Products
// ---------------------------------------------------------------------------

async function migrateProducts(
  products,
  collectionIds,
  categoryIds,
  salesChannel,
  shippingProfile
) {
  log("[MIGRATE]", `Starting migration of ${products.length} products...`);

  const stats = { total: products.length, created: 0, skipped: 0, failed: 0 };

  for (const product of products) {
    try {
      // Check if product already exists by handle
      const handle = product.slug || product.id;
      const { products: existing } = await medusaAdmin(
        "GET",
        `/products?handle[]=${handle}`
      );

      if (existing?.length > 0) {
        log("[SKIP]", `  ${product.name} (${handle}) already exists.`);
        stats.skipped++;
        continue;
      }

      // Build images array
      const images = Array.isArray(product.images)
        ? product.images.map((url) => ({ url }))
        : [];

      // Build product payload
      const payload = {
        title: product.name,
        handle,
        description: product.description || "",
        status: product.is_live ? "published" : "draft",
        images,
        thumbnail: images.length > 0 ? images[0].url : undefined,
        metadata: {
          material: product.material || null,
          plating: product.plating || null,
          is_bestseller: product.is_bestseller || false,
          legacy_supabase_id: product.id,
        },
        // Options
        options: [
          {
            title: "Size",
            values: [product.size || "Standard"],
          },
          {
            title: "Color",
            values: [product.color || "Gold"],
          },
        ],
        // Variants
        variants: [
          {
            title: `${product.size || "Standard"} / ${product.color || "Gold"}`,
            sku: product.sku || product.id.toUpperCase(),
            manage_inventory: true,
            options: {
              Size: product.size || "Standard",
              Color: product.color || "Gold",
            },
            prices: [
              {
                amount: (product.price || 0) * 100, // Medusa stores in smallest unit (paise)
                currency_code: "inr",
              },
            ],
          },
        ],
        // Sales channels
        sales_channels: [{ id: salesChannel.id }],
      };

      // Add collection if mapped
      if (product.collection && collectionIds[product.collection]) {
        payload.collection_id = collectionIds[product.collection];
      }

      // Add category if mapped
      const categoryHandle = product.category?.toLowerCase();
      if (categoryHandle && categoryIds[categoryHandle]) {
        payload.categories = [{ id: categoryIds[categoryHandle] }];
      }

      // Create product
      const { product: created } = await medusaAdmin(
        "POST",
        "/products",
        payload
      );

      // Set inventory for the variant if stock is provided
      if (product.stock != null && created.variants?.length > 0) {
        try {
          const variant = created.variants[0];
          // Get inventory items for the variant
          const { inventory_items } = await medusaAdmin(
            "GET",
            `/inventory-items?sku=${variant.sku}`
          );
          if (inventory_items?.length > 0) {
            const inventoryItem = inventory_items[0];
            // Get stock location level
            const { inventory_levels } = await medusaAdmin(
              "GET",
              `/inventory-items/${inventoryItem.id}/location-levels`
            );
            if (inventory_levels?.length > 0) {
              await medusaAdmin(
                "POST",
                `/inventory-items/${inventoryItem.id}/location-levels/${inventory_levels[0].id}`,
                {
                  stocked_quantity: product.stock,
                }
              );
            }
          }
        } catch (invErr) {
          log(
            "[INVENTORY]",
            `  Warning: Could not set inventory for ${product.name}: ${invErr.message}`
          );
        }
      }

      stats.created++;
      log(
        "[CREATED]",
        `  ${product.name} (${handle}) -> ${created.id}`
      );
    } catch (err) {
      stats.failed++;
      log(
        "[ERROR]",
        `  Failed to migrate ${product.name}: ${err.message}`
      );
    }
  }

  return stats;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log("=".repeat(60));
  console.log("  Mulyam Jewels: Supabase -> Medusa v2 Migration");
  console.log("=".repeat(60));
  console.log();

  try {
    // Step 1: Authenticate
    await authenticate();

    // Step 2: Create sales channel
    const salesChannel = await createSalesChannel();

    // Step 3: Configure store currency
    await configureStore();

    // Step 4: Shipping profile
    const shippingProfile = await getOrCreateShippingProfile();

    // Step 5: Fulfillment & stock location
    await setupFulfillment(salesChannel);

    // Step 6: Create region
    await createRegion();

    // Step 7: Create collections
    const collectionIds = await createCollections();

    // Step 8: Create categories
    const categoryIds = await createCategories();

    // Step 9: Fetch Supabase products
    const products = await fetchSupabaseProducts();

    // Step 10: Migrate products
    const stats = await migrateProducts(
      products,
      collectionIds,
      categoryIds,
      salesChannel,
      shippingProfile
    );

    // Summary
    console.log();
    console.log("=".repeat(60));
    console.log("  Migration Complete!");
    console.log("=".repeat(60));
    console.log(`  Total:   ${stats.total}`);
    console.log(`  Created: ${stats.created}`);
    console.log(`  Skipped: ${stats.skipped}`);
    console.log(`  Failed:  ${stats.failed}`);
    console.log("=".repeat(60));

    if (stats.failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error("\nFatal error:", err.message);
    process.exit(1);
  }
}

main();
