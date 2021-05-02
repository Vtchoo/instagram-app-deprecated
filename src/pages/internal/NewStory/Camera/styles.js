import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    cameraContainer:{
        flex: 1,
        flexDirection: 'column-reverse',
        alignItems: 'center',

    },
    mainContainer:{
        alignSelf: 'stretch',
        flex: 1, 
        flexDirection: 'column',
        //backgroundColor: 'white',
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
    shutterIcon:{
        fontSize: 30,
        textAlign: 'center'
    },
})

export default styles