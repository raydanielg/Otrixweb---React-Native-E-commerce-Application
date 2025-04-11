import React, { useEffect } from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Platform
} from "react-native";
import {
    OtrixContainer, OtrixHeader, OtrixContent, OtrixDivider, OtrixSocialContainer, OtrixAlert, OtrixLoader
} from '@component';
import { Input, Text, FormControl, Button, InfoOutlineIcon } from "native-base"
import { connect } from 'react-redux';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { GlobalStyles, Colors, isValidEmail, isValidpassword, isValidMobile } from '@helpers'
import Icon from 'react-native-vector-icons/Ionicons';
import { logfunction } from "@helpers/FunctionHelper";
import Fonts from "../helpers/Fonts";
import { bindActionCreators } from 'redux';
import { doLogin } from '@actions';
import getApi from "@apis/getApi";
import Toast from 'react-native-root-toast';
import FBSDK, { LoginManager } from 'react-native-fbsdk';
import auth from '@react-native-firebase/auth';
import { firebase } from '@react-native-firebase/app';
import { CountryPicker } from "react-native-country-codes-picker";
import OTPInputView from '@twotalltotems/react-native-otp-input'

const { AccessToken, GraphRequest, GraphRequestManager } = FBSDK;
import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,//
} from '@react-native-google-signin/google-signin';
import AsyncStorage from "@react-native-community/async-storage";
GoogleSignin.configure({
    webClientId: '12345789-g2folaog0ck90vhbvbooqthq397qvk5p.apps.googleusercontent.com',
    scopes: ['profile', 'email']
});

try {
    if (!firebase.apps.length) {
        firebase.initializeApp({
            apiKey: 'AIzaSyBiWkpoLjN5kZY2cxphsM1v20000000000',
            authDomain: 'otrixcommerce123.firebaseapp.com',
            databaseURL: '',
            projectId: 'otrix-commerce',
            storageBucket: '',
            appId: "1:123123123123:ios:a5e57cfc08ff88df6cb6c4",
            messagingSenderId: '123123123123'
        });
    }
} catch (err) {
    // ignore app already initialized error in snack
    console.log("initializeApp error : ", err)
}

// Firebase references
// Firebase references
// const auth = getAuth();


function LoginScreen(props) {

    const [formData, setData] = React.useState({ email: null, password: null, submited: false, loading: false, type: null, message: null, verificationView: false, navTo: 'HomeScreen', mobileSubmitted: false, });
    const [state, setDatapassword] = React.useState({ secureEntry: true });
    const [errors, setErrors] = React.useState({});
    const { email, password, submited, loading, message, type, navTo, verificationView } = formData;
    const recaptchaVerifier = React.createRef();
    const [confirm, setConfirm] = React.useState(null);
    const [show, setShow] = React.useState(false);
    const [mobileNumber, setMobile] = React.useState(null);
    const [countryCode, setCountryCode] = React.useState('+91');
    const [otpLoading, setOTPLoading] = React.useState(false);
    const [otpp, setOTP] = React.useState(null);

    useEffect(() => {

    }, [
        //   props.navigation.navigate('ProfileScreen')
    ]);

    const validate = () => {

        setData({ ...formData, submited: true })

        if (email == null) {
            logfunction("FIeld ", 'Email is required')
            setErrors({
                ...errors,
                email: 'Email is required'
            });
            return false;
        }
        else if (!isValidEmail(email).success) {
            logfunction("FIeld ", isValidEmail(email).message)
            setErrors({
                ...errors,
                invalidEmail: isValidEmail(email).message
            });
            return false;
        }
        else if (!isValidpassword(password).success) {
            logfunction("FIeld ", isValidpassword(password).message)
            setErrors({
                ...errors,
                password: isValidpassword(password).message
            });
            return false;
        }

        return true;

    }

    const login = () => {
        if (validate()) {
            setData({
                ...formData,
                loading: true
            });

            let sendData = new FormData();
            sendData.append('email', email);
            sendData.append('password', password);
            sendData.append('firebase_token', props.FCM_TOKEN)

            try {
                getApi.postData(
                    'user/login',
                    sendData,
                ).then((response => {
                    logfunction("RESPONSE ", response)
                    if (response.status == 1) {
                        logfunction("RESPONSE ", 'Success')
                        setData({
                            ...formData,
                            email: null,
                            password: null,
                            loading: false
                        });
                    }
                    else {
                        setData({
                            ...formData,
                            type: 'error',
                            message: response.message,
                            loading: false
                        });
                        setTimeout(() => {
                            setData({
                                ...formData,
                                message: null,
                                loading: false
                            })
                        }, 3000);
                    }
                    props.doLogin(response, navTo);
                }));
            } catch (error) {
                logfunction("Error", error)
                setData({
                    ...formData,
                    loading: false
                });
            }
        }
    }

    const validateMobile = () => {

        setData({ ...formData, mobileSubmitted: true })

        if (!isValidMobile(mobileNumber).success) {
            logfunction("FIeld ", isValidMobile(mobileNumber).message)
            setErrors({
                ...errors,
                invalidmobileNumber: isValidMobile(mobileNumber).message
            });
            return false;
        }

        return true;

    }



    const sendOtp = async () => {
        if (validateMobile()) {
            setData({
                ...formData,
                loading: true
            });

            let sendData = new FormData();
            sendData.append('mobileNumber', mobileNumber);
            sendData.append('firebase_token', props.FCM_TOKEN)

            try {
                getApi.postData(
                    'user/checkcustomer',
                    sendData,
                ).then((async response => {
                    logfunction("RESPONSE ", response)
                    if (response.status == 1) {
                        const confirmation = await auth().signInWithPhoneNumber(countryCode + '' + mobileNumber);
                        setConfirm(confirmation);
                        setData({
                            ...formData,
                            loading: false,
                            verificationView: true
                        });
                        //  props.navigation.push("VerifyOTPScreen", { VERIFICATION_DATA: confirmation })
                    }
                    else {
                        setData({
                            ...formData,
                            type: 'error',
                            message: 'Customer not found',
                            loading: false
                        });
                        setTimeout(() => {
                            setData({
                                ...formData,
                                message: null,
                                loading: false
                            })
                            props.navigation.push("RegisterScreen")
                        }, 1000);
                    }
                }));
            } catch (error) {
                logfunction("Error", error)
                setData({
                    ...formData,
                    loading: false
                });
            }

        }
    }

    //facebook login 🧔🏻
    _fbAuth = () => {
        // Attempt a login using the Facebook login dialog asking for default permissions and email.
        LoginManager.logInWithPermissions(['public_profile', 'email']).then(
            (result) => {
                if (result.isCancelled) {
                } else {
                    const responseInfoCallback = async (error, result) => {
                        if (error) {
                            Toast.show('Error fetching data: ' + error.toString(), {
                                duration: 3000,
                                position: Toast.positions.CENTER,
                                shadow: true,
                                animation: true,
                                hideOnPress: true,
                                delay: 0,
                            })
                        } else {
                            logfunction("Facebook response ", result)
                            let email = result.email ? result.email : result.id;
                            let image = result.picture ? result.picture.data.url : '';
                            let sendData = new FormData();
                            sendData.append("email", email)
                            sendData.append("password", result.id)
                            sendData.append("creation", 'F')
                            sendData.append('firebase_token', props.FCM_TOKEN)

                            setData({
                                ...formData,
                                loading: true
                            });

                            //login to our server 🧛🏻‍♀️
                            try {
                                getApi.postData(
                                    'user/socialLogin',
                                    sendData,
                                ).then((response => {
                                    logfunction("Social RESPONSE ", response)
                                    if (response.status == 1) {
                                        logfunction("RESPONSE ", 'Success')
                                        setData({
                                            ...formData,
                                            email: null,
                                            password: null,
                                            loading: false
                                        });
                                        props.doLogin(response, navTo);
                                    }
                                    else {
                                        //navigation part  😎
                                        if (response.new == 1) {
                                            props.navigation.navigate("SocialRegisterScreen", { s_email: email, s_socialID: result.id, s_image: image, s_firstName: result.first_name ? result.first_name : '', s_lastName: result.last_name ? result.last_name : '', s_creation: 'F' });
                                        }
                                        else {
                                            setData({
                                                ...formData,
                                                type: 'error',
                                                message: response.message,
                                                loading: false
                                            });
                                            setTimeout(() => {
                                                setData({
                                                    ...formData,
                                                    message: null,
                                                    loading: false
                                                })
                                            }, 3000);
                                        }

                                    }
                                }));
                            } catch (error) {
                                logfunction("Error", error)
                                setData({
                                    ...formData,
                                    loading: false
                                });
                            }

                        }
                    }
                    // Create a graph request asking for user email and names with a callback to handle the response.
                    const infoRequest = new GraphRequest('/me', {
                        parameters: {
                            fields: {
                                string: 'email,name,first_name,last_name,picture,gender',
                            }
                        }
                    },
                        responseInfoCallback
                    );
                    // Start the graph request.
                    new GraphRequestManager().addRequest(infoRequest).start()
                }
            },
            function (error) {
                alert('Login fail with error: ' + error);
            }
        );
    }


    //google sigin
    _googleAuth = async () => {
        try {
            const userInfo = await GoogleSignin.signIn();
            logfunction("Google response ", userInfo)

            if (userInfo.idToken != '') {

                let email = userInfo.user.email;
                let image = userInfo.user.photo ? userInfo.user.photo : '';
                let sendData = new FormData();
                sendData.append("email", email)
                sendData.append("password", userInfo.user.id)
                sendData.append("creation", 'G')
                sendData.append('firebase_token', props.FCM_TOKEN)
                setData({
                    ...formData,
                    loading: true
                });

                //login to our server 🧛🏻‍♀️
                try {
                    getApi.postData(
                        'user/socialLogin',
                        sendData,
                    ).then((response => {
                        logfunction("Social RESPONSE ", response)
                        if (response.status == 1) {
                            logfunction("RESPONSE ", 'Success')
                            setData({
                                ...formData,
                                email: null,
                                password: null,
                                loading: false
                            });
                            props.doLogin(response, navTo);
                        }
                        else {
                            //navigation part  😎
                            if (response.new == 1) {
                                props.navigation.navigate("SocialRegisterScreen", { s_email: email, s_socialID: userInfo.user.id, s_image: image, s_firstName: userInfo.user.name, s_lastName: '', s_creation: 'G' });
                            }
                            else {
                                setData({
                                    ...formData,
                                    type: 'error',
                                    message: response.message,
                                    loading: false
                                });
                                setTimeout(() => {
                                    setData({
                                        ...formData,
                                        message: null,
                                        loading: false
                                    })
                                }, 3000);
                            }

                        }
                    }));
                } catch (error) {
                    logfunction("Error", error)
                    setData({
                        ...formData,
                        loading: false
                    });
                }

                //  this.setState({
                // socialName: userInfo.user.name,
                // socialEmail: userInfo.user.email,
                // creation_mode: 'G',
                // social_link: userInfo.user.photo,
                //  });
                // const data = new FormData()
                // data.append("email", userInfo.user.name)
                // data.append("name", userInfo.user.email)
                // data.append("fcm_key", this.state.fcmToken)
                // this.props.socialLogin(data, this.state.returnTo, this.state.stringReturn);
            }
        } catch (error) {
            logfunction("Errors ", error)
        }
    }

    const verifyOTP = async (otp) => {
        setOTPLoading(true)
        try {
            await confirm.confirm(otp);
            let sendData = new FormData();
            sendData.append('mobileNumber', mobileNumber)
            getApi.postData(
                'user/loginUsingMobile',
                sendData,
            ).then((response => {
                setOTPLoading(false)

                if (response.status == 1) {
                    props.doLogin(response, navTo);
                }
                else {
                    setData({
                        ...formData,
                        type: 'error',
                        message: response.message,
                        loading: false
                    });
                    setTimeout(() => {
                        setData({
                            ...formData,
                            message: null,
                            loading: false
                        })
                    }, 3000);
                }
            }));
        } catch (error) {
        }

    }

    const { strings } = props;

    return (
        <OtrixContainer>

            {/* Header */}
            <OtrixHeader >
                <TouchableOpacity style={[GlobalStyles.headerLeft, { flex: 0.10 }]} onPress={() => props.navigation.push('MainScreen')}>
                    <OtirxBackButton />
                </TouchableOpacity>
                <View style={[GlobalStyles.headerCenter, { flex: 0.90, justifyContent: 'center', alignContent: 'flex-start' }]}>
                    <View style={GlobalStyles.authHeader}>
                        <Text style={[GlobalStyles.authtabbarText, { lineHeight: hp('5%') }]}>{strings.login.welcome}</Text>
                        {/* <Text style={GlobalStyles.authSubText}>Login with Mobile</Text> */}
                    </View>
                </View>
            </OtrixHeader>
            <OtrixDivider size={'md'} />

            {/* Content Start from here */}
            {
                !verificationView ? <OtrixContent>
                    {/* Login with OTP Start from here */}


                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity
                            onPress={() => setShow(true)}
                            style={{
                                flex: 0.20,
                                height: wp('11%'),
                                backgroundColor: 'white',
                                padding: 5,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <Text style={{
                                color: Colors.black_text,
                                fontSize: wp('4%')
                            }}>
                                {countryCode}
                            </Text>
                        </TouchableOpacity>
                        <FormControl style={{ backgroundColor: Colors().white, flex: 0.80 }} isRequired isInvalid={submited && 'mobileNumber' in errors || 'invalidmobileNumber' in errors}>
                            <Input variant="outline" keyboardType="number-pad" placeholder={strings.commoninput.placeholder_phone} style={GlobalStyles.textInputStyle}
                                onChangeText={(value) => { setMobile(value), delete errors.mobileNumber, delete errors.invalidmobileNumber }}
                            />

                            {
                                'invalidmobileNumber' in errors == false && 'mobileNumber' in errors && <FormControl.ErrorMessage
                                    leftIcon={<InfoOutlineIcon size="xs" />}
                                >
                                    {errors.mobileNumber}
                                </FormControl.ErrorMessage>
                            }
                            {
                                'invalidmobileNumber' in errors && <FormControl.ErrorMessage
                                    leftIcon={<InfoOutlineIcon size="xs" />}
                                >
                                    {errors.invalidmobileNumber}
                                </FormControl.ErrorMessage>
                            }

                        </FormControl>
                    </View>

                    <CountryPicker
                        show={show}
                        // when picker button press you will get the country object with dial code
                        pickerButtonOnPress={(item) => {
                            setCountryCode(item.dial_code);
                            setShow(false);
                        }}
                    />
                    <OtrixDivider size={'sm'} />
                    <OtrixDivider size={'md'} />
                    <Button
                        size="md"
                        variant="solid"
                        bg={Colors().themeColor}
                        style={GlobalStyles.button}
                        isLoading={loading}
                        onPress={() => sendOtp()}
                    >
                        <Text style={GlobalStyles.buttonText}>{strings.login.button_login}</Text>
                    </Button>
                    <OtrixDivider size={'md'} />

                    <OtrixDivider size={'md'} />

                    <View
                        style={styles.divider}>
                        <View
                            style={styles.dividerLine}
                        />
                        <Text
                            style={styles.dividerTxt}>
                            OR
                        </Text>
                    </View>



                    {/* Login Form Start from here */}
                    <Text style={styles.authSubText}>{strings.login.title}</Text>

                    <FormControl isRequired style={{ backgroundColor: Colors().white }} isInvalid={submited && 'email' in errors || 'invalidEmail' in errors}>
                        <Input variant="outline" placeholder={strings.commoninput.placeholder_email} style={[GlobalStyles.textInputStyle]}
                            value={email}
                            onChangeText={(value) => { setData({ ...formData, email: value }), delete errors.email, delete errors.invalidEmail }}
                        />
                        {
                            'invalidEmail' in errors == false && 'email' in errors && <FormControl.ErrorMessage
                                leftIcon={<InfoOutlineIcon size="xs" />}
                            >
                                {errors.email}
                            </FormControl.ErrorMessage>
                        }
                        {
                            'invalidEmail' in errors && <FormControl.ErrorMessage
                                leftIcon={<InfoOutlineIcon size="xs" />}
                            >
                                {errors.invalidEmail}
                            </FormControl.ErrorMessage>
                        }
                    </FormControl>
                    <OtrixDivider size={'sm'} />
                    <FormControl isRequired style={{ backgroundColor: Colors().white }} isInvalid={submited && 'password' in errors}>
                        <Input variant="outline" placeholder={strings.commoninput.placeholder_password} style={[GlobalStyles.textInputStyle]}
                            onChangeText={(value) => { setData({ ...formData, submited: false, password: value }), delete errors.password }}
                            secureTextEntry={state.secureEntry}
                            value={password}
                            InputRightElement={
                                <TouchableOpacity onPress={() => setDatapassword({ ...state, secureEntry: !state.secureEntry })} style={[{ marginRight: wp('3%'), padding: 3 }]}>
                                    <Icon name={state.secureEntry == true ? "eye" : "eye-off"} size={18} color={Colors().secondry_text_color} />
                                </TouchableOpacity>
                            }
                        />
                        <FormControl.ErrorMessage
                            leftIcon={<InfoOutlineIcon size="xs" />}
                        >
                            {errors.password}
                        </FormControl.ErrorMessage>
                    </FormControl>
                    <TouchableOpacity onPress={() => props.navigation.navigate('ForgotPasswordScreen')}>
                        <Text style={styles.forgotPassword}>Forgot Password?</Text>
                    </TouchableOpacity>
                    <OtrixDivider size={'md'} />
                    <Button
                        size="md"
                        variant="solid"
                        bg={Colors().themeColor}
                        style={GlobalStyles.button}
                        isLoading={loading}
                        onPress={() => login()}
                    >
                        <Text style={GlobalStyles.buttonText}>{strings.login.button_login}</Text>
                    </Button>
                    <OtrixDivider size={'md'} />

                    <View style={styles.registerView}>
                        <Text style={styles.registerTxt}>{strings.login.label_registration_info} </Text>
                        <TouchableOpacity onPress={() => props.navigation.navigate('RegisterScreen')}>
                            <Text style={styles.signupTxt}> {strings.login.button_registration} </Text>
                        </TouchableOpacity>
                    </View>
                    <OtrixDivider size={'md'} />

                    {/* Social Container Component */}
                    <OtrixSocialContainer facebookLogin={_fbAuth} googleLogin={_googleAuth} />

                </OtrixContent> : <OtrixContent>

                    <Text style={styles.otpTitle}>Enter OTP</Text>
                    <OtrixDivider size="sm" />
                    <OTPInputView
                        style={{ width: '100%', height: 100, backgroundColor: 'white', paddingHorizontal: 20 }}
                        pinCount={6}

                        // code={this.state.code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
                        autoFocusOnLoad={true}
                        codeInputFieldStyle={styles.underlineStyleBase}
                        codeInputHighlightStyle={styles.underlineStyleHighLighted}
                        placeholderTextColor={Colors().black_text}
                        onCodeFilled={(code => {
                            setOTP(code)
                            verifyOTP(code);
                        })}
                    />
                    <OtrixDivider size={'md'} />
                    <Button
                        size="md"
                        variant="solid"
                        bg={Colors().themeColor}
                        style={GlobalStyles.button}
                        isLoading={otpLoading}
                        onPress={() => verifyOTP()}
                    >
                        <Text style={GlobalStyles.buttonText}>Verify OTP</Text>
                    </Button>
                    {
                        message != null && <OtrixAlert type={type} message={message} />
                    }
                </OtrixContent>
            }

            {
                message != null && <OtrixAlert type={type} message={message} />
            }

        </OtrixContainer >
    )

}

function mapStateToProps(state) {
    return {
        strings: state.mainScreenInit.strings,
        FCM_TOKEN: state.mainScreenInit.firebaseToken
    }
}
const mapDispatchToProps = dispatch => (
    bindActionCreators({
        doLogin
    }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);

const mode = AsyncStorage.getItem('mode');
const styles = StyleSheet.create({
    forgotPassword: {
        fontSize: wp('3%'),
        textAlign: 'right',
        fontFamily: Fonts.Font_Reguler,
        color: mode === 'dark' ? '#000' : Colors().link_color,
        padding: 5
    },
    registerView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    registerTxt: {
        fontSize: wp('3.5%'),
        textAlign: 'center',
        fontFamily: Fonts.Font_Reguler,
        color: mode === 'dark' ? '#000' : Colors().secondry_text_color
    },
    signupTxt: {
        fontSize: wp('3.5%'),
        textAlign: 'right',
        fontFamily: Fonts.Font_Semibold,
        color: Colors().link_color
    },
    divider: {
        justifyContent: 'center',
        flexDirection: 'row',
        marginBottom: wp('2.5%')
    },
    dividerLine: {
        position: 'absolute',
        width: '100%',
        height: wp('0.2%'),
        backgroundColor: Colors().dark_grey,
        alignSelf: 'center',
    },
    dividerTxt: {
        alignSelf: 'center',
        backgroundColor: Colors().light_white,
        paddingHorizontal: wp('3%'),
        fontSize: wp('5.4%'),
        fontFamily: Fonts.Font_Bold,
        color: Colors().black_text,
    },
    authSubText: {
        fontSize: Platform.isPad === true ? wp('3%') : wp('3.5%'),
        fontFamily: Fonts.Font_Reguler,
        color: '#767787',
        marginBottom: wp('2.5%'),
    },
    underlineStyleBase: {
        width: 30,
        height: 45,
        borderWidth: 0,
        borderBottomWidth: 1,
        color: Colors().black_text
    },
    underlineStyleHighLighted: {
        borderColor: Colors().themeColor,
    },
    otpTitle: {
        fontSize: Platform.isPad === true ? wp('3.5%') : wp('4.5%'),
        fontFamily: Fonts.Font_Semibold,
        color: Colors().black_text,
        textAlign: 'center',
        marginBottom: wp('2.5%'),
    }
});