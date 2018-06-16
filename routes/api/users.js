var express = require('express');
var router = express.Router();

// @route GET api/users/test
// @desc Tests users route
// @access Public
router.get('/test', (req, res) => res.json({msg: "Users works"}));

module.exports = router;