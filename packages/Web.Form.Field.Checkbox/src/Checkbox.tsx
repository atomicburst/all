import * as React from "react";
import {Component, ReactNode} from "react";
import {CheckboxProps as CheckboxPropsM} from "@material-ui/core/Checkbox/Checkbox";
import {Form, RecordFieldProps, withRecordField, WithRecordField} from "../../Form";
import CheckboxM from "@material-ui/core/Checkbox";
import {Overwrite, WithStyles} from "@material-ui/core";

import withStyles from "@material-ui/core/styles/withStyles";
import compose from "recompose/compose";
import {FocusManagerFieldProps, WithFocusManagerField, withFocusManagerField} from "../../Form/src/FocusManager";
export interface CheckboxProps extends CheckboxPropsM{
    checkboxRef?: (e: CheckboxRef) => void
}
const CheckboxStyles = {};
export class CheckboxRef extends  Component<CheckboxProps&WithRecordField&WithFocusManagerField,any> {
    constructor(props,context){
        super(props,context);
        let me = this;
        me.props.focusManagerField.registreInput(() =>{
            return me.input
        })
    }
    input;
    render() {
        let me = this;
        const {
            inputRef,
            onChange,
            recordField,
            focusManagerField,
            onKeyPress,
            ...checkboxProps

        } = this.props;
        return (
            <CheckboxM
                checked={!!recordField.value}
                onKeyPress={function (e) {
                    if (e.charCode==focusManagerField.focusKeyCode){
                        focusManagerField.next();
                    }
                    if (onKeyPress)
                        onKeyPress(e);
                }}
                onChange={(e,checked ) => {
                    recordField.onChange(checked);
                    if (onChange)
                        onChange(e,checked);
                }}
                inputRef={(e)=>{
                    me.input = e;
                    if (inputRef)
                        (inputRef as any)(e)
                }}
                {...checkboxProps}
            />
        )
    }

}
export  type CheckboxType =  React.ComponentClass<Overwrite<Overwrite<Overwrite<CheckboxProps,Partial<FocusManagerFieldProps>>,Partial<RecordFieldProps>> , Partial<WithStyles<typeof CheckboxStyles>>>>
export const Checkbox = compose( withFocusManagerField(),withRecordField() , withStyles(CheckboxStyles)) (CheckboxRef) as CheckboxType;