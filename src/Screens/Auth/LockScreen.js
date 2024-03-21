import React, {Component} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import Colors from '../../Colors';
import {Button as MaterialButton} from 'react-native-material-ui';

class LockScreen extends Component {

    static navigationOptions = {
        header: null,
    };

    goToAssessment = () => this.props.navigation.navigate('assessmentCalculator');

    render() {
        return (
            <ScrollView
                keyboardShouldPersistTaps={'always'}
                contentContainerStyle={styles.container}
            >
                <MaterialButton
                    primary
                    icon={'calculator'}
                    iconSet={'MaterialCommunityIcons'}
                    onPress={this.goToAssessment}
                    text={'Click here for Assessment'}
                />

               <View style={styles.innerContainer}>
                   <View style={styles.iconContainer}>
                       <Icon color={Colors.white} size={30} name={'shield-key-outline'}/>
                   </View>

                   <Text style={styles.title}>Authenticate</Text>
                   <Text style={styles.desc}>We need to authenticate it's you.</Text>
                   <OTPInputView
                       style={styles.otpContainer}
                       pinCount={4}
                       autoFocusOnLoady
                       codeInputFieldStyle={styles.underlineStyleBase}
                       codeInputHighlightStyle={styles.underlineStyleHighLighted}
                       onCodeFilled={(code => {
                           if (parseInt(code) === 1234) {
                               this.props.navigation.navigate(this.props.user.isLoggedIn ? 'main' : 'auth');
                           } else {
                               ShowAppMessage('Invalid Authentication PIN.');
                           }
                       })}
                   />
               </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({

    container: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingTop: 40
    },
    innerContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingVertical: 20
    },
    title: {
        fontSize: 24,
        textAlign: 'center',
        color: Colors.primary,
        marginBottom: 6,
    },
    borderStyleHighLighted: {
        borderColor: Colors.primary,
    },

    otpContainer: {
        width: '60%',
        alignSelf: 'center',
        height: 80,
    },

    underlineStyleBase: {
        width: 30,
        height: 45,
        borderWidth: 0,
        borderBottomWidth: 2,
        color: '#000'
    },

    underlineStyleHighLighted: {
        borderColor: Colors.primary,
    },
    desc: {
        textAlign: 'center',
        marginBottom: 10,
    },
    iconContainer: {
        height: 50,
        width: 50,
        backgroundColor: Colors.primary,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        marginBottom: 10,
    },
});

const mapStateTopProps = ({user}) => ({user});

export default connect(mapStateTopProps)(LockScreen);
