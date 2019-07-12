(function () {
    let tmpl = document.createElement('template');
    tmpl.innerHTML = '\
      <style>\
        :host {\
            border-radius:25px;\
            border-width: 4px;\
            border-color: black;\
            border-style: solid;\
        }\
      </style>\
      <slot></slot>\
    ';

    class AwesomeBox extends HTMLElement {
        constructor() {
            super();
            let shadowRoot = this.attachShadow({ mode: 'open' });
            shadowRoot.appendChild(tmpl.content.cloneNode(true));
            this.style.height = "100%";
            this.addEventListener('click', function() {
                console.log("Awesomebox_v2 was clicked!");
                this.dispatchEvent(new Event('onClick'));
            });
        }

        get color() {
            return this.style["background-color"];
        }

        set color(newColor) {
            this.style["background-color"] = newColor;
        }

        getColor() {
            return this.color;
        }

        setColor(newColor) {
            this.color = newColor;
        }

        static get observedAttributes() {
            return ['color'];
        }

        attributeChangedCallback(name, oldValue, newValue) {
            this[name] = newValue;
        }
    }

    customElements.define('sdk-awesomebox', AwesomeBox);
})();