import * as React from "react";
import { ScrollView, SafeAreaView, View, StyleSheet, Text, Image, Dimensions} from "react-native";
import { AirbnbRating } from "react-native-ratings";
import { Button, Icon } from "@rneui/themed";
import { TextInput } from "react-native-paper";
import { Modal, Portal, Provider } from 'react-native-paper';
import db from '../db/firestore';
import { SafeAreaProvider } from 'react-native-safe-area-context';


export default function RatingScreen({ navigation }) {


  const [text, setText] = React.useState("");
  let r;


  const [visible, setVisible] = React.useState(false);

  const ratingCompleted =(rating)=>{
    r=rating
    console.log("Rating is: " + r)
  };


  const showModal = () => {
    if (r !== undefined) {
      db.collection('Feedback').add({Rating: r, Feedback: text})
      setVisible(true)
      console.log("sent")
    } else {
      console.log("Please select a rating")
    }
  };
  


  const hideModal = () => setVisible(false);
  const containerStyle = {
    backgroundColor: '#008462',
    padding: 70,
    alignItems: 'center',
    justifyContent: 'center'
  };


  return (
    
    <SafeAreaProvider>
      <Provider>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.cardContainer3}>
          <Text style={styles.textSubtitles}>
           Select a rating : 
          </Text>
          <AirbnbRating
            count={5}
            defaultRating={3}
            selectedColor="yellow"
            unSelectedColor="lightgrey"
            reviewColor="white"
            size={30}
            onFinishRating={ratingCompleted}
            reviewSize={25}
            showRating={false}
            ratingContainerStyle={{ marginVertical: 20 }}
          />
          <Text style={styles.textSubtitles}>
            Write your own review below:
          </Text>
          <TextInput
            label="Feedback"
            value={text}
            mode="outlined"
            outlineColor="black"
            activeOutlineColor="black"
            style={{
              height: 150,
              width: 250,
              marginBottom: 10
            }}
            placeholder="Type something"
            onChangeText={(text) => setText(text)}
          />

          <Portal>
            <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
              <Image
                style={styles.stretch}
                source={require("../assets/feedback.png")}
              />
              <Text style={{ fontSize: 20, marginTop: 20, color: 'white' }}>Thank you for your feedback</Text>
            </Modal>
          </Portal>

          <Button
            radius={"md"}
            type="solid"
            color={"#008462"}
            buttonStyle={{
              borderRadius: 5,
              marginTop: 5,
            }}
            onPress={showModal}
          >
            Submit
          </Button>

        </View>
      </ScrollView>
      </Provider>
      </SafeAreaProvider>
  );
}

const deviceWidth = Math.round(Dimensions.get("window").width);
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    backgroundColor: "#008462",
    paddingTop: 50,
  },
  cardContainer3: {
    width: deviceWidth - 20,
    backgroundColor: "white",
    flex: 1,
    marginVertical: 70,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    marginLeft: 12,
    marginRight: 10,
  },
  textSubtitles: {
    color: "black",
    marginBottom: 5,
    fontSize: 17,
    margin: 4,
    //marginTop: 10,
    fontWeight: "bold",
  },
  stretch: {
    width: 200,
    height: 200,
    alignItems: "center",
    justifyContent: "center",
  },
});