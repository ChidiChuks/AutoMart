import usersdata from '../test/usersData';

class UserModel {
  constructor() {
    this.users = usersdata;
  }

  /**
     * @param {Object} data
     * @returns {Object}
     */
  create(data) {
    const newUser = {
      id: Math.floor(Math.random() * 100000) + 1 + Date.now(),
      email: data.email || '',
      name: data.name || '',
      password: data.password || '',
      isAdmin: data.isAdmin || false,
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

export default new UserModel();
