import * as React from 'react';
import * as P from 'react-data-grid-addons';
import {findDOMNode} from "react-dom";
import * as ReactDataGrid from 'react-data-grid';
import CircularProgress from "@material-ui/core/CircularProgress";
import {SizeMe} from 'react-sizeme'
import withStyles from "@material-ui/core/styles/withStyles";
const DraggableContainer = P.DraggableHeader.DraggableContainer;
let ID = 1000;

export const WrapperStyles: any = theme => ({
    datatable: {
        position: 'relative',
        '& :has(.EMPTY)': {
            backgroundColor: 'rgba(56, 54, 45, 0.75)'
        },
        '& .react-grid-Cell': {
            borderRight: 'none',
            color: 'rgba(0, 0, 0, 0.75)',
            '&:hover': {
                color: 'rgba(0, 0, 0, 1)',
            },
            fontFamily: 'normal normal 300 normal 13px/19px Open Sans,Helvetica Neue,helvetica,arial,verdana,sans-serif',
            cursor: 'default',
            '&:has(.EMPTY)': {

                borderRight: 'none',
                borderBottom: 'none'
            },
            borderBottom: '1px solid rgba(224, 224, 224, 1)'

        },
        '& .react-grid-Cell__value ,& .react-grid-Cell__value > *': {
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis'
        },
        '& .react-grid-Grid': {
            border: 'none'
        },
        '& *, & :before, & :after': {
            '-webkit-box-sizing': 'border-box',
            '-moz-box-sizing': 'border-box',
            boxSizing: 'border-box'
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
            fontWeight:'normal',
            fontFamily: 'normal normal 300 normal 13px/19px Open Sans,Helvetica Neue,helvetica,arial,verdana,sans-serif',
            color: 'rgba(0, 0, 0, 0.75)',
            '&:hover': {
                color: 'rgba(0, 0, 0, 1)',
            },
            cursor: 'default',
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

class WrapperRef extends React.Component<{
    classes: any,
    loading: any,
    storeView: any,
    rowHeight: any,
    mode:'infinitescroll'|'pagination'|'list'
    minHeight: any,
    columns: any,
    headerRowHeight: any

}, any> {
    private loadingRef: React.RefObject<any>;

    constructor(props, context) {
        super(props, context);
        this.loadingRef = React.createRef();
        this.state =this.buildState(props);
    }

    buildState(props) {
        let _columns = [];
        let sorts = props.sorts||[];
        for (let c of  props.columns) {
            _columns.push({
                key: c.dataIndex,
                width: c.width,
                draggable: c.draggable,
                resizable: c.resizable,
                sortable:  c.sortable,
                name:  c.head,
                formatter: function (props) {
                    if (props.value) {
                        return c.cell(props.value, {})
                    } else {
                        return <div className={'EMPTY'}></div>
                    }
                }
            })
        }

        return {

            columns: _columns
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
        this.canvas.addEventListener('scroll', function () {
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
        const {
            headerRowHeight,
            minHeight
        } = this.props;
        setTimeout(function () {
            let loadingRef = me.loadingRef;
            if (me.canvas&&loadingRef&&loadingRef.current) {
                if (me.canvas.scrollHeight <= me.canvas.clientHeight) {
                    loadingRef.current.style['width'] = "calc( 100% )";
                } else {
                    loadingRef.current.style['width'] = "calc( 100% - 15px )";
                }
                if (me.canvas.scrollWidth <= me.canvas.clientWidth) {
                    loadingRef.current.style['height'] = (minHeight - headerRowHeight) + "px";
                } else {
                    loadingRef.current.style['height'] = (minHeight - headerRowHeight - 15 + "px");
                }
            }
        }, 500)
    }

    scrollListenerBuffer;

    scrollListener() {
        let me = this;
        const {
            mode,
            storeView,
            rowHeight
        } = this.props;
        if (mode!='infinitescroll')
            return;
        let b = !me.scrollListenerBuffer
        me.scrollListenerBuffer = function () {
            let position = Math.round((me.canvas.scrollTop) / rowHeight);
            let min = Math.round((me.canvas.clientHeight) / rowHeight);
            let length = Math.trunc((me.canvas.scrollHeight / rowHeight));
            let l = Math.round(storeView.offset);
            if (l < 0) {
                l = 0;
            }
            let r = Math.round(storeView.offset + storeView.limit - (min * 2));
            if (r > length) {
                r = length;
            }

            if (position > r || position < l) {
                let p = position - (min * 5);
                if (p < 0) {
                    p = 0;
                }
                storeView.read({offset: p, limit: min * 10});
            }
        }
        if (b) {
            setTimeout(function () {
                let ui = me.scrollListenerBuffer;
                me.scrollListenerBuffer = null;
                if (ui) {
                    ui();
                }
            }, 1000);
            let ui1 = me.scrollListenerBuffer;
            me.scrollListenerBuffer = null;
            ui1();

        }

    }


    onHeaderDrop = (source, target) => {
        let me = this;
        let scrollLeft = me.canvas.scrollLeft;
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

        const emptyColumns = Object.assign({}, this.state, {columns: []});
        this.setState(
            emptyColumns
        );
        me.canvas.scrollLeft = scrollLeft + 1;
        const reorderedColumns = Object.assign({}, this.state, {columns: stateCopy.columns});
        this.setState(
            reorderedColumns
        );
        me.canvas.scrollLeft = scrollLeft + 1;
        setTimeout(function () {
            me.canvas.scrollLeft = scrollLeft + 1;
        }, 1)
    };

    private handleGridSort(sortColumn: any, sortDirection: any) {
        let me = this;

        const {
            storeView
        } = this.props;
        if (sortDirection) {

            let b = {};
            b[sortColumn] = sortDirection;
            storeView.read({offset: storeView.offset, sorts: [b]})
        } else {
            storeView.read({offset: storeView.offset})
        }

    }

    render() {
        let me = this;
        let loadingRef = me.loadingRef;
        const {
            classes,
            loading,
            storeView,
            rowHeight,
            minHeight,
            headerRowHeight,
            mode
        } = this.props;
        const {
            columns
        } = this.state;

        let len = storeView.length;

        console.log(mode)
        if (mode=='pagination'){
            len=storeView.items.length;
        }
        let sortDirection;
        let sortColumn;
        if (storeView.sorts&&storeView.sorts[0]){
            for (let ii in  storeView.sorts[0]){
                if (storeView.sorts[0][ii]){
                    sortDirection= storeView.sorts[0][ii].toUpperCase()
                }else {
                    sortDirection= 'NONE';
                }

                sortColumn=ii
            }
        }

        return <div className={classes.datatable} style={{flexGrow: 1, position: 'relative' ,display:'flex',flexDirection: "column"}}>
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
                onHeaderDrop={(source, target) => {
                    me.onHeaderDrop(source, target);
                }}>
                <ReactDataGrid
                    onColumnResize={(index: number, width: number) => {
                        columns[index]['width'] = width;
                        this.setState({
                            columns: columns
                        });
                    }}
                    sortDirection={sortDirection}
                    sortColumn={sortColumn}
                    onGridSort={(sortColumn, sortDirection) => this.handleGridSort(sortColumn, sortDirection)}
                    minHeight={minHeight}
                    rowHeight={rowHeight}
                    columns={columns}
                    rowGetter={(rowIdx) => {
                        let ii ;
                        if (mode=='pagination'){
                            ii =rowIdx;
                        }else {

                            ii =rowIdx - storeView.offset;
                        }

                        if (storeView.items[ii]) {
                            let oo = {};
                            for (let cc of columns) {
                                oo[cc.key] = storeView.items[ii];
                            }
                            return oo;
                        }
                        return {};
                    }}
                    rowsCount={len}
                    headerRowHeight={headerRowHeight}
                />

            </DraggableContainer>
        </div>
    }
}
export const Wrapper = withStyles(WrapperStyles)(WrapperRef);