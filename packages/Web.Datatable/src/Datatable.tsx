import * as React from 'react';
import classNames from 'classnames';
import {withStyles} from '@material-ui/core/styles';
import * as ReactPropTypes from 'prop-types';
import compose from "recompose/compose";
import * as P from 'react-data-grid-addons';
import {Overwrite, WithStyles} from "@material-ui/core";
import {Record, StoreViewProps, WithStoreView, withStoreView} from "../../Data";
import {ReactNode} from "react";
import {CSSProperties} from "react";
import {WithRecordField} from "../../Form";
import {findDOMNode} from "react-dom";
import * as ReactDataGrid from 'react-data-grid';
import CircularProgress from "@material-ui/core/CircularProgress";

const  DraggableContainer = P.DraggableHeader.DraggableContainer;


let ID = 1000;

export const DatatableStyles: any = theme => ({
    root: {
        width: '100%'
    },
    table: {
        height: '25px',
        minWidth: '100%',
        userSelect: 'none'
    },
    tableWrapper: {
        display: 'flex' as 'flex',
        flexGrow: 1,
        flexDirection: 'column' as 'column',
        overflow: 'hidden'  as 'hidden'
    },
    cellInner: {
        overflow: 'hidden' as 'hidden',
        whiteSpace: 'nowrap' as 'nowrap',
        position: 'relative' as 'relative',
        textOverflow: 'ellipsis' as 'ellipsis',
        bottom: 0,
        boxSizing: 'border-box' as 'border-box',
        width: 'inherit' as 'inherit',
        font: 'normal normal 300 normal 13px/19px Open Sans,Helvetica Neue,helvetica,arial,verdana,sans-serif',
        "& > div": {
            overflow: 'hidden' as 'hidden',
            whiteSpace: 'nowrap' as 'nowrap',
            position: 'relative' as 'relative',
            textOverflow: 'ellipsis' as 'ellipsis',
            bottom: 0,
            boxSizing: 'border-box' as 'border-box',
            width: 'inherit' as 'inherit',
            font: 'normal normal 300 normal 13px/19px Open Sans,Helvetica Neue,helvetica,arial,verdana,sans-serif'
        }
    },
    DragHandle: {
        position: 'absolute',
        right: '0',
        top: 'calc( 50% - 8px)',
        zIndex: 2,
        cursor: 'col-resize' as 'col-resize',
        color: '#0085ff',
        '& :hover': {
            color: '#F6A'
        },

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
    },

    datatable: {
        position: 'relative',
        '& :has(.EMPTY)': {
            backgroundColor:'rgba(56, 54, 45, 0.75)'
        },
        '& .react-grid-Cell': {
            borderRight:'none',
            color: 'rgba(0, 0, 0, 0.75)',
            '&:hover':{
                color: 'rgba(0, 0, 0, 1)',
            },
            cursor:'default',
            '&:has(.EMPTY)':{

                borderRight:'none',
                borderBottom:'none'
            },
            borderBottom: '1px solid rgba(224, 224, 224, 1)'

        },
        '& .react-grid-Cell__value ,& .react-grid-Cell__value > *': {
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis'
        },
        '& .react-grid-Grid': {
            border:'none'
        },
        '& *, & :before, & :after': {
            '-webkit-box-sizing': 'border-box',
            '-moz-box-sizing': 'border-box',
            boxSizing: 'border-box',
            font: 'normal normal 300 normal 13px/19px Open Sans,Helvetica Neue,helvetica,arial,verdana,sans-serif'
        },
        '& .react-grid-Header': {
            boxShadow: '0px 0px 4px 0px #dddddd',
            background: '#f9f9f9'
        },
        '& .react-grid-Header--resizing': {
            cursor: 'ew-resize'
        },
        '& .react-grid-HeaderRow': {
            '-webkit-user-select': 'none',
            '-moz-user-select': 'none',
            'overflow': 'hidden' as 'hidden',
            '-ms-user-select': 'none',
            userSelect: 'none'
        },
        '& .react-grid-HeaderCell': {
            '-webkit-user-select': 'none',
            '-moz-user-select': 'none',
            '-ms-user-select': 'none',
            userSelect: 'none',
            background: '#f9f9f9',
            padding: '8px',
            color: 'rgba(0, 0, 0, 0.75)',
            '&:hover':{
                color: 'rgba(0, 0, 0, 1)',
            },
            cursor:'default',
            borderRight: '1px solid rgba(224, 224, 224, 1)',
            borderBottom: '1px solid rgba(224, 224, 224, 1)'
        },
        '& .react-grid-HeaderCell__value': {
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            position: 'relative',
            top: '50%',
            transform: 'translateY(-50%)'
        },
        '& .react-grid-HeaderCell__resizeHandle:hover': {
            cursor: 'ew-resize',
            background: '#dddddd',
        },
        '& .react-grid-HeaderCell--locked:last-of-type': {
            'box-shadow': 'none'
        },
        '& .react-grid-HeaderCell--resizing .react-grid-HeaderCell__resizeHandle': {
            background: '#dddddd'
        },
        '& .react-grid-HeaderCell__draggable': {
            cursor: 'col-resize'
        },
        '&  .rdg-can-drop > .react-grid-HeaderCell': {
            background: '#ececec'
        },
        '& .react-grid-HeaderCell .Select': {
            maxHeight: '30px',
            fontSize: '12px',
            fontWeight: 'normal'
        },
        '& .react-grid-HeaderCell .Select-control': {
            maxHeight: '30px',
            border: '1px solid #cccccc',
            color: '#555',
            borderRadius: '3px',
        },
        '& .react-grid-HeaderCell .is-focused:not(.is-open) > .Select-control': {
            borderColor: '#66afe9',
            outline: 0,
            '-webkit-box-shadow': 'inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102,175,233,.6)',
            boxShadow: 'inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102,175,233,.6)'
        },
        '& .react-grid-HeaderCell .Select-control .Select-placeholder': {
            lineHeight: '20px',
            color: '#999',
            padding: '4px'
        },
        '& .react-grid-HeaderCell .Select-control .Select-input': {
            maxHeight: '28px',
            padding: '4px',
            marginLeft: '0px'
        },
        '& .react-grid-HeaderCell .Select-control .Select-input input': {
            padding: '0px',
            height: '100%'
        },
        '& .react-grid-HeaderCell .Select-control .Select-arrow-zone .Select-arrow': {
            borderColor: 'gray transparent transparent',
            borderWidth: '4px 4px 2.5px',
        },
        '& .react-grid-HeaderCell .Select-control .Select-value': {
            padding: '4px',
            lineHeight: '20px !important',
        },
        '& .react-grid-HeaderCell .Select--multi .Select-control .Select-value': {
            padding: '0px',
            lineHeight: '16px !important',
            maxHeight: '20px',
        },
        '& .react-grid-HeaderCell .Select--multi .Select-control .Select-value .Select-value-icon': {
            maxHeight: '20px',
        },
        '& .react-grid-HeaderCell .Select--multi .Select-control .Select-value .Select-value-label': {
            maxHeight: '20px',
        },
        '& .react-grid-HeaderCell .Select-control .Select-value .Select-value-label': {
            color: '#555555 !important',
        },
        '& .react-grid-HeaderCell .Select-menu-outer .Select-option': {
            padding: '4px',
            lineHeight: '20px',
        },
        '& .react-grid-HeaderCell .Select-menu-outer .Select-menu .Select-option.is-selected': {
            color: '#555555',
        },
        '& .react-grid-HeaderCell .Select-menu-outer .Select-menu .Select-option.is-focused': {
            color: '#555555'
        }
    }

});




class CustomHeader extends React.Component{
    render() {
        return (
            <div>I m custome Header</div>
        )
    }
};

export  class  ReactDataGridCustom extends React.Component<{
    classes:any,
    loading:any,
    storeView:any,
    rowHeight:any,
    minHeight:any,
    columns:any,
    headerRowHeight:any

},any>{
    private loadingRef: React.RefObject<any>;
    constructor(props,context){
        super(props,context);
        this.loadingRef = React.createRef();
        this.state = {
            columns:props.columns
        }

    }
    canvas = null
    componentWillUnmount() {
        let me = this;
        if (this.canvas) {
            this.canvas.removeEventListener('scroll', function () {
                me.scrollListener();
            });
        }
    }
    componentDidMount() {
        let me = this;
        this.canvas = findDOMNode(this)['querySelector']('.react-grid-Canvas');
        this.canvas.addEventListener('scroll',function () {
            me.scrollListener();
        });
        this.ajustScroll();
    }

    componentDidUpdate(prevProps) {
        this.canvas = findDOMNode(this)['querySelector']('.react-grid-Canvas');
        this.ajustScroll();
    }
    ajustScroll() {
        let me = this;
        const  {
            headerRowHeight,
            minHeight
        } = this.props;
        let loadingRef = me.loadingRef;
        setTimeout(function () {
            if ( me.canvas){
                if ( me.canvas.scrollHeight <=  me.canvas.clientHeight) {
                    loadingRef.current.style['width'] ="calc( 100% )";
                } else {
                    loadingRef.current.style['width'] ="calc( 100% - 15px )";
                }
                if ( me.canvas.scrollWidth <=  me.canvas.clientWidth) {
                    loadingRef.current.style['height'] = (minHeight-headerRowHeight)+"px";
                } else {
                    loadingRef.current.style['height'] = (minHeight-headerRowHeight-15+"px");
                }
            }
        },500)
    }

    scrollListenerBuffer;
    scrollListener(){
        let me = this;
        const  {
            storeView,
            rowHeight
        } = this.props;
        let b = !me.scrollListenerBuffer
        me.scrollListenerBuffer =function (){
            let position  =Math.round((me.canvas.scrollTop)/rowHeight);
            let min       = Math.round((me.canvas.clientHeight)/rowHeight);
            let length    =Math.trunc((me.canvas.scrollHeight/rowHeight));
            let l =Math.round(storeView.offset);
            if (l<0){
                l =0;
            }
            let r =Math.round(storeView.offset + storeView.limit - (min*2));
            if (r > length){
                r =length;
            }

            if (position> r || position<l){
                let p = position - (min*5);
                if (p<0){
                    p =0;
                }
                storeView.read({offset:p,limit:min*10});
            }
        }
        if (b){
            setTimeout(function () {
                let ui = me.scrollListenerBuffer;
                me.scrollListenerBuffer=null;
                if (ui){
                    ui();
                }
            },1000);
            let ui1 = me.scrollListenerBuffer;
            me.scrollListenerBuffer=null;
            ui1();

        }

    }



    onHeaderDrop = (source, target) => {
        let me = this;
        let scrollLeft =me.canvas.scrollLeft;
        const stateCopy = Object.assign({}, this.state);
        const columnSourceIndex = this.state.columns.findIndex(
            i => i.key === source
        );
        const columnTargetIndex = this.state.columns.findIndex(
            i => i.key === target
        );

        stateCopy.columns.splice(
            columnTargetIndex,
            0,
            stateCopy.columns.splice(columnSourceIndex, 1)[0]
        );

        const emptyColumns = Object.assign({},this.state, { columns: [] });
        this.setState(
            emptyColumns
        );
        me.canvas.scrollLeft=scrollLeft+1;
        const reorderedColumns = Object.assign({},this.state, { columns: stateCopy.columns });
        this.setState(
            reorderedColumns
        );
        me.canvas.scrollLeft=scrollLeft+1;
        setTimeout(function () {
            me.canvas.scrollLeft=scrollLeft+1;
        },1)
    };

    private handleGridSort(sortColumn: any, sortDirection: any) {
        let me = this;
        const  {
            storeView
        } = this.props;
        if (sortDirection){

            let b = {};
            b[sortColumn]=sortDirection;
            storeView.read({offset:storeView.offset , sorts:[b]})
        }else {
            storeView.read({offset:storeView.offset})
        }

    }
    render() {
        let me = this;
        let loadingRef = me.loadingRef;
        const  {
                classes,
                loading,
                storeView,
                rowHeight,
                minHeight,
                headerRowHeight
        } = this.props;
        const  {
            columns
        } = this.state;
        console.log(columns)
        return <div className={classes.datatable}>
            <div ref={loadingRef} hidden={!loading} style={{
                top: headerRowHeight,
                height: minHeight - headerRowHeight,
                width: '100%',
                position: 'absolute'as 'absolute',
                zIndex: 1000000,
                pointerEvents: 'none',
                backgroundColor: '#f0f0f0',
                display: 'flex'as 'flex',
                justifyContent: 'center' as 'center',
                alignItems: 'center'  as 'center'
            }}>
                <div>
                    <CircularProgress variant={'indeterminate'}/>
                </div>
            </div>
            <DraggableContainer
                onHeaderDrop={(source, target)=>{
                    me.onHeaderDrop(source, target);
                }}>

                <ReactDataGrid
                    onColumnResize={(index: number, width: number) => {
                        columns[index]['width']=width;
                        this.setState({
                            columns: columns
                        });
                    }}
                    onGridSort={(sortColumn, sortDirection)=>this.handleGridSort(sortColumn, sortDirection)}
                    minHeight={minHeight}
                    rowHeight={rowHeight}
                    columns={columns}
                    rowGetter={(rowIdx) => {
                        let ii = rowIdx - storeView.offset;
                        if (storeView.items[ii]) {
                            let oo = {};
                            for (let cc of columns) {
                                oo[cc.key] = storeView.items[ii];
                            }
                            return oo;
                        }
                        return {};
                    }}
                    rowsCount={storeView.length}
                    headerRowHeight={headerRowHeight}
                />

            </DraggableContainer>
        </div>
    }
}


export interface DatatableProps {
    columnStyle?: CSSProperties;
    className?: string;
    style?: CSSProperties;
    onClickItem?: (record: Record) => void
    columns: {
        dataIndex: string,
        name: string,
        width?: number,
        draggable?:boolean,
        resizable?:boolean
        sortable?:boolean,
        cellTitle?: (r: Record, status: { isSelected: boolean }) => string
        cell: (r: Record, status: { isSelected: boolean }) => React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
    }[]
}


export class DatatableRef extends React.Component<WithStyles<typeof DatatableStyles> & DatatableProps & WithStoreView, any> {
    defaultColumnStyle = {
        width: '160px'
    }

    id: string;
    minHeight = 400;
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


    get sortableColumns() {
        return true;
    }


    get columns() {

        return this.state.columns;
    }

    getChildContext() {
        return {datatable: (this) as DatatableRef}
    }


    buildState(props) {


        let _columns = [];
        for (let c of  props.columns) {
            _columns.push({
                key: c.dataIndex,
                width: c.width,
                draggable: c.draggable,
                resizable: c.resizable,
                sortable: c.sortable,
                name:c.name,
                formatter: function (props) {
                    if (props.value){
                        return c.cell(props.value, {})
                    }else {
                        return <div className={'EMPTY'} ></div>
                    }
                }
            })
        }

        return {

            columns: _columns
        }
    }


    render() {
        const me = this;
        const {classes} = this.props;
        const {columns} = this.state;
        // return (
        //     <Paper className={classNames(classes.root, this.props.className)}>
        //         {/*<EnhancedTableToolbar numSelected={selected.length} />*/}
        //         <div className={classes.tableWrapper}>
        //             <div  style={{flexGrow: 1, position: 'relative' ,display:'flex',flexDirection: "column"}} >
        //                 <Header  datatableRef={this}  columns={columns}/>
        //                 <ItemsPagination datatableRef={this} columns={columns}/>
        //             </div>
        //             <Pagination  datatableRef={this}  columns={columns}/>
        //         </div>
        //     </Paper>
        // );
        let minRow =Math.round(me.minHeight/me.rowHeight);
        return (
            <ReactDataGridCustom
                columns={columns}
                rowHeight={me.rowHeight}
                storeView={me.storeView}
                loading={me.storeView.loading}
                minHeight={me.minHeight}
                headerRowHeight={me.headerRowHeight}
                classes={classes}
            />
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
