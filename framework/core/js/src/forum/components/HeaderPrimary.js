import Component from '../../common/Component';
import ItemList from '../../common/utils/ItemList';
import listItems from '../../common/helpers/listItems';

/**
 * The `HeaderPrimary` component displays primary header controls. On the
 * default skin, these are shown just to the right of the forum title.
 */
export default class HeaderPrimary extends Component {
  /**
   * @return {import('mithril').Children}
   */
  view() {
    return <ul className="Header-controls">{listItems(this.items().toArray())}</ul>;
  }

  /**
   * Build an item list for the controls.
   *
   * @return {ItemList<import('mithril').Children>}
   */
  items() {
    return new ItemList();
  }
}
