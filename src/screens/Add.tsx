import React from "react";
import { Component } from "react";
import {
	StyleSheet,
	View,
	TextInput,
} from "react-native";
import { List, Range } from "immutable";
import {
	Text,
	Icon,
	FormLabel,
} from "react-native-elements";
import {
	NavigationScreenProps,
} from "react-navigation";
import { Decimal } from "decimal.js";
import { connect } from "react-redux";
import Transaction from "../Transaction";
import { actionAddTransaction } from "../Actions";
import AppState from "../AppState";
import { findCategory, categories, Category } from "../Categories";

interface State {
	amount: string;
	commentName: string;
}

interface Props {
	readonly onNewTransaction: (t: Transaction) => void;
	readonly amountModifier: (d: Decimal) => Decimal;
	readonly navigation: any;
}

function groupRows<T>(list: List<T>, groupSize: number): List<List<T>> {
	return Range(0, Math.ceil(list.size / groupSize))
		.map((idx) => list.slice(idx * groupSize, Math.min(list.size, (idx + 1) * groupSize)))
		.toList();
}

class Add extends Component<Props> {
	public static navigationOptions = ({ navigation }) => {
		const { params } = navigation.state;

		const submitIcon = (<View style={{ paddingRight: 15 }}><Icon
			name="check-square"
			type="feather"
			onPress={() => { params.handlePress() }} /></View>);

		return {
			tabBarIcon: <Icon name="check" type="entypo" />,
			title: "Modify",
			headerRight: submitIcon,
		}
	};

	public state: State;

	constructor(props: Props) {
		super(props);
		this.state = {
			amount: "0",
			commentName: "OTHER",
		};
		this.handleCommentChange = this.handleCommentChange.bind(this);
		this.renderButtonRow = this.renderButtonRow.bind(this);
		this.handlePress = this.handlePress.bind(this);
	}


	public componentDidMount() {
		this.props.navigation.setParams({ handlePress: this.handlePress });
	}

	public render() {
		const nonAutomatic = categories.filter((c) => c.name !== "AUTOMATIC");
		const buttonRows = groupRows(nonAutomatic, 4).map(this.renderButtonRow).toArray();
		return (
			<View style={styles.container}>
				<FormLabel>Category</FormLabel>
				{buttonRows}
				<FormLabel>Amount</FormLabel>
				<TextInput value={this.state.amount.toString()}
					keyboardType="numeric"
					autoFocus={true}
					style={{ fontSize: 40 }}
					onChangeText={(text) => this.handleAmountChange(text)} />
			</View>
		);
	}

	private buttonBackgroundColor(name: string): string {
		if (name === this.state.commentName) {
			return "#666666";
		} else {
			return "#eeeeee";
		}
	}

	private buttonIconColor(name: string): string {
		if (name === this.state.commentName) {
			return "#eeeeee";
		} else {
			return "#666666";
		}
	}

	private renderButtonRow(buttonRow: List<Category>, key: number) {
		return (<View key={key} style={{ flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>{buttonRow.map((c) =>
			(<Icon
				key={c.name}
				reverse
				size={24}
				onPress={() => this.handleCommentChange(c.name)}
				color={this.buttonBackgroundColor(c.name)}
				reverseColor={this.buttonIconColor(c.name)}
				name={c.icon}
				type={c.iconType} />))
			.toArray()}</View>);
	}

	private handlePress() {
		const realAmount = this.state.amount.replace(/,/g, ".");
		this.props.onNewTransaction({
			amount: this.props.amountModifier(new Decimal(realAmount)),
			comment: (findCategory(this.state.commentName) as Category).name,
			date: Date.now(),
		});
		this.props.navigation.goBack();
	}

	private handleAmountChange(text: string) {
		const newText = text !== "0" && text[0] === "0" ? text.slice(1) : text;
		this.setState({
			...this.state,
			amount: newText,
		});
	}

	private handleCommentChange(commentName: string) {
		this.setState({
			...this.state,
			commentName,
		});
	}
}

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		backgroundColor: "#F5FCFF",
		flex: 1,
		justifyContent: "center",
	},
});

const mapStateToProps = (state: AppState, ownProps: any) => {
	return {
		amountModifier: ownProps.navigation.state.params.amountModifier,
		navigation: ownProps.navigation,
	};
};

const mapDispatchToProps = (dispatch: any) => {
	return {
		onNewTransaction: (t: Transaction) => dispatch(actionAddTransaction(t)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Add);
