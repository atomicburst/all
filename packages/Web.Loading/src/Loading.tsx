import * as React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import {WithStyles} from "@material-ui/core";
import CircularProgress from '@material-ui/core/CircularProgress';

export interface LoadingProps {
    loadingRef?: (e: LoadingRef) => void
    loading: boolean
}


const LoadingStyles = theme => ({
    loadingContainer: {
        background: 'rgba(0, 0, 0, 0.14)',
        position: 'absolute'as 'absolute',
        display: 'flex'as 'flex',
        height: '100%',
        width: '100%',
        justifyContent: 'center' as 'center',
        alignItems: 'center'  as 'center'
    },
    loading: {}
});

export class LoadingRef extends React.Component<LoadingProps & WithStyles<typeof LoadingStyles>, any> {
    constructor(props, context) {
        super(props, context);
        this.state = {open: false, status: "success"};
        let loadingRef = this.props.loadingRef || function () {
        };
        loadingRef(this);
    }

    render() {
        const {classes, loading} = this.props;
        return <>
            <div className={classes.loadingContainer} hidden={!loading}>
                <div className={classes.loading}>
                    <CircularProgress variant={'indeterminate'}/>
                </div>
            </div>
        </>

    }

}
export  const Loading = withStyles(LoadingStyles)(LoadingRef);