pipeline {
    agent any
    parameters {
               choice(choices: ['main', 'stage', 'dev'], description: 'select branch', name: 'BRANCH')
    }
    stages {

        stage ( 'Logging into AWS ECR') {
           steps {
               script {
               sh "aws ecr-public get-login-password --region us-east-1 | docker login --username AWS --password-stdin public.ecr.aws/b6a7j0a3"
               }
            }
        }
        stage ('Read  what the branch') {
             steps {
                sh '''echo $BRANCH'''
             }
        }

        stage ('Cloning Git') {
            steps {
                git branch: "${BRANCH}", url: "https://github.com/Vo9va/course_examples.git"
            }
        }

        stage ( 'Build your Docker image') {
            steps {
                script {
                         sh "docker build -t docker-app-ex-3 ."
                        }
                    }
        }

        stage ( 'Pushing to ECR') {
            steps {
                script {
                        sh "docker tag docker-app-ex-3:latest public.ecr.aws/b6a7j0a3/docker-app-ex-3:latest"
                        sh "docker push public.ecr.aws/b6a7j0a3/docker-app-ex-3:latest"
                   }
              }
        }

    }
}
