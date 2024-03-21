import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Checkbox } from 'react-native-material-ui'
import _ from 'lodash';
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import NumberFormat from 'react-number-format';
import { SelectPicker, TextInput } from "../../../Components/Input";
import MultiPicker from "../../../Components/MultiPicker";
import { setPropertyField } from "../../../redux/actions/PropertyActions";
import Colors from "../../../Colors";

const VALUE_ADDED_MAST_ID = 8;
const VALUE_SHOP_ID = 9;

class GeneralDetailScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            length: 0,
            breath: 0,
            range: new Array(20).fill('a').map((item, index) => {
                return {
                    label: (index + 1).toString(),
                    value: (index + 1),
                }
            })
        };
    }

    onChangeLength = length => this.setState({ length });
    onChangeBreath = breath => this.setState({ breath });

    onChangePropertyCategory = text => this.props.setPropertyField('assessmentPropertyCategory', text);
    onChangeType = text => this.props.setPropertyField('assessmentType', text);
    onChangeTypeTotal = text => this.props.setPropertyField('assessmentTypeTotal', text);

    onChangeMaterialUsedOnWall = text => this.props.setPropertyField('assessmentMaterialUsedOnWall', text);
    onChangeMaterialUsedOnRoof = text => this.props.setPropertyField('assessmentMaterialUsedOnRoof', text);
    onChangePropertyDimension = text => this.props.setPropertyField('assessmentPropertyDimension', text);
    onChangeValueAdded = text => this.props.setPropertyField('assessmentValueAdded', text);
    onChangePropertyUse = text => this.props.setPropertyField('assessmentPropertyUse', text);
    onChangePropertyZone = text => this.props.setPropertyField('assessmentPropertyZone', text);

    onTotalCompoundHouseChange = text => this.props.setPropertyField('assessmentTotalCompoundHouse', text);
    onCompoundNameChange = text => this.props.setPropertyField('assessmentCompoundHouseName', text);
    onChangeTotalCommunicationMast = text => this.props.setPropertyField('assessmentTotalCommunicationMast', text);
    onChangeTotalShop = text => this.props.setPropertyField('assessmentTotalShop', text);
    onChangeSwimmingPool = text => this.props.setPropertyField('assessmentSwimmingPool', text);
    onChangeGatedCommunity = checked => this.props.setPropertyField('isGatedCommunity', checked);

    getSubTotal = () => {

        const {
            assessmentPropertyCategory,
            assessmentType,
            assessmentTypeTotal,
            assessmentMaterialUsedOnWall,
            assessmentMaterialUsedOnRoof,
            assessmentPropertyDimension,
            assessmentValueAdded,
            assessmentPropertyUse,
            assessmentPropertyZone,
            assessmentTotalCommunicationMast,
            assessmentTotalShop,
            isGatedCommunity,
            assessmentSwimmingPool
        } = this.props.property;

        const {
            categories,
            wallMaterials,
            roofMaterials,
            dimensions,
            district,
            propertyUse,
            zones,
            swimmingPool,
            gatedCommunity: gatedCommunityAmount
        } = this.props.options;

        let productCategoryAmount = 1;

        assessmentPropertyCategory.map(item => {
            productCategoryAmount *= item.amount
        });

        const typeAmount = _.sumBy(assessmentType, 'amount');
        const materialUsedOnWallAmount = assessmentMaterialUsedOnWall ? _.find(wallMaterials, { value: assessmentMaterialUsedOnWall }).amount : 0;
        const materialUsedOnRoofAmount = assessmentMaterialUsedOnRoof ? _.find(roofMaterials, { value: assessmentMaterialUsedOnRoof }).amount : 0;
        const propertyDimensionAmount = assessmentPropertyDimension ? _.find(dimensions, { value: assessmentPropertyDimension }).amount : 1;
        const swimmingPoolAmount = assessmentSwimmingPool ? _.find(swimmingPool, { value: assessmentSwimmingPool }).amount : 0;

        const finalValueAdded = assessmentValueAdded.map(item => {

            let newItem = { ...item };

            if (item.value === VALUE_ADDED_MAST_ID) {
                newItem.amount = (item.amount * (assessmentTotalCommunicationMast ? parseInt(assessmentTotalCommunicationMast) : 0));
            }

            if (item.value === VALUE_SHOP_ID) {
                newItem.amount = (item.amount * (assessmentTotalShop ? parseInt(assessmentTotalShop) : 0));
            }

            return newItem;
        });

        const gratedCommunity = isGatedCommunity ? gatedCommunityAmount : 1;
        const valueAddedAmount = _.sumBy(finalValueAdded, 'amount');

        const propertyUseAmount = assessmentPropertyUse ? _.find(propertyUse, { value: assessmentPropertyUse }).amount : 1;
        const propertyZoneAmount = assessmentPropertyZone ? _.find(zones, { value: assessmentPropertyZone }).amount : 1

        const totalAdditions = materialUsedOnWallAmount + materialUsedOnRoofAmount + valueAddedAmount;

        const total = ((totalAdditions * (typeAmount * propertyDimensionAmount * propertyUseAmount) * gratedCommunity) + swimmingPoolAmount);

        return (total > 0 ? total / propertyZoneAmount : 0) / productCategoryAmount;
    };

    getGSTTotal = () => {
        const subTotal = this.getSubTotal();
        return subTotal > 0 ? subTotal * 15 / 100 : 0
    };

    getGrandTotal = () => {
        //return this.getSubTotal() + this.getGSTTotal();

        return this.getSubTotal();
    };

    renderMoney = (formattedMoney) => {
        return <Text>{formattedMoney}</Text>
    };

    render() {

        const {
            categories,
            wallMaterials,
            types,
            valueAdded,
            roofMaterials,
            dimensions,
            propertyUse,
            swimmingPool,
            zones
        } = this.props.options;

        const {
            assessmentPropertyCategory,
            assessmentType,
            assessmentTypeTotal,
            assessmentMaterialUsedOnWall,
            assessmentMaterialUsedOnRoof,
            assessmentPropertyDimension,
            assessmentValueAdded,
            assessmentSwimmingPool,
            assessmentPropertyUse,
            assessmentPropertyZone,
            isCompletedSaved,
            assessmentTotalCompoundHouse,
            assessmentCompoundHouseName,
            assessmentTotalCommunicationMast,
            assessmentTotalShop,
            isGatedCommunity
        } = this.props.property;

        return (
            <ScrollView
                keyboardShouldPersistTaps={'always'}
                contentContainerStyle={styles.container}
            >

                <MultiPicker
                    label={'Property Category*'}
                    options={categories}
                    value={assessmentPropertyCategory}
                    onSelected={this.onChangePropertyCategory}
                    //disabled={isCompletedSaved}
                />

                {_.findIndex(assessmentPropertyCategory, { value: 6 }) !== -1 && (
                    <React.Fragment>
                        <TextInput
                            label={'Compound Name'}
                            onChangeText={this.onCompoundNameChange}
                            value={assessmentCompoundHouseName}
                            //editable={!isCompletedSaved}
                        />

                        <SelectPicker
                            label={'Number of Houses in Compound'}
                            items={this.state.range}
                            onValueChange={this.onTotalCompoundHouseChange}
                            value={assessmentTotalCompoundHouse}
                            //disabled={isCompletedSaved}
                        />
                    </React.Fragment>
                )}

                <MultiPicker
                    label={'Property Type Habitat*'}
                    options={types}
                    value={assessmentType}
                    onSelected={this.onChangeType}
                    max={2}
                    //disabled={isCompletedSaved}
                    assessment
                />
 <MultiPicker
                    label={'Property Type Total*'}
                    options={types}
                    value={assessmentTypeTotal}
                    onSelected={this.onChangeTypeTotal}
                    max={2}
                    //disabled={isCompletedSaved}
                    assessment
                />
                <SelectPicker
                    label={'Material Used on Wall*'}
                    items={wallMaterials}
                    onValueChange={this.onChangeMaterialUsedOnWall}
                    value={assessmentMaterialUsedOnWall}
                    //disabled={isCompletedSaved}
                />

                <SelectPicker
                    label={'Material Used on Roof*'}
                    items={roofMaterials}
                    onValueChange={this.onChangeMaterialUsedOnRoof}
                    value={assessmentMaterialUsedOnRoof}
                    //disabled={isCompletedSaved}
                />


                <Text style={{ color: '#333', marginBottom: 5 }}>Property Dimension Calculator</Text>

                <View style={styles.row}>
                    <View style={styles.col}>
                        <TextInput
                            label={'Length'}
                            onChangeText={this.onChangeLength}
                            keyboardType={'numeric'}
                        />
                    </View>
                    <View style={styles.col}>
                        <TextInput
                            label={'Breadth'}
                            onChangeText={this.onChangeBreath}
                            keyboardType={'numeric'}
                        />
                    </View>
                </View>

                <Text style={styles.calcResult}>Dimension in Sq.Meters: <Text
                    style={styles.calcAmount}>{(this.state.length ? parseFloat(this.state.length) : 0) * (this.state.breath ? parseFloat(this.state.breath) : 0)}</Text></Text>

                <View paddingVertical={10} />

                <SelectPicker
                    label={'Property Dimension*'}
                    items={dimensions}
                    onValueChange={this.onChangePropertyDimension}
                    value={assessmentPropertyDimension}
                    //disabled={isCompletedSaved}
                />

                <MultiPicker
                    label={'Value Added*'}
                    options={valueAdded}
                    value={assessmentValueAdded}
                    onSelected={this.onChangeValueAdded}
                    //disabled={isCompletedSaved}
                />

                {_.findIndex(assessmentValueAdded, { value: VALUE_ADDED_MAST_ID }) !== -1 && (
                    <SelectPicker
                        label={'Total Communication Masts*'}
                        items={this.state.range}
                        value={assessmentTotalCommunicationMast}
                        onValueChange={this.onChangeTotalCommunicationMast}
                        //disabled={isCompletedSaved}
                    />
                )}

                {_.findIndex(assessmentValueAdded, { value: VALUE_SHOP_ID }) !== -1 && (
                    <SelectPicker
                        label={'Total Shops*'}
                        items={this.state.range}
                        value={assessmentTotalShop}
                        onValueChange={this.onChangeTotalShop}
                        //disabled={isCompletedSaved}
                    />
                )}

                <SelectPicker
                    label={'Swimming Pool'}
                    items={swimmingPool}
                    value={assessmentSwimmingPool}
                    onValueChange={this.onChangeSwimmingPool}
                    //disabled={isCompletedSaved}
                />

                <SelectPicker
                    label={'Property Use*'}
                    items={propertyUse}
                    value={assessmentPropertyUse}
                    onValueChange={this.onChangePropertyUse}
                    //disabled={isCompletedSaved}
                />

                <SelectPicker
                    label={'Zones*'}
                    items={zones}
                    value={assessmentPropertyZone}
                    onValueChange={this.onChangePropertyZone}
                    //disabled={isCompletedSaved}
                />

                <Checkbox
                    label={'Gated Community'}
                    value={2}
                    checked={isGatedCommunity}
                    //disabled={isCompletedSaved}
                    onCheck={this.onChangeGatedCommunity}
                />

                <View paddingVertical={10} />

                <View style={styles.gstContainer}>

                    <View style={styles.contentLeft}>
                        <Text style={styles.mainTitle}>Estimated Cost</Text>
                    </View>
                    <View style={styles.contentRight}>
                        <Text style={styles.gstVal}><NumberFormat
                            renderText={this.renderMoney}
                            value={this.getGrandTotal().toFixed(2)}
                            displayType={'text'}
                            thousandSeparator={true}
                            prefix={'Le'}
                        /></Text>
                    </View>

                </View>

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
    },
    gstContainer: {
        marginBottom: 10,
        backgroundColor: '#f6f6f6',
        borderWidth: 2,
        borderColor: '#f1f1f1',
        paddingVertical: 14,
        paddingHorizontal: 20,
        flexDirection: 'row',
        borderRadius: 5
    },
    gstRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    gstTitle: {
        fontSize: 15,
        color: '#333',
        marginRight: 10,
        textAlign: 'right',
        marginVertical: 4
    },
    gstVal: {
        color: '#333',
        fontSize: 16,
        marginVertical: 4,
        textAlign: 'right',
    },
    mainTitle: {
        fontSize: 16,
        color: Colors.primary,
        fontWeight: '600'
    },
    contentLeft: {
        flex: 1,
        justifyContent: 'center'
    },
    contentRight: {
        flex: 1
    },
    bold: {
        fontWeight: '600'
    },
    calcResult: {
        color: '#333',
        fontSize: 14,
        marginTop: -5
    },
    calcAmount: {
        color: Colors.primary,
        fontSize: 16,
    }
});

const mapStateToProps = ({ options, addProperty }) => ({ options, property: addProperty });

const mapDispatchToProps = {
    setPropertyField
};

export default connect(mapStateToProps, mapDispatchToProps)(GeneralDetailScreen);
