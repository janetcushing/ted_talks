//=================================================
// Global Variables
//=================================================
var thisId = "";



//=================================================
// Functions
//=================================================
//--------------------------------------------------------------
// reload the modal after a note is added or delete  
//--------------------------------------------------------------
function displayNotesModal(thisId, modal) {
    console.log("im in displayNotesModal");
    // var button = $(event.relatedTarget) // Button that triggered the mod
    console.log(`thisId ${thisId}`);
    $.ajax({
        type: "GET",
        url: "/api/prevnotes/" + thisId
    }).then(
        function (notes) {
            console.log(notes)
            modal.find('.modal-title').text(`Notes for Ted Talk  ${thisId}`);
        });
}



//=================================================
// On Page Load
//=================================================
$(document).ready(function () {

    // ========================================================================
    // When the 'delete from saved' button is clicked, the 'saved' boolean field on the document
    // in the database is set to 'false', and then the document is moved from
    // being displayed on the saved page to being displayed on the home page
    // ========================================================================
    $(document).on('click', '.deleteBtn', function (event) {
        event.preventDefault();
        console.log("i clicked the delete button");
        let thisId = $(this).attr("data-id");
        //  Send the POST request.
        $.ajax({
            type: "PUT",
            url: "/api/saved/" + thisId,
            data: {
                "id": thisId,
                "saved": false
            }
        }).then(function (res) {
            console.log("i'm back from the server side");
            console.log(res);
            location.reload();
        });
    });

    //--------------------------------------------------------------
    // display the modal when the 'add a note' button is clicked
    //--------------------------------------------------------------- 
    $('#exampleModal').on('show.bs.modal', function (event) {
        var modal = $(this);
        console.log("i clicked the button to show the modal");
        var button = $(event.relatedTarget) // Button that triggered the modal
        thisId = button.data('id');
        console.log("this id is " + thisId);
        modal.find('.modal-title').text(`Notes for Ted Talk  ${thisId}`);
    });

    //--------------------------------------------------------------
    // save the new note to the databasse when the save note button
    // is clicked
    //--------------------------------------------------------------
    $('#exampleModal').on('click', '#save-note', function (event) {
        console.log("i clicked the save-note button");
        var modal = $(this);
        var note = $('#message-text').val().trim();
        if (note) {
            var newNote = {
                "id": thisId,
                "note": note
            };
            console.log("newNote");
            console.log(newNote);
            $.ajax({
                type: "PUT",
                url: "/api/note/" + thisId,
                data: newNote
            }).then(
                function (notes) {
                    console.log(notes);
                    displayNotesModal(thisId, modal);
                    location.reload();
                });
        } else {
            $('#message-text').attr("placeholder", "* You must enter a note or click the close button");
        }
    });

    //--------------------------------------------------------------
    // delete the note from the database when the delete note button
    // is clicked
    //--------------------------------------------------------------
    $('#exampleModal').on('click', '#delete-note', function (event) {
        console.log("i clicked the delete-note button");
        event.preventDefault();
        var modal = $(this);
        var note = $(this).attr("data-whatever");
        deleteObj = {
            'articleId': thisId,
            'note': note
        };
        console.log(deleteObj);
        //  Send the POST request
        $.ajax({
            type: "PUT",
            url: "/api/deletenote/" + thisId,
            data: deleteObj
        }).then(function (res) {
            console.log("i'm back from the server side");
            displayNotesModal(thisId, modal)
            location.reload();
        });
    });

});