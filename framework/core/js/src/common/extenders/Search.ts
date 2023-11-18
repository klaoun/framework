import type IExtender from './IExtender';
import type { IExtensionModule } from './IExtender';
import type Application from '../Application';
import IGambit from '../query/IGambit';
import SearchManager, { SearchSource } from '../SearchManager';
import { extend } from '../extend';

export default class Search implements IExtender {
  protected gambits: Record<string, Array<new () => IGambit>> = {};
  protected sources: Record<string, new () => SearchSource> = {};

  public gambit(modelType: string, gambit: new () => IGambit): this {
    this.gambits[modelType] = this.gambits[modelType] || [];
    this.gambits[modelType].push(gambit);

    return this;
  }

  public source(modelType: string, source: new () => SearchSource): this {
    this.sources[modelType] = source;

    return this;
  }

  extend(app: Application, extension: IExtensionModule): void {
    for (const [modelType, gambits] of Object.entries(this.gambits)) {
      for (const gambit of gambits) {
        app.search.gambits.gambits[modelType] = app.search.gambits.gambits[modelType] || [];
        app.search.gambits.gambits[modelType].push(gambit);
      }
    }

    const sources = this.sources;
    extend(SearchManager.prototype, 'sources', function (items) {
      for (const [modelType, source] of Object.entries(sources)) {
        items.add(modelType, new source());
      }
    });
  }
}
