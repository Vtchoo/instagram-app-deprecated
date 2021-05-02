import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';
import { Icon, Container, Badge } from 'native-base';

import { SwitchActions, StackActions, NavigationActions } from 'react-navigation'
//import { withNavigation } from 'react-navigation'

import { connect } from 'react-redux'

import Ionicon from 'react-native-vector-icons/Ionicons'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'

import Theme, { ColorScheme } from '../../apptheme'

class BottomTabBar extends Component{

    constructor(props){
        super(props)
    }

    navigateTo(routeName, params){
        //this.props.navigation.dispatch(StackActions.push({ routeName, params }))
        this.props.navigation.dispatch(NavigationActions.navigate({ routeName, params }))
    }

    
    
    
    render(){

        var Buttons = {
            'Home': {
                action: () => {},
                icon: 'home-outline', iconActive: 'home',
            },
            'Explore':{
                action: () => {},
                icon: 'magnify', iconActive: 'magnify',
            },
            'NewPost': {
                action: () => this.navigateTo('NewPost'),
                icon: 'plus-box-outline', iconActive: 'plus-box',
            },
            'Activity': {
                action: () => {},
                icon: 'heart-outline', iconActive: 'heart'
            },
            'Profile': {
                action: () => {},
                icon: 'account-outline', iconActive: 'account',
            }
        }
        
        var Button = (props) => 
            <TouchableHighlight onPress={Buttons[props.type].action} style={{padding: 10, flex: 1}}>
                <MaterialIcon name={Buttons[props.type].icon} style={Theme.CommonIcon}/>
            </TouchableHighlight>
            
        return(
            <View style={Theme.Header}>
                {Object.keys(Buttons).map(key => <Button key={key} type={key}/>)}
            </View>
        )
    }

}






const styles = StyleSheet.create({
    mainContainer:{
        //borderTopWidth: 5,
        //backgroundColor: 'white',
        //elevation: 150,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button:{
        flex: 1,
        padding: 10,
    },
    icon:{
        textAlign: 'center',
        fontSize: 30,
    },
})

const mapStateToProps = state => ({
     	notificacoes: state.notificacoes,
    })

export default connect(mapStateToProps)(BottomTabBar)

