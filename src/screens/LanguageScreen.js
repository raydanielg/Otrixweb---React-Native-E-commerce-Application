import React, { useEffect } from "react";
import {
    View,
    TouchableOpacity,
    Text,
    I18nManager,
    StyleSheet,
} from "react-native";
import { connect } from 'react-redux';
import {
    OtrixContainer, OtrixHeader, OtrixDivider, OtirxBackButton,
} from '@component';
import { Button } from "native-base"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { GlobalStyles, Colors } from '@helpers';
import Fonts from "@helpers/Fonts";
import AsyncStorage from '@react-native-community/async-storage'
import RNRestart from 'react-native-restart';

function LanguageScreen(props) {
    const [language, setLanguage] = React.useState('en');

    useEffect(() => {
        async function fetchData() {
            let selectedLang = await AsyncStorage.getItem('Language');
            if (selectedLang) {
                setLanguage(selectedLang);
            }
        }
        fetchData();
    }, []);

    const changeLanguage = async () => {
        AsyncStorage.setItem('Language', language);
        if (language == 'ar') {
            await I18nManager.forceRTL(true);
            RNRestart.Restart();
            return;
        }
        else {
            await I18nManager.forceRTL(false);
            RNRestart.Restart();
            return;
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
                    <Text style={GlobalStyles.headingTxt}>  {strings.setting.label_language}</Text>
                </View>
            </OtrixHeader>

            {/* Orders Content start from here */}
            <OtrixDivider size={"md"} />
            <TouchableOpacity style={[styles.langBox, { borderWidth: language == 'en' ? 1 : 0.1, borderColor: language == 'en' ? Colors().themeColor : Colors().custom_gray }]} onPress={() => setLanguage('en')}>
                <Text style={[styles.langTxt, { color: language == 'en' ? Colors().themeColor : Colors().text_color }]}> {strings.language_screen.english}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.langBox, { borderWidth: language == 'ar' ? 1 : 0.1, borderColor: language == 'ar' ? Colors().themeColor : Colors().custom_gray }]} onPress={() => setLanguage('ar')}>
                <Text style={[styles.langTxt, { color: language == 'ar' ? Colors().themeColor : Colors().text_color }]}> {strings.language_screen.arabic}</Text>
            </TouchableOpacity>
            <OtrixDivider size={'md'} />
            <Button
                size="md"
                variant="solid"
                bg={Colors().themeColor}
                style={[GlobalStyles.button, { marginHorizontal: wp('8%') }]}
                onPress={changeLanguage}
            >
                <Text style={GlobalStyles.buttonText}>{strings.notification.save}</Text>
            </Button>
        </OtrixContainer >

    )
}

function mapStateToProps(state) {
    return {
        strings: state.mainScreenInit.strings
    }
}

export default connect(mapStateToProps, {})(LanguageScreen);

const styles = StyleSheet.create({

    langBox: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: hp('2%'),
        backgroundColor: Colors().white,
        marginVertical: hp('1%'),
        marginHorizontal: wp('5%'),
        borderRadius: wp('2%'),
        borderWidth: 0.5,
        borderColor: Colors().custom_gray
    },
    langTxt: {
        fontSize: wp('4%'),
        fontFamily: Fonts.Font_Semibold,
        color: Colors().text_color,
        textAlign: 'left'
    }

});