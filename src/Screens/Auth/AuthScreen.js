import React, {Component} from 'react';
import {Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {connect} from 'react-redux';
import {login} from '../../api/UserApi';
import {Button} from '../../Components/Button';
import {TextInput} from '../../Components/Input';
import Colors from '../../Colors';
import {ActivityLoader} from '../../Components/ActivityLoader';


class AuthScreen extends Component {

    static navigationOptions = {
        title: 'Login',
    };

    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            loading: false,
            logo: require('./../../assets/logo.png'),
        };
    }

    handleLogin = async () => {

        const {email, password} = this.state;

        if (!email) {
            ShowAppMessage('Please enter your email.');
            return null;
        }
        if (!password) {
            ShowAppMessage('Please enter your account password.');
            return null;
        }

        try {

            this.setState({loading: true});

            const data = await this.props.login(email, password);


            this.setState({loading: false});

            if (data.success) {
                this.props.navigation.navigate('main');
            }

        } catch (error) {
            console.log('login error', error);
            this.setState({loading: false});

        }
    };

    onEmailChange = email => this.setState({email});

    onPasswordChange = password => this.setState({password});

    goToForgetPassword = () => this.props.navigation.navigate('forgetPassword');

    render() {

        const {logo} = this.state;

        return (
            <ScrollView
                keyboardShouldPersistTaps={'always'}
                contentContainerStyle={styles.container}
            >
                <View style={styles.innerContainer}>
                    <Image style={styles.logo} source={this.state.logo}/>

                    <View style={styles.formContainer}>
                        <TextInput
                            placeholder={'Your Email'}
                            onChangeText={this.onEmailChange}
                            keyboardType={'email-address'}
                            icon={'email-outline'}
                        />

                        <TextInput
                            placeholder={'Password'}
                            secureTextEntry
                            onChangeText={this.onPasswordChange}
                            icon={'lock-outline'}
                        />

                        <Button label={'Login'} onPress={this.handleLogin}/>

                        <TouchableOpacity onPress={this.goToForgetPassword}>
                            <Text style={styles.link}>Forgot Password</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <ActivityLoader loading={this.state.loading}/>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingVertical: 20,
    },
    innerContainer: {
        flex: 1,
        justifyContent: 'center'
    },
    formContainer: {
        paddingHorizontal: 20,
    },
    link: {
        color: Colors.link,
        marginTop: 14,
        textAlign: 'center',
    },
    logo: {
        height: 160,
        width: 160,
        marginBottom: 40,
        alignSelf: 'center',
    },
});

const mapStateToProps = store => {
    return {
        user: store.user,
    };
};

const mapDispatchToProps = {
    login,
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthScreen);
