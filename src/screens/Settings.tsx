import React from "react";
import {Component} from "react";
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Button,
    Picker,
} from "react-native";
import {
    NavigationScreenProps,
} from "react-navigation";
import {Decimal} from "decimal.js";
import { connect } from "react-redux";
import Transaction from "../Transaction";
import {
    actionAddTransaction,
    actionStateChange,
    actionIncomeTypeChange,
    actionIncomeChange } from "../Actions";
import AppState from "../AppState";
import AppSettings from "../Settings";
import { FormLabel, FormInput, ButtonGroup } from "react-native-elements";

interface Props {
    readonly navigation: any;
    readonly settings: AppSettings;
    readonly onIncomeTypeChange: (newIncomeType: string) => void;
    readonly onIncomeChange: (newIncomeType: Decimal) => void;
}

interface State {
    readonly income: string;
}

class Settings extends Component<Props, State> {
    public static navigationOptions = {
        title: "Settings",
    };

    private buttons: string[];

    constructor(props: Props) {
        super(props);
        this.state = {
            income: this.props.settings.income.toString(),
        };
        this.handlePress = this.handlePress.bind(this);
        this.handleIncomeChange = this.handleIncomeChange.bind(this);
        this.buttons = ["daily", "monthly"];
    }

    private handlePress(selectedIndex: number) {
        this.props.onIncomeTypeChange(this.buttons[selectedIndex]);
    }

    private handleIncomeChange(newIncome: string) {
        this.setState({
            income: newIncome,
        });
        try {
            this.props.onIncomeChange(new Decimal(newIncome));
        } catch (e) {
            console.log("Couldn't convert "+newIncome+" to decimal");
        }
    }

    public render() {
        const selectedIndex = this.buttons.indexOf(this.props.settings.incomeType);
        return (
            <View>
              <FormLabel>Income type</FormLabel>
              <ButtonGroup
                buttons={this.buttons}
                selectedIndex={selectedIndex}
                onPress={this.handlePress} />
             <FormLabel>Income</FormLabel>
                <FormInput value={this.state.income}
            keyboardType="numeric"
            onChangeText={this.handleIncomeChange}/>
           </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#F5FCFF",
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
});

const mapStateToProps = (state: AppState, ownProps: any) => {
    return {
        settings: state.settings,
        navigation: ownProps.navigation,
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        onIncomeChange: (t: Decimal) => dispatch(actionIncomeChange(t)),
        onIncomeTypeChange: (t: string) => dispatch(actionIncomeTypeChange(t)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
