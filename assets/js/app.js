
// FUNCTIONS
// ============
function setBackgroundImage(myObject, imageUrl) {
    myObject.css({
                 "background-image": "url(" + imageUrl + ")",
                 "background-position": "center",
                 "background-size": "cover",         
                 "background-attachment": "fixed"  
                 });
  };
  
  
  
  function showThankYouModal() {
      var modal_header = $('<h2 class="modal-title text-center">Thank You, ' + firstName + '!</h2>');
      $(".modal-header").append(modal_header);
      $("#modal-success").modal('show');   
  };
  //Notification System YET TO BE ANALYSED
  function notificationModal() {
    
    var modal_dialog2 = $('<div class="modal-dialog bg-info border border-info text-white p-2 text-center" style="width:450px;"></div>');
    var modal_content2 = $(' <div class="modal-content"></div>');
    var modal_header2 = $('<h4 class="modal-title">Arrival Notification!</h4>');
    var button_close2 = $('<button type="button" class="close" data-dismiss="modal">&times;</button>');
    var modal_body2 = $('<div class="modal-body"></div>');
    var p_lead2 = $('<p class="lead">'+ firstName +'  '+ lastName + ' has arrived!</p>');
    var p_secondary2 = $('<p class="text-secondary"><small>Please follow up!</small></p>');
    var modal_footer2 = $('<div class="modal-footer"></div>');
    var button_success2 = $('<button type="button" class="btn btn-success float-right" data-dismiss="modal">Close</button>');
  
    modal_dialog2.append(modal_content2);
    modal_dialog2.append(modal_header2);
    modal_dialog2.append(button_close2);
    modal_dialog2.append(modal_body2);
    modal_dialog2.append(p_lead2);
    modal_dialog2.append(p_secondary2);
    modal_dialog2.append(button_success2);
    modal_dialog2.append(modal_footer2);
    
    $("#modal-info").html(modal_dialog2);
    $("#modal-info").modal('show');   
  };
  
  
  // GLOBAL VARIABLES
  // ================
      var createdBy;
      var firstName;
      var lastName;
      var status;
      var timeIn;
      var timeOut;
      var visitDate;
      var phone;
      
    
  
  // MAIN PROCESS
  // ============
  
  
  $(document).ready(function(){
    var time = moment().format("h:mm:ss a");
    var date = moment().format("DD/MM/YY");
   
      // Initialize Firebase
      var config = {
          apiKey: "AIzaSyCmHmdKbE5Bo0Gu1kzo82FZ7Fbbv47AK7o",
          authDomain: "vmsapp-dd2e5.firebaseapp.com",
          databaseURL: "https://vmsapp-dd2e5.firebaseio.com",
          projectId: "vmsapp-dd2e5",
          storageBucket: "vmsapp-dd2e5.appspot.com",
          messagingSenderId: "284192092734"
      };
      firebase.initializeApp(config);
  
      // Create a variable to reference the database
      var database = firebase.database();
     
  
        $("#dashboard").on("click", function(){
          window.location.href = "visitors.html";
        });
        
       
        
        // Capture checkin Button Click
        $("#checkin-btn").on("click", function(event) {
          // Prevent the page from refreshing
          event.preventDefault();
                  
         
          // Grabbed values from the form
          firstName = $("#first_name").val().trim();
          lastName = $("#last_name").val().trim();
          phone = $("#phone").val().trim();
          visitDate = date;
  
          timeIn = time;
          timeOut = time;
          status = "Checked-In";
          childkey = "";
  
          // Creates local "temporary" object for holding the visitor data
          var visitor = {
              firstName: firstName,
              lastName: lastName,
              phone: phone,
              //visitPurpose: visitPurpose,
              visitDate: visitDate,
              //meetingWith: meetingWith,
              timeIn: timeIn,
              timeOut: timeOut,
              status: status,
              //countryBirth: countryBirth,
              //healthInfo: healthInfo,  
              dateAdded: firebase.database.ServerValue.TIMESTAMP
          };
  
          //Pushes new visitor data to the database and auto-generates a unique key (childKey) every time a new child is added 
          database.ref().push(visitor);
          showThankYouModal();
          //This notification hs to be sent to the host 
          //notificationModal();     
         
            
          //Clears the form
          $("form").trigger("reset");
  
          //Hides the modal-signin
          $("#modal-signin").modal('hide');
          $("#modal-success").modal('show');
          
        });
  
  
      //Creates Firebase event for adding visitor info to the database when a user adds an entry
      database.ref().on("child_added", function(childSnapshot) {
            
          //Firebase watcher + initial loader. Store everything into a variable.
              visitor = childSnapshot.val();             
              firstName = visitor.firstName;
              lastName = visitor.lastName;
              phone = visitor.phone;
              //visitPurpose = visitor.visitPurpose;
              visitDate = visitor.visitDate;
              //meetingWith = visitor.meetingWith;
              timeIn = visitor.timeIn;
              timeOut = visitor.timeOut;
              status  = visitor.status;
              //countryBirth = visitor.countryBirth;
              //healthInfo= visitor.healthInfo;
              childkey = visitor.dateAdded;
              
            
              //Append new row to the table with the new train input
              var newRow = $("<tr class='clickableRow'>");
              newRow.append($("<td>" + firstName + "</td>"));
              newRow.append($("<td>" + lastName + "</td>"));
              newRow.append($("<td>" + phone + "</td>"));
             // newRow.append($("<td>" + visitPurpose + "</td>"));
              newRow.append($("<td>" + visitDate + "</td>"));
              //newRow.append($("<td>" + meetingWith + "</td>"));
              newRow.append($("<td>" + timeIn + "</td>"));
              newRow.append($("<td>" + timeOut + "</td>"));
              newRow.append($("<td>" + status + "</td>"));
              //newRow.append($("<td>" + countryBirth + "</td>"));
              //newRow.append($("<td>" + healthInfo + "</td>"));
              //newRow.append($("<td class='key'>" + childkey + "</td>"));
              newRow.append($("<td class='text-center'><button class='edit btn btn-danger btn-xs' data-key='" + childkey + "'><i class='far fa-edit'></i>Edit</button></td>"));
              
            
            $("#add-row").append(newRow);
  
              }, function(errorObject) {
                  console.log("Errors handled: " + errorObject.code);
      });
  
  });  
  
  
  /***$(document.body).on("click", "tr", ".clickable", function(event){
    
    //Edit rows
    database = firebase.database();
    var ref = database.ref();
    var $thisRow = $(this).closest("tr");       // Finds the closest row <tr> 
    var $tds = $thisRow.find("td");             // Finds all children <td> elements
    //Finds the specified children <td> elements and stores their text contents to variables
    var $td1 = $thisRow.find("td:nth-child(1)").text(); 
    var $td2 = $thisRow.find("td:nth-child(2)").text(); 
    var $td3 = $thisRow.find("td:nth-child(3)").text();
    var $td4 = $thisRow.find("td:nth-child(4)").text();
    var $td7 = $thisRow.find("td:nth-child(7)").text();
    var $td9 = $thisRow.find("td:nth-child(9)").text();
  
      // Clear sessionStorage
      sessionStorage.clear();
  
      // Store all content into sessionStorage
      sessionStorage.setItem("firstName", $td1);
      sessionStorage.setItem("lastName", $td2);
      sessionStorage.setItem("phone", $td3);
      //sessionStorage.setItem("reason", $td4);
      sessionStorage.setItem("timeIn", $td7);
      sessionStorage.setItem("status", $td9);
     
     //Redirect to page overview.html    
      window.location.href = "overview.html";
      
  
  }); ***/
  /***
  // By default display the content from sessionStorage
  $('input[name="firstName-display"]').val(sessionStorage.getItem("firstName"));
  $('input[name="lastName-display"]').val(sessionStorage.getItem("lastName"));
  $('input[name="phone-display"]').val(sessionStorage.getItem("phone"));
  //$('select[name="reason-display"] option:selected').text(sessionStorage.getItem("reason"));
  $('input[name="timeIn-display"]').val(sessionStorage.getItem("timeIn"));
  $('input[name="status-display"]').val(sessionStorage.getItem("status"));
  ***/