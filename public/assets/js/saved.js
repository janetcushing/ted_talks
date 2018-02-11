//=================================================
// On Page Load
//=================================================
$(document).ready(function () {

    var thisId = "";

    // function getTheNotes(thisId) {
    //     var modal = $(this);
    //     // ajax to get the previous notes goes here
    //     $.ajax({
    //         type: "GET",
    //         url: "/api/prevnotes2/5a7e021e3607104b31139d05"
    //     }).then(
    //         function (notes) {
    //             console.log(notes)
    //             modal.find('.modal-title').text(`Notes for Ted Talk  ${thisId}`);
    //         });
    // }

    
    $('#exampleModal').on('show.bs.modal', function (event) {
        console.log("i clicked the button to show the modal");
        var button = $(event.relatedTarget) // Button that triggered the modal
        var recipient = button.data('whatever') // Extract info from data-* attributes
        // thisId = button.data('id');
        thisId = "5a7e021e3607104b31139d05";
        console.log("this id is " + thisId);
        // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
        // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
        var modal = $(this);

        // ajax to get the previous notes goes here
        $.ajax({
            type: "GET",
            url: "/api/prevnotes2/5a7e021e3607104b31139d05"
        }).then(
            function (notes) {
                console.log(notes)
                modal.find('.modal-title').text(`Notes for Ted Talk  ${thisId}`);
            });
    });

    // $('#exampleModal').on('click', '#save-note', function (event) {
    //     console.log("i clicked the save-note button");
    //     var note = $('#message-text').val().trim();
    //     if (note) {
    //         var newNote = {
    //             "id": thisId,
    //             "note": note
    //         };
    //         console.log("newNote");
    //         console.log(newNote);
    //         $.ajax({
    //             type: "PUT",
    //             url: "/api/note/" + thisId,
    //             data: newNote
    //         });
    //     } else {
    //         $('#message-text').attr("placeholder", "* You must enter a note or click the close button");
    //     }
    // });

    // $('#exampleModal').on('click', '#delete-note', function (event) {
    //     console.log("i clicked the delete-note button");
    //     // Make sure to preventDefault on a submit event. 
    //     event.preventDefault();
    //     var noteId = $(this).attr("data-id");
    //     var note = $(this).attr("data-whatever");
    //     console.log(`this id is ${thisId}`);
    //     var articleId = '5a7e021e3607104b31139d05';
    //     deleteObj = {'articleId': articleId, 'note': note};
    //     //  Send the POST request.
    //     $.ajax({
    //         type: "PUT",
    //         url: "/api/deletenote/" + articleId,
    //         data: deleteObj
    //     }).then(function (res) {
    //         console.log("i'm back from the server side");
    //         console.log(res);
    //         location.reload();
    //     });
    // });

});