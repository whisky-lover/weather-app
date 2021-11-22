const asyncRequest = require('async-request');

const getWeather = async(location) => {
    const accessKey = "0c9a743d84d688ea8ef8196220d865b8"
    const URL = `http://api.weatherstack.com/current?access_key=${accessKey}&query=${location}`;


    try {
        const res = await asyncRequest(URL);
        const data = JSON.parse(res.body);

        const weather = {
            isSuccess: true,
            region: data.location.region,
            country: data.location.country,
            temperature: data.current.temperature,
            wind_speed: data.current.wind_speed,
            precip: data.current.precip,
            cloudcover: data.current.cloudcover
        }

        // console.log(weather);
        return weather;
    } catch (error) {
        console.log(error);
        return { isSuccess: false, error: error }
    }



}


const express = require('express');
const app = express();
const path = require('path');
const pathPublic = path.join(__dirname, './public');
console.log(pathPublic);

app.use(express.static(pathPublic));

app.set("view engine", "hbs")

app.get('/', async(request, response) => {
    const params = request.query;
    const location = params.address;
    // console.log(params);
    if (location) {
        const weather = await getWeather(location);
        console.log(weather);
        response.render('weather', {
            status: true,
            region: weather.region,
            country: weather.country,
            temperature: weather.temperature,
            wind_speed: weather.wind_speed,
            precip: weather.precip,
            cloudcover: weather.cloudcover

        });
    } else {
        response.render('weather', {
            status: false
        })
    }

})

const PORT = process.env.PORT || 4200;

app.listen(PORT, () => {
    console.log(`Server start at ${PORT}`);
});