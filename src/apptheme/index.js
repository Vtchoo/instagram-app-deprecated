import { StyleSheet } from "react-native";

const ColorSchemes = {
    Default:{
        PrimaryColor: 'rgb(14,104,206)', //rgb(14,104,206) navy
        PrimaryLightColor: 'lightblue', 
        PrimaryDarkColor: 'darkblue',
        SecondaryColor: 'lightgrey',
        SecondaryLightColor: 'white',
        SecondaryDarkColor: 'grey',
        BackGroundColor: undefined,
        MenuBackgroundColor: 'white',
        TextInputBackgroundColor: 'white',
        FontColorDefault: 'black',
        FontColorInverted: 'white',
    },
    Dark:{
        PrimaryColor: 'navy', //rgb(14,104,206) navy
        PrimaryLightColor: 'lightblue', 
        PrimaryDarkColor: 'darkblue',
        SecondaryColor: 'lightgrey',
        SecondaryLightColor: 'white',
        SecondaryDarkColor: 'darkgrey',
        BackgroundColor: 'black',
        MenuBackgroundColor: 'rgb(50, 50, 50)',
        TextInputBackgroundColor: 'rgb(50, 50, 50)',
        FontColorDefault: 'white',
        FontColorInverted: 'white',
    },
}

const ColorScheme = ColorSchemes.Dark

const Theme = StyleSheet.create({
    MainContainer:{
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: ColorScheme.BackgroundColor, //'#F5F5F5',
        //padding: 10,
    },
    MainButton: {
        backgroundColor: ColorScheme.PrimaryColor,
        marginTop: 10,
        alignSelf: 'stretch',
        padding: 20,
        borderRadius: 5,
        marginBottom: 10,
    },
    MainButtonText:{
        textAlign: 'center',
        color: ColorScheme.FontColorInverted,
    },
    SecondaryButton: {
        backgroundColor: ColorScheme.SecondaryColor,
        marginTop: 10,
        alignSelf: 'stretch',
        padding: 20,
        borderRadius: 5,
        marginBottom: 10,
    },
    SecondaryButtonText:{
        textAlign: 'center',
        color: ColorScheme.FontColorDefault,
    },
    MainTextInput:{
        textAlign: 'left',
        alignSelf: 'stretch',
        backgroundColor: ColorScheme.TextInputBackgroundColor,
        color: ColorScheme.FontColorDefault,
        marginTop: 10,
        borderRadius: 5,
        padding: 15,  
    },
    TextInputBase:{
        backgroundColor: ColorScheme.TextInputBackgroundColor,
        color: ColorScheme.FontColorDefault,
    },
    TextTitle:{
        color: ColorScheme.FontColorDefault,
    },
    TextSubtitle:{
        color: ColorScheme.FontColorDefault,
    },
    TextCommon:{
        color: ColorScheme.FontColorDefault,
    },
    Header:{
        backgroundColor: ColorScheme.MenuBackgroundColor,
        alignItems: 'center',
        //justifyContent: 'space-between',
        //backgroundColor: '#F5F5F5',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignSelf: 'stretch',
    },
    FooterTabs:{
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    CommonIcon:{
        fontSize: 30,
        color: ColorScheme.FontColorDefault,
        textAlign: 'center',
    },
})

export default Theme
export { ColorScheme }