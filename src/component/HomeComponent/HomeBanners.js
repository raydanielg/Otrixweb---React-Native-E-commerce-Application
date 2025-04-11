import React from 'react';
import { TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ASSETS_DIR } from '@env';
import FastImage from 'react-native-fast-image'

function HomeBanners(props) {

    const manageNav = (navData) => {
        let linkText = navData.link;
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
        <TouchableOpacity onPress={() => manageNav(props.link)}>
            <FastImage
                style={{ alignItems: 'center', width: wp('100%'), height: hp('18%') }}
                source={{
                    uri: ASSETS_DIR + 'banner/' + props.image,
                    priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage.resizeMode.contain}
            />
        </TouchableOpacity>
    )
}

export default HomeCategoryView = React.memo(HomeBanners);
