import dotenv from "dotenv";
dotenv.config();

import { GoogleGenerativeAI } from "@google/generative-ai";
import Product from "../../models/ProductModel.js";
import Category from "../../models/CategoryModel.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    let matchingProducts = await Product.find({
      name: { $regex: message, $options: "i" },
    })
      .limit(3)
      .populate("category");

    if (matchingProducts.length === 0) {
      const matchedCategory = await Category.findOne({
        name: { $regex: message, $options: "i" },
      });

      if (matchedCategory) {
        matchingProducts = await Product.find({ category: matchedCategory._id })
          .limit(3)
          .populate("category");
      }
    }

    let productInfo = "";

    if (matchingProducts.length > 0) {
      productInfo = matchingProducts
        .map(
          (p) =>
            `- ${p.name} (₹${p.price}) in ${p.category.name} — ${
              p.inStock ? "Available ✅" : "Available ✅"
            }`
        )
        .join("\n");
    } else {
      
      const allCategories = await Category.find({});
      const categoryWiseSuggestions = [];

      for (let cat of allCategories) {
        const products = await Product.find({ category: cat._id })
          .limit(2)
          .select("name price")
          .lean();

        if (products.length > 0) {
          const items = products
            .map((p) => `• ${p.name} (₹${p.price})`)
            .join("\n");
          categoryWiseSuggestions.push(`📦 ${cat.name}:\n${items}`);
        }
      }

      productInfo =
        "Here are items available by category:\n\n" +
        categoryWiseSuggestions.join("\n\n");
    }

    const prompt = `
You are a helpful chatbot for an e-commerce website named IntelliBuy.

User asked:
"${message}"

Here is product/category data:
${productInfo}

Instructions:
- If the user's request matches a product name or category, show the results with product name, price, category, and availability.
- If no match, suggest alternatives grouped by category.
- Be polite, clear, and concise.
`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });
  } catch (error) {
    console.error("Gemini AI Error:", error.message);
    res.status(500).json({ error: "AI failed to reply" });
  }
};
