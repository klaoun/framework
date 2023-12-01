import app from '../app';
import type { IFormModalAttrs } from '../../common/components/FormModal';
import FormModal from '../../common/components/FormModal';
import type Mithril from 'mithril';
import type SearchState from '../../common/states/SearchState';
import KeyboardNavigatable from '../../common/utils/KeyboardNavigatable';
import SearchManager from '../../common/SearchManager';
import extractText from '../../common/utils/extractText';
import Input from '../../common/components/Input';
import Button from '../../common/components/Button';
import Stream from '../../common/utils/Stream';
import InfoTile from '../../common/components/InfoTile';
import LoadingIndicator from '../../common/components/LoadingIndicator';
import type { SearchSource } from './Search';
import type IGambit from '../../common/query/IGambit';
import { GambitType, type GroupedGambitSuggestion, type KeyValueGambitSuggestion } from '../../common/query/IGambit';
import AutocompleteReader, { type AutocompleteCheck } from '../../common/utils/AutocompleteReader';
import ItemList from '../../common/utils/ItemList';

export interface ISearchModalAttrs extends IFormModalAttrs {
  onchange: (value: string) => void;
  searchState: SearchState;
  sources: SearchSource[];
}

export default class SearchModal<CustomAttrs extends ISearchModalAttrs = ISearchModalAttrs> extends FormModal<CustomAttrs> {
  public static LIMIT = 6;

  protected searchState!: SearchState;

  /**
   * An array of SearchSources.
   */
  protected sources!: SearchSource[];

  /**
   * The key of the currently-active search source.
   */
  protected activeSource!: Stream<SearchSource>;

  /**
   * The sources that are still loading results.
   */
  protected loadingSources: string[] = [];

  /**
   * The index of the currently-selected <li> in the results list. This can be
   * a unique string (to account for the fact that an item's position may jump
   * around as new results load), but otherwise it will be numeric (the
   * sequential position within the list).
   */
  protected index: number = 0;

  protected navigator!: KeyboardNavigatable;

  protected searchTimeout?: number;

  protected inputScroll = Stream(0);

  oninit(vnode: Mithril.Vnode<CustomAttrs, this>) {
    super.oninit(vnode);

    this.searchState = this.attrs.searchState;
    this.sources = this.attrs.sources;
  }

  title(): Mithril.Children {
    return app.translator.trans('core.forum.search.title');
  }

  className(): string {
    return 'SearchModal Modal--flat';
  }

  content(): Mithril.Children {
    // Initialize the active source.
    if (!this.activeSource) this.activeSource = Stream(this.sources[0]);

    const searchLabel = extractText(app.translator.trans('core.forum.search.placeholder'));

    return (
      <div className="Modal-body SearchModal-body">
        <div className="SearchModal-form">
          <Input
            key="search"
            type="search"
            loading={!!this.loadingSources.length}
            clearable={true}
            clearLabel={app.translator.trans('core.forum.header.search_clear_button_accessible_label')}
            prefixIcon="fas fa-search"
            aria-label={searchLabel}
            placeholder={searchLabel}
            value={this.searchState.getValue()}
            onchange={(value: string) => {
              this.searchState.setValue(value);
              this.inputScroll(this.inputElement()[0]?.scrollLeft ?? 0);
            }}
            inputAttrs={{ className: 'SearchModal-input' }}
            renderInput={(attrs: any) => (
              <>
                <input {...attrs} onscroll={(e: Event) => this.inputScroll((e.target as HTMLInputElement).scrollLeft)} />
                <div className="SearchModal-visual-wrapper">
                  <div className="SearchModal-visual-input" style={{ left: '-' + this.inputScroll() + 'px' }}>
                    {this.gambifyInput()}
                  </div>
                </div>
              </>
            )}
          />
        </div>
        {this.tabs()}
      </div>
    );
  }

  tabs(): JSX.Element {
    return (
      <div className="SearchModal-tabs">
        <div className="SearchModal-tabs-nav">{this.tabItems().toArray()}</div>
        <div className="SearchModal-tabs-content">{this.activeTabItems().toArray()}</div>
      </div>
    );
  }

  tabItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    this.sources?.map((source, index) =>
      items.add(
        source.resource,
        <Button className="Button Button--link" active={this.activeSource() === source} onclick={() => this.switchSource(source)}>
          {source.title()}
        </Button>,
        100 - index
      )
    );

    return items;
  }

  activeTabItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    const loading = this.loadingSources.includes(this.activeSource().resource);
    const shouldShowResults = !!this.searchState.getValue() && !loading;
    const gambits = this.gambits();
    const fullPageLink = this.activeSource().fullPage(this.searchState.getValue());
    const results = this.activeSource()?.view(this.searchState.getValue());

    if (shouldShowResults && fullPageLink) {
      items.add(
        'fullPageLink',
        <div className="SearchModal-section">
          <hr className="Modal-divider" />
          <ul className="Dropdown-menu SearchModal-fullPage">{fullPageLink}</ul>
        </div>,
        80
      );
    }

    if (!!gambits.length) {
      items.add(
        'gambits',
        <div className="SearchModal-section">
          <hr className="Modal-divider" />
          <ul className="Dropdown-menu SearchModal-options" aria-live={gambits.length ? 'polite' : undefined}>
            <li className="Dropdown-header">{app.translator.trans('core.forum.search.options_heading')}</li>
            {gambits}
          </ul>
        </div>,
        60
      );
    }

    items.add(
      'results',
      <div className="SearchModal-section">
        <hr className="Modal-divider" />
        <ul className="Dropdown-menu SearchModal-results" aria-live={shouldShowResults ? 'polite' : undefined}>
          <li className="Dropdown-header">{app.translator.trans('core.forum.search.preview_heading')}</li>
          {!shouldShowResults && (
            <li className="Dropdown-message">
              <InfoTile icon="fas fa-search">{app.translator.trans('core.forum.search.no_search_text')}</InfoTile>
            </li>
          )}
          {shouldShowResults && results}
          {shouldShowResults && !results?.length && (
            <li className="Dropdown-message">
              <InfoTile icon="far fa-tired">{app.translator.trans('core.forum.search.no_results_text')}</InfoTile>
            </li>
          )}
          {loading && (
            <li className="Dropdown-message">
              <LoadingIndicator />
            </li>
          )}
        </ul>
      </div>,
      40
    );

    return items;
  }

  switchSource(source: SearchSource) {
    if (this.activeSource() !== source) {
      this.activeSource(source);
      this.search(this.searchState.getValue());
      this.inputElement().focus();
      m.redraw();
    }
  }

  gambits(): JSX.Element[] {
    const gambits = app.search.gambits.for(this.activeSource().resource).filter((gambit) => gambit.enabled());
    const query = this.searchState.getValue();

    // We group the boolean gambits together to produce an initial item of
    // is:unread,sticky,locked, etc.
    const groupedGambits: IGambit<GambitType.Grouped>[] = gambits.filter((gambit) => gambit.type === GambitType.Grouped);
    const keyValueGambits: IGambit<GambitType.KeyValue>[] = gambits.filter((gambit) => gambit.type !== GambitType.Grouped);

    const uniqueGroups: string[] = [];
    for (const gambit of groupedGambits) {
      if (uniqueGroups.includes(gambit.suggestion().group)) continue;
      uniqueGroups.push(gambit.suggestion().group);
    }

    const instancePerGroup: IGambit<GambitType.Grouped>[] = [];
    for (const group of uniqueGroups) {
      instancePerGroup.push({
        type: GambitType.Grouped,
        suggestion: () => ({
          group,
          key: groupedGambits
            .filter((gambit) => gambit.suggestion().group === group)
            .map((gambit) => {
              const key = gambit.suggestion().key;

              return key instanceof Array ? key.join(', ') : key;
            })
            .join(', '),
        }),
        pattern: () => '',
        filterKey: () => '',
        toFilter: () => [],
        fromFilter: () => '',
        predicates: false,
        enabled: () => true,
      });
    }

    const autocompleteReader = new AutocompleteReader(null);

    const $input = this.$('SearchModal-input') as JQuery<HTMLInputElement>;
    const cursorPosition = $input.prop('selectionStart') || query.length;
    const lastChunk = query.slice(0, cursorPosition);
    const autocomplete = autocompleteReader.check(lastChunk, cursorPosition, /\S+$/);

    let typed = autocomplete?.typed || '';

    // Negative gambits are a thing ;)
    const negative = typed.startsWith('-');
    if (negative) {
      typed = typed.slice(1);
    }

    // if the query ends with 'is:' we will only list keys from that group.
    if (typed.endsWith(':')) {
      const gambitKey = typed.replace(/:$/, '') || null;
      const gambitQuery = typed.split(':').pop() || '';

      if (gambitKey) {
        const specificGambitSuggestions = this.specificGambitSuggestions(gambitKey, gambitQuery, uniqueGroups, groupedGambits, autocomplete!);

        if (specificGambitSuggestions) {
          return specificGambitSuggestions;
        }
      }
    }

    // This is all the gambit suggestions.
    return [...instancePerGroup, ...keyValueGambits]
      .filter(
        (gambit) =>
          !autocomplete ||
          new RegExp(typed).test(
            gambit.type === GambitType.Grouped ? (gambit.suggestion() as GroupedGambitSuggestion).group : (gambit.suggestion().key as string)
          )
      )
      .map((gambit) => {
        const suggestion = gambit.suggestion();
        const key = gambit.type === GambitType.Grouped ? (suggestion as GroupedGambitSuggestion).group : (suggestion.key as string);
        const hint =
          gambit.type === GambitType.Grouped ? (suggestion as KeyValueGambitSuggestion).key : (suggestion as KeyValueGambitSuggestion).hint;

        return this.gambitSuggestion(key, hint, (negated: boolean | undefined) =>
          this.suggest(((!!negated && '-') || '') + key + ':', typed || '', (autocomplete?.relativeStart ?? cursorPosition) + Number(negative))
        );
      });
  }

  specificGambitSuggestions(
    gambitKey: string,
    gambitQuery: string,
    uniqueGroups: string[],
    groupedGambits: IGambit<GambitType.Grouped>[],
    autocomplete: AutocompleteCheck
  ): JSX.Element[] | null {
    if (uniqueGroups.includes(gambitKey)) {
      return groupedGambits
        .filter((gambit) => gambit.suggestion().group === gambitKey)
        .flatMap((gambit): string[] =>
          gambit.suggestion().key instanceof Array ? (gambit.suggestion().key as string[]) : [gambit.suggestion().key as string]
        )
        .filter((key) => !gambitQuery || key.toLowerCase().startsWith(gambitQuery))
        .map((gambit) =>
          this.gambitSuggestion(gambit, null, () => this.suggest(gambit, gambitQuery, autocomplete.relativeStart + autocomplete.typed.length))
        );
    }

    return null;
  }

  gambitSuggestion(key: string, value: string | null, suggest: (negated?: boolean) => void): JSX.Element {
    return (
      <li>
        <span className="Dropdown-item SearchModal-gambit">
          <button type="button" className="Button--ua-reset" onclick={() => suggest()}>
            <span className="SearchModal-gambit-key">
              {key}
              {!!value && ':'}
            </span>
            {!!value && <span className="SearchModal-gambit-value">{value}</span>}
          </button>
          {!!value && (
            <span className="SearchModal-gambit-actions">
              <Button
                class="Button Button--icon"
                onclick={() => suggest()}
                icon="fas fa-plus"
                aria-label={app.translator.trans('core.forum.search.gambit_plus_button_a11y_label')}
              />
              <Button
                class="Button Button--icon"
                onclick={() => suggest(true)}
                icon="fas fa-minus"
                aria-label={app.translator.trans('core.forum.search.gambit_minus_button_a11y_label')}
              />
            </span>
          )}
        </span>
      </li>
    );
  }

  suggest(text: string, fromTyped: string, start: number) {
    const $input = this.inputElement() as JQuery<HTMLInputElement>;

    const query = this.searchState.getValue();
    const replaced = query.slice(0, start) + text + query.slice(start + fromTyped.length);

    this.searchState.setValue(replaced);
    $input[0].focus();
    setTimeout(() => {
      $input[0].setSelectionRange(start + text.length, start + text.length);
      m.redraw();
    }, 50);

    this.search(replaced);
  }

  /**
   * Transforms a simple search text to wrap valid gambits in a mark tag.
   * @example `lorem ipsum is:unread dolor` => `lorem ipsum <mark>is:unread</mark> dolor`
   */
  gambifyInput(): Mithril.Children {
    const query = this.searchState.getValue();
    let marked = query;

    app.search.gambits.match(this.activeSource().resource, query, (gambit: IGambit, matches: string[], negate: boolean, bit: string) => {
      marked = marked.replace(bit, `<mark>${bit}</mark>`);
    });

    const jsx: Mithril.ChildArray = [];
    marked.split(/(<mark>.*?<\/mark>)/).forEach((chunk) => {
      if (chunk.startsWith('<mark>')) {
        jsx.push(<mark>{chunk.replace(/<\/?mark>/g, '')}</mark>);
      } else {
        jsx.push(chunk);
      }
    });

    return jsx;
  }

  onupdate(vnode: Mithril.VnodeDOM<CustomAttrs, this>) {
    super.onupdate(vnode);

    // Highlight the item that is currently selected.
    this.setIndex(this.getCurrentNumericIndex());

    const component = this;
    this.$('.Dropdown-menu')
      // Whenever the mouse is hovered over a search result, highlight it.
      .on('mouseenter', '> li:not(.Dropdown-header):not(.Dropdown-message)', function () {
        component.setIndex(component.selectableItems().index(this));
      });

    // If there are no sources, the search view is not shown.
    if (!this.sources?.length) return;
  }

  oncreate(vnode: Mithril.VnodeDOM<CustomAttrs, this>) {
    super.oncreate(vnode);

    // If there are no sources, we shouldn't initialize logic for
    // search elements, as they will not be shown.
    if (!this.sources?.length) return;

    const search = this.search.bind(this);

    // Highlight the item that is currently selected.
    this.setIndex(this.getCurrentNumericIndex());

    const $input = this.inputElement() as JQuery<HTMLInputElement>;

    this.navigator = new KeyboardNavigatable();
    this.navigator
      .onUp(() => this.setIndex(this.getCurrentNumericIndex() - 1, true))
      .onDown(() => this.setIndex(this.getCurrentNumericIndex() + 1, true))
      .onSelect(this.selectResult.bind(this), true)
      .onCancel(this.clear.bind(this))
      .bindTo($input);

    // Handle input key events on the search input, triggering results to load.
    $input.on('input focus', function () {
      search(this.value.toLowerCase());
    });
  }

  search(query: string) {
    if (!query) return;

    const source = this.activeSource();

    if (this.searchTimeout) clearTimeout(this.searchTimeout);

    this.searchTimeout = window.setTimeout(() => {
      if (source.isCached(query)) return;

      if (query.length >= SearchManager.MIN_SEARCH_LEN) {
        if (!source.search) return;

        this.loadingSources.push(source.resource);

        source.search(query, SearchModal.LIMIT).then(() => {
          this.loadingSources = this.loadingSources.filter((resource) => resource !== source.resource);
          m.redraw();
        });
      }

      this.searchState.cache(query);
      m.redraw();
    }, 250);
  }

  /**
   * Navigate to the currently selected search result and close the list.
   */
  selectResult() {
    if (this.searchTimeout) clearTimeout(this.searchTimeout);

    this.loadingSources = [];

    const item = this.getItem(this.index);
    const isResult = !!item.attr('data-id');
    let selectedUrl = null;

    if (isResult) {
      const id = item.attr('data-id');
      selectedUrl = id && this.activeSource().gotoItem(id as string);
    } else if (item.find('a').length) {
      selectedUrl = item.find('a').attr('href');
    }

    if (this.searchState.getValue() && selectedUrl) {
      m.route.set(selectedUrl);
    } else {
      item.find('button')[0].click();
    }
  }

  /**
   * Clear the search
   */
  clear() {
    this.searchState.clear();
  }

  /**
   * Get all of the search result items that are selectable.
   */
  selectableItems(): JQuery {
    return this.$('.Dropdown-menu > li:not(.Dropdown-header):not(.Dropdown-message)');
  }

  /**
   * Get the position of the currently selected search result item.
   * Returns zero if not found.
   */
  getCurrentNumericIndex(): number {
    return Math.max(0, this.selectableItems().index(this.getItem(this.index)));
  }

  /**
   * Get the <li> in the search results with the given index (numeric or named).
   */
  getItem(index: number): JQuery {
    const $items = this.selectableItems();
    let $item = $items.filter(`[data-index="${index}"]`);

    if (!$item.length) {
      $item = $items.eq(index);
    }

    return $item;
  }

  /**
   * Set the currently-selected search result item to the one with the given
   * index.
   */
  setIndex(index: number, scrollToItem: boolean = false) {
    const $items = this.selectableItems();
    const $dropdown = $items.parent();

    let fixedIndex = index;
    if (index < 0) {
      fixedIndex = $items.length - 1;
    } else if (index >= $items.length) {
      fixedIndex = 0;
    }

    const $item = $items.removeClass('active').eq(fixedIndex).addClass('active');

    this.index = parseInt($item.attr('data-index') as string) || fixedIndex;

    if (scrollToItem && $dropdown) {
      const dropdownScroll = $dropdown.scrollTop()!;
      const dropdownTop = $dropdown.offset()!.top;
      const dropdownBottom = dropdownTop + $dropdown.outerHeight()!;
      const itemTop = $item.offset()!.top;
      const itemBottom = itemTop + $item.outerHeight()!;

      let scrollTop;
      if (itemTop < dropdownTop) {
        scrollTop = dropdownScroll - dropdownTop + itemTop - parseInt($dropdown.css('padding-top'), 10);
      } else if (itemBottom > dropdownBottom) {
        scrollTop = dropdownScroll - dropdownBottom + itemBottom + parseInt($dropdown.css('padding-bottom'), 10);
      }

      if (typeof scrollTop !== 'undefined') {
        $dropdown.stop(true).animate({ scrollTop }, 100);
      }
    }
  }

  inputElement(): JQuery<HTMLElement> {
    return this.$('.SearchModal-input');
  }
}
