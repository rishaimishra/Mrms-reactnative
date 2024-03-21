import React, { PureComponent } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native'
import { connect } from 'react-redux';
import { TextInput } from "../../../Components/Input";
import Address from "../../../Components/Address";
import { Checkbox } from "react-native-material-ui";
import AutoCompleteInput from "../../../Components/AutoCompleteInput";
import { setPropertyField, setUseLandlordAddress } from "../../../redux/actions/PropertyActions";

class PropertyScreen extends PureComponent {

    onChangeStreetNumber = text => this.props.setPropertyField('propertyStreetNumber', text);
    onChangeStreetName = text => this.props.setPropertyField('propertyStreetName', text);
    onChangeWardNumber = text => this.props.setPropertyField('propertyWardNumber', text);
    onChangeConstituency = text => this.props.setPropertyField('propertyConstituency', text);
    onChangeSection = text => this.props.setPropertyField('propertySection', text);
    onChangeChiefdom = text => this.props.setPropertyField('propertyChiefdom', text);
    onChangeDistrict = text => this.props.setPropertyField('propertyDistrict', text);
    onChangeProvince = text => this.props.setPropertyField('propertyProvince', text);
    onChangePostcode = text => this.props.setPropertyField('propertyPostCode', text);

    onCheckLandlordAddress = checked => this.props.setUseLandlordAddress(checked);

    render() {

        const {
            propertyStreetNumber,
            propertyStreetName,
            propertyWardNumber,
            propertyConstituency,
            propertySection,
            propertyChiefdom,
            propertyDistrict,
            propertyProvince,
            propertyPostCode,
            useLandLordAddress,
            isCompletedSaved
        } = this.props.property;

        const { streetNames } = this.props.app;

        return (
            <ScrollView
                keyboardShouldPersistTaps={'always'}
                contentContainerStyle={styles.container}
            >

                <View height={30}>
                    <Checkbox
                        label="Same as Landlord Address"
                        value={'agree'}
                        checked={useLandLordAddress}
                        onCheck={this.onCheckLandlordAddress}
                        //disabled={isCompletedSaved}
                    />
                </View>

                <View paddingVertical={6} />

                <TextInput
                    label={'Street Number*'}
                    maxLength={200}
                    onChangeText={this.onChangeStreetNumber}
                    value={propertyStreetNumber}
                    editable={!useLandLordAddress}
                />

                <AutoCompleteInput
                    label={'Street Name*'}
                    items={streetNames}
                    maxLength={200}
                    value={propertyStreetName}
                    onChangeText={this.onChangeStreetName}
                    editable={!useLandLordAddress}
                />

                <Address
                    wardNumber={propertyWardNumber}
                    constituency={propertyConstituency}
                    section={propertySection}
                    chiefdom={propertyChiefdom}
                    district={propertyDistrict}
                    province={propertyProvince}
                    postcode={propertyPostCode}

                    onChangeWardNumber={this.onChangeWardNumber}
                    onChangeConstituency={this.onChangeConstituency}
                    onChangeSection={this.onChangeSection}
                    onChangeChiefdom={this.onChangeChiefdom}
                    onChangeDistrict={this.onChangeDistrict}
                    onChangeProvince={this.onChangeProvince}
                    onChangePostcode={this.onChangePostcode}

                    editable={!useLandLordAddress}
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

const mapStateToProps = ({ addProperty, app }) => ({
    property: addProperty,
    app
});

const mapDispatchToProps = {
    setPropertyField,
    setUseLandlordAddress
};

export default connect(mapStateToProps, mapDispatchToProps)(PropertyScreen);
