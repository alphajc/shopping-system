zip: stop
	zip -r assets/data.zip assets/data/*

unzip: assets/data.zip
	unzip assets/data.zip

start: unzip
	docker-compose up -d

stop:
	docker-compose down
