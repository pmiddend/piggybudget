import React from "react";
import {Component} from "react";
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Button,
} from "react-native";
import {
    NavigationScreenProps,
} from "react-navigation";

interface State {
    amount: string;
}

export default class AddScreen extends Component<NavigationScreenProps<{}>> {
    public static navigationOptions = {
        title: "Modify budget",
    };

    public state: State;

    constructor(props: NavigationScreenProps<{}>) {
        super(props);
        this.state = {
            amount: "0",
        };
    }

    public render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>Budget ftw!</Text>
                <TextInput value={this.state.amount} />
                <Button title="Go!" onPress={() => this.handlePress.bind(this)} />
            </View>
        );
    }

    private handlePress() {
        // const { params } = this.props.navigation.state;
        // params(this.state.amount);
        this.props.navigation.goBack();
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
