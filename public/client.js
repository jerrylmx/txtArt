$(document).ready(function() {
    $("#uploadForm").submit(function(event) {
        if (!$('[name="file"]')[0].files[0]) {
          alert("Please upload an image");
          return;
        }
        $("#spinner").show();
        $("#result").hide();
        $("#error").hide();
        var formData = new FormData();
        formData.append("file", $('[name="file"]')[0].files[0]);
        event.stopPropagation();
        event.preventDefault();
        $.ajax({
          url: $(this).attr("action"),
          data: formData,
          processData: false,
          contentType: false,
          type: 'POST',
          success: function(data) {
            $("#spinner").hide();
            $("#result").show();
            $('#result').val(data);
            $("#error").hide();
          },
          error: function(err) {
            $("#spinner").hide();
            $("#result").hide();
            $("#error").show();
          }
        });
        return false;
    });

    $(".custom-file-input").on("change", function() {
      var fileName = $(this).val().split("\\").pop();
      $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
    });
});