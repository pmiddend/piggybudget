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
import moment from "moment";
import {
    NavigationScreenProps,
} from "react-navigation";
import {Decimal} from "decimal.js";
import { connect } from "react-redux";
import Transaction from "../Transaction";
import {
    actionAddTransaction,
    actionStateChange,
    actionCurrencyChange,
    actionIncomeTypeChange,
    actionIncomeChange } from "../Actions";
import AppState from "../AppState";
import AppSettings from "../Settings";
import { FormLabel, FormInput, ButtonGroup } from "react-native-elements";
import { currencies, Currency } from "../Currencies";

interface Props {
    readonly navigation: any;
    readonly settings: AppSettings;
    readonly onIncomeTypeChange: (newIncomeType: string) => void;
    readonly onIncomeChange: (newIncomeType: Decimal) => void;
    readonly onChangeCurrency: (newCurrency: string) => void;
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
            income: this.props.settings.income,
        };
        this.handlePress = this.handlePress.bind(this);
        this.handleIncomeChange = this.handleIncomeChange.bind(this);
        this.buttons = ["daily", "monthly"];

    }

    public render() {
        const selectedIndex = this.buttons.indexOf(this.props.settings.incomeType);
        return (
            <View>
              <FormLabel>Currency</FormLabel>
                <Picker selectedValue={this.props.settings.currency} onValueChange={this.props.onChangeCurrency}>
                {currencies.valueSeq().map((c) => <Picker.Item key={c.code} label={c.name} value={c.code} />).toArray()}
                </Picker>
              <FormLabel>Income type</FormLabel>
              <ButtonGroup
                buttons={this.buttons}
                selectedIndex={selectedIndex}
                onPress={this.handlePress} />
             <FormLabel>Income</FormLabel>
                <FormInput value={this.state.income}
            keyboardType="numeric"
            onChangeText={this.handleIncomeChange}/>
                <FormLabel>
                Daily income:
                {this.dailyIncome().toPrecision(2)}
            {(currencies.get(this.props.settings.currency) as Currency).symbol}
            </FormLabel>
           </View>
        );
    }

    private dailyIncome(): Decimal {
        if (this.props.settings.income === "")
            return new Decimal(0);
        if (this.props.settings.incomeType === "daily")
            return new Decimal(this.props.settings.income);
        const daysThisMonth: number = moment().daysInMonth();
        return new Decimal(this.props.settings.income).div(new Decimal(daysThisMonth));
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
            console.log("Couldn't convert " + newIncome + " to decimal");
        }
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
        onChangeCurrency: (t: string) => dispatch(actionCurrencyChange(t)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
