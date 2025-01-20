import { redis } from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";
import Product from "../models/product.model.js";

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json({ products });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products' });
    }
};


export const getFeaturedProducts = async (req, res) => {
	try {
		let featuredProducts = await redis.get("featured_products");
		if (featuredProducts) {
			return res.json(JSON.parse(featuredProducts));
		}

		// if not in redis, fetch from mongodb
		// .lean() is gonna return a plain javascript object instead of a mongodb document
		// which is good for performance
		featuredProducts = await Product.find({ isFeatured: true }).lean();

		if (!featuredProducts) {
			return res.status(404).json({ message: "No featured products found" });
		}

		// store in redis for future quick access

		await redis.set("featured_products", JSON.stringify(featuredProducts));

		res.json(featuredProducts);
	} catch (error) {
		console.log("Error in getFeaturedProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};


export const createProduct = async (req, res) => {
    try {
        const { name, description, price, image, category } = req.body;

        let cloudinaryResponse = null;

        if (image) {
            cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "products" })
        }

        const products = await Product.create({
            name,
            description,
            price,
            image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
            category
        })
        res.json({ products, message: "Product created successfully" });
    } catch (error) {
        res.status(500).json({ message: 'Error creating product' });
    }
};


export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (product.image) {
            const publicId = product.image.split("/").pop().split(".")[0];
            try {
                await cloudinary.uploader.destroy(`products/${publicId}`);
                console.log("deleted image from cloudinary")
            } catch (error) {
                console.error(error);
            }
        }

        await deleteFeaturedProductCacheById(req.params.id);

        
        await Product.findByIdAndDelete(req.params.id)
        res.json({ message: "Product deleted" });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product' });
    }
};


export const getRecommendedProducts = async (req, res) => {
    try {
        const product = await Product.aggregate([
            {
                $sample: { size: 3 }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    description: 1,
                    price: 1,
                    image: 1,
                }
            }
        ])
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error getting recommended products' });
    }
};


export const getProductsByCategory = async (req, res) => {
    
    const {category} = req.params;
    try {
        const products = await Product.find({category});
        res.json({products})
    } catch (error) {
        res.status(500).json({ message: 'Error getting products by category' });
    }
};


export const toggleFeatuerdProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            product.isFeatured = !product.isFeatured;
            const updateProduct = await product.save();

            await updateFeaturedProductsCache();

            res.json(updateProduct);
        }else{
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error toggling featured product' });
    }
};


async function updateFeaturedProductsCache() {
    try {
        const featuredProducts = await Product.find({isFeatured: true}).lean();
        await redis.set("featured_products", JSON.stringify(featuredProducts));

    } catch (error) {
        console.error("error in update cache function");
    }
};

async function deleteFeaturedProductCacheById(productId) {
    try {
        // Fetch the current featured products from Redis
        const cachedFeaturedProducts = await redis.get("featured_products");

        // If the cache is empty or doesn't exist, return early
        if (!cachedFeaturedProducts) {
            console.log("No featured products in cache.");
            return;
        }

        // Parse the cached data into an array
        let featuredProducts = JSON.parse(cachedFeaturedProducts);

        // Find the product to remove based on the provided productId
        const updatedFeaturedProducts = featuredProducts.filter(
            (product) => product._id !== productId
        );

        // Update the Redis cache with the updated list
        await redis.set("featured_products", JSON.stringify(updatedFeaturedProducts));
        console.log(`Removed product with ID ${productId} from the featured products cache.`);
    } catch (error) {
        console.error("Error deleting product from cache:", error);
    }
};
