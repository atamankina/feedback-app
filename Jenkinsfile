pipeline {
    agent {
        kubernetes {
            label 'jenkins-docker-agent'
            yamlFile 'kubernetes_jenkins/jenkins-pod-template.yaml'
        }
    }

    triggers {
        pollSCM('H/2 * * * *')
    }
    
    environment {
        GITHUB_REPO = 'https://github.com/atamankina/feedback-app.git'
        DOCKER_IMAGE = 'galaataman/feedback-app:refactoring'
        DOCKER_CREDENTIALS_ID = 'dockerhub-token'
    }
    
    stages {        
        stage('Checkout') {           
            steps {
                git url: "${GITHUB_REPO}", branch: 'refactoring'
            }            
        }       
        stage('Docker Build') {   
            steps {
                echo 'Building the app...'
                container('docker') {
                    sh 'docker build -t $DOCKER_IMAGE .'
                }
                echo 'Build successful.'
            }    
        }
        stage('Docker Push') {
            steps {
                echo 'Pushing the image to Docker Hub...'
                container('docker') {
                    script {
                        docker.withRegistry('', "${DOCKER_CREDENTIALS_ID}") {
                            sh 'docker push $DOCKER_IMAGE'
                        }
                    }  
                }
                echo 'Push successful.'
            }
        }
        stage('Kubernetes Deploy Dependencies') {
            steps {
                echo 'Deploying to kubernetes cluster...'
                container('kubectl') {
                    sh 'kubectl apply -f kubernetes/secret.yaml'
                    sh 'kubectl apply -f kubernetes/configmap.yaml'
                    sh 'kubectl apply -f kubernetes/database-volume.yaml'
                    sh 'kubectl apply -f kubernetes/database-deployment.yaml'
                } 
                echo 'Deployment successful.'
            }
        }
        stage('Kubernetes Deploy API') {
            steps {
                echo 'Deploying to kubernetes cluster...'
                container('kubectl') {
                    sh 'kubectl apply -f kubernetes/api-deployment.yaml'
                    sh 'kubectl rollout status deployment feedback-app-api --timeout=120s'
                } 
                echo 'Deployment successful.'
            }
        }
        stage('Restart Kubernetes Pods') {
            steps {
                echo 'Restarting Kubernetes pods to pull the new image...'
                container('kubectl') {
                    sh 'kubectl rollout restart deployment feedback-app-api'
                }
                echo 'Pods restarted successfully.'
            }
        }
        stage('Integration Tests') {
            steps {
                echo 'Running integration tests...'
                container('k6') {
                    script {
                        // Run the K6 tests and capture the exit code
                        def k6Result = sh(script: 'k6 run --env BASE_URL=http://feedback-app-api-service:3000 --verbose ./tests/feedback-api.integration.js', returnStatus: true)
                        
                        // If the exit code is non-zero, fail the stage
                        if (k6Result != 0) {
                            error("Integration tests failed. Check the summary for failed results.")
                        }
                    }
                }
                echo 'Integration tests completed.'
            }
        }
    }   
}