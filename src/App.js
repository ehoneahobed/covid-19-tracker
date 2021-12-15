import React from 'react';
import './App.css';
import { Select, MenuItem, FormControl, Card, CardContent } from '@material-ui/core';
import { useState, useEffect } from 'react';
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import {sortData, prettyPrintStat } from './util';
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({lat: 25.505, lng: 30.9});
  const [mapZoom, setMapZoom] = useState(1.5);
  const [mapCountries, setMapCountries] = useState([]);
  
  //https://disease.sh​/v3​/covid-19​/countries
  //https://disease.sh/v3/covid-19/countries

  // useEffect (a react hook that runs a piece of code based on a condition)

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response => response.json())
    .then(data => {
      setCountryInfo(data);
    });
  }, []);

  useEffect(()=>{
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
         const countries = data.map((country)=>({
           name: country.country,
           value: country.countryInfo.iso2,
         }
         ));

        const sortedData = sortData(data);
        setTableData(sortedData);
        setCountries(countries);
        setMapCountries(data);

        })
      
    };

    getCountriesData();

  }, []);


  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    //console.log(countryCode);
    

    // make a call to the url for a specific country
    const url = 
      countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all' : 
      `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    
      //console.log(url);

      await fetch(url)
      .then((response) => response.json())
      .then(data => {
        setCountryInfo(data);
        setCountry(countryCode);
        

        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);

        //console.log({mapCenter});
      });
  };

  

  //console.log(countryInfo);

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app__dropdown">
            <Select 
              variant="outlined" 
              onChange={onCountryChange} 
              value={country}       
            >
              {/*Loop through all the countries and drop down the options */}
              <MenuItem value="worldwide">Worldwide</MenuItem>
            {
              countries.map(country => <MenuItem value={country.value}>{country.name}</MenuItem>)
            }
            
            </Select>
          </FormControl>
        </div>

      {/* {Header} */}
      {/* {title + select input dropdown field} */}

        <div className="app__stats">         
          {/* {infobox} */}
          <InfoBox 
            title="Active Cases" 
            cases={prettyPrintStat(countryInfo.todayCases)} 
            total={prettyPrintStat(countryInfo.cases)}
          />
        
          {/* {infobox} */}
          <InfoBox 
            title="Recovered" 
            cases={prettyPrintStat(countryInfo.todayRecovered)} 
            total={prettyPrintStat(countryInfo.recovered)} 
            />

          {/* {infobox} */}
          <InfoBox 
            title="Deaths" 
            cases={prettyPrintStat(countryInfo.todayDeaths)} 
            total={prettyPrintStat(countryInfo.deaths)}
            />
        </div>

      <br />
      {/* {Map} */}
      <Map 
        countries= {mapCountries}
        center= {mapCenter} 
        zoom= {mapZoom} 
      />
        
  
      </div>

      <Card className="app__right">
          <CardContent>
            <h3>Live Cases by Country</h3>

            {/* {table} */}
            <Table countries={tableData} />
            <br />
            <h3>Worldwide New Cases</h3>
            <LineGraph />
            {/* {graph} */}
          </CardContent>
      </Card>
    </div>
  );
}

export default App;

