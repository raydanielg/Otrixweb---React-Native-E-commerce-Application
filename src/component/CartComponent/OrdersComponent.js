import React from 'react';
import { View, StyleSheet, Text, Platform, Modal, I18nManager, Image, Pressable } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { OtrixDivider } from '@component';
import Fonts from '@helpers/Fonts';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { GlobalStyles, Colors } from '@helpers';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FastImage from 'react-native-fast-image';
import { ASSETS_DIR, CURRENCY } from '@env';
import moment from 'moment';
import { close } from '@common';
import { _roundDimensions } from '@helpers/util';
import { numberWithComma } from '@helpers/FunctionHelper';

function OrdersComponent(props) {
    const [buyAgainPop, setBuyAgain] = React.useState(false);

    let item = props.orders;
    const { strings } = props;

    const buyAgain = () => {

        if (item.products.length > 1) {
            setBuyAgain(true)
        }
        else {
            props.navigation.navigate('ProductDetailScreen', { id: item.products[0].product_id, orderData: item });
        }
        //
    }

    return (
        <>
            <OtrixDivider size={'md'} />

            <View style={styles.cartContent} key={item.id}>
                <View style={styles.cartBox} >
                    <View style={styles.imageView}>
                        <FastImage
                            style={styles.image}
                            source={{
                                uri: item.products[0]?.image ? ASSETS_DIR + 'product/' + item.products[0].image : ASSETS_DIR + '/assets/img/default.png',
                                priority: FastImage.priority.normal,
                            }}
                            resizeMode={FastImage.resizeMode.contain}
                        />
                    </View>
                    <View style={styles.infromationView}>
                        <View >
                            <Text style={styles.name}>{item.products[0]?.name}</Text>
                        </View>
                        <Text style={styles.orderDate}>{strings.orders.order_on} {moment(item.order_date).format("DD MMM YYYY")}</Text>
                        <Text style={styles.orderDate}>{strings.orders.order_status} <Text style={styles.orderStatuss}>{item.order_status.name}</Text></Text>
                    </View>

                </View>

            </View>
            <View style={GlobalStyles.horizontalLine}></View>
            <TouchableOpacity onPress={() => buyAgain()} style={styles.bottomButton}>
                <Text style={styles.bottomLeftTxt}>{strings.orders.buy_again}</Text>
                <Icon name="arrow-forward-ios" style={{ transform: [{ rotateY: I18nManager.isRTL == true ? '180deg' : '0deg' }] }} ></Icon>
            </TouchableOpacity>
            <View style={GlobalStyles.horizontalLine}></View>
            <TouchableOpacity onPress={() => props.navigation.navigate('OrderDetailScreen', { orderData: item })} style={[styles.bottomButton, { marginBottom: hp('2%') }]}>
                <Text style={styles.bottomLeftTxt}>{strings.orders.order_detail}</Text>
                <TouchableOpacity style={{ padding: 4 }}>
                    <Icon name="arrow-forward-ios" style={{ transform: [{ rotateY: I18nManager.isRTL == true ? '180deg' : '0deg' }] }} ></Icon>
                </TouchableOpacity>
            </TouchableOpacity>

            <Modal visible={buyAgainPop} transparent={true}>
                <View>
                    {Platform.OS === 'ios' &&
                        <View style={{ height: hp('5%') }}></View>
                    }

                    <View style={styles.modelView}>

                        {/* Model header */}
                        <View style={styles.contentView}>
                            <Pressable style={{ alignSelf: 'flex-end', padding: 10 }} onPress={() => setBuyAgain(false)}>
                                <Image source={close} style={styles.button} />
                            </Pressable>
                            <ScrollView showsVerticalScrollIndicator={false}>

                                {
                                    item.products.length > 0 && item.products.map((item) =>
                                        <>
                                            <View style={{ flexDirection: 'row', marginBottom: 10 }} key={item.product_id}>
                                                <View style={{
                                                    flexDirection: 'row',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    height: hp('11%'),
                                                    width: wp('100%'),
                                                    flex: 1
                                                }} >
                                                    <View style={styles.imageView}>
                                                        <FastImage
                                                            style={styles.image}
                                                            source={{
                                                                uri: item.image ? ASSETS_DIR + 'product/' + item.image : ASSETS_DIR + '/assets/img/default.png',
                                                                priority: FastImage.priority.normal,
                                                            }}
                                                            resizeMode={FastImage.resizeMode.contain}
                                                        />
                                                    </View>
                                                    <View style={styles.infromationView}>
                                                        <View >
                                                            <Text style={styles.name}>{item.name}</Text>

                                                            <Text style={styles.orderDate}>{strings.order_details.quantity}: {item.quantity}</Text>

                                                        </View>
                                                    </View>
                                                    <View style={styles.priceView}>
                                                        <Text style={styles.price}>{CURRENCY} {numberWithComma(item.total)}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={GlobalStyles.horizontalLine}></View>
                                            <Pressable onPress={() => { setBuyAgain(false), props.navigation.navigate('ProductDetailScreen', { id: item.product_id, orderData: { products: [item] } }) }} style={styles.bottomButton}>
                                                <Text style={styles.bottomLeftTxt}>{strings.orders.buy_again}</Text>
                                                <Icon name="arrow-forward-ios" style={{ transform: [{ rotateY: I18nManager.isRTL == true ? '180deg' : '0deg' }] }} ></Icon>
                                            </Pressable>
                                        </>

                                    )
                                }
                            </ScrollView>
                        </View>
                    </View>

                </View>
            </Modal >

        </>
    )
}

export default OrdersComponent;
const styles = StyleSheet.create({
    cartContent: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: Colors().white,
        justifyContent: 'center',
        borderRadius: wp('2%'),
        marginLeft: wp('1%'),
    },
    cartBox: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: hp('1%'),
        width: wp('90%'),
        flex: 0.90,
    },
    imageView: {
        flex: 0.30,
        backgroundColor: Colors().light_white,
        margin: wp('0.5%'),
        height: hp('8%'),
        borderRadius: wp('1.5%'),
    },
    image: {
        resizeMode: 'contain',
        alignSelf: 'center',
        height: undefined,
        aspectRatio: 1,
        width: wp('15.5%')
    },
    infromationView: {
        flex: 0.70,
        marginBottom: hp('1.4%'),
        marginLeft: wp('1%'),
        marginTop: hp('1%'),
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    name: {
        textAlign: 'center',
        color: Colors().text_color,
        fontSize: wp('3.8%'),
        fontFamily: Fonts.Font_Bold,
    },
    orderDate: {
        textAlign: 'center',
        color: Colors().secondry_text_color,
        lineHeight: hp('3%'),
        fontSize: wp('3.5%'),
        fontFamily: Fonts.Font_Regular,
    },
    bottomButton: {
        height: hp('6%'),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors().white,
        flexDirection: 'row',
        borderRadius: wp('2%'),
        marginLeft: wp('1%'),
        marginBottom: hp('0%')
    },
    bottomLeftTxt: {
        textAlign: 'left',
        fontSize: wp('3.8%'),
        flex: 0.90,
        color: Colors().black
    },
    orderStatuss: {
        fontFamily: Fonts.Font_Bold,
        fontSize: wp('3.5%'),
        color: Colors().text_color
    },
    modelView: {
        height: hp('100%'),
        width: wp('100%'),

        alignSelf: 'flex-end',
        justifyContent: 'center',
        backgroundColor: 'rgba(52,52,52,0.8)',
    },
    contentView: {
        marginHorizontal: wp('1%'),
        backgroundColor: Colors().white,
        marginVertical: hp('1%'),
        padding: wp('5%')
    },
    button: {
        height: _roundDimensions()._height * 0.026,
        width: _roundDimensions()._height * 0.026,
    },
    priceView: {
        flex: 0.35,
        bottom: hp('3%'),
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        marginRight: wp('4%')
    },
    price: {
        color: Colors().link_color,
        fontSize: wp('4%'),
        fontFamily: Fonts.Font_Semibold
    },
});