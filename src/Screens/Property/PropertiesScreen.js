import React, {Component} from 'react';
import {StyleSheet, Text, View, Alert, Dimensions} from 'react-native';
import {connect} from 'react-redux';
import {FlatList} from 'react-navigation';
import {Button, FloatButton} from '../../Components/Button';
import {loadPropertiesInList} from '../../database/Property';
import {resetProperty, setLoadingProperties, setProperty} from '../../redux/actions/PropertyActions';
import PropertyItem from '../../Components/PropertyItem';
import {ImportProperties} from '../../api/PropertyApi';
import {ActivityLoader} from '../../Components/ActivityLoader';
import getDirections from 'react-native-google-maps-directions';
import {Toolbar} from 'react-native-material-ui';

class PropertiesScreen extends Component {

    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);

        this.state = {
            importing: false,
            activeProperty: null,
            searchText: '',
        };
    }


    importProperties = async () => {
        try {

            this.setState({importing: true});

            const count = await ImportProperties();

            this.setState({importing: false}, () => {

                Alert.alert(
                    'Sync Completed',
                    count > 0 ? `${count} ${count === 0 ? 'property' : 'properties'} are imported.` : 'Nothing was imported from cloud.',
                    [
                        {text: 'OK', onPress: () => f => f},
                    ],
                );

                this.props.loadPropertiesInList(1);
            });

        } catch (error) {
            this.setState({importing: false}, () => {
                ShowAppMessage('Something went wrong while importing.');
            });
        }
    };

    onPressProperty = (property) => {

        property.isCompletedSaved = property.isCompleted;

        this.props.setProperty(property);
        this.props.navigation.navigate('property.owner');
    };

    onSearchTextChange = (text) => {

        this.setState({
            searchText: text
        }, () => {
            this.props.loadPropertiesInList(1, text);
        })
    };

    onSearchClosed = () => {
        this.setState({
            searchText: ''
        }, () => {
            this.props.loadPropertiesInList(1, '');
        })
    };

    startNavigation = (doorLocation) => {

        const location = doorLocation.split(',');

        const data = {
            destination: {
                latitude: parseFloat(location[0]),
                longitude: parseFloat(location[1]),
            },
            params: [
                {
                    key: 'travelmode',
                    value: 'driving',
                },
                {
                    key: 'dir_action',
                    value: 'navigate',
                },
            ],
        };

        getDirections(data);
    };

    onRequestNavigation = (item) => {
        this.setState({
            activeProperty: item,
        }, () => {
            this.startNavigation(item.doorLocation);
        });
    };

    renderItem = ({item}) => (
        <PropertyItem
            activeProperty={this.state.activeProperty}
            onRequestNavigation={this.onRequestNavigation}
            onPress={this.onPressProperty}
            item={item}
        />
    );

    keyExtractor = (item) => item.id.toString();

    goToCreateProperty = async () => {
        await this.props.clearProperty();
        this.props.navigation.navigate('property.owner');
    };

    loadMoreProperties = async () => {
        const {loading, currentPage} = this.props;

        if (!loading) {
            await this.props.setLoadingProperties();
            this.props.loadPropertiesInList(currentPage + 1, this.state.searchText);
        }
    };

    componentDidMount(): void {
        this.props.loadPropertiesInList(1);
    }

    renderList = () => {

        const {loading, items} = this.props;

        if (this.state.searchText.length > 0 && items.length < 1) {
           return (
               <View style={styles.noPropertiesContainer}>
                   <Text style={styles.noTitle}>No Match found</Text>
                   <Text>We cannot found any property with this ID.</Text>
               </View>
           )
        }

        if (loading === false && items.length < 1) {
            return (
                <View style={styles.noPropertiesContainer}>
                    <Text style={styles.noTitle}>No Properties</Text>
                    <Text>You have not created any property yet.</Text>
                    <View paddingVertical={10}/>
                    <Button onPress={this.importProperties} label={'Sync with Cloud'}/>
                </View>
            );
        }

        let properties = [...items];

        if (properties.length % 2 !== 0) {
            properties.push({id: 0});
        }

        return (
            <FlatList
                renderItem={this.renderItem}
                data={properties}
                keyExtractor={this.keyExtractor}
                numColumns={2}
                contentContainerStyle={styles.container}
                onEndReached={this.loadMoreProperties}
                removeClippedSubviews
                showsVerticalScrollIndicator={false}
                //extraData={this.state.activeProperty}
            />
        );
    };

    onRightItemSelected = ({index}) => {

        switch (index) {
            case 0: {
                this.props.navigation.navigate('account.profile');
                break;
            }
            case 1: {
                this.props.navigation.navigate('properties.sync');
                break;
            }
            case 2: {
                this.importProperties();
                break;
            }
        }
    };

    render() {

        return (
            <View style={{flex: 1}}>
                <Toolbar
                    style={toolbarStyles}
                    centerElement="Properties"
                    searchable={{
                        autoFocus: true,
                        placeholder: 'Search',
                        onChangeText: this.onSearchTextChange,
                        onSearchClosed: this.onSearchClosed,
                    }}
                    rightElement={{
                        menu: {
                            icon: 'more-vert',
                            labels: [
                                'My Account',
                                'Sync Properties',
                                'Import Properties',
                            ],
                        },
                    }}
                    onRightElementPress={this.onRightItemSelected}
                />

                {this.renderList()}

                <FloatButton
                    onPress={this.goToCreateProperty}
                    icon={'plus'}
                />

                <ActivityLoader text={'Importing'} loading={this.state.importing}/>
            </View>
        );
    }
}

const toolbarStyles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
    },
    titleText: {
        color: '#000',
    },
    rightElement: {
        color: '#000',
    },
});

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#f6f6f6',
        paddingVertical: 4,
    },
    noPropertiesContainer: {
        flex: 1,
        backgroundColor: '#f6f6f6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    noTitle: {
        fontSize: 18,
        color: '#333',
        marginBottom: 10,
    },
});

const mapStateToProps = ({properties, options}) => ({
    items: properties.items,
    loading: properties.loading,
    currentPage: properties.currentPage,
    options,
});

const clearProperty = () => dispatch => dispatch(resetProperty());

const mapDispatchToProps = {
    loadPropertiesInList,
    setProperty,
    clearProperty,
    setLoadingProperties,
};

export default connect(mapStateToProps, mapDispatchToProps)(PropertiesScreen);
