import React from 'react';
//import { StyleSheet, Text, View } from 'react-native';

import { Provider } from 'react-redux'
import store from './src/redux/store'

import { App as Application } from './src'

export default function App() { return (
	<Provider store={store}>
   		<Application/>
	</Provider>
)} 