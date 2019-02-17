import React from "react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import {
	createStackNavigator,
	createAppContainer,
	createMaterialTopTabNavigator,
} from "react-navigation";
import Home from "./screens/Home";
import { headerBackgroundColor, headerTintColor } from "./Colors";
import { actionDoExport } from "./Actions";
import {
	MenuOptions,
	MenuOption,
	MenuTrigger,
	Menu,
} from "react-native-popup-menu";
import Add from "./screens/Add";
import Stats from "./screens/Stats";
import Settings from "./screens/Settings";
import History from "./screens/History";
import appReducer from "./Reducer";
import {
	Icon,
	Text,
} from "react-native-elements";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import immutableTransform from "redux-persist-transform-immutable";
import { MenuProvider } from "react-native-popup-menu";
import {
	YellowBox,
	View
} from "react-native";
YellowBox.ignoreWarnings(["Warning: isMounted(...) is deprecated"]);

const TopTabNavigator = createMaterialTopTabNavigator({
	Home: { screen: Home },
	History: { screen: History },
	Stats: { screen: Stats },
	Settings: { screen: Settings },
},
	{
		tabBarOptions: {
			style: {
				backgroundColor: headerBackgroundColor,
			},
			indicatorStyle: {
				backgroundColor: "white"
			},
		},
	});

const persistConfig = {
	key: "v11",
	storage,
	transforms: [immutableTransform()],
};

const persistedReducer = persistReducer(persistConfig, appReducer);
const store = createStore(persistedReducer);
const persistor = persistStore(store);

const PiggyBudgetRoot = createStackNavigator({
	TopTabs: {
		screen: TopTabNavigator,
		navigationOptions: {
			headerRight: (
				<Menu><MenuTrigger>
					<Icon name="more-vert" color="white" iconStyle={{ paddingRight: 10 }} />
				</MenuTrigger>
					<MenuOptions>
						<MenuOption onSelect={() => store.dispatch(actionDoExport())}>
							<View style={{ flex: 1, flexDirection: "row" }}>
								<Text>Share CSV</Text>
							</View>
						</MenuOption>
					</MenuOptions>
				</Menu>
			),
			headerStyle: {
				backgroundColor: headerBackgroundColor,
			},
			headerTitleStyle: {
				fontWeight: 'bold',
			},
			headerTintColor,
			title: "piggybudget",
		},
	},
	Add: { screen: Add },
	Modify: { screen: Add },
});

const PiggyBudgetAppContainer = createAppContainer(PiggyBudgetRoot);

export default () => (
	<MenuProvider skipInstanceCheck={true}>
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<PiggyBudgetAppContainer />
			</PersistGate>
		</Provider>
	</MenuProvider>
);
