import { NativeModules } from "react-native";

declare class ExportIntentType {
	public exportCsv(
		csv: string,
		onSuccess: () => void,
		onError: (message: string, technicalMessage: string) => void): void;
}

export const ExportIntent: ExportIntentType = NativeModules.ExportIntent;
