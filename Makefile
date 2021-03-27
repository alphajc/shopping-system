zip:
	zip -r assets/data.zip assets/data/*

unzip: assets/data.zip
	unzip assets/data.zip

start: unzip
	docker-compose up -d