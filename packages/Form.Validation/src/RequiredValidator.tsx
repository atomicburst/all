import {RecordFieldRef} from "../../Form/src/RecordField";
export const RequiredValidator =  (recordField: RecordFieldRef)=> {
    let value = recordField.record.get(recordField.field);
    if (value) {
        if (typeof value == "string" && value.length) {
            return null;
        } else {
            return null;
        }
    }
    return { 'ab-validation-required': true };
}