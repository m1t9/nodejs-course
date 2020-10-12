const DBuser = require('../../db/user.db.memory');

const getAll = async () => DBuser.getAllUsers();

const get = async id => {
  const user = await DBuser.getUser(id);
  if (!user) {
    throw new Error(`The user with id: ${id} was not found`);
  }
  return user;
};

const create = async user => DBuser.createUser(user);

const update = async (id, user) => DBuser.updateUser(id, user);

const remove = async id => DBuser.deleteUser(id);

module.exports = { getAll, get, create, update, remove };
