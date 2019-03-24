const express = require('express');
const app = express();
let bodyParser = require('body-parser')
const uuid = require('uuid')

const jsonParser = bodyParser.json()

const blogPosts = [{
    id: uuid.v4(),
    title: "First Blog's Post",
    content: "Hello, this is the first post of my blog",
    author: "JoseAndresSalazar",
    publishDate: "2014-10-13"
},
{
    id: uuid.v4(),
    title: "Second Blog's Post",
    content: "Hello, this is the second post of my blog",
    author: "JoseAndresSalazar",
    publishDate: "2019-03-24"
},
{
    id: uuid.v4(),
    title: "Third Blog's Post",
    content: "Hello, this is the third post of my blog",
    author: "JoseAndres",
    publishDate: "2018-03-14"
}]

//GET all blog's posts
app.get('/blog-posts', (req, res) => {
    res.status(200).json({
        message: "Successfully sent the list of sports",
        status: 200,
        posts: blogPosts
    })
});

//GET all blog's posts from certain author
app.get('/blog-posts/:author', (req, res) => {
    let blogAuthor = req.params.author;
    var authorPosts = []
    if (!blogAuthor) {
        res.status(406).json({
            message: "Missing author in the parameters",
            statur: 406
        })
    } else {
        blogPosts.forEach(item => {
            if (item.author == blogAuthor) {
                authorPosts.push(item)
            }
        })

        if (authorPosts.length == 0) {
            res.status(406).json({
                message: "Author not found in the list",
                status: 406
            })
        } else {
            res.status(200).json({
                message: "Successfully sent the blog author",
                status: 200,
                blogPost: authorPosts
            })
        }
    }
});

//POST blog post
app.post('/blog-posts', jsonParser, (req, res) => {

    let requireFields = ['title', 'content', 'author', 'publishDate']
    for (let i = 0; i < requireFields.length; i++) {
        let currentField = requireFields[i]

        if (!(currentField in req.body)) {
            res.status(406).json({
                message: `Missing field ${currentField} in body.`,
                status: 406
            })
        }
    }

    let objectToAdd = {
        id: uuid.v4(),
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        publishDate: req.body.publishDate
    }

    blogPosts.push(objectToAdd);

    res.status(201).json({
        message: "Successfully added the post",
        status: 201,
        sport: objectToAdd
    })
});

//DELETE post
app.delete('/blog-posts/:id', jsonParser, (req, res) => {
    let blogId = req.body.id;
    let blogParamsId = req.params;
    console.log(blogParamsId)

    if(blogId != blogParamsId || !blogId || !blogParamsId){
        res.status(406).json({
            message: "Missing ID field in parameters, body or they didn't match.",
            status: 406
        });
        return
    }

    blogPosts.forEach(item => {
        if(blogParamsId == item.id){
            blogPosts.splice(item, 1);
            res.status(200).json({
                message: "Successfully deleted post",
                status: 200
            })
            return
        }
    })

    res.status(404).json({
        message: "Blog post not found",
        status: 404
    })
});

//UPDATE post
app.put('/blog-posts/:id', jsonParser, (req, res) => {
    var blogId = req.params.id

    if(!blogId){
        res.status(406).json({
            message: "Missing id field in params",
            status: 406
        })
    }

    var objectToUpdate
    objectToUpdate = blogPosts.find(item => {
        return item.id == blogId
    })

    if (objectToUpdate) {        
        if (Object.keys(req.body).length > 0) {
            var foundIndex = blogPosts.findIndex(item => item.id == objectToUpdate.id)
            if (req.body.title) {
                blogPosts[foundIndex].title = req.body.title
            }
            if (req.body.content) {
                blogPosts[foundIndex].content = req.body.content
            }
            if (req.body.author) {
                blogPosts[foundIndex].author = req.body.author
            }
            if (req.body.publishDate) {
                blogPosts[foundIndex].publishDate = req.body.publishDate
            }

            res.status(200).json({
                message: "Successfully updated post",
                status: 200,
                post: blogPosts[foundIndex]
            })
            
        } else {
            res.status(404).json({
                message: 'No data in body.',
                status: 404
            })
        }
    } else {
        res.status(404).json({
            message: 'No ID found',
            status: 404
        })
    }
})

app.listen(8080, () => {
    console.log("App listening on port 8080.")
});