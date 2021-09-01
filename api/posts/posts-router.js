// implement your posts router here
const express = require("express");
const Post = require("./posts-model");

const router = express.Router();

// #1 GET API Posts
router.get("/", (req, res) => {
  Post.find()
    .then((found) => {
      res.json(found);
    })
    .catch((err) => {
      res.status(500).json({
        message: "The posts information could not be retrieved",
        err: err.message,
        stack: err.stack,
      });
    });
});

// #2 GET API Posts ID
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(404).json({
        message: "The post with the specified ID does not exist",
      });
    } else {
      res.json(post);
    }
  } catch (err) {
    res.status(500).json({
      message: "The post information could not be retrieved",
      err: err.message,
      stack: err.stack,
    });
  }
});

// #3 POST API Posts
router.post("/", (req, res) => {
  const { title, contents } = req.body;
  if (!title || !contents) {
    res.status(400).json({
      message: "Please provide title and contents for the post",
    });
  } else {
    Post.insert({ title, contents })
      .then(({ id }) => {
        return Post.findById(id);
      })
      .then((post) => {
        res.status(201).json(post);
      })
      .catch((err) => {
        res.status(500).json({
          message: "There was an error while saving the post to the database",
          err: err.message,
          stack: err.stack,
        });
      });
  }
});

// #4 PUT API Posts
router.put("/:id", (req, res) => {
  const { title, contents } = req.body;
  if (!title || !contents) {
    res.status(400).json({
      message: "Please provide title and contents for the post",
    });
  } else {
    Post.findById(req.params.id)
      .then((stuff) => {
        if (!stuff) {
          res.status(404).json({
            message: "The post with the specified ID does not exist",
          });
        } else {
          return Post.update(req.params.id, req.body);
        }
      })
      .then((data) => {
        if (data) {
          return Post.findById(req.params.id);
        }
      })
      .then((post) => {
        res.json(post);
      })
      .catch((err) => {
        res.status(500).json({
          message: "The posts information could not be modified",
          err: err.message,
          stack: err.stack,
        });
      });
  }
});

// #5 DELETE API Posts
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(404).json({
        message: "The post with the specified ID does not exist",
      });
    } else {
      await Post.remove(req.params.id);
      res.json(post);
    }
  } catch (err) {
    res.status(500).json({
      message: "The post could not be removed",
      err: err.message,
      stack: err.stack,
    });
  }
});

// #6 GET API Posts Comments
router.get("/:id/comments", async (req, res) => {
  try {
    const data = await Post.findById(req.params.id);
    !data
      ? res.status(404).json({
          message: "The post with the specified ID does not exist",
        })
      : Post.findPostComments(req.params.id).then((data) => {
          res.status(200).json(data);
        });
  } catch {
    res.status(400);
  }
});

// CATCH ALL
router.use("*", (req, res) => {
  res.status(404).json({
    message: "Things happened here",
  });
});

module.exports = router;
