import { types } from "../Action/actionTypes";
import { logfunction } from "../../helpers/FunctionHelper";

const initialState = {
    loadApplication: false,
    navScreen: ''
}
export default (state = initialState, action) => {
    logfunction("STATE LOG MAIN ====", action.payload)
    switch (action.type) {

        case types.REQUEST_INIT:
            return {
                ...state,
                loadApplication: false
            }
        case "CHANGE_LANGUAGE":
            return {
                ...state,
                strings: action.payload.LANG_DATA,
            }
        case types.SUCCESS_INIT:
            return {
                ...state,
                loadApplication: true,
                navScreen: action.payload.navigateScreen
            }
        case types.STORE_FCM_TOKEN:
            return {
                ...state,
                firebaseToken: action.payload.fcmToken
            }
        case types.SET_THEME:
            return {
                ...state,
                theme: action.payload.theme,
            }
        default:
            return state;
    }
}
