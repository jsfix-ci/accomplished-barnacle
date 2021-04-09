export abstract class CommandLineParameter<T> {
    public readonly key: string;
    public readonly description: string;
    public readonly isMandatory: boolean;
    protected _value: T = undefined;

    constructor(key: string, description: string, isMandatory: boolean) {
        this.key = "--" + key;
        this.description = description;
        this.isMandatory = isMandatory;
    }

    // returns validation error
    abstract validate(value: string): string | undefined;

    abstract setValue(value: string): void;

    public getValue(): T {
        return this._value;
    }

    public hasValue(): boolean {
        return this._value !== undefined;
    }
}