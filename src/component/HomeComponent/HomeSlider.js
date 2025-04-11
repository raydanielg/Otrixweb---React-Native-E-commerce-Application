import React from 'react';
import { View, StyleSheet, Image, Dimensions, TouchableOpacity, I18nManager } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
// import Carousel, { ParallaxImage } from 'react-native-snap-carousel';
const { width: screenWidth } = Dimensions.get('window')
import { ASSETS_DIR } from '@env';
import Carousel from 'react-native-reanimated-carousel';
const width = Dimensions.get('window').width;

function Slider(props) {
    let images = [];
    let snapDirection = 'left';
    const viewCount = 5;
    props.data.images.map(function (item) {
        images.push(ASSETS_DIR + 'banner/' + item.image)
    });

    const navToPage = (data) => {
        let linkText = data.link;
        linkText = linkText.split('-')
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

    return (
        <View style={{ flex: 1 }}>
            <Carousel
                loop
                style={{
                    width: '100%',
                    height: 180,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                width={width}
                height={width / 2}
                pagingEnabled={true}
                snapEnabled={true}
                mode={"horizontal-stack"}
                autoPlay={true}
                autoPlayReverse={I18nManager.isRTL == true ? true : false}
                modeConfig={{
                    snapDirection,
                    stackInterval: 2000,
                }}
                customConfig={() => ({ type: 'positive', viewCount })}
                data={props.data.images}
                scrollAnimationDuration={2000}
                renderItem={({ item, index }) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => navToPage(item)}
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                        }}
                    >
                        <Image source={{ uri: ASSETS_DIR + 'banner/' + item.image }} resizeMode="contain" style={{ height: hp('100%'), width: '100%' }} />
                    </TouchableOpacity>
                )}
            />


        </View>


    )
}

export default HomeSlider = React.memo(Slider);

const styles = StyleSheet.create({
    item: {
        width: screenWidth - 55,
        height: screenWidth - 220,
        right: wp('3.5%'),
    },
    imageContainer: {
        flex: 1,
        marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
        backgroundColor: 'white',
        borderRadius: 8,
        marginHorizontal: wp('1.5%')

    },
    image: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: 'cover',
    }
})
