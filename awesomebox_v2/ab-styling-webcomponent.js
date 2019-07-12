(function () {
    let tmpl = document.createElement('template');
    tmpl.innerHTML = '\
        <form id="form">\
            <fieldset>\
                <legend>Awesome Box Properties</legend>\
                <table>\
                    <tr>\
                        <td>Color</td>\
                        <td><input id="aps_color" type="text" name="color" size="40" maxlength="40"></td>\
                    </tr>\
                </table>\
            </fieldset>\
        </form>\
    ';

    class AwesomeBoxPropertySheet extends HTMLElement {
        constructor() {
            super();
            this._shadowRoot = this.attachShadow({ mode: 'open' });
            this._shadowRoot.appendChild(tmpl.content.cloneNode(true));
            this._shadowRoot.getElementById("form").addEventListener("submit", this._submit.bind(this));
        }

        _submit(e) {
            e.preventDefault();
            this.dispatchEvent(new CustomEvent('propertiesChanged', { detail: { properties: {
                color: this.color 
            }}}));
            return false;
        }

        get color() {
            return this._shadowRoot.getElementById("aps_color").value;
        }

        set color(newColor) {
            this._shadowRoot.getElementById("aps_color").value = newColor;
        }

        static get observedAttributes() {
            return ['color'];
        }

        attributeChangedCallback(name, oldValue, newValue) {
            if (oldValue != newValue) {
                this[name] = newValue;
            }
        }
    }

    customElements.define('sdk-awesomebox-aps', AwesomeBoxPropertySheet);
})();
