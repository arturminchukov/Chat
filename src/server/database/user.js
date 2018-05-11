const { ObjectId } = require('mongodb');

const { getSessionInfo, saveSessionInfo, deleteSessionInfo } = require('./session');
const { pageableCollection } = require('./helpers');

const TABLE = 'users';

/**
 * @typedef {{
 *  [_id]: string,
 *  name: string,
 *  email: string,
 *  phone: string,
 *  [status]: boolean
 * }} User
 */

/**
 * @param {Db} db
 * @param {Object} user
 *
 * @returns {Promise<User>}
 */
async function updateUserAvatar(db, user) {
    let newUser =  await db.collection(TABLE).updateOne({ _id: user._id }, { $set: { avatar: user.avatar } });
    if(newUser && newUser.password)
        delete newUser.password;
    return newUser;
}


/**
 * @param {Db} db
 * @param {string} sid Session ID
 *
 * @returns {Promise<User>}
 */
async function findUserBySid(db, sid) {
    const session = await getSessionInfo(db, sid);
    let newUser = await getUser(db, session.userId);
    if(newUser && newUser.password)
        delete newUser.password;
    return newUser;
}

/**
 * @param {Db} db
 * @param {string} userId
 *
 * @returns {Promise<User>}
 */
async function getUser(db, userId) {
    if (!userId){
        return null;
    }
    let newUser = await db.collection(TABLE).findOne({ _id: ObjectId(userId.toString()) });
    if(newUser && newUser.password)
        delete newUser.password;
    return newUser;
}

/**
 * @param {Db} db
 * @param {String} userId
 * @param {String} sid
 *
 * @returns {Promise<User>}
 */
async function setCurrentUser(db, { userId, sid }) {
    if (!userId) {
        throw new Error('User id required');
    }

    if (!sid) {
        throw new Error('Session id required');
    }

    await deleteSessionInfo(db, sid);
    let session = {
        userId: ObjectId(userId),
        sid: sid,
    };
    await saveSessionInfo(db, session);
    let newUser =  await findUserBySid(db, sid);
    if(newUser && newUser.password)
        delete newUser.password;
    return newUser;
}

/**
 * @param {Db} db
 * @param {String} sid
 *
 * @returns {Promise<User>}
 */
async function logoutUser(db, sid) {
    if (!sid) {
        throw new Error('Session id required');
    }

    return await deleteSessionInfo(db, sid);
}

/**
 * @param {Db} db
 * @param {{}} [filter]
 *
 * @return {Promise<Pagination<User>>}
 */
async function getUsers(db, filter) {
    const selectModifier = filter['lastId']?'$lt':null;

    let newUsers = await pageableCollection(db.collection(TABLE), {
            ...filter,
            order: {
                _id: -1,
            },
        },
        selectModifier);
    for(let newUser of newUsers.items) {
        if (newUser && newUser.password)
            delete newUser.password;
    }
    return newUsers;
}

/**
 * @param {Db} db
 * @param {string} email
 * @param {string} password
 * @param {string} name
 *
 * @return {Promise<Message>}
 */
async function addUser(db, { email, password, name }) {
    if (!email) {
        throw new Error('User email required');
    }

    if (!password) {
        throw new Error('User password required');
    }

    if (!name) {
        throw new Error('User name required');
    }

    const userEntity = {
        email: email,
        password: password,
        name: name
    };
    const result = await db.collection(TABLE).insertOne(userEntity);
    userEntity._id = result.insertedId;

    if(userEntity && userEntity.password)
        delete userEntity.password;

    return userEntity;
}

module.exports = {
    findUserBySid,
    getUsers,
    getUser,
    addUser,
    setCurrentUser,
    logoutUser,
    updateUserAvatar,
};
