#!groovy

pipeline {
    agent {
        label 'win-test'
    }

    stages {
        // pulls down locally the sources for the component
        stage('checkout') {
            steps {
                checkout scm
            }
        }

        // Install the bower dependencies of the component
        stage('install dependencies') {
            steps {
                script {
                    sh "bower --version || npm i -g bower"
                    sh "polymer --version || npm i -g polymer-cli"
                    sh "npm install -g https://github.com/marcelmeulemans/wct-junit-reporter.git"
                    sh "bower i --force-latest"
                }
            }
        }

        // Lints, and tests the component
        stage('test') {
            steps {
                script {
                    sh "polymer lint -i kwc-*"
                    sh "polymer test --local chrome"
                    junit allowEmptyResults: true, testResults: 'wct.xml'
                }
            }
        }

        stage('documentation') {
            steps {
                script {
                    if (env.BRANCH_NAME == 'master') {
                        build job: 'Kano/components-doc/master', parameters: [
                            text(name: 'repoUrl', value: 'https://github.com/KanoComponents/kwc-blockly'),
                            text(name: 'componentName', value: 'kwc-blockly')
                        ], wait: false
                    }
                }
            }
        }
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '20'))
    }
}