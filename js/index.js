// Our public variable containing our module
// for other parts of this program to interact
// with, but ensuring all private variables in here
// get the full scope with no confusion possible.
var MICROSTOCKS = (function () {
  // Private functions necessary for initial variables
  // ------------------------------------------------
  // Random number function with optional lowNum + highNum variable.
  // If no lwo or high number is specified, the function will default
  // to ranging from 1-100.
  var randomNum = function(lowNum, highNum) {
    // If lowNum wasn't defined, set it to 1 to get the 1-100 range
    if (lowNum === undefined || isNaN(lowNum) || lowNum === null || typeof lowNum !== "number") {
      // If lowNum ISN'T a number, it's safe to set it to 1.
      lowNum = 1;
      // And also highNum to 100.
      highNum = 100;
    }
    // If highNum wasn't defined, set it to the first value and lowNum to 1 to get the 1-lowNum range
    if (highNum === undefined || isNaN(highNum) || highNum === null || typeof highNum !== "number") {
      // If highNum ISN'T a number, it's safe to set it the range to 1-100.
      highNum = lowNum;
      lowNum = 1;
    }
    // Take the floor of random calculation
    return Math.floor(Math.random() * (highNum - lowNum) + lowNum);
  };
  // Function used to generate a 1, 2, or 3 syllable word
  var generateWord = function(word) {
    var firstSyllable, secondSyllable, thirdSyllable;
    var theWord;
    // List all the first syllables
    firstSyllable = [
      "qhi",
      "mo",
      "bli",
      "bla",
      "blu",
      "amm",
      "an",
      "ra",
      "ran",
      "ram",
      "rom",
      "ro",
      "qo",
      "phi",
      "pha",
      "phe",
      "pe",
      "pfa",
      "pfe",
      "pa",
      "neh",
      "ni",
      "mu",
      "min",
      "nuv",
      "go",
      "gro",
      "gran",
      "gra",
      "ip",
      "iq",
      "ikk",
      "sa",
      "tik",
      "theo",
      "thra",
      "yi",
      "ya",
      "yo",
      "yon",
      "yan",
      "yom",
      "clo",
      "clat",
      "nar",
      "lay",
      "lin",
      "ler",
      "la",
      "mab",
      "mob",
      "my",
      "myk",
      "mey",
      "t'ka",
      "s'sa",
      "s'se",
    ];
    // List all the syllables that could be
    // used after the first syllable
    secondSyllable = [
      "lem",
      "laam",
      "lam",
      "and",
      "ni",
      "pin",
      "ii",
      "nis",
      "dar",
      "jar",
      "mar",
      "ler",
      "lar",
      "lar",
      "end",
      "in",
      "oui",
      "wi",
      "when",
      "je",
      "jee",
      "jaa",
      "gis",
      "ggin",
      "ggar",
      "ghen",
      "lip",
      "fraw",
      "frae",
      "rae",
      "rin",
      "rra",
      "to",
      "tin",
      "tar",
      "in",
      "il",
      "ot",
      "cite",
      "bin",
      "k",
      "aj",
      "ej",
      "oj",
      "it",
      "sei",
      "icron",
      "ycite",
      "cite",
      "ust",
      "oz",
      "aez",
      "aer",
    ];
    // thirdSyllable is made up of both arrays!
    // NOTE: Can't use "+" on arrays! That's not defined
    // in javascript (maybe try to augment the array
    // prototype and add some + functionality!)
    thirdSyllable = firstSyllable.concat(secondSyllable);

    // Assemble the word
    // 33% the word will have 3 syllables
    if(randomNum(1,100) < 33) {
      theWord = firstSyllable[randomNum(0,firstSyllable.length)] + secondSyllable[randomNum(0,secondSyllable.length)] + thirdSyllable[randomNum(0,thirdSyllable.length)];
    }
    // Otherwise 90% chance it'll have two syllables
    else if(randomNum(1,100) < 90) {
      theWord = firstSyllable[randomNum(0,firstSyllable.length)] + secondSyllable[randomNum(0,secondSyllable.length)];
    }
    // Or it will have only 1 syllable
    else {
      theWord = firstSyllable[randomNum(0,firstSyllable.length)];
    }
    // Capitalize the first letter of the word
    theWord = theWord.charAt(0).toUpperCase() + theWord.substr(1);
    // Give back the word you've created
    return theWord;
  };
  // Function used to create a name for the planet
  var createPlanetName = function(planetName) {
    // Set our localPlanetName to be either a generated word
    // or pull in planetName if we have it
    var localPlanetName = planetName || generateWord();
    // If we have less than 2-3 words
    if(localPlanetName.split(" ").length < randomNum(3)) {
      // Append a word to the planetName
      localPlanetName += " " + generateWord();
      // If we don't have a long enough planet name,
      // let's call this function recursively to
      // fill it out, while stopping when there are
      // more than 2-3 words
      createPlanetName(localPlanetName);
    }
    // There's a small chance to append
    // a planet suffix
    var planetSuffixes = [
      "II",
      "III",
      "IV",
      "V",
      "VI",
      "VII",
      "VIII",
      "IX",
      "X",
      "XI",
      "XII",
      "Prime",
      "Beta",
      "Alpha",
      "Omega"
    ];
    // Small chance that the suffix
    // actually gets appended
    if(randomNum(100) < 30) {
      localPlanetName += " " + planetSuffixes[randomNum(0,planetSuffixes.length - 1)];
    }
    // Give back the planet name
    return localPlanetName;
  };
  // This function will return an object containing
  // both an x and y value, that will look like so:
  // { x: xVal, y: yVal }
  // It can be accessed this way:
  // var returnVector = placePlanet();
  // returnVector.x === xVal;
  var placePlanet = function() {
    return {
      x: randomNum(-10000,10000),
      y: randomNum(-10000,10000)
    };
  };
  // This function returns the distance between
  // two planet objects
  var distanceBetween = function(planetA, planetB) {
    // Return the resulting distance between the two
    // planet's x and y values with the distance formula:
    // sqrt((x2-x1)^2 + (y2-y1)^2)
    return Math.sqrt(Math.abs(Math.pow(planetA.location.x - planetB.location.x,2) + Math.pow(planetA.location.y - planetB.location.y,2)));
  };
  // This function will return a {min,max} vector
  // representing a planet's minimum and maximum
  // temperature
  var setPlanetTemp = function() {
    // Determine the minimum temperature first
    // by selecting a random number
    var minTemp = randomNum(-120,1200);
    // Set maximum temperature based off of minimum
    // temperature up to 150-250% of the minimum temperature
    // unless minTemp is negative, in which case just
    // use a range of up to 300 degrees away from that min temp
    var maxTemp = minTemp > 0 ? randomNum(minTemp, (minTemp + (minTemp * (randomNum(15,25) * 0.1)))) : randomNum(minTemp, minTemp + randomNum(50,300));
    return {
      "min": minTemp,
      "max": maxTemp
    };
  };
  // This function will return a planet type as a 
  // string and takes in no parameters
  var determinePlanetType = function() {
    var planetTypes = [
      "Volcanic",
      "Ice",
      "Ocean",
      "Gas Giant",
      "Swamp",
      "Desert"
    ];
    var planetAdjectives = [
      "Silica",
      "Carbon",
      "Hydrogen",
      "Terraformed",
      "Uninhabited",
      "Tempest",
      "Quiet",
      "Helium",
      "Magnesium",
      "Aluminum"
    ];
    return {
      "base": planetTypes[randomNum(0,planetTypes.length - 1)],
      "extra" : (function() {
        var extraArray = [];
        // 25% chance we'll have two adjective
        if(randomNum(100) < 25) {
          // Generate the first adjective and store
          // it in a variable because we need it later
          var tempObj = planetAdjectives[randomNum(0, planetAdjectives.length - 1)];
          // Push it to our return array
          extraArray.push(tempObj);
          // Okay, let's get the second adjective,
          // but we want to make sure it's unique
          var newRandomIndex = randomNum(0, planetAdjectives.length - 1);
          // So if we are matching the old index with
          // the new index
          while(tempObj === planetAdjectives[newRandomIndex]) {
            // Keep generating a new index
            newRandomIndex = randomNum(0, planetAdjectives.length - 1);
          }
          // Then after the tempObject isn't what we want to
          // select, push that as well!
          extraArray.push(planetAdjectives[newRandomIndex]);
        }
        // 90% chance we'll have one
        else if(randomNum(100) < 90) {
          extraArray.push(planetAdjectives[randomNum(0, planetAdjectives.length - 1)]);
        }
        // Then make sure to return the array
        return extraArray;
      })() // Execute this function right away to return the array
    };
  };
  // Function used to create a new name for a resource
  var createResourceName = function() {
    var resourceName = "";
    for (var i = 0; i < 3; i++) {
        // Pulled from http://stackoverflow.com/questions/3145030/convert-integer-into-its-character-equivalent-in-javascript
      resourceName += String.fromCharCode(65 + randomNum(26));
    }
    return resourceName;
  };
  // This will determine the resource type
  var determineResourceType = function() {
    // Set up the amount of resource types
    // with icons associated as well
    var resourceTypes = [
      {
        "name": "Health",
        "icon": "fa-heartbeat"
      },
      {
        "name": "Natural",
        "icon": "fa-paw"
      },
      {
        "name": "Tech",
        "icon": "fa-qrcode"
      },
      {
        "name": "Rare",
        "icon": "fa-diamond"
      },
      {
        "name": "Mineral",
        "icon" : "fa-gg-circle"
      }
    ];
    // Give back what we should be!
    return resourceTypes[randomNum(0,resourceTypes.length)];
  };
  // Function to determine a trend for the resource
  var determineResourceTrend = function(theType) {
    // Variable for resource's trend's string representation
    var trend = "";
    // Set up the trend arrays, filled with
    // objects containing the type name as the key
    // and the type maxFlux as the value
    var resourceStableTrends = [
      {
        "name": "stable-up",
        "maxFlux" : randomNum(0, 3)
      },
      {
        "name": "stable",
        "maxFlux" : randomNum(-1, 2)
      },
      {
        "name": "stable-down",
        "maxFlux" : randomNum(-2, 0)
      }
    ];
    var resourceVolatileTrends = [
      {
        "name": "volatile-up",
        "maxFlux" : randomNum(0, 6)
      },
      {
        "name": "volatile",
        "maxFlux" : randomNum(-3,4)
      },
      {
        "name": "volatile-down",
        "maxFlux" : randomNum(-5,-1)
      }
    ];
    // Determine type of resource
    // If we have a health or natural resource
    if (theType.name == "Health" || theType.name == "Natural") {
      // It will be stable-up, which is the first item
      // in the resourceStableTrends array
      trend = resourceStableTrends[0];
    }
    // Otherwise, we could have a mineral
    else if (theType.name == "Mineral") {
      // Which would be stable, but could be stable=up, stable, or stable-down.
      trend = resourceStableTrends[randomNum(0,resourceStableTrends.length)];
    }
    // Furthermore, we could have a tech or rare resource
    else {
      // Which I imagine would be volatile
      trend = resourceVolatileTrends[randomNum(0,resourceVolatileTrends.length)];
    }
    // Now let's return the object containing the name and amount
    return trend;
  };
  // Initialize resources array with this function
  var createResources = function(resourceAmount) {
    var retArray = [];
    var theType = "";
    // For every resource we want
    for (var i = 0; i < resourceAmount; i++) {
      // Create a blank object
      retArray[i] = {};
      // Determine the type of resource we're going to have
      theType = determineResourceType();
      // And we'll fill it with stuff
      retArray[i].cost = randomNum(randomNum(2, 5), randomNum(20, randomNum(20,110)));
      retArray[i].name = createResourceName();
      retArray[i].type = theType;
      retArray[i].trend = determineResourceTrend(theType);
    }
    return retArray;
  };
  // Initialize resources array with this function
  var givePlayerResources = function(resources, resourceAmount) {
    // Ensure player gets at least 1 resource to play with
    var atLeastOne = false;
    for (var i = 0; i < resourceAmount; i++) {
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
  };
  // This function initializes the google graph that is
  // used to display the gameData as well as the gameData itself
  var initializeGraph = function() {
    // Load the google script needed for graphs
    // using javascript, upon successful script download
    // do all the cool google stuff
    var scriptTag = document.createElement('script');
    scriptTag.src = "https://www.gstatic.com/charts/loader.js";
    // When the script loads, let's call initialize the graphs!
    scriptTag.onload = scriptTag.onreadystatechange = function() {
      // Bring in player's resources to the function
      var playerResources = playerObject.stats.resources;
      // Load up google charts so everyone can access it
      google.charts.load('current', {'packages':['corechart']});
      // Fill up our global gameData variable
      gameData = {"netWorth":[],"resourceAmounts":[],"totalMoney":[],"resourceList":[]};
      gameData.netWorth.push(["Date", "Net Worth"]);
      gameData.netWorth.push([year + "-" + displayMonth, portfolioTotal + playerObject.stats.money]);
      gameData.totalMoney.push(["Date", "Cash", "Portfolio", "Net Worth"]);
      gameData.totalMoney.push([year + "-" + displayMonth, playerObject.stats.money, portfolioTotal, portfolioTotal + playerObject.stats.money]);
      // For each resource, I need to create a gameData entry
      for(var i = 0; i < playerResources.length; i++) {
        gameData.resourceList[playerResources[i].name] = [["Date", "Cost"],[year + "-" + displayMonth, playerResources[i].cost]];
      }
    };
    // Append our google chart script to the <body>
    document.body.appendChild(scriptTag);
  };

  // Module
  // ------
  // Create the module we'll export
  var microstocksModule = {};
  
  // Private Variables
  // NOTE: If you change any of these, you need to
  // understand the full scope of your change by
  // ctrl+f and finding all instances and updating
  // those as well if necessary
  // -----------------
  // The version that microstocks is currently at
  var microstocksVersion = "1.0.7";
  // Let's pull in the log ul.
  var logList = document.getElementsByClassName("log-list")[0];
  // We need to set how much it is to move.
  // This is used in both travelMessage and travelAction,
  // so it can be scoped to the whole MICROSTOCKS module.
  var moveFee = 10;
  // This will be referenced by playerObjects.stats.location
  var locations = [];
  // We'll have 30-40 planets to start
  for (var l = 0; l < randomNum(30,40); l++) {
    locations.push({
      "name": createPlanetName(),
      "location": placePlanet(),
      "temp": setPlanetTemp(),
      "type": determinePlanetType()
    });
  }
  // Create the player object
  var playerObject = {
    "stats": {
      "money": randomNum(350,500),
      "location": randomNum(0,locations.length-1),
      // Resources is taken care of by
      // an anonymous function that only does
      // a couple things before returning a
      // resources array. The reason for doing this
      // is I don't need resourceAmount or resources
      // to be scoped to this whole MICROSTOCKS function.
      "resources": (function() {
        // Change this variable to modify the amount of resources generated
        var resourceAmount = randomNum(20,30);
        // Create some variables to fill up player JSON with
        var resources = createResources(resourceAmount);
        // Fill up the playerObject resource array w/ amounts for the player
        givePlayerResources(resources, resourceAmount);
        // Sort out the array before we return it.
        return resources.sort(function(a, b) { return b.amount - a.amount; });
      })() // Execute this anonymous function immediately
    }
  };
  // Variable to display the total amount of the portfolio
  var portfolioTotal = 0;
  // Calculate portfolio total
  for (var i = 0; i < playerObject.stats.resources.length; i++) {
    portfolioTotal += playerObject.stats.resources[i].amount * playerObject.stats.resources[i].cost;
  }
  // We need a date for gameData
  // and multiple things need to access
  // it, so the it's best to be scoped
  // to the whole closure
  var todaysDate = new Date();
  // Create gameData module for
  // all those awesome graphs!
  // Retrieve the month and year from todaysDate.
  // getMonth() returns a 0-based number
  var month = todaysDate.getMonth() + 1;
  var year = todaysDate.getFullYear();
  // Make sure displayMonth is two digits by converting it to
  // a string and adding a 0 if it needs it! This is for
  // displaying the month correctly on the graph's x-axis
  var displayMonth = month > 9 ? "" + month : "0" + month;
  // Also we need our gameData visible everywhere
  var gameData = [];

  // Private functions needed for resources & log
  // ---------------------------------
  // Add list element to object
  var addListElement = function(obj, text, cssClass) {
    var listElement = "";
    // If text isn't empty
    if (text !== undefined && text !== null) {
      var theText = "";
      theText = text;
      // Create a new <li> element
      listElement = document.createElement("LI");
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
    // If we HAVE a class coming in and it's valid
    if (cssClass !== undefined && cssClass !== null) {
      // Let's add it to the new <li>
      // and if our cssClass is multiple classes....
      if(cssClass.split(" ").length > 1) {
        var cssClassArray = cssClass.split(" ");
        // Make sure not to use "i" here, because of
        // the "i" declared in the for loop above!
        // REMEMBER: javascript has functional scope!
        for (var j in cssClassArray) {
          // Make sure to check the object and see if
          // it's a "true" member. thanks, crockford!
          if (cssClassArray.hasOwnProperty(j)) {
            // Add the CSS class to the list element!
            listElement.classList.add(cssClassArray[j]);
          }
        }
      }
      // If we just have 1 cssClass come in, apply it
      else {
        listElement.classList.add(cssClass);
      }
    }
  };
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
  };
  // Function to handle bankrupty
  var bankruptResource = function(theResourceIndex) {
    // Variabl-ize the resource we're going to operate on
    var playerBankruptResource = playerObject.stats.resources[theResourceIndex];
    // Pull in the variant before resetting the resource and
    // take 20% as the payout value for the company failing
    var initialPayout = Math.floor(Math.abs(playerBankruptResource.variant) * 0.2);
    // If initial payout is more than a dollar, just pay it out,
    // otherwise give the player between 5 and 10 dollars.
    var payoutValue = initialPayout > 1 ? initialPayout : randomNum(5,15);
    // Cancel the resource by removing it from
    // the playerObject resources array.
    // NOTE: This will remove all of those resources
    // from the player's inventory as well, since the
    // amount of resources is tied to the resources object.
    var theType = determineResourceType();
    // Note i'm using the playerObject array here
    // and not the variable representation (playerBankruptResource)
    // because of the shallow copying of javascript
    playerObject.stats.resources[theResourceIndex] = {
      // Create another resource in it's place
      "cost": randomNum(randomNum(2, 5), randomNum(20, randomNum(20,110))),
      "name": createResourceName(),
      "type": theType,
      "trend": determineResourceTrend(theType),
      "amount": 0
    };
    // Give the player a "payout" of the resource
    playerObject.stats.money += payoutValue;
    // Let the player about the payout know via the log
    addListElement(logList, "Player paid out $" + payoutValue + " during the liquidation!");
    // Need to also reset the history for the graph
    // so re-init the gameData.resourceList at the current index
    // using the PLAYEROBJECT, not the playerBankruptResource
    gameData.resourceList[playerObject.stats.resources[theResourceIndex].name] = [
      ["Date", "Cost"],
      [year + "-" + displayMonth, playerBankruptResource.cost]
    ];
  };
  // Function to modify a voatile resource
  var modifyResourceCost = function(playerResources, resourceMax, variant, resourceName, i, modifyChance) {
      // Check against chance to modify
      if(randomNum(100) <= modifyChance) {
        // Now check if the cost is too high or too low
        // If the cost is less than the max resource value
        // AND the cost is more than the absolute value of variant
        // in case we are removing cost.
        if(playerResources[i].cost < resourceMax && playerResources[i].cost > Math.abs(variant)) {
          // Actually modify the playerObject resource cost
          playerObject.stats.resources[i].cost += variant;
          if(variant > 0) {
            // Show the increase in value on the log
            addListElement(logList, resourceName + " has risen $" + variant + " dollars.", "resource-increase");
          }
          // Using an else if here so nothing
          // shows if variant === 0, because
          // that's not very interesting.
          else if (variant < 0) {
            // Show the decrease in value on the log
            addListElement(logList, resourceName + " has fallen $" + Math.abs(variant) + " dollars.", "resource-decrease");
          }
        }
        // Check if the resource is too low
        if(playerResources[i].cost <= 1) {
          // Show the bankruptcy in the log
          addListElement(logList, resourceName + " is bankrupt! Resource pulled from market.");
          // Bankrupt the actual resource
          bankruptResource(i);
          // Let the player know about the new resource
          addListElement(logList, "New resource (" + playerResources[i].name + ", worth $" + playerResources[i].cost + ") created!");
        }
      }
  };
  // Function to fluctuate resource prices
  // called everytime inventory is updated.
  var updateResourcePrices = function() {
      // Pull playerObject's resources in locally
      var playerResources = playerObject.stats.resources;
      // Also the resourceName & resourceType for readability
      // in the for loop below
      var resourceName = "";
      var resourceType = "";
      // Amount resources should be flucuating
      var variant = 0;
      // Max $ amount resources can be
      var resourceMax = 250;
      // We'd like to evaluate every resource per update
      for (var i = 0; i < playerResources.length; i++) {
        // Get the necessary info for each resource & variant
        variant = randomNum(0,playerResources[i].trend.maxFlux);
        resourceName = playerResources[i].name;
        resourceType = playerResources[i].trend.name;
        // Stable resources won't be modified as much
        // so use 10% as the modify cost amount
        if(resourceType === "stable-up" || resourceType === "stable" || resourceType === "stable-down") {
          // The last value passed in this function is the chance
          // the resource's cost will modify out of 100
          modifyResourceCost(playerResources, resourceMax, variant, resourceName, i, 10);
        }
        // It's a volatile resource, so 30% chance
        // to modify the cost
        else {
          // The last value passed in this function is the chance
          // the resource's cost will modify out of 100
          modifyResourceCost(playerResources, resourceMax, variant, resourceName, i, 30);
        }
      }
  };
  // This function updates the resource boxes
  var updateResourceBoxes = function() {
    // Bring in playerObject to a local variable
    var player = playerObject.stats;
    // Sort out the player's resource array 
    player.resources.sort(function(a, b) {
      return b.amount - a.amount;
    });
    var theResource = "";
    var theText = "";
    // Loop through all the current resources
    for (var i = 0; i < player.resources.length; i++) {
      // Get the specific resource
      theResource = document.getElementsByClassName("resource-"+i)[0];
      // Change the text of that specific thing to an updated string
      theText = "<p><span class=\"fa " + player.resources[i].type.icon + " fa-fw\"></span>" + player.resources[i].name + "</p><p><span class=\"fa fa-dollar fa-fw\"></span>" + player.resources[i].cost + "</p>";
      if(player.resources[i].amount > 0) {
        theText += "<p><span class=\"fa fa-shopping-cart fa-fw\"></span>" + player.resources[i].amount + "</p>";
      }
      // Create a node to append to listElement
      theResource.innerHTML = theText;
      // Decide if it's owned or not
      if(player.resources[i].amount > 0 && !theResource.classList.contains("owned")) {
        theResource.classList.add("owned");
      }
      else if(player.resources[i].amount === 0 && theResource.classList.contains("owned")) {
        theResource.classList.remove("owned");
      }
    }
  };
  // Function to update the gameData object
  // to ensure the graphs will have historical
  // data!!! Yay!!!
  var updateGameData = function() {
    // Bring player and the resources in locally
    var player = playerObject.stats;
    var playerResources = playerObject.stats.resources;
    // update the gameData object for
    // the graph
    gameData.netWorth.push([year + "-" + displayMonth, portfolioTotal + player.money]);
    gameData.totalMoney.push([year + "-" + displayMonth, player.money, portfolioTotal, portfolioTotal + player.money]);
    // For each resource, I need to create a gameData entry
    for(var resource in playerResources) {
      if(playerResources.hasOwnProperty(resource)) {
        gameData.resourceList[playerResources[resource].name].push([year + "-" + displayMonth, playerResources[resource].cost]);
      }
    }
  };
  // This will make time pass in the game world
  var tick = function() {
    // Make a month pass, but
    // if we are in December
    if(month >= 12) {
      // The year should be January
      month = 1;
      // Also a year has passed!
      year += 1;
    }
    // Otherwise we can just
    // increment the month like normal
    else {
      month += 1;
    }
    // displayMonth also needs to advance
    displayMonth = month > 9 ? "" + month : "0" + month;
    // Update the gameData object for graphs
    // since time has passed
    updateGameData();
  };
  // Function to update the inventory box.
  // Called when controls are interacted with.
  var updateInventory = function() {
    // Bring player in locally
    var player = playerObject.stats;
    // Get the updated resource prices
    updateResourcePrices();
    // Reset portfolioTotal
    portfolioTotal = 0;
    // Recalculate portfolio total
    for (var i = 0; i < player.resources.length; i++) {
      portfolioTotal += player.resources[i].amount * player.resources[i].cost;
    }
    // Pull in old net worth value and see if we've gone up
    // (Usually from travelling)
    var netBlock = document.getElementsByClassName("net-worth-button")[0];
    // Get the content of the netBlock
    var oldNetWorth = netBlock.textContent;
    // Grab the net worth amount off of the textContent
    oldNetWorth = oldNetWorth.split("\$");
    // We need to display our total worth
    if(parseInt(oldNetWorth[1]) < portfolioTotal + parseInt(player.money)) {
        // If our total value has increased, show it!
        changeListElement("net-worth-button", "$" + player.money + "/Net Worth: $" + (portfolioTotal + parseInt(player.money)) + " - Up!");
    }
    else if (parseInt(oldNetWorth[1]) === portfolioTotal + parseInt(player.money)) {
        // No increase!
        changeListElement("net-worth-button", "$" + player.money + "/Net Worth: $" + (portfolioTotal + parseInt(player.money)));
    }
    else {
        // We lost money!
        changeListElement("net-worth-button", "$" + player.money + "/Net Worth: $" + (portfolioTotal + parseInt(player.money)) + " - Down!");
    }
    // Make time pass
    tick();
    // Tell the player where they are
    changeListElement("location", "Location: " + locations[parseInt(player.location)].name + " (" + displayMonth + "/" + year + ")");
    // Then update the resource boxes!
    updateResourceBoxes();
  };
  // Will return true if player owns any resources,
  // and false otherwise 
  var playerOwnsResource = function() {
      var ownedResources = [];
      // For every resource we have
      for(var i = 0; i < playerObject.stats.resources.length; i++) {
        // If we own that resource
        if(playerObject.stats.resources[i].amount > 0) {
          // Push the index into that ownedResources array
          ownedResources.push(i);
        }
      }
      // Now the moment of truth
      if(ownedResources.length !== 0) {
        return true;
      }
      return false;
  };
  // Set random resource index, based on ownership
  var setRandomResourceIndex = function() {
      // Empty array holding resources index's that we own
      var ownedResourcesIndex = [];
      // If we have more than 1 resource
      if(playerObject.stats.resources.length > 1) {
        // For every resource we have
        for(var i = 0; i < playerObject.stats.resources.length; i++) {
          // If we own that resource
          if(playerObject.stats.resources[i].amount > 0) {
            // Push the index into that ownedResourcesIndex array
            ownedResourcesIndex.push(i);
          }
        }
      }
      // Pick a random value in ownedResourcesIndex and
      // now set playerObject's resourceIndex for permanence
      // And let's default this value to 0 if there are no owned resource
      // so we'll just try and sell the first resource on the list.
      playerObject.stats.resourceIndex = (ownedResourcesIndex.length === 0) ? 0 : ownedResourcesIndex[randomNum(0,ownedResourcesIndex.length)];
  };
  // Update resource index globally
  var updateResourceIndex = function(resourceIndex) {
    // Pull in playerObject to this method
    var player = playerObject.stats;
    // If we have a resourceIndex, let's set it accordingly (the click came from resource button)
    if (typeof resourceIndex !== "undefined" && typeof resourceIndex !== "object") {
      if (resourceIndex < player.resources.length) {
        playerObject.stats.resourceIndex = resourceIndex;
      } else {
        console.error("updateResourceIndex exception: Incoming resourceIndex outside of bounds of resources array.");
      }
    }
    // We don't have a suitable resource index, so let's randomly shuffle the resource index
    else {
      playerObject.stats.resourceIndex = randomNum(0,player.resources.length);
    }
  };
  // Update location index globally
  var updateLocationIndex = function(newLocation) {
    playerObject.stats.location = newLocation;
  };
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
            moreBehavior[0](moreBehavior[1]);
          }
        }
      });
    } else {
      console.error("addButtonEvent needs a defined, non-null button as it's first argument. See syntax: addButtonEvent(button, logFunction, moreBehavior), with moreBehavior being an optional function.");
    }
  };
  // Buy button functions 
  // (Probably could combine sellMessage & buyMessage into
  // one super "Message" function that would take in
  // yet another function... that is getting ugly though  
  var buyMessage = function(resourceIndex, amount) {
    // Check resourceIndex
    if (typeof resourceIndex === "undefined" || resourceIndex === null) {
      // if we are null or empty, make one up.
      updateResourceIndex();
      resourceIndex = playerObject.stats.resourceIndex;
    } else {
      // Pull in resourceIndex
      updateResourceIndex(resourceIndex);
    }

    // Check amount
    var resourceAmount = (amount === undefined) ? 1 : amount;

    // If they can't buy the resource, fuck them.
    if (playerObject.stats.money < (playerObject.stats.resources[resourceIndex].cost * resourceAmount)) {
      addListElement(logList,"Can't afford unit(s) of " + playerObject.stats.resources[resourceIndex].name + ".");
      addListElement(logList, "(Attempted to purchase " + resourceAmount + ".)");
    }
    // If the player can afford it, let's buy it!
    else {
      addListElement(logList, "You bought " + resourceAmount + " unit(s) of " + playerObject.stats.resources[resourceIndex].name + ".");
    }
  };
  var buyAction = function(amount) {
    // Pull in playerObject to this method
    var player = playerObject.stats;
    // Check amount
    var resourceAmount = (amount === undefined) ? 1 : amount;
    // Pull in resourceIndex
    var resourceIndex = player.resourceIndex;
    // If the player can afford the resource
    if (player.money >= (player.resources[resourceIndex].cost * resourceAmount)) {
      // Update the player's money
      playerObject.stats.money = player.money - (player.resources[resourceIndex].cost * resourceAmount);
      // Update the player's resource amount
      playerObject.stats.resources[resourceIndex].amount += parseInt(resourceAmount);
    } else {
      console.error("buyAction exception: Not enough money to make purchase.");
    }
    updateInventory();
  };
  // Sell button needs to populate the log,
  // and this function does that. Returns null
  // if player doesn't own the resource.
  var sellMessage = function(resourceIndex, amount) { 
    // Check resourceIndex
    if (typeof resourceIndex === "undefined" || resourceIndex === null) {
      // If the player owns NO resource, return a log message indicating
      // that before messing with resourceIndex
      if(!playerOwnsResource()) {
        addListElement("You don't have any resource to sell! Try buying some.");
        // Make sure to leave the function
        return null;
      }
      // if I'm calling this function with no resourceIndex, it's
      // safe to assume it's from the sell random button, since the
      // resources will always call sellMessage with their index, so just
      // set a new random resource index.
      setRandomResourceIndex();
      // Set resourceIndex for this function
      resourceIndex = playerObject.stats.resourceIndex;
    } else {
      // Pull in resourceIndex
      updateResourceIndex(resourceIndex);
    }
    // Check amount
    var resourceAmount = (amount === undefined) ? 1 : amount;

    // If you have the resource amount, go ahead and sell it!
    if (playerObject.stats.resources[resourceIndex].amount >= resourceAmount) {
      addListElement(logList, "You sold " + resourceAmount + " unit(s) of " + playerObject.stats.resources[resourceIndex].name + ".");
    }
    // If the player can't afford it, fuck off!
    else {
      addListElement(logList, "You don't have " + resourceAmount + " unit(s) of " + playerObject.stats.resources[resourceIndex].name + ".");
    }
  };
  var sellAction = function(amount) {
    // If the player owns resources, continue on with this action
    if(playerOwnsResource()) {
      // Pull in playerObject to this method
      var player = playerObject.stats;
      // Check amount
      var resourceAmount = (amount === undefined) ? 1 : amount;
      // Pull in resourceIndex
      var tmpResourceIndex = player.resourceIndex;
      // If you have the resource amount, go ahead and sell it!
      if (player.resources[tmpResourceIndex].amount >= resourceAmount) {
        // Update players resource
        playerObject.stats.resources[tmpResourceIndex].amount -= parseInt(resourceAmount);
        // Update player's money
        playerObject.stats.money = player.money + (player.resources[tmpResourceIndex].cost * resourceAmount);
        // Update the inventory box
        updateInventory();
      } 
    }
  };
  // Location logging functionality - called from
  // travelDialog function.
  // If called without an argument, it will generate
  // a new location to travel to, and if passed an index,
  // will move the player. If the player can't be moved,
  // this function will return null.
  var travelMessage = function(newIndex) {
    // Pull in playerObject to this method
    var player = playerObject.stats;
    // Pull in newIndex or set it to a random
    // element of the planetsArray we
    // aren't currently on
    // -------------------
    // Try and generate a new locationIndex. 
    var newNum = randomNum(0,locations.length-1);
    // Make sure we don't get the same locationIndex that we have
    while (newNum === parseInt(player.location)) {
      // Make sure we generate a NEW location
      newNum = randomNum(0,locations.length-1);
    }
    // Now set pulledIndex to be our newNum if it
    // didn't come in the arguments of the function
    var pulledIndex = newIndex || newNum;
    // First let's test if the player can afford the move,
    // because if they can't there's no point in doing
    // anymore math or updating
    // -------------------------
    // Set move fee based on distance between old
    // and new planets - take the ceiling of the distance
    var lyBetweenPlanets = Math.ceil(distanceBetween(locations[pulledIndex], locations[player.location]));
    // Make the move fee anywhere from .1-.3%
    // of the "light-years" between planets
    moveFee = Math.floor(lyBetweenPlanets * (randomNum(1,3) * 0.001));
    // if the player doesn't have 10% of the distance, don't let him travel
    if (player.money < moveFee) {
      // Update the log and let the poor person know!
      addListElement(logList, "Can't afford the " + lyBetweenPlanets +  " light-year move from " + locations[player.location].name + " to " + locations[pulledIndex].name + ".");
      addListElement(logList, "Why don't you sell some resources?");
      // Get out of this function
      return null;
    }
    // Now if the player CAN afford it
    // -------------------------------
    // Make sure we have a valid resource index for potentially selling
    // since this runs before sellAction
    updateResourceIndex();
    // Fire the first message before we set the player's
    // location index and forget it
    addListElement(logList,"Player moved from " + locations[parseInt(player.location)].name + " to " + locations[pulledIndex].name);
    // Then update the player's location index
    updateLocationIndex(pulledIndex);
    // Display the final log message about how much it was
    addListElement(logList,"You were charged  $" + moveFee + " to go " + lyBetweenPlanets + " light-years.");
  };
  var travelAction = function() {
    // Pull in playerObject to this method
    var player = playerObject.stats;
    // if the player has $10 (he should, we just checked this in travelMessage).
    if (player.money >= moveFee) {
      // Remove the money from the player's inventory
      playerObject.stats.money = parseInt(player.money) - moveFee;
      updateInventory();
    }
  };
  // This function will call up the modal
  // that is for travelling
  var launchTravelDialog = function() {
    // Greet the player with a message,
    // reminding them where they are
    $(".travel-text").text("Where would you like to go? Currently on " + locations[parseInt(playerObject.stats.location)].name + ".");
    // Initialize the travel dropdown
    var travelSelect = $(".travel-select")[0];
    // Get rid of all the contents
    for(var j = travelSelect.options.length - 1; j >= 0; j--) {
        travelSelect.remove(j);
    }
    // So we can fill it back up with all the planets
    // except the one the player is on
    for (var i = 0; i < locations.length; i++) {
        // Create an option for every planet
        // except the one we are on
        if(parseInt(playerObject.stats.location) !== i) {
          var opt = document.createElement('option');
          opt.value = opt.innerHTML = locations[i].name + ", " + Math.ceil(distanceBetween(locations[i], locations[playerObject.stats.location])) + " LY";
          travelSelect.appendChild(opt);
        }
    }
    // Initialize the options-dialog modal
    $(".travel").dialog({
        modal: true,
        buttons: {
            "Go": function() {
              var locationIndex = 0;
              // Find which thing I selected by
              // comparing name with locations array,
              // and update the log with that information
              for(var location in locations) {
                if(locations.hasOwnProperty(location)) {
                  // Check if the name of the location is the
                  // same as the selected name in the travel-select box
                  if($(".travel-select")[0].value.indexOf(locations[location].name) > -1) {
                    // If it is, we have our location index!
                    locationIndex = location;
                  }
                }
              }
              // We should log a message that we traveled!
              travelMessage(locationIndex);
              // As well as update the screen
              travelAction();
              // Then close this dialog
              $(this).dialog("close");
            },
            "Random Planet": function() {
              // If travelAction is called with no variable,
              // it will "intelligently" decide where to go
              travelMessage();
              // Then we should update the screen
              travelAction();
              // Then close this dialog
              $(this).dialog("close");
            },
            "Close": function() {
              $(this).dialog("close");
            }
        }
    });
  };
  // Will call the options dialog pop-up, meant
  // to be used with the options button
  var launchOptionsDialog = function() {
    $(".options-text").text("Microstocks");
    $(".options-subtext").text(microstocksVersion);
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
  };
  // Function to launch the pretty graph dialog which will
  // take a "type" of graph (reads off of the gameData object)
  // as well as an optional resourceName if you pass the
  // type "resourceList"
  var launchGraphDialog = function(type, resourceName) {
    // Set up the content of the modal
    $(".graph-type").text(type);
    // Set up the Google Chart with the new data
    var options = {
      title: type === "resourceList" ? resourceName : type,
      hAxis: {
        title: 'Date',
        titleTextStyle: {color: '#333'}, 
        slantedText:true,
        slantedTextAngle:50
      },
      vAxis: {minValue: 0},
      width: $("#graph-wrapper").outerWidth(),
      height: $("#graph-wrapper").outerHeight(),
      pointSize: 3,
      isStacked: false
    };
    var chart = new google.visualization.AreaChart(document.getElementById('graph-wrapper'));
    if(type === "resourceList") {
      chart.draw(google.visualization.arrayToDataTable(gameData[type][resourceName]), options);
    }
    else {
      chart.draw(google.visualization.arrayToDataTable(gameData[type]), options);
    }
    // Initialize the graph-dialog modal
    $(".graph-dialog").dialog({
        modal: true,
        buttons: {
            "Close": function() {
              $(this).dialog("close");
            }
        }
    });
  };
  // Function that prints out buySell dialog
  // welcome message with some data, takes in one
  // string that is the last line of dialogue, indicating
  // what the user can do, as well as an index
  var buySellDialogueMessage = function(theIndex, finalStatement) {
    // pull in playerObject to this method
    var player = playerObject.stats;
    // Bring in index from buySellDialogue
    var index = theIndex;
    // Pull in some variables for stats about resource
    var resourceName = player.resources[index].name;
    var resourceCost = player.resources[index].cost;
    var resourceType = player.resources[index].type.name;
    var resourceIcon = player.resources[index].type.icon;
    var resourceTrendAverage = player.resources[index].trend.maxFlux;
    var resourceAmount = player.resources[index].amount;
    // Build the trendAmount string conditional 
    // on if the trendAmount is negative or positive
    var trendAmountString = (resourceTrendAverage >= 0) ? "<li>Avg. Trend amount: $" + resourceTrendAverage + "</li>" : "<li>Avg. Trend amount: -$" + Math.abs(resourceTrendAverage) + "</li>";
    // Build the resourceAmount string conditional
    // on if the player has more than 0 of the resource
    var resourceAmountString = (resourceAmount > 0) ? "<li>You own " + resourceAmount + " unit(s) of " + resourceName + "</li>" : "<li>You don't own any units of " + resourceName + "</li>";
    // Construct return string to fill up buySellModal for resource click
    return "<h3><span class=\"fa " + resourceIcon + " fa-fw\"></span>" + resourceName + "</h3><hr />" +
      "<ul>" +
        "<li class=\"buysell-resource-value\">Current cost: $" + resourceCost + "</li>" +
        "<li>Type: " + resourceType + "</li>" +
        trendAmountString +
        resourceAmountString +
      "</ul><hr />" +
      finalStatement;
  };
  // Function to call buy/sell alert box
  // We have to call this last because it uses 
  // buyAction, sellAction, buyMessage & sellMessage
  var buySellDialogue = function(index) {
    // pull in playerObject to this method
    var player = playerObject.stats;
    // instantiate variables needed for jquery-ui elements
    var maxResources = 0;
    var sliderStep = 0;
    var sliderValue = 0;
    var slideAmount = 1;
    // Pull in resourceName
    var resourceName = player.resources[index].name;
    $(".buy-sell-dialogue").html(buySellDialogueMessage(index,"Would you like to buy or sell " + resourceName + " today?"));
    // Initialize the buy-sell dialogue modal
    $(".buy-sell").dialog({
        modal: true,
        buttons: {
          "Buy": function() {
              // Set how many resources we can buy
              maxResources = parseInt(player.money) / parseInt(player.resources[index].cost);
              // If we don't have any money, let the player know
              if(maxResources < 1) {
                $(".buy-sell-dialogue").html(buySellDialogueMessage(index,"Can't afford any " + resourceName + "! Try selling other resources!"));
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
                  $(".buy-sell-dialogue").html(buySellDialogueMessage(index,"You don't have any " + resourceName + " to sell!"));
              }
          },
          // If the player wants to see the history of the
          // resource's value, this is where they do it!
          "History": function() {
            launchGraphDialog("resourceList",resourceName);
          },
          // Or they can just exit the dialog with cancel
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
            "Buy Max": function() {
                // How much to buy before the player's money is gone?
                var amountToBuyMax = Math.floor(player.money/player.resources[index].cost);
                // Create the log message
                var buyMaxLogMessage = buyMessage(index, amountToBuyMax);
                addListElement(logList, buyMaxLogMessage);
                buyAction(amountToBuyMax);
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
            "Sell All": function() {
                // How much to buy before the player's money is gone?
                var amountToSell = player.resources[index].amount;
                // Create the log message
                var sellAllLogMessage = sellMessage(index, amountToSell);
                addListElement(logList, sellAllLogMessage);
                sellAction(amountToSell);
                // Close up the buy-sell dialog too
                $(".buy-sell").dialog("close");
                $(this).dialog('close');
            },
            Cancel: function() {
                // Close up the buy-sell dialog too
                $(".buy-sell").dialog("close");
                $(this).dialog("close");
            }
        }
    });
  };
  // This adds all the resource button event listeners
  // to buy and sell those invididual resources
  // and it's declared down here because it needs
  // buySellDialogue
  var addResourceEventListeners = function() {
    var resourceArray = document.getElementsByClassName("resource");
    for (var i = 0; i < resourceArray.length; i++) {
      addButtonEvent(resourceArray[i], [buySellDialogue, i]);
    }
  };
  // This function creates the display of the resources
  var createResourceBoxes = function() {
      // Bring in playerObject to a local variable
      var player = playerObject.stats;
      // variables for display resources
      var className = "";
      var theText = "";
      var cssClassArray = [];
      // get the resource list ul element
      var resourceList = document.getElementsByClassName("resource-list")[0];
      // declare a listElement holder variable, gotta put that <li> somewhere!
      var listElement = "";
      // Loop through all the current resources
      for (var i = 0; i < player.resources.length; i++) {
        // Create a list element for each resource
        listElement = document.createElement("LI");
        // Create the HTML string for each resource
        theText = "<p><span class=\"fa " + player.resources[i].type.icon + " fa-fw\"></span>" + player.resources[i].name + "</p><p><span class=\"fa fa-dollar fa-fw\"></span>" + player.resources[i].cost + "</p>";
        if(player.resources[i].amount > 0) {
          theText += "<p><span class=\"fa fa-shopping-cart fa-fw\"></span>" + player.resources[i].amount + "</p>";
        }
        // Append message to <li> node
        listElement.innerHTML = theText;
        className = "resource resource-" + i + " under-hover";
        if(player.resources[i].amount > 0) {
          className += " owned";
        }
        // We have a class that is multiple values
        // so let's add it to the DOM
        cssClassArray = className.split(" ");
        // Check the object and see if
        // it's a "true" member
        for (var j in cssClassArray) {
          if(cssClassArray.hasOwnProperty(j)) {
            listElement.classList.add(cssClassArray[j]);
          }
        }
        // Append <li> node to resource list <ul>
        resourceList.appendChild(listElement);
      }
      // Now add the event listeners for buying & selling those resources
      addResourceEventListeners();
  };
  // This function creates the initial display of the inventory box
  var createInventory = function() {
    // Bring in playerObject to a local variable
    var player = playerObject.stats;
    var resources = playerObject.stats.resources;
    // Get the player's inventory list, since we are adding elements to it.
    var invList = document.getElementsByClassName("inventory-list")[0];
    // Variable to display the total amount of the portfolio
    var portfolioTotal = 0;
    // Display portfolio total
    for (var i = 0; i < resources.length; i++) {
      portfolioTotal += player.resources[i].amount * player.resources[i].cost;
    }
    // We need to display our total worth
    addListElement(invList, "$" + player.money + "/Net Worth: $" + (portfolioTotal + parseInt(player.money)), "money net-worth-button under-hover");
    // Our location
    addListElement(invList, "Location: " + locations[parseInt(player.location)].name + " (" + displayMonth + "/" + year + ")", "location under-hover");
    // Then draw the resources
    createResourceBoxes();
  };
  // Now add our public init method to call in the ready event
  microstocksModule.init = function() {
    // Initialize modals by loading jquery-ui javascript,
    // and when the script load is successful, initialize
    // MICROSTOCKS!
    $.getScript("https://code.jquery.com/ui/1.11.4/jquery-ui.min.js", function() {
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
      addButtonEvent(travelButton, launchTravelDialog);
      addButtonEvent(optionsButton, launchOptionsDialog);
      // Now let's create the inventory panel!
      createInventory();
      // Display a welcome message for the player
      addListElement(logList, "You arrive on " + locations[parseInt(playerObject.stats.location)].name + " with a few resources and $" + playerObject.stats.money + " to your name.");
      // Initialize our google graph
      initializeGraph();
      // And let's pull the inventory buttons
      // so we can look at the pretty graphs
      var netWorthButton = document.getElementsByClassName("net-worth-button")[0];
      // Don't forget it has an event listener as well!
      addButtonEvent(netWorthButton, [launchGraphDialog, "totalMoney"]);
    });
  };
  // give back our module!
  return microstocksModule;
}()); // Execute MICROSTOCKS function enclosure immediately

// After this script gets called via async, load jQuery,
// and subsequently jQuery-ui then MICROSTOCKS
// and google charts somewhere in there.
// -------------------------------------
var scriptTag = document.createElement('script');
scriptTag.src = "http://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.4/jquery.min.js";
// When the script loads, let's call MICROSTOCKS.init!
scriptTag.onload = scriptTag.onreadystatechange = MICROSTOCKS.init; 
// Append our jQuery script to the <body>
document.body.appendChild(scriptTag);