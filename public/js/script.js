var socket = io.connect();

$(document).ready(function() {
    // call function to enable foundation components
    $(document).foundation();

    /**
    *
    * $('#red') --- select the HTML element which has the id: red
    * 
    * $('#red').on('change.fndtn.slider', function())
    * 
    * Add an event listener on $('#red'), the event it listens to is: change.fndtn.slider
    * which means when change the slider in the webpage. For more detail about Foundation 
    * event, please see: http://foundation.zurb.com/docs/
    *
    * socket.emit('red', { val: $('#red').attr('data-slider')})
    * When slider changes, use: socket.emit("event-name", data) to emit the data to a socket event
    * first parameter is the event name, second is the data.
    *
    * See README.md for more details about how to communicate between front end and back end
    * 
    **/

    $('#red').on('change.fndtn.slider', function(){
        socket.emit('red', { val: $('#red').attr('data-slider') });
    });

    $('#yellow').on('change.fndtn.slider', function(){
        socket.emit('yellow', { val: $('#yellow').attr('data-slider') });
    });

    $('#green').on('change.fndtn.slider', function(){
        socket.emit('green', { val: $('#green').attr('data-slider') });
    });
});