import axios from 'axios';

// SRFC AWS
// var myHost = "https://srfc-app.online";
// var myAuth = "https://nbfc-users.auth.ap-south-1.amazoncognito.com";
// var myClientId = "50cfdunp3i5l6n695v078q8cbd";
// var mySecret = "12mbacpt67s8mhspmsr4g4ofa5rv8t13tmetv8drnbm1qotvmoqd";

// SRFC Rapyder
// var myHost = "https://srfc-app.com";
// var myAuth = "https://srfc-users.auth.ap-south-1.amazoncognito.com";
// var myClientId = "7uepg9cc924uv1cprlh93d5f5d";
// var mySecret = "fhr9cdalev86a1kacerd91avtmqpiotvnlvhlv12vmkdno072p3";

// IKF
// var myHost = "https://ikffinapp.in";
// var myAuth = "https://ikf-users.auth.ap-south-1.amazoncognito.com";
// var myClientId = "65ihtc3kn7fi976p3de6iu7dsj";
// var mySecret = "cjnhmlqqhe9gf1u9b6rqot94f45ikp9hq2mg5bru4e1ori42nv3";

// development
const myAuth =
  'https://jaguar-loan-development.auth.ap-south-1.amazoncognito.com';
const myClientId = 'a3eb8ogt9ibc88oej2d9n4vnp';
const myHost = 'http://localhost:4200';
const mySecret = 'e2hj0bentgtvjdggbgg1g9d9803cgrudsggag2g54lkic67fvq2';

const loginURL =
  myAuth +
  '/login?' +
  'client_id=' +
  myClientId +
  '&response_type=code&' +
  'scope=openid+profile+aws.cognito.signin.user.admin+email+phone&' +
  'redirect_uri=' +
  myHost +
  '/login';

const logoutURL =
  myAuth +
  '/logout?' +
  'client_id=' +
  myClientId +
  '&response_type=code&' +
  'redirect_uri=' +
  myHost +
  '/&state=STATE&' +
  'scope=openid+profile+aws.cognito.signin.user.admin+email+phone';

const awsValues = {
  loginURL,
  sso_api_username: myClientId,
  sso_api_pwd: mySecret,
  cognitoTokenURL: myAuth + '/oauth2/token',
  redirectURL: myHost + '/login',
  logoutURL,
};

export const getAwsConfig = () => awsValues;

export const getAuthTokenFromAws = async function (callbackCode: string) {
  /* TODO: fix the function to make a succesful post request */
  const formBody =
    'grant_type=authorization_code&code=' +
    encodeURIComponent(callbackCode) +
    '&' +
    encodeURIComponent('scope') +
    '=' +
    encodeURIComponent(
      'openid+profile+aws.cognito.signin.user.admin+email+phone'
    ) +
    '&' +
    encodeURIComponent('redirect_uri') +
    '=' +
    encodeURIComponent(getAwsConfig().redirectURL);

  const res = await axios.post(getAwsConfig().cognitoTokenURL, formBody, {
    responseType: 'json',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization:
        'Basic ' +
        btoa(
          getAwsConfig().sso_api_username + ':' + getAwsConfig().sso_api_pwd
        ),
    },
  });

  return res;
};

export const login = () => {
  window.location.assign(loginURL);
};
