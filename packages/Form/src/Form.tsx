import {Component} from "react";
import * as ReactPropTypes from "prop-types";
import { RecordFieldRef} from "./RecordField";
import {WithStyles} from "@material-ui/core";
import * as React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
export const FormStyles = {}
export interface  FormProviderProps {
    formRef:(e:FormRef)=>void
}
export class FormRef  extends Component< FormProviderProps & WithStyles<typeof FormStyles>> {
    constructor(props,contex){
        super(props,contex);
        if (this.props.formRef){
            this.props.formRef(this);
        }
    }
    static childContextTypes = {
        form: ReactPropTypes.any
    };
    getChildContext() {
        return {form: this}
    }
    render() {
        return this.props.children;
    }
    recordFields: { [key: string]: RecordFieldRef } = {}
    unregister(recordField: RecordFieldRef) {
        delete this.recordFields[recordField.id]
    }
    register(recordField: RecordFieldRef) {
        this.recordFields[recordField.id] = recordField;
    }
    get valid() {
        for (let key in this.recordFields) {
            if (!this.recordFields[key].valid) {
                return false;
            }
        }
        return true;
    }
    invalid() {
        return !this.valid;
    }
}


export const Form = withStyles(FormStyles)(FormRef);