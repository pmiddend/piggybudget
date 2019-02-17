import React from "react";
import MyAppState from "../AppState";
import { ImportData } from "../ImportData";
import { connect } from "react-redux";
import { Component } from "react";
import { darkBackground, lightBackground } from "../Colors";
import {
	View,
	AppState,
	AppStateStatus,
	DeviceEventEmitter,
} from "react-native";
import { Currency, currencies } from "../Currencies";
import {
	Text,
	Icon,
	Button,
	Overlay,
} from "react-native-elements";
import {
	storeTotalBudget,
	storeTodaysExpenses,
	TransactionList,
} from "../BudgetStore";
import {
	actionStateChange,
	actionDoImport,
	actionRemoveImportError,
	actionRemoveImportSuccess,
	actionImportFailed,
	actionImportSuccess,
	actionClear,
} from "../Actions";

interface Props {
	readonly navigation: any;
	readonly transactions: TransactionList;
	readonly importError?: string;
	readonly importSuccess?: any;
	readonly currency: Currency;
	readonly onStateChange: (newState: AppStateStatus) => void;
	readonly onClear: () => void;
	readonly onImportFailed: (error: string) => void;
	readonly onDoImport: (result: ImportData[]) => void;
	readonly onImportSuccess: (result: ImportData[]) => void;
	readonly onRemoveImportError: () => void;
	readonly onRemoveImportSuccess: () => void;
}

class Home extends Component<Props> {
	constructor(props: Props) {
		super(props);
		this.handleAppStateChange = this.handleAppStateChange.bind(this);
		this.closeImportErrorModal = this.closeImportErrorModal.bind(this);
		this.closeImportSuccessModal = this.closeImportSuccessModal.bind(this);
		this.doImport = this.doImport.bind(this);
	}

	public componentWillMount() {
		DeviceEventEmitter.addListener("piggyImportFailed", (e) => {
			console.log("import failed " + e);
			this.props.onImportFailed(e);
		});
		DeviceEventEmitter.addListener("piggyCsvImportSuccess", (result) => {
			console.log("import success");
			this.props.onImportSuccess(result);
		});
	}

	public componentDidMount() {
		this.props.onStateChange("background");
		AppState.addEventListener("change", this.handleAppStateChange);
	}

	public componentWillUnmount() {
		AppState.removeEventListener("change", this.handleAppStateChange);
	}

	public render() {
		const iconSize = 40;
		const todaysTotal = storeTodaysExpenses(this.props.transactions);
		const addColor = "#89c440";
		const removeColor = "#ff5606";
		const todaysTotalColor = todaysTotal.isPositive() ? addColor : removeColor;
		const total = storeTotalBudget(this.props.transactions);
		const totalColor = total.isPositive() ? addColor : removeColor;
		return (
			<View style={{ flex: 1 }}>
				<Overlay isVisible={this.props.importError !== undefined}
					onRequestClose={this.closeImportErrorModal}
					width={300}
					height={90}
					onBackdropPress={this.closeImportErrorModal}>
					<View style={{ flex: 1, justifyContent: "space-evenly" }}>
						<Text style={{ fontSize: 16 }}>Import failed</Text>
						<Text style={{ fontSize: 14, fontWeight: "bold" }}>{this.props.importError}</Text>
					</View>
				</Overlay>
				<Overlay isVisible={this.props.importSuccess !== undefined}
					onRequestClose={this.closeImportSuccessModal}
					width={300}
					height={90}
					onBackdropPress={this.closeImportSuccessModal}>
					<View style={{ flex: 1, justifyContent: "space-evenly" }}>
						<Text style={{ fontSize: 16 }}>Really overwrite all data?</Text>
						<View style={{ flex: 1, flexDirection: "row", justifyContent: "space-evenly" }}>
							<View style={{ width: "50%" }} />
							<Button title="CANCEL" type="clear" onPress={this.closeImportSuccessModal} />
							<Button title="OVERWRITE" type="clear" onPress={this.doImport} />
						</View>
					</View>
				</Overlay>
				<View style={{
					alignItems: "center",
					flex: 1,
					justifyContent: "space-evenly",
				}}>
					<View style={{
						alignItems: "center",
						backgroundColor: darkBackground,
						flex: 1,
						justifyContent: "space-evenly",
						width: "100%",
					}}>
						<View style={{ alignItems: "center" }}>
							<Text h3>Total Budget</Text>
							<Text h1 style={{ fontWeight: "bold", color: totalColor }}>{total.toString()}
								{this.props.currency.symbol}
							</Text>
						</View>
					</View>
					<View style={{ flex: 1, width: "100%", alignItems: "center" }}>
						<View style={{
							alignItems: "center",
							flex: 1,
							flexDirection: "row",
							justifyContent: "space-evenly",
							width: "100%",
						}}>
							<View style={{ alignItems: "center" }}>
								<Icon raised size={iconSize} color={addColor} reverse
									name="plus" type="entypo" onPress={() => this.props.navigation.navigate("Add", {
										isExpense: false,
									})} />
								<Text>Add income</Text>
							</View>
							<View style={{ alignItems: "center" }}>
								<Icon raised size={iconSize} color={removeColor} reverse
									name="minus" type="entypo" onPress={() => this.props.navigation.navigate("Add", {
										isExpense: true,
									})} />
								<Text>Add expense</Text>
							</View>
						</View>
					</View>
					<View style={{
						alignItems: "center",
						backgroundColor: lightBackground,
						flex: 1,
						justifyContent: "space-evenly",
						width: "100%",
					}}>
						<View style={{ alignItems: "center" }}>
							<Text h4>Today’s Total</Text>
							<Text h3 style={{ color: todaysTotalColor }}>
								{todaysTotal.toString()}{this.props.currency.symbol}
							</Text>
						</View>
					</View>
				</View>
			</View >
		);
	}

	private closeImportErrorModal() {
		this.props.onRemoveImportError();
	}

	private closeImportSuccessModal() {
		this.props.onRemoveImportSuccess();
	}

	private doImport() {
		this.props.onDoImport(this.props.importSuccess);
	}

	private handleAppStateChange(newState: AppStateStatus) {
		this.props.onStateChange(newState);
	}
}

const mapStateToProps = (state: MyAppState, ownProps: any) => {
	return {
		currency: currencies.get(state.settings.currency) as Currency,
		importError: state.importError,
		importSuccess: state.importSuccess,
		navigation: ownProps.navigation,
		transactions: state.transactions,
	};
};
const mapDispatchToProps = (dispatch: any) => {
	return {
		onClear: () => dispatch(actionClear()),
		onDoImport: (r: any) => dispatch(actionDoImport(r)),
		onImportFailed: (error: string) => dispatch(actionImportFailed(error)),
		onImportSuccess: (r: any) => dispatch(actionImportSuccess(r)),
		onRemoveImportError: () => dispatch(actionRemoveImportError()),
		onRemoveImportSuccess: () => dispatch(actionRemoveImportSuccess()),
		onStateChange: (newState: AppStateStatus) => dispatch(actionStateChange(newState)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
