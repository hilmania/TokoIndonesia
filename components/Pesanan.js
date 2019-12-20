import React, {Component} from 'react';
import { View, Text, TextInput,StyleSheet, SafeAreaView, FlatList, TouchableHighlight, Alert, Button} from 'react-native';
import Constants from 'expo-constants';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('toko.db');

export default class Pesanan extends Component {
    state = {
        pesanan : [],
        total: 0,
        nama: '',
        no_hp: '',
        email: '',
        alamat: '',
        jumlah: 0,
    }

    static navigationOptions = {
        title: 'Pesanan'
    };

    constructor(){
        super();
        db.transaction(tx=> {
            tx.executeSql('SELECT * FROM pesanan', null, (_, { rows: { _array } }) => {
            },
            error => {
                alert(error);
            },
            () => {
            
            });
        });
        this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
    }

    forceUpdateHandler(){
        this.forceUpdate();
    };

    hapusTroli = (item, index) => {
        Alert.alert(
            'Konfirmasi',
            'Menghapus item?',
            [
                {
                    text: 'Batal',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel', 
                },
                {
                    text: 'Hapus',
                    onPress: () => {
                        db.transaction(
                            tx => {
                                tx.executeSql("DELETE FROM pesanan WHERE id=?",[item.id])
                            },
                            error => {
                                alert(error);
                            },
                            () => {
                                var dAr = this.state.troli;
                                var pos = dAr.indexOf(item);
                                dAr.splice(pos,1);
                                this.setState({troli:dAr})                            }
                        );
                    }
                },
            ],
            {cancelable: true},
        );
    }

    checkout = () => {
        Alert.alert(
            'Konfirmasi',
            'Apakah ingin checkout?',
            [
                {
                    text: 'Batal',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel', 
                },
                {
                    text: 'Checkout',
                    onPress: () => {
                        alert(JSON.stringify(this.state.troli));
                        db.transaction(
                            tx => {
                                tx.executeSql("DELETE FROM troli")
                            },
                            error => {
                                alert(error);
                            },
                            () => {
                                var dAr = this.state.troli;
                                dAr.splice(0);
                                this.setState({troli:dAr}); 
                                this.setState({total:0});                           
                            }
                        );
                    }
                },
            ],
            {cancelable: true},
        );
    }

    render() {
        const {navigation} = this.props;
        var total=0;
        return (
            <View style={{flex:1, backgroundColor: '#f3f3f3'}}>
                <SafeAreaView style={styles.container}>
                    
                    <FlatList
                        data={this.state.troli}
                        renderItem={({item, index}) => {
                            let subtotal = item.harga * item.jumlah;
                            total += subtotal;
                            
                            return (
                                <View style={{marginLeft: 10}}>
                                    <Text style={{fontSize: 20}}>Nama Barang = {item.nama_barang} </Text>
                                    <Text style={{fontSize: 20}}>Harga = {item.harga} </Text>
                                    <Text style={{fontSize: 20}}>Qty = {item.jumlah}</Text>
                                    <Text style={{fontSize: 20}}>Subtotal = {subtotal} </Text>
                                    <Text style={{fontSize: 20}}>Nama = </Text>
                                    <Text>-----------------------------------------------------------------</Text>
                                </View>
                            );
                        }}
                        keyExtractor={item => item.id}/>

                </SafeAreaView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Constants.statusBarHeight,
    },
    item: {
        backgroundColor: '#f9c2ff',
        padding: 20,
        marginVertical: 8,
        marginHorizontal:16,
    },
    title: {
        fontSize: 30,
    },
    fullWidthButton: {
        width: 200,
        backgroundColor: '#F24405',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius:20
    },
    fullWidthButtonText: {
        margin:10,
        fontSize:10,
        color: 'white'
    },
    inputStyle: {
        marginLeft: 20,
        height: 40,
        width: 300,
        borderColor: 'black',
        borderWidth:1, 
        marginBottom:20
    }
});