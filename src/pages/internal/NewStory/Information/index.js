import React, { Component } from 'react'
import { View, ScrollView } from 'react-native'




class Information extends Component{

    constructor(props){
        super(props)
        //console.log(props.navigation.state.params)

        this.state ={
            ...props.navigation.state.params
        }

        console.log(this.state)
    }



    render(){
        return (
            <View>
                <ScrollView horizontal>
                    
                </ScrollView>
            </View>
        )
    }
}

export default Information