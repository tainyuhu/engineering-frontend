// src/api/weatherService.js
import axios from "axios";

const API_KEY = "CWA-27F5B6B5-25A7-4B9F-A0E1-266B99D2D6CD";
const BASE_URL = "https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-D0047-029";

export const fetchWeatherData = () => {
  return axios.get(BASE_URL, {
    params: {
      Authorization: API_KEY,
      locationName: "義竹鄉",
      elementName: "Wx",
      format: "JSON",
    },
  });
};
