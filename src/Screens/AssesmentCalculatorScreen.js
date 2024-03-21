import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import NumberFormat from 'react-number-format';
import {useSelector} from 'react-redux';
import {useFields} from '../hooks/useFields';
import MultiPicker from '../Components/MultiPicker';
import _ from 'lodash';
import {SelectPicker, TextInput} from '../Components/Input';
import {Checkbox} from 'react-native-material-ui';
import Colors from '../Colors';
import {Button} from '../Components/Button';
import AppLink from 'react-native-app-link';

const range = new Array(20).fill('a').map((item, index) => {
    return {
        label: (index + 1).toString(),
        value: (index + 1),
    };
});

const VALUE_ADDED_MAST_ID = 8;
const VALUE_SHOP_ID = 9;

const AssessmentCalculatorScreen = () => {

    const {
        categories,
        wallMaterials,
        types,
        valueAdded,
        roofMaterials,
        dimensions,
        district,
        propertyUse,
        swimmingPool,
        zones,
        sigma_pay_url,
        gatedCommunity: gatedCommunityAmount,
    } = useSelector((state) => state.options);

    const {getField, setField} = useFields();

    const getSubTotal = () => {

        let productCategoryAmount = 1;

        getField('propertyCategory', []).map(item => {
            productCategoryAmount *= item.amount;
        });

        const materialUsedOnWall = getField('materialUsedOnWall');
        const materialUsedOnRoof = getField('materialUsedOnRoof');
       // const propertyDimension = getField('propertyDimension');
        const propertyDistrict = getField('propertyDistrict');

        const assessmentSwimmingPool = getField('swimmingPool');
        const valuesAdded = getField('valuesAdded', []);
        const assessmentTotalCommunicationMast = getField('totalCommunicationMast');
        const assessmentTotalShop = getField('totalShops');
        const isGatedCommunity = getField('isGatedCommunity', false);
        const assessmentPropertyUse = getField('propertyUse');
        const assessmentPropertyZone = getField('zone');
        const propertyType = getField('propertyType', []);


        const typeAmount = _.sumBy(propertyType, 'amount');
        const materialUsedOnWallAmount = materialUsedOnWall ? _.find(wallMaterials, {value: materialUsedOnWall}).amount : 0;
        const materialUsedOnRoofAmount = materialUsedOnRoof ? _.find(roofMaterials, {value: materialUsedOnRoof}).amount : 0;
        //const propertyDimensionAmount = propertyDimension ? _.find(dimensions, {value: propertyDimension}).amount : 1;
        const propertyDistrictAmount = propertyDistrict ? _.find(district, {value: propertyDistrict}).amount : 1;
//alert(propertyDistrictAmount)
        const swimmingPoolAmount = assessmentSwimmingPool ? _.find(swimmingPool, {value: assessmentSwimmingPool}).amount : 0;

        const finalValueAdded = valuesAdded.map(item => {

            let newItem = {...item};

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

        const propertyUseAmount = assessmentPropertyUse ? _.find(propertyUse, {value: assessmentPropertyUse}).amount : 1;
        const propertyZoneAmount = assessmentPropertyZone ? _.find(zones, {value: assessmentPropertyZone}).amount : 1;

        const totalAdditions = materialUsedOnWallAmount + materialUsedOnRoofAmount + valueAddedAmount;

        //const total = ((totalAdditions * (typeAmount * dis * propertyUseAmount) * gratedCommunity) + swimmingPoolAmount);
        const formula=(propertyDistrictAmount * (getField('length', 0) ? parseFloat(getField('length')) : 0) * (getField('breadth', 0) ? parseFloat(getField('breadth')) : 0) );
        const total =(((formula+(((totalAdditions*(propertyUseAmount))*(propertyZoneAmount))*(typeAmount)))*(gratedCommunity))+swimmingPoolAmount)*1
      //  const total = ((formula + totalAdditions * (typeAmount * dis * propertyUseAmount) * gratedCommunity) + swimmingPoolAmount);
//const total =((formula+(((totalAdditions*propertyUseAmount*propertyZoneAmount)*typeAmount))*gratedCommunity)+swimmingPoolAmount)*1
//const total =(((formula+((((totalAdditions)*(propertyUseAmount))*(propertyZoneAmount))*(typeAmount)))*(gratedCommunity))+swimmingPoolAmount)*1
       // return (total > 0 ? total / propertyZoneAmount : 0) / productCategoryAmount;
       return total;
    };

    const getGSTTotal = () => {
        const subTotal = getSubTotal();
        return subTotal > 0 ? subTotal * 15 / 100 : 0;
    };

    const getGrandTotal = () => {
        //return this.getSubTotal() + this.getGSTTotal();

        return getSubTotal();
    };

    const renderMoney = (formattedMoney) => {
        return <Text>{formattedMoney}</Text>;
    };
    handleApp= async () => {
      
        AppLink.maybeOpenURL('https://play.google.com/store/apps/details?id=com.dpm.payment', { "Sigma Payments", "", "In", 'com.dpm.payment' }).then(() => {
            // do stuff
          })
          .catch((err) => {
            // handle error
          });
    }
    return (
        <ScrollView
            contentContainerStyle={styles.container}
        >

            <MultiPicker
                label={'Property Category*'}
                options={categories}
                value={getField('propertyCategory')}
                onSelected={value => setField('propertyCategory', value)}
                //disabled={isCompletedSaved}
            />

            {_.findIndex(getField('propertyCategory'), {value: 6}) !== -1 && (
                <React.Fragment>
                    <TextInput
                        label={'Compound Name'}
                        onChangeText={value => setField('compoundHouseName', value)}
                        value={getField('compoundHouseName')}
                        //editable={!isCompletedSaved}
                    />

                    <SelectPicker
                        label={'Number of Houses in Compound'}
                        items={range}
                        onValueChange={value => setField('numOfHousesInCompound', value)}
                        value={getField('numOfHousesInCompound')}
                        //disabled={isCompletedSaved}
                    />
                </React.Fragment>
            )}

            <MultiPicker
                label={'Property Type*'}
                options={types}
                value={getField('propertyType')}
                onSelected={value => setField('propertyType', value)}
                max={2}
                //disabled={isCompletedSaved}
                assessment
            />

            <SelectPicker
                label={'Material Used on Wall*'}
                items={wallMaterials}
                onValueChange={value => setField('materialUsedOnWall', value)}
                value={getField('materialUsedOnWall')}
                //disabled={isCompletedSaved}
            />

            <SelectPicker
                label={'Material Used on Roof*'}
                items={roofMaterials}
                onValueChange={value => setField('materialUsedOnRoof', value)}
                value={getField('materialUsedOnRoof')}
                //disabled={isCompletedSaved}
            />


            <Text style={{color: '#333', marginBottom: 5}}>Property Dimension Calculator</Text>

            <View style={styles.row}>
                <View style={styles.col}>
                    <TextInput
                        label={'Length'}
                        onChangeText={value => setField('length', value)}
                        keyboardType={'numeric'}
                    />
                </View>
                <View style={styles.col}>
                    <TextInput
                        label={'Breadth'}
                        onChangeText={value => setField('breadth', value)}
                        keyboardType={'numeric'}
                    />
                </View>
            </View>


            <Text style={styles.calcResult}>Dimension in Sq.Meters: <Text
                style={styles.calcAmount}>{(getField('length', 0) ? parseFloat(getField('length')) : 0) * (getField('breadth', 0) ? parseFloat(getField('breadth')) : 0)}</Text></Text>

            <View paddingVertical={10}/>

            {/* <SelectPicker
                label={'Property Dimension*'}
                items={dimensions}
                onValueChange={value => setField('propertyDimension', value)}
                value={getField('propertyDimension')}
                //disabled={isCompletedSaved}
            /> */}
              <SelectPicker
                label={'Property District*'}
                items={district}
               onValueChange={value => setField('propertyDistrict', value)}
                value={getField('propertyDistrict')}
                //disabled={isCompletedSaved}
            />

            <MultiPicker
                label={'Value Added*'}
                options={valueAdded}
                value={getField('valuesAdded')}
                onSelected={value => setField('valuesAdded', value)}
                //disabled={isCompletedSaved}
            />

            {_.findIndex(getField('valuesAdded'), {value: VALUE_ADDED_MAST_ID}) !== -1 && (
                <SelectPicker
                    label={'Total Communication Masts*'}
                    items={range}
                    value={getField('totalCommunicationMast')}
                    onValueChange={value => setField('totalCommunicationMast', value)}
                    //disabled={isCompletedSaved}
                />
            )}

            {_.findIndex(getField('valuesAdded'), {value: VALUE_SHOP_ID}) !== -1 && (
                <SelectPicker
                    label={'Total Shops*'}
                    items={range}
                    value={getField('totalShops')}
                    onValueChange={(value => setField('totalShops', value))}
                    //disabled={isCompletedSaved}
                />
            )}

            <SelectPicker
                label={'Swimming Pool'}
                items={swimmingPool}
                value={getField('swimmingPool')}
                onValueChange={value => setField('swimmingPool', value)}
                //disabled={isCompletedSaved}
            />

            <SelectPicker
                label={'Property Use*'}
                items={propertyUse}
                value={getField('propertyUse')}
                onValueChange={value => setField('propertyUse', value)}
                //disabled={isCompletedSaved}
            />

            <SelectPicker
                label={'Zones*'}
                items={zones}
                value={getField('zone')}
                onValueChange={value => setField('zone', value)}
                //disabled={isCompletedSaved}
            />

            <Checkbox
                label={'Gated Community'}
                value={2}
                checked={getField('isGatedCommunity', false)}
                //disabled={isCompletedSaved}
                onCheck={checked => setField('isGatedCommunity', checked)}
            />

            <View paddingVertical={10}/>

            <View style={styles.gstContainer}>

                <View style={styles.contentLeft}>
                    <Text style={styles.mainTitle}>Estimated Cost</Text>
                </View>
                <View style={styles.contentRight}>
                    <Text style={styles.gstVal}><NumberFormat
                        renderText={renderMoney}
                        value={getGrandTotal().toFixed(2)}
                        displayType={'text'}
                        thousandSeparator={true}
                        prefix={'Le'}
                    /></Text>
                </View>
                
            </View>
            {sigma_pay_url?(<Button label={'Pay'} onPress={this.handleApp}/>):null}
            

        </ScrollView>
    );

};

AssessmentCalculatorScreen.navigationOptions = {
    title: 'Assessment Calculator',
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingHorizontal: 10,
        paddingTop: 20,
        paddingBottom: 76,
    },
    row: {
        flexDirection: 'row',
        marginHorizontal: -6,
    },
    col: {
        paddingHorizontal: 6,
        flex: 1,
    },
    gstContainer: {
        marginBottom: 10,
        backgroundColor: '#f6f6f6',
        borderWidth: 2,
        borderColor: '#f1f1f1',
        paddingVertical: 14,
        paddingHorizontal: 20,
        flexDirection: 'row',
        borderRadius: 5,
    },
    gstRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    gstTitle: {
        fontSize: 15,
        color: '#333',
        marginRight: 10,
        textAlign: 'right',
        marginVertical: 4,
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
        fontWeight: '600',
    },
    contentLeft: {
        flex: 1,
        justifyContent: 'center',
    },
    contentRight: {
        flex: 1,
    },
    bold: {
        fontWeight: '600',
    },
    calcResult: {
        color: '#333',
        fontSize: 14,
        marginTop: -5,
    },
    calcAmount: {
        color: Colors.primary,
        fontSize: 16,
    },
});

export default AssessmentCalculatorScreen;
