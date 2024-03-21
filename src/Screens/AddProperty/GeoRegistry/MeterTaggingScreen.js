import React, {PureComponent} from 'react';
import {ScrollView, StyleSheet, Text, View, FlatList} from 'react-native';
import {connect} from 'react-redux';
import {SelectPicker, TextInput} from '../../../Components/Input';

import {setMeterField, setPropertyField} from '../../../redux/actions/PropertyActions';
import ImagePicker from '../../../Components/ImagePicker';

const MeterItem = ({ onTextChange, onImageChange, meter, index }) => {

    return (
        <View style={styles.meterInfoContainer}>
            <TextInput
                label={`${index + 1}. Meter Number*`}
                maxLength={200}
                onChangeText={onTextChange}
                value={meter.number}
                //editable={!isCompletedSaved}
            />

            <View style={styles.imageContainer}>
                <ImagePicker
                    //disabled={isCompletedSaved}
                    defaultImage={meter.photo}
                    onImageSelected={onImageChange}
                />
                <Text style={styles.photoText}>{`${index + 1}. Meter Photo*`}</Text>
            </View>
        </View>
    )
}

class MeterTaggingScreen extends PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            range: new Array(21).fill('a').map((item, index) => {
                return {
                    label: index === 0 ? "No Meter" : (index).toString(),
                    value: (index),
                }
            })
        };
    }

    handleTakeMeterPhoto = (image) => this.props.setPropertyField('meterPhoto', image.path);

    onChangeMeterNumber = text => this.props.setPropertyField('meterNumber', text);

    onChangeTotalMeter = text => this.props.setPropertyField('totalMeter', text);

    renderItem = ({item, index}) => {
        return (
            <MeterItem
                index={index}
                meter={item}
                onTextChange={text => this.props.setMeterField(index, 'number', text)}
                onImageChange={image => this.props.setMeterField(index, 'photo', image.path)}
            />
        )
    };

    keyExtractor = (item, index) => index.toString();

    render() {

        const {totalMeter, meters, isCompletedSaved} = this.props.property;

        return (
            <FlatList
                removeClippedSubviews
                data={meters}
                contentContainerStyle={styles.container}
                ListHeaderComponent={(
                    <SelectPicker
                        label={'Number of Meters*'}
                        items={this.state.range}
                        placeholder={{}}
                        onValueChange={this.onChangeTotalMeter}
                        value={totalMeter}
                        //disabled={isCompletedSaved}
                    />
                )}
                keyboardShouldPersistTaps={'always'}
                renderItem={this.renderItem}
                keyExtractor={this.keyExtractor}
            />
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingHorizontal: 10,
        paddingTop: 20,
        paddingBottom: 76
    },
    row: {
        flexDirection: 'row',
        marginHorizontal: -6
    },
    col: {
        paddingHorizontal: 6,
        flex: 1
    },
    imageContainer: {
        width: 140
    },
    meterInfoContainer: {
        marginBottom: 18
    },
    photoText: {
        color: '#333',
        textAlign: 'center',
        marginTop: 5
    }
});

const mapStateToProps = ({addProperty}) => ({property: addProperty});

const mapDispatchToProps = {
    setPropertyField,
    setMeterField
};

export default connect(mapStateToProps, mapDispatchToProps)(MeterTaggingScreen);
