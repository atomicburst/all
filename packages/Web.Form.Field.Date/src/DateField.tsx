import * as React from "react";
import {Component, PureComponent} from "react";
import {RecordFieldProps, FormRef, withRecordField, WithRecordField, withFocusManagerField, WithFocusManagerField} from "../../Form";
import {Overwrite, WithStyles} from "@material-ui/core";
import * as ReactPropTypes from "prop-types";
import compose from "recompose/compose";
import withStyles from "@material-ui/core/styles/withStyles";
import * as moment from 'moment'
import ReactCalendar from 'rc-calendar'
import DatePicker from 'rc-calendar/lib/Picker';
import 'rc-calendar/dist/rc-calendar.css'
import EventIcon from "@material-ui/icons/Event";
import TextField from "@material-ui/core/TextField";
import {TextFieldProps} from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import MaskedInput, {maskArray} from "react-text-mask";
import Modal from "@material-ui/core/Modal";
import {FocusManagerFieldProps} from "../../Form/src/FocusManager";
import {RefObject} from "react";

import TimePickerPanel from 'rc-time-picker/lib/Panel';
import 'rc-time-picker/assets/index.css';
export interface DateFieldProps extends TextFieldProps {
    datePickerRef?: (e: DateFieldRef) => void,
    format: string;
    mask?: maskArray | ((value: string) => maskArray);
    mode?: 'modal' | 'picker'
    showTime?:boolean
}

const DateFieldStyles = theme => ({
    datePicker: {
        width: '100%',
        display: 'flex' as 'flex',
        flexDirection: 'column' as 'column',
        alignItems: 'left' as 'left',
        justifyContent: 'flex-end' as 'flex-end',
        "& input": {

            width: '100%',
            marginBottom: '2px',
            border: 'none '
        }
    },
    paper: {
        position: 'absolute' as 'absolute',
        zIndex: 100000,
        marginTop: theme.spacing.unit,
        right: 0
    }
});


const timePickerElement = <TimePickerPanel defaultValue={moment('00:00:00', 'HH:mm:ss')} />;


export class DateFieldRef extends Component<DateFieldProps & WithRecordField & WithFocusManagerField & WithStyles<typeof DateFieldStyles>, any> {
    input;
    private picker: any;

    divRef: RefObject<any>
    calendarRef: RefObject<any>


     createInputComponent = mask => (props) => {
        const {inputRef, ...other} = props;
        const {inputValue} = this.state;
        return (
            <MaskedInput
                ref={inputRef}
                mask={mask}
                {...other}
                placeholderChar={'\u2000'} showMask
                render={
                    (ref, {defaultValue, ...renderProps}) => {
                        return <input
                            ref={ref}
                            value={inputValue}
                            {...renderProps}
                        />
                    }
                }/>
        );
    }
    constructor(props, context) {
        super(props, context);
        let me = this;
        if (me.props.datePickerRef) {
            me.props.datePickerRef(this);
        }
        let inputValue = '';
        if (me.props.recordField.value) {
            inputValue = moment(me.props.recordField.value).format(me.props.format)
        }

        me.divRef = React.createRef();
        me.calendarRef = React.createRef();
        this.state = {
            open: false,
            inputValue: inputValue,
            inputComponent:this.props.mask?this.createInputComponent(this.props.mask):undefined
        }
        me.props.focusManagerField.registreInput(() => {
            if (me.input)
            return me.input.inputElement
        })
    }

    context: {
        form: FormRef
    }
    static contextTypes = {
        form: ReactPropTypes.any
    };

    focus() {
        this.input.focus()
    }

    handerFocus(e) {
        let me = this;
        const {
            mode,
            onFocus
        } = this.props;
        if (mode == 'modal') {

        } else {
            me.setState({open: true})
        }

        if (onFocus)
            onFocus(e);
    }

    handerKeyPress(e) {

        let me = this;
        const {
            mode,
            onKeyPress,
            focusManagerField
        } = this.props;


        if (mode == 'modal') {
            if (e.charCode == focusManagerField.focusKeyCode) {
                focusManagerField.next();
            }
        } else {
            if (!me.state.open) {
                if (e.charCode == focusManagerField.focusKeyCode) {
                    focusManagerField.next();
                }
            }
        }
        if (onKeyPress)
            onKeyPress(e);
    }

    handerKeyDown(e) {
        let me = this;
        const {
            mode,
            onKeyDown,
            focusManagerField,
        } = this.props;
        if (mode == 'modal') {
            me.calendarRef.current.onKeyDown(e);
        } else {
            if (me.state.open) {
                e.target = me.divRef.current;
                me.calendarRef.current.onKeyDown(e);
                if (e.keyCode == focusManagerField.focusKeyCode) {
                    me.setState({open: false})
                }
            } else if (e.keyCode != focusManagerField.focusKeyCode) {
                me.setState({open: true})
            }
        }
        if (onKeyDown)
            onKeyDown(e);
    }

    handerBlur(e) {
        let me = this;
        const {
            mode
        } = this.props;
        if (e.nativeEvent.relatedTarget) {
            let relatedTarget = e.nativeEvent.relatedTarget;
            if (relatedTarget.parentElement == me.divRef.current) {
                if (me.input)
                me.input.inputElement.focus();
                return;
            }
        }
        if (mode == 'modal') {

        } else {
            me.setState({open: false})
        }
    }

    render() {
        let me = this;
        const {
            onChange,
            recordField,
            format,
            mode,
            showTime,
            focusManagerField,
            classes,
            datePickerRef,
            onFocus,
            onKeyPress,
            style,
            ...datePickerProps
        } = this.props;
        const {
            inputValue,
            inputComponent
        } = this.state
        return (
            <>
                <div style={style}>
                    <TextField
                        fullWidth
                        value={inputValue}
                        onChange={e=>{
                            let m = moment(e.target.value,format);
                            if (m.isValid()){
                                me.setState({
                                    inputValue:e.target.value
                                })
                                recordField.onChange(m.toDate())
                            }else {
                                me.setState({
                                    inputValue:e.target.value
                                })
                            }
                        }}

                        onFocus={(e) => {
                            me.handerFocus(e);
                        }}
                        onKeyPress={(e)=> {
                            me.handerKeyPress(e);
                        }}
                        onKeyDown={(e) => {
                            me.handerKeyDown(e);
                        }}
                        onBlur={(e) => {
                            me.handerBlur(e);
                        }}
                        InputProps={{
                            inputComponent: inputComponent,
                            endAdornment: <InputAdornment position="end"  style={{margin: '0px'}}>
                                <IconButton onClick={() => {
                                    me.setState({open: !me.state.open})
                                    if (me.input)
                                        me.input.inputElement.focus();
                                }}>
                                    <EventIcon/>
                                </IconButton>
                            </InputAdornment>
                        }}
                        inputRef={(e) => {
                            if (e){
                                me.input = e;
                            }
                        }}
                        {...datePickerProps}
                    />
                    {
                        (function () {
                            if (mode == 'modal') {
                                return <Modal open={me.state.open} onClose={() => {
                                    me.setState({open: false})
                                }}>
                                    <div
                                        style={{margin: 'auto'}}>
                                        <ReactCalendar
                                            style={{zIndex: 1000}}
                                            showDateInput={false}
                                            timePicker={showTime ? timePickerElement : null}
                                            value={moment(recordField.value)}
                                            onChange={(e)=>{
                                                this.setState({
                                                    inputValue: moment(e).format(format)
                                                })
                                                recordField.onChange(e)
                                            }}
                                            showOk={true}
                                        />
                                    </div>
                                </Modal>
                            } else {
                                return <div style={{position: 'relative'}}>
                                    <div className={classes.paper} ref={this.divRef} hidden={!me.state.open}>
                                        <ReactCalendar
                                            ref={me.calendarRef}
                                            onOk={function () {
                                                me.setState({open: false})
                                            }}

                                            timePicker={showTime ? timePickerElement : null}
                                            onChange={(e)=>{
                                                this.setState({
                                                    inputValue: moment(e).format(format)
                                                })
                                                recordField.onChange(e)
                                            }}
                                            style={{width: '100%', minWidth: '252px', zIndex: 1000}}
                                            value={moment(recordField.value)}
                                            showDateInput={false}
                                            showOk={true}
                                        />
                                    </div>
                                </div>
                            }

                        }).call(me)
                    }
                </div>
            </>
        )
    }

}

export  type DateFieldType = React.ComponentClass<Overwrite<Overwrite<Overwrite<DateFieldProps, Partial<FocusManagerFieldProps>>, Overwrite<Partial<RecordFieldProps>, Partial<DateFieldRef>>>, Partial<WithStyles<typeof DateFieldStyles>>>>
export const DateField = compose(withFocusManagerField(), withRecordField(), withStyles(DateFieldStyles))(DateFieldRef) as DateFieldType;
