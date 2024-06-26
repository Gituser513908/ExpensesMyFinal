/**
 * Final Project - Expense Tracker
 * 
 * Author: Rajan Chaudhari
 * 
 * Date - 2024-03-30
 * 
 * Description - Keep track of your expenses, add them, edit them and delete them easy.
 * shows total amount of expenses  to scare you or not. Plays sound when app is loaded and when dlete it vibrates too yey
 * 
 * Inspirations
 * 
 * Stephen Graham's in class examples - Thanks Stephen
 * 
 * Design idea from
 * 
 * Expense Tracker:  https://github.com/N1k0l1n/Expense-Tracker-React-Native-App.git
 * 
 * Date picker idea from : 
 * 
 * Using Date Picker with TextInput (Expo | React Native App) - ToThePointCode youtube channale https://www.youtube.com/watch?v=UEfFjfW7Zes
 * 
 * React native Paper - https://callstack.github.io/react-native-paper/docs/components/ActivityIndicator
 * 
 * sound from -Sound Effect by TheoJT from Pixabay https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=131354
 * 
 * Splash from - https://www.vecteezy.com/vector-art/11648904-rc-monogram-initial-logo-with-shield-and-crown-style
 * 
 * Dollor Icon from - "https://www.flaticon.com/free-icons/dollars" Dollars icons created by fancykeith 
 * 
 */


import { useState, useEffect } from 'react';
import { Alert,Text, TextInput, View, Modal, Vibration, Pressable, FlatList } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Audio } from 'expo-av';
import {
    Button, Divider, PaperProvider,
    IconButton, Card,
} from 'react-native-paper';
import * as FileSystem from 'expo-file-system';
import Styles from './styles/page-styles';
import DateTimePicker from '@react-native-community/datetimepicker'; // date picker from expo
import { WebView } from 'react-native-webview'; 

export default function App() {


    const [myPBO, setMyPBO] = useState(null);//hold my playnack object

    const [expenseAmount, setExpenseAmount] = useState('');// to hold expense amount spend 
    const [dateExpense, setDateExpense] = useState('');// store date the expense happened
    const [date, setDate] = useState(new Date());// set date from date picker
    const [showDatePicker, setShowDatePicker] = useState(false);// state of date picker
    const [descriptionOfExpense, setDescriptionOfExpense] = useState('');// store the note of what was the expense
    const [expensesList, setExpensesList] = useState([]);// array to have all expenses
    const [modalShow, setModalShow] = useState(false); // to show add expese page on top of current page
    const [webModalShow, SetWebModalShow] = useState(false);// to show weather modal
    const [isUpdatingExpense, setIsUpdatingExpense] = useState(false);// to keep track if updating the exisitng expense
    const [updatingExpenseItem, setUpdatingExpenseItem] = useState(null);// keep track of the updating ecpense item

    const webUrl = 'https:\\google.ca';// store url to be used in web view modal
    const sound = require('./assets/beat.mp3');// sound to play when app loads

    const fileName = 'expensesfile.json'; // file name to store state



    
     
    //load a sound into the PBO 
    const loadplaySound = async () => {

        try {


            const soundObj = new Audio.Sound();

            await soundObj.loadAsync(sound);

            
            setMyPBO(soundObj);
            

                 await soundObj.playAsync();
            
            

        } catch (error) {
            console.log(error);
        }
    }

   

    //unload a pbo
    const unloadPBO = async () => {

        if (myPBO) {

            await myPBO.unloadAsync();
        }



    }
    


    //save to file inspired from Stephen's expo example

    /**
    * This function will load a json string of all the saved data 
    * We assume that the file is good
    * We assume that all the required object parts are present
    */
    const loadExpenses = async () => {
        try {
            // get the string
            const storedExpensesListString = await FileSystem.readAsStringAsync(
                FileSystem.documentDirectory + fileName
            );
            // convert it to an object
            const storedExpensesList = JSON.parse(storedExpensesListString);

            // set expenses list with stored array
            setExpensesList(storedExpensesList);

        } catch (e) {
            console.log(FileSystem.documentDirectory + fileName + e);
            // probably there wasn't a saved state, so make one for next time?
            saveExpenses();
        }
    }

    /**
     * This function will save the data as a json string 
     */
    const saveExpenses = async () => {


        //if upating item is not null
        if (updatingExpenseItem !== null) {


            // if any fileds empty dont save

            if (!expenseAmount || !dateExpense || !descriptionOfExpense) {


                return;
            }

            //create new array from exisitng expenses list
            const updatedExpensesList = [...expensesList];

            //update new array at index of item which was updated
            updatedExpensesList[updatingExpenseItem] = {
                amount: expenseAmount,
                date: dateExpense,
                description: descriptionOfExpense
            };

            //set the expenses list to new array
            setExpensesList(updatedExpensesList);

           

            //save the new array to file

            try {
                await FileSystem.writeAsStringAsync(
                    FileSystem.documentDirectory + fileName,
                    JSON.stringify(updatedExpensesList)
                );
            } catch (e) {
                console.log(FileSystem.documentDirectory + fileName + e);
            }

            //clear updating item
            setUpdatingExpenseItem(null);

            //set is updating to false
            setIsUpdatingExpense(false);

            setExpenseAmount(''); //clear amount box
            setDateExpense(''); // clear date 
            setDescriptionOfExpense('');// clear description
           
            //hide modal
            setModalShow(false);

            //load again
            loadExpenses();


        } else {
            // create new object
            // if any fileds empty dont save

            if (!expenseAmount || !dateExpense || !descriptionOfExpense) {


                return;
            }


            // build an object of everything we are saving
            const currentExpense = { "amount": expenseAmount, "date": dateExpense, "description": descriptionOfExpense };

            const updateExpensesList = [...expensesList, currentExpense];// add current expense to expenses array
            try {
                // write the stringified object to the save file
                await FileSystem.writeAsStringAsync(
                    FileSystem.documentDirectory + fileName,
                    JSON.stringify(updateExpensesList)
                );

                setExpensesList(updateExpensesList); //set the array with updated expense list
                setExpenseAmount(''); //clear amount box
                setDateExpense(''); // clear date 
                setDescriptionOfExpense('');// clear description
                
                setModalShow(false);// hide add expense page

            } catch (e) {
                console.log(FileSystem.documentDirectory + fileName + e);
            }

            //load expenses again
            loadExpenses();
        }
    };



    //toatl expenses function
    // for loop to go over all expneses in expensesList array
    // total + each amount to float 
    // get toatl of expenses
    const totalExpensesAmount = () => {

        let total = 0;

        for (const expense of expensesList) {

            const amount = parseFloat(expense.amount);
            
                total += amount;
            
        }
        return total;
    };



    //date picker toggeling function to handle show it or not
    // from toThePointCode
    const toggleDatepicker = () => {

        setShowDatePicker(!showDatePicker); // if visible hide it vice versa
    };

    // handle chnage of value of date picker
    // from toThePointCode
    const onChange = ({type }, selectedDate) => {

        if (type == "set") {

            const currentDate = selectedDate; // date is set make curretnDate = selected date

            setDate(currentDate); // set date picker date to current date

            toggleDatepicker(); //show it

            setDateExpense(currentDate.toDateString()); // make expense date to be selected date

        } else {

            toggleDatepicker(); // hide it
        }
    };


    //update expense function

    const updateExpense = (index) => {

        //which item to update its index in array
        setUpdatingExpenseItem(index);

        // get expense item based on the index
        const item = expensesList[index];


        //set the data from item in the input boxes
        setExpenseAmount(item.amount);
        setDateExpense(item.date);
        setDescriptionOfExpense(item.description);
        setIsUpdatingExpense(true);// set updating expnse to true
        setModalShow(true);// show the modal
       
    };


    //delete expense function
    const deleteExpense = async (item) => {

        // create a new array leav out the  one need to be deleted 
        const updatedExpensesList = expensesList.filter(expense => expense !== item);

        // Update expenses list
        setExpensesList(updatedExpensesList);

        //vibrate when deletd
        Vibration.vibrate();

        // Save  updated expenses list
        try {
            await FileSystem.writeAsStringAsync(
                FileSystem.documentDirectory + fileName,
                JSON.stringify(updatedExpensesList)
            );
        } catch (e) {
            console.log(FileSystem.documentDirectory + fileName + e);
        }

        //load expeses list
        loadExpenses();
    };


    //Delete all expenses

    const deleteAll = async () => {

        // Show  alert to confirm deletetion 
        Alert.alert(
            'Delete All Expenses',
            'Are you sure you want to delete all expenses?',
            [
                {
                    text: 'Cancel',
                    
                },
                {
                    text: 'Delete',
                    onPress: async () => {
                        // Set expenses list to an empty array
                        setExpensesList([]);

                        //vibrate when deletd
                        Vibration.vibrate();

                        // Save empty array
                        try {
                            await FileSystem.writeAsStringAsync(
                                FileSystem.documentDirectory + fileName,
                                JSON.stringify([])
                            );
                        } catch (e) {
                            console.log(FileSystem.documentDirectory + fileName + e);
                        }
                    },
                   
                }
            ],
            {

                //by tapping outside of alert box it can be  dissmissed
                cancelable: true,
            }
        );

        //load expeses list
        loadExpenses();

    }


   

    // This effect hook will load the state, sound and unload when closed
    useEffect(() => {

        loadplaySound();

        loadExpenses();

        

        return () => {

            unloadPBO();
        };

    }, []);


   



  return (
      <PaperProvider>
          <View style={Styles.mainPage}>

              <StatusBar style="auto" />
            
              <View style={Styles.header}>
                  <Text style={Styles.allExpenseText}>All Expenses</Text>
                  <IconButton
                      //+ btn to show modal to add expnse
                      //set updating to false and show modal to true
                      //reset any data 
                       // make index null so it add insted of updating 
                      icon="plus-circle-outline"
                      size={30}
                      iconColor="white"
                      onPress={() => {

                          setIsUpdatingExpense(false);
                          setModalShow(true);
                          setExpenseAmount('');
                          setDateExpense('');
                          setDescriptionOfExpense('');
                          setUpdatingExpenseItem(null);
                          setDate(new Date());
                      }}
                  />
              </View>
              
              <Card style={Styles.totalCard}>
                  <Card.Content>
                      <Text style={Styles.totalText}>Total Expenses</Text>
                      <Text style={Styles.totalAmount}>${totalExpensesAmount()}</Text>
                  </Card.Content>
              </Card>

              <Divider />

              {expensesList.length > 0 && (
                  //when expnse list has 1 or more entry show the expenses 
                  <FlatList
                      data={expensesList} // eaxpeses
                      keyExtractor={(item, index) => index.toString()} // index of array to string
                      renderItem={({ item, index }) => (

                          <Pressable

                              onPress={() => updateExpense(index)}// on press edit the expense
                              onLongPress={() => deleteExpense(item) } // on long press delee the expense

                          >
                            
                          <Card style={Styles.expenseCard}>
                                
                              <Card.Content>
                                  <Text style={Styles.expenseDescription}>{item.description}</Text>
                                  <View style={Styles.expenseDateAmount}>
                                      <Text>{item.date}</Text>
                                      <Text>${item.amount}</Text>
                                  </View>

                              </Card.Content>

                          </Card>


                        </Pressable>

                      )}
                  />
              
              
              
              )}
              
              <Divider />

              <View style={Styles.bottom}>

                  <View style={Styles.iconView }>
                  <IconButton
                      //web search btn
                          icon="web"
                          mode="contained"
                          onPress={() => { SetWebModalShow(true);  } }

                      
                      style={Styles.bottomBtns }

                  /> 
                  <Text >Web</Text>
              
               </View>
             
                  <View style={Styles.iconView}>

                  <IconButton
                      //delete btn
                      icon="delete"
                      mode="contained"
                          onPress={() => { deleteAll(); } }
                      style={Styles.bottomBtns}

                 />
                      <Text >Delete All</Text>

                  </View>

              </View>

          </View>

          
          
          <Modal
              //add/update expneses page

                  animationType="slide"// show modal silde in
                  transparent={false}// not transperent
                  visible={modalShow}// visible when modalShow is true
                  onRequestClose={() => setModalShow(false)}// on lcose hide modal
              >
                  <View style={Styles.modalContainer}>
                      <Text style={Styles.modalTitle}>{isUpdatingExpense ? 'Update Expense' : 'Add Expense'}</Text>

                      <Text style={Styles.lable }>Amount</Text>
                      <TextInput
                          style={Styles.input}
                          placeholder="Amount"
                          keyboardType="numeric"
                          value={expenseAmount}// expnse amount to be stored
                          onChangeText={ setExpenseAmount}// set the expnse amount to the value
                      />

                      <Text style={Styles.lable}>Date</Text>

                      {showDatePicker && (
                          //showDatePicker true then show calender to select
                          //type is calender
                          //max date will be todays as dont want to have future dates in expnses
                          <DateTimePicker
                              mode="date"
                              display="calender"
                              value={date}
                              onChange={onChange}
                              maximumDate={new Date() }
                      />
                      )}
                      
                      {!showDatePicker && (
                          //showDatepicker is false
                          //show the text box with selected date
                          //pressed againg show the date picker
                          //not editable
                          <Pressable
                              onPress={toggleDatepicker}
                          >
                              <TextInput
                                  style={Styles.input}
                                  placeholder="Date"
                                  value={dateExpense}
                                  onChangeText={setDateExpense}
                                  editable={false}
                              />
                          </Pressable>

                      ) }
                      

                      <Text style={Styles.lable}>Description</Text>
                      <TextInput
                      //Description of expnse
                          style={Styles.input}
                          placeholder="Description"
                          value={descriptionOfExpense}
                          onChangeText={setDescriptionOfExpense}
                         
                      />
                     
                      <Button
                          //if updating the expnse show Update expnse text  else show add expense
                      //save the expnse
                          mode="contained"
                          onPress={saveExpenses}
                          style={Styles.modalButton}>
                         
                          {isUpdatingExpense ? 'Update Expense' : 'Add Expense'}
                      </Button>

                      <Button mode="contained" onPress={() => setModalShow(false)} style={Styles.modalButton}>
                          Cancel
                      </Button>

                 

                  </View>
              </Modal>


          <Modal

          // web View modal
              animationType="slide"// show modal silde in
              transparent={false}// not transperent
              visible={webModalShow}// visible when webModalShow is true
              onRequestClose={() => SetWebModalShow(false)}// on close hide modal

          >
              <WebView

                  source={{ uri: webUrl}}
             />


          </Modal>
         

      </PaperProvider>
  );
}

