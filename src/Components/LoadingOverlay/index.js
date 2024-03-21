import React from 'react';
import Spinner from 'react-native-loading-spinner-overlay';
import Colors from "../../Colors";

export const LoadingOverlay = (props) => (
    <Spinner
        {...props}
        color={Colors.primary}
        size={'large'}
    />
);