import React, {Component} from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    TextInput,
    Picker,
    InteractionManager,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage'
import {ActivityLoader} from "../../Components/ActivityLoader";
import ImagePicker from 'react-native-image-crop-picker'
import {connect} from 'react-redux'
import Touchable from 'react-native-platform-touchable'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from "../../Colors";
import {logout, updateProfile} from "../../api/UserApi";
import {wardOptions} from "../../database/BoundryDelimination";

import {setDefaultWard} from "../../redux/actions/AppActions";

class ProfileScreen extends Component {

    static navigationOptions = {
        title: 'My Profile',
        headerTitleStyle: {
            textAlign: 'center',
            flex: 1
        },
        headerRight: <View/>
    };

    constructor(props) {
        super(props);

        this.state = {
            avatarPlaceholder: require('./../../assets/avatar-placeholder.png'),
            pending: false,
            editName: false,
            name: props.user.name,
            wards: []
        };
    }

    onLogout = async () => {
        await this.props.logout();
        this.props.navigation.navigate('auth');
    };

    handleChangeAvatar = () => {
        ImagePicker.openPicker({
            width: 500,
            height: 500,
            cropping: true
        }).then(image => {

            this.setState({pending: true}, async () => {

                try {
                    await this.props.updateProfile(this.props.user.name, image.path);
                    this.setState({pending: false});
                } catch (error) {
                    this.setState({pending: false});
                }
            });

        }).catch(err => f => f);
    };

    showEditName = () => {
        this.setState({editName: true}, () => {
            this.nameInput.focus();
        })
    };

    hideEditName = () => this.setState({editName: false});

    onSaveName = async () => {

        if (!this.state.name) {

           ShowAppMessage('Please enter your name.');

            return null;
        }

        try {
            this.setState({pending: true});
            await this.props.updateProfile(this.state.name);
            this.setState({pending: false, editName: false});
        } catch (error) {
            this.setState({pending: false, editName: false});
        }
    };

    onNameChange = name => this.setState({name});

    onChangeDefaultWard = async ward => {

        await this.props.setDefaultWard(ward);
        await AsyncStorage.setItem('default_ward', ward.toString())
    };

    async componentDidMount(): void {

        this.interation = InteractionManager.runAfterInteractions(async () => {
            try {

                const wards = await wardOptions();
                !this.unmounted && this.setState({wards});

            } catch (error) {
                console.log('Ward Error', error);
            }
        });
    }

    componentWillUnmount(): void {
        this.unmounted = true;
        InteractionManager.clearInteractionHandle(this.interation);
    }

    render() {

        const {user} = this.props;
        const avatar = user && user.hasOwnProperty('small_preview') && user.small_preview ? {uri: user.small_preview} : this.state.avatarPlaceholder;

        return (
            <ScrollView
                contentContainerStyle={styles.container}
            >
                <View style={styles.contentContainer}>
                    <View style={styles.avatarContainer}>
                        <Image style={styles.avatar} source={avatar}/>
                        <TouchableOpacity onPress={this.handleChangeAvatar} activeOpacity={.8}
                                          style={styles.editPicture}>
                            <Icon name={'pencil'} size={18} color={'#333'}/>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.listContainer}>
                        <View style={styles.listItem}>
                            <View style={styles.nameContainer}>

                                <View style={styles.listLeft}>
                                    <Icon color={'#333'} size={24} name={'account'}/>
                                    {this.state.editName ?
                                        <TextInput onChangeText={this.onNameChange} ref={name => this.nameInput = name}
                                                   style={styles.input}
                                                   value={this.state.name}/> :
                                        <Text style={styles.listText}>{user.name}</Text>}
                                </View>

                                {this.state.editName ? (
                                    <View style={{flexDirection: 'row'}}>
                                        <TouchableOpacity style={styles.button} onPress={this.onSaveName}>
                                            <Icon color={'#333'} size={24} name={'check'}/>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.button} onPress={this.hideEditName}>
                                            <Icon color={'#333'} size={24} name={'close'}/>
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <TouchableOpacity style={styles.button} onPress={this.showEditName}>
                                        <Icon color={'#333'} size={24} name={'pencil'}/>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                        <View style={styles.listItem}>
                            <View style={styles.listLeft}>
                                <Icon color={'#333'} size={24} name={'email'}/>
                                <Text style={styles.listText}>{user.email}</Text>
                            </View>
                        </View>

                        <View style={styles.listItem}>
                            <View style={styles.listLeft}>
                                <Icon color={'#333'} size={24} name={'numeric-1-box-multiple-outline'}/>
                                <Picker
                                    selectedValue={this.props.defaultWard}
                                    style={{flex: 1}}
                                    onValueChange={this.onChangeDefaultWard}
                                >
                                    <Picker.Item label={'Default Ward'} value={''}/>
                                    {this.state.wards.map(ward => (
                                        <Picker.Item key={ward.label} label={ward.label} value={ward.value}/>
                                    ))}
                                </Picker>
                            </View>
                        </View>


                        <Touchable onPress={this.onLogout} style={styles.listItem}>
                            <View style={styles.listLeft}>
                                <Icon color={'#333'} size={24} name={'logout'}/>
                                <Text style={styles.listText}>Logout</Text>
                            </View>
                        </Touchable>
                    </View>
                </View>


                <ActivityLoader loading={this.state.pending}/>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#eee'
    },
    inputContainer: {
        flex: 1
    },
    contentContainer: {
        backgroundColor: Colors.white
    },
    listContainer: {
        marginTop: 20
    },
    avatarContainer: {
        height: 100,
        width: 100,
        alignSelf: 'center',
        marginTop: 50,
        position: 'relative',
    },
    avatar: {
        height: 100,
        width: 100,
        borderRadius: 50,
        resizeMode: 'cover'
    },
    listItem: {
        height: 54,
        justifyContent: 'center',
        borderTopWidth: 1,
        borderTopColor: '#f2f2f2',
        marginHorizontal: 20
    },
    listLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1
    },
    listText: {
        fontSize: 16,
        color: '#333',
        paddingLeft: 10
    },
    editPicture: {
        backgroundColor: Colors.white,
        height: 34,
        width: 34,
        position: 'absolute',
        elevation: 4,
        borderRadius: 20,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    nameContainer: {
        flexDirection: 'row'
    },
    button: {
        height: 54,
        width: 54,
        alignItems: 'center',
        justifyContent: 'center'
    },
    input: {
        flex: 1,
        paddingLeft: 10
    }
});

const mapDispatchToProps = {
    logout,
    updateProfile,
    setDefaultWard: ward => dispatch => dispatch(setDefaultWard(ward))
};

const mapStateToProps = ({user, app}) => {
    return {
        user: user.activeUser,
        defaultWard: app.defaultWard
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);
