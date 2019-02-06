import React from "react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import {
	createStackNavigator,
	createBottomTabNavigator,
	createAppContainer,
} from "react-navigation";
import Home from "./screens/Home";
import Add from "./screens/Add";
import Stats from "./screens/Stats";
import Settings from "./screens/Settings";
import History from "./screens/History";
import appReducer from "./Reducer";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import immutableTransform from "redux-persist-transform-immutable";
import { MenuProvider } from "react-native-popup-menu";
import {
	Icon,
} from "react-native-elements";
import { YellowBox } from "react-native";
YellowBox.ignoreWarnings(["Warning: isMounted(...) is deprecated"]);

const HomeStack = createStackNavigator({
	Add: { screen: Add },
	Home: { screen: Home },
},
	{
		initialRouteName: "Home",
		navigationOptions: {
			tabBarIcon: <Icon name="home" type="entypo" />,
			title: "Home",
		},
	});

const HistoryStack = createStackNavigator({
	History: { screen: History },
	Modify: { screen: Add },
}, {
		navigationOptions: {
			tabBarIcon: <Icon name="history" type="font-awesome" />,
			title: "History",
		},
	});

const SettingsStack = createStackNavigator({
	Settings: { screen: Settings },
}, {
		navigationOptions: {
			tabBarIcon: <Icon name="md-settings" type="ionicon" />,
			title: "Settings",
		},
	});

const StatsStack = createStackNavigator({
	Stats: { screen: Stats },
}, {
		navigationOptions: {
			tabBarIcon: <Icon name="chart-bar" type="material-community" />,
			title: "Stats",
		},
	});

const PiggyBudgetRoot = createBottomTabNavigator({
	Home: { screen: HomeStack },
	History: { screen: HistoryStack },
	Stats: { screen: StatsStack },
	Settings: { screen: SettingsStack },
},
	{
		tabBarOptions: {
			activeTintColor: "#666666",
			inactiveTintColor: "#999999",
			pressColor: "#ff0000",
			style: {
				backgroundColor: "#f6f7f8",
			},
		},
	});

const PiggyBudgetAppContainer = createAppContainer(PiggyBudgetRoot);

const persistConfig = {
	key: "v11",
	storage,
	transforms: [immutableTransform()],
};

const persistedReducer = persistReducer(persistConfig, appReducer);

const store = createStore(persistedReducer);
const persistor = persistStore(store);

export default () => (
	<MenuProvider skipInstanceCheck={true}>
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<PiggyBudgetAppContainer />
			</PersistGate>
		</Provider>
	</MenuProvider>
);
