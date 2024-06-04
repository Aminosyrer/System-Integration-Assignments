check_status() {
  if [ $? -ne 0 ]; then
    echo "Error: $1"
    exit 1
  fi
}

echo "Starting Docker containers..."
docker-compose up -d
check_status "Failed to start Docker containers"

echo "Waiting for the databases to initialize..."
sleep 10

echo "Exporting data from source database..."
docker exec source-postgres sh -c 'exec pg_dump -U sourceuser sourcedb > /tmp/dump.sql'
check_status "Failed to export data from source database"

local_dump_path="./dump.sql"
if [ -f "$local_dump_path" ]; then
  rm "$local_dump_path"
fi

echo "Copying dump file to local machine..."
docker cp source-postgres:/tmp/dump.sql "$local_dump_path"
check_status "Failed to copy dump file to local machine"

echo "Importing data into target database..."
docker cp "$local_dump_path" target-postgres:/tmp/dump.sql
check_status "Failed to copy dump file to target container"

docker exec -it target-postgres psql -U targetuser -d targetdb -f /tmp/dump.sql
check_status "Failed to import data into target database"

echo "Verifying data in the target database..."
docker exec -it target-postgres psql -U targetuser -d targetdb -c "SELECT * FROM employees;"
check_status "Failed to verify data in target database"

echo "Migration completed successfully."
