import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TetxtInput, View, Modal, Vibration, Pressable } from 'react-native';
import { Link, useNavigation, } from 'expo-router';
import { Audio } from 'expo-av';
import {
    Button, List, Divider, Provider,
    Portal, IconButton, Card
} from 'react-native-paper';
import * as FileSystem from 'expo-file-system';
import Styles from '../styles/page-styles';
import DateTimePicker from ' @react-native-community/datetimepicker'; // date picker from expo

export default function App() {

    const navigation = useNavigation();//for navigation
    const [myPBO, setMyPBO] = useState(null);//hold my playnack object

    const [expenseAmount, setExpenseAmount] = useState('');// to hold expense amount spend 
    const [dateExpense, setDateExpense] = useState('');// store date the expense happened
    const [descriptionOfExpense, setDescriptionOfExpense] = useState('');// store the note of what was the expense
    const [expensesList, setExpensesList] = useState([]);// array to have all expenses
    const [modalShow, setModalShow] = useState(false); // to show add expese page on top of current page

    const fileName = 'statefile.json'; // file name to store state


    //load a sound into the PBO 
    const loadSound = async () => {

        try {


            const soundObj = new Audio.Sound()

            await soundObj.loadAsync(angryGorillaSound)

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


    //save to file inspired from Stephen's expo example

    /**
    * This function will load a json string of all the saved data 
    * We assume that the file is good
    * We assume that all the required object parts are present
    */
    const loadState = async () => {
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
            saveState();
        }
    }

    /**
     * This function will save the data as a json string 
     */
    const saveState = async () => {
        // build an object of everything we are saving
        const currentExpense = { "amount": expenseAmount, "date": dateExpense, "description": descriptionOfExpense};

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



    // This effect hook will load the state, sound and unload when closed
    useEffect(() => {

        loadState();
        loadSound();

        return () => {
            unloadPBO(); // unload the sound on component unmount
        };

    }, []);


  return (
    <View style={Styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

