import * as React from 'react';
import classNames from 'classnames';
import {withStyles} from '@material-ui/core/styles';
import * as ReactPropTypes from 'prop-types';
import {Overwrite, WithStyles} from "@material-ui/core";
import {Record, RecordViewProps, withRecordView, WithRecordView} from "../../Record";
import {CSSProperties, ReactNode} from "react";
import {SizeMe} from 'react-sizeme'
import Paper from "@material-ui/core/Paper";
import {Wrapper} from "./Wrapper";
import {Pagination} from "./Pagination";
import {WithRecordField} from "../../Form";
import compose from "recompose/compose";
let ID = 1000;
export const DatatableStyles: any = theme => ({
    root: {
        width: '100%'
    },
    tableWrapper: {
        display: 'flex' as 'flex',
        flexGrow: 1,
        flexDirection: 'column' as 'column',
        overflow: 'hidden'  as 'hidden'
    },
    DragHandleActive: {
        color: '#F6A'
    },
    DragHandleIcon: {
        flexDirection: 'column' as 'column',
        justifyContent: 'center' as 'center',
        alignItems: 'center' as 'center'
    },
    header: {
        paddingRight: '15px',
    },
    headerInner: {
        minHeight: '48px',
        overflow: 'hidden' as 'hidden'
    }

});
export interface DatatableProps {
    className?: string;
    mode:'infinitescroll'|'pagination'|'list'
    onClickItem?: (record: Record) => void
    columns: {
        dataIndex: string,
        head: ReactNode,
        width: number,
        draggable?: boolean,
        resizable?: boolean
        sortable?: boolean,
        cellTitle?: (r: Record, status: { isSelected: boolean }) => string
        cell: (r: Record, status: { isSelected: boolean }) => React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
    }[]
}
export class DatatableRef extends React.Component<WithStyles<typeof DatatableStyles> & DatatableProps & WithRecordView, any> {
    defaultColumnStyle = {
        width: '160px'
    }

    id: string;
    rowHeight = 45;
    headerRowHeight = 50;

    constructor(props,context) {
        super(props,context);
        this.headRef = React.createRef();
        this.bodyRef = React.createRef();
        this.id = ("Datatable-" + (ID++));
    }

    get recordView() {
        return this.props.recordView;
    };

    static childContextTypes = {
        datatable: ReactPropTypes.any
    };
    headRef: React.RefObject<any>;
    bodyRef: React.RefObject<any>;


    getChildContext() {
        return {datatable: (this) as DatatableRef}
    }



    render() {
        const me = this;
        const {classes,mode,columns} = this.props;
        return (
            <Paper className={classNames(classes.root, this.props.className)}>
                <div className={classes.tableWrapper}>
                    <SizeMe monitorWidth={true} monitorHeight ={true} >
                        {({size}) =>{
                            return <div  style={{flexGrow: 1, position: 'relative' ,display:'flex',flexDirection: "column"}}>
                                {(()=>{
                                    if (size.height){
                                        return <Wrapper
                                            columns={columns}
                                            mode={mode}
                                            rowHeight={me.rowHeight}
                                            recordView={me.recordView}
                                            loading={me.recordView.loading}
                                            minHeight={size.height}
                                            width={size.width}
                                            headerRowHeight={me.headerRowHeight}
                                        />
                                    }
                                    return <div></div>
                                })()}
                            </div>
                        } }
                    </SizeMe>
                    <Pagination  datatableRef={this}  columns={columns}/>
                </div>
            </Paper>
        );
    }


    handleChangePage = (event, page) => {
        let me = this;
        me.recordView.read({offset: page * me.recordView.limit});
    };

    handleChangeRowsPerPage = event => {
        let me = this;
        me.recordView.read({limit: event.target.value});
    };
    sortFromIndex(dataIndex: string) {
        return this.recordView.sortFromIndex(dataIndex);
    }

}


export  type DatatableType = React.ComponentClass<Overwrite<Overwrite<Overwrite<DatatableProps, Partial<WithRecordField>>, Partial<RecordViewProps>>, Partial<WithStyles<typeof DatatableStyles>>>>
export const Datatable = compose(withStyles(DatatableStyles), withRecordView())(DatatableRef) as DatatableType;