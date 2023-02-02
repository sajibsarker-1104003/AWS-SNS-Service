const AWS = require("aws-sdk");

const AWS_ACCESS_KEY_ID = process.env.ACCESS_KEY_ID
const AWS_SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY


AWS.config.update({
  region: "us-east-1",
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
});


const checkIfTopicExists = async (AWS, topicName) => {
  return new Promise((resolve, reject) => {
    try {
      const listTopics = new AWS.SNS()
        .listTopics({})
        .promise()
      listTopics
        .then(data => {
          if (data.Topics.includes(topicName)) {
            resolve(true)
          } else {
            resolve(false)
          }
        })
        .catch(err => {
          throw err
        })
    } catch (e) {
      reject(e)
    }
  })
}




const createTopic = async (AWS, topicName) => {
  return new Promise((resolve, reject) => {
    try {
      const createTopic = new AWS.SNS()
        .createTopic({
          Name: topicName,
        })
        .promise()
      createTopic
        .then(data => {
          console.log(`Created Topic - ${topicName}`)
          console.log("data", data)
          resolve(data.TopicArn)
          //   topicARN = data.TopicArn;
        })
        .catch(err => {
          throw err
        })
    } catch (e) {
      reject(e)
    }
  })
}

const publishToTopic = async () => {

  const sns = new AWS.SNS();
  const params = {
    Message: "Hello World",
    TopicArn: "arn:aws:sns:us-east-1:591061763922:User"
  };

  return new Promise((resolve, reject) => {
    sns.publish(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}


//////////////////////////////////

exports.PostData = async (req, res) => {
  let topicARN = ""

  const ifTopicExists = await checkIfTopicExists(AWS, "User")
  if (!ifTopicExists) {
    let topicARN = await createTopic(AWS, "User")
    topicARN = topicARN
    res.send(topicARN)
  } else {
    res.send(ifTopicExists)
  }
}

exports.PublishData = async (req, res) => {
  console.log('start');
  const ifTopicExists = await checkIfTopicExists(AWS, "User")
  console.log(ifTopicExists);
  if (!ifTopicExists) {
    await publishToTopic(

      // "arn:aws:sns:us-east-1:591061763922:UserDemo:8a6fd85a-cdbe-454d-9f52-82f20a2e332f",
      // "Hello World"
    )
  }
}

exports.SendNotification = async (req, res) => {

  const sns = new AWS.SNS();

  const params = {
    Message: 'This is a test message',
    TopicArn: 'arn:aws:sns:us-east-1:591061763922:User'
  };

  sns.publish(params, (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Failed to send notification');
    } else {
      console.log(data);
      res.send('Notification sent');
    }
  });
}

exports.Subscribe = async (req, res) => {
  const sns = new AWS.SNS();

  const email = req.body.email

  const params = {
    Protocol: 'Email',
    TopicArn: 'arn:aws:sns:us-east-1:591061763922:User',
    Endpoint: email
  };

  sns.subscribe(params, function (err, data) {
    if (err) {
      console.error(err, err.stack);
    } else {
      console.log(data);
      return res.status(200).json({
        message: "Subscription Successfully!!",
        result: data
      })
    }
  });
}
