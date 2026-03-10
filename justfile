run-backend:
    cd mini-moodle-backend && cargo run

format-backend:
    cd mini-moodle-backend && cargo fmt

run-frontend:
    cd mini-moodle-frontend && bun run dev

format-frontend:
    cd mini-moodle-frontend && bun run format

lint-frontend:
    cd mini-moodle-frontend && bun run lint

zip:
    zip -r mini-moodle.zip . \
        -x "mini-moodle-frontend/node_modules/*" \
           "mini-moodle-frontend/dist/*" \
           "mini-moodle-backend/target/*" \
           ".git/*"
