import React, { Component } from 'react'
import { StyleSheet, View, Image, Text, Dimensions, ScrollView } from 'react-native'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import Theme from '../../apptheme'

import { connect } from 'react-redux'

import RNFetchBlob from 'rn-fetch-blob'

class Post extends Component{

    constructor(props){
        super(props)

        this.state = {
            post: props.post,
            content: [],
            user: props.user,
        }
    }

    componentDidMount(){
        this.fetchContent()
    }

    componentWillUnmount(){
        RNFetchBlob.session(`post${this.state.post.ID}`).dispose()
    }

    async fetchContent(){
        for (const content of this.state.post.content) {
            await RNFetchBlob.config({
                session: 'home',
                fileCache: true,
                appendExt : 'jpg',
            })
            .fetch('GET', `http://instagramvt.ddns.net:3000/api/getcontent/${content.source}`,{'Content-Type':'application/json', token: this.props.session.token})
            .then( async (response) =>{
                content.uri = `file://${response.path()}`
                this.setState({ content: [...this.state.content, content] })
                RNFetchBlob.session(`post${this.state.post.ID}`).add(response.path())
            })
            .catch(error => console.log(error))
        }
    }

    render(){
        var width = Dimensions.get('window').width
        var aspectRatio = Math.min(this.state.post.content[0].height / this.state.post.content[0].width, 1)
        var height = width * aspectRatio

        return(
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <View style={styles.cardButtons}>
                        <Image 
                            style={{width: 40, height: 40, borderRadius: 20}} 
                            source={this.state.user.profilepic}
                            //source={require('../../../../testassets/Profile/Profilepics/lena.jpg')}
                        />
                        <Text style={{...Theme.TextCommon, marginLeft: 5}}>{this.state.user.username}</Text>
                    </View>
                    <View style={styles.cardButtons}>
                        <Icon name='dots-vertical' style={Theme.CommonIcon}/>
                    </View>
                </View>

                <ScrollView
                    decelerationRate='fast'
                    showsHorizontalScrollIndicator={false} 
                    horizontal 
                    snapToInterval={Dimensions.get('window').width}
                    contentContainerStyle={{height}}
                >
                    
                    { this.state.content.map((content, i) =>
                        <Image key ={i} source={{ uri: content.uri }}
                            style={{width: width, height: height, resizeMode:'contain'}}/>
                    )}
                </ScrollView>

                <View style={styles.cardFooter}>
                    <View style={styles.cardButtons}>
                        <Icon name='heart-outline' style={{...Theme.CommonIcon, marginHorizontal: 7.5}}/>
                        <Icon name='message-outline' style={{...Theme.CommonIcon, marginHorizontal: 7.5}}/>
                        <Icon name='send-circle-outline' style={{...Theme.CommonIcon, marginHorizontal: 7.5}}/>
                    </View>
                    <View style={styles.cardButtons}>
                        {/*<Icon name='save' style={styles.cardButton}/>*/}
                        <Icon name='bookmark-outline' style={{...Theme.CommonIcon, marginHorizontal: 7.5}}/>
                    </View>
                </View>
                { this.state.post.description.length > 0 &&
                <View style={styles.cardDescription}>
                    <Text style={Theme.TextCommon}><Text style={{...Theme.TextCommon, fontWeight: 'bold'}}>{this.state.user.username}</Text> {this.state.post.description}</Text>
                </View>}
                <View style={styles.cardComments}>
                    
                </View>
            </View>
        )
    }

}

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

const mapStateToProps = state => ({
	session: state.user,
})

//export default Post
export default connect(mapStateToProps, null)(Post)

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
//                     <Icon name='more-vert' style={Theme.CommonIcon}/>
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
//                     <Icon name='favorite-border' style={{...Theme.CommonIcon, marginHorizontal: 7.5}}/>
//                     <Icon name='chat-bubble-outline' style={{...Theme.CommonIcon, marginHorizontal: 7.5}}/>
//                     <Icon name='mail-outline' style={{...Theme.CommonIcon, marginHorizontal: 7.5}}/>
//                 </View>
//                 <View style={styles.cardButtons}>
//                     {/*<Icon name='save' style={styles.cardButton}/>*/}
//                     <Icon name='bookmark-border' style={{...Theme.CommonIcon, marginHorizontal: 7.5}}/>
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