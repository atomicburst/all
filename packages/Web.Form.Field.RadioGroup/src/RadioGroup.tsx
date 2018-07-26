import * as React from "react";
import {Component, ReactNode} from "react";
import {RadioGroupProps as RadioGroupPropsM} from "@material-ui/core/RadioGroup/RadioGroup";
import {Form, RecordFieldProps, withRecordField, WithRecordField} from "../../Form";
import RadioGroupM from "@material-ui/core/RadioGroup";
import {Overwrite, WithStyles} from "@material-ui/core";

import withStyles from "@material-ui/core/styles/withStyles";
import compose from "recompose/compose";
import {FocusManagerFieldProps, WithFocusManagerField, withFocusManagerField} from "../../Form/src/FocusManager";
export interface RadioGroupProps extends RadioGroupPropsM{
    radioGroupRef?: (e: RadioGroupRef) => void
}
const RadioGroupStyles = {};
export class RadioGroupRef extends  Component<RadioGroupProps&WithRecordField&WithFocusManagerField,any> {
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
            onChange,
            recordField,
            focusManagerField,
            onKeyPress,
            ...radioGroupProps

        } = this.props;
        return (
            <RadioGroupM
                value={recordField.value}
                onChange={(e,checked ) => {
                    recordField.onChange(checked);
                    if (onChange)
                        onChange(e,checked);
                }}
                {...radioGroupProps}
            />
        )
    }

}
export  type RadioGroupType =  React.ComponentClass<Overwrite<Overwrite<Overwrite<RadioGroupProps,Partial<FocusManagerFieldProps>>,Partial<RecordFieldProps>> , Partial<WithStyles<typeof RadioGroupStyles>>>>
export const RadioGroup = compose( withFocusManagerField(),withRecordField() , withStyles(RadioGroupStyles)) (RadioGroupRef) as RadioGroupType;