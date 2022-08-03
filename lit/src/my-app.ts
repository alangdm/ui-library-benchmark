import { html, css, LitElement, PropertyValueMap } from 'lit'
import { customElement, state } from 'lit/decorators.js'

import { itemMap, oneSetSize } from './data/items';

import './components/search-box'
import './components/poke-item'

@customElement('my-app')
export class MyApp extends LitElement {

  @state()
  private _dataSetRepeat = 1

  @state()
  private _input = ''

  @state()
  private _itemKeys: string[] = [];

  private _onInputChanged(e:CustomEvent) {
    this._input = e.detail.input
  }

  protected firstUpdated(): void {
    globalThis.setDataSetRepeatSize = (size: number) => {
      this._dataSetRepeat = size
    }
  }

  protected willUpdate(changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    if(changedProperties.has('_dataSetRepeat')) {
      this._itemKeys = Array.from(itemMap.keys()).slice(0, this._dataSetRepeat * oneSetSize)
    }
  }

  render() {
    return html`
      <div class="pokemonList">
        ${this._itemKeys.map((id) => html`
          <poke-item .id=${id} .searchQuery=${this._input}></poke-item>
        `)}
      </div>
      <footer>
        <p>
          Data is obtained from
          <a href="https://pokeapi.co/" rel="external">
            PokéAPI
          </a>
          .
        </p>
      </footer>
      <div class="searchBox">
        <search-box .input=${this._input} @input-changed=${this._onInputChanged}>
        </search-box>
      </div>
    `
  }

  static styles = css`
    .pokemonList {
      display: grid;
      grid-template-columns: repeat(auto-fill, 160px);
      grid-auto-rows: 4em;
      grid-gap: 20px;
      margin: 20px;
      justify-content: space-between;
    }

    .searchBox {
      position: fixed;
      top: 50vh;
      left: 50vw;
      transform: translate(-50%, -50%);
    }

    footer {
      text-align: center;
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'my-app': MyApp
  }
}
