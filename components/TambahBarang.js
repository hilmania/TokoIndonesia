import React, {Component} from 'react';
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity, Picker } from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import * as SQLite from 'expo-sqlite';
const db = SQLite.openDatabase("toko.db");

export default class TambahBarang extends Component {
    static navigationOptions = {
        title: 'Tambah Barang',
    };

    state = {
        id_barang: '',
        url_gambar: '',
        kategori: '',
        nama_barang: '',
        harga: '',
        stok: '',
        supplier: '',
        barang: []
    }

    constructor(){
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

    tambahBarang = () => {
        db.transaction(
            tx => {
                tx.executeSql("INSERT INTO barang (id_barang, gambar, kategori, nama_barang, harga, stok, supplier) VALUES (?,?,?,?,?,?,?)", [this.state.id_barang, this.state.url_gambar, this.state.kategori, this.state.nama_barang, this.state.harga, this.state.stok, this.state.supplier]);
            },
            error => {
                alert(error);
            },
            () => {
                alert('Sukses Menambahkan Barang');
                this.setState({id_gambar: '', url_gambar: '', kategori: '', nama_barang: '', harga: '', stok: '', supplier: ''});
                this.props.navigation.push('ListBarang')
            }
        );
    }

    render(){
        return (
            <View style={styles.container}>
                <View style={styles.innerStyle}>
                    <TextInput
                        value={this.state.id_barang}
                        placeholder="ID Barang"
                        onChangeText={(id_barang) => this.setState({ id_barang })}
                        style={styles.inputStyle}/>
                    <Picker
                        style={styles.inputStyle}
                        selectedValue={this.state.kategori}
                        onValueChange={(itemValue, itemIndex) =>
                            this.setState({kategori:itemValue})}>
                        <Picker.Item label="Makanan" value="Makanan"/>
                        <Picker.Item label="Kosmetik" value="Kosmetik"/>
                        <Picker.Item label="Aksesoris" value="Aksesoris"/>
                    </Picker>                    
                    <TextInput
                        value={this.state.nama_barang}
                        placeholder="Nama Barang"
                        onChangeText={(nama_barang) => this.setState({ nama_barang })}
                        style={styles.inputStyle}/>
                    <TextInput
                        value={this.state.harga}
                        placeholder="Harga"
                        onChangeText={(harga) => this.setState({ harga })}
                        keyboardType='number-pad'
                        style={styles.inputStyle}/>
                    <TextInput
                        value={this.state.stok}
                        placeholder="Stok"
                        onChangeText={(stok) => this.setState({ stok })}
                        keyboardType='number-pad'
                        style={styles.inputStyle}/>
                    <TextInput
                        value={this.state.supplier}
                        placeholder="Supplier"
                        onChangeText={(supplier) => this.setState({ supplier })}
                        style={styles.inputStyle}/>
                    <TextInput
                        placeholder="URL Gambar"
                        value={this.state.url_gambar}
                        onChangeText={(url_gambar) => this.setState({ url_gambar })}
                        style={styles.inputStyle}/>
                    <Button 
                        onPress={this.tambahBarang}
                        title="Simpan Barang" />
                </View>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: '#fff',
        alignItems: 'stretch'
    },
    innerStyle: {
        margin: 40
    },
    textStyle: {
        fontSize: 20
    },
    inputStyle: {
        height: 40,
        borderColor: 'blue',
        borderWidth:1, 
        marginBottom:20
    }
});