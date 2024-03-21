import React, {PureComponent} from 'react';
import {ActivityIndicator, ScrollView, StyleSheet, View,Text} from 'react-native';
import {connect} from 'react-redux';
import LocationPicker from '../../../Components/LocationPicker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {TextInput} from '../../../Components/Input';
import {Link} from '../../../Components/Link';
import {setPropertyField} from '../../../redux/actions/PropertyActions';
import Colors from '../../../Colors';
import openLocationCode from '../../../api/openlocationcode';
class Location extends PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            visibleLocationPicker: false,
        };
    }

    handlePickLocation = (region) => {
        this.props.onChange({
            lat: region.latitude.toString(),
            lng: region.longitude.toString(),
        });

        this.setState({visibleLocationPicker: false});
    };

    hideLocationPicker = () => this.setState({visibleLocationPicker: false});

    showLocationPicker = () => this.setState({visibleLocationPicker: true});

    render() {

        const {lat, lng} = this.props.value;

        return (
            <View>
                <View style={styles.row}>

<LocationPicker
    visible={this.state.visibleLocationPicker}
    onRequestClose={this.hideLocationPicker}
    onSelected={this.handlePickLocation}
/>

{/* <View style={styles.col}>
    <TextInput editable={false} value={lat} style={{fontSize: 12}}/>
</View>
<View style={styles.col}>
    <TextInput editable={false} value={lng} style={{fontSize: 12}}/>
</View> */}
<View style={styles.col}>
<TextInput editable={false} value={lat?openLocationCode.encode(lat,lng):""} style={{fontSize: 14,textAlign:'center',fontFamily:'georgia'}}/>
</View> 

<View style={[styles.linkCol]}>
    {this.state.loading ? <ActivityIndicator color={Colors.primary}/> : (
        <Link
            style={[styles.linkStyle]}
            // disabled={this.props.isCompletedSaved}
            onPress={this.showLocationPicker}
            label={(
                <React.Fragment>
                    <Icon size={20} name={'map-marker'}/>{this.props.required && '*'}
                </React.Fragment>
            )}
        />
    )}

    <Link
        style={styles.linkStyle}
        //disabled={this.props.isCompletedSaved}
        onPress={() => this.props.onChange('')}
        label={(
            <React.Fragment>
                <Icon size={20} name={'close'}/>
            </React.Fragment>
        )}
    />
</View>
</View>
            </View>
            
        );
    }
}

class PlotTaggingScreen extends PureComponent {

    onChangePlotTagging1 = value => this.props.setPropertyField('plotTaggingLocation1', value);
    onChangePlotTagging2 = value => this.props.setPropertyField('plotTaggingLocation2', value);
    onChangePlotTagging3 = value => this.props.setPropertyField('plotTaggingLocation3', value);
    onChangePlotTagging4 = value => this.props.setPropertyField('plotTaggingLocation4', value);
    onChangePlotTagging5 = value => this.props.setPropertyField('plotTaggingLocation5', value);
    onChangePlotTagging6 = value => this.props.setPropertyField('plotTaggingLocation6', value);
    onChangePlotTagging7 = value => this.props.setPropertyField('plotTaggingLocation7', value);
    onChangePlotTagging8 = value => this.props.setPropertyField('plotTaggingLocation8', value);

    render() {

        const {
            plotTaggingLocation1,
            plotTaggingLocation2,
            plotTaggingLocation3,
            plotTaggingLocation4,
            plotTaggingLocation5,
            plotTaggingLocation6,
            plotTaggingLocation7,
            plotTaggingLocation8,
            isCompletedSaved,
        } = this.props.property;

        return (
            <ScrollView
                keyboardShouldPersistTaps={'always'}
                contentContainerStyle={styles.container}
            >
                <Location
                    value={plotTaggingLocation1}
                    onChange={this.onChangePlotTagging1}
                    required
                    //isCompletedSaved={isCompletedSaved}
                />
                <Location
                    value={plotTaggingLocation2}
                    onChange={this.onChangePlotTagging2}
                    required
                    //isCompletedSaved={isCompletedSaved}
                />
                <Location
                    value={plotTaggingLocation3}
                    onChange={this.onChangePlotTagging3}
                    required
                    //isCompletedSaved={isCompletedSaved}
                />
                <Location
                    value={plotTaggingLocation4}
                    onChange={this.onChangePlotTagging4}
                    //isCompletedSaved={isCompletedSaved}
                />
                <Location
                    value={plotTaggingLocation5}
                    onChange={this.onChangePlotTagging5}
                    //isCompletedSaved={isCompletedSaved}
                />
                <Location
                    value={plotTaggingLocation6}
                    onChange={this.onChangePlotTagging6}
                    //isCompletedSaved={isCompletedSaved}
                />
                <Location
                    value={plotTaggingLocation7}
                    onChange={this.onChangePlotTagging7}
                    //isCompletedSaved={isCompletedSaved}
                />
                <Location
                    value={plotTaggingLocation8}
                    onChange={this.onChangePlotTagging8}
                    //isCompletedSaved={isCompletedSaved}
                />

            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingHorizontal: 10,
        paddingTop: 20,
        paddingBottom: 76,
    },
    row: {
        flexDirection: 'row',
        marginHorizontal: -6,
    },
    col: {
        paddingHorizontal: 6,
        flex: 1,
    },
    linkCol: {
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingBottom: 15,
        paddingHorizontal: 10,
        width: 100,
        flexDirection: 'row',
    },
    imageBoxContainer: {
        aspectRatio: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderStyle: 'dashed',
        borderRadius: 10,
        flex: 1,
        marginHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    linkStyle: {
        padding: 5,
    },
});

const mapStateToProps = ({options, addProperty}) => ({options, property: addProperty});

const mapDispatchToProps = {
    setPropertyField,
};

export default connect(mapStateToProps, mapDispatchToProps)(PlotTaggingScreen);
