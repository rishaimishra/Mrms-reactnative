import React, { PureComponent } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native'
import { connect } from 'react-redux';
import { Checkbox } from "react-native-material-ui";
import { setPropertyField } from "../../../redux/actions/PropertyActions";
import { SelectPicker, TextInput } from "../../../Components/Input";
import Address from "../../../Components/Address";
import ImagePicker from "../../../Components/ImagePicker";
import AutoCompleteInput from "../../../Components/AutoCompleteInput";
import MultiPicker from '../../../Components/MultiPicker';

class LandlordScreen extends PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            genderOptions: [
                {
                    label: 'Male',
                    value: 'm',
                },
                {
                    label: 'Female',
                    value: 'f',
                }
            ],
            idTypes: require('../../../data/idTypes'),
            organizationTypes: require('./../../../data/organizationTypes')
        };
    }

    onChangeIsOrganization = checked => this.props.setPropertyField('isOrganization', checked);
    onChangeFirstName = text => this.props.setPropertyField('ownerFirstName', text);
    onChangeMiddleName = text => this.props.setPropertyField('ownerMiddleName', text);
    onChangeSurnameName = text => this.props.setPropertyField('ownerSurname', text);
    onChangeSex = text => this.props.setPropertyField('ownerSex', text);
    onChangeStreetNumber = text => this.props.setPropertyField('ownerStreetNumber', text);
    onChangeEmail = text => this.props.setPropertyField('ownerEmail', text);
    onChangeStreetName = text => this.props.setPropertyField('ownerStreetName', text);
    onChangeWardNumber = text => this.props.setPropertyField('ownerWardNumber', text);
    onChangeConstituency = text => this.props.setPropertyField('ownerConstituency', text);
    onChangeSection = text => this.props.setPropertyField('ownerSection', text);
    onChangeChiefdom = text => this.props.setPropertyField('ownerChiefdom', text);
    onChangeDistrict = text => this.props.setPropertyField('ownerDistrict', text);
    onChangeProvince = text => this.props.setPropertyField('ownerProvince', text);
    onChangePostcode = text => this.props.setPropertyField('ownerPostcode', text);
    onChangeMobile1 = text => this.props.setPropertyField('ownerMobile1', text);
    onChangeMobile2 = text => this.props.setPropertyField('ownerMobile2', text);
    onChangeTINNumber = text => this.props.setPropertyField('tinNumber', text);
    onChangeIDType = text => this.props.setPropertyField('ownerIdType', text);
    onChangeOtherIdType = text => this.props.setPropertyField('ownerOtherIdType', text);
    onChangeIDNumber = text => this.props.setPropertyField('ownerIdNumber', text);
    onChangeIdPhoto = photo => this.props.setPropertyField('ownerIdPhoto', photo.path);
    onChangeOrganizationName = text => this.props.setPropertyField('organizationName', text);
    onChangeOrganizationType = text => this.props.setPropertyField('organizationType', text);
    onChangeOtherOrganizationType = text => this.props.setPropertyField('otherOrganizationType', text);
    onChangeOrganizationAddress = text => this.props.setPropertyField('organizationAddress', text);
    onChangeIsPropertyInaccessible = checked => this.props.setPropertyField('isPropertyInaccessible', checked);
    onChangePropertyInaccessible = items => this.props.setPropertyField('propertyInaccessible', items);

    render() {

        const {
            ownerFirstName,
            ownerMiddleName,
            ownerSurname,
            ownerSex,
            ownerStreetNumber,
            ownerEmail,
            ownerStreetName,
            ownerWardNumber,
            ownerConstituency,
            ownerSection,
            ownerChiefdom,
            ownerDistrict,
            ownerProvince,
            ownerPostcode,
            ownerMobile1,
            ownerMobile2,
            isCompletedSaved,
            isOrganization,
            tinNumber,
            ownerIdType,
            ownerOtherIdType,
            ownerIdNumber,
            ownerIdPhoto,
            isPropertyInaccessible,
            propertyInaccessible,
            organizationName,
            organizationType,
            otherOrganizationType,
            organizationAddress,
        } = this.props.property;

        const { firstNames, lastNames, streetNames } = this.props.app;

        return (
            <ScrollView
                keyboardShouldPersistTaps={'always'}
                contentContainerStyle={styles.container}
            >
                <View style={{ marginBottom: 10 }}>
                    <Checkbox
                        label="Is Property Inaccessible"
                        value={1}
                        checked={isPropertyInaccessible}
                        onCheck={this.onChangeIsPropertyInaccessible}
                        //disabled={isCompletedSaved}
                    />
                </View>

                {isPropertyInaccessible && (
                    <MultiPicker
                        label={'Property Inaccessible*'}
                        options={this.props.options.propertyInaccessibleOptions}
                        onSelected={this.onChangePropertyInaccessible}
                        //disabled={isCompletedSaved}
                        value={propertyInaccessible}
                    />
                )}

                <View style={{ marginBottom: 10 }}>
                    <Checkbox
                        label="Register as an Organization Property"
                        value={'agree'}
                        checked={isOrganization}
                        onCheck={this.onChangeIsOrganization}
                        //disabled={isCompletedSaved}
                    />
                </View>

                {!isOrganization && (
                    <View style={styles.row}>
                        <View style={styles.col}>
                            <AutoCompleteInput
                                label={'First Name*'}
                                items={firstNames}
                                maxLength={200}
                                value={ownerFirstName}
                                onChangeText={this.onChangeFirstName}
                                autoCapitalize={'words'}
                                //editable={!isCompletedSaved}
                            />
                        </View>

                        <View style={styles.col}>
                            <AutoCompleteInput
                                label={'Middle Name'}
                                items={firstNames}
                                maxLength={200}
                                value={ownerMiddleName}
                                onChangeText={this.onChangeMiddleName}
                                autoCapitalize={'words'}
                                //editable={!isCompletedSaved}
                            />
                        </View>

                        <View style={styles.col}>
                            <AutoCompleteInput
                                label={'Surname*'}
                                items={lastNames}
                                maxLength={200}
                                value={ownerSurname}
                                onChangeText={this.onChangeSurnameName}
                                autoCapitalize={'words'}
                                //editable={!isCompletedSaved}
                            />
                        </View>
                    </View>
                )}
 
                {!isOrganization && (
                    <SelectPicker
                        label={'Sex*'}
                        items={this.state.genderOptions}
                        value={ownerSex}
                        onValueChange={this.onChangeSex}
                        //disabled={isCompletedSaved}
                    />
                )}

                {isOrganization && (
                    <React.Fragment>
                        <TextInput
                            label={'Organization Name'}
                            value={organizationName}
                            maxLength={200}
                            onChangeText={this.onChangeOrganizationName}
                            autoCapitalize={'words'}
                            //editable={!isCompletedSaved}
                        />

                        <SelectPicker
                            label={'Organization Type*'}
                            items={this.state.organizationTypes}
                            value={organizationType}
                            onValueChange={this.onChangeOrganizationType}
                            //disabled={isCompletedSaved}
                        />

                        {organizationType === 'Other' && (
                            <TextInput
                                label={'Enter Organization Type'}
                                value={otherOrganizationType}
                                maxLength={200}
                                onChangeText={this.onChangeOtherOrganizationType}
                                //editable={!isCompletedSaved}
                            />
                        )}

                        <TextInput
                            label={'Organization Address*'}
                            value={organizationAddress}
                            maxLength={200}
                            onChangeText={this.onChangeOrganizationAddress}
                            //editable={!isCompletedSaved}
                        />
                    </React.Fragment>
                )}

                {/*<TextInput*/}
                {/*    label={'Tax Identification Number'}*/}
                {/*    value={tinNumber}*/}
                {/*    maxLength={200}*/}
                {/*    onChangeText={this.onChangeTINNumber}*/}
                {/*    //editable={!isCompletedSaved}*/}
                {/*/>*/}

                {/*{!isOrganization && (*/}
                {/*    <React.Fragment>*/}
                {/*        <SelectPicker*/}
                {/*            label={'ID Type'}*/}
                {/*            items={this.state.idTypes}*/}
                {/*            value={ownerIdType}*/}
                {/*            onValueChange={this.onChangeIDType}*/}
                {/*            //disabled={isCompletedSaved}*/}
                {/*        />*/}

                {/*        {ownerIdType === 'Other' && (*/}
                {/*            <TextInput*/}
                {/*                label={'Enter ID Type'}*/}
                {/*                value={ownerOtherIdType}*/}
                {/*                maxLength={200}*/}
                {/*                onChangeText={this.onChangeOtherIdType}*/}
                {/*               // editable={!isCompletedSaved}*/}
                {/*            />*/}
                {/*        )}*/}

                {/*        <TextInput*/}
                {/*            label={'ID Number'}*/}
                {/*            value={ownerIdNumber}*/}
                {/*            maxLength={200}*/}
                {/*            onChangeText={this.onChangeIDNumber}*/}
                {/*            //editable={!isCompletedSaved}*/}
                {/*        />*/}

                {/*        <View style={{width: 150, marginBottom: 15}}>*/}
                {/*            <ImagePicker*/}
                {/*                text={'ID Photo'}*/}
                {/*                onImageSelected={this.onChangeIdPhoto}*/}
                {/*                defaultImage={ownerIdPhoto}*/}
                {/*            />*/}
                {/*        </View>*/}
                {/*    </React.Fragment>*/}
                {/*)}*/}

                <TextInput
                    label={'Street Number'}
                    value={ownerStreetNumber}
                    maxLength={200}
                    onChangeText={this.onChangeStreetNumber}
                    //editable={!isCompletedSaved}
                />

                <AutoCompleteInput
                    label={'Street Name'}
                    items={streetNames}
                    maxLength={200}
                    value={ownerStreetName}
                    onChangeText={this.onChangeStreetName}
                    autoCapitalize={'words'}
                    //editable={!isCompletedSaved}
                />

                <Address
                    wardNumber={ownerWardNumber}
                    constituency={ownerConstituency}
                    section={ownerSection}
                    chiefdom={ownerChiefdom}
                    district={ownerDistrict}
                    province={ownerProvince}
                    postcode={ownerPostcode}

                    onChangeWardNumber={this.onChangeWardNumber}
                    onChangeConstituency={this.onChangeConstituency}
                    onChangeSection={this.onChangeSection}
                    onChangeChiefdom={this.onChangeChiefdom}
                    onChangeDistrict={this.onChangeDistrict}
                    onChangeProvince={this.onChangeProvince}
                    onChangePostcode={this.onChangePostcode}
                    //editable={!isCompletedSaved}
                />
<TextInput
                    label={'Email Id'}
                    value={ownerEmail}
                    maxLength={200}
                    onChangeText={this.onChangeEmail}
                    //editable={!isCompletedSaved}
                />
                <TextInput
                    label={'Mobile #1*'}
                    value={ownerMobile1}
                    keyboardType={'phone-pad'}
                    maxLength={15}
                    onChangeText={this.onChangeMobile1}
                    //editable={!isCompletedSaved}
                />

                <TextInput
                    label={'Mobile #2'}
                    value={ownerMobile2}
                    keyboardType={'phone-pad'}
                    maxLength={15}
                    onChangeText={this.onChangeMobile2}
                    //editable={!isCompletedSaved}
                />
            </ScrollView>
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
    }
});

const mapStateToProps = ({ addProperty, app, options }) => ({
    property: addProperty,
    app,
    options
});

const mapDispatchToProps = {
    setPropertyField
};

export default connect(mapStateToProps, mapDispatchToProps)(LandlordScreen);
