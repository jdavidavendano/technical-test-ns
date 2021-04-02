from troposphere import Output, Ref, Template, GetAtt, Join, Output, Parameter
from troposphere.s3 import Bucket, PublicRead, WebsiteConfiguration
from troposphere.cloudfront import (
    DefaultCacheBehavior,
    Distribution,
    DistributionConfig,
    ForwardedValues,
    Origin,
    S3OriginConfig,
)
from troposphere.route53 import RecordSetType

t = Template()

t.set_description(
    "AWS CloudFormation Sample Template S3_Bucket: Sample template showing "
    "how to create a publicly accessible S3 bucket. "
    "**WARNING** This template creates an Amazon S3 Bucket. "
    "You will be billed for the AWS resources used if you create "
    "a stack from this template."
)

s3bucket = t.add_resource(
    Bucket(
        "S3Bucket",
        AccessControl=PublicRead,
        WebsiteConfiguration=WebsiteConfiguration(
            IndexDocument="index.html", ErrorDocument="error.html"
        ),
    )
)

myDistribution = t.add_resource(
    Distribution(
        "myDistribution",
        DistributionConfig=DistributionConfig(
            Origins=[
                Origin(
                    Id="Origin 1",
                    DomainName=GetAtt(s3bucket, "DomainName"),
                    S3OriginConfig=S3OriginConfig(),
                )
            ],
            DefaultCacheBehavior=DefaultCacheBehavior(
                TargetOriginId="Origin 1",
                ForwardedValues=ForwardedValues(QueryString=False),
                ViewerProtocolPolicy="allow-all",
            ),
            Enabled=True,
            HttpVersion="http2",
        ),
    )
)

t.add_output(
    [
        Output(
            "BucketName",
            Value=Ref(s3bucket),
            Description="Name of S3 bucket to hold website content",
        ),
        Output("DistributionId", Value=Ref(myDistribution)),
        Output(
            "DistributionName",
            Value=Join("", ["http://", GetAtt(myDistribution, "DomainName")]),
        ),
    ]
)

print(t.to_json())