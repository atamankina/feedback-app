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
        DOCKER_CREDENTIALS_ID = 'dockerhub-token'
        DOCKER_REPO = 'galaataman/feedback-app'
        IMAGE_TAG = "${BUILD_NUMBER}"
        DOCKER_IMAGE = "${DOCKER_REPO}:${IMAGE_TAG}"
    }
    
    stages {        
        stage('Checkout') {           
            steps {
                echo 'Checking out code...'
                git url: "${GITHUB_REPO}", branch: 'refactoring'
            }            
        }       
        stage('Docker Build') {   
            steps {
                echo 'Building the Docker image...'
                container('docker') {
                    sh 'docker build -t $DOCKER_IMAGE .'
                }
                echo 'Docker build successful.'
            }    
        }
        stage('Docker Push') {
            steps {
                echo 'Pushing the Docker image to Docker Hub...'
                container('docker') {
                    script {
                        docker.withRegistry('', "${DOCKER_CREDENTIALS_ID}") {
                            sh 'docker push $DOCKER_IMAGE'
                        }
                    }  
                }
                echo 'Docker image pushed successfully.'
            }
        }
        stage('Kubernetes Deploy Dependencies') {
            steps {
                echo 'Deploying API dependencies to kubernetes cluster...'
                container('kubectl') {
                    sh 'kubectl apply -f kubernetes/secret.yaml'
                    sh 'kubectl apply -f kubernetes/configmap.yaml'
                    sh 'kubectl apply -f kubernetes/database-volume.yaml'
                    sh 'kubectl apply -f kubernetes/database-deployment.yaml'
                } 
                echo 'Deployment successful.'
            }
        }
        stage('Delete Previous Deployment') {
            steps {
                echo 'Deleting previous Kubernetes deployment...'
                container('kubectl') {
                    sh '''
                        kubectl delete deployment feedback-app-api || true  
                    '''
                } 
                echo 'Previous Kubernetes deployment deleted successfully.'
            }
        }

        stage('Create New Deployment') {
            steps {
                echo 'Creating new Kubernetes deployment...'
                container('kubectl') {
                    script {
                        sh '''
                            sed -i "s|image: galaataman/feedback-app:latest|image: $DOCKER_IMAGE|g" kubernetes/api-deployment.yaml
                        '''
                        sh '''
                            kubectl apply -f kubernetes/api-deployment.yaml
                            kubectl rollout status deployment feedback-app-api --timeout=300s
                        '''
                    }
                } 
                echo 'New Kubernetes deployment created successfully.'
            }
        }
        stage('Integration Tests') {
            steps {
                echo 'Running integration tests...'
                container('k6') {
                    sh 'k6 run --env BASE_URL=http://feedback-app-api-service:3000 --verbose ./tests/feedback-api.integration.js'
                }
                echo 'Integration tests ready.'
            }
        }
    }   
}