import React, { useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { GlobalStyles, Colors } from '@helpers'
import { OtrixHeader, OtrixDivider } from '@component';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Fonts from '@helpers/Fonts';
import { close, checkaround, checkround2 } from '@common';
import { _roundDimensions } from '@helpers/util';
import { Input, FormControl, Button, TextArea, Select, CheckIcon, InfoOutlineIcon } from "native-base"

function EditAddressComponent(props) {
    const [formData, setData] = React.useState({ name: props.editData.name, state: parseInt(props.editData.state_id), country: parseInt(props.editData.country_id), city: props.editData.city, address1: props.editData.address_1, address2: props.editData.address_2, postcode: props.editData.postcode, submited: false });
    const { name, country, city, address1, address2, postcode, state, submited } = formData;
    const [errors, setErrors] = React.useState({});
    const [states, setStates] = React.useState([]);

    const { strings } = props;

    useEffect(() => {
        var statesArr = props.countries.find(function (item) {
            return item.id == props.editData.country_id;
        });

        setStates(statesArr.states);

    }, []);


    const validate = () => {
        if (name == null) {
            setErrors({
                ...errors,
                name: 'Name is required'
            });
            return false;
        }
        else if (country == null) {
            setErrors({
                ...errors,
                country: 'Country is required'
            });
            return false;
        }
        else if (state == null) {
            setErrors({
                ...errors,
                country: 'State is required'
            });
            return false;
        }
        else if (city == null) {
            setErrors({
                ...errors,
                city: "City is required"
            });
            return false;
        }
        else if (postcode == null) {
            setErrors({
                ...errors,
                postcode: "Postcode is required"
            });
            return false;
        }
        else if (address1 == null) {
            setErrors({
                ...errors,
                address1: 'Address is required'
            });
            return false;
        }

        return true;
    }


    const submit = () => {
        setData({ ...formData, submited: true });
        if (validate()) {
            let sendData = new FormData();
            sendData.append('name', name);
            sendData.append('country_id', country);
            sendData.append('state_id', state);
            sendData.append('city', city);
            sendData.append('postcode', postcode);
            sendData.append('address_1', address1);
            sendData.append('address_2', address2);
            props.editAddress(sendData);
        }
    }

    //country select event
    const onCountrySelect = (value) => {

        setData({ ...formData, submited: false, country: value })
        var statesArr = props.countries.find(function (item) {
            return item.id == value;
        });

        setStates(statesArr.states);

    }

    return (
        <View>
            <View style={{ height: hp('2%') }}></View>
            <View style={styles.modelView}>
                {/* Model header */}
                <OtrixHeader customStyles={{ backgroundColor: Colors().white }}>
                    <TouchableOpacity style={GlobalStyles.headerLeft} onPress={() => props.closeEdit()}>
                        <View style={styles.round} >
                            <Image source={close} style={styles.button} />
                        </View>
                    </TouchableOpacity>
                    <View style={[GlobalStyles.headerCenter]}>
                        <Text style={GlobalStyles.headingTxt}>{strings.manage_address.update_address}</Text>
                    </View>
                    <TouchableOpacity style={styles.headerRight}  >
                        {/* <Text style={styles.clearTxt}> Clear All</Text> */}
                    </TouchableOpacity>
                </OtrixHeader>
                <OtrixDivider size={'sm'} />
                <View style={GlobalStyles.horizontalLine}></View>
                <OtrixDivider size={'md'} />


                <View style={styles.contentView}>
                    <FormControl isRequired isInvalid={submited && 'name' in errors}>
                        <Input variant="outline"
                            value={name}
                            placeholder={strings.commoninput.name} style={GlobalStyles.textInputStyle}
                            onChangeText={(value) => { setData({ ...formData, submited: false, name: value }), delete errors.name }}
                        />
                        <FormControl.ErrorMessage
                            leftIcon={<InfoOutlineIcon size="xs" />}
                        >
                            {errors.name}
                        </FormControl.ErrorMessage>
                    </FormControl>
                    <OtrixDivider size={'sm'} />
                    <FormControl isRequired isInvalid={submited && 'country' in errors}>
                        <Select
                            selectedValue={country}
                            minWidth="200"
                            accessibilityLabel="Select Country"
                            placeholder={strings.commoninput.select_country}
                            _selectedItem={{
                                bg: "teal.600",
                                endIcon: <CheckIcon size="5" />,
                            }}
                            mt={1}
                            onValueChange={(itemValue) => { onCountrySelect(itemValue), delete errors.country }}
                        >
                            {
                                props.countries.map((item, index) =>
                                    <Select.Item label={item.name} value={item.id} key={item.id} />
                                )
                            }
                        </Select>
                        <FormControl.ErrorMessage
                            leftIcon={<InfoOutlineIcon size="xs" />}
                        >
                            {errors.country}
                        </FormControl.ErrorMessage>
                    </FormControl>
                    {
                        states.length > 0 && (
                            <FormControl isRequired isInvalid={submited && 'state' in errors}>
                                <Select
                                    selectedValue={state}
                                    minWidth="200"
                                    accessibilityLabel="Select State"
                                    placeholder={strings.commoninput.select_state}
                                    _selectedItem={{
                                        bg: "teal.600",
                                        endIcon: <CheckIcon size="5" />,
                                    }}
                                    mt={1}
                                    onValueChange={(itemValue) => { setData({ ...formData, submited: false, state: itemValue }), delete errors.country }}
                                >
                                    {
                                        states.map((item, index) =>
                                            <Select.Item label={item.name} value={item.state_id} key={item.state_id} />
                                        )
                                    }
                                </Select>
                                <FormControl.ErrorMessage
                                    leftIcon={<InfoOutlineIcon size="xs" />}
                                >
                                    {errors.state}
                                </FormControl.ErrorMessage>
                            </FormControl>
                        )
                    }
                    <OtrixDivider size={'sm'} />
                    <FormControl isRequired isInvalid={submited && 'city' in errors}>
                        <Input variant="outline"
                            value={city}
                            placeholder={strings.commoninput.city} style={GlobalStyles.textInputStyle}
                            onChangeText={(value) => { setData({ ...formData, submited: false, city: value }), delete errors.city }}
                        />
                        <FormControl.ErrorMessage
                            leftIcon={<InfoOutlineIcon size="xs" />}
                        >
                            {errors.city}
                        </FormControl.ErrorMessage>
                    </FormControl>

                    <OtrixDivider size={'sm'} />
                    <FormControl isRequired isInvalid={submited && 'postcode' in errors}>
                        <Input variant="outline"
                            value={postcode}
                            placeholder={strings.commoninput.postcode} style={GlobalStyles.textInputStyle}
                            onChangeText={(value) => { setData({ ...formData, submited: false, postcode: value }), delete errors.postcode }}
                        />
                        <FormControl.ErrorMessage
                            leftIcon={<InfoOutlineIcon size="xs" />}
                        >
                            {errors.postcode}
                        </FormControl.ErrorMessage>
                    </FormControl>
                    <OtrixDivider size={'sm'} />

                    <FormControl isRequired isInvalid={submited && address1 == '' ? true : false}>
                        <TextArea
                            value={address1}
                            variant="outline" placeholder={strings.commoninput.address_1} style={GlobalStyles.textAreaInputStyle}
                            onChangeText={(value) => { setData({ ...formData, address1: value }), delete errors.address1 }}
                        />
                        <FormControl.ErrorMessage
                            leftIcon={<InfoOutlineIcon size="xs" />}
                        >
                            {errors.address1}
                        </FormControl.ErrorMessage>
                    </FormControl>

                    <OtrixDivider size={'sm'} />
                    <FormControl isRequired >
                        <Input variant="outline" value={address2}
                            placeholder={strings.commoninput.address_2} style={GlobalStyles.textAreaInputStyle}
                            onChangeText={(value) => setData({ ...formData, address2: value })}
                        />

                    </FormControl>
                </View>

                <Button
                    size="md"
                    variant="solid"
                    bg={Colors().themeColor}
                    style={[GlobalStyles.button, { marginHorizontal: wp('4%'), top: hp('4.5%') }]}
                    onPress={() => submit()}
                >
                    <Text style={GlobalStyles.buttonText}>{strings.manage_address.update_address}</Text>
                </Button>

            </View>

        </View>
    )
}

export default EditAddressComponent;

const styles = StyleSheet.create({
    modelView: {
        height: hp('95%'),
        width: wp('100%'),
        //alignSelf: 'flex-end',
        marginTop: hp('5%'),
        backgroundColor: Colors().white,
    },
    filter: {
        height: _roundDimensions()._height * 0.028,
        width: _roundDimensions()._height * 0.028,
    },
    round: {
        justifyContent: 'center',
        alignItems: 'center',
        height: _roundDimensions()._height * 0.042,
        width: _roundDimensions()._height * 0.040,
        borderRadius: _roundDimensions()._borderRadius,
        backgroundColor: Colors().light_white,
        shadowColor: 'grey',
        shadowOffset: { width: 0, height: 0.2 },
        shadowOpacity: 0.10,
        shadowRadius: 3,
        elevation: 2,
    },
    button: {
        height: _roundDimensions()._height * 0.016,
        width: _roundDimensions()._height * 0.016,
    },
    headerRight: {
        flex: 0.25,
        marginRight: wp('2%'),
    },
    clearTxt: {
        color: Colors().link_color,
        textTransform: 'uppercase',
        fontSize: wp('3%'),
        fontFamily: Fonts.Font_Reguler
    },
    horiLine: {
        width: wp('90%'),
        alignSelf: 'center',
        height: 0.5,
        backgroundColor: Colors().line_color
    },
    contentView: {
        marginHorizontal: wp('4%'),

    },
    titleTxt: {
        color: Colors().text_color,
        textTransform: 'capitalize',
        fontSize: wp('4%'),
        fontFamily: Fonts.Font_Semibold
    },

    colorBox: {
        height: hp('4%'),
        width: wp('18%'),
        flexDirection: 'row',
        marginHorizontal: wp('2%'),
        backgroundColor: Colors().white,
        justifyContent: 'center',
        borderRadius: 5,
        borderColor: Colors().light_gray,
        borderWidth: 1,
        alignItems: 'center'
    },
    borderBox: {
        borderColor: Colors().themeColor,
        borderWidth: 1,
    },

    imageView: {
        height: hp('2%'),
        width: wp('4%'),
        borderRadius: 50,
        marginHorizontal: wp('1%'),

    },
    rangeView:
        { flex: 1, flexDirection: 'row', marginTop: hp('2%'), marginBottom: hp('8%') }
});