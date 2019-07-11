(function()  {
let tmpl = document.createElement('template');
tmpl.innerHTML = `
		<form id="form">
			<fieldset>
				<legend>Date Picker Properties</legend>
				<table>
					<tr>
						<!--<td>Date</td>
						<td><input id="aps_dateVal" type="text" name="val" size="20" maxlength="20" />-->
						<td>Date Format</td>
						<td>
							<select >
								<option name="aps_format" value="dash">YYYY-MM-DD</option>
								<option name="aps_format" value="slash">MM/DD/YYYY</option>
								<option name="aps_format" value="dot">DD.MM.YYYY</option>
							</select>
						</td>
					</tr>
				</table>
			</fieldset>
			<br></br>
			<button type="submit">Submit</button>
		</form>
`;

class DatePickerAps extends HTMLElement {
		  constructor() {
		    super();
		    this._shadowRoot = this.attachShadow({mode: 'open'});
		    this._shadowRoot.appendChild(tmpl.content.cloneNode(true));
			this._shadowRoot.getElementById("form").addEventListener("submit", this._submit.bind(this));
		  }

		  _submit(e) {
		    	e.preventDefault();
					this.dispatchEvent(new CustomEvent('propertiesChanged', { detail: { properties: {
							format: this.format
					}}}));
				return false;
		  }

		  get format() {
			return this._shadowRoot.querySelector("option[name='aps_format']:checked").value;
	      }

		  set format(value) {
			this._shadowRoot.querySelector("option[name='aps_format'][value='" + value + "']").checked = "checked";
		  }

		  static get observedAttributes() {
			  return ['format'];
	      }

		  attributeChangedCallback(name, oldValue, newValue) {
			 if (oldValue !== newValue) {
				  this[name] = newValue;
			 }
		  }
}

customElements.define('com-sap-sample-datepicker-aps', DatePickerAps);
})();