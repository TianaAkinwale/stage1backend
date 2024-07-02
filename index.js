const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

const apiKey = 'c2c445348d2346ae94d143419240107';

app.get('/api/hello', async (req, res) => {
    const visitorName = req.query.visitor_name;
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    try {
        const weatherApiUrl = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${clientIp}`;
        const weatherResponse = await axios.get(weatherApiUrl);

        if (!weatherResponse.data || !weatherResponse.data.location || !weatherResponse.data.current) {
            throw new Error("Could not retrieve location or weather information");
        }

        const { name: city } = weatherResponse.data.location;
        const { temp_c: temp } = weatherResponse.data.current;

        res.json({
            client_ip: clientIp,
            location: city,
            greeting: `Hello, ${visitorName}!, the temperature is ${temp} degrees Celsius in ${city}`
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
