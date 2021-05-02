import { createStackNavigator } from 'react-navigation-stack'
import { createSwitchNavigator } from 'react-navigation'

import Login from '../pages/external/Login'
import SignIn from '../pages/external/Signin'
import IntNavigation from './IntNavigation'

export default ExtNavigation = createStackNavigator(
    {
        Login: {screen: Login},
        SignIn: {screen: SignIn},
        Application: {screen: IntNavigation},
    },
    {
        headerMode: 'none',
        navigationOptions: {
            headerVisible: true,
        }
    }
)