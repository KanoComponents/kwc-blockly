#!groovy

pipeline {
    agent {
        label 'ubuntu_18.04'
    }
    stages {
        // pulls down locally the sources for the component
        stage('checkout') {
            steps {
                checkout scm
            }
        }
        stage('tools') {
            steps {
                script {
                    def NODE_PATH = tool name: 'Node 8.11.2', type: 'nodejs'
                    env.PATH = "${env.PATH}:${NODE_PATH}/bin"
                    def YARN_PATH = tool name: 'yarn', type: 'com.cloudbees.jenkins.plugins.customtools.CustomTool'
                    env.PATH = "${env.PATH}:${YARN_PATH}/bin"
                }
            }
        }
        // Install the bower dependencies of the component
        stage('install dependencies') {
            steps {
                script {
                    sh "yarn"
                }
            }
        }
        // Lints, the component
        stage('checkstyle') {
            steps {
                script {
                    sh "yarn checkstyle-ci || exit 0"
                    step([$class: 'CheckStylePublisher', pattern: 'eslint.xml'])
                }
            }
        }
    }
    options {
        buildDiscarder(logRotator(numToKeepStr: '20'))
    }
}
