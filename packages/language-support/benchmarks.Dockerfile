FROM node:20
WORKDIR /usr/src/app

# Copy the local 'benchmark.js' file to the container's working directory
COPY dist/benchmark/benchmark.js .

RUN mkdir /results
RUN touch /results/measurement.csv
RUN npm i benchmark

# Run the benchmark.js file when spinning up the Docker container
CMD [ "node", "benchmark.js" ]