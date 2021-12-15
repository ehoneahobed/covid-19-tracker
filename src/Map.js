import React from 'react';
import "./Map.css";
import { MapContainer, TileLayer} from "react-leaflet";
import { showDataOnMap } from './util';

//'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png'
// https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
// https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png

function Map({countries, casesType, center, zoom}) {
    return (
        <div className="map">
            <MapContainer center={center} zoom={zoom}>
                <TileLayer url='https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png' 
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' 
                noWrap={true}   
                />
            
            {/* loop through countries and draw circles on the screen */}
            {showDataOnMap(countries, casesType)}
            </MapContainer> 
        </div>
    )
}

export default Map
