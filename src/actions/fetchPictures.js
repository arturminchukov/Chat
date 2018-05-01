const URL = 'https://api.giphy.com/v1/';
const API_KEY = '/search?api_key=WGzC0bAlkaa4t2YGPIZVnvXfCL5ECfS4';
const API_KEY2 = '/search?api_key=Cq1WMQ20gc6Yc04dRuxEwDmCSkMukxCD';

export default function fetchPictures(newSelect,query) {
    return async function (dispatch, getState) {
        dispatch({
            type: 'PICTURES_LOADING',
            loading: true,
        });

        try {
            const state = getState(),
                quantity = getQuantity(),
                select = newSelect ? newSelect : state.pictures.select,
                searchQuery = query ? query : 'hello';
            let response;
            response = await fetch(`${URL}${select}${API_KEY2}&q=${searchQuery}&limit=${quantity}&offset=${state.pictures.next}&rating=G&lang=en&format=json`,
                { credentials: 'same-origin' });
            const json = await response.json(),
                pictures = json && json.data,
                next = json && json.pagination && json.pagination.count;

            if((state.pictures.select===newSelect || !newSelect) && !query) {
                dispatch({
                    type: 'PICTURES_LOADED',
                    pictures,
                    next,
                    number: pictures.length,
                });
            }
            else{
                dispatch({
                    type: 'PICTURES_RELOAD',
                    pictures,
                    next,
                    number: pictures.length,
                    select:newSelect,
                });
            }
        } catch (error) {
            dispatch({
                type: 'PICTURES_LOAD_ERROR',
                error,
            });
        } finally {
            dispatch({
                type: 'PICTURES_LOADING',
                loading: false,
            });
        }
    };
}

function getQuantity() {
    const width = window && window.screen && window.screen.width;
    if (width > 5000)
        return 70;
    else if (width > 3000)
        return 50;
    else if (width > 1000)
        return 40;
    return 24;
}
