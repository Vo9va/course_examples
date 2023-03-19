pipeline {
    agent any
    triggers { pollSCM('* * * * *') }
    stages {
        stage('Hello World') {
            steps {
                sh 'echo Hello World'
            }
        }
    }
}
