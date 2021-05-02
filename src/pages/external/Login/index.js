import React, { Component } from 'react';

import { StatusBar, AsyncStorage, ToastAndroid, Text, TextInput, TouchableHighlight, View } from 'react-native';
import { StackActions, NavigationActions, SwitchActions } from 'react-navigation';

import api from '../../../services/api';
//import NetInfo from '@react-native-community/netinfo'

// Redux
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as loginActions from '../../../redux/actions/login' 

import Theme, { ColorScheme } from '../../../apptheme'

class Login extends Component {

	constructor(props){
		super(props)
		//console.log(props)
		//console.log(this.state)
	}

	static navigationOptions = {
    	headerShown: false,
  	};

  	state = { 
		
		user: __DEV__ ? 'vtchoo' : '', 
		password: __DEV__ ? 'impostoeroubo' : '', 
		message: '' 
	};

  	handleSignInPress = async () => {

		//ToastAndroid.show("teste", ToastAndroid.LONG);
		this.setState({ message: '' })

    	if (this.state.user.length === 0 || this.state.password.length === 0) {

			this.setState({ message: 'Fill user and password fields to continue' }, () => false);

    	} else {

			
			/*
			var conectado
			await NetInfo.fetch().then(state => {conectado=state.isConnected})
			if (!conectado){
				this.setState({ message: 'Sem conexão com a internet' })
				return
			}
			*/

			/*
			 * Sistema de login com axios
			 */

			var self = this 							// 'this' é usado em contexto diferente dentro das funções de
			api.post('api/login',{						// callback do axios e é um objeto undefined. Para contornar isso,
				user: this.state.user,					// declara-se a variável self, apontando para o verdadeiro 'this'
				password: this.state.password,
				//dev: __DEV___,
			})
			.then(function(response){

        		ToastAndroid.show(`Welcome, ${response.data.username}`, ToastAndroid.LONG);

				console.log(response.data)
				api.defaults.headers.common['token'] = response.headers['token']
				self.login(response.data, response.headers['token'])

				// const enterApp = SwitchActions.jumpTo({ routeName: 'Application' })
				// self.props.navigation.dispatch(enterApp)

				self.props.navigation.dispatch(StackActions.reset({
						index: 0,
						actions: [
							NavigationActions.navigate({ routeName: 'Application' }),
						],
					})
				)

			})
			.catch(function(error){
				if(error.response){
					console.log('erro do servidor')
					console.log(error.response.status)
					self.setState({ message: error.response.status })
					switch (error.response.status) {
						case 403:
							self.setState({ message: 'Wrong user or password' })
							break;
						case 500:
							self.setState({ message: 'Internal server error' })
							break;
						default:
							self.setState({ message: `Error ${error.response.status}` })
							break;
					}
				} else if (error.request){
					console.log('erro do client')
					console.log(error.request)
					self.setState({ message: 'It wasn\'t possible to estabilish a connection to server. The system is probably out of service.' })
				} else {
					console.log('outro erro')
					console.log(error.message)
					self.setState({ message: error.message })
				}
			})
    	}
	};

	
	login(user, token) {
		//console.log(this.props)
		this.props.login(user, token)
		console.log(this.props.user)
		//console.log(dados.usuario)
	}
	

	render() {

		return(
			<View style={{...Theme.MainContainer, padding: 10}}>
				<Text style={Theme.TextTitle}>[Imagine o logotipo do instagram aqui]</Text>
				<TextInput 
					style={Theme.MainTextInput}
					onChangeText={text => this.setState({user: text})}
					placeholder="User or email"
					value={this.state.user}
					autoCapitalize="none"
					autoCorrect={false}
					//autoFocus={true}
					returnKeyType='next'
					blurOnSubmit={false}
					onSubmitEditing={() => this.passwordRef.focus()} />

				<TextInput 
					style={Theme.MainTextInput}
					ref={passwordRef => this.passwordRef = passwordRef}
					placeholder="Password"
					value={this.state.password}
					onChangeText={text => this.setState({password: text})}
					autoCapitalize="none"
					autoCorrect={false}
					secureTextEntry/>

				{this.state.message.length > 0 && <Text style={Theme.TextSubtitle}>{this.state.message}</Text>}

				<TouchableHighlight 
					//style={styles.signInButton} 
					style={Theme.MainButton}
					onPress={() => this.handleSignInPress()} 
					underlayColor='lightblue'>
					<Text style={Theme.MainButtonText}>Login</Text>
				</TouchableHighlight>

				<TouchableHighlight 
					style={{...Theme.SecondaryButton, backgroundColor: ColorScheme.BackgroundColor}} 
					onPress={() => this.props.navigation.dispatch(NavigationActions.navigate({ routeName: 'SignIn' }))} 
					underlayColor='white'>
					<Text style={Theme.SecondaryButtonText}>Create Account</Text>
				</TouchableHighlight>

				<Text style={Theme.TextCommon}>{'Feito com ♥ por Vtchoo'}</Text>
				
			</View>
		)
	}
}


const mapStateToProps = state => ({
	user: state.user,
})


const mapDispatchToProps = dispatch => bindActionCreators(loginActions, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Login)
//export default Login
