import { StyleSheet } from "react-native";

const contentSize = 100
const defaultPadding = 5

const styles = StyleSheet.create({
    mainContainer:{
        flex: 1,
        //backgroundColor: 'red',
    },
    container:{
        padding: 10,
    },
    title:{
        fontSize: 20,
    },
    subtitle:{

    },
    textInput:{
        //flex: 1,
        backgroundColor: 'white',
        fontSize: 15,
        padding: 5,
        textAlignVertical: 'top',
    },
    contentSlider:{
        padding: 10,
    },
    contentFrame:{
        padding: 5,
    },
    thumbnail:{
        width: contentSize,
        height: contentSize,
        borderRadius: 5,
        resizeMode: 'contain',
    },
    addContentButton:{
        width: contentSize,
        height: contentSize,
        borderRadius: 5,
        justifyContent: 'center',
        backgroundColor: 'white',
    },
})

export default styles