import * as React from 'react';
import classNames from 'classnames';
import {withStyles} from '@material-ui/core/styles';
import * as ReactPropTypes from 'prop-types';
import {Overwrite, WithStyles} from "@material-ui/core";
import {Record, StoreViewProps, withStoreView, WithStoreView} from "../../Data";
import {CSSProperties, ReactNode} from "react";
import {SizeMe} from 'react-sizeme'
import Paper from "@material-ui/core/Paper";
import {Wrapper} from "./Wrapper";
import {Pagination} from "./Pagination";
import {WithRecordField} from "../../Form";
import compose from "recompose/compose";
import TableSortLabel from "@material-ui/core/es/TableSortLabel";
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
    style?: CSSProperties;
    mode:'infinitescroll'|'pagination'|'list'
    onClickItem?: (record: Record) => void
    sorts?:{[key: string]:string}[]
    columns: {
        dataIndex: string,
        head: ReactNode,
        width?: number,
        draggable?: boolean,
        resizable?: boolean
        sortable?: boolean,
        cellTitle?: (r: Record, status: { isSelected: boolean }) => string
        cell: (r: Record, status: { isSelected: boolean }) => React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
    }[]
}
export class DatatableRef extends React.Component<WithStyles<typeof DatatableStyles> & DatatableProps & WithStoreView, any> {
    defaultColumnStyle = {
        width: '160px'
    }

    id: string;
    rowHeight = 45;
    headerRowHeight = 50;

    constructor(props) {
        super(props);
        this.state = {selected: [], ...(this.buildState(props))};
        this.headRef = React.createRef();
        this.bodyRef = React.createRef();
        this.id = ("Datatable-" + (ID++));
    }

    get storeView() {
        return this.props.storeView;
    };

    static childContextTypes = {
        datatable: ReactPropTypes.any
    };
    headRef: React.RefObject<any>;
    bodyRef: React.RefObject<any>;

    get columns() {

        return this.state.columns;
    }

    getChildContext() {
        return {datatable: (this) as DatatableRef}
    }



    render() {
        const me = this;
        const {classes,mode} = this.props;
        const {columns} = this.state;
        return (
            <Paper className={classNames(classes.root, this.props.className)}>
                <div className={classes.tableWrapper}>
                    <SizeMe monitorWidth={false} monitorHeight ={true} >
                        {({size}) =>{
                            return <div  style={{flexGrow: 1, position: 'relative' ,display:'flex',flexDirection: "column"}}>
                                {(()=>{
                                    if (size.height){
                                        return <Wrapper
                                            columns={columns}
                                            mode={mode}
                                            rowHeight={me.rowHeight}
                                            storeView={me.storeView}
                                            loading={me.storeView.loading}
                                            minHeight={size.height}
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


    handleClick = (event, id) => {
        const {selected} = this.state;
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        this.setState({selected: newSelected});
    };

    handleChangePage = (event, page) => {
        let me = this;
        me.storeView.read({offset: page * me.storeView.limit});
    };

    handleChangeRowsPerPage = event => {
        let me = this;
        me.storeView.read({limit: event.target.value});
    };

    isSelected = id => this.state.selected.indexOf(id) !== -1;


    sortFromIndex(dataIndex: string) {
        return this.storeView.sortFromIndex(dataIndex);
    }

}


export  type DatatableType = React.ComponentClass<Overwrite<Overwrite<Overwrite<DatatableProps, Partial<WithRecordField>>, Partial<StoreViewProps>>, Partial<WithStyles<typeof DatatableStyles>>>>
export const Datatable = compose(withStyles(DatatableStyles), withStoreView())(DatatableRef) as DatatableType;