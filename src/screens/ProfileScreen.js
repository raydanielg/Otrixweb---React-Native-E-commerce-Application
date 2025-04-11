import React, { useEffect } from "react";
import {
    View,
    TouchableOpacity,
    Text,
    I18nManager,
    StyleSheet,
    Image
} from "react-native";
import { connect } from 'react-redux';
import {
    OtrixContainer, OtrixContent, OtrixDivider, OtrixAlert
} from '@component';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { GlobalStyles, Colors } from '@helpers';
import { _roundDimensions } from '@helpers/util';
import { doLogout, doDelete, authData } from '@actions';
import { avatarImg } from '@common';
import Fonts from "@helpers/Fonts";
import Icon from 'react-native-vector-icons/FontAwesome5';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { bindActionCreators } from 'redux';
import Toast from 'react-native-root-toast';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import getApi from "@apis/getApi";
import { ASSETS_DIR } from '@env';
import { logfunction } from "@helpers/FunctionHelper";
import AsyncStorage from '@react-native-community/async-storage'
import auth from '@react-native-firebase/auth';
import AwesomeAlert from 'react-native-awesome-alerts';

function ProfileScreen(props) {
    const [state, setState] = React.useState({ profileImage: null, profileImageURL: null, type: 'error', message: null });
    const [showMessage, setShowLoading] = React.useState(false)
    const [showAlert, setAlert] = React.useState(false)
    useEffect(() => {
        let image = null;
        if (props.customerData && props.customerData.image != null) {
            if (props.customerData.creation == null || props.customerData.creation == 'D') {
                image = ASSETS_DIR + 'user/' + props.customerData.image;
            }
            else {
                image = props.customerData.image;
            }
        }
        setState({
            ...state,
            profileImageURL: image
        })
    }, [profileImage]);

    const openImagePicker = async (res) => {
        let mainImage = {
            uri: res.assets[0].uri,
            type: res.assets[0].type,
            name: res.assets[0].fileName
        }

        let sendData = new FormData();

        sendData.append('image', mainImage)
        getApi.postData(
            'user/changeProfilePicture',
            sendData,
            props.AUTH_TOKEN
        ).then((async response => {
            logfunction("RESPONSE ", response)
            if (response.status == 1) {
                setState({
                    ...state,
                    type: 'success',
                    profileImage: res.assets[0]['uri'],
                    profileImageURL: null,
                    message: response.message,
                });
                setShowLoading(true)
                setTimeout(async () => {
                    setShowLoading(false)
                    props.authData(response.data);
                    await AsyncStorage.setItem('CUSTOMER_DATA', JSON.stringify(response.data));
                }, 3000);
            }
            else {
                setState({
                    ...state,
                    type: 'error',
                    message: response.message,
                    loading: false,
                });
                setShowLoading(true)
                setTimeout(() => {
                    setShowLoading(false)
                }, 3000);
            }
        }));
    }

    const deleteAccount = () => {
        getApi.getData(
            "user/deleteAccount",
            props.AUTH_TOKEN
        ).then((response => {

        }))

        props.doDelete()
        Toast.show('Successfully Deleted', {
            duration: 2000,
            position: Toast.positions.CENTER,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
        });
        setAlert(false)
    }

    const { profileImage, profileImageURL, type, message } = state;
    const { strings } = props;

    return (
        <OtrixContainer customStyles={{ backgroundColor: Colors().light_white }}>

            <View style={styles.container} >

                <TouchableOpacity style={styles.imageView}
                    onPress={() => launchImageLibrary(
                        {
                            mediaType: 'photo',
                            includeBase64: false,
                            maxHeight: 400,
                            maxWidth: 400,
                        },
                        (response) => {
                            openImagePicker(response);
                        },
                    )}
                >

                    {profileImage == null && profileImageURL != null && <Image source={{ uri: profileImageURL }} style={styles.image}></Image>}

                    {profileImage != null && profileImageURL == null && <Image source={{ uri: profileImage }} style={styles.image}></Image>}

                    {profileImage == null && profileImageURL == null && <Image source={avatarImg} style={styles.image}></Image>}


                </TouchableOpacity>
                <OtrixDivider size={'sm'} />
                <Text style={styles.username}>{props.customerData && props.customerData.firstname}</Text>
                <Text style={styles.email}>{props.customerData && props.customerData.email}</Text>

            </View>

            {/* Header */}
            <View style={{ flexDirection: 'row', position: 'absolute', marginTop: hp('2%'), zIndex: 99999999 }}>
                <TouchableOpacity style={[GlobalStyles.headerLeft, { zIndex: 999999999, flex: 0.90, alignItems: 'flex-start' }]} onPress={() => props.navigation.goBack()}>
                    <Text style={GlobalStyles.headingTxt}>  {strings.account.title}</Text>
                </TouchableOpacity>
            </View>

            {/* Content Start from here */}
            <OtrixContent customStyles={styles.contentView}>
                <OtrixDivider size={'lg'} />

                <TouchableOpacity style={styles.listView} onPress={() => props.navigation.navigate('EditProfileScreen')}>
                    <View style={[styles.leftSide, { left: wp('1%') }]}>
                        <Icon name="user-edit" style={styles.icon} />
                    </View>
                    <View style={styles.center}>
                        <Text style={styles.listTitle}> {strings.account.label_edit_profile}</Text>
                    </View>
                    <View style={styles.rightSide}>
                        <MatIcon name="arrow-forward-ios" style={[styles.rightIcon, { transform: [{ rotateY: I18nManager.isRTL == true ? '180deg' : '0deg' }] }]} />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.listView} onPress={() => props.navigation.navigate('WishlistScreen')}>
                    <View style={styles.leftSide}>
                        <Fontisto name="heart" style={styles.icon} />
                    </View>
                    <View style={styles.center}>
                        <Text style={styles.listTitle}>{strings.account.label_wishlist}</Text>
                    </View>
                    <View style={styles.rightSide}>
                        <MatIcon name="arrow-forward-ios" style={[styles.rightIcon, { transform: [{ rotateY: I18nManager.isRTL == true ? '180deg' : '0deg' }] }]} />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.listView} onPress={() => props.navigation.navigate('ManageAddressScreen')}>
                    <View style={styles.leftSide}>
                        <Icon name="address-book" style={[styles.icon, { fontSize: wp('5.4%') }]} />
                    </View>
                    <View style={styles.center}>
                        <Text style={styles.listTitle}>{strings.account.label_manage_address}</Text>
                    </View>
                    <View style={styles.rightSide}>
                        <MatIcon name="arrow-forward-ios" style={[styles.rightIcon, { transform: [{ rotateY: I18nManager.isRTL == true ? '180deg' : '0deg' }] }]} />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.listView} onPress={() => props.navigation.navigate('OrderScreen')}>
                    <View style={styles.leftSide}>
                        <Fontisto name="shopping-bag-1" style={[styles.icon, { fontSize: wp('5.4%') }]} />
                    </View>
                    <View style={styles.center}>
                        <Text style={styles.listTitle}>{strings.account.label_order}</Text>
                    </View>
                    <View style={styles.rightSide}>
                        <MatIcon name="arrow-forward-ios" style={[styles.rightIcon, { transform: [{ rotateY: I18nManager.isRTL == true ? '180deg' : '0deg' }] }]} />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.listView} onPress={() => props.navigation.navigate('ChangePasswordScreen')}>
                    <View style={styles.leftSide}>
                        <Fontisto name="locked" style={styles.icon} />
                    </View>
                    <View style={styles.center}>
                        <Text style={styles.listTitle}>{strings.account.label_change_password}</Text>
                    </View>
                    <View style={styles.rightSide}>
                        <MatIcon name="arrow-forward-ios" style={[styles.rightIcon, { transform: [{ rotateY: I18nManager.isRTL == true ? '180deg' : '0deg' }] }]} />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.listView} onPress={() => {

                    props.doLogout(),
                        auth().signOut(),
                        getApi.getData(
                            "user/logout",
                            props.AUTH_TOKEN
                        ).then((response => {
                        })),
                        Toast.show('Successfully Logout', {
                            duration: 2000,
                            position: Toast.positions.CENTER,
                            shadow: true,
                            animation: true,
                            hideOnPress: true,
                            delay: 0,
                        })
                }

                }>
                    <View style={styles.leftSide}>
                        <AntDesign name="logout" style={styles.icon} />
                    </View>
                    <View style={styles.center}>
                        <Text style={styles.listTitle}>{strings.account.label_logout}</Text>
                    </View>
                    <View style={styles.rightSide}>
                        <MatIcon name="arrow-forward-ios" style={[styles.rightIcon, { transform: [{ rotateY: I18nManager.isRTL == true ? '180deg' : '0deg' }] }]} />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.listView} onPress={() => setAlert(true)}>
                    <View style={styles.leftSide}>
                        <MatIcon name="delete" style={styles.icon} />
                    </View>
                    <View style={styles.center}>
                        <Text style={styles.listTitle}>Delete Account</Text>
                    </View>
                    <View style={styles.rightSide}>
                        <MatIcon name="arrow-forward-ios" style={[styles.rightIcon, { transform: [{ rotateY: I18nManager.isRTL == true ? '180deg' : '0deg' }] }]} />
                    </View>
                </TouchableOpacity>


                <AwesomeAlert
                    show={showAlert}
                    showProgress={false}
                    title="Confirm"
                    message="Are you sure you want to delete?"
                    closeOnTouchOutside={true}
                    closeOnHardwareBackPress={false}
                    showCancelButton={true}
                    showConfirmButton={true}
                    cancelText="No, cancel"
                    confirmText="Yes, delete it"
                    confirmButtonColor="#DD6B55"
                    onCancelPressed={() => {
                        setAlert(false)
                    }}
                    onConfirmPressed={() => {
                        setAlert(false)
                        deleteAccount();
                    }}
                />
            </OtrixContent>
            {
                showMessage == true && <OtrixAlert type={type} message={message} />
            }

        </OtrixContainer >
    )
}

function mapStateToProps(state) {
    return {
        cartData: state.cart.cartData,
        customerData: state.auth.USER_DATA,
        strings: state.mainScreenInit.strings,
        AUTH_TOKEN: state.auth.AUTH_TOKEN,

    }
}


const mapDispatchToProps = dispatch => (
    bindActionCreators({
        doLogout,
        doDelete,
        authData
    }, dispatch)
);


export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);

const styles = StyleSheet.create({
    container: {
        height: hp('25%'),
        position: 'relative',
        backgroundColor: Colors().light_white,
        justifyContent: 'flex-end',
        alignItems: 'center',
        zIndex: 99,
        marginBottom: hp('4%')
    },
    imageView: {
        justifyContent: 'center',
        backgroundColor: Colors().white,
        alignItems: 'center',
        borderRadius: wp('0.8%'),
        elevation: 2,
        height: hp('11%'),
        width: wp('23%'),
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 0.2 },
        shadowOpacity: 0.20,
        shadowRadius: 3,
    },
    image: {
        resizeMode: 'contain',
        height: undefined,
        aspectRatio: 1,
        width: wp('20%'),
        alignSelf: 'center'
    },
    username: {
        color: Colors().text_color,
        fontFamily: Fonts.Font_Bold,
        fontSize: wp('4%'),
    },
    email: {
        color: Colors().secondry_text_color,
        fontFamily: Fonts.Font_Regular,
        fontSize: wp('3.5%'),
        marginTop: hp('0.5%')
    },
    contentView: {
        elevation: 2,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 0.2 },
        shadowOpacity: 0.20,
        shadowRadius: 3,
        backgroundColor: Colors().white,
        marginHorizontal: 0,
        borderTopRightRadius: wp('13%'),
        borderTopLeftRadius: wp('13%')
    },
    listView: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: hp('1%')
    },
    leftSide: {
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: wp('2%'),
        flex: 0.10,
    },
    center: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        flex: 0.80,
        padding: 10,
        marginHorizontal: wp('3%')
    },
    rightSide: {
        flex: 0.10
    },
    listTitle: {
        color: Colors().text_color,
        fontFamily: Fonts.Font_Semibold,
        fontSize: wp('3.8%'),
    },
    icon: {
        fontSize: wp('5.5%'),
        color: Colors().secondry_text_color
    },
    rightIcon: {
        fontSize: wp('3.5%'),
        color: Colors().secondry_text_color
    }
});