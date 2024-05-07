import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Modal, PermissionsAndroid, View, StyleSheet, StatusBar,We, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import {Toolbar} from 'react-native-material-ui';
import Geolocation from 'react-native-geolocation-service';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import {FloatButton} from '../Button';
import Colors from '../../Colors';
import MeasureTool from 'measuretool-googlemaps-v3';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-community/async-storage'

class MapViewPicker extends PureComponent {

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
            },
            // latitude: '37.78825',
            // longitude: '-122.4324',
            url:'http://18.117.101.215/back-admin/property/loadgmap?'+initialRegion.latitude+'&'+initialRegion.longitude,
            areas:''
        };

        this.map = React.createRef();
        // var measureTool = new MeasureTool(this.map, {
        //     showSegmentLength: true,
        //     //unit: MeasureTool.UnitTypeId.IMPERIAL // or just use 'imperial'
        //   });
        //  measureTool.start()
    }


    onRegionChange = (region) =>{
        //     var measureTool = new MeasureTool(this.map, {
        //     showSegmentLength: true,
        //     //unit: MeasureTool.UnitTypeId.IMPERIAL // or just use 'imperial'
        //   });
        //  measureTool.start()  
        this.setState({ region });
    }

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
//alert(latitudeDelta)
                                // if (this.map.current) {
                                //     this.map.current.animateToRegion({
                                //         latitude,
                                //         longitude,
                                //         latitudeDelta,
                                //         longitudeDelta,
                                //     });
                                // }
                                this.setState({
                                    latitude:latitudeDelta,
                                    longitude:longitudeDelta,
                                    url:'http://18.117.101.215/back-admin/property/loadgmap?'+latitude+'&'+longitude

                                })


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

    onRightElement  =  () => {
     
       // measureTool.end()
        console.log('rigth button proresse');
       this.clearGetMeasure();
       this.getValueFromWeb();
       
    //     setTimeout(() => {
    //     this.props.onSelected(this.state.areas);
    //  }, 5000)

    };

    onShow = () => {

        this.loadCurrentLocation();
        StatusBar.setBackgroundColor(Colors.white);
    };
    addMeasure = () => {
        console.log("in add measure");
        const run = `
        this.startMeasure();
        true;
      `;
        this.webref.injectJavaScript(run);

    }
    clearGetMeasure = () => {
        const run = `
        this.endMeasure();
      `;
     
        this.webref.injectJavaScript(run);

    }

    getValueFromWeb = () => {
        const run = `
            this.getValueObj();
        `;
        this.webref.injectJavaScript(run);
        console.log(run);
    }
     onMessage=(data) =>{
        //Prints out data that was passed.
        console.log("in res areas-------");
        var res=JSON.parse(data.nativeEvent.data);
        //this.props.onSelected(res.area);
        console.log(res.area)
    //  this.setState(
    //        {
    //        areas:res.area
    //     });
    //await AsyncStorage.setItem("area", res.area.toString());

      }


      _bridge(event) {
        
          Alert.alert('Total Area:',event.nativeEvent.data);
          this.props.onSelected(event.nativeEvent.data);
          this.setState({ areas: event.nativeEvent.data});
        
      }


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
                        centerElement="Measure Distance"
                        rightElement="done"
                        onLeftElementPress={onRequestClose}
                        onRightElementPress={this.onRightElement}
                    />

                    <View style={styles.mapContainer}>
                    <WebView
                    javaScriptEnabled
                    domStorageEnabled
                     ref={(r) => (this.webref = r)}
                     source={{ uri: this.state.url }}
                     
                     // onMessage={(event)=> alert(event.nativeEvent.data)}
                     onMessage={event => { this._bridge(event); }}
                      />
                        {/* <MapView
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
                        </View> */}
                    </View>

                    {/* <FloatButton
                        onPress={this.loadCurrentLocation}
                        icon={'crosshairs-gps'}
                    /> */}

<FloatButton
                        onPress={this.addMeasure}
                        icon={'plus'}
                    />
                </Modal>
            </>
        );
    }
}

MapViewPicker.propTypes = {
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

export default MapViewPicker;
