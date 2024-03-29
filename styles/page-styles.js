import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },

    header: {

        fontSize: 25,
        marginBottom: 60,
        marginTop: -100,
    },



   

    button: {
        margin: 10,
        width: 100,
        height: 70,
        backgroundColor: 'lightblue',
        
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'solid',
        borderWidth: 2,

    },
    button2: {
        backgroundColor: 'lightblue',
        borderRadius: 30,
        padding: 20,
        marginBottom: -30,
        marginTop: 40,

        width: 150,
        height: 70,
        alignItems: 'center',

    },
    text: {

        fontSize: 20,
        padding: 15,
        paddingLeft: 80,
        paddingTop: 20,


    },
   
       
    textW: {
        fontSize: 30,
        paddingBottom: 30 
    },
    text1: {
        fontSize: 25,
        paddingBottom: 15
    },
    text2: {
        fontSize: 20,
        paddingBottom: 15
    },
    

    mole: {
        height: 100,
        width: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: 'solid',
        position: 'absolute',
        
    },

    mole1: {
       
        top: 300,
       left:-110,
        width: 100,
        height: 100,
        
    },
    mole2: {
        
        top: 200,
       
        width: 100,
        height: 100,

    },
    mole3: {

        
        top: 105,
       left:110,
        width: 100,
        height: 100,
    },
    mole4: {
        
        top: 110,
       left:-110,
        
        width: 100,
        height: 100,
    },
    mole5: {
        top:10,
        left:0,
        width: 100,
        height: 100,

    },
    mole6: {
       
        top: -85,
       left:105,
        
        width: 100,
        height: 100,

    },
    mole7: {
        
        top: -80,
        left: -110,
        width: 100,
        height: 100,
    },
    mole8: {
        
        top: -180,
        left: 0,
        width: 100,
        height: 100,

    },
    mole9: {
        
        top: -275,
       left:105,
        width: 100,
        height: 100,
    },

    boxSelected: {
        backgroundColor: 'brown',
    },
    boxUnselected: {
        backgroundColor: 'white',
    },

    backButton: {
        position: 'absolute',
        top: 0,
        left: 0,
        paddingTop: 10,
        width: 100,
        height: 60,
    },

    countView: {
        position: 'absolute',
        top: 85,
        right: 110,
        flexDirection: 'row',
        alignItems: 'center',
    },
    scoreText: {
        fontSize: 25,
        marginTop: -2,
        paddingBottom: 15,
    },
    timeText: {
        marginTop: 60,
        fontSize: 25,
    },
    livesText: {
        marginRight: -35,
        fontSize: 25,
        marginTop: -2,
        paddingBottom: 15,
    },

});


export default styles; 