import { StyleSheet } from "react-native";

export default styles = StyleSheet.create({
    mainContainer:{
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F5F5F5',
        padding: 10,
    },
    logo:{
        marginBottom: 20,
    },
    textInput:{
        textAlign: 'left',
        alignSelf: 'stretch',
        backgroundColor: 'white',
        marginTop: 10,
        borderRadius: 5,
        padding: 15,
        
    },
    textMessage:{
        marginVertical: 20,
        textAlign: 'center',
    },
    signInButton:{
        marginTop: 10,
        alignSelf: 'stretch',
        padding: 20,
        backgroundColor: 'rgb(14,104,206)', // = 'navyblue'
        borderRadius: 5,
        marginBottom: 10,
    },
    signUpButton:{
        alignSelf: 'stretch',
        padding: 20,
        borderRadius: 5,
        marginBottom: 10,
    },
    buttonText:{
        textAlign: 'center',
    }
})