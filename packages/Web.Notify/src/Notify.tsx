import * as React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Snackbar from "@material-ui/core/Snackbar";
import Slide from "@material-ui/core/Slide";
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import {WithStyles} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import IconClose from "@material-ui/icons/Close";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import WarningIcon from '@material-ui/icons/Warning';
import classNames from 'classnames';
import {SnackbarProps} from "@material-ui/core/Snackbar/Snackbar";


const NotifyStyles = theme => ({
    success: {
        backgroundColor: green[600]
    },
    error: {
        backgroundColor: theme.palette.error.dark,
    },
    info: {
        backgroundColor: theme.palette.primary.dark,
    },
    warning: {
        backgroundColor: amber[700],
    },
    icon: {
        fontSize: 20,
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing.unit,
    },
    message: {
        display: 'flex',
        alignItems: 'center',
    },
    snackbar: {
        '@media (min-width: 960px)':{
            left: 'auto',
            top: '-90%',
            right: '0px'
        }
    },
    close: {
        width: theme.spacing.unit * 4,
        height: theme.spacing.unit * 4,
    }
});

export type NotifyProps =SnackbarProps &{status:NotifyStatus}& Partial<WithStyles<typeof  NotifyStyles>>
export  type NotifyStatus = "success" | "error" | "info" | "warning"

const variantIcon = {
    success: CheckCircleIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    info: InfoIcon,
};


export const NotifyRef = (props:NotifyProps) => {
    const { classes ,status ,message, autoHideDuration} = props;
    const Icon = variantIcon[status];
    return   <Snackbar
        classes={{
            root: classes.snackbar
        }}
        ContentProps={{
            classes: {
                root: classes[status]
            }
        }}
        action={[
            <IconButton
                key="close"
                aria-label="Close"
                color="inherit"
                className={classes.close}
                onClick={(e) => props.onClose(e,message as any)}
            >
                <IconClose />
            </IconButton>,
        ]}
        autoHideDuration={autoHideDuration||1000}
        message={
            <span id="client-snackbar" className={classes.message}>
                      <Icon className={classNames(classes.icon, classes.iconVariant)} />
                {message}
                 </span>
        }
        {...this.props}
    />
}

export const Notify = withStyles(NotifyStyles)(NotifyRef);