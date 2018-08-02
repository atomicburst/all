import * as React from "react";
import * as ReactPropTypes from "prop-types";
export  class FocusManager{
    private fields=[];
    focusKeyCode =13;
    unregister(field){
        let index =this.fields.indexOf(field);
        if (index>-1){
            this.fields.splice(index,1)
        }
    }
    register(f,index=-1){
        this.unregister(f);
        if (index==-1){
            this.fields.push(f)
        }else {
            this.fields[index];
        }
    }
    next(field) {
        let index =this.fields.indexOf(field)
        let input ;
        if (index>-1){
            if ((index+1)>=this.fields.length){
                input = this.fields[0].getInput()
            }else if (this.fields[index+1]) {
                input = this.fields[index+1].getInput()
            }
        }
        if (input){
            input.focus()
        }
    }
}
export  class FocusFieldProps{
    index?:number;
    focusManager:FocusManager
    disable?:boolean
}
export  class FocusManagerFieldProps{
    next:()=>void;
    focusKeyCode:any;
    registreInput:(getInput)=>void
}

export interface WithFocusManagerField {
    focusManagerField:FocusManagerFieldProps
}
export interface FocusManagerFieldProps {
    focusFieldProps:FocusFieldProps
}

export const withFocusManagerField= () => {
    return function <T1 extends FocusManagerFieldProps>(Type: React.ComponentClass<T1>) {
        return class  extends React.Component<T1 & WithFocusManagerField , any> {
            focusManagerDefault=new FocusManager();
            get focusManager(){
                return this.props.focusFieldProps&&this.props.focusFieldProps.focusManager||this.focusManagerDefault;
            }
            register(): any {
                this.focusManager.register(this);
            }
            unregister(): any {
                this.focusManager.unregister(this);
            }
            getInput:(()=> React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>)
            next(){
                this.focusManager.next(this);
            }
            get focusKeyCode(){
                return this.focusManager.focusKeyCode
            }
            componentWillUpdate(){
                let me = this;
            }
            constructor(props, context) {
                super(props, context);
                let me = this;
                this.register();
            }
            componentWillUnmount() {
                let me = this;
                me.unregister()
            }
            render() {
                let me = this;
                const {
                    focusFieldProps,
                    ...recordProps
                } = me.props as any;
                return <Type  focusManagerField={{
                    next:()=>{
                        me.next();
                    },
                    registreInput:(getInput)=>{
                       me.getInput =getInput;
                    },
                    focusKeyCode:me.focusKeyCode
                }}  {...recordProps}    ></Type>
            }
        }
    }
}