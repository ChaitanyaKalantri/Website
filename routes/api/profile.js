var express = require('express');
var router = express.Router();

// @route GET api/profile/test
// @desc Tests profile route
// @access Public

router.get('/test', (req, res) => res.json({msg: "Profile works"}));

module.exports = router;