import validateData from '../lib/validateData';
import OrderService from '../services/OrderService';
import Util from '../lib/Util';


const Order = {
    async create(req, res) {
        req.body.buyer_id = req.userId;
        const requiredParams = ['car_id', 'priceOffered', 'buyer_id'];
        if (validateData(requiredParams, req.body) || req.body.car_id.toString().length !== 13) {
            return Util.sendError(res, 400, 'Select car and state amount you want to pay');
        }
        // const query = `select cars.id, cars.status carstatus, cars.price, cars.owner, users.status sellerstatus from cars inner join users on cars.owner=users.id where cars.id=${req.body.carId}`;
        try {
            const { rows } = await OrderService.getCarAndUsersDetails(req.body.car_id);

            // if (rows.length < 1 || rows[0].carstatus.toLowerCase() !== 'available' || parseInt(rows[0].owner, 10) === parseInt(req.userId, 10)) {
            //     return Order.errorResponse(res, 400, 'The car is not available or the seller is not active. Check back');

            if (rows.length < 1 || rows[0].carstatus.toLowerCase() !== 'available' || rows[0].sellerstatus.toLowerCase() !== 'active') {
                return Util.sendError(res, 400, 'The car is not available or the seller is not active. Check back');
            }

            // check that the buyer doesn't have the order in pending, accepted or completed state

            // const checkOrderInDb = `SELECT id FROM orders WHERE carid=${req.body.carId} AND buyerid=${req.body.buyerId} AND status NOT IN ('rejected', 'cancelled')`;

            const noInDb = await OrderService.checkOrderInDb([req.body.car_id, req.body.buyer_id]);
            if (noInDb.rows.length > 0) {
                return Util.sendError(res, 400, 'You have a similar uncompleted/completed order ');
            }

            // const text = 'INSERT INTO orders (id, buyerid, carid, sellerid, price, priceoffered) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
            // eslint-disable-next-line max-len
            const values = [Date.now(), req.userId, req.body.car_id, rows[0].owner, rows[0].price, req.body.amount];

            const result = await OrderService.createOrder(values);
            return Util.sendSuccess(res, 201, result.rows[0]);
        } catch (error) {
            return Order.errorResponse(res, 500, error.message);
        }
    },
    async updatePrice(req, res) {
        // const requiredParams = ['orderId', 'newPrice'];
        const newPrice = req.body.price;

        // if (validateData(requiredParams, req.body) || req.body.orderId.trim().length !== 13) {
        //     return Order.errorResponse(res, 400, 'Ensure to send the order id and new price');
        // }

        // check that the request is coming from the buyer with a different price
        // and the order is still pending
        const buyer = req.userId;

        // const text = `SELECT price FROM orders WHERE id=${req.body.orderId} AND buyerid=${buyer} AND status NOT IN ('pending', 'cancelled')`;

        try {
            const { rows } = await OrderService.getOrderPrice([req.params.order_id]);

            if (rows.length !== 1 || parseFloat(rows[0].price_offered) === parseFloat(newPrice)) {
                return Util.sendError(res, 400, 'Check that the order id is valid and not cancelled and your new price is different');
            }

            // update the price and return the response
            const tm = new Date().toLocaleString();
            // const query = `UPDATE orders SET priceoffered=${newPrice}, updated_at='${tm}' WHERE id=${req.body.orderId} AND buyerid=${buyer} returning *`;
            const result = await OrderService.updateOrder([newPrice, tm, req.params.order_id, buyer]);
            return Util.sendSuccess(res, 200, result.rows[0]);
        } catch (error) {
            return Util.sendError(res, 500, error.message);
        }
    },
    async mySoldAds(req, res) {
        const { userId } = req;
        // const text = `SELECT * FROM orders WHERE sellerid=${userId}`;
        try {
            const { rows } = await OrderService.getUserOrders(userId);
            return (rows.length < 1) ? Util.sendError(res, 404, 'You do not have any transaction yet') :
                Util.sendSuccess(res, 200, rows);
        } catch (error) {
            return Util.sendError(res, 500, error.message);
        }
    },
    async getAllOrders(req, res) {
        // const text = 'SELECT * FROM orders ORDER BY updated_at DESC';
        try {
            const { rows } = await OrderService.getAllOrders();
            return (rows.length < 1) ? Util.sendError(res, 404, 'There are no orders now. Check back') :
                Util.sendSuccess(res, 200, rows);
        } catch (error) {
            return Util.sendError(res, 500, error.message);
        }
    },

    /**
     * status could be pending, accepted (by seller), rejected(by seller),
     * completed(buyer), cancelled(buyer)
     */
    async updateOrderStatus(req, res) {
        let newStatus = req.body.status;
        newStatus = newStatus.toLowerCase();

        // get orderid
        const { orderId } = req.params;
        if (!orderId || !newStatus) {
            return Util.sendError(res, 400, 'Invalid input');
        }
        const reqPerson = req.userId;

        // const query = `SELECT buyerid, sellerid, status FROM orders WHERE id=${orderId}`;
        // const updateQuery = `UPDATE orders SET status='${newStatus}' WHERE id=${orderId} RETURNING *`;
        try {
            const { rows } = await OrderService.getBuyerAndSeller(orderId);
            if (rows.length !== 1) {
                return Util.sendError(res, 404, 'The order is not available');
            }
            const buyer = rows[0].buyerid;
            const seller = rows[0].sellerid;
            const statusInDb = rows[0].status.toLowerCase();
            if (reqPerson !== buyer && reqPerson !== seller) {
                return Util.sendError(res, 403, 'You dont have the permission to modify this resource');
            }

            if (!Order.userUpdateStatus(reqPerson, buyer, newStatus, seller, statusInDb)) {
                return Util.sendError(res, 400, 'You cannot update the status of this order at its state');
            }

            const updatedOrder = await OrderService.updateOrderStatus([newStatus, orderId]);
            return Util.sendSuccess(res, 200, updatedOrder.rows[0]);
        } catch (error) {
            return Util.sendError(res, 500, error.message);
        }
    },

    async deleteAnOrder(req, res) {
        if (req.params.orderId.toString().length !== 13) {
            return Util.sendError(res, 400, 'Wrong order id');
        }
        const { userId, role } = req;

        // const query = (role) ? `DELETE FROM orders WHERE id=${req.params.orderId} RETURNING *` :
        //     `DELETE FROM orders WHERE id=${req.params.orderId} AND sellerId=${userId} AND status='cancelled' RETURNING *`;

        try {
            const { rows } = (role) ? await OrderService.adminDeleteOrder(req.params.orderId): await OrderService.sellerDeleteOrder([req.params.orderId, userId]);

            return (rows.length < 1) ? Util.sendError(res, 404, 'The order does not exist') :
                Util.sendSuccess(res, 200, rows[0]);
        } catch (error) {
            return Util.sendError(res, 500, error.message);
        }
    },

    async getSingleOrder(req, res) {
        if (req.params.orderId.toString().length !== 13) {
            return Util.sendError(res, 400, 'Invalid order id');
        }
        const { userId, role } = req;
        // const query = `SELECT buyerid, sellerid FROM orders WHERE id=${req.params.orderId}`;
        try {
            const { rows } = await OrderService.getBuyerAndSeller(req.params.orderId);
            // eslint-disable-next-line max-len
            if (!role && rows[0].buyerid !== userId && rows[0].sellerid !== userId) {
                return Util.sendError(res, 403, 'You dont have the permission to view this resource');
            }

            // const text = `SELECT * FROM orders WHERE id=${req.params.orderId}`;

            const result = await OrderService.getSingleOrder(req.params.orderId);
            return (result.rows.length !== 1) ? Util.sendError(res, 404, 'Order not found') :
                Util.sendSuccess(res, 200, result.rows[0]);
        } catch (error) {
            return Util.sendError(res, 500, error.message);
        }
    },

    userUpdateStatus(reqPerson, buyer, newStatus, seller, statusInDb) {
        const sellerOptions = ['accepted', 'rejected'];
        let result = false;
        // buyer can cancel an accepted or rejected offer
        // buyer cannot complete a rejected offer
        if (reqPerson === buyer && newStatus === 'cancelled' &&
            sellerOptions.includes(statusInDb)) {
            result = true;
        } else if (reqPerson === buyer && newStatus === 'completed' &&
            statusInDb === 'accepted') {
            result = true;
            // seller can accept or reject a pending transaction
        } else if (reqPerson === seller && statusInDb === 'pending' &&
            sellerOptions.includes(newStatus)) {
            result = true;
            // seller can change a rejected offer to accepted
        } else if (reqPerson === seller && statusInDb === 'rejected' && newStatus === 'accepted') {
            result = true;
        }
        return result;
    },

    // errorResponse(res, statuscode, msg) {
    //     return res.status(statuscode).send({
    //         status: statuscode,
    //         message: msg,
    //     });
    // },

    // successResponse(res, statuscode, data) {
    //     return res.status(statuscode).send({
    //         status: statuscode,
    //         data,
    //     });
    // },
};

export default Order;