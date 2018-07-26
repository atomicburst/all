import * as React from "react";
import {Component, ReactPropTypes} from "react";
import SliderM, {Handle, SliderProps as SliderPropsM} from "rc-slider";
import {
    WithRecordField, withRecordField, withFocusManagerField, WithFocusManagerField,
    RecordFieldProps
} from "../../Form";
import 'rc-slider/assets/index.css';
import Tooltip from "@material-ui/core/Tooltip";
import {Overwrite, WithStyles} from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";
import compose from "recompose/compose";
import {FocusManagerFieldProps} from "../../Form/src/FocusManager";




const SliderStyles = {};

export interface SliderProps extends SliderPropsM{
    tipFormatter?:(value)=>string
}
export class SliderRef extends  Component<SliderProps & WithFocusManagerField & WithRecordField,any> {
    sliderRef: React.RefObject<any>;

    constructor(props,context){
        super(props,context);
        let me = this;
        me.sliderRef = React.createRef();
        me.props.focusManagerField.registreInput(() =>{
            return  me.sliderRef.current
        })
    }
    render() {
        let me = this;
        const {
            onChange,
            recordField,
            ...sliderProps
        } = this.props;
        return (
                <SliderM
                    ref={this.sliderRef}
                    handle={
                        (e)=>{
                            if (  this.props.tipFormatter){
                                return <Tooltip title={this.props.tipFormatter(e.value)} >
                                    <Handle className={e.className} vertical={e.vertical} offset={e.offset}/>
                                </Tooltip> as any
                            }else {
                                return <Handle className={e.className} vertical={e.vertical} offset={e.offset}/>
                            }
                        }
                    }
                    value={recordField.value}
                    min={0} max={10}
                    step={1}
                    dots
                    onChange={(v)=>recordField.onChange(v)}
                    {...sliderProps}
                />
        )
    }
}
export  type SliderType =  React.ComponentClass<Overwrite<Overwrite<Overwrite<SliderProps,Partial<FocusManagerFieldProps>>,Partial<RecordFieldProps>> , Partial<WithStyles<typeof SliderStyles>>>>
export const Slider = compose(withFocusManagerField(), withRecordField() , withStyles(SliderStyles)) (SliderRef) as SliderType;

