const URL = 'https://api.giphy.com/v1/gifs/search?api_key=WGzC0bAlkaa4t2YGPIZVnvXfCL5ECfS4&q=cars';
const API_KEY = 'WGzC0bAlkaa4t2YGPIZVnvXfCL5ECfS4';

export default function fetchPictures() {
    return async function (dispatch, getState) {
        dispatch({
            type: 'PICTURES_LOADING',
            loading: true,
        });

        try {
            const state = getState(),
                quantity = getQuantity();
            console.log(state);
            let response;
            response = await fetch(`${URL}api_key=${API_KEY}&q=abstract&limit=${quantity}&offset=${state.pictures.next}&rating=G&lang=en&format=json`,
                { credentials: 'same-origin' });
            const json = await response.json(),
                pictures = json && json.data,
                next = json && json.pagination && json.pagination.count;
            dispatch({
                type: 'PICTURES_LOADED',
                pictures,
                next,
                number: pictures.length,
            });
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
        return 40;
    else if (width > 3000)
        return 30;
    else if (width > 2000)
        return 20;
    return 10;
}
