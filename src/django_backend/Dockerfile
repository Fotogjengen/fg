FROM python:3.6.1

MAINTAINER Jama Noor (jamawadi@gmail.com)

# Fixed bug #83 failed to fetch binary package. TODO: Remove in the future

RUN echo "deb [check-valid-until=no] http://archive.debian.org/debian jessie main" > /etc/apt/sources.list.d/jessie-backports.list
# Fixed bug #83 failed to fetch binary package. TODO: Remove in the future
RUN sed -i '/deb http:\/\/deb.debian.org\/debian jessie-updates main/d' /etc/apt/sources.list
# Fixed bug #83 failed to fetch binary package. TODO: Remove in the future
RUN apt-get -o Acquire::Check-Valid-Until=false update

# Install swig
RUN apt-get update && apt-get install -y --no-install-recommends swig
RUN apt-get install -y --no-install-recommends libunbound-dev

# Copy files from actual computer to a folder named django
RUN mkdir /django
RUN rm -rf /django/itkacl-2.0
WORKDIR /django
COPY requirements.txt /django
RUN pip install -r requirements.txt

COPY itkacl.patch /django
RUN git clone http://git.sesse.net/itkacl itkacl-2.0
RUN patch -d /django/itkacl-2.0 -p1 < itkacl.patch
WORKDIR /django/itkacl-2.0/itkacl-2.1
RUN make
RUN make install
WORKDIR /django/itkacl-2.0/python-itkacl-2.0
RUN python setup.py install
RUN cp /django/itkacl-2.0/itkacl-2.1/itkacl.conf /etc/
WORKDIR /django


COPY . /django
