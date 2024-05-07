import React, {Component} from 'react';
import {ScrollView, StyleSheet, Text, View,Linking} from 'react-native';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import Colors from '../../Colors';
import { useSelector } from 'react-redux';
import {Button as MaterialButton} from 'react-native-material-ui';
var SendIntentAndroid = require("react-native-send-intent");
import AsyncStorage from '@react-native-community/async-storage'


// const {
    
//     sigma_pay_url,
//     gatedCommunity: gatedCommunityAmount,
// } = useSelector((state) => state.options);
class LockScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sigma_pay_url: "",
        };
    }
    static navigationOptions = {
        header: null,
    };
    
  async componentDidMount(){
    const sigma_pay_url =  await AsyncStorage.getItem('sigma_pay_url', null);
   // alert(sigma_pay_url)
this.setState({
    sigma_pay_url:sigma_pay_url
})
    
     
  }
    goToAssessment = () => this.props.navigation.navigate('assessmentCalculator');
    handleApp =  () => {
        
        SendIntentAndroid.isAppInstalled("com.dpm.payment").then(isInstalled => {
            if (isInstalled) {
                SendIntentAndroid.openApp("com.dpm.payment").then(wasOpened => {

                });

            } else {
                //alert("ok")
                Linking.openURL("market://details?id=com.dpm.payment");
               
            }

        });
    }
    
    render() {

        return (
            <ScrollView
                keyboardShouldPersistTaps={'always'}
                contentContainerStyle={styles.container}
            >
                {/* {this.state.sigma_pay_url?( */}
                <View  style={{margin:10}}>
               
                 {/* <MaterialButton
                    style={{ icon: { color: Colors.green}, text: { color: Colors.green}}}  
                    icon={'cash'}
                    iconSet={'MaterialCommunityIcons'}
                    onPress={this.handleApp}
                    text={'Property Owner Self Service'}
                    
                /> */}
             
                </View>
                {/* ):null} */}
               

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
                   <View style={{margin:10}}>

                   {/* <MaterialButton
                    style={{ icon: { color: Colors.green}, text: { color: Colors.green}}}  
                    icon={'calculator'}
                    iconSet={'MaterialCommunityIcons'}
                    onPress={this.goToAssessment}
                    text={'Click here for Assessment'}
                    
                /> */}
                   </View>
                       
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
