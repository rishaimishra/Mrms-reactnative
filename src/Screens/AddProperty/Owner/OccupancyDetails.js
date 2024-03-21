import React, { PureComponent } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native'
import { connect } from 'react-redux';
import { SelectPicker, TextInput } from "../../../Components/Input";
import { setPropertyField } from "../../../redux/actions/PropertyActions";
import AutoCompleteInput from "../../../Components/AutoCompleteInput";

import MultiPicker from './../../../Components/MultiPicker'

class OccupancyDetails extends PureComponent {

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
            occupancyOptions: [
                {
                    label: 'Owned Tenancy',
                    value: 'Owned Tenancy',
                },
                {
                    label: 'Rented House',
                    value: 'Rented House',
                },
                {
                    label: 'Unoccupied House',
                    value: 'Unoccupied House',
                }
            ]
        };
    }

    onChangeOccupancy = text => this.props.setPropertyField('tenantOccupancy', text);
    onChangeFirstName = text => this.props.setPropertyField('tenantFirstName', text);
    onChangeMiddleName = text => this.props.setPropertyField('tenantMiddleName', text);
    onChangeSurname = text => this.props.setPropertyField('tenantSurname', text);
    onChangeSex = text => this.props.setPropertyField('tenantSex', text);
    onChangeMobile1 = text => this.props.setPropertyField('tenantMobile1', text);
    onChangeMobile2 = text => this.props.setPropertyField('tenantMobile2', text);

    render() {

        const { genderOptions, occupancyOptions } = this.state;

        const {
            tenantOccupancy,
            tenantFirstName,
            tenantMiddleName,
            tenantSurname,
            tenantSex,
            tenantMobile1,
            tenantMobile2,
            isCompletedSaved

        } = this.props.property;

        const { firstNames, lastNames } = this.props.app;

        return (
            <ScrollView
                keyboardShouldPersistTaps={'always'}
                contentContainerStyle={styles.container}
            >
                <MultiPicker
                    label={'Occupancy Type*'}
                    options={occupancyOptions}
                    max={2}
                    onSelected={this.onChangeOccupancy}
                    //disabled={isCompletedSaved}
                    value={tenantOccupancy}
                />

                <View style={styles.row}>
                    <View style={styles.col}>

                        <AutoCompleteInput
                            label={'First Name*'}
                            items={firstNames}
                            maxLength={200}
                            value={tenantFirstName}
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
                            value={tenantMiddleName}
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
                            value={tenantSurname}
                            onChangeText={this.onChangeSurname}
                            autoCapitalize={'words'}
                            //editable={!isCompletedSaved}
                        />
                    </View>
                </View>

                {/*<SelectPicker*/}
                {/*    label={'Sex'}*/}
                {/*    items={genderOptions}*/}
                {/*    onValueChange={this.onChangeSex}*/}
                {/*    value={tenantSex}*/}
                {/*    disabled={isCompletedSaved}*/}
                {/*/>*/}

                <TextInput
                    label={'Mobile #1*'}
                    value={tenantMobile1}
                    keyboardType={'phone-pad'}
                    onChangeText={this.onChangeMobile1}
                    //editable={!isCompletedSaved}
                />

                <TextInput
                    label={'Mobile #2'}
                    value={tenantMobile2}
                    keyboardType={'phone-pad'}
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

const mapStateToProps = ({ addProperty, app }) => ({
    property: addProperty,
    app
});

const mapDispatchToProps = {
    setPropertyField
};

export default connect(mapStateToProps, mapDispatchToProps)(OccupancyDetails);
