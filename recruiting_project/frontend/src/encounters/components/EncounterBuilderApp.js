import React from 'react';
import { DebounceInput } from 'react-debounce-input';
import BaseApp from 'core/components/BaseApp';
import Table from 'core/components/Table';
import request from 'utils/request';

class EncounterBuilderApp extends BaseApp {
    constructor() {
        super();

        this.columns = [
            {fieldName: 'id', displayName: 'ID'},
            {fieldName: 'name', displayName: 'Name'},
            {fieldName: 'model', displayName: 'Model'},
            {fieldName: 'starship_class_name', displayName: 'Class'},
            this.renderActions.bind(this),
        ];
        this.state = {
            encounter: {
                starships: [],
            },
            starships: [],
        };
    }

    componentDidMount() {
        this.loadStarships();
    }

    render() {
        return (
            <div className="container-fluid">
                {this.renderHeader()}
                <div className="container mt-4">
                    <div className="row">
                        {this.renderBody()}
                    </div>
                </div>
            </div>
        );
    }

    renderHeader() {
        return (
            <div className="navbar navbar-expand-lg fixed-top navbar-dark bg-primary">
                <div className="container">
                    <a className="navbar-brand" href="/">Star Wars RPG Encounter Builder</a>
                </div>
            </div>
        )
    }

    renderBody() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-lg-9 h-100">
                        {this.renderStarshipsGrid()}
                    </div>
                    <div className="col-lg-3 h-100">
                        {this.renderSummary()}
                    </div>
                </div>
            </div>
        );
    }

    renderStarshipsGrid() {
        return this.state.starships ? (
            <>
                <h4>Starships</h4>
                <form className="row">
                    <div className="col-lg-3">
                        <DebounceInput
                            className="form-control"
                            placeholder="Search"
                            debounceTimeout={250}
                            onChange={event => this.handleSearch(event.target.value)}
                        />
                    </div>
                </form>
                <Table
                    data={this.state.starships}
                    columns={this.columns}
                    uniqueFieldName='id' />
            </>
        ) : null;
    }

    /**
     * Renders a list of the starships added to this encounter
     */
    renderSummary() {
        return (
            <>
                <h4>Encounter Summary</h4>
                <ul id="encounter-starships">
                </ul>
                <form>
                    { this.renderCreateEncounterButton() }
                </form>
            </>
        );
    }

    renderCreateEncounterButton() {
        return this.state.encounter.starships.length ? (
            <button type="submit" className="btn btn-primary">Create Encounter</button>
        ) : (
            <span>Add starships to encounter to create</span>
        );
    }

    renderActions(id) {
        return (
            <button className="btn btn-secondary" onClick={() => this.handleAddShip(id)}>Add</button>
        )
    }

    handleAddShip(id) {
        this.setState({
            encounter: {
                starships: [...this.state.encounter.starships, id],
            }
        })
    }

    handleSearch(searchTerm) {
        this.loadStarships(searchTerm)
    }

    loadStarships(searchTerm) {
        let params = {}
        if (searchTerm != null) {
            params['q'] = searchTerm;
        }

        request.get(
            '/encounters/api/starships',
            params
        ).then((response) => {
            this.setState({
                starships: response.data.results
            });
        })
    }
}

export default EncounterBuilderApp;
