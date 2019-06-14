import chai from 'chai';
import UserModel from '../../models/UserModel';
import usersdata from '../usersData';

const { expect } = chai;

describe('User Model', () => {
  describe('create User', () => {
    it('should create a new user', () => {
      const data = {
        name: 'Blessing Finer',
        email: 'blessing@gmail.com',
        password: 'password',
      };
      const newUser = UserModel.create(data);
      expect(newUser).to.have.property('id');
      expect(newUser).to.have.property('email').eq(data.email);
      expect(newUser.name).to.eq(data.name);
    });
  });
  describe('Find user by given property', () => {
    it('should return a user with given property', () => {
      UserModel.users = usersdata;

      const user = UserModel.findByProperty('email', 'johndoe@gmail.com');
      expect(user).to.have.property('email').eq('johndoe@gmail.com');
    });
  });
  describe('Get all users', () => {
    it('should return an array of all users', () => {
      UserModel.users = usersdata;
      const users = UserModel.getAllUsers();
      expect(users).to.be.an('Array');
      expect(users.length).to.eq(usersdata.length);
    });
  });
  describe('Change password', () => {
    it('should modify users password', () => {
      UserModel.users = usersdata;
      const userId = usersdata[0].id;

      const userWithUpdatedPassword = UserModel.changePassword(userId, 'newpassword');
      expect(userWithUpdatedPassword).to.have.property('password').eq('newpassword');
    });
  });
  describe('Get User', () => {
    it('should return a user with given id', () => {
      UserModel.users = usersdata;

      const userId = usersdata[0].id;
      const user = UserModel.getUser(userId);
      expect(user).to.be.an('Object');
      expect(user).to.have.property('email').eq(usersdata[0].email);
    });
  });
});
