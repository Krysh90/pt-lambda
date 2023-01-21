# pt-lambda
A lambda to read token information about an address on defichain

## AWS permissions
### Crawler

Actions
- s3:PutObject to write a file
- s3:PutObjectAcl to set public access

Resource:
- your bucket arn & bucket arn wildcard (/*)

#### Manager

Actions
- s3:ListBucket to list bucket information
- s3:GetObject to read a file

Resource:
- your bucket arn & bucket arn wildcard (/*)

### Bucket

for crawler:
Principal:
- your lambda crawler execution role

Actions
- s3:PutObject to write a file
- s3:PutObjectAcl to set public access

Resource:
- your bucket arn & bucket arn wildcard (/*)

for manager:
Principal:
- your lambda manager execution role

Actions
- s3:ListBucket to list bucket information
- s3:GetObject to read a file

Resource:
- your bucket arn & bucket arn wildcard (/*)