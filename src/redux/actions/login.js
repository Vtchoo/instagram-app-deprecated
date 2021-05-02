export function login(user, token) {
    return{
        type: 'LOGIN',
        info: user,
        token,
    }
}