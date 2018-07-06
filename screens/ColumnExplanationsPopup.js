import React from 'react';
import Expo from 'expo'
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons, } from '@expo/vector-icons'
import Popup from '../screens/Popup'
import { connect } from 'react-redux'
import { RectangleSingleLineIconButton, } from '../components/Button'

const mapStateToProps = (state, ownProps) => {
  return {

  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  }
}

export class ColumnExplanationsPopupPresentation extends React.Component {

  onClose(){
    this.props.onClose()
  }

  render() {
    return (

      <Popup
        visible={this.props.visible}
        onClose={()=>this.onClose()}
        title='Column Explanations'
        backgroundColor='lightyellow'
      >
        <View style={{flex:1,margin:10}}>
          {this.getColumnDescriptions()}
        </View>
      </Popup>

    )
  }

  getColumnDescriptions(){
    if(this.props.screen=='main'){
      return(
        <View style={{flexDirection:'column',flex:1,}}>
          <MaterialCommunityIcons name="checkbox-marked" size={30} color="darkgreen" />
          <MaterialCommunityIcons name="close-box" size={30} color="red" />
          <MaterialCommunityIcons name="checkbox-multiple-marked" size={30} color="navy" />
          <MaterialCommunityIcons name="pound-box" size={30} color="black" />
        </View>
      )
    }else{
      textColumnHeaderStyles={fontSize:25,color:'red',alignSelf:'center',marginTop:20,}
      textDescriptionsStyles={color:'black', fontSize:14,textAlign:'center',}
      exampleDescriptionStyles={...textDescriptionsStyles,marginTop:5}
      return(
        <View style={{flexDirection:'column',flex:1,}}>
          <Text style={{...textColumnHeaderStyles,marginTop:0,}}>±</Text>
          <Text style={textDescriptionsStyles}>
          {"The ONLY issue with the submission is an incorrect sign or signs."}
          </Text>
          <Text style={exampleDescriptionStyles}>
            <Text style={{fontWeight:'bold',}}>{"Example 1"}</Text>{"\nThe student submits\n"}
            {"(x-3)(x+4)\n"}
            {"when the solution is\n"}
            {"(x+3)(x-4)."}
          </Text>
          <Text style={exampleDescriptionStyles}>
            <Text style={{fontWeight:'bold',}}>{"Example 2"}</Text>{"\nThe student submits\n"}
            {"(x+3)(x+4)\n"}
            {"when the solution is\n"}
            {"(x+3)(x-4)."}
          </Text>

          <Text style={textColumnHeaderStyles}>F</Text>
          <Text style={textDescriptionsStyles}>
          {"When FOIL-ing the submission, the F-product is not the correct value."}
          </Text>
          <Text style={exampleDescriptionStyles}>
            <Text style={{fontWeight:'bold',}}>{"Example\n"}</Text>
            {"The student submits\n"}
            {"(kx+j)(rx+s)\n"}
            {"as the factored form of\n"}
            {"ax²+bx+c,\nbut kr≠a."}
          </Text>

          <Text style={textColumnHeaderStyles}>OI</Text>
          <Text style={textDescriptionsStyles}>
          {"When FOIL-ing the submission, the O-product plus the I-product is not the correct value."}
          </Text>
          <Text style={exampleDescriptionStyles}>
            <Text style={{fontWeight:'bold',}}>{"Example\n"}</Text>
            {"The student submits\n"}
            {"(kx+j)(rx+s)\n"}
            {"as the factored form of\n"}
            {"ax²+bx+c,\nbut ks+jr≠b."}
          </Text>

          <Text style={textColumnHeaderStyles}>L</Text>
          <Text style={textDescriptionsStyles}>
          {"When FOIL-ing the submission, the L-product is not the correct value."}
          </Text>
          <Text style={exampleDescriptionStyles}>
            <Text style={{fontWeight:'bold',}}>{"Example\n"}</Text>
            {"The student submits\n"}
            {"(kx+j)(rx+s)\n"}
            {"as the factored form of\n"}
            {"ax²+bx+c,\nbut js≠c."}
          </Text>

          <Text style={textColumnHeaderStyles}>∅</Text>
          <Text style={textDescriptionsStyles}>
          {"The student claims there is NO SOLUTION, but there is a solution."}
          </Text>
          <Text style={exampleDescriptionStyles}>
            <Text style={{fontWeight:'bold',}}>{"Example\n"}</Text>
            {"The student submits\n"}
            {"NO SOLUTION\n"}
            {"when asked to factor\n"}
            {"x²-9."}
          </Text>

          <MaterialCommunityIcons name="checkbox-marked" style={{alignSelf:'center',marginTop:25}} size={30} color="red" />
          <Text style={textDescriptionsStyles}>
          {"The student submits a solution, but there is no solution."}
          </Text>
          <Text style={exampleDescriptionStyles}>
            <Text style={{fontWeight:'bold',}}>{"Example\n"}</Text>
            {"The student submits\n"}
            {"(x+9)(x-7)\n"}
            {"when there is NO SOLUTION."}
          </Text>

        </View>
      )
    }
  }

}

const styles = StyleSheet.create({

})

export const ColumnExplanationsPopup = connect(
  mapStateToProps,
  mapDispatchToProps
)(ColumnExplanationsPopupPresentation)
