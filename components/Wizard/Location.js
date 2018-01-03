//  @flow
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
// import ReactMapGL, { NavigationControl } from 'react-map-gl'
import { Row, Icon, Button } from 'antd'
import { geolocated } from 'react-geolocated'
import turfbbox from '@turf/bbox'

import style from './Map/osm-liberty-tz.json'
import LocationSearch from './Map/LocationSearch'
import Map from './Map/Map'

let mapboxgl = {}
if (typeof window !== 'undefined') {
  // eslint-disable-next-line
  mapboxgl = require(`mapbox-gl`)
}

type Props = {
  isGeolocationAvailable: boolean,
  isGeolocationEnabled: boolean,
  coords: {latitude: number, longitude: number},
  onSelected: Function
}

type Viewport = {
  latitude: number,
  longitude: number,
  zoom: number
}

type State = {
  viewport: Viewport,
  userLocationUsed: boolean,
  selectedCoords?: Array<number>
}

class Location extends Component<Props, State> {
  constructor (props: Props) {
    super(props)
    this.state = {
      viewport: {
        latitude: 39.83,
        longitude: -73.70,
        zoom: 3
      },
      userLocationUsed: false
    }
  }

  componentWillReceiveProps (nextProps: Props) {
    if (nextProps.isGeolocationAvailable &&
      nextProps.isGeolocationEnabled &&
      !this.state.userLocationUsed &&
      nextProps.coords
    ) {
      const { coords } = nextProps
      this.map.getMap().flyTo({ center: [coords.longitude, coords.latitude], zoom: 15 })
      this.setState({ userLocationUsed: true })
    }
  }

  onSelect = () => {
    this.props.onSelected(this.state.selectedCoords)
  }

  onMapClick = (coords) => {
    if (this.markerEl) {
      ReactDOM.unmountComponentAtNode(this.markerEl)
      this.marker.remove()
    }

    const markerWidth = 50
    const markerHeight = 50
    const el = document.createElement('div')
    el.className = `maphubs-marker`
    el.style.width = `${markerWidth}px`
    el.style.height = `${markerHeight}px`

    ReactDOM.render(
      <Icon type="environment" style={{ color: 'red', fontSize: `${markerHeight}px` }} />,
      el
    )

    // const offsetWidth = -markerWidth / 2
    // const offsetHeight = -markerHeight
    this.markerEl = el
    this.marker = new mapboxgl.Marker(el, { offset: [0, -(markerWidth / 2)] })
      .setLngLat(coords)
      .addTo(this.map.getMap())

    this.setState({ selectedCoords: coords })
  }

  onSearchClick = (result) => {
    const { feature } = result
    const map = this.map.getMap()
    /* eslint-disable no-underscore-dangle */
    if (feature.bbox) {
      map.fitBounds(feature.bbox, {
        padding: 25, curve: 3, speed: 0.6, maxZoom: 16
      })
    } else if (feature._geometry || feature.geometry) {
      const geometry = feature._geometry ? feature._geometry : feature.geometry
      if (geometry.type === 'Point') {
        map.flyTo({ center: geometry.coordinates })
      } else {
        const bbox = turfbbox(geometry)
        map.fitBounds(bbox, {
          padding: 25, curve: 3, speed: 0.6, maxZoom: 22
        })
      }
    }
  }

  map: any
  marker: any
  markerEl: any

  render () {
    const { viewport } = this.state
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <Row style={{ height: '100%' }}>
          <Map
            ref={(map) => { this.map = map }}
            style={{ width: '100%', height: '100%' }}
            {...viewport}
            mapStyle={style}
            onClick={this.onMapClick}
            showScale
            hash
          >
            <div style={{
              position: 'absolute', top: '20px', left: '5px', zIndex: 2
            }}
            >
              <LocationSearch onOptionClick={this.onSearchClick} />
            </div>
            <div style={{ position: 'absolute', width: '100%', zIndex: 2 }}>
              <div style={{
                textAlign: 'center', margin: 'auto', width: '300px', backgroundColor: 'rgba(255,255,255,0.85)'
              }}
              >
                <h2>Click the map to select a location</h2>
              </div>
            </div>
            <div style={{
              position: 'absolute', bottom: '35px', right: '5px', zIndex: 2
            }}
            >
              <div>
                <Button
                  type="primary"
                  size="large"
                  onClick={this.onSelect}
                  disabled={!this.state.selectedCoords}
                >
                  Next<Icon type="right" />
                </Button>
              </div>
            </div>
          </Map>
        </Row>
      </div>
    )
  }
}

export default geolocated({
  positionOptions: {
    enableHighAccuracy: true
  },
  userDecisionTimeout: 15000
})(Location)
