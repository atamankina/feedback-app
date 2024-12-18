aws ssm put-parameter --name "/feedback-app/backend/test/db-user" --value "postgres" --type "String"
aws ssm put-parameter --name "/feedback-app/backend/test/db-password" --value "password" --type "SecureString"
aws ssm put-parameter --name "/feedback-app/backend/test/db-name" --value "feedbackdb" --type "String"
aws ssm put-parameter --name "/feedback-app/backend/test/db-port" --value "5432" --type "String"
aws ssm put-parameter --name "/feedback-app/backend/test/vpc-id" --value "your-vpc-id" --type "String"
