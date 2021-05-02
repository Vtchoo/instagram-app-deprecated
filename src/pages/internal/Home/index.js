import React, { Component } from 'react'
import { View, Text, FlatList, SectionList, Image, Dimensions, ScrollView, RefreshControl, TouchableHighlight, ActivityIndicator } from 'react-native'

import { connect } from 'react-redux'

import Header from '../../../navigation/components/Header'
import BottomTabBar from '../../../navigation/components/TabBar'

import styles from './styles'
import Theme, { ColorScheme } from '../../../apptheme'

import api from '../../../services/api'

import RNFetchBlob from 'rn-fetch-blob'

//import { Icon } from 'native-base'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'

// Components
import { Post } from '../../../components'


class Home extends Component {

    sampleProfiles = {
        2: {
            username: 'lena',
            profilepic: require('../../../../testassets/Profile/Profilepics/lena.jpg')
        },
        1: {
            username: 'Vtchoo',
            profilepic: require('../../../../testassets/Profile/Profilepics/default.jpg')
        },
    }
    
    /*
    samplePosts = [{
        userID: 2,
        content: [
            {
                image: 'lena1.jpg',
                width: 1,
                height: 1,
                //uri: '',
                source: require('../../../../testassets/Content/lena1.jpg')
            }
        ]
    },
    {
        userID: 2,
        content: [
            {
                image: 'lena1.jpg',
                //uri: '',
                source: require('../../../../testassets/Content/lena1.jpg')
            }
        ]
    },
    {
        userID: 2,
        content: [
            {
                image: 'lena1.jpg',
                //uri: '',
                source: require('../../../../testassets/Content/lena1.jpg')
            }
        ]
    }]
    */

    sampleStories = []


    constructor(props){
        super(props)

        this.state = {

            // Posts per request
            start: 0,
            amount: 10,

            test: [],

            // Loaded content
            profiles: this.sampleProfiles,
            stories: this.sampleStories,
            posts: [],//this.samplePosts,

            // Refresh posts
            refreshing: false,
            loading: false,
        }
    }

    componentDidMount(){

       this.fetchPosts()

    }

    componentWillUnmount(){
        RNFetchBlob.session('home').dispose()
        console.log('dismount')
    }

    handleEndReached = async () => {
        console.log('end reached')
        if ( !this.state.loading )
            this.fetchPosts()
    }

    fetchPosts = async () => {

        this.setState({ loading: true })

        var newPosts = []

        await api.post('/api/home/getPosts', { 
            token: this.props.user.token,
            user: this.props.user.info.ID,
            following: this.props.user.info.following,
            start: this.state.start,
            amount: this.state.amount,
        })
        .then(response => {
            //console.log(response.data)
            newPosts = response.data

        })
        .catch(error => {
            console.log(error)
        })

        this.setState({ loading: false })

        // Added after
        if (newPosts.length > 0) {

            var currentStart = this.state.start
            
            this.setState({ posts: [...this.state.posts, ...newPosts], start: this.state.start + newPosts.length }, () => console.log(this.state.start))
            var currentLength = this.state.posts.length
        }
        //console.log('new posts:')
        //console.log(newPosts)

        
        //this.setState({ start: this.state.start + this.state.amount })
    }

    // renderCard = (item) => {

    //     var width = Dimensions.get('window').width
    //     var aspectRatio = Math.min(item.content[0].height / item.content[0].width, 1)
    //     var height = width * aspectRatio

    //     return(
            
    //         <View style={styles.card}>
    //             <View style={styles.cardHeader}>
    //                 <View style={styles.cardButtons}>
    //                     <Image 
    //                         style={{width: 40, height: 40, borderRadius: 20}} 
    //                         source={this.state.profiles[item.user].profilepic}
    //                         //source={require('../../../../testassets/Profile/Profilepics/lena.jpg')}
    //                     />
    //                     <Text style={{...Theme.TextCommon, marginLeft: 5}}>{this.state.profiles[item.user].username}</Text>
    //                 </View>
    //                 <View style={styles.cardButtons}>
    //                     <MaterialIcon name='more-vert' style={Theme.CommonIcon}/>
    //                 </View>
    //             </View>

    //             <ScrollView
    //                 decelerationRate='fast'
    //                 showsHorizontalScrollIndicator={false} 
    //                 horizontal 
    //                 snapToInterval={Dimensions.get('window').width}>
                    
    //                 { item.content.map((content, i) =>
    //                     <Image key ={i} source={{ uri: item.content[i].uri }}
    //                         style={{width: width, height: height, resizeMode:'contain'}}/>
    //                 )}
    //             </ScrollView>

    //             <View style={styles.cardFooter}>
    //                 <View style={styles.cardButtons}>
    //                     <MaterialIcon name='favorite-border' style={{...Theme.CommonIcon, marginHorizontal: 7.5}}/>
    //                     <MaterialIcon name='chat-bubble-outline' style={{...Theme.CommonIcon, marginHorizontal: 7.5}}/>
    //                     <MaterialIcon name='mail-outline' style={{...Theme.CommonIcon, marginHorizontal: 7.5}}/>
    //                 </View>
    //                 <View style={styles.cardButtons}>
    //                     {/*<MaterialIcon name='save' style={styles.cardButton}/>*/}
    //                     <MaterialIcon name='bookmark-border' style={{...Theme.CommonIcon, marginHorizontal: 7.5}}/>
    //                 </View>
    //             </View>
    //             { item.description.length > 0 &&
    //             <View style={styles.cardDescription}>
    //                 <Text style={Theme.TextCommon}><Text style={{...Theme.TextCommon, fontWeight: 'bold'}}>{this.state.profiles[item.user].username}</Text> {item.description}</Text>
    //             </View>}
    //             <View style={styles.cardComments}>
                    
    //             </View>
    //         </View>
            
    //     )
    // }
    

    refresh(){

        this.setState({ start: 0, posts: [] }, () => {
            this.fetchPosts()
            this.setState({ refreshing: false })
            console.log( this.state.start )
        })
    }

    render(){
        return(
            <View style={Theme.MainContainer}>
                <Header LeftButton='Camera' RightButton='Direct' navigation={this.props.navigation} />
                
                { this.state.posts.length > 0 &&
                    <FlatList
                        refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={() => this.refresh()}/>}
                        //ListHeaderComponent={this.renderStories()}
                        //ListFooterComponent={this.endOfPosts()}
                        data={this.state.posts}
                        keyExtractor={(item, i) => i.toString()}
                        //renderItem={({item}) => this.renderCard(item)}
                        renderItem={({item}) => <Post post={item} user={this.sampleProfiles[item.user]} />}
                        showsVerticalScrollIndicator={false}
                        onEndReached={() => this.handleEndReached()}
                        //onEndReachedThreshold={1}
                        //ListFooterComponent={this.state.loading && <ActivityIndicator size={40} />}
                    />
                }

                { this.state.loading && 
                    <ActivityIndicator 
                        style={{
                            flex: this.state.posts.length == 0 ? 1 : undefined, 
                            height: 50, 
                            justifyContent:'center'
                        }} size={40} /> 
                }
                
                { this.state.posts.length == 0 && !this.state.loading &&
                    <TouchableHighlight underlayColor='white' onPress={() => this.refresh()} style={{flex: 1, justifyContent: 'center'}}>
                        <Text style={{textAlign: 'center'}}>{`Nothing to show.\nClick to refresh`}</Text>
                    </TouchableHighlight>
                }
                
                <BottomTabBar navigation={this.props.navigation}/>
            </View>
        )
    }


}

const mapStateToProps = state => ({
	user: state.user,
})

//export default Home
export default connect(mapStateToProps, null)(Home)
