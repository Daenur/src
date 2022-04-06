// React
import * as React from 'react';
//
// Wijmo
import * as wjInput from '@grapecity/wijmo.react.input';
import * as wjFlexGrid from '@grapecity/wijmo.react.grid';
import * as wjGroupPanel from '@grapecity/wijmo.react.grid.grouppanel';
import * as wjGridFilter from '@grapecity/wijmo.react.grid.filter';
//
// Wijmo ImmutabilityProvider
import { DataChangeAction } from '@grapecity/wijmo.grid.immutable';
import { ImmutabilityProvider } from '@grapecity/wijmo.react.grid.immutable';
//
// Presentation component with an editable Redux grid
export class GridView extends React.Component {
    constructor(props) {
        super(props);
        this.onCountChanged = this.onCountChanged.bind(this);
        this.onGridInitialized = this.onGridInitialized.bind(this);
        this.onGridDataChanged = this.onGridDataChanged.bind(this);
        this.groupPanelRef = React.createRef();
        // We store local UI related data in the local state, for simplicity,
        // to not bloat global store with irrelevant data.
        this.state = {
            showStoreData: true
        };
    }
    render() {
        return <div className='container-fluid'>

            <div>
                <div>
                    <wjInput.Menu header='Item Count' value={this.props.itemCount} itemClicked={this.onCountChanged}>

                    </wjInput.Menu>
                </div>
                <wjGroupPanel.GroupPanel ref={this.groupPanelRef} placeholder="Drag columns here to create groups."/>
            </div>
            <div>
                <wjFlexGrid.FlexGrid allowAddNew allowDelete initialized={this.onGridInitialized}>
                    <ImmutabilityProvider itemsSource={this.props.items} dataChanged={this.onGridDataChanged}/>
                    <wjGridFilter.FlexGridFilter />
                    <wjFlexGrid.FlexGridColumn binding="id" header="ID" width={80} isReadOnly={true}/>
                    <wjFlexGrid.FlexGridColumn binding="start" header="Date" format="d"/>
                    <wjFlexGrid.FlexGridColumn binding="end" header="Time" format="t"/>
                    <wjFlexGrid.FlexGridColumn binding="country" header="Country"/>
                    <wjFlexGrid.FlexGridColumn binding="product" header="Product"/>
                    <wjFlexGrid.FlexGridColumn binding="sales" header="Sales" format="n2"/>
                    <wjFlexGrid.FlexGridColumn binding="downloads" header="Downloads" format="n0"/>
                    <wjFlexGrid.FlexGridColumn binding="active" header="Active" width={80}/>
                </wjFlexGrid.FlexGrid>
            </div>

            <div>
                <input type="checkbox" checked={this.state.showStoreData} onChange={(e) => {
            this.setState({ showStoreData: e.target.checked });
        }}/>
                {' '}
                <b>Show data</b>
                <wjFlexGrid.FlexGrid itemsSource={this.state.showStoreData ? this.props.items : null} isReadOnly/>
            </div>

        </div>;
    }
    onCountChanged(s) {
        this.props.changeCountAction(s.selectedValue);
    }
    onGridInitialized(s) {
        // Attach group panel
        this.groupPanelRef.current.control.grid = s;
    }
    // Dispatches data change actions to the Redux Store in response to
    // user edits made via the grid.
    onGridDataChanged(s, e) {
        switch (e.action) {
            case DataChangeAction.Add:
                this.props.addItemAction(e.newItem);
                break;
            case DataChangeAction.Remove:
                this.props.removeItemAction(e.newItem, e.itemIndex);
                break;
            case DataChangeAction.Change:
                this.props.changeItemAction(e.newItem, e.itemIndex);
                break;
            default:
                throw 'Unknown data action';
        }
    }
}
