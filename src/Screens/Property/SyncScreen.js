import React, {Component} from 'react';
import {Alert, ScrollView, StyleSheet, Text, View} from 'react-native'
import axios from 'axios';
import {connect} from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import {Button} from "../../Components/Button";
import Colors from "../../Colors";
import {loadPropertiesInList, loadSyncProperties} from "../../database/Property";
import {SyncProperty} from "../../api/PropertyApi";
import {Link} from "../../Components/Link";

class SyncScreen extends Component {

    static navigationOptions = {
        title: 'Sync Properties',
        headerTitleStyle: {
            textAlign: 'center',
            flex: 1
        },
        headerRight: <View/>
    };

    constructor(props) {
        super(props);

        this.state = {
            pending: false,
            currentIndex: 1,
            progress: 0,
            failed: false
        };

        this.cancelRequest = null;
    }

    onProgress = (progressEvent) => {
        this.setState({progress: Math.round((progressEvent.loaded * 100) / progressEvent.total)});
    };

    startSyncUpload = async () => {

        const {properties} = this.props;

        this.setState({pending: true, progress: 0});

        try {

            await SyncProperty(
                properties[this.state.currentIndex - 1],
                this.onProgress,
                cancelRequest => this.cancelRequest = cancelRequest
            );

            if (this.state.currentIndex === properties.length) {

                await this.props.loadSyncProperties();
                await this.props.loadPropertiesInList(1);

                this.setState({pending: false, failed: false, currentIndex: 1}, () => {
                    Alert.alert(
                        'Sync Completed',
                        'All the properties are successfully synced.',
                        [
                            {text: 'OK', onPress: () => this.props.navigation.navigate('properties')},
                        ],
                        {cancelable: false},
                    );
                });

            } else {
                this.setState({currentIndex: this.state.currentIndex + 1, progress: 0}, () => {
                    setTimeout(this.startSyncUpload, 1000)
                });

            }

        } catch (error) {
            if (!axios.isCancel(error)) {
                this.setState({failed: false, pending: false, currentIndex: 1, progress: 0});
            } else {
                this.setState({failed: true, pending: false});
            }
        }
    };

    skitAndContinue = () => this.setState({failed: false}, this.startSyncUpload);

    cancelSync = () => {
        if (this.cancelRequest) {
            this.cancelRequest();
        }
    };

    componentDidMount(): void {
        this.props.loadSyncProperties();
    }

    render() {

        const {properties} = this.props;

        return (
            <ScrollView
                contentContainerStyle={styles.container}
            >
                <View style={styles.syncIconContainer}>
                    <Icon color={Colors.white} size={34} style={styles.syncIcon} name={'cloud-upload-outline'}/>
                </View>
                <Text
                    style={styles.text}
                >{this.state.pending || this.state.failed ? `Syncing ${this.state.currentIndex} of ${properties.length}` : `${properties.length} items can be synced`}</Text>

                {this.state.pending && (
                    <Text
                        style={styles.syncProgress}
                    >Sync progress {this.state.progress}%</Text>
                )}

                {this.state.failed && (
                    <Text
                        style={styles.syncProgress}
                    >Sync failed! {properties.length - this.state.currentIndex} property left to be synced</Text>
                )}

                <View paddingVertical={10}/>
                <Button
                    onPress={this.startSyncUpload}
                    disabled={properties.length < 1}
                    loading={this.state.pending}
                    label={this.state.failed ? 'Retry' : 'Sync Now'}
                />

                {this.state.failed && <Link style={styles.bottomLink} label={'Skip and Continue'}
                                            onPress={this.skitAndContinue}/>}

                {/*{this.state.pending && <Link style={styles.bottomLink} label={'Cancel'}*/}
                {/*                             onPress={this.cancelSync}/>}*/}
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 30
    },
    text: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 10,
        color: '#333'
    },
    syncIconContainer: {
        height: 60,
        width: 60,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        alignSelf: 'center',
        marginBottom: 30
    },
    syncIcon: {},
    syncProgress: {
        textAlign: 'center'
    },
    bottomLink: {
        marginTop: 10,
        alignSelf: 'center'
    }
});

const mapStateToProps = ({sync}) => ({
    properties: sync.properties
});

const mapDispatchToProps = {
    loadSyncProperties,
    loadPropertiesInList
};

export default connect(mapStateToProps, mapDispatchToProps)(SyncScreen);