import React, { useEffect } from "react";
import {
    View,
    Image,
    TouchableOpacity,
    Text, FlatList,
    StyleSheet
} from "react-native";
import { connect } from 'react-redux';
import { Button } from 'native-base';
import {
    OtrixContainer, OtrixHeader, OtrixContent, OtirxBackButton, FlatListProductView
} from '@component';
import { GlobalStyles, Colors } from '@helpers';
import { _roundDimensions } from '@helpers/util'
import getApi from "@apis/getApi";
import { launchCamera } from 'react-native-image-picker';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Fonts from "@helpers/Fonts";
import { nothing } from '@common';
import Icon from 'react-native-vector-icons/Ionicons';

function CameraScreen(props) {

    const [state, setState] = React.useState({ data: [], loading: true });
    const [invalidImage, setInvalidImage] = React.useState(false);
    const [isAISearch, setAISearch] = React.useState(false);
    const [notFound, setNotFound] = React.useState(false);
    const [showData, setShowData] = React.useState(false);

    const openImagePicker = (res) => {
        if (res.assets) {
            setInvalidImage(false);
            setAISearch(true);
            let mainImage = {
                uri: res.assets[0].uri,
                type: res.assets[0].type,
                name: res.assets[0].fileName
            }
            let sendData = new FormData();
            sendData.append('image', mainImage);
            getApi.postData(
                'ai-image-search',
                sendData,
                null
            ).then((async response => {
                setInvalidImage(false);
                setAISearch(false);
                if (response.status == 1) {
                    setState({ data: response.data })
                    setShowData(true)
                }
                else {
                    setNotFound(true)
                    setShowData(false)
                }
            }));
        }
        else {
            setInvalidImage(true)
            setShowData(false)
            setNotFound(false)

        }

    }

    useEffect(() => {
        try {
            setShowData(false)
            setNotFound(false)
            setInvalidImage(false)
            launchCamera(
                {
                    mediaType: 'photo',
                    includeBase64: false,
                    maxHeight: 400,
                    maxWidth: 400,
                },
                (response) => {
                    openImagePicker(response);
                },
            )
        } catch (error) {

        }

    }, []);

    const addToWishlist = async (id) => {
        logfunction("IDD ", id)
        if (props.USER_AUTH == true) {
            let wishlistData = await _addToWishlist(id);
            props.addToWishList(wishlistData, id);
        }
        else {
            props.navigation.navigate('LoginScreen', { backToPrevious: 1 })
        }
    }

    const { data, loading } = state;
    const { wishlistData, strings } = props;
    return (
        <OtrixContainer customStyles={{ backgroundColor: Colors().light_white }}>

            {/* Header */}
            <OtrixHeader customStyles={{ backgroundColor: Colors().light_white }}>
                <TouchableOpacity style={GlobalStyles.headerLeft} onPress={() => props.navigation.goBack()}>
                    <OtirxBackButton />
                </TouchableOpacity>
                <View style={[GlobalStyles.headerCenter]}>
                    {
                        <Text style={GlobalStyles.headingTxt}>{"Search Product By Image"}</Text>
                    }
                </View>
                <TouchableOpacity style={GlobalStyles.headerRight} onPress={() => launchCamera(
                    {
                        mediaType: 'photo',
                        includeBase64: false,
                        maxHeight: 400,
                        maxWidth: 400,
                    },
                    (response) => {
                        openImagePicker(response);
                    },
                )}>
                    <Icon name={"image"} color={Colors().black} style={{ fontSize: wp('4.5%') }} />
                </TouchableOpacity>
            </OtrixHeader>

            {/* Content Start from here */}
            {
                invalidImage && <OtrixContent >
                    {/* Category Component Start from here */}
                    <View style={styles.emptyContainer}>
                        <Image
                            source={nothing}
                        >
                        </Image>
                        <Text style={styles.emptyTxt}>Something went wrong</Text>
                        <Button
                            size="md"
                            variant="solid"
                            bg={Colors().themeColor}
                            style={[GlobalStyles.button, { marginHorizontal: wp('2%'), marginBottom: hp('2.5%'), marginTop: hp('1%') }]}
                            onPress={() => launchCamera(
                                {
                                    mediaType: 'photo',
                                    includeBase64: false,
                                    maxHeight: 400,
                                    maxWidth: 400,
                                },
                                (response) => {
                                    openImagePicker(response);
                                },
                            )}
                        >
                            <Text style={GlobalStyles.buttonText}><Icon name={"image"} color={Colors().white} style={{ fontSize: wp('4.5%'), lineHeight: wp('5%') }} />  Search Product By Image</Text>
                        </Button>
                    </View>

                </OtrixContent>
            }
            {
                notFound && <OtrixContent >
                    {/* Category Component Start from here */}
                    <View style={styles.emptyContainer}>
                        <Image
                            source={nothing}
                        >
                        </Image>
                        <Text style={styles.emptyTxt}>Product not found!</Text>
                        <Button
                            size="md"
                            variant="solid"
                            bg={Colors().themeColor}
                            style={[GlobalStyles.button, { marginHorizontal: wp('2%'), marginBottom: hp('2.5%'), marginTop: hp('1%') }]}
                            onPress={() => launchCamera(
                                {
                                    mediaType: 'photo',
                                    includeBase64: false,
                                    maxHeight: 400,
                                    maxWidth: 400,
                                },
                                (response) => {
                                    openImagePicker(response);
                                },
                            )}
                        >
                            <Text style={GlobalStyles.buttonText}><Icon name={"image"} color={Colors().white} style={{ fontSize: wp('4.5%'), lineHeight: wp('5%') }} />  Search Product By Image</Text>
                        </Button>
                    </View>

                </OtrixContent>
            }
            {
                isAISearch && <OtrixContent >
                    <View style={styles.emptyContainer}>
                        <Image
                            source={require('../assets/images/search-gif.gif')}
                        >
                        </Image>
                        <Text style={styles.emptyTxt}>Please Wait Search In Progress...</Text>
                    </View>
                </OtrixContent>
            }
            {showData && (
                <View style={styles.content}>
                    {
                        data.length > 0 ?
                            <FlatList
                                style={{ padding: wp('1%') }}
                                data={data}
                                horizontal={false}
                                numColumns={2}
                                onEndReachedThreshold={0.2}
                                showsVerticalScrollIndicator={false}
                                keyExtractor={(contact, index) => String(index)}
                                renderItem={({ item, index }) =>
                                    <FlatListProductView strings={strings} data={item} key={item.id} imageViewBg={Colors().white} navToDetail={() => props.navigation.navigate('ProductDetailScreen', { id: item.id })} addToWishlist={() => addToWishlist} wishlistArray={wishlistData} />
                                }>
                            </FlatList> : <OtrixNotfoundComponent image={emptyBox} title={"Product not found!"} />
                    }
                </View>
            )

            }

        </OtrixContainer >
    )
}


function mapStateToProps(state) {
    return {
        strings: state.mainScreenInit.strings,
        wishlistData: state.wishlist.wishlistData,

    }
}


export default connect(mapStateToProps)(CameraScreen);


const styles = StyleSheet.create({
    content: { flex: 1, marginHorizontal: wp('3%') },
    emptyContainer: {
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


});
