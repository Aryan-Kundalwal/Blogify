const {Router} = require("express")
const Blog = require("../models/blog")
const Comment = require("../models/comment")
const { connectTOMongoDB } = require("../connect");
const upload = require("../middlewares/upload");

const router = Router()


router.get('/add-new' ,(req,res) =>{
    return res.render('addBlog',{
        user : req.user,
    })
})

router.get('/:id' , async (req , res) =>{
      await connectTOMongoDB();
    const blog = await Blog.findById(req.params.id).populate('createdBy');
    const comments = await Comment.find({blogId : req.params.id}).populate("createdBy")
    return res.render('blog',{
        user:req.user,
        blog,
        comments,
    })
})

 //For Comment...
  router.post("/comment/:blogId" , async (req ,res) => {
      await connectTOMongoDB();
    await Comment.create({
     content : req.body.content,
     blogId : req.params.blogId,
     createdBy : req.user._id,
    })
    return res.redirect(`/blog/${req.params.blogId}`)
  })

router.post('/' ,upload.single("coverImage"),async (req,res) =>{
      await connectTOMongoDB();
    const {title ,body} = req.body
   const blog = await Blog.create({
   body , 
   title,
   createdBy :req.user._id,
   coverImageURL: req.file.path
   })
    return res.redirect(`/blog/${blog._id}`)
})


module.exports = router;