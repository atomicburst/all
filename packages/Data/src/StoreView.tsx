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

export  interface StoreViewProps {
    storeViewProps:{
        read:(config:ViewDataReadConfig)=>Promise<ViewDataProxyData>
        update?:(config:ViewDataUpdateConfig)=>Promise<any>
        limit?:number
        mapItems?:any
        multSort?:boolean,
        sorts?:{[dataIndex:string]:'desc'|'asc'}[]
        loadAfterUpdate?:boolean
    }
    storeViewRef?:(e:StoreViewRef)=>void
}

export class StoreViewRef<T1 extends StoreViewProps=StoreViewProps>  extends React.Component<T1,any>  {
    constructor(props,context){
        super(props,context);
        this.state={
            storeViewProps:{
                length:0,
                ...props.storeViewProps
            }
        };
        if ( this.props.storeViewRef){
            this.props.storeViewRef(this);
        }
    }
    get length(){
        return this.storeViewProps.length||0
    }
    get offset(){
        return this.storeViewProps.offset||0
    }
    get limit(){
        return this.storeViewProps.limit||35
    }
    get mapItems(){
        return this.storeViewProps.mapItems
    }
    get multSort(){
        return this.storeViewProps.multSort
    }
    get sorts(){
        return this.storeViewProps.sorts||[];
    }
    get storeViewProps (){
        return this.state.storeViewProps;
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


    //
    // sortToggleFromIndex(dataIndex: string) {
    //     let sorts =[]
    //     let me = this;
    //     let b=true;
    //     for(let ii of this.sorts){
    //         for (let  k in  ii){
    //             let i2={};
    //             if (k==dataIndex){
    //                 b=false;
    //                 if (ii[k]=='asc'){
    //                     i2[k]='desc'
    //                 }else if (ii[k]=='desc'){
    //                     i2[k]=undefined
    //                 }else {
    //                     i2[k]='asc'
    //                 }
    //                 sorts.push(i2)
    //             }else {
    //                 if (me.multSort){
    //                     sorts.push(ii)
    //                 }
    //             }
    //         }
    //     }
    //     if (b){
    //         let o ={};
    //         o[dataIndex]='asc';
    //         sorts.push(o)
    //     }
    // }

    get loading (){
        return this.storeViewProps.loading;
    }
    get items (){
        if (this.storeViewProps.items&&this.storeViewProps.items.length){
            return  this.storeViewProps.items;
        }
        return []
    }
    update(items,c){
        let me = this;
        let viewData = {
            ...(me.defaultViewData||{}),
            ...(c.viewData||{})
        }

        return this.props.storeViewProps.update({items:items,viewData:viewData}).then(function (r) {
            if (me.props.storeViewProps.loadAfterUpdate){
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
        me.configureStoreViewProps({
            items:[]
        })
    }
    configureStoreViewProps(b ,callback?){
        let me = this;
        let ff = {
            storeViewProps:{
                ...me.state.storeViewProps,
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
        me.configureStoreViewProps({...config,viewData:c.viewData,loading:true});
        return this.props.storeViewProps.read(c).then(function (r) {
            let items = r.items||[];
            if (me.mapItems){
                items =  items.map(me.mapItems);
            }
            me.configureStoreViewProps({
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
                me.configureStoreViewProps({
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
        if (props.storeViewProps.limit!=nextProps.storeViewProps.limit){
            b = true;
        }
        if (props.storeViewProps.sorts!=nextProps.storeViewProps.sorts){
            b = true;
        }
        if (props.storeViewProps.loadAfterUpdate!=nextProps.storeViewProps.loadAfterUpdate){
            b = true;
        }
        if (b) {
            me.configureStoreViewProps(nextProps.storeViewProps);
        }
    }
}
export interface  WithStoreView  {
   storeView:{
       configureStoreViewProps:(d)=>void;
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


export  const  withStoreView = ()=>{
    return function<T1 extends StoreViewProps>(Type:React.ComponentClass<T1 & WithStoreView>) {
        return class extends StoreViewRef<T1> {
            render(){
                let me = this;
                const {
                    storeViewProps,
                    ...storeProps
                } = me.props as any;
                return <Type
                    storeView={{
                        items:me.items,
                        limit:me.limit,
                        offset:me.offset,
                        length:me.length,
                        sorts:me.sorts,
                        loading:me.loading,
                        read:(c)=>me.read(c),
                        sortFromIndex:(index)=>me.sortFromIndex(index),
                        update:(rs,c)=>me.update(rs,c),
                        configureStoreViewProps:(b ,callback?)=>me.configureStoreViewProps(b,callback)
                    }}
                    {...storeProps}>
                </Type>
            }
        }
    }
}