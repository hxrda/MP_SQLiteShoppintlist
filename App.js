import { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
	StyleSheet,
	Text,
	TextInput,
	View,
	Button,
	FlatList,
} from "react-native";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("shoppinglistdb.db");

export default function App() {
	//States//
	const [product, setProduct] = useState("");
	const [amount, setAmount] = useState("");
	const [shoppingList, setShoppingList] = useState([]);

	//Functions//
	// Use effect hook
	useEffect(() => {
		db.transaction(
			(tx) => {
				tx.executeSql(
					"create table if not exists wishlist (id integer primary key not null, amount text, product text);"
				);
			},
			() => console.log("Error when creating DB"),
			updateList
		);
	}, []);

	// Save product
	const saveItem = () => {
		db.transaction(
			(tx) => {
				tx.executeSql("insert into wishlist (amount, product) values (?, ?);", [
					amount,
					product,
				]);
			},
			() => console.log("Error in saving"),
			updateList
		);
	};

	// Update shopping list
	const updateList = () => {
		db.transaction(
			(tx) => {
				tx.executeSql("select * from wishlist;", [], (_, { rows }) =>
					setShoppingList(rows._array)
				);
			},
			() => console.log("Error in updating"),
			null
		);
	};

	// Delete product
	const deleteItem = (id) => {
		db.transaction(
			(tx) => {
				tx.executeSql("delete from wishlist where id = ?;", [id]);
			},
			() => console.log("Error in deletion"),
			updateList
		);
	};

	const listSeparator = () => {
		return (
			<View
				style={{
					height: 5,
					width: "80%",
					backgroundColor: "#fff",
					marginLeft: "10%",
				}}
			/>
		);
	};

	//Rendering//
	return (
		<View style={styles.container}>
			<TextInput
				placeholder="Product"
				style={{
					marginTop: 30,
					fontSize: 18,
					width: 200,
					borderColor: "gray",
					borderWidth: 1,
				}}
				onChangeText={(product) => setProduct(product)}
				value={product}
			/>
			<TextInput
				placeholder="Amount"
				//keyboardType="numeric"
				style={{
					marginTop: 5,
					marginBottom: 5,
					fontSize: 18,
					width: 200,
					borderColor: "gray",
					borderWidth: 1,
				}}
				onChangeText={(amount) => setAmount(amount)}
				value={amount}
			/>

			<Button onPress={saveItem} title="Save" />

			<Text style={{ marginTop: 30, fontSize: 20 }}>Shopping list</Text>

			<FlatList
				style={{ marginLeft: "5%" }}
				keyExtractor={(item) => item.id.toString()}
				renderItem={({ item }) => (
					<View style={styles.listcontainer}>
						<Text style={{ fontSize: 18 }}>
							{item.product}, {item.amount}
						</Text>
						<Text
							style={{ fontSize: 18, color: "#0000ff" }}
							onPress={() => deleteItem(item.id)}
						>
							{" "}
							bought
						</Text>
					</View>
				)}
				data={shoppingList}
				ItemSeparatorComponent={listSeparator}
			/>
			<StatusBar style="auto" />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
		marginTop: 30,
	},
	listcontainer: {
		flexDirection: "row",
		backgroundColor: "#fff",
		alignItems: "center",
	},
});
