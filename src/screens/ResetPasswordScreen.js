import React, { useEffect } from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity
} from "react-native";
import {
    OtrixContainer, OtrixHeader, OtrixContent, OtirxBackButton, OtrixDivider, OtrixAlert, OtrixLoader
} from '@component';
import { Input, Text, FormControl, Button, InfoOutlineIcon } from "native-base"
import { connect } from 'react-redux';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { GlobalStyles, Colors, isValidpassword, isValidConfirmPassword } from '@helpers'
import Icon from 'react-native-vector-icons/Ionicons';
import Fonts from "../helpers/Fonts";
import { logfunction } from "@helpers/FunctionHelper";
import getApi from "@apis/getApi";

function ResetPasswordScreen(props) {
    const [formData, setData] = React.useState({ old_password: '', new_password: '', confirm_password: '', submited: false, loading: false, message: null, type: 'error' });
    const [state, setDatapassword] = React.useState({ secureEntry: true, secureEntry2: true, secureEntry3: true });
    const [errors, setErrors] = React.useState({});
    const [showMessage, setShowLoading] = React.useState(false)
    const { token, email } = props.route.params;

    const { secureEntry, secureEntry2, secureEntry3 } = state;
    const { old_password, new_password, confirm_password, submited, loading, type, message } = formData;

    const validate = () => {
        setData({ ...formData, submited: true })

        if (!isValidpassword(new_password).success) {
            logfunction("FIeld ", isValidpassword(new_password).message)
            setErrors({
                ...errors,
                new_password: isValidpassword(new_password).message
            });
            return false;
        }
        else if (!isValidConfirmPassword(new_password, confirm_password).success) {
            logfunction("FIeld ", isValidConfirmPassword(new_password).message)
            setErrors({
                ...errors,
                confirm_password: isValidConfirmPassword(new_password, confirm_password).message
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
            })

            let sendData = new FormData();
            sendData.append('new_password', new_password);
            sendData.append('otpToken', token)
            sendData.append('email', email)

            try {
                getApi.postData(
                    'user/resetPassword',
                    sendData,
                ).then((response => {
                    logfunction("RESPONSE ", response)
                    if (response.status == 1) {
                        setData({
                            ...formData,
                            loading: false,
                            message: response.message,
                            type: 'success',
                            old_password: null,
                            new_password: null,
                            confirm_password: null
                        });
                        setShowLoading(true)
                        setTimeout(() => {
                            setShowLoading(false)
                        }, 1500);
                    }
                    else {
                        setData({
                            ...formData,
                            type: 'error',
                            message: response.message,
                            loading: false
                        });
                        setShowLoading(true)
                        setTimeout(() => {
                            setShowLoading(false)
                        }, 3000);
                    }
                }));
            } catch (error) {
                logfunction("Error", error)
                setData({
                    ...state,
                    loading: false
                })
            }

        }
    }

    const { strings } = props;

    return (
        <OtrixContainer>

            {/* Header */}
            <OtrixHeader customStyles={{ backgroundColor: Colors().light_white }}>
                <TouchableOpacity style={GlobalStyles.headerLeft} onPress={() => props.navigation.goBack()}>
                    <OtirxBackButton />
                </TouchableOpacity>
                <View style={[GlobalStyles.headerCenter, { flex: 1 }]}>
                    <Text style={[GlobalStyles.headingTxt, { lineHeight: hp('4%') }]}>  Reset Password</Text>
                </View>
            </OtrixHeader>
            <OtrixDivider size={'md'} />
            {/* Content Start from here */}

            <OtrixContent>

                <FormControl isRequired isInvalid={submited && 'new_password' in errors} style={{ backgroundColor: Colors().white }}>
                    <Input variant="outline" placeholder={strings.reset_password.placeholder_new_password} style={[GlobalStyles.textInputStyle,]}
                        onChangeText={(value) => setData({ ...formData, new_password: value })}
                        secureTextEntry={secureEntry2}
                        value={new_password}
                        InputRightElement={
                            <TouchableOpacity onPress={() => { setDatapassword({ ...state, secureEntry2: !state.secureEntry2 }), delete errors.new_password }} style={[{ marginRight: wp('3%') }]}>
                                <Icon name={state.secureEntry2 == true ? "eye" : "eye-off"} size={18} color={Colors().secondry_text_color} />
                            </TouchableOpacity>
                        }
                    />
                    <FormControl.ErrorMessage
                        leftIcon={<InfoOutlineIcon size="xs" />}
                    >
                        {errors.new_password}
                    </FormControl.ErrorMessage>
                </FormControl>
                <OtrixDivider size={'md'} />

                <FormControl isRequired isInvalid={submited && 'confirm_password' in errors} style={{ backgroundColor: Colors().white }}>
                    <Input variant="outline" placeholder={strings.reset_password.placeholder_confirm_password} style={[GlobalStyles.textInputStyle,]}
                        onChangeText={(value) => { setData({ ...formData, confirm_password: value }), delete errors.confirm_password }}
                        secureTextEntry={secureEntry3}
                        value={confirm_password}
                        InputRightElement={
                            <TouchableOpacity onPress={() => setDatapassword({ ...state, secureEntry3: !state.secureEntry3 })} style={[{ marginRight: wp('3%') }]}>
                                <Icon name={state.secureEntry3 == true ? "eye" : "eye-off"} size={18} color={Colors().secondry_text_color} />
                            </TouchableOpacity>
                        }
                    />
                    <FormControl.ErrorMessage
                        leftIcon={<InfoOutlineIcon size="xs" />}
                    >
                        {errors.confirm_password}
                    </FormControl.ErrorMessage>
                </FormControl>

                <OtrixDivider size={'md'} />
                <Button
                    isLoading={loading}
                    size="md"
                    variant="solid"
                    bg={Colors().themeColor}
                    style={GlobalStyles.button}
                    onPress={() => submit()}
                >
                    <Text style={GlobalStyles.buttonText}>{strings.reset_password.button_reset}</Text>
                </Button>
                <OtrixDivider size={'md'} />
                <Button
                    size="md"
                    variant="outline"
                    onPress={() => props.navigation.navigate('LoginScreen')}
                >
                    <Text style={[GlobalStyles.buttonText, { color: Colors().black }]}>Back to login</Text>
                </Button>
            </OtrixContent>
            {
                showMessage == true && <OtrixAlert type={type} message={message} />
            }
        </OtrixContainer >
    )

}

function mapStateToProps(state) {
    return {
        strings: state.mainScreenInit.strings
    }
}


export default connect(mapStateToProps)(ResetPasswordScreen);

const styles = StyleSheet.create({

});