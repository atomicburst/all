import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import compose from "recompose/compose";
import {Overwrite, WithStyles} from "@material-ui/core";
import {Component, ReactNode} from "react";
import * as keycode from "keycode";
import {FormRef, RecordFieldProps, WithRecordField, withRecordField} from "../../Form";
import withStyles from "@material-ui/core/styles/withStyles";
import Async from 'react-promise';
import * as ReactPropTypes from "prop-types";
import {Record, StoreViewProps, withStoreView, WithStoreView} from "../../Data";
import TextFieldM from "@material-ui/core/TextField";
import {TextFieldProps as TextFieldPropsM} from "@material-ui/core/TextField/TextField";
import {RefObject} from "react";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import {
    FocusManager, FocusManagerFieldProps, WithFocusManagerField,
    withFocusManagerField
} from "../../Form/src/FocusManager";

const ComboFieldStyles = theme => ({
    root: {
        flexGrow: 1,
        height: 250,
    },
    container: {
        flexGrow: 1,
        position: 'relative' as 'relative',
    },
    paper: {
        position: 'absolute' as 'absolute',
        zIndex: 100000,
        marginTop: theme.spacing.unit,
        left: 0,
        right: 0
    },
    chip: {
        margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
    },
    inputRoot: {
        flexWrap: 'wrap' as 'wrap',
    },
    loading: {
        '-webkit-animation': 'Select-animation-spin 400ms infinite linear',
        '-o-animation': 'Select-animation-spin 400ms infinite linear',
        animation: 'Select-animation-spin 400ms infinite linear',
        width: '16px',
        boxSizing: 'border-box' as 'border-box',
        borderRadius: '50%',
        border: '2px solid #ccc',
        borderRightColor: '#333',
        display: 'inline-block' as 'inline-block',
        position: 'relative' as 'relative',
        verticalAlign: 'middle' as 'middle'
    },
    '@keyframes Select-animation-spin': {
        to: {
            transform: 'rotate(1turn)'
        }
    },
    item: {
        fontSize: '13px',
        minWidth: 'calc( 100% - 32px)',
        display: 'inline-block' as any
    }

});
let ID = 1000;

export interface ComboFieldProps extends TextFieldPropsM {
    comboFieldRef?: (comboField: ComboFieldRef) => void;
    label: ReactNode;
    multiple?: boolean;
    inputField: string;
    valueField?: string;
    forceSelection?:boolean
    renderItem: (r: Record) => JSX.Element | null | false;
}

export class ComboFieldRef extends Component<ComboFieldProps & WithRecordField  &WithFocusManagerField & WithStoreView & WithStyles<typeof ComboFieldStyles>, any> {
    id: string;
    items = [];
    divRef: RefObject<any>
    get storeView(){
        return this.props.storeView
    }
    constructor(props, context) {
        super(props, context);
        let me = this;
        if (me.props.comboFieldRef) {
            me.props.comboFieldRef(this);
        }
        me.id = 'ComboField-' + (ID++);
        me.divRef = React.createRef();

        me.state ={open: false ,...me.makeProps(props)} ;
        me.props.focusManagerField.registreInput(() =>{
            return me.input
        })
    }

    makeProps(_nextProps){
        let inputText="";
        if (_nextProps.valueField &&_nextProps.valueField ==_nextProps.inputField){
            inputText=_nextProps.recordField.value||"";
        }else {
            inputText= this.getInputText(_nextProps.recordField.value)
        }
        return {
            inputText:inputText,
            activeRecord:new Record(_nextProps.recordField.value)
        }
    }
    componentWillReceiveProps(_nextProps) {
        const me = this;
        const recordFieldNext = _nextProps.recordField;
        const recordField = me.props.recordField;
        if (recordField.recordVersion != recordFieldNext.recordVersion) {
            me.setState( me.makeProps(_nextProps),function () {})

        }
    }
    getInputText(valueField) {
        let inputText = new Record(valueField).get(this.props.inputField);
        if (inputText)
            return inputText.trim()
        return '';
    }

    context: {
        form: FormRef
    }
    static contextTypes = {
        form: ReactPropTypes.any
    };
    prom: Promise<any> = Promise.resolve([]);
    input: any;

    readRemote(displayFieldValue) {
        let me = this;
        me.setState({
            loading:true,
            displayFieldValue:displayFieldValue
        })
        this.setState(function () {
            items:[]
        })
        return me.storeView.read({limit: 25, offset: 0, viewData: {displayFieldValue: displayFieldValue}}).catch(function (e) {
            setTimeout(function () {
                me.setState({
                    loading:false
                })
            },200)
            return Promise.resolve()
        }).then(function () {
            setTimeout(function () {
                me.setState({
                    loading:false
                })
            },200)
            return Promise.resolve()
        });
    }

    focus() {
        this.input.focus();
    }

    render() {
        let me = this;
        const {
            inputRef,
            storeView,
            recordField,
            renderItem,
            onKeyDown,
            inputField,
            valueField,
            focusManagerField,
            comboFieldRef,
            onFocus,
            onKeyPress,
            classes,
            forceSelection,
            ...textFieldProps
        } = this.props;
        const {open, inputText} = this.state;
        return <>
            <div style={{
                display: 'flex',
                flexDirection: 'column'
            }}>
                <TextFieldM
                    {...textFieldProps}
                    error={this.props.recordField.invalid}
                    onKeyPress={function (e) {
                        if (e.charCode==focusManagerField.focusKeyCode){
                            focusManagerField.next();
                        }
                        if (onKeyPress)
                            onKeyPress(e);
                    }}
                    onFocus={(e)=>{
                        if (onFocus)
                            onFocus(e);
                    }}
                    InputProps={{
                        endAdornment: <InputAdornment position="end">
                            <div className={classes.loading} style={{visibility:(this.state.loading?'visible':'hidden')}}></div>
                            <IconButton onClick={() => {
                                me.setState({open: true})
                                me.focus();
                                me.search(inputText || "")
                            }}>
                                <ArrowDropDownIcon/>
                            </IconButton>
                        </InputAdornment>
                    }}
                    value={inputText}
                    onKeyDown={function (e) {
                        let $event = e.nativeEvent;
                        let indexActiveRecord = me.storeView.items.indexOf(me.state.activeRecord );
                        if ( indexActiveRecord>-1&& me.state.activeRecord && me.state.open && $event.keyCode == keycode.codes.enter) {
                            $event.preventDefault();
                            me.setState({open: false, inputText: me.getInputText(me.state.activeRecord.getData())})
                            recordField.onChange(me.getValueField(me.state.activeRecord));
                            return;
                        } else if ($event.keyCode == keycode.codes.down) {
                            if (me.storeView.items.length==0){
                                me.search(inputText || "")
                            }
                            $event.preventDefault();
                            let activeIndex = me.storeView.items.indexOf(me.state.activeRecord);
                            let activeRecord;
                            if (activeIndex == -1 || (activeIndex + 1) == me.storeView.items.length) {
                                activeRecord = me.storeView.items[0]
                            } else {
                                activeRecord = me.storeView.items[activeIndex + 1]
                            }
                            me.setState({
                                open: true,
                                activeRecord: activeRecord
                            })
                            if (activeRecord) {
                                let el = document.getElementById(me.id + '-' + activeRecord.id);
                                let parentElement = el.parentElement;
                                parentElement.scrollTop = el.offsetTop;
                            }
                            return;
                        } else if ($event.keyCode == keycode.codes.up) {
                            $event.preventDefault();
                            let activeIndex = me.storeView.items.indexOf(me.state.activeRecord);
                            let activeRecord;
                            if (activeIndex == -1) {
                                activeRecord = 0;
                            } else if (activeIndex == 0) {
                                activeRecord = me.storeView.items[me.storeView.items.length - 1]
                            } else {
                                activeRecord = me.storeView.items[activeIndex - 1]
                            }
                            me.setState({
                                open: true,
                                activeRecord: activeRecord
                            })
                            if (activeRecord) {
                                let el = document.getElementById(me.id + '-' + activeRecord.id);
                                let parentElement = el.parentElement;
                                parentElement.scrollTop = el.offsetTop;

                            }
                            return;
                        }
                        if (onKeyDown)
                            onKeyDown(e);
                    }}
                    onBlur={(e) => {
                        if (e.nativeEvent.relatedTarget) {
                            let relatedTarget = e.nativeEvent.relatedTarget;
                            if (relatedTarget == me.divRef.current||relatedTarget.parentElement ==me.divRef.current) {
                                me.input.focus();
                                return;
                            }
                        }
                        const fnForceSelection=()=>{
                            if (!me.state.inputText||me.state.inputText.trim().length==0){
                                me.setState({open: false,inputText: ""})
                                recordField.onChange(null)
                            }else  if (me.state.activeRecord){
                                me.setState({open: false,inputText: me.getInputText(me.state.activeRecord.getData())})
                            }else {
                                me.setState({open: false,inputText: ""})
                            }
                        }
                        if (forceSelection===false){
                            me.setState({open: false})
                        }else if (forceSelection===true) {
                            fnForceSelection();
                        }else {
                            if (valueField && valueField == inputField){
                                me.setState({open: false})
                            }else {
                                fnForceSelection();
                            }
                        }


                    }}
                    onChange={function (e) {
                        me.search(e.target.value || "")
                        me.setState({open: true, inputText: e.target.value})
                        if (valueField && valueField == inputField){
                            recordField.onChange(e.target.value || "");
                        }

                    }}
                    inputRef={(e) => {
                        me.input = e;
                        if (inputRef)
                            (inputRef as any)(e)
                    }}
                    fullWidth={true}
                />
                <div style={{position: 'relative'}}>
                    <Paper className={classes.paper} hidden={!open}>
                        <div
                            ref={this.divRef}
                            style={{
                                border: '1px solid rgba(34,36,38,.15)',
                                maxHeight: 150,
                                overflowY: 'auto',
                            }}
                            tabIndex={-1}

                        >
                            <Async
                                promise={me.prom}
                                pending={()=>
                                    <MenuItem>
                                        Aguarde...
                                    </MenuItem>
                                }
                                then={() => {
                                    return (me.storeView.items).map((record, index) =>
                                        <MenuItem
                                            key={record.id}
                                            id={me.id + '-' + record.id}
                                            className={this.props.classes.item}
                                            component="div"
                                            selected={record == me.state.activeRecord}
                                            onClick={() => {
                                                me.setState({open: false,activeRecord:record , inputText: me.getInputText(record.getData())})
                                                recordField.onChange(me.getValueField(record));
                                            }}
                                        >
                                            {this.props.renderItem(record)}
                                        </MenuItem>
                                    );
                                }}
                            />
                        </div>
                    </Paper>
                </div>
            </div>
        </>;
    }

    search(s) {
        let me = this;
        me.prom = me.readRemote(s);
    }

    private getValueField(record) {
        const me = this;
        const {valueField} = me.props;
        if (valueField){
            return record.get(valueField)
        }else {
            return record.getData()
        }
    }

}
export  type ComboFieldType = React.ComponentClass<Overwrite<Overwrite<Overwrite<Overwrite<Overwrite<Overwrite<ComboFieldProps,Partial<FocusManagerFieldProps>>, Partial<FocusManager>>, Partial<RecordFieldProps>>, Partial<RecordFieldProps>>, Partial<StoreViewProps>>, Partial<WithStyles<typeof ComboFieldStyles>>>>
export const ComboField = compose( withFocusManagerField(),withStyles(ComboFieldStyles), withRecordField(), withStoreView())(ComboFieldRef) as ComboFieldType;
