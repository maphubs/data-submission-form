// @flow
import React from 'react'

import 'mapbox-gl-dual-scale-control/dist/mapbox-gl-dual-scale-control.css'
import '../../../node_modules/mapbox-gl/dist/mapbox-gl.css'

let mapboxgl = {}
let ScalePositionControl
if (typeof window !== 'undefined') {
  // eslint-disable-next-line security/detect-non-literal-require
  mapboxgl = require('mapbox-gl')
  // eslint-disable-next-line security/detect-non-literal-require
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
        this.props.onClick([e.lngLat.lng, e.lngLat.lat])
      }
    })
  }

  render () {
    const { id, style, children } = this.props
    return (
      <div style={style}>
        <style jsx global>{`
          .mapboxgl-canvas {
            left: 0;
          }

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
        <div id={id} style={{ width: '100%', height: '100%' }}>
          {children}
        </div>
      </div>
    )
  }
}
