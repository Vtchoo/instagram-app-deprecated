import React, { Component } from 'react'
import { View, Dimensions, StatusBar, TouchableHighlight, Text, Modal, ScrollView, Image } from 'react-native'
import CameraRoll from '@react-native-community/cameraroll'

import ImageEditor from '@react-native-community/image-editor'

import { RNCamera } from 'react-native-camera'
import ZoomView from '../../../src/assets/utils/zoom'

import styles from './styles'

import Ionicon from 'react-native-vector-icons/Ionicons'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { StackActions } from 'react-navigation'

import { accelerometer } from 'react-native-sensors'

//import 'react-native-get-random-values'
//import { v4 as uuidv4} from 'uuid'

const ZOOM_F = 0.05;

const modes = {picture: 0, video: 1}
const actions = { newContent: 0, addContent: 1}
const orientations = { ...RNCamera.Constants.Orientation }



class Camera extends Component{

    constructor(props){
        super(props)

        this.state = {

            mode: modes.picture,

            orientation: RNCamera.Constants.Orientation.portrait,
            zoom: 0,
            focus: {x: .5, y: .5},

            action: actions.newContent,
            content: this.props.navigation.state.params ? this.props.navigation.state.params.content : [],
            information: this.props.navigation.state.params ? this.props.navigation.state.params.information : {},

            cameraRollVisible: false,
            cameraRollContent: [],
            //cameraRollSelectedPhoto,
        }

    }

    

    componentDidMount(){
        StatusBar.setHidden(true)
        this.setOrientationHandler()
        
    }

    setOrientationHandler(){
        this.subscription = accelerometer.subscribe(({ x, y, z }) =>{
            
            //console.log([x,y])
            
            if (this.state.orientation == RNCamera.Constants.Orientation.portrait || this.state.orientation == RNCamera.Constants.Orientation.portraitUpsideDown){
               
                if (Math.abs(x) > Math.abs(y)) { 
                    this.setState({ orientation: x > 0 ? 
                        RNCamera.Constants.Orientation.landscapeRight :  
                        RNCamera.Constants.Orientation.landscapeLeft
                    }, () => console.log(this.state.orientation)) 
                }

            } else {

                if (Math.abs(x) < Math.abs(y)) { 
                    this.setState({ orientation: y > 0 ?
                        RNCamera.Constants.Orientation.portrait : 
                        RNCamera.Constants.Orientation.portraitUpsideDown
                    }, () => console.log(this.state.orientation)) 
                }
            }
        })
    }

    componentWillUnmount(){
        StatusBar.setHidden(false)
        this.subscription.unsubscribe()
    }

    
    takePicture = async () => {
        if (this.camera) {

            const options = { quality: 0.5, base64: false, fixOrientation: true, pauseAfterCapture: true, orientation: this.state.orientation};
            
            var content = this.state.content

            var data = await this.camera.takePictureAsync(options)
        
            //console.log(data)

            const cropData = {
                size: {
                    width: data.width,
                    height: data.width,
                },
                offset: {
                    x: 0,
                    y: (data.height - data.width)/2,
                }
            }

            ImageEditor.cropImage(
                data.uri,
                cropData,
            )
            .then((uri) =>{
                content.push({
                    uri,
                    ...cropData.size,
                    //name: `${uuidv4()}.jpg`,
                })

                this.setState({ content }, () => {
                    this.props.navigation.replace({
                        routeName: 'Information',
                        params: {
                            content: this.state.content,
                            information: this.state.information,
                        }
                    })
                })

                //console.log(content)
            })

          
            
            
            /*
            const data = await this.camera.takePictureAsync(options)
            //alert(data.uri);
            //console.log(this.camera.status)
            var content = this.state.content
            content.push(data)

            this.setState({ content }, () => {

                console.log(typeof(this.props.navigation.state.params))
                
                this.props.navigation.replace({
                    routeName: 'Information',
                    params: {
                        content: this.state.content,
                        //information: this.state.information,
                    }
                })
            })
            */
        }
    }

    openCameraRoll = () => {

        this.setState({ cameraRollVisible: true })

        CameraRoll.getPhotos({
            first: 20,
            assetType: 'Photos',
          })
          .then(r => {
            this.setState({ cameraRollContent: r.edges }, () => console.log(this.state.cameraRollContent));
          })
          .catch((err) => {
             //Error Loading Images
          })
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
                    //ratio='1:1'
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
                    <View style={styles.border}>
                        <Text> </Text>
                    </View>
                    <View style={styles.viewArea}>
                        <Text> </Text>
                    </View>
                    <View style={styles.mainContainer}>
                        <View style={styles.actionsBar}>
                            <View style={styles.buttonRow}>
                                <TouchableHighlight onPress={ this.openCameraRoll } underlayColor='white' style={styles.smallButton}>
                                    <MaterialIcon name='image' style={styles.shutterIcon}/>
                                </TouchableHighlight>
                                <TouchableHighlight onPress={this.state.mode == modes.picture ? this.takePicture : null } underlayColor='white' style={styles.shutterButton}>
                                    <MaterialIcon name='camera-alt' style={styles.shutterIcon}/>
                                </TouchableHighlight>
                                <TouchableHighlight onPress={() => {}} underlayColor='white' style={styles.smallButton}>
                                    <MaterialIcon name='switch-camera' style={styles.shutterIcon}/>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </View>
                </RNCamera>
                
                {/** Camera Roll */}
                <Modal visible={this.state.cameraRollVisible} transparent={true}>
                    <View style={{backgroundColor: 'rgba(0,0,0,.5)', flex: 1}}>
                        <View style={{flex: 1}}>
                            { this.state.cameraRollSelectedPhoto ? 
                                <Image 
                                    source={{uri: this.state.cameraRollSelectedPhoto.node.image.uri}} 
                                    style={{width: '100%', height: '100%', resizeMode: 'contain'}}
                                />
                            : null }
                        </View>
                        <View  style={{height: 100, flexDirection: 'row'}}>
                            <ScrollView horizontal>
                                { this.state.cameraRollContent.map((p, i) => 
                                    <TouchableHighlight style={{padding: 2}} key={i} onPress={() => this.setState({ cameraRollSelectedPhoto: p })}>
                                        <Image source={{uri: p.node.image.uri}} style={{width: 100, height: 100}}/>
                                    </TouchableHighlight>
                                )}
                            </ScrollView>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <TouchableHighlight style={{padding: 20, flex: 1}} onPress={() => this.setState({ cameraRollVisible: false })}>
                                <MaterialIcon name='arrow-back' style={{fontSize: 30, textAlign: 'center', color: 'white'}}/>
                            </TouchableHighlight>
                            <TouchableHighlight style={{padding: 20, flex: 1}} onPress={() => {}}>
                                <MaterialIcon name='add-circle' style={{fontSize: 30, textAlign: 'center', color: 'white'}}/>
                            </TouchableHighlight>
                        </View>
                    </View>
                </Modal>

            </ZoomView>
        )
    }
}

//export { Camera }
export default Camera

/*

<View style={styles.border}/>
                    <View style={styles.viewArea}>
                        <TouchableHighlight style={styles.focusArea} onPress={(event) => this.setFocus(event.nativeEvent)} underlayColor='transparent'><View></View></TouchableHighlight>
                    </View>
                    <View style={styles.mainContainer} >
                        
                        <View style={styles.actionsBar}>
                            <TouchableHighlight onPress={this.state.mode == modes.picture ? this.takePicture : null } underlayColor='white' style={styles.shutterButton}>
                                <Ionicon name='md-camera' style={styles.shutterIcon}/>
                            </TouchableHighlight>
                        </View>
                    </View>
*/