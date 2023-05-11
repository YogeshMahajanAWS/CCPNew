function toggleButton(buttonId) {
  var button = document.getElementById("button" + buttonId);

  // Remove the "clicked" class from all buttons
  var buttons = document.getElementsByClassName("recording-controls")[0].getElementsByTagName("button");
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove("clicked");
  }

  // Add the "clicked" class to the clicked button
  button.classList.add("clicked");
}


function callAPI(buttonNumber) {
    // Make an API call based on the button clicked
    // Replace the API endpoint below with your desired API URL
    let apiEndpoint = '';
  
    switch (buttonNumber) {
      case 1:
        toggleButton(1)
        apiEndpoint = 'https://8u65ttwkka.execute-api.ap-southeast-2.amazonaws.com/recordcalls/recording-start';
        break;
      case 2:
        toggleButton(2)
        apiEndpoint = 'https://8u65ttwkka.execute-api.ap-southeast-2.amazonaws.com/recordcalls/recording-stop';
        break;
      case 3:
        toggleButton(3)
        apiEndpoint = 'https://8u65ttwkka.execute-api.ap-southeast-2.amazonaws.com/recordcalls/recording-pause';
        break;
      case 4:
        toggleButton(4)
        apiEndpoint = 'https://8u65ttwkka.execute-api.ap-southeast-2.amazonaws.com/recordcalls/recording-resume';
        break;
      default:
        break;
    }
  
 
// passing payload with the api request

    const options = {
        method: 'POST',
        url: apiEndpoint,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "contact_id" : initialContactId
        }),
    };
    fetch(apiEndpoint, options)
        .then(response => console.log(response))
        .catch(err => console.error(err));
  }