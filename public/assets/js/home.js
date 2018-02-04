//=================================================
// Functions
//=================================================

function scrapeArticles(){
    console.log("im in scrapeArticles");
    $.ajax({
        method: "GET",
        url: "/scrape"
    }).then(
        function () {
            // Reload the page to get the updated list
            console.log("im back from scraping");
            alert("I scraped 20 talks!");
            location.reload();
        });
}

function saveArticle(){
    console.log("im in saveArticle");
    // let searcher = "$(#" + thisId + ")";
    // console.log("searcher " + searcher);
    console.log("im in saveArticle");
    console.log("title " +  $(this).closest('#title').val());
    // var newSavedArticle = {
    //     id: $(this).data("id"),
    //         title: $(this).$("#title").val().trim(),
    //         link: $(this).$("#link").val().trim(),
    //         speaker: $(this).$("#speaker").val().trim(),
    //         date_posted: $(this).$("#date_posted").val().trim(),
    //         classification: $(this).$("#classification").val().trim()
    // }
// console.log("newSavedArticle " + newSavedArticle);
//     // Send the POST request.
//     $.ajax("/api/saved/new", {
//         type: "POST",
//         data: newSavedArticle
//     }).then(
//         function () {
//             // Reload the page to get the updated list
//             location.reload();
//         });
}

//=================================================
// On Page Load
//=================================================
$(document).ready(function () {
    
    // ========================================================================
    // When the submit button is clicked, a new row is added to the database
    // ========================================================================
    $(document).on('click', '#scrapeBtn', function (event) {
        // Make sure to preventDefault on a submit event.
        event.preventDefault();
        scrapeArticles();
    });

    $(document).on('click', '.saveBtn', function (event) {
        // Make sure to preventDefault on a submit event. 
        event.preventDefault();  
        console.log("i clicked the save button");
        var newSavedArticle = {
            id: $(this).data("id"),
            title: $(".title").val().trim()
            // link: $(this).$("#link").val().trim(),
            // speaker: $(this).$("#speaker").val().trim(),
            // date_posted: $(this).$("#date_posted").val().trim(),
            // classification: $(this).$("#classification").val().trim()
        }
        console.log("newSavedArticle ");
        console.log(newSavedArticle);
        saveArticle();
    });
});