import SQLite from 'react-native-sqlite-storage';

function errorCB(err) {
    console.log("SQL Error: " + err);
}

function openCB() {
    console.log("Database OPENED");
}

//SQLite.deleteDatabase({name: 'dpm.db'});

const db = SQLite.openDatabase({
    name: "dpm.db",
    createFromLocation: 1
}, openCB, errorCB);

//db.executeSql('delete from properties');

export default db;

