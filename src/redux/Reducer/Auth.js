import { types } from "../Action/actionTypes";
import { logfunction } from "../../helpers/FunctionHelper";

const initialState = {
    USER_AUTH: false
}

export default (state = initialState, action) => {
    const { payload } = action;
    logfunction("PAYLOAD IN REDUCER AUTH", payload)
    logfunction("PAYLOAD IN TYPE AUTH", action.type)

    switch (action.type) {
        case types.AUTH_STATUS:
            return {
                ...state,
                USER_AUTH: payload.status,
                AUTH_TOKEN: payload?.token
            }
        case types.AUTH_DATA:
            return {
                ...state,
                USER_DATA: payload.customerData
            }
        default:
            return state;
    }
}
