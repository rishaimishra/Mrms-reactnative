import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Modal, PermissionsAndroid, View, StyleSheet, StatusBar} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import MapView, {Marker} from 'react-native-maps';
import {Toolbar} from 'react-native-material-ui';
import Geolocation from 'react-native-geolocation-service';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import {FloatButton} from '../Button';
import Colors from '../../Colors';

class LocationPicker extends PureComponent {

    constructor(props) {
        super(props);

        const initialRegion = {
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        };

        this.state = {
            initialRegion: {
               ...initialRegion
            },
            region: {
                ...initialRegion
            }
        };

        this.map = React.createRef();
    }


    onRegionChange = (region) => this.setState({ region });

    loadCurrentLocation = async () => {

        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Allow Location Permission',
                    message:
                        'App need your permission to pick geo coordinates',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {

                RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({interval: 10000, fastInterval: 5000})
                    .then(data => {

                        Geolocation.getCurrentPosition(
                            (position) => {
                                console.log('Position', position);

                                const {latitude, longitude, accuracy} = position.coords;

                                const oneDegreeOfLatitudeInMeters = 111.32 * 1000;
                                const latitudeDelta = accuracy / oneDegreeOfLatitudeInMeters;
                                const longitudeDelta = accuracy / (oneDegreeOfLatitudeInMeters * Math.cos(latitude * (Math.PI / 180)));

                                if (this.map.current) {
                                    this.map.current.animateToRegion({
                                        latitude,
                                        longitude,
                                        latitudeDelta,
                                        longitudeDelta,
                                    });
                                }


                            },
                            (error) => {

                            },
                            {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
                        );

                    }).catch(err => {

                });

            } else {
                console.log('Location permission denied');
            }
        } catch (err) {
            console.warn(err);
        }
    };

    onRightElement = () => {
        this.props.onSelected(this.state.region);
    };

    onShow = () => {

        this.loadCurrentLocation();
        StatusBar.setBackgroundColor(Colors.white);
    };

    render() {

        const {visible, onRequestClose} = this.props;

        return (
            <>
                <Modal
                    backdropColor='transparent'
                    transparent={true}
                    onShow={this.onShow}
                    onRequestClose={onRequestClose}
                    visible={visible}
                >
                    <Toolbar
                        theme={'light'}
                        style={toolbarStyles}
                        leftElement="clear"
                        centerElement="Select Location"
                        rightElement="done"
                        onLeftElementPress={onRequestClose}
                        onRightElementPress={this.onRightElement}
                    />

                    <View style={styles.mapContainer}>
                        <MapView
                            onRegionChangeComplete={this.onRegionChange}
                            mapType="satellite"
                            ref={this.map}
                            showsUserLocation
                            showsMyLocationButton
                            showsCompass
                            style={{ height: '100%', width: '100%', flex: 1 }}
                            initialRegion={this.state.initialRegion}
                        />
                        <View style={styles.marker}>
                            <Icon size={40} color={'red'} name={'map-marker'} />
                        </View>
                    </View>

                    <FloatButton
                        onPress={this.loadCurrentLocation}
                        icon={'crosshairs-gps'}
                    />
                </Modal>
            </>
        );
    }
}

LocationPicker.propTypes = {
    visible: PropTypes.bool.isRequired,
    onSelected: PropTypes.func.isRequired,
    onRequestClose: PropTypes.func.isRequired,
};

const toolbarStyles = StyleSheet.create({
    container: {
        backgroundColor: 'white'
    },
    leftElement: {
        color: Colors.toolbarColor
    },
    rightElement: {
        color: Colors.toolbarColor
    },
    centerElementContainer: {
        alignItems: 'center'
    },
    titleText: {
        color: Colors.toolbarColor
    }
});

const styles = StyleSheet.create({
    mapContainer: {
        position: 'relative',
        flex: 1,
        backgroundColor: Colors.white
    },
    marker: {
        position: 'absolute',
        alignSelf: 'center',
        top: '50%',
        marginTop: -37,
    }
});

export default LocationPicker;
