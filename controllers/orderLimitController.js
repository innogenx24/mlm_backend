const { OrderLimit } = require('../models'); // Ensure the path is correct

const getOrderLimits = async (req, res) => {
    try {
        const orderLimits = await OrderLimit.findAll();
        res.json({ data: orderLimits });
    } catch (error) {
        console.error('Error fetching order limits:', error);
        res.status(500).json({ error: 'Error fetching order limits' });
    }
};

const createOrderLimit = async (req, res) => {
    const { hours } = req.body;
    try {
        const newOrderLimit = await OrderLimit.create({ hours });
        return res.status(201).json({ message: 'Order limit created successfully', data: newOrderLimit });
    } catch (error) {
        console.error('Error creating order limit:', error);
        return res.status(500).json({ message: 'Failed to create order limit' });
    }
};

const updateOrderLimit = async (req, res) => {
    const { id } = req.params;
    const { hours } = req.body;
    try {
        const orderLimit = await OrderLimit.findByPk(id);
        if (!orderLimit) {
            return res.status(404).json({ message: 'Order limit not found' });
        }
        orderLimit.hours = hours;
        await orderLimit.save();
        return res.status(200).json({ message: 'Order limit updated successfully', data: orderLimit });
    } catch (error) {
        console.error('Error updating order limit:', error);
        return res.status(500).json({ message: 'Failed to update order limit' });
    }
};

const deleteOrderLimit = async (req, res) => {
    const { id } = req.params;
    try {
        const orderLimit = await OrderLimit.findByPk(id);
        if (!orderLimit) {
            return res.status(404).json({ message: 'Order limit not found' });
        }
        await orderLimit.destroy();
        return res.status(200).json({ message: 'Order limit deleted successfully' });
    } catch (error) {
        console.error('Error deleting order limit:', error);
        return res.status(500).json({ message: 'Failed to delete order limit' });
    }
};

module.exports = {
    getOrderLimits,
    createOrderLimit,
    updateOrderLimit,
    deleteOrderLimit
};
