const DEFAULT_PICTURES = [];

const pictures = (state, action) => {
    if (!state)
        return {
            pictures: DEFAULT_PICTURES,
            next: 1,
            loading: true,
            preview_mode: false,
            preview_image: null,
            number: 0,
        };

    switch (action.type) {
        case 'PICTURES_LOADING':
            return {
                ...state,
                loading: action.loading
            };
        case 'PICTURES_LOADED':
            return {
                ...state,
                pictures: state.pictures.concat(action.pictures),
                next: action.next + state.next,
                number: state.number + action.number,
            };
        case 'PICTURES_LOAD_ERROR':
            return {
                ...state,
                error: action.error
            };
        default:
            return state;
    }
};

export default pictures;

