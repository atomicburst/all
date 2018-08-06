import {Record} from "./Record";
import * as React from "react";
export interface  LoadViewProxyData{
    length?:number
    summary?:any
    items?:Record[],
    activeItem?:Record
}
export interface LoadViewUpdateConfig {
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

export  interface LoadViewProps {
    loadViewProps:{
        read:(config:ViewDataReadConfig)=>Promise<LoadViewProxyData>
        update?:(config:LoadViewUpdateConfig)=>Promise<any>
        limit?:number
        mapItems?:any
        multSort?:boolean,
        sorts?:{[dataIndex:string]:'desc'|'asc'}[]
        loadAfterUpdate?:boolean,
        loadVersion:number

    }
}

export class LoadViewRef<T1 extends LoadViewProps=LoadViewProps>  extends React.Component<T1,any>  {
    constructor(props,context){
        super(props,context);
        this.state={
            loadViewProps:{
                length:0,
                ...props.loadViewProps
            }
        };
    }
    componentDidMount(){
        let  props =  this.props;
        console.log(props.loadViewProps)
        if (  props.loadViewProps && props.loadViewProps.loadVersion>-1){
            this.read();
        }
    }
    get length(){
        return this.loadViewProps.length||0
    }
    get offset(){
        return this.loadViewProps.offset||0
    }
    get limit(){
        return this.loadViewProps.limit||35
    }
    get mapItems(){
        return this.loadViewProps.mapItems
    }
    get multSort(){
        return this.loadViewProps.multSort
    }
    get sorts(){
        return this.loadViewProps.sorts||[];
    }
    get loadViewProps (){
        return this.state.loadViewProps;
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
        return this.loadViewProps.loading;
    }
    get items (){
        if (this.loadViewProps.items&&this.loadViewProps.items.length){
            return  this.loadViewProps.items;
        }
        return []
    }
    update(items,c){
        let me = this;
        let viewData = {
            ...(me.defaultViewData||{}),
            ...(c.viewData||{})
        }

        return this.props.loadViewProps.update({items:items,viewData:viewData}).then(function (r) {
            if (me.props.loadViewProps.loadAfterUpdate){
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
        me.configureLoadViewProps({
            items:[]
        })
    }
    configureLoadViewProps(b ,callback?){
        let me = this;
        let ff = {
            loadViewProps:{
                ...me.state.loadViewProps,
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
        me.configureLoadViewProps({...config,viewData:c.viewData,loading:true});
        return this.props.loadViewProps.read(c).then(function (r) {
            let items = r.items||[];
            if (me.mapItems){
                items =  items.map(me.mapItems);
            }
            me.configureLoadViewProps({
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
                me.configureLoadViewProps({
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
        console.log("dfgsdgsdg")
        let props = this.props as any;
        let nextProps = _nextProps as any;
        if (!nextProps.loadViewProps){
            return
        }
        let b =false;
        if (props.loadViewProps.limit!=nextProps.loadViewProps.limit){
            b = true;
        }
        if (props.loadViewProps.sorts!=nextProps.loadViewProps.sorts){
            b = true;
        }
        if (props.loadViewProps.loadAfterUpdate!=nextProps.loadViewProps.loadAfterUpdate){
            b = true;
        }


        if (props.loadViewProps.loadVersion!=nextProps.loadViewProps.loadVersion){
           this.read()
        }

        if (b) {
            me.configureLoadViewProps(nextProps.loadViewProps);
        }
    }
}
export interface  WithLoadView  {
   loadView:{
       configureLoadViewProps:(d)=>void;
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


export  const  withLoadView = ()=>{
    return function<T1 extends LoadViewProps>(Type:React.ComponentClass<T1 & WithLoadView>) {
        return class extends LoadViewRef<T1> {
            render(){
                let me = this;
                const {
                    loadViewProps,
                    ...storeProps
                } = me.props as any;
                return <Type
                    loadView={{
                        items:me.items,
                        limit:me.limit,
                        offset:me.offset,
                        length:me.length,
                        sorts:me.sorts,
                        loading:me.loading,
                        read:(c)=>me.read(c),
                        sortFromIndex:(index)=>me.sortFromIndex(index),
                        update:(rs,c)=>me.update(rs,c),
                        configureLoadViewProps:(b ,callback?)=>me.configureLoadViewProps(b,callback)
                    }}
                    {...storeProps}>
                </Type>
            }
        }
    }
}