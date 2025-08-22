// const { createProxyMiddleware } = require('http-proxy-middleware');
const { defaultProvider } = require("@aws-sdk/credential-provider-node");
const { SignatureV4 } = require("@aws-sdk/signature-v4");
const { HttpRequest } = require("@smithy/protocol-http");
const { NodeHttpHandler } = require("@smithy/node-http-handler");
const { Sha256 } = require("@aws-crypto/sha256-js");
const bodyParser = require("body-parser");


// express Middleware 
module.exports = function (app) {
  // req.body is null if no this step
  app.use(bodyParser.json());

  app.use(async (req, res, next) => {
    console.log('req.path:', req.path);

    if (req.path.startsWith('/api/')) {
      console.log('go proxy');

      try {
        const region = "us-east-1";
        const lambdaUrl = "https://42afxcdgh6x25byknycrtbqiwe0nxjzf.lambda-url.us-east-1.on.aws";

        const credentials = await defaultProvider()();
        const signer = new SignatureV4({
          service: "lambda",
          region,
          credentials,
          sha256: Sha256,
        });

        const httpRequest = new HttpRequest({
          method: req.method,
          headers: req.headers,
          hostname: new URL(lambdaUrl).hostname,
          path: req.path,
          body: req.method !== "GET" ? JSON.stringify(req.body) : undefined,
        });
        httpRequest.headers["host"] = new URL(lambdaUrl).host

        const signedRequest = await signer.sign(httpRequest);
        console.log("signedRequest:")
        console.log(signedRequest)
        const { response } = await new NodeHttpHandler().handle(signedRequest);

        let responseBody = "";
        for await (const chunk of response.body) {
          responseBody += chunk;
        }

        console.log(
          "responseBody:" + responseBody
        )
        res.status(response.statusCode).send(responseBody);
      } catch (err) {
        console.error(err);
        res.status(500).send({ error: err.message });
      }
      return
    }
    next();
  });

  // app.use((err, req, res, next) => {
  //   console.error("error handle");
  //   console.error(err.stack);
  //   res.status(500).send('Something broke!');
  // });

};
