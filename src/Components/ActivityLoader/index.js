import React, {Component} from 'react';
import {ActivityIndicator, Modal, StyleSheet, View, Text} from 'react-native'
import Colors from "../../Colors";

export class ActivityLoader extends Component {

    static defaultProps = {
        loading: false
    };

    render() {

        if (!this.props.loading) {
            return null;
        }

        return (
            <Modal
                visible
                transparent
            >
                <View style={styles.container}>
                    <View style={styles.viewContainer}>
                        <ActivityIndicator color={Colors.primary} size={'large'}/>
                        { this.props.text && <Text style={styles.label}>{this.props.text}</Text> }
                    </View>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,.4)',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    },
    viewContainer: {
        backgroundColor: Colors.white,
        height: 80,
        width: 80,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        elevation: 2
    },
    label: {
        color: '#333',
        fontSize: 12,
        marginTop: 4
    }
});