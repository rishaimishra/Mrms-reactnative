import React, {Component} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert, Image} from 'react-native';
import {Button} from "../../Components/Button";
import {TextInput} from "../../Components/Input";
import Colors from "../../Colors";
import {ActivityLoader} from "../../Components/ActivityLoader";
import {resetPasswordRequest} from "../../api/UserApi";

class ForgetPasswordScreen extends Component {

    static navigationOptions = {
        title: 'Forgot Password'
    };

    constructor(props) {
        super(props);

        this.state = {
            email: '',
            pending: false,
            logo: require('./../../assets/logo.png')
        };
    }

    handleForgetPassword = async () => {

        const {email} = this.state;

        if (!email) {
            ShowAppMessage('Please enter your email.');

            return null;
        }

        try {

            this.setState({pending: true});

            const {data} = await resetPasswordRequest(email);

            if (data.success) {

                Alert.alert(
                    'Request Sent!',
                    'Reset password request has been sent.',
                    [
                        {text: 'OK', onPress: () => this.props.navigation.navigate('login')},
                    ],
                    {cancelable: false},
                );

                this.setState({pending: false, email: ''});

            } else {
                this.setState({pending: false});
            }


        } catch (error) {

            this.setState({pending: false});

        }
    };

    onEmailChange = email => this.setState({email});

    goToLogin = () => this.props.navigation.navigate('login');

    render() {
        return (
            <ScrollView
                keyboardShouldPersistTaps={'always'}
                contentContainerStyle={styles.container}
            >
                <Image style={styles.logo} source={this.state.logo}/>

                <View style={styles.formContainer}>
                    <TextInput
                        icon={'email-outline'}
                        placeholder={'Your Email'}
                        onChangeText={this.onEmailChange}
                        keyboardType={'email-address'}
                        value={this.state.email}
                    />

                    <Button label={'Submit'} onPress={this.handleForgetPassword}/>

                    <TouchableOpacity onPress={this.goToLogin}>
                        <Text style={styles.link}>Back to Login</Text>
                    </TouchableOpacity>
                </View>

                <ActivityLoader loading={this.state.pending}/>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingVertical: 20
    },
    formContainer: {
        paddingHorizontal: 20
    },
    link: {
        color: Colors.link,
        marginTop: 14,
        textAlign: 'center'
    },
    logo: {
        height: 160,
        width: 160,
        marginBottom: 40,
        alignSelf: 'center'
    }
});

export default ForgetPasswordScreen;
