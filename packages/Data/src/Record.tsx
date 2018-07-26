import {Observable} from "rxjs";
import {Subject} from "rxjs/Rx";

import * as React from 'react';

let ID = 0;
const link: any = {};

export type RecordSubject<T> = {
    subject: Subject<{
        origin:string,
        data:T,
    }>,
    record: Record,
    key: Record
}
export class Record<T=any> {
    public  id;
    constructor(model?: T) {
        this.data = model || {} as T;
        this.id = "record-" + (ID++);
    }
    static fromArray(array) {
        if (!(array && array.length))
            return null;
        if (array[0] instanceof Record)
            return array;
        let items = [];
        for (let a of array)
            items.push(new Record(a));
        return items;
    }
    static fromObject(object) {
        if (!object)
            return null;
        if (object instanceof Record)
            return object;
        return new Record(object);
    }
    data: T;
    get(key, d?) {
        let me = this;
        let keys = key.split(".");
        let lastKey = keys.pop();
        if (!me.data) {
            return null;
        }
        let o = me.data;
        for (let k of keys) {
            if (!o[k]) {
                return d;
            }
            o = o[k];
        }
        if (o[lastKey] === undefined)
            d;
        return o[lastKey];
    }
    exist(key, d?) {
        return this.get(key, d) !== undefined;
    }

    evt: {
        [key: string]: RecordSubject<T>;
    } = {};
    on(k): Subject<{
        origin:string,
        data:T,

    }> {
        let me = this;
        if (!me.evt[k]) {
            me.evt[k] = {
                subject: new Subject<{
                    origin:string,
                    data:T,

                }>(),
                record: this,
                key: k
            };
        }
        return me.evt[k].subject;
    }
    set(key, value , origin = "default") {
        let me = this;
        if (value instanceof Observable) {
            let sub = value.subscribe(function(v) {
                sub.unsubscribe();
                me.set(key, v , origin);
            });
            return;
        }
        if (Array.isArray(value) && value[0] instanceof Record) {
            let iii = [];
            for (let d of value) {
                iii.push(d.getData());
            }
            value = iii;
        }
        if (value instanceof Record) {
            value = value.getData();
        }
        let k = me.get(key);
        let keys = key.split(".");
        let lastKey = keys.pop();
        if (!me.data) {
            me.data = {} as T;
        }
        let o = me.data;
        for (let k of keys) {
            if (!o[k]) {
                o[k] = {};
            }
            o = o[k];
        }
        o[lastKey] = value;
        if (value != k) {
            me.on(key).next({
                data:value,
                origin:origin
            });
        }
        return me;
    }
    delete(key) {
        let me = this;
        let keys = key.split(".");
        let lastKey = keys.pop();
        if (!me.data) {
            me.data = {} as T;
        }
        let o = me.data;
        for (let k of keys) {
            if (!o[k]) {
                o[k] = {};
            }
            o = o[k];
        }
        delete o[lastKey];
        return me;
    }
    replace(opt) {
        let values: any = {};
        for (let k in opt)
            values[k] = this.get(k);
        for (let k in opt)
            this.delete(k);
        for (let k in opt)
            this.set(opt[k], values[k]);
        return this;
    }

    replaceAndClone(opt) {
       let r = new Record(this.getData())
       r.replace(opt);
       return r;
    }





    getData() {
        return this.data;
    }
}