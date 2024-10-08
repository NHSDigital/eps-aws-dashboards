FROM ubuntu:24.04

# Enable tracing in the build process
RUN set -x && apt-get update && \
    export DEBIAN_FRONTEND=noninteractive && \
    apt-get -y upgrade

# Install utilities and log installation
RUN apt-get -y install --no-install-recommends jq unzip wget ca-certificates make git curl && \
    echo "Installed required packages: jq, unzip, wget, ca-certificates, make, git, curl"

# Check installed versions for debugging
RUN jq --version
RUN aws --version
RUN git --version

# Create user and set up environment
RUN useradd -ms /bin/bash cdkuser
RUN chown -R cdkuser /home/cdkuser

# Set work directory and user
WORKDIR /home/cdkuser
USER cdkuser

# Install ASDF and Node.js
RUN git clone https://github.com/asdf-vm/asdf.git /home/cdkuser/.asdf --branch v0.14.1 && \
    echo '. /home/cdkuser/.asdf/asdf.sh' >> ~/.bashrc && \
    echo '. /home/cdkuser/.asdf/completions/asdf.bash' >> ~/.bashrc && \
    echo 'PATH="$PATH:/home/cdkuser/.asdf/bin/"' >> ~/.bashrc

ENV PATH="$PATH:/home/cdkuser/.asdf/bin/:/home/cdkuser/node_modules/.bin"

# Install ASDF plugins and Node.js for debugging
RUN asdf plugin add nodejs https://github.com/asdf-vm/asdf-nodejs.git && \
    asdf install && asdf reshim nodejs && \
    echo "Installed Node.js version via ASDF: $(node --version)"

# Debugging - list the contents of home directory
RUN ls -la /home/cdkuser/

# Copy project files and set permissions
COPY --chown=cdkuser packages /home/cdkuser/packages
COPY --chown=cdkuser Makefile /home/cdkuser/
COPY --chown=cdkuser node_modules /home/cdkuser/node_modules
COPY --chown=cdkuser package.json /home/cdkuser/
COPY --chown=cdkuser package-lock.json /home/cdkuser/
COPY --chown=cdkuser tsconfig.defaults.json /home/cdkuser/
COPY --chown=cdkuser docker/entrypoint.sh /home/cdkuser/

# Set the entrypoint to the debugged script
ENTRYPOINT ["/home/cdkuser/entrypoint.sh"]
