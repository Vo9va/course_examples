pipeline {
    agent any
    parameters {
        gitParameter branchFilter: 'origin/(.*)',
         defaultValue: 'main',
         name: 'BRANCH',
         type: 'PT_BRANCH'
    }
    stages {

        stage ( 'Logging into AWS ECR') {
           steps {
               script {
               sh "aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 380922537039.dkr.ecr.us-east-1.amazonaws.com"
               }
            }
        }
        stage ('Read  what the branch') {
             steps {
                sh 'echo ${params.BRANCH}'
             }
        }

        stage ('Cloning Git') {
            steps {
                git branch: '${params.BRANCH}', url: 'https://github.com/Vo9va/course_examples.git'
            }
        }

        stage ( 'Pushing to ECR') {
            steps {
                script {
                        sh "docker tag jenkins-test-1:latest 380922537039.dkr.ecr.us-east-1.amazonaws.com/jenkins-test-1:latest"
                        sh "docker push 380922537039.dkr.ecr.us-east-1.amazonaws.com/jenkins-test-1:latest"
                   }
              }
        }

    }
}
