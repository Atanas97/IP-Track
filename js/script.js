const API_KEY = `at_wSrq3J94WLj2d48uZpuaHgg0h9OyL`
const searchInput = document.querySelector('.search-input')
const enterArrow = document.querySelector('.fa-chevron-right')
const form = document.getElementsByTagName('form')[0]
const modal = document.querySelector('.modal')
const formField = document.querySelector('.form-field')

const getIPData = async function () {
    const controller = new AbortController()
    const signal = controller.signal
    let searchInput = document.querySelector('.search-input').value.trim()
    addLoader()

    const getData = await fetch(`https://geo.ipify.org/api/v1?apiKey=${API_KEY}&ipAddress=${searchInput}`,{
      signal: signal
    })
    const data = await getData.json()
    

    
    const {lat:lat, lng:lng} = data.location

    renderData(data)
    updateMap([lat, lng])
}
  
  const dynamicJS = document.querySelector('.dynamic-js')
  function renderData(data) {
    
    console.log(data)
    const {ip, isp, location:{city, country, region, timezone}} = data
    
    let html = ''
    if(data) {

      try {
        
        html = `
        <div class="modal-row">
        <small>ip address</small>
        <h3>${ip}</h3>
      </div>
  
      <div class="modal-row">
        <small>location</small>
        <h3>${city} ,${region}</h3>
      </div>
  
      <div class="modal-row">
        <small>Timezone</small>
        <h3>UTC ${timezone}</h3>
      </div>
  
      <div class="modal-row">
        <small>ISP</small>
        <h3>${isp}</h3>
      </div>
        `
        removeLoader()
        dynamicJS.innerHTML = html
        searchInput.value = ''
    
      } catch (error) {
        console.log(error)
      }

    //modal.innerHTML = html
  }
}

form.addEventListener('submit', (e) => {
    e.preventDefault()
})

searchInput.addEventListener('keydown', (e) => {
    if(e.key === 'Enter') getIPData()
})
enterArrow.addEventListener('click', getIPData)


//Loader add and remove functions
const loader = document.querySelector('.loader')

function removeLoader () {
  loader.classList.remove("display");
}

function addLoader() {
  
  modal.classList.add('active')
  loader.classList.add('display')

}


const updateMap = ([lat, lng]) => {
  
  var container = L.DomUtil.get('map')
  if (container != null){
    container._leaflet_id=null
  }

  const customPin = L.icon({
    iconUrl: './images/icon-location.svg',
    iconSize: [50, 60]
  })

  //Display map
  var map = L.map('map').setView([lat, lng], 13);
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  L.marker([lat, lng], {icon: customPin}).addTo(map)
      .openPopup();
      map.invalidateSize([lat, lng]);   
}


