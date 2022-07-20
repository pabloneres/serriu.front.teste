export const actions = {
    logout: () => ({ type: 'LOGOUT' }),
    jwt: () => ({ type: 'JWT' }),
};

const inicial = {
    token: "",
    user: ""
}

export default function user(state = inicial, action) {
    switch (action.type) {
        case "JWT":
            return '';
        case "LOGIN":
            return { ...state, token: action.payload };
        case "USER":
            return { ...state, user: action.payload }
        case "LOGOUT":
            localStorage.clear()
            return state = {
                user: null,
                token: null,
            }
        default:
            return state;
    }
}
