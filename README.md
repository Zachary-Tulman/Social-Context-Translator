1. activate `venv`
2. run `pip install -r requirements.txt`
3. ensure `.env` is set up properly
4. (optional) add data to `data/` with the format specified in `data/README.md`
5. run `python scripts/ingest_db.py`.
6. start backend with `uvicorn app.api:api --reload`
7. in the `frontend/` directory, start frontend with `npm run start`
8. connect to `localhost:4173` for preview
