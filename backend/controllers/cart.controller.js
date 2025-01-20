import Product from "../models/product.model.js";

export const getCartProducts = async (req, res) => {
    try {
        const products = await Product.find({ _id: { $in: req.user.cartItems } });

        const cartItems = products.map(product => {
            const item = req.user.cartItems.find(cartItems => cartItems.id === product.id);
            return { ...product.toJSON(), quantity: item.quantity }
        })

        cartItems.sort((a, b) => {
            const indexA = req.user.cartItems.findIndex(cartItem => cartItem.id === a._id.toString());
            const indexB = req.user.cartItems.findIndex(cartItem => cartItem.id === b._id.toString());
            return indexB - indexA; // Descending order
        });
        res.json(cartItems)
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cart products' });
    }
};


export const addToCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = req.user;

        const existingItem = user.cartItems.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            user.cartItems.push(productId);
        }

        await user.save();
        res.json(user.cartItems);
    } catch (error) {
        res.status(500).json({ message: 'Failed to add item to cart' });
    }
};



export const removeAllFromCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = req.user;
        if (!productId) {
            user.cartItems = [];
        } else {
            user.cartItems = user.cartItems.filter(item => item.id !== productId);
        }
        await user.save();
        res.json(user.cartItems);
    } catch (error) {
        res.status(500).json({ message: 'Failed to remove item from cart' });
    }
};


export const updateQuantity = async (req, res) => {
    try {
        const { id: productId } = req.params;
        const { quantity } = req.body;
        const user = req.user;
        const existingItem = user.cartItems.find((item) => item.id === productId);

        if (existingItem) {
            if (quantity === 0) {
                user.cartItems = user.cartItems.filter((item) => item.id !== productId);
                await user.save();
                return res.json(user.cartItems);
            }

            existingItem.quantity = quantity;
            await user.save();
            res.json(user.cartItems);
        } else {
            res.status(404).json({ message: 'Item not found in cart' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to update quantity' });
    }
};
