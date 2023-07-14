import React, { useState, useCallback, useEffect } from 'react';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { View, Text,StyleSheet,TouchableOpacity,TextInput,Modal,Button } from 'react-native';
import axios from 'axios'
import { Avatar, Image } from 'react-native-elements';
import Voice from '@react-native-voice/voice';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { color } from 'react-native-elements/dist/helpers';



export default function ChatScreen () {
  const [messages, setMessages] = useState([])
  const [isTyping, setIsTyping] = useState(false);
  const [recordingMessage, setRecordingMessage] = useState('');
  const [feedback, setFeedback] = useState('');
  const [result, setResult] = React.useState('');
  const [error, setError] = React.useState('');
  const [isRecording, setIsRecording] = React.useState(false);
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);
  const [userFeedback, setUserFeedback] = useState('');


  useEffect(() => {
    Voice.onSpeechStart = () => setIsRecording(true);
    Voice.onSpeechEnd = () => setIsRecording(false);
    Voice.onSpeechError = (err) => setError(err.error);
    Voice.onSpeechResults = (res) => setResult(res.value[0]);
  }, []);

  const startRecording = async () => {
    try {
      await Voice.start('sw-TZ'); // Set language to Swahili
      setIsRecording(true);
      setTimeout(stopRecording, 5000);
    } catch (err) {
      setError(err);
    }
  };

    // Transcribe user's voice input using Hugging Face API
    const transcribe = async () => {
    try{
    await axios.post(
      'https://api-inference.huggingface.co/models/mbazaNLP/stt_rw_sw_lg_conformer_ctc_large',
      {
        audio: {
          content: recordingMessage.split("base64,")[1],
        },
        config: {
          language_code: "sw-TZ", // Set language to Swahili
        },
      },
      {
        headers: {
          'Authorization': 'Bearer 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', // API key
          'Content-Type': 'application/json',
        },
      }
    )}catch (err) {
      setError(err);
    }
  };

  

  const stopRecording = async () => {
    try {
      await Voice.stop();
      setIsRecording(false);
      
      console.log('transcribing')
      await transcribe();
      setRecordingMessage(result);
      console.log('done transcribing')
      //console.log('Recording Message:', result);
    } catch (err) {
      setError(err);
      console.log(err)
    }
  };

   // Translate the transcribed text from Swahili to English
   const translateSwahiliToEnglish = async (text) => {
    const options = {
      method: 'GET',
      url: 'https://nlp-translation.p.rapidapi.com/v1/translate',
      params: {
        text: result,
        to: 'en',
        from: 'sw',
      },
      headers: {
        'X-RapidAPI-Key': '5f3f3652f3msh9fa0f56780b1f8bp155420jsn7ca5c2e91416',
        'X-RapidAPI-Host': 'nlp-translation.p.rapidapi.com',
      },
    };

    try {
      const response = await axios.request(options);
      console.log(response.data);
      //console.log(response.data.translated_text.en);
      //return response.data.data.translation;
      let translatedMessage = response.data.translated_text.en;
      return translatedMessage;
    } catch (error) {
      console.error(error);
      
    }
  };

     // Translate the transcribed text from Swahili to English
     const translateEnglishTokiswahili = async (ans) => {
      const options = {
        method: 'GET',
        url: 'https://nlp-translation.p.rapidapi.com/v1/translate',
        params: {
          text: ans,
          to: 'sw',
          from: 'en',
        },
        headers: {
          'X-RapidAPI-Key': '5f3f3652f3msh9fa0f56780b1f8bp155420jsn7ca5c2e91416',
          'X-RapidAPI-Host': 'nlp-translation.p.rapidapi.com',
        },
      };
  
      try {
        const response = await axios.request(options);
        console.log(response.data);
        //console.log(response.data.translated_text.en);
        //return response.data.data.translation;
        let translatedMessage = response.data.translated_text.sw;
        return translatedMessage;
      } catch (error) {
        console.error(error);
        
      }
    };

 
  const handleSend = useCallback(async () => {
    try {
      // Translate user message from Swahili to English
    let translatedMessage = await translateSwahiliToEnglish(result.trim());
    console.log(translatedMessage);

    // Get user message
    let userMessage = {
      _id: new Date().getTime(),
      text: result, // Use the translated message
      createdAt: new Date(),
      user: {
        _id: 1,
        name: 'User',
      },
    };
      // Add user message to the messages state
      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, userMessage)
      );
  
       // Clear the text input value
       setResult('');
  
      // Set typing status to true
      setIsTyping(true);
  

      // Ask OpenAI for an answer
      
        const botResponse = await axios.post(
          'http://16.16.100.131:5005/webhooks/rest/webhook',
          {
            sender: 'user',
            message: translatedMessage,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        console.log(botResponse);

        const ans = botResponse.data[0]?.text;
        const answer = await translateEnglishTokiswahili(ans);  
           
        const botMessage = {
          _id: new Date().getTime() + 1,
          text: answer || "Samahani, sikuelewa hilo. Je, unaweza kutamka upya?",
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'Imarika',
            avatar: require('../assets/icons8-farmer-100.png'),
          },
        };
      
        // Add bot message to the messages state
        setMessages(previousMessages =>
          GiftedChat.append(previousMessages, botMessage)
        );
      
        // Reset the recording message
        setRecordingMessage('');
      
        // Set typing status to false
        setIsTyping(false);

        setFeedback('How would you rate the response?');
      } catch (error) {
        console.log(error);
        // Set typing status to false
        setIsTyping(false);
      }
   
  }, [result]);
  
  
  

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Karibu Imarika. Which crop would you like to know about?', 
       
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Imarika',
         avatar: require('../assets/icons8-farmer-100.png'),
        }
      }
    ])
  }, [])


  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#008462',
          },
          left: {
            backgroundColor: '#008462',
          },
        }}
        textStyle={{
          right: {
            color: 'white',
          },
          left: {
            color: 'white',
          },
        }}
      />
    );
  };
  const handleFeedback = (value) => {
    // Process the user's feedback (e.g., send it to a server, log it, etc.)
    console.log('User feedback:', value);
  
    // Store the feedback value in state
    setUserFeedback(value);

    // Show the feedback pop-up
    setShowFeedbackPopup(true);
  };

  const sendFeedback = () => {
    //database logic
    setShowFeedbackPopup(false)

  };
 
  
  const renderFooter = (props) => {
  if (props.typingText) {
    return (
      <View style={styles.footerContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          
          <Avatar
            size="small"
            rounded
            source={require('../assets/icons8-farmer-100.png')}
           // containerStyle={{ marginLeft: 10 }}
          />
          <Text style={styles.footerText}>{props.typingText}</Text>
        </View>
      </View>
    );
  }else if (feedback) {
    return (
      <View style={styles.footerFeedback}>
        <TouchableOpacity onPress={() => handleFeedback('good')} style={styles.feedbackButton}>
          <Icon name="thumb-up-alt" size={30} color="#008462" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleFeedback('poor')} style={styles.feedbackButton2}>
          <Icon name="thumb-down-alt" size={30} color="#008462" />
        </TouchableOpacity>

        {/* Feedback Pop-up */}
        <Modal
          visible={showFeedbackPopup}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowFeedbackPopup(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={{color:'black'}}>Please provide additional feedback:</Text>
              <TextInput
                style={styles.input}
                multiline={true}
               // value={userFeedback}
                onChangeText={(text) => setUserFeedback(text)}
              />
              <TouchableOpacity
            style={styles.submitButton}
            onPress={sendFeedback}
          >
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
  return null;
};


const renderInputToolbar = (props) => {
  return (
    <View style={styles.inputContainer}>
      <TouchableOpacity
        style={{marginBottom:10}}
        onPress={isRecording ? stopRecording : startRecording}
      >
        <Text >
          {isRecording ? (
          <Icon name="mic-off" size={35} color="#008462"/>
          
          ) : 
          (
            
            <Icon name="mic" size={35} color="#008462"/>
          
          ) }
        </Text>
      </TouchableOpacity>


      <TextInput
        style={styles.textInput}
        placeholder="Record a message .. "
        onChangeText={(text) => setRecordingMessage(text)}
        value={result}
        
      />
      {result.trim() !== '' && (
      <TouchableOpacity onPress={handleSend} style={{marginBottom:10}}>
      {/* <Text style={{fontWeight:'bold', color:'blue',fontSize:16,marginBottom:5}}>Send</Text> */}
      <Icon name="send" size={35} color="#008462"/>
          
      </TouchableOpacity>
)}
    </View>
  );
};


  return (
    <GiftedChat
      messages={messages}
     // onSend={newMessages => handleSend(newMessages)}
     onChangeText={setResult}
      user={{ _id: 1 }}
      renderBubble={renderBubble}
      alignTop={true}
      typingText={isTyping ? ' Typing...' : null} // Set typingText prop
      renderFooter={renderFooter}
      //renderInputToolbar={() => null}
      renderInputToolbar={renderInputToolbar}
    />
  );
  
}
const styles = StyleSheet.create({
  footerContainer: {
    paddingVertical: 5,
    paddingHorizontal: 10,
 
  },
  footerFeedback: {
    paddingVertical: 5,
    // paddingHorizontal: 10,
    marginLeft: 30,
    flex:1,
    flexDirection:'row'
  },
  footerText: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#666',
  },
  inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      //padding: 10,
     // backgroundColor: "#fff",
   //  borderTopWidth: 1,
      borderTopColor: "#e0e0e0",
      
    },
    textInput: {
      flex: 1,
      height: 40,
      paddingHorizontal: 10,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: "#e0e0e0",
      marginRight: 5,
      marginBottom:10
    },
    recordingButton: {
      padding: 5,
   
      borderRadius: 20,
      backgroundColor: "#008462",
    },
    recordingButtonText: {
      color: "#fff",
      fontWeight: "bold",
    },
    feedbackButton: {
      // paddingHorizontal: 10,
      // paddingVertical: 5,
      //borderRadius: 20,
      //backgroundColor: '#008462',
      marginLeft: 30,
    },
    feedbackButton2: {
      // paddingHorizontal: 10,
      // paddingVertical: 5,
      //borderRadius: 20,
      //backgroundColor: '#008462',
      marginLeft: 10,
    },
    
    feedbackButtonText: {
      color: '#fff',
      fontWeight: 'bold',
    },

    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
      width:350
    },
    input: {
      height: 100,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 10,
      marginTop:10
    },
    submitButton: {
      backgroundColor: '#008462',
      padding: 10,
      borderRadius: 5,
      marginTop: 10,
    },
    submitButtonText: {
      color: 'white',
      textAlign: 'center',
      fontSize: 16,
      fontWeight: 'bold',
    },
  
});