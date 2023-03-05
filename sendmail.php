<?php

if($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get the form data
    $name = $_POST["name"];
    $email = $_POST["email"];
    $message = $_POST["message"];
    $budget = $_POST["budget"];

    // Set the email recipient and subject
    $to = "joel@mikdevelopment.nl";
    $subject = "Nieuw email van re-made.studio";

    // Set the email message
    $body = "Name: $name\n\nEmail: $email\n\nMessage: $message\n\nBudget: $budget";

    // Send the email
    if(mail($to, $subject, $body)) {
        echo "Thank you for your submission!";
    } else {
        echo "There was an error sending your message";
    }
}

?>