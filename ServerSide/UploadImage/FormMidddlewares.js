

const FieldLengthCheck = (req, res, next) => { //middleware to check the length of the fields
        
    if(req.body.title.length > parseInt(process.env.TitleLength)) //checking if the title is too long
        return res.send("Title is too long");
    if(req.body.post.length > parseInt(process.env.DescriptionLength)) //checking if the post is too long
        return res.send("Post is too long");
    if(req.body.title.length == 0) //checking if the title is too short
        return res.send("Title is too short");
    if(req.body.post.length == 0) //checking if the post is too short
        return res.send("Post is too short");
        
    next();
}

module.exports = {FieldLengthCheck}