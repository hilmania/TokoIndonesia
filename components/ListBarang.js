import React, {Component} from 'react';
import {FlatList, ActivityIndicator, Text, View, StyleSheet, Image, TextInput, Button } from 'react-native';
import ActionButton from 'react-native-action-button';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase("toko.db");

export default class ListBarang extends Component {

    state = {
        barang: [],
        qty: ''
    }

    static navigationOptions = {
        title: 'List Barang'
    };

    constructor() {
        super();
        db.transaction(tx => {
            tx.executeSql("SELECT * FROM barang", null, (_, { rows: { _array } }) => this.setState({ barang: _array })
            );
        },
        error => {
            alert(error);
        },
        () => {
        });
    }

    formatDate(date) {
        var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

        if (month.length < 2) 
        month = '0' + month;
        if (day.length < 2)
        day = '0' + day;

        return [year, month, day].join('-');
    }

    flatListItemSeparator = () => {
        return (
            <View style={{height: .5, width: '100%', backgroundColor: '#000'}}/>
        );
    }

    buy = (item,index) => {
        if (this.state.qty == '' | this.state.qty == undefined) {
            alert('qty harus diisi');
            return;
        }
        var qty = parseInt(this.state.qty);
        var harga = parseFloat(item.harga);
        var subtotal = qty * harga;

        db.transaction(
            tx => {
                tx.executeSql("INSERT INTO troli (id_barang, nama_barang, harga, jumlah, subtotal) VALUES (?,?,?,?,?)", [item.id_barang,item.nama_barang,harga,qty,subtotal]);
            },
            error => {
                alert(error);
            },
            () => {
                alert('Barang berhasil dimasukkan ke Troli');                
            }
        );
    }
    
    render(){
        if(this.state.isLoading) {
            return(
                <View style={{flex: 1, padding: 20}}>
                    <ActivityIndicator/>
                </View>
            )
        }

        return(
            <View style={{flex: 1, paddingTop:20}}>
                <FlatList 
                    ItemSeparatorComponent = {this.flatListItemSeparator}
                    data={this.state.barang}
                    renderItem={({item},index) => {
                        return (
                            <View style={{flex: 1, flexDirection: 'row'}}>
                                <Image source = {{ uri: item.gambar }}
                                style={styles.imageView} />
                                <View style={{flex:1, marginRight: 20}}>
                                    <Text style={{fontWeight: 'bold'}}>
                                        {item.nama_barang}
                                    </Text>
                                    <Text>
                                        {item.gambar}
                                    </Text>
                                    <Text>
                                        {item.harga}
                                    </Text>
                                    <Text>
                                        {item.stok}
                                    </Text>
                                    <Text>
                                        {item.supplier}
                                    </Text>
                                    <View style={styles.containerButtonGroup}>
                                        <View style={styles.buttonContainer}>
                                            <TextInput
                                                onChangeText={(qty) => this.setState({ qty })}
                                                keyboardType='number-pad'
                                                placeholder='Jumlah'
                                                style={styles.inputStyle}/>
                                        </View>
                                        <View style={styles.buttonContainer}>
                                            <Button
                                                onPress={() => this.buy(item,index)}
                                                title="Beli"/>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        );
                    }}
                keyExtractor={({id_barang},index) => id_barang}
                ListFooterComponent = {() => {
                    return(
                        <View style={{marginTop: 20, width:200}}>
                            <Button
                                onPress={() => this.props.navigation.navigate('Cart')}
                                title="Keranjang"/>
                        </View>
                    );
                }}/>   
                <ActionButton
                    buttonColor="rgba(231,76,60,1)"
                    onPress={()=> this.props.navigation.navigate('TambahBarang')}/>     
            </View>
        );
    }
}

const styles = StyleSheet.create({
    MainContainer: {
        justifyContent: 'center',
        flex: 1,
        margin: 5,
        marginTop: (Platform.OS === 'ios') ? 20: 0,   
    },
    imageView: {
        width: '50%',
        height: 100,
        margin: 7,
        borderRadius: 7
    },
    textView: {
        width: '50%',
        textAlignVertical: 'center',
        padding: 10,
        color: '#000'
    },
    containerButtonGroup: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonContainer:{
        flex: 1,
    },
    inputStyle: {
        height: 30,
        borderColor: 'blue',
        borderWidth: 1,
        marginRight: 6,
        textAlign: 'center'
    }
});