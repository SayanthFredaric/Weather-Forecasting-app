let weatherConfig = {
    baseUrl: "https://api.openweathermap.org/data/2.5/",
    apikey: "ad19e7743457ec150db587bb69473278",
  }
  
  let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  function timestamp(){
  let currentdate = new Date(); 
  let datetime = currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
  $('#timestamp').html(`Last synced at: ${datetime}`);
  }
  
  function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    console.log("Geolocation is not supported by this browser.");
    // if Geolocation doesnot exists
    search('delhi');
  }
  }
  
  function showPosition(position) {
  $.get(`${weatherConfig.baseUrl}weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${weatherConfig.apikey}&cnt=7`, function(data, status){
    setData(data);
    setChart([data]);
  });
  }
  
  function setData(data){
    // timestamp 
     timestamp();
  
     // location
     let location = data['name'];
     if(!location){
       location = 'location';
     }
     $('#location').html(location);
  
     // temperation in kelvin
     let kelTemp = parseFloat(data.main.temp);
     let temp = kelTemp-273.15;
     if(!kelTemp){
       $('.temp').html('');
     }else{
       $('.temp').html(`${temp.toFixed(2)}°C`);
     }
     
     // wind speed
     let windspeed = data['wind'].speed;
     if(!windspeed){
       windspeed = 0;
     }
     $('#windSpeed').html(windspeed);
  
     // humidity
     let humidity = data.main.humidity;
     if(!humidity){
       humidity = 0;
     }
     $('#humidity').html(humidity);
     
     // weather
     let weather = data['weather'][0]['main'];
     if(!weather){
       weather = 'Unknown';
     }
     $('#weather').html(weather);
  
     //icon
     let weatherIcon = data['weather'][0]['icon'];
     let weatherLogo = 'https://openweathermap.org/img/wn/04n.png'
     if(weatherIcon){
       weatherLogo = `http://openweathermap.org/img/wn/${weatherIcon}@2x.png`;
     }
     $('#weatherLogo').attr('src', weatherLogo);
  }
  
  function search(city){
  $.get(`${weatherConfig.baseUrl}find?q=${city}&appid=${weatherConfig.apikey}&cnt=7`, function(data, status){
    if(data.list.length){
      setData(data.list[0]);
      setChart(data.list);
    }
  });
  }
  
  function setChart(list){
  document.querySelector("#chartReport").innerHTML = '<canvas id="myChart"></canvas>'
  const ctx = document.getElementById('myChart').getContext('2d');
  const d = new Date();
  let day = d.getDay();
  const labels = days.map((_day, index)=>{return days[(day + index)%7]});
  console.log(labels)
  const data = {
    labels: labels,
    datasets: [{
      label: `${list[0].name} weather °C`,
      data: list.map(obj=>(parseFloat(obj.main.temp) - 273.15).toFixed(2)),
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };
  const config = {
    type: 'line',
    data: data,
  };
  const myChart = new Chart(ctx, config);
  }
  
  $( document ).ready(function() {
  timestamp();
  getLocation();
  $('#searchBtn').click(()=>{
    let city = $('#search').val();
    if(!city){
      alert('Please enter valid city name!');
      return;
    }
    search(city);
  });
  
  });
  