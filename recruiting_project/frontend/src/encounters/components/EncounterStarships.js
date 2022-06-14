import React from 'react'
import PropTypes from 'prop-types';
import Table from '../../core/components/Table';

function EncounterStarships({ encounterStarships, handleRemoveShip }) {
    const renderActions = (rowKey, record, index) => (
        <button className="btn btn-secondary" onClick={() => handleRemoveShip(index)}>Remove</button>
    );
    const columns = [
        {fieldName: 'name', displayName: 'Name'},
        renderActions,
    ];

    return (
        <Table data={encounterStarships} columns={columns} />
    );
}

EncounterStarships.propTypes = {
    encounterStarships: PropTypes.any,
    handleRemoveShip: PropTypes.any,
};

export default EncounterStarships;
