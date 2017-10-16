import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Icon from './Icon';
import Table from './Table';

import './master.css';
import 'react-virtualized/styles.css'

import createTestData from './testData';

class Main extends React.Component {
    private columns;
    constructor(props) {
        super(props);

        this.columns = [
            {
                dataKey: 'isSelected',
                width: 30,
                disableSort: true,
                headerRenderer: () => {
                    return (
                        <input type="checkbox" onChange={this.selectAllHandler} />
                    );
                },
                cellRenderer: (row) => {
                    return (
                        <input 
                            type="checkbox"
                            checked={row.rowData.selected === undefined ? false : row.rowData.selected}
                            onChange={() => {}}
                        />
                    );
                },
            }, {
                dataKey: 'id',
                label: 'ID',
                width: 40,
            }, {
                dataKey: 'sort',
                label: 'Sort',
                width: 80,
            }, {
                dataKey: 'name',
                label: 'Name',
                width: 400,
            }, {
                dataKey: 'email',
                label: 'E-mail',
                width: 200,
            },
        ];
    }

    render() {
        return (
            <div id="main">
                <h2>react-virtualized table</h2>
                <input type="text" placeholder="filter" onChange={this.filterHandler} />
                <Icon icon="enlarger"/>
                <Table
                    ref="table"
                    columns={this.columns}
                    rows={createTestData()}
                    autoWidth={true}
                    height={300}
                    select="multiple"
                />
                <button onClick={this.getTableData}>Get selected data</button>
            </div>
        );
    }

    filterHandler = (e) => {
        this.refs.table.filter(e.currentTarget.value);
    };

    getTableData = () => {
        console.log(this.refs.table.getSelected());
    };
    
    selectAllHandler = (e) => {
        this.refs.table.selectAll(e.currentTarget.checked);
    }
}

ReactDOM.render(
    <Main />, document.getElementById('rootElement')
);
