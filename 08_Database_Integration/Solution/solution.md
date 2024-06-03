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
