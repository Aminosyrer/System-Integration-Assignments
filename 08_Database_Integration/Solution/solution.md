# 08a

Database: Postgres
Documentation tool: SchemaSpy

Steps to set up:
```
docker-compose up -d
```

Ensure that the database is running
```
docker ps
```

In a powershell terminal, run:
```
docker run --rm -v ${PWD}/output:/output schemaspy/schemaspy:latest -t pgsql -host host.docker.internal -port 5432 -db testdb -u testuser -p testpassword -s public
```

You can now open index.html in the output folder using whatever means such as the Live Server vscode extension.

# 08b

1. Start the Docker containers:

    `docker-compose up -d`

2. Verify that they are running:

    `docker ps`

3. *If you want to check that the source database is populated:

    `docker exec -it source-postgres psql -U sourceuser -d sourcedb`

4. ** In the Postgres shell:

    `SELECT * FROM employees;`, should return the table

5. *If you want to check that the target database isn't populated:

    `docker exec -it target-postgres psql -U targetuser -d targetdb`

6. **In the Postgres shell:

    `SELECT * FROM employees;`, should return an error

7. Export the data from the source database:

    `docker exec -t source-postgres pg_dump -U sourceuser -d sourcedb -f /dump.sql`

8. Copy the dump file to your local machine:

    `docker cp source-postgres:/dump.sql ./dump.sql`

9. Import the dump into the target database:

    `docker cp ./dump.sql target-postgres:/dump.sql`

    `docker exec -it target-postgres psql -U targetuser -d targetdb -f /dump.sql`

10. Verify the target database using steps 5. and 6.

# 08c

1. Create the project and navigate to it

```
mkdir my-auth0-app
cd my-auth0-app
```

2. Initialize a Node.js project

```
npm init -y
```

3. Install the required packages

```
npm install express express-session express-openid-connect dotenv
```

4. Set `http://localhost:3000` under "Allowed Callback URL" & "Allowed Logout URLs" in your Auth0 project settings


5. Create a .env file in the root of the project and add your Auth0 credentials:

```
AUTH0_CLIENT_ID=your-auth0-client-id
AUTH0_CLIENT_SECRET=your-auth0-client-secret
AUTH0_DOMAIN=your-auth0-domain
SESSION_SECRET=a-random-secret
```
Replace your-auth0-client-id, your-auth0-client-secret, and your-auth0-domain with your actual Auth0 application credentials.

6. Set up Express and Auth0 using the instructions from your Auth0 Quick start tab

```js
const { auth } = require('express-openid-connect');

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: 'a long, randomly-generated string stored in env',
  baseURL: 'http://localhost:3000',
  clientID: 'lIhm9vumutlBfWQok7NoRziEwswRIo6q',
  issuerBaseURL: 'https://dev-k0jr05nllam3bhdb.us.auth0.com'
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});
```

7. Run the project

```
node .\app.js
```

