import React from "react";
import {
    View,
    TouchableOpacity
} from "react-native";
import {
    OtrixContainer, OtrixHeader, OtrixContent, OtrixDivider
} from '@component';
import { Input, Text, FormControl, Button, InfoOutlineIcon } from "native-base"
import { connect } from 'react-redux';
import { GlobalStyles, isValidEmail, Colors } from '@helpers'
import { logfunction } from "@helpers/FunctionHelper";
import getApi from "@apis/getApi";

function ForgotPasswordScreen(props) {
    const [formData, setData] = React.useState({ email: null, submited: false, loading: false, type: null, message: null });
    const [errors, setErrors] = React.useState({});
    const { email, loading, submited, message, type } = formData;
    const { strings } = props;
    const validate = () => {

        setData({ ...formData, submited: true })

        if (!isValidEmail(email).success) {
            logfunction("FIeld ", isValidEmail(email).message)
            setErrors({
                ...errors,
                invalidEmail: isValidEmail(email).message
            });
            return false;
        }

        return true;

    }

    const submit = () => {
        if (validate()) {
            setData({
                ...formData,
                loading: true
            });

            let sendData = new FormData();
            sendData.append('email', email);
            try {
                getApi.postData(
                    'user/forgotPassword',
                    sendData,
                ).then((response => {
                    logfunction("RESPONSE ", response)
                    if (response.status == 1) {
                        logfunction("RESPONSE ", 'Success')
                        setData({
                            ...formData,
                            email: null,
                            loading: false
                        });
                        props.navigation.push('VerifyOTPScreen', { email: email });
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
    }

    return (
        <OtrixContainer>

            {/* Header */}
            <OtrixHeader >
                <TouchableOpacity style={[GlobalStyles.headerLeft,{flex:0.05}]} onPress={() => props.navigation.goBack()}>
                    <OtirxBackButton />
                </TouchableOpacity>
                <View style={[GlobalStyles.headerCenter, { flex: 0.95,justifyContent:'center',alignItems:'flex-start' }]}>
                    <View style={GlobalStyles.authHeader}>
                      <Text style={[GlobalStyles.authtabbarText]}>Forgot Password</Text>
                      <Text style={GlobalStyles.authSubText}>Submit the email you signed up with to reset your password</Text>
                    </View>
                </View>
            </OtrixHeader>
            <OtrixDivider size={'md'} />

            {/* Content Start from here */}
            <OtrixContent>

                {/* Forgot password form Start from here */}
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
                <OtrixDivider size={'md'} />
                <Button
                    size="md"
                    variant="solid"
                    bg={Colors().themeColor}
                    style={GlobalStyles.button}
                    isLoading={loading}
                    onPress={() => submit()}
                >
                    <Text style={GlobalStyles.buttonText}>Submit</Text>
                </Button>
                <OtrixDivider size={'md'} />
                <Button
                    size="md"
                    variant="outline"
                    onPress={() => props.navigation.navigate('LoginScreen')}
                >
                    <Text style={[GlobalStyles.buttonText, { color: Colors().black }]}>Back to login</Text>
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

export default connect(mapStateToProps)(ForgotPasswordScreen);
