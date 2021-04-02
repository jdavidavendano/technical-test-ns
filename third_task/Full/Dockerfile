FROM ubuntu:20.04

RUN apt-get update 
RUN apt-get install -y python3 python3-pip g++ make git

RUN git clone https://github.com/nodejs/node.git
WORKDIR node/
RUN chmod +x ./configure
RUN ./configure
RUN make -j4
RUN make install
RUN make test-only

CMD [ "node", "--version" ]