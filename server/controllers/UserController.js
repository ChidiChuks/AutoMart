import { comparePassword, hashPassword } from '../lib/handlePassword';
import validEmail from '../lib/validateEmail';
import generateToken from '../lib/generateToken';
import validateData from '../lib/validateData';
import UserService from '../services/UserService';
import util from '../lib/Util';




const User = {
    /*
     * @description - creates a new user
     * @params {object}
     * @returns {object}
     */
    async create(req, res) {
        const requiredProperties = ['email', 'first_name', 'last_name', 'password', 'address'];

        if (validateData(requiredProperties, req.body) || !validEmail(req.body.email)) {
            return util.sendError(res, 400, 'Fill all required fields with a valid email address');
        }
        // if (req.body.password.localeCompare(req.body.password_confirmation) !== 0) {
        //   return util.sendError(res, 400, 'Password and confirmation does not match');
        // }

        if (req.body.password.length < 6 || req.body.email.length >= 30 ||
            req.body.first_name.length >= 30 || req.body.last_name.length >= 30) {
            return util.sendError(res, 400, 'Ensure password is atleast 6 characters, name and email not more than 30 characters');
        }

        req.body.password = await hashPassword(req.body.password);

        const values = [
            Date.now(),
            req.body.email,
            req.body.first_name,
            req.body.last_name,
            req.body.password,
            req.body.address,
        ];
        try {
            const { rows } = await UserService.createUser(values);

            const {
                // eslint-disable-next-line camelcase
                id,
                email,
                first_name,
                last_name,
                address,
                is_admin,
                status,
            } = rows[0];

            const token = generateToken(id, is_admin, first_name);

            return res.status(201).set('x-auth', token).send({
                status: 201,
                data: {
                    token,
                    id,
                    email,
                    first_name,
                    last_name,
                    address,
                    is_admin,
                    status,
                },
            });
        } catch (error) {
            return (error.routine === '_bt_check_unique') ? util.sendError(res, 400, 'User with given email or phone already exist') :
                util.sendError(res, 500, error.message);
        }
    },

    async getAll(req, res) {
        // const users = UserModel.getAllUsers();

        // const selectAllUsers = 'SELECT (id, email, first_name, last_name, address, isAdmin, phone, status) FROM users LIMIT 50';

        try {
            const { rows } = await UserService.getAllUsers();
            return util.sendSuccess(res, 200, rows);
        } catch (error) {
            return util.sendError(res, 500, error.message);
        }
    },

    async signIn(req, res) {
        delete req.headers['x-auth'];
        if (validateData(['email', 'password'], req.body) || !validEmail(req.body.email)) {
            return util.sendError(res, 400, 'Invalid login credentials');
        }

        // const query = `SELECT * FROM users WHERE email='${req.body.email}'`;
        try {
            const { rows } = await UserService.getUserByEmail(req.body.email);
            // console.log(rows);
            if (rows.length < 1) {
                return util.sendError(res, 404, 'Wrong username/password');
            }
            const user = rows[0];

            const validPassword = await comparePassword(req.body.password, user.password);
            if (!validPassword) {
                return util.sendError(res, 401, 'Wrong username/password');
            }
            user.token = generateToken(user.id, user.is_admin);
            const data = {
                id: user.id,
                email: user.email,
                is_admin: user.is_admin,
                first_name: user.first_name,
                last_name: user.last_name,
                status: user.status,
                token: user.token,
            };
            return res.status(200).header('x-auth', user.token).send({
                status: 200,
                data: user,
            });
        } catch (error) {
            return util.sendError(res, 500, error.message);
        }
    },

    async changePassword(req, res) {
        const { userId } = req;
        if (!req.body.currentPassword || !req.body.newPassword) {
            return util.sendError(res, 400, 'Fill the required fields');
        }

        // const query = `SELECT password FROM users WHERE id=${userId}`;
        try {
            const { rows } = await UserService.selectPassword(userId);
            const confirmPassword = await comparePassword(req.body.currentPassword, rows[0].password);
            if (!confirmPassword) {
                return util.sendError(res, 400, 'Wrong current password, use password reset link');
            }

            const hashNewPassword = await hashPassword(req.body.newPassword);

            // const updateQuery = 'UPDATE users SET password=$1 WHERE id=$2 RETURNING id, email, first_name, last_name, phone, status';
            const result = await UserService.updateUserPassword([hashNewPassword, userId]);
            return util.sendSuccess(res, 200, result.rows[0]);
        } catch (error) {
            return util.sendError(res, 500, error.message);
        }
    },

    async makeAdmin(req, res) {
        if (!req.params.id) {
            return util.sendError(res, 400, 'Request does not contain required fields');
        }

        // const makeAdminQuery = 'UPDATE users SET isadmin=$1 WHERE id=$2 AND status=$3 RETURNING id, email, first_name, last_name, isadmin, phone, status';
        try {
            const { rows } = await UserService.makeUserAdmin([true, req.params.id, 'active']);
            return (rows.length < 1) ? util.sendError(res, 404, 'User not found or inactive') :
                util.sendSuccess(res, 200, rows[0]);
        } catch (error) {
            return util.sendError(res, 500, error.message);
        }
    },

    logout(req, res) {
        return util.sendSuccess(res, 200, 'Successfully logged out');
    },
    async disableUser(req, res) {
        const { userId } = req.params;
        // const disableQuery = 'UPDATE users SET status=$1 WHERE id=$2 AND status=$3 RETURNING id, email, first_name, last_name, isadmin, phone, status';
        try {
            const { rows } = await UserService.disableUser(['disabled', userId, 'active']);
            return (rows.length < 1) ? util.sendError(res, 404, 'User not found or inactive') :
                util.sendSuccess(res, 200, rows[0]);
        } catch (error) {
            return util.sendError(res, 404, error);
        }
    },

    // errorResponse(res, statuscode, message) {
    //     return res.status(statuscode).send({
    //         status: statuscode,
    //         message,
    //     });
    // },
    // successResponse(res, statuscode, data) {
    //     return res.status(statuscode).send({
    //         status: statuscode,
    //         data,
    //     });
    // },
};

export default User;