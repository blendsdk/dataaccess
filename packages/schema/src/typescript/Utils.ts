import { eDBColumnType } from "../database/Types";

export function mapColumnType(type: eDBColumnType): string {
    switch (type) {
        case eDBColumnType.string:
            return "string";
        case eDBColumnType.number:
            return "number";
        case eDBColumnType.guid:
            return "string";
        case eDBColumnType.decimal:
            return "number";
        case eDBColumnType.dateTime:
            return "Date";
        case eDBColumnType.boolean:
            return "boolean";
        case eDBColumnType.autoIncrement:
            return "number";
        default:
            throw Error(`Undefined column type ${type}`);
    }
}
