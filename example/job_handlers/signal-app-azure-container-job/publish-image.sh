#build and publish the calculate signal example Docker image
# Note: you need access to the docker repo datamodelingtool.azurecr.io to be able to push the image.
# (write "docker login datamodelingtool.azurecr.io" and supply username and password)

docker build -t datamodelingtool.azurecr.io/dmt-job/generate-signal .
docker push datamodelingtool.azurecr.io/dmt-job/generate-signal
