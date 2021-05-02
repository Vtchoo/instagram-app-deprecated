import { StyleSheet, Dimensions } from "react-native";

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

export default styles