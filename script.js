const input=document.querySelector('.input')
const input_button = document.querySelector('.submit')
const logo = document.querySelector('.logo')
const back_btn = document.querySelector('.back_btn')
const weather_box = document.querySelector('.weather')

const API_KEY=''

input_button.addEventListener('click', () => {
    if (input.value) {
    let input_field=input.value;
    fetch_data(input_field)
    logo.classList.add('hide')
    back_btn.classList.remove('hide')

    } else {
        console.log("Field can't be empty")
    }
})


async function fetch_data(city) {
    const geo_data = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`)
    const geo_json = await geo_data.json()
    if (geo_json[0]) {
    const lat = geo_json[0].lat;
    const lon = geo_json[0].lon;
    
        console.log(lat, lon)
    const data_lat_lon = await fetch(`
        https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weather_code,daylight_duration,rain_sum&hourly=temperature_2m,is_day,apparent_temperature,relative_humidity_2m,rain,weather_code&current=temperature_2m,apparent_temperature,rain&timezone=auto
        `)
    const data_json = await data_lat_lon.json()
    console.log(data_json)
    insert_data(data_json)
    weather_box.classList.remove('hide')
        return data_json
    } else {
        console.log("You didn't enter city's name right")
    }
}


function datetotime(date) {
    let time=[]
    date.forEach((element) => {
        const new_time = element.split('T')[1]
        time.push(new_time)
    })
    return(time)
}


function insert_data(data) {
    const png = document.querySelector('.weather_png')
    const WMO_data =data.daily.weather_code[0]
    const is_day = data.hourly.is_day[0]
    let image_path = ''
    if (is_day==0) {
        image_path = WMO[WMO_data].night.image
    } else if (is_day==1) {
        image_path = WMO[WMO_data].day.image
    } else {
        console.log('idiot')
    }
    png.src=image_path
    let temp = document.querySelector('.temp span')
    temp.innerText= data.current.temperature_2m
    let temp_feels= document.querySelector('.temp_apparent span')
    temp_feels.innerText=data.current.apparent_temperature
    let min = document.querySelector('.min')
    let max = document.querySelector('.max')
    min.innerText=data.daily.temperature_2m_min[0]
    max.innerText=data.daily.temperature_2m_max[0]
    let hourly_box = document.querySelector('.hourly_box')
    let data_time = data.hourly.time
    let data_temp=data.hourly.temperature_2m
    let data_hum = data.hourly.relative_humidity_2m
    var hourly_time=[];
    var hourly_temp=[];
    var hourly_hum=[];
    for (var i=0;i<24; i++) {
        hourly_time.push(data_time[i])
        hourly_temp.push(data_temp[i])
        hourly_hum.push(data_hum[i])
    }
    hourly_time=datetotime(hourly_time)

    hourly_box.innerHTML=''
    for(var i=0; i<24; i++) {
        hourly_box.innerHTML= hourly_box.innerHTML + `
        <div class="hourly_item">
            <p class="info">${hourly_time[i]}</p>
            <p class="info">${hourly_temp[i]}<span class="comm">°C</span></p>
            <p class="info">${hourly_hum[i]}<span class="comm">% hum</span></p>
        </div>
        `
    }
    let rain = document.querySelector('.other p span')
    rain.innerText=data.current.rain
}
back_btn.addEventListener('click', ()=> {
    logo.classList.remove('hide')
    back_btn.classList.add('hide')
    weather_box.classList.add('hide')

})