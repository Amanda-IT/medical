const { createProxyMiddleware } = require("http-proxy-middleware");
const { defaultProvider } = require("@aws-sdk/credential-provider-node");
const { SignatureV4 } = require("@aws-sdk/signature-v4");
const { HttpRequest } = require("@smithy/protocol-http");
const { NodeHttpHandler } = require("@smithy/node-http-handler");
const { Sha256 } = require("@aws-crypto/sha256-js");
const bodyParser = require("body-parser");
const { PollyClient, SynthesizeSpeechCommand } = require("@aws-sdk/client-polly");


function authMiddleware(req, res, next) {

  const authHeader = req.headers["x-authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer token

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  // jwt.verify(token, SECRET_KEY, (err, user) => {
  //   if (err) {
  //     return res.status(403).json({ error: "Invalid or expired token" });
  //   }
  //   // 把解码后的用户信息挂到 req 上
  //   req.user = user;
  // });

  next();
}

// express Middleware 
module.exports = function (app) {
  app.use(async (req, res, next) => {
    console.log('req.path:', req.path);
    next();
  })

  // // 注意, socket 授权比http麻烦, 这里未添加授权.
  // app.use('/socket.io', createProxyMiddleware({
  //   target: "ws://localhost:3003", // WebSocket 服务地址
  //   changeOrigin: true,
  //   pathRewrite: (path, req) => {
  //     if (path == "/ws") {
  //       return path;
  //     } else
  //       return "/socket.io" + path;
  //   }, // 不修改路径
  //   ws: true, // 👈 必须加上
  //   logLevel: "debug",
  // }))

  // req.body is null if no this step
  app.use(bodyParser.json());

  app.use(async (req, res, next) => {

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


  app.get('/speak', authMiddleware, async (req, res) => {
    const text = req.query.text
    const pollyClient = new PollyClient({});

    const synthesizeSpeechCommand = new SynthesizeSpeechCommand({
      Engine: "neural",
      Text: text,
      VoiceId: "Ruth",
      OutputFormat: "mp3",
    });

    const { AudioStream } = await pollyClient.send(synthesizeSpeechCommand);
    const audioBuffer = Buffer.from(await AudioStream.transformToByteArray());

    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Length": audioBuffer.length,
    });

    res.send(audioBuffer);
  })


  // app.use((err, req, res, next) => {
  //   console.error("error handle");
  //   console.error(err.stack);
  //   res.status(500).send('Something broke!');
  // });

};
