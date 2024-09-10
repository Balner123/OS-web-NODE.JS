const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const postsFilePath = path.join(__dirname, 'prispevky.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


const getNextId = (posts) => {
    if (posts.length === 0) {
        return 1;}
    let maxId = 0;

    for (const post of posts) {
        if (post.id > maxId) {
            maxId = post.id;
        }}
    return maxId + 1;
};

app.get('/posts', (req, res) => {
    fs.readFile(postsFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading posts');
        }
        res.json(JSON.parse(data));
    });
});

app.post('/posts', (req, res) => {
    fs.readFile(postsFilePath, 'utf8', (err, data) => {
        let posts = [];
        if (!err && data) {
            posts = JSON.parse(data);
        }

        const newPost = {
            id: getNextId(posts),
            time: new Date().toISOString(),
            text: req.body.text
        };

        posts.push(newPost);

        fs.writeFile(postsFilePath, JSON.stringify(posts, null, 2), 'utf8', (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error saving post');
            }
            res.status(201).send('Post saved');
        });
    });
});

app.delete('/posts/:id', (req, res) => {
    const postId = parseInt(req.params.id, 10);

    fs.readFile(postsFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading posts');
        }

        let posts = JSON.parse(data);
        posts = posts.filter(post => post.id !== postId);

        fs.writeFile(postsFilePath, JSON.stringify(posts, null, 2), 'utf8', (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error deleting post');
            }
            res.status(200).send('Post deleted');
        });
    });
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
