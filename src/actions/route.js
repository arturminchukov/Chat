import { dispatch } from '../index';
import { resetUsers } from './users';

export const routeNavigation = ({ page, payload = {} }) => {
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
