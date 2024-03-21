import React, {PureComponent} from 'react';
import _ from 'lodash';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {connect} from 'react-redux';
import {Button} from '../../../Components/Button';
import {setPropertyField} from '../../../redux/actions/PropertyActions';
import {loadPropertiesInList, saveProperty} from '../../../database/Property';
import {Checkbox} from 'react-native-material-ui';
import LocationPicker from '../../../Components/LocationPicker';
import ImagePicker from '../../../Components/ImagePicker';
import {TextInput} from '../../../Components/Input';
import openLocationCode from '../../../api/openlocationcode';

class DigitalAddressScreen extends PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            visibleLocationPicker: false,
        };
    }

    handlePickLocation = (region) => {
        this.props.setPropertyField('digitalAddressLocation', region);
        this.hideLocationPicker();
    };

    onChangeIsCompleteProperty = checked => this.props.setPropertyField('isCompleted', checked);

    onChangeIsDraftDelivered = checked => this.props.setPropertyField('isDraftDelivered', checked);


    validatorMandatory = () => {

        const property = this.props.property;

        let mandatoryFields = {

            ...(
                property.isPropertyInaccessible ? {
                    'propertyInaccessible': 'Property Inaccessible',
                } : {}
            ),

            ...(
                property.isOrganization ? {
                    'organizationName': 'Organization Name',
                    'organizationType': 'Organization Type',
                    'organizationAddress': 'Organization Address',
                } : {
                    'ownerFirstName': 'Landlord First Name',
                    'ownerSurname': 'Landlord Surname',
                    'ownerSex': 'Landlord Sex',
                    // 'ownerIdType': 'ID Type',
                    // 'ownerIdNumber': 'ID Number',
                    // 'ownerIdPhoto': 'ID Photo',
                }
            ),

            //'tinNumber': 'Tax Identification Number',

            'ownerWardNumber': 'Landlord Ward',
            'ownerConstituency': 'Landlord Constituency',
            'ownerSection': 'Landlord Section',
            'ownerChiefdom': 'Landlord Chiefdom',
            'ownerDistrict': 'Landlord District',
            'ownerProvince': 'Landlord Province',
            'ownerPostcode': 'Landlord Postcode',
            'ownerMobile1': 'Landlord Mobile 1',

            'propertyStreetNumber': 'Property Street Number',
            'propertyStreetName': 'Property Street Name',
            'propertyWardNumber': 'Property Ward Number',
            'propertyConstituency': 'Property Constituency',
            'propertySection': 'Property Section',
            'propertyChiefdom': 'Property Chiefdom',
            'propertyDistrict': 'Property District',
            'propertyProvince': 'Property Province',
            'propertyPostCode': 'Property Postcode',

            'tenantOccupancy': 'Tenant Occupancy Type',

            ...(property.tenantOccupancy !== 'Unoccupied House' ? {
                'tenantFirstName': 'Tenant First Name',
                'tenantSurname': 'Tenant Surname',
                'tenantMobile1': 'Tenant Mobile 1',
            } : {}),

            'assessmentPropertyCategory': 'Property Category',

            ...(property.assessmentPropertyCategory === 6 ? {
                assessmentCompoundHouseName: 'Compound House Name',
                assessmentTotalCompoundHouse: 'Total Compound House',
            } : {}),

            'assessmentType': 'Property Type Habitat',
            'assessmentTypeTotal': 'Property Type Total',

            'assessmentMaterialUsedOnWall': 'Material Used On Wall',
            'assessmentMaterialUsedOnRoof': 'Material Used on Roof',
            'assessmentPropertyDimension': 'Property Dimension',
            'assessmentValueAdded': 'Property Value Added',

            ...(_.findIndex(property.assessmentValueAdded, {value: 8}) !== -1 ? {
                assessmentTotalCommunicationMast: 'Total Communication Masts',
            } : {}),

            ...(_.findIndex(property.assessmentValueAdded, {value: 9}) !== -1 ? {
                assessmentTotalShop: 'Total Shops',
            } : {}),

            'assessmentPropertyUse': 'Property Use',
            'assessmentPropertyZone': 'Zones',
            'assessmentPropertyPhoto1': 'Property Photo 1',
            'assessmentPropertyPhoto2': 'Property Photo 2',

            'meters': 'Meters',
            'plotTaggingLocation1': 'Plot Tagging 1',
            'plotTaggingLocation2': 'Plot Tagging 2',
            'plotTaggingLocation3': 'Plot Tagging 3',

            'digitalAddress': 'Digital Address',

            ...(property.isDraftDelivered ? {
                deliveryPersonPhoto: 'Person Photo',
                deliveryPersonName: 'Person Name',
                deliveryPersonMobile: 'Person Mobile',
            } : {}),
        };

        const columns = Object.keys(mandatoryFields);

        for (let index in columns) {

            const column = columns[index];
            const fieldValue = property[column];

            if (column === 'organizationType' && fieldValue === 'Other' && !property.otherOrganizationType) {
                ShowAppMessage(`The ${mandatoryFields[column]} is a required field.`);
                return false;
            } else if (column === 'ownerIdType' && fieldValue === 'Other' && !property.ownerOtherIdType) {
                ShowAppMessage(`The ${mandatoryFields[column]} is a required field.`);
                return false;
            } else if (column === 'meters') {

                for (let i = 0; i < fieldValue.length; i++) {

                    if (!fieldValue[i].number) {
                        ShowAppMessage(`The ${i + 1}. Meter Number is a required field.`);
                        return false;
                    }

                    if (!fieldValue[i].photo) {
                        ShowAppMessage(`The ${i + 1}. Meter Photo is a required field.`);
                        return false;
                    }
                }
            } else if (fieldValue && Array.isArray(fieldValue) && fieldValue.length === 0) {
                ShowAppMessage(`The ${mandatoryFields[column]} is a required field.`);
                return false;

            } else if (fieldValue && !Array.isArray(fieldValue) && typeof (fieldValue) === 'object' && fieldValue.hasOwnProperty('lat') && !fieldValue.lat) {
                ShowAppMessage(`The ${mandatoryFields[column]} is a required field.`);
                return false;

            } else if (!fieldValue) {
                ShowAppMessage(`The ${mandatoryFields[column]} is a required field.`);
                return false;
            }
        }

        return true;

    };

    handleSaveProperty = async () => {

        if (this.props.property.isCompleted && !this.validatorMandatory()) {
            return null;
        }

        try {

            const property = await saveProperty(this.props.property);
            await this.props.loadPropertiesInList(1);

            this.props.navigation.popToTop();

        } catch (error) {
            console.log(error);
        }
    };

    hideLocationPicker = () => this.setState({visibleLocationPicker: false});

    showLocationPicker = () => {

        const {propertyPostCode} = this.props.property;

        if (!propertyPostCode) {
            ShowAppMessage('Property postcode was not generated.');
            return null;
        }

        this.setState({visibleLocationPicker: true});
    };

    render() {
var openLocation="";
        const {
            digitalAddressLocation,
            propertyPostCode,
            serverPropertyId,
            isCompleted,
            isDraftDelivered,
            id,
            deliveryPersonPhoto,
            deliveryPersonName,
            deliveryPersonMobile,
        } = this.props.property;
if(digitalAddressLocation){
    var coord = digitalAddressLocation.split(' ');
openLocation = openLocationCode.encode(coord[0],coord[1]);
}
        return (
            <ScrollView
                keyboardShouldPersistTaps={'always'}
                contentContainerStyle={styles.container}
            >

                <LocationPicker
                    visible={this.state.visibleLocationPicker}
                    onRequestClose={this.hideLocationPicker}
                    onSelected={this.handlePickLocation}
                />

                <View style={styles.top}>

                    <Text style={styles.digitalAddress}>{digitalAddressLocation ? propertyPostCode : 'xxxx'}</Text>

                    <Text style={styles.digitalAddress}>{openLocation || 'xx.xxxx xx.xxxx'}</Text>

                    <View style={{width: 160, alignSelf: 'center', marginTop: 30}}>
                        <Button
                            //disabled={isCompletedSaved}
                            onPress={this.showLocationPicker}
                            label={digitalAddressLocation ? 'Regenerate' : 'Generate'}
                        />
                    </View>
                </View>

                <View style={styles.bottom}>

                    {serverPropertyId && (
                        <View style={{height: 60}}>
                            <Checkbox
                                label="Mark Draft Delivered"
                                value={1}
                                checked={isDraftDelivered}
                                onCheck={this.onChangeIsDraftDelivered}
                                // disabled={isCompletedSaved}
                            />
                        </View>
                    )}

                    {serverPropertyId && isDraftDelivered && (
                        <>
                            <View style={{width: 150}}>
                                <ImagePicker
                                    defaultImage={deliveryPersonPhoto}
                                    onImageSelected={image => this.props.setPropertyField('deliveryPersonPhoto', image.path)}
                                />
                            </View>
                            <View paddingVertical={10}/>
                            <TextInput
                                label={`Recipient Name`}
                                maxLength={200}
                                onChangeText={text => this.props.setPropertyField('deliveryPersonName', text)}
                                value={deliveryPersonName}
                            />
                            <TextInput
                                label={`Recipient Mobile Number`}
                                keyboardType={'phone-pad'}
                                onChangeText={text => this.props.setPropertyField('deliveryPersonMobile', text)}
                                value={deliveryPersonMobile}
                            />
                        </>
                    )}

                    <View style={{height: 60}}>
                        <Checkbox
                            label="Save as complete property"
                            value={1}
                            checked={isCompleted}
                            onCheck={this.onChangeIsCompleteProperty}
                            // disabled={isCompletedSaved}
                        />
                    </View>
                    <View paddingVertical={10}/>
                    <Button
                        // disabled={isCompletedSaved}
                        onPress={this.handleSaveProperty}
                        label={id ? 'Update Property' : 'Save Property'}
                    />
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 10,
        justifyContent: 'space-between',
    },
    row: {
        flexDirection: 'row',
        marginHorizontal: -6,
    },
    col: {
        paddingHorizontal: 6,
        flex: 1,
    },
    digitalAddress: {
        fontSize: 26,
        color: '#333',
        textAlign: 'center',
        marginBottom: 4,
    },
    top: {
        flex: 1,
        justifyContent: 'center',
    },
    bottom: {
        justifyContent: 'flex-end',
        paddingTop: 20,
        paddingBottom: 40,
    },
});

const mapStateToProps = ({addProperty}) => ({property: addProperty});

const mapDispatchToProps = ({
    setPropertyField,
    loadPropertiesInList,
});

export default connect(mapStateToProps, mapDispatchToProps)(DigitalAddressScreen);
