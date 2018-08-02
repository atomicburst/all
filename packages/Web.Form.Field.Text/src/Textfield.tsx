import * as React from "react";
import TextFieldM from "@material-ui/core/TextField";
import {Component} from "react";
import {TextFieldProps as TextFieldPropsM} from "@material-ui/core/TextField/TextField";
import { RecordFieldProps, withRecordField, WithRecordField, withFocusManagerField} from "../../Form";
import withStyles from "@material-ui/core/styles/withStyles";
import {Overwrite, WithStyles} from "@material-ui/core";
import compose from "recompose/compose";
import {} from "../../Data/src/Record";
import {FocusManagerFieldProps, WithFocusManagerField} from "../../Form";

export interface TextFieldProps extends TextFieldPropsM {
    textFieldRef?: (e: TextFieldRef) => void
}

const TextFieldStyles = {};

export class TextFieldRef extends Component<TextFieldProps & WithRecordField&WithFocusManagerField & WithStyles<typeof TextFieldStyles>, any> {
    input;
    constructor(props, context) {
        super(props, context);
        let me = this;
        if (me.props.textFieldRef) {
            me.props.textFieldRef(this);
        }
        me.props.focusManagerField.registreInput(() =>{
            return me.input
        })
    }
    focus() {
        this.input.focus()
    }
    render() {
        let me = this;
        const {
            onChange,
            recordField,
            textFieldRef,
            focusManagerField,
            inputRef,
            onKeyPress,
            ...textFieldProps
        } = this.props;
        return (
            <TextFieldM
                value={recordField.value||""}
                error={recordField.invalid}
                onKeyPress={function (e) {

                    if (e.charCode==focusManagerField.focusKeyCode){
                        focusManagerField.next();
                    }

                    if (onKeyPress)
                    onKeyPress(e);
                }}
                onChange={(e) => {
                    recordField.onChange(me.input.value && me.input.value.length > 0 && me.input.value || null);
                    if (onChange)
                        onChange(e);
                }}
                inputRef={(e)=>{
                    me.input = e;
                    if (inputRef)
                        (inputRef as any)(e)
                }}
                {...textFieldProps}
                fullWidth={true}
            />)
    }
}
export  type TextFieldType =  React.ComponentClass<Overwrite<Overwrite<Overwrite<TextFieldProps,Partial<FocusManagerFieldProps>>,RecordFieldProps> , Partial<WithStyles<typeof TextFieldStyles>>>>
export const TextField = compose(withFocusManagerField(), withRecordField() , withStyles(TextFieldStyles)) (TextFieldRef) as TextFieldType;