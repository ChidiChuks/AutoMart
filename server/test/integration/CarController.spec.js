/* eslint-disable max-len */
import chai from 'chai';
import chaiHttp from 'chai-http';
import path from 'path';
import server from '../../index';
import db from '../../services/db';
import generateToken from '../../lib/generateToken';


const loc = path.resolve('./');

const { expect } = chai;
chai.use(chaiHttp);
const adUrl = '/api/v1/car';
const signupUrl = '/api/v1/auth/signup';
describe('Cars', () => {
    const userId = async() => {
        const { rows } = await db.query('SELECT id FROM users LIMIT 1');
        return rows[0];
    };

    const genToken = async() => {
        const userdata = await userId();
        return generateToken(userdata.id, false);
    };

    const updateInfo = {
        status: 'new',
        price: '7500000.00',
        description: 'This is a new description',
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
        img: 'img_url',
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
        await chai.request(server).post(signupUrl).send(data);
    });

    after(async() => {
        await db.query('DELETE FROM flags');
        await db.query('DELETE FROM orders');
        await db.query('DELETE FROM cars');
        await db.query('DELETE FROM users');
    });

    describe('Create Ad', () => {
        it('should create a new ad', async() => {
            const data = await userId();
            const newAd = await newAdValues();
            const token = await generateToken(data.id, false);

            chai.request(server)
                .post(adUrl)
                .set('x-auth', token)
                .attach('image_url', path.join(loc, '/server/test/benz.jpg'))
                .set('Content-Type', 'Multipart/form-data')
                .field('id', Date.now())
                .field('price', 8000000)
                .field('owner', data.id)
                .field('state', newAd.state)
                .field('model', newAd.model)
                .field('manufacturer', newAd.manufacturer)
                .field('body_type', newAd.body_type)
                .field('description', newAd.description)
                .then((res) => {
                    expect(res.status).to.eq(201);
                    expect(res.body.data).to.have.property('id');
                    expect(res.body.data.price).to.eq(8000000);
                    expect(res.body.data.state).to.eq(newAd.state);
                });
        });
        it('should return error 400 if request does not contain all required fields', async() => {
            const token = await genToken();
            chai.request(server)
                .post(adUrl)
                .set('x-auth', token)
                .attach('img', path.join(loc, '/server/test/benz.jpg'))
                .set('Content-Type', 'Multipart/form-data')
                .field('status', 'available')
                .field('price', '')
                .field('state', 'new')
                .field('model', 'CL350')
                .field('manufacturer', 'Benz')
                .field('body_type', 'car')
                .field('description', 'This is additional description')
                .then((res) => {
                    expect(res.body.status).to.eq(400);
                    expect(res.body.error).to.eq('Fill all required fields');
                });
        });

        it('should return error 400 if user has the same car that is available', async() => {
            const data = await userId();
            const newAd = await newAdValues();
            await db.query(`INSERT INTO cars (id, price, description, image_url, owner, state, manufacturer, model, body_type) VALUES  ('${Date.now()}', 8000000, '${newAd.description}',
    'img.png', ${data.id}, '${newAd.state}', '${newAd.manufacturer}', '${newAd.model}', '${newAd.body_type}')`);

            const token = await generateToken(data.id, false);

            chai.request(server)
                .post(adUrl)
                .set('x-auth', token)
                .attach('img', path.join(loc, '/server/test/benz.jpg'))
                .set('Content-Type', 'Multipart/form-data')
                .field('id', Date.now())
                .field('price', 8000000)
                .field('owner', data.id)
                .field('state', newAd.state)
                .field('model', newAd.model)
                .field('manufacturer', newAd.manufacturer)
                .field('body_type', newAd.body_type)
                .field('description', newAd.description)
                .then((res) => {
                    expect(res.status).to.eq(400);
                    expect(res.body.error).to.eq('You have a similar unsold car');
                });
        });

        it('should return error 401 if user is not logged in', async() => {
            const data = newAdValues();
            const res = await chai.request(server).post(adUrl).send(data);
            expect(res.status).to.eq(401);
            expect(res.body.error).to.eq('No authorization token provided');
        });
    });

    // unsold cars according to manufacturer
    describe('view available cars by manufacturer', () => {

        it('should return a custom error if no vehicle is found for the manufacturer', async() => {
            const data = await userId();
            const newAd = await newAdValues();
            await db.query(`INSERT INTO cars (id, price, description, image_url, owner, state, manufacturer, model, body_type) VALUES  ('${Date.now()}', 8000000, '${newAd.description}',
      '${newAd.img}', ${data.id}, '${newAd.state}', '${newAd.manufacturer}', '${newAd.model}', '${newAd.body_type}')`);

            const res = await chai.request(server).get(`/api/v1/car/manufacturer/${newAd.manufacturer}`);
            // console.log(res);
            expect(res.status).to.eq(200);
            expect(res.body.data).to.be.an('Array');
        });
    });

    // unsold cars by body type

    describe('view available cars by body type', () => {
        it('should return all unsold cars by body type', async() => {
            const data = await userId();
            const newAd = await newAdValues();
            await db.query(`INSERT INTO cars (id, price, description, image_url, owner, state, manufacturer, model, body_type) VALUES  ('${Date.now()}', 8000000, '${newAd.description}',
      '${newAd.img}', ${data.id}, '${newAd.state}', '${newAd.manufacturer}', '${newAd.model}', '${newAd.body_type}')`);

            const res = await chai.request(server).get(`/api/v1/car/body_type/${newAd.body_type}`);
            expect(res.status).to.eq(200);
            expect(res.body).to.have.property('data').to.be.an('Array');
        });

        it('should return error 404 if cars of given body type are not found', async() => {
            const data = await userId();
            const newAd = await newAdValues();
            await db.query(`INSERT INTO cars (id, price, description, image_url, owner, state, manufacturer, model, body_type) VALUES  ('${Date.now()}', 8000000, '${newAd.description}',
      '${newAd.img}', ${data.id}, '${newAd.state}', '${newAd.manufacturer}', '${newAd.model}', '${newAd.body_type}')`);

            const res = await chai.request(server).get('/api/v1/car/body_type/SEMI');
            expect(res.status).to.eq(404);
            expect(res.body.error).to.eq('There are no cars for the selected body_type');
        });
    });

    // view available cars by state (used, new)
    describe('view available cars by state', () => {
        it('should return all available cars by state', async() => {
            const data = await userId();
            const newAd = await newAdValues();
            await db.query(`INSERT INTO cars (id, price, description, image_url, owner, state, manufacturer, model, body_type) VALUES  ('${Date.now()}', 8000000, '${newAd.description}',
      '${newAd.img}', ${data.id}, '${newAd.state}', '${newAd.manufacturer}', '${newAd.model}', '${newAd.body_type}')`);
            const res = await chai.request(server).get(`/api/v1/car/state/${newAd.state}`);
            expect(res.status).to.eq(200);
            expect(res.body).to.have.property('data').to.be.an('ARRAY');
            expect(res.body.data[0]).to.have.property('state').eq(newAd.state);
        });

        it('should return error 404 if cars are not found for selected state', async() => {
            const res = await chai.request(server).get('/api/v1/car/state/not');
            expect(res.status).to.eq(404);
            expect(res.body.error).to.eq('There are no cars for the selected state');
        });
    });

    // view all unsold cars
    describe('view all available cars', () => {
        it('should return all unsold cars', async() => {
            const data = await userId();
            const newAd = await newAdValues();
            await db.query(`INSERT INTO cars (id, price, description, image_url, owner, state, manufacturer, model, body_type) VALUES  ('${Date.now()}', 8000000, '${newAd.description}',
      '${newAd.img}', ${data.id}, '${newAd.state}', '${newAd.manufacturer}', '${newAd.model}', '${newAd.body_type}')`);
            const token = await genToken();
            const res = await chai.request(server).get('/api/v1/car?status=available').set('x-auth', token);
            expect(res.status).to.eq(200);
            expect(res.body).to.have.property('data').to.be.an('ARRAY');
            // console.log(res);
        });

        it('should return 404 when there are no unsold cars', async() => {
            await db.query('UPDATE cars SET status=\'sold\'');
            const token = await genToken();
            const res = await chai.request(server).get('/api/v1/car?status=available').set('x-auth', token);
            expect(res.status).to.eq(404);
            expect(res.body.error).to.eq('There are no cars available now. Check back');
        });
    });

    // get ad by id
    describe('Get ad by id', () => {
        it('should return a single ad details', async() => {
            const data = await userId();
            const newAd = await newAdValues();
            await db.query(`INSERT INTO cars (id, price, description, image_url, owner, state, manufacturer, model, body_type) VALUES  ('${Date.now()}', 8000000, '${newAd.description}',
      '${newAd.img}', ${data.id}, '${newAd.state}', '${newAd.manufacturer}', '${newAd.model}', '${newAd.body_type}')`);
            const { rows } = await db.query('SELECT id FROM cars limit 1');
            const { id } = rows[0];
            const res = await chai.request(server).get(`/api/v1/car/${id}`);
            expect(res.status).to.eq(200);
            expect(res.body.data.id).to.eq(id);
        });

        it('should return error 400 with custom error if supplied id is not valid', async() => {
            const res = await chai.request(server).get('/api/v1/car/12345678901');
            expect(res.status).to.eq(400);
            expect(res.body.error).to.eq('Invalid ad id');
        });

        it('should return error 404 with custom error if ad is not found', async() => {
            const res = await chai.request(server).get('/api/v1/car/9293837414384');
            expect(res.status).to.eq(404);
            expect(res.body.error).to.eq('The ad you are looking for is no longer available');
        });
    });

    // seller update ad price
    describe('Seller update ad price, status and description', () => {
        it('should return the ad with updated price', async() => {
            const { rows } = await db.query('SELECT id FROM cars limit 1');
            const { id } = rows[0];
            const token = await genToken(rows[0].owner, false);
            const res = await chai.request(server).patch(`/api/v1/car/${id}/price`).set('x-auth', token).send({ price: 80000 });
            expect(res.status).to.eq(200);

        });


    });

    // get single ad
    describe('User can view single ad', () => {
        it('should return full details of an ad', async() => {
            const data = await userId();
            const newAd = await newAdValues();
            await db.query(`INSERT INTO cars (id, price, description, image_url, owner, state, manufacturer, model, body_type) VALUES  ('${Date.now()}', 8000000, '${newAd.description}',
    '${newAd.img}', ${data.id}, '${newAd.state}', '${newAd.manufacturer}', '${newAd.model}', '${newAd.body_type}')`);
            const { rows } = await db.query('SELECT id FROM cars limit 1');
            const { id } = rows[0];

            const res = await chai.request(server).get(`/api/v1/car/${id}`);
            expect(res.status).to.eq(200);
            expect(res.body).to.have.property('data');
            expect(res.body.data.id).to.eq(id);
        });
        it('should return error 404 if ad is not found', async() => {
            const res = await chai.request(server).get('/api/v1/car/1212121212223');
            expect(res.status).to.eq(404);
            expect(res.body.error).to.eq('The ad you are looking for is no longer available');
        });

        it('should return error 400 if invalid ad id is supplied', async() => {
            const res = await chai.request(server).get('/api/v1/car/155873165645');
            expect(res.status).to.eq(400);
            expect(res.body.error).to.eq('Invalid ad id');
        });

    });

    // get ads within a price range
    describe('Get ads within a price range', () => {

        it('Should return error 404 if no ads are found in the given range', async() => {
            const token = await genToken();
            const res = await chai.request(server).get('/api/v1/car?status=available&min_price=18000000&max_price=24000000').set('x-auth', token);
            expect(res.status).to.eq(404);
            expect(res.body.error).to.eq('There are no cars within the selected range');
        });

    });

    // admin can view all ads whether sold or available
    describe('admin view all ads', () => {
        it('should return all ads', async() => {
            const data = await userId();
            const newAd = await newAdValues();
            await db.query(`INSERT INTO cars (id, price, description, image_url, owner, state, manufacturer, model, body_type) VALUES  ('${Date.now()}', 8000000, '${newAd.description}',
    '${newAd.img}', ${data.id}, '${newAd.state}', '${newAd.manufacturer}', '${newAd.model}', '${newAd.body_type}')`);

            const token = generateToken(data.id, true);
            const res = await chai.request(server).get('/api/v1/cars').set('x-auth', token);
            expect(res.status).to.eq(200);
            expect(res.body.data).to.be.an('Array');
            expect(res.body.data[0]).to.be.an('Object');
        });

        it('should return error 404 if there are no ads available', async() => {
            const data = await userId();
            await db.query('DELETE FROM flags');
            await db.query('DELETE FROM orders');
            await db.query('DELETE FROM cars');
            const token = generateToken(data.id, true);
            const res = await chai.request(server).get('/api/v1/cars').set('x-auth', token);
            expect(res.body.status).to.eq(404);
            expect(res.body.error).to.eq('There are no cars available now. Check back');
        });

        it('should return error 401 if user is not logged in', async() => {
            const data = await userId();
            const newAd = await newAdValues();
            await db.query(`INSERT INTO cars (id, price, description, image_url, owner, state, manufacturer, model, body_type) VALUES  ('${Date.now()}', 8000000, '${newAd.description}',
    '${newAd.img}', ${data.id}, '${newAd.state}', '${newAd.manufacturer}', '${newAd.model}', '${newAd.body_type}')`);

            const { rows } = await db.query('SELECT id FROM cars LIMIT 1');
            const res = await chai.request(server).delete(`/api/v1/car/${rows[0].id}`);
            expect(res.status).to.eq(401);
            expect(res.body.error).to.eq('No authorization token provided');
        });
    });

    // admin can delete any posted ad
    describe('Admin can delete a posted ad', () => {
        it('should delete a posted ad', async() => {
            const user = await userId();
            const newAd = await newAdValues();
            await db.query(`INSERT INTO cars (id, price, description, image_url, owner, state, manufacturer, model, body_type) VALUES  ('${Date.now()}', 8000000, '${newAd.description}',
      '${newAd.img}', ${user.id}, '${newAd.state}', '${newAd.manufacturer}', '${newAd.model}', '${newAd.body_type}')`);
            const { rows } = await db.query('SELECT id FROM cars LIMIT 1');
            const token = generateToken(user.id, true);
            const res = await chai.request(server).delete(`/api/v1/car/${rows[0].id}`).set('x-auth', token);
            expect(res.status).to.eq(200);
            expect(res.body.data.id).to.eq(rows[0].id);
        });

        it('should return error 401 if user is not admin or not logged in', async() => {
            const data = await userId();
            const newAd = await newAdValues();
            await db.query(`INSERT INTO cars (id, price, description, image_url, owner, state, manufacturer, model, body_type) VALUES  ('${Date.now()}', 8000000, '${newAd.description}',
    '${newAd.img}', ${data.id}, '${newAd.state}', '${newAd.manufacturer}', '${newAd.model}', '${newAd.body_type}')`);

            const { rows } = await db.query('SELECT id FROM cars LIMIT 1');
            const res = await chai.request(server).delete(`/api/v1/car/${rows[0].id}`);
            expect(res.status).to.eq(401);
            expect(res.body.error).to.eq('No authorization token provided');
        });

        it('should return error 400 if wrong ad id is given', async() => {
            const user = await userId();
            const token = generateToken(user.id, true);
            const res = await chai.request(server).delete('/api/v1/car/123456789012').set('x-auth', token);
            expect(res.status).to.eq(400);
            expect(res.body.error).to.eq('Select the ad to delete');
        });
        it('should return error 404 if ad is not available', async() => {
            const user = await userId();
            const token = generateToken(user.id, true);
            const res = await chai.request(server).delete('/api/v1/car/1783782738238').set('x-auth', token);
            expect(res.status).to.eq(404);
            expect(res.body.error).to.eq('Selected ad not available');
        });
    });

    describe('User retrieves all his/her posted ads', () => {
        it('should return error 404 if user has no ads', async() => {
            const user = await userId();
            const newUserId = Date.now();
            const values = await dataValues();
            await db.query(`INSERT INTO users (id, email, first_name, last_name, password, address) VALUES('${newUserId}', '${values.email}', '${values.first_name}', '${values.last_name}', '${values.password}', '${values.address}')`);
            await db.query(`UPDATE cars SET owner=${newUserId} WHERE owner=${user.id}`);
            const token = generateToken(user.id, false);

            const res = await chai.request(server).get('/api/v1/ads/me').set('x-auth', token);
            expect(res.status).to.eq(404);
            expect(res.body.error).to.eq('You do not have ads yet');
        });

        it('should return array of a users ads', async() => {
            const user = await userId();
            const token = generateToken(user.id, false);

            const newAd = await newAdValues();
            await db.query(`INSERT INTO cars (id, price, description, image_url, owner, state, manufacturer, model, body_type) VALUES  ('${Date.now()}', 8000000, '${newAd.description}',
    '${newAd.img}', ${user.id}, '${newAd.state}', '${newAd.manufacturer}', '${newAd.model}', '${newAd.body_type}')`);

            const res = await chai.request(server).get('/api/v1/ads/me').set('x-auth', token);
            expect(res.status).to.eq(200);
            expect(res.body.data).to.be.an('Array');
        });

    });

});