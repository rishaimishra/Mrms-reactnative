import React, {Component} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import {ActivityLoader} from '../Components/ActivityLoader';


class LoaderScreen extends Component {

    static navigationOptions = {
        title: '',
    };

    constructor(props) {
        super(props);

        this.state = {
            
            loading: false,
        };
    }

    componentDidMount = () => {
        this.setState({loading: true});
        setTimeout(
            function() {
                this.setState({loading: false});
                this.props.navigation.navigate('main');
            }
            .bind(this),
            5000
          );
        
    }

    render() {

        

        return (
            <ScrollView
                keyboardShouldPersistTaps={'always'}
                contentContainerStyle={styles.container}
            >
                <View style={styles.innerContainer}>
                    <ActivityLoader loading={this.state.loading}/>
                </View>
                
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
    
    
   
});

const mapStateTopProps = ({user}) => ({user});

export default connect(mapStateTopProps)(LoaderScreen);
