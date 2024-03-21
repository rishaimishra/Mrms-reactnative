import React from 'react';
import {StyleSheet, View} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import getDirections from 'react-native-google-maps-directions';
import {FloatButton} from '../Components/Button';

class MapNavigationScreen extends React.PureComponent {

    static navigationOptions = ({navigation}) => ({
        title: navigation.getParam('title'),
    });

    constructor(props) {
        super(props);

        const location = props.navigation.getParam('location').split(',');

        this.state = {
            latitude: parseFloat(location[0]),
            longitude: parseFloat(location[1])
        };
    }

    onRequestDirection = () => {
        const data = {
            destination: {
                ...this.state
            },
            params: [
                {
                    key: 'travelmode',
                    value: 'driving',
                },
                {
                    key: 'dir_action',
                    value: 'navigate',
                },
            ],
        };

        getDirections(data);
    };

    render() {

        return (
            <View style={styles.container}>
                <MapView
                    initialRegion={{
                        ...this.state,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                    mapType="satellite"
                    style={{height: '100%', width: '100%', flex: 1}}
                >
                    <Marker coordinate={this.state} />
                </MapView>

                <FloatButton onPress={this.onRequestDirection} icon={'directions'}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default MapNavigationScreen;
