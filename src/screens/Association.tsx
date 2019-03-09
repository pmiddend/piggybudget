import React from "react";
import { PureComponent } from "react";
import { headerTintColor, headerBackgroundColor } from "../Colors";
import {
	View,
	FlatList,
	ListRenderItemInfo,
} from "react-native";
import {
	ListItem,
	Icon,
	SearchBar,
} from "react-native-elements";
import { connect } from "react-redux";
import AppState from "../AppState";
import { IconDescription } from "../IconDescription";
import { CategoryData } from "../CategoryData";
import { Category, findCategory } from "../Categories";
import { actionChangeAssociation } from "../Actions";
import { materialIcons } from "../Icons";

interface Props {
	readonly navigation: any;
	readonly originalName: string;
	readonly onIconSelect: (originalName: string, newAssociation: CategoryData) => void;
}

interface State {
	readonly searchString: string;
}

const AssociationItem = ({ listItem, onPress }) => (
	<ListItem
		key={listItem.item}
		leftIcon={<Icon name={listItem.item} type="material-community" />}
		title={listItem.item}
		bottomDivider={true}
		onPress={() => onPress(listItem.item)}
	/>
);

class Association extends PureComponent<Props, State> {
	public static navigationOptions = () => {
		return {
			headerStyle: {
				backgroundColor: headerBackgroundColor,
			},
			headerTintColor,
			headerTitleStyle: {
				fontWeight: "bold",
			},
			title: "Change category",
		};
	}

	constructor(props: Props) {
		super(props);
		this.renderItem = this.renderItem.bind(this);
		this.onIconSelectPressed = this.onIconSelectPressed.bind(this);
		this.state = {
			searchString: "",
		};
		this.handleSearchTextChange = this.handleSearchTextChange.bind(this);
	}

	public render() {
		const pressed = (newIcon: string) => this.onIconSelectPressed({ name: newIcon, type: "material-community" });
		return (
			<View style={{ padding: 10 }}>
				<SearchBar value={this.state.searchString}
					placeholder="Search"
					lightTheme={true}
					platform="android"
					onChangeText={this.handleSearchTextChange} />
				<FlatList
					data={materialIcons.filter((i: string) => i.toLowerCase().indexOf(this.state.searchString.toLowerCase()) !== -1)}
					renderItem={(i) => <AssociationItem listItem={i} onPress={pressed} />}
					keyExtractor={(item: string) => item} />
			</View>
		);
	}
	private handleSearchTextChange(text: string) {
		this.setState({
			searchString: text,
		});
	}

	private onIconSelectPressed(newIcon: IconDescription) {
		const originalColor = (findCategory(this.props.originalName) as Category).data.color;
		this.props.onIconSelect(this.props.originalName, { icon: newIcon, color: originalColor });
		this.props.navigation.goBack();
	}
	private renderItem(listItem: ListRenderItemInfo<string>, onPress: (i: string) => void) {
		const i: string = listItem.item;
		return (<ListItem
			key={i}
			leftIcon={<Icon name={i} type="material-community" />}
			title={i}
			bottomDivider={true}
			onPress={() => onPress(i)}
		/>);
	}
}

const mapStateToProps = (state: AppState, ownProps: any) => {
	return {
		navigation: ownProps.navigation,
		originalName: ownProps.navigation.state.params.originalName,
	};
};

const mapDispatchToProps = (dispatch: any) => {
	return {
		onIconSelect: (name: string, newAssociation: CategoryData) => dispatch(
			actionChangeAssociation(name, newAssociation)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Association);
