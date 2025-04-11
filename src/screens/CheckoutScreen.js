import React, { useEffect } from "react";
import {
    View,
    TouchableOpacity,
    Text,
    Image,
    I18nManager,
    Platform,
    StyleSheet, ScrollView,
    Modal
} from "react-native";
import { connect } from 'react-redux';
import { Button, Input, FormControl, Modal as NativeBaseModal } from 'native-base';
import {
    OtrixContainer, OtrixHeader, OtrixContent, OtrixDivider, CheckoutView, OtrixLoader, OtirxBackButton, AddAdressComponent, EditAddressComponent, PaymentSuccessComponent, CreditCartComponent
} from '@component';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { GlobalStyles, Colors } from '@helpers';
import { _roundDimensions } from '@helpers/util';
import { proceedCheckout, removeFromCart } from '@actions';
import { bindActionCreators } from 'redux';
import PaymentMethods from '@component/items/PaymentMethods';
import Icon from 'react-native-vector-icons/Ionicons';
import MatIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Fonts from "@helpers/Fonts";
import { CURRENCY } from '@env';
import getApi from "@apis/getApi";
import { logfunction } from "@helpers/FunctionHelper";
import { shipping } from '@common';

function CheckoutScreen(props) {
    const [state, setState] = React.useState({ loading: true, orderProducts: [], grandTotalOriginal: 0, trx: 0, sub_total: 0, discount: null, shippingCharges: null, comment: null, countries: [], shippingData: [], showAdd: false, cartProducts: [], sumAmount: 0, noRecord: false, addresses: [], selctedAddress: 0, selectedShipping: 0, showEdit: false, editAddressData: [], step: 1, selectedPaymentMethod: null, paymentSuccessModal: false, message: null, creditCardModal: false, type: 'error' });
    const [showMessage, setShowLoading] = React.useState(false)
    const { loading, showAdd, discount, addresses, orderProducts, sub_total, trx, grandTotalOriginal, comment, selctedAddress, shippingCharges, selectedShipping, showEdit, editAddressData, step, selectedPaymentMethod, paymentSuccessModal, countries, message, type, shippingData, creditCardModal } = state;
    const [taxArray, setTaxArray] = React.useState([]);
    const [grandTotal, setGrandTotal] = React.useState(0);
    const [loadShipping, setShowShipping] = React.useState(false);


    const storeAddress = (addressData) => {
        setState({
            ...state,
            showAdd: false,
            loading: true,
        });
        try {
            getApi.postData(
                'user/addAddress',
                addressData,
                props.AUTH_TOKEN
            ).then((response => {
                logfunction("RESPONSE ", response)
                if (response.status == 1) {
                    setState({
                        ...state,
                        addresses: response.addresses,
                        selctedAddress: response.addresses.length > 0 ? response.addresses[0].id : 0,
                        loading: false,
                        showAdd: false,
                        message: response.message,
                        type: 'success'
                    });
                    setShowLoading(true)
                    if (response.addresses.length > 0) {
                        fetchTaxValue(response.addresses[0].id)
                    }

                    setTimeout(() => {
                        setShowLoading(false)
                    }, 3000);
                }
                else {
                    setState({
                        ...state,
                        type: 'error',
                        message: response.message,
                        loading: false,
                        showAdd: false,

                    });
                    setShowLoading(true)
                    setTimeout(() => {
                        setShowLoading(false)
                    }, 3000);
                }
            }));
        } catch (error) {
            logfunction("Error", error)
            setData({
                ...state,
                loading: false
            })
        }
    }

    const updateAddress = (addressData) => {
        setState({
            ...state,
            showEdit: false,
            loading: true
        });
        logfunction("addressData ", addressData)

        try {
            getApi.postData(
                'user/editAddress/' + selctedAddress,
                addressData,
                props.AUTH_TOKEN
            ).then((response => {
                logfunction("RESPONSE ", response)
                if (response.status == 1) {
                    setState({
                        ...state,
                        addresses: response.addresses,
                        loading: false,
                        showEdit: false,
                        message: response.message,
                        type: 'success'
                    });
                    setShowLoading(true)
                    setTimeout(() => {
                        setShowLoading(false)
                    }, 3000);
                }
                else {
                    setState({
                        ...state,
                        showEdit: false,
                        type: 'error',
                        message: response.message,
                        loading: false
                    });
                    setShowLoading(true)
                    setTimeout(() => {
                        setShowLoading(false)
                    }, 3000);
                }
            }));
        } catch (error) {
            logfunction("Error", error)
            setData({
                ...state,
                loading: false
            })
        }
    }

    const editAddress = (data) => {
        setState({ ...state, editAddressData: data, selctedAddress: data.id, showEdit: true });
    }

    const closeAddressModel = () => {
        setState({
            ...state,
            showAdd: false
        });
    }

    const closeAddressEditModel = () => {
        setState({
            ...state,
            showEdit: false
        });
    }

    const fetchTaxValue = (id) => {
        try {
            let sendData = new FormData();
            sendData.append("address_id", id)
            getApi.postData(
                'user/calculate-tax',
                sendData,
                props.AUTH_TOKEN
            ).then((response => {
                setTaxArray(response.tax);
                setShowShipping(true)
            }));
        } catch (error) {
            logfunction("Error", error)
        }
    }

    const proceedToPay = () => {
        if (selectedShipping != 0 && selctedAddress) {
            setState({
                ...state,
                loading: true,
            });
            getApi.postData(
                'user/selectShipping/' + selectedShipping,
                [],
                props.AUTH_TOKEN
            ).then((response => {
                logfunction("RESPONSE select  ", response)
                if (response.status == 1) {
                    setState({
                        ...state,
                        orderProducts: response.orderSummary,
                        grandTotalOriginal: response.grandTotal,
                        loading: false,
                        discount: response.discountAMT,
                        shippingCharges: response.shipping,
                        sub_total: response.subTotal,
                        step: 2
                    });
                    if (taxArray.length > 0) {
                        let taxTotal = 0;
                        for (let i = 0; i < taxArray.length; i++) {
                            taxTotal += parseFloat(taxArray[i].taxAmount);
                        }
                        let grandTotalNumber = response.grandTotal.replace(",", "");
                        setGrandTotal(parseFloat(grandTotalNumber) + parseFloat(taxTotal))
                    }
                    else {
                        let grandTotalNumber = response.grandTotal.replace(",", "");

                        setGrandTotal(parseFloat(grandTotalNumber))
                    }

                }
                else {
                    setState({
                        ...state,
                        type: 'error',
                        message: response.message,
                        discount: null,
                        shippingData: [],
                        sub_total: 0,
                        loading: false
                    });
                    setShowLoading(true)
                    setTimeout(() => {
                        setShowLoading(false)
                    }, 3000);
                }
            }));
        }
        else {

            setState({
                ...state,
                type: 'error',
                message: selectedShipping == 0 ? "Shipping Method Required!" : "Address Required!",
            });
            setShowLoading(true)
            setTimeout(() => {
                setShowLoading(false)
            }, 3000);
        }
    }


    useEffect(() => {

        getApi.getData(
            "user/getCheckoutData",
            props.AUTH_TOKEN
        ).then((response => {
            logfunction("RESPONS ", response)
            if (response.status == 1) {
                setState({
                    ...state,
                    countries: response.data.countries,
                    addresses: response.data.addresses,
                    shippingData: response.data.shippingMethods,
                    selctedAddress: response.data.addresses.length > 0 ? response.data.addresses[0].id : 0,
                    loading: false,
                });
                if (response.data.addresses?.length > 0) {
                    fetchTaxValue(response.data.addresses[0].id)
                }
            }
            else {
                setState({
                    ...state,
                    loading: false,
                    message: response.message,
                    noRecord: false
                });
                setShowLoading(true)
                setTimeout(() => {
                    setShowLoading(false)
                }, 3000);
            }
        }));
    }, []);

    logfunction("ADDRESS ", addresses.length)

    //place order
    const placeOrder = () => {
        logfunction("Place order here ", 'now');
        if (selectedPaymentMethod != null) {
            setState({
                ...state,
                creditCardModal: false,
                loading: true,
            });
            let sendData = new FormData();
            sendData.append('payment_method', selectedPaymentMethod);
            sendData.append("comment", comment);
            sendData.append('transaction_id', trx);
            sendData.append('address_id', selctedAddress);
            logfunction("Params ", sendData);

            getApi.postData(
                'user/placeOrder',
                sendData,
                props.AUTH_TOKEN
            ).then((response => {
                logfunction("RESPONSE ORDER  ", response)
                if (response.status == 1) {
                    props.removeFromCart(0);
                    setState({
                        ...state,
                        creditCardModal: false,
                        step: 1,
                        paymentSuccessModal: true,
                        selectedPaymentMethod: null,
                        loading: false
                    });

                }
                else {
                    setState({
                        ...state,
                        type: 'error',
                        message: response.message,
                        loading: false
                    });
                    setShowLoading(true)
                    setTimeout(() => {
                        setShowLoading(false)
                    }, 3000);
                }
            }));
        }
        else {
            setState({
                ...state,
                loading: false,
                message: 'Please select payment method!',
            });
            setShowLoading(true)
            setTimeout(() => {
                setShowLoading(false)
            }, 3000);
        }
    }

    const _selectePaymentMethod = (payment) => {
        if (payment.value != 'cod') {
            setState({
                ...state,
                selectedPaymentMethod: payment.value,
                creditCardModal: true
            });
        }
        else {
            //do cod payment here 
            setState({
                ...state,
                selectedPaymentMethod: payment.value,
            });
        }
    }

    const closeCrediCardModal = () => {
        setState({
            ...state,
            creditCardModal: false
        });
    }

    const payOnline = () => {
        //do online payment after credit card successs 
        closeCrediCardModal();
        setTimeout(() => {
            placeOrder();
        }, 200);
    }

    const closePay = (navigateTo) => {
        logfunction("Navigate To ", navigateTo)
        setState({
            ...state,
            paymentSuccessModal: false
        });
        props.navigation.push(navigateTo);
    }

    const renderShippingMethods = item => {
        return (
            <TouchableOpacity style={[styles.shippingColumn, {
                borderWidth: selectedShipping == item.id ? 1 : 0.1,
                borderColor: selectedShipping == item.id ? Colors().themeColor : Colors().white
            }]} key={item.id.toString()}
                onPress={() => setState({ ...state, selectedShipping: item.id })}>
                <View style={[styles.shippingBox]}>
                    <Image source={shipping} resizeMode="contain" style={styles.shippingImage} />
                    <Text style={styles.shippingTxt} numberOfLines={2}>{item.name}     </Text>
                    <OtrixDivider size={'sm'} />
                    <Text style={styles.shippingTxt} numberOfLines={1}>Charges : <Text style={styles.chargeTxt}> {CURRENCY}{item.shipping_charge}</Text> </Text>
                    {selectedShipping == item.id &&
                        <Text style={{ bottom: hp('14%'), left: wp('16%') }}> <Icon name="md-checkmark-circle-sharp" color={Colors().themeColor} size={wp('5%')} style={{ textAlignVertical: 'center' }} /></Text>
                    }
                </View>
            </TouchableOpacity >
        );
    };

    const { strings } = props;


    return (

        <OtrixContainer customStyles={{ backgroundColor: Colors().light_white }}>

            {/* Header */}
            <OtrixHeader customStyles={{ backgroundColor: Colors().light_white }}>
                <TouchableOpacity style={GlobalStyles.headerLeft} onPress={() => props.navigation.goBack()}>
                    <OtirxBackButton />
                </TouchableOpacity>
                <View style={[GlobalStyles.headerCenter, { flex: 1 }]}>
                    <Text style={GlobalStyles.headingTxt}>  {strings.cart.checkout}</Text>
                </View>
            </OtrixHeader>

            {/* Content Start from here */}
            <View style={{ marginHorizontal: wp('4%') }} >
                {/* Arrow navigation Start from here */}
                <View style={styles.indicatorView}>
                    <View style={[styles.indicator1, { marginRight: wp('4%') }]}>
                        <View style={{ position: 'relative' }}>
                            <View style={[styles.ract, { borderColor: step == 1 ? Colors().themeColor : 'transparent' }]}>

                                <Text style={[styles.indicatorText, { color: step == 1 ? Colors().themeColor : Colors().secondry_text_color }]}>{strings.checkout.address}</Text>
                            </View>
                            <View style={[styles.tri]}>
                                <View style={[styles.arrow, { borderColor: step == 1 ? Colors().themeColor : 'transparent' }]}>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={styles.indicator1}>
                        <View style={{ borderColor: step == 2 ? Colors().themeColor : 'transparent' }}>
                            <View style={[styles.ract, { borderColor: step == 2 ? Colors().themeColor : 'transparent' }]}>
                                <Text style={[styles.indicatorText, { color: step == 2 ? Colors().themeColor : Colors().secondry_text_color }]}>{strings.checkout.payment}</Text>
                            </View>
                            <View style={[styles.tri]}>
                                <View style={[styles.arrow, { borderColor: step == 2 ? Colors().themeColor : 'transparent' }]}>

                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </View>


            {loading && <OtrixLoader />}

            {!loading && step == 1 && <>
                {/* Address Content start from here */}
                <OtrixDivider size={"md"} />
                <Text style={styles.deliveryTitle}>{strings.checkout.delivery_address}</Text>
                <OtrixDivider size={"md"} />
                {
                    addresses.length > 0 &&
                    <View style={styles.addressContent}>

                        {/*horizontal address* */}
                        <ScrollView style={styles.addressBox} showsHorizontalScrollIndicator={false} horizontal={true}>
                            {
                                addresses.map((item, index) =>
                                    <TouchableOpacity key={index} style={[styles.deliveryBox, {
                                        borderWidth: selctedAddress == item.id ? 1 : 0.1,
                                        borderColor: selctedAddress == item.id ? Colors().themeColor : Colors().white
                                    }]}
                                        onPress={() => { setState({ ...state, selctedAddress: item.id }), fetchTaxValue(item.id) }}
                                    >
                                        <Text style={styles.addressTxt} numberOfLines={1}>{item.name}     </Text>
                                        <Text style={styles.addressTxt} numberOfLines={2}>{item.address_1}    </Text>
                                        <Text style={styles.addressTxt} numberOfLines={2}>{item.address_2}, {item.city}</Text>
                                        <Text style={styles.addressTxt} numberOfLines={1}>{item.postcode}, {item.country}</Text>
                                        {selctedAddress == item.id &&
                                            <Text style={styles.deliveryAddressTxt}>{strings.checkout.delivery_address} <Icon name="md-checkmark-circle-sharp" color={Colors().themeColor} size={wp('4%')} style={{ textAlignVertical: 'center' }} /></Text>
                                        }
                                        <TouchableOpacity style={[styles.editView, { bottom: selctedAddress == item.id ? hp('11%') : hp('10%') }]} onPress={() => editAddress(item)}>
                                            <Text style={styles.edit}> <MatIcon name="pencil" color={Colors().text_color} size={wp('5%')} /></Text>
                                        </TouchableOpacity>

                                    </TouchableOpacity>
                                )
                            }

                        </ScrollView>
                        <TouchableOpacity style={styles.plusView} onPress={() => setState({ ...state, showAdd: true })}>
                            <MatIcon name="plus" color={Colors().text_color} size={wp('5%')} />
                        </TouchableOpacity>
                    </View>
                }
            </>
            }

            {
                !loading && addresses.length == 0 && <TouchableOpacity style={styles.noaddress} onPress={() => setState({ ...state, showAdd: true })}>
                    <Text style={[styles.addressTxt]} > <MatIcon name="plus" color={Colors().link_color} size={wp('5%')} />{strings.checkout.add_new_address} </Text>
                </TouchableOpacity>
            }

            {!loading && step == 1 && <>

                {/* Address Content start from here */}
                {
                    loadShipping &&
                    (
                        <>
                            <OtrixDivider size={"md"} />
                            <Text style={styles.deliveryTitle}>{strings.checkout.shipping_method}</Text>
                            <OtrixDivider size={"md"} />
                            {
                                shippingData.length > 0 &&
                                <OtrixContent>
                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: wp('2.5%') }}>

                                        {/*horizontal address* */}
                                        {
                                            shippingData.map((item, index) => {
                                                return renderShippingMethods(item);
                                            })
                                        }
                                    </View>
                                </OtrixContent>
                            }
                        </>
                    )
                }

            </>
            }

            {/* Add Address Screen */}
            <NativeBaseModal isOpen={showAdd}
                justifyContent='flex-end' avoidKeyboard style={{ backgroundColor: Colors().white }}
                transparent={false}>
                <AddAdressComponent strings={strings} closeAdd={closeAddressModel} addAdress={storeAddress} countries={countries} />
            </NativeBaseModal>

            {/* Edit Address Screen */}
            <NativeBaseModal isOpen={showEdit} avoidKeyboard
            >
                <EditAddressComponent strings={strings} closeEdit={closeAddressEditModel} editAddress={updateAddress} editData={editAddressData} countries={countries} />
            </NativeBaseModal>

            {/******** PAYMENT SECTION *************/}
            {
                !loading && step == 2 && <View style={{ marginHorizontal: wp('4%') }}>
                    {/*                    <OtrixDivider size={"md"} />
                     <View style={styles.offerView}>
                        <Text style={styles.offerTxt}>Get 10% Off With Credit Card</Text>
                    </View> */}
                    <OtrixDivider size={"md"} />
                    <Text style={styles.paymentMethodTitle}>{strings.checkout.payment_methods}</Text>
                    <OtrixDivider size={"sm"} />
                    {
                        PaymentMethods.map((item, index) =>
                            <TouchableOpacity key={index}
                                onPress={() => _selectePaymentMethod(item)}
                                style={[styles.paymentView, { backgroundColor: selectedPaymentMethod == item.value ? Colors().themeColor : Colors().white }]}>
                                <Text style={[styles.paymentMethodTxt, { color: selectedPaymentMethod == item.value ? Colors().white : Colors().text_color }]}>{item.name}</Text>
                                {
                                    selectedPaymentMethod == item.value ?
                                        <Icon name="md-shield-checkmark" color={Colors().white} size={wp('6%')} style={{ textAlign: 'right', flex: 0.10 }} />
                                        :
                                        <Icon name="radio-button-off" color={Colors().secondry_text_color} size={wp('5%')} style={{ textAlign: 'right', flex: 0.10 }} />
                                }
                            </TouchableOpacity>
                        )
                    }
                </View>
            }
            <OtrixDivider size={"md"} />
            {
                !loading && step == 2 && <View style={{ marginHorizontal: wp('4%') }}>
                    <Text style={[styles.summayTitle, { left: wp('1.5%') }]}>{strings.checkout.order_comments}</Text>
                    <OtrixDivider size={"sm"} />
                    <FormControl isRequired >
                        <Input variant="outline" value={comment}
                            placeholder={strings.checkout.enter_order_comments + " (optional)"} style={GlobalStyles.textAreaInputStyle}
                            onChangeText={(value) => setState({ ...state, comment: value })}
                        />
                    </FormControl>
                </View>
            }

            <OtrixDivider size={"md"} />
            {
                !loading && step == 2 && <OtrixContent>
                    <OtrixDivider size={"sm"} />
                    <Text style={styles.summayTitle}>{strings.checkout.order_summary}</Text>
                    <OtrixDivider size={"sm"} />
                    <View style={GlobalStyles.horizontalLine}></View>
                    <>
                        {
                            !loading && orderProducts.length > 0 && <CheckoutView navigation={props.navigation} products={orderProducts} />
                        }
                    </>
                </OtrixContent>
            }

            <OtrixDivider size={'sm'} />

            {
                step == 1 && <View style={[styles.totalView, { justifyContent: 'flex-end', bottom: hp('1.5%') }]}>
                    <Button
                        size="md"
                        variant="solid"
                        bg={Colors().themeColor}
                        style={[GlobalStyles.button, { marginHorizontal: wp('5%'), marginBottom: hp('1%'), flex: 0.40, alignSelf: 'flex-end' }]}
                        onPress={() => proceedToPay()}
                    >
                        <Text style={GlobalStyles.buttonText}>{strings.checkout.proceed}</Text>
                    </Button>
                </View>
            }
            {
                step == 2 &&
                <View style={styles.checkoutView}>
                    <View style={styles.totalView2}>
                        <View style={styles.totalSubView}>
                            <Text style={styles.subleftTxt}  >{strings.cart.sub_total} :</Text>
                            <Text style={styles.subrightTxt}>{CURRENCY}{sub_total}</Text>
                        </View>
                        {
                            discount != null &&
                            (<View style={styles.totalSubView}>
                                <Text style={styles.subleftTxt}>{discount.name}</Text>
                                <Text style={styles.subrightTxt}>- {CURRENCY}{discount.discountAmt}</Text>
                                <OtrixDivider size={'sm'} />
                            </View>)

                        }
                        {
                            taxArray.length > 0 && (
                                taxArray.map((item) =>
                                    <View style={styles.totalSubView} key={item.tax_rate_id.toString()}>
                                        <Text style={styles.subleftTxt}>{item.taxName}</Text>
                                        <Text style={styles.subrightTxt}>+ {CURRENCY}{item.taxAmount}</Text>
                                        <OtrixDivider size={'sm'} />
                                    </View>
                                )
                            )
                        }
                        {
                            shippingCharges != null &&
                            (<View style={styles.totalSubView}>
                                <Text style={styles.subleftTxt}>{shippingCharges.name}</Text>
                                <Text style={styles.subrightTxt}>+ {CURRENCY}{shippingCharges.charges}</Text>
                                <OtrixDivider size={'sm'} />
                            </View>)
                        }
                        <View style={styles.totalSubView}>
                            <Text style={styles.subleftTxt}  >{strings.cart.total} :</Text>
                            <Text style={[styles.subrightTxt, { color: Colors().link_color, fontSize: wp('5%') }]}>{CURRENCY}{grandTotal.toFixed(2)}</Text>
                        </View>
                    </View>
                    <Button
                        size="md"
                        variant="solid"
                        bg={'#0ab97a'}
                        style={[GlobalStyles.button, { marginBottom: hp('1%'), flex: 0.30, alignSelf: 'flex-end' }]}
                        onPress={() => payOnline()}
                    >
                        <Text style={[GlobalStyles.buttonText, { fontSize: I18nManager.isRTL == true ? wp('3.8%') : wp('4.8%') }]}>{strings.checkout.place_order}</Text>
                    </Button>

                </View>

            }

            {/* Payment Modal  */}
            <Modal visible={paymentSuccessModal}
                transparent={true}>
                <PaymentSuccessComponent strings={strings} navigation={props.navigation} closePaymentModal={closePay} />
            </Modal>

            <Modal visible={creditCardModal}
                transparent={true}>
                <CreditCartComponent closePayModal={() => closeCrediCardModal()} payWithCard={() => payOnline()} />
            </Modal>

            {
                showMessage == true && <OtrixAlert type={type} message={message} />
            }
        </OtrixContainer >


    )
}

function mapStateToProps(state) {
    return {
        cartData: state.cart.cartData,
        strings: state.mainScreenInit.strings,
        AUTH_TOKEN: state.auth.AUTH_TOKEN,
    }
}

const mapDispatchToProps = dispatch => (
    bindActionCreators({
        proceedCheckout,
        removeFromCart
    }, dispatch)
);


export default connect(mapStateToProps, mapDispatchToProps)(CheckoutScreen);
const styles = StyleSheet.create({
    checkoutView: {
        backgroundColor: Colors().light_white,
        padding: hp('1%'),
        borderTopLeftRadius: wp('2%'),
        borderTopRightRadius: wp('2%'),
        marginHorizontal: wp('1%'),
        marginVertical: hp('0.5%'),
        flexDirection: 'row'
    },
    totalView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginHorizontal: wp('4%'),
    },
    totalView2: {
        flex: 0.70,
        flexDirection: 'column',
    },
    leftTxt: {
        color: Colors().secondry_text_color,
        fontFamily: Fonts.Font_Bold,
        flex: 0.20,
        fontSize: wp('4%'),
        textAlign: 'left'
    },
    rightTxt: {
        color: Colors().text_color,
        fontFamily: Fonts.Font_Bold,
        fontSize: wp('4%'),
        flex: 0.30,
        textAlign: 'left'
    },
    noRecord: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        marginTop: hp('25%')
    },
    emptyTxt: {
        fontSize: wp('6%'),
        marginVertical: hp('1.5%'),
        fontFamily: Fonts.Font_Semibold,
        color: Colors().secondry_text_color
    },
    indicatorView: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginVertical: hp('1.5%')
    },

    indicator1: {
        marginHorizontal: wp('3%')
    },

    ract: {
        borderWidth: 1,
        padding: I18nManager.isRTL ? 0.2 : 3,
        width: wp('38%'),
        backgroundColor: Colors().white,
        alignItems: 'center'
    },
    tri: {
        position: 'absolute',
        top: I18nManager.isRTL ? hp('0.8%') : hp('0.6%'),
        right: -wp('2.6%')
    },
    arrow: {
        borderTopWidth: 1,
        borderRightWidth: 1,
        backgroundColor: Colors().white,
        borderColor: '#007299',
        width: 20,
        height: 18,
        transform: [{ rotate: I18nManager.isRTL ? '310deg' : '45deg' }]
    },
    indicatorText: {
        fontFamily: Fonts.Font_Semibold,
        fontSize: wp('3.8%'),
        textTransform: 'uppercase',
        color: Colors().secondry_text_color
    },
    deliveryTitle: {
        fontFamily: Fonts.Font_Semibold,
        fontSize: wp('3.8%'),
        color: Colors().text_color,
        marginLeft: wp('5%'),
        textAlign: 'left'
    },
    summayTitle: {
        fontFamily: Fonts.Font_Semibold,
        fontSize: wp('3.8%'),
        color: Colors().text_color,
        left: wp('3%')
    },
    addressBox: {
        marginLeft: wp('5%'),
        marginRight: wp('2.5%'),
        flex: 0.90,
        height: Platform.OS == 'android' ? hp('15.5%') : hp('17.5%'),
        borderRadius: wp('2%'),
    },
    deliveryBox: {
        marginHorizontal: wp('1.5%'),
        width: wp('72%'),
        height: Platform.OS == 'android' ? hp('15.5%') : hp('17.5%'),
        borderRadius: wp('2%'),
        backgroundColor: Colors().white,
        padding: wp('2.5%')
    },
    addressTxt: {
        fontSize: wp('3.6%'),
        fontFamily: Fonts.Font_Reguler,
        color: Colors().text_color,
        textAlign: 'left',

    },
    deliveryAddressTxt: {
        textAlign: 'right',
        fontSize: wp('3.4%'),
        fontFamily: Fonts.Font_Reguler,
        color: Colors().link_color,
    },
    edit: {
        textAlign: 'right'
    },
    editView: { justifyContent: 'flex-start', },
    addressContent: {
        flexDirection: 'row'
    },
    summryBox: {
        height: hp('6.5%'),
        backgroundColor: Colors().white,
        flexDirection: 'row',
        marginVertical: hp('1%')
    },
    image: {
        flex: 0.25,
        height: hp('10%'),
        resizeMode: 'contain',
        width: wp('20%')
    },
    plusView: {
        flex: 0.10,
        height: hp('15%'),
        backgroundColor: Colors().white,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10
    },

    //payment styles here
    offerView: {
        padding: hp('1.5%'),
        backgroundColor: Colors().white,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    offerTxt: {
        fontSize: wp('3.8%'),
        fontFamily: Fonts.Font_Semibold,
        color: Colors().link_color
    },
    paymentMethodTitle: {
        fontFamily: Fonts.Font_Semibold,
        fontSize: wp('4%'),
        color: Colors().text_color,
        marginLeft: wp('1%')
    },
    paymentView: {
        flexDirection: 'row',
        padding: hp('2%'),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginVertical: hp('0.5%'),
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Colors().light_gray
    },
    paymentMethodTxt: {
        fontFamily: Fonts.Font_Semibold,
        fontSize: wp('3.8%'),
        textAlign: 'left',
        marginLeft: wp('2%'),
        flex: 0.90
    },
    noaddress: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 0.5,
        backgroundColor: Colors().white,
        marginLeft: wp('5%'),
        marginRight: wp('2.5%'),
        borderRadius: wp('2%'),

    },

    shippingColumn: {
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: Colors().white,
        shadowColor: 'grey',
        shadowOffset: { width: 0, height: 0.4 },
        shadowOpacity: 0.30,
        shadowRadius: 3,
        elevation: 6,
        width: '46%',
        height: 'auto',
        marginBottom: wp('3%'),
        borderRadius: wp('2%'),
        marginHorizontal: wp('1.5%'),
        paddingBottom: hp('1%'),

    },
    shippingBox: {
        alignItems: 'center',
        padding: wp('1%'),
        flexDirection: 'column'
    },
    shippingTxt: {
        fontSize: wp('3.5%'),
        fontFamily: Fonts.Font_Semibold,
        color: Colors().text_color,
        textAlign: 'center',
    },
    chargeTxt: {
        fontSize: wp('3.5%'),
        fontFamily: Fonts.Font_Semibold,
        color: Colors().link_color,
        textAlign: 'left',
    },
    shippingImage: {
        width: wp('20%'),
        height: undefined,
        aspectRatio: 1,
        tintColor: Colors().themeColor
    },
    totalSubView: {
        flexDirection: 'row', justifyContent: 'flex-start',
        alignItems: 'center',
    },
    subleftTxt: {
        color: Colors().secondry_text_color,
        fontFamily: Fonts.Font_Bold,
        flex: 0.60,
        fontSize: wp('3.5%'),
        textAlign: 'left'
    },
    subrightTxt: {
        color: Colors().text_color,
        fontFamily: Fonts.Font_Bold,
        fontSize: wp('4%'),
        flex: 0.40,
        textAlign: 'left'
    },
});

