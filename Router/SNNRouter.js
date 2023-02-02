const router = require("express").Router();
const { PostData, PublishData, SendNotification, Subscribe } = require('../Controller/SNNController');

router.get('/', PostData);
router.get('/publish', PublishData);
router.get('/notification', SendNotification);
router.post('/subscribe', Subscribe);


module.exports = router;