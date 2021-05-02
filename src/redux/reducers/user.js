export default function user(state = [], action ){

    switch (action.type){
        case 'LOGIN':
            //return [...state, { IDsessao: action.IDsessao, usuario: action.usuario }]
            return { token: action.token, info: action.info }
            //return {...action}
        default:
            return state
    }
}