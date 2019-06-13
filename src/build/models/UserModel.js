

Object.defineProperty(exports, '__esModule', {
  value: true,
});

const _usersData = require('../test/usersData');

const _usersData2 = _interopRequireDefault(_usersData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class UserModel {
  constructor() {
    this.users = _usersData2.default;
  }

  /**
     * @param {Object} data
     * @returns {Object}
     */
  create(data) {
    const newUser = {
      id: Math.floor(Math.random() * 100000) + 1 + Date.now(),
      email: data.email || '',
      first_name: data.first_name || '',
      last_name: data.last_name || '',
      password: data.password || '',
      address: data.address || '',
      isAdmin: data.isAdmin || false,
      phone: data.phone || '',
      account_number: data.account_number || '',
      bank: data.bank || '',
      status: 'active',
    };
    this.users.push(newUser);
    return newUser;
  }

  /**
     * @description - function to check whether the given value already exist in the db
     * @param {string} ppty
     * @param {string} value
     * @returns {object} found user or undefined
     */
  findByProperty(ppty, value) {
    return this.users.find(user => user[ppty] === value);
  }

  getAllUsers() {
    return this.users;
  }

  /**
     * @param {Number} userid
     * @param {String} newPassword - new hashed password
     * @returns {Object}
     */
  changePassword(userid, newPassword) {
    const user = this.getUser(userid);
    user.password = newPassword || user.password;
    return user;
  }

  /**
     * @description - get a user
     * @param {Number} userid
     * @returns {Object}
     */
  getUser(userid) {
    return this.users.find(user => user.id === parseInt(userid, 10));
  }
}

exports.default = new UserModel();
