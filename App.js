/**
 * Final Project - Expense Tracker
 * 
 * Author: Rajan Chaudhari
 * 
 * Date - 2024-03-30
 * 
 * Description - Keep track of your expenses, add them, edit them and delete them easy.
 * shows total to scare you or not
 * 
 * Inspiration
 * 
 * Stephen Graham's in class examples - Thanks Stephen
 * 
 * Design idea from
 * 
 * Expense Tracker:  https://github.com/N1k0l1n/Expense-Tracker-React-Native-App.git
 * 
 * Date picker idea from : 
 * 
 * Using Date Picker with TextInput (Expo | React Native App) - ToThePointCode youtube channale
 * 
 * 
 */

import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Stylesheet, Text, TextInput, View, Modal, Vibration, Pressable, FlatList } from 'react-native';
import { Link, useNavigation, } from 'expo-router';
import { Audio } from 'expo-av';
import {
    Button, List, Divider, Provider,
    Portal, IconButton, Card
} from 'react-native-paper';
import * as FileSystem from 'expo-file-system';
import Styles from './styles/page-styles';
import DateTimePicker from '@react-native-community/datetimepicker'; // date picker from expo


export default function App() {


   // const [myPBO, setMyPBO] = useState(null);//hold my playnack object

    const [expenseAmount, setExpenseAmount] = useState('');// to hold expense amount spend 
    const [dateExpense, setDateExpense] = useState('');// store date the expense happened
    const [showDatePicker, setShowDatePicker] = useState(false);// state of date picker
    const [descriptionOfExpense, setDescriptionOfExpense] = useState('');// store the note of what was the expense
    const [expensesList, setExpensesList] = useState([]);// array to have all expenses
    const [modalShow, setModalShow] = useState(false); // to show add expese page on top of current page

    const fileName = 'statefile.json'; // file name to store state

    /** 

    //load a sound into the PBO 
    const loadSound = async () => {

        try {


            const soundObj = new Audio.Sound()

            await soundObj.loadAsync()

            setMyPBO(soundObj)





        } catch (error) {
            console.log(error);
        }
    }

    //play a pbo
    const playPBO = async () => {

        try {



            await myPBO.playAsync();



        } catch (e) {
            console.log(e);
        }
    }

    //unload a pbo
    const unloadPBO = async () => {

        await myPBO.unloadAsync();



    }
    */

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
    }


    //toatl expenses function
    // for loop to go over all expneses in expensesList array
    // total + each amount to float 
    // get toatl of expenses
    const totalExpensesAmount = () => {

        let total = 0;

        for (const expense of expensesList) {

            total += parseFloat(expense.amount);
        }
        return total;
    };

    // This effect hook will load the state, sound and unload when closed
    useEffect(() => {

        loadExpenses();
       // loadSound();

        return () => {
           // unloadPBO(); // unload the sound on component unmount
        };

    }, []);


  return (
      <Provider>
          <View style={Styles.mainPage }>
            
              <View style={Styles.header}>
                  <Text style={Styles.allExpenseText}>All Expenses</Text>
                  <IconButton
                      icon="plus"
                      onPress={() => setModalVisible(true)}
                  />
              </View>
              
              <Card style={Styles.totalCard}>
                  <Card.Content>
                      <Text style={Styles.totalText}>Total Expenses</Text>
                      <Text style={Styles.totalAmount}>${totalExpensesAmount()}</Text>
                  </Card.Content>
              </Card>

              <Divider />

              <FlatList
                  data={expensesList.slice(0).reverse()} // Reverese order
                  keyExtractor={(item, index) => index.toString()} // index of array to string
                  renderItem={({ item }) => (
                      <Card style={Styles.expenseCard}>
                          <Card.Content>
                              <Text style={Styles.expenseDescription}>{item.description}</Text>
                              <View style={Styles.expenseDateAmount}>
                                  <Text>{item.date}</Text>
                                  <Text>${item.amount}</Text>
                              </View>
                          </Card.Content>
                      </Card>
                  )}
              />


          </View>

          <Portal>
              <Modal
                  animationType="slide"
                  transparent={false}
                  visible={modalShow}
                  onRequestClose={() => setModalShow(false)}
              >
                  <View style={Styles.modalContainer}>
                      <Text style={Styles.modalTitle}>Add Expense</Text>
                      <TextInput
                          style={Styles.input}
                          placeholder="Amount"
                          keyboardType="numeric"
                          value={expenseAmount}
                          onChangeText={text => setExpenseAmount(text)}
                      />
                      <TextInput
                          style={Styles.input}
                          placeholder="Date"
                          value={dateExpense}
                          onChangeText={text => setDate(text)}
                      />
                      <TextInput
                          style={Styles.input}
                          placeholder="Description"
                          value={descriptionOfExpense}
                          onChangeText={text => setDescriptionOfExpense(text)}
                      />
                      <Button mode="contained" onPress={saveExpenses} style={Styles.modalButton}>
                          Add Expense
                      </Button>
                  </View>
              </Modal>
          </Portal>

      </Provider>
  );
}

