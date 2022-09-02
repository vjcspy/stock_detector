pipeline {
    agent any
    options {
        skipStagesAfterUnstable()
    }
    stages {
        stage('Clone repository') {
            steps {
                script {
                    checkout scm
                }
            }
        }

        stage('Build') {
            steps {
                script {
                    app = docker.build('ns')
                }
            }
        }
        stage('Test') {
            steps {
                echo 'Empty'
            }
        }
        stage('Deploy') {
            steps {
                script {
                    docker.withRegistry('https://196761233825.dkr.ecr.ap-southeast-1.amazonaws.com/ns', 'ecr:ap-southeast-1:ggg-aws-credentials') {
                        app.push("${env.BUILD_NUMBER}")
                        app.push('latest')
                    }
                }
            }
        }
    }
}
