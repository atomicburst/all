import * as React from 'react';
import {SizeMe} from 'react-sizeme'
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import TablePagination from "@material-ui/core/TablePagination";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import {DatatableRef} from "./Datatable";
const theme = createMuiTheme({
    overrides: {
        MuiTablePagination: {
            toolbar: {

                height: '42px',
                minHeight: '42px',
            }
        },
        MuiIconButton: {
            root: {
                height: '35px',
                width: '35px'
            }

        }
    }
});
export const Pagination = ({datatableRef, columns}: { datatableRef: DatatableRef, columns: any }) => {
    const {onClickItem, classes} = datatableRef.props;
    let page = Math.trunc(datatableRef.loadView.offset / datatableRef.loadView.limit);
    let rowsPerPageOptions = [8, 50, 100];
    if (rowsPerPageOptions.indexOf(datatableRef.loadView.limit) == -1) {
        rowsPerPageOptions.push(datatableRef.loadView.limit)
        rowsPerPageOptions.sort((a, b) => {
            return a - b;
        });
    }
    return <>
        <MuiThemeProvider theme={theme}>
    <TablePagination
        component="div"
    count={datatableRef.loadView.length}
    rowsPerPage={datatableRef.loadView.limit}
    page={page}
    labelDisplayedRows={({from, to, count}) => `${from}-${to} de ${count}`}
    labelRowsPerPage={"Linhas por pagina"}
    backIconButtonProps={{
        'aria-label': 'Previous Page',
    }}
    nextIconButtonProps={{
        'aria-label': 'Next Page',
    }}
    rowsPerPageOptions={rowsPerPageOptions}
    onChangePage={(event, page) => datatableRef.handleChangePage(event, page)}
    onChangeRowsPerPage={(event) => datatableRef.handleChangeRowsPerPage(event)}
    />
    </MuiThemeProvider>
    </>
}