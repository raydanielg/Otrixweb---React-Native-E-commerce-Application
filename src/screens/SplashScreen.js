import React, { useEffect } from "react";
import {
    View,
    Animated,

    Easing,
    I18nManager,
    LogBox,
    Platform
} from "react-native";
import { requestInit } from '@actions';
import { splashlogo } from '@common';
import { OtrixContainer } from '@component';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Colors } from '@helpers'
import getApi from "@apis/getApi";
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from "@react-native-community/async-storage";
import moment from "moment";

const animatedValue = new Animated.Value(0);

function SplashScreen(props) {

    const navigateToMain = () => {
        //let navTo = setTimeout(() => props.loadApplication &&
        let navTo = setTimeout(() => props.loadApplication &&
            props.navigation.reset({
                index: 0,
                routes: [{ name: props.navScreen }]
            }), 300)

        // return () => {
        //     clearTimeout(navTo);
        // };
    }

    useEffect(() => {
        LogBox.ignoreLogs(['Animated: `useNativeDriver`']);

        Animated.timing(animatedValue, {
            toValue: 1,
            duration: 1000,
            easing: Easing.ease,
            useNativeDriver: true, // Add this line
        }).start();

        async function fetchData() {
            // You can await here

            let getLangauge = await AsyncStorage.getItem('Language');

            let language = 'en';
            if (getLangauge) {
                language = getLangauge;
            }

            //device id 
            let deviceID = await DeviceInfo.getUniqueId();
            let deviceType = Platform.OS;
            await AsyncStorage.setItem("DEVICEID", deviceID)
            let getNewData = await AsyncStorage.getItem("GET_UPDATED_DATA");
            let callAPI = false;

            if (getNewData) {
                getNewData = JSON.parse(getNewData)
                if (getNewData == 1) {
                    callAPI = true;
                }
            }
            else if (getNewData == null) {
                callAPI = true;
            }
            else {
                callAPI = false;
            }

            //7 DAYS SETTING TO REFESH AUTOMATIC API
            let lastRequest = await AsyncStorage.getItem("LAST_REQUEST")
            lastRequest = JSON.parse(lastRequest)
            let currentDateTime = moment().format();

            if (callAPI == true || (lastRequest == null || currentDateTime > lastRequest)) {
                getApi.getData(
                    "getHomePageInit?language=" + language + '&device_id=' + deviceID + '&deviceType=' + deviceType,
                    [],
                ).then((async response => {
                    if (response.status == 1) {
                        //new api call after 7 days 
                        let momentStoreExpire = moment().add(24 * 7, 'hours').format();
                        await AsyncStorage.setItem("LAST_REQUEST", JSON.stringify(momentStoreExpire));
                        await AsyncStorage.setItem('API_DATA', JSON.stringify(response.data))
                        await AsyncStorage.setItem("GET_UPDATED_DATA", JSON.stringify(false));
                        getApi.getData(
                            "setCacheFalse?device_id=" + deviceID,
                            [],
                        ).then((async response => {
                            props.requestInit();
                        }));
                    }
                }));
            }
            else {
                let loadApp = setTimeout(() => props.requestInit(), 500);
                return () => {
                    clearTimeout(loadApp);
                };
            }
        }
        fetchData();

    }, [

        navigateToMain()

    ]);


    return (
        <OtrixContainer>
            <View style={{ backgroundColor: Colors().white, flex: 1 }}>
                <Animated.Image source={splashlogo} resizeMode='contain' style={{
                    position: 'absolute',
                    left: I18nManager.isRTL == true ? wp('55%') : wp('35%'),
                    top: hp('20%'),
                    height: hp('10%'),
                    width: wp('10%'),
                    alignContent: 'center',
                    transform: [
                        {
                            translateX: animatedValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, 32]
                            })
                        },
                        {
                            translateY: animatedValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, 150]
                            })
                        },
                        {
                            scaleX: animatedValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: [1, 8]
                            })
                        },
                        {
                            scaleY: animatedValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: [1, 10]
                            })
                        }
                    ]
                }}

                />
            </View>
        </OtrixContainer >
    )
}

const mapStateToProps = (state) => ({
    loadApplication: state.mainScreenInit.loadApplication,
    navScreen: state.mainScreenInit.navScreen
});

const mapDispatchToProps = dispatch => (
    bindActionCreators({
        requestInit,
    }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen);