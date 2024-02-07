node {
    properties([
        parameters([
            choice(choices: ['capitalix', 'tradeEU', 'nrdx', 'wc1'], description: 'Select Brand', name: 'BRAND'),
            choice(choices: ['dev', 'stage', 'prod'], description: 'Select Environment', name: 'ENVIRONMENT'),
        ])
    ])

    stage('Install Node.js 20') {
        script {
            def nodeJSHome = tool 'nodeJS 20.10.0'
            env.PATH = "${nodeJSHome}/bin:${env.PATH}"
        }
    }

    stage('Checkout') {
        checkout scmGit(branches: [[name: '*/main']],
                                           userRemoteConfig: [
                                               [ url: 'https://github.com/Vo9va/course_examples.git' ]
                                           ])
                           sh 'echo checkout main'
    }

    stage('Install Dependencies') {
        parallel (
             stage('Test On Windows') {
             sh 'echo checkout main'
             }
             stage('Test On Linux') {
              sh 'echo checkout main'
             }
        )
    }
    stage('Install Dependencies1') {
      script {
                  if (params.BRAND == Capitalix) {
                      sh 'echo checkout main'
                  }
                  else {
                  throw exc
                  }
              }
}

