import React from 'react';
import { View, StyleSheet, Text, FlatList } from 'react-native';
import { GlobalStyles, Colors } from '@helpers'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import OtrixDivider from '../OtrixComponent/OtrixDivider';
import Fonts from '@helpers/Fonts';
import ProductView from './ProductView';

function SimilarProduct(props) {

    const navigateToDetailPage = (data) => {
        props.navigation.push('ProductDetailScreen', { id: data.id })
    }

    const navigateToLoginPage = (data) => {
        props.navigation.navigate('LoginScreen', {})
    }

    const addToWishlist = (id) => {
        props.addToWishlist(id);
    }

    const { strings, wishlistArr } = props;
    return (
        <>
            <View style={styles.catHeading}>
                <Text style={GlobalStyles.boxHeading}>{strings.product_details.similar}</Text>
            </View>
            <OtrixDivider size={'sm'} />
            <FlatList
                style={{ padding: wp('1%') }}
                data={props.reletedData}
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                contentContainerStyle={{
                    paddingTop: wp('2.5%'),
                }}
                onEndReachedThreshold={0.7}
                keyExtractor={(contact, index) => String(index)}
                renderItem={({ item, index }) =>
                    <View style={styles.productBox} key={item.id.toString()}>
                        <ProductView new={false} strings={strings} userAuth={props.userAuth} navToLogin={navigateToLoginPage} data={item} key={item.id.toString()} navToDetail={navigateToDetailPage} fromSimilar={true} addToWishlist={addToWishlist} wishlistArray={wishlistArr} />
                    </View>
                }>
            </FlatList>
        </>


    )
}

export default SimilarProduct;

const styles = StyleSheet.create({
    catHeading: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: hp('1%')
    },
    catBox: {
        height: hp('12.5%'),
        width: wp('15%'),
        marginHorizontal: wp('1%'),
        borderRadius: 5,
    },
    catName: {
        fontSize: wp('3.3%'),
        fontFamily: Fonts.Font_Reguler,
        textAlign: 'center',
        color: Colors().text_color
    },





    productBox: {

        backgroundColor: Colors().white,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
        // width: '46%',
        // height: 'auto',
        marginBottom: wp('3%'),
        borderRadius: wp('2%'),
        marginHorizontal: wp('1.5%'),
        paddingBottom: hp('1%'),
    },
    imageView: {
        flex: 0.63,
        backgroundColor: Colors().light_white,
        width: wp('42.2%'),
        borderTopStartRadius: wp('2%'),
        borderTopEndRadius: wp('2%')
    },
    image: {
        resizeMode: 'contain',
        alignSelf: 'center',
        height: hp('16%'),
        width: wp('30%')
    },
    infromationView: {
        flex: 0.37,
        width: wp('35%'),
    },
    starView: {
        alignItems: 'flex-start',
        marginVertical: hp('0.6%'),
    },
    myStarStyle: {
        color: '#ffd12d',
        backgroundColor: 'transparent',
        marginHorizontal: 1,
        textShadowRadius: 1,

    },
    myEmptyStarStyle: {
        color: 'gray',
    },
    productName: {
        color: Colors().secondry_text_color,
        fontFamily: Fonts.Font_Semibold,
        fontSize: wp('3.5%'),
        textAlign: 'left'
    },
    priceView: {
        flex: 1,
        marginTop: hp('0.6%'),
        flexDirection: 'row',
    },
    price: {
        flex: 0.30,
        color: Colors().black,
        fontFamily: Fonts.Font_Bold,
        fontSize: wp('4%')
    },
    offerTxt: {
        flex: 0.70,
        textAlign: 'right',
        color: Colors().link_color,
        fontFamily: Fonts.Font_Semibold,
        fontSize: wp('2.8%'),
        textTransform: 'uppercase'
    }

});