
$(document).ready(function () {

     var cityName, cityId, country, temp, tempF, humidity, windSpeed, icon, lon, lat, dt, currentDate, cnt, uvIndex;
     var cities = [];
     var cityFound = false;
     var initGetLocation = true;
     var apiKey = "d9afc09e695397e78dad56e7b3707617";
     init();

     function init() {
          getLocation();
          getFromLocaleStorage();
     }


     $("#searchBtn").on("click", function () {
          getWeatherDetails();
          initGetLocation = false;
     });

     function getIntoSearchHistory() {
          var li = $("<li>");
          var ul = $(".list-group");
          cityName = $("#search").val().trim();
          cityNameCap = cityName.charAt(0).toUpperCase() + cityName.slice(1)
          li.text(cityNameCap);
          if (cities.length >= 7) {
               console.log(cities);
               cities.splice(0,1);
               ul.pop();
          }
          if (!cities.includes(cityNameCap)){
               cities.push(cityNameCap);
               $(li).addClass("list-group-item");
               ul.prepend(li);
               saveToLocaleStorage();
          }
     }

     function getFromLocaleStorage() {
          if (localStorage.getItem("cities")) {
               //Split the localstorage cities to convert from string to array
               cities = localStorage.getItem("cities").split(",");
               showCities();
          }
     }

     function showCities() {
          $.each(cities, function (i, city) {
               var li = $("<li>");
               var ul = $(".list-group");
               li.text(city);
               $(li).addClass("list-group-item");
               ul.prepend(li);
          });
     }

     function saveToLocaleStorage() {
          localStorage.setItem("cities", cities);
     }

     function getLocation() {
          if (navigator.geolocation) {
               navigator.geolocation.getCurrentPosition(showPosition);
          } else {
               alert("Geolocation is not supported by this browser.");
          }
     }

     function showPosition(position) {
          lat = position.coords.latitude;
          lon = position.coords.longitude;
          displayLocation(lat, lon)
     }

     function displayLocation(latitude, longitude) {
          var queryURL = `http://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&lat=${latitude}&lon=${longitude}`;
          $.ajax({
               url: queryURL,
               method: "GET"
          }).then(function (response) {
               $("#search").val(response.name);
               getWeatherDetails();
          });
     };

     function getWeatherDetails() {
          cityName = $("#search").val().trim();
          var queryURLWeather = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;
          $.ajax({
               url: queryURLWeather,
               method: "GET",
               success: function(){
                    cityFound = true;
               }, 
               error: function(){
                    cityFound = false;
                    alert("City not found");
                    $("#search").val("");
               }     
               }).then(function (response) {
                    cityId = response.id;
                    country = response.sys.country;
                    temp = response.main.temp;
                    tempF = ((temp - 273.15) * 1.80 + 32).toFixed(2);
                    humidity = response.main.humidity;
                    windSpeed = response.wind.speed;
                    icon = response.weather[0].icon;
                    lon = response.coord.lon;
                    lat = response.coord.lat;
                    dt = response.dt;
                    currentDate = new Date(dt * 1000);
                    var imageUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`
                    $("#cityImg").attr("src", imageUrl);
                    $("#cityName").text(cityName + " " + currentDate.toLocaleDateString());
                    $("#temp").html("Temperature: " + tempF + " &#8457;");
                    $("#humidity").text("Humidity: " + humidity + " %");
                    $("#windSpeed").text("Wind Speed: " + windSpeed + " MPH");
                    getUVIndex();
                    if(cityFound == true && initGetLocation == false){
                    //if(cityFound == true){
                         console.log(cityFound);
                         getIntoSearchHistory();
                         cityFound = false;
                    }
               });
               
          }

     function getUVIndex() {
                    cnt = 1;
                    var queryURLUvi = `http://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}&cnt=${cnt}`;
                    $.ajax({
                         url: queryURLUvi,
                         method: "GET"
                    }).then(function (response2) {
                         uvIndex = response2.value;
                         $("#UVIndex").text("UV Index: " + uvIndex);
                         get5DayForecast();
                    });
               }

     function get5DayForecast() {
                    cnt = 5;
                    var queryURLForecast = `http://api.openweathermap.org/data/2.5/forecast?id=${cityId}&appid=${apiKey}`;
                    $.ajax({
                         url: queryURLForecast,
                         method: "GET"
                    }).then(function (response) {
                         var objArray = [];
                         for (var i = 0; i < 40; i = i + 8) {
                              var obj = {
                                   temp: response.list[i].main.temp,
                                   humidity: response.list[i].main.humidity,
                                   icon: response.list[i].weather[0].icon,
                                   dt: response.list[i].dt
                              };
                              objArray.push(obj);
                         }
                         $("#11").text(new Date(objArray[0].dt * 1000).toLocaleDateString());
                         $("#12").attr("src", `http://openweathermap.org/img/wn/${objArray[0].icon}@2x.png`);
                         $("#13").html("Temp: " + (((objArray[0].temp - 273.15) * 1.80 + 32).toFixed(2)) + " &#8457;");
                         $("#14").text("Humidity: " + objArray[0].humidity + " %");

                         $("#21").text(new Date(objArray[1].dt * 1000).toLocaleDateString());
                         $("#22").attr("src", `http://openweathermap.org/img/wn/${objArray[1].icon}@2x.png`);
                         $("#23").html("Temp: " + (((objArray[1].temp - 273.15) * 1.80 + 32).toFixed(2)) + " &#8457;");
                         $("#24").text("Humidity: " + objArray[1].humidity + " %");

                         $("#31").text(new Date(objArray[2].dt * 1000).toLocaleDateString());
                         $("#32").attr("src", `http://openweathermap.org/img/wn/${objArray[2].icon}@2x.png`);
                         $("#33").html("Temp: " + (((objArray[2].temp - 273.15) * 1.80 + 32).toFixed(2)) + " &#8457;");
                         $("#34").text("Humidity: " + objArray[2].humidity + " %");

                         $("#41").text(new Date(objArray[3].dt * 1000).toLocaleDateString());
                         $("#42").attr("src", `http://openweathermap.org/img/wn/${objArray[3].icon}@2x.png`);
                         $("#43").html("Temp: " + (((objArray[3].temp - 273.15) * 1.80 + 32).toFixed(2)) + " &#8457;");
                         $("#44").text("Humidity: " + objArray[3].humidity + " %");

                         $("#51").text(new Date(objArray[4].dt * 1000).toLocaleDateString());
                         $("#52").attr("src", `http://openweathermap.org/img/wn/${objArray[4].icon}@2x.png`);
                         $("#53").html("Temp: " + (((objArray[4].temp - 273.15) * 1.80 + 32).toFixed(2)) + " &#8457;");
                         $("#54").text("Humidity: " + objArray[4].humidity + " %");
                    });
               }

});
