var eType = {
    UUID_SERVICE: "23455100-8322-1805-A3DA-78E4000C659C",
    UUID_CHAR: "23455102-8322-1805-A3DA-78E4000C659C"
};
var sylvac = {
    UUID_SERVICE: "C1B25000-CAAF-6D0E-4C33-7DAE30052840",
    UUID_CHAR: "C1B25010-CAAF-6D0E-4C33-7DAE30052840"
}


var i = 0;
var offset = 48;
var app = {
    initialize: function() {
        this.bindEvents();
        document.getElementById("button-scan").disabled = false; 
    },
  
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
  
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
  
    refreshDeviceList: function() {
        console.log('exec refreshDeviceList');
        document.getElementById("BLE-table-body").innerHTML = '';
        document.getElementById("info").innerHTML = "Scanning!";
        ble.scan([], 5, app.onDiscoverDevice, app.onError);
    },

    onDiscoverDevice: function(device) {
        console.log(JSON.stringify(device));
        var listItem = document.createElement('tr'),
          html = '<td>' + device.name + '</td>' + 
            '<td>' + device.rssi + '</td>' + 
            '<td>' + device.id + '</td>';

        listItem.setAttribute('onclick',"app.bleConnectionRequest('" + device.id + "')" ); 
        listItem.dataset.deviceId = device.id; 
        listItem.innerHTML = html;
        document.getElementById("BLE-table-body").appendChild(listItem);
    },
  
    bleConnectionRequest: function(dev_id) {
      document.getElementById("BLE-table-body").innerHTML = ''; 
      document.getElementById("info").innerHTML = "Connecting!!!";
      ble.connect(dev_id, app.bleConnectionSuccess, app.bleConnectionFailure);
    },
  
    bleConnectionSuccess: function(device) {

      document.getElementById("info").innerHTML = device.name + " Connected!";
      document.getElementById("data-area").innerHTML = "Received data:";
      document.getElementById("id-info").innerHTML = "id = " + device.id;
      document.getElementById("button-scan").disabled = true;
      document.getElementById("button-disconnect").disabled = false;
      document.getElementById("BLE-table").hidden = true;  
     // ble.startNotification(device.id, eType.UUID_SERVICE, eType.UUID_CHAR, app.notification_handler, app.fail);
      ble.startNotification(device.id, sylvac.UUID_SERVICE, sylvac.UUID_CHAR, app.notification_handler, app.fail);
     },

    notification_handler: function(buffer) {
    //    alert("test");
      i++; 
      var data = new Uint8Array(buffer);
      var result = ((data[4]-offset)+((data[6]-offset)*0.1)+((data[7]-offset)*0.01)).toFixed(2);
      document.getElementById("data-area").innerHTML +="<br/>" + i +". "+result;
     },

    fail: function(reason){
        alert(reason);
    },
    
    bleConnectionFailure: function(device) {
      document.getElementById("button-scan").disabled = false;
      document.getElementById("button-disconnect").disabled = true;
      document.getElementById("BLE-table").hidden = false;  
      document.getElementById("id-info").innerHTML = ""; 
      document.getElementById("data-area").innerHTML = ""; 


      document.getElementById("info").innerHTML = "No Connections";
    },
  
    // Update DOM on a Received Event
    receivedEvent: function(id) {
      document.getElementById("button-scan").disabled = false;
      document.getElementById("button-scan").innerHTML = "Scan BLE";
   //   alert('Received Event: ' + id);
    }
};

setTimeout(function () {
  app.initialize(); 
  } ,2000);
  


