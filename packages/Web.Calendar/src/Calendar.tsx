import * as React from "react";
import {Component} from "react";
import _BigCalendar ,{BigCalendarProps} from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import * as moment from "moment";
import {Record,  StoreViewProps, WithStoreView, withStoreView} from "../../Data";
import withStyles from "@material-ui/core/styles/withStyles";
import HTML5Backend from 'react-dnd-html5-backend'
import {DragDropContext, DragDropContextProvider} from 'react-dnd'

import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import {Overwrite, WithStyles} from "@material-ui/core";
import classnames from "classnames";
import compose from "recompose/compose";
import "./Calendar.css";
import CircularProgress from "@material-ui/core/CircularProgress";




_BigCalendar['setLocalizer'](_BigCalendar['momentLocalizer'](moment))
// console.log(_BigCalendar['Views'])
// let allViews = Object.keys(_BigCalendar['Views']).map(k => (_BigCalendar['Views'][k]));
export interface CalendarProps extends  BigCalendarProps {
    fieldStartDate:string;
    fieldEndDate:string;
    fieldId:string;
    fieldTitle:string;
    fieldDesc:string;
}
export const CalendarStyles = theme => ({
    calendar:{
        '& .rbc-show-more': {

            color: '#c5cbcc',
            fontWeight: '200' as any

        },
        '& .rbc-event-label': {
           display:'none'
        }
    },
    fitFlex: {
        flexGrow: 1,
        display: 'flex' as  'flex',
        flexDirection: 'column' as 'column'
    }
});

const messages = {
    allDay: 'Todos os Dias',
    previous: '<',
    next: '>',
    today: 'Hoje',
    month: 'Mês',
    week: 'Semana',
    day: 'Dia',
    agenda: 'Agenda',
    date: 'Data',
    time: 'Hora',
    work_week: 'Semana de trabalho',
    event: 'Evento',
    showMore: total => `+ Mais (${total})`
};


const BigCalendar = withDragAndDrop(_BigCalendar,{backend:false});

export class CalendarRef extends Component<CalendarProps & WithStoreView & WithStyles<typeof CalendarStyles>, any> {
    currentDate= new Date();
    currentView =_BigCalendar['Views']['WEEK'];
    get storeView(){
       return this.props.storeView
    }
    constructor(props, context) {
        super(props, context);
        let me = this;
        const  { dateStart , dateEnd } = me.getInterval();
        me.storeView.configureStoreViewProps( { dateStart , dateEnd });
    }

    readRemote(dateStart,dateEnd) {
        let me = this;
        return me.storeView.read({offset: 0, viewData: {dateStart,dateEnd},items:[],loading:true}).catch(function (e) {
        }).then(function () {
        });
    }

    getInterval(){
        let dateStart;
        let me = this;
        let dateEnd;
        let currentView =this.currentView;
        if (currentView== _BigCalendar['Views'].MONTH){
            var startMonth =  moment(this.currentDate).clone().startOf('month');
            var endMonth =  moment(this.currentDate).clone().endOf('month');
            dateStart=  moment(startMonth).clone().subtract(startMonth.day(), 'days').toDate()
            dateEnd=  moment(endMonth).clone().add(6-endMonth.day(), 'days').toDate()
        }else if (currentView== _BigCalendar['Views'].AGENDA){
            var startMonth =  moment(this.currentDate).clone().startOf('month');
            var endMonth =  moment(this.currentDate).clone().endOf('month');
            dateStart=  moment(startMonth).clone().subtract(startMonth.day(), 'days').toDate()
            dateEnd=  moment(endMonth).clone().add(6-endMonth.day(), 'days').toDate()
        }else if (currentView== _BigCalendar['Views'].DAY){
            var startDay =  moment(this.currentDate).clone().startOf('day');
            var endDay =  moment(this.currentDate).clone().endOf('day');
            dateStart=  moment(startDay).clone();
            dateEnd=  moment(endDay).clone();
        }else if (currentView== _BigCalendar['Views'].WEEK){
            var startWeek =  moment(this.currentDate).clone().startOf('week');
            var endWeek =  moment(this.currentDate).clone().endOf('week');
            dateStart=  moment(startWeek).clone();
            dateEnd=  moment(endWeek).clone();
        }else if (currentView== _BigCalendar['Views'].WORK_WEEK){
            var startWeek =  moment(this.currentDate).clone().startOf('week');
            var endWeek =  moment(this.currentDate).clone().endOf('week');
            dateStart=  moment(startWeek).clone();
            dateEnd=  moment(endWeek).clone();
        }
        return {
            dateEnd,
            dateStart
        }
    }

    search() {
        let me = this;
        const  { dateStart , dateEnd } = this.getInterval();
        me.storeView.configureStoreViewProps( { dateStart , dateEnd });
        me.prom = me.readRemote(dateStart,dateEnd);
    }

    moveEvent({event, start, end}) {
        const events = this.storeView.items;
        let records=[];
        const {fieldStartDate,fieldEndDate} = this.props;
        events.map(record => {
            if ( record.id == event.record.id){
                records.push(event.record);
                record.set(fieldStartDate,start)
                record.set(fieldEndDate,end)
            }
            return record;
        });
        this.storeView.update(records,{viewData:{op:'moveEvent'}}).then(function () {

        });

    }
    resizeEvent = (resizeType, {event, start, end}) => {
        const events = this.storeView.items;
        const {fieldStartDate,fieldEndDate} = this.props;
        let records=[];
        events.map(record => {
            if ( record.id == event.record.id){
                records.push(event.record);
                record.set(fieldStartDate,start)
                record.set(fieldEndDate,end)
            }
            return record;
        });
        this.storeView.update(records,{viewData:{op:'moveEvent'}}).then(function () {

        });
    }
    prom: Promise<any> = Promise.resolve([]);
    render() {
        const  me = this;
        const {classes,className,onView,fieldStartDate,fieldEndDate,fieldId,fieldTitle,fieldDesc} = this.props;
        return (
            <div className={classnames("ab-calendar",className, classes.fitFlex, classes.calendar)}>
                <div style={{
                    background: '#00000030',
                    height: 'calc( 100% - 90px)',
                    width: '100%',
                    top: '90px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    pointerEvents: 'none',
                    justifyContent: 'center',
                    position: 'absolute',
                    zIndex: 1000
                }} hidden={!this.storeView.loading}>
                        <div>
                            <CircularProgress variant={'indeterminate'}/>
                        </div>
                </div>

                <BigCalendar
                    {...this.props}
                    selectable
                    popup
                    className={classnames("ab-calendar", classes.fitFlex)}
                    events={this.storeView.items.map(function (r) {
                        return{
                            start:r.get(fieldStartDate),
                            end:r.get(fieldEndDate),
                            record:r,
                            desc:r.get(fieldDesc),
                            title:r.get(fieldTitle),
                            id:r.get(fieldId),
                        }
                    })}
                    onEventDrop={(e) => this.moveEvent(e)}
                    resizable
                    onEventResize={(e, a) => this.resizeEvent(e, a)}
                    messages={messages}
                    views={
                        [
                            _BigCalendar['Views']['MONTH'],
                            _BigCalendar['Views']['WEEK'],
                            _BigCalendar['Views']['DAY'],
                            _BigCalendar['Views']['AGENDA']
                        ]

                    }
                    step={15}
                    onNavigate={(date ,action)=>{
                        this.onNavigate(date ,action);
                    }}

                    onView={(view)=>{
                        this.onView(view);
                        if (onView){
                            onView(view);
                        }
                    }}
                    defaultView={this.currentView}
                    showMultiDayTimes
                    defaultDate={this.currentDate}
                />
            </div>
        )
    }
    private onNavigate(date: any, action: any) {
        this.currentDate=date;
        this.search();
    }
    private onView(view) {

        let me = this;

        me.currentView=view;
        me.search();
    }
}

export  type CalendarType = React.ComponentClass<Overwrite<Overwrite<CalendarProps, StoreViewProps>, Partial<WithStyles<typeof CalendarStyles>>>>
export const Calendar = DragDropContext(HTML5Backend)(compose(withStyles(CalendarStyles), withStoreView())(CalendarRef))  as CalendarType;
