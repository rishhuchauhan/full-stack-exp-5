// -----------------------------
// E-commerce Catalog using MongoDB & Mongoose
// -----------------------------

const mongoose = require("mongoose");

// ✅ Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/ecommerceDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ Database connection error:", err));

// -----------------------------
// SCHEMA DESIGN (Nested Document)
// -----------------------------
const variantSchema = new mongoose.Schema({
  color: String,
  size: String,
  stock: Number,
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  variants: [variantSchema], // Nested array of documents
});

const Product = mongoose.model("Product", productSchema);

// -----------------------------
// MAIN FUNCTION
// -----------------------------
async function runCatalogDemo() {
  await Product.deleteMany(); // Clear existing data

  // 🟢 Insert Sample Products with Variants
  const sampleProducts = [
    {
      name: "Smartphone X1",
      price: 45000,
      category: "Electronics",
      variants: [
        { color: "Black", size: "128GB", stock: 20 },
        { color: "Blue", size: "256GB", stock: 10 },
      ],
    },
    {
      name: "Running Shoes",
      price: 2500,
      category: "Footwear",
      variants: [
        { color: "Red", size: "8", stock: 15 },
        { color: "Black", size: "9", stock: 25 },
      ],
    },
    {
      name: "Cotton T-Shirt",
      price: 800,
      category: "Clothing",
      variants: [
        { color: "White", size: "M", stock: 50 },
        { color: "Blue", size: "L", stock: 30 },
      ],
    },
  ];

  await Product.insertMany(sampleProducts);
  console.log("✅ Sample products inserted!\n");

  // 🔵 Query 1: Retrieve all products
  const allProducts = await Product.find();
  console.log("📦 All Products:\n", allProducts);

  // 🟠 Query 2: Filter products by category
  const electronics = await Product.find({ category: "Electronics" });
  console.log("\n⚡ Electronics Category:\n", electronics);

  // 🔴 Query 3: Project specific variant details (only color and stock)
  const variantProjection = await Product.find(
    {},
    { name: 1, "variants.color": 1, "variants.stock": 1, _id: 0 }
  );
  console.log("\n🎨 Variant Colors and Stock:\n", variantProjection);

  // 🟢 Query 4: Find products with a specific variant color
  const blueVariants = await Product.find({ "variants.color": "Blue" });
  console.log("\n💙 Products having Blue variants:\n", blueVariants);

  mongoose.connection.close();
}

// Run the demo
runCatalogDemo().catch((err) => console.error(err));
