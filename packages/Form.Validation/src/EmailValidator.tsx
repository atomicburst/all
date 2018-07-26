import {RecordFieldRef} from "../../Form/src/RecordField";

export const EmailValidator =  (recordFieldRef: RecordFieldRef)=> {
    let v = null;
    let value = recordFieldRef.record.get(recordFieldRef.field);
    if (value && value.toString().length) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(value.toString())) {
            return {
                "ab-validation-email": true
            }
        }
    }
    return v;
}