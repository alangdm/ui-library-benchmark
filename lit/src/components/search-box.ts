import { html, css, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('search-box')
export class SearchBox extends LitElement {
  @property()
  input = ''

  _onInput(e:InputEvent) {
    this.input = (e.target as HTMLInputElement).value;
    const customEvent = new CustomEvent('input-changed', {detail: {input: this.input}})
    this.dispatchEvent(customEvent)
  }

  render() {
    return html`
    <div>
      <input
        .value=${this.input}
        @input=${this._onInput}
      />
    </div>
    `
  }

  static styles = css`
    div {
      display: grid;
      grid-template-columns: 3rem auto 3rem;
      grid-template-rows: 3rem auto 3rem;

      border: 1px solid var(--text-color);
      background-color: var(--bg-sub-color);
      background-repeat: repeat;
    }

    input {
      grid-area: 2 / 2;
      font-size: 2.5rem;
      padding: 0.5rem;
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'search-box': SearchBox
  }
}
