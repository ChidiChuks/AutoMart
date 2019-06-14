import UserModel from '../models/UserModel';
import { comparePassword, hashPassword } from '../lib/handlePassword';
import validEmail from '../lib/validateEmail';
import generateToken from '../lib/generateToken';

const User = {
  /*
     * @description - creates a new user
     * @params {object}
     * @returns {object}
     */
  async create(req, res) {
    if (req.body.password.localeCompare(req.body.password) !== 0) {
      return res.status(400).send({
        status: 400,
        message: 'Password does not match',
      });
    }

    if (!validEmail(req.body.email)) {
      return res.status(400).send({
        status: 400,
        message: 'Invalid / empty email supplied',
      });
    }

    if (!req.body.email
            || !req.body.name
            || !req.body.password
    ) {
      return res.status(400).send({
        status: 400,
        message: 'Fill all required fields',
      });
    }

    if (req.body.password.length < 6) {
      return res.status(400).send({
        status: 400,
        message: 'Password is too short',
      });
    }
    if (req.body.email.length >= 30 || req.body.name.length >= 50) {
      return res.status(400).send({
        status: 400,
        message: 'Name or email is too long',
      });
    }
    const checkEmailInDb = UserModel.findByProperty('email', req.body.email);

    if (checkEmailInDb) {
      return res.status(400).send({
        status: 400,
        message: 'User with given email or phone already exist',
      });
    }

    req.body.password = await hashPassword(req.body.password);

    const user = UserModel.create(req.body);
    const token = generateToken(user.id, user.isAdmin);

    return res.status(201).header('x-auth', token).send({
      status: 201,
      data: {
        token,
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  },


  getAll(req, res) {
    const users = UserModel.getAllUsers();
    return res.status(200).send(users);
  },


  async signIn(req, res) {
    if (!req.body.email || !req.body.password) {
      return res.status(400).send({
        status: 400,
        message: 'Invalid login credentials',
      });
    }
    const user = UserModel.findByProperty('email', req.body.email);
    if (!user) {
      return res.status(404).send({
        status: 404,
        message: 'Invalid login credentials',
      });
    }
    if (user.status !== 'active') {
      return res.status(401).send({
        status: 401,
        message: 'Your account is not active',
      });
    }
    delete req.headers['x-auth'];
    try {
      const validPassword = await comparePassword(req.body.password, user.password);
      if (!validPassword) {
        return res.status(401).send({
          status: 401,
          message: 'Wrong username/password',
        });
      }
    } catch (tokenError) {
      return res.status(500).send({
        status: 500,
        message: 'Oh, something went wrong, try again',
      });
    }

    const token = generateToken(user.id, user.isAdmin);
    user.token = token;
    return res.status(200).header('x-auth', token).send({
      status: 200,
      data: user,
    });
  },

  async changePassword(req, res) {
    if (!req.body.currentPassword || !req.body.newPassword) {
      return res.status(400).send({
        status: 400,
        message: 'Fill the required fields',
      });
    }
    const { userId } = req;
    const user = UserModel.getUser(userId);
    if (!user) {
      return res.status(404).send({
        message: 'User not found',
        status: 404,
      });
    }
    const confirmPassword = await comparePassword(req.body.currentPassword, user.password);
    if (!confirmPassword) {
      return res.status(400).send({
        status: 400,
        message: 'Wrong current password, use password reset link',
      });
    }
    const hashNewPassword = await hashPassword(req.body.newPassword);
    const updatedUserDetails = UserModel.changePassword(userId, hashNewPassword);

    return res.send({
      status: 200,
      data: updatedUserDetails,
    });
  },

};

export default User;