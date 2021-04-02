import { Stack, App, StackProps } from "@aws-cdk/core"
import ec2 = require("@aws-cdk/aws-ec2")
import route53 = require("@aws-cdk/aws-route53")
import s3 = require("@aws-cdk/aws-s3")
import acm = require("@aws-cdk/aws-certificatemanager")
import cloudfront = require("@aws-cdk/aws-cloudfront")
import s3deploy = require("@aws-cdk/aws-s3-deployment")
import cdk = require("@aws-cdk/core")
import targets = require("@aws-cdk/aws-route53-targets/lib")

export interface StaticSiteProps extends StackProps {
  domainName: string
  siteSubDomain: string
}

/*

  Launch a static frontend site using: 
    - S3
    - CloudFront
    - Route53
    - ACM

*/

export class StaticSiteStack extends Stack {
  constructor(parent: App, name: string, props: StaticSiteProps) { 
    super(parent, name, props) 

		const vpc = new ec2.Vpc(this, "vpc") 

		const zone = new route53.PrivateHostedZone(this, "HostedZone", { 
			zoneName: "technicaltest.com", 
			vpc 
		}) 
		
    const siteDomain = props.siteSubDomain + "." + props.domainName
    new cdk.CfnOutput(this, "Site", { value: "https://" + siteDomain })

    // S3 bucket
    const siteBucket = new s3.Bucket(this, "SiteBucket", {
      bucketName: siteDomain,
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "error.html",
      publicReadAccess: true,

      removalPolicy: cdk.RemovalPolicy.DESTROY, // Just because this is not production
    })
    new cdk.CfnOutput(this, "Bucket", { value: siteBucket.bucketName })

    // ACM 
    const certificateArn = new acm.DnsValidatedCertificate(
      this,
      "SiteCertificate",
      {
        domainName: siteDomain, 
        hostedZone: zone, 
        region: "us-east-1", 
      }
    ).certificateArn
    new cdk.CfnOutput(this, "Certificate", { value: certificateArn })

    // CloudFront distribution   
    const distribution = new cloudfront.CloudFrontWebDistribution( 
      this, 
      "SiteDistribution", 
      { 
        aliasConfiguration: { 
          acmCertRef: certificateArn, 
          names: [siteDomain], 
          sslMethod: cloudfront.SSLMethod.SNI, 
          securityPolicy: cloudfront.SecurityPolicyProtocol.TLS_V1_1_2016,
        },
        originConfigs: [
          {
            customOriginSource: {
              domainName: siteBucket.bucketWebsiteDomainName,
                originProtocolPolicy: cloudfront.OriginProtocolPolicy.HTTP_ONLY,
            },
            behaviors: [{ isDefaultBehavior: true }],
          },
        ],
      }
    ) 

    new cdk.CfnOutput(this, "DistributionId", {
      value: distribution.distributionId,
    })

    // Route53 alias for CloudFront 
    new route53.ARecord(this, "SiteAliasRecord", {
      recordName: siteDomain,
      target: route53.RecordTarget.fromAlias(
        new targets.CloudFrontTarget(distribution)
      ),
      zone,
    })

    // Deploy site to S3 bucket 
    new s3deploy.BucketDeployment(this, "DeployWithInvalidation", {
      sources: [s3deploy.Source.asset("./site")],
      destinationBucket: siteBucket,
      distribution,
      distributionPaths: ["/*"],
    })
  }
}