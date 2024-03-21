import React, {PureComponent} from 'react';
import {StyleSheet, View} from 'react-native'
import StepIndicator from "react-native-step-indicator";
import {ViewPager} from "react-native-best-viewpager";
import {FloatButton} from "../../Components/Button";
import Colors from "../../Colors";
import MeterTaggingScreen from "./GeoRegistry/MeterTaggingScreen";
import PlotTaggingScreen from "./GeoRegistry/PlotTaggingScreen";
import DigitalAddressScreen from "./GeoRegistry/DigitalAddressScreen";
import stepIndicatorStyles from "./stepIndicatorStyles";

const labels = [
    "EDSA Meter Tagging".toUpperCase(),
    "Plot Tagging".toUpperCase(),
    "Digital Address".toUpperCase()
];

const PAGES = [
    MeterTaggingScreen,
    PlotTaggingScreen,
    DigitalAddressScreen
];

class GeoRegistryScreen extends PureComponent {

    static navigationOptions = {
        title: 'Geo Registry',
        headerStyle: {
            elevation: 0,

        },
        headerTitleStyle: {
            textAlign: 'center',
            flex: 1
        },
        headerRight: <View/>
    };

    constructor(props) {
        super(props);

        this.state = {
            currentPage: 0
        };
    }

    onPressNext = () => {
        if (this.state.currentPage < 2) {
            this.viewPager.setPage(this.state.currentPage + 1)
        }
    };

    render() {

        const {currentPage} = this.state;

        return (
            <React.Fragment>
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
                        this.viewPager = viewPager
                    }}
                    onPageSelected={page => {
                        this.setState({currentPage: page.position})
                    }}
                >
                    {PAGES.map((Component, index) => (
                        <View key={index} style={styles.page}>
                            <Component navigation={this.props.navigation}/>
                        </View>
                    ))}
                </ViewPager>

                {currentPage !== 2 && <FloatButton onPress={this.onPressNext} icon={'arrow-right'}/>}
            </React.Fragment>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white
    },
    stepContainer: {
        paddingTop: 14,
        paddingBottom: 10,
        backgroundColor: Colors.white,
        //elevation: 3,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd'
    },
    page: {
        flex: 1
    },
    stepLabel: {
        fontSize: 12,
        textAlign: 'center',
        fontWeight: '500',
        color: '#999999'
    },
    stepLabelSelected: {
        fontSize: 12,
        textAlign: 'center',
        fontWeight: '500',
        color: Colors.primary
    }
});

export default GeoRegistryScreen;
