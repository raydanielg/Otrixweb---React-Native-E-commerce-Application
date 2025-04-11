import React, { useEffect } from "react";
import {
    View,
    TouchableOpacity,
    Image,
    Text,
    FlatList,
    StyleSheet,
} from "react-native";
import { connect } from 'react-redux';
import {
    OtrixContainer, OtrixHeader, OtrixDivider, OtirxBackButton, OtrixContent
} from '@component';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { GlobalStyles, Colors } from '@helpers';
import Fonts from "@helpers/Fonts";

import AsyncStorage from "@react-native-community/async-storage";

function NotificationScreen(props) {

    const [state, setState] = React.useState({ foryouchk: true, notificationData: [], categoryArr: [] });
    const { notificationData, categoriesSelectedArr, categoryArr } = state;

    useEffect(async () => {
        let getNotifications = await AsyncStorage.getItem("NOTIFICATIONS_ARR");
        if (getNotifications) {
            let notificationData = JSON.parse(getNotifications);
            setState({
                ...state,
                notificationData: notificationData
            });
        }
    }, []);

    const handleNotificationNav = (link) => {
        linkText = link.split('-')
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

    const { strings } = props;

    return (
        <OtrixContainer customStyles={{ backgroundColor: Colors().light_white }}>

            {/* Header */}
            <OtrixHeader customStyles={{ backgroundColor: Colors().light_white }}>
                <TouchableOpacity style={GlobalStyles.headerLeft} onPress={() => props.navigation.goBack()}>
                    <OtirxBackButton />
                </TouchableOpacity>
                <View style={[GlobalStyles.headerCenter, { flex: 1 }]}>
                    <Text style={GlobalStyles.headingTxt}>  {strings.notification.title}</Text>
                </View>
            </OtrixHeader>

            {/* Orders Content start from here */}
            <OtrixContent>
                {
                    notificationData.length > 0 &&
                    <FlatList
                        style={{ padding: wp('1%') }}
                        data={notificationData}
                        horizontal={false}
                        onEndReachedThreshold={0.2}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(contact, index) => String(index)}
                        renderItem={({ item, index }) =>
                            <TouchableOpacity onPress={() => handleNotificationNav(item.link)} style={{
                                backgroundColor: Colors().white,
                                shadowColor: 'grey',
                                shadowOffset: { width: 0, height: 0.4 },
                                shadowOpacity: 0.30,
                                shadowRadius: 3,
                                elevation: 6,
                                marginBottom: wp('3%'),
                                borderRadius: wp('2%'),
                                flex: 1, padding: hp('0.2%'), flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
                            }}>
                                <View style={{ flex: 0.40, justifyContent: 'center' }}>
                                    <Image source={{ uri: item.image }} resizeMode="contain" style={{ height: undefined, width: wp('25%'), aspectRatio: 1 }} />
                                </View>
                                <View style={{ flexDirection: 'column', flex: 0.60, justifyContent: 'center', alignItems: 'flex-start' }}>
                                    <Text style={{ color: Colors().black, fontFamily: Fonts.Font_Bold, fontSize: wp('4.5%'), textAlign: 'left' }}>{item.title}</Text>
                                    <Text style={{ color: Colors().secondry_text_color, fontFamily: Fonts.Font_Semibold, fontSize: wp('3.2%'), textAlign: 'left' }} numberOfLines={4}>{item.body}</Text>
                                </View>
                            </TouchableOpacity>
                        }>
                    </FlatList>
                }

            </OtrixContent >
        </OtrixContainer >

    )
}

function mapStateToProps(state) {
    return {
        strings: state.mainScreenInit.strings,
    }
}


export default connect(mapStateToProps, {})(NotificationScreen);

const styles = StyleSheet.create({
    title: {
        fontFamily: Fonts.Font_Semibold,
        fontSize: wp('3.8%'),
        color: Colors().black,
        marginLeft: wp('2%')
    },
    box: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: hp('6%'),
        paddingLeft: wp('4%'),
        backgroundColor: Colors().white,
        marginVertical: hp('0.8%'),
        marginHorizontal: wp('1%'),
        borderRadius: wp('0.3%'),
        borderWidth: 0.08,
        borderColor: Colors().black
    },
    txt: {
        fontSize: wp('4%'),
        fontFamily: Fonts.Font_Semibold,
        color: Colors().text_color,
        textAlign: 'left'
    },
    checkboxContent: {
        flex: 0.10,
        justifyContent: 'center'
    },
    chkBox: {
        color: Colors().secondry_text_color,
        fontSize: wp('5%')
    },
    textchk: {
        color: Colors().text_color,
        fontSize: wp('4%'),
        fontFamily: Fonts.Font_Semibold,
        flex: 0.90
    }
});