<br/>
<div align="center">
	<img src="https://i.imgur.com/h7fjISK.png"/>
</div>
<br/>

# Timebomb Service

Web App: https://github.com/talham7391/timebomb-web

**Note:** this service was developed using:
* node (v12.13.0)
* npm (6.12.0)

# Deployment

### Setting up the VPS

1. Provision a VPS & SSH into it.
2. Run the following commands:
    1. `sudo apt update`
    2. `sudo apt install npm`
    3. `npm install -g n`
    4. `n lts`
    5. `n` (and follow the instructions to install node) 
    
At this point you might need source your bash (or re-SSH into the machine) to see the newly installed node & npm.

### Running the Service

1. `git clone https://github.com/talham7391/timebomb-service.git`
2. `cd timebomb-service`
3. `npm install`
4. `npm start`

At this point, you should be able to reach the service at whatever hostname routes to your VPS. *Be mindful of which port the service is listening on.*

# Local Dev

1. `git clone https://github.com/talham7391/timebomb-service.git`
2. `cd timebomb-service`
3. `npm install`
4. `npm start`

The service will be reachable at `http://localhost:XXXX`.
