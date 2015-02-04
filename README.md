# Express Socket PI

This is the start template for using raspberry pi as a node server, which can let user use the webpage as a interface to communicate with server via socket.io.

### How to run the sample server
- Power on raspberry PI
- After about 20 seconds, open the terminal in you computer, connect to pi using `ssh`, the user name is `pi` and the ip address should be `10.0.1.13`. The password is `qwe`.
```
    ssh pi@10.0.1.13
```
- Once you logged into PI, go to directory `~/projects`
```
    cd ~/projects
```
- Now get the start template from Github. If you are asked to enter the password for ssh, just enter `raspberrypi`.
```
    git clone 
```
- Now go to the directory of the start template, and install all node modules. The password for using sudo is as same as the login password from ssh.
```
    cd 
    sudo npm install
```
- When the installation completed, you can now run the server
```
    node server.js
```
- Now open `10.0.1.13` in your favorite browser and to see if you can use the webpage to control the brightness of the lights.