import React from "react";
import {
    View,
    TouchableOpacity,
} from "react-native";

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Colors } from '@helpers';
import { ScrollView } from "native-base";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

function ProductSkeleton() {
    return (
        <SkeletonPlaceholder>
            <View style={{
                flexDirection: 'row',
                marginVertical: hp('3%'),
                justifyContent: 'space-around',
                marginHorizontal: hp('5%')
            }}>
                <View style={{ height: hp('4%'), width: wp('40%') }}>
                </View>
                <View style={{ height: hp('0%'), width: wp('40%') }}>
                </View>
                <View style={{ height: hp('4%'), width: wp('30%') }}>
                </View>
            </View>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                marginHorizontal: hp('5%'),

            }}>
                <View style={{ height: hp('25%'), width: wp('45%') }}>
                </View>
                <View style={{ height: hp('0%'), width: wp('45%') }}>
                </View>
                <View style={{ height: hp('25%'), width: wp('45%') }}>
                </View>
            </View>


            <View style={{
                width: wp('92%'),
                height: hp('15%'),
                left: wp('4%'),
                marginVertical: hp('2%')
            }}>
            </View>
            <View style={{
                flexDirection: 'row',
                marginVertical: hp('3%'),
                justifyContent: 'space-around',
                marginHorizontal: hp('5%')
            }}>
                <View style={{ height: hp('4%'), width: wp('40%') }}>
                </View>
                <View style={{ height: hp('0%'), width: wp('40%') }}>
                </View>
                <View style={{ height: hp('4%'), width: wp('30%') }}>
                </View>
            </View>



            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                marginHorizontal: hp('5%'),

            }}>
                <View style={{ height: hp('25%'), width: wp('45%') }}>
                </View>
                <View style={{ height: hp('0%'), width: wp('45%') }}>
                </View>
                <View style={{ height: hp('25%'), width: wp('45%') }}>
                </View>
            </View>



        </SkeletonPlaceholder>
    )
}

export default ProductSkeleton;
