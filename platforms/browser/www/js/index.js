var UUID_SERVICE = "23455100‐8322‐1805‐A3DA‐78E4000C659C";
var UUID_CHAR = "23455102‐8322‐1805‐A3DA‐78E4000C659C";
 
var looperVar;
var iDry;

var idry_struct = {
  temperature: 20.0
};
 
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
        document.getElementById("button-scan").disabled = false; 
    },
  
    // Bind Event Listeners
    
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
  
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        console.log('exec onDeviceReady');
        app.receivedEvent('deviceready');
    },
  
    refreshDeviceList: function() {
        console.log('exec refreshDeviceList');
        document.getElementById("BLE-table-body").innerHTML = ''; // empties the list
        document.getElementById("info").innerHTML = "Scanning!";

        // scan for all devices
        ble.scan([], 5, app.onDiscoverDevice, app.onError);
    },

    onDiscoverDevice: function(device) {
        console.log(JSON.stringify(device));
        var listItem = document.createElement('tr'),
          html = '<td class="mdl-data-table__cell--non-numeric">' + device.name + '</td>' + 
            '<td class="mdl-data-table__cell--non-numeric">' + device.rssi + '</td>' + 
            '<td class="mdl-data-table__cell--non-numeric">' + device.id + '</td>';

        listItem.setAttribute('onclick',"app.bleConnectionRequest('" + device.id + "')" ); 
        listItem.dataset.deviceId = device.id;  // TODO
        listItem.innerHTML = html;
        document.getElementById("BLE-table-body").appendChild(listItem);
    },
  
    bleConnectionRequest: function(dev_id) {
//      document.getElementById("BLE-table").disabled = true;
      document.getElementById("BLE-table-body").innerHTML = ''; // empties the list
      document.getElementById("info").innerHTML = "Connecting!!!";
      ble.connect(dev_id, app.bleConnectionSuccess, app.bleConnectionFailure);
    },
  
    bleConnectionSuccess: function(device) {

      iDry = device;  // store iDry data in global var

      document.getElementById("info").innerHTML = "BLE Connected!";
      document.getElementById("debug-info").innerHTML = "id = " + iDry.id;
//      document.getElementById("debug-area").innerHTML = JSON.stringify(device);
      //enable button to "disconnect" 
      document.getElementById("button-scan").disabled = true;
      document.getElementById("button-disconnect").disabled = false;

      ble.startNotification(iDry.id, UUID_SERVICE, UUID_CHAR, app.idry_temp_notification_handler, null);
      // if connected then start periodic reading of data
      looperVar = setInterval(looper,2000);
    },

    idry_temp_notification_handler: function(buffer) {
    
      // Decode the ArrayBuffer into a typed Array based on the data you expect
      var data = new Uint8Array(buffer);
      idry_struct.temperature = data[0] + data[1] * 255;
      document.getElementById("debug-area").innerHTML = data[1] + "  " + data[0];
      updateFancyGauges();
    },
    
    bleConnectionFailure: function(device) {

      //enable button to "scan" 
      document.getElementById("button-scan").disabled = false;
      document.getElementById("button-disconnect").disabled = true;

      document.getElementById("BLE-table").disabled = false;
      document.getElementById("info").innerHTML = "Not Connected";
      // stop periodic task execution
      clearInterval(looperVar);
    },
  
    // Update DOM on a Received Event
    receivedEvent: function(id) {
      document.getElementById("button-scan").disabled = false;
      document.getElementById("button-scan").innerHTML = "Scan BLE";
      console.log('Received Event: ' + id);
    }
};

setTimeout(function () {
  app.initialize(); 
  } ,2000);
  

var looperCnt = 0;

function looper() {
  document.getElementById("info").innerHTML = "iDry Connected!" + looperCnt++;
}


// tab menu helper

function openPage(evt, pageName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(pageName).style.display = "block";
    evt.currentTarget.className += " active"; 
}

// Gauge helper

function createCharts() {

  var basicGaugeSettings  = {
    id: "tbd",
    title: "Temperature",
    label: "C",
    value: getRandomInt(0, 100),
    gaugeWidthScale: 0.6,
    min: 0,
    max: 100,
    decimals: 1,
    counter: true,
    donut: false,
    relativeGaugeSize: true,
  }
  
  basicGaugeSettings.id = "temperature-gauge";
  basicGaugeSettings.title = "Temperature";
  basicGaugeSettings.label = "C";
  temperatureGauge = new JustGage(basicGaugeSettings);
  updateTemperatureGauge();
  
}

function updateFancyGauges() {
 
    // update Stat Symple
    updateTemperatureGauge();
}

function setGaugeSize(id){
//  var size = Math.min(window.innerHeight, window.innerWidth) / 2;
  var size = (window.innerHeight * 0.9) / 2;
  document.getElementById(id).style.width =  window.innerWidth + 'px';
  document.getElementById(id).style.height = size + 'px';
}
// Draw or Redraw meterial (desicant, tank) chart
function updateTemperatureGauge() {
  setGaugeSize("temperature-gauge");
  temperatureGauge.refresh(idry_struct.temperature / 100.0);
}


