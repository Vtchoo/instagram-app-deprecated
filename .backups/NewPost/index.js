import React from 'react'


import Camera from './Camera'
import Information from './Information'

import { createStackNavigator } from "react-navigation-stack"

//import Edit from './Edit'

var NewPost = createStackNavigator({
    Camera: { screen: Camera, },
    //Edit: { screen: Edit },
    Information: { screen: Information },
},{
    defaultNavigationOptions:{
        headerShown: false,
    },
})

export default NewPost