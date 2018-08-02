import {Component} from "react";
import * as ReactPropTypes from "prop-types";
import { RecordFieldRef} from "./RecordField";
import {WithStyles} from "@material-ui/core";
import * as React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
export const FormStyles = {}
export interface  FormProviderProps {
    formManager:FormManager
}
export  class FormManager{
    formRef;
    get valid() {
        return   this.formRef.valid;
    }
    invalid() {
        return this.formRef.invalid;
    }
}
export  class FormRef  extends Component< FormProviderProps & WithStyles<typeof FormStyles>> {
    constructor(props,contex){
        super(props,contex);
        props.formManager.formRef=this;
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