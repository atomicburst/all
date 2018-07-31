import {Record} from "../../Record";
import * as React from "react";
import * as ReactPropTypes from "prop-types";
import {FormRef} from "./Form";

export interface WithRecordField {
    recordField: {
        value: any
        recordVersion: string
        onChange: (data) => void
        invalid: boolean
    }
}

export interface RecordFieldProps {
    recordField: {
        record: Record,
        field: string,
        nullValue?:any,
        validators?: ((control: RecordFieldRef) => { [key: string]: string | boolean })[]
    }
}

let ID = 100;

export class RecordFieldRef<T1 extends RecordFieldProps =any> extends React.Component<T1, any> {
    context: {
        form: FormRef
    }
    static contextTypes = {
        form: ReactPropTypes.any
    };
    _id
    get id() {
        return this.record.id;
    }

    makeProps(nextProps: T1) {
        let me = this;
        let sta = me.state || {};
        if (sta.unsubscribeRecord) {
            sta.unsubscribeRecord.unsubscribe();
        }
        let record = nextProps.recordField.record;
        let field = nextProps.recordField.field;
        let unsubscribeRecord = record.on(field).subscribe(function (r) {

            me.recordIndex = (ID++);
            me.setState({
                origin: r.origin || 'default'
            })
        });

        let value = record.get(field);
        if (nextProps.recordField.nullValue&&(value===null||value===undefined)){
            record.set(field,nextProps.recordField.nullValue, 'RecordFieldRef');
        }


        return {
            ...sta,

            recordField: nextProps.recordField,
            unsubscribeRecord: unsubscribeRecord
        };
    }

    recordIndex = (ID++);

    get recordVersion() {
        return this.id + "-" + this.recordIndex + "-" + this._id;
    }

    onChange(value) {
        if (this.props.recordField.nullValue&&(value===null||value===undefined)){
            this.record.set(this.field, this.props.recordField.nullValue, 'RecordFieldRef');
        }else {
            this.record.set(this.field, value, 'RecordFieldRef');
        }
    }

    get value() {
        return this.record.get(this.field);
    }

    constructor(props, context) {
        super(props, context);
        let me = this;
        me._id = (++ID)
        me.state = {origin: 'default', ...me.makeProps(props)};
        me.registreControl(context.form);
    }

    get recordField() {
        let me = this;
        return me.state.recordField;
    }

    get record() {
        let me = this;
        return me.recordField.record;
    }

    get field() {
        let me = this;
        return me.recordField.field;
    }

    get validators() {
        let me = this;
        return me.state.recordField.validators || [];
    }

    componentWillUnmount() {
        let me = this;
        let sta: any = {} || me.state;
        if (sta.unsubscribeRecord) {
            sta.unsubscribeRecord.unsubscribe();
        }
        me.deregisterControl(me.context.form);
    }

    componentWillReceiveProps(_nextProps) {
        const me = this;
        const recordField = me.props.recordField;
        const recordFieldNext = _nextProps.recordField;
        if (recordField != recordFieldNext) {
            me.setState(me.makeProps(_nextProps))
        }
    }

    registreControl(form: FormRef) {
        if (form)
            form.register(this);
    }

    deregisterControl(form: FormRef) {
        if (form)
            form.unregister(this);
    }

    get valid() {
        return !this.errors || this.errors.length == 0
    };

    get invalid() {
        return !this.valid
    };

    errors: { [p: string]: string | boolean }[];

    validate() {
        let errors = [];
        let me = this;
        for (let validate of me.validators) {
            let r = validate(this);
            if (r) {
                errors.push(r);
            }
        }
        this.errors = errors;
    }
}

export const withRecordField = () => {
    return function <T1 extends RecordFieldProps , WithRecordField>(Type: React.ComponentClass<T1>) {
        return class extends RecordFieldRef<T1> {
            render() {
                let me = this;
                me.validate();
                const {recordField, ...recordProps} = me.props as any;
                return <Type
                    recordField={{
                        value: me.value,
                        onChange: (d) => me.onChange(d),
                        invalid: me.invalid,
                        recordVersion:me.recordVersion
                    }}
                    {...recordProps}>
                </Type>
            }
        }
    }
}