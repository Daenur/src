// GridViewContainer container component for the GridView presentation component.
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { GridView } from './GridView';
import { addItemAction, removeItemAction, changeItemAction, changeCountAction } from './actions';
const mapStateToProps = state => ({
    items: state.items,
    itemCount: state.itemCount
});
const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        addItemAction, removeItemAction, changeItemAction, changeCountAction
    }, dispatch);
};
export const GridViewContainer = connect(mapStateToProps, mapDispatchToProps)(GridView);
