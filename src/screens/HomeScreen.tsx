import {
    NavigationScreenProps,
} from "react-navigation";
import {Decimal} from "decimal.js";
import React from "react";
import {Component} from "react";
import {
    StyleSheet,
    Text,
    View,
    Button,
} from "react-native";

interface State {
    budget: Decimal;
}

export default class HomeScreen extends Component<NavigationScreenProps<{}>> {
    public static navigationOptions = {
        title: "Home",
    };
    public state: State;
    constructor(props: NavigationScreenProps<{}>) {
        super(props);
        this.state = {
            budget: new Decimal(110),
        };
    }

    private handleModification(amount: number) {
    }

    public render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>Todays budget</Text>
                <Text style={styles.budget}>{this.state.budget.toString()}€</Text>
                <Button title="Add" onPress={() => this.props.navigation.navigate("Add", this.handleModification.bind(this))}
        />
            </View>
        );
    }
}

const styles = StyleSheet.create({
  budget: {
    color: "#333333",
    fontSize: 30,
    marginBottom: 5,
    textAlign: "center",
  },
  container: {
    alignItems: "center",
    backgroundColor: "#F5FCFF",
    flex: 1,
    justifyContent: "center",
  },
  welcome: {
    fontSize: 20,
    margin: 10,
    textAlign: "center",
  },
});
