import { StyleSheet, Text, SafeAreaView, Image, TouchableHighlight, Button} from 'react-native';

//Image is placeholder
export default function LoginScreen() {
    return (
      <SafeAreaView style={styles.container}>
      <View style={{flex: 1, justifyContent: "center"}}><Image source={require('../assets/favicon.png')}/></View>
      <View style={{alignContent:"flex-start"}}>
        <Text>Username:</Text>
        <TextInput placeholder="firstname.lastname@domain.com" keyboardType='email-address'/>
      </View>
      <View style={{flex:1}}>
        <Text>Password:</Text>
        <TextInput placeholder="*********" secureTextEntry="true"/>
      </View>
      <TouchableHighlight>
          <Button title="Login" onPress={Login()}/>
      </TouchableHighlight>
    </SafeAreaView>
    );
}

function Login() { //Database Operation to verify login
    return;
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      justifyContent: 'space-evenly',
      alignItems: 'center',
    },
  });
