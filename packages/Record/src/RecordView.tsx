import {Record} from "./Record";
import * as React from "react";
export interface  ViewDataProxyData{
    length?:number
    summary?:any
    items?:Record[],
    activeItem?:Record
}
export interface ViewDataUpdateConfig {
    items:Record[]
    viewData:any
}
export interface ViewDataReadConfig {
    offset:number
    limit:number
    viewData?:any
    sorts?:{[dataIndex:string]:'desc'|'asc'}[]
    cancelCallback:(fn)=>void
}
let id = 1000;

export  interface RecordViewProps {
    recordViewProps:{
        read:(config:ViewDataReadConfig)=>Promise<ViewDataProxyData>
        update?:(config:ViewDataUpdateConfig)=>Promise<any>
        limit?:number
        mapItems?:any
        multSort?:boolean,
        sorts?:{[dataIndex:string]:'desc'|'asc'}[]
        loadAfterUpdate?:boolean,
        loadVersion:number

    }
}

export class RecordViewRef<T1 extends RecordViewProps=RecordViewProps>  extends React.Component<T1,any>  {
    constructor(props,context){
        super(props,context);
        this.state={
            recordViewProps:{
                length:0,
                ...props.recordViewProps
            }
        };
    }
    get length(){
        return this.recordViewProps.length||0
    }
    get offset(){
        return this.recordViewProps.offset||0
    }
    get limit(){
        return this.recordViewProps.limit||35
    }
    get mapItems(){
        return this.recordViewProps.mapItems
    }
    get multSort(){
        return this.recordViewProps.multSort
    }
    get sorts(){
        return this.recordViewProps.sorts||[];
    }
    get recordViewProps (){
        return this.state.recordViewProps;
    }

    sortFromIndex(dataIndex: string) {
        for(let ii of this.sorts){
            for (let  k in  ii){
                if (k==dataIndex)
                    return ii[k]
            }
        }
        return ;
    }

    get loading (){
        return this.recordViewProps.loading;
    }
    get items (){
        if (this.recordViewProps.items&&this.recordViewProps.items.length){
            return  this.recordViewProps.items;
        }
        return []
    }
    update(items,c){
        let me = this;
        let viewData = {
            ...(me.defaultViewData||{}),
            ...(c.viewData||{})
        }

        return this.props.recordViewProps.update({items:items,viewData:viewData}).then(function (r) {
            if (me.props.recordViewProps.loadAfterUpdate){
                return me.load();
            }else {
                return  Promise.resolve();
            }
        })
    }
    defaultViewData={};
    load(){
        let me = this;
        return me.read({offset:0});
    }
    clear(){
        let me = this;
        me.configureRecordViewProps({
            items:[]
        })
    }
    configureRecordViewProps(b ,callback?){
        let me = this;
        let ff = {
            recordViewProps:{
                ...me.state.recordViewProps,
                ...b
            }
        }
        this.setState(ff,callback)
    }
    localSorting(order, orderBy) {
        return order === 'desc'
            ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
            : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
    }
    lastConfig;
    read(_config?){
        _config=_config||{};
        let {offset,limit,sorts,...config}=_config;
        let me = this;
        let viewData ={
            ...(me.defaultViewData||{}),
            ...(config.viewData||{})
        }
        let c = {
            offset:offset||offset,
            limit:limit||me.limit,
            sorts:sorts||me.sorts,
            viewData:viewData,
            cancelCallback:function (fn) {
                c.cancel=fn;
            },
            cancel:function () {
            }
        }
        if (me.lastConfig){
            me.lastConfig.cancel();
            me.lastConfig=null;
        }
        me.lastConfig = c;
        me.configureRecordViewProps({...config,viewData:c.viewData,loading:true});
        return this.props.recordViewProps.read(c).then(function (r) {
            let items = r.items||[];
            if (me.mapItems){
                items =  items.map(me.mapItems);
            }
            me.configureRecordViewProps({
                length: r.length||items.length,
                items: items,
                loading:false,
                sorts:sorts,
                offset:c.offset,
                limit:c.limit
            });
            return  Promise.resolve()
        }).catch(function () {
            if (me.lastConfig==c){
                me.configureRecordViewProps({
                    loading:false
                });
            }
            return  Promise.resolve()
        })
    }
    componentWillMount(){
        let me = this;
    }
    componentWillReceiveProps(_nextProps) {
        let me = this;
        let props = this.props as any;
        let nextProps = _nextProps as any;
        let b =false;
        if (props.recordViewProps.limit!=nextProps.recordViewProps.limit){
            b = true;
        }
        if (props.recordViewProps.sorts!=nextProps.recordViewProps.sorts){
            b = true;
        }
        if (props.recordViewProps.loadAfterUpdate!=nextProps.recordViewProps.loadAfterUpdate){
            b = true;
        }
        if (b) {
            me.configureRecordViewProps(nextProps.recordViewProps);
        }
    }
}
export interface  WithRecordView  {
   recordView:{
       configureRecordViewProps:(d)=>void;
       limit:number
       offset:number
       loading:boolean
       length:number
       sortFromIndex:any
       read:(config:any)=>Promise<any>;
       update:(rs:Record[], config:any)=>Promise<any>
       items:Record[]
   }
}


export  const  withRecordView = ()=>{
    return function<T1 extends RecordViewProps>(Type:React.ComponentClass<T1 & WithRecordView>) {
        return class extends RecordViewRef<T1> {
            render(){
                let me = this;
                const {
                    recordViewProps,
                    ...storeProps
                } = me.props as any;
                return <Type
                    recordView={{
                        items:me.items,
                        limit:me.limit,
                        offset:me.offset,
                        length:me.length,
                        sorts:me.sorts,
                        loading:me.loading,
                        read:(c)=>me.read(c),
                        sortFromIndex:(index)=>me.sortFromIndex(index),
                        update:(rs,c)=>me.update(rs,c),
                        configureRecordViewProps:(b ,callback?)=>me.configureRecordViewProps(b,callback)
                    }}
                    {...storeProps}>
                </Type>
            }
        }
    }
}