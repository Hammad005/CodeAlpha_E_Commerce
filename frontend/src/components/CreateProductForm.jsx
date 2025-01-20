import { motion } from "framer-motion";
import { useState } from "react";
import Input from "./Input";
import { Loader, PlusCircle, Upload } from "lucide-react";
import Button from "./Button";
import { useProductStore } from "../stores/useProductStore";

const categories = [
  "jeans",
  "t-shirts",
  "shoes",
  "glasses",
  "jackets",
  "suits",
  "bags",
];
const CreateProductForm = () => {
  const {createProduct, loading, fetchAllProducts} = useProductStore();
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProduct(newProduct);
      await fetchAllProducts();
      setNewProduct({
        name: "",
        description: "",
        price: "",
        category: "",
        image: "",
      })
    } catch {
      console.error("error creating a product");  
    }
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setNewProduct({...newProduct, image: reader.result})
      }

      reader.readAsDataURL(file);
    }
  };
  return (
    <motion.div
      className="bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-2xl font-semibold mb-6 text-emerald-300">
        Create New Product
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="text"
            label="Product Name"
            id="name"
            name="name"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
            required
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-300"
          >
            Description
          </label>
          <textarea
            name="description"
            id="description"
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct({ ...newProduct, description: e.target.value })
            }
            rows={3}
            className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-2 px-3 text-white
            focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          ></textarea>
        </div>

        <div>
          <Input
            type="number"
            label="Price"
            id="price"
            name="price"
            value={newProduct.price}
            step="0.01"
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: e.target.value })
            }
            required
          />
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-300"
          >
            Category
          </label>
          <select
            name="category"
            id="category"
            value={newProduct.category}
            onChange={(e) =>
              setNewProduct({ ...newProduct, category: e.target.value })
            }
            className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-2 px-3 text-white
            focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-1 pt-2 flex items-center">
          <input
            type="file"
            id="image"
            onChange={handleImageChange}
            className="sr-only"
            accept="image/*"
          />

          <label
            htmlFor="image"
            className="cursor-pointer bg-gray-700 py-2 px-3 border-gray-600 rounded-md shadow-sm text-sm
          leading-4 font-medium text-gray-300 hover:bg-gray-600  focus:outline-none focus:ring-2 focus:ring-offset-2
          focus:ring-emerald-500"
          >
            <Upload className="h-5 w-5 inline-block mr-2" />
            Upload Image
          </label>
          {newProduct.image && <span className="ml-3 text-sm text-gray-400">Image uploaded</span>}
        </div>

        <Button
          loading={loading}
          icon={loading ? Loader : PlusCircle}
          label="Create Product"
        />
      </form>
    </motion.div>
  );
};

export default CreateProductForm;
