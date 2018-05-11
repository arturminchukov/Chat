import { store } from '../index';
import { resetUsers } from './users';

export const routeNavigation = ({ page, payload = {} }) => {
    let state = store.getState();
    if (page === 'chat_list' && page!==state.route.page)
        store.dispatch({
            type: 'ROOMS_RESET',
        });
    else if ((page === 'contacts_list' || page==='add_room_page') && page!==state.route.page)
        store.dispatch(resetUsers());

    return {
        type: 'ROUTE_NAVIGATE',
        page,
        payload,
    }
};
