import React, { Component } from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import _ from 'lodash'
import { TextInput } from "../Input";
import Colors from "../../Colors";
import { HeaderButton } from "../Button";
import { ListItem } from 'react-native-material-ui';

class MultiPickerCouncilAdjustment extends Component {

    static defaultProps = {
        onSelected: f => f,
        max: null,
        value: [],
        disabled: false,
        assessment: false
    };

    constructor(props) {
        super(props);

        const selectedItems = props.max !== null && this.props.value.length > props.max ? [] : this.props.value;
        
        this.state = {
            showOptions: false,
            tempSelected: selectedItems,
            selected: selectedItems
        };
    }

    showOptions = () => {
        if (!this.props.disabled) {
            this.setState({ showOptions: true })
        }
    };

    hideOptions = () => this.setState({ showOptions: false });

    keyExtractor = (item) => item.value.toString();

    renderItem = ({ item }) => {
        let electricityFlag = false;
        let waterFlag = false;
        const rightElement = _.findIndex(this.state.tempSelected, { value: item.value }) !== -1 ?
            <Icon size={26} color={Colors.primary} name={'check-circle'} /> : null;

            if(this.props.label === 'Value Added Assessment Parameters*'){
                
            }
            console.log("Selected Items");
        console.log(this.state.tempSelected);
        // this.state.tempSelected.filter(function(el) { return el.label != "Dilapidated House"; }); 
        // if(this.state.tempSelected.some(sel => sel.label === "Dilapidated House")) {

        // } else {
        //     this.state.tempSelected.push({"amount": 0.5, "label": "Dilapidated House", "value": 18});
        // }
        if(this.props.valueAdded.some(sel => sel.label === "Electricity")){
            console.log("contains Electricity");
            electricityFlag = true
            
        }
        if(this.props.valueAdded.some(sel => sel.label === "Water")) {
            console.log("contains Water")
            waterFlag = true;
            
        }   
        

        return (
            <ListItem
                disabled
                divider
                centerElement={{
                    primaryText: item.label,
                }}
                rightElement={rightElement}
                onPress={() => this.checkFlag( electricityFlag, waterFlag,item)}
            />
        );
    };

    checkFlagUI = (electricityFlag, waterFlag, item) => {
        if(electricityFlag && item.label === "Electricity"){
            return <Icon size={26} color={Colors.danger} name={'check-circle'} />;
        }
        if(waterFlag && item.label === "Water Supply") {
            return <Icon size={26} color={Colors.danger} name={'check-circle'} />;
        }
    } 
    checkFlag = (electricityFlag, waterFlag, item) => {
        if(electricityFlag && item.label === "Electricity"){
            return '';
        }
        if(waterFlag && item.label === "Water Supply") {
            return '';
        }
        this.toggleItem(item);
    }

    toggleItem = (item) => {

        let tempSelected = [...this.state.tempSelected];

        if (_.findIndex(tempSelected, { value: item.value }) !== -1) {
            _.remove(tempSelected, { value: item.value });
        } else {

            if (this.props.max !== null && this.state.tempSelected.length >= this.props.max) {
                ShowAppMessage(`Maximum ${this.props.max} ${this.props.label}(s) are allowed.`);
                return null;
            }

            if (
                this.props.assessment &&
                this.state.tempSelected.length === 1 &&
                _.findIndex(tempSelected, { value: 1 }) === -1
            ) {
                ShowAppMessage(`Maximum 1 ${this.props.label} is allowed without Cellar.`);
                return null;
            }

            tempSelected.push(item);
        }

        this.setState({ tempSelected });
    };

    onSelect = () => {

        if (this.props.max !== null && this.state.tempSelected.length > this.props.max) {
            ShowAppMessage(`Maximum ${this.props.max} ${this.props.label}(s) are allowed.`);
            return null;
        }
        
       
        this.setState(state => ({
            showOptions: false,
            selected: state.tempSelected
        }), () => this.props.onSelected(this.state.selected));
    };

    render() {

        const { options, label, valueAdded,disabled, ...props } = this.props;
        const { selected, tempSelected } = this.state;
        console.log("--------------------- in container-----------");
        console.log(options);
        console.log("--------------------- in container-----------");

        // if(valueAdded.some(sel => sel.label === "Electricity")){
        //     console.log("contains Electricity");
            
        // }
        // if(valueAdded.some(sel => sel.label === "Water")) {
        //     console.log("contains Water")
            
        // }   
        return (
            <React.Fragment>
                <TouchableOpacity activeOpacity={disabled ? 1 : .8} onPress={this.showOptions}>
                    <TextInput
                        {...props}
                        label={label}
                        //placeholder={`Select ${label} (multiple choices)`}
                        placeholderTextColor={'#333'}
                        value={selected.length > 0 ? selected.length + ' items(s) selected' : ''}
                        pointerEvents={'none'}
                        editable={false}
                        style={{ fontSize: 16 }}
                    />
                    <Icon size={24} style={styles.downIcon} color={disabled ? '#ccc' : '#999'} name={'menu-down'} />
                </TouchableOpacity>

                <Modal
                    //animationType={'slide'}
                    onRequestClose={this.hideOptions}
                    visible={this.state.showOptions}
                    backdropColor='transparent'
                    transparent={true}
                >
                    <View style={styles.container}>
                        <View style={styles.headerContainer}>
                            <HeaderButton onPress={this.hideOptions} icon={'arrow-left'} />
                            <Text style={styles.headerTitle}>Select {label}</Text>
                            <HeaderButton onPress={this.onSelect} icon={'check'} />
                        </View>
                        <FlatList
                            renderItem={this.renderItem}
                            keyExtractor={this.keyExtractor}
                            data={options}
                            extraData={{ tempSelected }}
                        />
                    </View>
                </Modal>
            </React.Fragment>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        flex: 1
    },
    itemTouchable: {
        height: 50,
        paddingHorizontal: 20,
        backgroundColor: Colors.white,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        borderTopWidth: 1,
        borderTopColor: '#f9f9f9',
    },
    item: {
        flex: 1,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center'
    },
    itemText: {
        color: '#333',
        fontSize: 16
    },
    headerContainer: {
        height: 54,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 4,
        backgroundColor: Colors.white,
        paddingHorizontal: 4
    },
    headerTitle: {
        fontSize: 18,
        color: '#333',
        fontWeight: '600'
    },
    downIcon: {
        position: 'absolute',
        right: 23,
        bottom: 23
    }
});

export default MultiPickerCouncilAdjustment;
