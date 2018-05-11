import { expect } from 'chai';
import user from './user';
// import { signInUser } from '../actions/signInUser';
// import { getCurUserInfo } from '../actions/getCurUserInfo';

describe('Reducer::CurrentUser', function () {
    it('On USER_SIGN_IN returns new state with new user', () => {
        // setup
        const state = { _id: -1};
        const expectedState = {
            _id: 'id1',
            curUserInfo: {
                _id: 'id1',
                name: 'name1',
                email: 'email1',
            }
        };
        // execute
        const newState = user(state, {
            type: 'USER_SIGN_IN',
            _id: 'id1',
            curUserInfo: {
                _id: 'id1',
                name: 'name1',
                email: 'email1',
            }
        });

        // verify
        expect(newState).to.deep.equal(expectedState);
    });

    it('On USER_GET_INFO change state curUserInfo', function () {
        // setup
        const state = {
            _id: -1,
            curUserInfo: null,
        };
        const expectedNewState = {
            _id:-1,
            curUserInfo: {
                _id: -1,
                name: 'name1',
                email: 'email1',
            }
        };
        // execute
        const newState = user(state, {
            type:'USER_GET_INFO',
            curUserInfo: {
                _id: -1,
                name: 'name1',
                email: 'email1',
            }
        });
        // verify
        expect(newState).to.deep.equal(expectedNewState);
    });

    it('On USER_SIGN_OUT set _id to -1', function () {
        // setup
        const state = {
            _id: 'id1',
            curUserInfo: {
                _id: 'id1',
                name: 'name1',
                email: 'email1',
            },
        };
        const expectedNewState = {
            _id:-1,
        };
        // execute
        const newState = user(state, {
            type:'USER_SIGN_OUT',
        });
        // verify
        expect(newState).to.deep.equal(expectedNewState);
    });

    it('On user reducer with non state return state with _id = -1', function () {
        const expectedNewState = {
            _id:-1,
        };
        // execute
        const newState = user(null, {
            type:'USER_SIGN_OUT',
        });
        // verify
        expect(newState).to.deep.equal(expectedNewState);
    });

    it('default user reducer returns state', function () {
        const state = {
            _id:-1
        },
        expectedNewState = {
            _id:-1,
        };
        // execute
        const newState = user(state, {type:null});
        // verify
        expect(newState).to.deep.equal(expectedNewState);
    });
});
