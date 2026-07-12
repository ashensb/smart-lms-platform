# LMS Smart Pipeline 🚀

This project implements an automated CI/CD pipeline using Jenkins, Docker, and Kubernetes (Docker Desktop).

## 🛠️ Tech Stack & Tools
* **CI/CD Automation:** Jenkins (Pipeline)
* **Containerization:** Docker
* **Orchestration:** Kubernetes (K8s)
* **Source Control:** GitHub

---

## 📋 Pipeline Stages

The pipeline consists of 5 main stages:
1. **Checkout:** Clones the latest source code from the GitHub repository.
2. **Docker Build:** Builds a Docker image using the project source code.
3. **Docker Push:** Pushes the generated Docker image to the Docker Hub/Registry.
4. **Update K8s Manifests:** Updates the Kubernetes manifest files with the latest build configurations.
5. **Deploy to Kubernetes:** Deploys the application to the local Kubernetes (Docker Desktop) cluster.

---

## ⚙️ Prerequisites & Configurations (Windows Environment)

To successfully run this pipeline on a Windows machine, the following configurations must be set up:

### 1. Enable Kubernetes in Docker Desktop
* Open Docker Desktop, go to **Settings** -> **Kubernetes**.
* Check the **Enable Kubernetes** option and click `Apply & restart`.

### 2. Jenkins Kubeconfig Setup (Crucial)
Since Jenkins runs as a Windows background service (Local System User), it cannot automatically access the `.kube/config` file belonging to your standard Windows user account. 

To resolve this authentication issue, you must explicitly pass the local kubeconfig path inside the **Deploy to Kubernetes** stage of your `Jenkinsfile`:

```groovy
stage('Deploy to Kubernetes') {
    steps {
        echo 'Deploying to Local Kubernetes Cluster...'
        bat 'kubectl apply -f k8s/ --kubeconfig="C:\\Users\\Ashen\\.kube\\config" --validate=false'
    }
}

How to Run
Ensure both Docker Desktop and the Kubernetes cluster are active and running.

Go to your Jenkins Dashboard and click Build Now.

Once the build finishes successfully, verify the deployment status using kubectl get pods or kubectl get services in your command prompt.