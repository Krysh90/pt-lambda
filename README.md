# pt-lambda
A set of lambdas to read token information about an address on defichain.
The logic is split between two lambdas
1. manager
2. crawler

### Manager
Will load all relevant ocean information like dex prices, pool pairs and so on. Then it will check your bucket for all stored addresses.
For each address the crawler will be called with all ocean information

### Crawler
Is being called by the manager with all relevant ocean information and will read given address' tokens, loans and will store this information in your bucket.

## AWS permissions
#### Manager

Actions
- s3:ListBucket to list bucket information
- s3:GetObject to read a file

Resource:
- your bucket arn & bucket arn wildcard (/*)
### Crawler

Actions
- s3:PutObject to write a file
- s3:PutObjectAcl to set public access

Resource:
- your bucket arn & bucket arn wildcard (/*)


### Bucket
for manager:
Principal:
- your lambda manager execution role

Actions
- s3:ListBucket to list bucket information
- s3:GetObject to read a file

Resource:
- your bucket arn & bucket arn wildcard (/*)

for crawler:
Principal:
- your lambda crawler execution role

Actions
- s3:PutObject to write a file
- s3:PutObjectAcl to set public access

Resource:
- your bucket arn & bucket arn wildcard (/*)
