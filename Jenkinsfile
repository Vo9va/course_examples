node('node20') {
  container('node') {
    properties([
      parameters([
        choice(choices: ['capitalix', 'nrdx', 'tradeEU', 'wc1'], description: 'Select Brand', name: 'BRAND'),
        choice(choices: ['prod', 'stage', 'dev'], description: 'Select Environment', name: 'ENVIRONMENT'),
      ]),
      pipelineTriggers([
        parameterizedCron('''
        0 19 * * * %BRAND=capitalix;ENVIRONMENT=dev
        30 1 * * * %BRAND=capitalix;ENVIRONMENT=stage
        30 0 * * * %BRAND=capitalix;ENVIRONMENT=prod
        45 22 * * * %BRAND=nrdx;ENVIRONMENT=dev
        15 23 * * * %BRAND=nrdx;ENVIRONMENT=stage
        30 5 * * * %BRAND=nrdx;ENVIRONMENT=prod
        30 3 * * * %BRAND=tradeEU;ENVIRONMENT=dev
        0 3 * * * %BRAND=tradeEU;ENVIRONMENT=stage
        0 5 * * * %BRAND=tradeEU;ENVIRONMENT=prod
        0 23 * * * %BRAND=wc1;ENVIRONMENT=dev
        45 23 * * * %BRAND=wc1;ENVIRONMENT=stage
        45 5 * * * %BRAND=wc1;ENVIRONMENT=prod
        ''')
      ])
    ])

    stage('Checking out from Git for API') {
      script {
        currentBuild.displayName = "${params.BRAND}.${params.ENVIRONMENT}"
        echo 'Checking out from Git for UI'
        git credentialsId: '04fc2ee0-511a-483a-be53-529a2f64d326', url: 'git@github.com:BlackrockM/ng-backend-e2e.git', branch: 'master'
      }
    }
    stage('Building dependencies for API') {
      script {
        echo 'Building dependencies for API'
      }
    }
    stage('Run FO Api test by cron') {
      script {
        echo 'Run Desktop tests ${params.BRAND}.${params.ENVIRONMENT}'
      }
    }
  }
}
