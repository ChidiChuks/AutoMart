/* eslint-disable camelcase */
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../index';
import db from '../../services/db';
import generateToken from '../../lib/generateToken';


const { expect } = chai;
chai.use(chaiHttp);

describe('Order transaction', () => {
    const userId = async() => {
        const { rows } = await db.query('SELECT id FROM users LIMIT 1');
        return rows[0];
    };

    const genToken = async() => {
        const userdata = await userId();
        return generateToken(userdata.id, false);
    };

    const dataValues = () => ({
        email: `${Math.random().toString(36).substring(2, 15)}@gmail.com`,
        first_name: `Fi${Math.random().toString(36).substring(2, 15)}`,
        last_name: `La${Math.random().toString(36).substring(2, 15)}`,
        password: 'password',
        password_confirmation: 'password',
        address: 'my address',
        phone: `${Math.floor(Math.random() * 10000000000)}`,
    });

    const carManufacturers = ['BMW', 'Audi', 'Mercedes', 'Toyota', 'Nissan'];
    const models = ['M5', 'Audi i8', 'E360', '4 Runner', 'Avalon', 'Altima', 'Maxima'];
    const bodyt = ['Sedan', 'Station Wagon', 'SUV', 'TRUCK', 'BUS'];

    const newAdValues = () => ({
        image_url: 'image_url_url',
        state: 'new',
        price: `${Math.random() * 1000000000}`,
        manufacturer: carManufacturers[`${Math.floor(Math.random() * Math.floor(5))}`],
        model: models[`${Math.floor(Math.random() * Math.floor(6))}`],
        body_type: bodyt[`${Math.floor(Math.random() * Math.floor(5))}`],
        description: `${Math.random().toString(36).substr(2, 9)}`,
    });


    before(async() => {
        await db.query('CREATE TABLE IF NOT EXISTS users ( id BIGINT PRIMARY KEY, email VARCHAR(30) NOT NULL UNIQUE, first_name VARCHAR(30) NOT NULL, last_name VARCHAR(30) NOT NULL, password VARCHAR(140) NOT NULL, address VARCHAR(400) NOT NULL, is_admin BOOLEAN NOT NULL DEFAULT FALSE, phone VARCHAR(16), status VARCHAR(10) NOT NULL DEFAULT \'active\', created_at TIMESTAMPTZ NOT NULL DEFAULT NOW())');
        await db.query('CREATE TABLE IF NOT EXISTS cars (id BIGINT PRIMARY KEY,  owner BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE, created_on TIMESTAMPTZ NOT NULL DEFAULT NOW(), state VARCHAR(8) NOT NULL, status VARCHAR(15) NOT NULL DEFAULT \'available\', price NUMERIC(10, 2) NOT NULL CHECK(price > 0), manufacturer VARCHAR(30) NOT NULL, model VARCHAR(30) NOT NULL, body_type VARCHAR(30) NOT NULL, description TEXT, image_url VARCHAR(150), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW() )');
        await db.query('CREATE TABLE IF NOT EXISTS orders (id BIGINT PRIMARY KEY, buyer_id BIGINT REFERENCES users(id) ON DELETE CASCADE,  car_id BIGINT NOT NULL REFERENCES cars(id) ON DELETE CASCADE, seller_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE, price NUMERIC NOT NULL CHECK(price > 0), status VARCHAR(20) NOT NULL DEFAULT \'pending\', date TIMESTAMPTZ NOT NULL DEFAULT NOW(), price_offered NUMERIC NOT NULL CHECK(price_offered > 0), new_price_offered NUMERIC, updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW())');
        await db.query('CREATE TABLE IF NOT EXISTS flags (id BIGINT PRIMARY KEY, car_id BIGINT REFERENCES cars(id) ON DELETE CASCADE, created_on TIMESTAMPTZ NOT NULL DEFAULT NOW(), reason VARCHAR(20) NOT NULL, description TEXT, reportedBy BIGINT NOT NULL REFERENCES users(id), status VARCHAR(20) NOT NULL DEFAULT \'pending\', severity VARCHAR(20) NOT NULL DEFAULT \'minor\') ');
        const data = await dataValues();
        await chai.request(server).post('/api/v1/auth/signup').send(data);
    });

    after(async() => {
        await db.query('DELETE FROM flags');
        await db.query('DELETE FROM orders');
        await db.query('DELETE FROM cars');
        await db.query('DELETE FROM users');
    });

    const orderData = {
        carId: 1288392382934,
        price_offered: '6000000',
    };

    describe('Create order', () => {

        it('should return error 400 if carId or price is not supplied', async() => {
            const token = await genToken();
            orderData.carId = '';

            chai.request(server).post('/api/v1/order').set('x-auth', token).send(orderData)
                .end((err, res) => {
                    expect(res.status).to.eq(400);
                    expect(res.body.error).to.eq('Select car and state amount you want to pay');
                });
        });

        it('should return error 400 if car id is invalid', async() => {
            orderData.carId = 128839238293;

            const token = await genToken();
            chai.request(server).post('/api/v1/order').set('x-auth', token).send(orderData)
                .end((err, res) => {
                    expect(res.status).to.eq(400);
                    expect(res.body.error).to.eq('Select car and state amount you want to pay');
                });
        });

        it('should return error 401  if user is not logged in', (done) => {
            chai.request(server).post('/api/v1/order').send(orderData)
                .end((err, res) => {
                    expect(res.status).to.eq(401);
                    expect(res.body.error).to.eq('No authorization token provided');
                    done();
                });
        });
    });


    // User retrieves his/her orders
    describe('User get his/her ads', () => {

        it('should return error 401 if user is not logged in', (done) => {
            chai.request(server).get('/api/v1/orders/me')
                .end((err, res) => {
                    expect(res.status).to.eq(401);
                    expect(res.body.error).to.eq('No authorization token provided');
                    done();
                });
        });

    });

});