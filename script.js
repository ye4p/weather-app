
const input=document.querySelector('.input')
const input_button = document.querySelector('.submit')
const logo = document.querySelector('.logo')
const back_btn = document.querySelector('.back_btn')
const weather_box = document.querySelector('.weather')
const star = document.querySelector('.fav_cont i')
const favorites_btn = document.querySelector('.favorites_btn')
const input_form = document.querySelector('.input_field')
const main_window = document.querySelector('.main_window')
const title_app = document.querySelector('.main_window h1')

// console.dir(main_window)

const API_KEY=''
let current_city=''

input_button.addEventListener('click', () => {
    if (input.value) {
    let input_field=input.value;
    fetch_data(input_field)
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
    

    const data_lat_lon = await fetch(`
        https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weather_code,daylight_duration,rain_sum&hourly=temperature_2m,is_day,apparent_temperature,relative_humidity_2m,rain,weather_code&current=temperature_2m,apparent_temperature,rain&timezone=auto
        `)
    const data_json = await data_lat_lon.json()
    logo.classList.add('hide')
    back_btn.classList.remove('hide')
    star.classList.add('fa-star-o')
    let memory_cities=[]
    for( var i = 1; i<4; i++) {
        memory_cities.push(localStorage.getItem(`city${i}`))
    }
    if (memory_check(memory_cities, city) == 1 || memory_check(memory_cities, city) == 3 || memory_check(memory_cities, city) == 2) {
        star.classList.remove('fa-star-o')
        star.classList.add('fa-star')
    } else if (memory_check(memory_cities)) {
        star.classList.remove('fa-star')
        star.classList.add('fa-star-o')
    }
    

  //  console.log(data_json)
    insert_data(data_json)
    weather_box.classList.remove('hide')
    current_city=city.toLowerCase();
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


function insert_data(data, city) {
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
    go_back()
})

function go_back() {
    logo.classList.remove('hide')
    back_btn.classList.add('hide')
    weather_box.classList.add('hide')
    star.classList.remove('fa-star-o')
    input_form.classList.remove('hide')
    title_app.classList.remove('hide')
    favorites_btn.classList.remove('hide')
    main_window.style.width=600+'px'
    const modal_1=document.querySelector('.modal1 .weather_fav')
    const modal_2=document.querySelector('.modal2 .weather_fav')
    const modal_3=document.querySelector('.modal3 .weather_fav')
    const modal_1n=document.querySelector('.modal1 .fav_empty')
    const modal_2n=document.querySelector('.modal2 .fav_empty')
    const modal_3n=document.querySelector('.modal3 .fav_empty')
    modal_1.classList.add('hide')
    modal_2.classList.add('hide')
    modal_3.classList.add('hide')
    modal_1n.classList.add('hide')
    modal_2n.classList.add('hide')
    modal_3n.classList.add('hide')
    const main_fav=document.querySelector('.favwtitle')
    main_fav.classList.add('hide')
    return
}

star.addEventListener('click', () => {
    favorites(current_city)
    display_mem()
})
function favorites(city) {
   // console.log(city)
    memory_cities=[]
    let logger=[]
    for( var i = 1; i<4; i++) {
        memory_cities.push(localStorage.getItem(`city${i}`))
    }
    if (memory_check(memory_cities, city) == 1 || memory_check(memory_cities, city) == 3 || memory_check(memory_cities, city) == 2) {
        localStorage.removeItem(`city${memory_check(memory_cities, city)}`);
        star.classList.remove('fa-star')
        star.classList.add('fa-star-o')
      //  console.log('deleted')
        logger=[]
    
                for( var i = 1; i<4; i++) {
                    logger.push(localStorage.getItem(`city${i}`))
                }
               // console.log(logger)
    } else if (memory_check(memory_cities, city) == 0) {
        for (var i=0; i<3; i++) {
            if (memory_cities[i]==null) {
             //   console.log('null found')
                localStorage.setItem(`city${i+1}`, city)
                logger=[]
                for( var i = 1; i<4; i++) {
                    logger.push(localStorage.getItem(`city${i}`))
                }
            //    console.log(logger)
                star.classList.remove('fa-star-o')
                star.classList.add('fa-star')
                return
            }
        }
        localStorage.setItem('city3', city)
        star.classList.remove('fa-star-o')
        star.classList.add('fa-star')
      //  console.log('placed at the end, no null found')
    }
}

function display_mem() {
    let logger=[]
    
    for( var i = 1; i<4; i++) {
        logger.push(localStorage.getItem(`city${i}`))
    }
     console.log('display MEMORY: ',logger)
}

function memory_check(arr, city) {
    for (var i = 0; i<3; i++) {
        if (arr[i]==city) {
          //  console.log('memory_check result: ', i+1)
            return i+1
        }
    } 
  //  console.log('memory_check result: ', 0)
    return 0
}


favorites_btn.addEventListener('click', () => {
    fav_btn_clicked()
})


function fav_btn_clicked() {
    logo.classList.add('hide')
    weather_box.classList.add('hide')
    star.classList.remove('fa-star-o')
    star.classList.remove('fa-star')
    input_form.classList.add('hide')
    back_btn.classList.remove('hide')
    title_app.classList.add('hide')
    main_window.style.width=1890+'px'
    favorites_btn.classList.add('hide')
    // const modal_1=document.querySelector('.modal1 .weather_fav')
    // const modal_2=document.querySelector('.modal2 .weather_fav')
    // const modal_3=document.querySelector('.modal3 .weather_fav')
    // const modal_1n=document.querySelector('.modal1 .fav_empty')
    // const modal_2n=document.querySelector('.modal2 .fav_empty')
    // const modal_3n=document.querySelector('.modal3 .fav_empty')
    // modal_1.classList.remove('hide')
    // modal_2.classList.remove('hide')
    // modal_3.classList.remove('hide')
    // modal_1n.classList.remove('hide')
    // modal_2n.classList.remove('hide')
    // modal_3n.classList.remove('hide')
    const main_fav=document.querySelector('.favwtitle')
    main_fav.classList.remove('hide')
    memory_cities=[]
    for( var i = 1; i<4; i++) {
        memory_cities.push(localStorage.getItem(`city${i}`))
    }
    const one = document.querySelector('.modal1')
    const two = document.querySelector('.modal2')
    const three = document.querySelector('.modal3')
    let null_arr=[]
    let no_nulls=[]
   // console.log(memory_cities)
   
    for(var i=0; i<3; i++) {
        if (memory_cities[i]==null) {
            null_arr.push(i)
        } else {
            no_nulls.push(memory_cities[i])
        }
    }
    // console.log('no nulls: ', no_nulls)
    if (null_arr.length==3) {
        hide_all_fav()
        display_empty(two)
    } else if (null_arr.length==2) {
        hide_all_fav()
        display_data(one, no_nulls[0])
        display_empty(two)
    } else if (null_arr.length==1) {
        hide_all_fav()
        display_data(one, no_nulls[0])
        display_data(two, no_nulls[1])
        display_empty(three)
    } else if (null_arr.length==0) {
        hide_all_fav()
        display_data(one, no_nulls[0])
        display_data(two, no_nulls[1])
        display_data(three, no_nulls[2])
    } else {
        console.log('something is wrong')
    }
}
function hide_all_fav() {
    const modal_1=document.querySelector('.modal1 .weather_fav')
    const modal_2=document.querySelector('.modal2 .weather_fav')
    const modal_3=document.querySelector('.modal3 .weather_fav')
    const modal_1n=document.querySelector('.modal1 .fav_empty')
    const modal_2n=document.querySelector('.modal2 .fav_empty')
    const modal_3n=document.querySelector('.modal3 .fav_empty')
    modal_1.classList.add('hide')
    modal_2.classList.add('hide')
    modal_3.classList.add('hide')
    modal_1n.classList.add('hide')
    modal_2n.classList.add('hide')
    modal_3n.classList.add('hide')
}



function display_empty(modal) {
    const empty_child=modal.lastElementChild
    empty_child.classList.remove('hide')
    empty_child.addEventListener('click', () => {
        go_back()
    })
}

async function display_data(modal, city_name) {
    let weather_window=modal.firstElementChild  
    //console.dir(weather_window)
    weather_window.classList.remove('hide')
    let children_arr=weather_window.childNodes
   // console.log(children_arr)
    
    let city_arr=city_name.split('')
    city_arr[0]=city_arr[0].toUpperCase()
    new_city= city_arr.join('')

    let city_display=children_arr[1]
    city_display.innerText=new_city
    let weather_img=children_arr[3]
    let temp_fav=children_arr[5].firstElementChild
    let temp_apparent_fav=children_arr[7].firstElementChild
        let min_max = children_arr[9]
    let min_fav = min_max.firstElementChild
    let max_fav = min_max.lastElementChild
    let hourly_fav = children_arr[11].childNodes[3].childNodes[1]

    let other_fav=children_arr[13].childNodes[1].firstElementChild
  //  console.dir(weather_window.childNodes)

   let trash_bucket=children_arr[15]



    let data = await favorite_fetch(city_name)

    //const png = document.querySelector('.weather_png')
   
    const WMO_data =data.daily.weather_code[0]
    const is_day = data.hourly.is_day[0]
    let image_path = ''
    if (is_day==0) {
        image_path = WMO[WMO_data].night.image
    } else if (is_day==1) {
        image_path = WMO[WMO_data].day.image
    } else {
        console.log('idiotx2')
    }
    weather_img.src=image_path

    temp_fav.innerText= data.current.temperature_2m

    temp_apparent_fav.innerText=data.current.apparent_temperature
 

    min_fav.innerText=data.daily.temperature_2m_min[0]
    max_fav.innerText=data.daily.temperature_2m_max[0]
    //let hourly_box = document.querySelector('.hourly_box')
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

    hourly_fav.innerHTML=''
    for(var i=0; i<24; i++) {
        hourly_fav.innerHTML= hourly_fav.innerHTML + `
        <div class="hourly_item">
            <p class="info">${hourly_time[i]}</p>
            <p class="info">${hourly_temp[i]}<span class="comm">°C</span></p>
            <p class="info">${hourly_hum[i]}<span class="comm">% hum</span></p>
        </div>
        `
    }
    other_fav.innerText=data.current.rain
//     trash_bucket.addEventListener('click', () => {
//         console.log('trash bucket clicked')
//         console.log('closest modal:')
//         console.dir(trash_bucket.closest('.win'))
//         memory_cities=[]
//         for( var i = 1; i<4; i++) {
//             memory_cities.push(localStorage.getItem(`city${i}`))
//         }
//         let null_arr=[]
//         let no_nulls=[]
   
//         for(var i=0; i<3; i++) {
//             if (memory_cities[i]==null) {
//                 null_arr.push(i)
//             } else {
//                 no_nulls.push(memory_cities[i])
//             }
//         }
//        // parent=trash_bucket.closest('.weather_fav')
//        // parent.classList.add('hide')
//         console.log('before deleting: ', memory_cities)
        
//         for(var i=0; i<3; i++) {
//             console.log(memory_cities[i]==city_name)
//             if (memory_cities[i]==city_name) {
//                 localStorage.removeItem(`city${i+1}`)
//                 break
//             }
//         }
//         memory_cities=[]
//         for( var i = 1; i<4; i++) {
//             memory_cities.push(localStorage.getItem(`city${i}`))
//         }
//         console.log('after deleting: ', memory_cities)

//         return fav_btn_clicked()
//    })
    
}

async function favorite_fetch(city_name) {
    const geo_data = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city_name}&limit=1&appid=${API_KEY}`)
    const geo_json = await geo_data.json()
    if (geo_json[0]) {
    const lat = geo_json[0].lat;
    const lon = geo_json[0].lon;
    

    const data_lat_lon = await fetch(`
        https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weather_code,daylight_duration,rain_sum&hourly=temperature_2m,is_day,apparent_temperature,relative_humidity_2m,rain,weather_code&current=temperature_2m,apparent_temperature,rain&timezone=auto
        `)
    const data_json = await data_lat_lon.json()
    // console.log(data_json)
        return data_json
    } else {
        console.log("You didn't enter city's name right")
    }
}

let trash_bucket1=document.querySelector('.modal1 .weather_fav .fa-trash')

trash_bucket1.addEventListener('click', () => {
        console.log('trash bucket clicked')
        console.log('closest modal:')
        console.dir(trash_bucket1.closest('.win'))
        memory_cities=[]
        for( var i = 1; i<4; i++) {
            memory_cities.push(localStorage.getItem(`city${i}`))
        }
        let null_arr=[]
        let no_nulls=[]
   
        for(var i=0; i<3; i++) {
            if (memory_cities[i]==null) {
                null_arr.push(i)
            } else {
                no_nulls.push(memory_cities[i])
            }
        }
       // parent=trash_bucket.closest('.weather_fav')
       // parent.classList.add('hide')
        console.log('before deleting: ', memory_cities)
        let parent_b=trash_bucket1.closest('.weather_fav')
        console.dir(parent_b)
        let son=parent_b.childNodes[1].textContent.toLowerCase()
        console.dir(son)
        for(var i=0; i<3; i++) {
            console.log(memory_cities[i], son)
            if (memory_cities[i]==son) {
                localStorage.removeItem(`city${i+1}`)
                break
            }
        }
        memory_cities=[]
        for( var i = 1; i<4; i++) {
            memory_cities.push(localStorage.getItem(`city${i}`))
        }
        console.log('after deleting: ', memory_cities)

        return fav_btn_clicked()
   })
   
let trash_bucket2=document.querySelector('.modal2 .weather_fav .fa-trash')

trash_bucket2.addEventListener('click', () => {
        console.log('trash bucket clicked')
        console.log('closest modal:')
        console.dir(trash_bucket1.closest('.win'))
        memory_cities=[]
        for( var i = 1; i<4; i++) {
            memory_cities.push(localStorage.getItem(`city${i}`))
        }
        let null_arr=[]
        let no_nulls=[]
   
        for(var i=0; i<3; i++) {
            if (memory_cities[i]==null) {
                null_arr.push(i)
            } else {
                no_nulls.push(memory_cities[i])
            }
        }
       // parent=trash_bucket.closest('.weather_fav')
       // parent.classList.add('hide')
        console.log('before deleting: ', memory_cities)
        let parent_b=trash_bucket1.closest('.weather_fav')
        console.dir(parent_b)
        let son=parent_b.childNodes[1].textContent.toLowerCase()
        for(var i=0; i<3; i++) {
            console.log(memory_cities[i], son)
            if (memory_cities[i]==son) {
                localStorage.removeItem(`city${i+1}`)
                break
            }
        }
        memory_cities=[]
        for( var i = 1; i<4; i++) {
            memory_cities.push(localStorage.getItem(`city${i}`))
        }
        console.log('after deleting: ', memory_cities)

        return fav_btn_clicked()
   })
   
   let trash_bucket3=document.querySelector('.modal3 .weather_fav .fa-trash')

trash_bucket3.addEventListener('click', () => {
        console.log('trash bucket clicked')
        console.log('closest modal:')
        console.dir(trash_bucket1.closest('.win'))
        memory_cities=[]
        for( var i = 1; i<4; i++) {
            memory_cities.push(localStorage.getItem(`city${i}`))
        }
        let null_arr=[]
        let no_nulls=[]
   
        for(var i=0; i<3; i++) {
            if (memory_cities[i]==null) {
                null_arr.push(i)
            } else {
                no_nulls.push(memory_cities[i])
            }
        }
       // parent=trash_bucket.closest('.weather_fav')
       // parent.classList.add('hide')
        console.log('before deleting: ', memory_cities)
        let parent_b=trash_bucket1.closest('.weather_fav')
        console.dir(parent_b)
        let son=parent_b.childNodes[1].textContent.toLowerCase()
        for(var i=0; i<3; i++) {
            console.log(memory_cities[i], son)
            if (memory_cities[i]==son) {
                localStorage.removeItem(`city${i+1}`)
                break
            }
        }
        memory_cities=[]
        for( var i = 1; i<4; i++) {
            memory_cities.push(localStorage.getItem(`city${i}`))
        }
        console.log('after deleting: ', memory_cities)

        return fav_btn_clicked()
   })
   