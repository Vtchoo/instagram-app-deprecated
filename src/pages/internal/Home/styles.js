import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    mainContainer:{
        flex: 1,
    },
    card: {
        paddingBottom: 10,
    },
    cardHeader:{
        flex: 1, 
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 5,
    },
    cardHeaderText:{
        marginLeft: 5,
    },
    cardFooter:{
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cardButtons:{
        padding: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardButton:{
        fontSize: 30,
        marginHorizontal: 7.5,
    },
    cardContent:{

    },
    cardImage:{

    },
    cardDescription:{
        padding: 10,
    },  
    descriptionUser:{
        fontWeight: 'bold',
    },
    description:{

    },
})

export default styles