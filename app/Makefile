.PHONY: setup up d b ps app db nuke

setup:
	@make up
	@make ps
d:
	docker compose down
up:
	docker compose up -d
ps:
	docker compose ps
app:
	docker compose exec app bash
db:
	docker compose exec db bash
nuke:
	docker system prune --volumes