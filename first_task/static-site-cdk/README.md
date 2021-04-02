# Static frontend using AWS CDK:

Launch a static frontend site using: 
- S3
- CloudFront
- Route53
- ACM

Cloudformation script can be found in `output.yml`

## Requeriments

- [node.js](https://nodejs.org/)
- [AWS CDK Toolkit](https://www.npmjs.com/package/aws-cdk)
- AWS account
- AWS Cli configured

## How to run it

- Run `cp  cdk.context-example.json cdk.context.json` and edit the account number
- Run `npm run build`
- Run `npm run synth`
- Run `cdk bootstrap aws://<AWS-account-number>/<AWS-region>` (Only the first time) (Example: `cdk bootstrap aws://000000000/us-east-1`)
- Run `npm run deploy`
