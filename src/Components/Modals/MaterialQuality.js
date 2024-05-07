/** @format */

import { View, Text, Modal, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";

export default function MaterialQuality({
	modalVisible,
	setModalVisible,
	handleClick,
}) {
	const buttonList = [
		{
			id: 0,
			name: "Good",
			color: "green",
			value: "good",
		},
		{
			id: 1,
			name: "Average",
			color: "yellow",
			value: "average",
		},
		{
			id: 2,
			name: "Bad",
			color: "red",
			value: "bad",
		},
	];
	return (
		<Modal
			animationType="slide"
			transparent={true}
			visible={modalVisible}
			onRequestClose={() => {
				setModalVisible();
			}}
		>
			<View style={styles.centeredView}>
				<View style={styles.modalView}>
					<Text style={styles.modalText}>
						Please Select the Quality Condition of the Material
					</Text>

					{buttonList.map((button) => (
						<TouchableOpacity
							key={button.id}
							style={styles.button}
							onPress={() => handleClick(button)}
						>
							<Text style={{ color: button.color, fontSize: 16 }}>
								{button.name}
							</Text>
						</TouchableOpacity>
					))}

					<TouchableOpacity
						style={[styles.button, { elevation: 2 }]}
						onPress={() => setModalVisible()}
					>
						<Text style={{ fontSize: 16, color: "#979797" }}>Close</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	centeredView: {
		flex: 1,
		justifyContent: "flex-end",
		alignItems: "center",
		marginTop: 22,
		backgroundColor: "rgba(0,0,0,0.5)",
	},
	modalView: {
		backgroundColor: "white",
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
		width: "100%",
		height: 300,
	},
	button: {
		padding: 14,
		elevation: 1,
		width: "100%",
		alignItems: "center",
		marginVertical: 5,
	},
	buttonClose: {
		backgroundColor: "#2196F3",
	},
	textStyle: {
		color: "white",
		fontWeight: "bold",
		textAlign: "center",
	},
	modalText: {
		marginBottom: 15,
		textAlign: "center",
		color: "#979797",
		fontSize: 16,
		paddingVertical: 10,
		paddingHorizontal: 16,
	},
});
