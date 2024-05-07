/** @format */

import React, { PureComponent } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { connect } from "react-redux";
import { Checkbox } from "react-native-material-ui";
import { setPropertyField } from "../../../redux/actions/PropertyActions";
import { SelectPicker, TextInput } from "../../../Components/Input";
import Address from "../../../Components/Address";
import ImagePicker from "../../../Components/ImagePicker";
import AutoCompleteInput from "../../../Components/AutoCompleteInput";
import MultiPicker from "../../../Components/MultiPicker";
import openLocationCode from "../../../api/openlocationcode";
import LocationPicker from "../../../Components/LocationPicker";
import { Link } from "../../../Components/Link";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Button } from "../../../Components/Button";
import { inAccessableProperty } from "../../../api/PropertyApi";
import axios from "axios";

class Location extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,
			visibleLocationPicker: false,
			lat: "",
			lng: "",
		};
	}

	handlePickLocation = (region) => {
		//    alert(JSON.stringify(region))

		this.props.onChange({
			lat: region.latitude.toString(),
			lng: region.longitude.toString(),
		});
		this.setState({
			lat: region.latitude.toString(),
			lng: region.longitude.toString(),
		});

		this.setState({ visibleLocationPicker: false });
	};

	hideLocationPicker = () => this.setState({ visibleLocationPicker: false });

	showLocationPicker = () => this.setState({ visibleLocationPicker: true });

	render() {
		// alert(this.props.value)
		//const {lat, lng} = this.props.value;

		return (
			<View>
				<View style={styles.row}>
					<LocationPicker
						visible={this.state.visibleLocationPicker}
						onRequestClose={this.hideLocationPicker}
						onSelected={this.handlePickLocation}
					/>

					<View style={styles.col}>
						<TextInput
							editable={false}
							value={this.state.lat ? this.state.lat : ""}
							style={{ fontSize: 14, fontFamily: "georgia" }}
						/>
					</View>
					<View style={styles.col}>
						<TextInput
							editable={false}
							value={this.state.lat ? this.state.lng : ""}
							style={{ fontSize: 14, fontFamily: "georgia" }}
						/>
					</View>
					<View style={[styles.linkCol]}>
						{this.state.loading ? (
							<ActivityIndicator color={Colors.primary} />
						) : (
							<Link
								style={[styles.linkStyle]}
								// disabled={this.props.isCompletedSaved}
								onPress={this.showLocationPicker}
								label={
									<React.Fragment>
										<Icon size={20} name={"map-marker"} />
										{this.props.required && "*"}
									</React.Fragment>
								}
							/>
						)}
					</View>
				</View>
			</View>
		);
	}
}

class LandlordScreen extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			genderOptions: [
				{
					label: "Male",
					value: "m",
				},
				{
					label: "Female",
					value: "f",
				},
			],
			idTypes: require("../../../data/idTypes"),
			organizationTypes: require("./../../../data/organizationTypes"),
			inaccessableImage: "",
			lat: "",
			lng: "",
			pending: false,
			progress: 0,
			failed: false,
			propertyInaccessible: "",
		};
		this.cancelRequest = null;
	}

	onChangeIsOrganization = (checked) =>
		this.props.setPropertyField("isOrganization", checked);
	onChangeFirstName = (text) =>
		this.props.setPropertyField("ownerFirstName", text);
	onChangeMiddleName = (text) =>
		this.props.setPropertyField("ownerMiddleName", text);
	onChangeSurnameName = (text) =>
		this.props.setPropertyField("ownerSurname", text);
	onChangeSex = (text) => this.props.setPropertyField("ownerSex", text);
	onChangeTitle = (text) => this.props.setPropertyField("ownerTitle", text);
	onChangeStreetNumbernew = (text) => {
		this.props.setPropertyField("ownerStreetNumbernew", text);
		//alert(text)
	};

	onChangeNINNumber = (text) => this.props.setPropertyField("ninNumber", text);
	onChangeStreetNumber = (text) =>
		this.props.setPropertyField("ownerStreetNumber", text);
	onChangeEmail = (text) => this.props.setPropertyField("ownerEmail", text);
	onChangeStreetName = (text) =>
		this.props.setPropertyField("ownerStreetName", text);
	onChangeWardNumber = (text) =>
		this.props.setPropertyField("ownerWardNumber", text);
	onChangeConstituency = (text) =>
		this.props.setPropertyField("ownerConstituency", text);
	onChangeSection = (text) => this.props.setPropertyField("ownerSection", text);
	onChangeChiefdom = (text) =>
		this.props.setPropertyField("ownerChiefdom", text);
	onChangeDistrict = (text) =>
		this.props.setPropertyField("ownerDistrict", text);
	onChangeProvince = (text) =>
		this.props.setPropertyField("ownerProvince", text);
	onChangePostcode = (text) =>
		this.props.setPropertyField("ownerPostcode", text);
	onChangeMobile1 = (text) =>
		this.props.setPropertyField(
			"ownerMobile1",
			text.replace(/[- #*;,.N()<>\{\}\[\]\\\/]/gi, "")
		);
	onChangeMobile2 = (text) =>
		this.props.setPropertyField(
			"ownerMobile2",
			text.replace(/[- #*;,.N()<>\{\}\[\]\\\/]/gi, "")
		);
	onChangeTINNumber = (text) => this.props.setPropertyField("tinNumber", text);
	onChangeIDType = (text) => this.props.setPropertyField("ownerIdType", text);
	onChangeOtherIdType = (text) =>
		this.props.setPropertyField("ownerOtherIdType", text);
	onChangeIDNumber = (text) =>
		this.props.setPropertyField("ownerIdNumber", text);
	onChangeIdPhoto = (photo) =>
		this.props.setPropertyField("ownerIdPhoto", photo.path);
	onChangeOrganizationName = (text) =>
		this.props.setPropertyField("organizationName", text);
	onChangeOrganizationType = (text) =>
		this.props.setPropertyField("organizationType", text);
	onChangeOtherOrganizationType = (text) =>
		this.props.setPropertyField("otherOrganizationType", text);
	onChangeOrganizationAddress = (text) =>
		this.props.setPropertyField("organizationAddress", text);
	onChangeIsPropertyInaccessible = (checked) =>
		this.props.setPropertyField("isPropertyInaccessible", checked);
	onChangePropertyInaccessible = (items) => {
		this.props.setPropertyField("propertyInaccessible", items);
		this.setState({
			propertyInaccessible: items,
		});
	};
	handleTakeFirstPhoto = (image) => {
		this.setState({
			inaccessableImage: image.path,
		});
	};
	onChangePlotTagging1 = (value) => {
		this.setState({
			lat: value.lat.toString(),
			lng: value.lng.toString(),
		});
	};
	inaccessableUpload = async () => {
		if (
			this.props.property.propertyInaccessible &&
			this.state.lat &&
			this.state.inaccessableImage
		) {
			this.setState({ pending: true, progress: 0 });
			let data = {
				path: this.state.inaccessableImage,
				id: this.props.property.propertyInaccessible,
				lat: this.state.lat,
				lng: this.state.lng,
				name: this.props.property.firstNames,
				enumerator: this.props.user.name,
			};

			try {
				await inAccessableProperty(
					data,
					this.onProgress,
					(cancelRequest) => (this.cancelRequest = cancelRequest)
				);

				// await this.props.loadSyncProperties();
				// await this.props.loadPropertiesInList(1);

				this.setState({ pending: false, failed: false }, () => {
					Alert.alert(
						"Upload Completed",
						"Inaccessable property record updated successfully.",
						[
							{
								text: "OK",
								onPress: () => this.props.navigation.navigate("properties"),
							},
						],
						{ cancelable: false }
					);
				});
			} catch (error) {
				if (!axios.isCancel(error)) {
					this.setState({ failed: false, pending: false });
				} else {
					this.setState({ failed: true, pending: false });
				}
			}
		} else {
			Alert.alert("Warning !!", "All Fields are mandatory.", [{ text: "OK" }], {
				cancelable: false,
			});
		}
	};

	onChangeUnfinsedProperty = (checked) =>
		this.props.setPropertyField("isUnfinsedProperty", checked);
	onChangeDilapidatedProperty = (checked) =>
		this.props.setPropertyField("isDilapidatedProperty", checked);

	render() {
		const {
			ownerFirstName,
			ownerMiddleName,
			ownerSurname,
			ownerSex,
			ownerTitle,
			ninNumber,
			ownerStreetNumber,
			ownerStreetNumbernew,
			ownerEmail,
			ownerStreetName,
			ownerWardNumber,
			ownerConstituency,
			ownerSection,
			ownerChiefdom,
			ownerDistrict,
			ownerProvince,
			ownerPostcode,
			ownerMobile1,
			ownerMobile2,
			isCompletedSaved,
			isOrganization,
			tinNumber,
			ownerIdType,
			ownerOtherIdType,
			ownerIdNumber,
			ownerIdPhoto,
			isPropertyInaccessible,
			propertyInaccessible,
			organizationName,
			organizationType,
			otherOrganizationType,
			organizationAddress,
			plotTaggingLocation1,
			inAccessablePropertyPhoto,
			isUnfinsedProperty,
			isDilapidatedProperty,
		} = this.props.property;

		const { firstNames, lastNames, streetNames } = this.props.app;
		const { title } = this.props.options;
		const plot = { lat: "", lng: "" };
		return (
			<ScrollView
				keyboardShouldPersistTaps={"always"}
				contentContainerStyle={styles.container}
			>
				<View
					style={{
						marginBottom: 10,
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "space-between",
					}}
				>
					<Checkbox
						label="Inaccessible Property"
						value={1}
						checked={isPropertyInaccessible}
						onCheck={this.onChangeIsPropertyInaccessible}
						//disabled={isCompletedSaved}
					/>
					<Checkbox
						label="Unfinished Property"
						value={1}
						checked={isUnfinsedProperty}
						onCheck={this.onChangeUnfinsedProperty}
						//disabled={isCompletedSaved}
					/>
				</View>

				{isPropertyInaccessible && (
					<View style={{ padding: 10 }}>
						<MultiPicker
							label={"Property Inaccessible*"}
							options={this.props.options.propertyInaccessibleOptions}
							onSelected={this.onChangePropertyInaccessible}
							//disabled={isCompletedSaved}
							value={propertyInaccessible}
						/>
						<Location
							value={plot}
							onChange={this.onChangePlotTagging1}
							required
							//isCompletedSaved={isCompletedSaved}
						/>

						<View style={styles.row}>
							<View style={styles.col}>
								<ImagePicker
									onImageSelected={this.handleTakeFirstPhoto}
									defaultImage={this.state.inaccessableImage}
									//disabled={isCompletedSaved}
									text={"Property Image"}
								/>
							</View>
							<View style={styles.col}>
								{/* <ImagePicker
                            onImageSelected={this.handleTakeSecondPhoto}
                           // defaultImage={assessmentPropertyPhoto2}
                            //disabled={isCompletedSaved}
                            text={'Property Image 2'}
                        /> */}
							</View>
						</View>
						<View paddingVertical={10} />
						<Button
							onPress={this.inaccessableUpload}
							loading={this.state.pending}
							label="Save"
						/>
					</View>
				)}

				<View
					style={{
						marginBottom: 10,
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "space-between",
					}}
				>
					<Checkbox
						label="Organization Property"
						value={"agree"}
						checked={isOrganization}
						onCheck={this.onChangeIsOrganization}
						//disabled={isCompletedSaved}
					/>
					<Checkbox
						label="Dilapidated Property"
						value={1}
						checked={isDilapidatedProperty}
						onCheck={this.onChangeDilapidatedProperty}
						//disabled={isCompletedSaved}
					/>
				</View>
				{!isOrganization && (
					<View style={styles.row}>
						<View style={styles.col}>
							<SelectPicker
								label={"Title*"}
								items={title}
								value={ownerTitle}
								onValueChange={this.onChangeTitle}
								//disabled={isCompletedSaved}
							/>
						</View>
						<View style={styles.col}>
							<AutoCompleteInput
								label={"First Name*"}
								items={firstNames}
								maxLength={200}
								value={ownerFirstName}
								onChangeText={this.onChangeFirstName}
								autoCapitalize={"words"}
								//editable={!isCompletedSaved}
							/>
						</View>
					</View>
				)}
				{!isOrganization && (
					<View style={styles.row}>
						<View style={styles.col}>
							<AutoCompleteInput
								label={"Middle"}
								items={firstNames}
								maxLength={200}
								value={ownerMiddleName}
								onChangeText={this.onChangeMiddleName}
								autoCapitalize={"words"}
								//editable={!isCompletedSaved}
							/>
						</View>

						<View style={styles.col}>
							<AutoCompleteInput
								label={"Surname*"}
								items={lastNames}
								maxLength={200}
								value={ownerSurname}
								onChangeText={this.onChangeSurnameName}
								autoCapitalize={"words"}
								//editable={!isCompletedSaved}
							/>
						</View>
					</View>
				)}

				{!isOrganization && (
					<SelectPicker
						label={"Sex*"}
						items={this.state.genderOptions}
						value={ownerSex}
						onValueChange={this.onChangeSex}
						//disabled={isCompletedSaved}
					/>
				)}

				{isOrganization && (
					<React.Fragment>
						<TextInput
							label={"Organization Name"}
							value={organizationName}
							maxLength={200}
							onChangeText={this.onChangeOrganizationName}
							autoCapitalize={"words"}
							//editable={!isCompletedSaved}
						/>

						<SelectPicker
							label={"Organization Type*"}
							items={this.state.organizationTypes}
							value={organizationType}
							onValueChange={this.onChangeOrganizationType}
							//disabled={isCompletedSaved}
						/>

						{organizationType === "Other" && (
							<TextInput
								label={"Enter Organization Type"}
								value={otherOrganizationType}
								maxLength={200}
								onChangeText={this.onChangeOtherOrganizationType}
								//editable={!isCompletedSaved}
							/>
						)}

						{/* <TextInput
                            label={'Organization Address*'}
                            value={organizationAddress}
                            maxLength={200}
                            onChangeText={this.onChangeOrganizationAddress}
                            //editable={!isCompletedSaved}
                        /> */}
					</React.Fragment>
				)}

				{/*<TextInput*/}
				{/*    label={'Tax Identification Number'}*/}
				{/*    value={tinNumber}*/}
				{/*    maxLength={200}*/}
				{/*    onChangeText={this.onChangeTINNumber}*/}
				{/*    //editable={!isCompletedSaved}*/}
				{/*/>*/}

				{/*{!isOrganization && (*/}
				{/*    <React.Fragment>*/}
				{/*        <SelectPicker*/}
				{/*            label={'ID Type'}*/}
				{/*            items={this.state.idTypes}*/}
				{/*            value={ownerIdType}*/}
				{/*            onValueChange={this.onChangeIDType}*/}
				{/*            //disabled={isCompletedSaved}*/}
				{/*        />*/}

				{/*        {ownerIdType === 'Other' && (*/}
				{/*            <TextInput*/}
				{/*                label={'Enter ID Type'}*/}
				{/*                value={ownerOtherIdType}*/}
				{/*                maxLength={200}*/}
				{/*                onChangeText={this.onChangeOtherIdType}*/}
				{/*               // editable={!isCompletedSaved}*/}
				{/*            />*/}
				{/*        )}*/}

				{/*        <TextInput*/}
				{/*            label={'ID Number'}*/}
				{/*            value={ownerIdNumber}*/}
				{/*            maxLength={200}*/}
				{/*            onChangeText={this.onChangeIDNumber}*/}
				{/*            //editable={!isCompletedSaved}*/}
				{/*        />*/}

				{/*        <View style={{width: 150, marginBottom: 15}}>*/}
				{/*            <ImagePicker*/}
				{/*                text={'ID Photo'}*/}
				{/*                onImageSelected={this.onChangeIdPhoto}*/}
				{/*                defaultImage={ownerIdPhoto}*/}
				{/*            />*/}
				{/*        </View>*/}
				{/*    </React.Fragment>*/}
				{/*)}*/}

				<TextInput
					label={"National Identification Number (NIN)"}
					value={ninNumber}
					maxLength={200}
					onChangeText={this.onChangeNINNumber}
					//editable={!isCompletedSaved}
				/>

				<TextInput
					label={"Street Number"}
					value={ownerStreetNumber}
					maxLength={200}
					onChangeText={this.onChangeStreetNumber}
					//editable={!isCompletedSaved}
				/>
				{/* <View style={styles.row}>
                       

                 
                <View style={styles.col}>

                  
</View>
<View style={styles.col}>
                <TextInput
                    label={'New Street Number'}
                    value={0}
                    maxLength={200}
                    onChangeText={this.onChangeStreetNumbernew}
                    //editable={!isCompletedSaved}
                />
                </View>
</View> */}
				<AutoCompleteInput
					label={"Street Name"}
					items={streetNames}
					maxLength={200}
					value={ownerStreetName}
					onChangeText={this.onChangeStreetName}
					autoCapitalize={"words"}
					//editable={!isCompletedSaved}
				/>

				<Address
					wardNumber={ownerWardNumber}
					constituency={ownerConstituency}
					section={ownerSection}
					chiefdom={ownerChiefdom}
					district={ownerDistrict}
					province={ownerProvince}
					postcode={ownerPostcode}
					onChangeWardNumber={this.onChangeWardNumber}
					onChangeConstituency={this.onChangeConstituency}
					onChangeSection={this.onChangeSection}
					onChangeChiefdom={this.onChangeChiefdom}
					onChangeDistrict={this.onChangeDistrict}
					onChangeProvince={this.onChangeProvince}
					onChangePostcode={this.onChangePostcode}
					//editable={!isCompletedSaved}
				/>
				<TextInput
					label={"Email Id"}
					value={ownerEmail}
					maxLength={200}
					onChangeText={this.onChangeEmail}
					//editable={!isCompletedSaved}
				/>
				<TextInput
					label={"Mobile #1*"}
					value={ownerMobile1}
					keyboardType={"phone-pad"}
					maxLength={15}
					onChangeText={this.onChangeMobile1}
					//editable={!isCompletedSaved}
				/>

				<TextInput
					label={"Mobile #2"}
					value={ownerMobile2}
					keyboardType={"phone-pad"}
					maxLength={15}
					onChangeText={this.onChangeMobile2}
					//editable={!isCompletedSaved}
				/>
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
	linkCol: {
		alignItems: "center",
		justifyContent: "space-around",
		paddingBottom: 15,

		flexDirection: "row",
	},
});

const mapStateToProps = ({ addProperty, app, options, value, user }) => ({
	property: addProperty,
	app,
	options,
	value,
	user: user.activeUser,
});

const mapDispatchToProps = {
	setPropertyField,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(LandlordScreen);
