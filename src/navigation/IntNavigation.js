import React from 'react'


//import { createBottomTabNavigator } from 'react-navigation-tabs'

import Home from '../pages/internal/Home'
import NewStory from '../pages/internal/NewStory'
import NewPost from '../pages/internal/NewPost2'

import { createSwitchNavigator } from 'react-navigation'
import createAnimatedSwitchNavigator from 'react-navigation-animated-switch'

import { Transition } from 'react-native-reanimated'
import { createStackNavigator } from 'react-navigation-stack'
import { Image } from 'react-native'
import { Icon } from 'native-base'



var IntNavigation = createStackNavigator({
    Home: { screen: Home },
    NewStory: { screen: NewStory },
    NewPost: { screen: NewPost },
    //Notifications: { screen: Notifications },
    //Explore: { screen: Explore },
    //Profile: { screen: Profile }
},{
    //resetOnBlur: false,
    backBehavior: 'initialRoute',
    transition: (
        // Transição FADE
        
        <Transition.Together>   
            <Transition.Out
                type='fade'
                //type='slide-left'
                durationMs={200}
                interpolation='linear'
            />
            <Transition.In 
                type="fade" 
                //type='slide-left'
                durationMs={200} 
                interpolation='linear'
            />
        
        </Transition.Together>
    ),
    defaultNavigationOptions:{
        headerShown: false,                     // true para usar header do próprio navegador
        //gestureDirection: "horizontal",
        //gestureEnabled: true,
        headerLeftContainerStyle: {padding: 10},
        headerLeft: () => <Icon name='md-arrow-back' />,
        headerRight: () => <Icon name='md-arrow-back' />,
        headerTitle: () => <Image source={require('../assets/images/instagram.png')}/>,
    }
})
/*
 
*/



/*
const mapStateToProps = state => ({
    usuario: state.infoUsuario,
})
*/

//export default connect(mapStateToProps)(IntNavigation)
export default IntNavigation
