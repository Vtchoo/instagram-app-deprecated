import React, { Component } from 'react'
import { StyleSheet, View, Dimensions, StatusBar, TouchableHighlight, Text, Modal, ScrollView, Image, Platform, UIManager, LayoutAnimation, PermissionsAndroid } from 'react-native'
import CameraRoll from '@react-native-community/cameraroll'

import ImageEditor from '@react-native-community/image-editor'

import { RNCamera } from 'react-native-camera'
import ZoomView from '../../../assets/utils/zoom'

import Ionicon from 'react-native-vector-icons/Ionicons'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
//import { StackActions } from 'react-navigation'

import { accelerometer } from 'react-native-sensors'

//import 'react-native-get-random-values'
//import { v4 as uuidv4} from 'uuid'

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

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
                        RNCamera.Constants.Orientation.landscapeLeft :  
                        RNCamera.Constants.Orientation.landscapeRight
                    }) 
                }

            } else {

                if (Math.abs(x) < Math.abs(y)) { 
                    this.setState({ orientation: y > 0 ?
                        RNCamera.Constants.Orientation.portrait : 
                        RNCamera.Constants.Orientation.portraitUpsideDown
                    }) 
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
            
            var data = await this.camera.takePictureAsync(options)
        
            //console.log(data)

            const cropData = {
                size: {
                    width: Math.min(data.width, data.height),
                    height: Math.min(data.width, data.height),
                },
                offset: {
                    x: data.height > data.width ? 0 : (data.width - data.height)/2,
                    y: data.height > data.width ? (data.height - data.width)/2 : 0,
                }
            }

            ImageEditor.cropImage(
                data.uri,
                cropData,
            )
            .then((uri) =>{
                this.props.onTakePicture({ uri, ...cropData.size, type: 'image/jpeg' })
                this.props.onRequestClose()
            })
        }
    }

    addFromCameraRoll = () => {
        if(this.state.cameraRollSelectedPhoto){
            var data = this.state.cameraRollSelectedPhoto.node
            console.log(data)
            var image = {
                width: data.image.width,
                height: data.image.height,
                uri: data.image.uri,
                type: data.type,
            }
            this.props.onTakePicture(image)
            this.props.onRequestClose()
        }
        //this.props.onTakePicture({ uri: p. })

    }

    openCameraRoll = async () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
        this.setState({ cameraRollVisible: true })

        if (await this.requestExternalStoreageRead()){
            CameraRoll.getPhotos({
                first: 20,
                assetType: 'Photos',
            })
            .then(r => {
                this.setState({ cameraRollContent: r.edges })//() => console.log(this.state.cameraRollContent))
            })
            .catch((err) => {
                console.log(err)
                //Error Loading Images
            })
        }
    }

    async requestExternalStoreageRead() {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                {
                    'title': 'Read storage ...',
                    'message': 'Instagram needs access to external storage'
                }
            )
            return granted == PermissionsAndroid.RESULTS.GRANTED
        } 
        catch (err) {
            //Handle this error
            return false;
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
            <Modal
                transparent={true}
                onRequestClose={this.props.onRequestClose}
                >
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
                                <TouchableHighlight style={{padding: 20, flex: 1}} onPress={() => this.addFromCameraRoll()}>
                                    <MaterialIcon name='add-circle' style={{fontSize: 30, textAlign: 'center', color: 'white'}}/>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </Modal>
                </ZoomView>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    cameraContainer:{
        flex: 1,
        flexDirection: 'column',
    },
    border:{
        flex: 1,
        backgroundColor: 'rgba(255,255,255,.5)',
    },
    viewArea:{
        width: Dimensions.get('window').width,
        aspectRatio: 1,
        //backgroundColor: 'red',
    },
    mainContainer:{
        alignSelf: 'stretch',
        flex: 1, 
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,.5)',
    },
    buttonRow:{
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
    },  
    focusArea:{
        flex: 1,
    },
    actionsBar:{
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
        //backgroundColor: 'white',
    },
    shutterButton:{
        width: 80, 
        height: 80, 
        borderRadius: 40, 
        //backgroundColor: 'white',
        backgroundColor: 'rgba(255,255,255,0.25)',
        justifyContent: 'center',
    },
    smallButton:{
        width: 60, 
        height: 60, 
        borderRadius: 30, 
        //backgroundColor: 'white',
        backgroundColor: 'rgba(255,255,255,0.25)',
        justifyContent: 'center',
    },
    shutterIcon:{
        fontSize: 30,
        textAlign: 'center'
    },
})


//export { Camera }
export default Camera
