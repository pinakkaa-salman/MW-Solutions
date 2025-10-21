function submitMWSolutionsForm(formSelector, buttonSelector, noteSelector) {
  $(formSelector).on("submit", function (event) {
    event.preventDefault();
    event.stopPropagation();

    // Get the button text content (excluding the img)
    var $button = $(buttonSelector);
    var $buttonText = $button.contents().filter(function () {
      return this.nodeType === 3; // Text node
    });
    var originalText = $buttonText.text().trim();

    // Disable button and show loading state
    $button.addClass("loading");
    $buttonText[0].textContent = " Please Wait... ";
    $button.attr("disabled", true);

    // Gather form data
    var formData = {
      name: $(formSelector + ' [name="name"]').val(),
      email: $(formSelector + ' [name="email"]').val(),
      message: $(formSelector + ' [name="message"]').val(),
    };

    $.ajax({
      type: "POST",
      url: "https://emailjsfuntions-428145106157.asia-south1.run.app/mw-solutions",
      data: JSON.stringify(formData),
      contentType: "application/json",
      success: function (msg) {
        $button.removeClass("loading");
        $buttonText[0].textContent = " " + originalText + " ";
        $button.removeAttr("disabled");
        var result;

        if (msg === "Email sent successfully") {
          result =
            '<p style="color:green; font-weight: 600; font-size: 16px; width:100%">Email Sent Successfully!</p>';
          setTimeout(function () {
            $(noteSelector).fadeOut();
          }, 5000);
          $(formSelector)[0].reset();
        } else {
          result =
            '<p style="color:red; font-weight: 600; font-size: 16px; width:100%">' +
            msg +
            "</p>";
        }

        $(noteSelector).html(result).show();
      },
      error: function () {
        $button.removeClass("loading");
        $buttonText[0].textContent = " " + originalText + " ";
        $button.removeAttr("disabled");
        $(noteSelector)
          .html(
            '<p style="color:red; font-weight: 600; font-size: 16px; width:100%">Error sending email!</p>'
          )
          .show();
      },
    });

    return false;
  });
}

$(document).ready(function () {
  // Contact section form
  submitMWSolutionsForm(
    ".contact-section-form",
    ".contact-section-form button[type='submit']",
    ".contact-form-note"
  );
});
