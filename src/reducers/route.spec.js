// import { expect } from 'chai';
// import route from './route';
// import { routeNavigation } from '../actions/route'
//
// describe('Reducer::Route', function() {
//     // it('returns route (object), page ("authorization"), payload (empty object) if state is undefined', function() {
//     //     // setup
//     //     const state = null;
//     //     const expectedNewState = {
//     //         page: 'authorization',
//     //         payload: {}
//     //     };
//     //
//     //     // execute
//     //     const newState = route(state, { type: 'unknown' });
//     //
//     //     // verify
//     //     expect(newState).to.deep.equal(expectedNewState);
//     // });
//
//     it('on ROUTE_NAVIGATE returns new route with set page and payload', function() {
//     // setup
//     const state = {
//         page: 'authorization',
//         payload: {
//             FooterNav: 'active'
//         }
//     };
//
//     const routeMessage = {
//         page: 'chat_list',
//         payload: {
//             _id: '123asd'
//         }
//     };
//
//     const action = routeNavigation(routeMessage);
//
//     const expectedNewState = {
//         page: 'chat_list',
//         payload: {
//             _id: '123asd'
//         }
//     };
//     // execute
//
//     const newState = route(state, action);
//
//     // verify
//     expect(newState).to.deep.equal(expectedNewState);
//     });
// });
