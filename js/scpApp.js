/*
 * @package scpApp
 * @author Kashyap
 * @license GNU Affero General Public License
 */

var scpApp = {

socket: null,
socketIsConnected: null,
socketReconnectTimer: null,
socketServerHost: "localhost",
socketServerPort: 7500,

init: function() {
                        // initialize the flash component
                        FABridge.addInitializationCallback('ajaxChat', this.flashInterfaceLoadCompleteHandler);
                    },

flashInterfaceLoadCompleteHandler: function() {
                                       scpApp.initializeFlashInterface();
                                   },

initializeFlashInterface: function() {
                              this.socketConnect();
                              this.initializeCustomFlashInterface();
                          },

socketConnect: function() {
                   if(!this.socketIsConnected) {
                       try {
                           if(!this.socket && FABridge.ajaxChat) {
                               this.socket = FABridge.ajaxChat.create('flash.net.Socket');
                               this.socket.addEventListener('connect', this.socketConnectHandler);
                               this.socket.addEventListener('close', this.socketCloseHandler);
                               this.socket.addEventListener('data', this.socketDataHandler);
                               this.socket.addEventListener('ioError', this.socketIOErrorHandler);
                               this.socket.addEventListener('securityError', this.socketSecurityErrorHandler);
                           }
                           this.socket.connect(this.socketServerHost, this.socketServerPort);
                       } catch(e) {
                           alert(e);
                       }
                   }
                   clearTimeout(this.socketReconnectTimer);
                   this.socketReconnectTimer = null;
               },

socketConnectHandler: function(event) {
                          scpApp.socketIsConnected = true;
                          // setTimeout is needed to avoid calling the flash interface recursively:
                          setTimeout('scpApp.socketRegister()', 0);
                      },

socketCloseHandler: function(event) {
                        scpApp.socketIsConnected = false;
                        if(scpApp.socket) {
                            clearTimeout(scpApp.timer);
                            scpApp.updateChat(null);
                        }
                    },

socketDataHandler: function(event) {
                       scpApp.socketUpdate(event.getData());
                   },

socketIOErrorHandler: function(event) {
    alert("socketIOError");
                                  },

socketSecurityErrorHandler: function(event) {
    alert("socketIOError");
    },

socketRegister: function() {
if(this.socket && this.socketIsConnected) {
    try {
        this.socket.writeUTFBytes("Hello this is scp web app. Who are you?");
    } catch(e) {
        alert(e);
    }
}
},

socketSend: function(str) {
if(str.value.length == 0) {
    alert("Please enter a message");
    return;
}
if(this.socket && this.socketIsConnected) {
    try {
        this.socket.writeUTFBytes(str.value);
    } catch(e) {
        alert(e);
    }
}
// clear the contents of the element
str.value='';
//notify the user that the data is sent
alert("Data successfully sent")
},

socketUpdate: function(data) {
                  alert(data);
              }
}
