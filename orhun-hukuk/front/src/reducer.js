const initialState = {
    fetching: false,
    user_id:   "",
    info_list: [],
    user_list: [],
}

export default (state = initialState, action) => {
    switch(action.type) {
        case "RECEIVE_USER":
            return Object.assign({}, state, {
                fetching: false,
                user_id: action.user_id
            });
        case "RECEIVE_USER_LIST":
            return Object.assign({}, state, {
                user_list: action.payload
            });
        case "RECEIVE_INFO_LIST":
            return Object.assign({},state, {
                info_list: action.payload
            });
        case "REQUEST_USER":
            return Object.assign({}, state, {
                fetching: true
            });
        default:
            return state;
    }
}