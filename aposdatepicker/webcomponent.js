(function()  {
  
  let tmpl = document.createElement('template');
  tmpl.innerHTML = `
    <link rel="stylesheet" type="text/css" href="https://github.com/apos1101/apsystems_app/master/aposdatepicker/datepicker.css"/>
    <input type="text" class="datepicker" id="aposdatepicker"/>
  `;

  class APOSDatePicker extends HTMLElement {
            constructor() {
              super();
              this._shadowRoot = this.attachShadow({mode: 'open'});
              this._shadowRoot.appendChild(tmpl.content.cloneNode(true));
              this._shadowRoot.getElementById("aposdatepicker").addEventListener("click", this.start.bind(this));
              this._dateVal = new Date();
              this._format = "dash"; 
              this.drawDate();
            }

            get dateVal() {
              return this._dateVal;
            }

            set dateVal(value) {
              if (typeof(value) === "string" ) {
                this._dateVal = new Date(value);
              } else {
                this._dateVal = value;
              }               
              this.drawDate();
            }

            get format() {
              return this._format;
            }
            
            set format(value) {
              this._format = value;
              this.drawDate();
            }

          convertCurrentDateToMyFormat() {
            if (this._format === "dash") {

              return (String(this._dateVal.getFullYear())).padStart(13)  + "-" + (String(this._dateVal.getMonth() + 1)).padStart(2,0) + "-" + (String(this._dateVal.getDate())).padStart(2,0);
            } else if(this._format === "slash"){
              return ((String(this._dateVal.getMonth() + 1)).padStart(2,0)).padStart(13)  + "/" +  (String(this._dateVal.getDate())).padStart(2,0) + "/" + this._dateVal.getFullYear();
            } else {
              return (String(this._dateVal.getDate()).padStart(2,0)).padStart(13) + "." + (String(this._dateVal.getMonth() + 1)).padStart(2,0)  + "." + this._dateVal.getFullYear();
            }
          }

          drawDate() {
            var currentThis = this;
            this._shadowRoot.querySelectorAll(".datepicker").forEach(function(input) {
              input.value = currentThis.convertCurrentDateToMyFormat();
            });
            
          }


          start(mouseEvent){
            
              var datePickerTpl = `
              <table class = "dateView" >
                <tr>
                  <div class="yearMonth">
                    <a class="previous">&lsaquo;</a> <span class="month">{m}</span> <span>-</span> <span class="year">{y}</span> <a class="next">&rsaquo;</a>
                  </div>
                </tr>
                  <tr class="dayHeaders">
                    <td>M</td><td>T</td><td>W</td><td>T</td><td>F</td><td>S</td><td>S</td>
                  </tr>
                  <tr class="Week">
                
                  </tr>
                  <tr class="Week">
                
                  </tr>
                  <tr class="Week">
                  
                  </tr>
                  <tr class="Week">
                
                  </tr>
                  <tr class="Week">
                  
                  </tr>

                </table >`;

                var dayNames=["M", "T", "W","T", "F","S", "S"];
            
              function daysInMonth(month, year) {
                return new Date(year, month, 0).getDate();
              }
            
            
              function getBeginningDay(year, month){
                var beginningDay = new Date(year, month-1, 1).getDay();
                if(beginningDay === 0){
                  return dayNames[6];
                } else{
                  return dayNames[beginningDay-1];
                }
                
              }

              const renewDatePickerDays = (dp, dpMonth, dpYear, input) => {
                dp.querySelectorAll(".days").forEach((e) => {
                  e.remove(this);
                });
               
                var dayNum=1;
                var previousMonth = dpMonth - 1 === 0;
                var daysOfPreviousMonth = daysInMonth(previousMonth ? 12 : dpMonth - 1, previousMonth ? dpYear - 1 : dpYear );
                var flag = false;
                var nextMonthDays= 1;
                var curDaysOfMonth = daysInMonth(dpMonth , dpYear);
                var beginningDay = getBeginningDay(dpYear, dpMonth);

                for (let week of Array.from(dp.querySelectorAll(".contextmenu .Week"))) {
                  for (let dayHeader of Array.from(dp.querySelectorAll(".dayHeaders td"))) {
                    
                    var day = document.createElement("td");
                    day.className = "days";
                    

                    if(dayNum <= curDaysOfMonth){
                      if(dayHeader.innerText === beginningDay || flag === true ){
                        day.innerText = dayNum;
                        week.insertAdjacentElement('beforeEnd', day);
                        dayNum++;
                        flag = true;
                        
                      } else {
                        day.innerText = daysOfPreviousMonth;
                        day.className = "days previous";
                        day.style.color = "#a09c9c";
                        week.insertAdjacentElement('afterBegin', day);
                        daysOfPreviousMonth --;
                      }   
                    } else {
                      day.innerText = nextMonthDays;
                      day.className = "days after";
                      day.style.color = "#a09c9c";
                      week.insertAdjacentElement('beforeEnd', day);
                      nextMonthDays++;
                    }
                    
                  }
                  
                }


                
                dp.querySelectorAll(".days").forEach((a) => {
                  a.addEventListener("click", (e) => {
                    clearSelected(dp);
                    
                    if(a.classList.contains("previous")){
                      e.target.className = "days selected";
                      this.dateVal= new Date(dpYear, dpMonth-2, a.innerText);
                      this.dispatchEvent(new CustomEvent('propertiesChanged', { detail: { properties: {
                        dateVal:  this.dateVal 
                      }}}));
                    } else if (a.classList.contains("after")){
                      e.target.className = "days selected";
                      this.dateVal= new Date(dpYear, dpMonth, a.innerText);
                      this.dispatchEvent(new CustomEvent('propertiesChanged', { detail: { properties: {
                        dateVal:  this.dateVal 
                      }}}));
                    } else {
                      e.target.className = "days selected";
                      this.dateVal= new Date(dpYear, dpMonth-1, a.innerText);
                      this.dispatchEvent(new CustomEvent('propertiesChanged', { detail: { properties: {
                        dateVal:  this.dateVal 
                      }}}));
                    }
                    
                    input.style.font = "14px";
                    input.style.fontFamily = `"72-Web",Arial,Helvetica,sans-serif`;
                  });
                });

              };

              const updateYearPicker = (dp, datePickerElement) => {
                dp.querySelectorAll(".years").forEach((e) => {
                  e.remove(this);
                });

                var year = parseInt(dp.querySelector(".year").textContent);
                var startYearVal = parseInt(year)-10;

                dp.querySelectorAll(".yearRow").forEach((el) => {
                  for(var i = 0; i< 4; i++){
                   var yearVal= document.createElement("td");
                   yearVal.className = "years";
                   yearVal.innerText = startYearVal;
                   el.insertAdjacentElement('beforeEnd', yearVal);
                   startYearVal ++;
                  }
                 
                });

                 dp.querySelectorAll(".years").forEach((a) => {
                  a.addEventListener("click", (e) => {
                    var curMonth = parseInt(dp.querySelector(".month").textContent);
                    var yearDiv = dp.querySelector("table");
                    dp.replaceChild(datePickerElement, yearDiv);
                    renewDatePickerDays(dp,curMonth , a.innerText, dp.parentNode.children[1] );
                    setMonthYear(dp,curMonth , a.innerText, dp.parentNode.children[1]);
                  });
                });
                

              };


              function clearSelected(dp) {
                dp.querySelectorAll(".selected").forEach((e) => {
                  e.classList.remove("selected");
                });
              }
            
               
              function setMonthYear(dp, month, year, input) {
                dp.querySelector(".month").textContent = String(month).padStart(2, "0");
                dp.querySelector(".year").textContent = year;
                clearSelected(dp);
              
               
                if(input && input.value) {
                  var date = input.value.split("-");
                  var curYear = parseInt(dp.querySelector(".year").textContent), curMonth = parseInt(dp.querySelector(".month").textContent);
                  if(date[0] === curYear && date[1] === curMonth) {
                    dp.querySelector(".days:nth-child(" + parseInt(date[2]) + ")").className = "selected";
                  }
                }
              }
            
              
              this.shadowRoot.querySelectorAll(".datepicker").forEach((input) => {
                input.setAttribute("readonly", "false");

                input.parentNode.querySelectorAll(".contextmenu").forEach(function(e){
                  e.remove(this);
                });
               
                //create context menu
                var dp = document.createElement("div");
                dp.className = "contextmenu";
                dp.style.left = input.offsetLeft + "px";
                dp.style.top = input.offsetTop + input.offsetHeight + "px";

                //create current context menu of the already occuring date in the input (default today'S date)
                var curMonth = input.parentNode.host._dateVal.getMonth() + 1, curYear = input.parentNode.host._dateVal.getFullYear();
                dp.insertAdjacentHTML('beforeEnd', datePickerTpl.replace("{m}", String(curMonth).padStart(2, "0")).replace("{y}", curYear));
                setMonthYear(dp, curMonth, curYear , input);
                renewDatePickerDays(dp,curMonth ,curYear , input);

                // previous month nvigation
                dp.querySelector("a.previous").addEventListener("click", () => {
                  var curYear = parseInt(dp.querySelector(".year").textContent), curMonth = parseInt(dp.querySelector(".month").textContent);
                  var firstMonth = curMonth - 1 === 0;
                  var tempMonth = curMonth- 1;
                  var tempYear= curYear - 1;
                  setMonthYear(dp, firstMonth ? 12 : curMonth - 1, firstMonth ? curYear - 1 : curYear, input);
                  renewDatePickerDays(dp,firstMonth ? 12 : tempMonth , firstMonth ? tempYear : curYear, input );
                });
            
                // next month navigation
                dp.querySelector("a.next").addEventListener("click", () => {
                  var curYear = parseInt(dp.querySelector(".year").textContent), curMonth = parseInt(dp.querySelector(".month").textContent);
                  var lastMonth = curMonth + 1 === 13;
                  var tempMonth = curMonth + 1;
                  var tempYear= curYear + 1;
                  setMonthYear(dp, lastMonth ? 1 : curMonth + 1, lastMonth ? curYear + 1 : curYear, input);
                  renewDatePickerDays(dp,lastMonth ? 1 : tempMonth, lastMonth ? tempYear : curYear ,input );
                });

                input.parentNode.insertBefore(dp, input.nextSibling);
                setTimeout(() => {
                  var event = new CustomEvent('finished');
                  input.dispatchEvent(event);
                }, 10);

                // creating the year picker
                dp.querySelector(".year").addEventListener("click", () => {
                
                  var datePickerElement = dp.querySelector(".dateView");
                  var yearPicker = `
                  <table >
                  <tbody class = "yearPicker">
                    <tr class="yearRow">
                    </tr>
                    <tr class="yearRow">
                    </tr>
                    <tr id="middleRow" class="yearRow">
                    </tr>
                    <tr class="yearRow">
                    </tr>
                    <tr class="yearRow">
                    </tr>
                    </tbody>
                    </table >
                   `;
                   
                    var yearDiv = document.createElement("table");
                    yearDiv.innerHTML = yearPicker;
                    
                    if(datePickerElement){
                      dp.replaceChild(yearDiv, datePickerElement);
                    }

                    updateYearPicker(dp, datePickerElement);

                 });

                var flag = true;
              
                input.addEventListener("finished", () => {
                  if (input.value){
                    var curDay= input.parentNode.host._dateVal.getDate();
                    dp.querySelectorAll("td").forEach((daySelector) => {
                      if(daySelector.innerText === String(curDay) && flag === true){
                        daySelector.className = "days selected";
                        flag = false;
                      }
                    }); 
                   
                  }
                });
              
              });
          
          }   

      }
  customElements.define('apos-date-picker', APOSDatePicker);
  })();