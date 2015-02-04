# Express Socket PI

## Unplug-in the power of PI first when changing circuit!!!

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
- Now get the start template from Github.
```
git clone git@github.com:haochuan/Express-Socket-PI.git
```
- Now go to the directory of the start template, and install all node modules which would take a long time. The password for using sudo is as same as the login password from ssh.
```
cd Express-Socket-PI
sudo npm install
```
- When the installation completed, you can now run the server
```
node server.js
```
- Now open `10.0.1.13:8000` in your favorite browser and to see if you can use the webpage to control the brightness of the lights.

- If you want to stop the server, press `ctrl + c`.

### Some useful bash command:
`ls `: list files and directories

`cd`: change directory

`mkdir`: create a new directory

`cp`: copy files or directories

`mv`: move (rename) files or directories

`rm `: remove files or directories

For more information, [google](https://www.google.com/search?client=safari&rls=en&q=basic+terminal+commands+os+x&ie=UTF-8&oe=UTF-8#rls=en&q=basic+terminal+commands+os+x) or see [how-to-use-basic-unix-commands-to-work-in-terminal](http://www.dummies.com/how-to/content/how-to-use-basic-unix-commands-to-work-in-terminal.html)

### How to edit code on your computer and then put your local code to PI
- Suppose that you would like to put the code in your Desktop, open terminal. IF you have any isuess to get the code from Github, go through [how to add ssh key on your computer](https://help.github.com/articles/generating-ssh-keys/) then have a try again.
```
cd ~/Desktop
git clone git@github.com:haochuan/Express-Socket-PI.git
```
- When you finish editing, use scp to copy your code into PI
``` 
cd ~/Desktop
scp -r Express-Socket-PI pi@10.0.1.13:~/projects/.
```
- Now log into PI, you can find your code in `~/projects/Express-Socket-PI`

### Note on how to use socket.io to write/read data between webpage and node server
The most important files are `./server.js` and `./public/js/script.js`. These two files are well documented, go and read through those.

##### For front end:
```js
$('#red').on('change.fndtn.slider', function(){
    socket.emit('red', { val: $('#red').attr('data-slider') });
});
```
When the slider with id `red` changes, use `socket.emit` to emit the data (second parameter) to the `red` event (first parameter). The data being sent is a javascript object (for example suppose the val of the slider (`$('#red').attr('data-slider')`) is 100 here:
```js
{var: 100}
```
##### For back end:
```js
socket.on('red', function (data) {
    console.log(data.val);
    piblaster.setPwm(22, Number(data.val) / 100);
});
```
Let socket listen to event `red`. When front end sends a data to event `red`, the callback funcion will excute. So the data in the callback function should be `{var: 100}`. And `data.val` should be `100`.

The function below is what we use to write data into a specific pin in PI. The first parameter is the pin number on PI, and the second is the value you want to write, which should be from `0` to `1`.
```js
piblaster.setPwm(pin_number, value);
```
