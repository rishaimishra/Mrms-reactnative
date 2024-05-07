import React, {Component} from 'react';
import {connect} from 'react-redux';
import {ScrollView, StyleSheet, Text, View} from 'react-native'
import axios from 'axios';

import {setPropertyField} from "../../../redux/actions/PropertyActions";
import ImagePicker from "../../../Components/ImagePicker";

class PropertyPhotoScreen extends Component {

    handleTakeFirstPhoto = (image) => {
       
      this.props.setPropertyField('assessmentPropertyPhoto1', image.path);
    };

    handleTakeSecondPhoto = (image) => {
        this.props.setPropertyField('assessmentPropertyPhoto2', image.path);
    };

    render() {

        const {assessmentPropertyPhoto1, assessmentPropertyPhoto2, isCompletedSaved} = this.props.property;

        return (
            <ScrollView
                keyboardShouldPersistTaps={'always'}
                contentContainerStyle={styles.container}
            >

                <View style={styles.row}>
                    <View style={styles.col}>
                        <ImagePicker
                            onImageSelected={this.handleTakeFirstPhoto}
                            defaultImage={assessmentPropertyPhoto1}
                            //disabled={isCompletedSaved}
                            text={'Property Image 1'}
                        />
                    </View>
                    <View style={styles.col}>
                        <ImagePicker
                            onImageSelected={this.handleTakeSecondPhoto}
                            defaultImage={assessmentPropertyPhoto2}
                            //disabled={isCompletedSaved}
                            text={'Property Image 2'}
                        />
                    </View>
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingHorizontal: 10,
        paddingTop: 20,
        paddingBottom: 76,
        justifyContent: 'center'
    },
    row: {
        flexDirection: 'row',
        marginHorizontal: -6
    },
    col: {
        paddingHorizontal: 6,
        flex: 1
    },
});

const mapStateToProps = ({options, addProperty}) => ({options, property: addProperty});

const mapDispatchToProps = {
    setPropertyField
};

export default connect(mapStateToProps, mapDispatchToProps)(PropertyPhotoScreen);
