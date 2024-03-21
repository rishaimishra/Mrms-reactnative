import React, {PureComponent} from 'react';
import {NavigationEvents, withNavigationFocus} from 'react-navigation';
import {Alert, BackHandler, StyleSheet, View} from 'react-native';
import StepIndicator from 'react-native-step-indicator';
import {ViewPager} from 'react-native-best-viewpager';
import LandlordScreen from './Owner/LandlordScreen';
import OccupancyDetails from './Owner/OccupancyDetails';
import Colors from '../../Colors';
import PropertyScreen from './Owner/PropertyScreen';
import {FloatButton, HeaderButton} from '../../Components/Button';
import stepIndicatorStyles from './stepIndicatorStyles';

const labels = ['Landlord Details'.toUpperCase(), 'Property Details'.toUpperCase(), 'Tenant Details'.toUpperCase()];

const PAGES = [
    LandlordScreen,
    PropertyScreen,
    OccupancyDetails,
];

class OwnerDetailsScreen extends PureComponent {

    static navigationOptions = ({navigation}) => ({
        title: 'Owner / Tenant Details',
        headerStyle: {
            elevation: 0,

        },
        headerTitleStyle: {
            textAlign: 'center',
            flex: 1,
        },
        headerLeft: <HeaderButton onPress={navigation.getParam('onBack')} icon='arrow-left'/>,
        headerRight: <View/>,
    });

    constructor(props) {
        super(props);

        this.state = {
            currentPage: 0,
        };
    }

    handleBackPress = () => {
        Alert.alert(
            'Exit Property',
            'Are you sure want to exit property?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {text: 'OK', onPress: () => this.props.navigation.goBack()},
            ],
            {cancelable: false},
        );

        return true;
    };

    didFocus = () => {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        this.props.navigation.setParams({onBack: this.handleBackPress});
    };

    willBlur = () => {
        this.backHandler.remove();
    };

    onPressNext = () => {
        if (this.state.currentPage < 2) {
            this.viewPager.setPage(this.state.currentPage + 1);
        } else {
            this.props.navigation.navigate('property.assessment');
        }
    };

    componentWillUnmount() {
        this.backHandler.remove();
    }

    render() {
        return (
            <React.Fragment>
                <NavigationEvents
                    onDidFocus={this.didFocus}
                    onWillBlur={this.willBlur}
                />
                <View style={styles.stepContainer}>
                    <StepIndicator
                        customStyles={stepIndicatorStyles}
                        currentPosition={this.state.currentPage}
                        labels={labels}
                        stepCount={3}
                    />
                </View>
                <ViewPager
                    style={{flexGrow: 1}}
                    ref={viewPager => {
                        this.viewPager = viewPager;
                    }}
                    onPageSelected={page => {
                        this.setState({currentPage: page.position});
                    }}
                >
                    {PAGES.map((Component, index) => (
                        <View key={index} style={styles.page}>
                            <Component navigation={this.props.navigation}/>
                        </View>
                    ))}
                </ViewPager>

                <FloatButton onPress={this.onPressNext} icon={'arrow-right'}/>
            </React.Fragment>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    stepContainer: {
        paddingTop: 14,
        paddingBottom: 10,
        backgroundColor: Colors.white,
        //elevation: 3,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    page: {
        flex: 1,
    },
    stepLabel: {
        fontSize: 12,
        textAlign: 'center',
        fontWeight: '500',
        color: '#999999',
    },
    stepLabelSelected: {
        fontSize: 12,
        textAlign: 'center',
        fontWeight: '500',
        color: Colors.primary,
    },
});

export default withNavigationFocus(OwnerDetailsScreen);
