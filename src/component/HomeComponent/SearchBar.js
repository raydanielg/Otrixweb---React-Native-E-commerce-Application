import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Colors } from '@helpers'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome';
import Fonts from '@helpers/Fonts';

function Search(props) {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={{ flex: props.enable ? 0.90 : 1 }} onPress={() => props.navigation.navigate('SearchScreen')}>
                <View style={styles.searchContainer}>
                    <Icon name="search" style={styles.searchIcon} />
                    <View style={styles.verticalLine}></View>
                    <Text style={styles.textInputSearchStyle}>{props.strings.homepage.placeholder_search}</Text>
                </View>
            </TouchableOpacity>
            {
                props.enable == 1 && (
                    <TouchableOpacity style={styles.imageSearch} onPress={() => props.navigation.navigate("CameraScreen")}>
                        <Icon name="image" style={[{ fontSize: wp('6%') }]} />
                    </TouchableOpacity>
                )
            }

        </View>
    )
}

export default SearchBar = React.memo(Search);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row', padding: hp('1%'), borderRadius: 8,
        backgroundColor: Colors().light_white,
        height: hp('6%'),
        marginBottom: hp('1%'),
        justifyContent: 'center', alignItems: 'center'
    },
    searchView: {
        flex: 1
    },
    searchContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    searchIcon: {
        flex: 0.10,
        color: Colors().secondry_text_color,
        fontSize: wp('3.5%'),
        alignSelf: 'center',
        textAlign: 'center'
    },
    verticalLine: {
        width: 0.07,
        height: hp('2.5%'),
        backgroundColor: Colors().secondry_text_color,
    },
    textInputSearchStyle: {
        flex: 0.90,
        fontFamily: Fonts.Font_Reguler,
        backgroundColor: Colors().light_white,
        fontSize: wp('3.2%'),
        color: Colors().secondry_text_color,

    },
    imageSearch: { flex: 0.10, justifyContent: 'center', alignItems: 'center', alignContent: 'center' }
});