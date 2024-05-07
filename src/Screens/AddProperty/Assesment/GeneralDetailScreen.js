/** @format */

import React, { cloneElement, Component } from "react";
import { connect } from "react-redux";
import { Checkbox } from "react-native-material-ui";
import _, { constant, result } from "lodash";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import NumberFormat from "react-number-format";
import { SelectPicker, TextInput } from "../../../Components/Input";
import MultiPicker from "../../../Components/MultiPicker";
import MultiPickerDilapidated from "../../../Components/MultiPickerDilapidated";
import MultiPickerCouncilAdjustment from "../../../Components/MultiPickerCouncilAdjustment";
import { setPropertyField } from "../../../redux/actions/PropertyActions";
import Colors from "../../../Colors";
import store from "../../../redux/store";
import AsyncStorage from "@react-native-community/async-storage";
import ActionSheet from "react-native-actionsheet";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Link } from "../../../Components/Link";
import MapViewPicker from "../../../Components/MapView";
import MaterialQualityModal from "../../../Components/Modals/MaterialQuality";

const VALUE_ADDED_MAST_ID = 8;
const VALUE_SHOP_ID = 3;

let adjustmentsVal = [
	{
		label: "Water Supply",
		value: "1",
		percentage: "2",
		group_name: "A",
		amount: "5",
	},
	{
		label: "Electricity",
		value: "2",
		percentage: "3",
		group_name: "A",
		amount: "5",
	},
	{
		label: "Waste Management Services/Points/Locations",
		value: "3",
		percentage: "5",
		group_name: "A",
		amount: "5",
	},
	{
		label: "Market",
		value: "4",
		percentage: "3",
		group_name: "A",
		amount: "5",
	},
	{
		label: "Hazardous Location/Environment",
		value: "5",
		percentage: "3",
		group_name: "A",
		amount: "15",
	},
	{
		label: "Informal settlement",
		value: "6",
		percentage: "3",
		group_name: "A",
		amount: "15",
	},
	{
		label: "Easy Street Access",
		value: "7",
		percentage: "3",
		group_name: "A",
		amount: "5",
	},
	{
		label: "Paved/Tarred Road/Street",
		value: "8",
		percentage: "3",
		group_name: "A",
		amount: "5",
	},
	{
		label: "Drainage",
		value: "9",
		percentage: "3",
		group_name: "A",
		amount: "5",
	},
];

const tempadjustmentsVal = [
	{
		label: "Water Supply",
		value: "1",
		percentage: "2",
		group_name: "A",
		amount: "5",
	},
	{
		label: "Electricity",
		value: "2",
		percentage: "3",
		group_name: "A",
		amount: "5",
	},
	{
		label: "Waste Management Services/Points/Locations",
		value: "3",
		percentage: "5",
		group_name: "A",
		amount: "5",
	},
	{
		label: "Market",
		value: "4",
		percentage: "3",
		group_name: "A",
		amount: "5",
	},
	{
		label: "Hazardous Location/Environment",
		value: "5",
		percentage: "3",
		group_name: "A",
		amount: "15",
	},
	{
		label: "Informal settlement",
		value: "6",
		percentage: "3",
		group_name: "A",
		amount: "15",
	},
	{
		label: "Easy Street Access",
		value: "7",
		percentage: "3",
		group_name: "A",
		amount: "5",
	},
	{
		label: "Paved/Tarred Road/Street",
		value: "8",
		percentage: "3",
		group_name: "A",
		amount: "5",
	},
	{
		label: "Drainage",
		value: "9",
		percentage: "3",
		group_name: "A",
		amount: "5",
	},
];

class GeneralDetailScreen extends Component {
	constructor(props) {
		super(props);

		this.state = {
			length: 0,
			breath: 0,
			range: new Array(20).fill("a").map((item, index) => {
				return {
					label: (index + 1).toString(),
					value: index + 1,
				};
			}),
			selected: "",
			wallPer: "0",
			roofPer: "0",
			valuePer: "0",
			windowPer: "0",
			visibleLocationPicker: false,
			modalVisible: false,
		};

		//alert()
		//alert(_.find(district, { value: store.getState().user.activeUser.assign_district_id }).amount )
	}

	// onChangeLength = length => this.setState({ length });
	// onChangeBreath = breath => this.setState({ breath });
	// onChangeLength = length => this.props.setPropertyField('assessmentLength', length.replace(/[- #*;,.<>\{\}\[\]\\\/]/gi, '') );;
	// onChangeBreath = breath => this.props.setPropertyField('assessmentBreadth', breath.replace(/[- #*;,.<>\{\}\[\]\\\/]/gi, ''));

	onChangeLength = (length) => {
		this.props.setPropertyField("assessmentLength", this.validate(length));
		this.props.setPropertyField("assessmentArea", 0);
		this.props.setPropertyField(
			"assessmentRateWithoutGST",
			this.getGrandTotal()
		);
		this.props.setPropertyField("assessmentRateWithGST", this.getGSTTotal());
		console.log("On change Length");
	};
	onChangeBreath = (breath) => {
		this.props.setPropertyField("assessmentBreadth", this.validate(breath));
		this.props.setPropertyField("assessmentArea", 0);
		this.props.setPropertyField(
			"assessmentRateWithoutGST",
			this.getGrandTotal()
		);
		this.props.setPropertyField("assessmentRateWithGST", this.getGSTTotal());
		console.log("On change Breadth");
	};
	onChangeArea = (area) => {
		this.props.setPropertyField("assessmentArea", this.validate(area));
		this.props.setPropertyField("assessmentLength", 0);
		this.props.setPropertyField("assessmentBreadth", 0);
		this.props.setPropertyField(
			"assessmentRateWithoutGST",
			this.getGrandTotal()
		);
		this.props.setPropertyField("assessmentRateWithGST", this.getGSTTotal());
		console.log("On change Area");
	};

	onChangePropertyCategory = (text) => {
		console.log("------------  Property Type----------- ---------");
		console.log(text);
		this.props.setPropertyField("assessmentPropertyCategory", text);
		this.props.setPropertyField(
			"assessmentRateWithoutGST",
			this.getGrandTotal()
		);
		this.props.setPropertyField("assessmentRateWithGST", this.getGSTTotal());
		console.log("On change Property Category");
	};
	onChangeType = (text) => {
		this.props.setPropertyField("assessmentType", text);
		this.props.setPropertyField(
			"assessmentRateWithoutGST",
			this.getGrandTotal()
		);
		this.props.setPropertyField("assessmentRateWithGST", this.getGSTTotal());
		console.log("On change Property Type");
	};
	onChangeTypeTotal = (text) => {
		this.props.setPropertyField("assessmentTypeTotal", text);
		this.props.setPropertyField(
			"assessmentRateWithoutGST",
			this.getGrandTotal()
		);
		this.props.setPropertyField("assessmentRateWithGST", this.getGSTTotal());
		console.log("On change Property Type Total");
	};

	onChangeMaterialUsedOnWall = (text) => {
		this.props.setPropertyField("assessmentMaterialUsedOnWall", text);
		this.props.setPropertyField(
			"assessmentRateWithoutGST",
			this.getGrandTotal()
		);
		this.props.setPropertyField("assessmentRateWithGST", this.getGSTTotal());
		console.log("On change Wall Material");
		this.setState(
			{
				selected: "wall",
				wallPer: "0",
				modalVisible: true,
			},
			() => {
				//this.ActionSheet.show()
			}
		);
	};

	onChangeWindowType = (text) => {
		this.props.setPropertyField("assessmentWindowType", text);
		this.props.setPropertyField(
			"assessmentRateWithoutGST",
			this.getGrandTotal()
		);
		this.props.setPropertyField("assessmentRateWithGST", this.getGSTTotal());

		this.setState(
			{
				selected: "window",
				windowPer: "0",
			},
			() => {
				//this.ActionSheet.show()
			}
		);

		console.log("On change Window Type");
	};
	onChangeMaterialUsedOnRoof = (text) => {
		this.props.setPropertyField("assessmentMaterialUsedOnRoof", text);
		this.props.setPropertyField(
			"assessmentRateWithoutGST",
			this.getGrandTotal()
		);
		this.props.setPropertyField("assessmentRateWithGST", this.getGSTTotal());

		this.setState(
			{
				selected: "roof",
				roofPer: "0",
			},
			() => {
				//this.ActionSheet.show()
			}
		);

		console.log("On change Roof Material");
	};
	onChangePropertyDimension = (text) => {
		this.props.setPropertyField("assessmentPropertyDimension", text);
		this.props.setPropertyField(
			"assessmentRateWithoutGST",
			this.getGrandTotal()
		);
		this.props.setPropertyField("assessmentRateWithGST", this.getGSTTotal());
		console.log("On change Dimension");
	};
	onChangeValueAdded = (text) => {
		console.log(
			"------------------------------------------------------on change value added"
		);
		console.log(text);
		// if(text.length === 0){
		//     adjustmentsVal = tempadjustmentsVal;
		// }
		// text.forEach(ele => {
		//     console.log(ele.label)
		//     if(ele.label === "Electricity") {
		//         adjustmentsVal.splice(1,1);
		//     }else if (ele.label === "Water") {
		//         adjustmentsVal.splice(0,1);
		//     }else {
		//         console.log("reset");
		//         adjustmentsVal = tempadjustmentsVal;
		//     }
		// });
		console.log("-------------------");
		this.props.setPropertyField("assessmentValueAdded", text);
		this.props.setPropertyField(
			"assessmentRateWithoutGST",
			this.getGrandTotal()
		);
		this.props.setPropertyField("assessmentRateWithGST", this.getGSTTotal());

		console.log(text);

		this.setState(
			{
				selected: "valueadded",
				valuePer: "0",
			},
			() => {
				//this.ActionSheet.show()
			}
		);

		console.log("On change Value added");
	};
	onChangeAdjustment = (text) => {
		this.props.setPropertyField("assessmentAdjustment", text);
		this.props.setPropertyField(
			"assessmentRateWithoutGST",
			this.getGrandTotal()
		);
		this.props.setPropertyField("assessmentRateWithGST", this.getGSTTotal());
		console.log("On change council adjustment");
	};
	onChangePropertyUse = (text) => {
		if (text === null) {
			this.props.setPropertyField("assessmentPropertyUse", 25);
		} else {
			this.props.setPropertyField("assessmentPropertyUse", text);
		}
		this.props.setPropertyField(
			"assessmentRateWithoutGST",
			this.getGrandTotal()
		);
		this.props.setPropertyField("assessmentRateWithGST", this.getGSTTotal());
		console.log("On change Property Use");
	};
	onChangePropertyZone = (text) => {
		this.props.setPropertyField("assessmentPropertyZone", text);
		this.props.setPropertyField(
			"assessmentRateWithoutGST",
			this.getGrandTotal()
		);
		this.props.setPropertyField("assessmentRateWithGST", this.getGSTTotal());
		console.log("On change Property Zone");
	};

	onTotalCompoundHouseChange = (text) => {
		this.props.setPropertyField("assessmentTotalCompoundHouse", text);
		this.props.setPropertyField(
			"assessmentRateWithoutGST",
			this.getGrandTotal()
		);
		this.props.setPropertyField("assessmentRateWithGST", this.getGSTTotal());
		console.log("On change Compound House");
	};
	onCompoundNameChange = (text) => {
		this.props.setPropertyField("assessmentCompoundHouseName", text);
		this.props.setPropertyField(
			"assessmentRateWithoutGST",
			this.getGrandTotal()
		);
		this.props.setPropertyField("assessmentRateWithGST", this.getGSTTotal());
		console.log("On change Compound Name change");
	};
	onChangeTotalCommunicationMast = (text) => {
		this.props.setPropertyField("assessmentTotalCommunicationMast", text);
		this.props.setPropertyField(
			"assessmentRateWithoutGST",
			this.getGrandTotal()
		);
		this.props.setPropertyField("assessmentRateWithGST", this.getGSTTotal());
	};
	onChangeTotalShop = (text) => {
		this.props.setPropertyField("assessmentTotalShop", text);
		this.props.setPropertyField(
			"assessmentRateWithoutGST",
			this.getGrandTotal()
		);
		this.props.setPropertyField("assessmentRateWithGST", this.getGSTTotal());
	};
	onChangeSwimmingPool = (text) => {
		if (text === null) {
			this.props.setPropertyField("assessmentSwimmingPool", 3);
		} else {
			this.props.setPropertyField("assessmentSwimmingPool", text);
		}

		this.props.setPropertyField(
			"assessmentRateWithoutGST",
			this.getGrandTotal()
		);
		this.props.setPropertyField("assessmentRateWithGST", this.getGSTTotal());
		console.log("On change Swimming pool");
	};
	onChangeSanitation = (text) => {
		if (text === null) {
			this.props.setPropertyField("assessmentSanitation", 3);
		} else {
			this.props.setPropertyField("assessmentSanitation", text);
		}
		//this.props.setPropertyField('assessmentSanitation', text);
		this.props.setPropertyField(
			"assessmentRateWithoutGST",
			this.getGrandTotal()
		);
		this.props.setPropertyField("assessmentRateWithGST", this.getGSTTotal());
		console.log("On change Sanitation");
	};
	onChangeGatedCommunity = (checked) => {
		this.props.setPropertyField("isGatedCommunity", checked);
		this.props.setPropertyField(
			"assessmentRateWithoutGST",
			this.getGrandTotal()
		);
		this.props.setPropertyField("assessmentRateWithGST", this.getGSTTotal());
		console.log("On change Gated Community");
	};

	getSubTotal = (type) => {
		const {
			assessmentPropertyCategory,
			assessmentType,
			assessmentTypeTotal,
			assessmentMaterialUsedOnWall,
			assessmentMaterialUsedOnRoof,
			assessmentWindowType,
			group_name,
			assessmentPropertyDimension,
			assessmentLength,
			assessmentBreadth,
			assessmentArea,
			assessmentValueAdded,
			assessmentAdjustment,
			assessmentPropertyUse,
			assessmentPropertyZone,
			assessmentRateWithoutGST,
			assessmentRateWithGST,
			assessmentTotalCommunicationMast,
			assessmentTotalShop,
			isGatedCommunity,
			assessmentSwimmingPool,
			assessmentSanitation,
		} = this.props.property;

		const {
			categories,
			wallMaterials,
			roofMaterials,
			windowType,
			dimensions,
			district,
			propertyUse,
			zones,
			swimmingPool,
			sanitation,
			gatedCommunity: gatedCommunityAmount,
		} = this.props.options;

		// console.log("Adjustment values");
		// console.log(assessmentAdjustment);
		console.log(
			"*******************************assessment Property -------------------------"
		);
		console.log(assessmentPropertyCategory);
		let productCategoryAmount = 1;

		assessmentPropertyCategory.map((item) => {
			productCategoryAmount *= item.amount;
		});
		console.log("Step 1: Property Type Amount: " + productCategoryAmount);
		console.log(assessmentPropertyCategory);

		const propertyDistrict = 0;

		const typeAmount = _.sumBy(assessmentType, "amount");
		console.log("Step 2: Property Habitable Floors: " + typeAmount);
		console.log(assessmentType);

		let materialUsedOnWallAmount = assessmentMaterialUsedOnWall
			? _.find(wallMaterials, { value: assessmentMaterialUsedOnWall }).amount
			: 0;
		if (parseInt(this.state.wallPer) > 0) {
			let val = (materialUsedOnWallAmount * parseInt(this.state.wallPer)) / 100;
			materialUsedOnWallAmount = materialUsedOnWallAmount + val;
			// alert(this.state.wallPer+" pos "+materialUsedOnWallAmount)
		} else {
			let val = (materialUsedOnWallAmount * parseInt(this.state.wallPer)) / 100;
			materialUsedOnWallAmount = materialUsedOnWallAmount + val;
			//alert(parseInt(this.state.wallPer)+" neg "+materialUsedOnWallAmount)
		}
		console.log("Step 3: Wall materials: " + materialUsedOnWallAmount);
		console.log(assessmentMaterialUsedOnWall);

		let windowTypeAmount = assessmentWindowType
			? _.find(windowType, { value: assessmentWindowType }).amount
			: 0;
		if (parseInt(this.state.windowPer) > 0) {
			let val = (windowTypeAmount * parseInt(this.state.windowPer)) / 100;
			windowTypeAmount = windowTypeAmount + val;
			//  alert(this.state.windowPer+" pos "+windowTypeAmount)
		} else {
			let val = (windowTypeAmount * parseInt(this.state.windowPer)) / 100;
			windowTypeAmount = windowTypeAmount + val;
			// alert(parseInt(this.state.windowPer)+" neg "+windowTypeAmount)
		}
		console.log("Step 4: window Type materials: " + windowTypeAmount);
		console.log(assessmentWindowType);

		let materialUsedOnRoofAmount = assessmentMaterialUsedOnRoof
			? _.find(roofMaterials, { value: assessmentMaterialUsedOnRoof }).amount
			: 0;
		if (parseInt(this.state.roofPer) > 0) {
			let val = (materialUsedOnRoofAmount * parseInt(this.state.roofPer)) / 100;
			materialUsedOnRoofAmount = materialUsedOnRoofAmount + val;
			// alert(this.state.wallPer+" pos "+materialUsedOnRoofAmount)
		} else {
			let val = (materialUsedOnRoofAmount * parseInt(this.state.roofPer)) / 100;
			materialUsedOnRoofAmount = materialUsedOnRoofAmount + val;
			// alert(parseInt(this.state.roofPer)+" neg "+materialUsedOnRoofAmount)
		}
		console.log("Step 5: Roof materials: " + materialUsedOnRoofAmount);
		console.log(assessmentMaterialUsedOnRoof);

		//  const propertyDimensionAmount = assessmentPropertyDimension ? _.find(dimensions, { value: assessmentPropertyDimension }).amount : 1;
		const swimmingPoolAmount = assessmentSwimmingPool
			? _.find(swimmingPool, { value: assessmentSwimmingPool }).amount
			: 0;
		console.log("Step 6: Swimmingpool Amount: " + swimmingPoolAmount);
		console.log(assessmentSwimmingPool);

		const sanitationAmount = assessmentSanitation
			? _.find(sanitation, { value: assessmentSanitation }).amount
			: 1;
		console.log("Step 7: Sanitation Amount: " + sanitationAmount);
		console.log(assessmentSanitation);

		const finalValueAdded = assessmentValueAdded.map((item) => {
			let newItem = { ...item };

			if (item.value === VALUE_ADDED_MAST_ID) {
				newItem.amount =
					item.amount *
					(assessmentTotalCommunicationMast
						? parseInt(assessmentTotalCommunicationMast)
						: 0);
			}

			if (item.value === VALUE_SHOP_ID) {
				newItem.amount =
					item.amount *
					(assessmentTotalShop ? parseInt(assessmentTotalShop) : 0);
			}
			if (newItem.label == "Electricity") {
				// newItem=newItem
			} else if (newItem.label == "Water") {
				// newItem=newItem
			} else {
				let val = (newItem.amount * parseInt(this.state.valuePer)) / 100;
				newItem.amount = newItem.amount + val;
			}

			//alert(newItem)
			//console.log( "newItem---"+JSON.stringify(newItem))
			return newItem;
		});
		// const finalAdjustment = adjustment_values.map(item => {
		//     let newItem = { ...item };
		//     if (item.group_name === "A") {
		//         newItem
		//     }
		//     return newItem;
		// });

		const gratedCommunity = isGatedCommunity ? gatedCommunityAmount : 1;

		const valueAddedAmount = _.sumBy(finalValueAdded, "amount");
		console.log("Step 8: value added sum: " + valueAddedAmount);
		console.log(assessmentValueAdded);

		const propertyUseAmount = assessmentPropertyUse
			? _.find(propertyUse, { value: assessmentPropertyUse }).amount
			: 1;
		console.log("Step 9: Property Use Amount: " + propertyUseAmount);
		console.log(assessmentPropertyUse);

		const propertyZoneAmount = assessmentPropertyZone
			? _.find(zones, { value: assessmentPropertyZone }).amount
			: 1;
		console.log("Step 10: Property Zone Amount: " + propertyZoneAmount);
		console.log(assessmentPropertyZone);

		const totalAdditions =
			materialUsedOnWallAmount +
			materialUsedOnRoofAmount +
			valueAddedAmount +
			windowTypeAmount +
			swimmingPoolAmount;

		const propertyDistrictAmount = store.getState().user.activeUser
			.assign_district_id
			? _.find(district, {
					value: store.getState().user.activeUser.assign_district_id,
			  }).amount
			: 1;
		//alert(propertyDistrictAmount)
		// const total = ((totalAdditions * (typeAmount * propertyDimensionAmount * propertyUseAmount) * gratedCommunity) + swimmingPoolAmount);
		let formula = 0;
		if (assessmentArea > 0) {
			formula =
				propertyDistrictAmount *
				(assessmentArea ? parseFloat(assessmentArea) : 1);
		} else {
			formula =
				propertyDistrictAmount *
				(assessmentLength ? parseFloat(assessmentLength) : 1) *
				(assessmentBreadth ? parseFloat(assessmentBreadth) : 1);
		}

		console.log("Rate per sq meter");
		console.log(propertyDistrictAmount);
		console.log("Step 11: Property Dimension: " + formula);

		const total =
			(formula + totalAdditions) *
			propertyUseAmount *
			propertyZoneAmount *
			typeAmount *
			gratedCommunity *
			sanitationAmount;
		console.log("Step 12: Total: " + total);
		//console.log("formula-->("+propertyDistrictAmount+" * "+(assessmentLength ? parseFloat(assessmentLength) : 1)+"*"+ (assessmentBreadth ? parseFloat(assessmentBreadth) : 1)+")")
		//console.log("total--->((("+formula+" + ((("+totalAdditions+" * ("+propertyUseAmount+")) * ("+propertyZoneAmount+")) * ("+typeAmount+"))) * ("+gratedCommunity+")) + "+swimmingPoolAmount+") * 1")
		//return (total > 0 ? total / propertyZoneAmount : 0) / productCategoryAmount;
		//return Math.round(total)
		var final = total * productCategoryAmount;
		console.log("Final Total: " + final);
		// this.props.setPropertyField('assessmentRateWithoutGST', final.toFixed(2));
		// this.props.setPropertyField('assessmentRateWithGST', final.toFixed(2));
		if (type) {
			var totalPercentage = 0;
			//alert(JSON.stringify(assessmentAdjustment))

			assessmentAdjustment.map((item) => {
				totalPercentage = totalPercentage + Number(item.amount);
			});
			//alert(totalPercentage)
			rateValue = final * ((100 - totalPercentage) / 100);
			final = rateValue;
		}
		return final.toFixed(2);
	};

	getGSTTotal = () => {
		const subTotal = this.getSubTotal();
		return subTotal > 0 ? (subTotal * 15) / 100 : 0;
	};

	getGrandTotal = () => {
		//return this.getSubTotal() + this.getGSTTotal();

		return this.getSubTotal();
	};

	getTotal = function(assessmentLength, assessmentBreadth, assessmentArea) {
		//return this.getSubTotal() + this.getGSTTotal();
		let data;
		if (assessmentArea > 0) {
			data = assessmentArea ? parseFloat(assessmentArea) : 0;
		} else {
			data =
				(assessmentLength ? parseFloat(assessmentLength) : 0) *
				(assessmentBreadth ? parseFloat(assessmentBreadth) : 0);
			//alert(data)
		}

		return data.toFixed(2);
	};

	validate = function(val) {
		var t = val;
		val =
			t.indexOf(".") >= 0
				? t.substr(0, t.indexOf(".")) + t.substr(t.indexOf("."), 3)
				: t;
		return val;
	};

	renderMoney = (formattedMoney) => {
		return <Text>{formattedMoney}</Text>;
	};
	hideLocationPicker = () => this.setState({ visibleLocationPicker: false });

	showLocationPicker = () => this.setState({ visibleLocationPicker: true });
	handlePickLocation = (areas) => {
		//let area = await AsyncStorage.getItem('area', null);

		this.props.setPropertyField("assessmentArea", areas);
		this.hideLocationPicker();
	};

	handleMaterialModal = () => {
		this.setState({ modalVisible: !this.state.modalVisible });
	};

	handleQualityClick = (quality) => {
		console.log(quality);
		this.handleMaterialModal();
	};
	render() {
		const {
			categories,
			wallMaterials,
			types,
			valueAdded,
			adjustment_values,
			roofMaterials,
			windowType,
			dimensions,
			propertyUse,
			swimmingPool,
			sanitation,
			zones,
			district,
			characteristic_values,
			title,
		} = this.props.options;

		const {
			assessmentPropertyCategory,
			assessmentType,
			assessmentTypeTotal,
			assessmentMaterialUsedOnWall,
			assessmentMaterialUsedOnRoof,
			assessmentWindowType,
			group_name,
			assessmentPropertyDimension,
			assessmentBreadth,
			assessmentLength,
			assessmentArea,
			assessmentValueAdded,
			assessmentAdjustment,

			assessmentSwimmingPool,
			assessmentSanitation,
			assessmentPropertyUse,
			assessmentPropertyZone,
			assessmentRateWithoutGST,
			assessmentRateWithGST,
			isCompletedSaved,
			assessmentTotalCompoundHouse,
			assessmentCompoundHouseName,
			assessmentTotalCommunicationMast,
			assessmentTotalShop,
			isGatedCommunity,
			serverPropertyId,
		} = this.props.property;

		// console.log("Assessment Details values");
		// console.log(serverPropertyId);
		// console.log(this.props.property);

		get_adjustment_values = () => {
			var data = [];
			//     const group=_.find(district, { value: store.getState().user.activeUser.assign_district_id }).group_name;
			//    await AsyncStorage.setItem("group_name", group);

			var finalData = assessmentAdjustment.filter(
				(item) =>
					item.group_name ===
					_.find(district, {
						value: store.getState().user.activeUser.assign_district_id,
					}).group_name
			);
			alert(JSON.stringify(finalData));
			if (assessmentValueAdded.length > 0) {
				data = finalData;
				assessmentValueAdded.map((items) => {
					if (items.value) {
						if (items.value === 1) {
							data = data.filter((item) => item.label != "Electricity");
						}
						if (items.value === 2) {
							data = data.filter((item) => item.label != "Water Supply");
						}
					}
				});
			}

			return data;
		};

		//alert(_.find(district, { value: store.getState().user.activeUser.assign_district_id }).group_name)
		return (
			<ScrollView
				keyboardShouldPersistTaps={"always"}
				contentContainerStyle={styles.container}
			>
				<MaterialQualityModal
					modalVisible={this.state.modalVisible}
					setModalVisible={this.handleMaterialModal}
					handleClick={this.handleQualityClick}
				/>
				<MultiPickerDilapidated
					label={"Property Type*"}
					options={categories}
					value={assessmentPropertyCategory}
					onSelected={this.onChangePropertyCategory}
					max={6}
					//disabled={isCompletedSaved}
				/>

				{/* {_.findIndex(assessmentPropertyCategory, { value: 6 }) !== -1 && (
                    <React.Fragment>
                        <TextInput
                            label={'Compound Name'}
                            onChangeText={this.onCompoundNameChange}
                            value={assessmentCompoundHouseName}
                            //editable={!isCompletedSaved}
                        />

                        <SelectPicker
                            label={'Number of Houses in Compound'}
                            items={this.state.range}
                            onValueChange={this.onTotalCompoundHouseChange}
                            value={assessmentTotalCompoundHouse}
                            //disabled={isCompletedSaved}
                        />
                    </React.Fragment>
                )} */}

				<MultiPicker
					label={"Habitable Floors*"}
					options={types}
					value={assessmentType}
					onSelected={this.onChangeType}
					max={2}
					//disabled={isCompletedSaved}
					assessment
				/>
				{/* <View height={30}>
                    <Checkbox
                        label="Same as above"
                        value={'agree'}
                        checked={true}
                        onCheck={this.onCheck}
                        //disabled={isCompletedSaved}
                    />
                </View>

                <View paddingVertical={6} /> */}
				<MultiPicker
					label={"Total Number of Floors*"}
					options={types}
					value={assessmentTypeTotal}
					onSelected={this.onChangeTypeTotal}
					max={2}
					//disabled={isCompletedSaved}
					assessment
				/>
				<SelectPicker
					label={"Wall Material*"}
					items={wallMaterials}
					onValueChange={this.onChangeMaterialUsedOnWall}
					value={assessmentMaterialUsedOnWall}
					//disabled={isCompletedSaved}
				/>

				<SelectPicker
					label={"Roof Type*"}
					items={roofMaterials}
					onValueChange={this.onChangeMaterialUsedOnRoof}
					value={assessmentMaterialUsedOnRoof}
					//disabled={isCompletedSaved}
				/>
				<SelectPicker
					label={"Window Type*"}
					items={windowType}
					onValueChange={this.onChangeWindowType}
					value={assessmentWindowType}
					//disabled={isCompletedSaved}
				/>

				<Text style={{ color: "#333", marginBottom: 5 }}>
					Property Dimension Calculator
				</Text>

				<View style={styles.row}>
					<View style={styles.col}>
						<TextInput
							label={"Length"}
							onChangeText={this.onChangeLength}
							keyboardType={"numeric"}
							value={assessmentLength ? assessmentLength.toString() : ""}
							length={6}
						/>
					</View>
					<View style={styles.col}>
						<TextInput
							label={"Breadth"}
							onChangeText={this.onChangeBreath}
							keyboardType={"numeric"}
							value={assessmentBreadth ? assessmentBreadth.toString() : ""}
							length={6}
						/>
					</View>
				</View>

				<View style={styles.row}>
					<View style={styles.col}>
						<TextInput
							label={"Total Areas(Dimension in Sq. Meters)"}
							onChangeText={this.onChangeArea}
							keyboardType={"numeric"}
							value={
								assessmentArea
									? this.getTotal(
											assessmentLength,
											assessmentBreadth,
											assessmentArea
									  )
									: ""
							}
							length={15}
						/>
					</View>
					<View style={[styles.linkCol]}>
						<Link
							style={[styles.linkStyle]}
							// disabled={this.props.isCompletedSaved}
							onPress={this.showLocationPicker}
							label={
								<React.Fragment>
									<Icon
										size={20}
										name={"map-marker"}
										style={{ textAlign: "center" }}
									/>
									{"\nMeasure\nDistance"}
								</React.Fragment>
							}
						/>
					</View>
				</View>
				<Text style={styles.calcResult}>
					Dimension in Sq. Meters:{" "}
					<Text style={styles.calcAmount}>
						{this.getTotal(assessmentLength, assessmentBreadth, assessmentArea)}
					</Text>
				</Text>

				<View paddingVertical={10} />

				{/* <SelectPicker
                    label={'Property Dimension*'}
                    items={dimensions}
                    onValueChange={this.onChangePropertyDimension}
                    value={assessmentPropertyDimension}
                    //disabled={isCompletedSaved}
                /> */}

				<MultiPicker
					label={"Value Added Assessment Parameters*"}
					options={valueAdded}
					value={assessmentValueAdded}
					onSelected={this.onChangeValueAdded}
					//disabled={isCompletedSaved}
				/>

				{/* {_.findIndex(assessmentValueAdded, { value: VALUE_ADDED_MAST_ID }) !== -1 && (
                    <SelectPicker
                        label={'Total Communication Masts*'}
                        items={this.state.range}
                        value={assessmentTotalCommunicationMast}
                        onValueChange={this.onChangeTotalCommunicationMast}
                        //disabled={isCompletedSaved}
                    />
                )} */}

				{_.findIndex(assessmentValueAdded, { value: VALUE_SHOP_ID }) !== -1 && (
					<SelectPicker
						label={"Total Shops*"}
						items={this.state.range}
						value={assessmentTotalShop}
						onValueChange={this.onChangeTotalShop}
						//disabled={isCompletedSaved}
					/>
				)}
				{/* <Text></Text>{this.state.valuePer="0"?"Average":this.state.valuePer>0?"Good":"Bad"} */}
				<SelectPicker
					label={"Swimming Pool"}
					items={swimmingPool}
					value={assessmentSwimmingPool}
					onValueChange={this.onChangeSwimmingPool}
					//disabled={isCompletedSaved}
				/>

				<SelectPicker
					label={"Sanitation"}
					items={sanitation}
					value={assessmentSanitation}
					onValueChange={this.onChangeSanitation}
					//disabled={isCompletedSaved}
				/>

				<SelectPicker
					label={"Property Use*"}
					items={propertyUse}
					value={assessmentPropertyUse}
					onValueChange={this.onChangePropertyUse}
					//disabled={isCompletedSaved}
				/>

				<SelectPicker
					label={"Zones*"}
					items={zones}
					value={assessmentPropertyZone}
					onValueChange={this.onChangePropertyZone}
					//disabled={isCompletedSaved}
				/>
				<ActionSheet
					ref={(o) => (this.ActionSheet = o)}
					title={
						<Text style={{ color: "gray", fontSize: 15 }}>
							Please Select the Quality Condition of the Material
						</Text>
					}
					options={[
						<Text style={{ color: "green", fontSize: 15 }}>Good</Text>,
						<Text style={{ color: "orange", fontSize: 15 }}>Average</Text>,
						<Text style={{ color: "red", fontSize: 15 }}>Bad</Text>,
						<Text style={{ color: "gray", fontSize: 16 }}>Close</Text>,
					]}
					cancelButtonIndex={3}
					destructiveButtonIndex={3}
					onPress={(index) => {
						//alert(index+ "--" +this.state.selected)
						var group_name = _.find(district, {
							value: store.getState().user.activeUser.assign_district_id,
						}).group_name;
						//   alert(group_name)
						this.props.setPropertyField("group_name", group_name);
						if (this.state.selected.toString() == "wall") {
							//alert(characteristic_values)
							characteristic_values.map((item) => {
								if (
									item.name.includes("Walls") &&
									item.group_name == group_name
								) {
									if (index == 0) {
										// alert(item.name + "--" +item.good)

										this.setState({
											wallPer: item.good,
										});
										this.props.setPropertyField("wallType", "G");
										this.props.setPropertyField("wallPer", item.good);
									} else if (index == 1) {
										// alert(item.name + "--" +item.average)
										this.setState({
											wallPer: item.average,
										});
										this.props.setPropertyField("wallType", "A");
										this.props.setPropertyField("wallPer", item.average);
									} else if (index == 2) {
										// alert(item.name + "--" +item.bad)
										this.setState({
											wallPer: item.bad,
										});
										this.props.setPropertyField("wallType", "B");
										this.props.setPropertyField("wallPer", item.bad);
									} else {
										this.props.setPropertyField("wallType", "A");
										this.props.setPropertyField("wallPer", item.average);
									}
								}
							});
						} else if (this.state.selected.toString() == "roof") {
							characteristic_values.map((item) => {
								if (
									item.name.includes("Roof") &&
									item.group_name == group_name
								) {
									if (index == 0) {
										//alert(item.name + "--" +item.good)
										this.setState({
											roofPer: item.good,
										});
										this.props.setPropertyField("roofType", "G");
										this.props.setPropertyField("roofPer", item.good);
									} else if (index == 1) {
										//alert(item.name + "--" +item.average)
										this.setState({
											roofPer: item.average,
										});
										this.props.setPropertyField("roofType", "A");
										this.props.setPropertyField("roofPer", item.average);
									} else if (index == 2) {
										// alert(item.name + "--" +item.bad)
										this.setState({
											roofPer: item.bad,
										});
										this.props.setPropertyField("roofType", "B");
										this.props.setPropertyField("roofPer", item.bad);
									} else {
										this.props.setPropertyField("roofType", "A");
										this.props.setPropertyField("roofPer", item.average);
									}
								}
							});
						} else if (this.state.selected.toString() == "window") {
							characteristic_values.map((item) => {
								if (
									item.name.includes("Window") &&
									item.group_name == group_name
								) {
									if (index == 0) {
										// alert(item.name + "--" +item.good)
										this.setState({
											windowPer: item.good,
										});
										this.props.setPropertyField("windowType", "G");
										this.props.setPropertyField("windowPer", item.good);
									} else if (index == 1) {
										// alert(item.name + "--" +item.average)
										this.setState({
											windowPer: item.average,
										});
										this.props.setPropertyField("windowType", "A");
										this.props.setPropertyField("windowPer", item.average);
									} else if (index == 2) {
										// alert(item.name + "--" +item.bad)
										this.setState({
											windowPer: item.bad,
										});
										this.props.setPropertyField("windowType", "B");
										this.props.setPropertyField("windowPer", item.bad);
									} else {
										this.props.setPropertyField("windowType", "A");
										this.props.setPropertyField("windowPer", item.average);
									}
								}
							});
						} else {
							characteristic_values.map((item) => {
								if (
									item.name.includes("Added") &&
									item.group_name == group_name
								) {
									if (index == 0) {
										//alert(item.name + "--" +item.good)
										this.setState({
											valuePer: item.good,
										});
										this.props.setPropertyField("valueType", "G");
										this.props.setPropertyField("valuePer", item.good);
									} else if (index == 1) {
										//alert(item.name + "--" +item.average)
										this.setState({
											valuePer: item.average,
										});
										this.props.setPropertyField("valueType", "A");
										this.props.setPropertyField("valuePer", item.average);
									} else if (index == 2) {
										// alert(item.name + "--" +item.bad)
										this.setState({
											valuePer: item.bad,
										});
										this.props.setPropertyField("valueType", "B");
										this.props.setPropertyField("valuePer", item.bad);
									} else {
										this.props.setPropertyField("valueType", "A");
										this.props.setPropertyField("valuePer", item.average);
									}
								}
							});
						}
					}}
				/>

				<Checkbox
					label={"Gated Community"}
					value={2}
					checked={isGatedCommunity}
					//disabled={isCompletedSaved}
					onCheck={this.onChangeGatedCommunity}
				/>

				<View paddingVertical={10} />

				<View style={styles.gstContainer}>
					<View style={styles.contentLeft}>
						<Text style={styles.mainTitle}>Assessed Value</Text>
					</View>
					<View style={styles.contentRight}>
						<Text style={styles.gstVal}>
							<NumberFormat
								renderText={this.renderMoney}
								value={this.getGrandTotal()}
								displayType={"text"}
								thousandSeparator={true}
								prefix={"Le "}
							/>
						</Text>
					</View>
				</View>

				<View paddingVertical={10} />
				<MultiPickerCouncilAdjustment
					label={"Council Adjustments"}
					options={adjustmentsVal}
					value={assessmentAdjustment}
					valueAdded={assessmentValueAdded}
					onSelected={this.onChangeAdjustment}
					//disabled={isCompletedSaved}
				/>
				<View style={styles.gstContainer}>
					<View style={styles.contentLeft}>
						<Text style={styles.mainTitle}>Net Assessed Value</Text>
					</View>
					<View style={styles.contentRight}>
						<Text style={styles.gstVal}>
							<NumberFormat
								renderText={this.renderMoney}
								value={this.getSubTotal("final")}
								displayType={"text"}
								thousandSeparator={true}
								prefix={"Le "}
							/>
						</Text>
					</View>
				</View>
				{this.state.visibleLocationPicker ? (
					<MapViewPicker
						visible={this.state.visibleLocationPicker}
						onRequestClose={this.hideLocationPicker}
						onSelected={this.handlePickLocation}
					/>
				) : null}
			</ScrollView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		paddingHorizontal: 10,
		paddingTop: 20,
		paddingBottom: 76,
	},
	row: {
		flexDirection: "row",
		marginHorizontal: -6,
	},
	col: {
		paddingHorizontal: 6,
		flex: 1,
	},
	gstContainer: {
		marginBottom: 10,
		backgroundColor: "#f6f6f6",
		borderWidth: 2,
		borderColor: "#f1f1f1",
		paddingVertical: 14,
		paddingHorizontal: 20,
		flexDirection: "row",
		borderRadius: 5,
	},
	gstRow: {
		flexDirection: "row",
		justifyContent: "flex-end",
	},
	gstTitle: {
		fontSize: 15,
		color: "#333",
		marginRight: 10,
		textAlign: "right",
		marginVertical: 4,
	},
	gstVal: {
		color: "#333",
		fontSize: 16,
		marginVertical: 4,
		textAlign: "right",
	},
	mainTitle: {
		fontSize: 16,
		color: Colors.primary,
		fontWeight: "600",
	},
	contentLeft: {
		flex: 1,
		justifyContent: "center",
	},
	contentRight: {
		flex: 1,
	},
	bold: {
		fontWeight: "600",
	},
	calcResult: {
		color: "#333",
		fontSize: 14,
		marginTop: -5,
	},
	calcAmount: {
		color: Colors.primary,
		fontSize: 16,
	},
	linkCol: {
		alignItems: "center",
		justifyContent: "space-around",
		width: 80,
		flexDirection: "row",
	},
});

const mapStateToProps = ({ options, addProperty }) => ({
	options,
	property: addProperty,
});

const mapDispatchToProps = {
	setPropertyField,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(GeneralDetailScreen);
