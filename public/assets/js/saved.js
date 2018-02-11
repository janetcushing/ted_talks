
function displayNotesModal(thisId, modal){
    console.log("im in displayNotesModal");
        // var button = $(event.relatedTarget) // Button that triggered the mod
        console.log(`thisId ${thisId}`);
        console.log("this id is " + thisId);
        $.ajax({
            type: "GET",
            url: "/api/prevnotes/" + thisId
        }).then(
            function (notes) {
                console.log(notes)
                modal.find('.modal-title').text(`Notes for Ted Talk  ${thisId}`);
            });
        // modal.find('.modal-title').text(`Notes for Ted Talk  ${thisId}`);
}
//=================================================
// On Page Load
//=================================================
$(document).ready(function () {

    var thisId = "";

    // function getTheNotes(thisId) {
    //     var modal = $(this);
    //     thisId = button.data('id');
    //     // ajax to get the previous notes goes here
    //     $.ajax({
    //         type: "GET",
    //         url: "/api/prevnotes/" + thisId
    //     }).then(
    //         function (notes) {
    //             console.log(notes)
    //             modal.find('.modal-title').text(`Notes for Ted Talk  ${thisId}`);
    //         });
    // }


    $('#exampleModal').on('show.bs.modal', function (event) {
        var modal = $(this);
        console.log("i clicked the button to show the modal");
        var button = $(event.relatedTarget) // Button that triggered the modal
        // var recipient = button.data('whatever') // Extract info from data-* attributes
        thisId = button.data('id');
        console.log("this id is " + thisId);
       

        // ajax to get the previous notes goes here
        // $.ajax({
        //     type: "GET",
        //     url: "/api/prevnotes/" + thisId
        // }).then(
        //     function (notes) {
        //         console.log(notes)
        modal.find('.modal-title').text(`Notes for Ted Talk  ${thisId}`);
        // });
    });

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
                    // $(this).find('.modal-title').text(`Notes for Ted Talk  ${thisId}`);
                });
        } else {
            $('#message-text').attr("placeholder", "* You must enter a note or click the close button");
        }
    });

    $('#exampleModal').on('click', '#delete-note', function (event) {
        console.log("i clicked the delete-note button");
        // Make sure to preventDefault on a submit event. 
        event.preventDefault();
        var modal = $(this);
        // var noteId = $(this).attr("data-id");
        var note = $(this).attr("data-whatever");
        console.log("this note is " + note);
        console.log(`this id is ${thisId}`);
        // var articleId = '5a7e021e3607104b31139d05';
        deleteObj = {
            'articleId': thisId,
            'note': note
        };
        console.log(deleteObj);
        //  Send the POST request.
        $.ajax({
            type: "PUT",
            url: "/api/deletenote/" + thisId,
            data: deleteObj
        }).then(function (res) {
            console.log("i'm back from the server side");
            console.log(res);
            displayNotesModal(thisId, modal);
            // $(this).find('.modal-title').text(`Notes for Ted Talk  ${thisId}`);
            // location.reload();
        });
    });

});