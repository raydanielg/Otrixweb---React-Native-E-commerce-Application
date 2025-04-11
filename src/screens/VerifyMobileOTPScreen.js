import React from "react";
import {
    StyleSheet,
} from "react-native";
import {
    OtrixContainer, OtrixHeader, OtrixContent, OtrixDivider, OtrixAlert
} from '@component';
import { Input, Text, FormControl, Button, InfoOutlineIcon } from "native-base"
import { connect } from 'react-redux';
import { GlobalStyles, Colors } from '@helpers'
import OTPInputView from '@twotalltotems/react-native-otp-input'
import { logfunction } from "@helpers/FunctionHelper";
import getApi from "@apis/getApi";

function VerifyMobileOTPScreen(props) {
    const [formData, setData] = React.useState({ submited: false, loading: false, type: null, message: null });
    const [errors, setErrors] = React.useState({});
    const { loading, submited, message, type } = formData;
    const { email } = props.route.params;


    const verifyOTP = (otp) => {
        setData({
            ...formData,
            loading: true
        });

        let sendData = new FormData();
        sendData.append('otp', otp);
        sendData.append('email', email);
        try {
            getApi.postData(
                'user/verifyOTP',
                sendData,
            ).then((response => {
                logfunction("RESPONSE ", response)
                if (response.status == 1) {
                    logfunction("RESPONSE ", 'Success')
                    setData({
                        ...formData,
                        otp: null,
                        loading: false
                    });
                    props.navigation.push('ResetPasswordScreen', { token: response.otpToken, email: email });
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
            logfunction("Error", error)
            setData({
                ...formData,
                loading: false
            });
        }

    }

    return (
        <OtrixContainer>

            {/* Header */}
            <OtrixHeader customStyles={GlobalStyles.authHeader}>
                <Text style={[GlobalStyles.authtabbarText]}>Verify OTP</Text>
                <Text style={GlobalStyles.authSubText}>We send you otp on your email address!</Text>
            </OtrixHeader>
            <OtrixDivider size={'md'} />

            {/* Content Start from here */}
            <OtrixContent>


                <OTPInputView
                    style={{ width: '100%', height: 100, backgroundColor: 'white', paddingHorizontal: 20 }}
                    pinCount={6}
                    // code={this.state.code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
                    autoFocusOnLoad={true}
                    codeInputFieldStyle={styles.underlineStyleBase}
                    onCodeFilled={(code => {
                        verifyOTP(code)
                    })}
                />


                <OtrixDivider size={'md'} />
                <Button
                    size="md"
                    variant="solid"
                    bg={Colors().themeColor}
                    style={GlobalStyles.button}
                    isLoading={loading}
                    onPress={() => verifyOTP()}
                >
                    <Text style={GlobalStyles.buttonText}>Verify OTP</Text>
                </Button>
                {
                    message != null && <OtrixAlert type={type} message={message} />
                }
            </OtrixContent>

        </OtrixContainer >
    )

}

function mapStateToProps(state) {
    return {
        strings: state.mainScreenInit.strings
    }
}

export default connect(mapStateToProps)(VerifyMobileOTPScreen);

const styles = StyleSheet.create({
    underlineStyleBase: {
        width: 50,
        height: 45,
        borderWidth: 0,
        borderBottomWidth: 1,
        color: Colors().black,
        backgroundColor: Colors().light_white
    },
    underlineStyleHighLighted: {
        borderColor: Colors().dark_gray_text,
    },

});