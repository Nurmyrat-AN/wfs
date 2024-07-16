const { default: axios } = require('axios');
const { google } = require('googleapis');
const nodemailer = require('nodemailer');



const OAuth2 = google.auth.OAuth2;
const CLIENT_ID = "997713996126-evqfidq2o27d0d5f2fei21ol27krvn76.apps.googleusercontent.com"
const CLIENT_SECRET = "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"
const REFRESH_TOKEN = "1//04sXe2Aegu4dhCgYIARAAGAQSNgF-L9Ir7fzkhKb3j5fLQ7s6Wf8_kMUlX9-iLde4ubU4ZMy7dSHsA1-ngZvJLDTvqXYvF88pKQ"

const oauth2Client = new OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
)

oauth2Client.setCredentials({
    refresh_token: REFRESH_TOKEN
})

const sendMessage = async () => {

    const accessToken = await new Promise((resolve, reject) => {
        oauth2Client.getAccessToken((err, token) => {
            if (err) {
                console.log(err)
                reject(`Failed to create access token :${err}`)
            }
            resolve(token)
        })
    })


    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: 'hidonicontrol@gmail.com',
            accessToken,
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            refreshToken: REFRESH_TOKEN
        }
    })


    const result = await transporter.sendMail({
        from: '"Node js" <hidonicontrol@gmail.com>',
        to: 'nurmyratnurmyrat457@gmail.com',
        subject: 'Message from Node js',
        text: 'This message was sent from Node js server.',
        html:
            'This <i>message</i> was sent from <strong>Node js</strong> server.',
    })
    return result
}

const start = () => {
    const interval = 3000
    axios.get('https://lift-api.vfsglobal.com/user/registration').then(data => {
        console.log('Success')
        sendMessage()
        setTimeout(start, interval)
    }).catch(e => {
        if (e.response.status !== 403) {
            sendMessage()
            console.log('Success')
        } else {
            console.log('Error')
        }
        setTimeout(start, interval)
    })
}

start()