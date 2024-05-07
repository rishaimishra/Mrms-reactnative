import React from 'react';
import {StyleSheet, Text, View, ActivityIndicator} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Colors from "../../Colors";

export const Button = ({label, disabled, onPress, loading = false}) => {

    const Component = disabled || loading ? View : Touchable;

    return (
        <Component style={[styles.container, disabled ? styles.disabledContainer : {}]} onPress={onPress}>
            {loading ? <ActivityIndicator size={'large'} color={Colors.white}/> :
                <Text style={styles.buttonLabel}>{label.toUpperCase()}</Text>}
        </Component>
    );
};

export const ShortButton = ({label, disabled, onPress, loading = false}) => {

    const Component = disabled || loading ? View : Touchable;

    return (
        <Component style={[styles.containerShort, disabled ? styles.disabledContainer : {}]} onPress={onPress}>
            {loading ? <ActivityIndicator size={'large'} color={Colors.white}/> :
                <Text style={styles.buttonLabel}>{label.toUpperCase()}</Text>}
        </Component>
    );
};
export const FloatButton = ({icon, onPress}) => (
    <View style={styles.floatButtonContainer}>
        <Touchable style={styles.floatButtonTouchable} onPress={onPress}>
            <Icon size={34} color={Colors.white} name={icon}/>
        </Touchable>
    </View>
);

export const HeaderButton = ({icon, onPress}) => {
    return (
        <View style={styles.headerButtonContainer}>
            <Touchable style={styles.headerButtonTouchable} onPress={onPress}>
                <Icon size={24} color={'#333'} name={icon}/>
            </Touchable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.primary,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20
    },
    containerShort: {
        backgroundColor: Colors.primary,
        width:'60%',
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        borderRadius:5,
    },
    buttonLabel: {
        color: Colors.white
    },
    floatButtonContainer: {
        height: 60,
        width: 60,
        position: 'absolute',
        bottom: 10,
        right: 10,
        borderRadius: 30,
        overflow: 'hidden',
        elevation: 5
    },
    floatButtonTouchable: {
        flex: 1,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center'
    },
    headerButtonContainer: {
        height: 46,
        width: 46,
        borderRadius: 30,
        overflow: 'hidden',
        marginHorizontal: 3
    },
    headerButtonTouchable: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    disabledContainer: {
        backgroundColor: '#ccc'
    }
});