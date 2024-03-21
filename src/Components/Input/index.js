import React, {PureComponent} from 'react';
import {StyleSheet, Text, TextInput as NativeTextInput, TouchableOpacity, View} from 'react-native';
import RNPickerSelect from "react-native-picker-select";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from "../../Colors";

export class TextInput extends PureComponent {

    static defaultProps = {
        secureTextEntry: false
    };

    constructor(props) {
        super(props);

        this.state = {
            keepSecure: props.secureTextEntry
        };
    }

    toggleSecureTextEntry = () => this.setState(state => ({keepSecure: !state.keepSecure}));

    render() {

        const {label, style, secureTextEntry, icon, ...props} = this.props;
        const {keepSecure} = this.state;

        return (
            <React.Fragment>
                {label && <Text style={styles.inputLabel}>{label}</Text>}
                <View style={styles.container}>
                    {icon && <Icon style={{paddingRight: 5}} name={icon} size={20}/>}
                    <NativeTextInput
                        {...props}
                        secureTextEntry={keepSecure}
                        style={[styles.input, style]}
                    />
                    {secureTextEntry && (
                        <TouchableOpacity style={{height: '100%', justifyContent: 'center'}}
                                          onPress={this.toggleSecureTextEntry}>
                            <Icon style={{paddingLeft: 5}} name={`eye-${keepSecure ? 'outline' : 'off-outline'}`}
                                  size={20}/>
                        </TouchableOpacity>
                    )}
                </View>
            </React.Fragment>
        );
    }
}

export const SelectPicker = ({label, ...props}) => {

    const placeholder = {
        label: '',
        value: null,
        color: '#333',
    };

    return (
        <React.Fragment>
            {label && <Text style={styles.inputLabel}>{label}</Text>}
            <View style={[styles.container, styles.selectContainer]}>
                <RNPickerSelect
                    placeholder={placeholder}
                    {...props}
                    style={pickerSelectStyles}
                    placeholderTextColor={'#333'}
                />
            </View>
        </React.Fragment>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 15,
        borderWidth: 1,
        borderColor: Colors.primary,
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        height: 44
    },
    input: {
        paddingVertical: 6,
        color: '#333',
        fontSize: 16,
        flex: 1
    },
    inputLabel: {
        color: '#000',
        marginBottom: 4
    },
    selectContainer: {
        flexDirection: 'column'
    }
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        color: 'black',
        paddingRight: 30
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 12,
        color: 'black',
        paddingRight: 30,
        height: 42
    },
});
