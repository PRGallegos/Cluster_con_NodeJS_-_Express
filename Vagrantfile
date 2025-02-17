# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  # The most common configuration options are documented and commented below.
  config.vm.box = "ubuntu/lunar64"
  config.vm.network "private_network", type: "dhcp"

  config.vm.provision "shell", inline: <<-SHELL
    apt-get update
    apt-get install -y nodejs npm
    npm install -g pm2 loadtest
  SHELL
end