import cloudinary from 'cloudinary';
import dotenv from 'dotenv';
import validatenewCar from '../lib/validateData';
import CarService from '../services/CarService';
import util from '../lib/Util';


dotenv.config();
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API,
    api_secret: process.env.CLOUDINARY_SECRET,
});

const Car = {
    async create(req, res) {
        // eslint-disable-next-line max-len
        const requiredFields = ['state', 'price', 'manufacturer', 'model', 'body_type', 'description'];
        req.body.owner = req.userId;
        if (validatenewCar(requiredFields, req.body)) {
            return util.sendError(res, 400, 'Fill all required fields');
        }

        // eslint-disable-next-line max-len
        const values = [req.body.owner, req.body.state, req.body.manufacturer, req.body.model, req.body.body_type];
        try {
            const { rows } = await CarService.getCarsByUser(values);
            if (rows.length > 0) {
                return util.sendError(res, 400, 'You have a similar unsold car');
            }

            const image = req.file ? await cloudinary.uploader.upload(req.file.path, { folder: 'automart/', format: 'png' }) :
                { url: req.img_url };

            const carPpties = [Date.now(), req.body.price, req.body.description, image.url, ...values];
            const newCar = await CarService.createCar(carPpties);
            return util.sendSuccess(res, 201, newCar.rows[0]);
        } catch (error) {
            return util.sendError(res, 500, error.message);
        }
    },
    async getAll(req, res) {
        // const cars = CarModel.getAllCars();
        // const query = 'SELECT * FROM cars LIMIT 100';
        try {
            const { rows } = await CarService.getAllCars();

            if (rows.length < 1) {
                return util.sendError(res, 404, 'There are no cars available now. Check back');
            }
            return util.sendSuccess(res, 200, rows);
        } catch (error) {
            return util.sendError(res, 500, error.message);
        }
    },

    async getCarsByProperty(req, res) {
        const reqParam = Object.keys(req.params)[0];
        let ppty;

        switch (reqParam.toLowerCase()) {
            case 'manufacturer':
                ppty = req.params.manufacturer;
                break;
            case 'body_type':
                ppty = req.params.body_type;
                break;
            default:
                ppty = req.params.state;
                break;
        }
        // const query = `SELECT id, state, status, price, manufacturer, model, body_type, description, img FROM cars where status='available' AND ${reqParam}='${ppty}' LIMIT 100`;
        try {
            const { rows } = await CarService.getCarsByProperty('available', reqParam, ppty);
            return (rows.length < 1) ? util.sendError(res, 404, `There are no cars for the selected ${reqParam}`) :
                util.sendSuccess(res, 200, rows);
        } catch (error) {
            return util.sendError(res, 500, error.message);
        }
    },

    async getAllUnsoldCars(req, res) {
        // const query = `SELECT id, state, status, price, manufacturer, model, body_type, description, img, owner FROM cars WHERE status='available'`;
        try {
            const { rows } = await CarService.getAllUnsoldCars();
            return (rows.length < 1) ? util.sendError(res, 404, 'There are no cars available now. Check back') :
                util.sendSuccess(res, 200, rows);
        } catch (error) {
            return util.sendError(res, 500, error.message);
        }
    },

    async getSingleAd(req, res) {
        if (req.params.id.trim().length !== 13) {
            return util.sendError(res, 400, 'Invalid ad id');
        }
        // const query = `SELECT id, state, status, price, manufacturer, model, body_type, description, img FROM cars WHERE id=${req.params.id}`;
        try {
            const { rows } = await CarService.getSingleCar(req.params.id);
            // const car = rows[0];
            return (rows.length < 1) ? util.sendError(res, 404, 'The ad you are looking for is no longer available') :
                util.sendSuccess(res, 200, rows[0]);
        } catch (error) {
            return util.sendError(res, 500, error.message);
        }
        //     if (!car) {
        //         return Car.errorResponse(res, 404, 'The ad you are looking for is no longer available');
        //     }
        //     return Car.successResponse(res, 200, car);
        // } catch (err) {
        //     return Car.errorResponse(res, 500, err);
    },

    async updateAdStatus(req, res) {
        const { car_id } = req.params;
        const { status } = req.body;
        const { userId } = req;
        if (!car_id || car_id.trim().length !== 13 || !status) {
            return util.sendError(res, 400, 'Supply a valid ad id and status');
        }

        try {
            const { rows } = await CarService.getSingleCarAllPpties(car_id);

            if (rows.length !== 1 || parseFloat(rows[0].owner) !== parseFloat(userId)) {
                return util.sendError(res, 400, 'Only sellers can update cars that are availabe');
            }

            const updatedCar = await CarService.updateStatus(status, car_id);
            return util.sendSuccess(res, 200, updatedCar.rows[0]);
        } catch (error) {
            return util.sendError(res, 500, error.message);
        }
    },

    async updateAdPrice(req, res) {
        const { car_id } = req.params;
        const { price } = req.body;
        const { userId } = req;
        if (!car_id || car_id.trim().length !== 13 || !price) {
            return util.sendError(res, 400, 'Supply a valid ad id and status');
        }
        try {
            const { rows } = await CarService.getSingleCarAllPpties(car_id);

            if (rows.length !== 1 || parseFloat(rows[0].owner) !== parseFloat(userId)) {
                return util.sendError(res, 400, 'Only sellers can update cars that are availabe');
            }

            const updatedCar = await CarService.updatePrice(price, car_id);
            return util.sendSuccess(res, 200, updatedCar.rows[0]);
        } catch (error) {
            return util.sendError(res, 500, error.message);
        }
    },

    async updateAdvert(req, res) {
        const reqFields = ['status', 'price', 'description'];
        if (validatenewCar(reqFields, req.body)) {
            util.sendError(res, 400, 'Fill all fields');
        }
        // const query = `SELECT * FROM cars WHERE id=${req.params.id}`;
        try {
            const { rows } = await CarService.getSingleCarAllPpties(req.params.id);
            if (rows.length < 1) {
                return util.sendError(res, 404, 'The advert you want to update is not available');
            }

            const { userId, role } = req;
            if (parseInt(userId, 10) !== parseInt(rows[0].owner, 10) && !role) {
                return util.sendError(res, 401, 'You do not have the permission to update this data');
            }

            const adminQ = [req.body.status, req.params.id];
            const data = [req.body.price, req.body.description, ...adminQ];

            // if it's seller update status, price & desc. else if its admin only the status
            // status can be available, sold or suspended;

            // const text = (parseInt(userId, 10) === parseInt(rows[0].owner, 10)) ?
            //     `UPDATE cars SET status='${req.body.status}', price=${req.body.price}, description='${req.body.description}' WHERE id=${req.params.id} RETURNING *` :
            //     `UPDATE cars SET status='${req.body.status}' WHERE id=${req.params.id} RETURNING *`;

            const result = (parseInt(userId, 10) === parseInt(rows[0].owner, 10)) ?
                await CarService.updateBySeller(data) :
                await CarService.updateByAdmin(adminQ);

            // const updatedCar = result.rows[0];

            return util.sendSuccess(res, 200, result.rows[0]);
        } catch (error) {
            return util.sendError(res, 500, error.message);
        }
    },

    async getCars(req, res) {
        const params = req.query;
        const paramsArray = Object.keys(params);
        const paramsLength = Object.keys(params).length;
        try {
            if (paramsLength === 3 && JSON.stringify(paramsArray) === JSON.stringify(['status', 'min_price', 'max_price'])) {
                const min = req.query.min_price ? req.query.min_price : 0;
                const max = req.query.max_price ? req.query.max_price : 30000000;
                // console.log(min);
                const { rows } = await CarService.getCarsInRange(req.query.status, min, max);

                return (rows.length < 1) ? util.sendError(res, 404, 'There are no cars within the selected range') :
                    util.sendSuccess(res, 200, rows);
            }
            if (paramsLength === 2) {
                const reqParam = Object.keys(req.query)[1];
                let ppty;
                switch (reqParam.toLowerCase()) {
                    case 'manufacturer':
                        ppty = req.query.manufacturer;
                        break;
                    case 'body_type':
                        ppty = req.query.body_type;
                        break;
                    default:
                        ppty = req.query.state;
                        break;
                }
                const { rows } = await CarService.getCarsByProperty(req.query.status, reqParam, ppty);
                return (rows.length < 1) ? util.sendError(res, 404, `There are no cars for the selected ${reqParam}`) :
                    util.sendSuccess(res, 200, rows);
            }
            if (paramsLength === 1) {
                const { rows } = await CarService.getAllUnsoldCars(req.query.status);
                return (rows.length < 1) ? util.sendError(res, 404, 'There are no cars available now. Check back') :
                    util.sendSuccess(res, 200, rows);
            }
            return util.sendError(res, 400, 'Invalid query parameters');
        } catch (error) {
            return util.sendError(res, 500, error.message);
        }
    },

    // async getCarsWithinPriceRange(req, res) {
    //     const min = req.query.min ? req.query.min : 0;
    //     const max = req.query.max ? req.query.max : 30000000;
    //     const query = `SELECT id, state, status, price, manufacturer, model, body_type, description, img FROM cars where price BETWEEN ${min} AND ${max}`;
    //     try {
    //         const { rows } = await db.query(query);
    //         return (rows.length < 1) ? Car.errorResponse(res, 404, 'There are no cars within the selected range') :
    //             Car.successResponse(res, 200, rows);
    //     } catch (err) {
    //         return Car.errorResponse(res, 500, err);
    //     }
    // },

    async deleteAd(req, res) {
        if (req.params.car_id.trim().length !== 13) {
            return util.sendError(res, 400, 'Select the ad to delete');
        }

        // const query = `DELETE FROM cars WHERE id=${req.params.id} RETURNING *`;
        try {
            const { rows } = await CarService.deleteCar(req.params.car_id);
            return (rows.length < 1) ? util.sendError(res, 404, 'Selected ad not available') :
                util.sendSuccess(res, 200, rows[0]);
        } catch (error) {
            return util.sendError(res, 500, error.message);
        }
    },

    async getMyAds(req, res) {
        const { userId } = req;
        try {
            const { rows } = await CarService.gerUserAds(userId);
            return (rows.length < 1) ? util.sendError(res, 404, 'You do not have ads yet') :
                util.sendSuccess(res, 200, rows);
        } catch (error) {
            return util.sendError(res, 500, error.message);
        }
    },
};

export default Car;