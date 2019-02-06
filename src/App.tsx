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
import { YellowBox } from "react-native";
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

const PiggyBudgetRoot = createStackNavigator({
	TopTabs: {
		screen: TopTabNavigator,
		navigationOptions: {
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
