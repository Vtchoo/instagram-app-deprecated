import React, { Component } from 'react'
import { View, TextInput, TouchableHighlight, Text, ScrollView, ToastAndroid } from 'react-native'
import Header from '../../../navigation/components/Header'
import Theme, { ColorScheme } from '../../../apptheme'

import api from '../../../services/api'
import { NavigationActions } from 'react-navigation'

class SignIn extends Component {

    constructor(props){
        super(props)

        this.state = {

            username: '',
            email: '',
            password: '',
            confirmPassword: '',

            userExists: false,
            usernameMessage: '',

            validEmail: false,
            emailMessage: '',

            validPassword: true,
            passwordMessage: '',

            matchingPassword: false,

            message: '',
        }
    }

    async verifyUsername(username){
        this.setState({ username })

        if(username != ''){
            const { data: userExists } = await api.get(`/api/users/verify/username/${username}`)
        
            if(userExists)
                this.setState({ userExists, usernameMessage: `User ${username} already exists` })
            else 
                this.setState({ userExists, usernameMessage: `User ${username} is available` })
            
        }
    }

    async verifyEmail(email){
        this.setState({ email })

        const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

        if(email != ''){

            if(!regex.test(email)){
            
                this.setState({ validEmail: false, emailMessage: 'Invalid email format' })
            
            } else {
            
                const { data: emailExists } = await api.get(`/api/users/verify/email/${email}`)

                if(emailExists){
                    this.setState({ validEmail: !emailExists, emailMessage: `${email} is already in use` })
                } else {
                    this.setState({ validEmail: !emailExists, emailMessage: `${email} is available` })
                }
            }
        }
    }

    setPassword(password){
        this.setState({ 
            password,
            matchingPassword: password == this.state.confirmPassword,
        })
    }

    setConfirmPassword(confirmPassword){
        this.setState({ 
            confirmPassword,
            matchingPassword: confirmPassword == this.state.password,
        })
    }

    async createAccount(){

        const self = this

        if( !this.state.userExists && this.state.validEmail && this.state.matchingPassword ){
            this.setState({ message: '' })

            api.post('/api/users', { 
                user:{
                    username: this.state.username,
                    password: this.state.password,
                    email: this.state.email,
                }
            })
            .then( response => {
                console.log(response)
                ToastAndroid.show('User registered successfully!')
                self.props.navigation.dispatch(NavigationActions.back())
            })
            .catch( error => console.log(error) )

        } else {
            this.setState({ message: 'Invalid credentials supplied. Check your data again.' })
        }

    }

    render(){
        return(
            <View style={{flex: 1, backgroundColor: ColorScheme.BackgroundColor}}>
                <Header LeftButton='Back' ScreenName='New account' navigation={this.props.navigation}/>
                <ScrollView>
                    <View style={{padding: 10}}>
                        <Text style={Theme.TextCommon}>Username</Text>
                        <View style={{
                            borderBottomWidth: 2,
                            borderBottomColor: this.state.username == '' ? 'transparent' :
                            this.state.userExists ? 'red' : 'green'
                        }}>
                            <TextInput 
                                value={this.state.username}
                                style={Theme.TextInputBase}
                                onChangeText={text => this.verifyUsername(text)}
                            />
                        </View>
                        { this.state.username != '' &&
                        <Text style={{textAlign: 'right', color: this.state.userExists ? 'red' : 'green' }}>
                            {this.state.usernameMessage}
                        </Text>}
                    </View>

                    <View style={{padding: 10}}>
                        <Text style={Theme.TextCommon}>E-mail</Text>
                        <View style={{
                            borderBottomWidth: 2,
                            borderBottomColor: this.state.email == '' ? 'transparent' :
                            this.state.validEmail ? 'green' : 'red'
                        }}>
                            <TextInput 
                                keyboardType='email-address'
                                value={this.state.email}
                                style={Theme.TextInputBase}
                                onChangeText={text => this.verifyEmail(text)}
                            />
                        </View>
                        { this.state.email != '' &&
                        <Text style={{textAlign: 'right', color: this.state.validEmail ? 'green' : 'red' }}>
                            {this.state.emailMessage}
                        </Text>}
                    </View>

                    <View style={{padding: 10}}>
                        <Text style={Theme.TextCommon}>Password</Text>
                        <View>
                            <TextInput 
                                secureTextEntry
                                value={this.state.password}
                                style={Theme.TextInputBase}
                                onChangeText={text => this.setPassword(text)}
                            />
                        </View>
                    </View>

                    <View style={{padding: 10}}>
                        <Text style={Theme.TextCommon}>Confirm password</Text>
                        <View style={{
                            borderBottomWidth: 2,
                            borderBottomColor: this.state.confirmPassword == '' ? 'transparent' :
                            this.state.matchingPassword ? 'green' : 'red'
                        }}>
                            <TextInput 
                                secureTextEntry
                                value={this.state.confirmPassword}
                                style={Theme.TextInputBase}
                                onChangeText={text => this.setConfirmPassword(text)}
                            />
                        </View>
                        { this.state.confirmPassword != '' && !this.state.matchingPassword &&
                        <Text style={{textAlign: 'right', color: this.state.matchingPassword ? 'green' : 'red' }}>
                            {'Passwords don\'t match'}
                        </Text>}
                    </View>

                    { this.state.message != '' &&
                    <Text style={{color: 'red', textAlign: 'center'}}>{this.state.message}</Text> }

                    <TouchableHighlight  onPress={() => this.createAccount()} underlayColor={ColorScheme.PrimaryLightColor} style={Theme.MainButton}>
                        <Text style={Theme.MainButtonText}>Create account</Text>
                    </TouchableHighlight>
                </ScrollView>
            </View>
        )
    }
}

export default SignIn