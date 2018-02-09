//=================================================
// On Page Load
//=================================================
$(document).ready(function () {

    // ========================================================================
    // When the submit button is clicked, a new row is added to the database
    // ========================================================================
    // $(document).on('click', '#addanoteBtn', function (event) {
    //     // Make sure to preventDefault on a submit event.
    //     event.preventDefault();
    //     scrapeArticles();
    // });

    // $(document).on('click', '.addanoteBtn', function (event) {
    //     // Make sure to preventDefault on a submit event. 
    //     event.preventDefault();
    //     console.log("i clicked the addanote button");
    //     var thisId = $(this).attr("data-id");
    //     console.log(`this id is ${thisId}`);
    //  Send the POST request.
    // $.ajax({
    //     type: "PUT",
    //     url: "/api/saved/" + thisId,
    //     data: {
    //         "id": thisId
    //     }
    // }).then(function (res) {
    //     console.log("i'm back from the server side");
    //     console.log(res);
    //     $(this).parents("tr").addClass("color");
    //     $(".saveBtn").text("Saved");
    //     location.reload();
    // });
    // });

    $(document).on('click', '.deleteBtn', function (event) {
        // Make sure to preventDefault on a submit event. 
        event.preventDefault();
        console.log("i clicked the delete button");
        var thisId = $(this).attr("data-id");
        console.log(`this id is ${thisId}`);
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

    var thisId = '';
    $('#exampleModal').on('show.bs.modal', function (event) {
        console.log("i clicked the button to show the modal");
        var button = $(event.relatedTarget) // Button that triggered the modal
        var recipient = button.data('whatever') // Extract info from data-* attributes
        thisId = button.data('id');
        console.log(`this id is ${thisId}`);

        // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
        // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
        var modal = $(this);

        // ajax to get the previous notes goes here
        $.ajax({
            type: "GET",
            url: "/api/prevnotes/" + thisId
        }).then(
            function (notes) {
                console.log(notes)

                // let thisNoteId = notes.
                // modal.find('.modal-body')..val(recipient);
                // Reload the page to get the most recent ask
                // location.reload();
                modal.find('.modal-title').text(`Notes for Ted Talk  ${thisId}`);
                modal.find('.modal-body').val(recipient);
            });



    });

    $('#exampleModal').on('click', '#save-note', function (event) {
        console.log("i clicked the save-note button");
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
            });
        } else {
            $('#message-text').attr("placeholder", "* You must enter a note");
        }
    });
    // $('#myModal').on('shown.bs.modal', function () {
    //     $('#myInput').focus()
    //   })

});