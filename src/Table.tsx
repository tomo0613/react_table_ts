import * as React from 'react';
import {AutoSizer, Table ,Column} from 'react-virtualized';

type Size = {width: number, height: number};

type TableColumn = React.ReactNode;

type ColumnProps =  {
    dataKey: string,
    label: string,
    width: number,
    headerRenderer?: any,
    cellRenderer?: any,
    disableSort?: boolean,
    flexGrow?: number,
};

interface IProps {
    autoWidth?: boolean;
    autoHeight?: boolean;
    rows: any[];
    columns: ColumnProps[];
    width?: number;
    height?: number;
    select?: 'single'|'multiple';
};

interface IState {
    rowCount: number;
    rows: any[];
    sortBy: string;
    sortDirection: 'ASC'|'DESC';
}

class ReactVirtualizedTable extends React.Component<IProps, IState> {
    private columns: TableColumn[];
    width: number;
    height: number;
    headerHeight: number;
    rowHeight: number;
    rowCount: number;
    rowGetter: (row: any) => any;

    constructor(props) {
        super(props);

        this.headerHeight = props.headerHeight || 30;
        this.rowHeight = props.rowHeight || 25;
        this.rowGetter = props.rowGetter || ((row) => this.state.rows[row.index]);
        this.columns = props.columns.map((column: ColumnProps) => {
            return (
                <Column key={column.dataKey} {...column} />
            )
        });

        this.state = {
            rowCount: props.rowCount || props.rows.length,
            rows: cloneArray(props.rows),
            sortBy: props.sortBy,
            sortDirection: props.sortDirection,
        };
    }

    render() {
        return (
            <div className="tableContainer">
                <AutoSizer disableWidth={!this.props.autoWidth} disableHeight={!this.props.autoHeight}>
                    {
                        (size: Size) =>
                        <Table
                            width={this.props.width || size.width}
                            height={this.props.height || size.height}
                            headerHeight={this.headerHeight}
                            rowHeight={this.rowHeight}
                            rowCount={this.state.rowCount}
                            rowGetter={this.rowGetter}
                            noRowsRenderer={this.createListPlaceholder}
                            sort={this.sortHandler}
                            sortBy={this.state.sortBy}
                            sortDirection={this.state.sortDirection}
                            onRowClick={this.selectHandler}
                            rowClassName={this.rowStyleHandler}
                        >
                            {this.columns}
                        </Table>
                    }
                </AutoSizer>
            </div>
        );
    }

    filter = (searchFor: string, dataKeys?: string[]) => {
        const keys = dataKeys || this.props.columns.map((column) => column.dataKey);
        let regex;
        
        regex = new RegExp(escapeRegExp(searchFor), 'i');

        const filteredList = this.props.rows.filter((row) => {
            const searchIn = keys.reduce((sum, key) => sum + ' ' + row[key], '');
            
            return regex.test(searchIn);
        });        

        this.setState({
            rowCount: filteredList.length,
            rows: filteredList,
        })
    }

    getSelected = () => {
        return this.state.rows.filter((row) => row.selected);
    }
// TODO solve select re render
    selectAll = (allSelected) => {
        if (this.props.select != 'multiple') {
            return;
        }

        const list = this.state.rows.map((row) => {
            row.selected = allSelected;
            
            return row;
        });

        this.setState({
            rows: list,
        });
    }

    private selectHandler = (row) => {
        if (!this.props.select) {
            return;
        }

        const list = cloneArray(this.state.rows);

        if (this.props.select == 'single') {
            for(let i = 0; i < list.length; i++) {
                if (list[i].selected) {
                    list[i].selected = false;
                }
            }
        }

        list[row.index].selected = !list[row.index].selected;

        this.setState({
            rows: list,
        });        
    }

    private sortHandler = (sort) => {
        let direction = this.state.sortDirection || sort.sortDirection;
        direction = direction === 'ASC' ? 'DESC' : 'ASC';

        const list = cloneArray(this.state.rows);
        const sortBy = sort.sortBy;
        const sortedList = list.sort((a, b) => {
            const primary = direction == 'ASC' ? b[sortBy] : a[sortBy];
            const secondary = direction == 'ASC' ? a[sortBy] : b[sortBy];

            if (isNaN(primary) || isNaN(secondary)) {
                return String(primary).localeCompare(String(secondary))
            }
            return primary - secondary;
        });

        this.setState({
            sortBy: sortBy,
            sortDirection: direction,
            rows: sortedList,
        });
    }

    private rowStyleHandler = (row) => {
        const rowData = this.rowGetter(row);

        if (rowData && rowData.selected) {
            return 'selected';
        }        
    }

    private createListPlaceholder = () => {
        return (
            <div className="emptyListPlaceholder">No result</div>
        )
    }
}

export default ReactVirtualizedTable;

function escapeRegExp(string) {
    // return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); //MDN v
    return string.replace(/^\*|\\$|\[(?!.*\])|\((?!.*\))/g, '\\$&');
}

function cloneArray(array) {
    return array.slice(0)
}
