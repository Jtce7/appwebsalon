const { Router } = require('express');
const router = Router();

router.get('/', async (req, res) => {
    try {
        // Use dynamic import() to import 'node-fetch'
        const fetch = await import('node-fetch');

        // Make an HTTP GET request to the external API
        const response = await fetch.default('https://jsonplaceholder.typicode.com/users');

        // Check if the response status code is OK (200)
        if (response.status === 200) {
            // Parse the JSON response data
            const users = await response.json();

            // Send the JSON data as the response
            res.json(users);
        } else {
            // Handle other response status codes (e.g., error handling)
            res.status(response.status).send('Error fetching data');
        }
    } catch (error) {
        // Handle any errors that occur during the fetch
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
