###
# vert.x docker example using a Java verticle packaged as a fatjar
# To build:
#  docker build -t sample/vertx-java-fat .
# To run:
#   docker run -t -i -p 8080:8080 sample/vertx-java-fat
###

FROM java:8-jre

ENV VERTICLE_FILE js-vertx-fatjar-0.1.0-fat.jar
ENV CONFIG_JSON_FILE vertx-config.json

# Set the location of the verticles
ENV VERTICLE_HOME /usr/verticles

EXPOSE 8080
EXPOSE 8081
EXPOSE 8086

# Copy your fat jar to the container
COPY build/libs/$VERTICLE_FILE $VERTICLE_HOME/
COPY $CONFIG_JSON_FILE $VERTICLE_HOME/

# Launch the verticle
WORKDIR $VERTICLE_HOME
ENTRYPOINT ["sh", "-c"]
CMD ["exec java -jar $VERTICLE_FILE -conf $CONFIG_JSON_FILE"]