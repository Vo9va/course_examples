pipeline {
    agent any
    parameters {
               choice(choices: ['main', 'stage', 'dev'], description: 'select branch', name: 'BRANCH')
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
                         sh "docker build -t jenkins-test-1 ."
                        }
                    }
        }

        stage ( 'Pushing to ECR') {
            steps {
                script {
                        sh "docker tag jenkins-test-1:latest 380922537039.dkr.ecr.us-east-1.amazonaws.com/jenkins-test-1:latest"
                        sh "docker push 380922537039.dkr.ecr.us-east-1.amazonaws.com/jenkins-test-1:latest"
                        sh "docker run -d 380922537039.dkr.ecr.us-east-1.amazonaws.com/jenkins-test-1"
                   }
              }
        }

        stage ( 'docker run') {
                    steps {
                        script {
                                sh "docker run -p 49160:8080 -d 380922537039.dkr.ecr.us-east-1.amazonaws.com/jenkins-test-1"
                           }
                      }
                }

    }
}
