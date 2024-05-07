import React from 'react';
import {StyleSheet, Text, View} from 'react-native'
import Colors from "../../Colors";

export const Header = ({children}) => {

    return (
        <View style={styles.headerContainer}>
            {children}
        </View>
    );
};

export const HeaderTitle = ({title}) => <Text style={styles.headerTitle}>{title}</Text>;

const styles = StyleSheet.create({
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
});