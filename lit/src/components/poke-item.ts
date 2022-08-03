import { html, css, LitElement, PropertyValueMap } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'

import { itemMap, Item } from '../data/items';

type NameMarked = {
  unmatched: boolean
  prefix: string
  mark: string
  suffix: string
}

@customElement('poke-item')
export class PokeItem extends LitElement {
  @property()
  searchQuery = ''

  @property()
  id = ''

  @state()
  _item : Item | undefined = undefined

  @state()
  _nameMarked : NameMarked | undefined = undefined

  private _setNameMarked() {
    if (!this._item) {
      this._nameMarked = undefined
      return
    }
    if (!this.searchQuery) {
      this._nameMarked = {
        unmatched: false,
        prefix: this._item.en,
        mark: "",
        suffix: "",
      }
      return
    }
    const {en: englishName} = this._item
    const searchIndex = englishName.toLowerCase().indexOf(this.searchQuery)
    if (searchIndex === -1) {
      this._nameMarked = {
        unmatched: true,
        prefix: englishName,
        mark: "",
        suffix: "",
      }
      return
    }
    this._nameMarked = {
      unmatched: false,
      prefix: englishName.substring(0, searchIndex),
      mark: englishName.substring(searchIndex, searchIndex + this.searchQuery.length),
      suffix: englishName.substring(searchIndex + this.searchQuery.length),
    };
  }

  protected willUpdate(changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    if (changedProperties.has('id')) {
      this._item = itemMap.get(this.id)
    }
    if (changedProperties.has('searchQuery')) {
      this._setNameMarked()
    }
  }

  _nameMarkedTemplate() {
    const {unmatched, prefix, mark, suffix} = this._nameMarked ?? {};
    const markAndSuffix = mark ? html`<mark>${mark}</mark>${suffix}` : '';
    return html`
      <div>
        <span class=${classMap({name: true, unmatchedName: unmatched ?? false})}>
          ${prefix}${markAndSuffix}
        </span>
      </div>
    `
  }

  render() {
    return html`
      <div class="wrapper" v-if="item && nameMarked">
        <div class="id">${this._item?.id}</div>
        ${this._nameMarkedTemplate()}
        <div>${ this._item?.ja }</div>
      </div>
    `
  }

  static styles = css`
    .wrapper {
      background-color: var(--bg-sub-color);
    }

    .id {
      color: var(--text-sub-color);
    }

    .name > mark {
      font-weight: bold;
    }

    .unmatchedName {
      color: var(--text-sub-color);
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'poke-item': PokeItem
  }
}
