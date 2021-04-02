import cdk = require("@aws-cdk/core")
import { StaticSiteStack } from "./stacks/s3-cloudfront-route53-acm"

const app = new cdk.App()
const staticSite = new StaticSiteStack(app, "technicaltest-nodesource", {
  env: {
    account: app.node.tryGetContext("account"),
    region: app.node.tryGetContext("region"),
  },
  domainName:  app.node.tryGetContext("domainName"),
  siteSubDomain: app.node.tryGetContext("siteSubDomain"),
})

cdk.Tags.of(staticSite).add("Project", "technicaltest-nodesource")

app.synth()