import { combineReducers } from 'redux';
import route from './route';
import messages from './messages';
import rooms from './rooms';
import users from './users';
import user from './user';

export default combineReducers({
    rooms,
    messages,
    route,
    users,
    user,
});
