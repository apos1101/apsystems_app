(function()  {

    let tmpl = document.createElement('template');
    tmpl.innerHTML = `
      <style>
      </style>
    `;

    d3Script.onload = () => 

    customElements.define('com-apos-ldg-widget', class APOSLDGWidget extends HTMLElement {

        constructor() {

            super();
                        
            this._shadowRoot = this.attachShadow({mode: 'open'});
            
            this._shadowRoot.appendChild(tmpl.content.cloneNode(true));
            
            // Create Fieldset
            let fieldset = document.createElement('fieldset'); 
            
            // Create Fieldset Legend
            let legend = document.createElement('legend'); 
            
            legend.setAttribute('align','left');
            
            // Create Legend Title
            let title = document.createTextNode("APOS LDG Widget");
            
            legend.appendChild(title);
            
            // Create APOS View Id Label
            let aposViewIdLabel = document.createTextNode("APOS View Id: "); 
            
            // Create APOS View Id Input Text
            let aposViewIdInputText = document.createElement("input");
            
            aposViewIdInputText.type = "text";
            
            // Create SQL Query Label
            let sqlQueryLabel = document.createTextNode("Enter SQL Query: "); 
            
            // Create SQL Query TextArea
            let sqlQueryTextArea = document.createElement('textarea');
            sqlQueryTextArea.setAttribute('rows','5');
            sqlQueryTextArea.setAttribute('cols','75');
            sqlQueryTextArea.value = 'select * from table';
            
            // Create SQL Query Update Button
            let sqlQueryUpdateButton = document.createElement('button');
        
            // Create SQL Query Update Button Text
            var sqlQueryUpdateButtonText = document.createTextNode("Update"); 
                        
            // Appending text to button 
            sqlQueryUpdateButton.appendChild(sqlQueryUpdateButtonText); 
            
            // Appending elements to fieldset
            fieldset.appendChild(legend);
            const brLegend = document.createElement('br');
            fieldset.appendChild(brLegend);
            
            fieldset.appendChild(aposViewIdLabel);
            
            fieldset.appendChild(aposViewIdInputText);
            const brAposViewInputText01 = document.createElement('br');
            fieldset.appendChild(brAposViewInputText01);
            const brAposViewInputText02 = document.createElement('br');
            fieldset.appendChild(brAposViewInputText02);
            
            fieldset.appendChild(sqlQueryLabel);
            const brSqlQueryLabel = document.createElement('br');
            fieldset.appendChild(brSqlQueryLabel);
            
            fieldset.appendChild(sqlQueryTextArea);
            const brSqlQueryTextArea01 = document.createElement('br');
            fieldset.appendChild(brSqlQueryTextArea01);
            const brSqlQueryTextArea02 = document.createElement('br');
            fieldset.appendChild(brSqlQueryTextArea02);
            
            fieldset.appendChild(sqlQueryUpdateButton);

            this._shadowRoot.appendChild(fieldset);
                        
        };  
    
    });
        
})();