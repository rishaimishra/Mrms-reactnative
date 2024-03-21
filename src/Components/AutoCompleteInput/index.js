import React, { Component } from 'react';
import { Modal, TouchableOpacity, View, StyleSheet, TextInput as NativeTextInput, FlatList } from 'react-native'
import { createFilter } from 'react-native-search-filter';
import { TextInput } from "../Input";
import { HeaderButton } from "../Button";
import { Header } from "./../Header/index";
import { ListItem } from "react-native-material-ui";
import Colors from "../../Colors";

const KEYS_TO_FILTERS = ['label'];
const options = { fuzzy: true, sortResults: true };

class AutoCompleteInput extends Component {

    static defaultProps = {
        editable: true
    };

    constructor(props) {
        super(props);

        this.state = {
            visible: false
        };

        this.inputRef = React.createRef();
    }

    handleClose = () => this.setState({ visible: false });

    handleOpen = () => {

        if  (! this.props.editable) {
            return false;
        }

        this.setState({ visible: true }, () => {
            setTimeout(() => this.inputRef.current.focus(), 50)
        })
    };

    findItem = (query) => {

        if (query === '') {
            return [];
        }

        const { items } = this.props;
        const regex = new RegExp(`${query.trim()}`, 'i');

        return items.filter(item => item.label !== null && item.label.search(regex) >= 0);
    };

    renderItem = ({ item }) => {

        return (
            <ListItem
                divider
                centerElement={{
                    primaryText: item.label,
                }}
                onPress={() => {
                    this.setState({ visible: false }, () => this.props.onChangeText(item.label));
                }}
            />
        );
    };

    keyExtractor = (item, index) => index.toString();

    render() {

        const { visible } = this.state;
        const { onChangeText, editable, value, label, items, ...props } = this.props;

        //const data = ! value ? [] : items.filter( createFilter(value, KEYS_TO_FILTERS, options) );

        const data = this.findItem(value);

        return (
            <View>
                <TouchableOpacity activeOpacity={1} onPress={this.handleOpen}>
                    <View
                        pointerEvents={'none'}
                    >
                        <TextInput
                            editable={false}
                            label={label}
                            onChangeText={onChangeText}
                            value={value}
                            {...props}
                        />
                    </View>
                </TouchableOpacity>
                <Modal
                    visible={visible}
                    backdropColor='transparent'
                    transparent={true}
                    onRequestClose={this.handleClose}
                >
                    <View style={styles.container}>
                        <Header>
                            <HeaderButton onPress={this.handleClose} icon={'arrow-left'} />
                            <NativeTextInput
                                style={styles.headerInput}
                                placeholder={label}
                                ref={this.inputRef}
                                onChangeText={onChangeText}
                                underlineColorAndroid="transparent"
                                value={value}
                                returnKeyLabel={'OK'}
                                returnKeyType={'done'}
                                autoCapitalize={'words'}
                                onSubmitEditing={this.handleClose}
                            />
                        </Header>

                        <FlatList
                            data={data}
                            keyboardShouldPersistTaps={'always'}
                            renderItem={this.renderItem}
                            keyExtractor={this.keyExtractor}
                        />
                    </View>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white
    },
    headerInput: {
        flex: 1,
        marginRight: 15,
        fontSize: 16
    }
});

export default AutoCompleteInput;