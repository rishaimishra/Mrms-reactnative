import React, {PureComponent} from 'react'
import {TouchableOpacity, View, StyleSheet, Text} from "react-native";
import Image from 'react-native-fast-image'
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ImagePickerCamera from 'react-native-image-crop-picker'
import Colors from "../../Colors";

class ImagePicker extends PureComponent {

    static defaultProps = {
        disabled: false,
        defaultImage: null,
        onImageSelected: f => f,
        text: 'Take Photo'
    };

    handleTakePhoto = () => {

        ImagePickerCamera.openCamera({
            mediaType: 'image',
            cropping: true,
            compressImageMaxWidth: 2000,
            compressImageMaxHeight: 2000,
            compressImageQuality: .8
        }).then(image => {

            //this.props.setPropertyField('assessmentPropertyPhoto2', image.path);

            this.props.onImageSelected(image);

        }).catch(() => {
        });
    };

    render() {

        const {defaultImage, disabled, text} = this.props;

        return (
            <TouchableOpacity
                activeOpacity={disabled ? 1 : .8}
                onPress={this.handleTakePhoto}
                style={styles.imageBoxContainer}
            >
                {defaultImage ? (
                    <Image
                        source={{uri: defaultImage}}
                        style={{flex: 1}}
                    />
                ) : (
                    <View
                        style={styles.iconContainer}
                    >
                        <Icon size={50} name={'camera'}/>
                        <Text style={{ fontSize: 12, color: '#333', marginTop: 6 }}>{text}</Text>
                    </View>
                )}
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    imageBoxContainer: {
        aspectRatio: 1,
        borderWidth: 1,
        borderColor: Colors.primary,
        borderStyle: 'dashed',
        borderRadius: 10,
        flex: 1,
        overflow: 'hidden'
    },
    iconContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default ImagePicker;