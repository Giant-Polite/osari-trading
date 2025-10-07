import fs from "fs";

// List of categories you want
const categories = [
  "spices-seasonings",
  "grains-sides",
  "tea",
  "drink-desserts",
  "dates",
  "sauces-dips",
  "cooking-essential-oils",
];

// Mapping product names to your local images
const localImageMapping = {
  "Basmati Rice": "/images/grains-sides/basmati-rice.jpg",
  "Red Lentils": "/images/grains-sides/red-lentils.jpg",
  "Cumin Powder": "/images/spices-seasonings/cumin-powder.jpg",
  "Turmeric Powder": "/images/spices-seasonings/turmeric-powder.jpg",
  "Green Tea": "/images/tea/green-tea.jpg",
  "Black Tea": "/images/tea/black-tea.jpg",
  "Chocolate Drink": "/images/drink-desserts/chocolate-drink.jpg"
  // Add all other products you downloaded here
};

const mockProducts = [
  {
    name: "Basmati Rice",
    category: "grains-sides",
    price: 8.99,
    image: localImageMapping["Basmati Rice"],
    description: "Premium aged basmati rice",
  },
  {
    name: "Red Lentils",
    category: "grains-sides",
    price: 4.99,
    image: localImageMapping["Red Lentils"],
    description: "High quality red lentils",
  },
  {
    name: "Cumin Powder",
    category: "spices-seasonings",
    price: 5.99,
    image: localImageMapping["Cumin Powder"],
    description: "Fresh ground cumin powder",
  },
  {
    name: "Turmeric Powder",
    category: "spices-seasonings",
    price: 6.99,
    image: localImageMapping["Turmeric Powder"],
    description: "Premium turmeric powder",
  },
  {
    name: "Green Tea",
    category: "tea",
    price: 9.99,
    image: localImageMapping["Green Tea"],
    description: "Organic green tea leaves",
  },
  {
    name: "Black Tea",
    category: "tea",
    price: 9.49,
    image: localImageMapping["Black Tea"],
    description: "Premium black tea",
  },
  {
    name: "Chocolate Drink",
    category: "drink-desserts",
    price: 3.99,
    image: localImageMapping["Chocolate Drink"],
    description: "Rich chocolate drink mix",
  },
];

fs.writeFileSync(
  "./src/data/products.json",
  JSON.stringify(mockProducts, null, 2)
);

console.log("✅ Products saved to src/data/products.json");
