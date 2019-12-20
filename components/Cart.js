import React, {Component} from 'react';
import { View, Text, TextInput,StyleSheet, SafeAreaView, FlatList, TouchableHighlight, Alert, Button} from 'react-native';
import Constants from 'expo-constants';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('toko.db');

export default class Troli extends Component {
    state = {
        troli : [],
        total: 0,
        id_barang: '',
        nama_barang: '',
        nama: '',
        no_hp: '',
        email: '',
        alamat: '',
        jumlah: 0,
        total: 0,
    }

    static navigationOptions = {
        title: 'Troli'
    };

    constructor(){
        super();
        db.transaction(tx=> {
            tx.executeSql('SELECT * FROM troli', null, (_, { rows: { _array } }) => {
                // alert(JSON.stringify(_array));
                let totaltmp= 0;
                for(let i=0;i<_array.length;i++){
                    let row = _array[i];
                    totaltmp += row.jumlah * row.harga;
                }
                this.setState({total: totaltmp});
                this.setState({ troli: _array });
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
                                tx.executeSql("DELETE FROM troli WHERE id=?",[item.id])
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
                        db.transaction(
                            tx => {
                                tx.executeSql("INSERT INTO pesan (id_barang, nama_barang, nama, no_hp, email, alamat, jumlah, total) VALUES (?,?,?,?,?,?,?,?)", [this.state.id_barang, this.state.nama_barang, this.state.nama, this.state.no_hp, this.state.email, this.state.alamat, this.state.jumlah, this.state.total]);

                            },
                            error => {
                                alert(error);
                            },
                            () => {
                                alert('Data pesanan tersimpan');
                                // var dAr = this.state.troli;
                                // dAr.splice(0);
                                // this.setState({troli:dAr}); 
                                // this.setState({total:0});                           
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
                                    <TouchableHighlight style={{width:100,backgroundColor: '#F24405', justifyContent: 'center', alignItems: 'center', borderRadius: 20}} onPress={() => this.hapusTroli(item,index)}>
                                        <Text style={styles.fullWidthButtonText}>Hapus</Text>
                                    </TouchableHighlight> 
                                    <Text>-----------------------------------------------------------------</Text>
                                </View>
                            );
                        }}
                        keyExtractor={item => item.isbn13}/>
                        <View>
                        <TextInput
                            value={this.state.nama}
                            placeholder="Nama"
                            onChangeText={(nama) => this.setState({ nama })}
                            style={styles.inputStyle}/>                   
                        <TextInput
                            value={this.state.no_hp}
                            placeholder="No HP"
                            onChangeText={(no_hp) => this.setState({ no_hp })}
                            style={styles.inputStyle}/>
                        <TextInput
                            value={this.state.email}
                            placeholder="Alamat Email"
                            onChangeText={(email) => this.setState({ email })}
                            style={styles.inputStyle}/>
                        <TextInput
                            value={this.state.alamat}
                            placeholder="Alamat Pengiriman"
                            onChangeText={(alamat) => this.setState({ alamat })}
                            style={styles.inputStyle}/>
                        </View>
                        <View style={{marginBottom:10, marginTop:10}}>
                            <Text style={{fontSize: 20, marginLeft:10, marginBottom:20}}>Total = {this.state.total} </Text>
                            <Button style={styles.fullWidthButton}
                                onPress={()=> this.checkout()}
                                title="Checkout"/>
                        </View>
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