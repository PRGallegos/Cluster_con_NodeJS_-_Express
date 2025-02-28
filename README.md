# Despliegue de una Aplicación en Clúster con Node.js y Express

## Introducción
Este proyecto tiene como objetivo desplegar una aplicación en clúster con Node.js y Express en un entorno virtualizado usando Vagrant y VirtualBox. Se explorarán tanto la implementación básica de la aplicación como su optimización mediante clústeres y la gestión con PM2.

## Requisitos Previos
Para ejecutar esta práctica correctamente, es necesario contar con:
- **Windows con PowerShell** o **Linux/macOS con terminal**
- **[VirtualBox](https://www.virtualbox.org/)**
- **[Vagrant](https://www.vagrantup.com/)**
- **[Chocolatey](https://chocolatey.org/) (para usuarios de Windows, opcional pero recomendado)**
- **Node.js y npm**

## Instalación del Entorno
### 1. Instalar Vagrant y VirtualBox
Para usuarios de Windows con Chocolatey:
```
choco install virtualbox vagrant -y
```
Para usuarios de Linux/macOS:
```
sudo apt update && sudo apt install virtualbox vagrant -y
```

### 2. Crear el Directorio del Proyecto
```
mkdir node-cluster; cd node-cluster
```

### 3. Inicializar Vagrant y Configurar la Máquina Virtual
```
vagrant init ubuntu/jammy64
```
Editar el `Vagrantfile` y agregar:
```
Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/jammy64"
  config.vm.network "private_network", type: "dhcp"
  config.vm.provision "shell", inline: <<-SHELL
    apt-get update
    apt-get install -y nodejs npm
    npm install -g pm2 loadtest express
  SHELL
end
```

### 4. Levantar la Máquina Virtual
```
vagrant up
```

### 5. Acceder a la Máquina Virtual
```
vagrant ssh
```

## Desarrollo de la Aplicación

### 1. Crear la Aplicación Sin Clúster
Crear el archivo `server.js`:
```
const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
```
Ejecutar la aplicación:
```
node server.js
```

### 2. Implementar Clúster en la Aplicación
Modificar `server.js` para usar múltiples procesos:
```
const cluster = require("cluster");
const os = require("os");
const express = require("express");
const port = 3000;

if (cluster.isMaster) {
  const totalCPUs = os.cpus().length;
  for (let i = 0; i < totalCPUs; i++) {
    cluster.fork();
  }
} else {
  const app = express();
  app.get("/", (req, res) => {
    res.send("Hello from worker " + process.pid);
  });
  app.listen(port, () => {
    console.log(`Worker ${process.pid} running on port ${port}`);
  });
}
```

Ejecutar:
```
node server.js
```

## Medición de Rendimiento con LoadTest
Ejecutar pruebas de carga:
```
loadtest http://localhost:3000/ -n 1000 -c 100
```

## Gestión con PM2
### 1. Instalar PM2
```
npm install pm2 -g
```

### 2. Ejecutar la Aplicación con PM2
```
pm2 start server.js -i 0
```

### 3. Comandos Útiles de PM2
```
pm2 restart server
pm2 stop server
pm2 delete server
pm2 ls
pm2 logs
pm2 monit
```

## Conclusiones
El uso de clúster en Node.js mejora el rendimiento al distribuir la carga de trabajo en múltiples procesos. PM2 facilita la gestión de estos procesos, asegurando estabilidad y escalabilidad en entornos de producción.

## Autor
Pedro - DAW2 - DEAW - Servidores de Aplicaciones



