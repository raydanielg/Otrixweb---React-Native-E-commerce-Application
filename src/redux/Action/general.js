import { types } from "./actionTypes";
import AsyncStorage from '@react-native-community/async-storage'
import { logfunction } from "../../helpers/FunctionHelper";

export function requestInit(user) {
    return {
        type: types.REQUEST_INIT,
        payload: {
            userAuth: user != null ? 1 : 0,
        }
    };
}

export function successInt(navigateScreen) {
    return {
        type: types.SUCCESS_INIT,
        payload: {
            navigateScreen
        }
    };
}

export function addToCart(quantity) {
    return {
        type: types.ADD_TO_CART,
        payload: {
            quantity
        }
    };
}

export function addToWishList(data, id) {
    return {
        type: types.ADD_TO_WISHLIST,
        payload: {
            data,
            id
        }
    };
}

export function addRemoveWishlist(product_id, token) {

    return {
        type: types.WISHLIST_ADD_REMOVE,
        payload: {
            product_id,
            token
        }
    };
}

export function successCart(data) {
    return {
        type: types.SUCCESS_CART,
        payload: {
            cartData: data
        }
    };
}

export function successWishlist(data) {
    return {
        type: types.SUCCESS_WISHLIST,
        payload: {
            wishlistData: data
        }
    };
}


export function removeFromCart(quantity) {
    return {
        type: types.REMOVE_CART,
        payload: {
            quantity
        }
    };
}


export function decrementQuantity(quantity) {
    return {
        type: types.DEREMENT_QUANTITY,
        payload: {
            quantity
        }
    };
}


export function incrementQuantity(quantity) {
    return {
        type: types.INCREMENT_QUANTITY,
        payload: {
            quantity
        }
    };
}

export function proceedCheckout() {
    return {
        type: types.PROCEED_CHECKOUT,
        payload: {

        }
    };
}

export function successCheckout() {
    return {
        type: types.SUCCESS_CHECKOUT,
        payload: {
        }
    };
}

export function authStatus(status, token) {
    logfunction("PAYLOAD IN authStatus AUTH", status)

    return {
        type: types.AUTH_STATUS,
        payload: {
            status: status,
            token: token
        }
    }
}

export function authData(data) {
    logfunction("PAYLOAD IN  AUTH DATA", data)

    return {
        type: types.AUTH_DATA,
        payload: {
            customerData: data
        }
    }
}


export function doLogin(data, navigateTo) {
    return {
        type: types.DO_LOGIN,
        payload: {
            data,
            navigateTo
        }
    }
}

export function doLogout() {
    return {
        type: types.DO_LOGOUT,
        payload: {

        }
    }
}
export function storeFCM(fcmToken) {
    return {
        type: types.STORE_FCM_TOKEN,
        payload: {
            fcmToken
        }
    }
}