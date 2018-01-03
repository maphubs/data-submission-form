// @flow
import React from 'react'

// Want to use mapbox-gl packaged with react-map-gl
// eslint-disable-next-line import/no-extraneous-dependencies
import styles from 'mapbox-gl/dist/mapbox-gl.css'
import scaleStyles from 'mapbox-gl-dual-scale-control/dist/mapbox-gl-dual-scale-control.css'

let mapboxgl = {}
let ScalePositionControl
if (typeof window !== 'undefined') {
  // eslint-disable-next-line
  mapboxgl = require(`mapbox-gl`)
  // eslint-disable-next-line
  ScalePositionControl = require('mapbox-gl-dual-scale-control')
}

type Props = {
  id: string,
  style?: Object,
  mapStyle: Object,
  interactive: boolean,
  dragRotate: boolean,
  touchZoomRotate: boolean,
  hash: boolean,
  attributionControl: boolean,
  showScale: boolean,
  fullScreen: boolean,
  latitude: number,
  longitude: number,
  zoom: number,
  onClick?: Function,
  children?: any
}

type State = {

}

export default class Map extends React.Component<Props, State> {
  static defaultProps = {
    id: 'map',
    interactive: true,
    dragRotate: false,
    touchZoomRotate: false,
    hash: false,
    attributionControl: true,
    showScale: false,
    fullScreen: false,
    latitude: 0,
    longitude: 0,
    zoom: 0
  }

  componentDidMount () {
    this.createMap()
  }

  getMap = () => this.map

  map: Object

  createMap = () => {
    const {
      id, mapStyle, // required
      interactive, dragRotate, touchZoomRotate, hash, // config flags
      attributionControl, showScale, fullScreen, // UI control flags
      latitude, longitude, zoom // initial position
    } = this.props

    const map = new mapboxgl.Map({
      container: id,
      style: mapStyle,
      interactive,
      dragRotate,
      touchZoomRotate,
      hash,
      attributionControl: false,
      zoom,
      center: [longitude, latitude]
    })
    this.map = map

    if (interactive) {
      map.addControl(new mapboxgl.NavigationControl(), 'top-right')
    }

    if (fullScreen) {
      map.addControl(new mapboxgl.FullscreenControl())
    }

    if (attributionControl) {
      map.addControl(new mapboxgl.AttributionControl(), 'bottom-right')
    }

    if (showScale) {
      map.addControl(new ScalePositionControl({
        maxWidth: 175
      }), 'bottom-left')
    }

    map.on('click', (e: any) => {
      if (this.props.onClick) {
        console.log(e)
        this.props.onClick([e.lngLat.lng, e.lngLat.lat])
      }
    })
  }

  render () {
    const { id, style, children } = this.props
    return (
      <div style={style}>
        <style jsx global>{styles}</style>
        <style jsx global>{scaleStyles}</style>
        <style jsx global>{`
          .maphubs-ctrl-scale {
            left: 5px;
          }
        
          .map-position {
            left: 0;
          }
        
          .metric-scale {
            left: 0;
          }
        
          .imperial-scale {
            left: 0;
          }
        `}
        </style>
        <style jsx global>{`
          .mapboxgl-canvas {
            left: 0;
          }
        `}
        </style>
        <div id={id} style={{ width: '100%', height: '100%' }}>
          {children}
        </div>
      </div>
    )
  }
}
