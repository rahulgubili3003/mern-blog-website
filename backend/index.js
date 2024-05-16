import express from 'express';
import {MONGODB_URI, PORT} from './config.js'
import {blog} from './model/blogModel.js'
import mongoose from "mongoose";

const app = express();

// Express Middleware
app.use(express.json())

app.get('/ping', (req, res) => {
    res.status(200).json({
        message: 'Hello World'
    });
});

app.post("/postBlog", async (req, res) => {
    try {
        const title = req.body.title
        const content = req.body.content
        const author = req.body.author
        console.log("Posting BLog")
        if (
            !title || !content || !author
        ) {
            return res.status(400).json({
                message: "Please send all the required parameters in the body"
            })
        }
        const newBlog = {
            title: title,
            content: content,
            author: author
        }
        const postedBlog = await blog.create(newBlog)
        return res.status(201).json({
            message: "Blog created successfully",
            blog: postedBlog
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: "Error creating blog"
        })
    }
});


mongoose
    .connect(MONGODB_URI)
    .then(() => {
        console.log('App connected to database');
        app.listen(PORT, () => {
            console.log(`App is listening to port: ${PORT}`);
        });
    })
    .catch((error) => {
        console.log(error);
    });