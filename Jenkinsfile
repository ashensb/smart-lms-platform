pipeline {
    agent any

    environment {
        // Your Docker Hub Username
        DOCKER_HUB_USER = 'ashensb'
        // Jenkins Credentials ID for Docker Hub (username/password)
        DOCKER_CREDENTIALS_ID = 'docker-hub-creds'
        
        // Image tag for each build (build-1, build-2...)
        IMAGE_TAG = "build-${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                // clone the repository from GitHub
                checkout scm
            }
        }

        stage('Docker Build') {
            steps {
                echo 'Building Docker Images on Windows...'
                // Windows bat and Docker build commands for frontend and backend
                bat "docker build -t %DOCKER_HUB_USER%/lms-frontend:%IMAGE_TAG% ./frontend"
                bat "docker build -t %DOCKER_HUB_USER%/lms-backend:%IMAGE_TAG% ./backend"
            }
        }

        stage('Docker Push') {
            steps {
                echo 'Pushing Images to Docker Hub...'
                // Credentials push docker hub
                withCredentials([usernamePassword(credentialsId: "${DOCKER_CREDENTIALS_ID}", passwordVariable: 'DOCKER_HUB_PASSWORD', usernameVariable: 'DOCKER_HUB_USERNAME')]) {
                    bat "echo %DOCKER_HUB_PASSWORD% | docker login -u %DOCKER_HUB_USERNAME% --password-stdin"
                    
                    bat "docker push %DOCKER_HUB_USER%/lms-frontend:%IMAGE_TAG%"
                    bat "docker push %DOCKER_HUB_USER%/lms-backend:%IMAGE_TAG%"
                }
            }
        }

        stage('Update K8s Manifests') {
            steps {
                echo 'Updating Kubernetes YAML files using PowerShell...'
                // windows PowerShell  YAML files updated
                powershell """
                    (Get-Content k8s/frontend-deployment.yaml) -replace 'image: ${DOCKER_HUB_USER}/lms-frontend:.*', 'image: ${DOCKER_HUB_USER}/lms-frontend:${IMAGE_TAG}' | Set-Content k8s/frontend-deployment.yaml
                    (Get-Content k8s/backend-deployment.yaml) -replace 'image: ${DOCKER_HUB_USER}/lms-backend:.*', 'image: ${DOCKER_HUB_USER}/lms-backend:${IMAGE_TAG}' | Set-Content k8s/backend-deployment.yaml
                """
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
               echo 'Deploying to Local Kubernetes Cluster...'
               bat 'kubectl apply -f k8s/ --kubeconfig="C:\\Users\\Ashen\\.kube\\config" --validate=false'
             }
        }
    }
}