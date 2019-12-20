import React, {Component} from 'react';
import { StyleSheet } from 'react-native';

import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import ListBarang from './components/ListBarang';
import TambahBarang from './components/TambahBarang';
import Cart from './components/Cart';

import * as SQLite from 'expo-sqlite';

const AppNavigator = createStackNavigator({
  ListBarang: {
    screen: ListBarang,
  },
  TambahBarang: {
    screen: TambahBarang,
  },
  Cart: {
    screen: Cart
  }
}, {
  initialRouteName: 'ListBarang',
  defaultNavigationOptions: {
    headerStyle: {
      backgroundColor: '#f4511e',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  }
});

const AppContainer = createAppContainer(AppNavigator);
const db = SQLite.openDatabase("toko.db");

export default class App extends Component {

  constructor() {
    super();
    db.transaction(tx => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS barang (id INTEGER primary key not null, id_barang TEXT, gambar TEXT, kategori TEXT, nama_barang TEXT, harga REAL, stok INTEGER, supplier TEXT);"
      );
      tx.executeSql("CREATE TABLE IF NOT EXISTS troli (id INTEGER primary key not null, id_barang TEXT, nama_barang TEXT, harga REAL, jumlah INTEGER, subtotal REAL);");
      tx.executeSql("CREATE TABLE IF NOT EXISTS pesan (id INTEGER primary key not null, id_barang TEXT, nama_barang TEXT, nama TEXT, no_hp TEXT, email TEXT, alamat TEXT, jumlah INTEGER, total REAL);");
    },
    error => {
        alert(error);
    },
    () => {
        
    });
  }


  render(){
    return (
      <AppContainer/>
    );
  }
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
