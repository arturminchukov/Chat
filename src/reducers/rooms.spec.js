import { expect } from 'chai';
import rooms from './rooms';

describe('Reducer::Rooms', () => {
    it('returns items (empty array), next (true), error(null) if state is undefined', () => {
        // setup
        const state = null;
        const expectedNewState = {
            items: [],
            next: true,
            error: null,
        };

        // execute
        const newState = rooms(state, { type: 'unknown' });

        // verify
        expect(newState).to.deep.equal(expectedNewState);
    });
    it('on ROOM_ADD returns new state with added rooms', () => {
        // setup
        const state =
            {
                items: [{ id: '1' }, { id: '2' }, { id: '3' }],
                next: null,
                error: null,
            };
        const newRoom = { id: '4' };
        const action = {
            type: 'ROOM_ADD',
            room: newRoom,
        };
        const expectedNewState =
             {
                 items: [{ id: '4' },{ id: '1' }, { id: '2' }, { id: '3' }],
                 next: null,
                 error: null,
             };
        // execute

        const newState = rooms(state, action);

        // verify
        expect(newState).to.deep.equal(expectedNewState);
    });
    /*it('on ROOM_FETCH returns new state with existing rooms', () => {
        // setup
        const state =
            {
                items: [{ id: '1' }, { id: '2' }, { id: '3' }],
                next: {lastid: '3'},
                error: null,
            };
        const action = {
            type: 'ROOMS_FETCH',
            items: [{ id: '4' }, { id: '5' }, { id: '6' }],
            next: {lastid: '6'},
        };
        const expectedNewState =
             {
                 items: [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }, { id: '6' }],
                 next: {lastid: '6'},
                 error: null,
             };
        // execute

        const newState = rooms(state, action);

        // verify
        expect(newState).to.deep.equal(expectedNewState);
    });*/
    it('on ROOMS_RESET returns items (empty array), next (true), error(null)', () => {
        // setup
        const state =
            {
                items: [{ id: '1' }, { id: '2' }, { id: '3' }],
                next: {lastid: '3'},
                error: null,
            };
        const action = {
            type: 'ROOMS_RESET',
        };
        const expectedNewState =
             {
                 items: [],
                 next: true,
                 error: null,
             };
        // execute

        const newState = rooms(state, action);

        // verify
        expect(newState).to.deep.equal(expectedNewState);
    });
});
