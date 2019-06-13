

Object.defineProperty(exports, '__esModule', {
  value: true,
});

const _UserModel = require('../models/UserModel');

const _UserModel2 = _interopRequireDefault(_UserModel);

const _handlePassword = require('../lib/handlePassword');

const _validateEmail = require('../lib/validateEmail');

const _validateEmail2 = _interopRequireDefault(_validateEmail);

const _generateToken = require('../lib/generateToken');

const _generateToken2 = _interopRequireDefault(_generateToken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const User = {
  /*
     * @description - creates a new user
     * @params {object}
     * @returns {object}
     */
  async create(req, res) {
    if (req.body.password.localeCompare(req.body.password_confirmation) !== 0) {
      return res.status(400).send({
        status: 400,
        message: 'Password and confirmation does not match',
      });
    }

    if (!(0, _validateEmail2.default)(req.body.email)) {
      return res.status(400).send({
        status: 400,
        message: 'Invalid / empty email supplied',
      });
    }

    if (!req.body.email || !req.body.first_name || !req.body.last_name || !req.body.password || !req.body.address || !req.body.phone || !req.body.account_number || !req.body.bank) {
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
    if (req.body.email.length >= 30 || req.body.first_name.length >= 30 || req.body.last_name.length >= 30) {
      return res.status(400).send({
        status: 400,
        message: 'Name or email is too long',
      });
    }
    const checkEmailInDb = _UserModel2.default.findByProperty('email', req.body.email);
    const checkPhoneInDb = _UserModel2.default.findByProperty('phone', req.body.phone);

    if (checkEmailInDb || checkPhoneInDb) {
      return res.status(400).send({
        status: 400,
        message: 'User with given email or phone already exist',
      });
    }

    req.body.password = await (0, _handlePassword.hashPassword)(req.body.password);

    const user = _UserModel2.default.create(req.body);
    const token = (0, _generateToken2.default)(user.id, user.isAdmin);

    return res.status(201).header('x-auth', token).send({
      status: 201,
      data: {
        token,
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        account_number: user.account_number,
        bank: user.bank,
        isAdmin: user.isAdmin,
      },
    });
  },

  getAll(req, res) {
    const users = _UserModel2.default.getAllUsers();
    return res.status(200).send(users);
  },

  async signIn(req, res) {
    if (!req.body.email || !req.body.password) {
      return res.status(400).send({
        status: 400,
        message: 'Invalid login credentials',
      });
    }
    const user = _UserModel2.default.findByProperty('email', req.body.email);
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
      const validPassword = await (0, _handlePassword.comparePassword)(req.body.password, user.password);
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

    const token = (0, _generateToken2.default)(user.id, user.isAdmin);
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
    const user = _UserModel2.default.getUser(userId);
    if (!user) {
      return res.status(404).send({
        message: 'User not found',
        status: 404,
      });
    }
    const confirmPassword = await (0, _handlePassword.comparePassword)(req.body.currentPassword, user.password);
    if (!confirmPassword) {
      return res.status(400).send({
        status: 400,
        message: 'Wrong current password, use password reset link',
      });
    }
    const hashNewPassword = await (0, _handlePassword.hashPassword)(req.body.newPassword);
    const updatedUserDetails = _UserModel2.default.changePassword(userId, hashNewPassword);

    return res.send({
      status: 200,
      data: updatedUserDetails,
    });
  },

};

exports.default = User;
