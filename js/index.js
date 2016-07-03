// Our public variable containing our module
// for other parts of this program to interact
// with, but ensuring all private variables in here
// get the full scope with no confusion possible.
var MICROSTOCKS = (function () {
  // Private functions necessary for initial variables
  // ------------------------------------------------
  // JSON packager for an array
  // TO-DO: generalize this to work with any array
  var arrayToJSON = function(array) {
      var response = "";
      for (var i = 0; i < array.length; i++) {
        response = response + '{"name":"' + array[i].name + '",' +
          '"cost":' + array[i].cost + ',' +
          '"amount":' + array[i].amount + '},';
      }
      // Remove last comma
      response = response.slice(0, -1);
      // Return the string
      return response;
    }
    // Random number function with optional lowNum + highNum variable.
    // If no lwo or high number is specified, the function will default
    // to ranging from 1-100.
  var randomNum = function(lowNum, highNum) {
      // If lowNum wasn't defined, set it to 1 to get the 1-100 range
      if (lowNum === undefined || lowNum === NaN || lowNum === null || typeof lowNum !== "number") {
        // If lowNum ISN'T a number, it's safe to set it to 1.
        lowNum = 1;
        // And also highNum to 100.
        highNum = 100;
      }
      // If highNum wasn't defined, set it to the first value and lowNum to 1 to get the 1-lowNum range
      if (highNum === undefined || highNum === NaN || highNum === null || typeof highNum !== "number") {
        // If highNum ISN'T a number, it's safe to set it the range to 1-100.
        highNum = lowNum;
        lowNum = 1;
      }
      // Take the floor of random calculation
      return Math.floor(Math.random() * (highNum - lowNum) + lowNum);
    }
    // Function used to create a new name for a resource
  var createResourceName = function() {
      var resourceName = "";
      for (var i = 0; i < 3; i++) {
        // Pulled from http://stackoverflow.com/questions/3145030/convert-integer-into-its-character-equivalent-in-javascript
        resourceName += String.fromCharCode(65 + randomNum(26));
      }
      return resourceName;
    }
    // Initialize resources array with this function
  var createResources = function(resourceAmount) {
      var retArray = [];
      for (var i = 0; i < resourceAmount; i++) {
        retArray.push({
          "cost": randomNum(randomNum(2, 5), randomNum(20, randomNum(20,110))),
          "name": createResourceName()
        });
      }
      return retArray;
    }
    // Initialize resources array with this function
  var givePlayerResources = function(resources, resourceAmount) {
    for (var i = 0; i < resourceAmount; i++) {
      // Ensure player gets at least 1 resource to play with
      var atLeastOne = false;
      // 30% chance the player will own that resource
      if(randomNum(100)>70) {
        resources[i].amount = randomNum(randomNum(1, 4), randomNum(5, 20));
        atLeastOne = true;
      }
      else {
        resources[i].amount = 0;
      }
    }
    // If the player didn't even get one resource
    if(atLeastOne === false) {
      // Give the player a random resource
      resources[randomNum(0,resources.length)].amount = randomNum(randomNum(1,4), randomNum(5,20));
    }
  }
  // Ability to get Object Key index from JSON object
  // borrowed from: http://stackoverflow.com/questions/15218448/get-index-of-a-key-in-json
  var getObjectKeyIndex = function(obj, keyToFind) {
    var i = 0, key;

    for (key in obj) {
        if (key == keyToFind) {
            return i;
        }

        i++;
    }

    return null;
  }

  // Module
  // ------
  // Create the module we'll export
  var microstocksModule = {},
  
  // Private Variables
  // -----------------
  // Let's pull in the log and ul.
  log = document.getElementsByClassName("log")[0];
  logList = document.getElementsByClassName("log-list")[0];
  // We need to set how much it is to move
  moveFee = 10;
  // Change this variable to modify the amount of resources generated
  resourceAmount = randomNum(12,20);
  // Create some variables to fill up player JSON with
  resources = createResources(resourceAmount);
  // Fill up the playerObject resource array w/ amounts for the player
  givePlayerResources(resources, resourceAmount);
  // Now sort the resources array by Amount
  // Before applying to the player
  resources.sort(function(a, b) {
    return b.amount - a.amount;
  });
  // Array of locations around the USA
  // This is referenced by playerObjects["stats"].location
  locations = [
    "New York",
    "Chicago",
    "Philadelphia",
    "Austin",
    "Los Angeles",
    "San Fransisco",
    "Seattle",
    "Portland",
    "Minneapolis",
    "Cleveland",
    "Providence",
  ];
  // Create text string to represent JSON
  playerString = '{"stats":{' +
    '"money":' + randomNum(500) + ',' +
    '"location":"' + randomNum(locations.length) + '",' +
    '"resources":[' +
    arrayToJSON(resources) +
    ']' +
    '}' +
    '}';
  // Get the object with JSON.parse
  playerObject = JSON.parse(playerString);

  // Private functions needed for resources & log
  // ---------------------------------
  // Add list element to object
  var addListElement = function(obj, text, cssClass) {
      // If text isn't empty
      if (text !== undefined && text !== null) {
        // We can set the amount of <li>s to the length of "text"
        var listElementsToCreate = (typeof text === "object" ? text.length : 1);
        var theText = "";
        // Let's iterate now over the listOfElementsToCreate
        for (var i = 0; i < listElementsToCreate; i++) {
          // If we get a function, let's execute it and any optional arguments
          if(typeof text[0] === "function") {
            theText = text[0](text[1],text[2]);
          }
          // Or we got an array or JSON, so let's just
          // fill theText with the appropriate value from text
          else if(typeof text === "object") { 
            theText = text[i];
          }
          // Otherwise, we just need the string that was given to us!
          else {
            theText = text;
          }
          // Create a new <li> element
          var listElement = document.createElement("LI");
          // Compose the message that will show up in the log
          var textNode = document.createTextNode(theText);
          // Append message to <li> node
          listElement.appendChild(textNode);
          // Append <li> node to log's <ul> if we defined obj
          if (obj !== undefined || obj !== null) {
            obj.appendChild(listElement);
            // If we have messages, we need to reset
            // the scroll for the log so it's on the bottom.
            obj.scrollTop = obj.scrollHeight;
          }
          // Otherwise let's print out the error to the console
          else {
            console.error("addListElement exception: obj was null. Please call addListELement with a non-null, defined object as the first argument. See syntax: addListElement(obj, text, cssClass), with cssClass being optional.");
          }
        }
      } else {
        console.error("addListElement exception: text was null. Please call addListELement with a non-null, defined text string as the second argument. See syntax: addListElement(obj, text, cssClass), with cssClass being optional.");
      }
      // If we HAVE a class coming in and it's valid
      if (cssClass !== undefined && cssClass !== null) {
        // Let's add it to the new <li>
        var cssClassArray = cssClass.split(" ");
        for (var i in cssClassArray) {
          listElement.classList.add(cssClassArray[i]);
        }
      }
    }
    // Change existing list element
  var changeListElement = function(cssClass, text) {
      // This element already exists, so let's find it
      var listElement = document.getElementsByClassName(cssClass)[0];
      if (listElement !== undefined) {
        // Set message to incoming text
        listElement.innerText = text;
      } else {
        console.error("changeListElement needs to be called with a valid cssClass and incoming text. Check your syntax: changeListElement(cssClass, text);");
      }
    }
    // Function to fluctuate resource prices
    // called everytime inventory is updated.
  var updateResourcePrices = function() {
      // Pull playerObject's resources in locally
      var playerResources = playerObject["stats"].resources;
      // Amount resources should be flucuating
      var variant = 0;
      // Max $ amount resources can be
      var resourceMax = 250;
      // Declare a couple variables to use inside the for loop
      var resourceCost = 0;
      var resourceName = "";
      // We'd like to evaluate every resource per update
      for (var i = 0; i < playerResources.length; i++) {
        // Reset variant
        variant = 0;
        // Pull cost in so we only have to query playerResources array once
        resourceCost = playerResources[i].cost;
        resourceName = playerResources[i].name;
        // ~20% chance for the company's value to potentially shift
        if (randomNum(100) < 18) {
          // Let's pass another check (sort of random) to increase resource price
          if (randomNum(100) < randomNum(30,48)) {
            variant = randomNum(5);
            // Show the increase in value on the log
            addListElement(logList, resourceName + " has risen $" + variant + " dollars.", "resource-increase");
          }
          // Or if we pass yet another random check, let's lower the value
          // if we are above 0
          else if ((randomNum(100) < randomNum(30,48)) && (resourceCost > 0)) {
            // Turn variant negative
            variant = randomNum(5) * -1;
            // Show the decrease in value on the log
            addListElement(logList, resourceName + " has fallen $" + Math.abs(variant) + " dollars.", "resource-decrease");
          }
        } 
        // Or we don't hit the shift chance, but
        // there is a tiny chance something drastic happens...
        else {
          // If there was no regular shift, there is a
          // 0.5% chance for the company's value to grow by up to 1/5th.
          if(randomNum(1000) < 5) {
            // Set variant to up to 1/5 of resourceCost
            variant = Math.floor(resourceCost * (randomNum(1,20)*.01));
            // Show the cost hike on the log
            addListElement(logList, resourceName + " has risen $" + variant + " dollars.", "resource-increase");
          }
          // And if that shift never happens, then the comapny is doomed at a
          // 0.5% chance for the it's value to drop by up to 1/5th
          else if (randomNum(1000) < 5 && resourceCost > 0) {
            // Set variant to up to negative 1/5 of resourceCost
            variant = Math.floor(resourceCost * (randomNum(1,20)*.01)) * -1;
            // Show the subtraction on the log
            addListElement(logList, resourceName + " has fallen $" + Math.abs(variant) + " dollars.", "resource-decrease");
          }
        }
        // Now that we have the variant for sure, modify the playerObject
        playerObject["stats"].resources[i].cost = parseInt(resourceCost) + variant;
        // Check if the resource is really low
        if(resourceCost <= 1) {
          // 15% to make the resource bounce back
          if(randomNum(100) < 25) {
            playerObject["stats"].resources[i].cost = randomNum(5,11);
          }
        }
        // Check if the resource is super high
        if(parseInt(resourceCost) >= resourceMax) {
          // 33% to make the resource bottom out a bit
          if(randomNum(100) < 33) {
            // Bottom out, retain only 55-70% of cost for this resource
            playerObject["stats"].resources[i].cost = resourceCost * (randomNum(55,70) * 0.01);
          }
          // Otherwise let's just set it to resourceMax
          else {
            playerObject["stats"].resources[i].cost = resourceMax;
          }
        }
      }
    }
    // Function to update the inventory box.
    // Called when controls are interacted with.
  var updateInventory = function() {
    // Bring player in locally
    var player = playerObject["stats"];
    // Get the updated resource prices
    updateResourcePrices();
    // Draw out the new inventory
    changeListElement("cash", "Money: $" + player.money);
    // Variable to display the total amount of the portfolio
    var portfolioTotal = 0;
    // Display portfolio total
    for (var i = 0; i < player.resources.length; i++) {
      portfolioTotal += player.resources[i].amount * player.resources[i].cost;
    }
    // We need to display our portfolio
    changeListElement("portfolio", "Total Portfolio: $" + portfolioTotal);
    // Pull in old net worth value and see if we've gone up
    // (Usually from travelling)
    var netBlock = document.getElementsByClassName("net-worth")[0];
    // Get the content of the netBlock
    var oldNetWorth = netBlock.textContent;
    // Grab the net worth amount off of the textContent
    oldNetWorth = oldNetWorth.split("\$");
    // We need to display our total worth
    if(parseInt(oldNetWorth[1]) < portfolioTotal + parseInt(player.money)) {
        // If our total value has increased, show it!
        changeListElement("net-worth", "Net Worth: $" + (portfolioTotal + parseInt(player.money)) + " --- Up!");
    }
    else if (parseInt(oldNetWorth[1]) === portfolioTotal + parseInt(player.money)) {
        // No increase!
        changeListElement("net-worth", "Net Worth: $" + (portfolioTotal + parseInt(player.money)));
    }
    else {
        // We lost money!
        changeListElement("net-worth", "Net Worth: $" + (portfolioTotal + parseInt(player.money)) + " --- Down!");
    }
    changeListElement("location", "Location: " + locations[player.location]);
    // Sort out the player's resource array 
    player.resources.sort(function(a, b) {
      return b.amount - a.amount;
    });
    // Update the player's resource amounts and change any owned to have said css class
    for (var i = 0; i < player.resources.length; i++) {
      var theResource = document.getElementsByClassName("resource-"+i)[0];
      changeListElement("resource-" + i, player.resources[i].name + " | " + player.resources[i].amount + " owned | $" + player.resources[i].cost);
      if(player.resources[i].amount > 0 && !theResource.classList.contains("owned")) {
        theResource.classList.add("owned");
      }
      else if(player.resources[i].amount === 0 && theResource.classList.contains("owned")) {
        theResource.classList.remove("owned");
      }
    }
  } 
  // Will return true if player owns any resources,
  // and false otherwise 
  var playerOwnsResource = function() {
      var ownedResources = [];
      // For every resource we have
      for(var i = 0; i < playerObject["stats"].resources.length; i++) {
        // If we own that resource
        if(playerObject["stats"].resources[i].amount > 0) {
          // Push the index into that ownedResources array
          ownedResources.push(i);
        }
      }
      // Now the moment of truth
      if(ownedResources.length !== 0) {
        return true;
      }
      return false;
  }
  // Set random resource index, based on ownership
  var setRandomResourceIndex = function() {
      // Empty array holding resources index's that we own
      var ownedResourcesIndex = [];
      // If we have more than 1 resource
      if(playerObject["stats"].resources.length > 1) {
        // For every resource we have
        for(var i = 0; i < playerObject["stats"].resources.length; i++) {
          // If we own that resource
          if(playerObject["stats"].resources[i].amount > 0) {
            // Push the index into that ownedResourcesIndex array
            ownedResourcesIndex.push(i);
          }
        }
      }
      // Pick a random value in ownedResourcesIndex and
      // now set playerObject's resourceIndex for permanence
      // And let's default this value to 0 if there are no owned resource
      // so we'll just try and sell the first resource on the list.
      playerObject["stats"].resourceIndex = (ownedResourcesIndex.length === 0) ? 0 : ownedResourcesIndex[randomNum(0,ownedResourcesIndex.length)];
  }
  // Update resource index globally
  var updateResourceIndex = function(resourceIndex) {
      // Pull in playerObject to this method
      var player = playerObject["stats"];
      // If we have a resourceIndex, let's set it accordingly (the click came from resource button)
      if (typeof resourceIndex !== "undefined" && typeof resourceIndex !== "object") {
        if (resourceIndex < player.resources.length) {
          playerObject["stats"].resourceIndex = resourceIndex;
        } else {
          console.error("updateResourceIndex exception: Incoming resourceIndex outside of bounds of resources array.");
        }
      }
      // We don't have a suitable resource index, so let's randomly shuffle the resource index
      else {
          playerObject["stats"].resourceIndex = randomNum(0,player.resources.length);
        }
      }
    // Update location index globally
  var updateLocationIndex = function(newLocation) {
      playerObject["stats"].location = newLocation;
    }


  // Add button event listener function, takes 2 optional functions 
  // (logMessage and moreBehavior)
  var addButtonEvent = function(button, logMessage, moreBehavior) {
      var logText = "";
      if (button !== undefined && button !== null) {
        button.addEventListener("click", function() {
          if ((typeof logMessage === "object") && logMessage !== undefined && logMessage !== null) {
            // Supports three arguments in the function
            // This is array support, need to generalize
            if (logMessage.length > 1) {
              if (logMessage.length === 2) {
                logText = logMessage[0](logMessage[1]);
              } else if (logMessage.length === 3) {
                logText = logMessage[0](logMessage[1], logMessage[2]);
              }
            }
            // Otherwise call function blank
            else {
              // Query our logMessage function
              logText = logMessage();
            }
          } 
          // Also execute if it's just a function
          else if (typeof logMessage === "function") {
            logText = logMessage();
          }
          // If it's neither, I don't want it, so print out the error in the console
          else {
            console.error("addButtonEvent called with undefined logMessage function. logMessage function should return a string. See syntax: addButtonEvent(button, logFunction, moreBehavior), with moreBehavior being an optional function.");
            console.error("typeof logMessage = " + typeof logMessage);
          }
          // Add the list element (no cssClass yet)
          if (logText !== undefined) {
            addListElement(logList, logText);
          }
          // run any additional code given in arguments
          if (moreBehavior !== undefined && moreBehavior !== null) {
            // It's just a function, cool, we'll run it
            if (typeof moreBehavior === "function") {
              moreBehavior();
            }
            // Array? Cool, function with arguments
            // need to generalize just like up above
            else if (typeof moreBehavior === 'object') {
              moreBehavior[0](moreBehavior[1])
            }
          }
        });
      } else {
        console.error("addButtonEvent needs a defined, non-null button as it's first argument. See syntax: addButtonEvent(button, logFunction, moreBehavior), with moreBehavior being an optional function.");
      }
    }
    // Buy button functions 
    // (Probably could combine sellMessage & buyMessage into
    // one super "Message" function that would take in
    // yet another function... that is getting ugly though  
  var buyMessage = function(resourceIndex, amount) {
    // Check resourceIndex
    if (typeof resourceIndex === "undefined" || resourceIndex === null) {
      // if we are null or empty, make one up.
      updateResourceIndex();
      resourceIndex = playerObject["stats"].resourceIndex;
    } else {
      // Pull in resourceIndex
      updateResourceIndex(resourceIndex);
    }

    // Check amount
    var resourceAmount = (amount === undefined) ? 1 : amount;

    // If they can't buy the resource, fuck them.
    if (playerObject["stats"].money < (playerObject["stats"].resources[resourceIndex].cost * resourceAmount)) {
      return ["Can't afford unit(s) of " + playerObject["stats"].resources[resourceIndex].name + ".",
        "(Attempted to purchase " + resourceAmount + ".)"
      ];
    }
    // If the player can afford it, let's buy it!
    else {
      return "You bought " + resourceAmount + " unit(s) of " + playerObject["stats"].resources[resourceIndex].name + ".";
    }
  }
  var buyAction = function(amount) {
    // Pull in playerObject to this method
    var player = playerObject["stats"];
    // Check amount
    var resourceAmount = (amount === undefined) ? 1 : amount;
      // Pull in resourceIndex
      var resourceIndex = player.resourceIndex;
      // If the player can afford the resource
      if (player.money >= (player.resources[resourceIndex].cost * resourceAmount)) {
        // Update the player's money
        playerObject["stats"].money = player.money - (player.resources[resourceIndex].cost * resourceAmount);
        // Update the player's resource amount
        playerObject["stats"].resources[resourceIndex].amount += parseInt(resourceAmount);
      } else {
        console.error("buyAction exception: Not enough money to make purchase.");
      }
      updateInventory();
    }
    // Sell button functions
  var sellMessage = function(resourceIndex, amount) { 
    // Check resourceIndex
    if (typeof resourceIndex === "undefined" || resourceIndex === null) {
      // If the player owns NO resource, return a log message indicating
      // that before messing with resourceIndex
      if(!playerOwnsResource()) {
        return "You don't have any resource to sell! Try buying some.";
      }
      // if I'm calling this function with no resourceIndex, it's
      // safe to assume it's from the sell random button, since the
      // resources will always call sellMessage with their index, so just
      // set a new random resource index.
      setRandomResourceIndex();
      // Set resourceIndex for this function
      resourceIndex = playerObject["stats"].resourceIndex;
    } else {
      // Pull in resourceIndex
      updateResourceIndex(resourceIndex);
    }
    // Check amount
    var resourceAmount = (amount === undefined) ? 1 : amount;

    // If you have the resource amount, go ahead and sell it!
    if (playerObject["stats"].resources[resourceIndex].amount >= resourceAmount) {
      return "You sold " + resourceAmount + " unit(s) of " + playerObject["stats"].resources[resourceIndex].name + ".";
    }
    // If the player can't afford it, fuck off!
    else {
      return "You don't have " + resourceAmount + " unit(s) of " + playerObject["stats"].resources[resourceIndex].name + ".";
    }
  }
  var sellAction = function(amount) {
    // If the player owns resources, continue on with this action
    if(playerOwnsResource()) {
      // Pull in playerObject to this method
      var player = playerObject["stats"];
      // Check amount
      var resourceAmount = (amount === undefined) ? 1 : amount;
      // Pull in resourceIndex
      var tmpResourceIndex = player.resourceIndex;
      // If you have the resource amount, go ahead and sell it!
      if (player.resources[tmpResourceIndex].amount >= resourceAmount) {
        // Update players resource
        playerObject["stats"].resources[tmpResourceIndex].amount -= parseInt(resourceAmount);
        // Update player's money
        playerObject["stats"].money = player.money + (player.resources[tmpResourceIndex].cost * resourceAmount);
        // Update the inventory box
        updateInventory();
      } 
    }
  }
  // Location logging functionality
  var travelMessage = function() {
      // Pull in playerObject to this method
      var player = playerObject["stats"];
      // if the player doesn't have $10, don't let him travel.
      if (player.money < moveFee) {
        return "Can't afford to move! Why don't you sell some resources?";
      }
      // make sure we have a valid resource index for potentially selling
      // since this runs before sellAction.
      updateResourcendex();
      // Try and generate a new locationIndex. 
      var newNum = randomNum(locations.length);
      // Make sure we don't get the same locationIndex that we have
      while (newNum === player.location) {
        // Make sure we generate a NEW location
        newNum = randomNum(locations.length);
      }
      updateLocationIndex(newNum);
      return ["Player moved to " + locations[player.location],
              "Charged $" + moveFee + " to go!"];
    }
    // Subsequent function, update screen
  var travelAction = function() {
      // Pull in playerObject to this method
      var player = playerObject["stats"];
      // if the player has $10 (he should, we just checked this in travelMessage).
      if (player.money >= moveFee) {
        playerObject["stats"].money = parseInt(player.money) - moveFee;
        updateInventory();
      }
    }
  // Will call the options dialog pop-up, meant
  // to be used with the options button
  var launchOptionsDialog = function() {
    $(".options-text").text("Microstocks");
    $(".options-subtext").text("Version 1.0.5");
    $(".options-author").html("Author: <a href=\"https://github.com/evangipson\">Evan Gipson</a>");
    // Initialize the options-dialog modal
    $(".options").dialog({
        // The magic line right here
        // Don't open unless called to
        //autoOpen: false,
        modal: true,
        buttons: {
            "Close": function() {
              $(this).dialog("close");
            }
        }
    });
  }
  // Function to call buy/sell alert box
  // We have to call this last because it uses 
  // buyAction, sellAction, buyMessage & sellMessage
  var buySellDialogue = function(index) {
    // pull in playerObject to this method
    var player = playerObject["stats"];
    // instantiate variables needed for jquery-ui elements
    var maxResources = 0;
    var sliderStep = 0;
    var sliderValue = 0;
    var slideAmount = 1;
    var resourceName = player.resources[index].name;
    $(".buy-sell-dialogue").text("Would you like to buy or sell " + resourceName + " today?");
    // Initialize the buy-sell dialogue modal
    $(".buy-sell").dialog({
        modal: true,
        buttons: {
          "Buy": function() {
              // Set how many resources we can buy
              maxResources = parseInt(player.money) / parseInt(player.resources[index].cost);
              // If we don't have any money, let the player know
              if(maxResources < 1) {
                    $(".buy-sell-dialogue").text("Can't afford any " + resourceName + "!");
              }
              // Otherwise, we have resources to buy!
              else {
                // Get out slider step amount
                sliderStep = (maxResources >= 50) ? 5 : 1;
                // Initialize the buy-resource-slider
                $(".buy-resource-slider").slider({
                    value: 1,
                    min: 1,
                    max: maxResources,
                    step: sliderStep,
                    // Taken from https://jqueryui.com/slider/#steps
                    slide: function(event,ui) {
                      $(".buy-resource-amount").text("Buying " + ui.value + " " + resourceName + "!");
                      slideAmount = ui.value;
                    }
                });
                // get value from slider
                sliderValue = $(".resource-slider").slider( "value" );
                // Before we open the buy dialog, set the value
                // Shown on the slider to be what it is because it do
                $(".buy-resource-amount").text("Buying 1 " + resourceName + "!");
                // Open up the buy dialog
                $(".buy-dialog").dialog("open");
              }
          },
          "Sell": function() {
              // If the player actually has some of that resource...
              if(player.resources[index].amount > 0) {
                // Figure out how much to step the slider
                sliderStep = (player.resources[index].amount >= 50) ? 5 : 1;
                // Initialize the sell-resource-slider
                $(".sell-resource-slider").slider({
                    value: 1,
                    min: 1,
                    // Our max value for the slider is the amount
                    // of resources we have for that certain resource
                    max: player.resources[index].amount,
                    step: sliderStep,
                    // Taken from https://jqueryui.com/slider/#steps
                    slide: function(event,ui) {
                      $(".sell-resource-amount").text("Selling " + ui.value + " " + resourceName +  ".");
                      slideAmount = ui.value;
                    }
                });
                // Get slider's value
                sliderValue = $( ".resource-slider" ).slider( "value" );
                // Before we open the sell dialog, set the value
                // Shown on the slider to be what it is because it do
                $(".sell-resource-amount").text("Selling 1 " + resourceName +  ".");
                // Open up the sell dialog
                $(".sell-dialog").dialog("open");
              }
              // Otherwise, just tell them they can't.
              // I should probably not have the sell button if they can't use it.
              else {
                $(".buy-sell-dialogue").text("You don't have any " + resourceName + " to sell!");
              }
          },
          Cancel: function() {
            $(this).dialog("close");
          }
        }
    });
    // Initialize the buy-dialog modal
    $(".buy-dialog").dialog({
        // The magic line right here
        // Don't open unless called to
        autoOpen: false,
        modal: true,
        buttons: {
            "Buy": function() {
                // if amount is correctly retrieved by jquery-ui
                if (slideAmount !== null && slideAmount !== undefined) {
                  // So let's buy it!
                  var buyLogMessage = buyMessage(index, slideAmount);
                  addListElement(logList, buyLogMessage);
                  buyAction(slideAmount);
                } else {
                  console.error("buySellDialogue exception: Resource purchase amount undefined or null, please try again!");
                }
                // Close up the buy-sell dialog too
                $(".buy-sell").dialog("close");
                $(this).dialog('close');
            },
            Cancel: function() {
                // Close up the buy-sell dialog too
                $(".buy-sell").dialog("close");
                $(this).dialog('close');
            }
        }
    });
    // Initialize the sell-dialog modal
    $( ".sell-dialog" ).dialog({
        // The magic line right here
        // Don't open unless called to
        autoOpen: false,
        modal: true,
        buttons: { 
            "Sell": function() {
                // if the user didn't try any tricky stuff
                if (slideAmount !== null && slideAmount !== undefined) {
                  // Let's actually sell the thing
                  var sellLogMessage = sellMessage(index, slideAmount);
                  addListElement(logList, sellLogMessage);
                  sellAction(slideAmount);
                } else {
                  console.error("buySellDialogue exception: Resource sell amount undefined or null, please try again!");
                }
                // Close up the buy-sell dialog too
                $(".buy-sell").dialog("close");
                $(this).dialog("close");
            },
            Cancel: function() {
                // Close up the buy-sell dialog too
                $(".buy-sell").dialog("close");
                $(this).dialog("close");
            }
        }
    });
  }
  // This adds all the resource button event listeners
  // to buy and sell those invididual resources
  // and it's declared down here because it needs
  // buySellDialogue
  var addResourceEventListeners = function() {
    var resourceArray = document.getElementsByClassName("resource");
    for (var i = 0; i < resourceArray.length; i++) {
      addButtonEvent(resourceArray[i], [buySellDialogue, i]);
    }
  }
  // And now our last public method that will utilize the previous
  // private methods. 
  // This function creates the initial display of the inventory box
  var createInventory = function() {
      // Bring in playerObject to a local variable
      var player = playerObject["stats"];
      // Get the player's inventory list, since we are adding elements to it.
      var invList = document.getElementsByClassName("inventory-list")[0];
      var resourceList = document.getElementsByClassName("resource-list")[0];
      // Need a variable for the for loop later
      var className = "";
      // We need to display our money
      addListElement(invList, "Cash: $" + player.money, "money cash");
      // Variable to display the total amount of the portfolio
      var portfolioTotal = 0;
      // Display portfolio total
      for (var i = 0; i < player.resources.length; i++) {
        portfolioTotal += player.resources[i].amount * player.resources[i].cost;
      }
      // We need to display our portfolio
      addListElement(invList, "Total Portfolio: $" + portfolioTotal, "money portfolio");
      // We need to display our total worth
      addListElement(invList, "Net Worth: $" + (portfolioTotal + parseInt(player.money)), "money net-worth");
      // Our location
      addListElement(invList, "Location: " + locations[player.location], "location");
      // And our resources.
      // Loop through all the current resources
      for (var i = 0; i < resources.length; i++) {
        className = "resource resource-" + i + " under-hover";
        if(player.resources[i].amount > 0) {
          className += " owned";
        }
        // Add a resource box
        // and if the player has any, fill that in with a special class
        addListElement(resourceList, player.resources[i].name + " | " + player.resources[i].amount + " owned | $" + player.resources[i].cost, className);
      }
      // Now add the event listeners for buying & selling those resources
      addResourceEventListeners();
    }
  
  // Now add our public init method to call in the ready event
  microstocksModule.init = function() {
    // Get the Controls
    // ----------------
    // Now lets pull in the buttons
    var buyButton = document.getElementsByClassName("buy-button")[0];
    var sellButton = document.getElementsByClassName("sell-button")[0];
    var travelButton = document.getElementsByClassName("travel-button")[0];
    var optionsButton = document.getElementsByClassName("options-button")[0];
    // Now let's set up the event listeners
    addButtonEvent(buyButton, buyMessage, buyAction);
    addButtonEvent(sellButton, sellMessage, sellAction);
    addButtonEvent(travelButton, travelMessage, travelAction);
    addButtonEvent(optionsButton, launchOptionsDialog);
    // Now let's create the inventory panel!
    createInventory();
  }

  // give back our module!
  return microstocksModule;

}()); // Execute MICROSTOCKS function enclosure immediately

// Don't do any javascript until jquery's ready event is called
$(document).ready(function() {
  // Now let's initialize Microstocks!
  MICROSTOCKS.init();
});