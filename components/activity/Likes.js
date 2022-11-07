import React from 'react'
import { StyleSheet, View, Modal, Pressable, Text, TextInput, ScrollView, SafeAreaView, Dimensions } from 'react-native'
import { useEffect, useReducer, useState } from 'react';



const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function Likes(props) {
    const [modalVisible, setModalVisible] = useState(false);

    return (

        <View style={{
            backgroundColor: '#D9D9D9', borderWidth: 10, borderColor: '#010101', borderRadius: 20,
            width: 150,
            height: "100%",
            marginTop: 15,
            marginLeft: 15,
            marginBottom: 15,
            marginRight: 0,
            padding: 5,
            flex: 1
        }}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
          <View style={styles.modalView}>
                    
                    {/* <Text style={{ fontSize: 10, textAlign: 'center', bottom: 0 }}>{props.answerNum} answers</Text> */}
                    <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => setModalVisible(!modalVisible)}
                    >
                        <Text style={{ fontSize: 10 }}>xxxxxxxxxxxx</Text>
                    </Pressable>
                
                </View></View>
            </Modal>
            <Pressable
                onPress={() => setModalVisible(true)}
            >
                <Text style={{ fontSize: 10 }}>{props.time}</Text>
                <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', flex: 1 }}>{props.title}</Text>
            </Pressable>
        </View>
    )
}
const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22
    },
    modalView: {
      margin: 20,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5
    },
    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2
    },
    buttonOpen: {
      backgroundColor: "#F194FF",
    },
    buttonClose: {
      backgroundColor: "#2196F3",
    },
    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center"
    },
    modalText: {
      marginBottom: 15,
      textAlign: "center"
    }
  });