import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from "react-native";
import Colors from "../../Colors";

export const Link = ({label, style, disabled = false, onPress}) => {
    return (
        <TouchableOpacity style={style} activeOpacity={disabled ? 1 : .6} onPress={disabled ? f => f : onPress}>
            <Text style={styles.link}>{label}</Text>
        </TouchableOpacity>
    );
};


const styles = StyleSheet.create({
    link: {
        color: Colors.link
    }
});