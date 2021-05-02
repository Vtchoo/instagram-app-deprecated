import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableHighlight, Image } from 'react-native';

import { NavigationActions, StackActions } from 'react-navigation';

//import { Icon } from 'native-base'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'

import Theme, { ColorScheme } from '../../apptheme'

const BackButton = (props) => {
  	return ( 
		<TouchableHighlight underlayColor='white' style={{ paddingVertical: 11, /*backgroundColor: 'red'*/ }} onPressOut={() => props.navigation.dispatch(NavigationActions.back())/*() => props.navigation.goBack()*/}>
			<Icon name='arrow-back' style={{fontSize: 40, marginHorizontal: 20/*, margin: 11*/}}/>
		</TouchableHighlight>
  	)
}


var Button = (props) => {

	var Buttons = {
		'Back': {
			action: () => props.navigation.dispatch(NavigationActions.back()),
			icon: 'arrow-left',
		},
		'Camera':{
			action: () => props.navigation.dispatch(StackActions.push({ routeName: 'NewStory', })),
			icon: 'camera-outline',
		},
		'Direct': {
			action: () => () => props.navigation.dispatch(NavigationActions.back()),
			icon: 'send',
		},
	}

	return(
		<TouchableHighlight 
			onPressOut={Buttons[props.type].action}
			underlayColor='white' 
			style={{paddingHorizontal: 20, paddingVertical: 10}}>
			
			<MaterialIcon name={Buttons[props.type].icon} style={Theme.CommonIcon}/>
		</TouchableHighlight>
	)
}





export default class Header extends Component {

	constructor(props){
		super(props)
		//console.log(props)
	}

	render() {
		return (
			<View style={Theme.Header}>
				{ this.props.LeftButton && <Button type={this.props.LeftButton} navigation={this.props.navigation}/> }
				{ this.props.ScreenName ? 
					<Text style={styles.headertext}>{this.props.ScreenName}</Text>
				:
					<Image source={require('../../assets/images/instagram.png')} style={{}}/>
				}
				{ this.props.RightButton && <Button type={this.props.RightButton} navigation={this.props.navigation}/> }
			</View>
		)
	}
}

//{(() => { if(this.props.BackButton) return <BackButton navigation={this.props.navigation}/>})()}
//<Trigger />
//
var styles = StyleSheet.create({
	headertext: {
		marginVertical: 10,
		fontSize: 20,
		textAlign: 'center',
		//width: 100,
		flex: 1,
		textAlignVertical: 'center',
		//backgroundColor: 'darkgrey' // Ativar opção para visualizar hitbox
	},
	icon: {
		fontSize: 30,
		marginHorizontal: 20,
	},
});

//export default Header;