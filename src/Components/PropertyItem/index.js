import React, {Component} from 'react';
import moment from 'moment';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Image from 'react-native-fast-image'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../../Colors';
import openLocationCode from '../../api/openlocationcode';

class PropertyItem extends Component {

    constructor(props) {
        super(props);

        this.state = {
            placeholder: require('./.././../assets/placeholder.png'),
        };
    }

    onPress = () => this.props.onPress(this.props.item);

    onRequestNavigation = () => {

        if (!this.props.item.doorLocation) {
            return;
        }

        this.props.onRequestNavigation(this.props.item);
    };

    shouldComponentUpdate(nextProps) {

        const {item} = this.props;

        return item.lastSyncAt !== nextProps.item.lastSyncAt
            || item.ownerFirstName !== nextProps.item.ownerFirstName
            || item.isOrganization !== nextProps.item.isOrganization
            || item.organizationName !== nextProps.item.organizationName
            || item.ownerFirstName !== nextProps.item.ownerFirstName
            || item.ownerSurname !== nextProps.item.ownerSurname
            || item.doorLocation !== nextProps.item.doorLocation

            || item.openLocationCode !== nextProps.item.openLocationCode
            || item.serverPropertyId !== nextProps.item.serverPropertyId
            || item.assessmentPropertyPhoto1 !== nextProps.item.assessmentPropertyPhoto1;
    }

    render() {
        var openLocation="";

        const {item, activeProperty,digitalAddressLocation} = this.props;
       // console.log(JSON.stringify(item))
       console.log(item.doorLocation)
        if(item.doorLocation){
            var coord = item.doorLocation.split(',');
          //  alert(coord[0])
    openLocation = openLocationCode.encode(coord[0],coord[1]);
        }
        if (item.id === 0) {
            return <View style={{flex: 1}}/>;
        }

        const imageSource = item.assessmentPropertyPhoto1 ? {uri: item.assessmentPropertyPhoto1} : this.state.placeholder;
        const isSynced = item.lastSyncAt;

        const name = item.isOrganization ? item.organizationName : (`${item.ownerFirstName} ${item.ownerSurname}`).trim();

        return (
            <View
                style={[
                    styles.itemContainer,
                   // activeProperty && activeProperty.id === item.id ? styles.activeItem : {},
                ]}
            >
                <TouchableOpacity
                    activeOpacity={.8}
                    onPress={this.onPress}
                    style={[styles.imageContainer]}
                >
                    <Image
                        style={styles.image}
                        source={imageSource}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={this.onRequestNavigation}
                >
                    <View style={styles.detailsContainer}>

                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <View style={{
                                height: 10,
                                width: 10,
                                borderRadius: 5,
                                backgroundColor: item.isCompleted ? 'green' : 'red',
                                marginRight: 5,
                            }}/>
                            <Text
                                numberOfLines={1}
                                style={styles.itemTitle}
                            >{name ? name : 'No Name'}</Text>
                        </View>

                        <Text
                            numberOfLines={1}
                            style={styles.itemDesc}>{openLocation ? openLocation : 'xxxx xx.xxxx xx.xxxx'}</Text>

                        <Text
                            style={styles.lastSync}>{item.serverPropertyId ? `ID: ${item.serverPropertyId}, ` : ''}{isSynced ? 'Synced ' + moment(item.lastSyncAt).fromNow() : 'Never Synced'}</Text>
                    </View>

                    <View style={styles.syncIconContainer}>
                        <Icon
                            color={isSynced ? Colors.primary : '#e6b400'}
                            style={styles.syncIcon} size={20}
                            name={isSynced ? 'cloud-check' : 'cloud-alert'}
                        />
                    </View>
                </TouchableOpacity>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    itemContainer: {
        flex: 1,
        marginHorizontal: 2,
        marginBottom: 4,
        backgroundColor: Colors.white,
        elevation: 2,
    },
    activeItem: {
        borderWidth: 2,
        borderColor: 'red',
    },
    imageContainer: {
        width: '100%',
        aspectRatio: 4 / 3,
        backgroundColor: '#ddd',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    detailsContainer: {
        flex: 1,
        backgroundColor: '#f9f9f9',
        paddingHorizontal: 8,
        paddingVertical: 5,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    itemTitle: {
        color: '#333',
        fontSize: 14,
        fontWeight: 'bold',
    },
    itemDesc: {
        fontSize: 12,
        marginBottom: 2,
    },
    syncIconContainer: {
        position: 'absolute',
        height: 30,
        width: 30,
        backgroundColor: 'rgba(255,255,255,.9)',
        borderRadius: 25,
        top: 6,
        right: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    syncIcon: {},
    lastSync: {
        fontSize: 10,
        color: '#999',
    },
});

export default PropertyItem;
