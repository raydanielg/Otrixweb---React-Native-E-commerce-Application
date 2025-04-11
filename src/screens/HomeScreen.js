import React, { useEffect, useState } from "react";
import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
    Image,

} from "react-native";
import { connect } from 'react-redux';
import {
    OtrixHeader, OtrixContainer, OtrixContent, OtrixDivider, HomeSlider, HomeManufacturerView,
    HomeCategoryView, SearchBar, NewProduct, TrendingProduct, BestDeal, DynamicProducts, HomeBanners
} from '@component';

import { HomeSkeleton, ProductSkeleton } from '@skeleton';
import { addToWishList, storeFCM } from '@actions';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Colors, GlobalStyles } from '@helpers';
import { bindActionCreators } from 'redux';
import { Badge, Avatar } from "native-base";
import { heart, offerBanner, avatarImg, avatarImg2 } from '@common';
import Fonts from "@helpers/Fonts";
import { _roundDimensions } from '@helpers/util';
import { _addToWishlist, logfunction } from "@helpers/FunctionHelper";
import getApi from "@apis/getApi";
import { ASSETS_DIR } from "@env";
import AsyncStorage from '@react-native-community/async-storage'
import messaging from '@react-native-firebase/messaging';
import firebase from '@react-native-firebase/app';

function HomeScreen(props) {
    const [state, setState] = React.useState({ homePageData: [], loading: true, profileImageURL: null });
    const [homePageStoredData, setHomeData] = React.useState(null);
    const [imageSimilar, setImageSimilar] = React.useState(false);

    const addToWish = async (id) => {
        let wishlistData = await _addToWishlist(id);
        props.addToWishList(wishlistData, id);
    }

    useEffect(() => {
        async function fetchData() {
            let deviceID = await AsyncStorage.getItem("DEVICEID");
            getApi.getData(
                "checkCache?device_id=" + deviceID,
                [],
            ).then((async response => {
                if (response.status == 1 && response.clearCache) {
                    await AsyncStorage.setItem("GET_UPDATED_DATA", JSON.stringify(true));
                }
            }));
        }
        fetchData();


    }, []);

    useEffect(() => {
        if (!firebase.apps.length) {
            firebase.initializeApp({
                apiKey: 'AIzaSyBiWkpoLjN5kZY2cxphsM1v2wC12345678',
                authDomain: 'otrixcommerce.firebaseapp.com',
                databaseURL: '',
                projectId: 'otrix-commerce',
                storageBucket: '',
                appId: "1:123456789978:ios:a5e57cfc08ff88df6cb6c4",
                messagingSenderId: '1234567897'
            });
        }

        (async () => {
            // await AsyncStorage.removeItem('FCM_TOKEN');
            let getFCMTOKEN = await AsyncStorage.getItem('FCM_TOKEN');
            logfunction("LOCAL FIREBASE TOKEN  ", getFCMTOKEN)
            checkPermission(getFCMTOKEN)
        })();

        messaging()
            .subscribeToTopic('otrixcommercelaravelpromotion')
            .then(() => console.log('Subscribed to topic!'));


        async function fetchData() {

            let getHomepageStoredData = await AsyncStorage.getItem("API_DATA");
            let getLangauge = await AsyncStorage.getItem('Language');

            if (getHomepageStoredData) {
                setHomeData(JSON.parse(getHomepageStoredData));
            }

            let language = 'en';
            if (getLangauge) {
                language = getLangauge;
            }
            getApi.getData(
                "getHomePage?language=" + language + '&reactnativeapp=1',
                [],
            ).then((response => {

                if (response.status == 1) {
                    setImageSimilar(response.data.enable_image_similarity)
                    setState({
                        ...state,
                        homePageData: response.data,
                        loading: false
                    });
                }
            }));
        }

        fetchData();

    }, []);


    const requestUserPermission = async () => {
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
            // console.log('Authorization status:', authStatus);
            return true;
        }
        else {
            return false;
        }
    }

    const checkPermission = async (getFCMTOKEN) => {
        if (!getFCMTOKEN) {
            requestUserPermission().then(async function (granted) {
                if (granted) {
                    let fcmToken = await messaging().getToken();
                    logfunction("FCM TOKEN ", fcmToken)
                    await AsyncStorage.setItem('FCM_TOKEN', fcmToken);
                    props.storeFCM(fcmToken);

                }
            })
        }
        else {
            props.storeFCM(getFCMTOKEN);
        }
    }


    useEffect(() => {
        const dnotification = messaging().onMessage(async remoteMessage => {
            if (remoteMessage) {
                if (remoteMessage?.data?.type == 'prmotional') {
                    storeNotification(remoteMessage?.data)
                }
            }
        });

        //when app closed
        messaging()
            .getInitialNotification()
            .then(async remoteMessage => {
                if (remoteMessage) {

                    if (remoteMessage?.data?.type == 'prmotional') {
                        storeNotification(remoteMessage?.data)
                    }

                    if (remoteMessage?.data?.link) {
                        linkText = remoteMessage?.data?.link.split('-')
                        let type = linkText[0];
                        let id = linkText[1];

                        if (type == 'category') {
                            props.navigation.navigate('ProductListScreen', { type: 'categorybanner', id: id, childerns: [], title: null })
                        }
                        else if (type == 'brand') {
                            props.navigation.navigate('ProductListScreen', { type: 'brandbanner', id: id, childerns: [], title: null })
                        }
                        else if (type == 'product') {
                            props.navigation.navigate('ProductDetailScreen', { id: id })
                        }
                    }

                    let orderID = remoteMessage.notification.body.replace(/[^0-9]/g, '');
                    if (orderID > 0) {
                        //  Alert.alert('A new FCM message arrived!', orderID);
                        props.navigation.navigate('OrderScreen', { orderID: orderID })
                    }
                }

            });

        //when app minimize
        messaging().setBackgroundMessageHandler(async remoteMessage => {
            if (remoteMessage?.data?.type == 'prmotional') {
                storeNotification(remoteMessage?.data)
            }

            if (remoteMessage) {
                if (remoteMessage?.data?.link) {
                    linkText = remoteMessage?.data?.link.split('-')
                    let type = linkText[0];
                    let id = linkText[1];

                    if (type == 'category') {
                        props.navigation.navigate('ProductListScreen', { type: 'categorybanner', id: id, childerns: [], title: null })
                    }
                    else if (type == 'brand') {
                        props.navigation.navigate('ProductListScreen', { type: 'brandbanner', id: id, childerns: [], title: null })
                    }
                    else if (type == 'product') {
                        props.navigation.navigate('ProductDetailScreen', { id: id })
                    }
                }
                let orderID = remoteMessage.notification.body.replace(/[^0-9]/g, '');
                if (orderID > 0) {
                    props.navigation.navigate('OrderDetailScreen', { orderID: orderID })
                }
            }
        });

        return dnotification;
    }, []);


    //store notificaiton
    const storeNotification = async (data) => {
        let getNotificationsArr = await AsyncStorage.getItem("NOTIFICATIONS_ARR");

        let storeNotification = [];
        if (getNotificationsArr) {
            getNotificationsArr = JSON.parse(getNotificationsArr);
            getNotificationsArr.push({
                title: data.bodytitle,
                body: data.body,
                image: data.image,
                link: data.link
            });
            storeNotification = getNotificationsArr;
        }
        else {
            storeNotification = [{
                title: data.bodytitle,
                body: data.body,
                image: data.image,
                link: data.link
            }];
        }

        await AsyncStorage.setItem("NOTIFICATIONS_ARR", JSON.stringify(storeNotification));
    }

    //render cat wise product
    const renderCategoryWiseProduct = (data, i) => {
        if (homePageData.categoryWiseProduct[data].length > 0) {
            return <DynamicProducts key={i} current={i} title={data} navigation={props.navigation} strings={strings} wishlistArr={wishlistData} data={homePageData.categoryWiseProduct[data]} arr={homePageData.categoryWiseProduct[data]} addToWishlist={addToWish} userAuth={props.USER_AUTH} catID={homePageData.categoryWiseProduct[data][0]?.category_id} />
        }
    }

    const { homePageData, loading } = state;
    const { USER_AUTH, wishlistData, customerData, wishlistCount, strings } = props;
    logfunction("profile Image ", customerData)
    logfunction("wishlistData wishlistData ", wishlistData)


    return (

        <OtrixContainer customStyles={{ backgroundColor: Colors().white }}>

            {/* Header */}
            <OtrixHeader customStyles={{ backgroundColor: Colors().white }}>
                <TouchableOpacity style={styles.headerLeft} onPress={() => props.navigation.navigate('ProfileScreen')}>
                    {
                        USER_AUTH ? customerData.creation == 'D' ?
                            customerData.image != null ?
                                <Image
                                    style={styles.avatarImg}
                                    source={{
                                        uri: ASSETS_DIR + 'user/' + customerData.image
                                    }}>
                                </Image>
                                : <Image
                                    ml="3"
                                    size="sm"
                                    style={styles.avatarImg}
                                    source={avatarImg}
                                >
                                </Image>
                            : <Image
                                style={styles.avatarImg}
                                source={{
                                    uri: customerData.image
                                }}>
                            </Image>
                            : <Image
                                ml="3"
                                size="sm"
                                style={styles.avatarImg}
                                source={avatarImg2}
                            >
                            </Image>
                    }
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Text style={styles.headingTxt}>Otrixweb</Text>
                </View>
                {
                    loading && <View style={{ flex: 0.10 }} />
                }

                {
                    !loading &&
                    <TouchableOpacity style={styles.headerRight} onPress={() => { USER_AUTH ? props.navigation.navigate('WishlistScreen') : props.navigation.navigate('LoginScreen') }}>
                        <Image source={heart} style={styles.heartIcon}></Image>
                        {
                            wishlistCount > 0 &&
                            <Badge style={[GlobalStyles.badge, {
                                height: wishlistCount > 9 ? _roundDimensions()._height * 0.038 : _roundDimensions()._height * 0.032,
                                width: wishlistCount > 9 ? _roundDimensions()._height * 0.038 : _roundDimensions()._height * 0.032,
                                borderRadius: _roundDimensions()._borderRadius,
                                right: wishlistCount > 9 ? -wp('0.6%') : wp('0.2%'),
                                top: wishlistCount > 9 ? -hp('0.5%') : hp('0.1%')
                            }]}>

                                <Text style={[GlobalStyles.badgeText, styles.countText, { fontSize: wishlistCount > 9 ? wp('2.2%') : wp('3%') }]}>{wishlistCount}</Text>
                            </Badge>
                        }

                    </TouchableOpacity>
                }


            </OtrixHeader>

            <OtrixContent>
                {
                    homePageStoredData ? <>
                        {/* SearchBar Component */}
                        <SearchBar navigation={props.navigation} strings={strings} enable={imageSimilar} />

                        {/* HomeCategoryView Component */}
                        <HomeCategoryView navigation={props.navigation} data={homePageStoredData.categories} strings={strings} />

                        {/* HomeSlider Component */}
                        <HomeSlider data={homePageStoredData.homepageSlider} navigation={props.navigation} />
                        <OtrixDivider size={'md'} />

                        {/* NewProduct Component */}
                        <NewProduct navigation={props.navigation} strings={strings} wishlistArr={wishlistData} data={homePageStoredData.newProducts.length > 0 ? homePageStoredData.newProducts.slice(0, 4) : []} arr={homePageStoredData.newProducts} addToWishlist={addToWish} userAuth={props.USER_AUTH} />

                        {/* Homepage banners */}
                        {
                            homePageStoredData.banners?.images.length > 0 && homePageStoredData.banners?.images[0] &&
                            <HomeBanners navigation={props.navigation} image={homePageStoredData.banners?.images[0].image} link={homePageStoredData.banners?.images[0]} />
                        }

                        {/* BestDeal Component */}
                        <BestDeal navigation={props.navigation} strings={strings} data={homePageStoredData.dodProducts.length > 0 ? homePageStoredData.dodProducts.slice(0, 4) : []} arr={homePageStoredData.dodProducts} wishlistArr={wishlistData} addToWishlist={addToWish} userAuth={props.USER_AUTH} />
                        <OtrixDivider size={'sm'} />
                        {/* Homepage banners */}
                        {
                            homePageStoredData.banners?.images.length > 0 && homePageStoredData.banners?.images[1] &&
                            <HomeBanners navigation={props.navigation} image={homePageStoredData.banners?.images[1].image} link={homePageStoredData.banners?.images[1]} />
                        }
                    </> : <View style={{ flex: 1 }}>
                        <HomeSkeleton />
                    </View>
                }

                <OtrixDivider size={'sm'} />
                {
                    loading ? <ProductSkeleton /> : <>
                        {/* TrendingProduct Component */}
                        <TrendingProduct navigation={props.navigation} strings={strings} data={homePageData.trendingProducts.length > 0 ? homePageData.trendingProducts.slice(0, 4) : []} arr={homePageData.trendingProducts} wishlistArr={wishlistData} addToWishlist={addToWish} userAuth={props.USER_AUTH} />
                        {
                            homePageStoredData.banners?.images.length > 0 && homePageStoredData.banners?.images[2] &&
                            <HomeBanners navigation={props.navigation} image={homePageStoredData.banners?.images[2].image} link={homePageStoredData.banners?.images[2]} />
                        }
                        {Object.keys(homePageData.categoryWiseProduct).length > 0 && Object.keys(homePageData.categoryWiseProduct).map((item, index) => {
                            return renderCategoryWiseProduct(item, index);
                        })}
                        {
                            homePageStoredData.banners?.images.length > 0 && homePageStoredData.banners?.images[3] &&
                            <HomeBanners navigation={props.navigation} image={homePageStoredData.banners?.images[3].image} link={homePageStoredData.banners?.images[3]} />
                        }
                        {/* HomeManufacturerView Component */}
                        <HomeManufacturerView strings={strings} navigation={props.navigation} data={homePageStoredData.manufacturers} />

                    </>
                }
            </OtrixContent>

        </OtrixContainer >
    )
}

function mapStateToProps(state) {
    return {
        USER_AUTH: state.auth.USER_AUTH,
        wishlistData: state.wishlist.wishlistData,
        wishlistCount: state.wishlist.wishlistCount,
        customerData: state.auth.USER_DATA,
        strings: state.mainScreenInit.strings
    }
}

const mapDispatchToProps = dispatch => (
    bindActionCreators({
        addToWishList,
        storeFCM
    }, dispatch)
);


export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);

const styles = StyleSheet.create({
    headerRight: {
        flex: 0.15,
        marginRight: wp('2%'),
        justifyContent: 'center',
        alignItems: 'center',
    },
    heartIcon: {
        width: wp('6.5%'),
        height: hp('6.5%'),
        resizeMode: 'contain',
        tintColor: Colors().custom_pink,
    },
    headerCenter: {
        flex: 0.75,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headingTxt: {
        fontFamily: Fonts.Font_Bold,
        fontSize: wp('6.5%'),
        color: Colors().themeColor
    },
    headerLeft: {
        flex: 0.15,
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    },
    bannerStyle: {
        resizeMode: 'contain',
        width: wp('100%'),
        height: hp('16%'),
        alignSelf: 'center'
    },
    avatarImg: {
        height: _roundDimensions()._height * 0.055,
        width: _roundDimensions()._height * 0.055,
        borderRadius: _roundDimensions()._borderRadius,
        marginLeft: wp('3%')
    }
});