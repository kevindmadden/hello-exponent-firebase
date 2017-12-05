import React from 'react';
import { Platform, StatusBar, StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { BigButton } from './components/Button'
import { AppLoading } from 'expo';
import { FontAwesome } from '@expo/vector-icons';
import RootNavigation from './navigation/RootNavigation';
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { mainReducer } from './reducers/mainReducer'

import cacheAssetsAsync from './utilities/cacheAssetsAsync';

//GOAL: Write main outer component that will...
//  cache needed images/fonts
//  display loading screen until everything is cached
//  display the outermost container of the app (e.g. the status bar) with the main rootnavigation class inside
//320x(426-470/480-568) dp -- design ui for this

import * as firebase from 'firebase'

//Create redux store
const loggerMiddleware = createLogger()
let store = createStore(
  mainReducer,
  applyMiddleware(
    thunkMiddleware, // lets us dispatch() functions
    loggerMiddleware // neat middleware that logs actions
  )
)

//These are the default values that a new user would start with.
//add any new user data (e.g. email) within method addDefaultNewUserData()
const defaultNewUserData = {
  currentStreak : 0,
  maxStreak : 0,
  coolFactor: 1000,
  newFactor:10,
}
//Increase version number if you want to add a new key to ensure that new keys are added to existing users
const newestVersion = 1.03


// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDjxdgMfXbGvTV2j5jEIYKP-g0FRDZBz6E",
  authDomain: "helloworld-c5661.firebaseapp.com",
  databaseURL: "https://helloworld-c5661.firebaseio.com",
  projectId: "helloworld-c5661",
  storageBucket: "helloworld-c5661.appspot.com",
  messagingSenderId: "440828541399",
}


export default class AppContainer extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      showLogin : false,
      firebaseReady : false,
      assetsLoaded : false,
    }
  }

  componentWillMount() {
    this._loadAssetsAsync();
  }

  async _loadAssetsAsync() {
    try {
      await cacheAssetsAsync({
        images: [require('./assets/images/expo-wordmark.png')],
        fonts: [
          FontAwesome.font,
          { 'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf') },
          { 'math-font' : require('./assets/fonts/RobotoSlab-Regular.ttf')},
          { 'math-font-narrow' : require('./assets/fonts/StintUltraCondensed-Regular.ttf')},
        ],
      });
    } catch (e) {
      console.warn(
        'There was an error caching assets (see: main.js), perhaps due to a ' +
          'network timeout, so we skipped caching. Reload the app to try again.'
      );
      console.log(e.message);
    } finally {
      this.setState({ assetsLoaded: true });
    }
  }

  //if version number matches, then there is no need to check to see what variables need to be added
  addDefaultNewUserData(newestVersion, user){
    let userDataRef = firebase.database().ref('users/'+user.uid)
    userDataRef.once('value')
    .then((snapshot) => {
      let userData = snapshot.val()
      let newUserData = Object.assign(defaultNewUserData, userData, {version:newestVersion, name:user.displayName,} ) //newestVersion needs to write back over existing version, always update person's name as well
      firebase.database().ref('users/'+user.uid).set(newUserData).then(this.showMainScreen())
    })
  }

  //this sets up the initial keys values for the user so that they exist when they are eventually updated
  setupUserInDatabase(){
    let user = firebase.auth().currentUser
    let databseVersionRef = firebase.database().ref('users/'+user.uid+'/version')
    databseVersionRef.once('value')
    .then((databseVersion)=>{
        if(!databseVersion.val() || databseVersion.val() < newestVersion){
          this.addDefaultNewUserData(newestVersion, user)
        }else{
          this.showMainScreen()
        }
    })

    //user.displayName this stores the users name
    /*firebase.database().ref('users/'+this.user.uid+'/testInsert')
    .set('test')
    .then(
      this.showMainScreen()
    )*/
  }



  showMainScreen(){
    this.setState({firebaseReady : true, showLogin : false})
  }

  componentDidMount(){ //need to unsubscribe still on component removed
    this.setState({showLogin : false})
    firebase.initializeApp(firebaseConfig);
    // Listen for authentication state to change.
    this.unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (user != null) {
        console.log("We are authenticated now!");
        this.setupUserInDatabase()
      }else{
        //prompt user for login
        //const result = await signInWithGoogleAsync()
        this.setState({firebaseReady : false, showLogin : true})
        console.log('Login prompt')
      }

      // Do other things
    });
  }

  componentWillUnmount(){
    this.unsubscribe()
  }

  render() {
    return(
      <Provider store={store}>
        {this.getApp()}
      </Provider>
    )
  }

  getApp(){
    if(!this.state.assetsLoaded){
      return <AppLoading />
    }else if(!this.state.showLogin && !this.state.firebaseReady ){
      return <View style={{flex:1, justifyContent:'center', alignItems:'center',}}><ActivityIndicator size='large' /></View>
    }else if(!this.state.showLogin && this.state.firebaseReady){
      return (
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          {Platform.OS === 'android' && <StatusBar backgroundColor="blue" />}
          <RootNavigation />
        </View>
      );
    }else{ //if(this.state.showLogin){
      return <View style={{flex:1, justifyContent:'center', alignItems:'center',}}><BigButton backgroundColor='lightblue' text='Login with Google' onPress={()=>this.signInWithGoogleAsync()}  /></View>
    }
  }

  signInWithGoogleAsync = async () => {
    this.setState({showLogin : false})
    try {
      const result = await Expo.Google.logInAsync({
        androidClientId: '515687250768-s79vqmaqgd9hkivgc24mn0fkkb39sv51.apps.googleusercontent.com',
        iosClientId: '515687250768-th67j8c7srpupbu07aq0qlcqhbpccalh.apps.googleusercontent.com',
        webClientId: '440828541399-gmac8vdtujfh7ghftbdum4ku8rpte2oo.apps.googleusercontent.com',
        scopes: ['profile', 'email', 'openid'],
      });

      if (result.type === 'success') {
        ////return result.accessToken;
        // Build Firebase credential with the Facebook access token.
        const credential = firebase.auth.GoogleAuthProvider.credential(result.idToken);

        // Sign in with credential from the Facebook user.
        firebase.auth().signInWithCredential(credential).catch((error) => {
          // Handle Errors here.
          this.setState({showLogin : true})
          console.log(error)
        });
      } else {
        this.setState({showLogin : true})
        return {cancelled: true};
      }
    } catch(e) {
      this.setState({showLogin : true})
      return {error: true};
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});


/* //Working Transaction Example
  this.currentStreakRef.transaction(function(currentStreak){
  console.log('currentStreak correct:')
  console.log(currentStreak)
  return (currentStreak || 0) +1
})*/
