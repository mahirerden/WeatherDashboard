
$(document).ready(function () {     

     var apiKey = "d9afc09e695397e78dad56e7b3707617";
     
     
     //var queryURLForecast = `http://api.openweathermap.org/data/2.5/forecast?id=${cityId}&appid=${apiKey}`;
     //


     $("#searchBtn").on("click", function () {
          var cityName = $("#search").val().trim();
          var queryURLWeather = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;
          console.log(cityName);
          $.ajax({
               url: queryURLWeather,
               method: "GET"
          }).then(function (response) {
               var cityId = response.id;
               var country = response.sys.country;
               var temp = response.main.temp;
               var tempF = ((temp - 273.15) * 1.80 + 32).toFixed(2);
               var humidity = response.main.humidity;
               var windSpeed = response.wind.speed;
               var icon = response.weather[0].icon;
               var lon = response.coord.lon;
               var lat = response.coord.lat;
               console.log(response.coord.lon);
               console.log(response.coord.lat);
               var dt = response.dt;
               var d = new Date(dt*1000);
               var cnt = 1;
               var imageUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`
               $("#cityImg").attr("src", imageUrl);
               console.log(cityName);
               $("#cityName").text(cityName + " " + d.toLocaleDateString());
               $("#temp").text("Temperature: "+ tempF + " F");
               $("#humidity").text("Humidity: "+ humidity + " %");
               $("#windSpeed").text("Wind Speed: "+ windSpeed + " MPH");

               var queryURLUvi = `http://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}&cnt=${cnt}`;
               $.ajax({
                    url: queryURLUvi,
                    method: "GET"
               }).then(function (response2) {
                    var uvIndex = response2.value;
                    $("#UVIndex").text("UV Index: "+ uvIndex);
               });
          });
     });

});
