const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware pro práci s JSON a URL encoded daty
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Statické soubory z "public" složky
app.use(express.static(path.join(__dirname, 'public')));

// Route to get posts
app.get('/posts', (req, res) => {
    fs.readFile(path.join(__dirname, 'prispevky.json'), 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading posts');
        }
        res.json(JSON.parse(data));
    });
});

// Route to add a post
app.post('/posts', (req, res) => {
    const newPost = {
        time: new Date().toISOString(), // Current timestamp
        text: req.body.text
    };

    fs.readFile(path.join(__dirname, 'prispevky.json'), 'utf8', (err, data) => {
        let posts = [];
        if (!err && data) {
            posts = JSON.parse(data);
        }
        posts.push(newPost);

        fs.writeFile(path.join(__dirname, 'prispevky.json'), JSON.stringify(posts, null, 2), 'utf8', (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error saving post');
            }
            res.status(201).send('Post saved');
        });
    });
});

// Route to serve the about page at /about
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

// Nasloucháme na portu 3000
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
