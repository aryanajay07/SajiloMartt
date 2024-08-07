import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";

// Utility Function
function calcPrices(orderItems) {
    const itemsPrice = orderItems.reduce(
        (acc, item) => acc + item.price * item.qty,
        0
    );

    const shippingPrice = itemsPrice > 100 ? 0 : 10;
    const taxRate = 0.13;
    const taxPrice = (itemsPrice * taxRate).toFixed(2);

    const totalPrice = (
        itemsPrice +
        shippingPrice +
        parseFloat(taxPrice)
    ).toFixed(2);

    return {
        itemsPrice: itemsPrice.toFixed(2),
        shippingPrice: shippingPrice.toFixed(2),
        taxPrice,
        totalPrice,
    };
}

const createOrder = async (req, res) => {
    try {
        const { orderItems, shippingAddress, paymentMethod } = req.body;

        if (orderItems && orderItems.length === 0) {
            res.status(400);
            throw new Error("No order items");
        }

        const itemsFromDB = await Product.find({
            _id: { $in: orderItems.map((x) => x._id) },
        });

        const dbOrderItems = orderItems.map((itemFromClient) => {
            const matchingItemFromDB = itemsFromDB.find(
                (itemFromDB) => itemFromDB._id.toString() === itemFromClient._id
            );

            if (!matchingItemFromDB) {
                res.status(404);
                throw new Error(`Product not found: ${itemFromClient._id}`);
            }

            return {
                ...itemFromClient,
                product: itemFromClient._id,
                price: matchingItemFromDB.price,
                _id: undefined,
            };
        });

        const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
            calcPrices(dbOrderItems);

        const order = new Order({
            orderItems: dbOrderItems,
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate("user", "id username")
            .populate({
                path: 'orderItems.product',
                select: 'vendor'
            })
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const countTotalOrders = async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        res.json({ totalOrders });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const calculateTotalSales = async (req, res) => {
    try {
        const orders = await Order.find();
        const totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0);
        res.json({ totalSales });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const calcualteTotalSalesByDate = async (req, res) => {
    try {
        const salesByDate = await Order.aggregate([
            {
                $match: {
                    isPaid: true,
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$paidAt" },
                    },
                    totalSales: { $sum: "$totalPrice" },
                },
            },
        ]);

        res.json(salesByDate);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const findOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("user",)
            .populate({
                path: 'orderItems.product',
                populate: {
                    path: 'vendor',
                    model: 'User'
                }
            })


        if (order) {
            res.json(order);
        } else {
            res.status(404);
            throw new Error("Order not found");
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteOrders = async (req, res) => {
    try {
        await Order.deleteMany({});
        res.json({ message: 'All Orders removed' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            await order.deleteOne({ _id: order._id });
            res.json({ message: 'Order removed' });

        }
        else { return res.status(404).json({ message: 'Order not found' }); }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const payOrder = async (req, res) => {
    try {


    } catch (error) {

    }
}
const markOrderAsPaid = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.isPaid = true;
            order.paidAt = Date.now();
            order.paymentResult = {
                id: req.body.id,
                status: req.body.status,
                update_time: req.body.update_time,
            };

            const updateOrder = await order.save();

            await Promise.all(order.orderItems.map(async (item) => {
                const product = await Product.findById(item.product._id);
                if (product) {
                    product.salesCount = (product.salesCount || 0) + item.qty;
                    await product.save();
                }
                // Increment orderCount for the user
                const user = await User.findById(order.user._id);
                if (user) {
                    user.orderCount = (user.orderCount || 0) + 1;
                    await user.save();
                }
            }));
            res.status(200).json(updateOrder);
        } else {
            res.status(404);
            throw new Error("Order not found");
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const markOrderAsDelivered = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.isDelivered = true;
            order.deliveredAt = Date.now();

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404);
            throw new Error("Order not found");
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export {
    createOrder,
    getAllOrders,
    getUserOrders,
    countTotalOrders,
    calculateTotalSales,
    calcualteTotalSalesByDate,
    findOrderById,
    deleteOrderById,
    deleteOrders,
    markOrderAsPaid,
    markOrderAsDelivered,
};
