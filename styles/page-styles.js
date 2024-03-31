import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },

    mainPage: {

        flex:1
    },



    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20
       
    },

    allExpenseText: {

        fontSize: 20,
        fontWeight: 'bold'
    },

    totalCard: {

        margin: 20,
    },

    totalText: {
        fontSize: 16,
        marginBottom: 5,
    },

    totalAmount: {
        fontSize: 20,
        fontWeight: 'bold',

    },

    expenseCard: {

        marginHorizontal: 20,
        marginVertical: 10,
    },

    expenseDescription: {

        marginBottom: 5,
        fontWeight: 'bold',
    },

    expenseDateAmount: {

        flexDirection: 'row',
        justifyContent: 'space-between'

    },

    modalContainer: {

        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,


    },

    modalTitle: {

        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,

    },

    lable: {

       

    },

    input: {

        height: 40,
        width: '100%',
        marginBottom: 10,
        paddingHorizontal: 10,
        borderColor: 'gray',
        borderWidth: 1,

    },

   

    modalButton: {

        marginTop: 20,

    },
   
   

   

  
   
    

});


export default styles; 