import React, {PureComponent} from 'react';
import {InteractionManager, StyleSheet, View} from "react-native";
import { connect } from 'react-redux'
import {SelectPicker, TextInput} from "../Input";
import {
    chiefdomFromWardOptions,
    constituencyFromWardOptions,
    districtFromWardOptions,
    provinceFromWardOptions,
    sectionFromWardOptions,
    prefixFromWardOptions,
    wardOptions
} from "../../database/BoundryDelimination";

class Address extends PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            wards: [],
            sections: [],
            chiefdom: [],
        };

        this.unmounted = false;
    }

    generatePostCodeFromWardAndProvince = (prefix,ward, province) => {

        // const str = "" + ward;
        // const pad = "000";

        // ward = pad.substring(0, pad.length - str.length) + str;

        // const provinceArr = province.split(" ");

        // const prefix = provinceArr.map((item) => {
        //     return item.substr(0, 1);
        // }).join('');

        // return prefix + (provinceArr.length === 1 ? 'P' : '') + ward;
        if(prefix=="null"){
            prefix="";
         }
 
 
         return prefix+ward;
    };

    onChangeWard = async (ward) => {

        await this.props.onChangeWardNumber(ward)

        const constituencies = await constituencyFromWardOptions(ward);
        const sections = await sectionFromWardOptions(ward);
        const chiefdom = await chiefdomFromWardOptions(ward);
        const districts = await districtFromWardOptions(ward);
        const provinces = await provinceFromWardOptions(ward);
        const prefix = await prefixFromWardOptions(ward);

        let postcode = '';

        if (ward) {
            postcode = this.generatePostCodeFromWardAndProvince(prefix[0].label,ward, provinces[0].label);
            this.props.onChangePostcode(postcode);
        }

        this.props.onChangeProvince(ward ? provinces[0].label : '');
        this.props.onChangeDistrict(ward ? districts[0].label : '');
        this.props.onChangeConstituency(ward ? constituencies[0].label : '');

        !this.unmounted && this.setState({
            constituencies,
            sections,
            chiefdom,
            districts
        });
    };

    componentDidMount(): void {

        this.interation = InteractionManager.runAfterInteractions(async () => {
            try {

                const wards = await wardOptions();
                !this.unmounted && this.setState({wards}, () => {

                    if (! this.props.wardNumber && this.props.defaultWard){
                        this.props.onChangeWardNumber(this.props.defaultWard);
                    }

                });

            } catch (error) {
                console.log('Ward Error', error);
            }
        });
    }

    componentWillUnmount(): void {
        this.unmounted = true;
        InteractionManager.clearInteractionHandle(this.interation);
    }

    render() {

        const {
            onChangeConstituency,
            onChangeSection,
            onChangeChiefdom,
            onChangeDistrict,
            onChangeProvince,

            wardNumber,
            constituency,
            section,
            chiefdom,
            district,
            province,
            postcode,
            editable = true
        } = this.props;

        return (
            <React.Fragment>
                <View style={styles.row}>

                   

                    <View style={styles.col}>

                        <SelectPicker
                            label={'Ward Number*'}
                            items={this.state.wards}
                            onValueChange={this.onChangeWard}
                            value={wardNumber}
                            disabled={!editable}
                        />
                        
                    </View>
                    <View style={styles.col}>

                        

                        <SelectPicker
                            label={'Section*'}
                            items={this.state.sections}
                            onValueChange={onChangeSection}
                            value={section}
                            disabled={!editable}
                        />

                    </View>
                </View>

                <View style={styles.row}>
                    <View style={styles.col}>
                    <TextInput
                            editable={false}
                            label={'Constituency*'}
                            value={constituency.toString()}
                            onChangeText={onChangeConstituency}
                        />
                    </View>


                    <View style={styles.col}>
                        <SelectPicker
                            label={'Chiefdom*'}
                            items={this.state.chiefdom}
                            onValueChange={onChangeChiefdom}
                            value={chiefdom}
                            disabled={!editable}
                        />
                    </View>
                </View>

                <View style={styles.row}>
                    <View style={styles.col}>
                        <TextInput
                            editable={false}
                            label={'District*'}
                            value={district}
                            onChangeText={onChangeDistrict}
                        />
                    </View>
                    <View style={styles.col}>
                        <TextInput
                            editable={false}
                            label={'Province'}
                            value={province}
                            onChangeText={onChangeProvince}
                        />
                    </View>
                </View>

                <TextInput
                    editable={false}
                    label={'Postcode'}
                    value={postcode}
                />
            </React.Fragment>
        );
    }
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        marginHorizontal: -6
    },
    col: {
        paddingHorizontal: 6,
        flex: 1
    }
});

const mapStateToProps = store => ({
    defaultWard: store.app.defaultWard
});

export default connect(mapStateToProps)(Address);