import React from 'react';
import PropTypes from 'prop-types';


class Table extends React.Component {
    render() {
        return (
            <>
                <table className="table">
                    {this.renderHead()}
                    {this.renderBody()}
                </table>
            </>
        )
    }

    renderHead() {
        return (
            <thead>
                <tr>
                    {this.props.columns.map((column) => {
                        return (
                            <th scope="col" key={column.fieldName}>
                                {column.displayName}
                            </th>
                        );
                    })}
                </tr>
            </thead>
        );
    }

    renderBody() {
        return (
            <tbody>
                {this.props.data.map(this.renderRow.bind(this))}
            </tbody>
        );
    }

    renderRow(record) {
        let baseKey = record[this.props.uniqueFieldName];
        return (
            <tr key={baseKey}>
                { this.props.columns.map(this.renderRowCell.bind(this, baseKey, record)) }
            </tr>
        )
    }

    renderRowCell(rowKey, record, column) {
        return (
            <td key={rowKey + '-' + column.fieldName}>
                {
                    (typeof column !== 'function') ? (
                        record[column.fieldName]
                    ) : (
                        column(rowKey, record)
                    )
                }
            </td>
        );
    }
}

Table.propTypes = {
    // The list of rows of data to display
    data: PropTypes.array,

    // The list of column name objects {fieldName: ..., displayName: ...} to display
    columns: PropTypes.arrayOf(PropTypes.object),

    // The unique attribute field name
    uniqueFieldName: PropTypes.string,
}
export default Table;