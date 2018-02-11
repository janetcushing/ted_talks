//=================================================
// Functions
//=================================================


//-------------------------------------------------------
//scrape the articles from the target website
//-------------------------------------------------------
function scrapeArticles() {
    console.log("im in scrapeArticles");
    $.ajax({
        method: "GET",
        url: "/scrape"
    }).then(
        function (res) {
            // Reload the page to get the updated list
            console.log("im back from scraping");
            alert(`I scraped ${res} talks!`);
            location.reload();
        });
}


//=================================================
// On Page Load
//=================================================
$(document).ready(function () {

    // ========================================================================
    // When the scrape button is clicked, the  newly scraped documents are
    //  added to the database
    // ========================================================================
    $(document).on('click', '#scrapeBtn', function (event) {
        event.preventDefault();
        scrapeArticles();
    });

    // ========================================================================
    // When the save button is clicked, the 'saved' boolean field on the document
    // in the database is set to 'true', and then the document is moved from
    // being displayed on the home page to being displayed on the saved page
    // ========================================================================
    $(document).on('click', '.saveBtn', function (event) {
        // Make sure to preventDefault on a submit event. 
        event.preventDefault();
        console.log("i clicked the save button");
        let thisId = $(this).attr("data-id");
        //  Send the POST request.
        $.ajax({
            type: "PUT",
            url: "/api/saved/" + thisId,
            data: {
                "id": thisId,
                "saved": true
            }
        }).then(function (res) {
            console.log("i'm back from the server side");
            console.log(res);
            location.reload();
        });
    });
});