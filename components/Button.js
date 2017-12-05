import React from 'react';
import {
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
  BackHandler,
  Webview,
  TextInput,
  Animated,
  Easing,
} from 'react-native';

export class BigButton extends React.Component {
  render(){
    return (
      <Button
        backgroundColor={this.props.backgroundColor}
        text={this.props.text}
        width={200}
        flexShrink={1}
        onPress={this.props.onPress}
        style={{margin:5,}}
      />
    )
  }
}

export class SquareButton extends React.Component {
  render () {
    return (
      <Button
        backgroundColor={this.props.backgroundColor}
        text={this.props.text}
        width={60}
        flexShrink={0}
        style={this.props.style}
        onPress={this.props.onPress}
        italic={this.props.italic}
      />
    )
  }
}

export class MathButton extends React.Component {
  render () {
    return (
      <View style={{...this.props.style, backgroundColor:'black',}}>
        <TouchableOpacity ref='child'
          activeOpacity={0.70}
          onPress={this.props.onPress}>
          <View style={[styles.bigButton,
                        { backgroundColor:this.props.backgroundColor,
                          width:this.props.width,
                          flexShrink:this.props.flexShrink,
                          padding:10,
                        },
                      ]} >
            <Text style={{textAlign:'center'}}>
              <Text style={[styles.bigButtonText, {fontFamily:'math-font', fontSize:22}]}>
                {this.props.textTop}{"\n"}
              </Text>
              <Text style={[styles.bigButtonText, {fontFamily:'math-font',fontSize:17}]}>
                {this.props.textBottom}
              </Text>
            </Text>

          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

class Button extends React.Component {
//this.props.navigation.navigate('Easy')
  render () {
    return (
      <View style={{...this.props.style, width:this.props.width, backgroundColor:'black'}}>
        <TouchableOpacity ref='child'
          activeOpacity={0.70}
          onPress={this.props.onPress}>
          <View style={[styles.bigButton,
                        { backgroundColor:this.props.backgroundColor,
                          width:this.props.width,
                          flexShrink:this.props.flexShrink,
                        },
                      ]} >
            <Text style={[styles.bigButtonText, {fontStyle: this.props.italic ? 'italic' : 'normal', fontFamily:'math-font'}]}>
              {this.props.text}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

export class FlexKey extends React.Component {
  render () {
    return (
      <FlexButton
        text={this.props.text}
        backgroundColor={this.props.backgroundColor}
        underlayColor='black'
        activeOpacity={.70}
        minHeight={20}
        onPress={this.props.onPress}
        textStyle={styles.flexKeyText}
        margin={0.5} />

    )
  }
}

class FlexButton extends React.Component {
  render () {
    return (
      <View style={{backgroundColor:this.props.underlayColor, margin:this.props.margin, flexDirection:'row', flex:1, minHeight:this.props.minHeight, alignItems:'stretch'}}>
        <TouchableOpacity
          activeOpacity={this.props.activeOpacity}
          onPress={this.props.onPress}
          style={{backgroundColor:this.props.backgroundColor, flexDirection:'row', flex:1, alignItems:'center', justifyContent:'center',}}>
          <Text style={this.props.textStyle}>
            {this.props.text}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
}

export class CircularGlowingBorderButton extends React.Component {

  render () {
    return (
      <GlowingBorderButtonActiveDetection
        name = {this.props.name}
        nameOfActiveButton = {this.props.nameOfActiveButton}
        text = {this.props.text}
        onPress = {this.props.onPress}
        rgbaFadeColor = {this.props.rgbaFadeColor}
        rgbaGlowColor = {this.props.rgbaGlowColor}
        unfocusedGlowingBorderColor = 'transparent'
        innerBorderColor = 'black'
        glowingBorderWidth = {4}
        innerBorderWidth = {0}
        glowingBorderRadius = {25}
        innerBorderRadius = {10}
        activeOpacity = {0.3}
        minWidth = {20}
        minHeight = {30}
        lineHeight = {null}
        fontSize = {23}
        fontColor = 'black'
        textPadding = {0}
        textBackgroundColor = 'rgba(255,255,255,0.8)'
        fontFamily = 'math-font'
      />

    )
  }
}

export class RectangularGlowingBorderButton extends React.Component {

  render () {
    return (
      <GlowingBorderButtonActiveDetection
        name = {this.props.name}
        nameOfActiveButton = {this.props.nameOfActiveButton}
        text = {this.props.text}
        onPress = {this.props.onPress}
        rgbaFadeColor = {this.props.rgbaFadeColor}
        rgbaGlowColor = {this.props.rgbaGlowColor}
        unfocusedGlowingBorderColor = 'transparent'
        innerBorderColor = 'black'
        glowingBorderWidth = {3}
        innerBorderWidth = {0}
        glowingBorderRadius = {25}
        innerBorderRadius = {20}
        activeOpacity = {0.3}
        minWidth = {40}
        minHeight = {50}
        lineHeight = {null}
        fontSize = {40}
        fontColor = 'black'
        textPadding = {2}
        textBackgroundColor = 'rgba(255,255,255,0.8)'
        fontFamily = 'math-font-narrow'
      />

    )
  }
}

class GlowingBorderButtonActiveDetection extends React.Component {
  render(){
    return (
      <GlowingBorderButton
        name = {this.props.name}
        active = {this.props.nameOfActiveButton===this.props.name ? true : false}
        text = {this.props.text}
        onPress = {this.props.onPress.bind(this, this.props.name)}
        rgbaFadeColor = {this.props.rgbaFadeColor}
        rgbaGlowColor = {this.props.rgbaGlowColor}
        unfocusedGlowingBorderColor = {this.props.unfocusedGlowingBorderColor}
        innerBorderColor = {this.props.innerBorderColor}
        glowingBorderWidth = {this.props.glowingBorderWidth}
        innerBorderWidth = {this.props.innerBorderWidth}
        glowingBorderRadius = {this.props.glowingBorderRadius}
        innerBorderRadius = {this.props.innerBorderRadius}
        activeOpacity = {this.props.activeOpacity}
        minWidth = {this.props.minWidth}
        minHeight = {this.props.minHeight}
        lineHeight = {this.props.lineHeight}
        fontSize = {this.props.fontSize}
        fontColor = {this.props.fontColor}
        textPadding = {this.props.textPadding}
        textBackgroundColor = {this.props.textBackgroundColor}
        fontFamily = {this.props.fontFamily}
      />
    )
  }
}

class GlowingBorderButton extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      borderOpacityAnim: new Animated.Value(1),
    }
  }

  startGlowAnimation(){

    Animated.loop(
      Animated.sequence([
        Animated.timing(
          this.state.borderOpacityAnim, {
            toValue : 0,
            easing : Easing.ease,
            duration : 1000,
          }
        ),
        Animated.timing(
          this.state.borderOpacityAnim, {
            toValue : 1,
            easing : Easing.exp,
            duration :700,
          }
        ),

      ])
    ).start()
  }

  stopGlowAnimation(){
    this.state.borderOpacityAnim.setValue(0)
  }

  componentDidMount(){
    if(this.props.active) this.startGlowAnimation()
  }

  componentWillReceiveProps(nextProps){
    if(!this.props.active &&  nextProps.active ) this.startGlowAnimation()
    if( this.props.active && !nextProps.active ) this.stopGlowAnimation()
  }


  render () {

    var color = this.state.borderOpacityAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [this.props.rgbaFadeColor, this.props.rgbaGlowColor]//outputRange: ['rgba(15, 255, 247, 0)', 'rgba(15, 255, 247, 0.8)']
    })

    return (
      <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center',}}>
        <Animated.View
          style={{
            borderWidth:this.props.glowingBorderWidth,
            borderRadius:this.props.glowingBorderRadius,
            borderColor: this.props.active ? color : this.props.unfocusedGlowingBorderColor,
            flex:0,
            flexDirection:'row',
            alignItems:'center',
            justifyContent:'center',
            overflow: 'hidden',
          }}
        >
          <TouchableOpacity
            activeOpacity={ this.props.activeOpacity }
            onPress={this.props.onPress}
            style={{margin:0, flex:0, flexDirection:'row', alignItems:'center', justifyContent:'center', overflow: 'hidden',}}>
            <Text style={{
              borderRadius: this.props.innerBorderRadius,
              minWidth: this.props.minWidth,
              minHeight : this.props.minHeight, lineHeight : this.props.lineHeight,
              fontSize : this.props.fontSize,
              fontFamily : this.props.fontFamily,
              color : this.props.fontColor,
              textAlign : 'center',
              padding : this.props.textPadding,
              borderColor : this.props.innerBorderColor,
              borderWidth : this.props.innerBorderWidth,
              backgroundColor : this.props.textBackgroundColor,
              overflow: 'hidden',
            }}>
              {this.props.text}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    flexDirection : 'column',
    alignItems : 'center',
    justifyContent : 'center',
  },
  bigButton : {
    flexDirection : 'row',
    padding : 0,
    flexBasis : 'auto',
    width : 200, //default
    minHeight : 60,
    flexShrink : 1,
    backgroundColor : 'white', //default
    justifyContent : 'center',
    alignItems : 'center',
    borderWidth : 2,
    borderColor : 'black',
  },
  bigButtonText : {
    fontSize : 20,
    color : 'black',
    textAlign : 'center',
  },
  factorItText : {
    fontSize : 90,
    color : 'black',
    textAlign : 'center',
  },
  flexKeyText : {
    fontFamily:'math-font',
    fontSize : 20,
    textAlign : 'center',
  }
})
