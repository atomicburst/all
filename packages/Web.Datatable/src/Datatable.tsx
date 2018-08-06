import * as React from 'react';
import classNames from 'classnames';
import {withStyles} from '@material-ui/core/styles';
import * as ReactPropTypes from 'prop-types';
import {Overwrite, WithStyles} from "@material-ui/core";
import {Record, LoadViewProps, withLoadView, WithLoadView} from "../../Data";
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
    onRowDoubleClick?: (r:Record) => void
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
export class DatatableRef extends React.Component<WithStyles<typeof DatatableStyles> & DatatableProps & WithLoadView, any> {
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

    get loadView() {
        return this.props.loadView;
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
        const {classes,mode,columns,onRowDoubleClick} = this.props;
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
                                            onRowDoubleClick={onRowDoubleClick}
                                            rowHeight={me.rowHeight}
                                            loadView={me.loadView}
                                            loading={me.loadView.loading}
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
        me.loadView.read({offset: page * me.loadView.limit});
    };

    handleChangeRowsPerPage = event => {
        let me = this;
        me.loadView.read({limit: event.target.value});
    };
    sortFromIndex(dataIndex: string) {
        return this.loadView.sortFromIndex(dataIndex);
    }

}


export  type DatatableType = React.ComponentClass<Overwrite<Overwrite<Overwrite<DatatableProps, Partial<WithRecordField>>, Partial<LoadViewProps>>, Partial<WithStyles<typeof DatatableStyles>>>>
export const Datatable = compose(withStyles(DatatableStyles), withLoadView())(DatatableRef) as DatatableType;