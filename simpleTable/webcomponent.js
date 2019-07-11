(function () {

	let tmpl = document.createElement('template');
	tmpl.innerHTML = `
		  <link rel="stylesheet" type="text/css" href="https://github.com/apos1101/apsystems_app/blob/master/simpleTable/simpleTable.css"/>
		  <div id="scrolltable">
		  </div>
	`;
	class SimpleTable extends HTMLElement {
		constructor() {
			super();
			this._shadowRoot = this.attachShadow({ mode: 'open' });
			this._shadowRoot.appendChild(tmpl.content.cloneNode(true));
			if (!this._data) {
				this._data = [{
					"ID": "0",
					"NAME": "Max Mustermann",
					"AGE": 20
				}]
			}
			this.fillTable();
		}

		setData (data, columnInfo) {
			this._dataCols = columnInfo;
			this._data = data;
			this.fillTable();
		}
		// filling table headers
		recurseHeader (obj, flag, firstProp, tableHeader) {
			var headerNames = new Array();
			// saving first prop value
			for (const prop in obj) {
				if (flag === true) {
					firstProp = prop;
					flag = false;
				}
				if (typeof obj[prop] !== "object") {
					//dont add it if it is already there
					if (headerNames.indexOf(prop) === -1) {
						this.addTableHeader(prop, tableHeader);
						// save props in an array
						headerNames.push(prop);
					}
				} else {
					this.recurseHeader(obj[prop], flag, firstProp, tableHeader);
				}
			}
			return firstProp;
		}

		// filling table headers
		recurseHeaderWithDataCols (obj, dataCols, tableHeader) {
			var headerNames = new Array();
			// saving first prop value
			for (var dc = 0; dc <= dataCols.length - 1; dc++) {
				for (const prop in obj) {
					if (dataCols.includes(prop) === true) {
						if (typeof obj[dataCols[dc]] !== "object") {
							//dont add it if it is already there
							if (headerNames.indexOf(dataCols[dc]) === -1) {
								this.addTableHeader(dataCols[dc], tableHeader);
								// save props in an array
								headerNames.push(dataCols[dc]);
							}
						} else {
							this.recurseHeaderWithDataCols(obj[dataCols[dc]], dataCols, tableHeader);
						}
					}
				}
			}
		}

		addTableHeader (content, tableHeader) {
			var tableHeaderCol = document.createElement('th');
			tableHeaderCol.textContent = content;
			tableHeader.appendChild(tableHeaderCol);
		}

		addTableRow (rowCounter, myTable) {
			var tableRow = document.createElement('tr');
			tableRow.id = `${rowCounter}`;
			myTable.appendChild(tableRow);
			return rowCounter;
		}

		addDataInTableRow (obj, indexProperty, rowCounter) {
			var tableRowContent = document.createElement('td');
			tableRowContent.textContent = obj[indexProperty];
			var tr = this._shadowRoot.querySelector(`tr[id="${rowCounter}"]`);
			tr.appendChild(tableRowContent);
		}

		fillTable () {
			if (!this._data) { return };
			// removing previous table
			if (this._shadowRoot.querySelector("#simpleTable")) {
				this._shadowRoot.querySelectorAll("#simpleTable").forEach(function (e) {
					e.remove(this);
				});
			}

			// creating the table and appending it to the shadowroot
			var myTable = document.createElement('table');
			var myDiv = this._shadowRoot.querySelector("#scrolltable");
			myTable.id = "simpleTable";
			myDiv.insertAdjacentElement("beforeend", myTable);
			var tableHeader = document.createElement('tr');
			myTable.appendChild(tableHeader);
			var firstJsonObj;
			// checking if the object has more the one instance
			if ((Array.isArray(this._data)) === false) {
				firstJsonObj = this._data;
			} else {
				firstJsonObj = this._data[0];
			}
			var flag = true;
			var firstProp;
			
			// check if there are dataCols set
			if (!this._dataCols || this._dataCols.length === 0 ) {
				var FP = this.recurseHeader(firstJsonObj, flag, firstProp, tableHeader);
				var rowCounter = 0;
				//filling table rows
				const recurseContent = (obj) => {
					for (const prop in obj) {
						// checking if obj is a start of an instance to create its own row for it
						if (prop === FP) {
							rowCounter++;
							this.addTableRow(rowCounter, myTable);
						}
						// adding the values only if they're not objects (i.e single vals)
						if (typeof obj[prop] !== "object") {
							this.addDataInTableRow(obj, prop, rowCounter);
						} else {
							recurseContent(obj[prop]);
						}
					}
				}
				recurseContent(this._data);

			} else {
				this.recurseHeaderWithDataCols(firstJsonObj, this._dataCols, tableHeader);

				var rowCounter = 0;
				var trCounter = 0;

				//filling table rows
				const recurseContentWithDataCols = (obj, dataCols) => {
					var headerNames = new Array();
					for (var dc = 0; dc <= dataCols.length - 1; dc++) {
						trCounter++;
						for (const prop in obj) {
							if (dataCols.includes(prop) === true) {
								// checking if obj is a start of an instance to create its own row for it
								if (dc !== trCounter) {
									rowCounter++;
									this.addTableRow(rowCounter, myTable);
									trCounter = 0;
								}
								// adding the values only if they're not objects (i.e single vals)
								if (typeof obj[dataCols[dc]] !== "object") {
									if (headerNames.indexOf(dataCols[dc]) === -1) {
										// add table row
										this.addDataInTableRow(obj, dataCols[dc], rowCounter);
										// save props in an array
										headerNames.push(dataCols[dc]);
									}
								} else {
									recurseContentWithDataCols(obj[dataCols[dc]]);
								}
							}
						}
					}
				}
				if ((Array.isArray(this._data)) === false) {
					recurseContentWithDataCols(this._data, this._dataCols);
				} else {
					this._data.forEach(record => {
						recurseContentWithDataCols(record, this._dataCols);
					});
				}
			}
		}
	}
	customElements.define('simple-table', SimpleTable);
})();