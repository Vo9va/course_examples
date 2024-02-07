node {
    properties([
        parameters([
            choice(choices: ['capitalix', 'tradeEU', 'nrdx', 'wc1'], description: 'Select Brand', name: 'BRAND'),
            choice(choices: ['dev', 'stage', 'prod'], description: 'Select Environment', name: 'ENVIRONMENT'),
            booleanParam(defaultValue: true, description: 'Run UI Tests', name: 'RUN_DESKTOP_TESTS'),
            booleanParam(defaultValue: true, description: 'Run Desktop Tests', name: 'RUN_MOBILE_TESTS'),
            booleanParam(defaultValue: true, description: 'Run Mobile Tests', name: 'RUN_APPLICATION_TESTS'),
            booleanParam(defaultValue: true, description: 'Run Backoffice Tests', name: 'RUN_BO_TESTS'),
            choice(choices: ['ui', 'api'], description: 'Select Environment', name: 'test'),
        ])
    ])
    stage('Install Node.js 20') {
         script {
             def nodeJSHome = tool 'nodeJS 20.10.0'
             env.PATH = "${nodeJSHome}/bin:${env.PATH}"
        }
    }

    stage('Checkout one project') {
        checkout scmGit(branches: [[name: '*/main']],
                                        userRemoteConfig: [
                                            [ url: 'https://github.com/Vo9va/course_examples.git' ]
                                        ])
        sh 'echo checkout main'
    }

    stage('Install Dependencies') {
        script {
            currentBuild.displayName = "${params.BRAND}"
            currentBuild.description = "BRAND=${params.BRAND}, ENV=${params.ENVIRONMENT}"
            sh "npm install"
        }
    }

    parallel(
        "Desktop Tests": {
            if (params.test == 'ui') {
                if (params.RUN_DESKTOP_TESTS.toBoolean()) {
                    stage('Run Desktop test') {
                        echo 'Run Desktop test'
                    }
                }
            }
        },
        "Web Mobile Tests": {
            if (params.test == 'ui') {
                if (params.RUN_MOBILE_TESTS.toBoolean()) {
                    stage('Run Web Mobile test') {
                        echo 'Run Web Mobile test'
                    }
                }
            }
        },
        "Application Tests": {
            if (params.test == 'ui') {
                if (params.RUN_APPLICATION_TESTS.toBoolean()) {
                    stage('Run Application test') {
                        echo 'Run Application test'
                    }
                }
            }
        },
        "BO Tests": {
            if (params.test == 'ui') {
                if (params.RUN_BO_TESTS.toBoolean()) {
                    stage('Run BO test') {
                        echo 'Run BO test'
                    }
                }
            }
        }
    )

    stage('Checkout one project') {
        checkout scmGit(branches: [[name: '*/main']],
                                        userRemoteConfig: [
                                            [ url: 'https://github.com/Vo9va/course_examples.git' ]
                                        ])
        sh 'echo checkout main'
    }

    stage('Install Dependencies') {
        script {
            currentBuild.displayName = "${params.BRAND}"
            currentBuild.description = "BRAND=${params.BRAND}, ENV=${params.ENVIRONMENT}"
            sh "npm install"
        }
    }

    parallel(
        "fo api": {
            if (params.test == 'api') {
                if (params.RUN_DESKTOP_TESTS.toBoolean()) {
                    stage('Run Desktop test') {
                        echo 'Run Desktop test'
                    }
                }
            }
        },
        "bo api": {
            if (params.test == 'api') {
                if (params.RUN_MOBILE_TESTS.toBoolean()) {
                    stage('Run Web Mobile test') {
                        echo 'Run Web Mobile test'
                    }
                }
            }
        }
    )
}
