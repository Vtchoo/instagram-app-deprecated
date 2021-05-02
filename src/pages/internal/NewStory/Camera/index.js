import React, { Component } from 'react'
import { View, Dimensions, StatusBar, CameraRoll, TouchableHighlight } from 'react-native'

import { RNCamera } from 'react-native-camera'
import ZoomView from '../../../../assets/utils/zoom'

import styles from './styles'

import Ionicon from 'react-native-vector-icons/Ionicons'
import { StackActions } from 'react-navigation'

const ZOOM_F = 0.05;

const modes = {picture: 0, video: 1}
const actions = { newContent: 0, addContent: 1}

class Camera extends Component{

    constructor(props){
        super(props)

        this.state = {

            mode: modes.picture,

            orientation: 'portrait',
            zoom: 0,
            focus: {x: .5, y: .5},

            action: actions.newContent,
            content: [],
            //information: this.props.navigation.state.params.information || {},

        }

    }



    componentDidMount(){
        StatusBar.setHidden(true)
    }

    componentWillUnmount(){
        StatusBar.setHidden(false)
    }

    
    takePicture = async () => {
        if (this.camera) {
            const options = { quality: 0.5, base64: false, fixOrientation: true, pauseAfterCapture: true};
            const data = await this.camera.takePictureAsync(options)
            //alert(data.uri);
            //console.log(this.camera.status)
            var content = this.state.content
            content.push(data)

            this.setState({ content }, () => {

                console.log(typeof(this.props.navigation.state.params.getNewContentArray))
                
                this.props.navigation.replace({
                    routeName: 'Information',
                    params: {
                        content: this.state.content,
                        //information: this.state.information,
                    }
                })
            })
        }
    }

    
    /*
     * ZOOM PINCH GESTURE HANDLER
     * Made by cristianoccazinsp (check GitHub)
     */
    
    onPinchStart = () => {
        console.log('teste')
        this._prevPinch = 1;
    }
    
    onPinchEnd = () => {
        this._prevPinch = 1;
    }
      
    onPinchProgress = (p) => {
        
        let p2 = p - this._prevPinch;
    
        if(p2 > 0 && p2 > ZOOM_F){
          this._prevPinch = p;
          this.setState({zoom: Math.min(this.state.zoom + ZOOM_F, 1)})
        }
        else if (p2 < 0 && p2 < -ZOOM_F){
          this._prevPinch = p;
          this.setState({zoom: Math.max(this.state.zoom - ZOOM_F, 0)})
        }
    }

    setFocus(event){
        //console.log(event)
        const { pageX, pageY } = event;
        const x0 = pageX / Dimensions.get('screen').width;
        const y0 = pageY / Dimensions.get('screen').height
        
        const x = y0;
        const y = -x0 + 1;
        
        this.setState({ focus: { x, y }}, () => {console.log(this.state.focus)})

        
    }

    render(){
        return (
            <ZoomView style={{flex: 1}}
                onPinchStart={this.onPinchStart} 
                onPinchEnd={this.onPinchEnd}
                onPinchProgress={this.onPinchProgress}>
                
                <RNCamera

                    zoom={this.state.zoom}
                    ref={camera => { this.camera = camera }}
                    style = {styles.cameraContainer}//, flexDirection: this.state.orientation == 'portrait' ? 'column-reverse' : 'row-reverse',}}
                    type={RNCamera.Constants.Type.back}
                    autoFocus={RNCamera.Constants.AutoFocus.on}
                    autoFocusPointOfInterest={this.state.focus}
                    flashMode={RNCamera.Constants.FlashMode.off}
                    ratio='16:9'
                    captureAudio={false} 
                    androidCameraPermissionOptions={{
                        message: 'teste',
                        title: 'permissão',
                        buttonPositive: 'sim',
                        buttonNegative: 'não',
                    }}
                    androidRecordAudioPermissionOptions={{
                        message: 'teste',
                        title: 'permissão',
                        buttonPositive: 'sim',
                        buttonNegative: 'não',
                    }}
                >
                    <View style={styles.mainContainer} >
                        <TouchableHighlight style={styles.focusArea} onPress={(event) => this.setFocus(event.nativeEvent)} underlayColor='transparent'><View></View></TouchableHighlight>
                        <View style={styles.actionsBar}>
                            <TouchableHighlight onPress={this.state.mode == modes.picture ? this.takePicture : null } underlayColor='white' style={styles.shutterButton}>
                                <Ionicon name='md-camera' style={styles.shutterIcon}/>
                            </TouchableHighlight>
                        </View>
                    </View>
                </RNCamera>
               
            </ZoomView>
        )
    }
}

//export { Camera }
export default Camera