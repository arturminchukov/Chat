import { dispatch } from '../index';
import { store } from '../index';
import { resetUsers } from './users';

export const routeNavigation = ({ page, payload = {} }) => {
    debugger;
    let b = store;
    if (page === 'chat_list')
        dispatch({
            type: 'ROOMS_RESET',
        });
    else if (page === 'contacts_list' || page==='add_room_page')
        dispatch(resetUsers());

    return {
        type: 'ROUTE_NAVIGATE',
        page,
        payload,
    }
};
