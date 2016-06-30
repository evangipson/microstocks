// TO DO LIST
// ----------
// 1. Put JSON data server side and use AJAX calls so people can get unique games? I'm not fully sure what I mean here.  If i encapsulate the JS it should work locally just fine.
// 2. Make stock fluctuations more realistic or at least more predictable!
// 3. Ability to Travel where you want (maybe solve it the same was as buy/sell? i don't think it applies though)
// 5. Flush out Data and make it awesome, add a "Data" or "Stats" section maybe.
// 6. Create graph visualization of net worth/portfolio worth/stock worth over time BEHIND log (perhaps using spans)
// 7. Add sfx!  When you press travel you hear either a car screech, a plane passby, or a tugboat 


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
    // Function used to create a new name for a stock
  var createStockName = function() {
      var stockName = "";
      for (var i = 0; i < 3; i++) {
        // Pulled from http://stackoverflow.com/questions/3145030/convert-integer-into-its-character-equivalent-in-javascript
        stockName += String.fromCharCode(65 + randomNum(26));
      }
      return stockName;
    }
    // Initialize stocks array with this function
  var createStocks = function(stockAmount) {
      var retArray = [];
      for (var i = 0; i < stockAmount; i++) {
        retArray.push({
          "cost": randomNum(randomNum(2, 5), randomNum(20, randomNum(20,110))),
          "name": createStockName()
        });
      }
      return retArray;
    }
    // Initialize stocks array with this function
  var givePlayerStocks = function(stocks, stockAmount) {
    for (var i = 0; i < stockAmount; i++) {
      // Ensure player gets at least 1 stock to play with
      var atLeastOne = false;
      // 30% chance the player will own that stock
      if(randomNum(100)>70) {
        stocks[i].amount = randomNum(randomNum(1, 4), randomNum(5, 20));
        atLeastOne = true;
      }
      else {
        stocks[i].amount = 0;
      }
    }
    // If the player didn't even get one stock
    if(atLeastOne === false) {
      // Give the player a random stock
      stocks[randomNum(0,stocks.length)].amount = randomNum(randomNum(1,4), randomNum(5,20));
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
  // Change this variable to modify the amount of stocks generated
  stockAmount = randomNum(12,20);
  // Create some variables to fill up player JSON with
  stocks = createStocks(stockAmount);
  // Fill up the playerObject stock array w/ amounts for the player
  givePlayerStocks(stocks, stockAmount);
  // Now sort the stocks array by Amount
  // Before applying to the player
  stocks.sort(function(a, b) {
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
    '"stocks":[' +
    arrayToJSON(stocks) +
    ']' +
    '}' +
    '}';
  // Get the object with JSON.parse
  playerObject = JSON.parse(playerString);

  // Public Variables
  // ----------------
  // Now lets pull in the buttons
  microstocksModule.buyButton = document.getElementsByClassName("buy-button")[0];
  microstocksModule.sellButton = document.getElementsByClassName("sell-button")[0];
  microstocksModule.travelButton = document.getElementsByClassName("travel-button")[0];

  // Private functions needed for stocks & log
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
    // Add button event listener function, takes 2 optional functions 
    // (logMessage and moreBehavior)

    // Function to fluctuate stock prices
    // called everytime inventory is updated.
  var updateStockPrices = function() {
      // Pull playerObject's stocks in locally
      var playerStocks = playerObject["stats"].stocks;
      // Amount stocks should be flucuating
      var variant = 0;
      // Max $ amount stocks can be
      var stockMax = 250;
      // Declare a couple variables to use inside the for loop
      var stockCost = 0;
      var stockName = "";
      // We'd like to evaluate every stock per update
      for (var i = 0; i < playerStocks.length; i++) {
        // Pull cost in so we only have to query playerStocks array once
        stockCost = playerStocks[i].cost;
        stockName = playerStocks[i].name;
        // ~20% chance for the company's value to potentially shift
        if (randomNum(100) < 18) {
          // Let's pass another check (sort of random) to increase stock price
          if (randomNum(100) < randomNum(30,48)) {
            variant = randomNum(5);
            addListElement(logList, stockName + " has risen $" + variant + " dollars.", "stock-increase");
          }
          // Or if we pass yet another random check, let's lower the value
          // if we are above the variant amount
          else if ((randomNum(100) < randomNum(30,48)) && (stockCost > variant)) {
            variant = randomNum(5);
            addListElement(logList, stockName + " has fallen $" + Math.abs(variant) + " dollars.", "stock-decrease");
          }
        } 
        // If there was no regular shift, there is a
        // 0.5% chance for the company's value to grow by up to 1/5th.
        else if (randomNum(1000) < 5) {
          variant = Math.floor(stockCost * (randomNum(1,20)*.1));
          addListElement(logList, stockName + " has risen $" + variant + " dollars.", "stock-increase");
        }
        // And if that shift never happens, then the comapny is doomed at a
        // 0.5% chance for the it's value to drop by up to 1/5th
        else if (randomNum(1000) < 5) {
          variant = -1 * Math.floor(stockCost * (randomNum(1,20)*.1));
          // If we have more than the variant amount as our value
          if(stockCost > (Math.abs(variant) + 1)) {
            // Subtract it from the stock value
            addListElement(logList, stockName + " has fallen $" + Math.abs(variant) + " dollars.", "stock-decrease");
          }
        }
        // Then just alter the amount like normal
        stockCost = parseInt(stockCost) + variant;
        // Check if the stock is really low
        if(stockCost <= variant) {
          // 15% to make the stock bounce back
          if(randomNum(100) < 25) {
            stockCost = parseInt(stockCost) + randomNum(11);
          }
        }
        // Check if the stock is super high
        if(parseInt(stockCost) >= stockMax) {
          // 33% to make the stock bottom out a bit
          if(randomNum(100) < 33) {
            stockCost = parseInt(stockCost) - randomNum(1,Math.floor(stockMax * 0.15));
          }
          // Otherwise let's just set it to stockMax
          else {
            stockCost = stockMax;
          }
        }
      }
    }
    // Function to update the inventory box.
    // Called when controls are interacted with.
  var updateInventory = function() {
    // Bring player in locally
    var player = playerObject["stats"];
    // Get the updated stock prices
    updateStockPrices();
    // Draw out the new inventory
    changeListElement("cash", "Money: $" + player.money);
    // Variable to display the total amount of the portfolio
    var portfolioTotal = 0;
    // Display portfolio total
    for (var i = 0; i < player.stocks.length; i++) {
      portfolioTotal += player.stocks[i].amount * player.stocks[i].cost;
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
    // Sort out the player's stock array 
    player.stocks.sort(function(a, b) {
      return b.amount - a.amount;
    });
    // Update the player's stock amounts and change any owned to have said css class
    for (var i = 0; i < player.stocks.length; i++) {
      var theStock = document.getElementsByClassName("stocks-"+i)[0];
      changeListElement("stocks-" + i, player.stocks[i].name + " | " + player.stocks[i].amount + " owned | $" + player.stocks[i].cost);
      if(player.stocks[i].amount > 0 && !theStock.classList.contains("owned")) {
        theStock.classList.add("owned");
      }
      else if(player.stocks[i].amount === 0 && theStock.classList.contains("owned")) {
        theStock.classList.remove("owned");
      }
    }
  }  
  // Update stock index globally
  var updateStockIndex = function(stockIndex) {
      // If we have a stockIndex, let's set it accordingly (the click came from stock button)
      if (typeof stockIndex !== "undefined" && typeof stockIndex !== "object") {
        if (stockIndex < playerObject["stats"].stocks.length) {
          playerObject["stats"].stockIndex = stockIndex;
        } else {
          console.error("updateStockIndex exception: Incoming stockIndex outside of bounds of stocks array.");
        }
      }
      // We don't have a suitable stock index, so let's randomly shuffle the stock index
      else {
          playerObject["stats"].stockIndex = randomNum(0,stocks.length);
        }
      }
    // Update location index globally
  var updateLocationIndex = function(newLocation) {
      playerObject["stats"].location = newLocation;
    }
    // Function to call buy/sell alert box
  var buySellDialogue = function(index) {
    var maxStocks = 0;
    var sliderStep = 0;
    var sliderValue = 0;
    var slideAmount = 0;
    var startingBuyValue = 0;
    var stockName = playerObject["stats"].stocks[index].name;
    $(".buy-sell-dialogue").text("Would you like to buy or sell " + stockName + " stock today?");
    // Initialize the buy-dialog modal
    $( ".buy-dialog" ).dialog({
        // The magic line right here
        // Don't open unless called to
        autoOpen: false,
        modal: true,
        buttons: {
            "Are you sure?": function() {
                // if amount is correctly retrieved by jquery-ui
                if (slideAmount !== null && slideAmount !== undefined) {
                  // So let's buy it!
                  var buyLogMessage = buyMessage(index, slideAmount);
                  addListElement(logList, buyLogMessage);
                  buyAction(slideAmount);
                } else {
                  console.error("buySellDialogue exception: Stock purchase amount undefined or null, please try again!");
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
            "Are you sure?": function() {
                // if the user didn't try any tricky stuff
                if (slideAmount !== null && slideAmount !== undefined) {
                  // Let's actually sell the thing
                  var sellLogMessage = sellMessage(index, slideAmount);
                  addListElement(logList, sellLogMessage);
                  sellAction(slideAmount);
                } else {
                  console.error("buySellDialogue exception: Stock sell amount undefined or null, please try again!");
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
    // Initialize the buy-sell dialogue modal
    $(".buy-sell").dialog({
        modal: true,
        buttons: {
          "Buy": function() {
              // Set how many stocks we can buy
              maxStocks = parseInt(playerObject["stats"].money) / parseInt(playerObject["stats"].stocks[index].cost);
              // If we don't have any money, let the player know
              if(maxStocks < 1) {
                    $(".buy-sell-dialogue").text("Can't afford any " + stockName + " stock!");
              }
              // Otherwise, we have stock to buy!
              else {
                // Get out slider step amount
                sliderStep = (maxStocks >= 50) ? 5 : 1;
                // Figure out where the slider should start
                // We should AT LEAST buy 1.
                startingBuyValue = (maxStocks * 0.33) > 1 ? Math.floor(maxStocks * 0.33) : 1;
                // Initialize the buy-stock-slider
                $(".buy-stock-slider").slider({
                    // Set initial value to 1/3 of what they can afford
                    value: startingBuyValue,
                    min: 1,
                    max: maxStocks,
                    step: sliderStep,
                    // Taken from https://jqueryui.com/slider/#steps
                    slide: function(event,ui) {
                      $(".buy-stock-amount").text("Buying " + ui.value + " " + stockName + " stock!");
                      slideAmount = ui.value;
                    }
                });
                // get value from slider
                sliderValue = $(".stock-slider").slider( "value" );
                // Before we open the buy dialog, set the value
                // Shown on the slider to be what it is because it do
                $(".buy-stock-amount").text("Buying " + startingBuyValue + " " + stockName + " stock!");
                // Open up the buy dialog
                $(".buy-dialog").dialog("open");
              }
          },
          "Sell": function() {
              // If the player actually has some of that stock...
              if(playerObject["stats"].stocks[index].amount > 0) {
                // Figure out how much to step the slider
                sliderStep = (playerObject["stats"].stocks[index].amount >= 50) ? 5 : 1;
                // Initialize the sell-stock-sliderß
                $(".sell-stock-slider").slider({
                    value: 1,
                    min: 1,
                    // Our max is the amount of stock we have for that certain stock
                    max: playerObject["stats"].stocks[index].amount,
                    step: sliderStep,
                    // Taken from https://jqueryui.com/slider/#steps
                    slide: function(event,ui) {
                      $(".sell-stock-amount").text("Selling " + ui.value + " " + stockName +  " stock.");
                      slideAmount = ui.value;
                    }
                });
                // Get slider's value
                sliderValue = $( ".stock-slider" ).slider( "value" );
                // Before we open the sell dialog, set the value
                // Shown on the slider to be what it is because it do
                $(".sell-stock-amount").text("Selling 1 " + stockName +  " stock.");
                // Open up the sell dialog
                $(".sell-dialog").dialog("open");
              }
              // Otherwise, just tell them they can't.
              // I should probably not have the sell button if they can't use it.
              else {
                $(".buy-sell-dialogue").text("You don't have any " + stockName + " to sell!");
              }
          },
          "Cancel": function() {
            $(this).dialog("close");
          }
        }
    });
  }

  // Public functions that are used outside
  // of this module
  // --------------------------------------
  // Function to create the initial display of the inventory box
  microstocksModule.createInventory = function() {
      // Bring in microstocks playerObject
      var player = playerObject["stats"];
      // Get the player's inventory list, since we are adding elements to it.
      var invList = document.getElementsByClassName("inventory-list")[0];
      var stockList = document.getElementsByClassName("stock-list")[0];
      // Need a variable for the for loop later
      var className = "";
      // We need to display our money
      addListElement(invList, "Cash: $" + player.money, "money cash");
      // Variable to display the total amount of the portfolio
      var portfolioTotal = 0;
      // Display portfolio total
      for (var i = 0; i < player.stocks.length; i++) {
        portfolioTotal += player.stocks[i].amount * player.stocks[i].cost;
      }
      // We need to display our portfolio
      addListElement(invList, "Total Portfolio: $" + portfolioTotal, "money portfolio");
      // We need to display our total worth
      addListElement(invList, "Net Worth: $" + (portfolioTotal + parseInt(player.money)), "money net-worth");
      // Our location
      addListElement(invList, "Location: " + locations[player.location], "location");
      // And our stocks.
      // Loop through all the current stocks
      for (var i = 0; i < stocks.length; i++) {
        className = "stock stocks-" + i + " under-hover";
        if(player.stocks[i].amount > 0) {
          className += " owned";
        }
        // Add a stock box
        // and if the player has any, fill that in with a special class
        addListElement(stockList, player.stocks[i].name + " | " + player.stocks[i].amount + " owned | $" + player.stocks[i].cost, className);
      }
    }
  // Called when we need to add Button Events
  microstocksModule.addButtonEvent = function(button, logMessage, moreBehavior) {
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
  microstocksModule.buyMessage = function(stockIndex, amount) {
    // Check stockIndex
    if (typeof stockIndex === "undefined" || stockIndex === null) {
      // if we are null or empty, make one up.
      updateStockIndex();
      stockIndex = playerObject["stats"].stockIndex;
    } else {
      // Pull in stockIndex
      updateStockIndex(stockIndex);
    }

    // Check amount
    var stockAmount = (amount === undefined) ? 1 : amount;

    // If they can't buy the stock, fuck them.
    if (playerObject["stats"].money < (stocks[stockIndex].cost * stockAmount)) {
      return ["Can't afford share(s) of " + stocks[stockIndex].name + ".",
        "(Attempted to purchase " + stockAmount + ".)"
      ];
    }
    // If the player can afford it, let's buy it!
    else {
      return "You bought " + stockAmount + " share(s) of " + stocks[stockIndex].name + ".";
    }
  }
  microstocksModule.buyAction = function(amount) {
    // Check amount
    var stockAmount = (amount === undefined) ? 1 : amount;
      // Pull in stockIndex
      var stockIndex = playerObject["stats"].stockIndex;
      // If the player can afford the stock
      if (playerObject["stats"].money >= (playerObject["stats"].stocks[stockIndex].cost * stockAmount)) {
        // Update the player's money
        playerObject["stats"].money = playerObject["stats"].money - (playerObject["stats"].stocks[stockIndex].cost * stockAmount);
        // Update the player's stock amount
        playerObject["stats"].stocks[stockIndex].amount += parseInt(stockAmount);
      } else {
        console.error("buyAction exception: Not enough money to make purchase.");
      }
      updateInventory();
    }
    // Sell button functions
  microstocksModule.sellMessage = function(stockIndex, amount) { 
    // Check stockIndex
    if (typeof stockIndex === "undefined" || stockIndex === null) {
      // if we are null or empty, make one up.
      updateStockIndex();
      stockIndex = playerObject["stats"].stockIndex;
    } else {
      // Pull in stockIndex
      updateStockIndex(stockIndex);
    }
    // Check amount
    var stockAmount = (amount === undefined) ? 1 : amount;

    // If you have the stock amount, go ahead and sell it!
    if (playerObject["stats"].stocks[stockIndex].amount >= stockAmount) {
      return "You sold " + stockAmount + " share(s) of " + stocks[stockIndex].name + ".";
    }
    // If the player can't afford it, fuck off!
    else {
      return "You don't have " + stockAmount + " share(s) of " + stocks[stockIndex].name + ".";
    }
  }
  microstocksModule.sellAction = function(amount) {
    // Check amount
    var stockAmount = (amount === undefined) ? 1 : amount;
      // Pull in stockIndex
      var tmpStockIndex = playerObject["stats"].stockIndex;
      // If you have the stock amount, go ahead and sell it!
      if (playerObject["stats"].stocks[tmpStockIndex].amount >= stockAmount) {
        // Update players stock
        playerObject["stats"].stocks[tmpStockIndex].amount -= parseInt(stockAmount);
        // Update player's money
        playerObject["stats"].money = playerObject["stats"].money + (playerObject["stats"].stocks[tmpStockIndex].cost * stockAmount);
        // Update the inventory box
        updateInventory();
      } 
    }
    // Location logging functionality
  microstocksModule.travelMessage = function() {
      // if the player doesn't have $10, don't let him travel.
      if (playerObject["stats"].money < moveFee) {
        return "Can't afford to move! Why don't you sell some stock?";
      }
      // make sure we have a valid stock index for potentially selling
      // since this runs before sellAction.
      updateStockIndex();
      // Try and generate a new locationIndex. 
      var newNum = randomNum(locations.length);
      // Make sure we don't get the same locationIndex that we have
      while (newNum === playerObject["stats"].location) {
        // Make sure we generate a NEW location
        newNum = randomNum(locations.length);
      }
      updateLocationIndex(newNum);
      return ["Player moved to " + locations[playerObject["stats"].location],
              "Charged $" + moveFee + " to go!"];
    }
    // Subsequent function, update screen
  microstocksModule.travelAction = function() {
      // if the player has $10 (he should, we just checked this in travelMessage).
      if (playerObject["stats"].money >= moveFee) {
        playerObject["stats"].money = parseInt(playerObject["stats"].money) - moveFee;
        updateInventory();
      }
    }
    // This adds all the stock button event listeners
    // to buy and sell those invididual stocks
  microstocksModule.addStockEventListeners = function() {
    var stocks = document.getElementsByClassName("stock");
    for (var i = 0; i < stocks.length; i++) {
      this.addButtonEvent(stocks[i], [buySellDialogue, i]);
    }
  }

  // give back our module!
	return microstocksModule;

}()); // Execute function immediately to provide closure for MICROSTOCKS

// Don't do any javascript until the HTML DOMContent is loaded
// on the page, because we need to ineract with it.
document.addEventListener("DOMContentLoaded", function() {
  // Now let's set up the event listeners
  MICROSTOCKS.addButtonEvent(MICROSTOCKS.buyButton, MICROSTOCKS.buyMessage, MICROSTOCKS.buyAction);
  MICROSTOCKS.addButtonEvent(MICROSTOCKS.sellButton, MICROSTOCKS.sellMessage, MICROSTOCKS.sellAction);
  MICROSTOCKS.addButtonEvent(MICROSTOCKS.travelButton, MICROSTOCKS.travelMessage, MICROSTOCKS.travelAction); 
  // Now let's create the inventory panel!
  MICROSTOCKS.createInventory();
  // Add the stock event listeners for buying/selling
  MICROSTOCKS.addStockEventListeners();
});
