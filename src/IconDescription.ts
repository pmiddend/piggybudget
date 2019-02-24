export interface IconDescription {
	readonly name: string;
	readonly type: string;
}

export function iconDescriptionEquals(a: IconDescription, b: IconDescription) {
	return a.name === b.name && a.type === b.type;
}
