import React, { Component } from 'react'
import { View, ScrollView, Text, Image, TouchableHighlight, TextInput, StyleSheet, Alert, ToastAndroid, StatusBar, Modal, ActivityIndicator, UIManager, Platform, LayoutAnimation } from 'react-native'

import styles from './styles'

import MaterialIcon from 'react-native-vector-icons/MaterialIcons'

import Header from '../../../navigation/components/Header'

import { connect } from 'react-redux'

import api from '../../../services/api'
import Camera from './camera'
import Theme, { ColorScheme } from '../../../apptheme'

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}
  


const Status = {
    LOADING: 0,
    SENDING: 1,
    SUCCESS: 2,
    ERROR: 3,
}



class NewPost extends Component{

    constructor(props){
        super(props)
        //console.log(props)

        this.state = {

            // Post data
            content: [],
            information: {},
            
            // UI
            showCamera: false,
            showEdit: false,
            showStatus: false,
            status: Status.LOADING,
        }

        //console.log(this.state)
    }

    

    addContent = (data) => {

        var content = this.state.content
        content.push(data)
        this.setState({ content }, () => console.log(this.state.content))
    }

    CancelPost(){
        Alert.alert(
			'Discard post',
			'Do you wish to discard this post?',
			[
			  	{
					text: 'Cancel',
					style: 'cancel',
			  	},
			  	{
				  	text: 'Discard', 
				  	onPress: () => this.props.navigation.pop()
				},
			],
			{cancelable: true},
		)
    }
		
    CustomHeader = () =>
    <View style={this.headerStyles.header}>
        <MaterialIcon name='arrow-back' style={this.headerStyles.icon} onPress={() => this.CancelPost()}/>
        
        <Text style={this.headerStyles.headertext}>New Post</Text>
        <TouchableHighlight onPress={() => this.confirmShare()} underlayColor='lightgrey'>
            <Text style={{margin: 10, color: 'blue'}}>Share</Text>
        </TouchableHighlight>
    </View>

    headerStyles = StyleSheet.create({
        header: {
            backgroundColor: 'white',
            alignItems: 'center',
            //justifyContent: 'space-between',
            //backgroundColor: '#F5F5F5',
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        headertext: {
            marginVertical: 10,
            fontSize: 20,
            textAlign: 'center',
            flex: 1,
            textAlignVertical: 'center',
        },
        icon: {
            fontSize: 30,
            marginHorizontal: 10,
        },
    })

    confirmShare(){
        Alert.alert(
			'New Post',
			'Confirm new post?',
			[
			  	{
					text: 'Cancel',
					style: 'cancel',
			  	},
			  	{
				  	text: 'Confirm', 
				  	onPress: () => this.sharePost()
				},
			],
			{cancelable: true},
		)
    }

    sharePost = async () => {

        this.setState({ showStatus: true, status: Status.SENDING })

        const formData = new FormData();

		var post = {
            token: this.props.user.token,
            user: this.props.user.info.ID,
            information: this.state.information,
            content: this.state.content,
        }
		var json = JSON.stringify(post)
		formData.append('post', json)

		formData.append('token', this.props.user.token)

		this.state.content.forEach((content, i) => {
			formData.append(`content${i}`, {
				uri: content.uri,
				type: content.type,
				name: `${content.uri.split('/').pop()}`,
			})
		})
        
        console.log(formData)
		
		var self = this
        
        api.post('/api/NewPost', formData)
		.then(function(response){
            //ToastAndroid.show("Post shared successfully!", ToastAndroid.LONG)
            self.setState( { status: Status.SUCCESS })
            setTimeout(() => self.props.navigation.pop(), 2000)
            //console.log(response)
        })
		.catch(function(error){
			if (error.response) {
				console.log('Erro do servidor')
				console.log(error.response.data);
				console.log(error.response.status);
				console.log(error.response.headers);
			} else if (error.request) {
				console.log('Erro do client')
				console.log(error.request);
			} else {
				console.log('Outro erro')
				console.log('Error: ' + error.message);
			}
			console.log('Informações:')
            //console.log(error.config)

            self.setState({ status: Status.ERROR })
            setTimeout( () => self.setState({ showStatus: false }), 2000)
        })
    }

    render(){
        return (
            <View style={{flex: 1}}>
                {/* <Header ScreenName='New Post'/> */}
                {this.CustomHeader()}
                <ScrollView style={styles.mainContainer}>
                    <View style={styles.container}>
                        <ScrollView horizontal styles={styles.contentSlider}>
                            {this.state.content.map((content, i) =>
                                <TouchableHighlight key={i} style={styles.contentFrame} onPress={() => {}} underlayColor='white'>
                                    <Image source={{uri: content.uri}} style={styles.thumbnail}/>
                                </TouchableHighlight>
                            )}
                            { this.state.content.length < 10 &&
                                <View style={styles.contentFrame}>
                                    <TouchableHighlight style={styles.addContentButton} onPress={() => this.setState({ showCamera: true })}>
                                        <MaterialIcon name='camera-alt' style={{fontSize: 20, textAlign: 'center'}}>+</MaterialIcon>
                                    </TouchableHighlight>
                                </View>
                            }
                        </ScrollView>

                    </View>

                    <View style={styles.container}>
                        <TextInput style={styles.textInput}
                            onChangeText={text => {
                                var information = this.state.information
                                information.description = text
                                this.setState({ information })
                            }}
                            placeholder="Add a description to your post..."
                            value={this.state.information.description}
                            autoCapitalize="none"
                            multiline
                            numberOfLines={5}
                            maxLength={1000}/>
                    </View>

                    <View style={styles.container}>
                        <Text style={styles.title}>Tags</Text>
                    </View>


                </ScrollView>

                {/* Modals */}
                {/* Camera */}
                { this.state.showCamera && 
                    <Camera 
                        onRequestClose={() => this.setState({ showCamera: false })}
                        onTakePicture={(data) => this.addContent(data)}    
                    />
                }

                {/* Status indicator */}
                <Modal transparent={true} visible={this.state.showStatus}>
                    <View style={{flex: 1, backgroundColor: 'rgba(128,128,128,.5)', flexDirection: 'column', justifyContent: 'center'}}>
                        { this.state.status == Status.SENDING ?
                            <View>
                                <ActivityIndicator size={40} color={ColorScheme.FontColorDefault}/>
                                <Text style={{textAlign: 'center'}}>Sending post...</Text>
                            </View>
                        : this.state.status == Status.SUCCESS ?
                            <View>
                                <MaterialIcon name='check' style={{fontSize: 50, color: 'green', textAlign: 'center'}}/>
                                <Text style={{textAlign: 'center'}}>Post shared successfully!</Text>
                            </View>
                        : this.state.status == Status.ERROR ?
                            <View>
                                <MaterialIcon name='close' style={{fontSize: 50, color: 'red', textAlign: 'center'}}/>
                                <Text style={{textAlign: 'center'}}>Error</Text>
                            </View>
                        : null }    
                    </View>
                </Modal>

            </View>
        )
    }
}


const mapStateToProps = state => ({
	user: state.user,
})

export default connect(mapStateToProps, null)(NewPost)
//export default Information