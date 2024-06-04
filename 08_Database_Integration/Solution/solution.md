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
